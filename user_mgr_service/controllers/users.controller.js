import UpstoxClient from "upstox-js-sdk";


const getFunds = async (req, res) => {
  
  let defaultClient = UpstoxClient.ApiClient.instance;
  var OAUTH2 = defaultClient.authentications["OAUTH2"];
  OAUTH2.accessToken = process.env.ACCESS_TOKEN;
  let apiInstance = new UpstoxClient.UserApi();
  let apiVersion = "2.0";
  let opts = {
    segment: "SEC",
  };
  apiInstance.getUserFundMargin(apiVersion, opts, (error, data, response) => {
    if (error) {
        res.status(500).json({error:error.message});
      console.error(error);
    } else {
        res.status(200).json({message:data});
      console.log(
        "API called successfully. Returned data: " + JSON.stringify(data)
      );
    }
  });
};


export default getFunds;