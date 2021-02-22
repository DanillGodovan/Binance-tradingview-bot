require('dotenv').config() 
const Binance = require('node-binance-api');
const binance = new Binance().options({
  APIKEY: process.env.API_KEY,
  APISECRET: process.env.API_SECRET,
});

binance.useServerTime();
binance.balance((error, balances) => {
    if ( error ) return console.error(error);
    console.info("BNB balance: ", balances.BNB.available);
});

binance.prices('ETCUSDT', (error, ticker) => {
    console.info("Price of ETC: ", ticker.ETCUSDTы);
  });