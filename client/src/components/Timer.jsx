import React, { useEffect, useState } from 'react';

const Timer = ({ duration, onTimeUp, active }) => {
    const [timeLeft, setTimeLeft] = useState(duration);

    const onTimeUpRef = React.useRef(onTimeUp);

    useEffect(() => {
        onTimeUpRef.current = onTimeUp;
    }, [onTimeUp]);

    useEffect(() => {
        setTimeLeft(duration);
    }, [duration]);

    useEffect(() => {
        if (!active) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onTimeUpRef.current();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [active]);

    const percentage = (timeLeft / duration) * 100;

    return (
        <div style={{ width: '100%', maxWidth: '400px', height: '12px', background: '#ddd', borderRadius: '6px', overflow: 'hidden', border: '2px solid #333' }}>
            <div
                style={{
                    height: '100%',
                    width: `${percentage}%`,
                    background: percentage < 20 ? 'var(--color-error)' : 'var(--color-secondary)',
                    transition: 'width 1s linear'
                }}
            />
        </div>
    );
};

export default Timer;
