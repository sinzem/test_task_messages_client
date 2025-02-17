"use client";

import type React from "react";
import { ReactElement, useEffect, useRef, useState } from "react";
import Image from "next/image";

import styles from "./registrationForm.module.css";
import openedEye from "../../../../assets/icons/mng_password_show_icon.png";
import arrow from "../../../../assets/icons/checkbox_true_icon.png";

import AuthButton from "../../../ui/buttons/AuthButton/AuthButton";
import InputBlock from "../../../ui/inputs/InputBlock/InputBlock";
import { useUserStore } from "@/libs/store/userStore";
import LineMessage from "@/components/ui/popups/LineMessage/LineMessage";
import FullScreenMessage from "@/components/ui/popups/FullScreenMessage/FullScreenMessage";
import { 
    checkEmail, 
    checkPasswordLength, 
    passwordEntryVerification 
} from "@/libs/services/checkers";
import Captcha from "../../Captcha/Captcha";


const RegistrationForm = ({link}: {link?: string | string[]}): ReactElement => {

    const { isLoading, isAuth, isError, registration, registrationAdmin } = useUserStore();

    const [name, setName] = useState<string>("");
    const [errorName, setErrorName] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [errorEmail, setErrorEmail] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");
    const [errorPassword, setErrorPassword] = useState<boolean>(false);
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [errorConfirm, setErrorConfirm] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<"password" | "text">("password");
    const [saveData, setSaveData] = useState<boolean>(true);

    const [captcha, setCaptcha] = useState<boolean>(false);
    const [isValid, setIsValid] = useState<boolean | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus(); 
        }
    }, []);

    useEffect(() => {
        if(isAuth.length > 10) { 
            setTimeout(() => {
                setName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
            }, 2000);
        } 
    }, [isAuth])

    useEffect(() => {
        if (isValid) {
            if (link) {
                registrationAdmin({name, email, password, saveData});
            } else {
                registration({name, email, password, saveData});
            }
            setCaptcha(false);
        }
    }, [isValid])

    const hiddenPassword = (): void => {
        if (showPassword === "password") { 
            setShowPassword("text");
        } else { 
            setShowPassword("password"); 
        }
    }

    const sendData = async (e: React.FormEvent<HTMLFormElement>): Promise<(() => void) | undefined> => {
        e.preventDefault();
        const verificatedName = name.replace(/[^@()а-яёъa-z0-9_\'\:\;\- ]/ig, "").trim();
        setName(verificatedName);
        if (verificatedName.length === 0 || verificatedName.length < 2 || verificatedName.length > 32) {
            setErrorName(true);
            const timeout = setTimeout(() => setErrorName(false), 3000)
            return () => clearTimeout(timeout); 
        }
        const validateEmail = checkEmail(email);
        if (!validateEmail) {
            setErrorEmail(true);
            const timeout = setTimeout(() => setErrorName(false), 3000)
            return () => clearTimeout(timeout);  
        }
        const validatePassword = checkPasswordLength(password);
        if (!validatePassword) {
            setErrorPassword(true);
            const timeout = setTimeout(() => setErrorName(false), 3000)
            return () => clearTimeout(timeout); 
        }
        if (password !== confirmPassword) {
            setErrorConfirm(true);
            const timeout = setTimeout(() => setErrorName(false), 3000)
            return () => clearTimeout(timeout); 
        }
        setCaptcha(true);
    }
 
    return (
        <form className={styles.form} onSubmit={(e) => sendData(e)}>

            {captcha && 
                <Captcha isValid={isValid} setIsValid={setIsValid} setCaptcha={setCaptcha}/>
            }

            <h2 className={styles.title}>Регистрация</h2>

            <div className={styles.input_cover}>
                <InputBlock 
                    inputRef={inputRef}
                    labelName="name"
                    labelText="Имя"
                    id="name"
                    type="text"
                    value={name}
                    setChange={setName}
                    placeholder="Ваше имя" 
                />
                {errorName && 
                    <LineMessage
                        text="Имя должно состоять минимум из двух букв" 
                        location="left" 
                    />
                }
            </div>

            <div className={styles.input_cover}>
                <InputBlock 
                    labelName="email"
                    labelText="E-mail"
                    id="email"
                    type="text"
                    value={email}
                    setChange={setEmail}
                    placeholder="example@gmail.com" 
                />
                {errorEmail && 
                    <LineMessage
                        text="Невалидный адрес электронной почты" 
                        location="left" 
                    />
                }
            </div>
          
            <div className={styles.input_wrap}>
                <label className={styles.label} htmlFor="password">Пароль</label>
                <div className={styles.inp_wrap}>
                <input 
                    className={styles.inp}  
                    id="password" 
                    type={showPassword} 
                    value={password} 
                    onChange={e => passwordEntryVerification(e.target.value, setPassword)}
                    placeholder="Минимальная длинна - 8 символов"
                />
                <div className={styles.eye} onClick={hiddenPassword}>
                    <Image src={openedEye} alt="eye" />
                    {showPassword === "text" && <div className={styles.eye_line}></div>}
                </div>
                </div>
                {errorPassword && 
                    <LineMessage 
                        text="Пароль должен быть от 8 до 32 символов" 
                        location="left" 
                    />
                }
            </div>
            <div className={styles.input_wrap}>
                <label className={styles.label} htmlFor="confirm">Подтвердите пароль</label>
                <div className={styles.inp_wrap}>
                    <input 
                        className={styles.inp}  
                        id="confirm" type={showPassword} 
                        value={confirmPassword} 
                        onChange={e => passwordEntryVerification(e.target.value, setConfirmPassword)}
                        placeholder="Подтверждение пароля"
                    />
                    <div className={styles.eye} onClick={hiddenPassword}>
                        <Image src={openedEye} alt="eye" />
                        {showPassword === "text" && <div className={styles.eye_line}></div>}
                    </div>
                </div>
                {errorConfirm && 
                    <LineMessage
                        text="Пароль и подтверждение не совпадают" 
                        location="left" 
                    />
                }
            </div>
            <div className={`${styles.input_wrap} ${styles.checkbox_wrap}`} onClick={() => setSaveData(!saveData)}>
                <div className={styles.checkbox}>
                    {saveData && 
                        <Image src={arrow} alt="confirm"/>
                    }
                </div>
                <h3 className={styles.label}>Запомнить данные</h3>
                {!saveData && 
                    <LineMessage 
                        text="После входа токен доступа будет анулирован через 20 минут" 
                        location="left" 
                    />
                }
            </div>
            <p className={styles.text_small}>© 2025 Kharkov UA. All Rights Reserved. Made with love!</p>

            <div className={styles.submit}>
                <AuthButton disabled={isLoading} text="Зарегистрироваться"/>
            </div>

            {isAuth.length > 10 && 
                <FullScreenMessage 
                    text="На почту отправлена ссылка для активации аккаунта" 
                    value="success"
                />
            }

            {isError.length > 0 && 
                <FullScreenMessage 
                    text={isError}
                />
            }
        </form>
    );
};

export default RegistrationForm;