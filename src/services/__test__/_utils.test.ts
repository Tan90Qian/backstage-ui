import { createBrowserHistory } from 'history';

enum TestAuthorityType {
  guest = 'guest',
  test = 'test',
}

const history = createBrowserHistory();

const spy = jest.spyOn(history, 'push');

const mockAuthority = {
  getAuthority: jest.fn(),
  setAuthority: jest.fn(),
  AuthorityType: TestAuthorityType,
};

const mockAuthorized = {
  reloadAuthorized: jest.fn(),
};

beforeEach(() => {
  jest.doMock('src/utils/Authorized', () => mockAuthorized);
  jest.doMock('src/utils/authority', () => mockAuthority);
});

it('will not call mock fn with guest authority', async () => {
  mockAuthority.getAuthority.mockReturnValue(TestAuthorityType.guest);
  const { doLogout } = await import('../_utils');
  doLogout(history);
  expect(spy).not.toHaveBeenCalled();
  expect(mockAuthority.setAuthority.mock.calls.length).toBe(0);
  expect(mockAuthorized.reloadAuthorized.mock.calls.length).toBe(0);
});

it('will call mock fn with other authority', async () => {
  mockAuthority.getAuthority.mockReturnValue(TestAuthorityType.test);
  const { doLogout } = await import('../_utils');
  doLogout(history);
  expect(spy).toHaveBeenCalled();
  expect(mockAuthority.setAuthority.mock.calls.length).toBe(1);
  expect(mockAuthority.setAuthority.mock.calls[0][0]).toBe(TestAuthorityType.guest);
  expect(mockAuthorized.reloadAuthorized.mock.calls.length).toBe(1);
});
