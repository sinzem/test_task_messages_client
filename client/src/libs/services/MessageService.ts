import axios, {type AxiosResponse} from "axios";

import $api from "../http";
import { IAddMessageDto, IGetMessages, IMessage } from "../types/IMesssage";

export default class MessageService {

    static async addMessage({role, text, parentMessageId, imageFile, textFile}: IAddMessageDto): Promise<AxiosResponse<{createdMessage: IMessage}>> {
        try {
            const formData = new FormData();
            formData.append("role", role);
            formData.append("text", text);
            if (parentMessageId) formData.append("parentMessageId", parentMessageId);
            if (imageFile) formData.append("imageFile", imageFile);
            if (textFile) formData.append("textFile", textFile);
            return $api.post<{createdMessage: IMessage}>("/api/messages", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Axios error:", error.response?.data)
                throw error
            } else {
                console.error("Error registration user:", error)
                throw new Error("Error registration user")
            }
        }
    }

    static async getMessages({ofset, limit, id}: IGetMessages): Promise<AxiosResponse<{messages: IMessage[]}>> {
        let query = `?lim=${limit}&of=${ofset}`;
        if (id) query += `&id=${id}`;
        try {
            return $api.get<{messages: IMessage[]}>(`/api/messages${query}`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Axios error:", error.response?.data)
                throw error
            } else {
                console.error("Error registration user:", error)
                throw new Error("Error registration user")
            }
        }
    }
}