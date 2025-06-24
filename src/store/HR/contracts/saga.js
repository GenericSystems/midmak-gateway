import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_CONTRACTS,
  GET_CONTRACT_DELETED_VALUE,
  ADD_NEW_CONTRACT,
  UPDATE_CONTRACT,
  DELETE_CONTRACT,
} from "./actionTypes";

import {
  getContractsSuccess,
  getContractsFail,
  getContractDeletedValueSuccess,
  getContractDeletedValueFail,
  addContractFail,
  addContractSuccess,
  updateContractSuccess,
  updateContractFail,
  deleteContractSuccess,
  deleteContractFail,
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
  getEmployeesSuccess,
  getEmployeesFail,
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
  getNationalitiesOptSuccess,
  getNationalitiesOptFail,
  getGenderschSuccess,
  getGenderschFail,
} from "../employees/actions";

import {
  getContractsTypesFail,
  getContractsTypesSuccess,
} from "../contractsTypes/actions";

//Include Both Helper File with needed methods
import {
  getContracts,
  getContractDeletedValue,
  addNewContract,
  updateContract,
  deleteContract,
  getEmployees,
  getJobRanksOpt,
  getContractsTypes,
  getJobTitlesOpt,
  getCorporateNodesOpt,
  getPhysicalWorkLocationsOpt,
  getWorkClassifications,
  getAcademicYearsOpt,
  getEmploymentCases,
  getNationalitiesOpt,
  getGendersch,
} from "../../../helpers/fakebackend_helper";

function* fetchContracts() {
  const get_contract_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Contract",
  };
  try {
    const response = yield call(getContracts, get_contract_req);
    console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq", response);
    yield put(getContractsSuccess(response));
  } catch (error) {
    yield put(getContractsFail(error));
  }

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
    console.log("999999999999999999999999999", response);
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
    console.log("11111111111111111", response);
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
    console.log("22222222222222222", response);
    yield put(getEmploymentCasesSuccess(response));
  } catch (error) {
    yield put(getEmploymentCasesFail(error));
  }

  const get_AcademicYears_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Years",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getAcademicYearsOpt, get_AcademicYears_req);
    console.log("3333333333333333", response);
    yield put(getAcademicYearsOptSuccess(response));
  } catch (error) {
    yield put(getAcademicYearsOptFail(error));
  }
  const get_JobRanks_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_JobRanks",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getJobRanksOpt, get_JobRanks_req);
    console.log("444444444444444444", response);
    yield put(getJobRanksOptSuccess(response));
  } catch (error) {
    yield put(getJobRanksOptFail(error));
  }

  const get_JobTitles_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_JobTitles",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getJobTitlesOpt, get_JobTitles_req);
    console.log("55555555555555555555", response);
    yield put(getJobTitlesOptSuccess(response));
  } catch (error) {
    yield put(getJobTitlesOptFail(error));
  }

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

function* getContractProfile() {
  try {
    const response = yield call(getContractDeletedValue);
    yield put(getContractDeletedValueSuccess(response));
  } catch (error) {
    yield put(getContractDeletedValueFail(error));
  }
}

function* onAddNewContract({ payload }) {
  console.log("xxxxxxxxxxxxxxxxx", payload);
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Contract";
  payload["queryname"] = "_Common_Contract";

  try {
    const response = yield call(addNewContract, payload);
    //console.log("ppppppppppppppppppppp", response);
    yield put(addContractSuccess(response[0]));
  } catch (error) {
    yield put(addContractFail(error));
  }
}

function* onDeleteContract({ payload, contract }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "_Common_Contract";

  try {
    const response = yield call(deleteContract, payload);
    yield put(deleteContractSuccess(response[0]));
  } catch (error) {
    yield put(deleteContractFail(error));
  }
}

function* onUpdateContract({ payload }) {
  console.log("qqqqqqqqqqqqqqqq", payload);
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Contract";
  payload["queryname"] = "_Common_Contract";
  try {
    const respupdate = yield call(updateContract, payload);
    console.log("UpdateContract", respupdate);
    yield put(updateContractSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateContractFail(error));
  }
}

function* onGetContractDeletedValue() {
  try {
    const response = yield call(getContractDeletedValue);
    yield put(getContractDeletedValueSuccess(response));
  } catch (error) {
    yield put(getContractDeletedValueFail(error));
  }
}

function* ContractsSaga() {
  yield takeEvery(GET_CONTRACTS, fetchContracts);
  yield takeEvery(GET_CONTRACT_DELETED_VALUE, onGetContractDeletedValue);
  yield takeEvery(GET_CONTRACT_DELETED_VALUE, getContractProfile);
  yield takeEvery(ADD_NEW_CONTRACT, onAddNewContract);
  yield takeEvery(UPDATE_CONTRACT, onUpdateContract);
  yield takeEvery(DELETE_CONTRACT, onDeleteContract);
}

export default ContractsSaga;
