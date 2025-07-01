import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_EMPLOYEES,
  GET_EMPLOYEE_DELETED_VALUE,
  ADD_NEW_EMPLOYEE,
  DELETE_EMPLOYEE,
  UPDATE_EMPLOYEE,
  GET_NATIONALITIES_OPT,
  GET_GENDERSCH,
  GET_ADMINISTRATIVE_SUPERVISORS_OPT,
  GET_JOB_RANKS_OPT,
  GET_JOB_TITLES_OPT,
  GET_CORPORATE_NODES_OPT,
  GET_PHYSIACL_WORK_LOCATIONS_OPT,
  GET_ACADEMIC_YEARS_OPT,
  GET_COUNTRIES_OPT,
  GET_CITIES_OPT,
  GET_STATES_OPT,
} from "./actionTypes";

import {
  getEmployeesSuccess,
  getEmployeesFail,
  getEmployeeDeletedValueSuccess,
  getEmployeeDeletedValueFail,
  addEmployeeFail,
  addEmployeeSuccess,
  updateEmployeeSuccess,
  updateEmployeeFail,
  deleteEmployeeSuccess,
  deleteEmployeeFail,
  getNationalitiesOptSuccess,
  getNationalitiesOptFail,
  getGenderschSuccess,
  getGenderschFail,
  // getAdministrativeSupervisorsOptSuccess,
  // getAdministrativeSupervisorsOptFail,
  getJobRanksOptSuccess,
  getJobRanksOptFail,
  getJobTitlesOptSuccess,
  getJobTitlesOptFail,
  getCorporateNodesOptSuccess,
  getCorporateNodesOptFail,
  getPhysicalWorkLocationsOptSuccess,
  getPhysicalWorkLocationsOptFail,
  getAcademicYearsOptSuccess,
  getAcademicYearsOptFail,
  getCountriesOptSuccess,
  getCountriesOptFail,
  getCitiesOptSuccess,
  getCitiesOptFail,
  getStatesOptSuccess,
  getStatesOptFail,
} from "./actions";

import {
  getWorkClassificationsFail,
  getWorkClassificationsSuccess,
} from "../workClassifications/actions";

import {
  getEmploymentCasesFail,
  getEmploymentCasesSuccess,
} from "../employmentCases/actions";

import {
  getContractsTypesFail,
  getContractsTypesSuccess,
} from "../contractsTypes/actions";

//Include Both Helper File with needed methods
import {
  getEmployees,
  getEmployeeDeletedValue,
  addNewEmployee,
  updateEmployee,
  deleteEmployee,
  getNationalitiesOpt,
  getGendersch,
  // getAdministrativeSupervisorsOpt,
  getJobRanksOpt,
  getContractsTypes,
  getJobTitlesOpt,
  getCorporateNodesOpt,
  getPhysicalWorkLocationsOpt,
  getWorkClassifications,
  getAcademicYearsOpt,
  getEmploymentCases,
  getCountriesOpt,
  getCitiesOpt,
  getStatesOpt,
} from "../../../helpers/fakebackend_helper";

function* fetchNationalities() {
  const get_nationality_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Nationality",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getNationalitiesOpt, get_nationality_req);
    yield put(getNationalitiesOptSuccess(response));
  } catch (error) {
    yield put(getNationalitiesOptFail(error));
  }
}

function* fetchCountries() {
  const get_Countries_req = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Country",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getCountriesOpt, get_Countries_req);
    console.log("mmmmmmmmmmmmmmmmmm", response);
    yield put(getCountriesOptSuccess(response));
  } catch (error) {
    yield put(getCountriesOptFail(error));
  }
}

function* fetchCities() {
  const get_Cities_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Country",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getCitiesOpt, get_Cities_req);
    console.log("20200000000000000000000000000", response);
    yield put(getCitiesOptSuccess(response));
  } catch (error) {
    yield put(getCitiesOptFail(error));
  }
}

function* fetchStates() {
  const get_States_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Country",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getStatesOpt, get_States_req);
    console.log("101000000000000000000000000000000000", response);
    yield put(getStatesOptSuccess(response));
  } catch (error) {
    yield put(getStatesOptFail(error));
  }
}

function* fetchCorporateNodes() {
  const get_CorporateNodes_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Gender",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getCorporateNodesOpt, get_CorporateNodes_req);
    yield put(getCorporateNodesOptSuccess(response));
  } catch (error) {
    yield put(getCorporateNodesOptFail(error));
  }
}

// function* fetchAdministrativeSupervisors() {
//   const get_AdministrativeSupervisors_req = {
//     source: "db",
//     procedure: "SisApp_getData",
//     apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
//     tablename: "Settings_AdministrativeSupervisors",
//     fields: "Id,arTitle",
//   };
//   try {
//     const response = yield call(
//       getAdministrativeSupervisorsOpt,
//       get_AdministrativeSupervisors_req
//     );
//     yield put(getAdministrativeSupervisorsOptSuccess(response));
//   } catch (error) {
//     yield put(getAdministrativeSupervisorsOptFail(error));
//   }
// }

function* fetchAcademicYears() {
  const get_AcademicYears_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Years",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getAcademicYearsOpt, get_AcademicYears_req);
    yield put(getAcademicYearsOptSuccess(response));
  } catch (error) {
    yield put(getAcademicYearsOptFail(error));
  }
}

function* fetchPhysicalWorkLocations() {
  const get_PhysicalWorkLocations_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_PhysicalWorkLocations",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(
      getPhysicalWorkLocationsOpt,
      get_PhysicalWorkLocations_req
    );
    yield put(getPhysicalWorkLocationsOptSuccess(response));
  } catch (error) {
    yield put(getPhysicalWorkLocationsOptFail(error));
  }
}

function* fetchJobRanks() {
  const get_JobRanks_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_JobRanks",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getJobRanksOpt, get_JobRanks_req);
    yield put(getJobRanksOptSuccess(response));
  } catch (error) {
    yield put(getJobRanksOptFail(error));
  }
}

function* fetchJobTitles() {
  const get_JobTitles_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_JobTitles",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getJobTitlesOpt, get_JobTitles_req);
    yield put(getJobTitlesOptSuccess(response));
  } catch (error) {
    yield put(getJobTitlesOptFail(error));
  }
}

function* fetchGenders() {
  const get_gender_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Gender",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getGendersch, get_gender_req);
    yield put(getGenderschSuccess(response));
  } catch (error) {
    yield put(getGenderschFail(error));
  }
}

function* fetchEmployees() {
  const get_employee_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Employee",
  };
  try {
    const response = yield call(getEmployees, get_employee_req);
    yield put(getEmployeesSuccess(response));
  } catch (error) {
    yield put(getEmployeesFail(error));
  }

  const get_contractType_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_ContractType",
    fields: "Id,arTitle",
  };

  try {
    const response = yield call(getContractsTypes, get_contractType_req);
    yield put(getContractsTypesSuccess(response));
  } catch (error) {
    yield put(getContractsTypesFail(error));
  }

  const get_work_classification_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_JobClassifications",
    fields: "Id,arTitle",
  };

  try {
    const response = yield call(
      getWorkClassifications,
      get_work_classification_req
    );
    yield put(getWorkClassificationsSuccess(response));
  } catch (error) {
    yield put(getWorkClassificationsFail(error));
  }

  const get_employmentCase_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_EmploymentCases",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getEmploymentCases, get_employmentCase_req);
    yield put(getEmploymentCasesSuccess(response));
  } catch (error) {
    yield put(getEmploymentCasesFail(error));
  }
}

function* getEmployeeProfile() {
  try {
    const response = yield call(getEmployeeDeletedValue);
    yield put(getEmployeeDeletedValueSuccess(response));
  } catch (error) {
    yield put(getEmployeeDeletedValueFail(error));
  }
}

function* onAddNewEmployee({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Employee";
  payload["queryname"] = "_Common_Employee";

  try {
    const response = yield call(addNewEmployee, payload);

    yield put(addEmployeeSuccess(response[0]));
  } catch (error) {
    yield put(addEmployeeFail(error));
  }
}

function* onUpdateEmployee({ payload }) {
  console.log("qqqqqqqqqqqqqqqq", payload);
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Employee";
  payload["queryname"] = "_Common_Employee";
  try {
    const response = yield call(updateEmployee, payload);
    yield put(updateEmployeeSuccess(response[0]));
  } catch (error) {
    yield put(updateEmployeeFail(error));
  }
}

function* onDeleteEmployee({ payload, employee }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Employee";

  try {
    const response = yield call(deleteEmployee, payload);
    yield put(deleteEmployeeSuccess(response[0]));
  } catch (error) {
    yield put(deleteEmployeeFail(error));
  }
}

function* onGetEmployeeDeletedValue() {
  try {
    const response = yield call(getEmployeeDeletedValue);
    yield put(getEmployeeDeletedValueSuccess(response));
  } catch (error) {
    yield put(getEmployeeDeletedValueFail(error));
  }
}

function* employeesSaga() {
  yield takeEvery(GET_GENDERSCH, fetchGenders);
  yield takeEvery(GET_NATIONALITIES_OPT, fetchNationalities);
  // yield takeEvery(
  //   GET_ADMINISTRATIVE_SUPERVISORS_OPT,
  //   fetchAdministrativeSupervisors
  // );
  yield takeEvery(GET_ACADEMIC_YEARS_OPT, fetchAcademicYears);
  yield takeEvery(GET_STATES_OPT, fetchStates);
  yield takeEvery(GET_CITIES_OPT, fetchCities);
  yield takeEvery(GET_COUNTRIES_OPT, fetchCountries);
  yield takeEvery(GET_PHYSIACL_WORK_LOCATIONS_OPT, fetchPhysicalWorkLocations);
  yield takeEvery(GET_CORPORATE_NODES_OPT, fetchCorporateNodes);
  yield takeEvery(GET_JOB_RANKS_OPT, fetchJobRanks);
  yield takeEvery(GET_JOB_TITLES_OPT, fetchJobTitles);
  yield takeEvery(GET_EMPLOYEES, fetchEmployees);
  yield takeEvery(GET_EMPLOYEE_DELETED_VALUE, getEmployeeProfile);
  yield takeEvery(ADD_NEW_EMPLOYEE, onAddNewEmployee);
  yield takeEvery(UPDATE_EMPLOYEE, onUpdateEmployee);
  yield takeEvery(DELETE_EMPLOYEE, onDeleteEmployee);
  yield takeEvery(GET_EMPLOYEE_DELETED_VALUE, onGetEmployeeDeletedValue);
}

export default employeesSaga;
