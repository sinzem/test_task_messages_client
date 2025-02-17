import { ReactElement, useEffect, useState } from "react";

import styles from "./messagesList.module.css";

import MessageItem from "../MessageItem/MessageItem";
import { useMessageStore } from "@/libs/store/messageStore";
import { IMessage } from "@/libs/types/IMesssage";
import { socket } from "@/libs/http/ws";


const MessagesList = (): ReactElement => {

    const {
        limit, 
        ofset, 
        entityValue, 
        messages,
        openCommentsCounter,
        cacheNewMessages,
        cacheDeletedMessages, 
        setOfset, 
        setEntityValue, 
        setPrevBtnDisabled, 
        setNextBtnDisabled, 
        setOpenCommentsCounter,
        getMessages, 
        newMessage,
        setCacheNewMessages,
        setCacheDeletedMessages
    } = useMessageStore();

    const [receivedMessage, setReceivedMessage] = useState<IMessage | null>(null);
    const [deletedMessage, setDeletedMessage] = useState<string | null>(null);

    useEffect(() => {
        setOfset(0);
        setEntityValue(null);
        setPrevBtnDisabled(true);
        setOpenCommentsCounter(0);
        getMessages({limit, ofset: 0})
        .then((res) => {
            if (res && res.length) {
                setOfset(0 + res.length);
                if (res.length < limit) {
                    setNextBtnDisabled(true);
                } else {
                    setNextBtnDisabled(false);
                }
            }
        });
    }, [])

    useEffect(() => {
        console.log(ofset);
    }, [ofset])

    useEffect(() => {
        const handleMessage = (message: IMessage): void => {
            setReceivedMessage(message);
        }

        const handleDelete = (id: string): void => {
            setDeletedMessage(id);
        }

        socket.on("message", handleMessage);
        socket.on("delete", handleDelete);
    
        return () => {
            socket.off("message", handleMessage);
            socket.off("delete", handleDelete);
            // socket.disconnect();
            // socket.close();
        };
    }, [])

    useEffect(() => {
        if (receivedMessage && ofset < 26 && !entityValue && receivedMessage.role === "message") {
            if (openCommentsCounter === 0) {
                const newMessages = messages ? [receivedMessage, ...messages] : [receivedMessage];
                newMessages.length = newMessages.length > 25 ? 25 : newMessages.length;
                newMessage(newMessages);
            } else {
                const newMessages = messages ? [receivedMessage, ...messages] : [receivedMessage];
                newMessage(newMessages);
            }
        }
        if (receivedMessage) {
            setCacheNewMessages([...cacheNewMessages, receivedMessage]);
            const timeout = setTimeout(() => {
                const array = cacheNewMessages.filter(mess => mess !== receivedMessage);
                setCacheNewMessages(array);
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [receivedMessage])

    useEffect(() => {
        if (messages && messages.length) {
            const newMessages = messages;
            newMessages.forEach((i, j, arr) => {
                if (i._id === deletedMessage) {
                    arr.splice(j, 1);
                }
                newMessage(arr);
            })
        }
        if (deletedMessage) {
            setCacheDeletedMessages([...cacheDeletedMessages, deletedMessage]);
            const timeout = setTimeout(() => {
                const array = cacheDeletedMessages.filter(mess => mess !== deletedMessage);
                setCacheDeletedMessages(array);
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [deletedMessage])

    if (!messages || messages.length === 0) {
        return (
            <div className={styles.wrapper_empty}>
                <div className={styles.no_messages}>
                    <h2>Нет сообщений</h2>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.wrapper}>
            {messages.map((item) => (
                    <div key={item._id}>
                        <MessageItem message={item}/>
                    </div>
                )
            )}
        </div>
    );
};

export default MessagesList;