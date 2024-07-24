import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_STUDY_PLANS,
  GET_STUDY_PLAN_PROFILE,
  ADD_NEW_STUDY_PLAN,
  DELETE_STUDY_PLAN,
  UPDATE_STUDY_PLAN,
  GET_FILTERED_COURSES,
  GET_PLAN_HOURS,
  ADD_NEW_PLAN_HOUR,
  UPDATE_PLAN_HOUR,
  GENERALIZE_STUDY_PLANS,
  GET_ALL_STUDY_PLANS,
} from "./actionTypes";

import {
  getStudyPlansSuccess,
  getStudyPlansFail,
  getStudyPlanProfileSuccess,
  getStudyPlanProfileFail,
  addStudyPlanFail,
  addStudyPlanSuccess,
  updateStudyPlanSuccess,
  updateStudyPlanFail,
  deleteStudyPlanSuccess,
  deleteStudyPlanFail,
  getFilteredCoursesSuccess,
  getFilteredCoursesFail,
  getPlanHoursSuccess,
  getPlanHoursFail,
  addPlanHourSuccess,
  addPlanHourFail,
  updatePlanHourSuccess,
  updatePlanHourFail,
  generalizeStudyPlansSuccess,
  generalizeStudyPlansFail,
  getAllStudyPlansSuccess,
  getAllStudyPlansFail,
} from "./actions";

// Include Both Helper File with needed methods
import {
  getStudyPlans,
  getStudyPlanProfile,
  addNewStudyPlan,
  updateStudyPlan,
  deleteStudyPlan,
  getFilteredCourses,
  getPlanHours,
  addNewPlanHour,
  updatePlanHour,
  generalizeStudyPlans,
  getAllStudyPlans,
} from "../../helpers/fakebackend_helper";

function* fetchFilteredCourses(obj) {
  let faculty = obj.payload.faculty;
  console.log("obj", obj);
  const get_filteredCourses_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Course",
    filter: `facultyId = ${faculty} or facultyId = null`,
  };
  try {
    const response = yield call(getFilteredCourses, get_filteredCourses_req);
    yield put(getFilteredCoursesSuccess(response));
  } catch (error) {
    yield put(getFilteredCoursesFail(error));
  }
}

function* fetchStudyPlans(obj) {
  let faculty = obj.payload.faculty;
  let reqTypeId = obj.payload.reqTypeId;
  let planId = obj.payload.planId;
  let filter = `facultyId = ${faculty} AND PlanId = ${planId}`;

  if (reqTypeId !== null) {
    filter += ` AND CoursePlanTypeId = ${reqTypeId}`;
  }
  const get_studyPlans_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_CoursePlan",
    filter: filter,
  };
  try {
    const response = yield call(getStudyPlans, get_studyPlans_req);
    yield put(getStudyPlansSuccess(response));
  } catch (error) {
    yield put(getStudyPlansFail(error));
  }
}

function* fetchAllStudyPlans(obj) {
  let faculty = obj.payload.faculty;
  let reqTypeId = obj.payload.reqTypeId;
  let planId = obj.payload.planId;
  let filter = `facultyId = ${faculty} AND PlanId = ${planId}`;

  if (reqTypeId !== null) {
    filter += ` AND CoursePlanTypeId = ${reqTypeId}`;
  }
  const get_studyPlans_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_CoursePlan",
    filter: filter,
  };
  try {
    const response = yield call(getAllStudyPlans, get_studyPlans_req);
    yield put(getAllStudyPlansSuccess(response));
  } catch (error) {
    yield put(getAllStudyPlansFail(error));
  }
}

function* genStudyPlans(obj) {
  let faculty = obj.payload.faculty;
  let reqTypeId = obj.payload.reqTypeId;
  let planId = obj.payload.planId;
  const generalize_studyPlans_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_CoursePlan",
    filter: `facultyId = ${faculty} AND PlanId = ${planId} and CoursePlanTypeId =${reqTypeId}`,
  };
  try {
    const response = yield call(
      generalizeStudyPlans,
      generalize_studyPlans_req
    );
    yield put(generalizeStudyPlansSuccess(response));
  } catch (error) {
    yield put(generalizeStudyPlansFail(error));
  }
}
function* fetchStudyPlanProfile() {
  try {
    const response = yield call(getStudyPlanProfile);
    yield put(getStudyPlanProfileSuccess(response));
  } catch (error) {
    yield put(getStudyPlanProfileFail(error));
  }
}

function* onAddNewStudyPlan({ payload, studyPlan }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_CoursePlan";
  payload["queryname"] = "_Common_CoursePlan";

  try {
    const response = yield call(addNewStudyPlan, payload);
    yield put(addStudyPlanSuccess(response[0]));
  } catch (error) {
    yield put(addStudyPlanFail(error));
  }
}

function* onUpdateStudyPlan({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_CoursePlan";

  try {
    const respupdate = yield call(updateStudyPlan, payload);
    yield put(updateStudyPlanSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateStudyPlanFail(error));
  }
}

function* onDeleteStudyPlan({ payload, studyPlan }) {
  let facultyId = payload.facultyId;

  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_CoursePlan";

  console.log("payload", payload);
  console.log("facultyId", facultyId);
  try {
    const respdelete = yield call(deleteStudyPlan, payload);
    yield put(deleteStudyPlanSuccess(respdelete[0]));
    

    console.log("payloadOnDeleteStudyPlan", payload);
    console.log("facultyIdOnDeleteStudyPlan", facultyId);
  } catch (error) {
    yield put(deleteStudyPlanFail(error));
  }
}

function* fetchPlanHours(obj) {
  let faculty = obj.payload.faculty;
  let reqTypeId = obj.payload.reqTypeId;
  let planId = obj.payload.planId;
  const get_planHours_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_PlanRequiredHours",
    filter: `facultyId = ${faculty} AND PlanId = ${planId} and requermentTypeId =${reqTypeId}`,
  };
  try {
    const response = yield call(getPlanHours, get_planHours_req);
    yield put(getPlanHoursSuccess(response));
  } catch (error) {
    yield put(getPlanHoursFail(error));
  }
}
function* onAddNewPlanHour({ payload, planHour }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_PlanRequiredHours";

  try {
    const response = yield call(addNewPlanHour, payload);
    yield put(addPlanHourSuccess(response[0]));
    yield  (fetchFilteredCourses({
        type: GET_FILTERED_COURSES,
        payload: {
          faculty: facultyId,
        },
      }));
  } catch (error) {
    yield put(addPlanHourFail(error));
  }
}

function* onUpdatePlanHour({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_PlanRequiredHours";

  try {
    const respupdate = yield call(updatePlanHour, payload);
    yield put(updatePlanHourSuccess(respupdate[0]));
  } catch (error) {
    yield put(updatePlanHourFail(error));
  }
}
function* studyPlansSaga() {
  yield takeEvery(GET_FILTERED_COURSES, fetchFilteredCourses);
  yield takeEvery(GET_STUDY_PLANS, fetchStudyPlans);
  yield takeEvery(GET_ALL_STUDY_PLANS, fetchAllStudyPlans);
  yield takeEvery(GENERALIZE_STUDY_PLANS, genStudyPlans);
  yield takeEvery(GET_STUDY_PLAN_PROFILE, fetchStudyPlanProfile);
  yield takeEvery(ADD_NEW_STUDY_PLAN, onAddNewStudyPlan);
  yield takeEvery(UPDATE_STUDY_PLAN, onUpdateStudyPlan);
  yield takeEvery(DELETE_STUDY_PLAN, onDeleteStudyPlan);
  yield takeEvery(GET_PLAN_HOURS, fetchPlanHours);
  yield takeEvery(ADD_NEW_PLAN_HOUR, onAddNewPlanHour);
  yield takeEvery(UPDATE_PLAN_HOUR, onUpdatePlanHour);
}

export default studyPlansSaga;
