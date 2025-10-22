import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_TRAINEES_DESERVES_WARNINGS,
  GET_TRAINEE_DESERVE_WARNING_DELETED_VALUE,
  ADD_NEW_TRAINEE_DESERVE_WARNING,
  UPDATE_TRAINEE_DESERVE_WARNING,
  DELETE_TRAINEE_DESERVE_WARNING,
} from "./actionTypes";

import {
  getTraineesDeservesWarningsSuccess,
  getTraineesDeservesWarningsFail,
  getTraineeDeserveWarningDeletedValueSuccess,
  getTraineeDeserveWarningDeletedValueFail,
  addTraineeDeserveWarningFail,
  addTraineeDeserveWarningSuccess,
  updateTraineeDeserveWarningSuccess,
  updateTraineeDeserveWarningFail,
  deleteTraineeDeserveWarningSuccess,
  deleteTraineeDeserveWarningFail,
} from "./actions";

import { getTraineesOptSuccess, getTraineesOptFail } from "../trainees/actions";
import { getYearsSuccess, getYearsFail } from "../years/actions";
import {
  getCoursesOfferingSuccess,
  getCoursesOfferingFail,
} from "../classScheduling/actions";
//Include Both Helper File with needed methods
import {
  getTraineesDeservesWarnings,
  getTraineeDeserveWarningDeletedValue,
  addNewTraineeDeserveWarning,
  updateTraineeDeserveWarning,
  deleteTraineeDeserveWarning,
  getTraineesOpt,
  getCoursesOffering,
  getYears,
  getRequestStatus,
} from "../../helpers/fakebackend_helper";

function* fetchTraineesDeservesWarnings() {
  const get_TraineesDeservesWarnings_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Trainee",
  };
  try {
    const response = yield call(
      getTraineesDeservesWarnings,
      get_TraineesDeservesWarnings_req
    );
    yield put(getTraineesDeservesWarningsSuccess(response));
  } catch (error) {
    yield put(getTraineesDeservesWarningsFail(error));
  }

  const get_years_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Years",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getYears, get_years_req);
    console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy", response);
    yield put(getYearsSuccess(response));
  } catch (error) {
    yield put(getYearsFail(error));
  }

  const get_trainees_req = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Trainee",
    fields: "Id,fullName",
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

  //   const get_contractType_req = {
  //     source: "db",
  //     procedure: "Generic_getOptions",
  //     apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //     tablename: "Settings_TraineeDeserveWarningType",
  //     fields: "Id,arTitle",
  //   };

  //   try {
  //     const response = yield call(getTraineesDeservesWarningsTypes, get_contractType_req);
  //     console.log("999999999999999999999999999", response);
  //     yield put(getTraineesDeservesWarningsTypesSuccess(response));
  //   } catch (error) {
  //     yield put(getTraineesDeservesWarningsTypesFail(error));
  //   }

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

function* getTraineeDeserveWarningProfile() {
  try {
    const response = yield call(getTraineeDeserveWarningDeletedValue);
    yield put(getTraineeDeserveWarningDeletedValueSuccess(response));
  } catch (error) {
    yield put(getTraineeDeserveWarningDeletedValueFail(error));
  }
}

function* onAddNewTraineeDeserveWarning({ payload }) {
  console.log("xxxxxxxxxxxxxxxxx", payload);
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TraineeDeserveWarning";
  payload["queryname"] = "_Common_TraineeDeserveWarning";

  try {
    const response = yield call(addNewTraineeDeserveWarning, payload);
    //console.log("ppppppppppppppppppppp", response);
    yield put(addTraineeDeserveWarningSuccess(response[0]));
  } catch (error) {
    yield put(addTraineeDeserveWarningFail(error));
  }
}

function* onDeleteTraineeDeserveWarning({ payload, contract }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TraineeDeserveWarning";

  try {
    const response = yield call(deleteTraineeDeserveWarning, payload);
    yield put(deleteTraineeDeserveWarningSuccess(response[0]));
  } catch (error) {
    yield put(deleteTraineeDeserveWarningFail(error));
  }
}

function* onUpdateTraineeDeserveWarning({ payload }) {
  console.log("qqqqqqqqqqqqqqqq", payload);
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TraineeDeserveWarning";
  payload["queryname"] = "_Common_TraineeDeserveWarning";
  try {
    const respupdate = yield call(updateTraineeDeserveWarning, payload);
    console.log("UpdateTraineeDeserveWarning", respupdate);
    yield put(updateTraineeDeserveWarningSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateTraineeDeserveWarningFail(error));
  }
}

function* onGetTraineeDeserveWarningDeletedValue() {
  try {
    const response = yield call(getTraineeDeserveWarningDeletedValue);
    yield put(getTraineeDeserveWarningDeletedValueSuccess(response));
  } catch (error) {
    yield put(getTraineeDeserveWarningDeletedValueFail(error));
  }
}

function* TraineesDeservesWarningsSaga() {
  yield takeEvery(
    GET_TRAINEES_DESERVES_WARNINGS,
    fetchTraineesDeservesWarnings
  );
  yield takeEvery(
    GET_TRAINEE_DESERVE_WARNING_DELETED_VALUE,
    onGetTraineeDeserveWarningDeletedValue
  );
  yield takeEvery(
    GET_TRAINEE_DESERVE_WARNING_DELETED_VALUE,
    getTraineeDeserveWarningProfile
  );
  yield takeEvery(
    ADD_NEW_TRAINEE_DESERVE_WARNING,
    onAddNewTraineeDeserveWarning
  );
  yield takeEvery(
    UPDATE_TRAINEE_DESERVE_WARNING,
    onUpdateTraineeDeserveWarning
  );
  yield takeEvery(
    DELETE_TRAINEE_DESERVE_WARNING,
    onDeleteTraineeDeserveWarning
  );
}

export default TraineesDeservesWarningsSaga;
