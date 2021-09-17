import {
  getBaseRequestConfigWithClientSession,
  Http,
  http,
} from "../../utils/http";
import { API_ENDPOINTS, USER_STATE } from "../../app.constants";

import {
  ClientInfoResponse,
  ShareInfoServiceInterface,
  UpdateUserProfile,
} from "./types";

const UPDATE_TYPE_CAPTURE_CONSENT = "CAPTURE_CONSENT";

export function shareInfoService(
  axios: Http = http
): ShareInfoServiceInterface {
  const updateProfile = async function (
    sessionId: string,
    clientSessionId: string,
    email: string,
    consent: boolean
  ): Promise<boolean> {
    const { data } = await axios.client.post<UpdateUserProfile>(
      API_ENDPOINTS.UPDATE_PROFILE,
      {
        email,
        profileInformation: consent,
        updateProfileType: UPDATE_TYPE_CAPTURE_CONSENT,
      },
      getBaseRequestConfigWithClientSession(sessionId, clientSessionId)
    );

    return data.sessionState === USER_STATE.ADDED_CONSENT;
  };

  const clientInfo = async function (
    sessionId: string,
    clientSessionId: string
  ): Promise<ClientInfoResponse> {
    const { data } = await axios.client.get<ClientInfoResponse>(
      API_ENDPOINTS.CLIENT_INFO,
      getBaseRequestConfigWithClientSession(sessionId, clientSessionId)
    );
    return data;
  };

  return {
    updateProfile,
    clientInfo,
  };
}