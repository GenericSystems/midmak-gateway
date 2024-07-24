import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_UNIVERSITYINFO,
  UPDATE_UNIVERSITYINFO,
  ADD_UNIVERSITYINFO,
} from "./actionTypes";

import {
  getUniversityInfoSuccess,
  getUniversityInfoFail,
  updateUniversityInfoSuccess,
  updateUniversityInfoFail,
  addUniversityInfoSuccess,
  addUniversityInfoFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getUniversityInfo,
  addUniversityInfo,
  updateUniversityInfo,
} from "../../helpers/fakebackend_helper";

function* fetchUniversityInfo() {
  const get_universityInfo_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_UniversityInfo",
  };

  try {
    const response = yield call(getUniversityInfo, get_universityInfo_req);
    yield put(getUniversityInfoSuccess(response));
  } catch (error) {
    yield put(getUniversityInfoFail(error));
  }
}

function* onUpdateUniversityInfo({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_UniversityInfo";
  try {
    const response = yield call(updateUniversityInfo, payload);
    yield put(updateUniversityInfoSuccess(response[0]));
  } catch (error) {
    yield put(updateUniversityInfoFail(error));
  }
}

function* onAddUniversityInfo({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_UniversityInfo";
  try {
    const response = yield call(addUniversityInfo, payload);
    yield put(addUniversityInfoSuccess(response[0]));
  } catch (error) {
    yield put(addUniversityInfoFail(error));
  }
}

function* universityInfoSaga() {
  yield takeEvery(GET_UNIVERSITYINFO, fetchUniversityInfo);
  yield takeEvery(UPDATE_UNIVERSITYINFO, onUpdateUniversityInfo);
  yield takeEvery(ADD_UNIVERSITYINFO, onAddUniversityInfo);
}

export default universityInfoSaga;
