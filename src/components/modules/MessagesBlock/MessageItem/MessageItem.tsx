"use client";

import { ReactElement, useEffect, useState } from "react";
import Image from "next/image";

import styles from "./messageItem.module.css";
import insteadTxt from "../../../../assets/pictures/txt_example.png";
import anonimus from "../../../../assets/pictures/anonymous.png";

import ViewingFiles from "@/components/ui/popups/ViewingFiles/ViewingFiles";
import AddMessageForm from "../../forms/AddMessageForm/AddMessageForm";
import { IMessage } from "@/libs/types/IMesssage";
import { useUserStore } from "@/libs/store/userStore";
import LineMessage from "@/components/ui/popups/LineMessage/LineMessage";
import MessageService from "@/libs/services/MessageService";
import CommentsBlock from "../CommentsBlock/CommentsBlock";
import { useMessageStore } from "@/libs/store/messageStore";
import FullScreenMessage from "@/components/ui/popups/FullScreenMessage/FullScreenMessage";


const MessageItem = ({message}: {message: IMessage}): ReactElement => {

    const {user} = useUserStore();
    const {
        deleteResult,
        openCommentsCounter, 
        cacheNewMessages,
        cacheDeletedMessages,
        setOpenCommentsCounter,
        deleteMessage
    } = useMessageStore();

    const [showImageFile, setShowImageFile] = useState<boolean>(false); 
    const [showTextFile, setShowTextFile] = useState<boolean>(false); 
    const [showWarningAddComment, setShowWarningAddComment] = useState<boolean>(false);
    const [showWarningDelComment, setShowWarningDelComment] = useState<boolean>(false);

    const [showCommentForm, setShowCommentForm] = useState<boolean>(false);
    const [showCommentsBlock, setShowCommentsBlock] = useState<boolean>(false);
    const [comments, setComments] = useState<IMessage[]>([]);

    useEffect(() => {
        if (cacheNewMessages.length) {
            cacheNewMessages.forEach(mess => {
                if (mess.parentMessageId && mess.parentMessageId === message._id) {
                    message.comments.push(mess._id);
                    setComments([...comments, mess]);
                }
            })
        }
    }, [cacheNewMessages])

    useEffect(() => {
        if (cacheDeletedMessages.length) {
            cacheDeletedMessages.forEach(mess => {
                if (message.comments.includes(mess)) {
                    const index = message.comments.findIndex(index => index === mess);
                    if (index !== -1) {
                        message.comments.splice(index, 1);
                    }
                }
                if (comments.length) {
                    const array = comments.filter(item => item._id !== mess);
                    setComments(array);
                }
            })
        }
    }, [cacheDeletedMessages])

    useEffect(() => {
        if (!comments.length) {
            setShowCommentsBlock(false);
        }
    }, [comments])

    function showImage(): void {
        setShowImageFile(true);
    }

    function showText(): void {
        setShowTextFile(true);
    }

    const dateString = (str: Date): string => {
        const date = new Date(str);
        const dateObj = date.toLocaleString("ua-UA", { 
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        })
        return `${dateObj.slice(0, 8)} в ${dateObj.slice(10)}`;
    } 

    const addComment =  (): (() => void) | undefined => {
        if (user && user?.activation) {
            setShowCommentForm(true);
        } else {
            setShowWarningAddComment(true);
            const timeout = setTimeout(() => {setShowWarningAddComment(false)}, 3000);
            return () => clearTimeout(timeout);
        }
    } 

    const delMessage = (): (() => void) | undefined => {
        if (user && user.id === message.authId) {
            deleteMessage(message._id);
        } else {
            setShowWarningDelComment(true);
            const timeout = setTimeout(() => {setShowWarningDelComment(false)}, 3000);
            return () => clearTimeout(timeout);
        }
    }

    const openCommentsWindow = async (): Promise<void> => {
        await MessageService.getComments(message._id)
            .then((res) => {
                if (res.status === 200) {
                    setComments(res.data.comments);
                    setShowCommentsBlock(true);
                    setOpenCommentsCounter(openCommentsCounter + 1);
                }
            });
    }

    const closeCommentsWindow = (): void => {
        setShowCommentsBlock(false);
        setOpenCommentsCounter(openCommentsCounter - 1);
    }

    return (
        <div className={user?.id === message.authId ? `${styles.wrapper} ${styles.back_owner}` : styles.wrapper}>
            <div className={styles.top_panel}>
                <div className={styles.owner}>
                    <div className={styles.photoframe}>
                        {message.authPhoto &&
                            <Image 
                                src={`${String(process.env.NEXT_PUBLIC_APP_SERVER_URL)}/files/photo/${message.authPhoto}`}
                                alt="Author photo" 
                                fill={true}
                                sizes="(max-width: 60px)" 
                                className={styles.img}   
                            />
                        } 
                    {!message.authPhoto &&
                            <Image 
                                src={anonimus}
                                alt="Owner hasn't photo" 
                                fill={true}
                                sizes="(max-width: 60px)" 
                                className={styles.img}   
                            />
                        } 
                    </div>
                    <div className={styles.nickname}>
                        <h2>{message.authName ? message.authName : "Anonym"}</h2>
                    </div>
                </div>
                <div className={styles.top_right}>
                    <div className={styles.time}>{dateString(message.createdAt)}</div>
                    <button className={styles.delete} onClick={delMessage}>X</button>
                    {showWarningDelComment && 
                        <LineMessage text="Удалять может только автор сообщения" location="right"/>
                    }
                    {deleteResult &&
                        <FullScreenMessage text={deleteResult} background="backclear" />
                    }
                </div>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.message_panel}>
                <div className={styles.files}>
                    {message.textFile &&
                        <div className={styles.fileframe} onClick={showText}>
                            <Image 
                                src={insteadTxt}
                                alt="Txt document image" 
                                fill={true}
                                objectFit="cover"
                                objectPosition="top"
                                sizes="(min-width: 100px, height: 100%)" 
                                className={styles.file}   
                            />
                        </div>
                    }
                    {message.textFile && showTextFile &&
                        <ViewingFiles address={message.textFile} value="text" setter={setShowTextFile}/>
                    }
                    {message.image &&
                        <div className={styles.fileframe} onClick={showImage}>
                            <Image 
                                src={`${String(process.env.NEXT_PUBLIC_APP_SERVER_URL)}/files/images/${message.image}`}
                                alt="Image added by the author" 
                                fill={true}
                                sizes="(min-width: 100px)" 
                                className={styles.file}   
                            />
                        </div>
                    }
                    {message.image && showImageFile &&
                        <ViewingFiles address={message.image} value="image" setter={setShowImageFile}/>
                    }
                </div>
                <div className={styles.text}>
                    {message.text 
                        ? <div dangerouslySetInnerHTML={{ __html: message.text }} /> 
                        : ""
                    }
                </div>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.comments_panel}>
                {showCommentForm &&
                    <AddMessageForm 
                        role="comment"
                        parentMessageId={String(message._id)}
                        action={setShowCommentForm}
                    />
                }
                <div className={styles.comments_top}>
                    <div className={styles.comments_add_wrap}>
                        <button className={styles.comments_add} onClick={addComment}>Добавить комментарий</button>
                        {showWarningAddComment && 
                            <LineMessage text="Только для авторизованных пользователей"/>
                        }
                    </div>

                    <div className={styles.comments_nav}>
                        <div 
                            className={
                                message.comments.length 
                                ? `${styles.comments_show} ${styles.comments_btn}` 
                                : styles.comments_btn
                            }
                            onClick={openCommentsWindow}
                        ></div>

                        <div>Комментарии: {message.comments.length}</div>

                        <div 
                            className={
                                message.comments.length 
                                ? `${styles.comments_hide} ${styles.comments_btn}` 
                                : styles.comments_btn
                            }
                            onClick={closeCommentsWindow}
                        ></div>
                    </div>
                </div>
            </div>
            {showCommentsBlock && comments.length &&
                 <div className={styles.comments_bottom}>
                
                 
                     <CommentsBlock comments={comments} action={closeCommentsWindow}/>
                 
             </div>
            }   
            {/* <div className={styles.comments_bottom}>
                
                {showCommentsBlock && comments.length &&
                    <CommentsBlock comments={comments} action={closeCommentsWindow}/>
                }
            </div> */}
            <div className={styles.big_divider}></div>
        </div>
    );
};

export default MessageItem;