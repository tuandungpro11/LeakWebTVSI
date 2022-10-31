// ** React Imports
import { useEffect } from "react";
import { NavLink } from "react-router-dom";

// ** Third Party Components
import { X, Anchor, FastForward } from "react-feather";

// ** Config

import themeConfig from "@configs/themeConfig";

const VerticalMenuHeader = (props: any) => {
  // ** Props
  const {
    menuCollapsed,
    setMenuCollapsed,
    setMenuVisibility,
    setGroupOpen,
    menuHover,
  } = props;

  // ** Reset open group
  useEffect(() => {
    if (!menuHover && menuCollapsed) setGroupOpen([]);
  }, [menuHover, menuCollapsed]);

  const currentSkin = JSON.parse(localStorage.getItem('skin')) ?? themeConfig.layout.skin;

  // ** Menu toggler component
  const Toggler = () => {
    if (!menuCollapsed) {
      return (
        <Anchor
          size={24}
          data-tour="toggle-icon"
          className="text-primary toggle-icon d-none d-xl-block"
          onClick={() => setMenuCollapsed(true)}
        />
      );
    } else {
      return (
        <FastForward
          size={24}
          data-tour="toggle-icon"
          className="text-primary toggle-icon d-none d-xl-block"
          onClick={() => setMenuCollapsed(false)}
        />
      );
    }
  };

  const renderLogo = () => {
    if (currentSkin === 'dark') {
      if (!menuCollapsed) {
        return <img src={themeConfig.app.appLogoDarkImage} alt="logo" />
      } else {
        return <img src={themeConfig.app.appLogoShortDarkImage} alt="logo" />
      }
    } else {
      if (!menuCollapsed) {
        return <img src={themeConfig.app.appLogoImage} alt="logo" />
      } else {
        return <img src={themeConfig.app.appLogoShortImage} alt="logo" />
      }
    }
  }

  return (
    <div className="navbar-header">

      <ul className="nav navbar-nav flex-row">

        <li className="nav-item mr-auto">

          <NavLink to="/" className="navbar-brand">
            <span className="brand-logo">
              {renderLogo()}
            </span>
            {/* <h2 className="brand-text mb-0">{themeConfig.app.appName}</h2> */}
          </NavLink>
        </li>

        <li className="nav-item nav-toggle">

          <div className="nav-link modern-nav-toggle cursor-pointer">

            <Toggler />

            <X
              onClick={() => setMenuVisibility(false)}
              className="toggle-icon icon-x d-block d-xl-none"
              size={20}
            />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default VerticalMenuHeader;
