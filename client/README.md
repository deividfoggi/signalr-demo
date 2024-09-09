# Client

This is the client folder of the project. It contains the React application that serves as a SignalR client to receive notifications.

## Project Structure

The project has the following structure:

```
client
├── public
│   ├── index.html
│   └── manifest.json
├── src
│   ├── components
│   │   └── Notification.tsx
│   ├── services
│   │   └── signalRService.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── react-app-env.d.ts
├── package.json
├── tsconfig.json
└── README.md
```

- `public`: This folder contains the public assets of the React application.
  - `index.html`: This file is the HTML template for the React application.
  - `manifest.json`: This file is a web app manifest that provides metadata about the application.

- `src`: This folder contains the source code of the React application.
  - `components`: This folder contains the React components used in the application.
    - `Notification.tsx`: This file exports a React component `Notification` that represents a notification.

  - `services`: This folder contains the services used in the application.
    - `signalRService.ts`: This file exports a class `SignalRService` that handles the connection to the SignalR server and provides methods to receive notifications.

  - `App.tsx`: This file is the main component of the React application.

  - `index.tsx`: This file is the entry point of the React application.

  - `react-app-env.d.ts`: This file is a declaration file that includes global type definitions for the React application.

- `package.json`: This file is the configuration file for npm. It lists the dependencies and scripts for the project.

- `tsconfig.json`: This file is the configuration file for TypeScript. It specifies the compiler options and the files to include in the compilation.

- `README.md`: This file contains the documentation for the project.

## Getting Started

To run the client application, follow these steps:

1. Install the dependencies by running `npm install` in the root directory.
2. Start the development server by running `npm start`.
3. Open your browser and navigate to `http://localhost:3000` to view the application.

```

This file is intentionally left blank.