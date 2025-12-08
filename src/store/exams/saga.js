import { call, put, takeEvery } from "redux-saga/effects";

// Exam Redux States
import { GET_EXAMS } from "./actionTypes";

import { getExamsSuccess, getExamsFail } from "./actions";

// Include helper functions
import { getExams } from "../../helpers/fakebackend_helper";

function* fetchExams(selectedpayload) {
  let obj = selectedpayload.payload;
  console.log("lang", obj.lng);
  let lang = obj.lng;
  const titleField = lang === "en" ? "enTitle" : "arTitle";

  //get Exam_req
  const get_Exam_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Trainee",
    filter: `Id = ${obj.traineeId}`,
  };

  try {
    const response = yield call(getExams, get_Exam_req);
    // response.map(resp => {
    //   resp["ProfessionalExperiences"] = JSON.parse(
    //     resp["ProfessionalExperiences"]
    //   );
    // });
    // response.map(resp => {
    //   resp["RegReqDocTempFinancial"] = JSON.parse(resp["RegReqDocTempFinancial"]);
    // });
    console.log("experresponse", response);
    yield put(getExamsSuccess(response));
  } catch (error) {
    yield put(getExamsFail(error));
  }
}

function* examsSaga() {
  yield takeEvery(GET_EXAMS, fetchExams);
}

export default examsSaga;
