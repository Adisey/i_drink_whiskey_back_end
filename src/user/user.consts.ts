export const ADMIN_ROLE = '9';

export const showRole = (role: string): string => {
  return role === ADMIN_ROLE ? 'Admin' : 'User';
};
