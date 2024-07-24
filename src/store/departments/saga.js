import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_DEPARTMENTS,
  GET_FILTERED_DEPARTMENTS,
  ADD_NEW_DEPARTMENT,
  DELETE_DEPARTMENT,
  UPDATE_DEPARTMENT,
} from "./actionTypes";

import {
  getDepartmentsSuccess,
  getDepartmentsFail,
  getFilteredDepartmentsSuccess,
  getFilteredDepartmentsFail,
  addDepartmentFail,
  addDepartmentSuccess,
  updateDepartmentSuccess,
  updateDepartmentFail,
  deleteDepartmentSuccess,
  deleteDepartmentFail,
} from "./actions";

// Include Both Helper File with needed methods
import {
  getDepartments,
  getFilteredDepartments,
  addNewDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../helpers/fakebackend_helper";

function* fetchDepartments() {
  const get_departments_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_Department",
  };
  try {
    const response = yield call(getDepartments, get_departments_req);
    yield put(getDepartmentsSuccess(response));
  } catch (error) {
    yield put(getDepartmentsFail(error));
  }
}

function* fetchFilteredDepartments(payload) {
  const get_filtered_deps = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_Department",
    filter: `facultyId = ${payload.payload}`,
    fields :"Id,arTitle",
  };
  try {
    const response = yield call(getFilteredDepartments, get_filtered_deps);
    yield put(getFilteredDepartmentsSuccess(response));
  } catch (error) {
    yield put(getFilteredDepartmentsFail(error));
  }
}

function* onAddNewDepartment({ payload, department }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Department";

  try {
    const response = yield call(addNewDepartment, payload);
    yield put(addDepartmentSuccess(response[0]));
  } catch (error) {
    yield put(addDepartmentFail(error));
  }
}

function* onUpdateDepartment({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Department";

  try {
    const respupdate = yield call(updateDepartment, payload);
    yield put(updateDepartmentSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateDepartmentFail(error));
  }
}

function* onDeleteDepartment({ payload, department }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Department";

  try {
    const respdelete = yield call(deleteDepartment, payload);
    yield put(deleteDepartmentSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteDepartmentFail(error));
  }
}

function* departmentsSaga() {
  yield takeEvery(GET_DEPARTMENTS, fetchDepartments);
  yield takeEvery(GET_FILTERED_DEPARTMENTS, fetchFilteredDepartments);
  yield takeEvery(ADD_NEW_DEPARTMENT, onAddNewDepartment);
  yield takeEvery(UPDATE_DEPARTMENT, onUpdateDepartment);
  yield takeEvery(DELETE_DEPARTMENT, onDeleteDepartment);
}

export default departmentsSaga;
