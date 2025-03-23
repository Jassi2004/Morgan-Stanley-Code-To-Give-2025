import axios from "axios";

const TRANSLATION_API_URL = "http://172.20.10.2:5000/translate"; // Free API URL

export const fetchTranslation = async (text, targetLang) => {
  try {
    console.log("Text:", text, "Target Language:", targetLang);
    const response = await axios.post(TRANSLATION_API_URL, {
      q: text, // The text to translate
      source: "en", // Source language (English)
      target: targetLang, // Target language ("hi" for Hindi, "en" for English)
      format: "text",
    });

    return response.data.translatedText; // Return translated text
  } catch (error) {
    console.error("Translation API error:", error);
    return text; // Return original text if API fails
  }
};
