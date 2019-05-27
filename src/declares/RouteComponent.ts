import { match } from 'react-router';
import { History } from 'history';

import { IRouterData } from 'src/common/router';

export interface IRouteComponentProps {
  routerData: IRouterData;
  location: Location;
  match: match;
  history: History;
}
