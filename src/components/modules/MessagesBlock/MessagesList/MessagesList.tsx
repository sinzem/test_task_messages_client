import { useEffect, useState } from "react";

import styles from "./messagesList.module.css";

import { useMessageStore } from "@/libs/store/messageStore";
import MessageItem from "../MessageItem/MessageItem";
import { IMessage } from "@/libs/types/IMesssage";
import { socket } from "@/libs/http/ws";


const MessagesList: React.FC = () => {

    const {
        limit, 
        ofset, 
        entityValue, 
        messages,
        openCommentsCounter, 
        setOfset, 
        setEntityValue, 
        setPrevBtnDisabled, 
        setNextBtnDisabled, 
        setOpenCommentsCounter,
        getMessages, 
        newMessage
    } = useMessageStore();

    const [receivedMessage, setReceivedMessage] = useState<IMessage | null>(null);
    const [receivedComment, setReceivedComment] = useState<IMessage | null>(null);
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
            if (message.role === "message") {
                setReceivedMessage(message);
            } else if (message.role === "comment") {
                setReceivedComment(message);
            }
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
        if (receivedMessage && ofset < 26 && !entityValue) {
            if (openCommentsCounter === 0) {
                const newMessages = messages ? [receivedMessage, ...messages] : [receivedMessage];
                newMessages.length = newMessages.length > 25 ? 25 : newMessages.length;
                newMessage(newMessages);
            } else {
                const newMessages = messages ? [receivedMessage, ...messages] : [receivedMessage];
                newMessage(newMessages);
            }
        }
    }, [receivedMessage])

    useEffect(() => {
        if (receivedComment) {
            if (messages && messages.length) {
                const newMessages = messages;
                newMessages.forEach((i, j, arr) => {
                    if (i._id === receivedComment.parentMessageId) {
                        i.comments = [receivedComment._id, ...i.comments]
                        newMessage(arr);
                    }
                })
            }
        }
    }, [receivedComment])

    useEffect(() => {
        if (messages && messages.length) {
            const newMessages = messages;
            newMessages.forEach((i, j, arr) => {
                if (deletedMessage && i.comments.includes(deletedMessage)) {
                    const index = i.comments.findIndex(index => index === deletedMessage);
                    if (index !== -1) {
                        i.comments.splice(index, 1);
                    }
                }
                if (i._id === deletedMessage) {
                    arr.splice(j, 1);
                    j = j - 1;
                }
                newMessage(arr);
            })
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