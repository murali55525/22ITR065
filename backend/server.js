const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Importing the CORS package
const app = express();
const PORT = 9876;

const BASE_URL = 'http://20.244.56.144/evaluation-service';
const TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ3MDMxNzE3LCJpYXQiOjE3NDcwMzE0MTcsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImM0NTA0YzdhLTMyOGQtNGY2Mi05MTg4LTZmMjNhZDFhNzFhMyIsInN1YiI6Im11cmFsaWthcnRoaWNrbS4yMml0QGtvbmd1LmVkdSJ9LCJlbWFpbCI6Im11cmFsaWthcnRoaWNrbS4yMml0QGtvbmd1LmVkdSIsIm5hbWUiOiJtdXJhbGlrYXJ0aGljayIsInJvbGxObyI6IjIyaXRyMDY1IiwiYWNjZXNzQ29kZSI6ImptcFphRiIsImNsaWVudElEIjoiYzQ1MDRjN2EtMzI4ZC00ZjYyLTkxODgtNmYyM2FkMWE3MWEzIiwiY2xpZW50U2VjcmV0IjoiUlBIUkJEVFhFRk1CeUJ5UCJ9.zk5MJCh_166MO3323SarxGmzSW9x_9nqVWDYQ4LEw0k';
const WINDOW_SIZE = 10;
let slidingWindow = [];

const NUMBER_SOURCES = {
  p: 'primes',
  f: 'fibo',
  e: 'even',
  r: 'rand',
};

// Use the CORS middleware to allow requests from any origin
app.use(cors());

app.get('/numbers/:numberid', async (req, res) => {
  const type = req.params.numberid;
  const endpoint = NUMBER_SOURCES[type];

  // If the number type is invalid, return a 400 error
  if (!endpoint) return res.status(400).json({ error: 'Invalid number type' });

  const prevWindow = [...slidingWindow];
  let newNumbers = [];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 500);

    // Fetch numbers from the third-party service
    const response = await axios.get(`${BASE_URL}/${endpoint}`, {
      headers: {
        Authorization: TOKEN,
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);
    newNumbers = response.data.numbers || [];

    // Filter unique numbers and update the window
    const unique = newNumbers.filter(n => !slidingWindow.includes(n));
    slidingWindow = [...slidingWindow, ...unique].slice(-WINDOW_SIZE);

    // Calculate the average of the window numbers
    const avg = parseFloat(
      (slidingWindow.reduce((a, b) => a + b, 0) / slidingWindow.length).toFixed(2)
    );

    // Respond with the previous and current window states and the calculated average
    return res.json({
      windowPrevState: prevWindow,
      windowCurrState: slidingWindow,
      numbers: newNumbers,
      avg,
    });
  } catch (err) {
    // In case of an error (e.g., timeout or failure in fetch)
    return res.status(500).json({ error: 'Timeout or fetch failed' });
  }
});

// Start the server and log the success message
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
