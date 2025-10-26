import { call, put, takeEvery } from "redux-saga/effects";

// Redux States
import {
  UPLOAD_FILE,
  FETCH_FILE_REQUEST,
  FETCH_FILE_SUCCESS,
  FETCH_FILE_FAILURE,
} from "./actionTypes";

import {
  uploadFileSuccess,
  uploadFileFail,
  fetchFile,
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
    console.log("response:", response);
    yield put(uploadFileSuccess(response[0]));
  } catch (error) {
    yield put(uploadFileFail(error));
  }
}


function* fetchFileSaga(action) {
  console.log(`Fetching file with ID: ${action.payload}`);
  try {
    const response = yield call(axios.get, `https://yourserver.com/files/${action.payload}`, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer YOUR_TOKEN`,
      },
    });

    const blob = response.data;
    const dataUrl = yield call(blobToDataURL, blob);

    yield put({ type: FETCH_FILE_SUCCESS, payload: { dataUrl, mimeType: blob.type } });
  } catch (error) {
    yield put({ type: FETCH_FILE_FAILURE, payload: error.message });
  }
}

function blobToDataURL(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}


function* _CommonSaga() {
  yield takeEvery(UPLOAD_FILE, onUploadFile);
  yield takeEvery(FETCH_FILE_REQUEST, fetchFileSaga);
}

export default _CommonSaga;
