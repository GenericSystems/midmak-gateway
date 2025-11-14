import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_MARKS_OBJECTIONS,
  GET_MARK_OBJECTION_DELETED_VALUE,
  ADD_NEW_MARK_OBJECTION,
  UPDATE_MARK_OBJECTION,
  DELETE_MARK_OBJECTION,
  GET_FILTERED_COURSES_OBJECTION,
} from "./actionTypes";

import {
  getMarksObjectionsSuccess,
  getMarksObjectionsFail,
  getMarkObjectionDeletedValueSuccess,
  getMarkObjectionDeletedValueFail,
  addMarkObjectionFail,
  addMarkObjectionSuccess,
  updateMarkObjectionSuccess,
  updateMarkObjectionFail,
  deleteMarkObjectionSuccess,
  deleteMarkObjectionFail,
  getRequestStatusSuccess,
  getRequestStatusFail,
  getRequestTypesSuccess,
  getRequestTypesFail,
  getFilteredCoursesObjectionSuccess,
  getFilteredCoursesObjectionFail,
} from "./actions";

import {
  getGradeTypesSuccess,
  getGradeTypesFail,
} from "../grade-types/actions";

import { getTraineesOptSuccess, getTraineesOptFail } from "../trainees/actions";
//Include Both Helper File with needed methods
import {
  getMarksObjections,
  getMarkObjectionDeletedValue,
  addNewMarkObjection,
  updateMarkObjection,
  deleteMarkObjection,
  getTraineesOpt,
  getCoursesOffering,
  getRequestStatus,
  getRequestTypes,
  getGradeTypes,
  getFilteredCoursesObjection,
} from "../../helpers/fakebackend_helper";
import { GET_FILTERED_COURSES } from "store/study-plans/actionTypes";

function* fetchMarksObjections() {
  const get_MarksObjections_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_MarksObjections",
  };
  try {
    const response = yield call(getMarksObjections, get_MarksObjections_req);
    yield put(getMarksObjectionsSuccess(response));
  } catch (error) {
    yield put(getMarksObjectionsFail(error));
  }

  const get_trainees_req = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Trainee",
    fields: "Id,fullName,TraineeNum",
  };
  try {
    const response = yield call(getTraineesOpt, get_trainees_req);
    yield put(getTraineesOptSuccess(response));
  } catch (error) {
    yield put(getTraineesOptFail(error));
  }

  const get_RequestStatus_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_DecreeStatus",
  };
  try {
    const response = yield call(getRequestStatus, get_RequestStatus_req);
    yield put(getRequestStatusSuccess(response));
  } catch (error) {
    yield put(getRequestStatusFail(error));
  }

  const get_RequestType_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_RequestType",
    fields: "Id,arTitle",
  };

  try {
    const response = yield call(getRequestTypes, get_RequestType_req);
    console.log("999999999999999999999999999", response);
    yield put(getRequestTypesSuccess(response));
  } catch (error) {
    yield put(getRequestTypesFail(error));
  }

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

function* fetchFilteredCoursesObjection(obj) {
  console.log("333333333", obj);
  const traineeId = obj.payload?.Id || obj.payload?.key;
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

function* getMarkObjectionProfile() {
  try {
    const response = yield call(getMarkObjectionDeletedValue);
    yield put(getMarkObjectionDeletedValueSuccess(response));
  } catch (error) {
    yield put(getMarkObjectionDeletedValueFail(error));
  }
}

function* onAddNewMarkObjection({ payload }) {
  console.log("xxxxxxxxxxxxxxxxx", payload);
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_MarksObjections";
  payload["queryname"] = "_Common_MarksObjections";

  try {
    const response = yield call(addNewMarkObjection, payload);
    //console.log("ppppppppppppppppppppp", response);
    yield put(addMarkObjectionSuccess(response[0]));
  } catch (error) {
    yield put(addMarkObjectionFail(error));
  }
}

function* onDeleteMarkObjection({ payload, contract }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_MarksObjections";
  payload["queryname"] = "_Common_MarksObjections";
  try {
    const response = yield call(deleteMarkObjection, payload);
    yield put(deleteMarkObjectionSuccess(response[0]));
  } catch (error) {
    yield put(deleteMarkObjectionFail(error));
  }
}

function* onUpdateMarkObjection({ payload }) {
  console.log("qqqqqqqqqqqqqqqq", payload);
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_MarksObjections";
  payload["queryname"] = "_Common_MarksObjections";
  try {
    const respupdate = yield call(updateMarkObjection, payload);
    console.log("UpdateMarkObjection", respupdate);
    yield put(updateMarkObjectionSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateMarkObjectionFail(error));
  }
}

function* onGetMarkObjectionDeletedValue() {
  try {
    const response = yield call(getMarkObjectionDeletedValue);
    yield put(getMarkObjectionDeletedValueSuccess(response));
  } catch (error) {
    yield put(getMarkObjectionDeletedValueFail(error));
  }
}

function* MarksObjectionsSaga() {
  yield takeEvery(GET_MARKS_OBJECTIONS, fetchMarksObjections);
  yield takeEvery(
    GET_MARK_OBJECTION_DELETED_VALUE,
    onGetMarkObjectionDeletedValue
  );
  yield takeEvery(
    GET_FILTERED_COURSES_OBJECTION,
    fetchFilteredCoursesObjection
  );
  yield takeEvery(GET_MARK_OBJECTION_DELETED_VALUE, getMarkObjectionProfile);
  yield takeEvery(ADD_NEW_MARK_OBJECTION, onAddNewMarkObjection);
  yield takeEvery(UPDATE_MARK_OBJECTION, onUpdateMarkObjection);
  yield takeEvery(DELETE_MARK_OBJECTION, onDeleteMarkObjection);
}

export default MarksObjectionsSaga;
