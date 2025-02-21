import type { Metadata } from "next";
import "./globals.css";
import {ReactNode} from "react";



export const metadata: Metadata = {
  title: "Test App",
  description: "Test App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        {children}
      </body>
    </html>
  );
}
