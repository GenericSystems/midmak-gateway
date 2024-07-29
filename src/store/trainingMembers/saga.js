import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_TRAINING_MEMBERS,
  ADD_NEW_TRAINING_MEMBER,
  DELETE_TRAINING_MEMBER,
  UPDATE_TRAINING_MEMBER,
  GET_TRAINING_MEMBER_DELETED_VALUE,
} from "./actionTypes";

import {
  getTrainingMembersSuccess,
  getTrainingMembersFail,
  addTrainingMemberSuccess,
  addTrainingMemberFail,
  updateTrainingMemberSuccess,
  updateTrainingMemberFail,
  deleteTrainingMemberSuccess,
  deleteTrainingMemberFail,
  getTrainingMemberDeletedValueSuccess,
  getTrainingMemberDeletedValueFail,
} from "./actions";

import { getUserTypesFail, getUserTypesSuccess } from "../user-types/actions";

// Include Both Helper File with needed methods
import {
  getTrainingMembers,
  addNewTrainingMember,
  updateTrainingMember,
  deleteTrainingMember,
  getTrainingMemberDeletedValue,
  getUserTypes,
} from "../../helpers/fakebackend_helper";

function* fetchTrainingMembers() {
  const get_trainingMembers_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_TrainingMembers",
  };
  try {
    const response = yield call(getTrainingMembers, get_trainingMembers_req);
    yield put(getTrainingMembersSuccess(response));
  } catch (error) {
    yield put(getTrainingMembersFail(error));
  }

   //user types
   const get_userTypes_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_UserType",
    fields: "Id,arTitle",
  };

  try {
    const response = yield call(getUserTypes, get_userTypes_req);
    yield put(getUserTypesSuccess(response));
  } catch (error) {
    yield put(getUserTypesFail(error));
  }

}


function* onAddNewTrainingMember({ payload, trainingMember }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TrainingMembers";

  try {
    const response = yield call(addNewTrainingMember, payload);
    yield put(addTrainingMemberSuccess(response[0]));
  } catch (error) {
    yield put(addTrainingMemberFail(error));
  }
}

function* onUpdateTrainingMember({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TrainingMembers";

  try {
    const respupdate = yield call(updateTrainingMember, payload);
    yield put(updateTrainingMemberSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateTrainingMemberFail(error));
  }
}

function* onDeleteTrainingMember({ payload, trainingMember }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TrainingMembers";

  try {
    const respdelete = yield call(deleteTrainingMember, payload);
    yield put(deleteTrainingMemberSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteTrainingMemberFail(error));
  }
}

function* onGetTrainingMemberDeletedValue() {
  try {
    const response = yield call(getTrainingMemberDeletedValue)
    yield put(getTrainingMemberDeletedValueSuccess(response))
  } catch (error) {
    yield put(getTrainingMemberDeletedValueFail(error))
  }
  
}

function* trainingMembers() {
  yield takeEvery(GET_TRAINING_MEMBERS, fetchTrainingMembers);
  yield takeEvery(ADD_NEW_TRAINING_MEMBER, onAddNewTrainingMember);
  yield takeEvery(DELETE_TRAINING_MEMBER, onDeleteTrainingMember);
  yield takeEvery(UPDATE_TRAINING_MEMBER, onUpdateTrainingMember);
  yield takeEvery(GET_TRAINING_MEMBER_DELETED_VALUE, onGetTrainingMemberDeletedValue);
}

export default trainingMembers;
