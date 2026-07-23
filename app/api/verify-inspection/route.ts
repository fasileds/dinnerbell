import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req: Request) {
  try {
    const { restaurantName } = await req.json();

    if (!restaurantName) {
      return NextResponse.json({ error: "Restaurant name is required." }, { status: 400 });
    }

    console.log(`Starting inspection verification for: ${restaurantName}`);

    // Launch a headless browser (using local Chrome since download was skipped)
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Set a realistic user agent to bypass basic bot protections
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    try {
      // Go to the Tulsa Health Department Inspection site
      // Note: This URL might redirect or have Cloudflare protection. 
      await page.goto('https://tulsa-health.org/permits-inspections/food/food-service-industry-inspections/', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // --- SCRAPING LOGIC ---
      // This logic assumes there's a search box we can type into.
      // Since the exact DOM structure might change, this is a generalized approach.
      
      // 1. Wait for and find the search input (Common selectors: input[type="search"], #search, .search-box)
      // This is a placeholder selector. You may need to inspect the live site to get the exact ID.
      const searchInputSelector = 'input[type="text"], input[type="search"]'; 
      await page.waitForSelector(searchInputSelector, { timeout: 10000 });
      
      // 2. Type the restaurant name and hit Enter
      await page.type(searchInputSelector, restaurantName);
      await page.keyboard.press('Enter');

      // 3. Wait for results to load
      await new Promise(resolve => setTimeout(resolve, 3000)); // Give it time to fetch results

      // 4. Extract the results. We look for keywords like "Fail", "Pass", or specific score numbers.
      // This extracts all text from the main content area to analyze.
      const pageText = await page.evaluate(() => document.body.innerText.toLowerCase());

      await browser.close();

      // --- ANALYSIS LOGIC ---
      // Check if the restaurant name exists in the results
      if (!pageText.includes(restaurantName.toLowerCase())) {
        return NextResponse.json({ 
          status: "not_found", 
          message: "Restaurant not found in the inspection database." 
        });
      }

      // Check for failure keywords near the restaurant name.
      // Health departments often use terms like "Priority Violations", "Failed", "Closed".
      if (pageText.includes("failed") || pageText.includes("closed by health department")) {
        return NextResponse.json({ 
          status: "failed", 
          message: "Restaurant failed the recent health inspection." 
        });
      }

      // If found and not failed, we assume pass.
      return NextResponse.json({ 
        status: "passed", 
        message: "Restaurant passed the inspection." 
      });

    } catch (scrapeError) {
      await browser.close();
      console.error("Scraping error (possible Cloudflare block):", scrapeError);
      
      // FALLBACK: If the scraper fails (due to 503 Cloudflare, timeout, etc), 
      // we strictly block the user per the requirements.
      return NextResponse.json({ 
        status: "not_found", 
        message: "Could not find restaurant due to connection issues with Tulsa Health database." 
      });
    }

  } catch (error: any) {
    console.error("Verification API Error:", error);
    return NextResponse.json(
      { error: "Internal server error during verification." },
      { status: 500 }
    );
  }
}
