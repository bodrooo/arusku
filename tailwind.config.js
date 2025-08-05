import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.vue',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Roboto', ...defaultTheme.fontFamily.sans],
            },
            fontSize: {
                title: "20px",
                subtitle: "15px",
                subtext: "14px",
                paragraph: "13px"
            },
            colors: {
                main: {
                    100: "#F1FFF3",
                    200: "#DFF7E2",
                    300: "#00D09E",
                    400: "#0E3E3E",
                    500: "#093030",
                    600: "#052224",
                    700: "#031314",
                }
            }
        },
    },

    plugins: [forms],
};
