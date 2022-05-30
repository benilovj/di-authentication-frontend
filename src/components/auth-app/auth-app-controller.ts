import { Request, Response } from "express";
import {PATH_NAMES} from "../../app.constants";
import { authenticator } from 'otplib';

const QRCode = require("qrcode");


export function authAppGet(req: Request, res: Response): void {
    let TEMPLATE_NAME = "auth-app/index.njk";
    //base32 encoded secret
    let secretkey = '';
    console.log("TOKEN: " + authenticator.generate(secretkey));

    //by default this uses sha-1
    let qrString = 'otpauth://totp/<email>?secret='+secretkey+'&issuer=GOV.UK%20SignIn&algorithm=SHA1&digits=6&period=30';
    QRCode.toDataURL(qrString, { version: 10 }, (err: any, qrcode: any) => {
        if (err) res.send("Error occurred");
        res.render(TEMPLATE_NAME, { qrCode: qrcode, secretKey: secretkey});
    });
}


export function authAppAccountCreatedGet(req: Request, res: Response): void {
    let ACCOUNT_CREATED_TEMPLATE_NAME = "auth-app/account-created-index.njk";

    res.render(ACCOUNT_CREATED_TEMPLATE_NAME,);
}

export function authAppAccountCreatedPost(req: Request, res: Response): void {
    let url = PATH_NAMES.AUTH_APP;

    res.redirect(url,);
}


export function authAppPost(req: Request, res: Response): void {
    let url = PATH_NAMES.AUTH_APP_ACCOUNT_CREATED;
    console.log("SecretKey:" + req.body.secretKey);
    console.log("AuthCode: " + req.body.authCode);
    console.log("*******************************");
    let isValidCode = authenticator.check(req.body.authCode, req.body.secretKey);
    console.log("Is Successful: " + isValidCode);
    if (!isValidCode) {
        url = PATH_NAMES.AUTH_APP;
    }
    const queryParams = new URLSearchParams({
        authCode: req.body.authCode,
    }).toString();
    res.redirect(url);
}
