"use client"

import { ThemeProvider } from "./theme-provider"
import { AuthProvider } from "./auth-provider"
import { CartProvider } from "./cart-provider"
import { Toaster } from "sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
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
