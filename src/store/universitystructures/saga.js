import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import {
GET_STRUCTURES,
GET_STRUCTURE_DELETED_VALUE,
ADD_NEW_STRUCTURE,
DELETE_STRUCTURE,
UPDATE_STRUCTURE
} from "./actionTypes"

import {
getStructuresSuccess,
getStructuresFail,
getStructureDeletedValueSuccess,
getStructureDeletedValueFail,
addStructureFail,
addStructureSuccess,
updateStructureSuccess,
updateStructureFail,
deleteStructureSuccess,
deleteStructureFail,
} from "./actions"

// Include Both Helper File with needed methods
import {
getStructures,
getStructureDeletedValue,
addNewStructure,
updateStructure,
deleteStructure
} from "../../helpers/fakebackend_helper"

function* fetchStructures() {
const get_settings_req = {
    source: 'db',
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_universitystructure"
    }    
try {
const response = yield call(getStructures, get_settings_req)
yield put(getStructuresSuccess(response))
} catch (error) {
yield put(getStructuresFail(error))
}
}

function* fetchStructureDeletedValue() {
try {
const response = yield call(getStructureDeletedValue)
yield put(getStructureDeletedValueSuccess(response))
} catch (error) {
yield put(getStructureDeletedValueFail(error))
}
}

function* onAddNewStructure({ payload, structure }) {
delete payload["id"];
payload["source"] = 'db';
payload["procedure"] = 'SisApp_addData';
payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
payload["tablename"] = 'settings_universitystructure';
try {
        const response = yield call(addNewStructure, payload)
        yield put(addStructureSuccess(response[0]))
    } catch (error) {
        yield put(addStructureFail(error))
    }
}

function* onUpdateStructure({ payload }) {
    payload["source"] = 'db';
    payload["procedure"] = 'SisApp_updateData';
    payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
    payload["tablename"] = 'settings_universitystructure';
    try {
        const respupdate = yield call(updateStructure, payload)
        yield put(updateStructureSuccess(respupdate[0]))
    } catch (error) {
        yield put(updateStructureFail(error))
    }
}

function* onDeleteStructure({ payload, structure }) {
    payload["source"] = 'db';
    payload["procedure"] = 'SisApp_removeData';
    payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
    payload["tablename"] = 'settings_universitystructure';
    try {
        const respdelete = yield call(deleteStructure, payload)
        yield put(deleteStructureSuccess(respdelete[0]))
    } catch (error) {
        yield put(deleteStructureFail(error))
    }
}

function* structuresSaga() {
yield takeEvery(GET_STRUCTURES, fetchStructures)
yield takeEvery(GET_STRUCTURE_DELETED_VALUE, fetchStructureDeletedValue)
yield takeEvery(ADD_NEW_STRUCTURE, onAddNewStructure)
yield takeEvery(UPDATE_STRUCTURE, onUpdateStructure)
yield takeEvery(DELETE_STRUCTURE, onDeleteStructure)
}

export default structuresSaga