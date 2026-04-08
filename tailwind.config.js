import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: {
                  50:  '#E0FEFF',
                  100: '#B8FDFF',
                  200: '#8FFDFF',
                  300: '#66FCFE',
                  400: '#3DFCFD',
                  500: '#03FDFC', // base
                  600: '#03C6C6',
                  700: '#039999',
                  800: '#026B6B',
                  900: '#014040'
                },
                secondary: {
                  50:  '#E6FFFF',
                  100: '#CCFFFF',
                  200: '#99FFFF',
                  300: '#66FFFF',
                  400: '#33FFFF',
                  500: '#03FDFC',
                  600: '#03C0C0',
                  700: '#028E8E',
                  800: '#025D5D',
                  900: '#013333'
                },
                neutral: {
                  50:  '#F2FEFE',
                  100: '#D9FDFD',
                  200: '#BFFDFD',
                  300: '#A6FCFC',
                  400: '#8CFBFB',
                  500: '#72FAFA',
                  600: '#59CACA',
                  700: '#409999',
                  800: '#276969',
                  900: '#0E3939'
                },
                beige: {
                  50:  '#E8FFFF',
                  100: '#D1FEFE',
                  200: '#AAFEFE',
                  300: '#83FDFD',
                  400: '#5CFCFC',
                  500: '#35FBFB',
                  600: '#1BC7C7',
                  700: '#149696',
                  800: '#0D6464',
                  900: '#063232'
                }
              }
              
            
            
        },
    },

    plugins: [forms],
};
