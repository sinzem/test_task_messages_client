import { ReactNode } from "react";

import styles from "./inputBlock.module.css";

const InputBlock = ({
    inputRef,
    labelName, 
    labelText, 
    id, 
    type, 
    value, 
    setChange, 
    placeholder
}: {
    inputRef?: React.RefObject<HTMLInputElement | null>,
    labelName: string;
    labelText: string;
    id: string;
    type: string;
    value: string;
    setChange: React.Dispatch<React.SetStateAction<string>>;
    placeholder: string;
}): ReactNode => {
    return (
        <div className={styles.input_wrap}>
            <label className={styles.label} htmlFor={labelName}>    
                {labelText}
            </label>
            <input 
                ref={inputRef}
                className={styles.inp} 
                id={id} 
                type={type} 
                value={value} 
                onChange={e => setChange(e.target.value)}
                placeholder={placeholder}
            />
        </div> 
    );
};

export default InputBlock;