import {
    GET_HIDDEN_GRADES_SUCCESS,
    GET_HIDDEN_GRADES_FAIL,
    ADD_HIDDEN_GRADE_SUCCESS,
    ADD_HIDDEN_GRADE_FAIL,
    UPDATE_HIDDEN_GRADE_SUCCESS,
    UPDATE_HIDDEN_GRADE_FAIL,
    DELETE_HIDDEN_GRADE_SUCCESS,
    DELETE_HIDDEN_GRADE_FAIL,
    GET_HIDDEN_GRADE_DELETED_VALUE_SUCCESS,
    GET_HIDDEN_GRADE_DELETED_VALUE_FAIL,
    } from "./actionTypes"
    
    const INIT_STATE = {
    hiddenGrades: [],
    deleted: {},
    error: {},
    }
    
    const hiddenGrades = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_HIDDEN_GRADES_SUCCESS:
        return {
            ...state,
            hiddenGrades: action.payload,
        }
        case GET_HIDDEN_GRADES_FAIL:
            return {
                ...state,
                error: action.payload,
            }

        case ADD_HIDDEN_GRADE_SUCCESS:
            return {
                ...state,
                hiddenGrades: [...state.hiddenGrades, action.payload],
            }

        case ADD_HIDDEN_GRADE_FAIL:
            return {
                ...state,
                error: action.payload,
            }

        case GET_HIDDEN_GRADE_DELETED_VALUE_SUCCESS:
            return {
                ...state,
                deleted: action.payload,
            }

        case UPDATE_HIDDEN_GRADE_SUCCESS:
            return {
                ...state,
                hiddenGrades: state.hiddenGrades.map(hiddenGrade =>
                    hiddenGrade.Id.toString() === action.payload.Id.toString()
                        ? { hiddenGrade, ...action.payload }
                        : hiddenGrade
                ),
            }

        case UPDATE_HIDDEN_GRADE_FAIL:
            return {
                ...state,
                error: action.payload,
            }

        case DELETE_HIDDEN_GRADE_SUCCESS:
            return {
                ...state,
                hiddenGrades: state.hiddenGrades.filter(
                    hiddenGrade => hiddenGrade.Id.toString() !== action.payload.Id.toString()
                ),
                deleted: action.payload.deleted
            }

        case DELETE_HIDDEN_GRADE_FAIL:
            return {
                ...state,
                error: action.payload,
            }

        case GET_HIDDEN_GRADE_DELETED_VALUE_FAIL:
            return {
                ...state,
                error: action.payload,
            }

        default:
            return state
    }
}

export default hiddenGrades
