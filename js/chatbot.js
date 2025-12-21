class Chatbot {
  constructor() {
    this.toggle = document.querySelector(".chatbot-toggle");
    this.container = document.querySelector(".chatbot-container");
    this.closeBtn = document.querySelector(".close-chat");
    this.input = document.querySelector("#chatInput");
    this.sendBtn = document.querySelector(".send-message");
    this.messagesContainer = document.querySelector(".chatbot-messages");

    this.initEventListeners();
    this.apiEndpoint =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    this.apiKey = "";
    this.initApiKey();

    this.systemPrompt = `Kamu adalah AI Assistant Cerdas yang menggunakan Gemini 2.5 Flash Preview dengan kemampuan adaptive thinking. Kamu memiliki dua mode operasi:

        🎯 MODE 1 - PORTFOLIO SPECIALIST (Prioritas Utama):
        Ketika ditanya tentang Wahyu Diva, portfolio, proyek, atau hal terkait web development:
        - Berikan informasi lengkap dan detail tentang Wahyu Diva
        - Fokus pada keahlian, pengalaman, dan proyek-proyeknya
        - Gunakan data profil yang tersedia dengan analisis mendalam

        🧠 MODE 2 - GENERAL AI ASSISTANT (Mode Cerdas):
        Untuk pertanyaan umum tentang teknologi, programming, sains, pendidikan, atau topik lainnya:
        - Berikan jawaban yang akurat dan informatif
        - Jelaskan konsep dengan bahasa yang mudah dipahami
        - Berikan contoh praktis dan relevan
        - Gunakan kemampuan adaptive thinking untuk analisis mendalam

        ATURAN UNIVERSAL:
        1. SELALU gunakan Bahasa Indonesia yang baik dan benar
        2. Berikan jawaban yang LENGKAP dan TIDAK TERPOTONG
        3. Sesuaikan gaya bahasa dengan konteks pertanyaan
        4. Jika tidak yakin, akui keterbatasan dan berikan saran alternatif
        5. Gunakan emoji yang relevan untuk membuat respons lebih menarik
        6. Prioritaskan akurasi dan kegunaan informasi

        DATA PROFIL:
        Nama: I Putu Wahyu Diva Kumuda (Wahyu/Yudip)
        Status: Mahasiswa Teknik Informatika & Junior Fullstack Dev
        Lahir: 15 Juni 2004
        Pengalaman: 2+ tahun, 50+ proyek, 30+ klien puas

        KEAHLIAN:
        Frontend:
        - HTML/CSS (90%)
        - JavaScript (85%)
        - React (45%)

        Backend:
        - Node.js (50%)
        - PHP (80%)

        Database & Tools:
        - MySQL (75%)
        - SQL Server (60%)
        - Git & GitHub (85%)

        PROYEK UNGGULAN:
        1. FlashPlay
           - Platform streaming trailer film
           - Teknologi: TMDB API, YouTube player

        2. FlashBot
           - Chatbot AI pintar
           - Teknologi: Vue.js, Cohere AI, Weather API

        3. Portfolio Website
           - Desain cyberpunk modern
           - Fitur: Animasi responsif

        CARA MENJAWAB:
        1. Untuk pertanyaan tentang WAHYU:
           - Gunakan data profil di atas
           - Fokus pada informasi yang ditanya
           - Berikan jawaban yang lengkap dalam 2-3 kalimat
           - Hindari jawaban yang terlalu panjang

        2. Untuk pertanyaan TEKNOLOGI:
           - Jelaskan dengan bahasa sederhana
           - Berikan contoh yang mudah dipahami
           - Kaitkan dengan pengalaman Wahyu jika relevan
           - Pastikan penjelasan tuntas dalam 2-3 kalimat

        CONTOH RESPONS DUAL-MODE:

        📋 MODE PORTFOLIO:
        T: "Apa keahlian utama Wahyu?"
        J: "🚀 Wahyu memiliki keahlian utama di bidang frontend dengan penguasaan HTML/CSS 90% dan JavaScript 85%. Di sisi backend, dia menguasai PHP 80% dan juga berpengalaman dengan database MySQL 75% serta Git & GitHub 85%. Kombinasi skill ini membuatnya menjadi fullstack developer yang kompeten!"

        🧠 MODE GENERAL AI:
        T: "Apa itu machine learning?"
        J: "🤖 Machine Learning adalah cabang dari AI yang memungkinkan komputer belajar dan membuat keputusan dari data tanpa diprogram secara eksplisit. Contohnya seperti sistem rekomendasi Netflix yang belajar dari kebiasaan menonton Anda, atau filter spam email yang semakin pintar mengenali email berbahaya. Teknologi ini bekerja dengan menganalisis pola dalam data besar untuk membuat prediksi atau klasifikasi."

        T: "Bagaimana cara kerja internet?"
        J: "🌐 Internet bekerja seperti sistem pos global yang sangat cepat! Data dipecah menjadi 'paket-paket' kecil, dikirim melalui berbagai jalur (router), lalu disatukan kembali di tujuan. Protokol TCP/IP mengatur aturan pengiriman ini, sementara DNS bertindak seperti buku telepon yang menerjemahkan nama website (google.com) menjadi alamat IP numerik yang dipahami komputer."

        KNOWLEDGE AREAS (Mode General AI):
        - 💻 Teknologi & Programming
        - 🔬 Sains & Matematika
        - 📚 Pendidikan & Pembelajaran
        - 🏢 Bisnis & Karir
        - 🎨 Kreativitas & Desain
        - 🌍 Umum & Lifestyle
        - 🔧 Problem Solving

        SMART DETECTION:
        - Deteksi otomatis apakah pertanyaan tentang Wahyu/portfolio atau topik umum
        - Sesuaikan depth jawaban dengan kompleksitas pertanyaan
        - Berikan follow-up suggestions yang relevan`;

    this.conversationHistory = [];

    // Add context detection keywords
    this.portfolioKeywords = [
      "wahyu",
      "diva",
      "portfolio",
      "proyek",
      "project",
      "keahlian",
      "skill",
      "pengalaman",
      "experience",
      "flashplay",
      "flashbot",
      "web developer",
      "fullstack",
      "frontend",
      "backend",
      "html",
      "css",
      "javascript",
      "php",
      "mysql",
      "github",
      "teknik informatika",
      "mahasiswa",
    ];
  }

  initEventListeners() {
    this.toggle.addEventListener("click", () => this.toggleChat());
    this.closeBtn.addEventListener("click", () => this.toggleChat());
    this.sendBtn.addEventListener("click", () => this.sendMessage());
    this.input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.sendMessage();
      }
    });

    this.addMessage(
      "🤖 Halo! Saya AI Assistant Cerdas untuk portfolio Wahyu Diva. Saya bisa membantu dengan:\n\n📋 Informasi tentang Wahyu Diva (portfolio, proyek, keahlian)\n🧠 Pertanyaan umum (teknologi, programming, sains, dll)\n💡 Problem solving dan pembelajaran\n\nSilakan tanyakan apa saja! 😊",
      "bot"
    );
  }

  async initApiKey() {
    try {
      const response = await fetch("/api/config");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.apiKey = data.GEMINI_API_KEY;
      if (!this.apiKey) {
        console.warn("API key is empty");
      } else {
        console.log("API key loaded successfully");
      }
    } catch (error) {
      console.error("Failed to load API key:", error);
    }
  }

  toggleChat() {
    this.container.classList.toggle("active");
  }

  // Smart context detection method
  detectContext(message) {
    const lowerMessage = message.toLowerCase();
    const isPortfolioRelated = this.portfolioKeywords.some((keyword) =>
      lowerMessage.includes(keyword)
    );

    return {
      isPortfolioRelated,
      mode: isPortfolioRelated ? "portfolio" : "general",
      confidence: this.calculateConfidence(lowerMessage),
    };
  }

  calculateConfidence(message) {
    const matchedKeywords = this.portfolioKeywords.filter((keyword) =>
      message.includes(keyword)
    );
    return matchedKeywords.length / this.portfolioKeywords.length;
  }

  addMessage(text, type) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", `${type}-message`);
    messageDiv.textContent = text;
    this.messagesContainer.appendChild(messageDiv);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    return messageDiv;
  }

  addTypingIndicator() {
    const indicator = document.createElement("div");
    indicator.classList.add("typing-indicator");
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement("span");
      indicator.appendChild(dot);
    }
    this.messagesContainer.appendChild(indicator);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    return indicator;
  }

  async sendMessage() {
    const message = this.input.value.trim();
    if (!message) return;

    this.addMessage(message, "user");
    this.input.value = "";
    const typingIndicator = this.addTypingIndicator();

    try {
      if (!this.apiKey) {
        const context = this.detectContext(message);
        let defaultResponses;

        if (context.isPortfolioRelated) {
          defaultResponses = [
            "🚀 Wahyu Diva adalah web developer dengan keahlian di HTML, CSS, JavaScript dan framework modern.",
            "📂 Lihat proyek-proyek Wahyu di bagian Projects di atas untuk melihat FlashPlay dan FlashBot.",
            "💻 Wahyu spesialis dalam UI/UX dan pengembangan web full-stack dengan pengalaman 2+ tahun.",
            "🎯 Portfolio ini menampilkan kemampuan Wahyu dalam web development dan 50+ proyek yang telah diselesaikan.",
          ];
        } else {
          defaultResponses = [
            "🤖 Maaf, saya memerlukan koneksi API untuk menjawab pertanyaan umum. Silakan coba lagi nanti!",
            "💡 Untuk pertanyaan teknis yang kompleks, saya perlu akses ke knowledge base. Coba tanyakan tentang Wahyu Diva sementara ini!",
            "🔧 Sistem AI sedang dalam mode terbatas. Silakan tanyakan tentang portfolio atau proyek Wahyu Diva.",
          ];
        }

        const randomResponse =
          defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        setTimeout(() => {
          this.messagesContainer.removeChild(typingIndicator);
          this.addMessage(randomResponse, "bot");
        }, 1000);
        return;
      }

      this.conversationHistory.push({ role: "user", content: message });
      const response = await this.getAIResponse(message);
      this.messagesContainer.removeChild(typingIndicator);
      this.addMessage(response, "bot");
      this.conversationHistory.push({ role: "assistant", content: response });

      if (this.conversationHistory.length > 6) {
        this.conversationHistory = this.conversationHistory.slice(-6);
      }
    } catch (error) {
      this.messagesContainer.removeChild(typingIndicator);
      this.addMessage("Maaf, terjadi kesalahan. Silakan coba lagi.", "bot");
      console.error("Error:", error);
    }
  }

  async getAIResponse(message) {
    try {
      // Detect context and mode
      const context = this.detectContext(message);

      const conversationContext = this.conversationHistory
        .slice(-3) // Increase context window for better understanding
        .map(
          (msg) =>
            `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
        )
        .join("\n");

      // Create context-aware prompt
      const modeInstruction = context.isPortfolioRelated
        ? `\n🎯 AKTIFKAN MODE PORTFOLIO: Fokus pada informasi Wahyu Diva dan web development.`
        : `\n🧠 AKTIFKAN MODE GENERAL AI: Berikan jawaban cerdas dan informatif untuk pertanyaan umum.`;

      const fullPrompt = `${
        this.systemPrompt
      }${modeInstruction}\n\nRiwayat Percakapan:\n${conversationContext}\n\nUser: ${message}\n\nCATATAN: Deteksi konteks menunjukkan mode ${
        context.mode
      } dengan confidence ${(context.confidence * 100).toFixed(1)}%.`;

      const response = await fetch(`${this.apiEndpoint}?key=${this.apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: fullPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: context.isPortfolioRelated ? 0.7 : 0.9, // Lower temp for portfolio, higher for creative general answers
            topP: 0.85,
            topK: 60,
            maxOutputTokens: context.isPortfolioRelated ? 600 : 1000, // More tokens for complex general questions
            responseMimeType: "text/plain",
            candidateCount: 1,
            stopSequences: ["User:", "Assistant:"], // Prevent continuation
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `API request failed: ${response.status} - ${
            errorData.error?.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();

      // Handle Gemini 2.5 Flash Preview response format
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text.trim();
      } else if (data.error) {
        throw new Error(`Gemini API Error: ${data.error.message}`);
      } else {
        throw new Error("Unexpected response format from Gemini API");
      }
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Chatbot();
});
