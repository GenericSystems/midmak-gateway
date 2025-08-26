import {
  GET_ACADEMYINFO_SUCCESS,
  GET_ACADEMYINFO_FAIL,
  UPDATE_ACADEMYINFO_FAIL,
  UPDATE_ACADEMYINFO_SUCCESS,
  ADD_ACADEMYINFO_FAIL,
  ADD_ACADEMYINFO_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  academyInfo: [],
  error: {},
};

const academyInfo = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ACADEMYINFO_SUCCESS:
      return {
        ...state,
        academyInfo: action.payload,
      };
    case GET_ACADEMYINFO_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_ACADEMYINFO_SUCCESS:
      return {
        ...state,
        academyInfo: state.academyInfo.map(uni =>
          uni.Id.toString() === action.payload.Id.toString()
            ? { uni, ...action.payload }
            : uni
        ),
      };
    case UPDATE_ACADEMYINFO_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_ACADEMYINFO_SUCCESS:
      return {
        ...state,
        academyInfo: [...state.academyInfo, action.payload],
      };

    case ADD_ACADEMYINFO_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};
export default academyInfo;
