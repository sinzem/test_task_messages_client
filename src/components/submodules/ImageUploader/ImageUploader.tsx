"use client"

import type React from "react";
import { useState, useRef, type DragEvent, ReactNode, useEffect } from "react";
import Image from "next/image";
import Compressor from "compressorjs";

import styles from "./imageUploader.module.css";

import ActionButton from "@/components/ui/buttons/ActionButton/ActionButton";
import FullScreenMessage from "@/components/ui/popups/FullScreenMessage/FullScreenMessage";
import { useUserStore } from "@/libs/store/userStore";

const ImageUploader = ({
    value,
    img,
    title,
    subtitle,
    setFile
}: {
    value: "image" | "text",
    img?: string,
    title: string,
    subtitle: string,
    setFile: React.Dispatch<React.SetStateAction<File | null>>;
}): ReactNode => {

    const { isError } = useUserStore();
 
    const [dragActive, setDragActive] = useState<boolean>(false);
    
    const [error, setError] = useState<string | null>(null); 
    const [disabledButton, setDisabledButton] = useState<boolean>(false); 
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isError.length > 0 || error) {
            setDisabledButton(true);
        } else {
            setDisabledButton(false);
        }
    }, [error, isError])

    const handleDrag = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files)
        }
    }

    const handleFiles = (files: FileList) => {
        const file = files[0];
        const format = file.name.split(".").at(-1);
        const permitFormat = String(process.env.NEXT_PUBLIC_IMG_FORMAT).split(",");
        if (file.type.startsWith("image/") && value === "image") {
            if (file.type.startsWith("image/") && format && permitFormat.includes(format)) {
                new Compressor(file, {
                    quality: 1, 
                    maxWidth: 320,
                    maxHeight: 240,
                    success: (result) => {
                        const compressedFile = new File([result], file.name, {
                            type: result.type,
                            lastModified: Date.now(),
                        })
                        setFile(compressedFile)
                    },
                    error: (err) => {
                        setError("Ошибка сжатия файла");
                        console.log(err);
                        timeoutClean(setError);
                    },
                  })
            } else {
                setError(`Недопустимый формат файла. Разрешен ${process.env.NEXT_PUBLIC_IMG_FORMAT}`);
                timeoutClean(setError);
            }
        } else if (file.type.startsWith("text/") && value === "text") {
            if (file.type.startsWith("text/") && format && format === "txt" && file.size < 100000) {
                setFile(file)
            } else {
                setError(`Недопустимый формат или размер файла. Разрешен txt формат до 100кБ`);
                timeoutClean(setError);
            }
        } else {
            setError(`Недопустимый формат или размер файла. Разрешен txt,${process.env.NEXT_PUBLIC_IMG_FORMAT}`);
            timeoutClean(setError);
        }
    
    }

    const onButtonClick = () => {
        inputRef.current?.click()
    }

    return (
        <div
            className={`${styles.uploader} ${dragActive ? styles.active : styles.inactive}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
    
            <input ref={inputRef} type="file" className="hidden" accept={`${value}/*`} onChange={handleChange} />
            
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.photo_place}>
                {img &&
                    <Image src={img} alt="image" className={styles.image}/>
                }
                {error && 
                    <FullScreenMessage text={error}/>
                }
                {isError && 
                    <FullScreenMessage text={isError}/>
                }
            </div>
            <h3>{subtitle}</h3>
            <h4>-или-</h4>
            <ActionButton text="Загрузить" action={onButtonClick} disabled={disabledButton}/>
          
        </div>
    )
}

export default ImageUploader

const timeoutClean = (setter: React.Dispatch<React.SetStateAction<string | null>>) => {
    const timeout = setTimeout(() => {setter(null)}, 3000);
    return () => clearTimeout(timeout);
}
