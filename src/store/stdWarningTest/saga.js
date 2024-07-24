import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_STD_WARNING_TEST,
  ADD_NEW_STD_WARNING_TEST,
  DELETE_STD_WARNING_TEST,
  UPDATE_STD_WARNING_TEST,
  GET_STD_WARNING_TEST_DELETED_VALUE,
} from "./actionTypes";

import {
  getStdWarningTestSuccess,
  getStdWarningTestFail,
  addStdWarningTestSuccess,
  addStdWarningTestFail,
  updateStdWarningTestSuccess,
  updateStdWarningTestFail,
  deleteStdWarningTestSuccess,
  deleteStdWarningTestFail,
  getStdWarningTestDeletedValueSuccess,
  getStdWarningTestDeletedValueFail,
} from "./actions";

import { getSemestersSuccess, getSemestersFail } from "../semesters/actions";

// Include Both Helper File with needed methods
import {
  getStdWarningTest,
  addNewStdWarningTest,
  updateStdWarningTest,
  deleteStdWarningTest,
  getStdWarningTestDeletedValue,
  getSemesters,
  

} from "../../helpers/fakebackend_helper";



function* fetchStdWarningTest() {
  const get_stdWarningTest_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_StdWarningTest"
  };
  try {
    const response = yield call(getStdWarningTest, get_stdWarningTest_req);
    response.map(resp => {
      resp["applyForSemester"] = JSON.parse(resp["applyForSemester"]);
      resp["applyStatus"] = JSON.parse(resp["applyStatus"]);
      resp["prevAcademicWarning"] = JSON.parse(resp["prevAcademicWarning"]);
      resp["prevStatusSemes"] = JSON.parse(resp["prevStatusSemes"]);
  });
    yield put(getStdWarningTestSuccess(response));
  } catch (error) {
    yield put(getStdWarningTestFail(error));
  }

   //get semester
   const get_semester_opt = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_Semesters",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getSemesters, get_semester_opt);
    yield put(getSemestersSuccess(response));
  } catch (error) {
    yield put(getSemestersFail(error));
  }

 
}


function* onAddNewStdWarningTest({ payload, warningRule }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "StdWarningTestsTest_AddNew";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StdWarningTest";
  payload["queryname"] = "_Common_StdWarningTest";


  try {
    const response = yield call(addNewStdWarningTest, payload);
    response.map(resp => {
      resp["applyForSemester"] = JSON.parse(resp["applyForSemester"]);
      resp["applyStatus"] = JSON.parse(resp["applyStatus"]);
      resp["prevAcademicWarning"] = JSON.parse(resp["prevAcademicWarning"]);
      resp["prevStatusSemes"] = JSON.parse(resp["prevStatusSemes"]);
  });
    yield put(addStdWarningTestSuccess(response[0]));
  } catch (error) {
    yield put(addStdWarningTestFail(error));
  }
}

function* onUpdateStdWarningTest({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "StdWarningTestsTest_update";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StdWarningTest";
  payload["queryname"] = "_Common_StdWarningTest";

  try {
    const respupdate = yield call(updateStdWarningTest, payload);
    respupdate.map(resp => {
      resp["applyForSemester"] = JSON.parse(resp["applyForSemester"]);
      resp["applyStatus"] = JSON.parse(resp["applyStatus"]);
      resp["prevAcademicWarning"] = JSON.parse(resp["prevAcademicWarning"]);
      resp["prevStatusSemes"] = JSON.parse(resp["prevStatusSemes"]);
  });
    yield put(updateStdWarningTestSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateStdWarningTestFail(error));
  }
}

function* onDeleteStdWarningTest({ payload, warningRule }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StdWarningTest";

  try {
    const respdelete = yield call(deleteStdWarningTest, payload);
    yield put(deleteStdWarningTestSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteStdWarningTestFail(error));
  }
}

function* onGetStdWarningTestDeletedValue() {
  try {
    const response = yield call(getStdWarningTestDeletedValue)
    yield put(getStdWarningTestDeletedValueSuccess(response))
  } catch (error) {
    yield put(getStdWarningTestDeletedValueFail(error))
  }
  
}

function* stdWarningTestSaga() {
  yield takeEvery(GET_STD_WARNING_TEST, fetchStdWarningTest);
  yield takeEvery(ADD_NEW_STD_WARNING_TEST, onAddNewStdWarningTest);
  yield takeEvery(DELETE_STD_WARNING_TEST, onDeleteStdWarningTest);
  yield takeEvery(UPDATE_STD_WARNING_TEST, onUpdateStdWarningTest);
  yield takeEvery(GET_STD_WARNING_TEST_DELETED_VALUE, onGetStdWarningTestDeletedValue);
}

export default stdWarningTestSaga;
