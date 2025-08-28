import { io } from "socket.io-client";

export const socket = io("http://localhost:4000"); 
// if using device/emulator, replace with your computer's local IP, e.g. http://192.168.1.10:5000
