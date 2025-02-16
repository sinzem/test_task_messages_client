import { create } from "zustand";
import axios from "axios";

import MessageService from "../services/MessageService";
import { IAddMessageDto, IDirection, IGetMessages, IMessage, ISearchEntity } from "../types/IMesssage";

interface MessageState {
    limit: number;
    ofset: number;
    direction:  IDirection;
    entity: ISearchEntity;
    entityValue: string | null;
    minLength: boolean;
    maxLength: boolean;
    message: IMessage | null;
    messages: IMessage[] | null;
    isError: string | null;
    isGetMessagesError: string | null,
    isLoading: boolean;
    setLimit: (value: number) => void;
    setOfset: (value: number) => void;
    setDirection: (value: IDirection) => void;
    setEntity: (value: ISearchEntity) => void; 
    setEntityValue: (value: string) => void;
    addMessage: ({role, text, parentMessageId, imageFile, textFile}: IAddMessageDto) => Promise<IMessage | undefined>;
    newMessage: (newMessages: IMessage[]) => void;
    getMessages: ({ofset, limit, direction, entity, entityValue}: IGetMessages) => Promise<IMessage[] | undefined>;
}

export const useMessageStore = create<MessageState>((set) => ({
    limit: 25,
    ofset: 0,
    direction: "-1",
    entity: "name",
    entityValue: null,
    minLength: true,
    maxLength: false,
    message: null,
    messages: null,
    isError: null,
    isGetMessagesError: null,
    isLoading: false,
    
    setLimit: (value: number) => {
        set(() => ({limit: value}));
    },

    setOfset: (value: number) => {
        set(() => ({ofset: value}));
    },

    setDirection: (value: IDirection) => {
        set(() => ({direction: value}));
    },

    setEntity: (value: ISearchEntity) => {
        set(() => ({entity: value}));
    },

    setEntityValue: (value: string) => {
        set(() => ({entityValue: value}));
    },

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
                setTimeout(() => {set(() => ({ isError: null }))}, 3000);
            }  
        } catch (error) {
            if (axios.isAxiosError(error)) {
                set(() => ({ isError: error.response?.data.message }));
                setTimeout(() => {set(() => ({ isError: null }))}, 3000);
                throw error
              } else {
                set(() => ({ isError: "Connection error, try later" }));
                setTimeout(() => {set(() => ({ isError: null }))}, 3000);
                console.error("Connection error when logging into account:", error);
              }
        } finally {
            set(() => ({isLoading: false})); 
        }
    },

    newMessage: (newMessages: IMessage[]) => {
        set(() => ({messages: newMessages}));
    },

    getMessages: async ({ofset, limit, direction, entity, entityValue}) => {
        set(() => ({isLoading: true}));
        try {
            const response = await MessageService.getMessages({ofset, limit, direction, entity, entityValue});
            if (response && response.status === 200 && response.data.messages) {
                set(() => ({ messages: response.data.messages }));
                return response.data.messages;
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore       
                // eslint-disable-next-line no-unused-vars 
                set(() => ({ isGetMessagesError: response.response.data.message }));
                setTimeout(() => {set(() => ({ isGetMessagesError: null }))}, 3000);
            }  
        } catch (error) {
            if (axios.isAxiosError(error)) {
                set(() => ({ isGetMessagesError: error.response?.data.message }));
                setTimeout(() => {set(() => ({ isGetMessagesError: null }))}, 3000);
                throw error
              } else {
                set(() => ({ isGetMessagesError: "Connection error, try later" }));
                setTimeout(() => {set(() => ({ isGetMessagesError: null }))}, 3000);
                console.error("Connection error when logging into account:", error);
              }
        } finally {
            set(() => ({isLoading: false})); 
        }
    },
}))