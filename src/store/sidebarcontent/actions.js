import {
  GET_SIDEBAR_CONTENTS,
  GET_SIDEBAR_CONTENTS_SUCCESS,
  GET_SIDEBAR_CONTENTS_FAIL,
  GET_USER_SIDEBAR_CONTENTS,
  GET_USER_SIDEBAR_CONTENTS_SUCCESS,
  GET_USER_SIDEBAR_CONTENTS_FAIL,
  GET_SEARCH_MENU,
  GET_SEARCH_MENU_SUCCESS,
  GET_SEARCH_MENU_FAIL,
  GET_ROLE_SIDEBAR,
  GET_ROLE_SIDEBAR_SUCCESS,
  GET_ROLE_SIDEBAR_FAIL,
} from "./actionTypes";

export const getSidebarContent = () => ({
  type: GET_SIDEBAR_CONTENTS,
});

export const getSidebarContentSuccess = menu_items => ({
  type: GET_SIDEBAR_CONTENTS_SUCCESS,
  payload: menu_items,
});

export const getSidebarContentFail = error => ({
  type: GET_SIDEBAR_CONTENTS_FAIL,
  payload: error,
});

export const getUserSidebarContent = user_menu => ({
  type: GET_USER_SIDEBAR_CONTENTS,
  payload: user_menu,
});

export const getUserSidebarContentSuccess = user_menu => ({
  type: GET_USER_SIDEBAR_CONTENTS_SUCCESS,
  payload: user_menu,
});

export const getUserSidebarContentFail = error => ({
  type: GET_USER_SIDEBAR_CONTENTS_FAIL,
  payload: error,
});

export const getRoleSidebar = () => ({
  type: GET_ROLE_SIDEBAR,
});

export const getRoleSidebarSuccess = role_menuItems => ({
  type: GET_ROLE_SIDEBAR_SUCCESS,
  payload: role_menuItems,
});

export const getRoleSidebarFail = error => ({
  type: GET_ROLE_SIDEBAR_FAIL,
  payload: error,
});



export const getSearchMenu = filtered_items => ({
  type: GET_SEARCH_MENU,
  payload: filtered_items
});

export const getSearchMenuSuccess = filtered_items => ({
  type: GET_SEARCH_MENU_SUCCESS,
  payload: filtered_items,
});

export const getSearchMenutFail = error => ({
  type: GET_SEARCH_MENU_FAIL,
  payload: error,
});
