marketData = [
  {"quote":{"ask":"0.31","asksz":"650","bid":"0.04","bidsz":"660","exch":"Chicago Board Options Exchange","symbol":"XSP141114P00200000"}},
  {"quote":{"ask":"0.31","asksz":"675","bid":"0.04","bidsz":"660","exch":"Chicago Board Options Exchange","symbol":"XSP141114P00200000"}},
  {"quote":{"ask":"0.29","asksz":"662","bid":"0.0","bidsz":"0","exch":"Chicago Board Options Exchange","symbol":"XSP141114P00200000"}},
  {"quote":{"ask":"2.85","asksz":"483","bid":"1.72","bidsz":"458","exch":"Chicago Board Options Exchange","symbol":"XSP141114P00200000"}},
  {"quote":{"ask":"0.27","asksz":"652","bid":"0.0","bidsz":"0","exch":"Chicago Board Options Exchange","symbol":"XSP141114P00200000"}},
  {"quote":{"ask":"0.31","asksz":"675","bid":"0.06","bidsz":"650","exch":"Chicago Board Options Exchange","symbol":"XSP141114P00200000"}},
  {"quote":{"ask":"2.76","asksz":"458","bid":"1.72","bidsz":"458","exch":"Chicago Board Options Exchange","symbol":"XSP141114P00200000"}},
  {"quote":{"ask":"2.76","asksz":"483","bid":"1.72","bidsz":"458","exch":"Chicago Board Options Exchange","symbol":"XSP141114P00200000"}},
  {"quote":{"ask":"0.43","asksz":"169","bid":"0.17","bidsz":"657","exch":"Chicago Board Options Exchange","symbol":"XSP141114P00200000"}},
  {"quote":{"ask":"0.27","asksz":"662","bid":"0.0","bidsz":"0","exch":"Chicago Board Options Exchange","symbol":"XSP141114P00200000"}},
  {"quote":{"ask":"0.43","asksz":"162","bid":"0.17","bidsz":"669","exch":"Chicago Board Options Exchange","symbol":"XSP141114P00200000"}},
  {"quote":{"ask":"0.34","asksz":"675","bid":"0.06","bidsz":"650","exch":"Chicago Board Options Exchange","symbol":"XSP141114P00200000"}},
  {"quote":{"ask":"2.76","asksz":"483","bid":"1.63","bidsz":"458","exch":"Chicago Board Options Exchange","symbol":"XSP141114P00200000"}},
  {"quote":{"ask":"0.34","asksz":"675","bid":"0.06","bidsz":"660","exch":"Chicago Board Options Exchange","symbol":"XSP141114P00200000"}},
  {"quote":{"ask":"0.34","asksz":"675","bid":"0.06","bidsz":"650","exch":"Chicago Board Options Exchange","symbol":"XSP141114P00200000"}},
  {"quote":{"ask":"0.34","asksz":"675","bid":"0.06","bidsz":"660","exch":"Chicago Board Options Exchange","symbol":"XSP141114P00200000"}},
  {"quote":{"ask":"0.34","asksz":"675","bid":"0.06","bidsz":"650","exch":"Chicago Board Options Exchange","symbol":"XSP141114P00200000"}},
  {"quote":{"ask":"0.25","asksz":"652","bid":"0.0","bidsz":"0","exch":"Chicago Board Options Exchange","symbol":"XSP141114P00200000"}},
  {"quote":{"ask":"2.76","asksz":"458","bid":"1.63","bidsz":"458","exch":"Chicago Board Options Exchange","symbol":"XSP141114P00200000"}},
  {"quote":{"ask":"0.34","asksz":"650","bid":"0.06","bidsz":"650","exch":"Chicago Board Options Exchange","symbol":"XSP141114P00200000"}}
];

i = 0;

socketio = null;

intervalId = null;

function stream()
{
  socketio.emit("quote", marketData[i]);
  i++;
  if(i == marketData.length)
  {
    clearInterval(intervalId);
  }
};

function init()
{
  intervalId = setInterval(stream, 1000);
};

module.exports = function(io)
{
  socketio = io;
  init();
};
