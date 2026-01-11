require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require("openai"); // Switched to OpenAI SDK

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ CONFIG: Setup OpenAI client pointing to OpenRouter
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5000", // Optional: Your site URL
    "X-Title": "Northstar Roadmap Generator", // Optional: Your App Name
  }
});

const MODEL_NAME = "xiaomi/mimo-v2-flash:free"; // The free model you like

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

      const completion = await openai.chat.completions.create({
        model: MODEL_NAME,
        messages: [
          {
            role: "system",
            content: `You are a career expert. Create a detailed learning roadmap for a user wanting to become a "${role}".
            CRITICAL: Return ONLY valid JSON. No markdown formatting (no \`\`\`json).
            
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
            Generate 5 steps. Use "type": "build" for at least 2 steps.`
          },
          {
            role: "user",
            content: `Create a roadmap for: ${role}`
          }
        ]
      });

      let text = completion.choices[0].message.content;

      // Cleanup JSON (Sometimes AI adds markdown even when told not to)
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      let jsonData;
      try {
        jsonData = JSON.parse(text);
      } catch (parseError) {
        throw new Error("AI returned invalid JSON: " + text.substring(0, 50) + "...");
      }

      // 💾 SAVE TO CACHE
      roadmapCache[cleanRole] = jsonData;
      console.log("🟢 Success! Cached and sent.");
      
      return res.json(jsonData);

    } catch (error) {
      console.warn(`⚠️ Attempt ${attempts} failed:`, error.message);
      
      // If we hit a rate limit or server error, wait 2 seconds
      if (attempts < maxAttempts) {
        console.log("⏳ Waiting 2 seconds before retry...");
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.error("🔴 All attempts failed.");
        return res.status(500).json({ 
          error: "Service busy", 
          details: "Could not generate roadmap. Please try again." 
        });
      }
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});