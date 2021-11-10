export type IAuthValidUser = {
  email: string;
  role?: string;
};

export type IContentRequest = {
  req: {
    user: IAuthValidUser;
  };
};

export type IContentRequestUserFields = keyof IAuthValidUser;

export interface JwtPayload {
  email: string;
  iat?: number;
  nbf: number;
  exp: number;
}
