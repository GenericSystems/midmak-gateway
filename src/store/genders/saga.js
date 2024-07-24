import { call, put, takeEvery } from "redux-saga/effects";
import {
  GET_GENDERS,
  ADD_NEW_GENDER,
  DELETE_GENDER,
  UPDATE_GENDER,
  GET_GENDER_DELETED_VALUE
} from "./actionTypes";
import {
  getGendersSuccess,
  getGendersFail,
  addGenderFail,
  addGenderSuccess,
  updateGenderSuccess,
  updateGenderFail,
  deleteGenderSuccess,
  deleteGenderFail,
  getGenderDeletedValueSuccess,
  getGenderDeletedValueFail,
} from "./actions";
import {
  getGenders,
  addNewGender,
  updateGender,
  deleteGender,
  getGenderDeletedValue
} from "../../helpers/fakebackend_helper";




function* fetchGenders() {
  const get_genders_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_Gender",
  };
  try {
    const response = yield call(getGenders, get_genders_req);
    yield put(getGendersSuccess(response));
  } catch (error) {
    yield put(getGendersFail(error));
  }
}

function* onAddNewGender({ payload, gender }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_Gender";
  try {
    const response = yield call(addNewGender, payload);
    yield put(addGenderSuccess(response[0]));
  } catch (error) {
    yield put(addGenderFail(error));
  }
}

function* onUpdateGender({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_Gender";
  try {
    const respupdate = yield call(updateGender, payload);
    yield put(updateGenderSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateGenderFail(error));
  }
}
function* onDeleteGender({ payload, Gender }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_Gender";
  try {
    const respdelete = yield call(deleteGender, payload);
    yield put(deleteGenderSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteGenderFail(error));
  }
}
function* onGetGenderDeletedValue() {
  try {
    const response = yield call(getGenderDeletedValue)
    yield put(getGenderDeletedValueSuccess(response))
  } catch (error) {
    yield put(getGenderDeletedValueFail(error))
  }
  
}
function* gendersSaga() {
  yield takeEvery(GET_GENDERS, fetchGenders);
  yield takeEvery(ADD_NEW_GENDER, onAddNewGender);
  yield takeEvery(UPDATE_GENDER, onUpdateGender);
  yield takeEvery(DELETE_GENDER, onDeleteGender);
  yield takeEvery(GET_GENDER_DELETED_VALUE, onGetGenderDeletedValue);
}
export default gendersSaga;
