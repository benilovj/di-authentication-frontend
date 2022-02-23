declare namespace Express {
  import pino from "pino";
  interface Request {
    i18n?: {
      language?: string;
    };
    t: TFunction;
    csrfToken?: () => string;
    log: pino.Logger;
  }
}
