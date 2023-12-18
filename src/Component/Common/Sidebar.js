import React, { useState } from "react";
import { Layout, Menu, Drawer } from "antd";

import { NavLink, withRouter } from "react-router-dom";

const { Sider } = Layout;

function Container({ location, links, visible, setVisible }) {
  const DrawerLayout = () => {
    return (
      <Drawer
        placement="left"
        closable={true}
        onClose={() => setVisible(!visible)}
        visible={visible}
        className="d-block d-md-none"
      >
        <Menu
          selectedKeys={[location.pathname]}
          mode="inline"
          style={{ height: "100%", borderRight: 0 }}
        >
          {links.map((x) => (
            <Menu.Item key={x.path} icon={x.icon}>
              <NavLink to={x.path} className="nav-text">
                {x.name}
              </NavLink>
            </Menu.Item>
          ))}
        </Menu>
      </Drawer>
    );
  };

  return (
    <div>
      {DrawerLayout()}
      <div className="d-none d-md-block">
        <Sider width={240}>
          <Menu
            selectedKeys={[location.pathname]}
            mode="inline"
            style={{ height: "100%", borderRight: 0 }}
          >
            {links.map((x) => (
              <Menu.Item key={x.path} icon={x.icon}>
                <NavLink to={x.path} className="nav-text">
                  {x.name}
                </NavLink>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
      </div>
    </div>
  );
}

export default withRouter(Container);
