"use client";
import React, { ReactNode, useState } from 'react';

import styles from "./messagesBlock.module.css";
import searchIcon from "../../../assets/icons/search_icon.png";

import MessagesBtnBlock from '@/components/modules/MessagesBlock/MessagesBtnBlock/MessagesBtnBlock';
import MessagesList from './MessagesList/MessagesList';
import AddMessageForm from '../forms/AddMessageForm/AddMessageForm';
import Image from 'next/image';

const MessagesBlock = (): ReactNode => {

    const [showMessageForm, setShowMessageForm] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>("");

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
                <form className={styles.search_block}>
                    <input 
                        id="search" 
                        type="text" 
                        name="search"
                        placeholder="Имя, адрес или дата..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <button className={styles.search_btn}>
                        <Image src={searchIcon} alt="search button"/>
                    </button>
                </form>
            </div>
            
            <MessagesList/>
            <MessagesBtnBlock setShowMessageForm={showForm} />
        </div>
    );
};

export default MessagesBlock;