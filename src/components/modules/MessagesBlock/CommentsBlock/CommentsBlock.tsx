"use client";

import styles from "./commentsBlock.module.css";

import MessageItem from "../MessageItem/MessageItem";
import { IMessage } from "@/libs/types/IMesssage";
// import { useMessageStore } from "@/libs/store/messageStore";
// import { useEffect, useState } from "react";

const CommentsBlock = ({
    comments,
    action
}: {
    comments: IMessage[],
    action: () => void
}): React.JSX.Element => {

    // const {openCommentsCounter, setOpenCommentsCounter} = useMessageStore();
    // const [counter, setCounter] = useState<number>(0);


    // useEffect(() => {
    //     setOpenCommentsCounter(openCommentsCounter + 1);

    //     return () => {
    //         setOpenCommentsCounter(counter - 1);
    //     };
    // }, []);

    // useEffect(() => {
    //     // console.log(openCommentsCounter);
    //     setCounter(openCommentsCounter);
    // }, [openCommentsCounter])

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