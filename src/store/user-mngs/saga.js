import { call, put, takeEvery } from "redux-saga/effects";
import {
  GET_USER_MNGS,
  ADD_NEW_USER_MNG,
  DELETE_USER_MNG,
  UPDATE_USER_MNG,
  GET_USER_MNG_DELETED_VALUE,
  GET_USER_FACULTIES,
  ADD_NEW_USER_FACULTY,
  DELETE_USER_FACULTY,
  GET_USER_FACULTY_DELETED_VALUE,
  ADD_NEW_USER_ROLE,
} from "./actionTypes";
import {
  getUserMngsSuccess,
  getUserMngsFail,
  addUserMngFail,
  addUserMngSuccess,
  updateUserMngSuccess,
  updateUserMngFail,
  deleteUserMngSuccess,
  deleteUserMngFail,
  getUserMngDeletedValueSuccess,
  getUserMngDeletedValueFail,
  getUserFacultiesSuccess,
  getUserFacultiesFail,
  addUserFacultySuccess,
  addUserFacultyFail,
  deleteUserFacultySuccess,
  deleteUserFacultyFail,
  getUserFacultyDeletedValueSuccess,
  getUserFacultyDeletedValueFail,
  addUserRoleSuccess,
  addUserRoleFail,
} from "./actions";

import {
  getUserMngs,
  addNewUserMng,
  updateUserMng,
  deleteUserMng,
  getUserMngDeletedValue,
  getUserFaculties,
  addNewUserFaculty,
  deleteUserFaculty,
  getUserFacultyDeletedValue,
  addNewUserRole,
} from "../../helpers/fakebackend_helper";


function* fetchUserMngs() {
  const get_userMngs_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_SystemUsers",
  };
  try {
    const response = yield call(getUserMngs, get_userMngs_req);
    response.map(resp => {
      resp["userRoles"] = JSON.parse(resp["userRoles"]);
    });
    yield put(getUserMngsSuccess(response));
  } catch (error) {
    yield put(getUserMngsFail(error));
  }

}

function* onAddNewUserMng({ payload, userMng }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_SystemUsers";
  try {
    const response = yield call(addNewUserMng, payload);
    yield put(addUserMngSuccess(response[0]));
  } catch (error) {
    yield put(addUserMngFail(error));
  }
}

function* onUpdateUserMng({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_SystemUsers";
  try {
    const respupdate = yield call(updateUserMng, payload);
    yield put(updateUserMngSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateUserMngFail(error));
  }
}
function* onDeleteUserMng({ payload, UserMng }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_SystemUsers";
  try {
    const respdelete = yield call(deleteUserMng, payload);
    yield put(deleteUserMngSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteUserMngFail(error));
  }
}
function* onGetUserMngDeletedValue() {
  try {
    const response = yield call(getUserMngDeletedValue)
    yield put(getUserMngDeletedValueSuccess(response))
  } catch (error) {
    yield put(getUserMngDeletedValueFail(error))
  }

}


function* fetchUserFaculties(obj) {
  let userId = obj.payload
  const get_userFaculties_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_systemUserFaculty",
    filter: `userId = ${userId}`
  };
  try {
    const response = yield call(getUserFaculties, get_userFaculties_req);
    yield put(getUserFacultiesSuccess(response));
  } catch (error) {
    yield put(getUserFacultiesFail(error));
  }
}

function* onAddNewUserFaculty({ payload, userFaculty }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "Roles_updateUserFaculties";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_systemUserFaculty";
  payload["queryname"] = "_Common_systemUserFaculty"
  try {
    const response = yield call(addNewUserFaculty, payload);
    yield put(addUserFacultySuccess(response));
  } catch (error) {
    yield put(addUserFacultyFail(error));
  }
}

function* onDeleteUserFaculty({ payload, UserFaculty }) {

  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_systemUserFaculty";
  try {
    const respdelete = yield call(deleteUserFaculty, payload);
    yield put(deleteUserFacultySuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteUserFacultyFail(error));
  }
}
function* onGetUserFacultyDeletedValue() {
  try {
    const response = yield call(getUserFacultyDeletedValue)
    yield put(getUserFacultyDeletedValueSuccess(response))
  } catch (error) {
    yield put(getUserFacultyDeletedValueFail(error))
  }

}


function* onAddNewUserRole({ payload, role }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addMultiSelect";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_RoleUsers";
  payload["filter"] = `userId = ${payload.userId}`;
  payload["field"] = "roleId,userId";
  try {
    const response = yield call(addNewUserRole, payload);
    yield put(addUserRoleSuccess(response[0]));
    yield fetchUserMngs();
  } catch (error) {
    yield put(addUserRoleFail(error));
  }
}


function* userMngsSaga() {
  yield takeEvery(GET_USER_MNGS, fetchUserMngs);
  yield takeEvery(ADD_NEW_USER_MNG, onAddNewUserMng);
  yield takeEvery(UPDATE_USER_MNG, onUpdateUserMng);
  yield takeEvery(DELETE_USER_MNG, onDeleteUserMng);
  yield takeEvery(GET_USER_MNG_DELETED_VALUE, onGetUserMngDeletedValue);
  yield takeEvery(GET_USER_FACULTIES, fetchUserFaculties);
  yield takeEvery(ADD_NEW_USER_FACULTY, onAddNewUserFaculty);
  yield takeEvery(DELETE_USER_FACULTY, onDeleteUserFaculty);
  yield takeEvery(GET_USER_FACULTY_DELETED_VALUE, onGetUserFacultyDeletedValue);
  yield takeEvery(ADD_NEW_USER_ROLE, onAddNewUserRole);
}
export default userMngsSaga;
