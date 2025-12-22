import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_TRAINEE_REQUESTS,
  ADD_NEW_TRAINEE_REQUEST,
  DELETE_TRAINEE_REQUEST,
  UPDATE_TRAINEE_REQUEST,
  GET_GRADE_TYPES,
  GET_FILTERED_COURSES_OBJECTION,
} from "./actionTypes";
import {
  getTraineeRequestsSuccess,
  getTraineeRequestsFail,
  addTraineeRequestFail,
  addTraineeRequestSuccess,
  updateTraineeRequestSuccess,
  updateTraineeRequestFail,
  deleteTraineeRequestSuccess,
  deleteTraineeRequestFail,
  getGradeTypesSuccess,
  getGradeTypesFail,
  getFilteredCoursesObjectionSuccess,
  getFilteredCoursesObjectionFail,
} from "./actions";

import {
  getTraineeRequests,
  addNewTraineeRequest,
  updateTraineeRequest,
  deleteTraineeRequest,
  getGradeTypes,
  getFilteredCoursesObjection,
} from "../../helpers/fakebackend_helper";

function* fetchGradeTypes() {
  const get_gradeType_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_CourseContents",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getGradeTypes, get_gradeType_req);
    yield put(getGradeTypesSuccess(response));
  } catch (error) {
    yield put(getGradeTypesFail(error));
  }
}

function* fetchTraineeRequests(selectedpayload) {
  let obj = selectedpayload.payload;
  console.log("lang", obj.lng);
  let lang = obj.lng;
  const titleField = lang === "en" ? "enTitle" : "arTitle";

  const get_traineemanagement_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Trainee",
    filter: `Id = ${obj.traineeId}`,
  };
  try {
    const response = yield call(getTraineeRequests, get_traineemanagement_req);
    yield put(getTraineeRequestsSuccess(response));
  } catch (error) {
    yield put(getTraineeRequestsFail(error));
  }
}

function* fetchFilteredCoursesObjection(obj) {
  console.log("333333333", obj);
  const traineeId = obj.payload;
  const get_filteredCourses_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Current_Common_TrianeeCurriculalines",
    filter: `traineeId = ${traineeId}`,
  };
  try {
    const response = yield call(
      getFilteredCoursesObjection,
      get_filteredCourses_req
    );
    yield put(getFilteredCoursesObjectionSuccess(response));
  } catch (error) {
    yield put(getFilteredCoursesObjectionFail(error));
  }
}

function* onAddNewTraineeRequest({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TraineeRequests";
  payload["queryname"] = "_Common_TraineeRequests";

  try {
    const response = yield call(addNewTraineeRequest, payload);
    yield put(addTraineeRequestSuccess(response[0]));
  } catch (error) {
    yield put(addTraineeRequestFail(error));
  }
}

function* onUpdateTraineeRequest({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TraineeRequests";
  payload["queryname"] = "_Common_TraineeRequests";

  try {
    const response = yield call(updateTraineeRequest, payload);

    yield put(updateTraineeRequestSuccess(response[0]));
  } catch (error) {
    yield put(updateTraineeRequestFail(error));
  }
}

function* onDeleteTraineeRequest({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TraineeRequests";

  try {
    const response = yield call(deleteTraineeRequest, payload);
    yield put(deleteTraineeRequestSuccess(response[0]));
  } catch (error) {
    yield put(deleteTraineeRequestFail(error));
  }
}

function* onAddNewPrevUnivCourse({ payload, course }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StdPrevUnivCourses";

  try {
    const response = yield call(addNewPrevUnivCourse, payload);
    yield put(addPrevUnivCourseSuccess(response[0]));
  } catch (error) {
    yield put(addPrevUnivCourseFail(error));
  }
}

function* onUpdatePrevUnivCourse({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StdPrevUnivCourses";

  try {
    const respupdate = yield call(updatePrevUnivCourse, payload);
    yield put(updatePrevUnivCourseSuccess(respupdate[0]));
  } catch (error) {
    yield put(updatePrevUnivCourseFail(error));
  }
}

function* onDeletePrevUnivCourse({ payload, course }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StdPrevUnivCourses";

  try {
    const respdelete = yield call(deletePrevUnivCourse, payload);
    yield put(deletePrevUnivCourseSuccess(respdelete[0]));
  } catch (error) {
    yield put(deletePrevUnivCourseFail(error));
  }
}

function* onAddNewTransferCourse({ payload, reqCourse }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StdTransferedCourses";

  try {
    const response = yield call(addNewTransferCourse, payload);
    yield put(addTransferCourseSuccess(response[0]));
  } catch (error) {
    yield put(addTransferCourseFail(error));
  }
}

function* onUpdateTransferCourse({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StdTransferedCourses";
  try {
    const respupdate = yield call(updateTransferCourse, payload);
    yield put(updateTransferCourseSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateTransferCourseFail(error));
  }
}

function* onUpdateTransferCourseState({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "StdTransferedCourses_Update";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StdTransferedCourses";
  payload["traineeRequestId"] = `${payload.traineeRequestId}`;
  payload["stateId"] = `${payload.stateId}`;
  try {
    const respupdate = yield call(updateTransferCourseState, payload);
    yield put(updateTransferCourseStateSuccess(respupdate));
  } catch (error) {
    yield put(updateTransferCourseStateFail(error));
  }
}

function* onDeleteTransferCourse({ payload, reqCourse }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StdTransferedCourses";

  try {
    const respdelete = yield call(deleteTransferCourse, payload);
    yield put(deleteTransferCourseSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteTransferCourseFail(error));
  }
}

function* fetchCoursesInfo(obj) {
  let payload = obj.payload;

  // transfer courses
  const get_TransferedCourses = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_StdTransferedCourses",
    filter: `traineeRequestId = ${payload.traineeRequestId} `,
  };
  try {
    const response = yield call(getTransferCourses, get_TransferedCourses);
    yield put(getTransferCoursesSuccess(response));
  } catch (error) {
    yield put(getTransferCoursesFail(error));
  }

  // PREV courses
  const get_PrevUnivCourses = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_StdPrevUnivCourses",
    filter: `traineeRequestId = ${payload.traineeRequestId} `,
  };
  try {
    const response = yield call(getPrevUnivCourses, get_PrevUnivCourses);
    yield put(getPrevUnivCoursesSuccess(response));
  } catch (error) {
    yield put(getPrevUnivCoursesFail(error));
  }
}

function* fetchLastRequestNum(obj) {
  let payload = obj.payload;

  const get_lastReqNum = {
    source: "db",
    procedure: "add_lastRequest",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    requestId: `${payload.requestId}`,
  };
  try {
    const response = yield call(getLastReqNum, get_lastReqNum);
    console.log("in saga response", response);
    yield put(getLastReqNumSuccess(response[0]));
  } catch (error) {
    yield put(getLastReqNumFail(error));
  }
}

function* TraineeRequestSaga() {
  yield takeEvery(GET_TRAINEE_REQUESTS, fetchTraineeRequests);
  yield takeEvery(GET_GRADE_TYPES, fetchGradeTypes);
  yield takeEvery(ADD_NEW_TRAINEE_REQUEST, onAddNewTraineeRequest);
  yield takeEvery(UPDATE_TRAINEE_REQUEST, onUpdateTraineeRequest);
  yield takeEvery(DELETE_TRAINEE_REQUEST, onDeleteTraineeRequest);
  yield takeEvery(
    GET_FILTERED_COURSES_OBJECTION,
    fetchFilteredCoursesObjection
  );
}

export default TraineeRequestSaga;
