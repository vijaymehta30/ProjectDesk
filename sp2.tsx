import { useEffect, useRef } from "react"
import { Override } from "framer"

export function PageScroll(): Override {
    const isScrolling = useRef(false)
    const currentPage = useRef(0)

    useEffect(() => {
        const pages = [
            document.querySelector('[data-framer-name="Page 1"]'),
            document.querySelector('[data-framer-name="Page 2"]'),
            document.querySelector('[data-framer-name="Page 3"]'),
            document.querySelector('[data-framer-name="Page 4"]'),
        ].filter(Boolean) as HTMLElement[]

        if (pages.length === 0) return

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault()

            if (isScrolling.current) return

            isScrolling.current = true

            if (e.deltaY > 0) {
                currentPage.current = Math.min(
                    currentPage.current + 1,
                    pages.length - 1
                )
            } else {
                currentPage.current = Math.max(
                    currentPage.current - 1,
                    0
                )
            }

            pages[currentPage.current].scrollIntoView({
                behavior: "smooth",
                block: "start",
            })

            setTimeout(() => {
                isScrolling.current = false
            }, 700)
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
