import { ReactNode } from "react";

import styles from "./feed.module.css";

import TopPanelEmpty from "@/components/modules/TopPanel/TopPanelEmpty";
import MessagesBlock from "@/components/modules/MessagesBlock/MessagesBlock";

const Feed = (): ReactNode => {
    return (
        <div className={styles.main}>
            <TopPanelEmpty />
            <MessagesBlock />
        </div>
    );
};

export default Feed;