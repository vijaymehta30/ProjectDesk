import { useEffect, useState } from "react"
import type { Override } from "framer"

export function PopupOnView(): Override {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const element = document.querySelector(
            '[data-framer-name="Page"]'
        )

        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                setVisible(entry.isIntersecting)
            },
            {
                threshold: 0.5,
            }
        )

        observer.observe(element)

        return () => observer.disconnect()
    }, [])

    return {
        animate: visible
            ? {
                  opacity: 1,
                  y: 0,
                  scale: 1,
              }
            : {
                  opacity: 0,
                  y: 50,
                  scale: 0.9,
              },

        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    }
}
