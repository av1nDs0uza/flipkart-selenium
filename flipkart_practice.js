const { Builder, By, Key, until } = require('selenium-webdriver');

async function runTest() {
  
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    
    await driver.manage().setTimeouts({
      implicit: 10000, 
      pageLoad: 30000, 
      script: 30000,   
    });

    
    await driver.get('https://www.flipkart.com/');

    const searchInput = await driver.findElement(By.name('q'));
    await searchInput.sendKeys('Samsung Galaxy S10', Key.RETURN);

    await driver.wait(until.elementLocated(By.className('_1AtVbE')), 30000);

    
    try {
        const samsungFilter = await driver.wait(until.elementLocated(By.css("div[title='SAMSUNG']")), 10000);
      
        const assuredFilter = await driver.wait(until.elementLocated(By.xpath("//div[@class='_24_Dny _3tCU7L']//div[text()='Flipkart Assured']")), 10000);
        await assuredFilter.click();
      } catch (error) {
        console.error("Error applying filters:", error);
        
      }

    await driver.wait(until.elementLocated(By.className('_1AtVbE')), 30000);

 
    const mobilesCategoryLink = await driver.wait(until.elementLocated(By.xpath("//div[@class='TB_InB']//a[@title='Mobiles']")), 10000);
    await mobilesCategoryLink.click();


    await driver.wait(until.elementLocated(By.className('_1AtVbE')), 30000);

    const productNames = await driver.findElements(By.className('_4rR01T'));
    const displayPrices = await driver.findElements(By.className('_30jeq3 _1_WHN1'));
    const productLinks = await driver.findElements(By.className('_1fQZEK'));
    const productList = [];
    for (let i = 0; i < productNames.length; i++) {
      productList.push({
        'Product Name': await productNames[i].getText(),
        'Display Price': await displayPrices[i].getText(),
        'Link to Product Details Page': await productLinks[i].getAttribute('href')
      });
    }

    
    console.log(productList);
  } finally {
    
    await driver.quit();
  }
}

runTest();
