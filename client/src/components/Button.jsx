import '../styles/components.css';
import { soundManager } from '../utils/sound';

const Button = ({ children, onClick, variant = 'primary', disabled, className = '' }) => {

    const handleClick = (e) => {
        soundManager.playClick();
        if (onClick) onClick(e);
    };

    return (
        <button
            className={`btn btn-${variant} ${className}`}
            onClick={handleClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
