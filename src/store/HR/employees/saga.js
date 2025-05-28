import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_EMPLOYEES,
  GET_EMPLOYEE_DELETED_VALUE,
  ADD_NEW_EMPLOYEE,
  DELETE_EMPLOYEE,
  UPDATE_EMPLOYEE,
} from "./actionTypes";

import {
  getEmployeesSuccess,
  getEmployeesFail,
  getEmployeeDeletedValueSuccess,
  getEmployeeDeletedValueFail,
  addEmployeeFail,
  addEmployeeSuccess,
  updateEmployeeSuccess,
  updateEmployeeFail,
  deleteEmployeeSuccess,
  deleteEmployeeFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getEmployees,
  getEmployeeDeletedValue,
  addNewEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../../helpers/fakebackend_helper";

function* fetchEmployees() {
  const get_employee_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Employees",
  };
  try {
    const response = yield call(getEmployees, get_employee_req);
    console.log("fffffffffffffff", response);
    yield put(getEmployeesSuccess(response));
  } catch (error) {
    yield put(getEmployeesFail(error));
  }
}

function* getEmployeeProfile() {
  try {
    const response = yield call(getEmployeeDeletedValue);
    yield put(getEmployeeDeletedValueSuccess(response));
  } catch (error) {
    yield put(getEmployeeDeletedValueFail(error));
  }
}

function* onAddNewEmployee({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_Employees";

  try {
    const response = yield call(addNewEmployee, payload);
    yield put(addEmployeeSuccess(response[0]));
  } catch (error) {
    yield put(addEmployeeFail(error));
  }
}

function* onUpdateEmployee({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_Employees";

  try {
    const response = yield call(updateEmployee, payload);
    yield put(updateEmployeeSuccess(response[0]));
  } catch (error) {
    yield put(updateEmployeeFail(error));
  }
}

function* onDeleteEmployee({ payload, employee }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_Employees";

  try {
    const response = yield call(deleteEmployee, payload);
    yield put(deleteEmployeeSuccess(response[0]));
  } catch (error) {
    yield put(deleteEmployeeFail(error));
  }
}

function* employeesSaga() {
  yield takeEvery(GET_EMPLOYEES, fetchEmployees);
  yield takeEvery(GET_EMPLOYEE_DELETED_VALUE, getEmployeeProfile);
  yield takeEvery(ADD_NEW_EMPLOYEE, onAddNewEmployee);
  yield takeEvery(UPDATE_EMPLOYEE, onUpdateEmployee);
  yield takeEvery(DELETE_EMPLOYEE, onDeleteEmployee);
}

export default employeesSaga;
