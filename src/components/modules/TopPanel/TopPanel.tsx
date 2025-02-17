"use client";

import { ReactElement, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import styles from "./topPanel.module.css";

import { useUserStore } from "@/libs/store/userStore";
import ActionButton from "@/components/ui/buttons/ActionButton/ActionButton";
import EditForm from "../forms/EditForm/EditForm";
import ChangePhotoForm from "../forms/ChangePhotoForm/ChangePhotoForm";
import LineMessage from "@/components/ui/popups/LineMessage/LineMessage";


const TopPanel = (): ReactElement => {
  
    const {user, logout} = useUserStore();

    const [buttonDisabled, setSetButtonDisabled] = useState<boolean>(false);
    const [showEditForm, setShowEditForm] = useState<boolean>(false);
    const [photoForm, setPhotoForm] = useState<boolean>(false);

    const [successLogout, setSuccessLogout] = useState<boolean>(false); 
    const [errorLogout, setErrorLogout] = useState<boolean>(false); 

    useEffect(() => {
        setSetButtonDisabled(false);
    }, [])

    useEffect(() => {
        if (successLogout === true) {
            redirect("/feed");
        }
    }, [successLogout])

    const click = (): void => {
        setSetButtonDisabled(!buttonDisabled);
    }

    const logOut = async (): Promise<void> => {
        await logout()
            .then((res) => {
                if (res === "Successful logout") {
                    setSuccessLogout(true);
                } else if (res !== "Successful logout") {
                    setErrorLogout(true);
                    const timeout = setTimeout(() => {setErrorLogout(false)}, 3000);
                    return () => clearTimeout(timeout); 
                }
            })
            .catch(() => {
                setErrorLogout(true);
                    const timeout = setTimeout(() => {setErrorLogout(false)}, 3000);
                    return () => clearTimeout(timeout); 
            });
    }

    const showEditBlock = (): void => {
        setShowEditForm(!showEditForm);
    }

    const showPhotoInput = (): void => {
        setPhotoForm(!photoForm);
    }

    if (!user) {
        return (
            <div className={styles.panel_no_user}>
                <h2 className={styles.title_no_user}>Данные пользователя не найдены</h2>
                <div className={styles.btn_no_user}>
                    <Link href="/">
                        <ActionButton text="На главную" action={click}/>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.panel}>
            {photoForm &&
                <ChangePhotoForm action={setPhotoForm} />
            }
            <div className={styles.wrap}>
                <div className={`${styles.photo} ${user.photo ? styles.fill : styles.empty}`} onClick={showPhotoInput}>
                    {
                        !user.photo && 
                        <div className={styles.instead}>
                            <p>Место для фото</p>
                            <p>Нажмите чтобы добавить</p>
                        </div>    
                    }
                    {
                        user.photo &&
                        <Image 
                            src={`${String(process.env.NEXT_PUBLIC_APP_SERVER_URL)}/files/photo/${user.photo}`} 
                            alt="user photo" 
                            fill={true}
                            sizes="(min-width: 100px)" 
                            className={styles.img}
                        />
                    }
                </div>
                <h2 className={styles.title}>
                    {user.name.length < 25 
                        ? user.name
                        : `${user.name.slice(0, 24)}...`
                    }
                </h2>
                <div className={styles.buttons}>
                    <ActionButton text="Редактировать" action={showEditBlock}/>
                    <Link href="/">
                        <ActionButton text="На главную" action={click} disabled={buttonDisabled}/>
                    </Link>
                    <div className={styles.logout_wrap}>
                        <ActionButton text="Из аккаунта" action={logOut}/>
                        {errorLogout &&
                            <LineMessage text="Ошибка выхода из аккаунта" location="right"/>
                        }
                    </div> 
                </div>
            </div>

            {showEditForm && 
                <EditForm action={setShowEditForm}/>
            }
            
        </div>
    );
};

export default TopPanel;