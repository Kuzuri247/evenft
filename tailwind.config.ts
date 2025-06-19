import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: 'class', // Enables dark mode using a class
    content: ['./src/**/*.{html,ts,tsx}'], // Adjust paths to your project structure
    theme: {
        extend: {},
    },
    plugins: [],
};

export default config;