import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_GRANT_SPONSORS,
  GET_GRANT_SPONSOR_PROFILE,
  ADD_NEW_GRANT_SPONSOR,
  DELETE_GRANT_SPONSOR,
  UPDATE_GRANT_SPONSOR,
  GET_GRANT_SPONSOR_DELETED_VALUE,
} from "./actionTypes";

import {
  getGrantSponsorsSuccess,
  getGrantSponsorsFail,
  getGrantSponsorProfileSuccess,
  getGrantSponsorProfileFail,
  addGrantSponsorFail,
  addGrantSponsorSuccess,
  updateGrantSponsorSuccess,
  updateGrantSponsorFail,
  deleteGrantSponsorSuccess,
  deleteGrantSponsorFail,
  getGrantSponsorDeletedValueFail,
  getGrantSponsorDeletedValueSuccess
} from "./actions";

// Include Both Helper File with needed methods
import {
  getGrantSponsors,
  getGrantSponsorProfile,
  addNewGrantSponsor,
  updateGrantSponsor,
  deleteGrantSponsor,
  getGrantSponsorDeletedValue
} from "../../helpers/fakebackend_helper";

function* fetchGrantSponsors() {
  const get_grantSponsors_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_GrantSponsor",
  };
  try {
    const response = yield call(getGrantSponsors, get_grantSponsors_req);
    yield put(getGrantSponsorsSuccess(response));
  } catch (error) {
    yield put(getGrantSponsorsFail(error));
  }
}

function* fetchGrantSponsorProfile() {
  try {
    const response = yield call(getGrantSponsorProfile);
    yield put(getGrantSponsorProfileSuccess(response));
  } catch (error) {
    yield put(getGrantSponsorProfileFail(error));
  }
}

function* onAddNewGrantSponsor({ payload, grant }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_GrantSponsor";

  try {
    const response = yield call(addNewGrantSponsor, payload);
    yield put(addGrantSponsorSuccess(response[0]));
  } catch (error) {
    yield put(addGrantSponsorFail(error));
  }
}

function* onUpdateGrantSponsor({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_GrantSponsor";

  try {
    const respupdate = yield call(updateGrantSponsor, payload);
    yield put(updateGrantSponsorSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateGrantSponsorFail(error));
  }
}

function* onDeleteGrantSponsor({ payload, grant }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_GrantSponsor";

  try {
    const respdelete = yield call(deleteGrantSponsor, payload);
    yield put(deleteGrantSponsorSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteGrantSponsorFail(error));
  }
}

function* onGetGrantSponsorDeletedValue() {
  try {
    const response = yield call(getGrantSponsorDeletedValue)
    yield put(getGrantSponsorDeletedValueSuccess(response))
  } catch (error) {
    yield put(getGrantSponsorDeletedValueFail(error))
  }
  
}

function* grantSponsorsSaga() {
  yield takeEvery(GET_GRANT_SPONSORS, fetchGrantSponsors);
  yield takeEvery(GET_GRANT_SPONSOR_PROFILE, fetchGrantSponsorProfile);
  yield takeEvery(ADD_NEW_GRANT_SPONSOR, onAddNewGrantSponsor);
  yield takeEvery(UPDATE_GRANT_SPONSOR, onUpdateGrantSponsor);
  yield takeEvery(DELETE_GRANT_SPONSOR, onDeleteGrantSponsor);
  yield takeEvery(GET_GRANT_SPONSOR_DELETED_VALUE, onGetGrantSponsorDeletedValue);

}

export default grantSponsorsSaga;
