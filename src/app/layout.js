import { ThemeProvider } from '@mui/material/styles'
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
import NextTopLoader from 'nextjs-toploader'
import { QueryClientProvider } from '@tanstack/react-query'
import theme, { queryClient } from '@/theme'
import { Roboto } from 'next/font/google'

import './globals.scss'

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--open-font-family',
})

export const metadata = {
  title: 'OpenInterX AI',
  description: 'OpenInterX AI',
  icons: '/favicon.svg',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="/flexible.js" />
      </head>
      <body className={roboto.className}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <NextTopLoader
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              easing="ease"
              speed={200}
              shadow="0 0 10px #2299DD,0 0 5px #2299DD"
              color="var(--mui-palette-primary-main)"
              showSpinner={false}
            />
            <InitColorSchemeScript attribute="data" />
            <main> {children}</main>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
