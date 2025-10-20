import { call, put, takeEvery } from "redux-saga/effects";

// Redux States
import {
  UPLOAD_FILE,
} from "./actionTypes";

import {
  uploadFileSuccess,
  uploadFileFail,
} from "./actions";

import { uploadFile } from "helpers/api_helper";

// GEN
function* onUploadFile({ payload }) {
  console.log("uploading file", payload);
  payload["source"] = "db";
  payload["procedure"] = "SisApp_UpdateTraineeInfo";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  
  try {
    const response = yield call(uploadFile, payload);
    console.log("response", response);
    yield put(uploadFileSuccess(response[0]));
  } catch (error) {
    yield put(uploadFileFail(error));
  }
}

function* _CommonSaga() {
  yield takeEvery(UPLOAD_FILE, onUploadFile);
}

export default _CommonSaga;
