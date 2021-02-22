# Binance TradingView bot
Bot for trading on binance, using tradingview webhooks

## How it works?

Simply, you will use the TradingView webhooks, send the information to localhost, and this bot will get the information to trade on binance

## Libraries

<li> binance-node-api
<li> express
<li> nodemailer

## Install

Clone repository to computer:
```
git clone https://github.com/DanillGodovan/Binance-tradingview-bot.gitt
```

Install Dependencies:
```
npm install
```

## .env Example

```js
API_KEY=YOUR_API_KEY
API_SECRET=YOUR_API_SECRET
EMAIL_ADDRESS=EMAIL_ADDRESS
EMAIL_PASSWORD=EMAIL_PASSWORD
TEXT_ADRESS=SMS_ADDRESS_OR_EMAIL_ADRESS
```

## Run it

You can run code with the:

```
npm start
```

## Tradingview webhook data:

Send POST request to localhost:3000/trading with data:

```
{
	"tradingPair" : "BNBUSDT",
	"coinOne" : "BNB",
	"coinTwo" : "USDT",
	"orderType" : "SELL"
}
```
