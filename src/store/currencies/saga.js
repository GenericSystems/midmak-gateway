import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_CURRENCIES,
  GET_CURRENCY_DELETED_VALUE,
  ADD_NEW_CURRENCY,
  DELETE_CURRENCY,
  UPDATE_CURRENCY,
} from "./actionTypes";

import {
  getCurrenciesSuccess,
  getCurrenciesFail,
  getCurrencyDeletedValueSuccess,
  getCurrencyDeletedValueFail,
  addCurrencyFail,
  addCurrencySuccess,
  updateCurrencySuccess,
  updateCurrencyFail,
  deleteCurrencySuccess,
  deleteCurrencyFail,
} from "./actions";

// Include Both Helper File with needed methods
import {
  getCurrencies,
  getCurrencyDeletedValue,
  addNewCurrency,
  updateCurrency,
  deleteCurrency,
} from "../../helpers/fakebackend_helper";

function* fetchCurrencies() {
  const get_settings_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "financeSetting_currencies",
  };
  try {
    const response = yield call(getCurrencies, get_settings_req);
    yield put(getCurrenciesSuccess(response));
  } catch (error) {
    yield put(getCurrenciesFail(error));
  }
}

function* fetchCurrencyDeletedValue() {
  try {
    const response = yield call(getCurrencyDeletedValue);
    yield put(getCurrencyDeletedValueSuccess(response));
  } catch (error) {
    yield put(getCurrencyDeletedValueFail(error));
  }
}

function* onAddNewCurrency({ payload, currency }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "financeSetting_currencies";
  try {
    const response = yield call(addNewCurrency, payload);
    yield put(addCurrencySuccess(response[0]));
  } catch (error) {
    yield put(addCurrencyFail(error));
  }
}

function* onUpdateCurrency({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "financeSetting_currencies";
  try {
    const respupdate = yield call(updateCurrency, payload);
    yield put(updateCurrencySuccess(respupdate[0]));
  } catch (error) {
    yield put(updateCurrencyFail(error));
  }
}

function* onDeleteCurrency({ payload, currency }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "financeSetting_currencies";
  try {
    const respdelete = yield call(deleteCurrency, payload);
    yield put(deleteCurrencySuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteCurrencyFail(error));
  }
}

function* CurrenciesSaga() {
  yield takeEvery(GET_CURRENCIES, fetchCurrencies);
  yield takeEvery(GET_CURRENCY_DELETED_VALUE, fetchCurrencyDeletedValue);
  yield takeEvery(ADD_NEW_CURRENCY, onAddNewCurrency);
  yield takeEvery(UPDATE_CURRENCY, onUpdateCurrency);
  yield takeEvery(DELETE_CURRENCY, onDeleteCurrency);
}

export default CurrenciesSaga;
