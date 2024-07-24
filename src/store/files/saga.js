import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_FILE } from "./actionTypes";

import { getFileSuccess, getFileFail } from "./actions";

//Include Both Helper File with needed methods
import { getFile } from "../../helpers/fakebackend_helper";

function* fetchFile(file) {
  let fileName = file.payload;

  

  try {
    const response = yield call(getFile);
    const filteredResponse = response.filter(
      item => item.fileName === fileName
    );
    yield put(getFileSuccess(filteredResponse));
  } catch (error) {
    yield put(getFileFail(error));
  }
}

function* fileSaga() {
  yield takeEvery(GET_FILE, fetchFile);
}

export default fileSaga;
