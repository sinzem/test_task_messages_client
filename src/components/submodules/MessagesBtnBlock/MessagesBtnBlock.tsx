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
            <ActionButton text="Новое сообщение" action={setShowMessageForm}/>
            <ActionButton text="Назад"/> 
            <ActionButton text="Вперед"/>
        </div>
    );
};

export default MessagesBtnBlock;