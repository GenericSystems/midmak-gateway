import {
    GET_GRANT_SPONSORS_SUCCESS,
    GET_GRANT_SPONSORS_FAIL,
    ADD_GRANT_SPONSOR_SUCCESS,
    ADD_GRANT_SPONSOR_FAIL,
    UPDATE_GRANT_SPONSOR_SUCCESS,
    UPDATE_GRANT_SPONSOR_FAIL,
    DELETE_GRANT_SPONSOR_SUCCESS,
    DELETE_GRANT_SPONSOR_FAIL,
    GET_GRANT_SPONSOR_PROFILE_SUCCESS,
    GET_GRANT_SPONSOR_PROFILE_FAIL,
    GET_GRANT_SPONSOR_DELETED_VALUE,
GET_GRANT_SPONSOR_DELETED_VALUE_SUCCESS,
GET_GRANT_SPONSOR_DELETED_VALUE_FAIL
    } from "./actionTypes"
    
    const INIT_STATE = {
    grantSponsors: [],
    grantProfile: {},
    error: {},
    deleted:{}
    }
    
    const grantSponsors = (state = INIT_STATE, action) => {
    switch (action.type) {
    case GET_GRANT_SPONSORS_SUCCESS:
    return {
    ...state,
    grantSponsors: action.payload,
    }
    case GET_GRANT_SPONSORS_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case ADD_GRANT_SPONSOR_SUCCESS:
        return {
            ...state,
            grantSponsors: [...state.grantSponsors, action.payload],
        }

    case ADD_GRANT_SPONSOR_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case GET_GRANT_SPONSOR_PROFILE_SUCCESS:
        return {
            ...state,
            grantProfile: action.payload,
        }

    case UPDATE_GRANT_SPONSOR_SUCCESS:
        return {
            ...state,
            grantSponsors: state.grantSponsors.map(grant =>
                grant.Id.toString() === action.payload.Id.toString()
                    ? { grant, ...action.payload }
                    : grant
            ),
        }

    case UPDATE_GRANT_SPONSOR_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case DELETE_GRANT_SPONSOR_SUCCESS:
        return {
            ...state,
            grantSponsors: state.grantSponsors.filter(
                grant => grant.Id.toString() !== action.payload.Id.toString()
            ),
            deleted: action.payload.deleted,
        }

    case DELETE_GRANT_SPONSOR_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case GET_GRANT_SPONSOR_PROFILE_FAIL:
        return {
            ...state,
            error: action.payload,
        }

        case DELETE_GRANT_SPONSOR_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_GRANT_SPONSOR_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };
    case GET_GRANT_SPONSOR_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
        return state
}
}

export default grantSponsors
