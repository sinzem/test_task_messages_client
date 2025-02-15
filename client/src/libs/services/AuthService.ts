
import axios, {type AxiosResponse} from "axios";

import $api from "../http";
import { AuthResponse } from "../types/response/AuthResponse";
import { ILoginDto } from "../types/authorization/loginModels";
import { IRegistrationDto } from "../types/authorization/registrationModels";


export default class AuthService {
    static async login({email, password, forgottenPassword, saveData}: ILoginDto): Promise<AxiosResponse<AuthResponse>> {
        try {
            return $api.post<AuthResponse>("/api/auth/login", {email, password, forgottenPassword, saveData});
        } catch (error) { 

            if (axios.isAxiosError(error)) {
                console.error("Axios error:", error.response?.data)
                throw error
            } else {
                console.error("Error login user:", error)
                throw new Error("Error login user")
            }
        }
    }

    static async registration({name, email, password, saveData}: IRegistrationDto): Promise<AxiosResponse<AuthResponse>> {
        try {
            return $api.post<AuthResponse>("/api/auth/registration", {name, email, password, saveData});
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

    static async registrationAdmin({name, email, password, saveData}: IRegistrationDto): Promise<AxiosResponse<AuthResponse>> {
        try {
            return $api.post<AuthResponse>(`/api/auth/registration/${process.env.NEXT_PUBLIC_ADMIN_REGISTRATION_LINK}`, {name, email, password, saveData});
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

    static async logout(): Promise<AxiosResponse<{message: string}>> {
        try {
            return $api.get("api/auth/logout");
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

