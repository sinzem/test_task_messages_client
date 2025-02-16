import { ReactNode, useEffect, useState } from "react";

import styles from "./messagesList.module.css";

import { useMessageStore } from "@/libs/store/messageStore";
import MessageItem from "../MessageItem/MessageItem";
import { IMessage } from "@/libs/types/IMesssage";
import { socket } from "@/libs/http/ws";
// import { useUserStore } from "@/libs/store/userStore";


const MessagesList = (): ReactNode | Promise<ReactNode> => {

    // const {user} = useUserStore();
    const {limit, ofset, entityValue, setOfset,  messages, getMessages, newMessage} = useMessageStore();

    const [receivedMessage, setReceivedMessage] = useState<IMessage | null>(null);
    const [receivedComment, setReceivedComment] = useState<IMessage | null>(null);
    const [deletedMessage, setDeletedMessage] = useState<string | null>(null);

    useEffect(() => {
        setOfset(0);
        getMessages({limit, ofset: 0})
        .then((res) => {
            if (res && res.length) {
                setOfset(0 + res.length)
            }
        });
    }, [])

    useEffect(() => {
        if (ofset < 26 && !entityValue) {

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
            };
        }

    }, [ofset, entityValue])

    useEffect(() => {
        if (receivedMessage) {
            console.log(receivedMessage);
            const newMessages = messages ? [receivedMessage, ...messages] : [receivedMessage];
            newMessages.length = newMessages.length > 25 ? 25 : newMessages.length;
            newMessage(newMessages);
        }
    }, [receivedMessage])

    useEffect(() => {
        if (receivedComment) {
            if (messages && messages.length) {
                const newMessages = messages;
                newMessages.forEach((i, j, arr) => {
                    if (i._id === receivedComment.parentMessageId) {
                        i.comments = [receivedComment.parentMessageId, ...i.comments]
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
                if (i._id === deletedMessage) {
                    arr.splice(j, 1);
                    newMessage(arr);
                }
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