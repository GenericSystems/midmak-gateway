import {
  GET_TRANSPORT_LINES_SUCCESS,
  GET_TRANSPORT_LINES_FAIL,
  ADD_TRANSPORT_LINE_SUCCESS,
  ADD_TRANSPORT_LINE_FAIL,
  UPDATE_TRANSPORT_LINE_SUCCESS,
  UPDATE_TRANSPORT_LINE_FAIL,
  DELETE_TRANSPORT_LINE_SUCCESS,
  DELETE_TRANSPORT_LINE_FAIL,
  GET_TRANSPORT_LINE_DETAILS_SUCCESS,
  GET_TRANSPORT_LINE_DETAILS_FAIL,
  ADD_TRANSPORT_LINE_DETAIL_SUCCESS,
  ADD_TRANSPORT_LINE_DETAIL_FAIL,
  UPDATE_TRANSPORT_LINE_DETAIL_SUCCESS,
  UPDATE_TRANSPORT_LINE_DETAIL_FAIL,
  DELETE_TRANSPORT_LINE_DETAIL_SUCCESS,
  DELETE_TRANSPORT_LINE_DETAIL_FAIL,
  GET_TRANSPORT_LINE_DELETED_VALUE_SUCCESS,
  GET_TRANSPORT_LINE_DELETED_VALUE_FAIL,
  GET_TRANSPORT_LINE_DETAILS_DELETED_VALUE_SUCCESS,
  GET_TRANSPORT_LINE_DETAILS_DELETED_VALUE_FAIL,
  GET_STDS_TRANSPORT_LINE_SUCCESS,
  GET_STDS_TRANSPORT_LINE_FAIL,
  ADD_STD_TRANSPORT_LINE_SUCCESS,
  ADD_STD_TRANSPORT_LINE_FAIL,
  UPDATE_STD_TRANSPORT_LINE_SUCCESS,
  UPDATE_STD_TRANSPORT_LINE_FAIL,
  DELETE_STD_TRANSPORT_LINE_SUCCESS,
  DELETE_STD_TRANSPORT_LINE_FAIL,
  GET_STD_TRANSPORT_LINE_DELETED_VALUE_SUCCESS,
  GET_STD_TRANSPORT_LINE_DELETED_VALUE_FAIL,
  GET_UNIV_STD_DATA_LIST_SUCCESS,
  GET_UNIV_STD_DATA_LIST_FAIL
} from "./actionTypes";

const INIT_STATE = {
  transportLines: [],
  transportLineDetails: [],
  stdsTransportLine: [],
  univStds: [],
  deletedDetail: null,
  error: {},
};

const transportLines = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TRANSPORT_LINES_SUCCESS:
      return {
        ...state,
        transportLines: action.payload,
      };

    case GET_TRANSPORT_LINES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_TRANSPORT_LINE_SUCCESS:
      return {
        ...state,
        transportLines: [...state.transportLines, action.payload],
      };

    case ADD_TRANSPORT_LINE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_TRANSPORT_LINE_SUCCESS:
      return {
        ...state,
        transportLines: state.transportLines.map(transportLine =>
          transportLine.Id.toString() === action.payload.Id.toString()
            ? { transportLine, ...action.payload }
            : transportLine
        ),
      };

    case UPDATE_TRANSPORT_LINE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_TRANSPORT_LINE_SUCCESS:
      return {
        ...state,
        transportLines: state.transportLines.filter(
          transportLine =>
            transportLine.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_TRANSPORT_LINE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_TRANSPORT_LINE_DETAILS_SUCCESS:
      return {
        ...state,
        transportLineDetails: action.payload,
      };

    case GET_TRANSPORT_LINE_DETAILS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_TRANSPORT_LINE_DETAIL_SUCCESS:
      return {
        ...state,
        transportLineDetails: [...state.transportLineDetails, action.payload],
      };

    case ADD_TRANSPORT_LINE_DETAIL_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_TRANSPORT_LINE_DETAIL_SUCCESS:
      return {
        ...state,
        transportLineDetails: state.transportLineDetails.map(
          transportLineDetail =>
            transportLineDetail.Id.toString() === action.payload.Id.toString()
              ? { transportLineDetail, ...action.payload }
              : transportLineDetail
        ),
      };

    case UPDATE_TRANSPORT_LINE_DETAIL_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_TRANSPORT_LINE_DETAIL_SUCCESS:
      return {
        ...state,
        transportLineDetails: state.transportLineDetails.filter(
          transportLineDetail =>
            transportLineDetail.Id.toString() !== action.payload.Id.toString()
        ),
        deletedDetail: action.payload.deleted,
      };

    case DELETE_TRANSPORT_LINE_DETAIL_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_TRANSPORT_LINE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case GET_TRANSPORT_LINE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_TRANSPORT_LINE_DETAILS_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deletedDetail: action.payload.deleted,
      };

    case GET_TRANSPORT_LINE_DETAILS_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

      case GET_STDS_TRANSPORT_LINE_SUCCESS:
      return {
        ...state,
        stdsTransportLine: action.payload,
      };

    case GET_STDS_TRANSPORT_LINE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_STD_TRANSPORT_LINE_SUCCESS:
      return {
        ...state,
        stdsTransportLine: [...state.stdsTransportLine, action.payload],
      };

    case ADD_STD_TRANSPORT_LINE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_STD_TRANSPORT_LINE_SUCCESS:
      return {
        ...state,
        stdsTransportLine: state.stdsTransportLine.map(transportLine =>
          transportLine.Id.toString() === action.payload.Id.toString()
            ? { transportLine, ...action.payload }
            : transportLine
        ),
      };

    case UPDATE_STD_TRANSPORT_LINE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_STD_TRANSPORT_LINE_SUCCESS:
      return {
        ...state,
        stdsTransportLine: state.stdsTransportLine.filter(
          transportLine =>
            transportLine.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_STD_TRANSPORT_LINE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

      case GET_STD_TRANSPORT_LINE_DELETED_VALUE_SUCCESS:
        return {
          ...state,
          deleted: action.payload.deleted,
        };
  
      case GET_STD_TRANSPORT_LINE_DELETED_VALUE_FAIL:
        return {
          ...state,
          error: action.payload,
        };

        case GET_UNIV_STD_DATA_LIST_SUCCESS:
          return {
            ...state,
            univStds: action.payload,
          };
    
        case GET_UNIV_STD_DATA_LIST_FAIL:
          return {
            ...state,
            error: action.payload,
          };

    default:
      return state;
  }
};

export default transportLines;
