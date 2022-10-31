// ** React Imports
import { Fragment } from "react";

// ** Dropdowns Imports

import IntlDropdown from "./IntlDropdown";

import CartDropdown from "./CartDropdown";

import UserDropdown from "./UserDropdown";

import NavbarSearch from "./NavbarSearch";

import NotificationDropdown from "./NotificationDropdown";

// ** Custom Components

import NavbarBookmarks from "./NavbarBookmarks";

// ** Third Party Components
import { Sun, Moon } from "react-feather";

import { NavItem, NavLink } from "reactstrap";
import React from "react";
import {
  InsertRowAboveOutlined,
  InsertRowLeftOutlined
} from '@ant-design/icons';

const ThemeNavbar = (props: any) => {
  // ** Props
  const { skin, setSkin, setMenuVisibility, layout, setLayout } = props;

  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    if (skin === "dark") {
          return <Sun className="ficon" onClick={() => setSkin("light")} />;
    } else {
          return <Moon className="ficon" onClick={() => setSkin("dark")} />;
    }
  };

  const MenuToggler = () => {
    if (layout === "VerticalLayout") {
          return <InsertRowAboveOutlined className="swMenu" onClick={() => setLayout("horizontal")} />;
    } else {
          return <InsertRowLeftOutlined className="swMenu" onClick={() => setLayout("vertical")} />;
    }
  };

  return (
      <Fragment>
      
      <div className="bookmark-wrapper d-flex align-items-center">
        
        <NavbarBookmarks setMenuVisibility={setMenuVisibility} />
      </div>
      
      <ul className="nav navbar-nav align-items-center ml-auto">
        
        {/* <IntlDropdown /> */}
        
        <NavItem className="d-none d-lg-block">
          
          <NavLink className="nav-link-style">
            <MenuToggler />

            <ThemeToggler />
          </NavLink>
        </NavItem>
        
        {/* <NavbarSearch />
        
        <CartDropdown />
        
        <NotificationDropdown /> */}
        
        <UserDropdown />
      </ul>
    </Fragment>
  );
};

export default ThemeNavbar;
