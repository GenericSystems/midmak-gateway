import { call, put, takeEvery } from "redux-saga/effects";

import {
  GET_COURSE_DISTRIBUTIONS,
  GET_COURSE_DISTRIBUTION_DELETED_VALUE,
  ADD_NEW_COURSE_DISTRIBUTION,
  UPDATE_COURSE_DISTRIBUTION,
  DELETE_COURSE_DISTRIBUTION,
} from "./actionTypes";

import {
  getCourseDistributionsSuccess,
  getCourseDistributionsFail,
  getCourseDistributionDeletedValueSuccess,
  getCourseDistributionDeletedValueFail,
  addCourseDistributionSuccess,
  addCourseDistributionFail,
  updateCourseDistributionSuccess,
  updateCourseDistributionFail,
  deleteCourseDistributionSuccess,
  deleteCourseDistributionFail,
} from "./actions";

import {
  getCourseDistributions,
  getCourseDistributionDeletedValue,
  addNewCourseDistribution,
  updateCourseDistribution,
  deleteCourseDistribution,
  getDistributingCoursesMethods,
} from "../../helpers/fakebackend_helper";

import {
  getDistributingCoursesMethodsFail,
  getDistributingCoursesMethodsSuccess,
} from "../distributing-courses-methods/actions";

function* fetchCourseDistributions() {
  const request = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_CourseOfferingOnly",
  };

  try {
    const response = yield call(getCourseDistributions, request);
    yield put(getCourseDistributionsSuccess(response));
  } catch (error) {
    yield put(getCourseDistributionsFail(error));
  }

  const get_settings_req = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_DistributingMethods",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(
      getDistributingCoursesMethods,
      get_settings_req
    );
    yield put(getDistributingCoursesMethodsSuccess(response));
  } catch (error) {
    yield put(getDistributingCoursesMethodsFail(error));
  }
}

function* onAddNewCourseDistribution({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_CourseOffering";
  payload["queryname"] = "_Common_CourseOfferingOnly";
  try {
    const response = yield call(addNewCourseDistribution, payload);
    yield put(addCourseDistributionSuccess(response[0]));
  } catch (error) {
    yield put(addCourseDistributionFail(error));
  }
}

function* onUpdateCourseDistribution({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_CourseOffering";
  payload["queryname"] = "_Common_CourseOfferingOnly";

  try {
    const response = yield call(updateCourseDistribution, payload);
    yield put(updateCourseDistributionSuccess(response[0]));
  } catch (error) {
    yield put(updateCourseDistributionFail(error));
  }
}

function* onDeleteCourseDistribution({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_CourseOffering";
  payload["queryname"] = "_Common_CourseOfferingOnly";
  try {
    const response = yield call(deleteCourseDistribution, payload);
    yield put(deleteCourseDistributionSuccess(response[0]));
  } catch (error) {
    yield put(deleteCourseDistributionFail(error));
  }
}

function* onGetCourseDistributionDeletedValue() {
  try {
    const response = yield call(getCourseDistributionDeletedValue);
    yield put(getCourseDistributionDeletedValueSuccess(response));
  } catch (error) {
    yield put(getCourseDistributionDeletedValueFail(error));
  }
}

function* courseDistributionsSaga() {
  yield takeEvery(GET_COURSE_DISTRIBUTIONS, fetchCourseDistributions);
  yield takeEvery(ADD_NEW_COURSE_DISTRIBUTION, onAddNewCourseDistribution);
  yield takeEvery(UPDATE_COURSE_DISTRIBUTION, onUpdateCourseDistribution);
  yield takeEvery(DELETE_COURSE_DISTRIBUTION, onDeleteCourseDistribution);
  yield takeEvery(
    GET_COURSE_DISTRIBUTION_DELETED_VALUE,
    onGetCourseDistributionDeletedValue
  );
}

export default courseDistributionsSaga;
