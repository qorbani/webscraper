
// Get WebScraper Module 
var scraper = require('../');

// Scrape "http://qorbani.com" web page
scraper('http://qorbani.com', function (err, $, res) {

	// Check if there is any error!
	if (err) {
		console.log(err);
		return;
	}

	// Return Page Title
	console.log($('head > title').text());

	// For more information about how to use "$" visit:
	// https://github.com/MatthewMueller/cheerio#api
});