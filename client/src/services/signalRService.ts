import * as signalR from "@microsoft/signalr";
import { PublicClientApplication } from "@azure/msal-browser";
import {msalConfig, loginRequest } from "./authConfig";

class SignalRService {
  private connection: any;
  private msalInstance = new PublicClientApplication(msalConfig);

  public startConnection = async () => {
    try {
      const negotiateUri = process.env.REACT_APP_NEGOTIATE_ENDPOINT;

      const response = await fetch(`${negotiateUri}/api/negotiate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await this.getAccessToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to negotiate: ${response.statusText}`);
      }
      
      const negotiateInfo = await response.json();

      const endpointUri = process.env.NODE_ENV === 'development'
        ? process.env.REACT_APP_SIGNALR_DEV_URI
        : negotiateInfo.url; // Use the URI fro

      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(endpointUri, { accessTokenFactory: () => negotiateInfo.accessToken })
        .build();

      await this.connection.start();
      console.log("SignalR connection established.");

    } catch (error) {
      console.error("Error starting SignalR connection:", error);
    }
  };

  private getAccessToken = async (): Promise<string> => {
    try {
      await this.msalInstance.initialize();

      const account = this.msalInstance.getAllAccounts()[0];
      if (!account) {
        await this.msalInstance.loginPopup(loginRequest);
      }

      const response = await this.msalInstance.acquireTokenSilent({
        ...loginRequest,
        account: this.msalInstance.getAllAccounts()[0]
      });

      console.log(response.accessToken);
      return response.accessToken;
    } catch (error) {
      console.error("Error acquiring token silently:", error);
      const response = await this.msalInstance.acquireTokenPopup(loginRequest);
      return response.accessToken;
    }
  };

  private getUserIdFromToken(idToken: string): string {
    const payload = JSON.parse(atob(idToken.split('.')[1]));
    return payload.oid;
  }

  public registerOnServerEvents = (onMessageReceived: (message: string) => void) => {
    if (!this.connection) {
      return;
    }

    this.connection.on("newMessage", (message: string) => {
      console.log("Received message:", message);
      onMessageReceived(message);
    });
  }
}

export default new SignalRService();