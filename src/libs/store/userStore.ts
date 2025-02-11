import { create } from "zustand";
import axios from "axios";

import { IUpdateUserDto, IUser } from "../types/IUser";
import AuthService from "../services/AuthService";
// import { AuthResponse } from "../models/response/AuthResponse";
// import { API_URL } from "../http";
import { ILoginDto } from "../types/authorization/loginModels";
import UserService from "../services/UserService";
import { IRegistrationDto } from "../types/authorization/registrationModels";


interface UserState {
  user: IUser | null;
  isAuth: string;
  isError: string;
  isLoading: boolean;
  login: ({email, password, forgottenPassword, saveData}: ILoginDto) => Promise<void>;
  registration: ({name, email, password, saveData}: IRegistrationDto) => Promise<void>;
  registrationAdmin: ({name, email, password, saveData}: IRegistrationDto) => Promise<void>;
  logout: () => Promise<void>;
  getUser: (id: string) => Promise<void>;
  updateUser: ({name, email, password}: IUpdateUserDto) => Promise<IUser | undefined>;
  addUserPhoto: (file: File) => Promise<IUser | undefined>;
}

export const useUserStore = create<UserState>((set) => ({

    user: null,
    isAuth: "",
    isError: "",
    isLoading: false,

    login: async ({email, password, forgottenPassword, saveData}) => {
        set(() => ({isLoading: true}));
        try {
            const response = await AuthService.login({email, password, forgottenPassword, saveData});
            if (response && response.status === 200 && response.data.user) {
                set(() => ({ user: response.data.user, isAuth: response.data.user?.activation }));
            } else if (response && response?.status === 200 && response.data.message) {
                set(() => ({ isAuth: response.data.message }));
                setTimeout(() => {set(() => ({ isAuth: '' }))}, 5000);
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore       
                // eslint-disable-next-line no-unused-vars 
                set(() => ({ isError: response.response.data.message }));
                setTimeout(() => {set(() => ({ isError: '' }))}, 5000);
            }  
        } catch (error) {
            if (axios.isAxiosError(error)) {
                set(() => ({ isError: error.response?.data.message }));
                setTimeout(() => {set(() => ({ isError: '' }))}, 5000);
                throw error
              } else {
                set(() => ({ isError: "Connection error, try later" }));
                setTimeout(() => {set(() => ({ isError: '' }))}, 5000);
                console.error("Connection error when logging into account:", error);
              }
        } finally {
            set(() => ({isLoading: false})); 
        }
    },

    registration: async ({name, email, password, saveData}) => {
        set(() => ({isLoading: true}));
        try {
            set(() => ({isAuth: ""}));
            const response = await AuthService.registration({name, email, password, saveData});
            if (response && response.status === 200 && response.data.user) {
                set(() => ({ user: response.data.user, isAuth: response.data.user?.activation }));
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore       
                // eslint-disable-next-line no-unused-vars 
                set(() => ({ isError: response.response.data.message }));
                setTimeout(() => {set(() => ({ isError: '' }))}, 5000);
            }  
        } catch (error) {
            if (axios.isAxiosError(error)) {
                set(() => ({ isError: error.response?.data.message }));
                setTimeout(() => {set(() => ({ isError: '' }))}, 5000);
                throw error
              } else {
                set(() => ({ isError: "Connection error, try later" }));
                setTimeout(() => {set(() => ({ isError: '' }))}, 5000);
                console.error("Connection error during registration:", error);
              }
        } finally {
            set(() => ({isLoading: false}));
        } 
    },

    registrationAdmin: async ({name, email, password, saveData}) => {
        set(() => ({isLoading: true}));
        try {
            set(() => ({isAuth: ""}));
            const response = await AuthService.registrationAdmin({name, email, password, saveData});
            if (response && response.status === 200 && response.data.user) {
                set(() => ({ user: response.data.user, isAuth: response.data.user?.activation }));
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore       
                // eslint-disable-next-line no-unused-vars 
                set(() => ({ isError: response.response.data.message }));
                setTimeout(() => {set(() => ({ isError: '' }))}, 5000);
            }  
        } catch (error) {
            if (axios.isAxiosError(error)) {
                set(() => ({ isError: error.response?.data.message }));
                setTimeout(() => {set(() => ({ isError: '' }))}, 5000);
                throw error
              } else {
                set(() => ({ isError: "Connection error, try later" }));
                setTimeout(() => {set(() => ({ isError: '' }))}, 5000);
                console.error("Connection error during registration:", error);
                // throw new Error("Connection error during registration");
              }
        } finally {
            set(() => ({isLoading: false}));
        } 
    },

    logout: async () => {
        set(() => ({isLoading: true}));
        try {
            localStorage.removeItem('accessToken');
            const response = await AuthService.logout();
            if (response && response.status === 200 && response.data.message) {
                set(() => ({ user: null, isAuth: "" }));
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore       
                // eslint-disable-next-line no-unused-vars 
                set(() => ({ isError: response.response.data.message }));
                setTimeout(() => {set(() => ({ isError: '' }))}, 5000);
            } 
        } catch (error) {
            if (axios.isAxiosError(error)) {
                set(() => ({ isError: error.response?.data.message }));
                setTimeout(() => {set(() => ({ isError: '' }))}, 5000);
                throw error
              } else {
                set(() => ({ isError: "Connection error, try later" }));
                setTimeout(() => {set(() => ({ isError: '' }))}, 5000);
                console.error("Connection error during registration:", error);
              }
        }
        set(() => ({isLoading: false}));
    },
    
    getUser: async (id) => {
        set(() => ({isLoading: true}));
        try {
            const response = await UserService.fetchUser(id);
            if (response && response.status === 200 && response.data.user) {
                set(() => ({ user: response.data.user }));
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore       
                // eslint-disable-next-line no-unused-vars 
                set(() => ({ isError: response.response.data.message }));
                setTimeout(() => {set(() => ({ isError: '' }))}, 6000);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                set(() => ({ isError: error.response?.data.message }));
                setTimeout(() => {set(() => ({ isError: '' }))}, 6000);
                throw error
              } else {
                set(() => ({ isError: "Connection error, try later" }));
                setTimeout(() => {set(() => ({ isError: '' }))}, 6000);
                console.error("Connection error while retrieving user data:", error)
                throw new Error("Connection error while retrieving user data")
              }
        } finally {
            set(() => ({isLoading: false}));
        }
    },

    updateUser: async ({name, email, password}) => {
        set(() => ({isLoading: true}));
        try {
            const response = await UserService.updateUser({name, email, password});
            if (response && response.status === 200 && response.data.user) {
                set(() => ({ user: response.data.user }));
                return response.data.user;
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore       
                // eslint-disable-next-line no-unused-vars 
                set(() => ({ isError: response.response.data.message }));
                setTimeout(() => {set(() => ({ isError: '' }))}, 5000);
            }  
        } catch (error) {
            if (axios.isAxiosError(error)) {
                set(() => ({ isError: error.response?.data.message }));
                setTimeout(() => {set(() => ({ isError: '' }))}, 5000);
                throw error
              } else {
                set(() => ({ isError: "Connection error, try later" }));
                setTimeout(() => {set(() => ({ isError: '' }))}, 5000);
                console.error("Connection error during registration:", error);
              }
        } finally {
            set(() => ({isLoading: false}));
        } 
    },

    addUserPhoto: async (file) => {
        set(() => ({isLoading: true}));
        try {
            const response = await UserService.addUserPhoto(file);
            if (response && response.status === 201 && response.data.user) {
                set(() => ({ user: response.data.user }));
                return response.data.user;
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore       
                // eslint-disable-next-line no-unused-vars 
                set(() => ({ isError: response.response.data.message }));
                setTimeout(() => {set(() => ({ isError: '' }))}, 5000);
            }  
        } catch (error) {
            if (axios.isAxiosError(error)) {
                set(() => ({ isError: error.response?.data.message }));
                setTimeout(() => {set(() => ({ isError: '' }))}, 5000);
                throw error
              } else {
                set(() => ({ isError: "Connection error, try later" }));
                setTimeout(() => {set(() => ({ isError: '' }))}, 5000);
                // console.error("Connection error during registration:", error);
              }
        } finally {
            set(() => ({isLoading: false}));
        } 
    },

}))


