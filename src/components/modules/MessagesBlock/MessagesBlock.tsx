"use client";
import React, { ReactElement, useState } from 'react';

import styles from "./messagesBlock.module.css";

import MessagesBtnBlock from '@/components/modules/MessagesBlock/MessagesBtnBlock/MessagesBtnBlock';
import MessagesList from './MessagesList/MessagesList';
import AddMessageForm from '../forms/AddMessageForm/AddMessageForm';
import SearchBlock from './SearchBlock/SearchBlock';

const MessagesBlock = (): ReactElement => {

    const [showMessageForm, setShowMessageForm] = useState<boolean>(false);

    const showForm = () => {
        setShowMessageForm(!showMessageForm);
    }
 
    return (
        <div className={styles.wrapper}>
            {showMessageForm &&
                <AddMessageForm action={setShowMessageForm} role="message" parentMessageId={null}/>
            }
            <div className={styles.top_btn_block}>
                <MessagesBtnBlock setShowMessageForm={showForm} />
                <SearchBlock />
            </div>
            <MessagesList/>
            <MessagesBtnBlock setShowMessageForm={showForm} />
        </div>
    );
};

export default MessagesBlock;
