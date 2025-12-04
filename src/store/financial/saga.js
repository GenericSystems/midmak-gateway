import { call, put, takeEvery } from "redux-saga/effects";

// Trainee Redux States
import { GET_FINANCIALS } from "./actionTypes";

import { getFinancialsSuccess, getFinancialsFail } from "./actions";

// Include helper functions
import { getFinancials } from "../../helpers/fakebackend_helper";

function* fetchFinancials(selectedpayload) {
  let obj = selectedpayload.payload;
  console.log("lang", obj.lng);
  let lang = obj.lng;
  const titleField = lang === "en" ? "enTitle" : "arTitle";

  //get financial_req
  const get_financial_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Trainee",
    filter: `Id = ${obj.traineeId}`,
  };

  try {
    const response = yield call(getFinancials, get_financial_req);
    // response.map(resp => {
    //   resp["ProfessionalExperiences"] = JSON.parse(
    //     resp["ProfessionalExperiences"]
    //   );
    // });
    // response.map(resp => {
    //   resp["RegReqDocTempFinancial"] = JSON.parse(resp["RegReqDocTempFinancial"]);
    // });
    console.log("experresponse", response);
    yield put(getFinancialsSuccess(response));
  } catch (error) {
    yield put(getFinancialsFail(error));
  }
}

function* financialsSaga() {
  yield takeEvery(GET_FINANCIALS, fetchFinancials);
}

export default financialsSaga;
