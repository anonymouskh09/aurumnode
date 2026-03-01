/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './resources/**/*.blade.php',
        './resources/**/*.js',
        './resources/**/*.jsx',
        './resources/css/app.css',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0fdfa',
                    500: '#0d9488',
                    600: '#0ea5e9',
                    700: '#0f766e',
                },
            },
        },
    },
    plugins: [],
};
