import { GET_EXAMS_SUCCESS, GET_EXAMS_FAIL } from "./actionTypes";

const INIT_STATE = {
  exams: [],
  deleted: {},
  error: {},
};

const exams = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_EXAMS_SUCCESS:
      return {
        ...state,
        exams: action.payload,
      };

    case GET_EXAMS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default exams;
