export interface IMessage {
    ownerId: string;
    ownerPhoto?: string;
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