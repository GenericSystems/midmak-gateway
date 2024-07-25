import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_UNIVERSITY_STUDENTS,
  ADD_NEW_UNIVERSITY_STUDENT,
  DELETE_UNIVERSITY_STUDENT,
  UPDATE_UNIVERSITY_STUDENT,
  GET_UNIVERSITY_STUDENT_BY_ID,
  GET_UNIVERSITY_STUDENT_REGREQDOCS,
  UPDATE_UNIVERSITY_STUDENT_REGREQDOC,
  GET_STUDENTS_OPT,
  GET_BROTHERS,
  ADD_BROTHER,
  DELETE_BROTHER,
  UPDATE_BROTHER,
  GET_STD_RELATIVES,
  ADD_NEW_STD_RELATIVE,
  UPDATE_STD_RELATIVE,
  DELETE_STD_RELATIVE,
  GET_STD_RELATIVE_DELETED_VALUE,
} from "./actionTypes";

import { GET_FILTERED_FACULTIES } from "../admissionConditions/actionTypes";
import { getGrantsSuccess, getGrantsFail } from "../grants/actions";

import { GET_FILTERED_ACADEMIC_CERTIFICATES } from "../academicvertificates/actionTypes";

import {
  getRelativesSuccess,
  getRelativesFail,
} from "../relatives/actions";

import {
  getNationalitiesSuccess,
  getNationalitiesFail,
} from "../nationality/actions";

import {
  getFacultiesSuccess,
  getFacultiesFail,
} from "../mob-app-faculty-accs/actions";

import { getCountriesSuccess, getCountriesFail } from "../country/actions";

import {
  getYearSemestersSuccess,
  getYearSemestersFail,
} from "../general-management/actions";

import {
  getCurrentSemesterSuccess,
  getCurrentSemesterFail,
} from "../semesters/actions";

import { getCitiesSuccess, getCitiesFail } from "../cities/actions";

import {
  getCertificatesSuccess,
  getCertificatesFail,
} from "../certificates/actions";

import {
  getGovernoratesSuccess,
  getGovernoratesFail,
} from "../governorate/actions";

import {
  getDocumentsSuccess,
  getDocumentsFail,
} from "../documents-types/actions";

import {
  getRegReqDocumentsSuccess,
  getRegReqDocumentsFail,
} from "../reg-req-documents/actions";

import { getGendersSuccess, getGendersFail } from "../genders/actions";

import {
  getCertificateTypesSuccess,
  getCertificateTypesFail,
} from "../certificateTypes/actions";

import {
  getAcademicCertificatesSuccess,
  getAcademicCertificatesFail,
  getFilteredAcademicCertificatesSuccess,
  getFilteredAcademicCertificatesFail,
} from "../academicvertificates/actions";

import {
  getAdmissionConditionsSuccess,
  getAdmissionConditionsFail,
  getFilteredFacultiesSuccess,
  getFilteredFacultiesFail,
} from "../admissionConditions/actions";

import {
  getUniversityStudentsSuccess,
  getUniversityStudentsFail,
  addUniversityStudentFail,
  addUniversityStudentSuccess,
  updateUniversityStudentSuccess,
  updateUniversityStudentFail,
  deleteUniversityStudentSuccess,
  deleteUniversityStudentFail,
  getUniversityStudentByIdSuccess,
  getUniversityStudentByIdFail,
  getUniversityStudentRegReqDocsSuccess,
  getUniversityStudentRegReqDocsFail,
  updateUniversityStudentRegReqDocSuccess,
  updateUniversityStudentRegReqDocFail,
  getStudentsOptSuccess,
  getStudentsOptFail,
  addBrotherFail,
  addBrotherSuccess,
  deleteBrotherFail,
  deleteBrotherSuccess,
  updateBrotherFail,
  updateBrotherSuccess,
  getBrothersFail,
  getBrothersSuccess,
  getStdRelativesSuccess,
  getStdRelativesFail,
  addStdRelativeSuccess,
  addStdRelativeFail,
  updateStdRelativeSuccess,
  updateStdRelativeFail,
  deleteStdRelativeSuccess,
  deleteStdRelativeFail,
  getStdRelativeDeletedValueSuccess,
  getStdRelativeDeletedValueFail,
} from "./actions";

// Include Both Helper File with needed methods
import {
  getUniversityStudents,
  addNewUniversityStudent,
  updateUniversityStudent,
  deleteUniversityStudent,
  getUniversityStudentById,
  getUniversityStudentRegReqDocs,
  updateUniversityStudentRegReqDoc,
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
  getCertificateTypes,
  getAdmissionConditions,
  getFilteredFaculties,
  getAcademicCertificates,
  getFilteredAcademicCertificates,
  getStudentsOpt,
  addBrother,
  deleteBrother,
  getBrothers,
  updateBrother,
  getRelatives,
  getGrants,
  getStdRelatives,
  addNewStdRelative,
  updateStdRelative,
  deleteStdRelative,
  getStdRelativeDeletedValue,
} from "../../helpers/fakebackend_helper";

function* fetchUniversityStudents() {
  // get grants option
  const get_grants = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_Grants",
    fields: "Id,grantType",
  };
  try {
    const response = yield call(getGrants, get_grants);
    yield put(getGrantsSuccess(response));
  } catch (error) {
    yield put(getGrantsFail(error));
  }
  const get_universityStudents_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_UniversityStudent",
  };
  try {
    const response = yield call(
      getUniversityStudents,
      get_universityStudents_req
    );
    yield put(getUniversityStudentsSuccess(response));
  } catch (error) {
    yield put(getUniversityStudentsFail(error));
  }

  // get nationality optuin
  const get_nationality_opt = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_nationality",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getNationalities, get_nationality_opt);
    yield put(getNationalitiesSuccess(response));
  } catch (error) {
    yield put(getNationalitiesFail(error));
  }

    // get relatives optuin
    const get_relatives_opt = {
      source: "db",
      procedure: "Generic_getOptions",
      apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
      tablename: "settings_Relatives",
      fields: "Id,arTitle",
    };
    try {
      const response = yield call(getRelatives, get_relatives_opt);
      yield put(getRelativesSuccess(response));
    } catch (error) {
      yield put(getRelativesFail(error));
    }

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

  //get country
  const get_country_opt = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_country",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getCountries, get_country_opt);
    yield put(getCountriesSuccess(response));
  } catch (error) {
    yield put(getCountriesFail(error));
  }

  //get semester
  const get_semester_opt = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_YearsSemesters",
  };
  try {
    const response = yield call(getYearSemesters, get_semester_opt);
    yield put(getYearSemestersSuccess(response));
  } catch (error) {
    yield put(getYearSemestersFail(error));
  }

  //get city
  const get_city_opt = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_City",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getCities, get_city_opt);
    yield put(getCitiesSuccess(response));
  } catch (error) {
    yield put(getCitiesFail(error));
  }

  //get certificate
  const get_certificate_opt = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_Certificates",
    fields: "Id,arTitle,totalGrades",
  };
  try {
    const response = yield call(getCertificates, get_certificate_opt);
    yield put(getCertificatesSuccess(response));
  } catch (error) {
    yield put(getCertificatesFail(error));
  }

  //get governorate
  const get_governorate_opt = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_governorate",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getGovernorates, get_governorate_opt);
    yield put(getGovernoratesSuccess(response));
  } catch (error) {
    yield put(getGovernoratesFail(error));
  }

  //get Documents
  const get_Documents_opt = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_RegDocType",
    fields: "Id,arDocument",
  };
  try {
    const response = yield call(getDocuments, get_Documents_opt);
    yield put(getDocumentsSuccess(response));
  } catch (error) {
    yield put(getDocumentsFail(error));
  }

  //get regReqDocuments
  const get_regReqDocuments = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_RequiredRegistrationDocuments",
  };
  try {
    const response = yield call(getRegReqDocuments, get_regReqDocuments);
    yield put(getRegReqDocumentsSuccess(response));
  } catch (error) {
    yield put(getRegReqDocumentsFail(error));
  }

  //get gender
  const get_gender = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_Gender",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getGenders, get_gender);
    yield put(getGendersSuccess(response));
  } catch (error) {
    yield put(getGendersFail(error));
  }

  //get certificateTypes
  const get_certificateType = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_certificateType",
    fields: "Id,arcertificateType",
  };
  try {
    const response = yield call(getCertificateTypes, get_certificateType);
    yield put(getCertificateTypesSuccess(response));
  } catch (error) {
    yield put(getCertificateTypesFail(error));
  }

  //get admission conditions
  const get_admissionConditions = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_AdmissionCondition",
    fields: "facultyId,facultyName,certificateId",
  };
  try {
    const response = yield call(
      getAdmissionConditions,
      get_admissionConditions
    );
    yield put(getAdmissionConditionsSuccess(response));
  } catch (error) {
    yield put(getAdmissionConditionsFail(error));
  }

  //get acedemic certificate
  const get_acedemicCertificates = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_AcadmicCertificates",
    fields: "Id,AcadmicCertificatesArName,facultyId",
  };
  try {
    const response = yield call(
      getAcademicCertificates,
      get_acedemicCertificates
    );
    yield put(getAcademicCertificatesSuccess(response));
  } catch (error) {
    yield put(getAcademicCertificatesFail(error));
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

  //get student options
  const get_student_opt = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_UniversityStudent",
    fields: "SID,studentname",
  };
  try {
    const response = yield call(getStudentsOpt, get_student_opt);
    yield put(getStudentsOptSuccess(response));
  } catch (error) {
    yield put(getStudentsOptFail(error));
  }
}

function* fetchUniStudentById(tempUniversityStudent) {
  const get_uni_student_byId = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_UniversityStudentDetails",
    filter: `SID = ${tempUniversityStudent.payload.SID}`,
  };
  try {
    const response = yield call(getUniversityStudentById, get_uni_student_byId);
    response.map(resp => {
    resp["StudentBrothers"] =  JSON.parse(resp["StudentBrothers"]);
     resp["StudentRelatives"] = JSON.parse(resp["StudentRelatives"]);
     resp["RegReqDocStudent"] = JSON.parse(resp["RegReqDocStudent"]);
    }); 
    yield put(getUniversityStudentByIdSuccess(response[0]));
  } catch (error) {
    yield put(getUniversityStudentByIdFail(error));
  }

  const get_brothers = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_StudentBrothers",
    filter: `StudentId = ${tempUniversityStudent.payload.SID}`,
  };
  try {
    const response = yield call(getBrothers, get_brothers);
    yield put(getBrothersSuccess(response));
  } catch (error) {
    yield put(getBrothersFail(error));
  }
}

function* fetchFilteredFaculties(obj) {
  let admissionCond = obj.payload;
  const get_filtered_faculties = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_AdmissionCondition",
    fields: "facultyId,facultyName",
    filter: `certificateId = ${admissionCond.diplomaId}  and  average <= ${admissionCond.Average}  and  isGrantCond = ${admissionCond.isGrantCond} and YearId = ${admissionCond.YearId}`,
  };
  try {
    const response = yield call(getFilteredFaculties, get_filtered_faculties);

    yield put(getFilteredFacultiesSuccess(response));
  } catch (error) {
    yield put(getFilteredFacultiesFail(error));
  }
}

function* fetchFilteredAcademicCertificates(obj) {
  let facultyId = obj.payload;
  const get_filtered_academicCertificates = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_AcadmicCertificates",
    fields: "Id,AcadmicCertificatesArName,facultyId",
    filter: `facultyId = ${facultyId}  `,
  };
  try {
    const response = yield call(
      getFilteredAcademicCertificates,
      get_filtered_academicCertificates
    );
    yield put(getFilteredAcademicCertificatesSuccess(response));
  } catch (error) {
    yield put(getFilteredAcademicCertificatesFail(error));
  }
}

function* onAddNewUniversityStudent({ payload, universityStudent }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Student";

  try {
    const response = yield call(addNewUniversityStudent, payload);
    yield put(addUniversityStudentSuccess(response[0]));
  } catch (error) {
    yield put(addUniversityStudentFail(error));
  }
}

function* onUpdateUniversityStudent({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "Admission_UpdateUnivStudent";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Student";
  payload["queryname"] = "_UniversityStudent";
  console.log("Payload before update:", payload);
  if (payload.birthdate) {
    const date = new Date(payload.birthdate);
    if (!isNaN(date.getTime())) {
      payload.birthdate = date.toISOString().split('T')[0];
    } else {
      console.error("Invalid date format:", payload.birthdate);
      yield put(updateUniversityStudentFail(new Error("Invalid date format")));
      return;
    }
  }
  try {
    const respupdate = yield call(updateUniversityStudent, payload);

    yield put(updateUniversityStudentSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateUniversityStudentFail(error));
  }
}

function* onDeleteUniversityStudent({ payload, universityStudent }) {
  payload["source"] = "db";
  payload["procedure"] = "deleteStudent";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Student";
  payload["queryname"] = "_UniversityStudent";

  try {
    const respdelete = yield call(deleteUniversityStudent, payload);
    yield put(deleteUniversityStudentSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteUniversityStudentFail(error));
  }
}

function* fetchStudentRegReqDocsfromDb(tempUniversityStudent) {
  const get_uni_student_regReqDocs = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_RegReqDocUniversityStudent",
    filter: `StudentId = ${tempUniversityStudent.SID}`,
  };
  try {
    const response = yield call(
      getUniversityStudentRegReqDocs,
      get_uni_student_regReqDocs
    );

    yield put(getUniversityStudentRegReqDocsSuccess(response));
  } catch (error) {
    yield put(getUniversityStudentRegReqDocsFail(error));
  }
}

function* fetchUniversityStudentRegReqDocs(tempUniversityStudent) {
  yield fetchStudentRegReqDocsfromDb(tempUniversityStudent.payload);
}

function* onUpdateUniversityUniversityStudentRegReqDoc({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_RegReqDocUniversityStudent";
  try {
    const respupdate = yield call(updateUniversityStudentRegReqDoc, payload);
    yield put(updateUniversityStudentRegReqDocSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateUniversityStudentRegReqDocFail(error));
  }
}

function* fetchBrothers(tempUniversityStudent) {
  const get_uni_student_brothers = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_StudentBrothers",
    filter: `StudentId = ${tempUniversityStudent.SID}`,
  };
  try {
    const response = yield call(getBrothers, get_uni_student_brothers);

    yield put(getBrothersSuccess(response));
  } catch (error) {
    yield put(getBrothersFail(error));
  }
}

function* onAddBrother({ payload, brother }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StudentBrothers";

  try {
    const response = yield call(addBrother, payload);
    yield put(addBrotherSuccess(response[0]));
  } catch (error) {
    yield put(addBrotherFail(error));
  }
}

function* onDeleteBrother({ payload, brother }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StudentBrothers";
  try {
    const responsedelete = yield call(deleteBrother, payload);
    yield put(deleteBrotherSuccess(responsedelete[0]));
  } catch (error) {
    yield put(deleteBrotherFail(error));
  }
}

function* onUpdateBrother({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StudentBrothers";
  try {
    const response = yield call(updateBrother, payload);
    yield put(updateBrotherSuccess(response[0]));
  } catch (error) {
    yield put(updateBrotherFail(error));
  }
}

function* fetchStdRelatives(obj) {
  let stdStdRelative = obj.payload;

  const get_stdStdRelatives_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_StudentRelatives",
    filter: `studentId = ${stdStdRelative}`,
  };
  try {
    const response = yield call(getStdRelatives, get_stdStdRelatives_req);
    yield put(getStdRelativesSuccess(response));
  } catch (error) {
    yield put(getStdRelativesFail(error));
  }
}

function* onAddNewStdRelative({ payload, stdStdRelative }) {
  delete payload["id"];

  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StudentRelatives";
  try {
    const response = yield call(addNewStdRelative, payload);
    yield put(addStdRelativeSuccess(response[0]));
  } catch (error) {
    yield put(addStdRelativeFail(error));
  }
}

function* onUpdateStdRelative({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StudentRelatives";

  try {
    const response = yield call(updateStdRelative, payload);
    yield put(updateStdRelativeSuccess(response[0]));
  } catch (error) {
    yield put(updateStdRelativeFail(error));
  }
}

function* onDeleteStdRelative({ payload, stdStdRelative }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StudentRelatives";

  try {
    const response = yield call(deleteStdRelative, payload);
    yield put(deleteStdRelativeSuccess(response[0]));
  } catch (error) {
    yield put(deleteStdRelativeFail(error));
  }
}
function* onGetStdRelativeDeletedValue() {
  try {
    const response = yield call(getStdRelativeDeletedValue);
    yield put(getStdRelativeDeletedValueSuccess(response));
  } catch (error) {
    yield put(getStdRelativeDeletedValueFail(error));
  }
}

function* universityStudentsSaga() {
  yield takeEvery(GET_UNIVERSITY_STUDENTS, fetchUniversityStudents);
  yield takeEvery(GET_UNIVERSITY_STUDENT_BY_ID, fetchUniStudentById);
  yield takeEvery(ADD_NEW_UNIVERSITY_STUDENT, onAddNewUniversityStudent);
  yield takeEvery(UPDATE_UNIVERSITY_STUDENT, onUpdateUniversityStudent);
  yield takeEvery(DELETE_UNIVERSITY_STUDENT, onDeleteUniversityStudent);
  yield takeEvery(GET_FILTERED_FACULTIES, fetchFilteredFaculties);
  yield takeEvery(
    GET_FILTERED_ACADEMIC_CERTIFICATES,
    fetchFilteredAcademicCertificates
  );
  yield takeEvery(
    GET_UNIVERSITY_STUDENT_REGREQDOCS,
    fetchUniversityStudentRegReqDocs
  );
  yield takeEvery(
    UPDATE_UNIVERSITY_STUDENT_REGREQDOC,
    onUpdateUniversityUniversityStudentRegReqDoc
  );
  yield takeEvery(GET_BROTHERS, fetchBrothers);
  yield takeEvery(ADD_BROTHER, onAddBrother);
  yield takeEvery(DELETE_BROTHER, onDeleteBrother);
  yield takeEvery(UPDATE_BROTHER, onUpdateBrother);
  yield takeEvery(GET_STD_RELATIVES, fetchStdRelatives);

  yield takeEvery(ADD_NEW_STD_RELATIVE, onAddNewStdRelative);

  yield takeEvery(UPDATE_STD_RELATIVE, onUpdateStdRelative);

  yield takeEvery(DELETE_STD_RELATIVE, onDeleteStdRelative);

  yield takeEvery(GET_STD_RELATIVE_DELETED_VALUE, onGetStdRelativeDeletedValue);
}

export default universityStudentsSaga;
