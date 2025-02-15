import { ReactNode, useEffect } from "react";

import styles from "./messagesList.module.css";

import { useMessageStore } from "@/libs/store/messageStore";
import MessageItem from "../MessageItem/MessageItem";

const MessagesList = (): ReactNode | Promise<ReactNode> => {

    const {messages, getMessages} = useMessageStore();

    const limit = 25; const ofset = 0

    useEffect(() => {
        // setInterval(() => {
            getMessages({limit, ofset});
        // }, 3000)
    }, [])

    useEffect(() => {
        console.log(messages);
    }, [messages])

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