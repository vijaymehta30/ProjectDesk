import { useEffect, useRef } from "react"
import type { Override } from "framer"

export function OnePageScroll(): Override {
    const locked = useRef(false)

    useEffect(() => {
        const sections = Array.from(
            document.querySelectorAll('[data-framer-name="Page"]')
        ) as HTMLElement[]

        if (sections.length === 0) {
            console.log("No Page sections found")
            return
        }

        console.log("Found pages:", sections.length)

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault()

            if (locked.current) return

            locked.current = true

            const currentScroll = window.scrollY

            // Find which section we are currently closest to
            let currentIndex = 0
            let smallestDistance = Infinity

            sections.forEach((section, index) => {
                const distance = Math.abs(
                    section.offsetTop - currentScroll
                )

                if (distance < smallestDistance) {
                    smallestDistance = distance
                    currentIndex = index
                }
            })

            let nextIndex = currentIndex

            if (e.deltaY > 0) {
                nextIndex = Math.min(
                    currentIndex + 1,
                    sections.length - 1
                )
            } else if (e.deltaY < 0) {
                nextIndex = Math.max(
                    currentIndex - 1,
                    0
                )
            }

            window.scrollTo({
                top: sections[nextIndex].offsetTop,
                behavior: "smooth",
            })

            setTimeout(() => {
                locked.current = false
            }, 800)
        }

        window.addEventListener("wheel", handleWheel, {
            passive: false,
        })

        return () => {
            window.removeEventListener("wheel", handleWheel)
        }
    }, [])

    return {}
}
