export interface IUser {
    id: string;
    name: string;
    email: string;
    activation: string;
    role: string;
    photo?: string;
    createdAt: Date;
}

export interface IUpdateUserDto {
    name: string;
    email: string;
    password: string;
}