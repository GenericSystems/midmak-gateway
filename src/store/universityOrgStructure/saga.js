import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
 GET_UNIVERSITY_ORG_STRUCTURES,
 UPDATE_UNIVERSITY_ORG_STRUCTURE,
 ADD_NEW_UNIVERSITY_ORG_STRUCTURE,
 DELETE_UNIVERSITY_ORG_STRUCTURE,
 GET_UNIVERSITY_ORG_STRUCTURE_DELETED_VALUE
} from "./actionTypes";

import{
  getUniversityInfoSuccess,
  getUniversityInfoFail
}from "../universitydef/actions";

import {
  getUniversityOrgStructureSuccess,
  getUniversityOrgStructureFail,
  addNewUniversityOrgStructureSuccess,
  addNewUniversityOrgStructureFail,
  updateUniversityOrgStructureSuccess,
  updateUniversityOrgStructureFail,
  deleteUniversityOrgStructureSuccess,
  deleteUniversityOrgStructureFail,
  getUniversityOrgStructureDeletedValueSuccess,
  getUniversityOrgStructureDeletedValueFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getUniversityOrgStructure ,
  addNewUniversityOrgStructure,
  deleteUniversityOrgStructure ,
  updateUniversityOrgStructure ,
  getUniversityInfo,
  getUniversityOrgStructureDeletedValue
} from "../../helpers/fakebackend_helper";


function* fetchUniversityOrgStructure() {

  const get_universityOrgStructure_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_universityOrgStructure",

  };

  try {
    const response = yield call(getUniversityOrgStructure, get_universityOrgStructure_req);
    response.map(resp => {
      resp["departments"] = JSON.parse(resp["departments"])
    })
    yield put(getUniversityOrgStructureSuccess(response));
  } catch (error) {
    yield put(getUniversityOrgStructureFail(error));
  }

  const get_universityName = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_UniversityInfo",
    fields:"Id,universityName",
  };

  try {
    const response = yield call(getUniversityInfo, get_universityName);
    yield put(getUniversityInfoSuccess(response[0]));
  } catch (error) {
    yield put(getUniversityInfoFail(error));
  }
 
}

function* onAddUniversityOrgStructure({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["queryname"] ="_universityOrgStructure";

 try {
    const response = yield call(addNewUniversityOrgStructure, payload);
 
    yield put(addNewUniversityOrgStructureSuccess(response));
    yield (fetchUniversityOrgStructure())
  } catch (error) {
    yield put(addNewUniversityOrgStructureFail(error));
  }

  
}

function* onUpdateUniversityOrgStructure({ payload }) {
  payload["source"] = 'db';
  payload["procedure"] = 'SisApp_updateData';
  payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
  
  try {
      const respupdate = yield call(updateUniversityOrgStructure, payload)
      yield put(updateUniversityOrgStructureSuccess(respupdate[0]))
      yield (fetchUniversityOrgStructure())
  } catch (error) {
  yield put(updateUniversityOrgStructureFail(error))
  }
  }


  function* onDeleteUniversityOrgStructure({ payload, UniversityOrgStructure }) {
    payload["source"] = 'db';
    payload["procedure"] = 'SisApp_removeData';
    payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
        
    try {
      const respdelete = yield call(deleteUniversityOrgStructure, payload)
      yield put(deleteUniversityOrgStructureSuccess(respdelete[0]))
      yield (fetchUniversityOrgStructure())
    } catch (error) {
    yield put(deleteUniversityOrgStructureFail(error))
    }
    }

    function* onGetUniversityOrgStructureDeletedValue() {
      try {
        const response = yield call(getUniversityOrgStructureDeletedValue)
        yield put(getUniversityOrgStructureDeletedValueSuccess(response))
      } catch (error) {
        yield put(getUniversityOrgStructureDeletedValueFail(error))
      }
      
    }


function* universityOrgStructure() {
  yield takeEvery(GET_UNIVERSITY_ORG_STRUCTURES, fetchUniversityOrgStructure);
  yield takeEvery(ADD_NEW_UNIVERSITY_ORG_STRUCTURE, onAddUniversityOrgStructure);
  yield takeEvery(UPDATE_UNIVERSITY_ORG_STRUCTURE, onUpdateUniversityOrgStructure);
  yield takeEvery(DELETE_UNIVERSITY_ORG_STRUCTURE, onDeleteUniversityOrgStructure);
  yield takeEvery(GET_UNIVERSITY_ORG_STRUCTURE_DELETED_VALUE, onGetUniversityOrgStructureDeletedValue);

}

export default universityOrgStructure;
