import { takeEvery, put, call, takeLatest } from "redux-saga/effects"

// Login Redux States
import { LOGIN_USER, LOGOUT_USER, SOCIAL_LOGIN,  GET_USER_ID } from "./actionTypes"
import { loginSuccess, logoutUserSuccess, apiError, loginFailed , getUserIdSuccess, getUserIdFail } from "./actions"

//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper"
import {
  postDbLogin,
  postJwtLogin,
  postSocialLogin,
  getUserId
} from "../../../helpers/fakebackend_helper"

const fireBaseBackend = getFirebaseBackend()

function* loginUser({ payload: { user, history } }) {
  console.log(`loginUser ..`, user, history)
  console.log('process env', process.env)
      
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(
        fireBaseBackend.loginUser,
        user.email,
        user.password
      )
      yield put(loginSuccess(response))
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      const response = yield call(postJwtLogin, {
        email: user.email,
        password: user.password,
      })
      localStorage.setItem("authUser", JSON.stringify(response))
      yield put(loginSuccess(response))
    } else if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
      const response = yield call(postDbLogin, {
        email: user.email,
        password: user.password,
      })
      localStorage.setItem("authUser", JSON.stringify(response))
      yield put(loginSuccess(response))
    }
    history.push("/dashboard")
  } catch (error) {
    yield put(apiError(error))
  }
}

function* loginUser2({ payload: { user, history } }) {
  console.log(`loginUser2 ..`, user, history)
  console.log('process env', process.env)
  //getDataFromProcedure

/*   const get_menu_items_req = {
    source: 'db',
    procedure: "webums_get_menu_items",
    parameters:"''30294470-b4dd-11ea-8c20-b036fd52a43e'', '' ''",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    email: user.email,
    password: user.password,
  } */
  const get_login_req = {
    source: 'db',
    procedure: "web_login",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    email: user.email,
    password: user.password,
  }
  try {
      const response = yield call(postDbLogin, get_login_req )
      console.log("in saga resp",response)
      if (response[0].statusLogin==0){
        localStorage.setItem("authUser", JSON.stringify(response))
        yield put(loginSuccess(response))
        history.push("/dashboard")
      }
      else
        yield put(loginFailed(response))
      
  } catch (error) {
    yield put(apiError(error))
  }
}


function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem("authUser")

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(fireBaseBackend.logout)
      yield put(logoutUserSuccess(response))
    }
    history.push("/login")
  } catch (error) {
    yield put(apiError(error))
  }
}

function* socialLogin({ payload: { data, history, type } }) {
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const fireBaseBackend = getFirebaseBackend()
      const response = yield call(
        fireBaseBackend.socialLoginUser,
        data,
        type
      )
      localStorage.setItem("authUser", JSON.stringify(response))
      yield put(loginSuccess(response))
    } else {
      const response = yield call(postSocialLogin, data)
      localStorage.setItem("authUser", JSON.stringify(response))
      yield put(loginSuccess(response))
    }
    history.push("/dashboard")
  } catch (error) {
    yield put(apiError(error))
  }
}

function* onGetUserId() {
  try {
    const response = yield call(getUserId)
    yield put(getUserIdSuccess(response))
  } catch (error) {
    yield put(getUserIdFail(error))
  }
  
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser2)
  yield takeLatest(SOCIAL_LOGIN, socialLogin)
  yield takeEvery(LOGOUT_USER, logoutUser)
  yield takeEvery(GET_USER_ID, onGetUserId);
}

export default authSaga
