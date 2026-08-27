const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// RailRadar API key goes in Render Environment Variables.
// DO NOT put your real API key directly in this file.
const RAILRADAR_API_KEY = process.env.RAILRADAR_API_KEY;

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "RailBook backend is running"
  });
});

app.get("/api/live/:trainNumber", async (req, res) => {
  try {
    const trainNumber = req.params.trainNumber;

    if (!/^\d{5}$/.test(trainNumber)) {
      return res.status(400).json({
        success: false,
        error: "Enter a valid 5-digit train number"
      });
    }

    if (!RAILRADAR_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "RailRadar API key is not configured"
      });
    }

    const url =
      `https://api.railradar.in/v1/legacy/trains/${trainNumber}?dataType=live`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${RAILRADAR_API_KEY}`
      }
    });

    const data = await response.json();

    res.status(response.status).json(data);

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`RailBook backend running on port ${PORT}`);
});
