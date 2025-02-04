import UpstoxClient from "upstox-js-sdk";

const getOrders = async (req, res) => {
  let defaultClient = UpstoxClient.ApiClient.instance;
  var OAUTH2 = defaultClient.authentications["OAUTH2"];
  OAUTH2.accessToken = process.env.ACCESS_TOKEN;
  let apiInstance = new UpstoxClient.OrderApi();

  let apiVersion = "2.0";

  apiInstance.getOrderBook(apiVersion, (error, data, response) => {
    if (error) {
      res.status(500).json({ error: error.message });
      console.error(error);
    } else {
      res.status(200).json({ message: data });
      console.log(
        "API called successfully. Returned data: " + JSON.stringify(data)
      );
    }
  });
};

export const addOrder = async (req, res) => {
  let defaultClient = UpstoxClient.ApiClient.instance;
  var OAUTH2 = defaultClient.authentications["OAUTH2"];
  OAUTH2.accessToken = process.env.ACCESS_TOKEN;

  let apiInstance = new UpstoxClient.OrderApi();
  let body = new UpstoxClient.PlaceOrderRequest(
    1,
    UpstoxClient.PlaceOrderRequest.ProductEnum.D,
    UpstoxClient.PlaceOrderRequest.ValidityEnum.DAY,
    0.0,
    "NSE_EQ|INE669E01016",
    UpstoxClient.PlaceOrderRequest.OrderTypeEnum.MARKET,
    UpstoxClient.PlaceOrderRequest.TransactionTypeEnum.BUY,
    0,
    0.0,
    true
  );
  let apiVersion = "2.0";

  apiInstance.placeOrder(body, apiVersion, (error, data, response) => {
    if (error) {
      res.status(500).json({ error: error.message });
      console.error(error.response.text);
    } else {
      res.status(200).json({ message: data });
      console.log("API called successfully. Returned data: " + data);
    }
  });
};

export const cancelOrder = async (req, res) => {
  let defaultClient = UpstoxClient.ApiClient.instance;
  var OAUTH2 = defaultClient.authentications["OAUTH2"];
  OAUTH2.accessToken = process.env.ACCESS_TOKEN;
  let apiInstance = new UpstoxClient.OrderApi();

  let orderId = "250126000000782";
  let apiVersion = "2.0";

  apiInstance.cancelOrder(orderId, apiVersion, (error, data, response) => {
    if (error) {
      console.error(error.response.text);
      console.error(error);
    } else {
      res.status(200).json({ message: data });
      console.log("API called successfully. Returned data: " + data);
    }
  });
};

export default getOrders;
