import { GeistSans } from "geist/font/sans"
import { type AppType } from "next/app"
import { useEffect } from "react"
import { useRouter } from "next/router"
import Script from "next/script"

import "~/styles/globals.css"
const GA_TRACKING_ID = "G-6S359M66FH"
const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <main className={GeistSans.className}>
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            />
            <Script
                id="gtag-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
          `,
                }}
            />
            <Component {...pageProps} />
        </main>
    )
}

export default MyApp
