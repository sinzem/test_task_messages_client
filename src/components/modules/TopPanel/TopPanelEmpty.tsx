"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";

import styles from "./topPanel.module.css";

import ActionButton from "@/components/ui/buttons/ActionButton/ActionButton";

const TopPanelEmpty = (): ReactNode => {

    const [buttonDisabled, setSetButtonDisabled] = useState<boolean>(false);
  
    const click = (): void => {
        setSetButtonDisabled(!buttonDisabled);
    }


    return (
        <div className={styles.panel_no_user}>
            <h2 className={styles.title_no_user}>Данные пользователя не найдены</h2>
            <div className={styles.btn_no_user}>
                <Link href="/auth/login">
                    <ActionButton text="В аккаунт" action={click} disabled={buttonDisabled} />
                </Link>
                <Link href="/">
                    <ActionButton text="На главную" action={click} disabled={buttonDisabled} />
                </Link>
            </div>
        </div>
    )
};

export default TopPanelEmpty;