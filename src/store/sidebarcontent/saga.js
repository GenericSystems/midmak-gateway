import { call, put, takeEvery } from "redux-saga/effects";

import {
  GET_SIDEBAR_CONTENTS,
  GET_USER_SIDEBAR_CONTENTS,
  GET_SEARCH_MENU,
  GET_ROLE_SIDEBAR,
} from "./actionTypes";
import {
  getSidebarContentSuccess,
  getSidebarContentFail,
  getUserSidebarContentSuccess,
  getUserSidebarContentFail,
  getSearchMenuSuccess,
  getSearchMenutFail,
  getRoleSidebarSuccess,
  getRoleSidebarFail,
} from "./actions";

import {
  getSidebarContent,
  getUserSidebarContent,
  getSearchMenu,
  getRoleSidebar,
} from "../../helpers/fakebackend_helper";

function* fetchSidbarContents() {
  const GET_SIDEBAR_CONTENTS_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_SideBar",
    filter: `isActive = 1`,
  };
  try {
    const response = yield call(getSidebarContent, GET_SIDEBAR_CONTENTS_req);
    response.map(resp => {
      resp["children"] = JSON.parse(resp["children"]);
      resp["children"]
        .sort((a, b) => {
          return a.orderItem - b.orderItem;
        })
        .map(child => {
          child["children"] = JSON.parse(child["children"]);
          child["children"].sort((a, b) => {
            return a.orderItem - b.orderItem;
          });
        });
    });
    yield put(getSidebarContentSuccess(response));
  } catch (error) {
    yield put(getSidebarContentFail(error));
  }
}

function* fetchUserSidbarContents(payload) {
  const GET_SIDEBAR_CONTENTS_req = {
    source: "db",
    procedure: "getUserSidBar",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_UserSideBar",
    userId: `${payload.payload.userId}`,
  };
  try {
    const response = yield call(
      getUserSidebarContent,
      GET_SIDEBAR_CONTENTS_req
    );

    response.map(resp => {
      resp["children"] = JSON.parse(resp["children"]);

      resp["children"] = resp["children"]
        .sort((a, b) => a.orderItem - b.orderItem)
        .map(child => {
          child["children"] = JSON.parse(child["children"]);

          child["children"] = child["children"].sort(
            (a, b) => a.orderItem - b.orderItem
          );

          return child;
        });

      return resp;
    });
    
    yield put(getUserSidebarContentSuccess(response));
  } catch (error) {
    yield put(getUserSidebarContentFail(error));
  }
}

function* fetchRoleSidbar() {
  const GET_SIDEBAR_CONTENTS_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_RoleSidbar",
    filter: `isActive = 1`,
  };
  try {
    const response = yield call(getRoleSidebar, GET_SIDEBAR_CONTENTS_req);
    response.map(resp => {
      resp["children"] = JSON.parse(resp["children"]);
    });

    yield put(getRoleSidebarSuccess(response));
  } catch (error) {
    yield put(getRoleSidebarFail(error));
  }
}

function* fetchSearch(obj) {
  let SearchValue = obj.payload.search;
  let userId = obj.payload.userId;
  console.log("obj", obj);
  const get_Search_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_SearchMenu",
    filter: `userId = ${userId} and (label LIKE ''''%${SearchValue}%'''' or otherLabel LIKE ''''%${SearchValue}%'''')`,
  };
  try {
    const response = yield call(getSearchMenu, get_Search_req);

    yield put(getSearchMenuSuccess(response));
  } catch (error) {
    yield put(getSearchMenutFail(error));
  }
}

function* sidbarcontentsSaga() {
  yield takeEvery(GET_SIDEBAR_CONTENTS, fetchSidbarContents);
  yield takeEvery(GET_USER_SIDEBAR_CONTENTS, fetchUserSidbarContents);
  yield takeEvery(GET_ROLE_SIDEBAR, fetchRoleSidbar);
  yield takeEvery(GET_SEARCH_MENU, fetchSearch);
}

export default sidbarcontentsSaga;
