import React, { createContext, useState, useContext, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { translateTexts } from "../utils/translate";

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const getTextNodes = (node: Node): Text[] => {
  const textNodes: Text[] = [];
  const skipTags = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT"]);

  const walk = (n: Node) => {
    if (n.nodeType === Node.TEXT_NODE) {
      if (n.textContent && n.textContent.trim().length > 0) {
        textNodes.push(n as Text);
      }
    } else if (n.nodeType === Node.ELEMENT_NODE) {
      if (!skipTags.has((n as Element).tagName)) {
        n.childNodes.forEach(walk);
      }
    }
  };

  walk(node);
  return textNodes;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState("EN");
  const [isTranslating, setIsTranslating] = useState(false);
  const [originalTexts] = useState<Map<Text, string>>(new Map());
  const location = useLocation();

  const setLanguage = useCallback(async (lang: string) => {
    setLanguageState(lang);
    setIsTranslating(true);

    try {
      const textNodes = getTextNodes(document.body);

      if (lang === "EN") {
        // Restore all original English text
        textNodes.forEach((node) => {
          const original = originalTexts.get(node);
          if (original) node.textContent = original;
        });
        originalTexts.clear();

      } else {
        // Save originals for any new nodes we haven't seen before
        textNodes.forEach((node) => {
          if (!originalTexts.has(node)) {
            originalTexts.set(node, node.textContent!);
          }
        });

        // Collect all original texts into one array — ONE API call
        const originals = textNodes.map(node => originalTexts.get(node)!);
        const translated = await translateTexts(originals, lang);

        // Apply translated text back to each node
        // Only update if translation succeeded (not undefined/empty)
        textNodes.forEach((node, i) => {
          if (translated[i]) {
            node.textContent = translated[i];
          }
        });
      }

    } catch (err) {
      console.error("Page translation error:", err);
    } finally {
      setIsTranslating(false);
    }
  }, [originalTexts]);

  // Re-translate when navigating to a new page
  useEffect(() => {
    if (language !== "EN") {
      const timer = setTimeout(() => {
        setLanguage(language);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};