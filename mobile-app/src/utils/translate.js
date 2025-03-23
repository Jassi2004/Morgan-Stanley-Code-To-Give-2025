import axios from "axios";

const TRANSLATION_API_URL = "http://172.20.10.2:5000/translate"; // Free API URL

export const fetchTranslation = async (text, targetLang) => {
  try {
    // If target language is English, assume source is Hindi
    // If target language is Hindi, assume source is English
    const sourceLang = targetLang === "en" ? "hi" : "en";

    console.log("Text:", text, "Source Language:", sourceLang, "Target Language:", targetLang);
    
    // Don't translate if source and target languages are the same
    if (sourceLang === targetLang) {
      return text;
    }

    const response = await axios.post(TRANSLATION_API_URL, {
      q: text,
      source: sourceLang, // Dynamic source language
      target: targetLang,
      format: "text",
    });

    return response.data.translatedText || text;
  } catch (error) {
    console.error("Translation API error:", error);
    return text; // Return original text if API fails
  }
};
