import {
  getAdministrativeSupervisorsOpt,
  getJobTitlesOpt,
  getPrimaryGroupsOpt,
  getTechnicalSupervisorsOpt,
} from "./actions";
import {
  GET_EMPLOYEES_SUCCESS,
  GET_EMPLOYEES_FAIL,
  ADD_EMPLOYEE_SUCCESS,
  ADD_EMPLOYEE_FAIL,
  UPDATE_EMPLOYEE_SUCCESS,
  UPDATE_EMPLOYEE_FAIL,
  DELETE_EMPLOYEE_SUCCESS,
  DELETE_EMPLOYEE_FAIL,
  GET_EMPLOYEE_DELETED_VALUE_SUCCESS,
  GET_EMPLOYEE_DELETED_VALUE_FAIL,
  GET_NATIONALITIES_OPT_SUCCESS,
  GET_NATIONALITIES_OPT_FAIL,
  GET_GENDERSCH_SUCCESS,
  GET_GENDERSCH_FAIL,
  // GET_ADMINISTRATIVE_SUPERVISORS_OPT_SUCCESS,
  // GET_ADMINISTRATIVE_SUPERVISORS_OPT_FAIL,
  GET_JOB_RANKS_OPT_FAIL,
  GET_JOB_RANKS_OPT_SUCCESS,
  GET_JOB_TITLES_OPT_FAIL,
  GET_JOB_TITLES_OPT_SUCCESS,
  GET_CORPORATE_NODES_OPT_FAIL,
  GET_CORPORATE_NODES_OPT_SUCCESS,
  GET_PHYSIACL_WORK_LOCATIONS_OPT_FAIL,
  GET_PHYSIACL_WORK_LOCATIONS_OPT_SUCCESS,
  GET_ACADEMIC_YEARS_OPT_FAIL,
  GET_ACADEMIC_YEARS_OPT_SUCCESS,
  GET_COUNTRIES_OPT_SUCCESS,
  GET_COUNTRIES_OPT_FAIL,
  GET_CITIES_OPT_SUCCESS,
  GET_CITIES_OPT_FAIL,
  GET_STATES_OPT_SUCCESS,
  GET_STATES_OPT_FAIL,
  GET_EMPLOYEES_NAMES_SUCCESS,
  GET_EMPLOYEES_NAMES_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  employees: [],
  employeesNames: [],
  nationalitiesOpt: [],
  // administrativeSupervisorsOpt: [],
  physicalWorkLocationsOpt: [],
  jobRanksOpt: [],
  corporateNodesOpt: [],
  jobTitlesOpt: [],
  genders: [],
  academicYearsOpt: [],
  countriesOpt: [],
  citiesOpt: [],
  statesOpt: [],
  deleted: {},
  error: {},
};

const employees = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_EMPLOYEES_SUCCESS:
      return {
        ...state,
        employees: action.payload,
        deleted: {},
      };

    case GET_EMPLOYEES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_NATIONALITIES_OPT_SUCCESS:
      return {
        ...state,
        nationalitiesOpt: action.payload,
      };

    case GET_NATIONALITIES_OPT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_GENDERSCH_SUCCESS:
      return {
        ...state,
        genders: action.payload,
      };
    case GET_GENDERSCH_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_EMPLOYEES_NAMES_SUCCESS:
      return {
        ...state,
        employeesNames: action.payload,
      };
    case GET_EMPLOYEES_NAMES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    // case GET_ADMINISTRATIVE_SUPERVISORS_OPT_SUCCESS:
    //   return {
    //     ...state,
    //     administrativeSupervisorsOpt: action.payload,
    //   };

    // case GET_ADMINISTRATIVE_SUPERVISORS_OPT_FAIL:
    //   return {
    //     ...state,
    //     error: action.payload,
    //   };

    case GET_JOB_TITLES_OPT_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_JOB_TITLES_OPT_SUCCESS:
      return {
        ...state,
        jobTitlesOpt: action.payload,
      };

    case GET_CORPORATE_NODES_OPT_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_CORPORATE_NODES_OPT_SUCCESS:
      return {
        ...state,
        corporateNodesOpt: action.payload,
      };

    case GET_JOB_RANKS_OPT_SUCCESS:
      return {
        ...state,
        jobRanksOpt: action.payload,
      };

    case GET_JOB_RANKS_OPT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_ACADEMIC_YEARS_OPT_SUCCESS:
      return {
        ...state,
        academicYearsOpt: action.payload,
      };

    case GET_ACADEMIC_YEARS_OPT_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_COUNTRIES_OPT_SUCCESS:
      return {
        ...state,
        countriesOpt: action.payload,
      };

    case GET_COUNTRIES_OPT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_CITIES_OPT_SUCCESS:
      return {
        ...state,
        citiesOpt: action.payload,
      };

    case GET_CITIES_OPT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_STATES_OPT_SUCCESS:
      return {
        ...state,
        statesOpt: action.payload,
      };

    case GET_STATES_OPT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_PHYSIACL_WORK_LOCATIONS_OPT_SUCCESS:
      return {
        ...state,
        physicalWorkLocationsOpt: action.payload,
      };

    case GET_PHYSIACL_WORK_LOCATIONS_OPT_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_EMPLOYEE_SUCCESS:
      return {
        ...state,
        employees: [...state.employees, action.payload],
      };

    case ADD_EMPLOYEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_EMPLOYEE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case GET_EMPLOYEE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_EMPLOYEE_SUCCESS:
      return {
        ...state,
        employees: state.employees.map(employee =>
          employee.Id.toString() === action.payload.Id.toString()
            ? { employee, ...action.payload }
            : employee
        ),
      };

    case UPDATE_EMPLOYEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_EMPLOYEE_SUCCESS:
      return {
        ...state,
        employees: state.employees.filter(
          employee => employee.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_EMPLOYEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default employees;
