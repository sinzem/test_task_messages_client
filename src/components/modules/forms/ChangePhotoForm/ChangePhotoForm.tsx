"use client";

import { ReactElement, useEffect, useState } from "react";

import styles from "./changePhotoForm.module.css";

import { useUserStore } from "@/libs/store/userStore";
import ImageUploader from "@/components/submodules/ImageUploader/ImageUploader";
import FullScreenMessage from "@/components/ui/popups/FullScreenMessage/FullScreenMessage";

const ChangePhotoForm = ({
    action
}: {
    action: React.Dispatch<React.SetStateAction<boolean>>;
}): ReactElement => {

    const {addUserPhoto} = useUserStore();
    const [hideForm, setHideForm] = useState<boolean>(false);
    const [showResultMessage, setShowResultMessage] = useState<string | null>(null);
    const [image, setImage] = useState<File | null>(null);

    useEffect(() => {
        if (image) {
            addUserPhoto(image)
                .then((user) => {
                    if (user) {
                        setShowResultMessage("Успешная загрузка");
                        const timeout = setTimeout(() => {
                            setShowResultMessage(null);
                            setHideForm(true);
                            action(false)
                        }, 3000);
                        return () => {
                            clearTimeout(timeout);
                        }
                    }
                })
        }
    }, [image]);

    const closeForm = (e: React.MouseEvent<HTMLDivElement>): void | (() => void) => {
        if (e.target === e.currentTarget) {
            setHideForm(true);
            const timeout = setTimeout(() => {action(false)}, 500);
            return () => {
                clearTimeout(timeout);
            }
        }
    }

    return (
        <div className={`${styles.wrapper} ${hideForm ? styles.hide : styles.not_hide}`}>
            
            <div className={styles.popup}>
            <div className={styles.close} onClick={closeForm}>X</div>
                <ImageUploader 
                    value="image"
                    title="Фото профиля"
                    subtitle="Перетяните фото сюда"
                    setFile={setImage}    
                />
                {showResultMessage && 
                    <FullScreenMessage text={showResultMessage} value="success"/>
                }
            </div> 
        </div>
    )
};

export default ChangePhotoForm;

