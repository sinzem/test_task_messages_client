export interface IMessage {
    _id: string;
    authId: string;
    authPhoto?: string;
    authName: string;
    authEmail: string;
    role: string;
    text: string;
    image?: string;
    textFile?: string;
    parentMessageId?: string;
    comments: string[]; 
    createdAt: Date;
}
export interface IAddMessageDto {
    role: "message" | "comment";
    text: string;
    parentMessageId: string | null;
    imageFile: File | null;
    textFile: File | null;
}

export interface IGetMessages {
    ofset: number;
    limit: number;
    id?: string;
}