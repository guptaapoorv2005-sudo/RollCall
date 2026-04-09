import { useEffect } from 'react';
import Lenis from 'lenis';

export default function LenisScroll() {
    useEffect(() => {
        const supportsManualRestoration = 'scrollRestoration' in window.history;
        const previousRestoration = supportsManualRestoration
            ? window.history.scrollRestoration
            : null;

        if (supportsManualRestoration) {
            window.history.scrollRestoration = 'manual';
        }

        const lenis = new Lenis({
            duration: 1.2,
            smoothWheel: true,
            smoothTouch: false,
            anchors: true,
        });

        // Ensure reload starts at the top instead of restoring the old scroll position.
        window.scrollTo(0, 0);
        requestAnimationFrame(() => {
            lenis.scrollTo(0, { immediate: true });
        });

        const raf = (time) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
        };

        requestAnimationFrame(raf);

        return () => {
            if (supportsManualRestoration && previousRestoration !== null) {
                window.history.scrollRestoration = previousRestoration;
            }

            lenis.destroy();
        };
    }, []);

    return null;
}
