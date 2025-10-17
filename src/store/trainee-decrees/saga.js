import { call, put, takeEvery } from "redux-saga/effects";
import {
  GET_TRAINEES_DECREES,
  ADD_NEW_TRAINEE_DECREE,
  DELETE_TRAINEE_DECREE,
  UPDATE_TRAINEE_DECREE,
  GET_TRAINEE_DECREE_DELETED_VALUE,
  GET_FILTERED_COURSES_PLANS,
  GET_ACADEMY_TRAINEES_DECREE,
  GET_COURSES_DECREES,
  GET_TRAINEE_DECREES_DISMISS,
} from "./actionTypes";
import {
  getTraineesDecreesSuccess,
  getTraineesDecreesFail,
  addTraineeDecreeFail,
  addTraineeDecreeSuccess,
  updateTraineeDecreeSuccess,
  updateTraineeDecreeFail,
  deleteTraineeDecreeSuccess,
  deleteTraineeDecreeFail,
  getTraineeDecreeDeletedValueSuccess,
  getTraineeDecreeDeletedValueFail,
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
  addNewTraineeDecree,
  updateTraineeDecree,
  deleteTraineeDecree,
  getTraineeDecreeDeletedValue,
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
  console.log("objobj", obj);
  const get_stdDecreeDismiss_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_TraineesDecrees",
    filter: `traineeId = ${obj.payload.traineeId}`,
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
    const response = yield call(addNewTraineeDecree, payload);
    yield put(addTraineeDecreeSuccess(response[0]));
  } catch (error) {
    yield put(addTraineeDecreeFail(error));
  }
}

function* onUpdateTraineesDecree({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "TraineesDecrees_Update";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TraineesDecrees";
  payload["queryname"] = "_Common_TraineesDecrees";
  try {
    const respupdate = yield call(updateTraineeDecree, payload);
    // respupdate.map(resp => {
    //   resp["TraineesDecreesCourses"] = JSON.parse(
    //     resp["TraineesDecreesCourses"]
    //   );
    // });
    yield put(updateTraineeDecreeSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateTraineeDecreeFail(error));
  }
}
function* onDeleteTraineesDecree({ payload, TraineesDecree }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TraineesDecrees";
  try {
    const respdelete = yield call(deleteTraineeDecree, payload);
    yield put(deleteTraineeDecreeSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteTraineeDecreeFail(error));
  }
}
function* onGetTraineesDecreeDeletedValue() {
  try {
    const response = yield call(getTraineeDecreeDeletedValue);
    yield put(getTraineeDecreeDeletedValueSuccess(response));
  } catch (error) {
    yield put(getTraineeDecreeDeletedValueFail(error));
  }
}
function* traineesDecreesSaga() {
  yield takeEvery(GET_FILTERED_COURSES_PLANS, fetchFilteredCoursesPlan);
  yield takeEvery(GET_TRAINEE_DECREES_DISMISS, fetchTraineeDecreesDismiss);
  // yield takeEvery(GET_COURSES_DECREES, fetchCoursesDecrees);
  yield takeEvery(GET_TRAINEES_DECREES, fetchTraineesDecrees);
  yield takeEvery(ADD_NEW_TRAINEE_DECREE, onAddNewTraineesDecree);
  yield takeEvery(UPDATE_TRAINEE_DECREE, onUpdateTraineesDecree);
  yield takeEvery(DELETE_TRAINEE_DECREE, onDeleteTraineesDecree);
  yield takeEvery(
    GET_TRAINEE_DECREE_DELETED_VALUE,
    onGetTraineesDecreeDeletedValue
  );
  yield takeEvery(GET_ACADEMY_TRAINEES_DECREE, fetchAcademyTraineesDecrees);
}
export default traineesDecreesSaga;
