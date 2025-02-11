import { ReactNode } from "react";

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
    size?: "middle" | "big",
    action?: (e: React.MouseEvent<HTMLButtonElement>) => void,
    disabled?: boolean
}): ReactNode | Promise<ReactNode> => {
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