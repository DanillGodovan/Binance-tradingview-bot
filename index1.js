const Binance = require("binance-api-node").default;
const { sendText } = require("./nodemailer");

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;

const client = Binance({
  apiKey: API_KEY,
  apiSecret: API_SECRET,
});

const calculateBuyAmount = async (tradingPair, coinTwo) => {
  let quantity = 0;

  try {
    const avgPrice = await client.avgPrice({ symbol: tradingPair });

    const userWallet = await client.accountInfo();
    let coinTwoBalance = undefined;

    if (userWallet.balances !== undefined && userWallet.balances.length > 0) {
      userWallet.balances.forEach((token) => {
        if (token.asset === coinTwo) {
          coinTwoBalance = token.free;
        }
      });
    }

    if (coinTwoBalance !== undefined && avgPrice.price !== undefined) {
      quantity = (0.95 * coinTwoBalance) / avgPrice.price;
    }
  } catch (error) {
    console.log("Не могу расчитать количество. ", error);
  }

  return Math.floor(quantity);
};

const calculateSellAmount = async (coinOne) => {
  let quantity = 0;

  try {
   
    const userWallet = await client.accountInfo();

    if (userWallet.balances !== undefined && userWallet.balances.length > 0) {
      userWallet.balances.forEach((token) => {
        if (token.asset === coinOne) {
          quantity = token.free;
        }
      });
    }
  } catch (error) {
    console.log("Не могу расчитать количество. ", error);
  }

  return Math.floor(quantity);
};

module.exports = {
  placeOrder: async (tradingPair, coinOne, coinTwo, orderType) => {
    let orderStatus = undefined;
    let quantity = 0;

    try {
      if (orderType === "BUY") {
        quantity = await calculateBuyAmount(tradingPair, coinTwo);
      } else if (orderType === "SELL") {
        quantity = await calculateSellAmount(coinOne);
      }

      if (quantity !== undefined && quantity !== 0) {
        console.log(
          `Отправляю ордер на ${orderType} в количестве ${quantity} ${coinOne} на бинанс.`
        );
        orderStatus = await client.order({
          symbol: tradingPair,
          side: orderType,
          type: "MARKET",
          quantity: quantity,
        });
        console.log("Ответ с бинанса", orderStatus);
      }
    } catch (error) {
      console.log(`Не могу поставить ордер на ${orderType}.`, error);
    }

    if (
      orderStatus !== undefined &&
      orderStatus.status !== undefined &&
      orderStatus.status === "FILLED"
    ) {
      sendText(
        `Ордер на ${orderType} в количестве ${quantity} ${coinOne} был заполнен.`
      );
      console.log(
        `Ордер на ${orderType} в количестве ${quantity} ${coinOne} был заполнен`
      );
      return { status: "Order Placed" };
    } else {
      sendText(
        `Ордер на ${orderType} в количестве ${quantity} ${coinOne} не был заполнен`
      );
      console.log(
        `Ордер на ${orderType} в количестве ${quantity} ${coinOne} не был заполнен.`
      );
      return { status: "Order Failed" };
    }
  },
};