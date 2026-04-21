import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({

    base: '/Aetheris_WEB.io/',
    
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        port: 3000,
        open: true,
        host: '0.0.0.0',
        cors: false,
        strictPort: true,
        hmr: {
            host: 'localhost'
        }
    },
    optimizeDeps: {
        include: ['three']
    },
    build: {
        sourcemap: false,
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        },
        reportCompressedSize: false
    }
});