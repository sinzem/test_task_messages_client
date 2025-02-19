"use client";

import { ReactElement, SetStateAction, useState } from "react";

import styles from "./viewingFiles.module.css";
import Image from "next/image";
// import $api from "@/libs/http";

const ViewingFiles = ({
    address,
    value,
    setter 
}: {
    address: string;
    value: "image" | "text";
    setter: React.Dispatch<SetStateAction<boolean>>;
}): ReactElement => {

    // const [text, setText] = useState<string>("");
    const [size, setSize] = useState<number>(320);
    const [hide, setHide] = useState<boolean>(false);

    // useEffect(() => {
    //     if (value === "text") {
    //         getTextFile(); 
    //     }
    // }, [])

    // async function getTextFile() {
    //     $api.get(`files/txt/${address}`)
    //         .then((res) => setText(res.data))
    // }

    function changeSizeUp() {
        if (size < 640) {
            setSize(size + 40);
        }
    }
    function changeSizeDown() {
        if (size > 320) {
            setSize(size - 40);
        }
    }

    function closePopup() {
        setHide(true);
        const timeout = setTimeout(() => {setter(false)}, 500);
        return () => clearTimeout(timeout);
    }

    return (
        <div className={hide ? `${styles.wrapper} ${styles.hide}` : `${styles.wrapper} ${styles.show}`}>
            <div className={styles.main}>
                <div className={styles.frame} style={{width: `${size}px`, height: `${size}px`}}> 
                    {value === "text" && 
                        // <pre>{text}</pre>
                        <iframe 
                            className={styles.text_frame}
                            src={`${String(process.env.NEXT_PUBLIC_APP_SERVER_URL)}/api/files/txt/${address}`} 
                        >
                        </iframe>
                    }
                    {value === "image" &&
                        <Image 
                            src={`${String(process.env.NEXT_PUBLIC_APP_SERVER_URL)}/api/files/images/${address}`}
                            alt="Image added by the author" 
                            fill={true}
                            sizes="(min-width: 100px)" 
                            className={styles.file}   
                        />
                    }
                </div>
            </div>
            <div className={styles.navigation}>
                <button className={size > 600 ? styles.vague : ''} onClick={changeSizeUp}>Size +</button>
                <button className={size < 360 ? styles.vague : ''} onClick={changeSizeDown}>Size -</button>
                <button onClick={closePopup}>Close</button>
            </div>
        </div>
    );
};

export default ViewingFiles;