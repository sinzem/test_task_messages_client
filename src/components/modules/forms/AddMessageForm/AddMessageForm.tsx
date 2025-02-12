import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import * as sanitizeHtml from 'sanitize-html';

import styles from "./addMessageForm.module.css";
import textExample from "../../../../assets/pictures/txt_example.png";

import ActionButton from "@/components/ui/buttons/ActionButton/ActionButton";
import ImageUploader from "@/components/submodules/ImageUploader/ImageUploader";
import InsertInput from "@/components/modules/forms/InsertInput/InsertInput";
import InsertInputLink from "@/components/modules/forms/InsertInput/InsertLinkInput";
import { useMessageStore } from "@/libs/store/messageStore";


const AddMessageForm = ({
    role,
    parentMessageId,
    action
}: {
    role: "message" | "comment",
    parentMessageId: string | null,
    action: React.Dispatch<React.SetStateAction<boolean>>
}): ReactNode | Promise<ReactNode> => {

    const {addMessage} = useMessageStore();

    const [hideForm, setHideForm] = useState<boolean>(false);
    const [text, setText] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageForm, setImageForm] = useState<boolean>(false); 
    const [textFile, setTextFile] = useState<File | null>(null);
    const [textForm, setTextForm] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [insertInput, setInsertInput] = useState<string | null>(null);
    const [insertInputValue, setInsertInputValue] = useState<string | null>(null);

    useEffect(() => {
        if (imageFile) {
            setImageForm(!imageForm);
            const objectUrl = URL.createObjectURL(imageFile)
            setPreviewImage(objectUrl)

            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [imageFile]);

    useEffect(() => {
        if (textFile) {
            setTextForm(!textForm);
        }
    }, [textFile]);

    useEffect(() => {
        if (insertInputValue) {
            setText(text + insertInputValue)
            setInsertInput(null);
        }
    }, [insertInputValue]);


    const closeForm = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setHideForm(true);
            const timeout = setTimeout(() => {action(false)}, 500);
            return () => {
                clearTimeout(timeout);
            }
        }
    }

    function addImage(): void {
        setImageForm(!imageForm);
    }

    function addText(): void {
        setTextForm(!textForm);
    }

    const openInsertInput = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (e.currentTarget.dataset.sign) {
            setInsertInput(e.currentTarget.dataset.sign);
        }
    } 

    function sanitizeText(str: string): void {
        const checkMessage = sanitizeHtml(str, {
            allowedTags: ["i", "strong", "code", "a"],
            allowedAttributes: {
                a: [ 'href', "title" ],
            },
        });
        setText(checkMessage);
    }

    async function sendMessage(e: React.MouseEvent<HTMLButtonElement>): Promise<void> {
        e.preventDefault();
        const result = await addMessage({role, parentMessageId, text, imageFile, textFile});
        console.log(result);
    }


    return (
        <div className={`${styles.wrapper} ${hideForm ? styles.hide : styles.not_hide}`}>
            {imageForm && 
                <div className={styles.uploader}>
                    <div className={styles.close_uploader} onClick={addImage}>X</div>
                    <ImageUploader 
                        value="image"
                        title="Добавить изображение"
                        subtitle="Перетяните избражение сюда"
                        setFile={setImageFile} 
                    />
                </div>
            }
            {textForm && 
                <div className={styles.uploader}>
                    <div className={styles.close_uploader} onClick={addText}>X</div>
                    <ImageUploader 
                        value="text"
                        title="Добавить TXT"
                        subtitle="Перетяните файл сюда"
                        setFile={setTextFile} 
                    />
                </div>
                
            }
            <div className={styles.form_wrap}>
            <div className={styles.close} onClick={closeForm}>X</div>
                <div className={styles.buttons}>
                    <h3>Добавить</h3>
                    <ActionButton text="Изображение" action={addImage}/>
                    <ActionButton text="Текстовый файл" action={addText}/>
                </div>
                <div className={styles.inserts}>
                    <h3>Вставки:</h3>
                    <div className={styles.inserts_btns}>
                        <div tabIndex={0} className={styles.insert_btn} data-sign="link" onClick={openInsertInput}>Ссылка</div>
                        <div tabIndex={0} className={styles.insert_btn} data-sign="code" onClick={openInsertInput}>Код</div>
                        <div tabIndex={0} className={styles.insert_btn} data-sign="italic" onClick={openInsertInput}>Курсив</div>
                        <div tabIndex={0} className={styles.insert_btn} data-sign="strong" onClick={openInsertInput}>Жирный</div>
                    </div>
                </div>
                <form className={styles.form}>
                    {/* <label htmlFor="area">Введите Ваше сообщение</label> */}
                    <textarea 
                        id="area" 
                        name="area" 
                        className={styles.area} 
                        placeholder="Текст сообщения..."
                        value={text}
                        onChange={(e) => sanitizeText(e.target.value)}    
                    >
                    </textarea>

                    <div className={styles.preview}>
                    <h3>Предосмотр</h3>
                    <div className={styles.preview_wrap}>
                        <div className={styles.preview_docs}>
                            {previewImage && (
                                <div className={styles.preview_image}>
                                    <Image 
                                        src={previewImage} 
                                        alt="Uploaded image" 
                                        fill={true}
                                        sizes="(min-width: 100px)"
                                        className={styles.prev_img} 
                                    />
                                </div>
                            )}
                            {textFile && (
                                <div className={styles.preview_text}>
                                    <Image 
                                        src={textExample} 
                                        alt="Uploaded txt" 
                                        fill={true}
                                        sizes="(min-width: 80px)"
                                        className={styles.prev_img} 
                                    />
                                </div>
                            )}
                        </div>
                        <div className={styles.preview_txt} dangerouslySetInnerHTML={{ __html: text }} />
                    </div>
                </div>
                    
                    <div className={styles.send_button}>
                        <ActionButton text="Отправить" action={sendMessage}/>
                    </div>
                </form>
            </div>
            {insertInput && insertInput === "link" &&
                <InsertInputLink 
                    closeAction={setInsertInput}
                    setAction={setInsertInputValue}
                />
            }
            {insertInput && insertInput !== "link" &&
                <InsertInput 
                    sign={insertInput}
                    closeAction={setInsertInput}
                    setAction={setInsertInputValue}
                />
            }
        </div>
    );
};

export default AddMessageForm;