"use client"

import { ThemeProvider } from "./theme-provider"
import { CartProvider } from "./cart-provider"
import { Toaster } from "sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CartProvider>
        {children}
      </CartProvider>
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: "Inter, system-ui, sans-serif",
          },
        }}
      />
    </ThemeProvider>
  )
}
