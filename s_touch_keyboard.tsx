import { useEffect, useRef } from "react"
import type { Override } from "framer"

export function OnePageScroll(): Override {
    const locked = useRef(false)
    const touchStartY = useRef(0)

    useEffect(() => {
        const sections = Array.from(
            document.querySelectorAll(
                '[data-framer-name="Page"]'
            )
        ) as HTMLElement[]

        if (sections.length === 0) return

        // Find current section
        const getCurrentPage = () => {
            const scrollY = window.scrollY

            let current = 0
            let closest = Infinity

            sections.forEach((section, index) => {
                const distance = Math.abs(
                    section.offsetTop - scrollY
                )

                if (distance < closest) {
                    closest = distance
                    current = index
                }
            })

            return current
        }

        // Main page-changing function
        const goToPage = (direction: number) => {
            if (locked.current) return

            locked.current = true

            const current = getCurrentPage()

            const next = Math.max(
                0,
                Math.min(
                    current + direction,
                    sections.length - 1
                )
            )

            window.scrollTo({
                top: sections[next].offsetTop,
                behavior: "smooth",
            })

            // Prevent multiple changes
            setTimeout(() => {
                locked.current = false
            }, 800)
        }

        // =========================
        // MOUSE WHEEL
        // =========================

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault()

            if (Math.abs(e.deltaY) < 10) return

            if (e.deltaY > 0) {
                goToPage(1)
            } else {
                goToPage(-1)
            }
        }

        // =========================
        // TOUCH
        // =========================

        const handleTouchStart = (e: TouchEvent) => {
            touchStartY.current =
                e.touches[0].clientY
        }

        const handleTouchEnd = (e: TouchEvent) => {
            const touchEndY =
                e.changedTouches[0].clientY

            const difference =
                touchStartY.current - touchEndY

            // Ignore small movements
            if (Math.abs(difference) < 50) return

            if (difference > 0) {
                // Swipe UP
                goToPage(1)
            } else {
                // Swipe DOWN
                goToPage(-1)
            }
        }

        // =========================
        // KEYBOARD
        // =========================

        const handleKeyDown = (e: KeyboardEvent) => {

            // Next page
            if (
                e.key === "ArrowDown" ||
                e.key === "PageDown" ||
                e.key === " "
            ) {
                e.preventDefault()
                goToPage(1)
            }

            // Previous page
            else if (
                e.key === "ArrowUp" ||
                e.key === "PageUp"
            ) {
                e.preventDefault()
                goToPage(-1)
            }

            // Home
            else if (e.key === "Home") {
                e.preventDefault()

                if (locked.current) return

                locked.current = true

                window.scrollTo({
                    top: sections[0].offsetTop,
                    behavior: "smooth",
                })

                setTimeout(() => {
                    locked.current = false
                }, 800)
            }

            // End
            else if (e.key === "End") {
                e.preventDefault()

                if (locked.current) return

                locked.current = true

                window.scrollTo({
                    top:
                        sections[
                            sections.length - 1
                        ].offsetTop,
                    behavior: "smooth",
                })

                setTimeout(() => {
                    locked.current = false
                }, 800)
            }
        }

        // Register events
        window.addEventListener(
            "wheel",
            handleWheel,
            { passive: false }
        )

        window.addEventListener(
            "touchstart",
            handleTouchStart,
            { passive: true }
        )

        window.addEventListener(
            "touchend",
            handleTouchEnd,
            { passive: true }
        )

        window.addEventListener(
            "keydown",
            handleKeyDown
        )

        // Cleanup
        return () => {
            window.removeEventListener(
                "wheel",
                handleWheel
            )

            window.removeEventListener(
                "touchstart",
                handleTouchStart
            )

            window.removeEventListener(
                "touchend",
                handleTouchEnd
            )

            window.removeEventListener(
                "keydown",
                handleKeyDown
            )
        }
    }, [])

    return {}
}
