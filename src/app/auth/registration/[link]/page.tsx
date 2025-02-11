"use client";

import { ReactNode } from "react";
import { redirect, useParams } from "next/navigation";

import styles from "./registrationAdminPage.module.css";

import RegistrationForm from "@/components/modules/forms/RegistrationForm/RegistrationForm";


const RegistrationAdminPage = (): ReactNode => {

    const params = useParams();
    const id = params?.link;

    if (typeof id !== "string") { 
        redirect(`/not-found`);
    }  

    const checkId = id.replace(/[^a-z0-9\-]/ig, "").trim();

    if (checkId && checkId === process.env.NEXT_PUBLIC_ADMIN_REGISTRATION_LINK) {
        return (
            <div className={styles.main}>
                <RegistrationForm link={checkId}/>
            </div>
        );
    }
    else {
        redirect(`/not-found`);
    } 
}

export default RegistrationAdminPage;