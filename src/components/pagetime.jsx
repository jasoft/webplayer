import { useEffect, useState } from "react"

export function PageTimeTracker({ isPlaying }) {
    const [timeSpent, setTimeSpent] = useState(0)
    const [totalTimeSpent, setTotalTimeSpent] = useState(0) // 新增状态变量

    console.log("isplaying", isPlaying)
    useEffect(() => {
        const today = new Date().toISOString().slice(0, 10)
        const storageKey = `timeSpentOn${today}`

        // 从本地存储获取今天的累计时间
        const savedTime = parseInt(localStorage.getItem(storageKey), 10) || 0
        setTimeSpent(savedTime)

        let interval
        if (isPlaying) {
            interval = setInterval(() => {
                setTimeSpent((prevTime) => {
                    const newTime = prevTime + 1
                    localStorage.setItem(storageKey, newTime.toString())

                    // 同时更新总时间
                    const newTotalTime = sumTotalTime()
                    setTotalTimeSpent(newTotalTime)

                    return newTime
                })
            }, 1000)
        }

        return () => clearInterval(interval)

        function sumTotalTime() {
            let totalSpentTime = 0
            Object.keys(localStorage).forEach((key) => {
                if (key.startsWith("timeSpentOn")) {
                    // 累加找到的时间值
                    const timeValue =
                        parseInt(localStorage.getItem(key), 10) || 0
                    totalSpentTime += timeValue
                }
            })
            // 从本地存储获取总时间
            const savedTotalTime = totalSpentTime
            return savedTotalTime
        }
    }, [isPlaying])

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = totalSeconds % 60

        return `${hours}小时 ${minutes}分钟 ${seconds}秒`
    }

    // 显示总时间
    return (
        <>
            今天 {formatTime(timeSpent)}, 总计 {formatTime(totalTimeSpent)}
        </>
    )
}
