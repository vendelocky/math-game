import React from 'react';
import '../styles/components.css';

const Button = ({ children, onClick, variant = 'primary', disabled, className = '' }) => {
    return (
        <button
            className={`btn btn-${variant} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
