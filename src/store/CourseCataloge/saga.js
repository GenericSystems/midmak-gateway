import { call, put, takeEvery } from "redux-saga/effects";

// Action Types
import {
  GET_COURSES_CATALOGS,
  ADD_NEW_COURSES_CATALOGS,
  UPDATE_COURSES_CATALOGS,
  DELETE_COURSES_CATALOGS,
  GET_COURSES_CATALOGS_DELETED_VALUE,
  GET_COURSES_CATALOGS_DATALIST,
  GET_COURSE_CATALOGE_PREREQUISITES,
  GET_COURSE_CATALOGE_PREREQUISITES_DELETED_VALUE,
  ADD_NEW_COURSE_CATALOGE_PREREQUISITES,
  UPDATE_COURSE_CATALOGE_PREREQUISITES,
  DELETE_COURSE_CATALOGE_PREREQUISITES,
} from "./actionTypes";

// Actions
import {
  getCoursesCatalogsSuccess,
  getCoursesCatalogsFail,
  addCoursesCatalogSuccess,
  addCoursesCatalogFail,
  updateCoursesCatalogSuccess,
  updateCoursesCatalogFail,
  deleteCoursesCatalogSuccess,
  deleteCoursesCatalogFail,
  getCoursesCatalogDeletedValueSuccess,
  getCoursesCatalogDeletedValueFail,
  getCoursesCatalogsDatalistFail,
  getCoursesCatalogsDatalistSuccess,
  getCourseCatalogePrerequisitesSuccess,
  getCourseCatalogePrerequisitesFail,
  addCourseCatalogePrerequisiteSuccess,
  addCourseCatalogePrerequisiteFail,
  updateCourseCatalogePrerequisiteSuccess,
  updateCourseCatalogePrerequisiteFail,
  deleteCourseCatalogePrerequisiteSuccess,
  deleteCourseCatalogePrerequisiteFail,
  getCourseCatalogePrerequisitesDeletedValueSuccess,
  getCourseCatalogePrerequisitesDeletedValueFail,
} from "./actions";

import {
  getCoursesCatalogs,
  addNewCoursesCatalog,
  updateCoursesCatalog,
  deleteCoursesCatalog,
  getCoursesCatalogsDeletedValue,
  getSectors,
  getQualificationsTracks,
  getTrainingFormats,
  getCourseTypes,
  getCertificateTypes,
  getPrereqs,
  getCoursesCatalogDatalist,
  getCourseCatalogePrerequisites,
  addNewCourseCatalogePrerequisite,
  updateCourseCatalogePrerequisite,
  deleteCourseCatalogePrerequisite,
  getCourseCatalogePrerequisitesDeletedValue,
} from "../../helpers/fakebackend_helper";

import { getSectorsSuccess, getSectorsFail } from "store/sectors/actions";
import {
  getQualificationsTracksSuccess,
  getQualificationsTracksFail,
} from "store/qualification-tracks/actions";
import {
  getTrainingFormatsSuccess,
  getTrainingFormatsFail,
} from "store/trainingFormat/actions";

import {
  getCourseTypesSuccess,
  getCourseTypesFail,
} from "store/coursetypes/actions";

import {
  getPrereqsSuccess,
  getPrereqsFail,
} from "store/prereq-conditions/actions";

import {
  getCertificateTypesSuccess,
  getCertificateTypesFail,
} from "store/certificateTypes/actions";
import { getRanks } from "store/actions";
import { GET_SECTORS } from "helpers/url_helper";

function* fetchCoursesCatalogs(selectedpayload) {
  let lang = selectedpayload.payload;

  console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", lang);

  const titleField = lang === "en" ? "enTitle" : "arTitle";

  // sectors
  const get_sectors_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Sector",
    fields: `Id,${titleField},code`,
  };

  try {
    const response = yield call(getSectors, get_sectors_req);

    yield put(getSectorsSuccess(response));
  } catch (error) {
    yield put(getSectorsFail(error));
  }

  //qualificationTracks
  const get_quallificationTrack_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_QualificationTracks",
    fields: `Id,${titleField}`,
  };

  try {
    const response = yield call(
      getQualificationsTracks,
      get_quallificationTrack_req
    );
    yield put(getQualificationsTracksSuccess(response));
  } catch (error) {
    yield put(getQualificationsTracksFail(error));
  }

  //trainingFormats

  const get_traningFormat_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_TrainingFormats",
    fields: `Id,${titleField}`,
  };
  try {
    const response = yield call(getTrainingFormats, get_traningFormat_req);
    yield put(getTrainingFormatsSuccess(response));
  } catch (error) {
    yield put(getTrainingFormatsFail(error));
  }

  //courseTypes

  const get_courseType_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_CourseTypes",
    fields: `Id,${titleField}`,
  };
  try {
    const response = yield call(getCourseTypes, get_courseType_req);
    yield put(getCourseTypesSuccess(response));
  } catch (error) {
    yield put(getCourseTypesFail(error));
  }

  //CertificateTypes || training program

  const get_certificateType_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_CertificateType",
    fields: `Id,${titleField}`,
  };
  try {
    const response = yield call(getCertificateTypes, get_certificateType_req);
    yield put(getCertificateTypesSuccess(response));
  } catch (error) {
    yield put(getCertificateTypesFail(error));
  }

  //prereqqqqq constions

  const get_prereqs_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_PrerequisitesConditions",
    fields: `Id,${titleField}`,
  };
  try {
    const response = yield call(getPrereqs, get_prereqs_req);
    yield put(getPrereqsSuccess(response));
  } catch (error) {
    yield put(getPrereqsFail(error));
  }

  const payload = {};
  payload["source"] = "db";
  payload["procedure"] = "SisApp_getData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "_Common_CoursesCatalog";
  try {
    const response = yield call(getCoursesCatalogs, payload);
    response.map(resp => {
      resp["CourseSectors"] = JSON.parse(resp["CourseSectors"]);
    });

    console.log("responseresponseresponse", response);
    yield put(getCoursesCatalogsSuccess(response));
  } catch (error) {
    yield put(getCoursesCatalogsFail(error));
  }
}

function* onAddNewCoursesCatalog({ payload }) {
  try {
    payload["source"] = "db";
    payload["procedure"] = "SisApp_addData";
    payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
    payload["tablename"] = "Common_CoursesCatalog";
    payload["queryname"] = "_Common_CoursesCatalog";

    const response = yield call(addNewCoursesCatalog, payload);
    console.log("ADDDDDDDDDDDDDD send to db", payload);

    yield put(addCoursesCatalogSuccess(response[0]));
  } catch (error) {
    yield put(addCoursesCatalogFail(error));
  }
}

function* onUpdateCoursesCatalog({ payload }) {
  try {
    payload["source"] = "db";
    payload["procedure"] = "SisApp_updateData";
    payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
    payload["tablename"] = "Common_CoursesCatalog";
    payload["queryname"] = "_Common_CoursesCatalog";

    const response = yield call(updateCoursesCatalog, payload);
    console.log("updatePayloadddddddddd", payload);
    console.log("updateResponseeeeeee", response);


    yield put(updateCoursesCatalogSuccess(response[0]));
  } catch (error) {
    yield put(updateCoursesCatalogFail(error));
  }
}

function* onDeleteCoursesCatalog({ payload }) {
  try {
    payload["source"] = "db";
    payload["procedure"] = "SisApp_removeData";
    payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
    payload["tablename"] = "Common_CoursesCatalog";
    payload["queryname"] = "_Common_CoursesCatalog";

    const response = yield call(deleteCoursesCatalog, payload);
    console.log("DELETEPAYLOADDDDDD", payload);
    yield put(deleteCoursesCatalogSuccess(response[0]));
  } catch (error) {
    yield put(deleteCoursesCatalogFail(error));
  }
}

function* onGetCoursesCatalogDeletedValue() {
  try {
    const response = yield call(getCoursesCatalogsDeletedValue);
    yield put(getCoursesCatalogDeletedValueSuccess(response));
  } catch (error) {
    yield put(getCoursesCatalogDeletedValueFail(error));
  }
}
function* fetchCoursesCatalogsDatalist() {
  let lang = localStorage.getItem("I18N_LANGUAGE");

  const titleField = lang === "en" ? "enTitle" : "arTitle";
  const requestPayload = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_CoursesCatalog",
    fields: `Id,${titleField}`,
  };

  try {
    const response = yield call(getCoursesCatalogDatalist, requestPayload);
    yield put(getCoursesCatalogsDatalistSuccess(response));
  } catch (error) {
    yield put(getCoursesCatalogsDatalistFail(error));
  }
}

function* fetchCoursesCatalogsPreRequisits(obj) {
  let courseId = obj.payload;
  //console.log('objaaaaaaaaaaaaaaaaaaaaaaaaaaaa', courseId)
  const payload = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_CoursePrerequisites",
    filter: `courseId = ${courseId}`,
  };

  try {
    const response = yield call(getCourseCatalogePrerequisites, payload);
    yield put(getCourseCatalogePrerequisitesSuccess(response));
  } catch (error) {
    yield put(getCourseCatalogePrerequisitesFail(error));
  }
}

function* onAddNewCourseCatalogePrerequisite({ payload }) {
  try {
    payload["source"] = "db";
    payload["procedure"] = "SisApp_addData";
    payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
    payload["tablename"] = "Common_CoursePrerequisites";

    const response = yield call(addNewCourseCatalogePrerequisite, payload);
    yield put(addCourseCatalogePrerequisiteSuccess(response[0]));
  } catch (error) {
    yield put(addCourseCatalogePrerequisiteFail(error));
  }
}

function* onUpdateCourseCatalogePrerequisite({ payload }) {
  try {
    payload["source"] = "db";
    payload["procedure"] = "SisApp_updateData";
    payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
    payload["tablename"] = "Common_CoursePrerequisites";

    const response = yield call(updateCourseCatalogePrerequisite, payload);
    yield put(updateCourseCatalogePrerequisiteSuccess(response[0]));
  } catch (error) {
    yield put(updateCourseCatalogePrerequisiteFail(error));
  }
}

function* onDeleteCourseCatalogePrerequisite({ payload }) {
  try {
    payload["source"] = "db";
    payload["procedure"] = "SisApp_removeData";
    payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
    payload["tablename"] = "Common_CoursePrerequisites";

    const response = yield call(deleteCourseCatalogePrerequisite, payload);
    yield put(deleteCourseCatalogePrerequisiteSuccess(response[0]));
  } catch (error) {
    yield put(deleteCourseCatalogePrerequisiteFail(error));
  }
}

function* onGetCourseCatalogePrerequisitesDeletedValue() {
  try {
    const response = yield call(getCourseCatalogePrerequisitesDeletedValue);
    yield put(getCourseCatalogePrerequisitesDeletedValueSuccess(response));
  } catch (error) {
    yield put(getCourseCatalogePrerequisitesDeletedValueFail(error));
  }
}

function* coursesCatalogsSaga() {
  yield takeEvery(GET_COURSES_CATALOGS, fetchCoursesCatalogs);
  yield takeEvery(ADD_NEW_COURSES_CATALOGS, onAddNewCoursesCatalog);
  yield takeEvery(UPDATE_COURSES_CATALOGS, onUpdateCoursesCatalog);
  yield takeEvery(DELETE_COURSES_CATALOGS, onDeleteCoursesCatalog);
  yield takeEvery(
    GET_COURSES_CATALOGS_DELETED_VALUE,
    onGetCoursesCatalogDeletedValue
  );
  yield takeEvery(GET_COURSES_CATALOGS_DATALIST, fetchCoursesCatalogsDatalist);

  //preeereqqq
  yield takeEvery(
    GET_COURSE_CATALOGE_PREREQUISITES,
    fetchCoursesCatalogsPreRequisits
  );
  yield takeEvery(
    ADD_NEW_COURSE_CATALOGE_PREREQUISITES,
    onAddNewCourseCatalogePrerequisite
  );
  yield takeEvery(
    UPDATE_COURSE_CATALOGE_PREREQUISITES,
    onUpdateCourseCatalogePrerequisite
  );
  yield takeEvery(
    DELETE_COURSE_CATALOGE_PREREQUISITES,
    onDeleteCourseCatalogePrerequisite
  );
  yield takeEvery(
    GET_COURSE_CATALOGE_PREREQUISITES_DELETED_VALUE,
    onGetCourseCatalogePrerequisitesDeletedValue
  );
}

export default coursesCatalogsSaga;
