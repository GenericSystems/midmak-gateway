import { call, put, takeEvery } from "redux-saga/effects";
import {
  GET_TRAINEES_DECREES,
  ADD_NEW_TRAINEES_DECREES,
  DELETE_TRAINEES_DECREES,
  UPDATE_TRAINEES_DECREES,
  GET_TRAINEES_DECREES_DELETED_VALUE,
  GET_FILTERED_COURSES_PLANS,
  GET_ACADEMY_TRAINEES_DECREE,
  GET_COURSES_DECREES,
  GET_TRAINEE_DECREES_DISMISS,
} from "./actionTypes";
import {
  getTraineesDecreesSuccess,
  getTraineesDecreesFail,
  addTraineesDecreeFail,
  addTraineesDecreeSuccess,
  updateTraineesDecreeSuccess,
  updateTraineesDecreeFail,
  deleteTraineesDecreeSuccess,
  deleteTraineesDecreeFail,
  getTraineesDecreeDeletedValueSuccess,
  getTraineesDecreeDeletedValueFail,
  getFilteredCoursesPlansFail,
  getFilteredCoursesPlansSuccess,
  getAcademyTraineesDecreesFail,
  getAcademyTraineesDecreesSuccess,
  getCoursesDecreesFail,
  getCoursesDecreesSuccess,
  getDecreeStatusFail,
  getDecreeStatusSuccess,
  getTraineeDecreesDismissFail,
  getTraineeDecreesDismissSuccess,
} from "./actions";
import { getTraineesOptFail, getTraineesOptSuccess } from "../trainees/actions";

import {
  getTraineesDecrees,
  addNewTraineesDecree,
  updateTraineesDecree,
  deleteTraineesDecree,
  getTraineesDecreeDeletedValue,
  getFilteredCourses,
  getAcademyTrainees,
  getFilteredCoursesPlans,
  getAcademyTraineesDecrees,
  getCoursesDecrees,
  getDecreeStatus,
  getTraineeDecreesDismiss,
  getTraineesOpt,
} from "../../helpers/fakebackend_helper";

function* fetchFilteredCoursesPlan(obj) {
  console.log("objobjobj", obj.payload);
  const get_filteredCourses_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Current_Common_TrianeeCurriculalines",
    filter: `traineeId = ${obj.payload.Id} and archived = 0`,
  };
  try {
    const response = yield call(
      getFilteredCoursesPlans,
      get_filteredCourses_req
    );
    yield put(getFilteredCoursesPlansSuccess(response));
  } catch (error) {
    yield put(getFilteredCoursesPlansFail(error));
  }
}

function* fetchCoursesDecrees() {
  const get_filteredCourses_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_CoursePlan",
  };
  try {
    const response = yield call(getCoursesDecrees, get_filteredCourses_req);
    yield put(getCoursesDecreesSuccess(response));
  } catch (error) {
    yield put(getCoursesDecreesFail(error));
  }
}

function* fetchTraineesDecrees() {
  const get_TraineesDecrees_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_TraineesDecrees",
  };
  try {
    const response = yield call(getTraineesDecrees, get_TraineesDecrees_req);
    response.map(resp => {
      resp["TraineesDecreesCourses"] = JSON.parse(
        resp["TraineesDecreesCourses"]
      );
    });
    yield put(getTraineesDecreesSuccess(response));
  } catch (error) {
    yield put(getTraineesDecreesFail(error));
  }

  const get_decreeStatus_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_DecreeStatus",
  };
  try {
    const response = yield call(getDecreeStatus, get_decreeStatus_req);
    yield put(getDecreeStatusSuccess(response));
  } catch (error) {
    yield put(getDecreeStatusFail(error));
  }
}

function* fetchAcademyTraineesDecrees() {
  const get_traineesDecrees_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Trainee",
  };
  try {
    const response = yield call(
      getAcademyTraineesDecrees,
      get_traineesDecrees_req
    );
    console.log("rrrrrrrrrrrrrrrrrrrre", response);
    yield put(getAcademyTraineesDecreesSuccess(response));
  } catch (error) {
    yield put(getAcademyTraineesDecreesFail(error));
  }
}
function* fetchTraineeDecreesDismiss(obj) {
  const get_stdDecreeDismiss_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_TraineesDecrees",
    filter: `TraineeId = ${obj.payload.TraineeId}`,
  };
  try {
    const response = yield call(
      getTraineeDecreesDismiss,
      get_stdDecreeDismiss_req
    );
    response.map(resp => {
      resp["TraineesDecreesCourses"] = JSON.parse(
        resp["TraineesDecreesCourses"]
      );
    });
    yield put(getTraineeDecreesDismissSuccess(response));
  } catch (error) {
    yield put(getTraineeDecreesDismissFail(error));
  }
}
function* onAddNewTraineesDecree({ payload, studentsDecree }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "TraineesDecrees_AddNew";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TraineesDecrees";
  payload["queryname"] = "_Common_TraineesDecrees";
  try {
    const response = yield call(addNewTraineesDecree, payload);
    yield put(addTraineesDecreeSuccess(response[0]));
  } catch (error) {
    yield put(addTraineesDecreeFail(error));
  }
}

function* onUpdateTraineesDecree({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "TraineesDecrees_Update";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TraineesDecrees";
  payload["queryname"] = "_Common_TraineesDecrees";
  try {
    const respupdate = yield call(updateTraineesDecree, payload);
    yield put(updateTraineesDecreeSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateTraineesDecreeFail(error));
  }
}
function* onDeleteTraineesDecree({ payload, TraineesDecree }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TraineesDecrees";
  try {
    const respdelete = yield call(deleteTraineesDecree, payload);
    yield put(deleteTraineesDecreeSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteTraineesDecreeFail(error));
  }
}
function* onGetTraineesDecreeDeletedValue() {
  try {
    const response = yield call(getTraineesDecreeDeletedValue);
    yield put(getTraineesDecreeDeletedValueSuccess(response));
  } catch (error) {
    yield put(getTraineesDecreeDeletedValueFail(error));
  }
}
function* traineesDecreesSaga() {
  yield takeEvery(GET_FILTERED_COURSES_PLANS, fetchFilteredCoursesPlan);
  yield takeEvery(GET_TRAINEE_DECREES_DISMISS, fetchTraineeDecreesDismiss);
  // yield takeEvery(GET_COURSES_DECREES, fetchCoursesDecrees);
  yield takeEvery(GET_TRAINEES_DECREES, fetchTraineesDecrees);
  yield takeEvery(ADD_NEW_TRAINEES_DECREES, onAddNewTraineesDecree);
  yield takeEvery(UPDATE_TRAINEES_DECREES, onUpdateTraineesDecree);
  yield takeEvery(DELETE_TRAINEES_DECREES, onDeleteTraineesDecree);
  yield takeEvery(
    GET_TRAINEES_DECREES_DELETED_VALUE,
    onGetTraineesDecreeDeletedValue
  );
  yield takeEvery(GET_ACADEMY_TRAINEES_DECREE, fetchAcademyTraineesDecrees);
}
export default traineesDecreesSaga;
