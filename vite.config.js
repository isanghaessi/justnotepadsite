import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';
import {robots} from "vite-plugin-robots";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), svgr(), robots()],
    build: {
        target: ['es2015']
    },
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    css: {
        modules: {
            scopeBehaviour: 'local',
            localsConvention: 'camelCase'
        }
    },
})
