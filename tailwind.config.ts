import { frostedThemePlugin } from "frosted-ui/tailwind-plugin";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/frosted-ui/dist/**/*.js",
  ],
  plugins: [frostedThemePlugin],
} satisfies Config;
