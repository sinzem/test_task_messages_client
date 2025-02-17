"use client";
import React, { useEffect, useState } from "react";

import styles from "./messagesBtnBlock.module.css";
import ActionButton from "@/components/ui/buttons/ActionButton/ActionButton";
import { useUserStore } from "@/libs/store/userStore";
import LineMessage from "@/components/ui/popups/LineMessage/LineMessage";
import { useMessageStore } from "@/libs/store/messageStore";

const MessagesBtnBlock = ({
    setShowMessageForm
}: {
    setShowMessageForm: React.Dispatch<React.SetStateAction<boolean>>
}): React.JSX.Element => {

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [windowHeight, setWindowHeight] = useState<number>(0);
    const [scrollPosition, setScrollPosition] = useState<number>(0);

    const {user} = useUserStore();
    const {
        ofset, 
        limit, 
        direction,
        entity,
        entityValue,
        prevBtnDisabled, 
        nextBtnDisabled, 
        setPrevBtnDisabled, 
        setNextBtnDisabled, 
        setEntityValue, 
        setOfset, 
        getMessages,
        setOpenCommentsCounter
    } = useMessageStore();

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
        setEntityValue(null);
        setOpenCommentsCounter(0);
        getMessages({limit, ofset: 0})
            .then((res) => {
                if (res && res.length) {
                    setOfset(res.length);
                    setPrevBtnDisabled(true);
                    if (res.length < limit) {
                        setNextBtnDisabled(true);
                    } else {
                        setNextBtnDisabled(false);
                    }
                }
                if (scrollPosition > windowHeight) {
                    window.scrollTo({ top: 0 });
                }
            });
    }

    const toNext = (): void => {
        let qureyObject;
        if (entityValue) {
            qureyObject = {limit, ofset, direction, entity, entityValue};
        } else {
            qureyObject = {limit, ofset};
        }
        getMessages(qureyObject)
            .then((res) => {
                if (res && typeof res === "object" && res.length) {
                    setOfset(ofset + res.length);
                    setPrevBtnDisabled(false);
                    setOpenCommentsCounter(0);
                    if (res.length < limit) {
                        setNextBtnDisabled(true);
                    } else {
                        setNextBtnDisabled(false);
                    }
                }
                if (scrollPosition > windowHeight) {
                    window.scrollTo({ top: 0 });
                }
            });
    }

    const toPrevious = (): void => {
        let qureyObject;
        if (entityValue) {
            qureyObject = {limit, ofset: ofset - limit, direction, entity, entityValue};
        } else {
            qureyObject = {limit, ofset: ofset - limit};
        }
        getMessages(qureyObject)
            .then((res) => {
                if (res && typeof res === "object" && res.length) {
                    setOpenCommentsCounter(0);
                    setNextBtnDisabled(false);
                    if (ofset - res.length > 0) {
                        setOfset(ofset - res.length);
                    } else {
                        setOfset(25);
                        setPrevBtnDisabled(true);
                    }
                }
                if (scrollPosition > windowHeight) {
                    window.scrollTo({ top: 0 });
                }
            });
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
            <ActionButton text="Назад" size="small" action={toPrevious} disabled={prevBtnDisabled}/> 
            <ActionButton text="Вперед" size="small"action={toNext} disabled={nextBtnDisabled}/>
        </div>
    );
};

export default MessagesBtnBlock;