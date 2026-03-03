// config.ts
type Environment = 'development' | 'production';

const ENV: Environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';

interface Config {
  apiUrl: string;
  socketUrl: string;
}

const configs: Record<Environment, Config> = {
  development: {
    apiUrl: 'http://localhost:8080/api',
    socketUrl: 'http://localhost:8080',
  },
  production: {
    apiUrl: 'https://imlocl-backend-api.happysmoke-3977f0fa.centralindia.azurecontainerapps.io/api',
    socketUrl: 'https://imlocl-backend-api.happysmoke-3977f0fa.centralindia.azurecontainerapps.io',
  },
};

export const config = configs[ENV];