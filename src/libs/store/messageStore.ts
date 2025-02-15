import { create } from "zustand";
import axios from "axios";

import MessageService from "../services/MessageService";
import { IAddMessageDto, IGetMessages, IMessage } from "../types/IMesssage";

interface MessageState {
    limit: number;
    ofset: number;
    message: IMessage | null;
    messages: IMessage[] | null;
    isError: string | null;
    isLoading: boolean;
    addMessage: ({role, text, parentMessageId, imageFile, textFile}: IAddMessageDto) => Promise<IMessage | undefined>;
    newMessage: (newMessages: IMessage[]) => void;
    getMessages: ({ofset, limit, id}: IGetMessages) => Promise<void>;
}

export const useMessageStore = create<MessageState>((set) => ({
    limit: 25,
    ofset: 0,
    message: null,
    messages: null,
    isError: null,
    isLoading: false,

    addMessage: async ({role, text, parentMessageId, imageFile, textFile}) => {
        set(() => ({isLoading: true}));
        try {
            const response = await MessageService.addMessage({role, text, parentMessageId, imageFile, textFile});
            if (response && response.status === 201 && response.data.createdMessage) {
                set(() => ({ message: response.data.createdMessage }));
                return response.data.createdMessage;
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore       
                // eslint-disable-next-line no-unused-vars 
                set(() => ({ isError: response.response.data.message }));
                setTimeout(() => {set(() => ({ isError: '' }))}, 3000);
            }  
        } catch (error) {
            if (axios.isAxiosError(error)) {
                set(() => ({ isError: error.response?.data.message }));
                setTimeout(() => {set(() => ({ isError: '' }))}, 3000);
                throw error
              } else {
                set(() => ({ isError: "Connection error, try later" }));
                setTimeout(() => {set(() => ({ isError: '' }))}, 3000);
                console.error("Connection error when logging into account:", error);
              }
        } finally {
            set(() => ({isLoading: false})); 
        }
    },

    newMessage: (newMessages: IMessage[]) => {
        set(() => ({messages: newMessages}));
    },

    getMessages: async ({ofset, limit, id}) => {
        set(() => ({isLoading: true}));
        try {
            const response = await MessageService.getMessages({ofset, limit, id});
            if (response && response.status === 200 && response.data.messages) {
                set(() => ({ messages: response.data.messages }));
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore       
                // eslint-disable-next-line no-unused-vars 
                set(() => ({ isError: response.response.data.message }));
                setTimeout(() => {set(() => ({ isError: '' }))}, 3000);
            }  
        } catch (error) {
            if (axios.isAxiosError(error)) {
                set(() => ({ isError: error.response?.data.message }));
                setTimeout(() => {set(() => ({ isError: '' }))}, 3000);
                throw error
              } else {
                set(() => ({ isError: "Connection error, try later" }));
                setTimeout(() => {set(() => ({ isError: '' }))}, 3000);
                console.error("Connection error when logging into account:", error);
              }
        } finally {
            set(() => ({isLoading: false})); 
        }
    },
}))