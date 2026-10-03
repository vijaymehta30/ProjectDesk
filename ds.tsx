import { motion, useInView, animate } from "framer-motion"
import { useEffect, useRef, ComponentType } from "react"

// --- CONTROLS: Tweak these to change the feel ---
const CONFIG = {
    duration: 1.4, // Seconds (Increase for slower, "lazier" scroll)
    ease: [0.22, 1, 0.36, 1], // [x1, y1, x2, y2] - This is "Quartic Out" (very smooth start)
    opacityDuration: 1.0, // How fast the fade-in happens
    yOffset: 0, // How much the section "slides up" during fade
}

export function withControlledSnap(
    Component: ComponentType<any>
): ComponentType {
    return (props: any) => {
        const containerRef = useRef<HTMLDivElement>(null)
        const isScrolling = useRef(false)
        const currentIndex = useRef(0)

        useEffect(() => {
            const cont = containerRef.current
            if (!cont) return

            const isPhoneLikeTouchDevice =
                typeof window !== "undefined" &&
                window.matchMedia &&
                window.matchMedia("(max-width: 810px) and (pointer: coarse)")
                    .matches

            // On phones/small phones, keep native touch scrolling.
            if (isPhoneLikeTouchDevice) return

            const handleWheel = (e: WheelEvent) => {
                e.preventDefault()
                if (isScrolling.current) return

                const direction = e.deltaY > 0 ? 1 : -1
                const totalSections = cont.children.length
                const nextIndex = Math.max(
                    0,
                    Math.min(
                        currentIndex.current + direction,
                        totalSections - 1
                    )
                )

                if (nextIndex !== currentIndex.current) {
                    isScrolling.current = true
                    currentIndex.current = nextIndex

                    const targetScroll = nextIndex * cont.offsetHeight

                    // Custom Framer Motion Animation for the Scroll Position
                    animate(cont.scrollTop, targetScroll, {
                        duration: CONFIG.duration,
                        ease: CONFIG.ease as any,
                        onUpdate: (val) => (cont.scrollTop = val),
                        onComplete: () => {
                            isScrolling.current = false
                        },
                    })
                }
            }

            cont.addEventListener("wheel", handleWheel, { passive: false })
            return () => cont.removeEventListener("wheel", handleWheel)
        }, [])

        return (
            <Component
                {...props}
                ref={containerRef}
                style={{
                    ...props.style,
                    overflowY:
                        typeof window !== "undefined" &&
                        window.matchMedia &&
                        window.matchMedia(
                            "(max-width: 810px) and (pointer: coarse)"
                        ).matches
                            ? "auto"
                            : "hidden",
                    WebkitOverflowScrolling: "touch",
                    touchAction: "pan-y",
                    position: "relative",
                }}
            />
        )
    }
}

export function withSectionEffects(Component): ComponentType {
    return (props: any) => {
        const ref = useRef(null)
        const isInView = useInView(ref, { amount: 0.3 })

        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: CONFIG.yOffset }}
                animate={
                    isInView
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: CONFIG.yOffset }
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
                    style={{ ...props.style, width: "100%", height: "100%" }}
                />
            </motion.div>
        )
    }
}
