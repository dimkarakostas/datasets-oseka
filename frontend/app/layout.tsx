import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { FooterNav } from "@/components/footer-nav"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin", "greek"] })

export const metadata = {
  title: "Επενδύσεις ΟΣΕΚΑ (UCITS)",
  description: "Δεδομένα για τις επενδύσεις φορολογικών κατοίκων Ελλάδας σε ΟΣΕΚΑ (UCITS)",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="el" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <FooterNav />
        </ThemeProvider>
        <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "ead120e6fd414376a105b6d230760263"}'></script>
      </body>
    </html>
  )
}
