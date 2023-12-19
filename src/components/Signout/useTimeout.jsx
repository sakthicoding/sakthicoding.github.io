import { useEffect, useRef } from "react";

export default function useTimeout(callback, delay) {
    const stableCalback = useRef(callback);

    useEffect(() => { stableCalback.current = callback }, [callback]);

    useEffect(() => {
        const tick = () => stableCalback.current();

        if (typeof delay !== 'number') return;
        const t = setTimeout(tick, delay);
        return () => clearTimeout(t);
    }, [delay])

}