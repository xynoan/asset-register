import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    server: {
        host: '0.0.0.0', // Allow access from network IP
        cors: {
            origin: "*", // Allow all origins
            credentials: true,
        },
        port: 5173,
        hmr: {
            host: '192.168.100.169',
        },
    },
    plugins: [
        laravel({
            input: ['resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
});
