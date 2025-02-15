import { ReactNode } from "react";

import styles from "./messagesBtnBlock.module.css";
import ActionButton from "@/components/ui/buttons/ActionButton/ActionButton";

const MessagesBtnBlock = ({
    setShowMessageForm
}: {
    setShowMessageForm: (e: React.MouseEvent<HTMLButtonElement>) => void 
}): ReactNode => {
    return (
        <div className={styles.wrapper}>
            <ActionButton text="Новое сообщение" action={setShowMessageForm} size="small"/>
            <ActionButton text="К началу" size="small"/>
            <ActionButton text="Назад" size="small"/> 
            <ActionButton text="Вперед" size="small"/>
        </div>
    );
};

export default MessagesBtnBlock;