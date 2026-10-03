import { motion, useInView, animate } from "framer-motion"
import { useEffect, useRef, ComponentType } from "react"

const CONFIG = {
    duration: 1.4,
    ease: [0.22, 1, 0.36, 1],
    opacityDuration: 1.0,
    yOffset: 0,

    // Touch swipe sensitivity
    swipeThreshold: 50,
}

export function withControlledSnap(
    Component: ComponentType<any>
): ComponentType {
    return (props: any) => {
        const containerRef = useRef<HTMLDivElement>(null)

        const isScrolling = useRef(false)
        const currentIndex = useRef(0)
        const touchStartY = useRef(0)

        useEffect(() => {
            const cont = containerRef.current
            if (!cont) return

            const totalSections = cont.children.length

            const goToSection = (direction: number) => {
                if (isScrolling.current) return

                const nextIndex = Math.max(
                    0,
                    Math.min(
                        currentIndex.current + direction,
                        totalSections - 1
                    )
                )

                if (nextIndex === currentIndex.current) return

                isScrolling.current = true
                currentIndex.current = nextIndex

                const targetScroll =
                    nextIndex * cont.clientHeight

                animate(cont.scrollTop, targetScroll, {
                    duration: CONFIG.duration,
                    ease: CONFIG.ease as any,

                    onUpdate: (value) => {
                        cont.scrollTop = value
                    },

                    onComplete: () => {
                        cont.scrollTop = targetScroll
                        isScrolling.current = false
                    },
                })
            }

            // -------------------------
            // DESKTOP WHEEL
            // -------------------------

            const handleWheel = (e: WheelEvent) => {
                e.preventDefault()

                if (isScrolling.current) return

                const direction = e.deltaY > 0 ? 1 : -1

                goToSection(direction)
            }

            // -------------------------
            // TOUCH START
            // -------------------------

            const handleTouchStart = (e: TouchEvent) => {
                if (e.touches.length !== 1) return

                touchStartY.current = e.touches[0].clientY
            }

            // -------------------------
            // TOUCH END
            // -------------------------

            const handleTouchEnd = (e: TouchEvent) => {
                if (isScrolling.current) return

                const touchEndY = e.changedTouches[0].clientY

                const distance =
                    touchStartY.current - touchEndY

                // Ignore tiny movements
                if (
                    Math.abs(distance) <
                    CONFIG.swipeThreshold
                ) {
                    return
                }

                // Swipe UP = next section
                if (distance > 0) {
                    goToSection(1)
                }

                // Swipe DOWN = previous section
                else {
                    goToSection(-1)
                }
            }

            // -------------------------
            // EVENTS
            // -------------------------

            cont.addEventListener(
                "wheel",
                handleWheel,
                { passive: false }
            )

            cont.addEventListener(
                "touchstart",
                handleTouchStart,
                { passive: true }
            )

            cont.addEventListener(
                "touchend",
                handleTouchEnd,
                { passive: true }
            )

            return () => {
                cont.removeEventListener(
                    "wheel",
                    handleWheel
                )

                cont.removeEventListener(
                    "touchstart",
                    handleTouchStart
                )

                cont.removeEventListener(
                    "touchend",
                    handleTouchEnd
                )
            }
        }, [])

        return (
            <Component
                {...props}
                ref={containerRef}
                style={{
                    ...props.style,

                    width: "100%",
                    height: "100%",

                    overflowY: "hidden",

                    position: "relative",

                    touchAction: "none",
                }}
            />
        )
    }
}

export function withSectionEffects(
    Component: ComponentType<any>
): ComponentType {
    return (props: any) => {
        const ref = useRef(null)

        const isInView = useInView(ref, {
            amount: 0.3,
        })

        return (
            <motion.div
                ref={ref}
                initial={{
                    opacity: 0,
                    y: CONFIG.yOffset,
                }}
                animate={
                    isInView
                        ? {
                              opacity: 1,
                              y: 0,
                          }
                        : {
                              opacity: 0,
                              y: CONFIG.yOffset,
                          }
                }
                transition={{
                    duration: CONFIG.opacityDuration,
                    ease: "easeOut",
                }}
                style={{
                    width: "100%",
                    height: "100%",
                    flexShrink: 0,
                }}
            >
                <Component
                    {...props}
                    style={{
                        ...props.style,
                        width: "100%",
                        height: "100%",
                    }}
                />
            </motion.div>
        )
    }
}
