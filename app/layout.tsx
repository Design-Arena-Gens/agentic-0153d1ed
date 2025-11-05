"use client";

import "./globals.css";
import type { ReactNode } from "react";

const title = "Self-Calling Agent";
const description =
  "An autonomous self-calling AI agent that loops through thought, action, and reflection to achieve goals without manual intervention.";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22><path fill='%23ffffff' d='M5 16a11 11 0 0 1 19-7l1-1 2 2-1 1a11 11 0 0 1-19 7c0 1 .8 2 2 2v3c-3 0-6-3-6-7Zm11-9a9 9 0 0 0 0 18 9 9 0 0 0 0-18Zm-1 4 6 5-6 5v-3.8l-2.4 1.9-1.2-1.6 3.6-2.7V11Z'/></svg>" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
