import { useEffect, useState } from "react"

export function PageTimeTracker({ isPlaying }) {
    const [timeSpent, setTimeSpent] = useState(0)
    console.log("isplaying", isPlaying)
    useEffect(() => {
        // 获取今天的日期作为键
        const today = new Date().toISOString().slice(0, 10)
        const storageKey = `timeSpentOn${today}`

        // 从本地存储获取今天的累计时间
        const savedTime = parseInt(localStorage.getItem(storageKey), 10) || 0
        setTimeSpent(savedTime)

        // 每秒更新时间
        let interval
        if (isPlaying) {
            interval = setInterval(() => {
                setTimeSpent((prevTime) => {
                    const newTime = prevTime + 1
                    localStorage.setItem(storageKey, newTime.toString())
                    return newTime
                })
            }, 1000)
        }

        // 清除定时器
        return () => clearInterval(interval)
    }, [isPlaying])

    // 格式化时间显示
    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = totalSeconds % 60

        return `${hours}小时 ${minutes}分钟 ${seconds}秒`
    }

    return <>{formatTime(timeSpent)}</>
}
