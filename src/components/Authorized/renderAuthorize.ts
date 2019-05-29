/* eslint-disable import/no-mutable-exports */
import Authorized from './Authorized';

let CURRENT = 'NULL';
/**
 * use  authority or getAuthority
 * @param {string} currentAuthority
 */
const renderAuthorize = (authorized: typeof Authorized) => {
  return (currentAuthority: string) => {
    if (currentAuthority) {
      CURRENT = currentAuthority;
    } else {
      CURRENT = 'NULL';
    }
    return authorized;
  };
};

export { CURRENT };
export default (authorized: typeof Authorized) => renderAuthorize(authorized);
