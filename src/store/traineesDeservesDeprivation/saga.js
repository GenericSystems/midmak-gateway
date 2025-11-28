import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_TRAINEES_DESERVES_DEPRIVATION,
  GET_TRAINEE_DESERVE_DEPRIVATION_DELETED_VALUE,
  ADD_NEW_TRAINEE_DESERVE_DEPRIVATION,
  UPDATE_TRAINEE_DESERVE_DEPRIVATION,
  DELETE_TRAINEE_DESERVE_DEPRIVATION,
} from "./actionTypes";

import {
  getTraineesDeservesDeprivationSuccess,
  getTraineesDeservesDeprivationFail,
  getTraineeDeserveDeprivationDeletedValueSuccess,
  getTraineeDeserveDeprivationDeletedValueFail,
  addTraineeDeserveDeprivationFail,
  addTraineeDeserveDeprivationSuccess,
  updateTraineeDeserveDeprivationSuccess,
  updateTraineeDeserveDeprivationFail,
  deleteTraineeDeserveDeprivationSuccess,
  deleteTraineeDeserveDeprivationFail,
} from "./actions";

import { getTraineesOptSuccess, getTraineesOptFail } from "../trainees/actions";
import { getYearsSuccess, getYearsFail } from "../years/actions";
import {
  getCoursesOfferingSuccess,
  getCoursesOfferingFail,
} from "../classScheduling/actions";
//Include Both Helper File with needed methods
import {
  getTraineesDeservesDeprivation,
  getTraineeDeserveDeprivationDeletedValue,
  addNewTraineeDeserveDeprivation,
  updateTraineeDeserveDeprivation,
  deleteTraineeDeserveDeprivation,
  getTraineesOpt,
  getCoursesOffering,
  getYears,
  getRequestStatus,
} from "../../helpers/fakebackend_helper";

function* fetchTraineesDeservesDeprivation() {
  const get_TraineesDeservesDeprivation_req = {
    source: "db",
    procedure: "SisApp_getBarredStudents",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    // tablename: "_Common_Trainee",
  };
  try {
    const response = yield call(
      getTraineesDeservesDeprivation,
      get_TraineesDeservesDeprivation_req
    );
    yield put(getTraineesDeservesDeprivationSuccess(response));
  } catch (error) {
    yield put(getTraineesDeservesDeprivationFail(error));
  }

  const get_years_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Years",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getYears, get_years_req);
    console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy", response);
    yield put(getYearsSuccess(response));
  } catch (error) {
    yield put(getYearsFail(error));
  }
}

function* getTraineeDeserveDeprivationProfile() {
  try {
    const response = yield call(getTraineeDeserveDeprivationDeletedValue);
    yield put(getTraineeDeserveDeprivationDeletedValueSuccess(response));
  } catch (error) {
    yield put(getTraineeDeserveDeprivationDeletedValueFail(error));
  }
}

function* onAddNewTraineeDeserveDeprivation({ payload }) {
  console.log("xxxxxxxxxxxxxxxxx", payload);
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TraineeDeserveDeprivation";
  payload["queryname"] = "_Common_TraineeDeserveDeprivation";

  try {
    const response = yield call(addNewTraineeDeserveDeprivation, payload);
    //console.log("ppppppppppppppppppppp", response);
    yield put(addTraineeDeserveDeprivationSuccess(response[0]));
  } catch (error) {
    yield put(addTraineeDeserveDeprivationFail(error));
  }
}

function* onDeleteTraineeDeserveDeprivation({ payload, contract }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TraineeDeserveDeprivation";

  try {
    const response = yield call(deleteTraineeDeserveDeprivation, payload);
    yield put(deleteTraineeDeserveDeprivationSuccess(response[0]));
  } catch (error) {
    yield put(deleteTraineeDeserveDeprivationFail(error));
  }
}

function* onUpdateTraineeDeserveDeprivation({ payload }) {
  console.log("qqqqqqqqqqqqqqqq", payload);
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TraineeDeserveDeprivation";
  payload["queryname"] = "_Common_TraineeDeserveDeprivation";
  try {
    const respupdate = yield call(updateTraineeDeserveDeprivation, payload);
    console.log("UpdateTraineeDeserveDeprivation", respupdate);
    yield put(updateTraineeDeserveDeprivationSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateTraineeDeserveDeprivationFail(error));
  }
}

function* onGetTraineeDeserveDeprivationDeletedValue() {
  try {
    const response = yield call(getTraineeDeserveDeprivationDeletedValue);
    yield put(getTraineeDeserveDeprivationDeletedValueSuccess(response));
  } catch (error) {
    yield put(getTraineeDeserveDeprivationDeletedValueFail(error));
  }
}

function* TraineesDeservesDeprivationSaga() {
  yield takeEvery(
    GET_TRAINEES_DESERVES_DEPRIVATION,
    fetchTraineesDeservesDeprivation
  );
  yield takeEvery(
    GET_TRAINEE_DESERVE_DEPRIVATION_DELETED_VALUE,
    onGetTraineeDeserveDeprivationDeletedValue
  );
  yield takeEvery(
    GET_TRAINEE_DESERVE_DEPRIVATION_DELETED_VALUE,
    getTraineeDeserveDeprivationProfile
  );
  yield takeEvery(
    ADD_NEW_TRAINEE_DESERVE_DEPRIVATION,
    onAddNewTraineeDeserveDeprivation
  );
  yield takeEvery(
    UPDATE_TRAINEE_DESERVE_DEPRIVATION,
    onUpdateTraineeDeserveDeprivation
  );
  yield takeEvery(
    DELETE_TRAINEE_DESERVE_DEPRIVATION,
    onDeleteTraineeDeserveDeprivation
  );
}

export default TraineesDeservesDeprivationSaga;
