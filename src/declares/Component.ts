import { RouteComponentProps } from 'react-router';

import { IRouterData } from 'src/router/router';

export interface RouteComponentProps extends RouteComponentProps {
  routerData: IRouterData;
}
