import { call, put, takeEvery } from "redux-saga/effects";

// Action Types
import {
  GET_HIGHSTUDYTYPES,
  GET_HIGHSTUDYTYPE_DELETED_VALUE,
  ADD_NEW_HIGHSTUDYTYPE,
  UPDATE_HIGHSTUDYTYPE,
  DELETE_HIGHSTUDYTYPE,
} from "./actionTypes";

// Actions
import {
  getHighStudyTypesSuccess,
  getHighStudyTypesFail,
  getHighStudyTypeDeletedValueSuccess,
  getHighStudyTypeDeletedValueFail,
  addHighStudyTypeSuccess,
  addHighStudyTypeFail,
  updateHighStudyTypeSuccess,
  updateHighStudyTypeFail,
  deleteHighStudyTypeSuccess,
  deleteHighStudyTypeFail,
} from "./actions";

// API Helpers
import {
  getHighStudyTypes,
  getHighStudyTypeDeletedValue,
  addNewHighStudyType,
  updateHighStudyType,
  deleteHighStudyType,
} from "../../helpers/fakebackend_helper";

function* fetchHighStudyTypes() {
  const requestPayload = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_HighStudyType",
  };
  try {
    const response = yield call(getHighStudyTypes, requestPayload);
    yield put(getHighStudyTypesSuccess(response));
  } catch (error) {
    yield put(getHighStudyTypesFail(error));
  }
}

function* fetchHighStudyTypeDeletedValue() {
  try {
    const response = yield call(getHighStudyTypeDeletedValue);
    yield put(getHighStudyTypeDeletedValueSuccess(response));
  } catch (error) {
    yield put(getHighStudyTypeDeletedValueFail(error));
  }
}

function* onAddNewHighStudyType({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_HighStudyType";

  try {
    const response = yield call(addNewHighStudyType, payload);
    yield put(addHighStudyTypeSuccess(response[0]));
  } catch (error) {
    yield put(addHighStudyTypeFail(error));
  }
}

function* onUpdateHighStudyType({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_HighStudyType";

  try {
    const response = yield call(updateHighStudyType, payload);
    yield put(updateHighStudyTypeSuccess(response[0]));
  } catch (error) {
    yield put(updateHighStudyTypeFail(error));
  }
}

function* onDeleteHighStudyType({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_HighStudyType";

  try {
    const response = yield call(deleteHighStudyType, payload);
    yield put(deleteHighStudyTypeSuccess(response[0]));
  } catch (error) {
    yield put(deleteHighStudyTypeFail(error));
  }
}

function* HighStudyTypeSaga() {
  yield takeEvery(GET_HIGHSTUDYTYPES, fetchHighStudyTypes);
  yield takeEvery(
    GET_HIGHSTUDYTYPE_DELETED_VALUE,
    fetchHighStudyTypeDeletedValue
  );
  yield takeEvery(ADD_NEW_HIGHSTUDYTYPE, onAddNewHighStudyType);
  yield takeEvery(UPDATE_HIGHSTUDYTYPE, onUpdateHighStudyType);
  yield takeEvery(DELETE_HIGHSTUDYTYPE, onDeleteHighStudyType);
}

export default HighStudyTypeSaga;
