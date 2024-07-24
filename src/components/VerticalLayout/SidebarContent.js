import PropTypes from "prop-types";
import React, { Component } from "react";

// Simple bar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
// i18n
import { withTranslation } from "react-i18next";
import {
  getUserSidebarContent,
  getSearchMenu,
} from "../../store/sidebarcontent/actions";

class SidebarContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      filteredMenuItems: [],
      menu_items: [],
    };

    this.refDiv = React.createRef();
  }

  componentDidMount() {
    this.initMenu();

    const { user_menu, onGetUserSideBar, userId } = this.props;

    if (user_menu && !user_menu.length) {
      onGetUserSideBar({ userId });
      this.setState({ user_menu });
    }
  }

  componentDidUpdate(prevProps, prevState, ss) {
    if (this.props.user_menu !== prevProps.user_menu) {
      this.setState({ user_menu: this.props.user_menu }, () => {
        this.initMenu();
      });
    }
  }

  initMenu() {
    new MetisMenu("#side-menu");

    let matchingMenuItem = null;
    const ul = document.getElementById("side-menu");
    const items = ul.getElementsByTagName("a");
    for (let i = 0; i < items.length; ++i) {
      if (this.props.location.pathname === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      this.activateParentDropdown(matchingMenuItem);
    }
  }

  activateParentDropdown = item => {
    item.classList.add("active");
    const parent = item.parentElement;

    const parent2El = parent.childNodes[1];
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      this.scrollElement(item);
      return false;
    }
    this.scrollElement(item);
    return false;
  };

  scrollElement = item => {
    setTimeout(() => {
      if (this.refDiv.current !== null) {
        if (item) {
          const currentPosition = item.offsetTop;
          if (currentPosition > window.innerHeight) {
            if (this.refDiv.current)
              this.refDiv.current.getScrollElement().scrollTop =
                currentPosition - 300;
          }
        }
      }
    }, 300);
  };

  handleSearchChange = event => {
    const { onGetSearchMenu ,userId} = this.props;
    const search = event.target.value;
    let obj = {search: search, userId: userId}
    onGetSearchMenu(obj);
    this.setState({ searchTerm: search });
  };

  highlightSearchTerm = (label, searchTerm) => {
    if (!searchTerm) {
      return <span>{label}</span>;
    }

    const regex = new RegExp(
      `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = label.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} style={{ color: "#cae8e9" }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  render() {
    const { user_menu, filtered_items, t } = this.props;
    const { searchTerm } = this.state;

    return (
      <React.Fragment>
        <SimpleBar className="h-100" ref={this.refDiv}>
          <div id="sidebar-menu">
            <ul className="metismenu list-unstyled" id="side-menu">
              <li className="menu-title">{this.props.t("Menu")}</li>

              <div className="mt-4">
                <div className="ml-4">
                  <input
                    type="search"
                    className="form-control_search rounded-pill w-75"
                    placeholder={t("Search...")}
                    value={searchTerm}
                    onChange={this.handleSearchChange}
                  />
                </div>

                {searchTerm !== "" && (
                  <ul>
                    {filtered_items.map(item => (
                      <li key={item.key}>
                        <Link
                          to={item.to}
                          className="searchSideBar"
                          style={{ color: "#00c4ca" }}
                        >
                          <i className={item.icon} />
                          {this.highlightSearchTerm(
                            this.props.t(item.label),
                            searchTerm
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <li className="menu-title">{this.props.t("Apps")}</li>

              {user_menu.map(element => {
                element.flag = 1;

                if (element.flag === 1) {
                  return (
                    <li key={element.key}>
                      <Link
                        to={element.to}
                        className={
                          element.key === "dashboards"
                            ? "no-arrow"
                            : element.children && element.children.length > 0
                            ? "has-arrow"
                            : "no-arrow"
                        }
                      >
                        <i className={element.icon} />
                        {element.isNew === 1 && (
                          <span className="badge rounded-pill bg-success float-end">
                            {this.props.t("New")}
                          </span>
                        )}
                        <span>{this.props.t(element.label)}</span>
                      </Link>
                      {element.children && element.children.length > 0 && (
                        <ul className="sub-menu">
                          {element.children.map(child => {
                            if (child.key === "newStd" && child.isAdd === 0) {
                              return null; // Skip rendering this item
                            }

                            if (child.key) {
                              const childIconClassName = child.icon || "";

                              return (
                                <li key={child.key}>
                                  <Link
                                    to={child.to}
                                    className={
                                      child.children &&
                                      child.children.length > 0
                                        ? "has-arrow"
                                        : ""
                                    }
                                  >
                                    {childIconClassName && (
                                      <i className={childIconClassName} />
                                    )}
                                    {this.props.t(child.label)}
                                  </Link>

                                  {child.children && child.children.length > 0 && (
                                    <ul
                                      className="sub-menu"
                                      aria-expanded="false"
                                    >
                                      {child.children.map(subChild => {
                                        if (subChild.key) {
                                          const subChildIconClassName =
                                            subChild.icon || "";

                                          return (
                                            <li key={subChild.key}>
                                              <Link
                                                to={subChild.to}
                                                className={
                                                  subChild.children &&
                                                  subChild.children.length > 0
                                                    ? subChild.className
                                                    : ""
                                                }
                                              >
                                                {subChildIconClassName && (
                                                  <i
                                                    className={
                                                      subChildIconClassName
                                                    }
                                                  />
                                                )}
                                                {this.props.t(subChild.label)}
                                              </Link>
                                              {subChild.children &&
                                                subChild.children.length >
                                                  0 && (
                                                  <ul
                                                    className="sub-menu"
                                                    aria-expanded="false"
                                                  >
                                                    {subChild.children.map(
                                                      newChild => {
                                                        if (newChild.key) {
                                                          const newChildIconClassName =
                                                            newChild.icon || "";

                                                          return (
                                                            <li
                                                              key={newChild.key}
                                                            >
                                                              <Link
                                                                to={newChild.to}
                                                              >
                                                                {newChildIconClassName && (
                                                                  <i
                                                                    className={
                                                                      newChildIconClassName
                                                                    }
                                                                  />
                                                                )}
                                                                {this.props.t(
                                                                  newChild.label
                                                                )}
                                                              </Link>
                                                            </li>
                                                          );
                                                        }
                                                        return null;
                                                      }
                                                    )}
                                                  </ul>
                                                )}
                                            </li>
                                          );
                                        }
                                        return null;
                                      })}
                                    </ul>
                                  )}
                                </li>
                              );
                            }
                            return null;
                          })}
                        </ul>
                      )}
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </div>
        </SimpleBar>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ menu_items, login }) => ({
  user_menu: menu_items.user_menu,
  filtered_items: menu_items.filtered_items,
  userId: localStorage.getItem("userId"),
});

const mapDispatchToProps = dispatch => ({
  onGetUserSideBar: userId => dispatch(getUserSidebarContent(userId)),
  onGetSearchMenu: search => dispatch(getSearchMenu(search)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(SidebarContent)));
