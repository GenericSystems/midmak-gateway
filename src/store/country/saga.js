import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_COUNTRIES,
  GET_COUNTRY_DELETED_VALUE,
  ADD_NEW_COUNTRY,
  DELETE_COUNTRY,
  UPDATE_COUNTRY,
  IMPORT_COUNTRIES
} from "./actionTypes";

import {
  getCountriesSuccess,
  getCountriesFail,
  getCountryDeletedValueSuccess,
  getCountryDeletedValueFail,
  addCountryFail,
  addCountrySuccess,
  updateCountrySuccess,
  updateCountryFail,
  deleteCountrySuccess,
  deleteCountryFail,
  importCountriesSuccess,
  importCountriesFail,
} from "./actions";

// Include Both Helper File with needed methods
import {
  getCountries,
  getCountryDeletedValue,
  addNewCountry,
  updateCountry,
  deleteCountry,
  importCountries

} from "../../helpers/fakebackend_helper";

function* fetchCountries() {
  const get_countries_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_country",
  };
  try {
    const response = yield call(getCountries, get_countries_req);
    console.log("get resp",response)

    yield put(getCountriesSuccess(response));
  } catch (error) {
    yield put(getCountriesFail(error));
  }
}

function* onGetCountryDeletedValue() {
  try {
    const response = yield call(getCountryDeletedValue)
    yield put(getCountryDeletedValueSuccess(response))
  } catch (error) {
    yield put(getCountryDeletedValueFail(error))
  }
  
}

function* onAddNewCountry({ payload, country }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_country";

  try {
    const response = yield call(addNewCountry, payload);
    console.log("payload in saga", payload)
    console.log("resp in saga", response)
    yield put(addCountrySuccess(response[0]));
  } catch (error) {
    yield put(addCountryFail(error));
  }
  
}

function* onImportCountries({ payload, nationality }) {
  delete payload["id"];
  payload["source"] = 'db';
  payload["procedure"] = 'SisApp_importFile';
  payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
  payload["tablename"] = 'settings_country';
  payload["field"] = "arTitle,enTitle";

  
  try {
    const response = yield call(importCountries, payload)
    console.log("import resp",response)
    console.log("payload",payload)
    yield put(importCountriesSuccess(response))
  } catch (error) {

    yield put(importCountriesFail(error))
  }
}

function* onUpdateCountry({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_country";

  try {
    const respupdate = yield call(updateCountry, payload);
    yield put(updateCountrySuccess(respupdate[0]));
  } catch (error) {
    yield put(updateCountryFail(error));
  }
}

function* onDeleteCountry({ payload, country }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_country";

  try {
    const respdelete = yield call(deleteCountry, payload);
    yield put(deleteCountrySuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteCountryFail(error));
  }
}

function* countriesSaga() {
  yield takeEvery(GET_COUNTRIES, fetchCountries);
  yield takeEvery(GET_COUNTRY_DELETED_VALUE, onGetCountryDeletedValue);
  yield takeEvery(ADD_NEW_COUNTRY, onAddNewCountry);
  yield takeEvery(IMPORT_COUNTRIES, onImportCountries)
  yield takeEvery(UPDATE_COUNTRY, onUpdateCountry);
  yield takeEvery(DELETE_COUNTRY, onDeleteCountry);
}

export default countriesSaga;
