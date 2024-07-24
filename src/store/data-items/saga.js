import { call, put, takeEvery } from "redux-saga/effects"

// Data Redux States
import {
  GET_DATA_ITEMS
} from "./actionTypes"
import {
  getDataItemsFail,
  getDataItemsSuccess
} from "./actions"

//Include Both Helper File with needed methods
import {
  getDataItems
} from "helpers/fakebackend_helper"

function* fetchDataItems({ payload: { dataconfig } }) {
  try {
    const response = yield call(getDataItems(payload))
    yield put(getDataItemsSuccess(response))
  } catch (error) {
    yield put(getDataItemsFail(error))
  }
}

function* dataitemsSaga() {
  yield takeEvery(GET_DATA_ITEMS, fetchDataItems)
}

export default dataitemsSaga
