const puppeteer = require('puppeteer');

async function fetchGGDealsData() {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  await page.goto('https://gg.deals/game/ea-sports-college-football-26-xbox-series/', {
    waitUntil: 'networkidle0',
  });

  const data = await page.evaluate(async () => {
    const response = await fetch(
      '/us/games/chartHistoricalData/375527/?showKeyshops=1',
      {
        headers: {
          Accept: 'application/json, text/javascript, */*; q=0.01',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
      }
    );
    return response.json();
  });

  await browser.close();
  return data;
}

fetchGGDealsData()
  .then(data => {
    console.log('Fetched data:', JSON.stringify(data));
  })
  .catch(err => {
    console.error('Error fetching data:', err);
    process.exit(1);
  });
