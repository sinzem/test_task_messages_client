import { ReactNode } from "react";

import styles from "./loginPage.module.css";

import LoginForm from "@/components/modules/forms/LoginForm/LoginForm";


const LoginPage = (): ReactNode => {
    return (
        <div className={styles.main}>
            <div className={styles.form_wrap}>
                <h2 className={styles.title}>SPA-приложение: Комментарии</h2>
                <LoginForm />
            </div>
        </div>
    );
};

export default LoginPage;