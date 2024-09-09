import React, { useState, useEffect } from 'react';
import SignalRService from './services/signalRService';
import { PublicClientApplication } from "@azure/msal-browser";
import { loginRequest, msalConfig } from "./services/authConfig";

const msalInstance = new PublicClientApplication(msalConfig);

const App = () => {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const initializeConnection = async () => {
      await msalInstance.initialize();
      await msalInstance.loginPopup(loginRequest);
      await SignalRService.startConnection();
      SignalRService.registerOnServerEvents((receivedMessage: any) => {
        if(typeof receivedMessage === 'object') {
          setMessage(JSON.stringify(receivedMessage));
        } else {
          setMessage(receivedMessage);
        }
      });
    };
    
    initializeConnection();
  }, []);
  
  return (
    <div>
      <h1>Received Message:</h1>
      <p>{ message }</p>
    </div>
  );
}

export default App;