import { genSalt, hash } from 'bcryptjs';

export const ADMIN_ROLE_ID = '9';

export const isRoleAdmin = (role: string): boolean => role === ADMIN_ROLE_ID;

export const showRole = (roleId: string): string => {
  return roleId === ADMIN_ROLE_ID ? 'Admin' : 'User';
};

export const passwordHash = async (password: string): Promise<string> => {
  const salt = await genSalt(10);
  return await hash(password, salt);
};
