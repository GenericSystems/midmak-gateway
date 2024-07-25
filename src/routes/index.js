import React from "react";
import { Redirect } from "react-router-dom";

// Pages Component
import Chat from "../pages/Chat/Chat";

// Pages File Manager
import FileManager from "../pages/FileManager/index";

// Pages Calendar
import Calendar from "../pages/Calendar/index";

// User profile
import UserProfile from "../pages/Authentication/UserProfile";

//Tasks
import TasksList from "../pages/Tasks/tasks-list";
import TasksKanban from "../pages/Tasks/tasks-kanban";
import TasksCreate from "../pages/Tasks/tasks-create";

import Header from "../components/VerticalLayout/Header";

//Projects
import ProjectsGrid from "../pages/Projects/projects-grid";
import ProjectsList from "../pages/Projects/projects-list";
import ProjectsOverview from "../pages/Projects/ProjectOverview/projects-overview";
import ProjectsCreate from "../pages/Projects/projects-create";

//Ecommerce Pages
import EcommerceProducts from "../pages/Ecommerce/EcommerceProducts/index";
import EcommerceProductDetail from "../pages/Ecommerce/EcommerceProducts/EcommerceProductDetail";
import EcommerceOrders from "../pages/Ecommerce/EcommerceOrders/index";
import EcommerceCustomers from "../pages/Ecommerce/EcommerceCustomers/index";
import EcommerceCart from "../pages/Ecommerce/EcommerceCart";
import EcommerceCheckout from "../pages/Ecommerce/EcommerceCheckout";
import EcommerceShops from "../pages/Ecommerce/EcommerceShops/index";
import EcommerceAddProduct from "../pages/Ecommerce/EcommerceAddProduct";

//Email
import EmailInbox from "../pages/Email/email-inbox";
import EmailRead from "../pages/Email/email-read";
import EmailBasicTemplte from "../pages/Email/email-basic-templte";
import EmailAlertTemplte from "../pages/Email/email-template-alert";
import EmailTemplateBilling from "../pages/Email/email-template-billing";

//Invoices
import InvoicesList from "../pages/Invoices/invoices-list";
import InvoiceDetail from "../pages/Invoices/invoices-detail";

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

// Maps
import MapsGoogle from "../pages/Maps/MapsGoogle";
import MapsVector from "../pages/Maps/MapsVector";
import MapsLeaflet from "../pages/Maps/MapsLeaflet";

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

//university
import UniversityInfo from "../pages/university/university-def";
import UniversityTree from "../pages/university/university-organize-structure";

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

//Faculties
import EditableCourse from "../pages/Courses/courses";

//Nationality
import NationalitiesList from "../pages/Nationality/nationality-list";

//Relative
import RelativesList from "../pages/Relatives/relatives";

//LecturePeriod
import LecturePeriodsList from "../pages/Setting/Faculties/lecture-periods";

//CurrSemMan
import CurrSemMansList from "../pages/PriveledgeManagement/SystemManagement/current-semester";

//UserMng
import UserMngsList from "../pages/PriveledgeManagement/UserManagement/UserMngs";
//Roles
import RolesList from "../pages/PriveledgeManagement/UserManagement/roles";
//CoursesRegistration
import CoursesRegistrationList from "../pages/Faculties/Student-Affairs/courses-registration";

//GenerateSID
import GenerateSIDsList from "../pages/generate-SIDs/generate-SIDs";
//GeneralManagement
import GeneralManagementsList from "../pages/MobileApps/general-managements/generalManagements";

//mobAppFacultyAccs
import MobAppFacultyAccsList from "../pages/MobileApps/mob-app-faculty-accs/mobAppFacultyAccs";

//StudyPlans
import StudyPlansList from "../pages/Faculties/study-plans";


//Sector
import SectorsList from "../pages/Sectors/sectors";
//Academic  loads

import AcademicLoadList from "../pages/Setting/Faculties/Academic-Load";

//Warning
import warningsList from "../pages/Setting/Faculties/warning";

//PREREQS
import PrereqsList from "../pages/Setting/Faculties/prereq-conditions";

//PreReqType
import RequirementTypesList from "../pages/Setting/Faculties/requirement-Types";

//Certifcates
import Certificates from "../pages/Certificates/certificates";

//TrainersGrades
import TrainersGrades from "../pages/TrainersGrades/trainers-grades";

//cERTIFICATELEVELS
import CertificateLevelsList from "../pages/Certificateslevels/certificate-level";

//StudentManagementsList
import StudentManagementsList from "../pages/MobileApps/StudentManagements/student-management.js";

//Countries
import CountriesList from "../pages/Country/Country";

//governorates
import GovernoratesList from "../pages/Governorates/governorate";

//structures
import UniversityStructureList from "../pages/Universitystructures/university-structure";

//currencies
import CurrenciesList from "../pages/Setting/Finances/currencies";

//fines
import FinesList from "../pages/Setting/Finances/fines";

//fines
import FinesDefinitionList from "../pages/Finances/Definition/fines-definition";

//request fees
import RequestsFeesList from "../pages/Finances/Definition/requests-fees";

//fees
import FeesDefinitionList from "../pages/Finances/Definition/fees-definition";

//fines
import PeriodsList from "../pages/Finances/Definition/periods";

//services
import ServicesList from "../pages/Setting/Finances/services";

//requests
import RequestsList from "../pages/Setting/Finances/requests";

//Documents
import DocumentTypesList from "../pages/Setting/UniAdmission/documents-types";

//regReqDocuments
import RegReqDocumentsTable from "../pages/Setting/UniAdmission/reg-req-documents";

//Documents
import UniDocumentsList from "../pages/Setting/UniAdmission/uni-documents";

//Course Content
import coursecontents from "../pages/CourseContents/course-contents";

//Course Types
import courseTypes from "../pages/CourseTypes/course-types";

//Academiccertificate
import AcademicCertificates from "pages/AcademicCertificates/academic-certificates";

//StudentsHistory
import StudentsHistory from "pages/StudentsHistory/students-history";

//Course
import Courses from "pages/Courses/courses";

//Universityrequirement
import Universityrequirement from "../pages/Universityrequirements/university-requirement";

//Estimates
import estimates from "pages/Estimates/estimate";

//Levels
import LevelsList from "pages/Levels/levels";

//Schedules
import Schedules from "pages/Setting/Faculties/schedules";

//SchedulingLectures
import SchedulingLectures from "pages/Faculties/scheduling-lectures";

//Week Days
import WeekDays from "pages/WeekDays/weekDays";

import TimeLines from "pages/TimeLines/timeLine";

//Years
import YearsList from "pages/Years/years";

//Semesters
import SemestersList from "pages/Semesters/semesters";

//GrantSponsors
import GrantSponsors from "pages/GrantSponsors/grantSponsors";

//Contacts
import ContactsGrid from "../pages/Contacts/contacts-grid";
import ContactsList from "../pages/Contacts/ContactList/contacts-list";
import ContactsProfile from "../pages/Contacts/ContactsProfile/contacts-profile";

//Blog
import BlogList from "../pages/Blog/BlogList/index";
import BlogGrid from "../pages/Blog/BlogGrid/index";
import BlogDetails from "../pages/Blog/BlogDetails";
import contactsList from "../pages/Contacts/ContactList/contacts-list";

//City
import CitiesList from "../pages/Cities/cities";

//DistributingCoursesMethods

import DistributingCoursesMethods from "../pages/Faculties/Exams/Distributing-courses-methods";

// letter Grades

import LetterGradesTree from "pages/Setting/Faculties/letter-grades";

import TransportLinesTree from "pages/TransportationLines/transport-lines-def";

import StdsTransportLine from "pages/TransportationLines/trans-lines-stds";

// leveling Decisions

import LevelingDecisionsTree from "pages/Setting/Faculties/leveling-decisions";

//Grades
import GradesList from "../pages/Faculties/Exams/grades";

import CheckGradesList from "../pages/Faculties/Exams/check-grades";

// gender

import GendersList from "../pages/Genders/genders";

// grants

import GrantsList from "../pages/Grants/grants";

//reset password
import ResetPassword from "../pages/MobileApps/reset-password/reset-password";

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

  //City
  { path: "/cities", component: CitiesList },
  //gender
  { path: "/genders", component: GendersList },

  //grant
  { path: "/grants", component: GrantsList },

  //chat
  { path: "/chat", component: Chat },

  //File Manager
  { path: "/apps-filemanager", component: FileManager },

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

  //Email
  { path: "/email-inbox", component: EmailInbox },
  { path: "/email-read", component: EmailRead },
  { path: "/email-template-basic", component: EmailBasicTemplte },
  { path: "/email-template-alert", component: EmailAlertTemplte },
  { path: "/email-template-billing", component: EmailTemplateBilling },

  //Invoices
  { path: "/invoices-list", component: InvoicesList },
  { path: "/invoices-detail", component: InvoiceDetail },
  { path: "/invoices-detail/:id", component: InvoiceDetail },

  // Tasks
  { path: "/tasks-list", component: TasksList },
  { path: "/tasks-kanban", component: TasksKanban },
  { path: "/tasks-create", component: TasksCreate },


  { path: "/Header", component: Header },

  //Projects
  { path: "/projects-grid", component: ProjectsGrid },
  { path: "/projects-list", component: ProjectsList },
  { path: "/projects-overview", component: ProjectsOverview },
  { path: "/projects-overview/:id", component: ProjectsOverview },
  { path: "/projects-create", component: ProjectsCreate },

  //lecturePeriods
  { path: "/lecture-periods", component: LecturePeriodsList },

  //CurrSemMansList
  { path: "/current-semester", component: CurrSemMansList },
  //UserMngsList
  { path: "/users", component: UserMngsList },
  //RolesList
  { path: "/roles", component: RolesList },

  //coursesregistrations
  { path: "/courses-registration", component: CoursesRegistrationList },

  //GenerateSIDs
  { path: "/generate-SIDs", component: GenerateSIDsList },

  //general managements
  { path: "/general-managements", component: GeneralManagementsList },

  //mobAppFacultyAccs
  { path: "/mob-app-faculty-accs", component: MobAppFacultyAccsList },

  //sectors
  { path: "/sectors", component: SectorsList },

  //Academic loads
  { path: "/Academic-Load", component: AcademicLoadList },

  { path: "/warning", component: warningsList },

  //PreReqTypes
  { path: "/requirement-Types", component: RequirementTypesList },

  //StudyPlans
  { path: "/study-plans", component: StudyPlansList },

  //prerequisites
  { path: "/prereq-conditions", component: PrereqsList },

  // Certificates
  { path: "/certificates", component: Certificates },

  // TrainersGrades
  { path: "/trainers-grades", component: TrainersGrades },

  { path: "/certificate-Level", component: CertificateLevelsList },
  // StudentManagement
  { path: "/student-management", component: StudentManagementsList },

  //Nationalities
  { path: "/nationality-list", component: NationalitiesList },

  //Relatives
  { path: "/relatives", component: RelativesList },

  //Countries
  { path: "/country", component: CountriesList },

  //Governorates
  { path: "/governorate", component: GovernoratesList },

  //Documents Types
  { path: "/documents-types", component: DocumentTypesList },

  //Uni Documents
  { path: "/uni-documents", component: UniDocumentsList },

  //Reg Req Documents
  { path: "/reg-req-documents", component: RegReqDocumentsTable },

  //university Structure
  { path: "/university-structure", component: UniversityStructureList },

  //Currencies
  { path: "/currencies", component: CurrenciesList },

  //Fines
  { path: "/fines", component: FinesList },

  //Fines Definition
  { path: "/fines-definition", component: FinesDefinitionList },

  //requests Fees
  { path: "/requests-fees", component: RequestsFeesList },

  //fees Definition
  { path: "/fees-definition", component: FeesDefinitionList },

  //Periods
  { path: "/periods", component: PeriodsList },

  //Services
  { path: "/services", component: ServicesList },

  //Requests
  { path: "/requests", component: RequestsList },

  //Course Contents
  { path: "/course-contents", component: coursecontents },

  //Course Types
  { path: "/course-types", component: courseTypes },

  //AcademicCertificates
  { path: "/academic-certificates", component: AcademicCertificates },

  //StudentsHistory
  { path: "/students-history", component: StudentsHistory },

  //Courses
  { path: "/courses", component: Courses },

  //Universityrequirement
  { path: "/university-requirement", component: Universityrequirement },

  //Levels
  { path: "/levels", component: LevelsList },

  //Schedules
  { path: "/schedules", component: Schedules },

  //SchedulingLectures
  { path: "/scheduling-lectures", component: SchedulingLectures },

  //Week Days
  { path: "/weekDays", component: WeekDays },

  //timelines
  { path: "/timeLine", component: TimeLines },

  //Years
  { path: "/years", component: YearsList },

  //Semesters
  { path: "/semesters", component: SemestersList },

  //GrantSponsors
  { path: "/grant-sponsors", component: GrantSponsors },

  //Estimates
  { path: "/estimate", component: estimates },

  //grades
  { path: "/grades", component: GradesList },
  { path: "/check-grades", component: CheckGradesList },

  {
    path: "/Distributing-courses-methods",
    component: DistributingCoursesMethods,
  },

  { path: "/letter-grades", component: LetterGradesTree },

  { path: "/transport-lines-def", component: TransportLinesTree },

  { path: "/trans-lines-stds", component: StdsTransportLine },

  { path: "/leveling-decisions", component: LevelingDecisionsTree },

  //reset-password
  { path: "/reset-password", component: ResetPassword },

  // Contacts
  { path: "/contacts-grid", component: ContactsGrid },
  { path: "/contacts-list", component: ContactsList },
  { path: "/contacts-profile", component: ContactsProfile },

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

  // Maps
  { path: "/maps-google", component: MapsGoogle },
  { path: "/maps-vector", component: MapsVector },
  { path: "/maps-leaflet", component: MapsLeaflet },

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

  //University
  { path: "/university-def", component: UniversityInfo },
  { path: "/university-organize-structure", component: UniversityTree },
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
  //Faculties
  { path: "/courses", component: EditableCourse },
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
