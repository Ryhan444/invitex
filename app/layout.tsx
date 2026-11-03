import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Inviteflix | Cinematic Digital Invitations",
    template: "%s | Inviteflix",
  },
  description:
    "Netflix-style digital invitations for weddings, birthdays and special events, with a cinematic hero banner, live guestbook, RSVP and digital gifts.",
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
    <html lang="en" className="dark scroll-smooth">
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

