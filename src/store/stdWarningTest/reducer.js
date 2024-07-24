import {
    GET_STD_WARNING_TEST_SUCCESS,
    GET_STD_WARNING_TEST_FAIL,
    ADD_STD_WARNING_TEST_SUCCESS,
    ADD_STD_WARNING_TEST_FAIL,
    UPDATE_STD_WARNING_TEST_SUCCESS,
    UPDATE_STD_WARNING_TEST_FAIL,
    DELETE_STD_WARNING_TEST_SUCCESS,
    DELETE_STD_WARNING_TEST_FAIL,
    GET_STD_WARNING_TEST_DELETED_VALUE_SUCCESS,
    GET_STD_WARNING_TEST_DELETED_VALUE_FAIL,

  } from "./actionTypes";
  
  const INIT_STATE = {
    stdWarningTest: [],
    stdWarningTestOpt: [],
    studentStates: [],
    deleted: {},
    error: {},
  };
  
  const stdWarningTest = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_STD_WARNING_TEST_SUCCESS:
        return {
          ...state,
          stdWarningTest: action.payload,
        };
      case GET_STD_WARNING_TEST_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case ADD_STD_WARNING_TEST_SUCCESS:
        return {
          ...state,
          stdWarningTest: [...state.stdWarningTest, action.payload],
        };
  
      case ADD_STD_WARNING_TEST_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case UPDATE_STD_WARNING_TEST_SUCCESS:
        return {
          ...state,
          stdWarningTest: state.stdWarningTest.map(warningRule =>
            warningRule.Id === action.payload.Id
              ? { warningRule, ...action.payload }
              : warningRule
          ),
        };
  
      case UPDATE_STD_WARNING_TEST_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case DELETE_STD_WARNING_TEST_SUCCESS:
        return {
          ...state,
          stdWarningTest: state.stdWarningTest.filter(
            warningRule => warningRule.Id.toString() !== action.payload.Id.toString()
          ),
          deleted: action.payload.deleted,
        };
  
      case DELETE_STD_WARNING_TEST_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case GET_STD_WARNING_TEST_DELETED_VALUE_SUCCESS:
        return {
          ...state,
          deleted: action.payload.deleted,
        };
      case GET_STD_WARNING_TEST_DELETED_VALUE_FAIL:
        return {
          ...state,
          error: action.payload,
        };

  
      default:
        return state;
    }
  };
  
  export default stdWarningTest;
  