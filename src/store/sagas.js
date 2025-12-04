import { all, fork } from "redux-saga/effects";

//public
import _CommonSaga from "./_common/saga";
import AccountSaga from "./auth/register/saga";
import AuthSaga from "./auth/login/saga";
import ForgetSaga from "./auth/forgetpwd/saga";
import ProfileSaga from "./auth/profile/saga";
import LayoutSaga from "./layout/saga";
import ecommerceSaga from "./e-commerce/saga";
import chatSaga from "./chat/saga";
import cryptoSaga from "./crypto/saga";
import invoiceSaga from "./invoices/saga";
import projectsSaga from "./projects/saga";
import tasksSaga from "./tasks/saga";
import mailsSaga from "./mails/saga";
import RegistrationSaga from "./Registration/saga";
import LecturePeriodsSaga from "./lecture-periods/saga";
import weekDaysSaga from "./weekdays/saga";
import yearsSaga from "./years/saga";
import traineesSaga from "./trainees/saga";
import nationalitiesSaga from "./nationality/saga";
import gendersSaga from "./genders/saga";
import financialsSaga from "./financial/saga";
export default function* rootSaga() {
  yield all([
    //public
    fork(AccountSaga),
    fork(AuthSaga),
    fork(ForgetSaga),
    fork(ProfileSaga),
    fork(LayoutSaga),
    fork(ecommerceSaga),
    fork(chatSaga),
    fork(mailsSaga),
    fork(cryptoSaga),
    fork(invoiceSaga),
    fork(projectsSaga),
    fork(mailsSaga),
    fork(RegistrationSaga),
    fork(LecturePeriodsSaga),
    fork(weekDaysSaga),
    fork(yearsSaga),
    fork(traineesSaga),
    fork(nationalitiesSaga),
    fork(gendersSaga),
    fork(financialsSaga),
  ]);
}
