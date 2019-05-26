import BasicLayout from '../Layouts/BasicLayout';
import UserLayout from '../Layouts/UserLayout';

const routerData = {
  '/': {
    component: BasicLayout,
  },
  '/user': {
    component: UserLayout,
  },
};

export default routerData;
