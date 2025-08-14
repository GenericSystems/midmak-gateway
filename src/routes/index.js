import React from "react";
import { Redirect } from "react-router-dom";

// Pages Component
import Chat from "../pages/Chat/Chat";

// Pages Calendar
import Calendar from "../pages/Calendar/index";

// User profile
import UserProfile from "../pages/Authentication/UserProfile";

import Header from "../components/VerticalLayout/Header";

//Ecommerce Pages
import EcommerceProducts from "../pages/Ecommerce/EcommerceProducts/index";
import EcommerceProductDetail from "../pages/Ecommerce/EcommerceProducts/EcommerceProductDetail";
import EcommerceOrders from "../pages/Ecommerce/EcommerceOrders/index";
import EcommerceCustomers from "../pages/Ecommerce/EcommerceCustomers/index";
import EcommerceCart from "../pages/Ecommerce/EcommerceCart";
import EcommerceCheckout from "../pages/Ecommerce/EcommerceCheckout";
import EcommerceShops from "../pages/Ecommerce/EcommerceShops/index";
import EcommerceAddProduct from "../pages/Ecommerce/EcommerceAddProduct";
// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";

// Inner Authentication
import Login1 from "../pages/AuthenticationInner/Login";
import Login2 from "../pages/AuthenticationInner/Login2";
import Register1 from "../pages/AuthenticationInner/Register";
import Register2 from "../pages/AuthenticationInner/Register2";
import Recoverpw from "../pages/AuthenticationInner/Recoverpw";
import Recoverpw2 from "../pages/AuthenticationInner/Recoverpw2";
import ForgetPwd1 from "../pages/AuthenticationInner/ForgetPassword";
import ForgetPwd2 from "../pages/AuthenticationInner/ForgetPwd2";
import LockScreen from "../pages/AuthenticationInner/auth-lock-screen";
import LockScreen2 from "../pages/AuthenticationInner/auth-lock-screen-2";
import ConfirmMail from "../pages/AuthenticationInner/page-confirm-mail";
import ConfirmMail2 from "../pages/AuthenticationInner/page-confirm-mail-2";
import EmailVerification from "../pages/AuthenticationInner/auth-email-verification";
import EmailVerification2 from "../pages/AuthenticationInner/auth-email-verification-2";
import TwostepVerification from "../pages/AuthenticationInner/auth-two-step-verification";
import TwostepVerification2 from "../pages/AuthenticationInner/auth-two-step-verification-2";

// Dashboard
import Dashboard from "../pages/Dashboard/index";
import DashboardSaas from "../pages/Dashboard-saas/index";
import DashboardCrypto from "../pages/Dashboard-crypto/index";
import DashboardBlog from "../pages/Dashboard-blog/index";

//Crypto
import CryptoWallet from "../pages/Crypto/CryptoWallet/crypto-wallet";
import CryptoBuySell from "../pages/Crypto/crypto-buy-sell";
import CryptoExchange from "../pages/Crypto/crypto-exchange";
import CryptoLending from "../pages/Crypto/crypto-lending";
import CryptoOrders from "../pages/Crypto/CryptoOrders/crypto-orders";
import CryptoKYCApplication from "../pages/Crypto/crypto-kyc-application";
import CryptoIcoLanding from "../pages/Crypto/CryptoIcoLanding/index";

// Charts
import ChartApex from "../pages/Charts/Apexcharts";
import ChartistChart from "../pages/Charts/ChartistChart";
import ChartjsChart from "../pages/Charts/ChartjsChart";
import EChart from "../pages/Charts/EChart";
import SparklineChart from "../pages/Charts/SparklineChart";
import ChartsKnob from "../pages/Charts/charts-knob";
import ReCharts from "../pages/Charts/ReCharts";

//Icons
import IconBoxicons from "../pages/Icons/IconBoxicons";
import IconDripicons from "../pages/Icons/IconDripicons";
import IconMaterialdesign from "../pages/Icons/IconMaterialdesign";
import IconFontawesome from "../pages/Icons/IconFontawesome";

//Tables
import BasicTables from "../pages/Tables/BasicTables";
import DatatableTables from "../pages/Tables/DatatableTables";
import ResponsiveTables from "../pages/Tables/ResponsiveTables";
import EditableTables from "../pages/Tables/EditableTables";
import DragDropTables from "../pages/Tables/DragDropTables";

// Forms
import FormElements from "../pages/Forms/FormElements/index";
import FormLayouts from "../pages/Forms/FormLayouts";
import FormAdvanced from "../pages/Forms/FormAdvanced";
import FormEditors from "../pages/Forms/FormEditors";
import FormValidations from "../pages/Forms/FormValidations";
import FormMask from "../pages/Forms/FormMask";
import FormRepeater from "../pages/Forms/FormRepeater";
import FormUpload from "../pages/Forms/FormUpload";
import FormWizard from "../pages/Forms/FormWizard";
import FormXeditable from "../pages/Forms/FormXeditable";
import DualListbox from "../pages/Forms/DualListbox";

//Ui
import UiAlert from "../pages/Ui/UiAlert";
import UiButtons from "../pages/Ui/UiButtons";
import UiCards from "../pages/Ui/UiCards";
import UiCarousel from "../pages/Ui/UiCarousel";
import UiColors from "../pages/Ui/UiColors";
import UiDropdown from "../pages/Ui/UiDropdown";
import UiGeneral from "../pages/Ui/UiGeneral";
import UiGrid from "../pages/Ui/UiGrid";
import UiImages from "../pages/Ui/UiImages";
import UiLightbox from "../pages/Ui/UiLightbox";
import UiModal from "../pages/Ui/UiModal";
import UiProgressbar from "../pages/Ui/UiProgressbar";
import UiTabsAccordions from "../pages/Ui/UiTabsAccordions";
import UiTypography from "../pages/Ui/UiTypography";
import UiVideo from "../pages/Ui/UiVideo";
import UiSessionTimeout from "../pages/Ui/UiSessionTimeout";
import UiRating from "../pages/Ui/UiRating";
import UiRangeSlider from "../pages/Ui/UiRangeSlider";
import UiNotifications from "../pages/Ui/ui-notifications";
import UiToast from "../pages/Ui/UiToast";
import UiOffCanvas from "../pages/Ui/UiOffCanvas";
import Breadcrumb from "../pages/Ui/UiBreadcrumb";
import UiPlaceholders from "../pages/Ui/UiPlaceholders";

//Pages
import PagesStarter from "../pages/Utility/pages-starter";
import PagesMaintenance from "../pages/Utility/pages-maintenance";
import PagesComingsoon from "../pages/Utility/pages-comingsoon";
import PagesTimeline from "../pages/Utility/pages-timeline";
import PagesFaqs from "../pages/Utility/pages-faqs";
import PagesPricing from "../pages/Utility/pages-pricing";
import Pages404 from "../pages/Utility/pages-404";
import Pages500 from "../pages/Utility/pages-500";

//UserMng
import UserMngsList from "../pages/PriveledgeManagement/UserManagement/UserMngs";
//Roles
import RolesList from "../pages/PriveledgeManagement/UserManagement/roles";

//Sector
import SectorsList from "../pages/Sectors/sectors";

//Warning
import warningsList from "../pages/TrainingMembers/training-members";

//PreReqType
import UserTypesList from "../pages/UserTypes/user-types";

//Certifcates
import Certificates from "../pages/Certificates/certificates";

//Grades
import CertificateGradesList from "../pages/CertificateGrades/certificateGrades";

//registration
import RegistrationList from "../pages/Registration/registration";

//DefineExamDates
import DefineExamDatesList from "../pages/Exam/DefineExamDates/defineExamDates";

//academyBuildingStructure
import AcademyBuildingStructuresList from "../pages/academyBuildingStructure/academyBuildingStructure";

//classScheduling
import classSchedulingList from "../pages/Addmission/classScheduling/classScheduling";

//ContractsTypes
import ContractsTypesList from "../pages/HR/contractsTypes/contractsTypes";

//Nationalities
import NationalitiesList from "../pages/Addmission/AdmissionSettings/nationality-list";

//Absence warnings
import AbsenceWarningsList from "../pages/Rules-and-Regulations/Absence-warnings/absenceWarnings";

//documet types
import DocumentsTypesList from "../pages/Addmission/AdmissionSettings/documents-types";

// RegReqDocuments

import RegReqDocumentsTable from "../pages/Addmission/AdmissionSettings/regReqDocuments";

//ExamRooms
import ExamRoomsList from "../pages/Exam/ExamRooms/examRooms";

//trainees
import TraineesList from "../pages/Addmission/AcadmeyStudents/trainees";

//WarningsTypes
import WarningsTypesList from "../pages/HR/warningsTypes/warningsTypes";

//RewardsTypes
import RewardsTypesList from "../pages/HR/rewardsTypes/rewardsTypes";

//DecisionsTypes
import DecisionsTypesList from "../pages/HR/decisionsTypes/decisionsTypes";

//Decisions
import DecisionsList from "../pages/HR/decisions/decisions";

//Contracts
import ContractsList from "../pages/HR/contracts/contracts";

//Applicants
import ApplicantsList from "../pages/Addmission/Applicants/applicants";

//Employment cases
import EmploymentCasesList from "../pages/HR/employmentCases/employmentCases";

//Work Classifications
import WorkClassificationsList from "../pages/HR/workClassifications/workClassifications";

//Employees
import EmployeesList from "../pages/HR/employees/employees";

//cERTIFICATELEVELS
import CertificateTypesList from "../pages/CertificatesTypes/certificates-types";

import TrainingMembersList from "../pages/TrainingMembers/training-members";

//Week Days
import WeekDays from "pages/WeekDays/weekDays";

//Years
import YearsList from "pages/Years/years";

import NewTrainee from "pages/Addmission/New Trainers/new-Trainee";

//Blog
import BlogList from "../pages/Blog/BlogList/index";
import BlogGrid from "../pages/Blog/BlogGrid/index";
import BlogDetails from "../pages/Blog/BlogDetails";

import TrainingFormatsList from "pages/trainingFormat/trainingFormat";

//CourseTypes
import CourseTypesList from "pages/courseTypes/courseTypes";
import CourseCatalogeList from "pages/CourseCataloge/CourseCataloge";

//organizationalStructure
import AcademyTree from "pages/Academy/academy-organize-structure";

//LecturePeriod
import LecturePeriodsList from "pages/lecture-periods/lecture-periods";

//DistributingCoursesMethods

import DistributingCoursesMethods from "pages/GradeSettings/Distributing-courses-methods";

//gradeTypes
import GradeTypesList from "pages/GradeSettings/Grade-types";

//CourseDistributionsList

import CourseDistributionsList from "pages/GradeSettings/courseDistributions";

//EnterGradesList

import EnterGradesList from "pages/GradeSettings/Enter-grades";

//check grades
import CheckGradesList from "pages/GradeSettings/check-grades";

import ArchiveGradesList from "pages/GradeSettings/archive-grades";

//Unarchive Course Requests
import UnarchiveCourseReq from "pages/Unarchive-course-requests/unarchive-course-requests";

//timeline
import TimeLines from "pages/TimeLines/timeLine";

//diploma-level
import DiplomaLevelsList from "pages/diploma-level/diploma-level";

const authProtectedRoutes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/dashboard-saas", component: DashboardSaas },
  { path: "/dashboard-crypto", component: DashboardCrypto },
  { path: "/dashboard-blog", component: DashboardBlog },

  //Crypto
  { path: "/crypto-wallet", component: CryptoWallet },
  { path: "/crypto-buy-sell", component: CryptoBuySell },
  { path: "/crypto-exchange", component: CryptoExchange },
  { path: "/crypto-lending", component: CryptoLending },
  { path: "/crypto-orders", component: CryptoOrders },
  { path: "/crypto-kyc-application", component: CryptoKYCApplication },

  //profile
  { path: "/profile", component: UserProfile },

  //chat
  { path: "/chat", component: Chat },

  //calendar
  { path: "/calendar", component: Calendar },

  //Ecommerce
  // { path: "/ecommerce-products/:id", component: EcommerceProducts },
  { path: "/ecommerce-products", component: EcommerceProducts },
  { path: "/ecommerce-product-details/:id", component: EcommerceProductDetail },

  { path: "/ecommerce-orders", component: EcommerceOrders },
  { path: "/ecommerce-customers", component: EcommerceCustomers },
  { path: "/ecommerce-cart", component: EcommerceCart },
  { path: "/ecommerce-checkout", component: EcommerceCheckout },
  { path: "/ecommerce-shops", component: EcommerceShops },
  { path: "/ecommerce-add-product", component: EcommerceAddProduct },

  { path: "/Header", component: Header },

  //UserMngsList
  { path: "/users", component: UserMngsList },
  //RolesList
  { path: "/roles", component: RolesList },

  //sectors
  { path: "/sectors", component: SectorsList },

  //UserTypes
  { path: "/user-types", component: UserTypesList },

  // Certificates
  { path: "/certificates", component: Certificates },

  // contractsTypes

  { path: "/contractsTypes", component: ContractsTypesList },

  // documentsTypes

  { path: "/documents-Types", component: DocumentsTypesList },

  //regReqDocument
  { path: "/regReqDocuments", component: RegReqDocumentsTable },

  // ExamRooms

  { path: "/examRooms", component: ExamRoomsList },

  // contracts

  { path: "/contracts", component: ContractsList },

  // Applicants

  { path: "/applicants", component: ApplicantsList },

  // warningsTypes

  { path: "/warningsTypes", component: WarningsTypesList },

  //nationalities

  { path: "/nationality-list", component: NationalitiesList },

  // AbsenceWarnings
  { path: "/absenceWarnings", component: AbsenceWarningsList },

  // rewardsTypes

  { path: "/rewardsTypes", component: RewardsTypesList },
  // decisionsTypes

  { path: "/decisionsTypes", component: DecisionsTypesList },

  // decisions

  { path: "/decisions", component: DecisionsList },

  // employmentCases

  { path: "/employmentCases", component: EmploymentCasesList },

  // workClassifications

  { path: "/workClassifications", component: WorkClassificationsList },

  // employees

  { path: "/employees", component: EmployeesList },

  // Grades
  { path: "/certificateGrades", component: CertificateGradesList },

  // registration
  { path: "/registration", component: RegistrationList },

  // DefineExamDates
  { path: "/defineExamDates", component: DefineExamDatesList },

  //academyBuildingStructure
  {
    path: "/academyBuildingStructure",
    component: AcademyBuildingStructuresList,
  },

  // classScheduling
  { path: "/classScheduling", component: classSchedulingList },

  { path: "/certificates-types", component: CertificateTypesList },

  //Week Days
  { path: "/weekDays", component: WeekDays },

  //Years
  { path: "/years", component: YearsList },

  //Trainers
  { path: "/training-members", component: TrainingMembersList },

  // New Trainee
  { path: "/newTrainee", component: NewTrainee },

  // trainees
  { path: "/trainees", component: TraineesList },

  //trainingFormat
  { path: "/trainingFormat", component: TrainingFormatsList },

  //CourseTypes
  { path: "/courseTypes", component: CourseTypesList },

  //CoursesCatalogs
  { path: "/courseCatalog", component: CourseCatalogeList },

  { path: "/organizationalStructure", component: AcademyTree },

  //lecturePeriods
  { path: "/lecturePeriods", component: LecturePeriodsList },

  {
    path: "/Distributing-courses-methods",
    component: DistributingCoursesMethods,
  },

  { path: "/gradeTypes", component: GradeTypesList },

  { path: "/course-distributions", component: CourseDistributionsList },

  //Unarchive Course Requests
  { path: "/unarchive-course-request", component: UnarchiveCourseReq },

  //enter grades

  { path: "/enter-grades", component: EnterGradesList },

  //check grades
  { path: "/check-grades", component: CheckGradesList },

  //archive grades

  { path: "/archive-grades", component: ArchiveGradesList },

  ///timeline
  { path: "/timeLine", component: TimeLines },

  //DiplomaLevelsList
  { path: "diploma-level", component: DiplomaLevelsList },

  //Blog
  { path: "/blog-list", component: BlogList },
  { path: "/blog-grid", component: BlogGrid },
  { path: "/blog-details", component: BlogDetails },

  //Charts
  { path: "/apex-charts", component: ChartApex },
  { path: "/chartist-charts", component: ChartistChart },
  { path: "/chartjs-charts", component: ChartjsChart },
  { path: "/e-charts", component: EChart },
  { path: "/sparkline-charts", component: SparklineChart },
  { path: "/charts-knob", component: ChartsKnob },
  { path: "/re-charts", component: ReCharts },

  // Icons
  { path: "/icons-boxicons", component: IconBoxicons },
  { path: "/icons-dripicons", component: IconDripicons },
  { path: "/icons-materialdesign", component: IconMaterialdesign },
  { path: "/icons-fontawesome", component: IconFontawesome },

  // Tables
  { path: "/tables-basic", component: BasicTables },
  { path: "/tables-datatable", component: DatatableTables },
  { path: "/tables-responsive", component: ResponsiveTables },
  { path: "/tables-editable", component: EditableTables },
  { path: "/tables-dragndrop", component: DragDropTables },

  // Forms
  { path: "/form-elements", component: FormElements },
  { path: "/form-layouts", component: FormLayouts },
  { path: "/form-advanced", component: FormAdvanced },
  { path: "/form-editors", component: FormEditors },
  { path: "/form-mask", component: FormMask },
  { path: "/form-repeater", component: FormRepeater },
  { path: "/form-uploads", component: FormUpload },
  { path: "/form-wizard", component: FormWizard },
  { path: "/form-validation", component: FormValidations },
  { path: "/form-xeditable", component: FormXeditable },
  { path: "/dual-listbox", component: DualListbox },

  // Ui
  { path: "/ui-alerts", component: UiAlert },
  { path: "/ui-buttons", component: UiButtons },
  { path: "/ui-cards", component: UiCards },
  { path: "/ui-carousel", component: UiCarousel },
  { path: "/ui-colors", component: UiColors },
  { path: "/ui-dropdowns", component: UiDropdown },
  { path: "/ui-general", component: UiGeneral },
  { path: "/ui-grid", component: UiGrid },
  { path: "/ui-images", component: UiImages },
  { path: "/ui-lightbox", component: UiLightbox },
  { path: "/ui-modals", component: UiModal },
  { path: "/ui-progressbars", component: UiProgressbar },
  { path: "/ui-tabs-accordions", component: UiTabsAccordions },
  { path: "/ui-typography", component: UiTypography },
  { path: "/ui-video", component: UiVideo },
  { path: "/ui-session-timeout", component: UiSessionTimeout },
  { path: "/ui-rating", component: UiRating },
  { path: "/ui-rangeslider", component: UiRangeSlider },
  { path: "/ui-notifications", component: UiNotifications },
  { path: "/ui-toasts", component: UiToast },
  { path: "/ui-offcanvas", component: UiOffCanvas },
  { path: "/ui-breadcrumb", component: Breadcrumb },
  { path: "/ui-placeholders", component: UiPlaceholders },
  //Utility
  { path: "/pages-starter", component: PagesStarter },
  { path: "/pages-timeline", component: PagesTimeline },
  { path: "/pages-faqs", component: PagesFaqs },
  { path: "/pages-pricing", component: PagesPricing },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
];

const publicRoutes = [
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/register", component: Register },

  { path: "/pages-maintenance", component: PagesMaintenance },
  { path: "/pages-comingsoon", component: PagesComingsoon },
  { path: "/pages-404", component: Pages404 },
  { path: "/pages-500", component: Pages500 },
  { path: "/crypto-ico-landing", component: CryptoIcoLanding },

  // Authentication Inner
  { path: "/pages-login", component: Login1 },
  { path: "/pages-login-2", component: Login2 },

  { path: "/pages-register", component: Register1 },
  { path: "/pages-register-2", component: Register2 },

  { path: "/page-recoverpw", component: Recoverpw },
  { path: "/pages-recoverpw-2", component: Recoverpw2 },

  { path: "/pages-forgot-pwd", component: ForgetPwd1 },
  { path: "/pages-forgot-pwd-2", component: ForgetPwd2 },

  { path: "/auth-lock-screen", component: LockScreen },
  { path: "/auth-lock-screen-2", component: LockScreen2 },
  { path: "/page-confirm-mail", component: ConfirmMail },
  { path: "/page-confirm-mail-2", component: ConfirmMail2 },
  { path: "/auth-email-verification", component: EmailVerification },
  { path: "/auth-email-verification-2", component: EmailVerification2 },
  { path: "/auth-two-step-verification", component: TwostepVerification },
  { path: "/auth-two-step-verification-2", component: TwostepVerification2 },
];

export { authProtectedRoutes, publicRoutes };
