"use client";

import { ReactNode, useState } from "react";
import Image from "next/image";

import styles from "./messageItem.module.css";
import insteadTxt from "../../../../assets/pictures/txt_example.png";
import anonimus from "../../../../assets/pictures/anonymous.png";

import ViewingFiles from "@/components/ui/popups/ViewingFiles/ViewingFiles";
import AddMessageForm from "../../forms/AddMessageForm/AddMessageForm";
import { IMessage } from "@/libs/types/IMesssage";


const MessageItem = ({message}: {message: IMessage}): ReactNode => {

    const [showImageFile, setShowImageFile] = useState<boolean>(false); 
    const [showTextFile, setShowTextFile] = useState<boolean>(false); 

    const [showCommentForm, setShowCommentForm] = useState<boolean>(false);

    function showImage() {
        setShowImageFile(true);
    }

    function showText() {
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

    const addComment = () => {
        setShowCommentForm(true);
    } 

    return (
        <div className={styles.wrapper}>
            
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
                <div className={styles.time}>{dateString(message.createdAt)}</div>
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
                    <button className={styles.comments_add} onClick={addComment}>Добавить комментарий</button>
                    <div className={styles.comments_nav}>
                        <div className={
                            message.comments.length 
                            ? `${styles.comments_show} ${styles.comments_btn}` 
                            : styles.comments_btn
                        }></div>

                        <div>Комментарии: {message.comments.length}</div>

                        <div className={
                            message.comments.length 
                            ? `${styles.comments_hide} ${styles.comments_btn}` 
                            : styles.comments_btn
                        }></div>
                    </div>
                </div>
            </div>
            <div className={styles.big_divider}></div>
        </div>
    );
};

export default MessageItem;