
module.exports = (function () {

    "use strict";

    // Module Dependencies
    var qs = require('querystring'),
        url = require('url'),
        http = require('http'),
        cheerio = require('cheerio');

    /**
      * Web Scraper - Make it easy to parse web pages
      *
      * @param  {string}   reqUrl       The required url in any form
      * @param  {object}   options      An options object (this is optional)
      * @param  {Function} callback     This is passed the 'err' for Error, '$' for jQuery model, and 'res' for response objects.
      *
      */
    return function (reqUrl, options, callback) {

        // If no options passed in
        if (typeof options === 'function') { callback = options; options = {}; }

        // If no callback exist!
        if (callback === undefined) { callback = function () {}; }

        // Parse url to chunks
        reqUrl = url.parse(reqUrl);

        // Request settings for http.request
        var settings = {
            host: reqUrl.hostname,
            port: reqUrl.port || 80,
            path: reqUrl.pathname,
            headers: options.headers || {},
            method: options.method || 'GET'
        };

        // If there are params
        if (options.params) {
            options.content = JSON.stringify(options.params);
            settings.headers['Content-Type'] = 'application/json';
        }

        // If there are form fields
        if (options.form) {
            options.content = qs.stringify(options.form);
            settings.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }

        // Make request
        var req = http.request(settings);

        // If there is content to send
        if (options.content) {
            settings.headers['Content-Length'] = options.content.length;
            req.write(options.content);
        }

        // When response come back
        req.on('response', function (res) {

            // Prepare response
            res.body = '';
            res.setEncoding('utf-8');

            // Read chunks
            res.on('data', function (chunk) { res.body += chunk; });

            // When the response has finished
            res.on('end', function () {

                // Return null as Error with jQuery and Response objects
                callback(null, cheerio.load(res.body), res);
            });
        });

        // Handle Error on Request
        req.on('error', function () {
            callback(new Error('Error executing request!'), null, null);
        });

        // End of request
        req.end();
    };
}());

/**
 * Special Thanks:
 *
 * Thanks to Wilson Page for reqUrl.js
 * https://gist.github.com/wilsonpage/1393666
 *
 * Thanks to Aaron Blondeau for his article
 * http://www.theroamingcoder.com/node/111
 *
 */
