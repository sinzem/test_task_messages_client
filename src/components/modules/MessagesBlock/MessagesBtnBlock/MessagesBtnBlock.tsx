"use client";
import { useEffect, useState } from "react";

import styles from "./messagesBtnBlock.module.css";
import ActionButton from "@/components/ui/buttons/ActionButton/ActionButton";
import { useUserStore } from "@/libs/store/userStore";
import LineMessage from "@/components/ui/popups/LineMessage/LineMessage";
import { useMessageStore } from "@/libs/store/messageStore";

const MessagesBtnBlock = ({
    setShowMessageForm
}: {
    setShowMessageForm: React.Dispatch<React.SetStateAction<boolean>>/* (e: React.MouseEvent<HTMLButtonElement>) => void */ 
}) => {

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [windowHeight, setWindowHeight] = useState<number>(0)
    const [scrollPosition, setScrollPosition] = useState<number>(0)

    const {user} = useUserStore();
    const {ofset, limit, setOfset, getMessages} = useMessageStore();

    useEffect(() => {
        setWindowHeight(window.innerHeight);

        const handleScroll = () => {
            setScrollPosition(window.scrollY)
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    }, [])

    const setNewMessageForm = () => {
        if (user && user.activation) {
            setShowMessageForm(true);
        } else {
            setErrorMessage("Только для зарегистрированных пользователей");
            const timeout = setTimeout(() => {setErrorMessage(null)}, 3000)
            return () => clearTimeout(timeout);
        }
    }

    const toBeginning = (): void => {
        setOfset(0);
        getMessages({limit, ofset: 0}).then((res) => {
            if (res && res.length) {
                setOfset(res.length);
            }
        });
        if (scrollPosition > windowHeight) {
            window.scrollTo({ top: 0 });
        }
    }

    useEffect(() => {console.log(ofset)}, [ofset])

    const toNext = (): void => {
        setOfset(ofset + limit);
        getMessages({limit, ofset});
        if (scrollPosition > windowHeight) {
            window.scrollTo({ top: 0 });
        }
    }

    const toPrevious = (): void => {
        setOfset(ofset - limit);
        getMessages({limit, ofset});
        if (scrollPosition > windowHeight) {
            window.scrollTo({ top: 0 });
        }
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.btn_wrap}>
                <ActionButton text="Новое сообщение" action={setNewMessageForm} size="small"/>
                {errorMessage &&
                    <LineMessage text={errorMessage}/>
                }
            </div>
            <ActionButton text="К началу" size="small" action={toBeginning}/>
            <ActionButton text="Назад" size="small" action={toPrevious} /> 
            <ActionButton text="Вперед" size="small"action={toNext}/>
        </div>
    );
};

export default MessagesBtnBlock;