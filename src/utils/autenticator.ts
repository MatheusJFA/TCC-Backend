import { verify } from "jsonwebtoken";
import enviroment from "@/configuration/enviroment";

export const validPassword = (password: string) => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,30}$/.test(password)
 
export const validEmail = (email: string) => /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(email);

export const getPassword = (authorization: string): string => {
    const [, hash] = authorization.split(" ");
    return Buffer.from(hash, "base64").toString("utf8");
}

export const getEmailAndPassword = (authorization: string): string[] => {
    const [, hash] = authorization.split(" ");
    const [email, password] = Buffer.from(hash, "base64").toString("utf8").split(":");
    return [email, password];
}

export const tokenVerification = (token: string): boolean => {
    try {
        verify(token, enviroment.jwt.secret);
        return true;
    } catch (error) {
        return false;
    }
}