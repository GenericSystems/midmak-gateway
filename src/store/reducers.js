import { combineReducers } from "redux";

// Front
import Layout from "./layout/reducer";

// Authentication
import login from "./auth/login/reducer";
import Account from "./auth/register/reducer";
import ForgetPassword from "./auth/forgetpwd/reducer";
import Profile from "./auth/profile/reducer";

//E-commerce
import ecommerce from "./e-commerce/reducer";

//sidbarcontent
import menu_items from "./sidebarcontent/reducer";

//chat
import chat from "./chat/reducer";

//Dashboard
import Dashboard from "./dashboard/reducer";

//Dasboard saas
import DashboardSaas from "./dashboard-saas/reducer";

//crypto
import crypto from "./crypto/reducer";

//invoices
import invoices from "./invoices/reducer";

// _Common
import _Common from "./_common/reducer";

//registrations
import registrations from "./Registration/reducer";

//lecturePeriods
import lecturePeriods from "./lecture-periods/reducer";

//Week Days
import weekDays from "./weekdays/reducer";

//Years
import years from "./years/reducer";

//trainees
import trainees from "./trainees/reducer";

//nationalities
import nationalities from "./nationality/reducer";

//genders
import genders from "./genders/reducer";

const rootReducer = combineReducers({
  // public
  Layout,
  login,
  _Common,
  invoices,
  crypto,
  chat,
  ecommerce,
  Profile,
  ForgetPassword,
  Account,
  menu_items,
  Dashboard,
  DashboardSaas,
  registrations,
  lecturePeriods,
  weekDays,
  years,
  trainees,
  nationalities,
  genders,
});

export default rootReducer;
