import { call, put, takeEvery } from "redux-saga/effects";
import {
  GET_GRANTS,
  ADD_NEW_GRANT,
  DELETE_GRANT,
  UPDATE_GRANT,
  GET_GRANT_DELETED_VALUE
} from "./actionTypes";


import {
  GET_GRANT_SPONSORS}
  from "../grantSponsors/actionTypes"
  import{
    getGrantSponsorsSuccess,
getGrantSponsorsFail
  } from "../grantSponsors/actions"
import {
  getGrantsSuccess,
  getGrantsFail,
  addGrantFail,
  addGrantSuccess,
  updateGrantSuccess,
  updateGrantFail,
  deleteGrantSuccess,
  deleteGrantFail,
  getGrantDeletedValueSuccess,
  getGrantDeletedValueFail,
} from "./actions";
import {
  getGrants,
  getGrantSponsors,
  addNewGrant,
  updateGrant,
  deleteGrant,
  getGrantDeletedValue
} from "../../helpers/fakebackend_helper";




function* fetchGrants() {

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
  const get_grants_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_Grants",
  };
  try {
    const response = yield call(getGrants, get_grants_req);
    yield put(getGrantsSuccess(response));
  } catch (error) {
    yield put(getGrantsFail(error));
  }
}

function* onAddNewGrant({ payload, grant }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_Grants";
  try {
    const response = yield call(addNewGrant, payload);
    yield put(addGrantSuccess(response[0]));
  } catch (error) {
    yield put(addGrantFail(error));
  }
}

function* onUpdateGrant({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_Grants";
  try {
    const respupdate = yield call(updateGrant, payload);
    yield put(updateGrantSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateGrantFail(error));
  }
}
function* onDeleteGrant({ payload, Grant }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_Grants";
  try {
    const respdelete = yield call(deleteGrant, payload);
    yield put(deleteGrantSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteGrantFail(error));
  }
}
function* onGetGrantDeletedValue() {
  try {
    const response = yield call(getGrantDeletedValue)
    yield put(getGrantDeletedValueSuccess(response))
  } catch (error) {
    yield put(getGrantDeletedValueFail(error))
  }
  
}
function* grantsSaga() {
  yield takeEvery(GET_GRANTS, fetchGrants);
  yield takeEvery(ADD_NEW_GRANT, onAddNewGrant);
  yield takeEvery(UPDATE_GRANT, onUpdateGrant);
  yield takeEvery(DELETE_GRANT, onDeleteGrant);
  yield takeEvery(GET_GRANT_DELETED_VALUE, onGetGrantDeletedValue);
}
export default grantsSaga;
