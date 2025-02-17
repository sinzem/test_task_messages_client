"use client"

import { useEffect} from "react";
import { useParams } from "next/navigation";

import styles from "./user.module.css";

import { useUserStore } from "@/libs/store/userStore";
import TopPanel from "@/components/modules/TopPanel/TopPanel";
import MessagesBlock from "@/components/modules/MessagesBlock/MessagesBlock";

const UserPage: React.FC = () => {

    const params = useParams();
    const id = params?.id;

    const { getUser } = useUserStore();

    useEffect(() => {
        if (id && typeof id === "string") {
            getUser(id);
        }
    }, [getUser, id])
 

    return (
        <div className={styles.main}>
            <TopPanel />
            <MessagesBlock />
        </div>
    )
}

export default UserPage;



