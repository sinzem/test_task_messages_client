import { ReactElement } from "react";

import styles from "./fullScreenMessage.module.css";

const FullScreenMessage = ({
    text, 
    value = "warning",
    position = "center",
    background = "backdark"
}: {
    text: string, 
    value?: "warning" | "success",
    position?: "center" | "right_bottom",
    background?: "backdark" | "backclear"
}): ReactElement => {
    
    return (
        <div className={styles.wrap}>
            <div className={`${styles.message} ${styles[value]} ${styles[position]} ${styles[background]}`}>
                {text} 
            </div>
        </div>
    );
};

export default FullScreenMessage;