import loadKatex from "./loadKatex.mjs?raw";
import "./style.css";

export default defineContentScript({
  matches: ["*://www.acmicpc.net/*"],
  runAt: "document_start",
  main() {
    const name = "solved-dark";
    import(`~/assets/styles/${name}.css`).then(() => {
      document.documentElement.setAttribute("data-theme", "solved-dark");
    });

    const katexStyle = document.createElement("link");
    Object.assign(katexStyle, {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css",
      crossorigin: "anonymous",
    });
    const katexScript = document.createElement("script");
    Object.assign(katexScript, {
      type: "module",
      innerHTML: loadKatex,
    });

    const scriptObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (
            node instanceof Element &&
            node.getAttribute("src")?.includes("mathjax")
          ) {
            node.remove();
          }
        }
      }
    });
    scriptObserver.observe(document, {
      subtree: true,
      childList: true,
    });
    document.addEventListener("DOMContentLoaded", () => {
      scriptObserver.disconnect();
      document.head.appendChild(katexStyle);
      document.body.appendChild(katexScript);
    });
  },
});
