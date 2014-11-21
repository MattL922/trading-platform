/**
 * A module that makes calls to the Tradeking API
 * @module tradeking
 */

var OAuth = require("oauth").OAuth,
    fs    = require("fs"),
    qs    = require("querystring");

/* User credentials to access their account */
var credentials = {
  consumer_key: fs.readFileSync("secret/consumer-key.txt", "utf8").trim(),
  consumer_secret: fs.readFileSync("secret/consumer-secret.txt", "utf8").trim(),
  access_token: fs.readFileSync("secret/access-token.txt", "utf8").trim(),
  access_secret: fs.readFileSync("secret/access-secret.txt", "utf8").trim()
};

var oa = new OAuth(null, null, credentials.consumer_key, credentials.consumer_secret, "1.0", null, "HMAC-SHA1");

/**
 * Gets a list of quote data for all strikes for a given symbol and expiration date.
 *
 * @param {String} symbol The product symbol to obtain an option chain for
 * @param {String} expiration The expiration date of the options (YYYYMMDD)
 * @param {String} fids The comma-separated field names to return for each strike
 * @param {Function} callback A function to call when the data has been received
 */
function getOptionChain(symbol, expiration, fids, callback)
{
  var querystring = qs.stringify({"symbol": symbol, "query": "xdate-eq:" + expiration, "fids": fids});
  var request = oa.get("https://api.tradeking.com/v1/market/options/search.json?" + querystring, credentials.access_token, credentials.access_secret);
  var json = "";
  request.on("response", function(response)
  {
    response.setEncoding('utf8');
    // Response data is sent in pages, so they have to be concatenated and returned
    response.on('data', function(data) {
      json += data;
    });
    response.on("end", function()
    {
      console.log("Response ended - no more data to read.");
      callback(json);
    });
    response.on("close", function()
    {
      console.log("Response closed.");
    });
    response.on("error", function(error)
    {
      console.log("Caught error on response: " + error);
    });
  });
  request.end();
}

/**
 * Get a list of all strike prices for a given symbol.
 *
 * @param {String} symbol The product symbol to obtain a list of strikes for
 */
function getStrikes(symbol)
{
  var querystring = qs.stringify({"symbol": symbol});
  var request = oa.get("https://api.tradeking.com/v1/market/options/strikes.json?" + querystring, credentials.access_token, credentials.access_secret);
  var json = "";
  request.on("response", function(response)
  {
    response.setEncoding('utf8');
    // Response data is sent in pages, so they have to be concatenated and returned
    response.on('data', function(data) {
      json += data;
    });
    response.on("end", function()
    {
      console.log("Response ended - no more data to read.");
      console.log(json);
    });
    response.on("close", function()
    {
      console.log("Response closed.");
    });
    response.on("error", function(error)
    {
      console.log("Caught error on response: " + error);
    });
  });
  request.end();
}

/**
 * Get a quote for a given symbol.
 *
 * @param {String} symbol The product symbol to obtain a quote for
 * @param {String} fids The comma-separated field names to return for the quote
 */
function getQuote(symbol, fids)
{
  var querystring = qs.stringify({"symbols": symbol, "fids": fids});
  var request = oa.get("https://api.tradeking.com/v1/market/ext/quotes.json?" + querystring, credentials.access_token, credentials.access_secret);
  var json = "";
  request.on("response", function(response)
  {
    response.setEncoding('utf8');
    // Response data is sent in pages, so they have to be concatenated and returned
    response.on('data', function(data) {
      json += data;
    });
    response.on("end", function()
    {
      console.log("Response ended - no more data to read.");
      console.log(json);
    });
    response.on("close", function()
    {
      console.log("Response closed.");
    });
    response.on("error", function(error)
    {
      console.log("Caught error on response: " + error);
    });
  });
  request.end();
}

/**
 * Get a list of expiration dates that are available to trade for a given symbol.
 *
 * @param {String} symbol The product symbol to obtain expirations for
 * @param {Function} callback A function to call when the data has been received
 */
function getExpirations(symbol, callback)
{
  var querystring = qs.stringify({"symbol": symbol});
  var request = oa.get("https://api.tradeking.com/v1/market/options/expirations.json?" + querystring, credentials.access_token, credentials.access_secret);
  request.on("response", function(response)
  {
    response.setEncoding('utf8');
    response.on('data', function(data) {
      callback(data);
    });
    response.on("end", function()
    {
      console.log("Response ended - no more data to read.");
    });
    response.on("close", function()
    {
      console.log("Response closed.");
    });
    response.on("error", function(error)
    {
      console.log("Caught error on response: " + error);
    });
  });
  request.end();
}

module.exports = {
  getOptionChain: getOptionChain,
  getExpirations: getExpirations
};
