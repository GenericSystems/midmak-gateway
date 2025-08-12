import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_STUDENTS,
  ADD_NEW_STUDENT,
  DELETE_STUDENT,
  UPDATE_STUDENT,
  GET_STUDENT_BY_ID,
  GET_DEFAULT_REGREQDOCS,
  GENERATE_STUDENT,
  GET_STUDENT_DELETED_VALUE,
  GET_TEMP_RELATIVES,
  GET_TEMP_RELATIVE_DELETED_VALUE,
} from "./actionTypes";

// import {
//   getNationalitiesSuccess,
//   getNationalitiesFail,
// } from "../nationality/actions";

// import { getRelativesSuccess, getRelativesFail } from "../relatives/actions";

// import { getGrantsSuccess, getGrantsFail } from "../grants/actions";

// import {
//   getUniversityStudentsSuccess,
//   getUniversityStudentsFail,
// } from "../university-students/actions";

// import {
//   getFacultiesSuccess,
//   getFacultiesFail,
// } from "../mob-app-faculty-accs/actions";

// import { getCountriesSuccess, getCountriesFail } from "../country/actions";

// import {
//   getYearSemestersSuccess,
//   getYearSemestersFail,
// } from "../general-management/actions";

// import {
//   getCurrentSemesterSuccess,
//   getCurrentSemesterFail,
// } from "../semesters/actions";

// import { getCitiesSuccess, getCitiesFail } from "../cities/actions";

// import {
//   getCertificatesSuccess,
//   getCertificatesFail,
// } from "../certificates/actions";

// import {
//   getGovernoratesSuccess,
//   getGovernoratesFail,
// } from "../governorate/actions";

// import {
//   getDocumentsSuccess,
//   getDocumentsFail,
// } from "../documents-types/actions";

// import {
//   getRegReqDocumentsSuccess,
//   getRegReqDocumentsFail,
// } from "../reg-req-documents/actions";

// import { getGendersSuccess, getGendersFail } from "../genders/actions";

// import {
//   getCertificateLevelsSuccess,
//   getCertificateLevelsFail,
// } from "../certificatelevels/actions";

// import {
//   getAdmissionConditionsSuccess,
//   getAdmissionConditionsFail,
//   getFilteredFacultiesSuccess,
//   getFilteredFacultiesFail,
// } from "../admissionConditions/actions";

// import {
//   getAcademicCertificatesSuccess,
//   getAcademicCertificatesFail,
//   getFilteredAcademicCertificatesSuccess,
//   getFilteredAcademicCertificatesFail,
// } from "../academicvertificates/actions";

// import {
//   getStudentsOptSuccess,
//   getStudentsOptFail,
// } from "../university-students/actions";

// import { GET_FILTERED_FACULTIES } from "../admissionConditions/actionTypes";

// import { GET_FILTERED_ACADEMIC_CERTIFICATES } from "../academicvertificates/actionTypes";

import {
  getStudentsSuccess,
  getStudentsFail,
  addStudentFail,
  addStudentSuccess,
  updateStudentSuccess,
  updateStudentFail,
  deleteStudentSuccess,
  deleteStudentFail,
  getStudentByIdSuccess,
  getStudentByIdFail,
  generateStudentSuccess,
  generateStudentFail,
  getDefaultRegReqDocsSuccess,
  getDefaultRegReqDocsFail,
  getStudentDeletedValueSuccess,
  getStudentDeletedValueFail,
  getTempRelativesSuccess,
  getTempRelativesFail,
  getTempRelativeDeletedValueSuccess,
  getTempRelativeDeletedValueFail,
} from "./actions";
import { getYearsSuccess, getYearsFail } from "../../years/actions";

//Include Both Helper File with needed methods
import {
  getStudents,
  addNewStudent,
  updateStudent,
  deleteStudent,
  getStudentById,
  generateStudent,
  getDefaultRegReqDocs,
  getNationalities,
  getFaculties,
  getCountries,
  getYearSemesters,
  getCurrentSemester,
  getCities,
  getCertificates,
  getGovernorates,
  getDocuments,
  getRegReqDocuments,
  getGenders,
  getCertificateLevels,
  getAdmissionConditions,
  getAcademicCertificates,
  getFilteredFaculties,
  getFilteredAcademicCertificates,
  getStudentDeletedValue,
  getUniversityStudents,
  getTempRelatives,
  getTempRelativeDeletedValue,
  getGrants,
  getStudentsOpt,
  getRelatives,
  getYears,
} from "helpers/fakebackend_helper";

function* fetchTrainees() {
  const get_trainees_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_TempTrainee",
    // filter: "IsUnivStd <> 1",
  };
  try {
    const response = yield call(getStudents, get_trainees_req);
    console.log("response", response);
    yield put(getStudentsSuccess(response));
  } catch (error) {
    yield put(getStudentsFail(error));
  }

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
  // // get grants option
  // const get_grants = {
  //   source: "db",
  //   procedure: "Generic_getOptions",
  //   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //   tablename: "settings_Grants",
  //   fields: "Id,grantType",
  // };
  // try {
  //   const response = yield call(getGrants, get_grants);
  //   yield put(getGrantsSuccess(response));
  // } catch (error) {
  //   yield put(getGrantsFail(error));
  // }

  // // get nationality optuin
  // const get_nationality_opt = {
  //   source: "db",
  //   procedure: "Generic_getOptions",
  //   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //   tablename: "settings_nationality",
  //   fields: "Id,arTitle",
  // };
  // try {
  //   const response = yield call(getNationalities, get_nationality_opt);
  //   yield put(getNationalitiesSuccess(response));
  // } catch (error) {
  //   yield put(getNationalitiesFail(error));
  // }

  // // get relatives optuin
  // const get_relatives_opt = {
  //   source: "db",
  //   procedure: "Generic_getOptions",
  //   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //   tablename: "settings_Relatives",
  //   fields: "Id,arTitle",
  // };
  // try {
  //   const response = yield call(getRelatives, get_relatives_opt);
  //   yield put(getRelativesSuccess(response));
  // } catch (error) {
  //   yield put(getRelativesFail(error));
  // }

  // //get faculty
  // const get_faculty_opt = {
  //   source: "db",
  //   procedure: "Generic_getOptions",
  //   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //   tablename: "Common_Faculty",
  //   fields: "Id,arTitle",
  // };
  // try {
  //   const response = yield call(getFaculties, get_faculty_opt);
  //   yield put(getFacultiesSuccess(response));
  // } catch (error) {
  //   yield put(getFacultiesFail(error));
  // }

  // //get country
  // const get_country_opt = {
  //   source: "db",
  //   procedure: "Generic_Optiondatalist",
  //   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //   tablename: "settings_country",
  //   fields: "Id,arTitle",
  // };
  // try {
  //   const response = yield call(getCountries, get_country_opt);
  //   yield put(getCountriesSuccess(response));
  // } catch (error) {
  //   yield put(getCountriesFail(error));
  // }

  // //get semester
  // const get_semester_opt = {
  //   source: "db",
  //   procedure: "SisApp_getData",
  //   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //   tablename: "_YearsSemesters",
  // };
  // try {
  //   const response = yield call(getYearSemesters, get_semester_opt);
  //   yield put(getYearSemestersSuccess(response));
  // } catch (error) {
  //   yield put(getYearSemestersFail(error));
  // }

  // //get city
  // const get_city_opt = {
  //   source: "db",
  //   procedure: "Generic_Optiondatalist",
  //   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //   tablename: "settings_City",
  //   fields: "Id,arTitle",
  // };
  // try {
  //   const response = yield call(getCities, get_city_opt);
  //   yield put(getCitiesSuccess(response));
  // } catch (error) {
  //   yield put(getCitiesFail(error));
  // }

  // //get certificate
  // const get_certificate_opt = {
  //   source: "db",
  //   procedure: "Generic_Optiondatalist",
  //   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //   tablename: "settings_Certificates",
  //   fields: "Id,arTitle,totalGrades",
  // };
  // try {
  //   const response = yield call(getCertificates, get_certificate_opt);
  //   yield put(getCertificatesSuccess(response));
  // } catch (error) {
  //   yield put(getCertificatesFail(error));
  // }

  // //get governorate
  // const get_governorate_opt = {
  //   source: "db",
  //   procedure: "Generic_Optiondatalist",
  //   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //   tablename: "settings_governorate",
  //   fields: "Id,arTitle",
  // };
  // try {
  //   const response = yield call(getGovernorates, get_governorate_opt);
  //   yield put(getGovernoratesSuccess(response));
  // } catch (error) {
  //   yield put(getGovernoratesFail(error));
  // }

  // //get Documents
  // const get_Documents_opt = {
  //   source: "db",
  //   procedure: "Generic_getOptions",
  //   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //   tablename: "settings_RegDocType",
  //   fields: "Id,arDocument",
  // };
  // try {
  //   const response = yield call(getDocuments, get_Documents_opt);
  //   yield put(getDocumentsSuccess(response));
  // } catch (error) {
  //   yield put(getDocumentsFail(error));
  // }

  // //get regReqDocuments
  // const get_regReqDocuments = {
  //   source: "db",
  //   procedure: "SisApp_getData",
  //   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //   tablename: "_RequiredRegistrationDocuments",
  // };
  // try {
  //   const response = yield call(getRegReqDocuments, get_regReqDocuments);
  //   yield put(getRegReqDocumentsSuccess(response));
  // } catch (error) {
  //   yield put(getRegReqDocumentsFail(error));
  // }

  // //get gender
  // const get_gender = {
  //   source: "db",
  //   procedure: "Generic_getOptions",
  //   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //   tablename: "settings_Gender",
  //   fields: "Id,arTitle",
  // };
  // try {
  //   const response = yield call(getGenders, get_gender);
  //   yield put(getGendersSuccess(response));
  // } catch (error) {
  //   yield put(getGendersFail(error));
  // }

  // //get certificateLevels
  // const get_certificateLevel = {
  //   source: "db",
  //   procedure: "SisApp_getData",
  //   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //   tablename: "settings_certificateLevel",
  //   fields: "Id,arcertificatelevel",
  // };
  // try {
  //   const response = yield call(getCertificateLevels, get_certificateLevel);
  //   yield put(getCertificateLevelsSuccess(response));
  // } catch (error) {
  //   yield put(getCertificateLevelsFail(error));
  // }

  // //get admission conditions
  // const get_admissionConditions = {
  //   source: "db",
  //   procedure: "Generic_getOptions",
  //   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //   tablename: "_Common_AdmissionCondition",
  //   fields: "facultyId,facultyName,certificateId",
  // };
  // try {
  //   const response = yield call(
  //     getAdmissionConditions,
  //     get_admissionConditions
  //   );
  //   yield put(getAdmissionConditionsSuccess(response));
  // } catch (error) {
  //   yield put(getAdmissionConditionsFail(error));
  // }

  // //get acedemic certificate
  // const get_acedemicCertificates = {
  //   source: "db",
  //   procedure: "Generic_getOptions",
  //   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //   tablename: "_AcadmicCertificates",
  //   fields: "Id,AcadmicCertificatesArName,facultyId",
  // };
  // try {
  //   const response = yield call(
  //     getAcademicCertificates,
  //     get_acedemicCertificates
  //   );
  //   yield put(getAcademicCertificatesSuccess(response));
  // } catch (error) {
  //   yield put(getAcademicCertificatesFail(error));
  // }

  // //get current semester
  // const get_current_semester = {
  //   source: "db",
  //   procedure: "SisApp_getData",
  //   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //   tablename: "settings_SystemCurrentSemester",
  //   filter: "facultyNum = 0 or facultyNum is null",
  // };
  // try {
  //   const response = yield call(getCurrentSemester, get_current_semester);
  //   yield put(getCurrentSemesterSuccess(response[0]));
  // } catch (error) {
  //   yield put(getCurrentSemesterFail(error));
  // }

  // //get universityStd
  // const get_universityStd_opt = {
  //   source: "db",
  //   procedure: "Generic_getOptions",
  //   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //   tablename: "_UniversityStudent",
  //   fields: "SID,studentname",
  // };
  // try {
  //   const response = yield call(getUniversityStudents, get_universityStd_opt);
  //   yield put(getUniversityStudentsSuccess(response));
  // } catch (error) {
  //   yield put(getUniversityStudentsFail(error));
  // }

  // //get student options
  // const get_student_opt = {
  //   source: "db",
  //   procedure: "Generic_Optiondatalist",
  //   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //   tablename: "_UniversityStudent",
  //   fields: "SID,studentname",
  // };
  // try {
  //   const response = yield call(getStudentsOpt, get_student_opt);
  //   yield put(getStudentsOptSuccess(response));
  // } catch (error) {
  //   yield put(getStudentsOptFail(error));
  // }
}

// function* fetchFilteredFaculties(obj) {
//   let stdCond = obj.payload;
//   const get_filtered_faculties = {
//     source: "db",
//     procedure: "Generic_getOptions",
//     apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
//     tablename: "_Common_AdmissionCondition",
//     fields: "facultyId,facultyName",
//     filter: `certificateId = ${stdCond.diplomaId}  and  average <= ${stdCond.Average}  and  YearId = ${stdCond.YearId}`,
//   };
//   try {
//     const response = yield call(getFilteredFaculties, get_filtered_faculties);
//     yield put(getFilteredFacultiesSuccess(response));
//   } catch (error) {
//     yield put(getFilteredFacultiesFail(error));
//   }
// }

// function* fetchFilteredAcademicCertificates(obj) {
//   let facultyId = obj.payload;
//   const get_filtered_academicCertificates = {
//     source: "db",
//     procedure: "Generic_getOptions",
//     apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
//     tablename: "_AcadmicCertificates",
//     fields: "Id,AcadmicCertificatesArName,facultyId",
//     filter: `facultyId = ${facultyId}  `,
//   };
//   try {
//     const response = yield call(
//       getFilteredAcademicCertificates,
//       get_filtered_academicCertificates
//     );
//     yield put(getFilteredAcademicCertificatesSuccess(response));
//   } catch (error) {
//     yield put(getFilteredAcademicCertificatesFail(error));
//   }
// }

function* onAddNewStudent({ payload, student }) {
  delete payload["id"];

  payload["source"] = "db";
  payload["procedure"] = "Admission_AddTempStudent";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TempStudent";
  payload["queryname"] = "_TempStudent";
  try {
    const response = yield call(addNewStudent, payload);
    yield put(addStudentSuccess(response[0]));
    const callobj = { payload: response[0] };
  } catch (error) {
    yield put(addStudentFail(error));
  }
}

function* onUpdateStudent({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "Admission_UpdateTempStudent";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TempStudent";
  payload["queryname"] = "_TempStudent";
  try {
    const response = yield call(updateStudent, payload);
    yield put(updateStudentSuccess(response[0]));
  } catch (error) {
    yield put(updateStudentFail(error));
  }
}

function* onDeleteStudent({ payload, student }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TempStudent";
  payload["queryname"] = "_TempStudent";

  try {
    const response = yield call(deleteStudent, payload);
    yield put(deleteStudentSuccess(response[0]));
  } catch (error) {
    yield put(deleteStudentFail(error));
  }
}

function* fetchStudentById(tempStudent) {
  const get_student_byId = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_TempStudentDetails",
    filter: `Id = ${tempStudent.payload.Id}`,
  };
  try {
    const response = yield call(getStudentById, get_student_byId);
    response.map(resp => {
      resp["TempStudentBrothers"] = JSON.parse(resp["TempStudentBrothers"]);
      resp["TempStudentRelatives"] = JSON.parse(resp["TempStudentRelatives"]);
      resp["RegReqDocTempStudent"] = JSON.parse(resp["RegReqDocTempStudent"]);
    });
    yield put(getStudentByIdSuccess(response[0]));
  } catch (error) {
    yield put(getStudentByIdFail(error));
  }
}

function* onGenerateStudent({ payload }) {
  const generate_student = {
    source: "db",
    operation: "execProc",
    procedure: "Admission_GenerateSID",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    parameters: `Id= ${payload}`,
  };
  try {
    const response = yield call(generateStudent, generate_student);

    yield put(generateStudentSuccess(response[0]));
  } catch (error) {
    yield put(generateStudentFail(error));
  }
}

function* fetchDefaultRegReqDocs(obj) {
  const object = obj.payload;
  const get_student_regReqDocs = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_RegReqDocs",
    filter: `yearId = ${object.yearId} and certificateLevelId = ${object.certificateLevelId} `,
  };
  try {
    const response = yield call(getDefaultRegReqDocs, get_student_regReqDocs);
    yield put(getDefaultRegReqDocsSuccess(response));
  } catch (error) {
    yield put(getDefaultRegReqDocsFail(error));
  }
}

function* onGetStudentDeletedValue() {
  try {
    const response = yield call(getStudentDeletedValue);
    yield put(getStudentDeletedValueSuccess(response));
  } catch (error) {
    yield put(getStudentDeletedValueFail(error));
  }
}
function* fetchTempRelatives(obj) {
  let tempRelative = obj.payload;
  const get_tempRelatives_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_TempStudentRelatives",
    filter: `tempId = ${tempRelative}`,
  };
  try {
    const response = yield call(getTempRelatives, get_tempRelatives_req);
    yield put(getTempRelativesSuccess(response));
  } catch (error) {
    yield put(getTempRelativesFail(error));
  }
}

function* onGetTempRelativeDeletedValue() {
  try {
    const response = yield call(getTempRelativeDeletedValue);
    yield put(getTempRelativeDeletedValueSuccess(response));
  } catch (error) {
    yield put(getTempRelativeDeletedValueFail(error));
  }
}

function* ApplicantsSaga() {
  yield takeEvery(GET_STUDENTS, fetchTrainees);
  yield takeEvery(GET_STUDENT_BY_ID, fetchStudentById);
  yield takeEvery(ADD_NEW_STUDENT, onAddNewStudent);
  yield takeEvery(UPDATE_STUDENT, onUpdateStudent);
  yield takeEvery(DELETE_STUDENT, onDeleteStudent);
  yield takeEvery(GENERATE_STUDENT, onGenerateStudent);
  // yield takeEvery(GET_FILTERED_FACULTIES, fetchFilteredFaculties);
  // yield takeEvery(
  //   GET_FILTERED_ACADEMIC_CERTIFICATES,
  //   fetchFilteredAcademicCertificates
  // );
  // yield takeEvery(GET_DEFAULT_REGREQDOCS, fetchDefaultRegReqDocs);
  // yield takeEvery(GET_STUDENT_DELETED_VALUE, onGetStudentDeletedValue);
  // yield takeEvery(GET_TEMP_RELATIVES, fetchTempRelatives);

  // yield takeEvery(
  //   GET_TEMP_RELATIVE_DELETED_VALUE,
  //   onGetTempRelativeDeletedValue
  // );
}

export default ApplicantsSaga;
