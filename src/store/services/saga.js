import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_SERVICES,
  GET_SERVICE_DELETED_VALUE,
  ADD_NEW_SERVICE,
  DELETE_SERVICE,
  UPDATE_SERVICE,
} from "./actionTypes";

import {
  getServicesSuccess,
  getServicesFail,
  getServiceDeletedValueSuccess,
  getServiceDeletedValueFail,
  addServiceFail,
  addServiceSuccess,
  updateServiceSuccess,
  updateServiceFail,
  deleteServiceSuccess,
  deleteServiceFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getServices,
  getServiceDeletedValue,
  addNewService,
  updateService,
  deleteService,
} from "../../helpers/fakebackend_helper";

function* fetchServices() {
  const get_services_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "financeSetting_services",
  };

  try {
    const response = yield call(getServices, get_services_req);
    yield put(getServicesSuccess(response));
  } catch (error) {
    yield put(getServicesFail(error));
  }
}

function* onAddNewService({ payload, service }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "financeSetting_services";

  try {
    const response = yield call(addNewService, payload);
    yield put(addServiceSuccess(response[0]));
  } catch (error) {
    yield put(addServiceFail(error));
  }
}

function* onUpdateService({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "financeSetting_services";
  try {
    const response = yield call(updateService, payload);
    yield put(updateServiceSuccess(response[0]));
  } catch (error) {
    yield put(updateServiceFail(error));
  }
}

function* onDeleteService({ payload, service }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "financeSetting_services";
  try {
    const responsedelete = yield call(deleteService, payload);
    yield put(deleteServiceSuccess(responsedelete[0]));
  } catch (error) {
    yield put(deleteServiceFail(error));
  }
}

function* onGetServiceDeletedValue() {
  try {
    const response = yield call(getServiceDeletedValue);
    yield put(getServiceDeletedValueSuccess(response));
  } catch (error) {
    yield put(getServiceDeletedValueFail(error));
  }
}

function* servicesSaga() {
  yield takeEvery(GET_SERVICES, fetchServices);
  yield takeEvery(ADD_NEW_SERVICE, onAddNewService);
  yield takeEvery(UPDATE_SERVICE, onUpdateService);
  yield takeEvery(DELETE_SERVICE, onDeleteService);
  yield takeEvery(GET_SERVICE_DELETED_VALUE, onGetServiceDeletedValue);
}

export default servicesSaga;
