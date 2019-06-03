import 'rc-drawer/assets/index.css';
import React, { FunctionComponentElement } from 'react';
import DrawerMenu from 'rc-drawer';
import SiderMenu, { SiderMenuProps } from './SiderMenu';

// TODO 从rc基础组件改为antd的Drawer并改造为tsx
const SiderMenuWrapper = (props: SiderMenuProps): FunctionComponentElement<any> => {
  const { isMobile, collapsed } = props;
  return isMobile ? (
    <DrawerMenu
      getContainer={null}
      level={null}
      onHandleClick={() => {
        props.onCollapse(!collapsed);
      }}
      open={!collapsed}
      onMaskClick={() => {
        props.onCollapse(true);
      }}
    >
      <SiderMenu {...props} collapsed={isMobile ? false : collapsed} />
    </DrawerMenu>
  ) : (
    <SiderMenu {...props} />
  );
};

export default SiderMenuWrapper;
