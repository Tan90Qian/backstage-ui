import { observable, action } from 'mobx';
import { Location } from 'history';
import { IRouterData } from 'src/router/router';

class GlobalStore {
  @observable globalTitle = 'Backstage-ui';

  @observable globalCopyright = 'Backstage-ui 2019';

  @observable isMobile = false;

  @observable breadcrumbNameMap: IRouterData = {};

  @observable location: Location<any> = null;

  @action
  setIsMobile(isMobile: boolean) {
    this.isMobile = isMobile;
  }

  @action
  setBreadcrumbNameMap(breadcrumbNameMap: IRouterData) {
    this.breadcrumbNameMap = breadcrumbNameMap;
  }

  @action
  setLocation(location: Location<any>) {
    this.location = location;
  }
}

export default new GlobalStore();
