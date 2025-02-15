import { ReactNode } from "react";

import styles from "./lineMessage.module.css";

const LineMessage = ({
    text, 
    location = "left",
    value = "warning"
}: {
    text: string, 
    location?: "left" | "right",
    value?: "warning" | "success"
}): ReactNode | Promise<ReactNode> => {
    return (
        <div className={`${styles.message} ${styles[location]} ${styles[value]}`}>
            {text} 
        </div>
    );
};

export default LineMessage;