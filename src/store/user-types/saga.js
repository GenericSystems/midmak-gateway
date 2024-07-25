import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_USER_TYPES,
  GET_USER_TYPE_DELETED_VALUE,
  ADD_NEW_USER_TYPE,
  DELETE_USER_TYPE,
  UPDATE_USER_TYPE,
} from "./actionTypes";

import {
  GET_FACULTIES,
} from "../mob-app-faculty-accs/actionTypes";

import {
  getUserTypesSuccess,
  getUserTypesFail,
  getUserTypeDeletedValueSuccess,
  getUserTypeDeletedValueFail,
  addUserTypeFail,
  addUserTypeSuccess,
  updateUserTypeSuccess,
  updateUserTypeFail,
  deleteUserTypeSuccess,
  deleteUserTypeFail,
} from "./actions";

// Include Both Helper File with needed methods
import {
  getUserTypes,
  getUserTypeDeletedValue,
  addNewUserType,
  updateUserType,
  deleteUserType,
  getFaculties
} from "../../helpers/fakebackend_helper";

import { getFacultiesSuccess, getFacultiesFail } from "../mob-app-faculty-accs/actions";

function* fetchUserTypes() {
  const get_userTypes_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_UserType",
  };
  try {
    const response = yield call(getUserTypes, get_userTypes_req);
    yield put(getUserTypesSuccess(response));
  } catch (error) {
    yield put(getUserTypesFail(error));
  }
}

function* fetchFaculties (){
 //get faculty
 const get_faculty_opt = {
  source: "db",
  procedure: "SisApp_getData",
  apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  tablename: "_Common_Faculty",
};
try {
  const response = yield call(getFaculties, get_faculty_opt);
  yield put(getFacultiesSuccess(response));
} catch (error) {
  yield put(getFacultiesFail(error));
}
}

function* fetchUserTypeDeletedValue() {
  try {
    const response = yield call(getUserTypeDeletedValue);
    console.log("in saga response",response)
    yield put(getUserTypeDeletedValueSuccess(response));
  } catch (error) {
    yield put(getUserTypeDeletedValueFail(error));
  }
}

function* onAddNewUserType({ payload, userType }) {
  delete payload["Id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_UserType";

  try {
    const response = yield call(addNewUserType, payload);
    yield put(addUserTypeSuccess(response[0]));
  } catch (error) {
    yield put(addUserTypeFail(error));
  }
}

function* onUpdateUserType({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_UserType";

  try {
    const respupdate = yield call(updateUserType, payload);
    yield put(updateUserTypeSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateUserTypeFail(error));
  }
}

function* onDeleteUserType({ payload, userType }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_UserType";

  try {
    const respdelete = yield call(deleteUserType, payload);
    yield put(deleteUserTypeSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteUserTypeFail(error));
  }
}

function* userTypesSaga() {
  yield takeEvery(GET_USER_TYPES, fetchUserTypes);
  yield takeEvery(GET_FACULTIES, fetchFaculties);
  yield takeEvery(GET_USER_TYPE_DELETED_VALUE, fetchUserTypeDeletedValue);
  yield takeEvery(ADD_NEW_USER_TYPE, onAddNewUserType);
  yield takeEvery(UPDATE_USER_TYPE, onUpdateUserType);
  yield takeEvery(DELETE_USER_TYPE, onDeleteUserType);
}

export default userTypesSaga;
