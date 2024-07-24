import {
  GET_DEPARTMENTS_SUCCESS,
  GET_DEPARTMENTS_FAIL,
  GET_FILTERED_DEPARTMENTS_SUCCESS,
  GET_FILTERED_DEPARTMENTS_FAIL,
  ADD_DEPARTMENT_SUCCESS,
  ADD_DEPARTMENT_FAIL,
  UPDATE_DEPARTMENT_SUCCESS,
  UPDATE_DEPARTMENT_FAIL,
  DELETE_DEPARTMENT_SUCCESS,
  DELETE_DEPARTMENT_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  departments: [],
  filteredDepartments: [],
  error: {},
};

const departments = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DEPARTMENTS_SUCCESS:
      return {
        ...state,
        departments: action.payload,
      };

    case GET_DEPARTMENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_FILTERED_DEPARTMENTS_SUCCESS:
      return {
        ...state,
        filteredDepartments: action.payload
      };

    case GET_FILTERED_DEPARTMENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_DEPARTMENT_SUCCESS:
      return {
        ...state,
        departments: [...state.departments, action.payload],
      };

    case ADD_DEPARTMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_DEPARTMENT_SUCCESS:
      return {
        ...state,
        departments: state.departments.map(department =>
          department.Id.toString() === action.payload.Id.toString()
            ? { department, ...action.payload }
            : department
        ),
      };

    case UPDATE_DEPARTMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_DEPARTMENT_SUCCESS:
      return {
        ...state,
        departments: state.departments.filter(
          department =>
            department.Id.toString() !== action.payload.Id.toString()
        ),
      };

    case DELETE_DEPARTMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default departments;
