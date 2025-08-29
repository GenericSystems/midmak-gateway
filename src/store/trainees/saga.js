import { call, put, takeEvery } from "redux-saga/effects";

// Trainee Redux States
import {
  GET_TRAINEES,
  GET_TRAINEE_DELETED_VALUE,
  ADD_NEW_TRAINEE,
  DELETE_TRAINEE,
  UPDATE_TRAINEE,
  GET_TRAINEE_DEFAULT_REGREQDOCS,
  GENERATE_TRAINEE,
  GET_TRAINEE_BY_ID,
} from "./actionTypes";

import {
  getTraineesSuccess,
  getTraineesFail,
  getTraineeDeletedValueSuccess,
  getTraineeDeletedValueFail,
  addTraineeSuccess,
  addTraineeFail,
  updateTraineeSuccess,
  updateTraineeFail,
  deleteTraineeSuccess,
  deleteTraineeFail,
  getTraineeByIdSuccess,
  getTraineeByIdFail,
  generateTraineeSuccess,
  generateTraineeFail,
} from "./actions";

// Include helper functions
import {
  getTrainees,
  getTraineeDeletedValue,
  addNewTrainee,
  updateTrainee,
  deleteTrainee,
  getTraineeRegReqDocs,
  getNationalities,
  getCities,
  getCountries,
  getGenders,
  getTraineeRegCertificate,
  getEstimates,
  getGovernorates,
  getFaculties,
  getDiplomaLevels,
  getHighStudyTypes,
  getYears,
  getTraineeById,
  generateTrainee,
  getSocialStatus,
  addNewProfessionalExperience,
  updateProfessionalExperience,
  deleteProfessionalExperience,
  addRequiredDocs,
  uploadFileToStorage,
} from "../../helpers/fakebackend_helper";

import {
  getNationalitiesSuccess,
  getNationalitiesFail,
} from "../nationality/actions";

import { getYearsSuccess, getYearsFail } from "../years/actions";

import { getCitiesSuccess, getCitiesFail } from "../cities/actions";

import { getCountriesSuccess, getCountriesFail } from "../country/actions";

import { getGendersSuccess, getGendersFail } from "../genders/actions";

import { getEstimatesFail, getEstimatesSuccess } from "../estimates/actions";

import {
  getGovernoratesSuccess,
  getGovernoratesFail,
} from "../governorate/actions";

import {
  getFacultiesSuccess,
  getFacultiesFail,
} from "../mob-app-faculty-accs/actions";

import {
  getDiplomaLevelsFail,
  getDiplomaLevelsSuccess,
} from "../diploma-level/actions";

import {
  getHighStudyTypesSuccess,
  getHighStudyTypesFail,
} from "../high-study-types/actions";

import {
  getSocialStatusSuccess,
  getSocialStatusFail,
  getRegisterCertificatesSuccess,
  getRegisterCertificatesFail,
  addProfessionalExperienceSuccess,
  addProfessionalExperienceFail,
  updateProfessionalExperienceSuccess,
  updateProfessionalExperienceFail,
  deleteProfessionalExperienceSuccess,
  deleteProfessionalExperienceFail,
  addRequiredDocsSuccess,
  addRequiredDocsFail,
  uploadFileSuccess,
  uploadFileFail,
} from "../new-Trainee/actions";
import {
  ADD_NEW_PROFESSIONAL_EXPERIENCE,
  DELETE_PROFESSIONAL_EXPERIENCE,
  UPDATE_PROFESSIONAL_EXPERIENCE,
  ADD_REQUIRED_DOCS,
} from "../new-Trainee/actionTypes";

function* fetchTrainees(selectedpayload) {
  let lang = selectedpayload.payload;

  const titleField = lang === "en" ? "enTitle" : "arTitle";

  const get_faculty_opt = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_Faculty",
    fields: `Id,${titleField}`,
  };
  try {
    const response = yield call(getFaculties, get_faculty_opt);
    yield put(getFacultiesSuccess(response));
  } catch (error) {
    yield put(getFacultiesFail(error));
  }

  const getDiploma_opt = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_DiplomaType",
    fields: `Id,${titleField}`,
  };

  try {
    const response = yield call(getDiplomaLevels, getDiploma_opt);
    yield put(getDiplomaLevelsSuccess(response));
  } catch (error) {
    yield put(getDiplomaLevelsFail(error));
  }

  //years
  const get_years_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Years",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getYears, get_years_req);
    console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy", response);
    yield put(getYearsSuccess(response));
  } catch (error) {
    yield put(getYearsFail(error));
  }

  //get nationality
  const get_nationality_opt = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "AdmissionSettings_Nationality",
    fields: `Id,${titleField}`,
  };
  try {
    const response = yield call(getNationalities, get_nationality_opt);
    console.log("responsenationality", response);
    yield put(getNationalitiesSuccess(response));
  } catch (error) {
    yield put(getNationalitiesFail(error));
  }

  //get country
  const get_country_opt = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Country",
    fields: `Id,${titleField}`,
  };
  try {
    const response = yield call(getCountries, get_country_opt);
    console.log("response country", response);
    yield put(getCountriesSuccess(response));
  } catch (error) {
    yield put(getCountriesFail(error));
  }

  //get city
  const get_city_opt = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_City",
    fields: `Id,${titleField}`,
  };
  try {
    const response = yield call(getCities, get_city_opt);
    yield put(getCitiesSuccess(response));
  } catch (error) {
    yield put(getCitiesFail(error));
  }

  //get gender
  const get_gender = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Gender",
    fields: `Id,${titleField}`,
  };
  try {
    const response = yield call(getGenders, get_gender);
    yield put(getGendersSuccess(response));
  } catch (error) {
    yield put(getGendersFail(error));
  }

  //get SocialStatus
  const get_SocialStatus = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_SocialStatus",
    fields: `Id,${titleField}`,
  };
  try {
    const response = yield call(getSocialStatus, get_SocialStatus);
    console.log("ewsssssssssssssssss", response);
    yield put(getSocialStatusSuccess(response));
  } catch (error) {
    yield put(getSocialStatusFail(error));
  }

  // get estimates
  const get_estimates_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Estimate",
    fields: `Id,${titleField}`,
  };
  try {
    const response = yield call(getEstimates, get_estimates_req);
    yield put(getEstimatesSuccess(response));
  } catch (error) {
    yield put(getEstimatesFail(error));
  }

  //get governorate
  const get_governorate_opt = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Governorate",
    fields: `Id,${titleField}`,
  };
  try {
    const response = yield call(getGovernorates, get_governorate_opt);

    console.log("responseresponseresponse", response);
    yield put(getGovernoratesSuccess(response));
  } catch (error) {
    yield put(getGovernoratesFail(error));
  }

  //get Settings_HighStudyType

  const requestPayload = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_HighStudyType",
    fields: `Id,${titleField}`,
  };
  try {
    const response = yield call(getHighStudyTypes, requestPayload);
    console.log("Settings_HighStudyType", response);
    yield put(getHighStudyTypesSuccess(response));
  } catch (error) {
    yield put(getHighStudyTypesFail(error));
  }

  //get trainees_req
  const get_trainees_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Trainees",
  };

  try {
    const response = yield call(getTrainees, get_trainees_req);
    response.map(resp => {
      resp["ProfessionalExperiences"] = JSON.parse(
        resp["ProfessionalExperiences"]
      );
    });
    response.map(resp => {
      resp["RegReqDocTempTrainee"] = JSON.parse(resp["RegReqDocTempTrainee"]);
    });
    console.log("experresponse", response);
    yield put(getTraineesSuccess(response));
  } catch (error) {
    yield put(getTraineesFail(error));
  }
}

function* onAddNewTrainee({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "_Common_Trainees";
  // payload["queryname"] = "_Common_Trainees";

  try {
    const response = yield call(addNewTrainee, payload);
    console.log("adddresssss123", response);
    yield put(addTraineeSuccess(response[0]));
  } catch (error) {
    yield put(addTraineeFail(error));
  }
}

function* onUpdateTrainee({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "_Common_Trainees";
  payload["queryname"] = "_Common_Trainees";

  try {
    const response = yield call(updateTrainee, payload);
    yield put(updateTraineeSuccess(response[0]));
  } catch (error) {
    yield put(updateTraineeFail(error));
  }
}

function* onDeleteTrainee({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "_Common_Trainees";
  try {
    const response = yield call(deleteTrainee, payload);
    yield put(deleteTraineeSuccess(response[0]));
  } catch (error) {
    yield put(deleteTraineeFail(error));
  }
}

function* onGetTraineeDeletedValue() {
  try {
    const response = yield call(getTraineeDeletedValue);
    yield put(getTraineeDeletedValueSuccess(response));
  } catch (error) {
    yield put(getTraineeDeletedValueFail(error));
  }
}

function* fetchTraineeById(tempTrainee) {
  // console.log("tempTraineetempTraineetempTrainee", tempTrainee);
  const tempTraineeId = tempTrainee.payload.Id;
  const get_trainee_byId = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Trainees",
    filter: `Id = ${tempTraineeId}`,
  };
  try {
    const response = yield call(getTraineeById, get_trainee_byId);
    console.log("rrrrrrrrrrrrrrrrrrrrrrrrrr", response);
    response.map(resp => {
      resp["ProfessionalExperiences"] = JSON.parse(
        resp["ProfessionalExperiences"]
      );
    });
    response.map(resp => {
      resp["RegReqDocTempTrainee"] = JSON.parse(resp["RegReqDocTempTrainee"]);
    });
    // response[0]["flag"] = 1;
    console.log("rrrrrrrrrrrrrrrrrrrrrrrrrr", response);
    yield put(getTraineeByIdSuccess(response[0]));
  } catch (error) {
    yield put(getTraineeByIdFail(error));
  }
}

function* fetchTraineesRegisterCertificates() {
  const get_Reg_Certificate = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "AdmissionSettings_RegisterUnderCertificates",
  };

  try {
    const response = yield call(
      getTempTraineeRegCertificate,
      get_Reg_Certificate
    );
    yield put(getRegisterCertificatesSuccess(response));
  } catch (error) {
    yield put(getRegisterCertificatesFail(error));
  }
}

function* fetchTraineesReqDocs(obj) {
  const { certificateLevelId } = obj.payload;
  console.log("{ certificateLevelId } ", obj.payload);
  const get_TraineeReqDocs = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_RegReqDocs",
    filter: `certificateLevelId = ${certificateLevelId}`,
  };

  try {
    const response = yield call(getTraineeRegReqDocs, get_TraineeReqDocs);
    console.log("rereresponse", response);
    yield put(getTraineeRegReqDocsSuccess(response));
  } catch (error) {
    yield put(getTraineeRegReqDocsFail(error));
  }
}

function* onAddNewProfessionalExperience({ payload }) {
  console.log("payloadADDDDDDDDDDDDDDDDDDDDDDD", payload);
  payload["source"] = "db";
  payload["procedure"] = "SisApp_UpdateTempTraineeInfo";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TraineesProfessionalExperiences";
  payload["queryname"] = "Common_TraineesProfessionalExperiences";

  try {
    const response = yield call(addNewProfessionalExperience, payload);
    console.log("response", response);
    yield put(addProfessionalExperienceSuccess(response[0]));
  } catch (error) {
    yield put(addProfessionalExperienceFail(error));
  }
}

function* onUpdateProfessionalExperience({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_UpdateTempTraineeInfo";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TraineesProfessionalExperiences";

  try {
    const response = yield call(updateProfessionalExperience, payload);
    yield put(updateProfessionalExperienceSuccess(response[0]));
  } catch (error) {
    yield put(updateProfessionalExperienceFail(error));
  }
}

function* onDeleteProfessionalExperience({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TraineesProfessionalExperiences";

  try {
    const response = yield call(deleteProfessionalExperience, payload);
    yield put(deleteProfessionalExperienceSuccess(response[0]));
  } catch (error) {
    yield put(deleteProfessionalExperienceFail(error));
  }
}

function* onAddRequiredDocs({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "Admission_AddDocsTempTrainee";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_RegReqDocTempTrainee";

  try {
    const response = yield call(addRequiredDocs, payload);
    console.log("response", response);
    yield put(addRequiredDocsSuccess(response[0]));
  } catch (error) {
    yield put(addRequiredDocsFail(error));
  }
}

// GEN
// function* onUploadFile({ payload }) {
//   console.log("uploading file", payload);
//   payload["source"] = "db";
//   payload["procedure"] = "SisApp_UpdateTraineeInfo";
//   payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
//   payload["tablename"] = "Common_ProfessionalExperiences";
//   payload["queryname"] = "Common_ProfessionalExperiences";

//   try {
//     const response = yield call(uploadFile, payload);
//     console.log("response", response);
//     yield put(uploadFileSuccess(response[0]));
//   } catch (error) {
//     yield put(uploadFileFail(error));
//   }
// }

// function* onGenerateTrainee({ payload }) {
//   const generate_student = {
//     source: "db",
//     operation: "execProc",
//     procedure: "Admission_GenerateSID",
//     apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
//     parameters: `Id= ${payload}`,
//   };
//   try {
//     const response = yield call(generateTrainee, generate_student);

//     yield put(generateTraineeSuccess(response[0]));
//   } catch (error) {
//     yield put(generateTraineeFail(error));
//   }
// }

function* traineesSaga() {
  yield takeEvery(GET_TRAINEES, fetchTrainees);
  yield takeEvery(ADD_NEW_TRAINEE, onAddNewTrainee);
  yield takeEvery(UPDATE_TRAINEE, onUpdateTrainee);
  yield takeEvery(DELETE_TRAINEE, onDeleteTrainee);
  yield takeEvery(GET_TRAINEE_DELETED_VALUE, onGetTraineeDeletedValue);
  yield takeEvery(
    ADD_NEW_PROFESSIONAL_EXPERIENCE,
    onAddNewProfessionalExperience
  );
  yield takeEvery(
    UPDATE_PROFESSIONAL_EXPERIENCE,
    onUpdateProfessionalExperience
  );
  yield takeEvery(
    DELETE_PROFESSIONAL_EXPERIENCE,
    onDeleteProfessionalExperience
  );
  yield takeEvery(ADD_REQUIRED_DOCS, onAddRequiredDocs);
  // yield takeEvery(GENERATE_TRAINEE, onGenerateTrainee);
  yield takeEvery(GET_TRAINEE_BY_ID, fetchTraineeById);
}

export default traineesSaga;
