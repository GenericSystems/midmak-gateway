import { call, put, takeEvery } from "redux-saga/effects";

// Exam Redux States
import { GET_LECTURES } from "./actionTypes";

import { getLecturesSuccess, getLecturesFail } from "./actions";

import { getWeekDaysSuccess, getWeekDaysFail } from "../weekdays/actions";

import {
  getTraineeSchedulesSuccess,
  getTraineeSchedulesFail,
} from "../Registration/actions";

// Include helper functions
import {
  getLectures,
  getWeekDays,
  getTraineeSchedules,
} from "../../helpers/fakebackend_helper";

function* fetchLectures(selectedpayload) {
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
    const response = yield call(getLectures, get_Exam_req);
    // response.map(resp => {
    //   resp["labs"] = JSON.parse(
    //     resp["labs"]
    //   );
    // });
    // response.map(resp => {
    //   resp["sections"] = JSON.parse(resp["sections"]);
    // });
    console.log("experresponse", response);
    yield put(getLecturesSuccess(response));
  } catch (error) {
    yield put(getLecturesFail(error));
  }

  const get_day_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_WeekDays",
  };

  try {
    const response = yield call(getWeekDays, get_day_req);
    // response.map(resp => {
    //   resp["ProfessionalExperiences"] = JSON.parse(
    //     resp["ProfessionalExperiences"]
    //   );
    // });
    // response.map(resp => {
    //   resp["RegReqDocTempFinancial"] = JSON.parse(resp["RegReqDocTempFinancial"]);
    // });
    console.log("experresponse", response);
    yield put(getWeekDaysSuccess(response));
  } catch (error) {
    yield put(getWeekDaysFail(error));
  }

  const get_temp_schedule = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Current_Common_TrianeeCurriculalines",
    // filter: `traineeId =${traineeId} and type = ''''${type}'''' and sectionLabId=${sectionLabId} `,
    filter: `traineeId =${obj.traineeId}`,
  };
  try {
    const response = yield call(getTraineeSchedules, get_temp_schedule);
    console.log("responseschedule", response);
    const safeResponse = response.map(resp => {
      if (resp.labs != null) {
        try {
          resp.labs = JSON.parse(resp.labs);

          if (!Array.isArray(resp.labs)) resp.labs = [];
        } catch (e) {
          console.warn("Invalid labs JSON for traineeId:", resp.traineeId);
          resp.labs = [];
        }
      }
      if (resp.sections != null) {
        try {
          resp.sections = JSON.parse(resp.sections);

          if (!Array.isArray(resp.sections)) resp.sections = [];
        } catch (e) {
          console.warn("Invalid sections JSON for traineeId:", resp.traineeId);
          resp.sections = [];
        }
      }
      return resp;
    });
    yield put(getTraineeSchedulesSuccess(response));
  } catch (error) {
    yield put(getTraineeSchedulesFail(error));
  }
}

function* examsSaga() {
  yield takeEvery(GET_LECTURES, fetchLectures);
}

export default examsSaga;
