import { RouteComponentProps } from 'react-router';

import { IRouterData } from 'src/common/router';

export interface RouteComponentProps extends RouteComponentProps {
  routerData: IRouterData;
}
