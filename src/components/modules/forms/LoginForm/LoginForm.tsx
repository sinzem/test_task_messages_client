"use client";

import type React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";

import styles from "./loginForm.module.css";
import openedEye from "../../../../assets/icons/mng_password_show_icon.png";
import arrow from "../../../../assets/icons/checkbox_true_icon.png";

import AuthButton from "../../../ui/buttons/AuthButton/AuthButton";
import InputBlock from "../../../ui/inputs/InputBlock/InputBlock";
import { useUserStore } from "@/libs/store/userStore";
import FullScreenMessage from "../../../ui/popups/FullScreenMessage/FullScreenMessage";
import LineMessage from "@/components/ui/popups/LineMessage/LineMessage";
import { 
    checkEmail, 
    checkPasswordLength, 
    passwordEntryVerification 
} from "@/libs/services/checkers";
import Captcha from "../../Captcha/Captcha";


const LoginForm = (): React.ReactNode => {

    const { user, isAuth, isLoading, isError, login } = useUserStore();

    const [email, setEmail] = useState<string>("");
    const [errorEmail, setErrorEmail] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");
    const [errorPassword, setErrorPassword] = useState<boolean>(false);
    const [forgottenPassword, setForgottenPassword] = useState<boolean>(false);
    const [show, setShow] = useState<"password" | "text">("password");
    const [saveData, setSaveData] = useState<boolean>(true);
    
    const [captcha, setCaptcha] = useState<boolean>(false);
    const [isValid, setIsValid] = useState<boolean | null>(null);

    useEffect(() => {
        if (user && isAuth === "active") {
            redirect(`/users/${user.id}`)
        } 
    }, [user])

    useEffect(() => {
        if (isValid) {
            setTimeout(() => {
                setCaptcha(false);
            }, 1000);
            login({email, password, forgottenPassword, saveData});
        }
    }, [isValid])

    const showPassword = () => {
        if (show === "password") { 
            setShow("text");
        } else { 
            setShow("password"); 
        }
    }

    const sendData = async (e: React.FormEvent<HTMLFormElement> ): Promise<void> => {
        e.preventDefault();
        const validateEmail = checkEmail(email);
        if (!validateEmail) {
            setErrorEmail(true);
            setTimeout(() => setErrorEmail(false), 5000)
            return; 
        }
        if (!forgottenPassword) {
            const validatePassword = checkPasswordLength(password);
            if (!validatePassword) {
                setErrorPassword(true);
                setTimeout(() => setErrorPassword(false), 5000)
                return; 
            }
        }
        setCaptcha(true);
    }
 
    return (
        <form className={styles.form} onSubmit={(e) => sendData(e)}>

            {captcha && 
                <Captcha isValid={isValid} setIsValid={setIsValid} setCaptcha={setCaptcha}/>
            }

            <h2 className={styles.title}>Вход в аккаунт</h2>

            <p className={`${styles.text_small} ${styles.text_top}`}>Введите email и пароль для входа в аккаунт!</p>

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
                        type={show} 
                        value={password} 
                        onChange={e => passwordEntryVerification(e.target.value, setPassword)}
                        placeholder="От 8 до 32 символов"
                    />
                    <div className={styles.eye} onClick={showPassword}>
                        <Image src={openedEye} alt="eye" />
                        {show === "text" && <div className={styles.eye_line}></div>}
                    </div>
                </div>
                {errorPassword && 
                    <LineMessage
                        text="Должно быть от 8 до 32 символов" 
                        location="left" 
                    />
                }
            </div>
            
            <div className={styles.check_wrap}>
                <div className={styles.forgotten} onClick={() => setForgottenPassword(!forgottenPassword)}>
                    <p className={forgottenPassword ? styles.forgotten_true : styles.forgotten_false}>Забыли пароль?</p>
                    {forgottenPassword && 
                        <LineMessage
                            text="После нажатия кнопки входа на почту будет отправлена ссылка подтверждения аккаунта" 
                            location="right" 
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
            </div>
        
            
            <div className={styles.submit}>
                <AuthButton disabled={isLoading} text="Войти" /> 
            </div>
            
            <p className={`${styles.text_small} ${styles.text_bottom}`}>
                © 2025 Kharkov UA. All Rights Reserved. Made with love!
            </p>

            {isAuth === "Activation link sent by email" && 
                <FullScreenMessage
                    text="На почту отправлена ссылка для активации"
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

export default LoginForm;