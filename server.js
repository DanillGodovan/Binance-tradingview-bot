const express = require("express");
const parser = require("body-parser");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

const { placeOrder } = require("./binance");
const { sendText } = require("./mailer");

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(parser.json());
app.use(
  parser.urlencoded({
    extended: true,
  })
);

app.post("/trading", async (req, res) => {
  const { tradingPair, coinOne, coinTwo, orderType } = req.body;
  let status = undefined;

  sendText(`Ордер на  ${orderType} ${coinOne} Был отправлен боту.`);

  console.log(
    `Ордер на ${orderType} ${coinOne} Был отправлен боту.`
  );

  if (
    tradingPair !== undefined &&
    coinOne !== undefined &&
    coinTwo !== undefined &&
    orderType !== undefined
  ) {
    status = await placeOrder(tradingPair, coinOne, coinTwo, orderType);
  } else {
    console.log("Одна из данных переменных не верна");
  }

  res.status(200).json(status);
});

app.listen(PORT, () => {
  console.log("App is listening on PORT: ", PORT);
});