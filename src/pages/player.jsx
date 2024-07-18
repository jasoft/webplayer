import { useEffect, useState, useRef } from "react"
import axios from "axios"
import path from "path"
import { PageTimeTracker } from "~/components/pagetime"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"

import { zhCN } from "date-fns/locale"

function BooksSection() {
    return (
        <div className="inline-block">
            <Link
                href="https://soj.myds.me:5011/books/2024版《高中知识清单》数学（新教材版）.pdf"
                target="_blank"
                className="flex cursor-pointer items-center rounded-lg border-none bg-transparent p-2 outline-none transition-shadow duration-300 ease-in-out hover:shadow-lg"
            >
                <Image
                    src="https://soj.myds.me:5011/books/2024版《高中知识清单》数学（新教材版）.png"
                    width={128}
                    height={128}
                    className="rounded-lg shadow-xl"
                />
            </Link>
        </div>
    )
}
function HelpSection() {
    const [resultMessage, setResultMessage] = useState("")

    const requestForHelp = () => {
        axios
            .post("https://soj.myds.me:30100/message", {
                recipient: "爸爸",
                message: "王子菡需要你的帮助！",
            })
            .then((response) => {
                console.log("Help request sent successfully")
                setResultMessage("消息已发送，爸爸会联系你的！")
            })
            .catch((error) => {
                console.error("消息发送失败，请打电话", error)
                setResultMessage("消息发送失败，请打电话")
            })
    }

    return (
        <>
            <div className="p-2 text-lg text-gray-500">
                参考资料书目可以点击查看PDF。如需帮助，请
                <button
                    className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                    onClick={requestForHelp}
                >
                    点这里
                </button>
                发送一条消息给爸爸。
            </div>
            {resultMessage && (
                <p
                    className={`mt-2 p-2 text-sm font-semibold ${resultMessage.includes("失败") ? "text-red-500" : "text-green-500"}`}
                >
                    {resultMessage}
                </p>
            )}
        </>
    )
}

export default function SimpleVideoPlayer({ listname }) {
    const [videos, setVideos] = useState([])
    const [videoSrc, setVideoSrc] = useState("")
    const [currentVideo, setCurrentVideo] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [blessing, setBlessing] = useState("hello")
    const videoRef = useRef()
    let playStartTime = 0 // 记录播放开始时间
    useEffect(() => {
        console.log("simpleplayer called")

        axios
            .get(`/api/video?listname=${listname}`)
            .then((response) => {
                setVideos(response.data)
            })
            .catch((error) => {
                console.error("Error fetching videos:", error)
            })

        // axios
        //     .post("/api/ai", {
        //         q: "我叫王子菡，我还有不到一年就高考了，我数学很差，你能给我一些鼓励和祝福吗？用中文回答我的问题。200 字左右",
        //     })
        //     .then((response) => {
        //         console.log(response.data.response.choices[0].message.content)
        //         setBlessing(response.data.response.choices[0].message.content)
        //     })
    }, [])

    const handleVideoClick = (video) => {
        if (video.url) setVideoSrc(video.url)
        else {
            setVideoSrc(path.join("/videos", listname, video.filename))
            axios
                .post("https://soj.myds.me:30100/message", {
                    recipient: "爸爸",
                    message: "王子菡开始观看视频：" + video.caption,
                })
                .then((response) => {
                    console.log("Help request sent successfully")
                })
                .catch((error) => {
                    console.error("消息发送失败，请打电话", error)
                })
        }
        setCurrentVideo(video)
        // 更新点击次数
        window.dataLayer.push({
            event: "videoClick",
            videoName: video.caption,
        })
        const clicks = JSON.parse(localStorage.getItem("videoClicks") || "{}")
        clicks[video.filename] = (clicks[video.filename] || 0) + 1
        localStorage.setItem("videoClicks", JSON.stringify(clicks))

        const lastPlayTime =
            JSON.parse(localStorage.getItem("lastPlayTime")) || {}
        lastPlayTime[video.filename] = Date.now()
        localStorage.setItem("lastPlayTime", JSON.stringify(lastPlayTime))
    }

    const handleCanPlay = () => {
        if (videoRef.current) {
            videoRef.current.play()
            console.log("playing video")
        }
    }
    // 监听视频播放和暂停事件
    useEffect(() => {
        const videoElement = videoRef.current
        if (!videoElement) return
        // 设置一个状态来跟踪视频是否正在播放
        const handlePlay = () => {
            setIsPlaying(true)
            console.log("player playing")
            playStartTime = Date.now() // 记录播放开始时间
        }

        const handlePause = () => {
            setIsPlaying(false)
            console.log("player paused")
            const playTime = Date.now() - playStartTime // 计算播放时间
            window.dataLayer.push({
                event: "videoPause",
                videoName: currentVideo ? currentVideo.caption : "",
                playTime: playTime,
            })
        }

        videoElement.addEventListener("play", handlePlay)
        videoElement.addEventListener("pause", handlePause)

        return () => {
            videoElement.removeEventListener("play", handlePlay)
            videoElement.removeEventListener("pause", handlePause)
        }
    }, [currentVideo])

    return (
        <div className="flex h-screen">
            <div className="w-1/4 overflow-y-auto bg-white p-4 shadow-lg">
                {videos.map((video) => {
                    // 获取点击次数
                    const clicks = JSON.parse(
                        localStorage.getItem("videoClicks") || "{}",
                    )
                    const clickCount = clicks[video.filename] || 0

                    const lastPlayTime = JSON.parse(
                        localStorage.getItem("lastPlayTime") || "{}",
                    )
                    const lastPlay = lastPlayTime[video.filename] || null

                    return (
                        <div
                            key={video.filename}
                            onClick={() => handleVideoClick(video)}
                            className={`cursor-pointer py-2 ${currentVideo === video ? "bg-blue-200" : clickCount > 0 ? "bg-green-200" : "hover:bg-gray-200"}`}
                        >
                            {video.caption}{" "}
                            <span className="text-xs text-gray-500">
                                {lastPlay
                                    ? `${formatDistanceToNow(lastPlay, {
                                          addSuffix: true,
                                          locale: zhCN,
                                      })}`
                                    : ""}
                            </span>
                        </div>
                    )
                })}
            </div>
            <div className="w-3/4 overflow-y-auto p-2">
                <div className="p-2 pb-4 pt-4 text-4xl">
                    {currentVideo?.caption}
                </div>
                <video
                    ref={videoRef}
                    id="videoPlayer"
                    controls
                    src={videoSrc}
                    onCanPlay={handleCanPlay}
                    className="w-full p-2"
                ></video>
                <div className="p-2 text-lg text-gray-700">
                    学习时间：
                    <PageTimeTracker isPlaying={isPlaying} />
                </div>

                <h3 className="p-2 text-2xl font-bold text-gray-700">
                    参考资料
                </h3>
                <BooksSection />
                <h3 className="p-2 text-2xl font-bold text-gray-700">帮助</h3>
                <HelpSection />
            </div>
        </div>
    )
}
