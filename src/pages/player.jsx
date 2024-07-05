import { useEffect, useState, useRef } from "react"
import axios from "axios"
import path from "path"

export default function SimpleVideoPlayer({ listname }) {
  const [videos, setVideos] = useState([])
  const [videoSrc, setVideoSrc] = useState("")
  const [currentVideo, setCurrentVideo] = useState(null)
  const videoRef = useRef()
  let playStartTime = 0 // 记录播放开始时间

  useEffect(() => {
    axios
      .get(`/api/video?listname=${listname}`)
      .then((response) => {
        setVideos(response.data)
      })
      .catch((error) => {
        console.error("Error fetching videos:", error)
      })
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

    const handlePlay = () => {
      playStartTime = Date.now() // 记录播放开始时间
    }

    const handlePause = () => {
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
          const clicks = JSON.parse(localStorage.getItem("videoClicks") || "{}")
          const clickCount = clicks[video.filename] || 0

          return (
            <div
              key={video.filename}
              onClick={() => handleVideoClick(video)}
              className={`cursor-pointer py-2 ${currentVideo === video ? "bg-blue-200" : clickCount > 0 ? "bg-green-200" : "hover:bg-gray-200"}`}
            >
              {video.caption}{" "}
              <span className="text-gray-500">({clickCount})</span>
            </div>
          )
        })}
      </div>
      <div className="w-3/4 overflow-y-auto">
        <div className="p-2 pb-4 pt-4 text-4xl">{currentVideo?.caption}</div>
        <video
          ref={videoRef}
          id="videoPlayer"
          controls
          src={videoSrc}
          onCanPlay={handleCanPlay}
          className="w-full p-2"
        ></video>
      </div>
    </div>
  )
}
