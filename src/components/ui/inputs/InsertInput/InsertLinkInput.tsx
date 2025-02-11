import { ReactNode, useState } from "react";
import * as sanitizeHtml from 'sanitize-html';

import styles from "./insertInput.module.css";

import ActionButton from "../../buttons/ActionButton/ActionButton";

const InsertInputLink = ({
    closeAction,
    setAction
}: {
    closeAction: React.Dispatch<React.SetStateAction<string | null>>,
    setAction: React.Dispatch<React.SetStateAction<string | null>> 
}): ReactNode => {

    const [address, setAddress] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [text, setText] = useState<string>("");

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
        const checkAddress = sanitizeText(address);
        const checkTitle = sanitizeText(title);
        const checkText = sanitizeText(text);
        setAction(`<a href="${checkAddress}" title="${checkTitle}" >${text.length ? checkText : checkAddress}</a>`);
        closeAction(null);
    }

    const closeForm = (): void => {
        closeAction(null);
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.main}>
                <div className={styles.close} onClick={closeForm}>X</div>
                <div className={styles.inputs}>
                    <div className={styles.input_wrap}>
                        <label htmlFor="address">Адрес ссылки</label>
                        <input 
                            type="text"
                            name="address"
                            value={address}
                            placeholder="Введите адрес"
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div className={styles.input_wrap}>
                        <label htmlFor="title">Текст подсказки при наведении</label>
                        <input 
                            type="text"
                            name="title"
                            placeholder="Введите title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className={styles.input_wrap}>
                        <label htmlFor="text">Текст ссылки</label>
                        <input 
                            type="text"
                            name="text"
                            placeholder="Введите текст ссылки"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>
                </div>
                <div className={styles.btn}>
                    <ActionButton text="Подтвердить" action={returnState}/>
                </div>
            </div> 
        </div>
        
    );
};

export default InsertInputLink;