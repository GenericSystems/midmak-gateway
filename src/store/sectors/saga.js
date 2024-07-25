import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_SECTORS,
  GET_SECTOR_DELETED_VALUE,
  ADD_NEW_SECTOR,
  DELETE_SECTOR,
  UPDATE_SECTOR,
} from "./actionTypes";

import {
  getSectorsSuccess,
  getSectorsFail,
  getSectorDeletedValueSuccess,
  getSectorDeletedValueFail,
  addSectorFail,
  addSectorSuccess,
  updateSectorSuccess,
  updateSectorFail,
  deleteSectorSuccess,
  deleteSectorFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getSectors,
  getSectorDeletedValue,
  addNewSector,
  updateSector,
  deleteSector,
} from "../../helpers/fakebackend_helper";


function* fetchSectors(obj) {

  const payload= obj.payload

  const get_halls_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Sector",

  };

  try {
    const response = yield call(getSectors, get_halls_req);
    yield put(getSectorsSuccess(response));
  } catch (error) {
    yield put(getSectorsFail(error));
  }
}

function* onAddNewSector({ payload, sector }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_Sector";

  try {
    const response = yield call(addNewSector, payload);
    yield put(addSectorSuccess(response[0]));
  } catch (error) {
    yield put(addSectorFail(error));
  }
}

function* onUpdateSector({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_Sector";
  try {
    const response = yield call(updateSector, payload);
    yield put(updateSectorSuccess(response[0]));
  } catch (error) {
    yield put(updateSectorFail(error));
  }
}

function* onDeleteSector({ payload, sector }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_Sector";
  try {
    const responsedelete = yield call(deleteSector, payload);
    yield put(deleteSectorSuccess(responsedelete[0]));
  } catch (error) {
    yield put(deleteSectorFail(error));
  }
}

function* onGetSectorDeletedValue() {
  try {
    const response = yield call(getSectorDeletedValue)
    yield put(getSectorDeletedValueSuccess(response))
  } catch (error) {
    yield put(getSectorDeletedValueFail(error))
  }
  
}


function* hallsSaga() {
  yield takeEvery(GET_SECTORS, fetchSectors);
  yield takeEvery(ADD_NEW_SECTOR, onAddNewSector);
  yield takeEvery(UPDATE_SECTOR, onUpdateSector);
  yield takeEvery(DELETE_SECTOR, onDeleteSector);
  yield takeEvery(GET_SECTOR_DELETED_VALUE, onGetSectorDeletedValue);
}

export default hallsSaga;
