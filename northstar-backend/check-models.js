require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  try {
    // This asks Google: "What models can I use?"
    // Note: We are ignoring the 'model' parameter here intentionally
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.models) {
      console.log("\n✅ AVAILABLE MODELS FOR YOU:");
      data.models.forEach(m => {
        // We only care about models that can 'generateContent'
        if (m.supportedGenerationMethods.includes("generateContent")) {
          console.log(` - ${m.name.replace('models/', '')}`);
        }
      });
    } else {
      console.error("❌ No models found. Error:", data);
    }

  } catch (error) {
    console.error("Connection failed:", error);
  }
}

listModels();