import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_MISMATCHED_GRADES,
  GET_MISMATCHED_GRADE_DELETED_VALUE,
  ADD_NEW_MISMATCHED_GRADE,
  DELETE_MISMATCHED_GRADE,
  UPDATE_MISMATCHED_GRADE,
} from "./actionTypes";

import {
  getMismatchedGradesSuccess,
  getMismatchedGradesFail,
  getMismatchedGradeDeletedValueSuccess,
  getMismatchedGradeDeletedValueFail,
  addMismatchedGradeFail,
  addMismatchedGradeSuccess,
  updateMismatchedGradeSuccess,
  updateMismatchedGradeFail,
  deleteMismatchedGradeSuccess,
  deleteMismatchedGradeFail,
} from "./actions";

// Include Both Helper File with needed methods
import {
  getMismatchedGrades,
  getMismatchedGradeDeletedValue,
  addNewMismatchedGrade,
  updateMismatchedGrade,
  deleteMismatchedGrade,
} from "../../helpers/fakebackend_helper";

function* fetchMismatchedGrades() {
  const get_settings_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_CurriculalinesWithCheck",
  };
  try {
    const response = yield call(getMismatchedGrades, get_settings_req);
    const mismatched = response.filter(
      row =>
        row.totalGrade1 !== undefined &&
        row.totalGrade2 !== undefined &&
        row.totalGrade1 !== row.totalGrade2
    );
    yield put(getMismatchedGradesSuccess(mismatched));
  } catch (error) {
    yield put(getMismatchedGradesFail(error));
  }
}

function* fetchMismatchedGradeDeletedValue() {
  try {
    const response = yield call(getMismatchedGradeDeletedValue);
    yield put(getMismatchedGradeDeletedValueSuccess(response));
  } catch (error) {
    yield put(getMismatchedGradeDeletedValueFail(error));
  }
}

function* onAddNewMismatchedGrade({ payload, courseType }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_MismatchedGrades";
  try {
    const response = yield call(addNewMismatchedGrade, payload);
    yield put(addMismatchedGradeSuccess(response[0]));
  } catch (error) {
    yield put(addMismatchedGradeFail(error));
  }
}

function* onUpdateMismatchedGrade({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_MismatchedGrades";
  try {
    const respupdate = yield call(updateMismatchedGrade, payload);
    yield put(updateMismatchedGradeSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateMismatchedGradeFail(error));
  }
}

function* onDeleteMismatchedGrade({ payload, courseType }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_MismatchedGrades";
  try {
    const respdelete = yield call(deleteMismatchedGrade, payload);
    yield put(deleteMismatchedGradeSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteMismatchedGradeFail(error));
  }
}

function* courseTypesSaga() {
  yield takeEvery(GET_MISMATCHED_GRADES, fetchMismatchedGrades);
  yield takeEvery(
    GET_MISMATCHED_GRADE_DELETED_VALUE,
    fetchMismatchedGradeDeletedValue
  );
  yield takeEvery(ADD_NEW_MISMATCHED_GRADE, onAddNewMismatchedGrade);
  yield takeEvery(UPDATE_MISMATCHED_GRADE, onUpdateMismatchedGrade);
  yield takeEvery(DELETE_MISMATCHED_GRADE, onDeleteMismatchedGrade);
}

export default courseTypesSaga;
