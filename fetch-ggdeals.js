const puppeteer = require('puppeteer');

async function fetchGGDealsData() {
  const url = 'https://gg.deals/game/ea-sports-college-football-26-xbox-series/';
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  let apiData = null;

  page.on('response', async (response) => {
    const request = response.request();
    const requestUrl = request.url();

    // Log all XHR requests for debugging
    if (request.resourceType() === 'xhr') {
      console.log('📡 XHR:', requestUrl);
    }

    // Look for the chartHistoricalData endpoint
    if (requestUrl.includes('/chartHistoricalData/375527')) {
      try {
        const json = await response.json();
        console.log('✅ Matched data URL:', requestUrl);
        apiData = json;
      } catch (err) {
        console.error('❌ Failed to parse JSON:', err.message);
      }
    }
  });

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // Wait for XHRs to fire
    await new Promise(resolve => setTimeout(resolve, 8000));

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
