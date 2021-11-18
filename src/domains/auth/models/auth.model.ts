export type IAuthContentUser = {
  email: string;
  roleId?: string;
};

export type IContentRequest = {
  req: {
    user: IAuthContentUser;
  };
};

export type IContentRequestUserFields = keyof IAuthContentUser;

export interface JwtPayload {
  email: string;
  iat?: number;
  nbf: number;
  exp: number;
}
