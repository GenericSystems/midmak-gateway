import {
  GET_SIDEBAR_CONTENTS_SUCCESS,
  GET_SIDEBAR_CONTENTS_FAIL,
  GET_USER_SIDEBAR_CONTENTS_SUCCESS,
  GET_USER_SIDEBAR_CONTENTS_FAIL,
  GET_SEARCH_MENU_SUCCESS,
  GET_SEARCH_MENU_FAIL,
  GET_ROLE_SIDEBAR_SUCCESS,
  GET_ROLE_SIDEBAR_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  menu_items: [],
  filtered_items: [],
  role_menuItems: [],
  user_menu: [],
  error: {},
};

const menu_items = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SIDEBAR_CONTENTS_SUCCESS:
      return {
        ...state,
        menu_items: action.payload,
      };
    case GET_SIDEBAR_CONTENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_USER_SIDEBAR_CONTENTS_SUCCESS:
      return {
        ...state,
        user_menu: action.payload,
      };
    case GET_USER_SIDEBAR_CONTENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_SEARCH_MENU_SUCCESS:
      return {
        ...state,
        filtered_items: action.payload,
      };
    case GET_SEARCH_MENU_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_ROLE_SIDEBAR_SUCCESS:
      return {
        ...state,
        role_menuItems: action.payload,
      };
    case GET_ROLE_SIDEBAR_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};
export default menu_items;
