import { GoogleGenerativeAI } from "@google/generative-ai";

console.log('API KEY:', import.meta.env.VITE_API_KEY);


const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateContent = async (prompt) => {
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    return result.response.text; // return the response
}