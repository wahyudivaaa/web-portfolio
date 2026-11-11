// api/chat/index.js
// Server-side chat proxy for the portfolio AI assistant (Redesign v16).
// API keys live ONLY in Vercel environment variables and never reach the
// browser (the old /api/config endpoint handed the Gemini key to anyone).
// Provider chain (all free tiers, zero cost):
//   1. Groq        — qwen/qwen3.8-27b → openai/gpt-oss-120b → openai/gpt-oss-20b
//   2. Cloudflare  — Workers AI @cf/qwen/qwen3-30b-a3b-fp8
//   3. Gemini      — legacy key, last resort
// Env vars: GROQ_API_KEY, CF_API_TOKEN, CF_ACCOUNT_ID, GEMINI_API_KEY,
//           GEMINI_MODEL (optional)

const SYSTEM_PROMPT = `Kamu adalah AI Assistant di website portfolio Wahyu Diva. Kamu punya dua mode:

MODE PORTFOLIO (prioritas): pertanyaan tentang Wahyu, portfolio, proyek, keahlian, pengalaman, pendidikan, atau kontak.
MODE UMUM: pertanyaan teknologi, programming, sains, dan topik umum lainnya — jawab akurat dan praktis.

ATURAN:
1. Gunakan Bahasa Indonesia yang baik, kecuali pengunjung menulis dalam bahasa Inggris — sesuaikan dengan bahasa pengunjung.
2. Jawaban lengkap tapi ringkas (umumnya 2-6 kalimat; lebih panjang hanya bila pertanyaannya memang kompleks, misalnya meminta contoh kode atau perbandingan).
3. Kamu BOLEH memakai format Markdown: **tebal**, *miring*, daftar, tabel, blok kode dengan bahasa pemrogramannya, dan rumus LaTeX bila relevan. Jawabanmu dirender sebagai Markdown di website.
4. Jangan pakai emoji. Nada profesional dan ramah.
5. Jika tidak tahu, akui dengan jujur dan sarankan alternatif.

DATA PROFIL (terbaru):
Nama: I Putu Wahyu Diva Kumuda (Wahyu Diva)
Profesi: Full Stack Developer di Sanata System (full-time, hybrid, Bali) sejak Mei 2022 — pengalaman 4+ tahun
Lokasi: Bali, Indonesia
Email: wahyudiva2004@gmail.com
GitHub: github.com/wahyudivaaa — LinkedIn: linkedin.com/in/wahyudiva
Status: Open to collaborations
Ringkasan: 50+ proyek selesai. Mendesain database, membangun backend, dan mengirim antarmuka responsif end to end.

KEAHLIAN:
- Advanced: HTML/CSS, JavaScript, PHP, Git & GitHub
- Intermediate: MySQL, Microsoft SQL Server
- Basic: React, Node.js, Python

PENDIDIKAN:
- Primakara University — S1 Teknik Informatika (Sep 2022 – Jul 2026)
- SMK Negeri 1 Denpasar — Rekayasa Perangkat Lunak (Jul 2019 – Jun 2022)

PROYEK UNGGULAN:
1. FlashPlay — platform streaming trailer film (TMDB API, YouTube player; HTML5/CSS3, Vanilla JavaScript, Node.js)
2. FlashBot — chatbot AI interaktif (Vue.js, Cohere AI, OpenWeatherMap)
3. Website portfolio ini — desain Liquid Glass, AI assistant (kamu), animasi responsif`;

const LIMITS = { maxMessages: 12, maxCharsEach: 4000, maxCharsTotal: 24000 };

function fetchWithTimeout(url, options, ms) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms || 20000);
  return fetch(url, { ...options, signal: ctrl.signal }).finally(() => clearTimeout(t));
}

function stripThink(text) {
  if (!text) return "";
  return text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
}

async function callOpenAICompat(baseUrl, apiKey, model, messages) {
  const res = await fetchWithTimeout(baseUrl + "/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1100,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${body.slice(0, 160)}`);
  }
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty completion");
  return stripThink(text);
}

async function callGemini(apiKey, model, messages) {
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const res = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1100,
          candidateCount: 1,
        },
      }),
    }
  );
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${body.slice(0, 160)}`);
  }
  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const text = parts.map((p) => p.text || "").join("");
  if (!text) throw new Error("Empty Gemini response");
  return stripThink(text);
}

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = null; }
  }
  const incoming = body && Array.isArray(body.messages) ? body.messages : null;
  if (!incoming || incoming.length === 0) {
    return res.status(400).json({ error: "messages required" });
  }

  const clean = [];
  let total = 0;
  for (const m of incoming.slice(-LIMITS.maxMessages)) {
    if (!m || typeof m.content !== "string") continue;
    const role = m.role === "assistant" ? "assistant" : "user";
    const content = m.content.slice(0, LIMITS.maxCharsEach);
    total += content.length;
    if (total > LIMITS.maxCharsTotal) break;
    clean.push({ role, content });
  }
  if (clean.length === 0 || clean[clean.length - 1].role !== "user") {
    return res.status(400).json({ error: "last message must be from user" });
  }

  const messages = [{ role: "system", content: SYSTEM_PROMPT }, ...clean];
  const attempts = [];
  const errors = [];

  // 1) Groq rotation (same key, per-model free quotas stack)
  if (process.env.GROQ_API_KEY) {
    for (const model of ["qwen/qwen3.8-27b", "openai/gpt-oss-120b", "openai/gpt-oss-20b"]) {
      attempts.push(`groq:${model}`);
      try {
        const reply = await callOpenAICompat(
          "https://api.groq.com/openai/v1",
          process.env.GROQ_API_KEY,
          model,
          messages
        );
        return res.status(200).json({ reply, provider: `groq:${model}` });
      } catch (e) {
        errors.push(`groq:${model} -> ${e.message}`);
      }
    }
  }

  // 2) Cloudflare Workers AI
  if (process.env.CF_API_TOKEN && process.env.CF_ACCOUNT_ID) {
    const model = "@cf/qwen/qwen3-30b-a3b-fp8";
    attempts.push(`cloudflare:${model}`);
    try {
      const reply = await callOpenAICompat(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/ai/v1`,
        process.env.CF_API_TOKEN,
        model,
        messages
      );
      return res.status(200).json({ reply, provider: `cloudflare:${model}` });
    } catch (e) {
      errors.push(`cloudflare -> ${e.message}`);
    }
  }

  // 3) Gemini (legacy key, last resort)
  if (process.env.GEMINI_API_KEY) {
    const model = process.env.GEMINI_MODEL || "gemini-flash-latest";
    attempts.push(`gemini:${model}`);
    try {
      const reply = await callGemini(process.env.GEMINI_API_KEY, model, clean);
      return res.status(200).json({ reply, provider: `gemini:${model}` });
    } catch (e) {
      errors.push(`gemini -> ${e.message}`);
    }
  }

  console.error("All chat providers failed:", errors.join(" | ") || "no provider configured");
  return res.status(502).json({
    error: "Semua provider AI sedang tidak tersedia. Coba lagi sebentar lagi.",
    attempts,
  });
};
