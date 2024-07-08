import { useEffect, useState, useRef } from "react"
import axios from "axios"
import path from "path"
import { PageTimeTracker } from "~/components/pagetime"
import Link from "next/link"

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
                如需帮助，请联系爸爸.
                <button
                    className="ml-2 mr-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                    onClick={requestForHelp}
                >
                    点这里
                </button>
                发送一条消息给爸爸。
            </div>
            <div className="p-2 text-lg text-red-500">{resultMessage}</div>
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
        else setVideoSrc(path.join("/videos", listname, video.filename))
        setCurrentVideo(video)
        // 更新点击次数
        window.dataLayer.push({
            event: "videoClick",
            videoName: video.caption,
        })
        const clicks = JSON.parse(localStorage.getItem("videoClicks") || "{}")
        clicks[video.filename] = (clicks[video.filename] || 0) + 1
        localStorage.setItem("videoClicks", JSON.stringify(clicks))
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

                    return (
                        <div
                            key={video.filename}
                            onClick={() => handleVideoClick(video)}
                            className={`cursor-pointer py-2 ${currentVideo === video ? "bg-blue-200" : clickCount > 0 ? "bg-green-200" : "hover:bg-gray-200"}`}
                        >
                            {video.caption}{" "}
                            <span className="text-gray-500">
                                ({clickCount})
                            </span>
                        </div>
                    )
                })}
            </div>
            <div className="w-3/4 overflow-y-auto">
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
                <div className="p-2 text-lg text-gray-500">
                    今天学习时间：
                    <PageTimeTracker isPlaying={isPlaying} />
                </div>
                <h3 className="p-2 text-2xl font-bold text-gray-700">
                    参考资料
                </h3>
                <div className="p-2 text-lg text-blue-500 underline">
                    <Link
                        href="https://soj.myds.me:5011/books/2024%E7%89%88%E3%80%8A%E9%AB%98%E4%B8%AD%E7%9F%A5%E8%AF%86%E6%B8%85%E5%8D%95%E3%80%8B%E6%95%B0%E5%AD%A6%EF%BC%88%E6%96%B0%E6%95%99%E6%9D%90%E7%89%88%EF%BC%89.pdf"
                        target="_blank"
                    >
                        知识清单（数学）
                    </Link>
                </div>
                <HelpSection />
            </div>
        </div>
    )
}
