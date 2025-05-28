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
} from "./actionTypes";

const INIT_STATE = {
  employees: [],
  deleted: {},
  error: {},
};

const employees = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_EMPLOYEES_SUCCESS:
      return {
        ...state,
        employees: action.payload,
      };

    case GET_EMPLOYEES_FAIL:
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
        deleted: action.payload,
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

    case GET_EMPLOYEE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default employees;
