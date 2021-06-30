import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { getApiBaseUrl } from "../config";
import Logger, { getLogLabel } from "./logger";

const logger: Logger = new Logger();
const logLabel: string = getLogLabel(__filename);

export class Http {
  private instance: AxiosInstance;

  private headers: Readonly<Record<string, string | boolean>> = {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Credentials": true,
    "X-Requested-With": "XMLHttpRequest",
  };

  get client(): AxiosInstance {
    return this.instance || this.initHttp();
  }

  private handleError(error: any) {
    const { response } = error;

    const { data } = response;
    logger.error(error.message, logLabel, { error: JSON.stringify(data) });

    return Promise.reject(error);
  }

  private injectCustomHeaders(config: AxiosRequestConfig): AxiosRequestConfig {
    //TODO basic auth for api
    return config;
  }

  private initHttp() {
    const http = axios.create({
      baseURL: getApiBaseUrl(),
      headers: this.headers,
    });

    http.interceptors.request.use(this.injectCustomHeaders, (error) =>
      Promise.reject(error)
    );

    http.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );

    this.instance = http;
    return http;
  }
}
export const http = new Http();
