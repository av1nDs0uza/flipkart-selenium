
const fs = require('fs');
const { Builder, By, Key, until } = require('selenium-webdriver');
const { Capabilities } = require('selenium-webdriver');
const yaml = require('js-yaml');

async function getBrowserStackConfig() {
  const data = fs.readFileSync('browserstack.yml', 'utf8');
  return yaml.load(data); 
}

async function runTest(browserstackConfig) {
  console.log('BrowserStack Config:', browserstackConfig); 
  
  for (const platform of browserstackConfig.platforms) {
    const capabilities = new Capabilities(); 
    console.log('Initial Capabilities:', capabilities); 
    
    capabilities.set('browserName', platform.browserName);
    capabilities.set('browserVersion', platform.browserVersion);
    capabilities.set('os', platform.os);
    capabilities.set('os_version', platform.osVersion);
    capabilities.set('name', platform.name);
    capabilities.set('browserstack.user', browserstackConfig.userName); 
    capabilities.set('browserstack.key', browserstackConfig.accessKey); 

    console.log('Final Capabilities:', capabilities); 

    const driver = await new Builder()
      .usingServer('https://hub-cloud.browserstack.com/wd/hub')
      .withCapabilities(capabilities)
      .build();

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
      const samsungFilter = await driver.wait(until.elementLocated(By.xpath("//div[@class='_24_Dny']//div[text()='Samsung']")), 10000);
      await samsungFilter.click();

      const assuredFilter = await driver.wait(until.elementLocated(By.xpath("//div[@class='_24_Dny']//div[text()='Flipkart Assured']")), 10000);
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
}

async function main() {
  const browserstackConfig = await getBrowserStackConfig();
  await runTest(browserstackConfig);
}

main().catch(err => console.error(err));
