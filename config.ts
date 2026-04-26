// config.ts
type Environment = 'development' | 'production';

const ENV: Environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';

interface Config {
  apiUrl: string;
  socketUrl: string;
}

const AZURE_API = 'https://imlocl-backend-api.happysmoke-3977f0fa.centralindia.azurecontainerapps.io/api';
const AZURE_SOCKET = 'https://imlocl-backend-api.happysmoke-3977f0fa.centralindia.azurecontainerapps.io';

const configs: Record<Environment, Config> = {
  development: {
    // Point dev at Azure — run `npx ts-node src/server.ts` locally if you want local dev
    apiUrl: AZURE_API,
    socketUrl: AZURE_SOCKET,
  },
  production: {
    apiUrl: AZURE_API,
    socketUrl: AZURE_SOCKET,
  },
};

export const config = configs[ENV];