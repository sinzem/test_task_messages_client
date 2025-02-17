import { ReactElement, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import styles from "./searchBlock.module.css";
import searchIcon from "../../../../assets/icons/search_icon.png";

import LineMessage from '@/components/ui/popups/LineMessage/LineMessage';
import { IDirection, ISearchEntity } from '@/libs/types/IMesssage';
import { useMessageStore } from '@/libs/store/messageStore';
import { useUserStore } from '@/libs/store/userStore';
import { checkEmail } from '@/libs/services/checkers';

const SearchBlock = (): ReactElement => {

    const {user} = useUserStore();
    const {
        limit,
        direction, 
        entity, 
        isGetMessagesError,
        setEntity, 
        setEntityValue, 
        setDirection,
        setPrevBtnDisabled, 
        setNextBtnDisabled,
        setOfset, 
        getMessages, 
        setOpenCommentsCounter,
    } = useMessageStore();

    const [searchInputValue, setSearchInputValue] = useState<string>(""); 
    const [searchPlaceholderValue, setSearchPlaceholderValue] = useState<string>("Введите никнейм...");
    const [errorSearchRequest, setErrorSearchRequest] = useState<string | null>(null); 

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus(); 
        }
    }, [errorSearchRequest]);

    useEffect(() => {
        if (entity === "name") {
            setSearchPlaceholderValue("Введите никнейм...")
        } else if (entity === "email") {
            setSearchPlaceholderValue("Введите E-mail...")
        } else if (entity === "date") {
            setSearchPlaceholderValue("Введите дату  ДД.ММ.ГГ")
        }
    }, [entity])

    const checkSearchInputValue = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const searchInputValue = e.target.value.replace(/[^@()а-яёъa-z0-9_\.\'\:\;\- ]/ig, "");
        setSearchInputValue(searchInputValue);
    }

    const searchQuery = (e: React.MouseEvent<HTMLButtonElement>): void | (() => void) => {
        e.preventDefault();
        let searchQuery: string | null;
        if (!user || !user.activation) {
            setErrorSearchRequest("Только для зарегистрированных пользователей");
            const timeout = setTimeout(() => {setErrorSearchRequest(null)}, 3000);
            return () => clearTimeout(timeout);
        }
        if (entity === "name" && searchInputValue.length) {
            searchQuery = searchInputValue.trim();

            if (!searchQuery.length) {
                setErrorSearchRequest("Введите валидное имя");
                const timeout = setTimeout(() => {setErrorSearchRequest(null)}, 3000);
                return () => clearTimeout(timeout);
            }
        } else if (entity === "email" && searchInputValue.length) {
            const checkedValue = checkEmail(searchInputValue);
            if (!checkedValue) {
                setErrorSearchRequest("Введите валидный E-mail");
                const timeout = setTimeout(() => {setErrorSearchRequest(null)}, 3000);
                return () => clearTimeout(timeout);
            }
            searchQuery = searchInputValue;
        } else if (entity === "date" && searchInputValue.length) {
            const checkDate = searchInputValue.trim().split(".");
            if (checkDate.length !== 3 
                || checkDate[0].length !== 2
                || checkDate[1].length !== 2
                || checkDate[2].length !== 2
                || (+checkDate[0] < 1 || +checkDate[0] > 31)
                || (+checkDate[1] < 1 || +checkDate[1] > 12)
                || (+checkDate[2] < 0 || +checkDate[2] > 99)
            ) {
                setErrorSearchRequest("Введите валидную дату");
                const timeout = setTimeout(() => {setErrorSearchRequest(null)}, 3000);
                return () => clearTimeout(timeout);
            }
            searchQuery = searchInputValue;
        } else {
            setErrorSearchRequest("Ошибка запроса");
            const timeout = setTimeout(() => {setErrorSearchRequest(null)}, 3000);
            return () => clearTimeout(timeout);
        }

        getMessages({limit, ofset: 0, direction, entity, entityValue: searchQuery})
            .then((res) => {
                if (typeof res === "object") {
                    setSearchInputValue("");
                    setOfset(res.length);
                    setPrevBtnDisabled(true);
                    setEntityValue(searchQuery);
                    setOpenCommentsCounter(0);
                    if (res.length < limit) {
                        setNextBtnDisabled(true);
                    } else {
                        setNextBtnDisabled(false);
                    }
                }
            });
    } 

    return (
        <form className={styles.search_block}>
            <select 
                name="direction" 
                id="direction" 
                value={direction}
                onChange={(e) => setDirection(e.target.value as IDirection)}
            >
                <option disabled value="">Направление</option>
                <option value="-1">От последнего</option>
                <option value="1">От первого</option>
            </select>
            <select 
                name="value" 
                id="value" 
                value={entity}
                onChange={(e) => setEntity(e.target.value as ISearchEntity)}
            >
                <option disabled value="">Значение</option>
                <option value="name">Никнейм</option>
                <option value="email">E-mail</option>
                <option value="date">Дата</option>
            </select>
            <div className={styles.input_block}>
                <input 
                    ref={inputRef}
                    id="search" 
                    type="text" 
                    name="search"
                    placeholder={searchPlaceholderValue}
                    value={searchInputValue}
                    onChange={checkSearchInputValue}
                />
                <button className={styles.search_btn} onClick={searchQuery}>
                    <Image src={searchIcon} alt="search button"/>
                </button>
            </div>

            {errorSearchRequest && 
                <LineMessage text={errorSearchRequest} location="right"/>
            }

            {isGetMessagesError && 
                <LineMessage text={isGetMessagesError} location="right"/>
            }

        </form>
    );
};

export default SearchBlock;