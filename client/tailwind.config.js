/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Menargetkan semua file React di dalam folder src
    "./public/index.html", // Jika menggunakan kelas Tailwind di index.html
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};


