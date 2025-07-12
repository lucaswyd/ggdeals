const puppeteer = require('puppeteer');

async function fetchGGDealsData() {
  const url = 'https://gg.deals/game/ea-sports-college-football-26-xbox-series/';

  const browser = await puppeteer.launch({
    headless: 'new', // for newer Puppeteer versions
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  let apiData = null;

  page.on('response', async (response) => {
    const request = response.request();
    const requestUrl = request.url();

    if (requestUrl.includes('/chartHistoricalData/375527')) {
      try {
        const json = await response.json();
        apiData = json;
      } catch (err) {
        console.error('❌ Failed to parse JSON:', err.message);
      }
    }
  });

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // Wait a bit to make sure the XHR completes
    await page.waitForTimeout(5000);

    if (apiData) {
      console.log('✅ Fetched price data:', JSON.stringify(apiData, null, 2));
    } else {
      console.error('❌ Data not found — XHR may have failed or changed.');
    }
  } catch (error) {
    console.error('❌ Error loading page:', error.message);
  } finally {
    await browser.close();
  }
}

fetchGGDealsData();
