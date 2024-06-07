import fs from "fs"
import path from "path"
import ffmpeg from "fluent-ffmpeg"

export default async function handler(req, res) {
  // 指定视频文件所在的目录
  const listname = req.query.listname
  function getVideoDuration(filePath) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          reject(err)
        } else {
          const duration = metadata.format.duration || 0
          const hours = Math.floor(duration / 3600)
          const minutes = Math.floor((duration % 3600) / 60)
          const seconds = Math.floor(duration % 60)
          const formattedDuration = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
          resolve(formattedDuration)
        }
      })
    })
  }

  async function scanVideos() {
    const videos = []
    const files = fs.readdirSync(videoDir)

    for (const file of files) {
      if (path.extname(file) === ".mkv" || path.extname(file) === ".mp4") {
        const filePath = path.join(videoDir, file)
        const duration = await getVideoDuration(filePath)
        const videoData = {
          filename: file,
          caption: path.basename(file, path.extname(file)),
          duration: duration,
        }
        videos.push(videoData)
      }
    }

    return videos
  }

  const videoDir = path.join(process.cwd(), "public", "videos", listname)

  const videoJson = path.join(videoDir, "videos.json")
  res.setHeader("Content-Type", "application/json")

  // 如果视频数据文件不存在，重新扫描视频文件夹，生成视频数据文件
  if (!fs.existsSync(videoJson)) {
    const videos = await scanVideos()
    fs.writeFileSync(videoJson, JSON.stringify(videos, null, 2))
  }

  const videosData = fs.readFileSync(videoJson, "utf-8")
  const videosJson = JSON.parse(videosData)
  res.status(200).json(videosJson)
  return
}
