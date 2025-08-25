import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_GRADES_VERSIONS,
  GET_GRADE_VERSION_DELETED_VALUE,
  ADD_NEW_GRADE_VERSION,
  DELETE_GRADE_VERSION,
  UPDATE_GRADE_VERSION,
  GET_VERS_GRADES,
  GET_VERS_GRADE_DELETED_VALUE,
  ADD_NEW_VERS_GRADE,
  DELETE_VERS_GRADE,
  UPDATE_VERS_GRADE,
  GET_FINISH_STATUS,
  GET_RANKS,
} from "./actionTypes";

import {
  getGradesVersionsSuccess,
  getGradesVersionsFail,
  getGradeVersionDeletedValueSuccess,
  getGradeVersionDeletedValueFail,
  addGradeVersionFail,
  addGradeVersionSuccess,
  updateGradeVersionSuccess,
  updateGradeVersionFail,
  deleteGradeVersionSuccess,
  deleteGradeVersionFail,
  getVersGradesSuccess,
  getVersGradesFail,
  getVersGradeDeletedValueSuccess,
  getVersGradeDeletedValueFail,
  addVersGradeFail,
  addVersGradeSuccess,
  updateVersGradeSuccess,
  updateVersGradeFail,
  deleteVersGradeSuccess,
  deleteVersGradeFail,
  getFinishStatusSuccess,
  getFinishStatusFail,
  getRanksSuccess,
  getRanksFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getGradesVersions,
  getGradeVersionDeletedValue,
  addNewGradeVersion,
  updateGradeVersion,
  deleteGradeVersion,
  getVersGrades,
  getVersGradeDeletedValue,
  addNewVersGrade,
  updateVersGrade,
  deleteVersGrade,
  getRanks,
  getFinishStatus,
} from "../../helpers/fakebackend_helper";

function* fetchGradesVersions() {
  const get_gradeVersion_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_GradeVersion",
  };
  try {
    const response = yield call(getGradesVersions, get_gradeVersion_req);
    console.log("fffffffffffggggggfsssffff", response);
    yield put(getGradesVersionsSuccess(response));
  } catch (error) {
    yield put(getGradesVersionsFail(error));
  }

  // const get_grade_rank = {
  //   source: "db",
  //   procedure: "Generic_getOptions",
  //   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //   tablename: "Settings_Estimate",
  //   fields: "Id,arTitle",
  // };
  // try {
  //   const response = yield call(getRanks, get_grade_rank);
  //   console.log("RANKKresponseeeeeeeee", response);
  //   yield put(getRanksSuccess(response));
  // } catch (error) {
  //   yield put(getRanksFail(error));
  // }
  // const get_grade_finish_status = {
  //   source: "db",
  //   procedure: "Generic_getOptions",
  //   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //   tablename: "Settings_FinishStatus",
  //   fields: "Id,arTitle",
  // };
  // try {
  //   const response = yield call(getFinishStatus, get_grade_finish_status);
  //   console.log("STATUSSSSS", response);
  //   yield put(getFinishStatusSuccess(response));
  // } catch (error) {
  //   yield put(getFinishStatusFail(error));
  // }
}

function* getGradeVersionProfile() {
  try {
    const response = yield call(getGradeVersionDeletedValue);
    yield put(getGradeVersionDeletedValueSuccess(response));
  } catch (error) {
    yield put(getGradeVersionDeletedValueFail(error));
  }
}

function* onAddNewGradeVersion({ payload }) {
  console.log("payloadddddddd", payload);
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_GradeVersion";

  try {
    const response = yield call(addNewGradeVersion, payload);
    yield put(addGradeVersionSuccess(response[0]));
  } catch (error) {
    yield put(addGradeVersionFail(error));
  }
}

function* fetchRanks({ payload }) {
  const get_grade_rank = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Estimate",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getRanks, get_grade_rank);
    console.log("RANKKresponseeeeeeeee", response);
    yield put(getRanksSuccess(response));
  } catch (error) {
    yield put(getRanksFail(error));
  }
}
function* fetchStatus({ payload }) {
  const get_grade_status = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_FinishStatus",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getFinishStatus, get_grade_status);
    console.log("STATresponseeeeeeeee", response);
    yield put(getFinishStatusSuccess(response));
  } catch (error) {
    yield put(getFinishStatusFail(error));
  }
}

function* onUpdateGradeVersion({ payload }) {
  console.log("updatePayloadddddddddd", payload);
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_GradeVersion";

  try {
    const response = yield call(updateGradeVersion, payload);
    console.log("updateResponseeeeeeeeee", response);
    yield put(updateGradeVersionSuccess(response[0]));
  } catch (error) {
    yield put(updateGradeVersionFail(error));
  }
}

function* onDeleteGradeVersion({ payload, gradeVersion }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_GradeVersion";

  try {
    const response = yield call(deleteGradeVersion, payload);
    yield put(deleteGradeVersionSuccess(response[0]));
  } catch (error) {
    yield put(deleteGradeVersionFail(error));
  }
}

function* fetchVersGrades(obj) {
  const { selectedGradeVersionId } = obj.payload;
  console.log("objaaaaaaaaaaaaaaaaaaaaaaaa", selectedGradeVersionId);
  const get_grades_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_GradeVersionDetails",
    filter: `gradeVersionId = ${selectedGradeVersionId}`,
  };
  try {
    const response = yield call(getVersGrades, get_grades_req);
    console.log("responseeeeeeeee", response);
    yield put(getVersGradesSuccess(response));
  } catch (error) {
    yield put(getVersGradesFail(error));
  }
}

// function* getVersGradeProfile() {
//   try {
//     const response = yield call(getVersGradeDeletedValue);
//     yield put(getVersGradeDeletedValueSuccess(response));
//   } catch (error) {
//     yield put(getVersGradeDeletedValueFail(error));
//   }
// }

function* onAddNewVersGrade({ payload }) {
  console.log("flaggggggggg");
  console.log("payloadddddddd", payload);
  // const obj = { ...payload };
  // delete payload["id"];
  // delete payload["examId"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_GradeVersionDetails";

  try {
    console.log("Payload sent to backend:", payload);
    const response = yield call(addNewVersGrade, payload);
    console.log("responseAddddd", response);
    yield put(addVersGradeSuccess(response[0]));
    // yield fetchDefineExamDates({
    //   type: GET_DEFINE_EXAM_DATES,
    //   payload: {
    //     Id: obj["examId"],
    //   },
    // });
  } catch (error) {
    yield put(addVersGradeFail(error));
  }
}
function* onDeleteVersGrade({ payload }) {
  console.log("payloaddelete", payload);
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_GradeVersionDetails";

  try {
    const response = yield call(deleteVersGrade, payload);
    yield put(deleteVersGradeSuccess(response[0]));
  } catch (error) {
    yield put(deleteVersGradeFail(error));
  }
}

function* onUpdateVersGrade({ payload }) {
  console.log("qqqqqqqqqqqqqqqq", payload);
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_GradeVersionDetails";
  try {
    const respupdate = yield call(updateVersGrade, payload);
    console.log("UpdateDefinePeriod", respupdate);
    yield put(updateVersGradeSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateVersGradeFail(error));
  }
}
function* onGetVersGradeDeletedValue() {
  try {
    const response = yield call(getVersGradeDeletedValue);
    yield put(getVersGradeDeletedValueSuccess(response));
  } catch (error) {
    yield put(getVersGradeDeletedValueFail(error));
  }
}

function* GradesVersionsSaga() {
  yield takeEvery(GET_GRADES_VERSIONS, fetchGradesVersions);
  yield takeEvery(GET_GRADE_VERSION_DELETED_VALUE, getGradeVersionProfile);
  yield takeEvery(ADD_NEW_GRADE_VERSION, onAddNewGradeVersion);
  yield takeEvery(UPDATE_GRADE_VERSION, onUpdateGradeVersion);
  yield takeEvery(DELETE_GRADE_VERSION, onDeleteGradeVersion);
  yield takeEvery(GET_VERS_GRADES, fetchVersGrades);
  yield takeEvery(GET_VERS_GRADE_DELETED_VALUE, onGetVersGradeDeletedValue);
  yield takeEvery(ADD_NEW_VERS_GRADE, onAddNewVersGrade);
  yield takeEvery(UPDATE_VERS_GRADE, onUpdateVersGrade);
  yield takeEvery(DELETE_VERS_GRADE, onDeleteVersGrade);
  yield takeEvery(GET_RANKS, fetchRanks);
  yield takeEvery(GET_FINISH_STATUS, fetchStatus);
}

export default GradesVersionsSaga;
