var OAuth = require('oauth').OAuth,
    fs    = require("fs");

var credentials = {
  consumer_key: fs.readFileSync("secret/consumer-key.txt", "utf8").trim(),
  consumer_secret: fs.readFileSync("secret/consumer-secret.txt", "utf8").trim(),
  access_token: fs.readFileSync("secret/access-token.txt", "utf8").trim(),
  access_secret: fs.readFileSync("secret/access-secret.txt", "utf8").trim()
};

var oa = new OAuth(null, null, credentials.consumer_key, credentials.consumer_secret, "1.0", null, "HMAC-SHA1");

var curStreamResponse = null;

function startStream(symbols, callback)
{
  // End the previous response
  if(curStreamResponse !== null)
  {
    curStreamResponse.emit("end");
  }
  // Start the new request
  var request = oa.get("https://stream.tradeking.com/v1/market/quotes.json?symbols=" + symbols.join(","), credentials.access_token, credentials.access_secret);
  request.on('response', function (response) {
    response.setEncoding('utf8');
    //response.pipe(fs.createWriteStream("data/stream-" + new Date().toISOString() + ".txt"));
    response.on('data', function(data) {
      console.log(data);
      callback(data);
    });
    response.on("end", function()
    {
      console.log("Stream Response ended - no more data to read.");
    });
    response.on("close", function()
    {
      console.log("Stream Response closed.");
      //console.log("Restarting stream...");
      //startStream(symbols);
    });
    response.on("error", function(error)
    {
      console.log("Caught error on stream response: " + error);
    });
    curStreamResponse = response;
  });
  request.on("error", function(error)
  {
    console.log("Caught error on stream request: " + error);
    //console.log("Restarting stream...");
    //startStream(symbols);
  });
  request.end();
}

module.exports = {
  startStream: startStream
};

