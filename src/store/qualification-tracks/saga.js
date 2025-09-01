import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_QUALIFICATIONS_TRACKS,
  GET_QUALIFICATION_TRACK_DELETED_VALUE,
  ADD_NEW_QUALIFICATION_TRACK,
  DELETE_QUALIFICATION_TRACK,
  UPDATE_QUALIFICATION_TRACK,
} from "./actionTypes";

import {
  getQualificationsTracksSuccess,
  getQualificationsTracksFail,
  getQualificationTrackDeletedValueSuccess,
  getQualificationTrackDeletedValueFail,
  addQualificationTrackFail,
  addQualificationTrackSuccess,
  updateQualificationTrackSuccess,
  updateQualificationTrackFail,
  deleteQualificationTrackSuccess,
  deleteQualificationTrackFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getQualificationsTracks,
  getQualificationTrackDeletedValue,
  addNewQualificationTrack,
  updateQualificationTrack,
  deleteQualificationTrack,
} from "../../helpers/fakebackend_helper";


function* fetchQualificationsTracks() {

  const get_qualificationTracks_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_QualificationTracks",

  };

  try {
    const response = yield call(getQualificationsTracks, get_qualificationTracks_req);
    console.log("dddddddddddddddddd",response)
    yield put(getQualificationsTracksSuccess(response));
  } catch (error) {
    yield put(getQualificationsTracksFail(error));
  }
}

function* onAddNewQualificationTrack({ payload, qualificationTrack }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_QualificationTracks";

  try {
    const response = yield call(addNewQualificationTrack, payload);
    yield put(addQualificationTrackSuccess(response[0]));
  } catch (error) {
    yield put(addQualificationTrackFail(error));
  }
}

function* onUpdateQualificationTrack({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_QualificationTracks";
  try {
    const response = yield call(updateQualificationTrack, payload);
    yield put(updateQualificationTrackSuccess(response[0]));
  } catch (error) {
    yield put(updateQualificationTrackFail(error));
  }
}

function* onDeleteQualificationTrack({ payload, qualificationTrack }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_QualificationTracks";
  try {
    const responsedelete = yield call(deleteQualificationTrack, payload);
    yield put(deleteQualificationTrackSuccess(responsedelete[0]));
  } catch (error) {
    yield put(deleteQualificationTrackFail(error));
  }
}

function* onGetQualificationTrackDeletedValue() {
  try {
    const response = yield call(getQualificationTrackDeletedValue)
    yield put(getQualificationTrackDeletedValueSuccess(response))
  } catch (error) {
    yield put(getQualificationTrackDeletedValueFail(error))
  }
  
}


function* qualificationTracksSaga() {
  yield takeEvery(GET_QUALIFICATIONS_TRACKS, fetchQualificationsTracks);
  yield takeEvery(ADD_NEW_QUALIFICATION_TRACK, onAddNewQualificationTrack);
  yield takeEvery(UPDATE_QUALIFICATION_TRACK, onUpdateQualificationTrack);
  yield takeEvery(DELETE_QUALIFICATION_TRACK, onDeleteQualificationTrack);
  yield takeEvery(GET_QUALIFICATION_TRACK_DELETED_VALUE, onGetQualificationTrackDeletedValue);
}

export default qualificationTracksSaga;
