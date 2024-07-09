import Head from "next/head"
import SimpleVideoPlayer from "./player"
import { ChatBot } from "~/components/chatbot"
import { useRouter } from "next/router"
import { useEffect } from "react"

export default function HomePage() {
    //    const router = useRouter()

    // useEffect(() => {
    //     if (!router.isReady) return
    //     // 检查 URL 查询参数中的 id
    //     if (router.query.id !== "wzh922") {
    //         // 如果 id 不是 wzh922，可以重定向或显示错误
    //         // 例如，重定向到首页
    //         router.push("/404")
    //     }
    // }, [router, router.isReady])
    return (
        <>
            <Head>
                <title>985 网课学习系统</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
                <meta name="description" content="985 网课学习系统" />
                <meta name="keywords" content="985 网课学习系统" />
                <meta name="author" content="985 网课学习系统" />
                <meta name="robots" content="index, follow" />
                <meta name="googlebot" content="index, follow" />
                <meta name="google" content="notranslate" />
                <meta name="format-detection" content="telephone=no" />
                <meta name="format-detection" content="email=no" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta
                    name="apple-mobile-web-app-status-bar-style"
                    content="black"
                />
                <meta
                    name="apple-mobile-web-app-title"
                    content="985 网课学习系统"
                />
                <meta name="application-name" content="985 网课学习系统" />
                <meta name="msapplication-TileColor" content="#000000" />
                <meta
                    name="msapplication-TileImage"
                    content="/mstile-144x144.png"
                />
                <meta name="msapplication-navbutton-color" content="#000000" />
                <meta name="apple-mobile-web-app-status-bar-style" />
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
}
