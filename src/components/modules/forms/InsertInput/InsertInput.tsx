import { ReactElement, useEffect, useRef, useState } from "react";
import * as sanitizeHtml from 'sanitize-html';

import styles from "./insertInput.module.css";

import ActionButton from "../../../ui/buttons/ActionButton/ActionButton";

const InsertInput = ({
    sign,
    closeAction,
    setAction
}: {
    sign: string | null,
    closeAction: React.Dispatch<React.SetStateAction<string | null>>,
    setAction: React.Dispatch<React.SetStateAction<string | null>> 
}): ReactElement => {

    const [value, setValue] = useState<string>("");
    const areaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (areaRef.current) {
            areaRef.current.focus(); 
        }
    }, []);

    let name, labelText;
    if (sign === "code") {
        name = "code";
        labelText = "Введенный текст будет в стиле code";
    }
    if (sign === "strong") {
        name = "strong";
        labelText = "Введенный текст будет более выделенным";
    }
    if (sign === "italic") {
        name = "italic";
        labelText = "Введенный текст будет выполнен курсивом";
    }

    function sanitizeText(str: string): string {
    
        const checkMessage = sanitizeHtml(str, {
            allowedTags: ["i", "strong", "code", "a"],
            allowedAttributes: {
                a: [ 'href', "title" ],
            },
        });
    
        return checkMessage;
    }

    const returnState = (): void => {
        const checkValue = sanitizeText(value);
        if (sign === "code") setAction(`<code>${checkValue}</code>`);
        if (sign === "strong") setAction(`<strong>${checkValue}</strong>`);
        if (sign === "italic") setAction(`<i>${checkValue}</i>`);
        closeAction(null);
    }

    const closeForm = (): void => {
        closeAction(null);
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.main}>
                <div className={styles.close} onClick={closeForm}>X</div>
                <label htmlFor={name}>{labelText}</label>
                <textarea 
                    ref={areaRef}
                    className={styles.area}
                    id={name}
                    placeholder="Введите текст" 
                    value={value}
                    onChange={e => setValue(e.target.value)}
                /> 
                <div className={styles.btn}>
                    <ActionButton text="Подтвердить" action={returnState}/>
                </div>
            </div> 
        </div>
        
    );
};

export default InsertInput;