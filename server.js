const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Version info — change this manually as needed
const VERSION = '1.0.1';

app.get('/', (req, res) => {
  res.send(`🟢 GG.deals proxy is running — v${VERSION}`);
});

app.get('/prices', async (req, res) => {
  try {
    const response = await fetch(
      'https://gg.deals/us/games/chartHistoricalData/375527/?showKeyshops=1',
      {
        headers: {
          Accept: 'application/json, text/javascript, */*; q=0.01',
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.0 Safari/605.1.15',
          Referer:
            'https://gg.deals/game/ea-sports-college-football-26-xbox-series/',
          'X-Requested-With': 'XMLHttpRequest',
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error(`GG.deals returned ${response.status}: ${text}`);
      return res.status(502).json({
        error: `GG.deals status ${response.status}`,
        message: text,
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from gg.deals' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ GG.deals proxy listening on port ${PORT} — v${VERSION}`);
});