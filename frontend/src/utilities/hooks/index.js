import { useState, useEffect } from 'react';

const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

export const useCurrentWidth = () => {
    const [width, setWidth] = useState(getWindowWidth());

    useEffect(() => {

        let timeoutId = null;
        const resizeListener = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => setWidth(getWindowWidth()), 50);
        };
        window.addEventListener('resize', resizeListener);
    
        return () => {
            window.removeEventListener('resize', resizeListener);
        };
    }, []);

    return width;
};
