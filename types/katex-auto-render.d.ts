// Ambient declaration for the KaTeX auto-render subpath (the @types/katex
// package does not cover it under "bundler" module resolution). This file
// intentionally has no imports/exports so the declaration is ambient.
declare module "katex/dist/contrib/auto-render" {
  export interface Delimiter {
    left: string;
    right: string;
    display: boolean;
  }

  export interface RenderMathInElementOptions {
    delimiters?: Delimiter[];
    ignoredTags?: string[];
    ignoredClasses?: string[];
    errorCallback?: (msg: string, err: Error) => void;
    preProcess?: (math: string) => string;
    throwOnError?: boolean;
    strict?: boolean | string;
    trust?: boolean;
  }

  function renderMathInElement(
    elem: HTMLElement,
    options?: RenderMathInElementOptions
  ): void;

  export default renderMathInElement;
}
