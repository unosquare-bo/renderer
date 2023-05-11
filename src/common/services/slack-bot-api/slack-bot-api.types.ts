interface SlackBotApiTokenResponse {
  token: string;
}

interface SlackBotApiImageData {
  id: number;
  fileName: string;
  x: number;
  y: number;
}

export { SlackBotApiTokenResponse, SlackBotApiImageData };
