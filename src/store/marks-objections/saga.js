import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_MARKS_OBJECTIONS,
  GET_MARK_OBJECTION_DELETED_VALUE,
  ADD_NEW_MARK_OBJECTION,
  UPDATE_MARK_OBJECTION,
  DELETE_MARK_OBJECTION,
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
} from "./actions";

import { getTraineesOptSuccess, getTraineesOptFail } from "../trainees/actions";
import {
  getCoursesOfferingSuccess,
  getCoursesOfferingFail,
} from "../classScheduling/actions";
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
} from "../../helpers/fakebackend_helper";

function* fetchMarksObjections() {
  const get_MarksObjections_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_MarksObjections",
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

  const get_courses_req = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_CourseOffering",
    filter: `isOffered = 1`,
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getCoursesOffering, get_courses_req);
    yield put(getCoursesOfferingSuccess(response));
  } catch (error) {
    yield put(getCoursesOfferingFail(error));
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

  //   const get_work_classification_req = {
  //     source: "db",
  //     procedure: "Generic_getOptions",
  //     apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //     tablename: "Settings_JobClassifications",
  //     fields: "Id,arTitle",
  //   };

  //   try {
  //     const response = yield call(
  //       getWorkClassifications,
  //       get_work_classification_req
  //     );
  //     console.log("11111111111111111", response);
  //     yield put(getWorkClassificationsSuccess(response));
  //   } catch (error) {
  //     yield put(getWorkClassificationsFail(error));
  //   }

  //   const get_employmentCase_req = {
  //     source: "db",
  //     procedure: "Generic_getOptions",
  //     apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //     tablename: "Settings_EmploymentCases",
  //     fields: "Id,arTitle",
  //   };
  //   try {
  //     const response = yield call(getEmploymentCases, get_employmentCase_req);
  //     console.log("22222222222222222", response);
  //     yield put(getEmploymentCasesSuccess(response));
  //   } catch (error) {
  //     yield put(getEmploymentCasesFail(error));
  //   }

  //   const get_AcademicYears_req = {
  //     source: "db",
  //     procedure: "Generic_Optiondatalist",
  //     apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //     tablename: "Settings_Years",
  //     fields: "Id,arTitle",
  //   };
  //   try {
  //     const response = yield call(getAcademicYearsOpt, get_AcademicYears_req);
  //     console.log("3333333333333333", response);
  //     yield put(getAcademicYearsOptSuccess(response));
  //   } catch (error) {
  //     yield put(getAcademicYearsOptFail(error));
  //   }
  //   const get_JobRanks_req = {
  //     source: "db",
  //     procedure: "Generic_getOptions",
  //     apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //     tablename: "Settings_JobRanks",
  //     fields: "Id,arTitle",
  //   };
  //   try {
  //     const response = yield call(getJobRanksOpt, get_JobRanks_req);
  //     console.log("444444444444444444", response);
  //     yield put(getJobRanksOptSuccess(response));
  //   } catch (error) {
  //     yield put(getJobRanksOptFail(error));
  //   }

  //   const get_JobTitles_req = {
  //     source: "db",
  //     procedure: "Generic_Optiondatalist",
  //     apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //     tablename: "Settings_JobTitles",
  //     fields: "Id,arTitle",
  //   };
  //   try {
  //     const response = yield call(getJobTitlesOpt, get_JobTitles_req);
  //     console.log("55555555555555555555", response);
  //     yield put(getJobTitlesOptSuccess(response));
  //   } catch (error) {
  //     yield put(getJobTitlesOptFail(error));
  //   }

  //   const get_gender_req = {
  //     source: "db",
  //     procedure: "Generic_getOptions",
  //     apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //     tablename: "Settings_Gender",
  //     fields: "Id,arTitle",
  //   };
  //   try {
  //     const response = yield call(getGendersch, get_gender_req);
  //     yield put(getGenderschSuccess(response));
  //   } catch (error) {
  //     yield put(getGenderschFail(error));
  //   }

  //   const get_nationality_req = {
  //     source: "db",
  //     procedure: "Generic_getOptions",
  //     apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //     tablename: "Settings_Nationality",
  //     fields: "Id,arTitle",
  //   };
  //   try {
  //     const response = yield call(getNationalitiesOpt, get_nationality_req);
  //     yield put(getNationalitiesOptSuccess(response));
  //   } catch (error) {
  //     yield put(getNationalitiesOptFail(error));
  //   }

  //   const get_employeeName_req = {
  //     source: "db",
  //     procedure: "Generic_Optiondatalist",
  //     apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //     tablename: "_Common_EmployeeOption",
  //     fields: "Id,fullName",
  //   };
  //   try {
  //     const response = yield call(getEmployeesNames, get_employeeName_req);
  //     console.log("employeeName", response);
  //     yield put(getEmployeesNamesSuccess(response));
  //   } catch (error) {
  //     yield put(getEmployeesNamesFail(error));
  //   }
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
  yield takeEvery(GET_MARK_OBJECTION_DELETED_VALUE, getMarkObjectionProfile);
  yield takeEvery(ADD_NEW_MARK_OBJECTION, onAddNewMarkObjection);
  yield takeEvery(UPDATE_MARK_OBJECTION, onUpdateMarkObjection);
  yield takeEvery(DELETE_MARK_OBJECTION, onDeleteMarkObjection);
}

export default MarksObjectionsSaga;
