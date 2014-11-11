$(document).ready(function()
{
  $("#update-symbol").blur(function(event)
  {
    var symbol = $("#update-symbol").val();
    $.ajax({
      url: "https://54.86.222.111:3000/getExpirations/" + symbol,
      type: "GET",
      dataType: "json",
      success: function(data, status, xhr)
      {
        console.log(data);
        var expirations = data["response"]["expirationdates"]["date"],
            selectOptionHtml = [];
        for(var i = 0; i < expirations.length; i++)
        {
          selectOptionHtml.push(
            $("<option/>").attr({"value": expirations[i].replace(/-/g,"")}).text(expirations[i])
          );
        }
        $("#update-expiration").append(selectOptionHtml);
      },
      error: function(xhr, status, error)
      {
        console.log(status);
        console.log(error);
      }
    }); // end ajax()
  });

  $("#update-option-chain").click(function()
  {
    // Clear the previous option chain table rows
    $("tr.option-chain-row").remove();
    var symbol     = $("#update-symbol").val(),
        expiration = $("#update-expiration").val();
    $.ajax({
      url: "https://54.86.222.111:3000/getOptionChain/" + symbol + "/" + expiration,
      type: "GET",
      dataType: "json",
      success: function(data, status, xhr)
      {
        var rows      = [],
            puts      = Object.create(null),
            calls     = Object.create(null),
            strikeSet = Object.create(null),
            strikes   = [],
            quotes    = data["response"]["quotes"]["quote"];
        for(var i = 0; i < quotes.length; i++)
        {
          var quote       = quotes[i],
              strikeprice = parseFloat(quote["strikeprice"]),
              putOrCall   = quote["put_call"];
          if(putOrCall === "put")
          {
            puts[strikeprice] = quote;
          }
          else
          {
            calls[strikeprice] = quote;
          }
          strikeSet[strikeprice] = true;
        }
        for(var strike in strikeSet)
        {
          strikes.push(parseFloat(strike));
        }
        strikes.sort(function(a,b){return a-b;});
        for(var i = 0; i < strikes.length; i++)
        {
          var callQuote = calls[strikes[i]],
              callBid   = parseFloat(callQuote["bid"]),
              callAsk   = parseFloat(callQuote["ask"]),
              callSymbol = callQuote["symbol"],
              putQuote  = puts[strikes[i]],
              putBid    = parseFloat(putQuote["bid"]),
              putAsk    = parseFloat(putQuote["ask"]),
              putSymbol = putQuote["symbol"],
              callHtml  = [
                $("<td/>").attr({"class":"text-center small", "id":callSymbol+"-bidsz"}).text(callQuote["bidsz"]),
                $("<td/>").attr({"class":"text-center small", "id":callSymbol+"-bid"}).text(callBid.toFixed(2)),
                $("<td/>").attr({"class":"text-center small", "id":callSymbol+"-value"}).text(((callAsk-callBid)/2+callBid).toFixed(2)),
                $("<td/>").attr({"class":"text-center small", "id":callSymbol+"-ask"}).text(callAsk.toFixed(2)),
                $("<td/>").attr({"class":"text-center small", "id":callSymbol+"-asksz"}).text(callQuote["asksz"])
              ],
              putHtml = [
                $("<td/>").attr({"class":"text-center small", "id":putSymbol+"-bidsz"}).text(putQuote["bidsz"]),
                $("<td/>").attr({"class":"text-center small", "id":putSymbol+"-bid"}).text(putBid.toFixed(2)),
                $("<td/>").attr({"class":"text-center small", "id":putSymbol+"-value"}).text(((putAsk-putBid)/2+putBid).toFixed(2)),
                $("<td/>").attr({"class":"text-center small", "id":putSymbol+"-ask"}).text(putAsk.toFixed(2)),
                $("<td/>").attr({"class":"text-center small", "id":putSymbol+"-asksz"}).text(putQuote["asksz"])
              ],
              row = $("<tr/>").attr({"class":"option-chain-row"})
                .append(callHtml)
                .append($("<td/>").html($("<strong/>").attr({"class":"text-center small"}).text(strikes[i].toFixed(2))))
                .append(putHtml);
          rows.push(row);
        }
        $("#option-chain").append(rows);
      },
      error: function(xhr, status, error)
      {
        console.log(status);
      }
    }); // end ajax()
  }); // end click()
}); // end ready()
