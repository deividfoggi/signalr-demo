// authConfig.ts
import { Configuration } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: "7005b66c-4cb9-4583-a3a3-5b1750c85271", // Replace with your Entra ID client ID
    authority: "https://login.microsoftonline.com/61a8746e-424d-4105-a054-b38573d6e54a", // Replace with your tenant ID
    redirectUri: "https://17a9-187-89-77-3.ngrok-free.app", // Replace with your redirect URI
  },
};

export const loginRequest = {
  scopes: ["User.Read"], // Replace with the scopes you need
};