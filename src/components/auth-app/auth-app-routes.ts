import { PATH_NAMES } from "../../app.constants";
import express from "express";
import {
    authAppAccountCreatedGet, authAppAccountCreatedPost,
    authAppGet, authAppPost,
} from "./auth-app-controller";

const router = express.Router();

router.get(
    PATH_NAMES.AUTH_APP,
    authAppGet
);

router.post(
    PATH_NAMES.AUTH_APP,
    authAppPost
);

router.get(
    PATH_NAMES.AUTH_APP_ACCOUNT_CREATED,
    authAppAccountCreatedGet
);

router.post(
    PATH_NAMES.AUTH_APP_ACCOUNT_CREATED,
    authAppAccountCreatedPost
);

export { router as authAppRouter };