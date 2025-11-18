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
} from "./actions";

//Include Both Helper File with needed methods
import {
  getPositions,
  getPositionDeletedValue,
  addNewPosition,
  updatePosition,
  deletePosition,
} from "../../helpers/fakebackend_helper";

function* fetchPositions() {
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
