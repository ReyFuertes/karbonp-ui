export interface ILoginInfo {
  email: string;
  password: string
}

export interface ILoginInfoResponse {
  isActiveUserEmployee: boolean;
  preferedLanguage: string;
  token: string;
  whiteLabel?: string;
}