import { type Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"

export default {
    content: ["./src/**/*.tsx", "./src/**/*.jsx"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-geist-sans)", ...fontFamily.sans],
            },
        },
    },
    plugins: [],
} satisfies Config
