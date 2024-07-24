import { call, put, takeEvery } from "redux-saga/effects";


import {
  getDocumentsSuccess,
  getDocumentsFail,
} from "../documents-types/actions";

import {
  getCurrentSemesterSuccess,
  getCurrentSemesterFail,
} from "../semesters/actions";

import {
  getYearsSuccess,
  getYearsFail,
} from "../years/actions";

import {
getCertificateLevelsSuccess,
getCertificateLevelsFail,
} from "../certificatelevels/actions";

import {
  GET_REG_REQ_DOCUMENTS,
  GET_REG_REQ_DOCUMENT_DELETED_VALUE,
  ADD_NEW_REG_REQ_DOCUMENT,
  DELETE_REG_REQ_DOCUMENT,
  UPDATE_REG_REQ_DOCUMENT,
  COPY_REG_REQ_DOC,
  GET_REG_REQ_DOCS_COND
} from "./actionTypes";

import {
  getRegReqDocumentsSuccess,
  getRegReqDocumentsFail,
  getRegReqDocumentDeletedValueSuccess,
  getRegReqDocumentDeletedValueFail,
  addRegReqDocumentFail,
  addRegReqDocumentSuccess,
  updateRegReqDocumentSuccess,
  updateRegReqDocumentFail,
  deleteRegReqDocumentSuccess,
  deleteRegReqDocumentFail,
  copyRegReqDocSuccess,
  copyRegReqDocFail,
} from "./actions";

// Include Both Helper File with needed methods
import {
  getRegReqDocuments,
  getRegReqDocumentDeletedValue,
  addNewRegReqDocument,
  updateRegReqDocument,
  deleteRegReqDocument,
  getDocuments,
  getCurrentSemester,
  copyRegReqDoc,
  getCertificates,
  getCertificateLevels,
  getYears,


} from "../../helpers/fakebackend_helper";



function* fetchRegReqDocuments(obj) {
  // get Documents Types
  const get_settings_req_doctype = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_RegDocType",
    fields: "Id,arDocument",

  };
  try {
    const response_doctype = yield call(getDocuments, get_settings_req_doctype);
    yield put(getDocumentsSuccess(response_doctype));
  } catch (error) {
    yield put(getDocumentsFail(error));
  }

  let regReqDoc = obj.payload;
  const get_settings_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_RequiredRegistrationDocuments",
    filter: ` yearId = ${regReqDoc.yearId} and certificateLevelId = ${regReqDoc.certificateLevelId} `,
  };
  try {
    const response = yield call(getRegReqDocuments, get_settings_req);
    yield put(getRegReqDocumentsSuccess(response));
  } catch (error) {
    yield put(getRegReqDocumentsFail(error));
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

   //get certificateLevel
   const get_certificateLevel_opt = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_certificateLevel",
    filter: "checkLevel = 1"
  };
  try {
    const response = yield call(getCertificateLevels, get_certificateLevel_opt);
    yield put(getCertificateLevelsSuccess(response));
  } catch (error) {
    yield put(getCertificateLevelsFail(error));
  }

}

function* onGetRegReqDocumentDeletedValue() {
  try {
    const response = yield call(getRegReqDocumentDeletedValue);
    yield put(getRegReqDocumentDeletedValueSuccess(response));
  } catch (error) {
    yield put(getRegReqDocumentDeletedValueFail(error));
  }
}

function* onAddNewRegReqDocument({ payload, regReqDocument }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_RequiredRegistrationDocuments";
  try {
    const response = yield call(addNewRegReqDocument, payload);
    yield put(addRegReqDocumentSuccess(response[0]));
  } catch (error) {
    yield put(addRegReqDocumentFail(error));
  }
}

function* onUpdateRegReqDocument({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_RequiredRegistrationDocuments";
  try {
    const respupdate = yield call(updateRegReqDocument, payload);

    yield put(updateRegReqDocumentSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateRegReqDocumentFail(error));
  }
}

function* onDeleteRegReqDocument({ payload, regReqDocument }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_RequiredRegistrationDocuments";

  try {
    const respdelete = yield call(deleteRegReqDocument, payload);
    yield put(deleteRegReqDocumentSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteRegReqDocumentFail(error));
  }
}

function* onCopyRegReqDoc() {
  const copydistmeth = {
    source: "db",
    procedure: "copyRequiredRegistrationDocuments",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  };

  try {
    const response = yield call(copyRegReqDoc, copydistmeth);
    yield put(copyRegReqDocSuccess(response));
  } catch (error) {
    yield put(copyRegReqDocFail(error));
  }
}

function* regReqDocumentsSaga() {
  yield takeEvery(GET_REG_REQ_DOCUMENTS, fetchRegReqDocuments);
  yield takeEvery(GET_REG_REQ_DOCUMENT_DELETED_VALUE, onGetRegReqDocumentDeletedValue);
  yield takeEvery(ADD_NEW_REG_REQ_DOCUMENT, onAddNewRegReqDocument);
  yield takeEvery(UPDATE_REG_REQ_DOCUMENT, onUpdateRegReqDocument);
  yield takeEvery(DELETE_REG_REQ_DOCUMENT, onDeleteRegReqDocument);
  yield takeEvery(COPY_REG_REQ_DOC, onCopyRegReqDoc);
}

export default regReqDocumentsSaga;
