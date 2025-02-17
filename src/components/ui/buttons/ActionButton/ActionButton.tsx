import { ReactElement } from "react";

import styles from "./actionButton.module.css";

const ActionButton = ({
    text, 
    theme = "light", 
    size = "middle",
    action,
    disabled = false
}: {
    text: string,
    theme?: string,
    size?: "small" | "middle" | "big",
    action?: (e: React.MouseEvent<HTMLButtonElement>) => void,
    disabled?: boolean
}): ReactElement => {
    return (
        <button 
            disabled={disabled} 
            onClick={action}
            className={`${styles.btn} ${styles[theme]} ${styles[size]}`}
        >
            {text}
        </button>
    );
};

export default ActionButton;