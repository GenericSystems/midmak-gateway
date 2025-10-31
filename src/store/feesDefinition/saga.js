import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_FEES_DEFINITION,
  GET_FEES_DEFINITION_DELETED_VALUE,
  ADD_NEW_FEES_DEFINITION,
  DELETE_FEES_DEFINITION,
  UPDATE_FEES_DEFINITION,
  COPY_FEES,
  GET_FEES_CONDITIONS,
  ADD_NEW_FEES_CONDITION,
  DELETE_FEES_CONDITION,
  UPDATE_FEES_CONDITION,
  GET_FEES_PRICES,
  ADD_NEW_FEES_PRICE,
  DELETE_FEES_PRICE,
  UPDATE_FEES_PRICE,
  COPY_FEES_PRICE,
  GET_FEES_SERVICES,
  ADD_NEW_FEES_SERVICE,
  DELETE_FEES_SERVICE,
  UPDATE_FEES_SERVICE,
  COPY_FEES_SERVICE,
  GET_FISCAL_YEAR_DETAILS,
  GET_EXECUTE_METHODS,
} from "./actionTypes";

import { GET_FILTERED_ACADEMIC_CERTIFICATES } from "../academicvertificates/actionTypes";

import {
  getFeesDefinitionSuccess,
  getFeesDefinitionFail,
  getFeesDefinitionDeletedValueSuccess,
  getFeesDefinitionDeletedValueFail,
  addFeesDefinitionFail,
  addFeesDefinitionSuccess,
  updateFeesDefinitionSuccess,
  updateFeesDefinitionFail,
  deleteFeesDefinitionSuccess,
  deleteFeesDefinitionFail,
  copyFeesSuccess,
  copyFeesFail,
  getFeesConditionsSuccess,
  getFeesConditionsFail,
  addFeesConditionFail,
  addFeesConditionSuccess,
  updateFeesConditionSuccess,
  updateFeesConditionFail,
  deleteFeesConditionSuccess,
  deleteFeesConditionFail,
  getFeesPricesSuccess,
  getFeesPricesFail,
  addFeesPriceFail,
  addFeesPriceSuccess,
  updateFeesPriceSuccess,
  updateFeesPriceFail,
  deleteFeesPriceSuccess,
  deleteFeesPriceFail,
  copyFeesPriceSuccess,
  copyFeesPriceFail,
  getFeesServicesSuccess,
  getFeesServicesFail,
  addFeesServiceFail,
  addFeesServiceSuccess,
  updateFeesServiceSuccess,
  updateFeesServiceFail,
  deleteFeesServiceSuccess,
  deleteFeesServiceFail,
  copyFeesServiceSuccess,
  copyFeesServiceFail,
  getFiscalYearDetailsSuccess,
  getFiscalYearDetailsFail,
  getExecuteMethodsSuccess,
  getExecuteMethodsFail,
} from "./actions";

import {
  getFiscalYearsSuccess,
  getFiscalYearsFail,
  getFiscalYearContentsSuccess,
  getFiscalYearContentsFail,
  getPeriodsSuccess,
  getPeriodsFail,
} from "../periods/actions";

import { getCountriesSuccess, getCountriesFail } from "../country/actions";

import { getRequestsSuccess, getRequestsFail } from "../requests/actions";

import {
  getFilteredAcademicCertificatesSuccess,
  getFilteredAcademicCertificatesFail,
} from "../academicvertificates/actions";

import {
  getNationalitiesSuccess,
  getNationalitiesFail,
} from "../nationality/actions";
import {
  getFacultiesSuccess,
  getFacultiesFail,
} from "../mob-app-faculty-accs/actions";

import { getCurrenciesSuccess, getCurrenciesFail } from "../currencies/actions";
import { getSemestersSuccess, getSemestersFail } from "../semesters/actions";
import {
  getAcademicCertificatesSuccess,
  getAcademicCertificatesFail,
} from "../academicvertificates/actions";

//Include Both Helper File with needed methods
import {
  getFeesDefinition,
  getFeesDefinitionDeletedValue,
  addNewFeesDefinition,
  updateFeesDefinition,
  deleteFeesDefinition,
  copyFees,
  getFeesConditions,
  addNewFeesCondition,
  updateFeesCondition,
  deleteFeesCondition,
  getFeesPrices,
  addNewFeesPrice,
  updateFeesPrice,
  deleteFeesPrice,
  copyFeesPrice,
  getFeesServices,
  addNewFeesService,
  updateFeesService,
  deleteFeesService,
  copyFeesService,
  getFiscalYears,
  getFiscalYearContents,
  getCurrencies,
  getNationalities,
  getCountries,
  getFaculties,
  getPeriods,
  getRequests,
  getFiscalYearDetails,
  getExecuteMethods,
  getFilteredAcademicCertificates,
  getAcademicCertificates,
  getSemesters,
} from "../../helpers/fakebackend_helper";

import {
  GET_FISCAL_YEARS,
  GET_FISCAL_YEAR_CONTENTS,
} from "store/periods/actionTypes";

function* fetchFeesDefinition(obj) {
  const fees = obj.payload;
  const get_feesDefinition_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "finance_StudyFees",
    filter: `fiscalYearId = ${fees.fiscalYearId}`,
  };

  try {
    const response = yield call(getFeesDefinition, get_feesDefinition_req);
    yield put(getFeesDefinitionSuccess(response));
  } catch (error) {
    yield put(getFeesDefinitionFail(error));
  }
}

function* onAddNewFeesDefinition({ payload, feesDefinition }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "finance_AddStudyFees";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "finance_StudyFees";

  try {
    const response = yield call(addNewFeesDefinition, payload);
    yield put(addFeesDefinitionSuccess(response[0]));
    const callobj = { payload: response[0] };
    yield call(fetchFeesConditions, callobj);
  } catch (error) {
    yield put(addFeesDefinitionFail(error));
  }
}

function* onUpdateFeesDefinition({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "finance_StudyFees";
  try {
    const response = yield call(updateFeesDefinition, payload);
    yield put(updateFeesDefinitionSuccess(response[0]));
  } catch (error) {
    yield put(updateFeesDefinitionFail(error));
  }
}

function* onDeleteFeesDefinition({ payload, feesDefinition }) {
  payload["source"] = "db";
  payload["procedure"] = "finance_DeleteStudyFees";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "finance_StudyFees";
  try {
    const responsedelete = yield call(deleteFeesDefinition, payload);
    yield put(deleteFeesDefinitionSuccess(responsedelete[0]));
  } catch (error) {
    yield put(deleteFeesDefinitionFail(error));
  }
}

function* onGetFeesDefinitionDeletedValue() {
  try {
    const response = yield call(getFeesDefinitionDeletedValue);
    yield put(getFeesDefinitionDeletedValueSuccess(response));
  } catch (error) {
    yield put(getFeesDefinitionDeletedValueFail(error));
  }
}

function* fetchFiscalYears() {
  // year
  const get_fiscalYears = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "finance_FiscalYear",
    fields: "Id,arTitle",
  };

  try {
    const response = yield call(getFiscalYears, get_fiscalYears);
    yield put(getFiscalYearsSuccess(response));
  } catch (error) {
    yield put(getFiscalYearsFail(error));
  }

  //get country
  const get_country_opt = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Country",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getCountries, get_country_opt);
    yield put(getCountriesSuccess(response));
  } catch (error) {
    yield put(getCountriesFail(error));
  }

  // get nationality optuin
  const get_nationality_opt = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "AdmissionSettings_Nationality",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getNationalities, get_nationality_opt);
    yield put(getNationalitiesSuccess(response));
  } catch (error) {
    yield put(getNationalitiesFail(error));
  }

  //currencies
  const get_currencies = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "financeSetting_currencies",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getCurrencies, get_currencies);
    yield put(getCurrenciesSuccess(response));
  } catch (error) {
    yield put(getCurrenciesFail(error));
  }
}

function* fetchFiscalYearContents(obj) {}

function* onCopyFees({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "copyFeesition";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  try {
    const response = yield call(copyFees, payload);
    yield put(copyFeesSuccess(response));
  } catch (error) {
    yield put(copyFeesFail(error));
  }
}

function* fetchFeesConditions(obj) {
  yield fetchFeesConditionsfromDb(obj.payload);
}

function* fetchFeesConditionsfromDb(fees) {
  const get_feesCondition_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "finance_StudyFeesConditions",
    filter: `studyFeesId  = ${fees.Id}`,
  };

  try {
    const response = yield call(getFeesConditions, get_feesCondition_req);
    yield put(getFeesConditionsSuccess(response));
  } catch (error) {
    yield put(getFeesConditionsFail(error));
  }
}

function* onAddNewFeesCondition({ payload, feesCondition }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "finance_StudyFeesConditions";

  try {
    const response = yield call(addNewFeesCondition, payload);
    yield put(addFeesConditionSuccess(response[0]));
  } catch (error) {
    yield put(addFeesConditionFail(error));
  }
}

function* onUpdateFeesCondition({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "finance_StudyFeesConditions";
  try {
    const response = yield call(updateFeesCondition, payload);
    yield put(updateFeesConditionSuccess(response[0]));
  } catch (error) {
    yield put(updateFeesConditionFail(error));
  }
}

function* onDeleteFeesCondition({ payload, feesCondition }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "finance_StudyFeesConditions";
  try {
    const responsedelete = yield call(deleteFeesCondition, payload);
    yield put(deleteFeesConditionSuccess(responsedelete[0]));
  } catch (error) {
    yield put(deleteFeesConditionFail(error));
  }
}

function* fetchFeesPrices(fees) {
  console.log("qwwwwwwwwwww", fees);
  const get_feesPrice_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "finance_studyFeesPrice",
    filter: `periodId = ${fees.payload.periodId} or contentId = ${fees.payload.contentId}`,
  };

  try {
    const response = yield call(getFeesPrices, get_feesPrice_req);
    yield put(getFeesPricesSuccess(response));
  } catch (error) {
    yield put(getFeesPricesFail(error));
  }
}

function* onAddNewFeesPrice({ payload, feesPrice }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "finance_studyFeesPrice";

  try {
    const response = yield call(addNewFeesPrice, payload);
    yield put(addFeesPriceSuccess(response[0]));
  } catch (error) {
    yield put(addFeesPriceFail(error));
  }
}

function* onUpdateFeesPrice({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "finance_studyFeesPrice";
  try {
    const response = yield call(updateFeesPrice, payload);
    yield put(updateFeesPriceSuccess(response[0]));
  } catch (error) {
    yield put(updateFeesPriceFail(error));
  }
}

function* onDeleteFeesPrice({ payload, feesPrice }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "finance_studyFeesPrice";
  try {
    const responsedelete = yield call(deleteFeesPrice, payload);
    yield put(deleteFeesPriceSuccess(responsedelete[0]));
  } catch (error) {
    yield put(deleteFeesPriceFail(error));
  }
}

function* onCopyFeesPrice({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "copyFeesPrice";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  try {
    const response = yield call(copyFeesPrice, payload);
    yield put(copyFeesPriceSuccess(response));
  } catch (error) {
    yield put(copyFeesPriceFail(error));
  }
}

function* fetchFeesServices(fees) {
  const get_feesService_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "finance_studyFeesService",
    filter: `periodId = ${fees.payload.periodId} or contentId = ${fees.payload.contentId}`,
  };

  try {
    const response = yield call(getFeesServices, get_feesService_req);
    yield put(getFeesServicesSuccess(response));
  } catch (error) {
    yield put(getFeesServicesFail(error));
  }
}

function* onAddNewFeesService({ payload, feesService }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "finance_studyFeesService";

  try {
    const response = yield call(addNewFeesService, payload);
    yield put(addFeesServiceSuccess(response[0]));
  } catch (error) {
    yield put(addFeesServiceFail(error));
  }
}

function* onUpdateFeesService({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "finance_studyFeesService";
  try {
    const response = yield call(updateFeesService, payload);
    yield put(updateFeesServiceSuccess(response[0]));
  } catch (error) {
    yield put(updateFeesServiceFail(error));
  }
}

function* onDeleteFeesService({ payload, feesService }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "finance_studyFeesService";
  try {
    const responsedelete = yield call(deleteFeesService, payload);
    yield put(deleteFeesServiceSuccess(responsedelete[0]));
  } catch (error) {
    yield put(deleteFeesServiceFail(error));
  }
}

function* onCopyFeesService({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "copyFeesService";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  try {
    const response = yield call(copyFeesService, payload);
    yield put(copyFeesServiceSuccess(response));
  } catch (error) {
    yield put(copyFeesServiceFail(error));
  }
}

function* fetchFiscalYearDetails(fees) {
  console.log("qwwwwwww", fees.payload.Id);
  const get_filtered_details = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_finance_FiscalYearDetails",
    filter: `studyFeesId  = ${fees.payload.Id}`,
  };

  try {
    const response = yield call(getFiscalYearDetails, get_filtered_details);
    yield put(getFiscalYearDetailsSuccess(response));
  } catch (error) {
    yield put(getFiscalYearDetailsFail(error));
  }

  // year content
  const get_fiscalYears = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "finance_FiscalYearContents",
    filter: `studyFeesId  = ${fees.payload.Id}`,
  };

  try {
    const response = yield call(getFiscalYearContents, get_fiscalYears);
    yield put(getFiscalYearContentsSuccess(response));
  } catch (error) {
    yield put(getFiscalYearContentsFail(error));
  }

  //get faculty
  const get_faculty_opt = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_Faculty",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getFaculties, get_faculty_opt);
    yield put(getFacultiesSuccess(response));
  } catch (error) {
    yield put(getFacultiesFail(error));
  }

  //get academicCertif
  const get_academicCertif_opt = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_AcadmicCertificates",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(
      getAcademicCertificates,
      get_academicCertif_opt
    );
    yield put(getAcademicCertificatesSuccess(response));
  } catch (error) {
    yield put(getAcademicCertificatesFail(error));
  }

  //period
  const get_filtered_periods = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "finance_FiscalYearPeriod",
    fields: "Id,arTitle,isDefault",
  };

  try {
    const response = yield call(getPeriods, get_filtered_periods);
    yield put(getPeriodsSuccess(response));
  } catch (error) {
    yield put(getPeriodsFail(error));
  }

  //get request
  const get_request_opt = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "financeSetting_requests",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getRequests, get_request_opt);
    yield put(getRequestsSuccess(response));
  } catch (error) {
    yield put(getRequestsFail(error));
  }

  //get semester
  const get_semester_opt = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_Semesters",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getSemesters, get_semester_opt);
    yield put(getSemestersSuccess(response));
  } catch (error) {
    yield put(getSemestersFail(error));
  }

  //execute methods
  const get_execute_method = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "financeSetting_ExecuteMethod",
    fields: "Id,arTitle",
  };

  try {
    const response = yield call(getExecuteMethods, get_execute_method);
    yield put(getExecuteMethodsSuccess(response));
  } catch (error) {
    yield put(getExecuteMethodsFail(error));
  }
}

function* onGetFilteredAcademicCertificates(obj) {
  let facultyId = obj.payload;
  const get_filtered_academicCertificates = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_AcadmicCertificates",
    fields: "Id,AcadmicCertificatesArName,facultyId",
    filter: `facultyId = ${facultyId}  `,
  };
  try {
    const response = yield call(
      getFilteredAcademicCertificates,
      get_filtered_academicCertificates
    );
    yield put(getFilteredAcademicCertificatesSuccess(response));
  } catch (error) {
    yield put(getFilteredAcademicCertificatesFail(error));
  }
}

function* feesDefinitionSaga() {
  yield takeEvery(GET_FEES_DEFINITION, fetchFeesDefinition);
  yield takeEvery(ADD_NEW_FEES_DEFINITION, onAddNewFeesDefinition);
  yield takeEvery(UPDATE_FEES_DEFINITION, onUpdateFeesDefinition);
  yield takeEvery(DELETE_FEES_DEFINITION, onDeleteFeesDefinition);
  yield takeEvery(
    GET_FEES_DEFINITION_DELETED_VALUE,
    onGetFeesDefinitionDeletedValue
  );
  yield takeEvery(COPY_FEES, onCopyFees);
  yield takeEvery(GET_FISCAL_YEARS, fetchFiscalYears);
  yield takeEvery(GET_FISCAL_YEAR_CONTENTS, fetchFiscalYearContents);
  yield takeEvery(GET_FEES_CONDITIONS, fetchFeesConditions);
  yield takeEvery(ADD_NEW_FEES_CONDITION, onAddNewFeesCondition);
  yield takeEvery(UPDATE_FEES_CONDITION, onUpdateFeesCondition);
  yield takeEvery(DELETE_FEES_CONDITION, onDeleteFeesCondition);
  yield takeEvery(GET_FEES_PRICES, fetchFeesPrices);
  yield takeEvery(ADD_NEW_FEES_PRICE, onAddNewFeesPrice);
  yield takeEvery(UPDATE_FEES_PRICE, onUpdateFeesPrice);
  yield takeEvery(DELETE_FEES_PRICE, onDeleteFeesPrice);
  yield takeEvery(COPY_FEES_PRICE, onCopyFeesPrice);
  yield takeEvery(GET_FEES_SERVICES, fetchFeesServices);
  yield takeEvery(ADD_NEW_FEES_SERVICE, onAddNewFeesService);
  yield takeEvery(UPDATE_FEES_SERVICE, onUpdateFeesService);
  yield takeEvery(DELETE_FEES_SERVICE, onDeleteFeesService);
  yield takeEvery(COPY_FEES_SERVICE, onCopyFeesService);
  yield takeEvery(GET_FISCAL_YEAR_DETAILS, fetchFiscalYearDetails);
  yield takeEvery(
    GET_FILTERED_ACADEMIC_CERTIFICATES,
    onGetFilteredAcademicCertificates
  );
}

export default feesDefinitionSaga;
