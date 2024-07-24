import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_TRANSPORT_LINES,
  ADD_NEW_TRANSPORT_LINE,
  UPDATE_TRANSPORT_LINE,
  DELETE_TRANSPORT_LINE,
  GET_TRANSPORT_LINE_DETAILS,
  ADD_NEW_TRANSPORT_LINE_DETAIL,
  UPDATE_TRANSPORT_LINE_DETAIL,
  DELETE_TRANSPORT_LINE_DETAIL,
  GET_TRANSPORT_LINE_DELETED_VALUE,
  GET_TRANSPORT_LINE_DETAILS_DELETED_VALUE,
  GET_STDS_TRANSPORT_LINE,
  ADD_NEW_STD_TRANSPORT_LINE,
  UPDATE_STD_TRANSPORT_LINE,
  DELETE_STD_TRANSPORT_LINE,
  GET_STD_TRANSPORT_LINE_DELETED_VALUE,
  GET_UNIV_STD_DATA_LIST
} from "./actionTypes";

import {
  getTransportLinesSuccess,
  getTransportLinesFail,
  addTransportLineSuccess,
  addTransportLineFail,
  updateTransportLineSuccess,
  updateTransportLineFail,
  deleteTransportLineSuccess,
  deleteTransportLineFail,
  getTransportLineDetailsSuccess,
  getTransportLineDetailsFail,
  addTransportLineDetailSuccess,
  addTransportLineDetailFail,
  updateTransportLineDetailSuccess,
  updateTransportLineDetailFail,
  deleteTransportLineDetailSuccess,
  deleteTransportLineDetailFail,
  getTransportLineDeletedValueSuccess,
  getTransportLineDeletedValueFail,
  getTransportLineDetailsDeletedValueSuccess,
  getTransportLineDetailsDeletedValueFail,
  getStdsTransportLineSuccess,
  getStdsTransportLineFail,
  addStdTransportLineSuccess,
  addStdTransportLineFail,
  updateStdTransportLineSuccess,
  updateStdTransportLineFail,
  deleteStdTransportLineSuccess,
  deleteStdTransportLineFail,
  getStdTransportLineDeletedValueSuccess,
  getStdTransportLineDeletedValueFail,
  getUnivStdDataListSuccess,
  getUnivStdDataListFail
} from "./actions";



import {
  getTransportLines,
  addNewTransportLine,
  updateTransportLine,
  deleteTransportLine,
  getTransportLineDetails,
  addNewTransportLineDetail,
  updateTransportLineDetail,
  deleteTransportLineDetail,
  getTransportLineDeletedValue,
  getTransportLineDetailsDeletedValue,
  getStdsTransportLine,
  addNewStdTransportLine,
  updateStdTransportLine,
  deleteStdTransportLine,
  getStdTransportLineDeletedValue,
  getUnivStdDataList

} from "../../helpers/fakebackend_helper";

function* fetchTransportLines() {
  const get_transportLines_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_TransportationLines",
  };
  try {
    const response = yield call(getTransportLines, get_transportLines_req);
    yield put(getTransportLinesSuccess(response));
  } catch (error) {
    yield put(getTransportLinesFail(error));
  }

}

function* onAddNewTransportLine({ payload }) {
  console.log("payload",payload)
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TransportationLines";

  try {
    const response = yield call(addNewTransportLine, payload);
    yield put(addTransportLineSuccess(response[0]));
  } catch (error) {
    yield put(addTransportLineFail(error));
  }
}

function* onUpdateTransportLine({ payload }) {
  console.log("payload",payload)
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TransportationLines";

  try {
    const respupdate = yield call(updateTransportLine, payload);
    yield put(updateTransportLineSuccess(respupdate[0]));
    yield fetchTransportLines();
  } catch (error) {
    yield put(updateTransportLineFail(error));
  }
}

function* onDeleteTransportLine({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TransportationLines";

  try {
    const respdelete = yield call(deleteTransportLine, payload);
    yield put(deleteTransportLineSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteTransportLineFail(error));
  }
}

//transport line details
function* fetchTransportLineDetails(obj) {
  let transportLineId = obj.payload;
  const get_transportLineDetails_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_TransportationLinesDetails",
    filter: `transportLineId = ${transportLineId}  `,
  };
  try {
    const response = yield call(
      getTransportLineDetails,
      get_transportLineDetails_req
    );
    yield put(getTransportLineDetailsSuccess(response));
  } catch (error) {
    yield put(getTransportLineDetailsFail(error));
  }
}

function* onAddNewTransportLineDetail({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TransportationLinesDetails";

  try {
    const response = yield call(addNewTransportLineDetail, payload);
    yield put(addTransportLineDetailSuccess(response[0]));
  } catch (error) {
    yield put(addTransportLineDetailFail(error));
  }
}

function* onUpdateTransportLineDetail({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TransportationLinesDetails";

  try {
    const respupdate = yield call(updateTransportLineDetail, payload);
    yield put(updateTransportLineDetailSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateTransportLineDetailFail(error));
  }
}

function* onDeleteTransportLineDetail({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TransportationLinesDetails";

  try {
    const respdelete = yield call(deleteTransportLineDetail, payload);
    yield put(deleteTransportLineDetailSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteTransportLineDetailFail(error));
  }
}

function* onGetTransportLineDeletedValue() {
  try {
    const response = yield call(getTransportLineDeletedValue)
    yield put(getTransportLineDeletedValueSuccess(response))
  } catch (error) {
    yield put(getTransportLineDeletedValueFail(error))
  }
  
}
function* onGetTransportLineDetailsDeletedValue() {
  try {
    const response = yield call(getTransportLineDetailsDeletedValue)
    yield put(getTransportLineDetailsDeletedValueSuccess(response))
  } catch (error) {
    yield put(getTransportLineDetailsDeletedValueFail(error))
  }
  
}

function* fetchStdsTransportLine(payload) {
  console.log("pay",payload)
  const get_transportLines_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_StudentsTransportaionLine",
    filter: `semesterId = ${payload.payload.semesterId}`
  };
  try {
    const response = yield call(getStdsTransportLine, get_transportLines_req);
    yield put(getStdsTransportLineSuccess(response));
  } catch (error) {
    yield put(getStdsTransportLineFail(error));
  }

}

function* onAddNewStdTransportLine({ payload }) {
  console.log("payload",payload)
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StudentsTransportaionLine";

  try {
    const response = yield call(addNewStdTransportLine, payload);
    yield put(addStdTransportLineSuccess(response[0]));
  } catch (error) {
    yield put(addStdTransportLineFail(error));
  }
}

function* onUpdateStdTransportLine({ payload }) {
  console.log("payload",payload)
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StudentsTransportaionLine";

  try {
    const respupdate = yield call(updateStdTransportLine, payload);
    yield put(updateStdTransportLineSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateStdTransportLineFail(error));
  }
}

function* onDeleteStdTransportLine({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StudentsTransportaionLine";

  try {
    const respdelete = yield call(deleteStdTransportLine, payload);
    yield put(deleteStdTransportLineSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteStdTransportLineFail(error));
  }
}

function* onGetStdTransportLineDeletedValue() {
  try {
    const response = yield call(getStdTransportLineDeletedValue)
    yield put(getStdTransportLineDeletedValueSuccess(response))
  } catch (error) {
    yield put(getStdTransportLineDeletedValueFail(error))
  }
  
}


function* fetchUnivStds() {

 const get_universityStudents_req = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_UniversityStudent",
    fields: "SID,studentname",
  };
  try {
    const response = yield call(
      getUnivStdDataList,
      get_universityStudents_req
    );
    yield put(getUnivStdDataListSuccess(response));
  } catch (error) {
    yield put(getUnivStdDataListFail(error));
  } 

}

function* transportLinesSaga() {
  yield takeEvery(GET_TRANSPORT_LINES, fetchTransportLines);
  yield takeEvery(ADD_NEW_TRANSPORT_LINE, onAddNewTransportLine);
  yield takeEvery(UPDATE_TRANSPORT_LINE, onUpdateTransportLine);
  yield takeEvery(DELETE_TRANSPORT_LINE, onDeleteTransportLine);
  yield takeEvery(GET_TRANSPORT_LINE_DELETED_VALUE, onGetTransportLineDeletedValue);
  yield takeEvery(GET_TRANSPORT_LINE_DETAILS, fetchTransportLineDetails);
  yield takeEvery(ADD_NEW_TRANSPORT_LINE_DETAIL, onAddNewTransportLineDetail);
  yield takeEvery(UPDATE_TRANSPORT_LINE_DETAIL, onUpdateTransportLineDetail);
  yield takeEvery(DELETE_TRANSPORT_LINE_DETAIL, onDeleteTransportLineDetail);
  yield takeEvery(GET_TRANSPORT_LINE_DETAILS_DELETED_VALUE, onGetTransportLineDetailsDeletedValue);
  yield takeEvery(GET_STDS_TRANSPORT_LINE, fetchStdsTransportLine);
  yield takeEvery(ADD_NEW_STD_TRANSPORT_LINE, onAddNewStdTransportLine);
  yield takeEvery(UPDATE_STD_TRANSPORT_LINE, onUpdateStdTransportLine);
  yield takeEvery(DELETE_STD_TRANSPORT_LINE, onDeleteStdTransportLine);
  yield takeEvery(GET_STD_TRANSPORT_LINE_DELETED_VALUE, onGetStdTransportLineDeletedValue);
  yield takeEvery(GET_UNIV_STD_DATA_LIST, fetchUnivStds);

}

export default transportLinesSaga;
