import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_TRAINEES_DESERVES_DEPRIVATION,
  GET_TRAINEE_DESERVE_DEPRIVATION_DELETED_VALUE,
  ADD_NEW_TRAINEE_DESERVE_DEPRIVATION,
  UPDATE_TRAINEE_DESERVE_DEPRIVATION,
  DELETE_TRAINEE_DESERVE_DEPRIVATION,
} from "./actionTypes";

import {
  getTraineesDeservesDeprivationSuccess,
  getTraineesDeservesDeprivationFail,
  getTraineeDeserveDeprivationDeletedValueSuccess,
  getTraineeDeserveDeprivationDeletedValueFail,
  addTraineeDeserveDeprivationFail,
  addTraineeDeserveDeprivationSuccess,
  updateTraineeDeserveDeprivationSuccess,
  updateTraineeDeserveDeprivationFail,
  deleteTraineeDeserveDeprivationSuccess,
  deleteTraineeDeserveDeprivationFail,
} from "./actions";

import { getTraineesOptSuccess, getTraineesOptFail } from "../trainees/actions";
import { getYearsSuccess, getYearsFail } from "../years/actions";
import {
  getCoursesOfferingSuccess,
  getCoursesOfferingFail,
} from "../classScheduling/actions";
//Include Both Helper File with needed methods
import {
  getTraineesDeservesDeprivation,
  getTraineeDeserveDeprivationDeletedValue,
  addNewTraineeDeserveDeprivation,
  updateTraineeDeserveDeprivation,
  deleteTraineeDeserveDeprivation,
  getTraineesOpt,
  getCoursesOffering,
  getYears,
  getRequestStatus,
} from "../../helpers/fakebackend_helper";

function* fetchTraineesDeservesDeprivation() {
  const get_TraineesDeservesDeprivation_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Trainee",
  };
  try {
    const response = yield call(
      getTraineesDeservesDeprivation,
      get_TraineesDeservesDeprivation_req
    );
    yield put(getTraineesDeservesDeprivationSuccess(response));
  } catch (error) {
    yield put(getTraineesDeservesDeprivationFail(error));
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

  // const get_RequestStatus_req = {
  //   source: "db",
  //   procedure: "SisApp_getData",
  //   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //   tablename: "Settings_DecreeStatus",
  // };
  // try {
  //   const response = yield call(getRequestStatus, get_RequestStatus_req);
  //   yield put(getRequestStatusSuccess(response));
  // } catch (error) {
  //   yield put(getRequestStatusFail(error));
  // }

  //   const get_contractType_req = {
  //     source: "db",
  //     procedure: "Generic_getOptions",
  //     apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //     tablename: "Settings_TraineeDeserveDeprivationType",
  //     fields: "Id,arTitle",
  //   };

  //   try {
  //     const response = yield call(getTraineesDeservesDeprivationTypes, get_contractType_req);
  //     console.log("999999999999999999999999999", response);
  //     yield put(getTraineesDeservesDeprivationTypesSuccess(response));
  //   } catch (error) {
  //     yield put(getTraineesDeservesDeprivationTypesFail(error));
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

function* getTraineeDeserveDeprivationProfile() {
  try {
    const response = yield call(getTraineeDeserveDeprivationDeletedValue);
    yield put(getTraineeDeserveDeprivationDeletedValueSuccess(response));
  } catch (error) {
    yield put(getTraineeDeserveDeprivationDeletedValueFail(error));
  }
}

function* onAddNewTraineeDeserveDeprivation({ payload }) {
  console.log("xxxxxxxxxxxxxxxxx", payload);
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TraineeDeserveDeprivation";
  payload["queryname"] = "_Common_TraineeDeserveDeprivation";

  try {
    const response = yield call(addNewTraineeDeserveDeprivation, payload);
    //console.log("ppppppppppppppppppppp", response);
    yield put(addTraineeDeserveDeprivationSuccess(response[0]));
  } catch (error) {
    yield put(addTraineeDeserveDeprivationFail(error));
  }
}

function* onDeleteTraineeDeserveDeprivation({ payload, contract }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TraineeDeserveDeprivation";

  try {
    const response = yield call(deleteTraineeDeserveDeprivation, payload);
    yield put(deleteTraineeDeserveDeprivationSuccess(response[0]));
  } catch (error) {
    yield put(deleteTraineeDeserveDeprivationFail(error));
  }
}

function* onUpdateTraineeDeserveDeprivation({ payload }) {
  console.log("qqqqqqqqqqqqqqqq", payload);
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TraineeDeserveDeprivation";
  payload["queryname"] = "_Common_TraineeDeserveDeprivation";
  try {
    const respupdate = yield call(updateTraineeDeserveDeprivation, payload);
    console.log("UpdateTraineeDeserveDeprivation", respupdate);
    yield put(updateTraineeDeserveDeprivationSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateTraineeDeserveDeprivationFail(error));
  }
}

function* onGetTraineeDeserveDeprivationDeletedValue() {
  try {
    const response = yield call(getTraineeDeserveDeprivationDeletedValue);
    yield put(getTraineeDeserveDeprivationDeletedValueSuccess(response));
  } catch (error) {
    yield put(getTraineeDeserveDeprivationDeletedValueFail(error));
  }
}

function* TraineesDeservesDeprivationSaga() {
  yield takeEvery(
    GET_TRAINEES_DESERVES_DEPRIVATION,
    fetchTraineesDeservesDeprivation
  );
  yield takeEvery(
    GET_TRAINEE_DESERVE_DEPRIVATION_DELETED_VALUE,
    onGetTraineeDeserveDeprivationDeletedValue
  );
  yield takeEvery(
    GET_TRAINEE_DESERVE_DEPRIVATION_DELETED_VALUE,
    getTraineeDeserveDeprivationProfile
  );
  yield takeEvery(
    ADD_NEW_TRAINEE_DESERVE_DEPRIVATION,
    onAddNewTraineeDeserveDeprivation
  );
  yield takeEvery(
    UPDATE_TRAINEE_DESERVE_DEPRIVATION,
    onUpdateTraineeDeserveDeprivation
  );
  yield takeEvery(
    DELETE_TRAINEE_DESERVE_DEPRIVATION,
    onDeleteTraineeDeserveDeprivation
  );
}

export default TraineesDeservesDeprivationSaga;
