# flipkart-selenium
browserstack automaiton test 
Create a free trial account on BrowserStack to automate this test.

Using Selenium, load the flipkart.com desktop home page.

Search for the product "Samsung Galaxy S10" on that page. 

On the search results click on "Mobiles" in categories.

Apply the following filters (in filters section on the left hand side):   

Brand: Samsung

Select Flipkart assured

Sort the entries with Price -> High to Low.

Read the set of results that show up on page 1.

Create a list with the following parameters, and print this on the console.

Product Name

Display Price

Link to Product Details Page

The test script needs to be executed on the local machine first.
Please configure such that the same test case is run in parallel on different desktop browser / OS combinations, using the 5 parallels of your free trial account on BrowserStack Automate product. 

Optional: Configure a Jenkins CI job locally for this test and run these parallels from Jenkins. You can also use other CI tools like Azure DevOps, Github Actions, Travis, etc.
