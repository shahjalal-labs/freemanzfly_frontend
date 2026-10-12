import logo from "@/assets/home/logo.png";
// import { AuthSync } from "@/components/auth/AuthSync";
import type { Metadata } from "next";
import Script from "next/script";
// import { Poppins } from "next/font/google";
import { AuthSync } from "@/components/auth/AuthSync";
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "./providers/providers";

export const metadata: Metadata = {
  title: "FreemanZ LLC",
  description:
    "Welcome to FreemanZ LLC.Shop Now & Get All Your Favorite Products at Amazing Discounts!",
  icons: {
    icon: logo.src,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // _app.js or root layout
  if (typeof window !== "undefined") {
    window.addEventListener("error", (e) => {
      const chunkFailed = /Loading chunk \d+ failed/.test(e.message);
      if (chunkFailed) {
        console.warn("Chunk load failed, reloading...");
        window.location.reload();
      }
    });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FreemanZ LLC",
    url: "https://freemanzllc.com",
    description:
      "Shop Now & Get All Your Favorite Products at Amazing Discounts!",
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={` `}>
        {/* Meta Pixel Code */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '2229463624498226');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2229463624498226&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}

        {/* <NavBar /> */}
        <Providers>
          <AuthSync />
          {children}
        </Providers>
        <Toaster />

        {/* <Footer /> */}
      </body>
    </html>
  );
}
