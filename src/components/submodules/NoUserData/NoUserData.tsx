import { ReactElement } from 'react';
import Link from 'next/link';

import styles from "./noUserData.module.css";

import ActionButton from '@/components/ui/buttons/ActionButton/ActionButton';

const NoUserData = (): ReactElement => {
    return (
        <div className={styles.page_wrapper}>
                <div className={styles.not_user_wrap}>
                    <h2>SPA-приложение: Комментарии</h2>
                    <h2>Данные пользователя не найдены. Зарегистрируйтесь или войдите в аккаунт</h2> 
                    
                    <Link href="/">
                        <ActionButton text="На главную" size="big" />
                    </Link>
                </div>
            </div>
    );
};

export default NoUserData;