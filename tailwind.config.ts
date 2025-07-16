import type { Config } from 'tailwindcss'
import aspectRatio from '@tailwindcss/aspect-ratio'

const config: Config = {
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: 'hsl(var(--primary))',
      },
      borderRadius: {
        lg: 'var(--radius)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
    },
  },
  plugins: [aspectRatio],
}

export default config
