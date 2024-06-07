import { useEffect, useState, useRef } from "react"
import axios from "axios"
import path from "path"

export default function SimpleVideoPlayer({ listname }) {
  const [videos, setVideos] = useState([])
  const [videoSrc, setVideoSrc] = useState("")
  const [currentVideo, setCurrentVideo] = useState(null)
  const videoRef = useRef()

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
  }

  const handleCanPlay = () => {
    if (videoRef.current) {
      videoRef.current.play()
    }
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/4 overflow-y-auto bg-white p-4 shadow-lg">
        {videos.map((video) => (
          <div
            key={video.filename}
            onClick={() => handleVideoClick(video)}
            className={`cursor-pointer py-2 ${currentVideo === video ? "bg-blue-200" : "hover:bg-gray-200"}`}
          >
            {video.caption}
          </div>
        ))}
      </div>
      <div className="w-3/4 overflow-y-auto p-4">
        <h1 className="pb-3 text-center text-6xl">王家 985 网课学习系统</h1>
        <video
          ref={videoRef}
          id="videoPlayer"
          controls
          src={videoSrc}
          onCanPlay={handleCanPlay}
          className="w-full"
        ></video>
        <div className="pt-4 text-4xl">
          {currentVideo?.caption} - {currentVideo?.duration}
        </div>
      </div>
    </div>
  )
}
