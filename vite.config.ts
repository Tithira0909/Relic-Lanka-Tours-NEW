import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');

    // Attempt to load server PORT from server/.env to configure proxy dynamically
    let backendPort = 3001;
    const serverEnvPath = path.resolve(__dirname, 'server/.env');
    try {
      if (fs.existsSync(serverEnvPath)) {
          const serverEnvConfig = dotenv.parse(fs.readFileSync(serverEnvPath));
          if (serverEnvConfig.PORT) {
              backendPort = parseInt(serverEnvConfig.PORT, 10);
              console.log(`[Vite] Loaded backend port ${backendPort} from server/.env`);
          }
      }
    } catch (e) {
      console.warn("[Vite] Failed to load server/.env, defaulting proxy to port 3001", e);
    }

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: `http://localhost:${backendPort}`,
            changeOrigin: true,
          },
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
