"use client";
import React, { ReactNode, useState } from 'react';

import styles from "./messagesBlock.module.css";
import MessagesBtnBlock from '@/components/submodules/MessagesBtnBlock/MessagesBtnBlock';
import Messages from '../Messages/Messages';
import AddMessageForm from '../forms/AddMessageForm/AddMessageForm';

const MessagesBlock = (): ReactNode => {

    const [showMessageForm, setShowMessageForm] = useState<boolean>(false);

    const showForm = () => {
        setShowMessageForm(!showMessageForm);
    }
 
    return (
        <div className={styles.wrapper}>
            {showMessageForm &&
                <AddMessageForm action={setShowMessageForm} role="message" parentMessageId={null}/>
            }
            <MessagesBtnBlock setShowMessageForm={showForm} />
            <Messages/>
            <MessagesBtnBlock setShowMessageForm={showForm} />
        </div>
    );
};

export default MessagesBlock;