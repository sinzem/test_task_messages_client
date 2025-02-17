import { ReactElement } from "react";

import styles from "./authButton.module.css";

const AuthButton = ({
    text, 
    disabled,
    action
}: {
    text: string, 
    disabled?: boolean,
    action?: (e: React.MouseEvent<HTMLButtonElement>) => void,
}): ReactElement => {
    return (
            <button 
                type="submit" 
                disabled={disabled} 
                className={styles.btn} 
                onClick={action}>
                {text}
            </button>
    );
};

export default AuthButton;