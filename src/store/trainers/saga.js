import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_TRAINERS,
  ADD_NEW_TRAINER,
  DELETE_TRAINER,
  UPDATE_TRAINER,
  GET_TRAINER_DELETED_VALUE,
} from "./actionTypes";

import {
  getTrainersSuccess,
  getTrainersFail,
  addTrainerSuccess,
  addTrainerFail,
  updateTrainerSuccess,
  updateTrainerFail,
  deleteTrainerSuccess,
  deleteTrainerFail,
  getTrainerDeletedValueSuccess,
  getTrainerDeletedValueFail,
} from "./actions";

// Include Both Helper File with needed methods
import {
  getTrainers,
  addNewTrainer,
  updateTrainer,
  deleteTrainer,
  getTrainerDeletedValue,
} from "../../helpers/fakebackend_helper";

function* fetchTrainers() {
  const get_trainers_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_Trainer",
  };
  try {
    const response = yield call(getTrainers, get_trainers_req);
    yield put(getTrainersSuccess(response));
  } catch (error) {
    yield put(getTrainersFail(error));
  }
}


function* onAddNewTrainer({ payload, trainer }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Trainer";

  try {
    const response = yield call(addNewTrainer, payload);
    yield put(addTrainerSuccess(response[0]));
  } catch (error) {
    yield put(addTrainerFail(error));
  }
}

function* onUpdateTrainer({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Trainer";

  try {
    const respupdate = yield call(updateTrainer, payload);
    yield put(updateTrainerSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateTrainerFail(error));
  }
}

function* onDeleteTrainer({ payload, trainer }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Trainer";

  try {
    const respdelete = yield call(deleteTrainer, payload);
    yield put(deleteTrainerSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteTrainerFail(error));
  }
}

function* onGetTrainerDeletedValue() {
  try {
    const response = yield call(getTrainerDeletedValue)
    yield put(getTrainerDeletedValueSuccess(response))
  } catch (error) {
    yield put(getTrainerDeletedValueFail(error))
  }
  
}

function* trainersSaga() {
  yield takeEvery(GET_TRAINERS, fetchTrainers);
  yield takeEvery(ADD_NEW_TRAINER, onAddNewTrainer);
  yield takeEvery(DELETE_TRAINER, onDeleteTrainer);
  yield takeEvery(UPDATE_TRAINER, onUpdateTrainer);
  yield takeEvery(GET_TRAINER_DELETED_VALUE, onGetTrainerDeletedValue);
}

export default trainersSaga;
