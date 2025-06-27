import { nationalities } from "common/data";
import {
  GET_EMPLOYEE_DELETED_VALUE,
  GET_EMPLOYEE_DELETED_VALUE_FAIL,
  GET_EMPLOYEE_DELETED_VALUE_SUCCESS,
  GET_EMPLOYEES,
  GET_EMPLOYEES_FAIL,
  GET_EMPLOYEES_SUCCESS,
  ADD_NEW_EMPLOYEE,
  ADD_EMPLOYEE_SUCCESS,
  ADD_EMPLOYEE_FAIL,
  UPDATE_EMPLOYEE,
  UPDATE_EMPLOYEE_SUCCESS,
  UPDATE_EMPLOYEE_FAIL,
  DELETE_EMPLOYEE,
  DELETE_EMPLOYEE_SUCCESS,
  DELETE_EMPLOYEE_FAIL,
  GET_NATIONALITIES_OPT,
  GET_NATIONALITIES_OPT_SUCCESS,
  GET_NATIONALITIES_OPT_FAIL,
  GET_GENDERSCH,
  GET_GENDERSCH_SUCCESS,
  GET_GENDERSCH_FAIL,
  GET_ADMINISTRATIVE_SUPERVISORS_OPT,
  GET_ADMINISTRATIVE_SUPERVISORS_OPT_SUCCESS,
  GET_ADMINISTRATIVE_SUPERVISORS_OPT_FAIL,
  GET_JOB_RANKS_OPT,
  GET_JOB_RANKS_OPT_SUCCESS,
  GET_JOB_RANKS_OPT_FAIL,
  GET_JOB_TITLES_OPT,
  GET_JOB_TITLES_OPT_SUCCESS,
  GET_JOB_TITLES_OPT_FAIL,
  GET_CORPORATE_NODES_OPT,
  GET_CORPORATE_NODES_OPT_SUCCESS,
  GET_CORPORATE_NODES_OPT_FAIL,
  GET_COST_CENTERS_OPT,
  GET_COST_CENTERS_OPT_SUCCESS,
  GET_COST_CENTERS_OPT_FAIL,
  GET_PHYSIACL_WORK_LOCATIONS_OPT,
  GET_PHYSIACL_WORK_LOCATIONS_OPT_SUCCESS,
  GET_PHYSIACL_WORK_LOCATIONS_OPT_FAIL,
  GET_ACADEMIC_YEARS_OPT,
  GET_ACADEMIC_YEARS_OPT_SUCCESS,
  GET_ACADEMIC_YEARS_OPT_FAIL,
  GET_COUNTRIES_OPT,
  GET_COUNTRIES_OPT_SUCCESS,
  GET_COUNTRIES_OPT_FAIL,
  GET_CITIES_OPT,
  GET_CITIES_OPT_SUCCESS,
  GET_CITIES_OPT_FAIL,
  GET_STATES_OPT,
  GET_STATES_OPT_SUCCESS,
  GET_STATES_OPT_FAIL,
  GET_EMPLOYEES_NAMES,
  GET_EMPLOYEES_NAMES_SUCCESS,
  GET_EMPLOYEES_NAMES_FAIL,
} from "./actionTypes";

export const getGendersch = () => ({
  type: GET_GENDERSCH,
});

export const getGenderschSuccess = genders => ({
  type: GET_GENDERSCH_SUCCESS,
  payload: genders,
});

export const getGenderschFail = error => ({
  type: GET_GENDERSCH_FAIL,
  payload: error,
});

export const getEmployeesNames = () => ({
  type: GET_EMPLOYEES_NAMES,
});

export const getEmployeesNamesSuccess = genders => ({
  type: GET_EMPLOYEES_NAMES_SUCCESS,
  payload: genders,
});

export const getEmployeesNamesFail = error => ({
  type: GET_EMPLOYEES_NAMES_FAIL,
  payload: error,
});

export const getNationalitiesOpt = () => ({
  type: GET_NATIONALITIES_OPT,
});

export const getNationalitiesOptSuccess = nationalities => ({
  type: GET_NATIONALITIES_OPT_SUCCESS,
  payload: nationalities,
});

export const getNationalitiesOptFail = error => ({
  type: GET_NATIONALITIES_OPT_FAIL,
  payload: error,
});

export const getEmployees = () => ({
  type: GET_EMPLOYEES,
});

export const getEmployeesSuccess = employees => ({
  type: GET_EMPLOYEES_SUCCESS,
  payload: employees,
});

export const getEmployeesFail = error => ({
  type: GET_EMPLOYEES_FAIL,
  payload: error,
});

export const getEmployeeDeletedValue = () => ({
  type: GET_EMPLOYEE_DELETED_VALUE,
});

export const getEmployeeDeletedValueSuccess = employee => ({
  type: GET_EMPLOYEE_DELETED_VALUE_SUCCESS,
  payload: employee,
});

export const getEmployeeDeletedValueFail = error => ({
  type: GET_EMPLOYEE_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewEmployee = employee => ({
  type: ADD_NEW_EMPLOYEE,
  payload: employee,
});

export const addEmployeeSuccess = employee => ({
  type: ADD_EMPLOYEE_SUCCESS,
  payload: employee,
});

export const addEmployeeFail = error => ({
  type: ADD_EMPLOYEE_FAIL,
  payload: error,
});

export const updateEmployee = employee => {
  return {
    type: UPDATE_EMPLOYEE,
    payload: employee,
  };
};

export const updateEmployeeSuccess = employee => ({
  type: UPDATE_EMPLOYEE_SUCCESS,
  payload: employee,
});

export const updateEmployeeFail = error => ({
  type: UPDATE_EMPLOYEE_FAIL,
  payload: error,
});

export const deleteEmployee = employee => ({
  type: DELETE_EMPLOYEE,
  payload: employee,
});

export const deleteEmployeeSuccess = employee => ({
  type: DELETE_EMPLOYEE_SUCCESS,
  payload: employee,
});

export const deleteEmployeeFail = error => ({
  type: DELETE_EMPLOYEE_FAIL,
  payload: error,
});

// export const getAdministrativeSupervisorsOpt = () => ({
//   type: GET_ADMINISTRATIVE_SUPERVISORS_OPT,
// });

// export const getAdministrativeSupervisorsOptSuccess = employees => ({
//   type: GET_ADMINISTRATIVE_SUPERVISORS_OPT_SUCCESS,
//   payload: employees,
// });

// export const getAdministrativeSupervisorsOptFail = error => ({
//   type: GET_ADMINISTRATIVE_SUPERVISORS_OPT_FAIL,
//   payload: error,
// });

export const getJobRanksOpt = () => ({
  type: GET_JOB_RANKS_OPT,
});

export const getJobRanksOptSuccess = employees => ({
  type: GET_JOB_RANKS_OPT_SUCCESS,
  payload: employees,
});

export const getJobRanksOptFail = error => ({
  type: GET_JOB_RANKS_OPT_FAIL,
  payload: error,
});

export const getJobTitlesOpt = () => ({
  type: GET_JOB_TITLES_OPT,
});

export const getJobTitlesOptSuccess = employees => ({
  type: GET_JOB_TITLES_OPT_SUCCESS,
  payload: employees,
});

export const getJobTitlesOptFail = error => ({
  type: GET_JOB_TITLES_OPT_FAIL,
  payload: error,
});

export const getCorporateNodesOpt = () => ({
  type: GET_CORPORATE_NODES_OPT,
});

export const getCorporateNodesOptSuccess = employees => ({
  type: GET_CORPORATE_NODES_OPT_SUCCESS,
  payload: employees,
});

export const getCorporateNodesOptFail = error => ({
  type: GET_CORPORATE_NODES_OPT_FAIL,
  payload: error,
});

export const getPhysicalWorkLocationsOpt = () => ({
  type: GET_PHYSIACL_WORK_LOCATIONS_OPT,
});

export const getPhysicalWorkLocationsOptSuccess = employees => ({
  type: GET_PHYSIACL_WORK_LOCATIONS_OPT_SUCCESS,
  payload: employees,
});

export const getPhysicalWorkLocationsOptFail = error => ({
  type: GET_PHYSIACL_WORK_LOCATIONS_OPT_FAIL,
  payload: error,
});

export const getAcademicYearsOpt = () => ({
  type: GET_ACADEMIC_YEARS_OPT,
});

export const getAcademicYearsOptSuccess = employees => ({
  type: GET_ACADEMIC_YEARS_OPT_SUCCESS,
  payload: employees,
});

export const getAcademicYearsOptFail = error => ({
  type: GET_ACADEMIC_YEARS_OPT_FAIL,
  payload: error,
});

export const getCountriesOpt = () => ({
  type: GET_COUNTRIES_OPT,
});

export const getCountriesOptSuccess = employees => ({
  type: GET_COUNTRIES_OPT_SUCCESS,
  payload: employees,
});

export const getCountriesOptFail = error => ({
  type: GET_COUNTRIES_OPT_FAIL,
  payload: error,
});

export const getCitiesOpt = () => ({
  type: GET_CITIES_OPT,
});

export const getCitiesOptSuccess = employees => ({
  type: GET_CITIES_OPT_SUCCESS,
  payload: employees,
});

export const getCitiesOptFail = error => ({
  type: GET_CITIES_OPT_FAIL,
  payload: error,
});

export const getStatesOpt = () => ({
  type: GET_STATES_OPT,
});

export const getStatesOptSuccess = employees => ({
  type: GET_STATES_OPT_SUCCESS,
  payload: employees,
});

export const getStatesOptFail = error => ({
  type: GET_STATES_OPT_FAIL,
  payload: error,
});
