// Translates an array of strings in ONE API call
export const translateTexts = async (texts: string[], targetLang: string): Promise<string[]> => {
  if (!texts || texts.length === 0) return texts;
  if (targetLang === "EN") return texts;

  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts, targetLang })
    });

    const data = await response.json();

    if (!data.translatedTexts) return texts;
    return data.translatedTexts;

  } catch (error) {
    console.error("Translation failed", error);
    return texts; // fall back to original if it fails
  }
};