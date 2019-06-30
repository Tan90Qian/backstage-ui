// use localStorage to store the authority info, which might be sent from server in actual project.
export enum AuthorityType {
  guest = 'guest',
  user = 'user',
  admin = 'admin',
}

export const storageKey = 'backstage-authority';

export function getAuthority() {
  return localStorage.getItem(storageKey) || AuthorityType.guest;
}

export function setAuthority(authority: AuthorityType) {
  return localStorage.setItem(storageKey, authority);
}
