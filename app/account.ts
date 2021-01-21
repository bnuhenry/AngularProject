    export interface Account{
        username: string;
        password: string;
        time: number;
        sign: string;
    }

    export interface Token{
        accountid: string;
        logintime: string;
        token: string;
    }

    export interface UserEmail{
        username: string;
        email: string;
        time: number;
        sign: string;
    }

    export interface ChangePass{
        username: string;
        password: string;
        newpassword: string;
        time: number;
        sign: string;
    }