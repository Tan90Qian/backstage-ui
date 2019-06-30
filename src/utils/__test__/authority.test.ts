import { AuthorityType, storageKey, getAuthority, setAuthority } from '../authority';

beforeEach(() => {
  localStorage.clear();
});

it('will return guest initial', () => {
  const authority = getAuthority();
  expect(localStorage.getItem).toHaveBeenLastCalledWith(storageKey);
  expect(authority).toBe(AuthorityType.guest);
});

it('will set authority when call setAuthority()', () => {
  setAuthority(AuthorityType.user);
  expect(localStorage.setItem).toHaveBeenLastCalledWith(storageKey, AuthorityType.user);
  expect(getAuthority()).toBe(AuthorityType.user);
});
