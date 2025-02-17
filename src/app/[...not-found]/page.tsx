import React from "react";
import Link from "next/link";

import styles from "./notFoundPage.module.css";

import BackPanel from "@/components/submodules/BackPanel/BackPanel";
import ActionButton from "@/components/ui/buttons/ActionButton/ActionButton";

const NotFoundPage: React.FC = () => {
    return (
        <div className={styles.wrap}>
            <BackPanel action={true} />
            <div className={styles.btn_block}>
                <h2>Такой страницы не существует</h2>
                <Link href="/">
                    <ActionButton text="На главную" size="big" />
                </Link>
            </div>
        </div>
    )
}

export default  NotFoundPage;