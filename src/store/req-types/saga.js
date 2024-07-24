import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_REQUIREMENT_TYPES,
  GET_REQUIREMENT_DELETED_VALUE,
  ADD_NEW_REQUIREMENT_TYPE,
  DELETE_REQUIREMENT_TYPE,
  UPDATE_REQUIREMENT_TYPE,
} from "./actionTypes";

import {
  GET_FACULTIES,
} from "../mob-app-faculty-accs/actionTypes";

import {
  getReqTypesSuccess,
  getReqTypesFail,
  getReqTypeDeletedValueSuccess,
  getReqTypeDeletedValueFail,
  addReqTypeFail,
  addReqTypeSuccess,
  updateReqTypeSuccess,
  updateReqTypeFail,
  deleteReqTypeSuccess,
  deleteReqTypeFail,
} from "./actions";

// Include Both Helper File with needed methods
import {
  getReqTypes,
  getReqTypeDeletedValue,
  addNewReqType,
  updateReqType,
  deleteReqType,
  getFaculties
} from "../../helpers/fakebackend_helper";

import { getFacultiesSuccess, getFacultiesFail } from "../mob-app-faculty-accs/actions";

function* fetchReqTypes(obj) {
  const payload= obj.payload
  console.log("payload,",payload)
  const get_reqTypes_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_RequirementType",
    filter : `facultyId= ${payload.facultyId}`
  };
  try {
    const response = yield call(getReqTypes, get_reqTypes_req);
    yield put(getReqTypesSuccess(response));
  } catch (error) {
    yield put(getReqTypesFail(error));
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

function* fetchReqTypeDeletedValue() {
  try {
    const response = yield call(getReqTypeDeletedValue);
    yield put(getReqTypeDeletedValueSuccess(response));
  } catch (error) {
    yield put(getReqTypeDeletedValueFail(error));
  }
}

function* onAddNewReqType({ payload, reqType }) {
  delete payload["Id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_RequirementType";

  try {
    const response = yield call(addNewReqType, payload);
    yield put(addReqTypeSuccess(response[0]));
  } catch (error) {
    yield put(addReqTypeFail(error));
  }
}

function* onUpdateReqType({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_RequirementType";

  try {
    const respupdate = yield call(updateReqType, payload);
    yield put(updateReqTypeSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateReqTypeFail(error));
  }
}

function* onDeleteReqType({ payload, reqType }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_RequirementType";

  try {
    const respdelete = yield call(deleteReqType, payload);
    yield put(deleteReqTypeSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteReqTypeFail(error));
  }
}

function* reqTypesSaga() {
  yield takeEvery(GET_REQUIREMENT_TYPES, fetchReqTypes);
  yield takeEvery(GET_FACULTIES, fetchFaculties);
  yield takeEvery(GET_REQUIREMENT_DELETED_VALUE, fetchReqTypeDeletedValue);
  yield takeEvery(ADD_NEW_REQUIREMENT_TYPE, onAddNewReqType);
  yield takeEvery(UPDATE_REQUIREMENT_TYPE, onUpdateReqType);
  yield takeEvery(DELETE_REQUIREMENT_TYPE, onDeleteReqType);
}

export default reqTypesSaga;
