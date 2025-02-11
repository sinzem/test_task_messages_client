import { ReactNode } from "react";

import styles from "./fullScreenMessage.module.css";

const FullScreenMessage = ({
    text, 
    value = "warning",
    position = "center"
}: {
    text: string, 
    value?: "warning" | "success",
    position?: "center" | "right_bottom"
}): ReactNode | Promise<ReactNode> => {
    
    return (
        <div className={styles.wrap}>
            <div className={`${styles.message} ${styles[value]} ${styles[position]}`}>
                {text} 
            </div>
        </div>
    );
};

export default FullScreenMessage;