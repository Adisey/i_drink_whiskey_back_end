export type IAuthKokenUser = {
  email: string;
  roleId?: string;
};

export type IContentRequest = {
  req: {
    user: IAuthKokenUser;
  };
};

export type IContentRequestUserFields = keyof IAuthKokenUser;

export interface JwtPayload {
  email: string;
  iat?: number;
  nbf: number;
  exp: number;
}
