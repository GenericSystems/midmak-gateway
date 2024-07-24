import {
  GET_CURR_SEM_MANS_SUCCESS,
  GET_CURR_SEM_MANS_FAIL,
  ADD_CURR_SEM_MAN_SUCCESS,
  ADD_CURR_SEM_MAN_FAIL,
  UPDATE_CURR_SEM_MAN_SUCCESS,
  UPDATE_CURR_SEM_MAN_FAIL,
  DELETE_CURR_SEM_MAN_SUCCESS,
  DELETE_CURR_SEM_MAN_FAIL,

} from "./actionTypes"

const INIT_STATE = {
  currSemMans: [],
  currSemManProfile: {},
  error: {},
}

const currSemMans = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CURR_SEM_MANS_SUCCESS:
      return {
        ...state,
        currSemMans: action.payload,
      }

    case GET_CURR_SEM_MANS_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case ADD_CURR_SEM_MAN_SUCCESS:
      return {
        ...state,
        currSemMans: [...state.currSemMans,action.payload],
      }

    case ADD_CURR_SEM_MAN_FAIL:
      return {
        ...state,
        error: action.payload,
      }

      case UPDATE_CURR_SEM_MAN_SUCCESS:
        return {
          ...state,
          currSemMans: state.currSemMans.map(currSemMan =>
            currSemMan.Id.toString() === action.payload.Id.toString()
              ? { currSemMan, ...action.payload }
              : currSemMan
          ),
        }
  
      case UPDATE_CURR_SEM_MAN_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case DELETE_CURR_SEM_MAN_SUCCESS:
        return {
          ...state,
          currSemMans: state.currSemMans.filter(
            currSemMan => currSemMan.Id.toString() !== action.payload.Id.toString()
          ),
        }
  
      case DELETE_CURR_SEM_MAN_FAIL:
        return {
          ...state,
          error: action.payload,
        }

    default:
      return state
  }
}

export default currSemMans
