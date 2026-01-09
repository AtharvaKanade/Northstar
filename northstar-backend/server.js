require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ UPDATED: Using the "Lite" model from your list for better rate limits
const MODEL_NAME = "gemini-2.0-flash-lite-001"; 
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

// 🧠 THE CACHE: Saves results so we don't ask AI twice for the same job
const roadmapCache = {}; 

app.post('/api/generate-roadmap', async (req, res) => {
  const { role } = req.body;
  
  // Safety check
  if (!role) return res.status(400).json({ error: "Role is required" });

  const cleanRole = role.toLowerCase().trim();

  console.log(`\n🔵 Request received for: ${role}`);

  // 1. CHECK CACHE FIRST (Instant & Free)
  if (roadmapCache[cleanRole]) {
    console.log("⚡ Serving from CACHE (No API cost)");
    return res.json(roadmapCache[cleanRole]);
  }

  // 2. IF NOT IN CACHE, ASK AI
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      attempts++;
      console.log(`   Attempt ${attempts}/${maxAttempts} with ${MODEL_NAME}...`);

      const prompt = `
        You are a career expert. Create a detailed learning roadmap for a user wanting to become a "${role}".
        CRITICAL: Return ONLY valid JSON. No markdown.
        
        Schema:
        {
          "career": "${role}",
          "summary": "Short summary.",
          "steps": [
            {
              "id": 1,
              "title": "Topic",
              "description": "Details.",
              "type": "learn",
              "duration": "2 hours",
              "resources": ["A specific google search query for this topic"] 
            }
          ]
        }
        Generate 5 steps. Use "type": "build" for at least 2 steps.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      // Cleanup JSON
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const jsonData = JSON.parse(text);

      // 💾 SAVE TO CACHE
      roadmapCache[cleanRole] = jsonData;
      console.log("🟢 Success! Cached and sent.");
      
      return res.json(jsonData);

    } catch (error) {
      console.warn(`⚠️ Attempt ${attempts} failed:`, error.message);
      
      // If we hit a rate limit, wait 2 seconds and try again
      if (error.message.includes("429")) {
        console.log("⏳ Hit rate limit. Waiting 2 seconds...");
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      if (attempts === maxAttempts) {
        console.error("🔴 All attempts failed.");
        return res.status(500).json({ 
          error: "Service busy", 
          details: "Try again in 30 seconds." 
        });
      }
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});