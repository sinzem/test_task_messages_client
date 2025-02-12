import { IMessage } from "../IMesssage";

export interface MessageResponse {
    createdMessage?: IMessage;
    message?: string;
}