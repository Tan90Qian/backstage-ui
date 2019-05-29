import { match } from 'react-router';
import { History } from 'history';

import { IRouterData } from 'src/common/router';

export interface RouteComponentProps {
  routerData: IRouterData;
  location: Location;
  match: match;
  history: History;
}
