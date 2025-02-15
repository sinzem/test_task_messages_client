import { ReactNode } from "react";

import styles from "./backPanel.module.css";

const BackPanel = ({action = false}: {action?: boolean}): ReactNode | Promise<ReactNode> => {
    return (
        <div className={styles.back_wrap}>
            <div className={!action ? `${styles.back}` : `${styles.back} ${styles.back_animation}`}>
                <div className={styles.back_right}></div> 
                <div className={styles.back_left}></div>
            </div>
        </div>
        
    );
};

export default BackPanel;
