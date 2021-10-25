import { genSalt, hash } from 'bcryptjs';
export const ADMIN_ROLE = '9';

export const showRole = (role: string): string => {
  return role === ADMIN_ROLE ? 'Admin' : 'User';
};

export const passwordHash = async (password: string): Promise<string> => {
  const salt = await genSalt(10);
  return await hash(password, salt);
};
