"use client";

import { ReactElement, useEffect, useState } from "react";
import Link from "next/link";

import styles from "./authButtonsBlock.module.css";

import AuthButton from "../../ui/buttons/AuthButton/AuthButton";

const AuthButtonsBlock = (): ReactElement => {

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(false);
    }, [])

    const click = (): void => {
        setLoading(!loading);
    }

    return (
        <div className={styles.form_block}>
            <div className={styles.wrap}>
                <Link href="auth/registration">
                    <AuthButton action={click} disabled={loading} text="Регистрация"/>
                </Link>
                <Link href="auth/login">
                    <AuthButton action={click} disabled={loading} text="Аккаунт"/>
                </Link>
                <Link href="/feed">
                    <AuthButton action={click} disabled={loading} text="Сообщения"/>
                </Link>
            </div>
        </div>
    );
};

export default AuthButtonsBlock;

