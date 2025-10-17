import React, { Component } from "react";
import classnames from "classnames";

import {
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  CardTitle,
  Input,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  InputGroup,
  FormGroup,
  TabContent,
  TabPane,
} from "reactstrap";
import * as Yup from "yup";
import Tooltip from "@mui/material/Tooltip";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import filterFactory, {
  textFilter,
  customFilter,
} from "react-bootstrap-table2-filter";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Select from "react-select";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import Accordion from "react-bootstrap/Accordion";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as moment from "moment";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import { withRouter, Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";

import // getTrainees,
// addNewTrainee,
// updateTrainee,
// deleteTrainee,
// getTraineeById,
// getTraineeRegReqDocs,
"store/trainees/actions";
import { getYears } from "store/years/actions";
import { BackburgerIcon } from "@icons/material";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
class TraineesReportList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trainees: {},
      trainee: "",
      years: [],
      errorMessage: null,
      sidebarOpen: true,
      deleteModal: false,
      selectedRowId: null,
      isEdit: false,
      showRegisterStatus: false,
      showStartDate: false,
      showTraineeStatus: false,
      showYear: false,
      showPracticalMarks: false,
      showFinalExam: false,
      showGradingMethod: false,
      showTest3Ent: false,
      BirthLocation: false,
      showCourseName: false,
      showCourseCode: false,
      showAcademicYear: false,
      showFinalMarks: false,
      showGrade: false,
      showTotalMarksEnt: false,
      showPracticalMarksEnt: false,
      showFinalExamEnt: false,
      showTest2Ent: false,
      showTest4Ent: false,
      showTest5Ent: false,
      showTest6Ent: false,
      showTest1Ent: false,
      showTest7Ent: false,
      showTotalMarksAud: false,
      showFaculty: false,
      showSpecialty: false,
      showTest3Aud: false,
      showPracticalMarksAud: false,
      showTest1Aud: false,
      showFinalExamAud: false,
      showTest2Aud: false,
      showTest4Aud: false,
      showTest5Aud: false,
      showTotalMarksArch: false,
      showTest7Aud: false,
      showTest6Aud: false,
      showPracticalMarksArch: false,
      showFinalExamArch: false,
      showTest1Arch: false,
      showTest2Arch: false,
      showTest3Arch: false,
      showTest4Arch: false,
      showTest5Arch: false,
      showTest6Arch: false,
      showTest7Arch: false,
      modal: false,
      modal1: false,
      selectedMulti: null,
    };
  }

  componentDidMount() {
    const lang = localStorage.getItem("I18N_LANGUAGE");
    const {
      diplomalevels,
      nationalities,
      countries,
      cities,
      governorates,
      regReqDocuments,
      genders,
      certificatelevels,
      regcertificates,
      trainees,
      tempTrainee,
      traineeStatus,
      faculties,
      onGetTrainees,
      onGetYears,
      deleted,
      user_menu,
      years,
      i18n,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    // if (trainees && !trainees.length) {
    // onGetTrainees(lang);
    onGetYears();
    this.setState({ trainees, years, tempTrainee });
    this.setState({
      deleted,
      certificatelevels,
      genders,
      regReqDocuments,
      governorates,
      cities,
      countries,
      faculties,
      nationalities,
      regcertificates,
      diplomalevels,
      traineeStatus,
    });
    // }

    let curentueardata = localStorage.getItem("authUser");
    if (curentueardata) {
      try {
        const parsed = JSON.parse(curentueardata);
        const firstYear = parsed[0];
        const selectedYear = {
          value: firstYear.currentYearId,
          label: firstYear.currentYearName,
        };
        this.setState({
          selectedYear,
          currentYearObj: {
            currentYearId: firstYear.currentYearId,
            currentYearName: firstYear.currentYearName,
          },
        });
      } catch (error) {
        console.error("Error parsing authUser:", error);
      }
    }
    this.setState({ languageState: lang });

    i18n.on("languageChanged", this.handleLanguageChange);
    console.log(this.state.currentYearObj, "gggg");
  }
  handleLanguageChange = lng => {
    const lang = localStorage.getItem("I18N_LANGUAGE");

    if (lang != lng) {
      this.setState({ languageState: lng });
    }
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.user_menu !== prevProps.user_menu ||
      this.props.location.pathname !== prevProps.location.pathname
    ) {
      this.updateShowAddButton(
        this.props.user_menu,
        this.props.location.pathname
      );
      this.updateShowDeleteButton(
        this.props.user_menu,
        this.props.location.pathname
      );
      this.updateShowSearchButton(
        this.props.user_menu,
        this.props.location.pathname
      );
    }
  }
  updateShowAddButton = (menu, pathname) => {
    const showAddButton = checkIsAddForPage(menu, pathname);
    this.setState({ showAddButton });
  };

  updateShowDeleteButton = (menu, pathname) => {
    const showDeleteButton = checkIsDeleteForPage(menu, pathname);
    this.setState({ showDeleteButton });
  };

  updateShowSearchButton = (menu, pathname) => {
    const showSearchButton = checkIsSearchForPage(menu, pathname);
    this.setState({ showSearchButton });
  };

  // toggle = () => {
  //   this.setState(prevState => ({
  //     modal: !prevState.modal,
  //   }));
  //   this.props.onGetTrainees();
  // };

  toggle1 = () => {
    this.setState(prevState => ({
      modal1: !prevState.modal1,
    }));
  };

  onPaginationPageChange = page => {
    if (
      this.node &&
      this.node.current &&
      this.node.current.props &&
      this.node.current.props.pagination &&
      this.node.current.props.pagination.options
    ) {
      this.node.current.props.pagination.options.onPageChange(page);
    }
  };

  handleSuccessClose = () => {
    this.setState({ successMessage: null });
  };

  handleExpSuccessClose = () => {
    this.setState({ successMessage1: null, showAlert: null });
  };

  handleExpErrorClose = () => {
    this.setState({ errorMessage1: null, showAlert: null });
  };

  handleErrorClose = () => {
    this.setState({ errorMessage: null });
  };

  toggleSidebar() {
    this.setState(prevState => ({
      sidebarOpen: !prevState.sidebarOpen,
    }));
  }

  handleDeleteRow = () => {
    const { onDeleteStdWarningTest } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteStdWarningTest({ Id: selectedRowId.Id });

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };

  handleShowColumn = fieldName => {
    if (fieldName == "registerStatus") {
      this.setState(prevState => ({
        showRegisterStatus: !prevState.showRegisterStatus,
      }));
    }
    if (fieldName == "startDate") {
      this.setState(prevState => ({
        showStartDate: !prevState.showStartDate,
      }));
    }

    if (fieldName == "practicalMarks") {
      this.setState(prevState => ({
        showPracticalMarks: !prevState.showPracticalMarks,
      }));
    }

    if (fieldName == "finalExam") {
      this.setState(prevState => ({
        showFinalExam: !prevState.showFinalExam,
      }));
    }
    if (fieldName == "gradingMethod") {
      this.setState(prevState => ({
        showGradingMethod: !prevState.showGradingMethod,
      }));
    }

    if (fieldName == "test3Ent") {
      this.setState(prevState => ({
        showTest3Ent: !prevState.showTest3Ent,
      }));
    }

    if (fieldName == "BirthLocation") {
      this.setState(prevState => ({
        BirthLocation: !prevState.BirthLocation,
      }));
    }

    if (fieldName == "courseName") {
      this.setState(prevState => ({
        showCourseName: !prevState.showCourseName,
      }));
    }

    if (fieldName == "courseCode") {
      this.setState(prevState => ({
        showCourseCode: !prevState.showCourseCode,
      }));
    }

    if (fieldName == "academicYear") {
      this.setState(prevState => ({
        showAcademicYear: !prevState.showAcademicYear,
      }));
    }

    if (fieldName == "finalMarks") {
      this.setState(prevState => ({
        showFinalMarks: !prevState.showFinalMarks,
      }));
    }

    if (fieldName == "grade") {
      this.setState(prevState => ({
        showGrade: !prevState.showGrade,
      }));
    }

    if (fieldName == "totalMarksEnt") {
      this.setState(prevState => ({
        showTotalMarksEnt: !prevState.showTotalMarksEnt,
      }));
    }

    if (fieldName == "practicalMarksEnt") {
      this.setState(prevState => ({
        showPracticalMarksEnt: !prevState.showPracticalMarksEnt,
      }));
    }

    if (fieldName == "finalExamEnt") {
      this.setState(prevState => ({
        showFinalExamEnt: !prevState.showFinalExamEnt,
      }));
    }

    if (fieldName == "test1Ent") {
      this.setState(prevState => ({
        showTest1Ent: !prevState.showTest1Ent,
      }));
    }

    if (fieldName == "test2Ent") {
      this.setState(prevState => ({
        showTest2Ent: !prevState.showTest2Ent,
      }));
    }

    if (fieldName == "test4Ent") {
      this.setState(prevState => ({
        showTest4Ent: !prevState.showTest4Ent,
      }));
    }

    if (fieldName == "test5Ent") {
      this.setState(prevState => ({
        showTest5Ent: !prevState.showTest5Ent,
      }));
    }

    if (fieldName == "test6Ent") {
      this.setState(prevState => ({
        showTest6Ent: !prevState.showTest6Ent,
      }));
    }

    if (fieldName == "yearId") {
      this.setState(prevState => ({
        showYear: !prevState.showYear,
      }));
    }

    if (fieldName == "traineeStatusId") {
      this.setState(prevState => ({
        showTraineeStatus: !prevState.showTraineeStatus,
      }));
    }

    if (fieldName == "test7Ent") {
      this.setState(prevState => ({
        showTest7Ent: !prevState.showTest7Ent,
      }));
    }

    if (fieldName == "totalMarksAud") {
      this.setState(prevState => ({
        showTotalMarksAud: !prevState.showTotalMarksAud,
      }));
    }

    if (fieldName == "Faculty") {
      this.setState(prevState => ({
        showFaculty: !prevState.showFaculty,
      }));
    }

    if (fieldName == "plan_study") {
      this.setState(prevState => ({
        showSpecialty: !prevState.showSpecialty,
      }));
    }

    if (fieldName == "practicalMarksAud") {
      this.setState(prevState => ({
        showPracticalMarksAud: !prevState.showPracticalMarksAud,
      }));
    }

    if (fieldName == "test1Aud") {
      this.setState(prevState => ({
        showTest1Aud: !prevState.showTest1Aud,
      }));
    }

    if (fieldName == "test3Aud") {
      this.setState(prevState => ({
        showTest3Aud: !prevState.showTest3Aud,
      }));
    }

    if (fieldName == "test6Aud") {
      this.setState(prevState => ({
        showTest6Aud: !prevState.showTest6Aud,
      }));
    }

    if (fieldName == "test5Aud") {
      this.setState(prevState => ({
        showTest5Aud: !prevState.showTest5Aud,
      }));
    }

    if (fieldName == "finalExamAud") {
      this.setState(prevState => ({
        showFinalExamAud: !prevState.showFinalExamAud,
      }));
    }

    if (fieldName == "test2Aud") {
      this.setState(prevState => ({
        showTest2Aud: !prevState.showTest2Aud,
      }));
    }

    if (fieldName == "test4Aud") {
      this.setState(prevState => ({
        showTest4Aud: !prevState.showTest4Aud,
      }));
    }

    if (fieldName == "test7Aud") {
      this.setState(prevState => ({
        showTest7Aud: !prevState.showTest7Aud,
      }));
    }

    if (fieldName == "totalMarksArch") {
      this.setState(prevState => ({
        showTotalMarksArch: !prevState.showTotalMarksArch,
      }));
    }

    if (fieldName == "practicalMarksArch") {
      this.setState(prevState => ({
        showPracticalMarksArch: !prevState.showPracticalMarksArch,
      }));
    }

    if (fieldName == "finalExamArch") {
      this.setState(prevState => ({
        showFinalExamArch: !prevState.showFinalExamArch,
      }));
    }

    if (fieldName == "test1Arch") {
      this.setState(prevState => ({
        showTest1Arch: !prevState.showTest1Arch,
      }));
    }

    if (fieldName == "test2Arch") {
      this.setState(prevState => ({
        showTest2Arch: !prevState.showTest2Arch,
      }));
    }

    if (fieldName == "test3Arch") {
      this.setState(prevState => ({
        showTest3Arch: !prevState.showTest3Arch,
      }));
    }

    if (fieldName == "test4Arch") {
      this.setState(prevState => ({
        showTest4Arch: !prevState.showTest4Arch,
      }));
    }

    if (fieldName == "test5Arch") {
      this.setState(prevState => ({
        showTest5Arch: !prevState.showTest5Arch,
      }));
    }

    if (fieldName == "test6Arch") {
      this.setState(prevState => ({
        showTest6Arch: !prevState.showTest6Arch,
      }));
    }

    if (fieldName == "test7Arch") {
      this.setState(prevState => ({
        showTest7Arch: !prevState.showTest7Arch,
      }));
    }

    if (fieldName == "CurrentAddrCell") {
      this.setState(prevState => ({
        showCurrentAddrCell: !prevState.showCurrentAddrCell,
      }));
    }

    if (fieldName == "PermanentAddress") {
      this.setState(prevState => ({
        showPermanentAddress: !prevState.showPermanentAddress,
      }));
    }

    if (fieldName == "ParentAddrPhone") {
      this.setState(prevState => ({
        showParentAddrPhone: !prevState.showParentAddrPhone,
      }));
    }

    if (fieldName == "WhatsappMobileNum") {
      this.setState(prevState => ({
        showWhatsappMobileNum: !prevState.showWhatsappMobileNum,
      }));
    }

    if (fieldName == "Email") {
      this.setState(prevState => ({
        showEmail: !prevState.showEmail,
      }));
    }

    if (fieldName == "workType") {
      this.setState(prevState => ({
        showJobTitle: !prevState.showJobTitle,
      }));
    }

    if (fieldName == "companyName") {
      this.setState(prevState => ({
        showWorkPlace: !prevState.showWorkPlace,
      }));
    }

    if (fieldName == "workPlace") {
      this.setState(prevState => ({
        showWorkAddress: !prevState.showWorkAddress,
      }));
    }

    if (fieldName == "workField") {
      this.setState(prevState => ({
        showWorkField: !prevState.showWorkField,
      }));
    }

    if (fieldName == "duaration") {
      this.setState(prevState => ({
        showWorkDuration: !prevState.showWorkDuration,
      }));
    }

    if (fieldName == "registerYear") {
      this.setState(prevState => ({
        showRegisterYear: !prevState.showRegisterYear,
      }));
    }

    if (fieldName == "admissionDate") {
      this.setState(prevState => ({
        showAdmissionDate: !prevState.showAdmissionDate,
      }));
    }

    if (fieldName == "lastRegCourse") {
      this.setState(prevState => ({
        showLastRegCourse: !prevState.showLastRegCourse,
      }));
    }

    if (fieldName == "courseStatus") {
      this.setState(prevState => ({
        showCourseStatus: !prevState.showCourseStatus,
      }));
    }
    if (fieldName == "decisionCode") {
      this.setState(prevState => ({
        showDecisionCode: !prevState.showDecisionCode,
      }));
    }
    if (fieldName == "decisionType") {
      this.setState(prevState => ({
        showDecisionType: !prevState.showDecisionType,
      }));
    }
    if (fieldName == "decisionDate") {
      this.setState(prevState => ({
        showDecisionDate: !prevState.showDecisionDate,
      }));
    }
    if (fieldName == "applyingDate") {
      this.setState(prevState => ({
        showApplyingDate: !prevState.showApplyingDate,
      }));
    }
    if (fieldName == "academyCouncilNo") {
      this.setState(prevState => ({
        showAcademyCouncilNo: !prevState.showAcademyCouncilNo,
      }));
    }
    if (fieldName == "academyCouncilDate") {
      this.setState(prevState => ({
        showAcademyCouncilDate: !prevState.showAcademyCouncilDate,
      }));
    }
    if (fieldName == "decisionNote") {
      this.setState(prevState => ({
        showDecisionNote: !prevState.showDecisionNote,
      }));
    }
  };

  handleValidDate = date => {
    const date1 = moment(new Date(date)).format("DD /MM/ Y");
    return date1;
  };

  handleSelectYear = (name, value) => {
    document.getElementById("square-switch1").checked = false;
    this.setState({
      selectedYear: value,
      currentYearObj: {
        currentYearId: value.value,
        currentYearName: value.label,
      },
    });
  };
  //export excel
  exportToExcel = () => {
    const { trainees } = this.state;

    const worksheet = XLSX.utils.json_to_sheet(trainees);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trainees");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "trainees.xlsx");
  };

  render() {
    const { trainees, deleted, years, t } = this.props;
    const {
      trainee,
      selectedYear,
      selectedtest7Ent,
      selectedtotalMarksAud,
      languageState,
      duplicateError,
      sidebarOpen,
      deleteModal,
      showTraineeStatus,
      showYear,
      showRegisterStatus,
      showStartDate,
      showPracticalMarks,
      showFinalExam,
      showGradingMethod,
      showTest3Ent,
      BirthLocation,
      showCourseName,
      showCourseCode,
      showAcademicYear,
      showFinalMarks,
      showTotalMarksEnt,
      showPracticalMarksEnt,
      showFinalExamEnt,
      showTest1Ent,
      showTest2Ent,
      showTest4Ent,
      showTest6Ent,
      showTest5Ent,
      showFaculty,
      showSpecialty,
      showTest5Aud,
      showPracticalMarksAud,
      showTest3Aud,
      showTest1Aud,
      showTest2Aud,
      showTest4Aud,
      showFinalExamAud,
      showTest6Aud,
      showTotalMarksArch,
      showPracticalMarksArch,
      showFinalExamArch,
      showTest7Aud,
      showTest5Arch,
      showTest1Arch,
      showTest4Arch,
      showTest2Arch,
      showTest7Ent,
      showTotalMarksAud,
      showTest3Arch,
      showTest6Arch,
      showCurrentAddrCell,
      showTest7Arch,
      showEmail,
      showWhatsappMobileNum,
      showParentAddrPhone,
      showPermanentAddress,
      showJobTitle,
      showWorkDuration,
      showWorkField,
      showWorkPlace,
      showWorkAddress,
      showAdmissionDate,
      showRegisterYear,
      showLastRegCourse,
      showGrade,
      showCourseStatus,
      showDecisionCode,
      showDecisionNote,
      showDecisionType,
      showDecisionDate,
      showApplyingDate,
      showAcademyCouncilDate,
      showAcademyCouncilNo,
      showAlert,
    } = this.state;
    console.log("88888", years, selectedYear);
    const { SearchBar } = Search;

    console.log("trainees", trainees);
    const alertMessage =
      deleted == 0
        ? this.props.t("Can't Delete")
        : this.props.t("Deleted Successfully");

    const defaultSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];

    const selectRow = {
      mode: "checkbox",
    };

    const MainInfoColumns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      {
        dataField: "TraineeNum",
        text: this.props.t("Trainee Num"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "fullName",
        text: this.props.t("Trainee Name"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "traineeStatus",
        text: this.props.t("Trainee Status"),
        sort: true,
        editable: false,
        hidden: !showTraineeStatus,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "courseName",
        text: this.props.t("Course Name"),
        sort: true,
        editable: false,
        hidden: !showCourseName,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "courseCode",
        text: this.props.t("Course Code"),
        sort: true,
        editable: false,
        hidden: !showCourseCode,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "academicYear",
        text: this.props.t("Academic Year"),
        sort: true,
        editable: false,
        hidden: !showAcademicYear,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "registerStatus",
        text: this.props.t("Register Status"),
        sort: true,
        editable: false,
        hidden: !showRegisterStatus,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "startDate",
        text: this.props.t("Start Date"),
        sort: true,
        editable: false,
        hidden: !showStartDate,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "courseStatus",
        text: this.props.t("Course Status"),
        sort: true,
        editable: false,
        hidden: !showCourseStatus,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "practicalMarks",
        text: this.props.t("Practical Marks - Full Mark"),
        sort: true,
        editable: false,
        hidden: !showPracticalMarks,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "finalExam",
        text: this.props.t("Final Exam - Full Mark"),
        sort: true,
        editable: false,
        hidden: !showFinalExam,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "gradingMethod",

        text: this.props.t("Grading Method"),
        sort: true,
        editable: false,
        hidden: !showGradingMethod,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "grade",
        text: this.props.t("Grade"),
        sort: true,
        editable: false,
        hidden: !showGrade,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "finalMarks",
        text: this.props.t("Final Marks"),
        sort: true,
        editable: false,
        hidden: !showFinalMarks,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "totalMarksEnt",
        text: this.props.t("Total Marks (Enter)"),
        editable: false,
        sort: true,
        hidden: !showTotalMarksEnt,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "practicalMarksEnt",
        text: this.props.t("Practical Marks (Enter)"),
        editable: false,
        sort: true,
        hidden: !showPracticalMarksEnt,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "finalExamEnt",
        text: this.props.t("Final Exam (Enter)"),
        editable: false,
        sort: true,
        hidden: !showFinalExamEnt,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "test1Ent",
        text: this.props.t("Test1 (Enter)"),
        editable: false,
        sort: true,
        hidden: !showTest1Ent,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "test2Ent",
        text: this.props.t("Test2 (Enter)"),
        editable: false,
        sort: true,
        hidden: !showTest2Ent,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "test3Ent",

        text: this.props.t("Test3 (Enter)"),
        sort: true,
        editable: false,
        hidden: !showTest3Ent,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "test4Ent",
        text: this.props.t("Test4 (Enter)"),
        editable: false,
        sort: true,
        hidden: !showTest4Ent,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "test5Ent",
        text: this.props.t("Test5 (Enter)"),
        editable: false,
        sort: true,
        hidden: !showTest5Ent,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "test6Ent",
        text: this.props.t("Test6 (Enter)"),
        editable: false,
        sort: true,
        hidden: !showTest6Ent,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "test7Ent",
        text: this.props.t("Test7 (Enter)"),
        editable: false,
        sort: true,
        hidden: !showTest7Ent,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "totalMarksAud",
        text: this.props.t("Total Marks (Audit)"),
        editable: false,
        sort: true,
        hidden: !showTotalMarksAud,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "practicalMarksAud",
        text: this.props.t("Practical Marks (Audit)"),
        editable: false,
        sort: true,
        hidden: !showPracticalMarksAud,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "finalExamAud",
        text: this.props.t("Final Exam (Audit)"),
        editable: false,
        sort: true,
        hidden: !showFinalExamAud,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "test1Aud",
        text: this.props.t("Test1 (Audit)"),
        editable: false,
        sort: true,
        hidden: !showTest1Aud,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "test2Aud",
        text: this.props.t("Test2 (Audit)"),
        editable: false,
        sort: true,
        hidden: !showTest2Aud,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "test3Aud",
        text: this.props.t("Test3 (Audit)"),
        editable: false,
        sort: true,
        hidden: !showTest3Aud,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "test4Aud",
        text: this.props.t("Test4 (Audit)"),
        editable: false,
        sort: true,
        hidden: !showTest4Aud,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "test5Aud",
        text: this.props.t("Test5 (Audit)"),
        editable: false,
        sort: true,
        hidden: !showTest5Aud,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "test6Aud",
        text: this.props.t("Test6 (Audit)"),
        editable: false,
        sort: true,
        hidden: !showTest6Aud,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "test7Aud",
        text: this.props.t("Test7 (Audit)"),
        editable: false,
        sort: true,
        hidden: !showTest7Aud,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "totalMarksArch",
        text: this.props.t("Total Marks (Archive)"),
        editable: false,
        sort: true,
        hidden: !showTotalMarksArch,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "practicalMarksArch",
        text: this.props.t("Practical Marks (Archive)"),
        editable: false,
        sort: true,
        hidden: !showPracticalMarksArch,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "finalExamArch",
        text: this.props.t("Final Exam (Archive)"),
        editable: false,
        sort: true,
        hidden: !showFinalExamArch,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "test1Arch",
        text: this.props.t("Test1 (Archive)"),
        editable: false,
        sort: true,
        hidden: !showTest1Arch,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "test2Arch",
        text: this.props.t("Test2 (Archive)"),
        editable: false,
        sort: true,
        hidden: !showTest2Arch,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "test3Arch",
        text: this.props.t("Test3 (Archive)"),
        editable: false,
        sort: true,
        hidden: !showTest3Arch,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "test4Arch",
        text: this.props.t("Test4 (Archive)"),
        editable: false,
        sort: true,
        hidden: !showTest4Arch,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "test5Arch",
        text: this.props.t("Test5 (Archive)"),
        editable: false,
        sort: true,
        hidden: !showTest5Arch,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "test6Arch",
        text: this.props.t("Test6 (Archive)"),
        editable: false,
        sort: true,
        hidden: !showTest6Arch,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      ,
      {
        dataField: "test7Arch",
        text: this.props.t("Test7 (Archive)"),
        editable: false,
        sort: true,
        hidden: !showTest7Arch,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "action",
        text: "",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, trainee) => (
          <div className="d-flex justify-content-center gap-3">
            {/* {showDeleteButton && (
              <Tooltip title={this.props.t("Delete")} placement="top">
                <IconButton color="danger">
                  <i
                    className="mdi mdi-delete font-size-18 text-danger"
                    id="deletetooltip"
                    onClick={() => this.onClickDelete(warning)}
                  ></i>
                </IconButton>
              </Tooltip>
            )} */}

            <Tooltip title={this.props.t("View Trainee")} placement="top">
              <IconButton>
                <i
                  className="bx bxs-user font-size-18 text-secondary"
                  id="deletetooltip"
                  onClick={() => this.handleViewTrainee(trainee)}
                ></i>
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: trainees.length,
      custom: true,
    };

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteRow}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <div className="container-fluid">
            <Breadcrumbs breadcrumbItem={t("Trainees Grade Details Report")} />

            <Row>
              {sidebarOpen && (
                <Row>
                  <Col lg={2}>
                    <div
                      style={{
                        marginLeft: "220px",
                        padding: "20px",
                        textAlign: "center",
                      }}
                    >
                      <Card className="accordion-card">
                        <CardHeader className="card-header1">
                          {t("Required data")}
                        </CardHeader>
                        <CardBody style={{ padding: "0" }}>
                          <Accordion flush>
                            <Accordion.Item eventKey="0">
                              <Accordion.Header>
                                {t("Trainee Info")}
                              </Accordion.Header>
                              <Accordion.Body>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck1"
                                        autoComplete="off"
                                        defaultChecked={showTraineeStatus}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "traineeStatusId"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck1"
                                      >
                                        {this.props.t("Trainee Status")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck2"
                                        autoComplete="off"
                                        defaultChecked={showCourseName}
                                        onClick={() =>
                                          this.handleShowColumn("courseName")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck2"
                                      >
                                        {this.props.t("Course Name")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck3"
                                        autoComplete="off"
                                        defaultChecked={showCourseCode}
                                        onClick={() =>
                                          this.handleShowColumn("courseCode")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck3"
                                      >
                                        {this.props.t("Course Code")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck5"
                                        autoComplete="off"
                                        defaultChecked={showAcademicYear}
                                        onClick={() =>
                                          this.handleShowColumn("academicYear")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck5"
                                      >
                                        {this.props.t("Academic Year")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck6"
                                        autoComplete="off"
                                        defaultChecked={showRegisterStatus}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "registerStatus"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check big-width-check"
                                        htmlFor="btncheck6"
                                      >
                                        {this.props.t("Register Status")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck43"
                                        autoComplete="off"
                                        defaultChecked={showStartDate}
                                        onClick={() =>
                                          this.handleShowColumn("startDate")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check big-width-check"
                                        htmlFor="btncheck43"
                                      >
                                        {this.props.t("Start Date")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck7"
                                        autoComplete="off"
                                        defaultChecked={showCourseStatus}
                                        onClick={() =>
                                          this.handleShowColumn("courseStatus")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check big-width-check"
                                        htmlFor="btncheck7"
                                      >
                                        {this.props.t("Course Status")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck8"
                                        autoComplete="off"
                                        defaultChecked={showPracticalMarks}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "practicalMarks"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check big-width-check"
                                        htmlFor="btncheck8"
                                      >
                                        {this.props.t(
                                          "Practical Marks - Full Mark"
                                        )}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck9"
                                        autoComplete="off"
                                        defaultChecked={showFinalExam}
                                        onClick={() =>
                                          this.handleShowColumn("finalExam")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck9"
                                      >
                                        {this.props.t("Final Exam - Full Mark")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck10"
                                        autoComplete="off"
                                        defaultChecked={showGradingMethod}
                                        onClick={() =>
                                          this.handleShowColumn("gradingMethod")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck10"
                                      >
                                        {this.props.t("Grading Method")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck11"
                                        autoComplete="off"
                                        defaultChecked={showGrade}
                                        onClick={() =>
                                          this.handleShowColumn("grade")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck11"
                                      >
                                        {this.props.t("Grade")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>

                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck12"
                                        autoComplete="off"
                                        defaultChecked={showFinalMarks}
                                        onClick={() =>
                                          this.handleShowColumn("finalMarks")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck12"
                                      >
                                        {this.props.t("Final Marks")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                              </Accordion.Body>{" "}
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                              <Accordion.Header>
                                {t("Enter Marks")}
                              </Accordion.Header>
                              <Accordion.Body>
                                <Col>
                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck13"
                                          autoComplete="off"
                                          defaultChecked={showTotalMarksEnt}
                                          onClick={() =>
                                            this.handleShowColumn(
                                              "totalMarksEnt"
                                            )
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck13"
                                        >
                                          {this.props.t("Total Marks (Enter)")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>

                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck14"
                                          autoComplete="off"
                                          defaultChecked={showPracticalMarksEnt}
                                          onClick={() =>
                                            this.handleShowColumn(
                                              "practicalMarksEnt"
                                            )
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck14"
                                        >
                                          {this.props.t(
                                            "Practical Marks (Enter)"
                                          )}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>

                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck15"
                                          autoComplete="off"
                                          defaultChecked={showFinalExamEnt}
                                          onClick={() =>
                                            this.handleShowColumn(
                                              "finalExamEnt"
                                            )
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck15"
                                        >
                                          {this.props.t("Final Exam (Enter)")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>

                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck16"
                                          autoComplete="off"
                                          defaultChecked={showTest1Ent}
                                          onClick={() =>
                                            this.handleShowColumn("test1Ent")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck16"
                                        >
                                          {this.props.t("Test1 (Enter)")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck17"
                                          autoComplete="off"
                                          defaultChecked={showTest2Ent}
                                          onClick={() =>
                                            this.handleShowColumn("test2Ent")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck17"
                                        >
                                          {this.props.t("Test2 (Enter)")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck18"
                                          autoComplete="off"
                                          defaultChecked={showTest3Ent}
                                          onClick={() =>
                                            this.handleShowColumn("test3Ent")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck18"
                                        >
                                          {this.props.t("Test3 (Enter)")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>

                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck19"
                                          autoComplete="off"
                                          defaultChecked={showTest4Ent}
                                          onClick={() =>
                                            this.handleShowColumn("test4Ent")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check big-width-check"
                                          htmlFor="btncheck19"
                                        >
                                          {this.props.t("Test4 (Enter)")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck20"
                                          autoComplete="off"
                                          defaultChecked={showTest5Ent}
                                          onClick={() =>
                                            this.handleShowColumn("test5Ent")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check big-width-check"
                                          htmlFor="btncheck20"
                                        >
                                          {this.props.t("Test5 (Enter)")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck21"
                                          autoComplete="off"
                                          defaultChecked={showTest6Ent}
                                          onClick={() =>
                                            this.handleShowColumn("test6Ent")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check big-width-check"
                                          htmlFor="btncheck21"
                                        >
                                          {this.props.t("Test6 (Enter)")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck22"
                                          autoComplete="off"
                                          defaultChecked={showTest7Ent}
                                          onClick={() =>
                                            this.handleShowColumn("test7Ent")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck22"
                                        >
                                          {this.props.t("Test7 (Enter)")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>
                                </Col>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="2">
                              <Accordion.Header>
                                {t("Audit Marks")}
                              </Accordion.Header>
                              <Accordion.Body>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck23"
                                        autoComplete="off"
                                        defaultChecked={showTotalMarksAud}
                                        onClick={() =>
                                          this.handleShowColumn("totalMarksAud")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck23"
                                      >
                                        {this.props.t("Total Marks (Audit)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck24"
                                        autoComplete="off"
                                        defaultChecked={showPracticalMarksAud}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "practicalMarksAud"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck24"
                                      >
                                        {this.props.t(
                                          "Practical Marks (Audit)"
                                        )}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck25"
                                        autoComplete="off"
                                        defaultChecked={showFinalExamAud}
                                        onClick={() =>
                                          this.handleShowColumn("finalExamAud")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck25"
                                      >
                                        {this.props.t("Final Exam (Audit)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck26"
                                        autoComplete="off"
                                        defaultChecked={showTest1Aud}
                                        onClick={() =>
                                          this.handleShowColumn("test1Aud")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck26"
                                      >
                                        {this.props.t("Test1 (Audit)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck27"
                                        autoComplete="off"
                                        defaultChecked={showTest2Aud}
                                        onClick={() =>
                                          this.handleShowColumn("test2Aud")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck27"
                                      >
                                        {this.props.t("Test2 (Audit)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck28"
                                        autoComplete="off"
                                        defaultChecked={showTest3Aud}
                                        onClick={() =>
                                          this.handleShowColumn("test3Aud")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck28"
                                      >
                                        {this.props.t("Test3 (Audit)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck29"
                                        autoComplete="off"
                                        defaultChecked={showTest4Aud}
                                        onClick={() =>
                                          this.handleShowColumn("test4Aud")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck29"
                                      >
                                        {this.props.t("Test4 (Audit)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck30"
                                        autoComplete="off"
                                        defaultChecked={showTest5Aud}
                                        onClick={() =>
                                          this.handleShowColumn("test5Aud")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck30"
                                      >
                                        {this.props.t("Test5 (Audit)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck31"
                                        autoComplete="off"
                                        defaultChecked={showTest6Aud}
                                        onClick={() =>
                                          this.handleShowColumn("test6Aud")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck31"
                                      >
                                        {this.props.t("Test6 (Audit)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck32"
                                        autoComplete="off"
                                        defaultChecked={showTest7Aud}
                                        onClick={() =>
                                          this.handleShowColumn("test7Aud")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck32"
                                      >
                                        {this.props.t("Test7 (Audit)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                              </Accordion.Body>{" "}
                            </Accordion.Item>
                            <Accordion.Item eventKey="3">
                              <Accordion.Header>
                                {t("Archive Marks")}
                              </Accordion.Header>
                              <Accordion.Body>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck33"
                                        autoComplete="off"
                                        defaultChecked={showTotalMarksArch}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "totalMarksArch"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck33"
                                      >
                                        {this.props.t("Total Marks (Archive)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck34"
                                        autoComplete="off"
                                        defaultChecked={showPracticalMarksArch}
                                        onClick={() =>
                                          this.handleShowColumn(
                                            "practicalMarksArch"
                                          )
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck34"
                                      >
                                        {this.props.t(
                                          "Practical Marks (Archive)"
                                        )}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck35"
                                        autoComplete="off"
                                        defaultChecked={showFinalExamArch}
                                        onClick={() =>
                                          this.handleShowColumn("finalExamArch")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck35"
                                      >
                                        {this.props.t("Final Exam (Archive)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck36"
                                        autoComplete="off"
                                        defaultChecked={showTest1Arch}
                                        onClick={() =>
                                          this.handleShowColumn("test1Arch")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck36"
                                      >
                                        {this.props.t("Test1 (Archive)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck37"
                                        autoComplete="off"
                                        defaultChecked={showTest2Arch}
                                        onClick={() =>
                                          this.handleShowColumn("test2Arch")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck37"
                                      >
                                        {this.props.t("Test2 (Archive)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck38"
                                        autoComplete="off"
                                        defaultChecked={showTest3Arch}
                                        onClick={() =>
                                          this.handleShowColumn("test3Arch")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck38"
                                      >
                                        {this.props.t("Test3 (Archive)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck39"
                                        autoComplete="off"
                                        defaultChecked={showTest4Arch}
                                        onClick={() =>
                                          this.handleShowColumn("test4Arch")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck39"
                                      >
                                        {this.props.t("Test4 (Archive)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck40"
                                        autoComplete="off"
                                        defaultChecked={showTest5Arch}
                                        onClick={() =>
                                          this.handleShowColumn("test5Arch")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck40"
                                      >
                                        {this.props.t("Test5 (Archive)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck41"
                                        autoComplete="off"
                                        defaultChecked={showTest6Arch}
                                        onClick={() =>
                                          this.handleShowColumn("test6Arch")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck41"
                                      >
                                        {this.props.t("Test6 (Archive)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="mb-1">
                                  <Row>
                                    <Col>
                                      <input
                                        type="checkbox"
                                        className="btn-check"
                                        id="btncheck42"
                                        autoComplete="off"
                                        defaultChecked={showTest7Arch}
                                        onClick={() =>
                                          this.handleShowColumn("test7Arch")
                                        }
                                      />
                                      <label
                                        className="btn btn-outline-primary big-width-check"
                                        htmlFor="btncheck42"
                                      >
                                        {this.props.t("Test7 (Archive)")}
                                      </label>
                                    </Col>
                                  </Row>
                                </div>
                              </Accordion.Body>{" "}
                            </Accordion.Item>
                          </Accordion>
                        </CardBody>
                      </Card>
                    </div>
                  </Col>

                  <Col lg={10}>
                    <Card>
                      <CardBody>
                        <div>
                          {duplicateError && (
                            <Alert
                              color="danger"
                              className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                              role="alert"
                            >
                              {duplicateError}
                              <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={this.handleAlertClose}
                              ></button>
                            </Alert>
                          )}
                          {deleted == 0 && showAlert && (
                            <Alert
                              color="danger"
                              className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                              role="alert"
                            >
                              {alertMessage}
                              <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={this.handleErrorClose}
                              ></button>
                            </Alert>
                          )}
                          {deleted == 1 && showAlert && (
                            <Alert
                              color="success"
                              className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                              role="alert"
                            >
                              {alertMessage}
                              <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={this.handleSuccessClose}
                              ></button>
                            </Alert>
                          )}
                        </div>
                        <div className="table-responsive">
                          <PaginationProvider
                            pagination={paginationFactory(pageOptions)}
                            key="unique-pagination-key"
                            keyField="Pagination-Provider"
                            columns={MainInfoColumns}
                            data={trainees}
                          >
                            {({ paginationProps, paginationTableProps }) => (
                              <ToolkitProvider
                                keyField="Pagination-Provider"
                                key="unique-pagination-key"
                                data={trainees}
                                columns={MainInfoColumns}
                                search
                              >
                                {toolkitprops => (
                                  <React.Fragment>
                                    <Row>
                                      <Col sm="4">
                                        <div className="search-box ms-2 mb-2 d-inline-block">
                                          {/*   {showSearchButton && ( */}
                                          <div className="position-relative">
                                            <SearchBar
                                              {...toolkitprops.searchProps}
                                              placeholder={t("Search...")}
                                            />
                                          </div>
                                        </div>
                                      </Col>
                                      <Col lg="3">
                                        <Select
                                          className="select-style-year"
                                          name="yearId"
                                          key={`yearId`}
                                          options={years}
                                          onChange={newValue => {
                                            this.handleSelectYear(
                                              "yearId",
                                              newValue
                                            );
                                          }}
                                          value={selectedYear}
                                        />
                                      </Col>
                                      {/*    {showAddButton && ( */}
                                      {/* <Col sm="8">
                                        <div className="text-sm-end">
                                          <Tooltip
                                            title={this.props.t("Add")}
                                            placement="top"
                                          >
                                            <IconButton
                                              color="primary"
                                              onClick={this.handleAddRow}
                                            >
                                              <i className="mdi mdi-plus-circle blue-noti-icon" />
                                            </IconButton>
                                          </Tooltip>
                                        </div>
                                      </Col> */}
                                      {/* export excel */}
                                      <Col sm="5">
                                        <div className="text-sm-end">
                                          <Tooltip
                                            title={this.props.t(
                                              "Export to Excel"
                                            )}
                                            placement="top"
                                          >
                                            <IconButton
                                              color="success"
                                              onClick={this.exportToExcel}
                                            >
                                              <i className="mdi mdi-file-excel blue-noti-icon" />
                                            </IconButton>
                                          </Tooltip>
                                        </div>
                                      </Col>
                                    </Row>
                                    <Col xl="12">
                                      <div className="table-responsive">
                                        <BootstrapTable
                                          keyField="Id"
                                          {...toolkitprops.baseProps}
                                          {...paginationTableProps}
                                          data={trainees}
                                          columns={MainInfoColumns}
                                          noDataIndication={this.props.t(
                                            "No Trainees found"
                                          )}
                                          defaultSorted={defaultSorting}
                                          classes={
                                            "table align-middle table-nowrap table-hover"
                                          }
                                          bordered={false}
                                          striped={false}
                                          responsive
                                          ref={this.node}
                                          filter={filterFactory()}
                                          filterPosition="top"
                                        />
                                        <Col className="pagination pagination-rounded justify-content-end mb-2">
                                          <PaginationListStandalone
                                            {...paginationProps}
                                          />
                                        </Col>
                                      </div>
                                    </Col>
                                  </React.Fragment>
                                )}
                              </ToolkitProvider>
                            )}
                          </PaginationProvider>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              )}
            </Row>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({
  trainees,
  currencies,
  mobAppFacultyAccs,
  generalManagements,
  menu_items,
  tempTrainees,
  nationalities,
  countries,
  cities,
  diplomalevels,
  certificates,
  governorates,
  regReqDocuments,
  genders,
  certificatelevels,
  admissionConditions,
  academiccertificates,
  highstudytypes,
  grants,
  years,
  relatives,
  estimates,
}) => ({
  trainees: trainees.trainees,
  // trainee: trainees.trainee,
  deleted: trainees.deleted,
  faculties: mobAppFacultyAccs.faculties,
  currencies: currencies.currencies,
  years: years.years,
  nationalities: nationalities.nationalities,
  faculties: mobAppFacultyAccs.faculties,
  countries: countries.countries,
  cities: cities.cities,
  diplomalevels: diplomalevels.diplomalevels,
  governorates: governorates.governorates,
  regReqDocuments: regReqDocuments.regReqDocuments,
  genders: genders.genders,
  academiccertificates: academiccertificates.academiccertificates,
  filteredAcademicCertificates:
    academiccertificates.filteredAcademicCertificates,
  socialStatus: tempTrainees.socialStatus,
  relatives: relatives.relatives,
  regcertificates: tempTrainees.regcertificates,
  deleted: tempTrainees.deleted,
  highstudytypes: highstudytypes.highstudytypes,
  estimates: estimates.estimates,
  requiredDocs: tempTrainees.requiredDocs,
  traineeStatus: trainees.traineeStatus,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  // onGetTrainees: lng => dispatch(getTrainees(lng)),
  onGetYears: () => dispatch(getYears()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(TraineesReportList));
