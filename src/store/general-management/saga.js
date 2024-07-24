import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_GENERAL_MANAGEMENTS,
  GET_GENERAL_MANAGEMENT_PROFILE,
  ADD_NEW_GENERAL_MANAGEMENT,
  DELETE_GENERAL_MANAGEMENT,
  UPDATE_GENERAL_MANAGEMENT,
  GET_YEAR_SEM,
} from "./actionTypes";
import { getCurrenciesSuccess, getCurrenciesFail } from "../currencies/actions";
import {
  getGeneralManagementsSuccess,
  getGeneralManagementsFail,
  getGeneralManagementProfileSuccess,
  getGeneralManagementProfileFail,
  addGeneralManagementFail,
  addGeneralManagementSuccess,
  updateGeneralManagementSuccess,
  updateGeneralManagementFail,
  deleteGeneralManagementSuccess,
  deleteGeneralManagementFail,
  getYearSemestersSuccess,
  getYearSemestersFail,
} from "./actions";

// Include Both Helper File with needed methods
import {
  getGeneralManagements,
  getGeneralManagementProfile,
  addNewGeneralManagement,
  updateGeneralManagement,
  deleteGeneralManagement,
  getYearSemesters,
  getCurrencies,
} from "../../helpers/fakebackend_helper";

function* fetchYearsSemesters() {
  const get_settings_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "financeSetting_currencies",
    fields: "Id,curCode",
  };
  try {
    const response = yield call(getCurrencies, get_settings_req);
    yield put(getCurrenciesSuccess(response));
  } catch (error) {
    yield put(getCurrenciesFail(error));
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
}
function* fetchGeneralManagements() {
  const get_generalManagements_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_SisApp_Config",
  };
  try {
    const response = yield call(
      getGeneralManagements,
      get_generalManagements_req
    );
    yield put(getGeneralManagementsSuccess(response));
  } catch (error) {
    yield put(getGeneralManagementsFail(error));
  }
}

function* fetchGeneralManagementProfile() {
  try {
    const response = yield call(getGeneralManagementProfile);
    yield put(getGeneralManagementProfileSuccess(response));
  } catch (error) {
    yield put(getGeneralManagementProfileFail(error));
  }
}

function* onAddNewGeneralManagement({ payload, generalManagement }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "_YearsSemesters";

  try {
    const response = yield call(addNewGeneralManagement, payload);
    yield put(addGeneralManagementSuccess(response[0]));
  } catch (error) {
    yield put(addGeneralManagementFail(error));
  }
}

function* onUpdateGeneralManagement({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "SisApp_Config";
  payload["queryname"] = "_SisApp_Config";

  try {
    const respupdate = yield call(updateGeneralManagement, payload);
    yield put(updateGeneralManagementSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateGeneralManagementFail(error));
  }
}

function* onDeleteGeneralManagement({ payload, generalManagement }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "_YearsSemesters";

  try {
    const respdelete = yield call(deleteGeneralManagement, payload);
    yield put(deleteGeneralManagementSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteGeneralManagementFail(error));
  }
}

function* GeneralManagementsSaga() {
  yield takeEvery(GET_YEAR_SEM, fetchYearsSemesters);
  yield takeEvery(GET_GENERAL_MANAGEMENTS, fetchGeneralManagements);
  yield takeEvery(
    GET_GENERAL_MANAGEMENT_PROFILE,
    fetchGeneralManagementProfile
  );
  yield takeEvery(ADD_NEW_GENERAL_MANAGEMENT, onAddNewGeneralManagement);
  yield takeEvery(UPDATE_GENERAL_MANAGEMENT, onUpdateGeneralManagement);
  yield takeEvery(DELETE_GENERAL_MANAGEMENT, onDeleteGeneralManagement);
}

export default GeneralManagementsSaga;
