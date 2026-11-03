import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inviteflix - Cinematic Digital Invitation Platform",
  description:
    "Platform undangan digital multi-acara dengan estetika visual ala Netflix. Modern dark mode, cinematic hero banner, live interactive guestbook, dan box office gift.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cinzel:wght@600;700;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-netflix-black text-white antialiased selection:bg-netflix-red selection:text-white min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}

