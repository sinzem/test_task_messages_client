"use client";

import { ReactElement, useEffect, useRef, useState } from "react";
import Image from "next/image";

import styles from "./editForm.module.css";
import openedEye from "../../../../assets/icons/mng_password_show_icon.png";

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


const EditForm = ({
    action
}: {
    action: React.Dispatch<React.SetStateAction<boolean>>
}): ReactElement => {

    const { isLoading, isError, updateUser } = useUserStore();

    const [name, setName] = useState<string>("");
    const [errorName, setErrorName] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [errorEmail, setErrorEmail] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");
    const [errorPassword, setErrorPassword] = useState<boolean>(false);
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [errorConfirm, setErrorConfirm] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<"password" | "text">("password");
    const [success, setSuccess] = useState<boolean>(false);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus(); 
        }
    }, []);

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
            const timeout = setTimeout(() => setErrorName(false), 5000)
            return () => clearTimeout(timeout); 
        }
        const validateEmail = checkEmail(email);
        if (!validateEmail) {
            setErrorEmail(true);
            const timeout = setTimeout(() => setErrorEmail(false), 5000)
            return () => clearTimeout(timeout); 
        }
        const validatePassword = checkPasswordLength(password);
        if (!validatePassword) {
            setErrorPassword(true);
            const timeout = setTimeout(() => setErrorPassword(false), 5000)
            return () => clearTimeout(timeout);
        }
        if (password !== confirmPassword) {
            setErrorConfirm(true);
            const timeout = setTimeout(() => setErrorConfirm(false), 5000)
            return () => clearTimeout(timeout); 
        }
        
        await updateUser({name, email, password})
            .then((user) => {
                if (user) {
                    setSuccess(true);
                    const timeout = setTimeout(() => {action(false)}, 3000)
                    return () => clearTimeout(timeout); 
                }; 
            });
    }

    const closeForm = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (e.target === e.currentTarget) {
            action(false);
        }
    }
 
    return (
        <div className={styles.form_wrap}>
            <form className={styles.form} onSubmit={(e) => sendData(e)}>

                <div className={styles.close} onClick={closeForm}>X</div>

                <h2 className={styles.title}>Редактировать данные</h2>

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
                            text="Невалидныый адрес электронной почты" 
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

                <p className={styles.text_small}>© 2025 Kharkov UA. All Rights Reserved. Made with love!</p>

                <div className={styles.submit}>
                    <AuthButton disabled={isLoading} text="Отправить"/>
                </div>

                {success && 
                    <FullScreenMessage 
                        text="Успешное обновление данных" 
                        value="success"
                    />
                } 

                {isError.length > 0 && 
                    <FullScreenMessage 
                        text={isError}
                    />
                }
            </form>
        </div>

    );
};

export default EditForm;