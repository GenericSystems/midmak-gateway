import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_POSITIONS,
  GET_POSITION_DELETED_VALUE,
  ADD_NEW_POSITION,
  UPDATE_POSITION,
  DELETE_POSITION,
} from "./actionTypes";

import {
  getPositionsSuccess,
  getPositionsFail,
  getPositionDeletedValueSuccess,
  getPositionDeletedValueFail,
  addPositionFail,
  addPositionSuccess,
  updatePositionSuccess,
  updatePositionFail,
  deletePositionSuccess,
  deletePositionFail,
  getPositionTypesSuccess,
  getPositionTypesFail,
  getPositionsOptSuccess,
  getPositionsOptFail,
} from "./actions";

import {
  getCorporateNodesOptSuccess,
  getCorporateNodesOptFail,
} from "../HR/employees/actions";

//Include Both Helper File with needed methods
import {
  getPositions,
  getPositionDeletedValue,
  addNewPosition,
  updatePosition,
  deletePosition,
  getPositionTypes,
  getPositionsOpt,
  getCorporateNodesOpt,
} from "../../helpers/fakebackend_helper";

function* fetchPositions(selectedpayload) {
  let lang = selectedpayload.payload;
  console.log("selectedpayloadselectedpayload", selectedpayload);
  const titleField = lang === "en" ? "enTitle" : "arTitle";
  const get_position_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Position",
  };
  try {
    const response = yield call(getPositions, get_position_req);
    console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqq", response);
    yield put(getPositionsSuccess(response));
  } catch (error) {
    yield put(getPositionsFail(error));
  }

  const get_positionType_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_ContractType",
    fields: `Id,${titleField}`,
  };

  try {
    const response = yield call(getPositionTypes, get_positionType_req);
    yield put(getPositionTypesSuccess(response));
  } catch (error) {
    yield put(getPositionTypesFail(error));
  }

  const get_positionOpt_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_ContractType",
    fields: `Id,${titleField}`,
  };

  try {
    const response = yield call(getPositionsOpt, get_positionOpt_req);
    yield put(getPositionsOptSuccess(response));
  } catch (error) {
    yield put(getPositionsOptFail(error));
  }

  const get_CorporateNodes_req = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Gender",
    fields: `Id,${titleField}`,
  };
  try {
    const response = yield call(getCorporateNodesOpt, get_CorporateNodes_req);
    yield put(getCorporateNodesOptSuccess(response));
  } catch (error) {
    yield put(getCorporateNodesOptFail(error));
  }
}

function* getPositionProfile() {
  try {
    const response = yield call(getPositionDeletedValue);
    yield put(getPositionDeletedValueSuccess(response));
  } catch (error) {
    yield put(getPositionDeletedValueFail(error));
  }
}

function* onAddNewPosition({ payload }) {
  console.log("xxxxxxxxxxxxxxxxx", payload);
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Position";
  payload["queryname"] = "_Common_Position";

  try {
    const response = yield call(addNewPosition, payload);
    //console.log("ppppppppppppppppppppp", response);
    yield put(addPositionSuccess(response[0]));
  } catch (error) {
    yield put(addPositionFail(error));
  }
}

function* onDeletePosition({ payload, position }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Position";

  try {
    const response = yield call(deletePosition, payload);
    yield put(deletePositionSuccess(response[0]));
  } catch (error) {
    yield put(deletePositionFail(error));
  }
}

function* onUpdatePosition({ payload }) {
  console.log("qqqqqqqqqqqqqqqq", payload);
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Position";
  payload["queryname"] = "_Common_Position";
  try {
    const respupdate = yield call(updatePosition, payload);
    console.log("UpdatePosition", respupdate);
    yield put(updatePositionSuccess(respupdate[0]));
  } catch (error) {
    yield put(updatePositionFail(error));
  }
}

function* onGetPositionDeletedValue() {
  try {
    const response = yield call(getPositionDeletedValue);
    yield put(getPositionDeletedValueSuccess(response));
  } catch (error) {
    yield put(getPositionDeletedValueFail(error));
  }
}

function* PositionsSaga() {
  yield takeEvery(GET_POSITIONS, fetchPositions);
  yield takeEvery(GET_POSITION_DELETED_VALUE, onGetPositionDeletedValue);
  yield takeEvery(GET_POSITION_DELETED_VALUE, getPositionProfile);
  yield takeEvery(ADD_NEW_POSITION, onAddNewPosition);
  yield takeEvery(UPDATE_POSITION, onUpdatePosition);
  yield takeEvery(DELETE_POSITION, onDeletePosition);
}

export default PositionsSaga;
