import React, { useEffect, useState } from 'react';
import '../styles/splash.css';

const SplashScreen = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Show for 2.5 seconds then fade out
        const timer = setTimeout(() => {
            setIsVisible(false);
            // Wait for fade animation to finish before calling onComplete
            setTimeout(onComplete, 800);
        }, 2200);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className={`splash-overlay ${!isVisible ? 'hidden' : ''}`}>
            <div className="brand-container">
                <span className="brand-prefix">By</span>
                <h1 className="brand-name">Vendelocky</h1>
            </div>
        </div>
    );
};

export default SplashScreen;
