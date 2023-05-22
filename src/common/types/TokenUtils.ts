import { SirvCdnTokenResponse } from "../services/sirv-cdn/sirv-cdn.types";
import { SlackBotApiTokenResponse } from "../services/slack-bot-api/slack-bot-api.types";

export default interface TokenUtils {
  getToken: () => string;
  setToken: (token: string) => void;
  refreshToken: () => Promise<SirvCdnTokenResponse | SlackBotApiTokenResponse>;
}
