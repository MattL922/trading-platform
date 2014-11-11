/**
 * A module that makes calls to the Tradeking API
 * @module tradeking
 */

var OAuth = require("oauth").OAuth,
    fs    = require("fs"),
    qs    = require("querystring");

var credentials = {
  consumer_key: fs.readFileSync("secret/consumer-key.txt", "utf8").trim(),
  consumer_secret: fs.readFileSync("secret/consumer-secret.txt", "utf8").trim(),
  access_token: fs.readFileSync("secret/access-token.txt", "utf8").trim(),
  access_secret: fs.readFileSync("secret/access-secret.txt", "utf8").trim()
};

var oa = new OAuth(null, null, credentials.consumer_key, credentials.consumer_secret, "1.0", null, "HMAC-SHA1");

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

//getOptionChain("XSP", "20141107", "ask,asksz,bid,bidsz,put_call,strikeprice");
//getStrikes("XSP");
//getQuote("XSP141107C00209000", "ask,asksz,bid,bidsz,put_call,strikeprice");
