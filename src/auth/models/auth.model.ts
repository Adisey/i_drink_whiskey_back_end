export type IAuthValidUser = {
  email: string;
  role?: string;
};

export interface JwtPayload {
  email: string;
  iat?: number;
  nbf: number;
  exp: number;
}
