var express = require("express"),
    https   = require("https"),
    qs      = require("querystring"),
    fs      = require("fs"),
    path    = require("path"),
    swig    = require("swig"),
    bp      = require("body-parser"),
    cp      = require("cookie-parser"),
    tk      = require("./lib/tradeking"),
    app     = express(),
    tkStream = require("./lib/tk-stream");


// Set up swig
app.engine("html", swig.renderFile);
app.set("view engine", "html");
app.set("views", __dirname + "/views");

// Middleware
app.use(bp.urlencoded());
app.use(cp("change this secret in production!"));

// Static content
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/img", express.static(path.join(__dirname, "img")));

/* Routes */
app.route("/")
    .all(function(req, res, next)
    {
        console.log("cookie: " + JSON.stringify(req.signedCookies));
        res.render("index", {});
    });

app.route("/getOptionChain/:symbol/:expiration")
  .all(function(req, res, next)
  {
    tk.getOptionChain(
      req.params.symbol,
      req.params.expiration,
      "ask,asksz,bid,bidsz,put_call,strikeprice",
      function(data)
      {
        console.log(data);
        res.end(data);
        var streamSymbols = [req.params.symbol];
        var quotes = JSON.parse(data)["response"]["quotes"]["quote"];
        for(var i = 0; i < quotes.length; i++)
        {
          streamSymbols.push(quotes[i]["symbol"]);
        }
        tkStream.startStream(streamSymbols, function(data)
        {
          data = JSON.parse(data);
          if(data["quote"] !== undefined)
          {
            io.emit("quote", data);
          }
        });
      }
    );
  });

app.route("/getExpirations/:symbol")
  .all(function(req, res, next)
  {
    tk.getExpirations(
      req.params.symbol,
      function(data)
      {
        res.end(data);
      }
    );
  });

/* Start the server */
var options = {
    key: fs.readFileSync("secret/server.key", "utf8"),
    cert: fs.readFileSync("secret/server.crt", "utf8")
};

var server = https.createServer(options, app).listen(3000, function(){console.log("listening on port %d...", server.address().port)});

var io = require("socket.io")(server);

io.on("connection", function(socket)
{
  console.log("A user connected!");
});

