import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_TIMELINES,
  GET_TIMELINE_DELETED_VALUE,
  ADD_NEW_TIMELINE,
  DELETE_TIMELINE,
  UPDATE_TIMELINE,
  GET_REQUEST_PERIOD_ALLOWANCE,
  GET_REQUEST_PERIOD_ALLOWANCE_TIME,
  UPDATE_REQUEST_PERIOD_ALLOWANCE_TIME,
  GENERALIZE_REQUEST_PERIOD_ALLOWANCE_TIME,
  GET_REQUEST_PERIOD_PERMISSION,
  ADD_REQUEST_PERIOD_PERMISSION,
  UPDATE_REQUEST_PERIOD_PERMISSION,
  DELETE_REQUEST_PERIOD_PERMISSION,
} from "./actionTypes";

import {
  getTimeLinesSuccess,
  getTimeLinesFail,
  getTimeLineDeletedValueSuccess,
  getTimeLineDeletedValueFail,
  addTimeLineFail,
  addTimeLineSuccess,
  updateTimeLineSuccess,
  updateTimeLineFail,
  deleteTimeLineSuccess,
  deleteTimeLineFail,
  getRequestsPeriodAllowanceSuccess,
  getRequestsPeriodAllowanceFail,
  getRequestsPeriodAllowanceTimeSuccess,
  getRequestsPeriodAllowanceTimeFail,
  updateRequestsPeriodAllowanceTimeSuccess,
  updateRequestsPeriodAllowanceTimeFail,
  generalizeRequestsPeriodAllowanceTimeSuccess,
  generalizeRequestsPeriodAllowanceTimeFail,
  getRequestsPeriodPermissionSuccess,
  getRequestsPeriodPermissionFail,
  updateRequestsPeriodPermissionSuccess,
  updateRequestsPeriodPermissionFail,
  addRequestsPeriodPermissionSuccess,
  addRequestsPeriodPermissionFail,
  deleteRequestsPeriodPermissionSuccess,
  deleteRequestsPeriodPermissionFail,
} from "./actions";

// Include Both Helper File with needed methods
import {
  getTimeLines,
  getTimeLineDeletedValue,
  addNewTimeLine,
  updateTimeLine,
  deleteTimeLine,
  getRequestsPeriodAllowance,
  getRequestsPeriodAllowanceTime,
  updateRequestsPeriodAllowanceTime,
  generalizeRequestsPeriodAllowanceTime,
  getRequestsPeriodPermission,
  updateRequestsPeriodPermission,
  addRequestsPeriodPermission,
  deleteRequestsPeriodPermission,
  getFaculties,
  getLevels,
  getDepartments,
} from "../../helpers/fakebackend_helper";

import {
  getFacultiesSuccess,
  getFacultiesFail,
} from "../mob-app-faculty-accs/actions";

import {
  getDepartmentsSuccess,
  getDepartmentsFail,
} from "../departments/actions";

import { getLevelsSuccess, getLevelsFail } from "../levels/actions";

function* fetchTimeLines() {
  const get_timeLines_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_TimeLines",
  };
  try {
    const response = yield call(getTimeLines, get_timeLines_req);
    response.map(resp => {
      resp["children"] = JSON.parse(resp["children"]);
    });
    yield put(getTimeLinesSuccess(response));
  } catch (error) {
    yield put(getTimeLinesFail(error));
  }

  //get faculty
  const get_faculty_opt = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_Faculty",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getFaculties, get_faculty_opt);
    yield put(getFacultiesSuccess(response));
  } catch (error) {
    yield put(getFacultiesFail(error));
  }

  //get department
  const get_department_opt = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_Department",
    fields: "Id,arTitle,facultyId",
  };
  try {
    const response = yield call(getDepartments, get_department_opt);
    yield put(getDepartmentsSuccess(response));
  } catch (error) {
    yield put(getDepartmentsFail(error));
  }

  //get level
  const get_level_opt = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_Levels",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getLevels, get_level_opt);
    yield put(getLevelsSuccess(response));
  } catch (error) {
    yield put(getLevelsFail(error));
  }
}

function* fetchRequestsPeriodAllowance() {
  const get_requestsPeriodAllowance_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_requestsPeriodAllowance",
  };
  try {
    const response = yield call(
      getRequestsPeriodAllowance,
      get_requestsPeriodAllowance_req
    );
    yield put(getRequestsPeriodAllowanceSuccess(response));
  } catch (error) {
    yield put(getRequestsPeriodAllowanceFail(error));
  }
}

function* fetchTimeLineDeletedValue() {
  try {
    const response = yield call(getTimeLineDeletedValue);
    yield put(getTimeLineDeletedValueSuccess(response));
  } catch (error) {
    yield put(getTimeLineDeletedValueFail(error));
  }
}

function* fetchRequestsPeriodAllowanceTime(obj) {
  let payload = obj.payload;
  const get_requestsPeriodAllowance_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: `${payload.tablename}`,
    filter: `yearSemesterId = ${payload.yearSemesterId} and requestsPeriodId=${payload.requestsPeriodId} `,
  };
  try {
    const response = yield call(
      getRequestsPeriodAllowanceTime,
      get_requestsPeriodAllowance_req
    );
    yield put(getRequestsPeriodAllowanceTimeSuccess(response));
  } catch (error) {
    yield put(getRequestsPeriodAllowanceTimeFail(error));
  }
}

function* onUpdateRequestsPeriodAllowanceTime({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  try {
    const respupdate = yield call(updateRequestsPeriodAllowanceTime, payload);
    yield put(updateRequestsPeriodAllowanceTimeSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateRequestsPeriodAllowanceTimeFail(error));
  }
}

function* onGeneralizeRequestsPeriodAllowanceTime({ payload }) {
  const row = payload.row;
  payload["source"] = "db";
  payload["procedure"] = "generalization_values";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  try {
    const respgeneralize = yield call(
      generalizeRequestsPeriodAllowanceTime,
      payload
    );
    yield put(generalizeRequestsPeriodAllowanceTimeSuccess(respgeneralize));
  } catch (error) {
    yield put(generalizeRequestsPeriodAllowanceTimeFail(error));
  }
}

function* fetchRequestsPeriodPermission(obj) {
  let payload = obj.payload;
  const get_requestsPeriodPer = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: `${payload.tablename}`,
  };
  if (payload.tablename === "settings_requestsPeriodPermission") {
    get_requestsPeriodPer.filter = `requestsPeriodTimeId=${payload.requestsPeriodTimeId}`;
  } else if (payload.tablename === "settings_mobileRequestsPeriodPermission") {
    get_requestsPeriodPer.filter = `mobileRequestsPeriodTimeId=${payload.requestsPeriodTimeId}`;
  }

  try {
    const response = yield call(
      getRequestsPeriodPermission,
      get_requestsPeriodPer
    );
    yield put(getRequestsPeriodPermissionSuccess(response));
  } catch (error) {
    yield put(getRequestsPeriodPermissionFail(error));
  }
}

function* onUpdateRequestsPeriodPermission({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  try {
    const respupdate = yield call(updateRequestsPeriodPermission, payload);
    yield put(updateRequestsPeriodPermissionSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateRequestsPeriodPermissionFail(error));
  }
}

function* onAddRequestsPeriodPermission({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";

  try {
    const response = yield call(addRequestsPeriodPermission, payload);
    yield put(addRequestsPeriodPermissionSuccess(response[0]));
  } catch (error) {
    yield put(addRequestsPeriodPermissionFail(error));
  }
}

function* onDeleteRequestsPeriodPermission({ payload, timeLine }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  try {
    const respdelete = yield call(deleteRequestsPeriodPermission, payload);
    yield put(deleteRequestsPeriodPermissionSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteRequestsPeriodPermissionFail(error));
  }
}

function* onAddNewTimeLine({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "addTimeLine";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_Years";
  payload["queryname"] = "_TimeLines";

  try {
    const response = yield call(addNewTimeLine, payload);
    response.map(resp => {
      resp["children"] = JSON.parse(resp["children"]);
    });
    yield put(addTimeLineSuccess(response[0]));
  } catch (error) {
    yield put(addTimeLineFail(error));
  }
}

function* onUpdateTimeLine({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  try {
    const respupdate = yield call(updateTimeLine, payload);
    yield put(updateTimeLineSuccess(respupdate[0]));
    yield fetchTimeLines();
  } catch (error) {
    yield put(updateTimeLineFail(error));
  }
}

function* onDeleteTimeLine({ payload, timeLine }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_Years";

  try {
    const respdelete = yield call(deleteTimeLine, payload);
    yield put(deleteTimeLineSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteTimeLineFail(error));
  }
}

function* timeLinesSaga() {
  yield takeEvery(GET_TIMELINES, fetchTimeLines);
  yield takeEvery(GET_REQUEST_PERIOD_ALLOWANCE, fetchRequestsPeriodAllowance);
  yield takeEvery(
    GET_REQUEST_PERIOD_ALLOWANCE_TIME,
    fetchRequestsPeriodAllowanceTime
  );
  yield takeEvery(
    UPDATE_REQUEST_PERIOD_ALLOWANCE_TIME,
    onUpdateRequestsPeriodAllowanceTime
  );
  yield takeEvery(
    GENERALIZE_REQUEST_PERIOD_ALLOWANCE_TIME,
    onGeneralizeRequestsPeriodAllowanceTime
  );
  yield takeEvery(GET_REQUEST_PERIOD_PERMISSION, fetchRequestsPeriodPermission);
  yield takeEvery(ADD_REQUEST_PERIOD_PERMISSION, onAddRequestsPeriodPermission);
  yield takeEvery(
    UPDATE_REQUEST_PERIOD_PERMISSION,
    onUpdateRequestsPeriodPermission
  );
  yield takeEvery(
    DELETE_REQUEST_PERIOD_PERMISSION,
    onDeleteRequestsPeriodPermission
  );
  yield takeEvery(GET_TIMELINE_DELETED_VALUE, fetchTimeLineDeletedValue);
  yield takeEvery(ADD_NEW_TIMELINE, onAddNewTimeLine);
  yield takeEvery(UPDATE_TIMELINE, onUpdateTimeLine);
  yield takeEvery(DELETE_TIMELINE, onDeleteTimeLine);
}

export default timeLinesSaga;
