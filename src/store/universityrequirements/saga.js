import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import {
GET_UNIVERSITYREQUIREMENTS,
GET_UNIVERSITYREQUIREMENTS_PROFILE,
ADD_NEW_UNIVERSITYREQUIREMENTS,
DELETE_UNIVERSITYREQUIREMENTS,
UPDATE_UNIVERSITYREQUIREMENTS
} from "./actionTypes"

import {
getUniversityrequirementsSuccess,
getUniversityrequirementsFail,
getUniversityrequirementProfileSuccess,
getUniversityrequirementProfileFail,
addUniversityrequirementFail,
addUniversityrequirementSuccess,
updateUniversityrequirementSuccess,
updateUniversityrequirementFail,
deleteUniversityrequirementSuccess,
deleteUniversityrequirementFail,
} from "./actions"

// Include Both Helper File with needed methods
import {
getUniversityrequirements,
getUniversityrequirementProfile,
addNewUniversityrequirement,
updateUniversityrequirement,
deleteUniversityrequirement
} from "../../helpers/fakebackend_helper"

function* fetchUniversityrequirements() {
const get_settings_req = {
    source: 'db',
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_universityuniversityrequirement"
    }    
try {
const response = yield call(getUniversityrequirements, get_settings_req)
yield put(getUniversityrequirementsSuccess(response))
} catch (error) {
yield put(getUniversityrequirementsFail(error))
}
}

function* fetchUniversityrequirementProfile() {
try {
const response = yield call(getUniversityrequirementProfile)
yield put(getUniversityrequirementProfileSuccess(response))
} catch (error) {
yield put(getUniversityrequirementProfileFail(error))
}
}

function* onAddNewUniversityrequirement({ payload, universityrequirement }) {
try {
const response = yield call(addNewUniversityrequirement, universityrequirement)
yield put(addUniversityrequirementSuccess(response))
} catch (error) {
yield put(addUniversityrequirementFail(error))
}
}

function* onUpdateUniversityrequirement({ payload }) {
try {
const response = yield call(updateUniversityrequirement, payload)
yield put(updateUniversityrequirementSuccess(response))
} catch (error) {
yield put(updateUniversityrequirementFail(error))
}
}

function* onDeleteUniversityrequirement({ payload, universityrequirement }) {
try {
const response = yield call(deleteUniversityrequirement, universityrequirement)
yield put(deleteUniversityrequirementSuccess(response))
} catch (error) {
yield put(deleteUniversityrequirementFail(error))
}
}

function* universityrequirementsSaga() {
yield takeEvery(GET_UNIVERSITYREQUIREMENTS, fetchUniversityrequirements)
yield takeEvery(GET_UNIVERSITYREQUIREMENTS_PROFILE, fetchUniversityrequirementProfile)
yield takeEvery(ADD_NEW_UNIVERSITYREQUIREMENTS, onAddNewUniversityrequirement)
yield takeEvery(UPDATE_UNIVERSITYREQUIREMENTS, onUpdateUniversityrequirement)
yield takeEvery(DELETE_UNIVERSITYREQUIREMENTS, onDeleteUniversityrequirement)
}

export default universityrequirementsSaga