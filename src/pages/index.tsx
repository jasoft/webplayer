import Head from "next/head"
import SimpleVideoPlayer from "./player"
import { ChatBot } from "~/components/chatbot"
export default () => (
  <>
    <Head>
      <title>985 网课学习系统</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="description" content="985 网课学习系统" />
      <meta name="keywords" content="985 网课学习系统" />
      <meta name="author" content="985 网课学习系统" />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="google" content="notranslate" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="format-detection" content="email=no" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <meta name="apple-mobile-web-app-title" content="985 网课学习系统" />
      <meta name="application-name" content="985 网课学习系统" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
      <meta name="msapplication-navbutton-color" content="#000000" />
      <meta name="apple-mobile-web-app-status-bar-style" />
      {/* Google Tag Manager */}
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-6S359M66FH"
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-6S359M66FH');
          `,
        }}
      />
      {/* End Google Tag Manager */}
    </Head>

    <div className="flex justify-between">
      <div className="w-3/4">
        <SimpleVideoPlayer listname="【木东数学】高考数学总复习基础班" />
      </div>

      <div className="w-1/4 border-l border-dotted border-gray-500 ">
        <ChatBot />
      </div>
    </div>
  </>
)
