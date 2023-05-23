interface SirvCdnTokenResponse {
  token: string;
  expiresIn: number;
}

interface SirvCdnFileData {
  filename: string;
  meta: FileMetaData;
}

interface FileMetaData {
  width?: number;
  height?: number;
}

export { SirvCdnFileData, SirvCdnTokenResponse };
