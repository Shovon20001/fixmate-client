import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: { default: "FixMate - Device & Home Appliance Repair", template: "%s | FixMate" },
  description: "Book verified technicians for phone, laptop, AC, fridge, TV and washing machine repair. Track every job and pay only after the work is done.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700&family=Instrument+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
