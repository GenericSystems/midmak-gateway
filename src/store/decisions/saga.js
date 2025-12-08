import { call, put, takeEvery } from "redux-saga/effects";

// Decision Redux States
import { GET_DECISIONS } from "./actionTypes";

import { getDecisionsSuccess, getDecisionsFail } from "./actions";

// Include helper functions
import { getDecisions } from "../../helpers/fakebackend_helper";

function* fetchDecisions(selectedpayload) {
  let obj = selectedpayload.payload;
  console.log("lang", obj.lng);
  let lang = obj.lng;
  const titleField = lang === "en" ? "enTitle" : "arTitle";

  //get Decision_req
  const get_Decision_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_TraineesDecrees",
    filter: `traineeId = ${obj.traineeId}`,
  };

  try {
    const response = yield call(getDecisions, get_Decision_req);
    response.map(resp => {
      resp["TraineesDecreesCourses"] = JSON.parse(
        resp["TraineesDecreesCourses"]
      );
    });
    // response.map(resp => {
    //   resp["RegReqDocTempFinancial"] = JSON.parse(resp["RegReqDocTempFinancial"]);
    // });
    console.log("experresponse", response);
    yield put(getDecisionsSuccess(response));
  } catch (error) {
    yield put(getDecisionsFail(error));
  }
}

function* DecisionsSaga() {
  yield takeEvery(GET_DECISIONS, fetchDecisions);
}

export default DecisionsSaga;
