import React from "react";

import styles from "./styles/app.module.css";
import AuthButtonsBlock from "@/components/submodules/AuthButtonsBlock/AuthButtonsBlock";

const Home: React.FC = () => {
 
    return (
        <main className={styles.main}>
            <div className={styles.title}>
                <h1>SPA-приложение: Комментарии</h1>
                <h2>Здесь Вы можете прокомментировать все что угодно</h2>
            </div>
            <AuthButtonsBlock />
        </main>
    );
}

export default Home;
