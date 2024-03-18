const { Builder, By, Key, until } = require('selenium-webdriver');

async function runTest() {
  // Initialize WebDriver
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    // Set timeouts for WebDriver actions
    await driver.manage().setTimeouts({
      implicit: 10000, // Maximum time for element search
      pageLoad: 30000, // Maximum time for page load
      script: 30000,   // Maximum time for script execution
    });

    // Navigate to flipkart.com
    await driver.get('https://www.flipkart.com/');

    // Find the search input and search for "Samsung Galaxy S10"
    const searchInput = await driver.findElement(By.name('q'));
    await searchInput.sendKeys('Samsung Galaxy S10', Key.RETURN);

    // Wait for search results to load
    await driver.wait(until.elementLocated(By.className('_1AtVbE')), 30000);

    // Apply filters
    try {
      // Apply Samsung filter (using XPath)
      const samsungFilter = await driver.wait(until.elementLocated(By.xpath("//div[@class='_24_Dny']//div[text()='Samsung']")), 10000);
      await samsungFilter.click();

      // Apply Flipkart Assured filter (using XPath)
      const assuredFilter = await driver.wait(until.elementLocated(By.xpath("//div[@class='_24_Dny']//div[text()='Flipkart Assured']")), 10000);
      await assuredFilter.click();
    } catch (error) {
      console.error("Error applying filters:", error);
      // Handle potential errors (e.g., filters not found)
    }

    // Wait for filtered results to load (adjust timeout as needed)
    await driver.wait(until.elementLocated(By.className('_1AtVbE')), 30000);

    // Click on "Mobiles" category link
    const mobilesCategoryLink = await driver.wait(until.elementLocated(By.xpath("//div[@class='TB_InB']//a[@title='Mobiles']")), 10000);
    await mobilesCategoryLink.click();

    // Wait for products to load under "Mobiles" category
    await driver.wait(until.elementLocated(By.className('_1AtVbE')), 30000);

    // Get product details
    const productNames = await driver.findElements(By.className('_4rR01T'));
    const displayPrices = await driver.findElements(By.className('_30jeq3 _1_WHN1'));
    const productLinks = await driver.findElements(By.className('_1fQZEK'));

    // Create a list with product details
    const productList = [];
    for (let i = 0; i < productNames.length; i++) {
      productList.push({
        'Product Name': await productNames[i].getText(),
        'Display Price': await displayPrices[i].getText(),
        'Link to Product Details Page': await productLinks[i].getAttribute('href')
      });
    }

    // Print the list on the console
    console.log(productList);
  } finally {
    // Quit the WebDriver
    await driver.quit();
  }
}

runTest();
