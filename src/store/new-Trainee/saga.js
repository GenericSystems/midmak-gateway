import { call, put, takeEvery } from "redux-saga/effects";

// Trainee Redux States
import {
  GET_TRAINEES,
  GET_TRAINEE_DELETED_VALUE,
  ADD_NEW_TRAINEE,
  DELETE_TRAINEE,
  UPDATE_TRAINEE,
  GET_REGISTER_CERTIFICATES,
  GET_TRAINEE_DEFAULT_REGREQDOCS,
  GET_SOCIAL_STATUS,
  ADD_NEW_PROFESSIONAL_EXPERIENCE,
  DELETE_PROFESSIONAL_EXPERIENCE,
  UPDATE_PROFESSIONAL_EXPERIENCE,
  ADD_REQUIRED_DOCS,
  UPDATE_REQUIRED_DOCS,
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
  getTraineeDefaultRegReqDocsSuccess,
  getTraineeDefaultRegReqDocsFail,
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
  updateRequiredDocsSuccess,
  updateRequiredDocsFail,
} from "./actions";

// Include helper functions
import {
  getTrainees,
  getTraineeDeletedValue,
  addNewTrainee,
  updateTrainee,
  deleteTrainee,
  getTraineeDefaultRegReqDocs,
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
  getSocialStatus,
  addNewProfessionalExperience,
  updateProfessionalExperience,
  deleteProfessionalExperience,
  addRequiredDocs,
  updateRequiredDocs,
} from "../../helpers/fakebackend_helper";

import {
  getNationalitiesSuccess,
  getNationalitiesFail,
} from "../nationality/actions";

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
    tablename: "AdmissionSettings_RegisterUnderCertificates",
    fields: `Id,${titleField}`,
    filter: `checkLevel = 1`,
  };

  try {
    const response = yield call(getDiplomaLevels, getDiploma_opt);
    yield put(getDiplomaLevelsSuccess(response));
  } catch (error) {
    yield put(getDiplomaLevelsFail(error));
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
    tablename: "Settings_Gender",
    fields: `Id,${titleField}`,
  };
  try {
    const response = yield call(getSocialStatus, get_SocialStatus);
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
    yield put(getHighStudyTypesSuccess(response));
  } catch (error) {
    yield put(getHighStudyTypesFail(error));
  }

  //get trainees_req
  const get_trainees_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_TempTrainee",
  };

  try {
    const response = yield call(getTrainees, get_trainees_req);
    yield put(getTraineesSuccess(response));
  } catch (error) {
    yield put(getTraineesFail(error));
  }
}

function* onAddNewTrainee({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TempTrainee";

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
  payload["tablename"] = "Common_TempTrainee";

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
  payload["tablename"] = "Common_TempTrainee";

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

function* fetchTraineesRegisterCertificates() {
  const get_TraineeReg_Certificate = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "AdmissionSettings_RegisterUnderCertificates",
  };

  try {
    const response = yield call(
      getTraineeRegCertificate,
      get_TraineeReg_Certificate
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
    const response = yield call(
      getTraineeDefaultRegReqDocs,
      get_TraineeReqDocs
    );
    console.log("rereresponse", response);
    yield put(getTraineeDefaultRegReqDocsSuccess(response));
  } catch (error) {
    yield put(getTraineeDefaultRegReqDocsFail(error));
  }
}

function* onAddNewProfessionalExperience({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_ProfessionalExperiences";

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
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_ProfessionalExperiences";

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
  payload["tablename"] = "Common_ProfessionalExperiences";

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

function* onUpdateRequiredDocs({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_RegReqDocTempTrainee";

  try {
    const response = yield call(updateProfessionalExperience, payload);
    yield put(updateProfessionalExperienceSuccess(response[0]));
  } catch (error) {
    yield put(updateProfessionalExperienceFail(error));
  }
}

// function* fetchTraineeById(tempTrainee) {
//   const get_student_byId = {
//     source: "db",
//     procedure: "SisApp_getData",
//     apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
//     tablename: "_TempTraineeDetails",
//     filter: `Id = ${tempTrainee.payload.Id}`,
//   };
//   try {
//     const response = yield call(getTraineeById, get_student_byId);
//     response.map(resp => {
//       resp["TempTraineeBrothers"] = JSON.parse(resp["TempTraineeBrothers"]);
//       resp["TempTraineeRelatives"] = JSON.parse(resp["TempTraineeRelatives"]);
//       resp["RegReqDocTempTrainee"] = JSON.parse(resp["RegReqDocTempTrainee"]);
//     });
//     yield put(getTraineeByIdSuccess(response[0]));
//   } catch (error) {
//     yield put(getTraineeByIdFail(error));
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
  yield takeEvery(GET_REGISTER_CERTIFICATES, fetchTraineesRegisterCertificates);
  yield takeEvery(GET_TRAINEE_DEFAULT_REGREQDOCS, fetchTraineesReqDocs);
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
  yield takeEvery(UPDATE_REQUIRED_DOCS, onUpdateRequiredDocs);
}

export default traineesSaga;
