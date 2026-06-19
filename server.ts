import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API router for Geospatial AI Assistant
  app.post("/api/copilot", async (req, res) => {
    try {
      const { message, chatHistory } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.status(200).json({ 
          text: "Hi! I am Mohammad Kashif's **Geospatial AI Copilot**. \n\n*Note: Note that the Gemini API key is currently not fully configured in your Secrets panel. I am running in Offline Demonstration Mode to provide spatial storytelling insights!* \n\nTo configure my live intelligence, please enter your `GEMINI_API_KEY` in the **Settings > Secrets** panel in AI Studio.\n\nHere is a simulated spatial insight for you: All layers in the **Digital Cartography Toolkit** (Coastal Erosion, Urban Heat Mitigation, and Logistics Routing) are fully operational locally in your browser sandbox!"
        });
      }

      // Initialize GoogleGenAI SDK as instructed in skills
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Construct interactive context with previous chat history
      let promptText = `You are the Geospatial AI Copilot for Mohammad Kashif's portfolio.
Mohammad Kashif is a brilliant Geography Student, GIS Analyst, and Spatial Data Enthusiast.
His expertises include:
- GIS & Spatial Analysis (ArcGIS Pro, QGIS, PostGIS)
- Remote Sensing (ENVI, ERDAS)
- DevStack (Python, JS, React, SQL)
- Digital Cartography (high-end map design, Mapbox, contour elevations)

Here is a summary of Mohammad Kashif's showcase projects:
1. "Digital Media Management" - Exploration of spatial storytelling through digital media, making geographic concepts accessible.
2. "Coastal Erosion Modeling" - Predictive modeling of shore shifts using multi-temporal remote sensing.
3. "Urban Heat Island Mitigation" - Developing green infrastructure strategies for cooling cities.
4. "Global Logistics Optimizer" - Mapping trade supply chain vulnerabilities.
5. "Spatial Dashboard v2.0" - Redesigning GIS analytics dashboards with React.
6. "Historical Map Digitization" - Restoring and georeferencing archival cartography.

Respond professionally, dynamically, and scientifically in markdown. Guide users on spatial technology questions, remote sensing concepts, or coordinate analysis.

`;

      if (chatHistory && Array.isArray(chatHistory)) {
        chatHistory.forEach((h: any) => {
          promptText += `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.text}\n`;
        });
      }
      promptText += `User: ${message}\nAssistant:`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText
      });

      res.json({ text: response.text || "I apologize, but I could not formulate a spatial response." });
    } catch (err: any) {
      console.error("Gemini API error:", err);
      res.status(500).json({ error: "Failed to analyze spatial query. Please verify secrets config or try again." });
    }
  });

  // Vite development middleware vs Static Production bundle
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static frontend assets built in dist
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
