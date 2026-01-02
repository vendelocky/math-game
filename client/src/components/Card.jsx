import React from 'react';
import '../styles/components.css';

const Card = ({ text, onClick, state = 'default', disabled }) => {
    return (
        <button
            className={`game-card ${state}`}
            onClick={onClick}
            disabled={disabled}
            aria-label={`Select ${text}`}
        >
            {text}
        </button>
    );
};

export default Card;
