import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_DEFINE_EXAM_DATES,
  GET_DEFINE_EXAM_DATE_DELETED_VALUE,
  ADD_NEW_DEFINE_EXAM_DATE,
  UPDATE_DEFINE_EXAM_DATE,
  DELETE_DEFINE_EXAM_DATE,
} from "./actionTypes";

import {
  getDefineExamDatesSuccess,
  getDefineExamDatesFail,
  getDefineExamDateDeletedValueSuccess,
  getDefineExamDateDeletedValueFail,
  addDefineExamDateFail,
  addDefineExamDateSuccess,
  updateDefineExamDateSuccess,
  updateDefineExamDateFail,
  deleteDefineExamDateSuccess,
  deleteDefineExamDateFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getDefineExamDates,
  getDefineExamDateDeletedValue,
  addNewDefineExamDate,
  updateDefineExamDate,
  deleteDefineExamDate,
} from "../../../helpers/fakebackend_helper";

function* fetchDefineExamDates() {
  const get_defineExamDate_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Contract",
  };
  try {
    const response = yield call(getDefineExamDates, get_defineExamDate_req);
    console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq", response);
    yield put(getDefineExamDatesSuccess(response));
  } catch (error) {
    yield put(getDefineExamDatesFail(error));
  }
}

function* getDefineExamDateProfile() {
  try {
    const response = yield call(getDefineExamDateDeletedValue);
    yield put(getDefineExamDateDeletedValueSuccess(response));
  } catch (error) {
    yield put(getDefineExamDateDeletedValueFail(error));
  }
}

function* onAddNewDefineExamDate({ payload }) {
  console.log("xxxxxxxxxxxxxxxxx", payload);
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_DefineExamDate";
  payload["queryname"] = "_Common_DefineExamDate";

  try {
    const response = yield call(addNewDefineExamDate, payload);
    //console.log("ppppppppppppppppppppp", response);
    yield put(addDefineExamDateSuccess(response[0]));
  } catch (error) {
    yield put(addDefineExamDateFail(error));
  }
}

function* onDeleteDefineExamDate({ payload, contract }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "_Common_Contract";

  try {
    const response = yield call(deleteDefineExamDate, payload);
    yield put(deleteDefineExamDateSuccess(response[0]));
  } catch (error) {
    yield put(deleteDefineExamDateFail(error));
  }
}

function* onUpdateDefineExamDate({ payload }) {
  console.log("qqqqqqqqqqqqqqqq", payload);
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_DefineExamDate";
  payload["queryname"] = "_Common_DefineExamDate";
  try {
    const respupdate = yield call(updateDefineExamDate, payload);
    console.log("UpdateDefineExamDate", respupdate);
    yield put(updateDefineExamDateSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateDefineExamDateFail(error));
  }
}

function* onGetDefineExamDateDeletedValue() {
  try {
    const response = yield call(getDefineExamDateDeletedValue);
    yield put(getDefineExamDateDeletedValueSuccess(response));
  } catch (error) {
    yield put(getDefineExamDateDeletedValueFail(error));
  }
}

function* DefineExamDatesSaga() {
  yield takeEvery(GET_DEFINE_EXAM_DATES, fetchDefineExamDates);
  yield takeEvery(
    GET_DEFINE_EXAM_DATE_DELETED_VALUE,
    onGetDefineExamDateDeletedValue
  );
  yield takeEvery(GET_DEFINE_EXAM_DATE_DELETED_VALUE, getDefineExamDateProfile);
  yield takeEvery(ADD_NEW_DEFINE_EXAM_DATE, onAddNewDefineExamDate);
  yield takeEvery(UPDATE_DEFINE_EXAM_DATE, onUpdateDefineExamDate);
  yield takeEvery(DELETE_DEFINE_EXAM_DATE, onDeleteDefineExamDate);
}

export default DefineExamDatesSaga;
