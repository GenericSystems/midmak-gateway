import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_ADMISSION_CONDITIONS,
  ADD_NEW_ADMISSION_CONDITION,
  DELETE_ADMISSION_CONDITION,
  UPDATE_ADMISSION_CONDITION,
  GET_ADMISSION_SETTING,
  GET_ADMISSION_CONDITION_DELETED_VALUE,
  COPY_ADMISSION_COND
  } from "./actionTypes";

import {
  getAdmissionConditionsSuccess,
  getAdmissionConditionsFail,
  addAdmissionConditionFail,
  addAdmissionConditionSuccess,
  updateAdmissionConditionSuccess,
  updateAdmissionConditionFail,
  deleteAdmissionConditionSuccess,
  deleteAdmissionConditionFail,
  getAdmissionConditionDeletedValueSuccess,
  getAdmissionConditionDeletedValueFail,
  copyAdmissionCondSuccess,
  copyAdmissionCondFail,

} from "./actions";

import {
  getFacultiesSuccess,
  getFacultiesFail,
  } from "../mob-app-faculty-accs/actions";


import {
getCertificatesSuccess,
getCertificatesFail,
} from "../certificates/actions";

import {
  getYearsSuccess,
  getYearsFail,
} from "../years/actions";
    
import {
  getEstimatesSuccess,
  getEstimatesFail,
} from "../estimates/actions";
    
import {
  getCurrentSemesterSuccess,
  getCurrentSemesterFail,
} from "../semesters/actions";


import {
  getAdmissionConditions,
  addNewAdmissionCondition,
  updateAdmissionCondition,
  deleteAdmissionCondition,
  getAdmissionConditionDeletedValue,
  getFaculties,
  getCertificates,
  getYears,
  getEstimates,
  getCurrentSemester,
  copyAdmissionCond,
  
} from "../../helpers/fakebackend_helper";

function* fetchAdmissionSetting() {
  //get faculty
  const get_faculty_opt = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Faculty",
  };
  try {
    const response = yield call(getFaculties, get_faculty_opt);
    yield put(getFacultiesSuccess(response));
  } catch (error) {
    yield put(getFacultiesFail(error));
  }

//get certificate
const get_certificate_opt = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_Certificates",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getCertificates, get_certificate_opt);
    yield put(getCertificatesSuccess(response));
  } catch (error) {
    yield put(getCertificatesFail(error));
  }

  //get years
const get_year_opt = {
  source: "db",
  procedure: "Generic_getOptions",
  apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  tablename: "settings_Years",
  fields: "Id,arTitle",
};
try {
  const response = yield call(getYears, get_year_opt);
  yield put(getYearsSuccess(response));
} catch (error) {
  yield put(getYearsFail(error));
}

//get estimates
const get_estimate_opt = {
  source: "db",
  procedure: "Generic_getOptions",
  apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  tablename: "settings_estimate",
  fields: "Id,arEstimate",
};
try {
  const response = yield call(getEstimates, get_estimate_opt);
  yield put(getEstimatesSuccess(response));
} catch (error) {
  yield put(getEstimatesFail(error));
}


  //get current semester
  const get_current_semester = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_SystemCurrentSemester",
    filter: "facultyNum = 0 or facultyNum is null",
  };
  try {
    const response = yield call(getCurrentSemester, get_current_semester);
    yield put(getCurrentSemesterSuccess(response[0]));
  } catch (error) {
    yield put(getCurrentSemesterFail(error));
  }

}


function* fetchAdmissionConditions(obj) {
  let admissionCondition = obj.payload;
  const get_admissionConditions_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_AdmissionCondition",
    filter: `facultyId = ${admissionCondition.facultyId} and YearId = ${admissionCondition.YearId} and isGrantCond = ${admissionCondition.isGrantCond}  `,
  };
  try {
    const response = yield call(
      getAdmissionConditions,
      get_admissionConditions_req
    );
    yield put(getAdmissionConditionsSuccess(response));
    
  } catch (error) {
    yield put(getAdmissionConditionsFail(error));
  }


}



function* onAddNewAdmissionCondition({ payload, admissionCondition }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_AdmissionCondition";

  try {
    const response = yield call(addNewAdmissionCondition, payload);
    yield put(addAdmissionConditionSuccess(response[0]));
  } catch (error) {
    yield put(addAdmissionConditionFail(error));
  }
}

function* onUpdateAdmissionCondition({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_AdmissionCondition";

  try {
    const respupdate = yield call(updateAdmissionCondition, payload);
    yield put(updateAdmissionConditionSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateAdmissionConditionFail(error));
  }
}

function* onDeleteAdmissionCondition({ payload, admissionCondition }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_AdmissionCondition";

  try {
    const respdelete = yield call(deleteAdmissionCondition, payload);
    yield put(deleteAdmissionConditionSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteAdmissionConditionFail(error));
  }

  
}

function* onGetAdmissionConditionDeletedValue() {
  try {
    const response = yield call(getAdmissionConditionDeletedValue)
    yield put(getAdmissionConditionDeletedValueSuccess(response))
  } catch (error) {
    yield put(getAdmissionConditionDeletedValueFail(error))
  }
  
}


function* onCopyAdmissionCond ({ payload }) {

  payload["source"] = "db";
  payload["procedure"] = "copyAdmissionCondition";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  try {
    const response = yield call(copyAdmissionCond, payload);
    yield put(copyAdmissionCondSuccess(response));
  } catch (error) {
    yield put(copyAdmissionCondFail(error));
  }
}


function* admissionConditionsSaga() {
    yield takeEvery(GET_ADMISSION_SETTING, fetchAdmissionSetting);
    yield takeEvery(GET_ADMISSION_CONDITIONS, fetchAdmissionConditions);
    yield takeEvery(ADD_NEW_ADMISSION_CONDITION, onAddNewAdmissionCondition);
    yield takeEvery(UPDATE_ADMISSION_CONDITION, onUpdateAdmissionCondition);
    yield takeEvery(DELETE_ADMISSION_CONDITION, onDeleteAdmissionCondition);
    yield takeEvery(GET_ADMISSION_CONDITION_DELETED_VALUE, onGetAdmissionConditionDeletedValue);
    yield takeEvery(COPY_ADMISSION_COND, onCopyAdmissionCond);
  }

export default admissionConditionsSaga;
