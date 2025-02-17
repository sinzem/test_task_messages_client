"use client"

import { ReactElement, useEffect, useRef, useState } from "react";
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from "react-simple-captcha";

import styles from "./captcha.module.css";

import ActionButton from "@/components/ui/buttons/ActionButton/ActionButton";
import InputBlock from "@/components/ui/inputs/InputBlock/InputBlock";
import LineMessage from "@/components/ui/popups/LineMessage/LineMessage";

const Captcha = ({
    isValid, 
    setIsValid,
    setCaptcha
}: {
    isValid: boolean | null;
    setIsValid: React.Dispatch<React.SetStateAction<boolean | null>>;
    setCaptcha: React.Dispatch<React.SetStateAction<boolean>>;
}): ReactElement => {

    const [userCaptcha, setUserCaptcha] = useState("");
    const [hideCaptcha, setHideCaptcha] = useState<boolean>(false);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus(); 
        }
    }, [isValid]);

    useEffect(() => {
        // if (inputRef.current) {
        //     inputRef.current.focus(); 
        // }
        setIsValid(null);
        const {length, back, front} = getValuesForCaptcha();
        loadCaptchaEnginge(length, back, front, "");
    }, [])

    const handleSubmit = (): (() => void) => {
        const isHuman = validateCaptcha(userCaptcha)
        setIsValid(isHuman)
        if (isHuman) {
            setUserCaptcha("");
            const timeout = setTimeout(() => {setHideCaptcha(true)}, 1000);
            return () => clearTimeout(timeout);
        } else {
            setUserCaptcha("");
            const timeout = setTimeout(() => {
                const {length, back, front} = getValuesForCaptcha();
                loadCaptchaEnginge(length, back, front, "");
                setIsValid(null);
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }

    const closeCaptcha = (e: React.KeyboardEvent<HTMLDivElement>): void | (() => void) => {
        if (e.key === "Escape") {
            setHideCaptcha(true);
            const timeout = setTimeout(() => {setCaptcha(false)}, 1000);
            return () => clearTimeout(timeout);
        }
    }

    const closeCaptchaX = (e: React.MouseEvent<HTMLDivElement>): void | (() => void) => {
        if (e.target === e.currentTarget) {
            setHideCaptcha(true);
            const timeout = setTimeout(() => {setCaptcha(false)}, 1000);
            return () => clearTimeout(timeout);
        }
    }

    return (
        <div 
            className={`${styles.main} ${hideCaptcha ? styles.hide : styles.not_hide}`} 
            tabIndex={0} 
            onKeyDown={closeCaptcha}
        >
            <div className={styles.close} onClick={closeCaptchaX}>X</div>
            <div className={styles.wrapper}>
                <div className={styles.canvas}>
                    <LoadCanvasTemplate reloadText="Обновить"/>
                </div>
                <div className={styles.input_cover}>
                    <InputBlock 
                        inputRef={inputRef}
                        labelName="captcha"
                        labelText="Поле для ввода ответа"
                        id="captcha"
                        type="text"
                        placeholder="Введите символы"
                        value={userCaptcha}
                        setChange={setUserCaptcha}
                    />
                    {isValid === false && 
                        <LineMessage
                            text="Неправильный ответ" 
                            location="left" 
                        />
                    } 
                    {/* {isValid === true && 
                        <LineMessage
                            text="Правильно!" 
                            location="left" 
                            value="success"
                        />
                    }  */}
                </div>
            
                <ActionButton 
                    action={handleSubmit} 
                    text="Подтвердить" 
                    disabled={isValid === false || isValid === true}
                />
            </div>
        </div>
    )
}

export default Captcha


function getValuesForCaptcha () {
    const length = randomNum(5, 8);
    const first = randomNum(1, 12);
    let second = randomNum(1, 12);
    while (second === first) {
        second = randomNum(1, 12);
    }  
    const back = colors[first];
    const front = colors[second];
    return {length, back, front} 
}

function randomNum (min: number, max: number): number {
    const rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

const colors = ["maroon", "lightcoral", "goldenrod", "olive", "darkolivegreen", "darkseagreen", "darkslategray", "cadetblue", "darkslateblue", "thistle", "slategray", "rosybrown"];