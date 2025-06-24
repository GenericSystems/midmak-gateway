import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_REWARDS_TYPES,
  GET_REWARD_TYPE_DELETED_VALUE,
  ADD_NEW_REWARD_TYPE,
  DELETE_REWARD_TYPE,
  UPDATE_REWARD_TYPE,
} from "./actionTypes";

import {
  getRewardsTypesSuccess,
  getRewardsTypesFail,
  getRewardTypeDeletedValueSuccess,
  getRewardTypeDeletedValueFail,
  addRewardTypeFail,
  addRewardTypeSuccess,
  updateRewardTypeSuccess,
  updateRewardTypeFail,
  deleteRewardTypeSuccess,
  deleteRewardTypeFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getRewardsTypes,
  getRewardTypeDeletedValue,
  addNewRewardType,
  updateRewardType,
  deleteRewardType,
} from "../../../helpers/fakebackend_helper";

function* fetchRewardsTypes() {
  const get_RewardType_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_ContractType",
  };
  try {
    const response = yield call(getRewardsTypes, get_RewardType_req);
    console.log("fffffffffffffff", response);
    yield put(getRewardsTypesSuccess(response));
  } catch (error) {
    yield put(getRewardsTypesFail(error));
  }
}

function* getRewardTypeProfile() {
  try {
    const response = yield call(getRewardTypeDeletedValue);
    yield put(getRewardTypeDeletedValueSuccess(response));
  } catch (error) {
    yield put(getRewardTypeDeletedValueFail(error));
  }
}

function* onAddNewRewardType({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_ContractType";

  try {
    const response = yield call(addNewRewardType, payload);
    yield put(addRewardTypeSuccess(response[0]));
  } catch (error) {
    yield put(addRewardTypeFail(error));
  }
}

function* onUpdateRewardType({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_ContractType";

  try {
    const response = yield call(updateRewardType, payload);
    yield put(updateRewardTypeSuccess(response[0]));
  } catch (error) {
    yield put(updateRewardTypeFail(error));
  }
}

function* onDeleteRewardType({ payload, rewardType }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_ContractType";

  try {
    const response = yield call(deleteRewardType, payload);
    yield put(deleteRewardTypeSuccess(response[0]));
  } catch (error) {
    yield put(deleteRewardTypeFail(error));
  }
}

function* RewardsTypesSaga() {
  yield takeEvery(GET_REWARDS_TYPES, fetchRewardsTypes);
  yield takeEvery(GET_REWARD_TYPE_DELETED_VALUE, getRewardTypeProfile);
  yield takeEvery(ADD_NEW_REWARD_TYPE, onAddNewRewardType);
  yield takeEvery(UPDATE_REWARD_TYPE, onUpdateRewardType);
  yield takeEvery(DELETE_REWARD_TYPE, onDeleteRewardType);
}

export default RewardsTypesSaga;
