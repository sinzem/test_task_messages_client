// import { AxiosResponse } from "../types/axios/axios";
import axios, { type AxiosResponse } from "axios";

import $api from "../http";
import { IUpdateUserDto, IUser } from "../types/IUser";

export default class UserService {
    static fetchUsers() /* :Promise<AxiosResponse<IUser[]>> */ {
        return $api.get<IUser[]>("/users");
    }

    static fetchUser(id: string): Promise<AxiosResponse<{user :IUser}>>  {
        try {
            return $api.get<{user: IUser}>(`/api/users/${id}`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Axios error:", error.response?.data)
                throw error
            } else {
                console.error("Error fetching user:", error)
                throw new Error("Error fetching user")
            }
        }
    }

    static updateUser({name, email, password}: IUpdateUserDto): Promise<AxiosResponse<{user :IUser}>>  {
        try {
            return $api.put<{user: IUser}>(`/api/users`, {name, email, password});
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Axios error:", error.response?.data)
                throw error
            } else {
                console.error("Error fetching user:", error)
                throw new Error("Error fetching user")
            }
        }
    }

    static addUserPhoto(file: File): Promise<AxiosResponse<{user :IUser}>>  {
        try {
            const formData = new FormData();
            formData.append("file", file);
            return $api.post<{user: IUser}>(`/api/users/photo`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Axios error:", error.response?.data)
                throw error
            } else {
                console.error("Error fetching user:", error)
                throw new Error("Error fetching user")
            }
        }
    }
}
