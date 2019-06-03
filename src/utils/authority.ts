// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  return localStorage.getItem('backstage-authority') || 'user';
}

export function setAuthority(authority: string) {
  return localStorage.setItem('backstage-authority', authority);
}
