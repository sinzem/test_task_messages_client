import { io } from "socket.io-client";

export const socket = io(String(process.env.NEXT_PUBLIC_APP_SERVER_URL));