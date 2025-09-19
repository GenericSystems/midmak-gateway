import { call, put, takeEvery } from "redux-saga/effects";

// Trainee Redux States
import {
  GET_REGISTER_TRAINEES_ATTENDANCE,
  GET_REGISTER_TRAINEE_ATTENDANCE_DELETED_VALUE,
  ADD_NEW_REGISTER_TRAINEE_ATTENDANCE,
  DELETE_REGISTER_TRAINEE_ATTENDANCE,
  UPDATE_REGISTER_TRAINEE_ATTENDANCE,
} from "./actionTypes";

import {
  getRegisterTraineesAttendanceSuccess,
  getRegisterTraineesAttendanceFail,
  getRegisterTraineeAttendanceDeletedValueSuccess,
  getRegisterTraineeAttendanceDeletedValueFail,
  addRegisterTraineeAttendanceSuccess,
  addRegisterTraineeAttendanceFail,
  updateRegisterTraineeAttendanceSuccess,
  updateRegisterTraineeAttendanceFail,
  deleteRegisterTraineeAttendanceSuccess,
  deleteRegisterTraineeAttendanceFail,
} from "./actions";

// Include helper functions
import {
  getRegisterTraineesAttendance,
  getRegisterTraineeAttendanceDeletedValue,
  addNewRegisterTraineeAttendance,
  updateRegisterTraineeAttendance,
  deleteRegisterTraineeAttendance,
} from "../../helpers/fakebackend_helper";

function* fetchRegTrainees(selectedpayload) {
  let lang = selectedpayload.payload;

  const titleField = lang === "en" ? "enTitle" : "arTitle";

  //get trainees_req
  const get_regtrainees_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Trainee",
  };

  try {
    const response = yield call(
      getRegisterTraineesAttendance,
      get_regtrainees_req
    );
    console.log("experresponse", response);
    yield put(getRegisterTraineesAttendanceSuccess(response));
  } catch (error) {
    yield put(getRegisterTraineesAttendanceFail(error));
  }
}

function* onAddNewRegTrainee({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Trainee";
  // payload["queryname"] = "_Common_Trainee";

  try {
    const response = yield call(addNewRegisterTraineeAttendance, payload);
    console.log("adddresssss123", response);
    yield put(addRegisterTraineeAttendanceSuccess(response[0]));
  } catch (error) {
    yield put(addRegisterTraineeAttendanceFail(error));
  }
}

function* onUpdateRegTrainee({ payload }) {
  console.log("]]]]]]]]]]]]]]]]", payload);
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Trainee";
  payload["queryname"] = "_Common_Trainee";

  try {
    const response = yield call(updateRegisterTraineeAttendance, payload);
    yield put(updateRegisterTraineeAttendanceSuccess(response[0]));
  } catch (error) {
    yield put(updateRegisterTraineeAttendanceFail(error));
  }
}

function* onDeleteRegTrainee({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "_Common_Trainee";
  try {
    const response = yield call(deleteRegisterTraineeAttendance, payload);
    yield put(deleteRegisterTraineeAttendanceSuccess(response[0]));
  } catch (error) {
    yield put(deleteRegisterTraineeAttendanceFail(error));
  }
}

function* onGetTraineeDeletedValue() {
  try {
    const response = yield call(getRegisterTraineeAttendanceDeletedValue);
    yield put(getRegisterTraineeAttendanceDeletedValueSuccess(response));
  } catch (error) {
    yield put(getRegisterTraineeAttendanceDeletedValueFail(error));
  }
}

function* regTraineesAttendanceSaga() {
  yield takeEvery(GET_REGISTER_TRAINEES_ATTENDANCE, fetchRegTrainees);
  yield takeEvery(ADD_NEW_REGISTER_TRAINEE_ATTENDANCE, onAddNewRegTrainee);
  yield takeEvery(UPDATE_REGISTER_TRAINEE_ATTENDANCE, onUpdateRegTrainee);
  yield takeEvery(DELETE_REGISTER_TRAINEE_ATTENDANCE, onDeleteRegTrainee);
  yield takeEvery(
    GET_REGISTER_TRAINEE_ATTENDANCE_DELETED_VALUE,
    onGetTraineeDeletedValue
  );
}

export default regTraineesAttendanceSaga;
