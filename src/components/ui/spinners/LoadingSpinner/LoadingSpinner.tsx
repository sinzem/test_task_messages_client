"use client";

import { ReactNode } from "react";
import Image from "next/image";

import styles from "./loadingSpinner.module.css";
import spinner from "../../../../assets/gif/103.gif";

import { useUserStore } from '@/libs/store/userStore';


const LoadingSpinner = (): ReactNode => {

    const {isLoading} = useUserStore();
    
    if (isLoading) {
        return (
            <div className={styles.spinner_wrap}>
                <Image className={styles.spinner} src={spinner} alt="loading..."/>
            </div>
        );
    }
   
};

export default LoadingSpinner;