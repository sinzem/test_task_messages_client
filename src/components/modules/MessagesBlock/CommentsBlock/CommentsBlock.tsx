"use client";

import { ReactElement } from "react";

import styles from "./commentsBlock.module.css";

import MessageItem from "../MessageItem/MessageItem";
import { IMessage } from "@/libs/types/IMesssage";


const CommentsBlock = ({
    comments,
    action
}: {
    comments: IMessage[],
    action: () => void
}): ReactElement => {

    return (
        <div className={styles.wrapper}>
            {comments.map((item) => (
                    <div key={item._id}>
                        <MessageItem message={item}/>
                    </div>
                )
            )}
            <div className={styles.close_block} onClick={action}>
                <div className={styles.triangle}></div>
                <div>Свернуть комментарии</div>
                <div className={styles.triangle}></div>
            </div>
        </div>
    );
};

export default CommentsBlock;