import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import {
GET_CURR_SEM_MANS,

ADD_NEW_CURR_SEM_MAN,
DELETE_CURR_SEM_MAN,
UPDATE_CURR_SEM_MAN
} from "./actionTypes"

import {
getCurrSemMansSuccess,
getCurrSemMansFail,
addCurrSemManFail,
addCurrSemManSuccess,
updateCurrSemManSuccess,
updateCurrSemManFail,
deleteCurrSemManSuccess,
deleteCurrSemManFail,
} from "./actions"

import {
  getYearSemestersSuccess,
  getYearSemestersFail,
} from "../general-management/actions"

import {
  getFacultiesSuccess,
  getFacultiesFail,
} from "../mob-app-faculty-accs/actions";
// Include Both Helper File with needed methods
import {
getCurrSemMans,
addNewCurrSemMan,
updateCurrSemMan,
deleteCurrSemMan,
getYearSemesters,
getFaculties,
} from "../../helpers/fakebackend_helper"

function* fetchCurrSemMans() {

  //get faculty
  const get_faculty_opt = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_Faculty",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getFaculties, get_faculty_opt);
    yield put(getFacultiesSuccess(response));
  } catch (error) {
    yield put(getFacultiesFail(error));
  }
  const get_year_sem = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_YearsSemesters",
  };
  try {
    const response = yield call(getYearSemesters, get_year_sem);
    yield put(getYearSemestersSuccess(response));
  } catch (error) {
    yield put(getYearSemestersFail(error));
  }

const get_currSemMans_req = {
   source: 'db',
   procedure: "SisApp_getData",
   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
   tablename: "settings_SystemCurrentSemester",
    }  
try {
const response = yield call(getCurrSemMans,get_currSemMans_req)
yield put(getCurrSemMansSuccess(response))
} catch (error) {
yield put(getCurrSemMansFail(error))
}
}


function* onAddNewCurrSemMan({ payload, currSemMan }) {
    delete payload["id"];
    payload["source"] = 'db';
    payload["procedure"] = 'SisApp_addData';
    payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
    payload["tablename"] = 'settings_SystemCurrentSemester';
    
try {
  const response = yield call(addNewCurrSemMan, payload)
   yield put(addCurrSemManSuccess(response[0]))
} catch (error) {
   yield put(addCurrSemManFail(error))
}
}

function* onUpdateCurrSemMan({ payload }) {
payload["source"] = 'db';
payload["procedure"] = 'SisApp_updateData';
payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
payload["tablename"] = 'settings_SystemCurrentSemester';

try {
    const respupdate = yield call(updateCurrSemMan, payload)
    yield put(updateCurrSemManSuccess(respupdate[0]))
} catch (error) {
yield put(updateCurrSemManFail(error))
}
}

function* onDeleteCurrSemMan({ payload, currSemMan }) {
payload["source"] = 'db';
payload["procedure"] = 'SisApp_removeData';
payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
payload["tablename"] = 'settings_SystemCurrentSemester';
    
try {
  const respdelete = yield call(deleteCurrSemMan, payload)
  yield put(deleteCurrSemManSuccess(respdelete[0]))
} catch (error) {
yield put(deleteCurrSemManFail(error))
}
}

function* currSemMansSaga() {
yield takeEvery(GET_CURR_SEM_MANS, fetchCurrSemMans)
yield takeEvery(ADD_NEW_CURR_SEM_MAN, onAddNewCurrSemMan)
yield takeEvery(UPDATE_CURR_SEM_MAN, onUpdateCurrSemMan)
yield takeEvery(DELETE_CURR_SEM_MAN, onDeleteCurrSemMan)
}

export default currSemMansSaga