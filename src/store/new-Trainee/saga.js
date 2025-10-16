import { call, put, takeEvery } from "redux-saga/effects";

// TempTrainee Redux States
import {
  GET_TEMP_TRAINEES,
  GET_TEMP_TRAINEE_DELETED_VALUE,
  ADD_NEW_TEMP_TRAINEE,
  DELETE_TEMP_TRAINEE,
  UPDATE_TEMP_TRAINEE,
  GET_REGISTER_CERTIFICATES,
  GET_TEMP_TRAINEE_DEFAULT_REGREQDOCS,
  ADD_NEW_PROFESSIONAL_EXPERIENCE,
  DELETE_PROFESSIONAL_EXPERIENCE,
  UPDATE_PROFESSIONAL_EXPERIENCE,
  ADD_REQUIRED_DOCS,
  GENERATE_TEMP_TRAINEE,
  GET_TEMP_TRAINEE_BY_ID,
  GENERATE_TRAINEE,
  GET_TRAINEE_BY_ID,
  UPLOAD_FILE,
} from "./actionTypes";

import {
  getTempTraineesSuccess,
  getTempTraineesFail,
  getTempTraineeDeletedValueSuccess,
  getTempTraineeDeletedValueFail,
  addTempTraineeSuccess,
  addTempTraineeFail,
  updateTempTraineeSuccess,
  updateTempTraineeFail,
  deleteTempTraineeSuccess,
  deleteTempTraineeFail,
  getTempTraineeDefaultRegReqDocsSuccess,
  getTempTraineeDefaultRegReqDocsFail,
  getRegisterCertificatesSuccess,
  getRegisterCertificatesFail,
  getSocialStatusSuccess,
  getSocialStatusFail,
  addProfessionalExperienceSuccess,
  addProfessionalExperienceFail,
  updateProfessionalExperienceSuccess,
  updateProfessionalExperienceFail,
  deleteProfessionalExperienceSuccess,
  deleteProfessionalExperienceFail,
  addRequiredDocsSuccess,
  addRequiredDocsFail,
  getTempTraineeByIdSuccess,
  getTempTraineeByIdFail,
  generateTempTraineeSuccess,
  generateTempTraineeFail,
  getTempTraineeStatusSuccess,
  getTempTraineeStatusFail,
  uploadFileSuccess,
  uploadFileFail,
} from "./actions";

// Include helper functions
import {
  getTempTrainees,
  getTempTraineeDeletedValue,
  addNewTempTrainee,
  updateTempTrainee,
  deleteTempTrainee,
  getTempTraineeDefaultRegReqDocs,
  getNationalities,
  getCities,
  getCountries,
  getGenders,
  getTempTraineeRegCertificate,
  getEstimates,
  getGovernorates,
  getFaculties,
  getDiplomaLevels,
  getHighStudyTypes,
  getSocialStatus,
  addNewProfessionalExperience,
  updateProfessionalExperience,
  deleteProfessionalExperience,
  addRequiredDocs,
  getYears,
  uploadFileToStorage,
  getTempTraineeById,
  generateTempTrainee,
  getTempTraineeStatus,
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
import { uploadFile } from "helpers/api_helper";

function* fetchTempTrainees(selectedpayload) {
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
    console.log("1", response);
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
    console.log("2", response);

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
    console.log("3", response);
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
    console.log("4", response);
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
    console.log("5", response);

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
    console.log("7", response);

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
    console.log("8", response);

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

  const traineeStatus = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Status",
    fields: `Id,${titleField}`,
  };
  try {
    const response = yield call(getTempTraineeStatus, traineeStatus);
    console.log("Settings_Status", response);
    yield put(getTempTraineeStatusSuccess(response));
  } catch (error) {
    yield put(getTempTraineeStatusFail(error));
  }

  //get trainees_req
  const get_trainees_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_TempTrainee",
    filter: "statusId <> 2",
  };

  try {
    const response = yield call(getTempTrainees, get_trainees_req);
    response.map(resp => {
      resp["ProfessionalExperiences"] = JSON.parse(
        resp["ProfessionalExperiences"]
      );
    });
    response.map(resp => {
      resp["RegReqDocTempTrainee"] = JSON.parse(resp["RegReqDocTempTrainee"]);
    });
    console.log("experresponse", response);
    yield put(getTempTraineesSuccess(response));
  } catch (error) {
    yield put(getTempTraineesFail(error));
  }
}

function* onAddNewTempTrainee({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TempTrainee";
  payload["queryname"] = "_Common_TempTrainee";

  try {
    const response = yield call(addNewTempTrainee, payload);
    response.map(resp => {
      resp["RegReqDocTempTrainee"] = JSON.parse(resp["RegReqDocTempTrainee"]);
    });
    yield put(addTempTraineeSuccess(response[0]));
  } catch (error) {
    yield put(addTempTraineeFail(error));
  }
}

function* onUpdateTempTrainee({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TempTrainee";
  payload["queryname"] = "_Common_TempTrainee";

  try {
    const response = yield call(updateTempTrainee, payload);
    response.map(resp => {
      resp["RegReqDocTempTrainee"] = JSON.parse(resp["RegReqDocTempTrainee"]);
    });
    yield put(updateTempTraineeSuccess(response[0]));
  } catch (error) {
    yield put(updateTempTraineeFail(error));
  }
}

function* onDeleteTempTrainee({ payload }) {
  console.log("payloadDeleeete", payload);
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TempTrainee";
  payload["queryname"] = "_Common_TempTrainee";
  try {
    const response = yield call(deleteTempTrainee, payload);
    yield put(deleteTempTraineeSuccess(response[0]));
  } catch (error) {
    yield put(deleteTempTraineeFail(error));
  }
}

function* onGetTempTraineeDeletedValue() {
  try {
    const response = yield call(getTempTraineeDeletedValue);
    yield put(getTempTraineeDeletedValueSuccess(response));
  } catch (error) {
    yield put(getTempTraineeDeletedValueFail(error));
  }
}

function* fetchTempTraineesRegisterCertificates() {
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

function* fetchTempTraineesReqDocs(obj) {
  const { certificateLevelId } = obj.payload;
  console.log("{ certificateLevelId } ", obj.payload);
  const get_tempTraineeReqDocs = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_RegReqDocs",
    filter: `certificateLevelId = ${certificateLevelId}`,
  };

  try {
    const response = yield call(
      getTempTraineeDefaultRegReqDocs,
      get_tempTraineeReqDocs
    );
    console.log("rereresponse", response);
    yield put(getTempTraineeDefaultRegReqDocsSuccess(response));
  } catch (error) {
    yield put(getTempTraineeDefaultRegReqDocsFail(error));
  }
}

function* onAddNewProfessionalExperience({ payload }) {
  console.log("payloadADDDDDDDDDDDDDDDDDDDDDDD", payload);
  payload["source"] = "db";

  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";

  try {
    const response = yield call(addNewProfessionalExperience, payload);

    response.map(resp => {
      resp["ProfessionalExperiences"] = JSON.parse(
        resp["ProfessionalExperiences"]
      );
    });
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
  payload["tablename"] = "Common_TempTraineesProfessionalExperiences";

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
  payload["tablename"] = "Common_TempTraineesProfessionalExperiences";

  try {
    const response = yield call(deleteProfessionalExperience, payload);
    yield put(deleteProfessionalExperienceSuccess(response[0]));
  } catch (error) {
    yield put(deleteProfessionalExperienceFail(error));
  }
}

function* onAddRequiredDocs({ payload }) {
  payload["source"] = "db";
  // payload["procedure"] = "Admission_AddDocsTempTrainee";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  // payload["tablename"] = "Common_RegReqDocTempTrainee";

  try {
    const response = yield call(addRequiredDocs, payload);
    response.map(resp => {
      resp["RegReqDocTempTrainee"] = JSON.parse(resp["RegReqDocTempTrainee"]);
    });
    console.log("response", response);
    yield put(addRequiredDocsSuccess(response[0]));
  } catch (error) {
    yield put(addRequiredDocsFail(error));
  }
}

// GEN
function* onUploadFile({ payload }) {
  console.log("uploading file", payload);
  payload["source"] = "db";
  payload["procedure"] = "SisApp_UpdateTraineeInfo";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_ProfessionalExperiences";
  payload["queryname"] = "Common_ProfessionalExperiences";

  try {
    const response = yield call(uploadFile, payload);
    console.log("response", response);
    yield put(uploadFileSuccess(response[0]));
  } catch (error) {
    yield put(uploadFileFail(error));
  }
}

// function* fetchTempTraineeById(tempTempTrainee) {
//   // console.log("tempTempTraineetempTempTraineetempTempTrainee", tempTempTrainee);
//   // const tempTempTraineeId = tempTempTrainee.payload;
//   const get_TEMP_TRAINEE_byId = {
//     source: "db",
//     procedure: "SisApp_addData",
//     apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
//     tablename: "Common_TempTempTraineesProfessionalExperiences",
//     // filter: `Id = ${tempTempTraineeId}`,
//   };
//   try {
//     const response = yield call(getTempTraineeById, get_TEMP_TRAINEE_byId);
//     // console.log("rrrrrrrrrrrrrrrrrrrrrrrrrr", response);
// response.map(resp => {
//   resp["ProfessionalExperiences"] = JSON.parse(
//     resp["ProfessionalExperiences"]
//   );
// });
//     // response[0]["flag"] = 1;
//     console.log("rrrrrrrrrrrrrrrrrrrrrrrrrr", response);
//     yield put(getTempTraineeByIdSuccess(response[0]));
//   } catch (error) {
//     yield put(getTempTraineeByIdFail(error));
//   }
// }

function* onGenerateTempTrainee({ payload }) {
  const generate_trainee = {
    source: "db",
    operation: "execProc",
    procedure: "Admission_GenerateTraineeID",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    parameters: `Id= ${payload}`,
  };
  try {
    const response = yield call(generateTempTrainee, generate_trainee);

    yield put(generateTempTraineeSuccess(response[0]));
  } catch (error) {
    yield put(generateTempTraineeFail(error));
  }
}

function* tempTraineesSaga() {
  yield takeEvery(GET_TEMP_TRAINEES, fetchTempTrainees);
  yield takeEvery(
    GET_REGISTER_CERTIFICATES,
    fetchTempTraineesRegisterCertificates
  );
  yield takeEvery(
    GET_TEMP_TRAINEE_DEFAULT_REGREQDOCS,
    fetchTempTraineesReqDocs
  );
  yield takeEvery(ADD_NEW_TEMP_TRAINEE, onAddNewTempTrainee);
  yield takeEvery(UPDATE_TEMP_TRAINEE, onUpdateTempTrainee);
  yield takeEvery(DELETE_TEMP_TRAINEE, onDeleteTempTrainee);
  yield takeEvery(GET_TEMP_TRAINEE_DELETED_VALUE, onGetTempTraineeDeletedValue);
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
  yield takeEvery(GENERATE_TEMP_TRAINEE, onGenerateTempTrainee);
  // yield takeEvery(GET_TEMP_TRAINEE_BY_ID, fetchTempTraineeById);
  // yield takeEvery(GENERATE_TRAINEE, onGenerateTrainee);
  // yield takeEvery(GET_TRAINEE_BY_ID, fetchTraineeById);
  yield takeEvery(UPLOAD_FILE, onUploadFile);
}

export default tempTraineesSaga;
