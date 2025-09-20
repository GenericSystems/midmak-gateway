import React, { Component } from "react";
import classnames from "classnames";
import TraineesChart from "../../../components/Common/TraineesChart";
import OtherChart from "../../../components/Common/OtherChart";
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
  CardText,
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
  Badge,
} from "reactstrap";
import * as Yup from "yup";
import Tooltip from "@mui/material/Tooltip";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import filterFactory, {
  textFilter,
  customFilter,
} from "react-bootstrap-table2-filter";
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

import {
  getRegisterTraineesAttendance,
  getRegisterTraineeAttendanceDeletedValue,
  addNewRegisterTraineeAttendance,
  updateRegisterTraineeAttendance,
  deleteRegisterTraineeAttendance,
} from "store/registerTraineesAttendance/actions";
import { getCourseStatistics } from "store/enterGrades/actions";
import { BackburgerIcon } from "@icons/material";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
import TraineesAttendance from "components/Common/TraineesAttendance";
import E from "react-script";
import trainees from "helpers/trainees";
class RegisterTraineesAttendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: new Date(),
      profExperiencesArray: [],
      regTrainees: {},
      regTrainees: "",
      halls: [],
      employeesNames: [],
      years: [],
      tempTraineeLocal: "",
      activeTab: 1,
      activeTabVartical: 1,
      passedSteps: [1],
      passedStepsVertical: [1],
      selectedView: "",
      errorMessage: null,
      sidebarOpen: true,
      deleteModal: false,
      selectedRowId: null,
      isEdit: false,
      isView: false,
      modal: false,
      modal1: false,
      modal2: false,
      modal3: false,
      selectedMulti: null,
      selectedFromAdmSemes: "",
      selectedToAdmSemes: "",
      selectedFromRegSemes: "",
      selectedToRegSemes: "",
      selectedColor: "#556ee6",
      selectedRuleType: "",
      selectedCalculatedTransferCred: "",
      selectedActiveAdditionalPeriod: "",
      applyForSemesterArray: [],
      prevStatusSemesArray: [],
      applyStatusArray: [],
      prevAcademicWarningArray: [],
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      successMessage: null,
      showCourseInfo: false,
      showCurrentLecture: false,
      showTodayLecture: false,
      showCourseLectures: false,
      showRecordedLectures: false,
      showWeekLecture: false,
      selecetdDiplomaId: "",
      selectedFacultyId: 0,
      tempTrainee: "",
      hasError: false,
      isOpen: false,
      isOpen1: false,
      generateModal: false,
      averageValue: "",
      selectedDiploma: "",
      IsSpecial: false,
      grantCond: 0,
      selectedStudyPlanId: 0,
      selectedYear: null,
      currentYearObj: {},
      values: "",
      errorMessage1: null,
      successMessage1: null,
      totalGradeValue: "",
      regTraineesGrade: "",
      studentGrade: "",
      attestatedValue: 0,
      rows: [],
      bloodTypeName: "",
      duplicateRelativeError: null,
      duplicateError: null,
      duplicateErrorSibling: null,
      lastUsedId: 0,
      stdDocsArray: [],
      lastUsedExperienceId: 0,
      trnProfExperiences: {},
      trnProfExperience: "",
      showSiblingsSelect: false,
      siblingsArray: [],
      deleteBroModal: false,
      tempTrainees: {},
      selectedParentNationality: null,
      selectedInstituteCountry: "",
      selectedTraineeStatus: "",
      languageState: "",
      selectedHightStudyTypeId: "",
      selectedEstimateId: "",
      selectedRegUniDate: "",
      isTempTraineeSaved: false,
      selectedTraineeId: 0,
      isAdd: false,
      selectedShowAbsent: "",
      selectedShowLecture: "",
      selectedShowTrainees: "",
      selectedshowInstructor: "",
      selectedShowLectureInfo: "",
      selectedHallKey: null,
      defaultHallName: "",
      selectedAltHallKey: null,
      defaultAltHallName: "",
      selectedInstructorId: "",
      defaultInstructorName: "",
      selectedAltInstructorId: "",
      defaultAltInstructorName: "",
      selectedInstAttend: "",
      selectedAltInstAttend: "",
      selectedOnline: "",
      selectedCanceled: "",
      selectedCloseLecture: "",
      selectedAdditional: "",
      lectureDateError: false,
    };
    // this.toggleSidebar = this.toggleSidebar.bind(this);
    // this.handleColorChange = this.handleColorChange.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({ currentTime: new Date() });
    }, 1000);
    const lang = localStorage.getItem("I18N_LANGUAGE");
    const {
      regTrainees,
      onGetRegisterTraineesAttendance,
      deleted,
      user_menu,
      i18n,
      halls,
      employeesNames,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (regTrainees && !regTrainees.length) {
      onGetRegisterTraineesAttendance(lang);

      this.setState({ halls, employeesNames, regTrainees, deleted });
    }

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
    const { onGetRegisterTraineesAttendance } = this.props;
    const lang = localStorage.getItem("I18N_LANGUAGE");

    if (lang != lng) {
      this.setState({ languageState: lng });
      onGetRegisterTraineesAttendance(lng);
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

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
    this.props.onGetRegisterTraineesAttendance();
  };

  toggle1 = () => {
    this.setState(prevState => ({
      modal1: !prevState.modal1,
    }));
  };

  toggle2 = () => {
    this.setState(prevState => ({
      modal2: !prevState.modal2,
    }));
  };

  toggle3 = () => {
    this.setState(prevState => ({
      modal3: !prevState.modal3,
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

  handleColorChange(event) {
    const selectedValue = event.target.value;
    this.setState({ selectedColor: selectedValue });
  }

  handleViewTrainee = arg => {
    console.log("arg", arg);
    this.setState({
      regTrainees: arg,
      selectedTraineeId: arg.Id,
      isEdit: true,
    });
    this.toggle();
  };

  handleCurrentLecture = () => {
    this.setState({
      showCurrentLecture: true,
      showCourseInfo: false,
      showTodayLecture: false,
      showCourseLectures: false,
      showWeekLecture: false,
      showRecordedLectures: false,
    });
  };

  handleCourseInfo = () => {
    this.setState({
      showCourseInfo: true,
      showCurrentLecture: false,
      showTodayLecture: false,
      showCourseLectures: false,
      showWeekLecture: false,
      showRecordedLectures: false,
    });
  };
  handleTodayLecture = () => {
    this.setState({
      showCourseInfo: false,
      showCurrentLecture: false,
      showTodayLecture: true,
      showCourseLectures: false,
      showWeekLecture: false,
      showRecordedLectures: false,
    });
  };
  handleWeekLecture = () => {
    this.setState({
      showCourseInfo: false,
      showCurrentLecture: false,
      showTodayLecture: false,
      showCourseLectures: false,
      showWeekLecture: true,
      showRecordedLectures: false,
    });
  };
  handleCourseLectures = () => {
    this.setState({
      showCourseInfo: false,
      showCurrentLecture: false,
      showCourseLectures: true,
      showTodayLecture: false,
      showWeekLecture: false,
      showRecordedLectures: false,
    });
  };
  handleRecordedLectures = () => {
    this.setState({
      showCourseInfo: false,
      showCurrentLecture: false,
      showCourseLectures: false,
      showTodayLecture: false,
      showWeekLecture: false,
      showRecordedLectures: true,
    });
  };

  handleReportsDropdown = () => {
    const {
      showCourseInfo,
      showCurrentLecture,
      showTodayLecture,
      showCourseLectures,
      showWeekLecture,
      showRecordedLectures,
    } = this.state;

    this.setState({
      showCourseInfo: showCourseInfo ? true : false,
      showCurrentLecture: showCurrentLecture ? true : false,
      showTodayLecture: showTodayLecture ? true : false,
      showCourseLectures: showCourseLectures ? true : false,
      showWeekLecture: showWeekLecture ? true : false,
      showRecordedLectures: showRecordedLectures ? true : false,
    });
    this.setState(prevState => ({
      showReportsLi: !prevState.showReportsLi,
    }));
  };

  handleUniTraineesDropdown = () => {
    const {
      showCourseInfo,
      showCurrentLecture,
      showReportsLi,
      showTodayLecture,
      showRecordedLectures,
      showCourseLectures,
    } = this.state;
    this.setState({
      showCourseInfo: showCourseInfo ? true : false,
      showCurrentLecture: showCurrentLecture ? true : false,
      showReportsLi: showReportsLi ? true : false,
      showTodayLecture: showTodayLecture ? true : false,
      showCourseLectures: showCourseLectures ? true : false,
      showWeekLecture: showWeekLecture ? true : false,
      showRecordedLectures: showRecordedLectures ? true : false,
    });
    this.setState(prevState => ({
      showTraineeLifeLi: !prevState.showTraineeLifeLi,
    }));
  };

  toggleTab(tab) {
    if (tab === 5 && !this.state.isTempTraineeSaved && !this.state.isEdit) {
      return;
    }
    if (tab === 4 && !this.state.isTempTraineeSaved && !this.state.isEdit) {
      return;
    }
    const {
      regTrainees,
      isEdit,
      siblingsArray,
      trnProfExperiences,
      stdDocsArray,
      profExperiencesArray,
    } = this.state;
    if (this.state.activeTab !== tab) {
      if (tab >= 1 && tab <= 5) {
        var modifiedSteps = [...this.state.passedSteps, tab];
        this.setState({
          activeTab: tab,
          passedSteps: modifiedSteps,
        });
        if (isEdit) {
          this.setState({
            stdDocsArray: regTrainees.RegReqDocTempTrainee || [],
            profExperiencesArray: regTrainees.ProfessionalExperiences || [],
          });
        }
      }
      if (tab == 4 && isEdit == false) {
        const { trnProfExperiences } = this.props;
        this.setState({
          profExperiencesArray: trnProfExperiences,
        });
      }

      if (tab == 5 && isEdit == false) {
        const { tempTraineesDocuments } = this.props;
        this.setState({
          stdDocsArray: tempTraineesDocuments,
        });
      }
    }
  }

  handleCollapseButtonClick = () => {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("collapse-sidebar");
  };

  handleSave = values => {
    console.log("values", values);
    let flag = 0;
    const { isEdit1 } = this.state;

    const { onAddNewSectionLabDetail, onUpdateSectionLabDetail } = this.props;

    // values["type"] = selectedRowSectionLab.type;
    // values["sectionLabId"] = selectedRowSectionLab.Id;
    values["hallId"] = this.state.selectedHallKey;
    values["altHallId"] = this.state.selectedAltHallKey;
    values["altInstructorId"] = this.state.selectedAltInstructorId;
    values["instructorId"] = this.state.selectedInstructorId;

    let lectureInfo = {};

    Object.keys(values).forEach(function (key) {
      if (
        values[key] != undefined &&
        values[key] !== null &&
        (values[key].length > 0 || values[key] != "")
      )
        lectureInfo[key] = values[key];
    });
    lectureInfo.hallId = this.state.selectedHallKey;

    console.log("lectureInfo", lectureInfo);
    const fieldErrors = {};
    if (Object.keys(fieldErrors).length > 0) {
      return fieldErrors;
    }
    if (isEdit1) {
      // onUpdateSectionLabDetail(lectureInfo);
      this.toggle1();
    } else {
      console.log("saaaaave", lectureInfo);
      // onAddNewSectionLabDetail(lectureInfo);
      this.toggle1();
    }
  };

  handleValidDate = date => {
    const date1 = moment(new Date(date)).format("DD /MM/ Y");
    return date1;
  };

  handelAddExperience = () => {
    const { onAddNewProfessionalExperience, lastAddedId, trnProfExperiences } =
      this.props;
    const {
      profExperiencesArray,
      lastUsedExperienceId,
      isAdd,
      selectedTraineeId,
    } = this.state;
    const emptyRowsExist = profExperiencesArray.some(
      profExperiences => profExperiences.workType.trim() === ""
    );
    console.log("emptyRowsExist", emptyRowsExist);
    console.log("selectedTraineeId", selectedTraineeId);
    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateErrorProfExperiences: errorMessage });
    } else {
      const newExperience = {
        Id: lastUsedExperienceId,
        regTraineesId: isAdd ? lastAddedId : selectedTraineeId,
        workType: "",
        companyName: "",
        workPlace: "",
        workField: "",
        duaration: "",
      };
      // onAddNewProfessionalExperience(newExperience);
      this.setState({
        duplicateErrorProfExperiences: null,
        profExperiencesArray: [...profExperiencesArray, newExperience],
        lastUsedExperienceId: lastUsedExperienceId + 1,
      });
    }
  };

  handleExperienceDataChange = (rowId, fieldName, fieldValue) => {
    const { isEdit } = this.state;
    // if (isEdit == true) {
    this.setState(prevState => {
      const updatedProfExperience = prevState.profExperiencesArray.map(
        exper => {
          if (exper.Id === rowId) {
            return {
              ...exper,
              [fieldName]: fieldValue,
            };
          }
          return exper;
        }
      );

      return {
        profExperiencesArray: updatedProfExperience,
      };
    });
    // } else {
    //   const { onUpdateProfessionalExperience, trnProfExperiences } = this.props;
    //   const isDuplicate = trnProfExperiences.some(trnProfExperience => {
    //     return (
    //       trnProfExperience.Id !== rowId &&
    //       trnProfExperience.workType.trim() === fieldValue.trim()
    //     );
    //   });

    //   if (isDuplicate) {
    //     const errorMessage = this.props.t("Value already exists");
    //     this.setState({ duplicateErrorProfExperiences: errorMessage });
    //   } else {
    //     this.setState({ duplicateErrorProfExperiences: null });
    //     let onUpdate = { Id: rowId, [fieldName]: fieldValue };
    //     onUpdateProfessionalExperience(onUpdate);
    //   }
    // }
  };

  handleRegReqDocDataChange = (rowId, fieldName, fieldValue) => {
    this.setState(prevState => {
      const updatedRegReqDocs = prevState.stdDocsArray.map(document => {
        if (document.Id === rowId) {
          return {
            ...document,
            [fieldName]: fieldValue,
          };
        }
        return document;
      });

      return {
        stdDocsArray: updatedRegReqDocs,
      };
    });
  };

  handleButtonClick = (fieldName, option) => {
    if (fieldName == "ExaminationSession") {
      this.setState({ selectedExaminationSession: option });
    }
  };

  handleButtonClick2 = (fieldName, option, values) => {
    // console.log("fieldName", fieldName);
    // console.log("option", option);
    // const { onGetTempTraineesDocuments } = this.props;
    // let obj = { certificateLevelId: option };
    // console.log("objobjobj", obj);
    // onGetTempTraineesDocuments(obj);
    if (fieldName == "registrationCertLevelId") {
      this.setState({ selectedRegistrationCertLevelId: option });
      this.setState({ tempTrainee: values });
    }
  };

  handleDiplomaSelect = (event, fieldName, setFieldValue, values) => {
    // const { onGetempTraineesDocuments } = this.props;
    const { diplomalevels } = this.props;
    const selectedValue = event.target.value;
    console.log("selectedValue", selectedValue);

    this.setState({
      tempTrainee: values,
    });

    const diplomaObject = diplomalevels.find(
      certificate => certificate.value === event.target.value
    );
    console.log(diplomaObject, "ollllllll");
    // let obj = { certificateLevelId: diplomaObject.key };
    // console.log("objobjobj", obj);
    // onGetempTraineesDocuments(obj);
    setFieldValue("diplomaId", selectedValue);

    if (diplomaObject) {
      this.setState({
        selectedDiplomaId: diplomaObject.key,
        selectedDiploma: selectedValue,
        diplomaTypeName: diplomaObject.value,
        diplomaError: false,
        tempTrainee: values,
      });
    }
  };

  handleDropdownToggle = flag => {
    const { selectedCourseId } = this.state;
    const { OnGetCourseStatistics } = this.props;
    if (flag == 0) {
      let flagg = {};
      flagg["courseId"] = selectedCourseId;

      flagg["flag"] = 0;
      OnGetCourseStatistics(flagg);
    } else {
      let flagg = {};
      flagg["courseId"] = selectedCourseId;

      flagg["flag"] = 1;

      OnGetCourseStatistics(flagg);
    }
  };

  handleToggleChange = (field, value) => {
    this.setState({ [field]: value });
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  //sunday is first day
  //   getDayNumber = date => {
  //     const day = new Date(date).getDay();
  //     return day === 0 ? 7 : day;
  //   };

  //saturday is first day
  getDayNumber = date => {
    const jsDay = new Date(date).getDay();
    const dayNumber = ((jsDay + 1) % 7) + 1;
    return dayNumber;
  };

  handleEditCourseLectures = arg => {
    this.setState({
      reTrainee: arg,
      isOpen: true,
      Id: arg.Id,
      defaultHallName: arg.hallName,
      selectedHallKey: arg.hallId,
      defaultAltHallName: arg.altHallName,
      selectedAltHallKey: arg.altHallId,
      defaultAltInstructorName: arg.altInstructorName,
      selectedAltInstructorId: arg.altInstructorId,
      defaultInstructorName: arg.instructorName,
      selectedInstructorId: arg.instructorId,
    });

    this.toggle1();
  };
  handleAttendanceRecording = arg => {
    this.setState({
      regTrainee: arg,
      isOpen1: true,
    });

    this.toggle2();
  };
  handleTraineeAbsence = arg => {
    this.setState({
      traineeAttend: arg,
      isView: true,
    });

    this.toggle3();
  };

  render() {
    const { halls, employeesNames, courseStatistics, regTrainees, deleted, t } =
      this.props;
    const {
      lectureDateError,
      startTimeError,
      tillTimeError,
      arLectureTitleError,
      enLectureTitleError,
      roomError,
      instructorError,
      currentTime,
      activeTab,
      regTrainee,
      showCurrentLecture,
      showTodayLecture,
      showCourseLectures,
      showCourseInfo,
      showWeekLecture,
      showRecordedLectures,
      languageState,
      duplicateError,
      errorMessage,
      deleteModal,
      isEdit,
      showAlert,
      isOpen,
      isOpen1,
      isView,
      selectedShowAbsent,
      selectedShowLecture,
      selectedShowTrainees,
      selectedshowInstructor,
      selectedShowLectureInfo,
      selectedInstructorId,
      defaultAltHallName,
      selectedAltInstructorId,
      selectedInstAttend,
      selectedAltInstAttend,
      selectedOnline,
      selectedCanceled,
      selectedCloseLecture,
      selectedAdditional,
    } = this.state;

    const { SearchBar } = Search;
    const { registered, warned, expelled } = regTrainees.stats || {
      registered: 0,
      warned: 0,
      expelled: 0,
    };

    let combinedArray = [];
    if (courseStatistics[1]) {
      const totalSuccessArray = courseStatistics[0].map(
        item => item.totalSuccessStd
      );
      const totalFailArray = courseStatistics[0].map(item => item.totalFailStd);
      combinedArray = [...totalSuccessArray, ...totalFailArray];
    }
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

    const lecturesColumns = [
      {
        dataField: "Id",
        text: this.props.t("#"),
        editable: false,
        hidden: true,
      },
      {
        dataField: "docName",

        text: this.props.t("Course Name"),
        editable: false,
      },
      {
        dataField: "requiredNumber",

        text: this.props.t("Course Code"),
        editable: false,
      },
      {
        dataField: "availableNumber",

        text: this.props.t("Group Code"),
        editable: false,
      },
      {
        dataField: "preventAdmission",

        text: this.props.t("Lecture Type"),
        editable: false,
      },
      {
        dataField: "preventRegistration",

        text: this.props.t("Instructor Name"),
        editable: false,
      },
      {
        dataField: "lectureDate",

        text: this.props.t("Lecture Date"),
        editable: false,
      },
      {
        dataField: "lectureTime",

        text: this.props.t("Lecture Time"),
        editable: false,
      },
      {
        dataField: "lecture",

        text: this.props.t("Lecture"),
        editable: false,
      },
      {
        dataField: "week",

        text: this.props.t("Week"),
        editable: false,
      },
      {
        dataField: "lectureTitle",

        text: this.props.t("Lecture Title"),
        editable: false,
      },

      {
        dataField: "close",

        text: this.props.t("Close"),
        editable: false,
      },

      {
        dataField: "online",

        text: this.props.t("Online"),
        editable: false,
      },

      {
        dataField: "cancel",

        text: this.props.t("Cancel"),
        editable: false,
      },
      {
        dataField: "menu",
        isDummyField: true,
        editable: false,
        text: "",
        formatter: (cellContent, regTrainee) => (
          <div className="d-flex gap-3">
            <Tooltip title={this.props.t("Edit Lecture")} placement="top">
              <Link className="text-sm-end" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  onClick={() => this.handleEditCourseLectures(regTrainee)}
                ></i>
              </Link>
            </Tooltip>
            <Tooltip title={this.props.t("Edit")} placement="top">
              <Link className="text-sm-end" to="#">
                <i
                  className="bx bxs-user font-size-18 text-secondary"
                  onClick={() => this.handleAttendanceRecording(regTrainee)}
                ></i>
              </Link>
            </Tooltip>
          </div>
        ),
      },
    ];
    const attendRecordingColumns = [
      {
        dataField: "Id",
        text: this.props.t("#"),
        editable: false,
        hidden: true,
      },
      {
        dataField: "docName",

        text: this.props.t("Trainee Name"),
        editable: false,
      },
      {
        dataField: "requiredNumber",

        text: this.props.t("Trainee Num"),
        editable: false,
      },
      {
        dataField: "availableNumber",

        text: this.props.t("Register Date"),
        editable: false,
      },
      {
        dataField: "preventAdmission",

        text: this.props.t("Absent Percent"),
        editable: false,
      },
      {
        dataField: "preventRegistration",

        text: this.props.t("Status"),
        editable: false,
      },
      {
        dataField: "action",
        text: "",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, traineeAttend) => (
          <div className="d-flex justify-content-center gap-3">
            {/* {showDeleteButton && (*/}
            <Tooltip title={this.props.t("View Attendance")} placement="top">
              <IconButton>
                <i
                  className="fa fa-history"
                  id="veiwattendtooltip"
                  onClick={() => this.handleTraineeAbsence(traineeAttend)}
                ></i>
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
    ];
    const absentStatisicsColumns = [
      {
        dataField: "Id",
        text: this.props.t("#"),
        editable: false,
        hidden: true,
      },
      {
        dataField: "docName",

        text: this.props.t("Lecture Type"),
        editable: false,
      },
      {
        dataField: "requiredNumber",

        text: this.props.t("Lecture Duration (Hours)"),
        editable: false,
      },
      {
        dataField: "availableNumber",

        text: this.props.t("Absent Duration (Hours)"),
        editable: false,
      },
      {
        dataField: "preventAdmission",

        text: this.props.t("Absents Counts"),
        editable: false,
      },
      {
        dataField: "preventRegistration",

        text: this.props.t("Last Absent Date"),
        editable: false,
      },
      {
        dataField: "preventRegistration",

        text: this.props.t("Absent Percent%"),
        editable: false,
      },

      {
        dataField: "preventRegistration",

        text: this.props.t("Weight"),
        editable: false,
      },
    ];
    //here i'm stopped
    const decreesColumns = [
      {
        dataField: "Id",
        text: this.props.t("#"),
        editable: false,
        hidden: true,
      },
      {
        dataField: "docName",

        text: this.props.t("Lecture Type"),
        editable: false,
      },
      {
        dataField: "requiredNumber",

        text: this.props.t("Lecture Duration (Hours)"),
        editable: false,
      },
      {
        dataField: "availableNumber",

        text: this.props.t("Absent Duration (Hours)"),
        editable: false,
      },
      {
        dataField: "preventAdmission",

        text: this.props.t("Absents Counts"),
        editable: false,
      },
      {
        dataField: "preventRegistration",

        text: this.props.t("Last Absent Date"),
        editable: false,
      },
      {
        dataField: "preventRegistration",

        text: this.props.t("Absent Percent%"),
        editable: false,
      },

      {
        dataField: "preventRegistration",

        text: this.props.t("Weight"),
        editable: false,
      },
    ];

    const MainInfoColumns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      {
        dataField: "TraineeNum",
        text: this.props.t("Course Name"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "fullName",
        text: this.props.t("Course Code"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "admissionDate",
        text: this.props.t("Course Credits"),
        sort: true,
        editable: false,
        formatter: (cellContent, row) =>
          this.handleValidDate(row.admissionDate),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "yearId",
        text: this.props.t("Registered Trainees"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "regTraineesStatusId",
        text: this.props.t("Lecture Groups"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "FirstName",
        text: this.props.t("Practical Groups"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "action",
        text: "",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, regTrainees) => (
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
                  onClick={() => this.handleViewTrainee(regTrainees)}
                ></i>
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: regTrainees.length,
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
            <Breadcrumbs breadcrumbItem={t("Register Trainees Attendance")} />

            <Row>
              <Col lg={12}>
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
                        data={regTrainees}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Pagination-Provider"
                            key="unique-pagination-key"
                            data={regTrainees}
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
                                </Row>
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      keyField="Id"
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      data={regTrainees}
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
                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                      fullscreen
                                    >
                                      <ModalHeader
                                        toggle={this.toggle}
                                        tag="h4"
                                      >
                                        {!!isEdit
                                          ? this.props.t("Edit Trainee")
                                          : this.props.t("Add New Trainee")}
                                      </ModalHeader>
                                      <Row>
                                        <div>
                                          {errorMessage && (
                                            <Alert
                                              color="danger"
                                              className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                              role="alert"
                                            >
                                              {errorMessage}
                                              <button
                                                type="button"
                                                className="btn-close"
                                                aria-label="Close"
                                                onClick={this.handleErrorClose}
                                              ></button>
                                            </Alert>
                                          )}
                                        </div>
                                      </Row>
                                      <ModalBody>
                                        <div className="modal">
                                          <div className="sidebar">
                                            <h2 className="regTrainees-info">
                                              Course Profile
                                            </h2>
                                            <ul>
                                              <li>
                                                <a
                                                  href="#"
                                                  onClick={
                                                    this.handleCourseInfo
                                                  }
                                                  style={{
                                                    color: showCourseInfo
                                                      ? "orange"
                                                      : "black",
                                                  }}
                                                >
                                                  {this.props.t("Course Info")}
                                                </a>
                                              </li>
                                              <li>
                                                <a
                                                  href="#"
                                                  onClick={
                                                    this.handleCurrentLecture
                                                  }
                                                  style={{
                                                    color: showCurrentLecture
                                                      ? "orange"
                                                      : "black",
                                                  }}
                                                >
                                                  {this.props.t(
                                                    "Current Lecture"
                                                  )}
                                                </a>
                                              </li>
                                              <li>
                                                <a
                                                  href="#"
                                                  onClick={
                                                    this.handleTodayLecture
                                                  }
                                                  style={{
                                                    color: showTodayLecture
                                                      ? "orange"
                                                      : "black",
                                                  }}
                                                >
                                                  {this.props.t(
                                                    "Today's Lecture"
                                                  )}
                                                </a>
                                              </li>
                                              <li>
                                                <a
                                                  href="#"
                                                  onClick={
                                                    this.handleWeekLecture
                                                  }
                                                  style={{
                                                    color: showWeekLecture
                                                      ? "orange"
                                                      : "black",
                                                  }}
                                                >
                                                  {this.props.t(
                                                    "Week's Lecture"
                                                  )}
                                                </a>
                                              </li>
                                              <li>
                                                <a
                                                  href="#"
                                                  onClick={
                                                    this.handleCourseLectures
                                                  }
                                                  style={{
                                                    color: showCourseLectures
                                                      ? "orange"
                                                      : "black",
                                                  }}
                                                >
                                                  {this.props.t(
                                                    "Course's Lectures"
                                                  )}
                                                </a>
                                              </li>
                                              <li>
                                                <a
                                                  href="#"
                                                  onClick={
                                                    this.handleRecordedLectures
                                                  }
                                                  style={{
                                                    color: showRecordedLectures
                                                      ? "orange"
                                                      : "black",
                                                  }}
                                                >
                                                  {this.props.t(
                                                    "Recorded Lectures"
                                                  )}
                                                </a>
                                              </li>
                                            </ul>
                                          </div>
                                          <div className="collapse-button">
                                            <i
                                              onClick={
                                                this.handleCollapseButtonClick
                                              }
                                              className="bx bx-menu"
                                            ></i>
                                          </div>

                                          <div className="modal-content">
                                            {showCourseInfo && (
                                              <div>
                                                <Card className="mt-3">
                                                  <CardHeader>
                                                    <strong>
                                                      {regTrainees.TraineeNum} —{" "}
                                                      {regTrainees.TraineeNum}
                                                    </strong>
                                                  </CardHeader>
                                                  <CardBody>
                                                    <Row>
                                                      <Col md={4}>
                                                        <Card className="text-white bg-info mb-3">
                                                          <CardBody>
                                                            <CardTitle>
                                                              Trainees Count
                                                            </CardTitle>
                                                            {/* <CardText>
                                                              16
                                                            </CardText> */}
                                                          </CardBody>
                                                        </Card>
                                                      </Col>

                                                      <Col md={4}>
                                                        <Card className="text-white bg-warning mb-3">
                                                          <CardBody>
                                                            <CardTitle>
                                                              Warnings Count
                                                            </CardTitle>
                                                            {/* <CardText>
                                                              0
                                                            </CardText> */}
                                                          </CardBody>
                                                        </Card>
                                                      </Col>

                                                      <Col md={4}>
                                                        <Card className="text-white bg-danger mb-3">
                                                          <CardBody>
                                                            <CardTitle>
                                                              Dismiss Count
                                                            </CardTitle>
                                                            {/* <CardText>
                                                              0
                                                            </CardText> */}
                                                          </CardBody>
                                                        </Card>
                                                      </Col>
                                                    </Row>
                                                  </CardBody>
                                                </Card>
                                                <Card className="mt-3">
                                                  <CardBody>
                                                    <Row>
                                                      <div className="info-icon">
                                                        <Dropdown
                                                          className=" d-lg-inline-block ms-1"
                                                          isOpen={
                                                            this.state.Analytics
                                                          }
                                                          toggle={() => {
                                                            this.setState({
                                                              Analytics:
                                                                !this.state
                                                                  .Analytics,
                                                            });
                                                          }}
                                                        >
                                                          {" "}
                                                          <DropdownToggle
                                                            className="btn header-item noti-icon"
                                                            tag="button"
                                                            onClick={() =>
                                                              this.handleDropdownToggle(
                                                                1
                                                              )
                                                            }
                                                          >
                                                            <i className="mdi mdi-google-analytics blue-noti-icon" />
                                                          </DropdownToggle>
                                                          <DropdownMenu className="dropdown-megamenu dropdown-mega-menu-analytics">
                                                            {" "}
                                                            <Row>
                                                              <Col className="col-5">
                                                                {courseStatistics[1] &&
                                                                  combinedArray && (
                                                                    <TraineesAttendance
                                                                      series={combinedArray.map(
                                                                        item =>
                                                                          item
                                                                      )}
                                                                      labels={[
                                                                        "Success",
                                                                        "Fail",
                                                                      ]}
                                                                    />
                                                                  )}
                                                              </Col>

                                                              <Col className="col-2"></Col>
                                                              <Col className="col-5">
                                                                {courseStatistics[1] && (
                                                                  <OtherChart
                                                                    series={courseStatistics[1].map(
                                                                      item =>
                                                                        item.letterGradeCount
                                                                    )}
                                                                    labels={courseStatistics[1].map(
                                                                      item =>
                                                                        item.letter_grade
                                                                    )}
                                                                  />
                                                                )}
                                                              </Col>
                                                            </Row>
                                                          </DropdownMenu>
                                                        </Dropdown>
                                                      </div>
                                                    </Row>
                                                  </CardBody>
                                                </Card>
                                              </div>
                                            )}
                                            {showCurrentLecture && (
                                              <div>
                                                <Formik
                                                  enableReinitialize={true}
                                                  initialValues={{
                                                    ...(isEdit &&
                                                      regTrainee && {
                                                        Id: regTrainee.Id,
                                                      }),
                                                    showAbsent:
                                                      regTrainee?.showAbsent ||
                                                      selectedShowAbsent,
                                                    showLecture:
                                                      regTrainee?.showLecture ||
                                                      selectedShowLecture,
                                                    showTrainees:
                                                      regTrainee?.showTrainees ||
                                                      selectedShowTrainees,
                                                    showInstructor:
                                                      regTrainee?.showInstructor ||
                                                      selectedshowInstructor,
                                                    showLectureInfo:
                                                      regTrainee?.showLectureInfo ||
                                                      selectedShowLectureInfo,
                                                  }}
                                                  validationSchema={Yup.object().shape(
                                                    {
                                                      arTitle:
                                                        Yup.string().required(
                                                          t(
                                                            "Course Name (ar) is required"
                                                          )
                                                        ),
                                                    }
                                                  )}
                                                >
                                                  {({
                                                    errors,
                                                    status,
                                                    touched,
                                                    values,
                                                    handleChange,
                                                    handleBlur,
                                                    setFieldValue,
                                                  }) => (
                                                    <Form>
                                                      <Card className="mt-3">
                                                        <CardHeader className="card-header text-center">
                                                          <h4>
                                                            {t(
                                                              "Current Leacture"
                                                            )}
                                                          </h4>
                                                        </CardHeader>
                                                        <CardBody className="cardBody">
                                                          <Row>
                                                            <Card className="mt-3">
                                                              <CardTitle id="course_header">
                                                                {t(
                                                                  "Show Options"
                                                                )}
                                                              </CardTitle>
                                                              <CardBody className="cardBody">
                                                                <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-6">
                                                                      <Row>
                                                                        <Col className="col-4">
                                                                          <Label for="showAbsent">
                                                                            {this.props.t(
                                                                              "Show Absent"
                                                                            )}
                                                                          </Label>
                                                                        </Col>
                                                                        <Col className="col-8">
                                                                          <div
                                                                            className={
                                                                              "btn-group"
                                                                              // +
                                                                              // (NeedSectionError
                                                                              //   ? " border border-danger rounded p-1"
                                                                              //   : "")
                                                                            }
                                                                          >
                                                                            <button
                                                                              type="button"
                                                                              className={`btn ${
                                                                                this
                                                                                  .state
                                                                                  .selectedShowAbsent ===
                                                                                1
                                                                                  ? "btn-primary"
                                                                                  : "btn-outline-secondary"
                                                                              }`}
                                                                              onClick={() =>
                                                                                this.handleToggleChange(
                                                                                  "selectedShowAbsent",
                                                                                  1
                                                                                )
                                                                              }
                                                                            >
                                                                              {this.props.t(
                                                                                "Dialog"
                                                                              )}
                                                                            </button>
                                                                            <button
                                                                              type="button"
                                                                              className={`btn ${
                                                                                this
                                                                                  .state
                                                                                  .selectedShowAbsent ===
                                                                                0
                                                                                  ? "btn-primary"
                                                                                  : "btn-outline-secondary"
                                                                              }`}
                                                                              onClick={() =>
                                                                                this.handleToggleChange(
                                                                                  "selectedShowAbsent",
                                                                                  0
                                                                                )
                                                                              }
                                                                            >
                                                                              {this.props.t(
                                                                                "Same Page"
                                                                              )}
                                                                            </button>
                                                                          </div>
                                                                        </Col>
                                                                      </Row>
                                                                    </Col>
                                                                  </Row>
                                                                </div>
                                                                <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-6">
                                                                      <Row>
                                                                        <Col className="col-4">
                                                                          <Label for="showLecture">
                                                                            {this.props.t(
                                                                              "Show Lecture"
                                                                            )}
                                                                          </Label>
                                                                        </Col>
                                                                        <Col className="col-8">
                                                                          <div
                                                                            className={
                                                                              "btn-group"
                                                                              // +
                                                                              // (NeedSectionError
                                                                              //   ? " border border-danger rounded p-1"
                                                                              //   : "")
                                                                            }
                                                                          >
                                                                            <button
                                                                              type="button"
                                                                              className={`btn ${
                                                                                this
                                                                                  .state
                                                                                  .selectedShowLecture ===
                                                                                1
                                                                                  ? "btn-primary"
                                                                                  : "btn-outline-secondary"
                                                                              }`}
                                                                              onClick={() =>
                                                                                this.handleToggleChange(
                                                                                  "selectedShowLecture",
                                                                                  1
                                                                                )
                                                                              }
                                                                            >
                                                                              {this.props.t(
                                                                                "Cards"
                                                                              )}
                                                                            </button>
                                                                            <button
                                                                              type="button"
                                                                              className={`btn ${
                                                                                this
                                                                                  .state
                                                                                  .selectedShowLecture ===
                                                                                0
                                                                                  ? "btn-primary"
                                                                                  : "btn-outline-secondary"
                                                                              }`}
                                                                              onClick={() =>
                                                                                this.handleToggleChange(
                                                                                  "selectedShowLecture",
                                                                                  0
                                                                                )
                                                                              }
                                                                            >
                                                                              {this.props.t(
                                                                                "List"
                                                                              )}
                                                                            </button>
                                                                          </div>
                                                                        </Col>
                                                                      </Row>
                                                                    </Col>
                                                                    <Col className="col-6">
                                                                      <Row>
                                                                        <Col className="col-4">
                                                                          <Label for="showInstructor">
                                                                            {this.props.t(
                                                                              "show Instructor Info"
                                                                            )}
                                                                          </Label>
                                                                        </Col>
                                                                        <Col className="col-8">
                                                                          <div
                                                                            className={
                                                                              "btn-group"
                                                                              // +
                                                                              // (NeedSectionError
                                                                              //   ? " border border-danger rounded p-1"
                                                                              //   : "")
                                                                            }
                                                                          >
                                                                            <button
                                                                              type="button"
                                                                              className={`btn ${
                                                                                this
                                                                                  .state
                                                                                  .selectedshowInstructor ===
                                                                                1
                                                                                  ? "btn-primary"
                                                                                  : "btn-outline-secondary"
                                                                              }`}
                                                                              onClick={() =>
                                                                                this.handleToggleChange(
                                                                                  "selectedshowInstructor",
                                                                                  1
                                                                                )
                                                                              }
                                                                            >
                                                                              {this.props.t(
                                                                                "Yes"
                                                                              )}
                                                                            </button>
                                                                            <button
                                                                              type="button"
                                                                              className={`btn ${
                                                                                this
                                                                                  .state
                                                                                  .selectedshowInstructor ===
                                                                                0
                                                                                  ? "btn-primary"
                                                                                  : "btn-outline-secondary"
                                                                              }`}
                                                                              onClick={() =>
                                                                                this.handleToggleChange(
                                                                                  "selectedshowInstructor",
                                                                                  0
                                                                                )
                                                                              }
                                                                            >
                                                                              {this.props.t(
                                                                                "No"
                                                                              )}
                                                                            </button>
                                                                          </div>
                                                                        </Col>
                                                                      </Row>
                                                                    </Col>
                                                                  </Row>
                                                                </div>
                                                                <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-6">
                                                                      <Row>
                                                                        <Col className="col-4">
                                                                          <Label for="showTrainees">
                                                                            {this.props.t(
                                                                              "Show Trainees"
                                                                            )}
                                                                          </Label>
                                                                        </Col>
                                                                        <Col className="col-8">
                                                                          <div
                                                                            className={
                                                                              "btn-group"
                                                                              // +
                                                                              // (NeedSectionError
                                                                              //   ? " border border-danger rounded p-1"
                                                                              //   : "")
                                                                            }
                                                                          >
                                                                            <button
                                                                              type="button"
                                                                              className={`btn ${
                                                                                this
                                                                                  .state
                                                                                  .selectedShowTrainees ===
                                                                                1
                                                                                  ? "btn-primary"
                                                                                  : "btn-outline-secondary"
                                                                              }`}
                                                                              onClick={() =>
                                                                                this.handleToggleChange(
                                                                                  "selectedShowTrainees",
                                                                                  1
                                                                                )
                                                                              }
                                                                            >
                                                                              {this.props.t(
                                                                                "Cards"
                                                                              )}
                                                                            </button>
                                                                            <button
                                                                              type="button"
                                                                              className={`btn ${
                                                                                this
                                                                                  .state
                                                                                  .selectedShowTrainees ===
                                                                                0
                                                                                  ? "btn-primary"
                                                                                  : "btn-outline-secondary"
                                                                              }`}
                                                                              onClick={() =>
                                                                                this.handleToggleChange(
                                                                                  "selectedShowTrainees",
                                                                                  0
                                                                                )
                                                                              }
                                                                            >
                                                                              {this.props.t(
                                                                                "List"
                                                                              )}
                                                                            </button>
                                                                          </div>
                                                                        </Col>
                                                                      </Row>
                                                                    </Col>
                                                                    <Col className="col-6">
                                                                      <Row>
                                                                        <Col className="col-4">
                                                                          <Label for="showLectureInfo">
                                                                            {this.props.t(
                                                                              "Show Lecture Info"
                                                                            )}
                                                                          </Label>
                                                                        </Col>
                                                                        <Col className="col-8">
                                                                          <div
                                                                            className={
                                                                              "btn-group"
                                                                              // +
                                                                              // (NeedSectionError
                                                                              //   ? " border border-danger rounded p-1"
                                                                              //   : "")
                                                                            }
                                                                          >
                                                                            <button
                                                                              type="button"
                                                                              className={`btn ${
                                                                                this
                                                                                  .state
                                                                                  .selectedShowLectureInfo ===
                                                                                1
                                                                                  ? "btn-primary"
                                                                                  : "btn-outline-secondary"
                                                                              }`}
                                                                              onClick={() =>
                                                                                this.handleToggleChange(
                                                                                  "selectedShowLectureInfo",
                                                                                  1
                                                                                )
                                                                              }
                                                                            >
                                                                              {this.props.t(
                                                                                "Yes"
                                                                              )}
                                                                            </button>
                                                                            <button
                                                                              type="button"
                                                                              className={`btn ${
                                                                                this
                                                                                  .state
                                                                                  .selectedShowLectureInfo ===
                                                                                0
                                                                                  ? "btn-primary"
                                                                                  : "btn-outline-secondary"
                                                                              }`}
                                                                              onClick={() =>
                                                                                this.handleToggleChange(
                                                                                  "selectedShowLectureInfo",
                                                                                  0
                                                                                )
                                                                              }
                                                                            >
                                                                              {this.props.t(
                                                                                "No"
                                                                              )}
                                                                            </button>
                                                                          </div>
                                                                        </Col>
                                                                      </Row>
                                                                    </Col>
                                                                  </Row>
                                                                </div>
                                                              </CardBody>
                                                            </Card>
                                                          </Row>
                                                        </CardBody>
                                                      </Card>

                                                      <Row>
                                                        <Card className="mt-3">
                                                          <CardTitle id="course_header">
                                                            {t(
                                                              "Lecture Of Date"
                                                            )}
                                                            {""} - {""}
                                                            <small>
                                                              {currentTime.toLocaleDateString()}{" "}
                                                              -{" "}
                                                              {currentTime.toLocaleTimeString()}
                                                            </small>
                                                          </CardTitle>
                                                          <CardBody className="cardBody">
                                                            <div className="mb-3">
                                                              <Row>
                                                                <Col className="col-6">
                                                                  <Row>
                                                                    <Col className="col-4">
                                                                      <Label for="showAbsent">
                                                                        {this.props.t(
                                                                          "Show Absent"
                                                                        )}
                                                                      </Label>
                                                                    </Col>
                                                                    <Col className="col-8">
                                                                      <div
                                                                        className={
                                                                          "btn-group"
                                                                          // +
                                                                          // (NeedSectionError
                                                                          //   ? " border border-danger rounded p-1"
                                                                          //   : "")
                                                                        }
                                                                      >
                                                                        <button
                                                                          type="button"
                                                                          className={`btn ${
                                                                            this
                                                                              .state
                                                                              .selectedShowAbsent ===
                                                                            1
                                                                              ? "btn-primary"
                                                                              : "btn-outline-secondary"
                                                                          }`}
                                                                          onClick={() =>
                                                                            this.handleToggleChange(
                                                                              "selectedShowAbsent",
                                                                              1
                                                                            )
                                                                          }
                                                                        >
                                                                          {this.props.t(
                                                                            "Dialog"
                                                                          )}
                                                                        </button>
                                                                        <button
                                                                          type="button"
                                                                          className={`btn ${
                                                                            this
                                                                              .state
                                                                              .selectedShowAbsent ===
                                                                            0
                                                                              ? "btn-primary"
                                                                              : "btn-outline-secondary"
                                                                          }`}
                                                                          onClick={() =>
                                                                            this.handleToggleChange(
                                                                              "selectedShowAbsent",
                                                                              0
                                                                            )
                                                                          }
                                                                        >
                                                                          {this.props.t(
                                                                            "Same Page"
                                                                          )}
                                                                        </button>
                                                                      </div>
                                                                    </Col>
                                                                  </Row>
                                                                </Col>
                                                              </Row>
                                                            </div>
                                                            <div className="mb-3">
                                                              <Row>
                                                                <Col className="col-6">
                                                                  <Row>
                                                                    <Col className="col-4">
                                                                      <Label for="showLecture">
                                                                        {this.props.t(
                                                                          "Show Lecture"
                                                                        )}
                                                                      </Label>
                                                                    </Col>
                                                                    <Col className="col-8">
                                                                      <div
                                                                        className={
                                                                          "btn-group"
                                                                          // +
                                                                          // (NeedSectionError
                                                                          //   ? " border border-danger rounded p-1"
                                                                          //   : "")
                                                                        }
                                                                      >
                                                                        <button
                                                                          type="button"
                                                                          className={`btn ${
                                                                            this
                                                                              .state
                                                                              .selectedShowLecture ===
                                                                            1
                                                                              ? "btn-primary"
                                                                              : "btn-outline-secondary"
                                                                          }`}
                                                                          onClick={() =>
                                                                            this.handleToggleChange(
                                                                              "selectedShowLecture",
                                                                              1
                                                                            )
                                                                          }
                                                                        >
                                                                          {this.props.t(
                                                                            "Cards"
                                                                          )}
                                                                        </button>
                                                                        <button
                                                                          type="button"
                                                                          className={`btn ${
                                                                            this
                                                                              .state
                                                                              .selectedShowLecture ===
                                                                            0
                                                                              ? "btn-primary"
                                                                              : "btn-outline-secondary"
                                                                          }`}
                                                                          onClick={() =>
                                                                            this.handleToggleChange(
                                                                              "selectedShowLecture",
                                                                              0
                                                                            )
                                                                          }
                                                                        >
                                                                          {this.props.t(
                                                                            "List"
                                                                          )}
                                                                        </button>
                                                                      </div>
                                                                    </Col>
                                                                  </Row>
                                                                </Col>
                                                                <Col className="col-6">
                                                                  <Row>
                                                                    <Col className="col-4">
                                                                      <Label for="showInstructor">
                                                                        {this.props.t(
                                                                          "show Instructor Info"
                                                                        )}
                                                                      </Label>
                                                                    </Col>
                                                                    <Col className="col-8">
                                                                      <div
                                                                        className={
                                                                          "btn-group"
                                                                          // +
                                                                          // (NeedSectionError
                                                                          //   ? " border border-danger rounded p-1"
                                                                          //   : "")
                                                                        }
                                                                      >
                                                                        <button
                                                                          type="button"
                                                                          className={`btn ${
                                                                            this
                                                                              .state
                                                                              .selectedshowInstructor ===
                                                                            1
                                                                              ? "btn-primary"
                                                                              : "btn-outline-secondary"
                                                                          }`}
                                                                          onClick={() =>
                                                                            this.handleToggleChange(
                                                                              "selectedshowInstructor",
                                                                              1
                                                                            )
                                                                          }
                                                                        >
                                                                          {this.props.t(
                                                                            "Yes"
                                                                          )}
                                                                        </button>
                                                                        <button
                                                                          type="button"
                                                                          className={`btn ${
                                                                            this
                                                                              .state
                                                                              .selectedshowInstructor ===
                                                                            0
                                                                              ? "btn-primary"
                                                                              : "btn-outline-secondary"
                                                                          }`}
                                                                          onClick={() =>
                                                                            this.handleToggleChange(
                                                                              "selectedshowInstructor",
                                                                              0
                                                                            )
                                                                          }
                                                                        >
                                                                          {this.props.t(
                                                                            "No"
                                                                          )}
                                                                        </button>
                                                                      </div>
                                                                    </Col>
                                                                  </Row>
                                                                </Col>
                                                              </Row>
                                                            </div>
                                                            <div className="mb-3">
                                                              <Row>
                                                                <Col className="col-6">
                                                                  <Row>
                                                                    <Col className="col-4">
                                                                      <Label for="showTrainees">
                                                                        {this.props.t(
                                                                          "Show Trainees"
                                                                        )}
                                                                      </Label>
                                                                    </Col>
                                                                    <Col className="col-8">
                                                                      <div
                                                                        className={
                                                                          "btn-group"
                                                                          // +
                                                                          // (NeedSectionError
                                                                          //   ? " border border-danger rounded p-1"
                                                                          //   : "")
                                                                        }
                                                                      >
                                                                        <button
                                                                          type="button"
                                                                          className={`btn ${
                                                                            this
                                                                              .state
                                                                              .selectedShowTrainees ===
                                                                            1
                                                                              ? "btn-primary"
                                                                              : "btn-outline-secondary"
                                                                          }`}
                                                                          onClick={() =>
                                                                            this.handleToggleChange(
                                                                              "selectedShowTrainees",
                                                                              1
                                                                            )
                                                                          }
                                                                        >
                                                                          {this.props.t(
                                                                            "Cards"
                                                                          )}
                                                                        </button>
                                                                        <button
                                                                          type="button"
                                                                          className={`btn ${
                                                                            this
                                                                              .state
                                                                              .selectedShowTrainees ===
                                                                            0
                                                                              ? "btn-primary"
                                                                              : "btn-outline-secondary"
                                                                          }`}
                                                                          onClick={() =>
                                                                            this.handleToggleChange(
                                                                              "selectedShowTrainees",
                                                                              0
                                                                            )
                                                                          }
                                                                        >
                                                                          {this.props.t(
                                                                            "List"
                                                                          )}
                                                                        </button>
                                                                      </div>
                                                                    </Col>
                                                                  </Row>
                                                                </Col>
                                                                <Col className="col-6">
                                                                  <Row>
                                                                    <Col className="col-4">
                                                                      <Label for="showLectureInfo">
                                                                        {this.props.t(
                                                                          "Show Lecture Info"
                                                                        )}
                                                                      </Label>
                                                                    </Col>
                                                                    <Col className="col-8">
                                                                      <div
                                                                        className={
                                                                          "btn-group"
                                                                          // +
                                                                          // (NeedSectionError
                                                                          //   ? " border border-danger rounded p-1"
                                                                          //   : "")
                                                                        }
                                                                      >
                                                                        <button
                                                                          type="button"
                                                                          className={`btn ${
                                                                            this
                                                                              .state
                                                                              .selectedShowLectureInfo ===
                                                                            1
                                                                              ? "btn-primary"
                                                                              : "btn-outline-secondary"
                                                                          }`}
                                                                          onClick={() =>
                                                                            this.handleToggleChange(
                                                                              "selectedShowLectureInfo",
                                                                              1
                                                                            )
                                                                          }
                                                                        >
                                                                          {this.props.t(
                                                                            "Yes"
                                                                          )}
                                                                        </button>
                                                                        <button
                                                                          type="button"
                                                                          className={`btn ${
                                                                            this
                                                                              .state
                                                                              .selectedShowLectureInfo ===
                                                                            0
                                                                              ? "btn-primary"
                                                                              : "btn-outline-secondary"
                                                                          }`}
                                                                          onClick={() =>
                                                                            this.handleToggleChange(
                                                                              "selectedShowLectureInfo",
                                                                              0
                                                                            )
                                                                          }
                                                                        >
                                                                          {this.props.t(
                                                                            "No"
                                                                          )}
                                                                        </button>
                                                                      </div>
                                                                    </Col>
                                                                  </Row>
                                                                </Col>
                                                              </Row>
                                                            </div>
                                                          </CardBody>
                                                        </Card>
                                                      </Row>
                                                    </Form>
                                                  )}
                                                </Formik>
                                              </div>
                                            )}

                                            {showTodayLecture && (
                                              <div>
                                                <Formik
                                                  enableReinitialize={true}
                                                  initialValues={{
                                                    ...(isEdit &&
                                                      regTrainee && {
                                                        Id: regTrainee.Id,
                                                      }),
                                                    showAbsent:
                                                      regTrainee?.showAbsent ||
                                                      selectedShowAbsent,
                                                    showLecture:
                                                      regTrainee?.showLecture ||
                                                      selectedShowLecture,
                                                    showTrainees:
                                                      regTrainee?.showTrainees ||
                                                      selectedShowTrainees,
                                                    showInstructor:
                                                      regTrainee?.showInstructor ||
                                                      selectedshowInstructor,
                                                    showLectureInfo:
                                                      regTrainee?.showLectureInfo ||
                                                      selectedShowLectureInfo,
                                                  }}
                                                  validationSchema={Yup.object().shape(
                                                    {
                                                      arTitle:
                                                        Yup.string().required(
                                                          t(
                                                            "Course Name (ar) is required"
                                                          )
                                                        ),
                                                    }
                                                  )}
                                                >
                                                  {({
                                                    errors,
                                                    status,
                                                    touched,
                                                    values,
                                                    handleChange,
                                                    handleBlur,
                                                    setFieldValue,
                                                  }) => (
                                                    <Form>
                                                      <Card className="mt-3">
                                                        <CardHeader className="card-header text-center">
                                                          <h4>
                                                            {t(
                                                              "Current Leacture"
                                                            )}
                                                          </h4>
                                                        </CardHeader>
                                                        <CardBody className="cardBody">
                                                          <Row>
                                                            <Card className="mt-3">
                                                              <CardTitle id="course_header">
                                                                {t(
                                                                  "Show Options"
                                                                )}
                                                              </CardTitle>
                                                              <CardBody className="cardBody">
                                                                <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-6">
                                                                      <Row>
                                                                        <Col className="col-4">
                                                                          <Label for="showAbsent">
                                                                            {this.props.t(
                                                                              "Show Absent"
                                                                            )}
                                                                          </Label>
                                                                        </Col>
                                                                        <Col className="col-8">
                                                                          <div
                                                                            className={
                                                                              "btn-group"
                                                                              // +
                                                                              // (NeedSectionError
                                                                              //   ? " border border-danger rounded p-1"
                                                                              //   : "")
                                                                            }
                                                                          >
                                                                            <button
                                                                              type="button"
                                                                              className={`btn ${
                                                                                this
                                                                                  .state
                                                                                  .selectedShowAbsent ===
                                                                                1
                                                                                  ? "btn-primary"
                                                                                  : "btn-outline-secondary"
                                                                              }`}
                                                                              onClick={() =>
                                                                                this.handleToggleChange(
                                                                                  "selectedShowAbsent",
                                                                                  1
                                                                                )
                                                                              }
                                                                            >
                                                                              {this.props.t(
                                                                                "Dialog"
                                                                              )}
                                                                            </button>
                                                                            <button
                                                                              type="button"
                                                                              className={`btn ${
                                                                                this
                                                                                  .state
                                                                                  .selectedShowAbsent ===
                                                                                0
                                                                                  ? "btn-primary"
                                                                                  : "btn-outline-secondary"
                                                                              }`}
                                                                              onClick={() =>
                                                                                this.handleToggleChange(
                                                                                  "selectedShowAbsent",
                                                                                  0
                                                                                )
                                                                              }
                                                                            >
                                                                              {this.props.t(
                                                                                "Same Page"
                                                                              )}
                                                                            </button>
                                                                          </div>
                                                                        </Col>
                                                                      </Row>
                                                                    </Col>
                                                                  </Row>
                                                                </div>
                                                                <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-6">
                                                                      <Row>
                                                                        <Col className="col-4">
                                                                          <Label for="showLecture">
                                                                            {this.props.t(
                                                                              "Show Lecture"
                                                                            )}
                                                                          </Label>
                                                                        </Col>
                                                                        <Col className="col-8">
                                                                          <div
                                                                            className={
                                                                              "btn-group"
                                                                              // +
                                                                              // (NeedSectionError
                                                                              //   ? " border border-danger rounded p-1"
                                                                              //   : "")
                                                                            }
                                                                          >
                                                                            <button
                                                                              type="button"
                                                                              className={`btn ${
                                                                                this
                                                                                  .state
                                                                                  .selectedShowLecture ===
                                                                                1
                                                                                  ? "btn-primary"
                                                                                  : "btn-outline-secondary"
                                                                              }`}
                                                                              onClick={() =>
                                                                                this.handleToggleChange(
                                                                                  "selectedShowLecture",
                                                                                  1
                                                                                )
                                                                              }
                                                                            >
                                                                              {this.props.t(
                                                                                "Cards"
                                                                              )}
                                                                            </button>
                                                                            <button
                                                                              type="button"
                                                                              className={`btn ${
                                                                                this
                                                                                  .state
                                                                                  .selectedShowLecture ===
                                                                                0
                                                                                  ? "btn-primary"
                                                                                  : "btn-outline-secondary"
                                                                              }`}
                                                                              onClick={() =>
                                                                                this.handleToggleChange(
                                                                                  "selectedShowLecture",
                                                                                  0
                                                                                )
                                                                              }
                                                                            >
                                                                              {this.props.t(
                                                                                "List"
                                                                              )}
                                                                            </button>
                                                                          </div>
                                                                        </Col>
                                                                      </Row>
                                                                    </Col>
                                                                    <Col className="col-6">
                                                                      <Row>
                                                                        <Col className="col-4">
                                                                          <Label for="showInstructor">
                                                                            {this.props.t(
                                                                              "show Instructor Info"
                                                                            )}
                                                                          </Label>
                                                                        </Col>
                                                                        <Col className="col-8">
                                                                          <div
                                                                            className={
                                                                              "btn-group"
                                                                              // +
                                                                              // (NeedSectionError
                                                                              //   ? " border border-danger rounded p-1"
                                                                              //   : "")
                                                                            }
                                                                          >
                                                                            <button
                                                                              type="button"
                                                                              className={`btn ${
                                                                                this
                                                                                  .state
                                                                                  .selectedshowInstructor ===
                                                                                1
                                                                                  ? "btn-primary"
                                                                                  : "btn-outline-secondary"
                                                                              }`}
                                                                              onClick={() =>
                                                                                this.handleToggleChange(
                                                                                  "selectedshowInstructor",
                                                                                  1
                                                                                )
                                                                              }
                                                                            >
                                                                              {this.props.t(
                                                                                "Yes"
                                                                              )}
                                                                            </button>
                                                                            <button
                                                                              type="button"
                                                                              className={`btn ${
                                                                                this
                                                                                  .state
                                                                                  .selectedshowInstructor ===
                                                                                0
                                                                                  ? "btn-primary"
                                                                                  : "btn-outline-secondary"
                                                                              }`}
                                                                              onClick={() =>
                                                                                this.handleToggleChange(
                                                                                  "selectedshowInstructor",
                                                                                  0
                                                                                )
                                                                              }
                                                                            >
                                                                              {this.props.t(
                                                                                "No"
                                                                              )}
                                                                            </button>
                                                                          </div>
                                                                        </Col>
                                                                      </Row>
                                                                    </Col>
                                                                  </Row>
                                                                </div>
                                                                <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-6">
                                                                      <Row>
                                                                        <Col className="col-4">
                                                                          <Label for="showTrainees">
                                                                            {this.props.t(
                                                                              "Show Trainees"
                                                                            )}
                                                                          </Label>
                                                                        </Col>
                                                                        <Col className="col-8">
                                                                          <div
                                                                            className={
                                                                              "btn-group"
                                                                              // +
                                                                              // (NeedSectionError
                                                                              //   ? " border border-danger rounded p-1"
                                                                              //   : "")
                                                                            }
                                                                          >
                                                                            <button
                                                                              type="button"
                                                                              className={`btn ${
                                                                                this
                                                                                  .state
                                                                                  .selectedShowTrainees ===
                                                                                1
                                                                                  ? "btn-primary"
                                                                                  : "btn-outline-secondary"
                                                                              }`}
                                                                              onClick={() =>
                                                                                this.handleToggleChange(
                                                                                  "selectedShowTrainees",
                                                                                  1
                                                                                )
                                                                              }
                                                                            >
                                                                              {this.props.t(
                                                                                "Cards"
                                                                              )}
                                                                            </button>
                                                                            <button
                                                                              type="button"
                                                                              className={`btn ${
                                                                                this
                                                                                  .state
                                                                                  .selectedShowTrainees ===
                                                                                0
                                                                                  ? "btn-primary"
                                                                                  : "btn-outline-secondary"
                                                                              }`}
                                                                              onClick={() =>
                                                                                this.handleToggleChange(
                                                                                  "selectedShowTrainees",
                                                                                  0
                                                                                )
                                                                              }
                                                                            >
                                                                              {this.props.t(
                                                                                "List"
                                                                              )}
                                                                            </button>
                                                                          </div>
                                                                        </Col>
                                                                      </Row>
                                                                    </Col>
                                                                    <Col className="col-6">
                                                                      <Row>
                                                                        <Col className="col-4">
                                                                          <Label for="showLectureInfo">
                                                                            {this.props.t(
                                                                              "Show Lecture Info"
                                                                            )}
                                                                          </Label>
                                                                        </Col>
                                                                        <Col className="col-8">
                                                                          <div
                                                                            className={
                                                                              "btn-group"
                                                                              // +
                                                                              // (NeedSectionError
                                                                              //   ? " border border-danger rounded p-1"
                                                                              //   : "")
                                                                            }
                                                                          >
                                                                            <button
                                                                              type="button"
                                                                              className={`btn ${
                                                                                this
                                                                                  .state
                                                                                  .selectedShowLectureInfo ===
                                                                                1
                                                                                  ? "btn-primary"
                                                                                  : "btn-outline-secondary"
                                                                              }`}
                                                                              onClick={() =>
                                                                                this.handleToggleChange(
                                                                                  "selectedShowLectureInfo",
                                                                                  1
                                                                                )
                                                                              }
                                                                            >
                                                                              {this.props.t(
                                                                                "Yes"
                                                                              )}
                                                                            </button>
                                                                            <button
                                                                              type="button"
                                                                              className={`btn ${
                                                                                this
                                                                                  .state
                                                                                  .selectedShowLectureInfo ===
                                                                                0
                                                                                  ? "btn-primary"
                                                                                  : "btn-outline-secondary"
                                                                              }`}
                                                                              onClick={() =>
                                                                                this.handleToggleChange(
                                                                                  "selectedShowLectureInfo",
                                                                                  0
                                                                                )
                                                                              }
                                                                            >
                                                                              {this.props.t(
                                                                                "No"
                                                                              )}
                                                                            </button>
                                                                          </div>
                                                                        </Col>
                                                                      </Row>
                                                                    </Col>
                                                                  </Row>
                                                                </div>
                                                              </CardBody>
                                                            </Card>
                                                          </Row>
                                                        </CardBody>
                                                      </Card>

                                                      <Row>
                                                        <Card className="mt-3">
                                                          <CardTitle id="course_header">
                                                            {t(
                                                              "Lecture Of Date"
                                                            )}
                                                            {""} - {""}
                                                            <small>
                                                              {currentTime.toLocaleDateString()}{" "}
                                                            </small>
                                                          </CardTitle>
                                                          <CardBody className="cardBody">
                                                            <div className="mb-3">
                                                              <Row>
                                                                <Col className="col-6"></Col>
                                                              </Row>
                                                            </div>
                                                          </CardBody>
                                                        </Card>
                                                      </Row>
                                                    </Form>
                                                  )}
                                                </Formik>
                                              </div>
                                            )}
                                            {showWeekLecture && (
                                              <div>
                                                <Formik
                                                  enableReinitialize={true}
                                                  initialValues={{
                                                    ...(isEdit &&
                                                      regTrainee && {
                                                        Id: regTrainee.Id,
                                                      }),
                                                    showAbsent:
                                                      regTrainee?.showAbsent ||
                                                      selectedShowAbsent,
                                                    showLecture:
                                                      regTrainee?.showLecture ||
                                                      selectedShowLecture,
                                                    showTrainees:
                                                      regTrainee?.showTrainees ||
                                                      selectedShowTrainees,
                                                    showInstructor:
                                                      regTrainee?.showInstructor ||
                                                      selectedshowInstructor,
                                                    showLectureInfo:
                                                      regTrainee?.showLectureInfo ||
                                                      selectedShowLectureInfo,
                                                  }}
                                                  validationSchema={Yup.object().shape(
                                                    {
                                                      arTitle:
                                                        Yup.string().required(
                                                          t(
                                                            "Course Name (ar) is required"
                                                          )
                                                        ),
                                                    }
                                                  )}
                                                >
                                                  {({
                                                    errors,
                                                    status,
                                                    touched,
                                                    values,
                                                    handleChange,
                                                    handleBlur,
                                                    setFieldValue,
                                                  }) => (
                                                    <Form>
                                                      <Card className="mt-3">
                                                        <CardHeader className="card-header text-center">
                                                          <h4>
                                                            {t(
                                                              "Current Leacture"
                                                            )}
                                                          </h4>
                                                        </CardHeader>
                                                        <CardBody className="cardBody">
                                                          <Row>
                                                            <Card className="mt-3">
                                                              <CardTitle id="course_header">
                                                                {t(
                                                                  "Show Options"
                                                                )}
                                                              </CardTitle>
                                                              <CardBody className="cardBody">
                                                                <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-6">
                                                                      <Row>
                                                                        <Col className="col-4">
                                                                          <Label for="showAbsent">
                                                                            {this.props.t(
                                                                              "Show Absent"
                                                                            )}
                                                                          </Label>
                                                                        </Col>
                                                                        <Col className="col-8">
                                                                          <div
                                                                            className={
                                                                              "btn-group"
                                                                              // +
                                                                              // (NeedSectionError
                                                                              //   ? " border border-danger rounded p-1"
                                                                              //   : "")
                                                                            }
                                                                          >
                                                                            <button
                                                                              type="button"
                                                                              className={`btn ${
                                                                                this
                                                                                  .state
                                                                                  .selectedShowAbsent ===
                                                                                1
                                                                                  ? "btn-primary"
                                                                                  : "btn-outline-secondary"
                                                                              }`}
                                                                              onClick={() =>
                                                                                this.handleToggleChange(
                                                                                  "selectedShowAbsent",
                                                                                  1
                                                                                )
                                                                              }
                                                                            >
                                                                              {this.props.t(
                                                                                "Dialog"
                                                                              )}
                                                                            </button>
                                                                            <button
                                                                              type="button"
                                                                              className={`btn ${
                                                                                this
                                                                                  .state
                                                                                  .selectedShowAbsent ===
                                                                                0
                                                                                  ? "btn-primary"
                                                                                  : "btn-outline-secondary"
                                                                              }`}
                                                                              onClick={() =>
                                                                                this.handleToggleChange(
                                                                                  "selectedShowAbsent",
                                                                                  0
                                                                                )
                                                                              }
                                                                            >
                                                                              {this.props.t(
                                                                                "Same Page"
                                                                              )}
                                                                            </button>
                                                                          </div>
                                                                        </Col>
                                                                      </Row>
                                                                    </Col>
                                                                  </Row>
                                                                </div>
                                                                <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-6">
                                                                      <Row>
                                                                        <Col className="col-4">
                                                                          <Label for="showLecture">
                                                                            {this.props.t(
                                                                              "Show Lecture"
                                                                            )}
                                                                          </Label>
                                                                        </Col>
                                                                        <Col className="col-8">
                                                                          <div
                                                                            className={
                                                                              "btn-group"
                                                                              // +
                                                                              // (NeedSectionError
                                                                              //   ? " border border-danger rounded p-1"
                                                                              //   : "")
                                                                            }
                                                                          >
                                                                            <button
                                                                              type="button"
                                                                              className={`btn ${
                                                                                this
                                                                                  .state
                                                                                  .selectedShowLecture ===
                                                                                1
                                                                                  ? "btn-primary"
                                                                                  : "btn-outline-secondary"
                                                                              }`}
                                                                              onClick={() =>
                                                                                this.handleToggleChange(
                                                                                  "selectedShowLecture",
                                                                                  1
                                                                                )
                                                                              }
                                                                            >
                                                                              {this.props.t(
                                                                                "Cards"
                                                                              )}
                                                                            </button>
                                                                            <button
                                                                              type="button"
                                                                              className={`btn ${
                                                                                this
                                                                                  .state
                                                                                  .selectedShowLecture ===
                                                                                0
                                                                                  ? "btn-primary"
                                                                                  : "btn-outline-secondary"
                                                                              }`}
                                                                              onClick={() =>
                                                                                this.handleToggleChange(
                                                                                  "selectedShowLecture",
                                                                                  0
                                                                                )
                                                                              }
                                                                            >
                                                                              {this.props.t(
                                                                                "List"
                                                                              )}
                                                                            </button>
                                                                          </div>
                                                                        </Col>
                                                                      </Row>
                                                                    </Col>
                                                                    <Col className="col-6">
                                                                      <Row>
                                                                        <Col className="col-4">
                                                                          <Label for="showInstructor">
                                                                            {this.props.t(
                                                                              "show Instructor Info"
                                                                            )}
                                                                          </Label>
                                                                        </Col>
                                                                        <Col className="col-8">
                                                                          <div
                                                                            className={
                                                                              "btn-group"
                                                                              // +
                                                                              // (NeedSectionError
                                                                              //   ? " border border-danger rounded p-1"
                                                                              //   : "")
                                                                            }
                                                                          >
                                                                            <button
                                                                              type="button"
                                                                              className={`btn ${
                                                                                this
                                                                                  .state
                                                                                  .selectedshowInstructor ===
                                                                                1
                                                                                  ? "btn-primary"
                                                                                  : "btn-outline-secondary"
                                                                              }`}
                                                                              onClick={() =>
                                                                                this.handleToggleChange(
                                                                                  "selectedshowInstructor",
                                                                                  1
                                                                                )
                                                                              }
                                                                            >
                                                                              {this.props.t(
                                                                                "Yes"
                                                                              )}
                                                                            </button>
                                                                            <button
                                                                              type="button"
                                                                              className={`btn ${
                                                                                this
                                                                                  .state
                                                                                  .selectedshowInstructor ===
                                                                                0
                                                                                  ? "btn-primary"
                                                                                  : "btn-outline-secondary"
                                                                              }`}
                                                                              onClick={() =>
                                                                                this.handleToggleChange(
                                                                                  "selectedshowInstructor",
                                                                                  0
                                                                                )
                                                                              }
                                                                            >
                                                                              {this.props.t(
                                                                                "No"
                                                                              )}
                                                                            </button>
                                                                          </div>
                                                                        </Col>
                                                                      </Row>
                                                                    </Col>
                                                                  </Row>
                                                                </div>
                                                                <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-6">
                                                                      <Row>
                                                                        <Col className="col-4">
                                                                          <Label for="showTrainees">
                                                                            {this.props.t(
                                                                              "Show Trainees"
                                                                            )}
                                                                          </Label>
                                                                        </Col>
                                                                        <Col className="col-8">
                                                                          <div
                                                                            className={
                                                                              "btn-group"
                                                                              // +
                                                                              // (NeedSectionError
                                                                              //   ? " border border-danger rounded p-1"
                                                                              //   : "")
                                                                            }
                                                                          >
                                                                            <button
                                                                              type="button"
                                                                              className={`btn ${
                                                                                this
                                                                                  .state
                                                                                  .selectedShowTrainees ===
                                                                                1
                                                                                  ? "btn-primary"
                                                                                  : "btn-outline-secondary"
                                                                              }`}
                                                                              onClick={() =>
                                                                                this.handleToggleChange(
                                                                                  "selectedShowTrainees",
                                                                                  1
                                                                                )
                                                                              }
                                                                            >
                                                                              {this.props.t(
                                                                                "Cards"
                                                                              )}
                                                                            </button>
                                                                            <button
                                                                              type="button"
                                                                              className={`btn ${
                                                                                this
                                                                                  .state
                                                                                  .selectedShowTrainees ===
                                                                                0
                                                                                  ? "btn-primary"
                                                                                  : "btn-outline-secondary"
                                                                              }`}
                                                                              onClick={() =>
                                                                                this.handleToggleChange(
                                                                                  "selectedShowTrainees",
                                                                                  0
                                                                                )
                                                                              }
                                                                            >
                                                                              {this.props.t(
                                                                                "List"
                                                                              )}
                                                                            </button>
                                                                          </div>
                                                                        </Col>
                                                                      </Row>
                                                                    </Col>
                                                                    <Col className="col-6">
                                                                      <Row>
                                                                        <Col className="col-4">
                                                                          <Label for="showLectureInfo">
                                                                            {this.props.t(
                                                                              "Show Lecture Info"
                                                                            )}
                                                                          </Label>
                                                                        </Col>
                                                                        <Col className="col-8">
                                                                          <div
                                                                            className={
                                                                              "btn-group"
                                                                              // +
                                                                              // (NeedSectionError
                                                                              //   ? " border border-danger rounded p-1"
                                                                              //   : "")
                                                                            }
                                                                          >
                                                                            <button
                                                                              type="button"
                                                                              className={`btn ${
                                                                                this
                                                                                  .state
                                                                                  .selectedShowLectureInfo ===
                                                                                1
                                                                                  ? "btn-primary"
                                                                                  : "btn-outline-secondary"
                                                                              }`}
                                                                              onClick={() =>
                                                                                this.handleToggleChange(
                                                                                  "selectedShowLectureInfo",
                                                                                  1
                                                                                )
                                                                              }
                                                                            >
                                                                              {this.props.t(
                                                                                "Yes"
                                                                              )}
                                                                            </button>
                                                                            <button
                                                                              type="button"
                                                                              className={`btn ${
                                                                                this
                                                                                  .state
                                                                                  .selectedShowLectureInfo ===
                                                                                0
                                                                                  ? "btn-primary"
                                                                                  : "btn-outline-secondary"
                                                                              }`}
                                                                              onClick={() =>
                                                                                this.handleToggleChange(
                                                                                  "selectedShowLectureInfo",
                                                                                  0
                                                                                )
                                                                              }
                                                                            >
                                                                              {this.props.t(
                                                                                "No"
                                                                              )}
                                                                            </button>
                                                                          </div>
                                                                        </Col>
                                                                      </Row>
                                                                    </Col>
                                                                  </Row>
                                                                </div>
                                                              </CardBody>
                                                            </Card>
                                                          </Row>
                                                        </CardBody>
                                                      </Card>

                                                      <Row>
                                                        <Card className="mt-3">
                                                          <CardTitle id="course_header">
                                                            {t(
                                                              " Lecture Of Week Day"
                                                            )}
                                                            {""} - {""}
                                                            <small>
                                                              Day{" "}
                                                              {this.getDayNumber(
                                                                currentTime
                                                              )}
                                                            </small>
                                                          </CardTitle>
                                                          <CardBody className="cardBody">
                                                            <div className="mb-3">
                                                              <Row>
                                                                <Col className="col-6"></Col>
                                                              </Row>
                                                            </div>
                                                          </CardBody>
                                                        </Card>
                                                      </Row>
                                                    </Form>
                                                  )}
                                                </Formik>
                                              </div>
                                            )}

                                            {showCourseLectures && (
                                              <div>
                                                <Card className="bordered">
                                                  <CardHeader className="card-header">
                                                    <h4>
                                                      {t(" Course's Lectures")}
                                                    </h4>
                                                  </CardHeader>
                                                  <CardBody>
                                                    <div>
                                                      <BootstrapTable
                                                        keyField="Id"
                                                        data={regTrainees}
                                                        columns={
                                                          lecturesColumns
                                                        }
                                                        cellEdit={cellEditFactory(
                                                          {
                                                            mode: "dbclick",
                                                            blurToSave: true,
                                                            // afterSaveCell: (
                                                            //   oldValue,
                                                            //   newValue,
                                                            //   row,
                                                            //   column
                                                            // ) => {
                                                            //   this.handleParentsDataChange(
                                                            //     row.Id,
                                                            //     column.dataField,
                                                            //     newValue
                                                            //   );
                                                            // },
                                                          }
                                                        )}
                                                        noDataIndication={t(
                                                          "No Relatives Found"
                                                        )}
                                                        defaultSorted={
                                                          defaultSorting
                                                        }
                                                      />
                                                    </div>
                                                    <Modal
                                                      isOpen={this.state.modal1}
                                                      className={
                                                        this.props.className
                                                      }
                                                      size="xl"
                                                    >
                                                      <ModalHeader
                                                        toggle={this.toggle1}
                                                        tag="h4"
                                                      >
                                                        {!!isOpen
                                                          ? this.props.t(
                                                              "Update Lecture"
                                                            )
                                                          : ""}
                                                      </ModalHeader>
                                                      <Row>
                                                        <div>
                                                          {errorMessage && (
                                                            <Alert
                                                              color="danger"
                                                              className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                              role="alert"
                                                            >
                                                              {errorMessage}
                                                              <button
                                                                type="button"
                                                                className="btn-close"
                                                                aria-label="Close"
                                                                onClick={
                                                                  this
                                                                    .handleErrorClose
                                                                }
                                                              ></button>
                                                            </Alert>
                                                          )}
                                                        </div>
                                                      </Row>
                                                      <ModalBody>
                                                        <Formik
                                                          enableReinitialize={
                                                            true
                                                          }
                                                          initialValues={{
                                                            ...(isEdit &&
                                                              regTrainee && {
                                                                Id: regTrainee.Id,
                                                              }),
                                                            lectureDate:
                                                              regTrainee?.lectureDate
                                                                ? moment
                                                                    .utc(
                                                                      regTrainee.lectureDate
                                                                    )
                                                                    .local()
                                                                    .format(
                                                                      "YYYY-MM-DD"
                                                                    )
                                                                : "",
                                                            startTime:
                                                              regTrainee?.startTime
                                                                ? moment
                                                                    .utc(
                                                                      regTrainee.startTime
                                                                    )
                                                                    .local()
                                                                    .format(
                                                                      "HH:mm"
                                                                    )
                                                                : "",
                                                            tillTime:
                                                              regTrainee?.tillTime
                                                                ? moment
                                                                    .utc(
                                                                      regTrainee.tillTime
                                                                    )
                                                                    .local()
                                                                    .format(
                                                                      "HH:mm"
                                                                    )
                                                                : "",
                                                            arLectureTitle:
                                                              regTrainee?.arLectureTitle ||
                                                              "",
                                                            enLectureTitle:
                                                              regTrainee?.enLectureTitle ||
                                                              "",
                                                            lectureOrder:
                                                              regTrainee?.lectureOrder ||
                                                              "",
                                                            weekOrder:
                                                              regTrainee?.weekOrder ||
                                                              "",
                                                            hallId:
                                                              (regTrainee &&
                                                                regTrainee.hallName) ||
                                                              "",
                                                            altHallId:
                                                              (regTrainee &&
                                                                regTrainee.altHallName) ||
                                                              "",
                                                            instructorId:
                                                              (regTrainee &&
                                                                regTrainee.instructorName) ||
                                                              "",
                                                            altInstructorId:
                                                              (regTrainee &&
                                                                regTrainee.altInstructorName) ||
                                                              "",
                                                            instAttend:
                                                              regTrainee?.instAttend ||
                                                              selectedInstAttend,
                                                            altInstAttend:
                                                              regTrainee?.altInstAttend ||
                                                              selectedAltInstAttend,
                                                            online:
                                                              regTrainee?.online ||
                                                              selectedOnline,
                                                            additional:
                                                              regTrainee?.additional ||
                                                              selectedAdditional,
                                                            canceled:
                                                              regTrainee?.canceled ||
                                                              selectedCanceled,
                                                            closeLecture:
                                                              regTrainee?.closeLecture ||
                                                              selectedCloseLecture,
                                                          }}
                                                          validationSchema={Yup.object().shape(
                                                            {
                                                              arTitle:
                                                                Yup.string().required(
                                                                  t(
                                                                    "Course Name (ar) is required"
                                                                  )
                                                                ),
                                                            }
                                                          )}
                                                        >
                                                          {({
                                                            errors,
                                                            status,
                                                            touched,
                                                            values,
                                                            handleChange,
                                                            handleBlur,
                                                            setFieldValue,
                                                          }) => (
                                                            <Form>
                                                              <Card className="mt-3">
                                                                <CardHeader className="card-header text-center">
                                                                  <h4>
                                                                    {t(
                                                                      "Update Leacture"
                                                                    )}
                                                                  </h4>
                                                                </CardHeader>
                                                                <CardBody className="cardBody">
                                                                  <Row className="mb-3">
                                                                    <Col className="col-2">
                                                                      <Label for="lectureDate">
                                                                        {this.props.t(
                                                                          "Lecture Date"
                                                                        )}
                                                                      </Label>
                                                                      <span className="text-danger">
                                                                        *
                                                                      </span>
                                                                    </Col>
                                                                    <Col className="col-2">
                                                                      <Field
                                                                        name="lectureDate"
                                                                        className={`form-control ${
                                                                          lectureDateError
                                                                            ? "is-invalid"
                                                                            : ""
                                                                        }`}
                                                                        type="date"
                                                                        value={
                                                                          values.lectureDate
                                                                            ? new Date(
                                                                                values.lectureDate
                                                                              )
                                                                                .toISOString()
                                                                                .split(
                                                                                  "T"
                                                                                )[0]
                                                                            : ""
                                                                        }
                                                                        onChange={
                                                                          handleChange
                                                                        }
                                                                        onBlur={
                                                                          handleBlur
                                                                        }
                                                                        id="arbirthdate-date-input"
                                                                      />
                                                                      {lectureDateError && (
                                                                        <div className="invalid-feedback">
                                                                          {this.props.t(
                                                                            "Lecture Date is required"
                                                                          )}
                                                                        </div>
                                                                      )}
                                                                    </Col>

                                                                    <Col className="col-2">
                                                                      <Label for="startTime">
                                                                        {this.props.t(
                                                                          "Start Time"
                                                                        )}
                                                                      </Label>
                                                                      <span className="text-danger">
                                                                        *
                                                                      </span>
                                                                    </Col>
                                                                    <Col className="col-2">
                                                                      <Field
                                                                        name="startTime"
                                                                        className={`form-control ${
                                                                          startTimeError
                                                                            ? "is-invalid"
                                                                            : ""
                                                                        }`}
                                                                        type="time"
                                                                        value={
                                                                          values.startTime
                                                                            ? values.startTime
                                                                            : ""
                                                                        }
                                                                        onChange={
                                                                          handleChange
                                                                        }
                                                                        onBlur={
                                                                          handleBlur
                                                                        }
                                                                        id="lstartTime-input"
                                                                      />
                                                                      {startTimeError && (
                                                                        <div className="invalid-feedback">
                                                                          {this.props.t(
                                                                            "Start Time is required"
                                                                          )}
                                                                        </div>
                                                                      )}
                                                                    </Col>

                                                                    <Col className="col-2">
                                                                      <Label for="tillTime">
                                                                        {this.props.t(
                                                                          "Till Time"
                                                                        )}
                                                                      </Label>
                                                                      <span className="text-danger">
                                                                        *
                                                                      </span>
                                                                    </Col>
                                                                    <Col className="col-2">
                                                                      <Field
                                                                        name="tillTime"
                                                                        className={`form-control ${
                                                                          tillTimeError
                                                                            ? "is-invalid"
                                                                            : ""
                                                                        }`}
                                                                        type="time"
                                                                        value={
                                                                          values.tillTime
                                                                            ? values.tillTime
                                                                            : ""
                                                                        }
                                                                        onChange={
                                                                          handleChange
                                                                        }
                                                                        onBlur={
                                                                          handleBlur
                                                                        }
                                                                        id="tillTime-input"
                                                                      />
                                                                      {tillTimeError && (
                                                                        <div className="invalid-feedback">
                                                                          {this.props.t(
                                                                            "Till Time is required"
                                                                          )}
                                                                        </div>
                                                                      )}
                                                                    </Col>
                                                                  </Row>
                                                                  <Row className="mb-3">
                                                                    <Col className="col-2">
                                                                      <Label for="arLectureTitle">
                                                                        {this.props.t(
                                                                          "Lecture Title(Ar)"
                                                                        )}
                                                                      </Label>
                                                                      <span className="text-danger">
                                                                        *
                                                                      </span>
                                                                    </Col>
                                                                    <Col className="col-4">
                                                                      <Field
                                                                        type="text"
                                                                        name="arLectureTitle"
                                                                        id="arLectureTitle"
                                                                        className={
                                                                          "form-control" +
                                                                          ((errors.arLectureTitle &&
                                                                            touched.arLectureTitle) ||
                                                                          arLectureTitleError
                                                                            ? " is-invalid"
                                                                            : "")
                                                                        }
                                                                      />

                                                                      {arLectureTitleError && (
                                                                        <div className="invalid-feedback">
                                                                          {this.props.t(
                                                                            "Lecture Title (Ar) is required"
                                                                          )}
                                                                        </div>
                                                                      )}
                                                                      <ErrorMessage
                                                                        name="arLectureTitle"
                                                                        component="div"
                                                                        className="invalid-feedback"
                                                                      />
                                                                    </Col>
                                                                    <Col className="col-2">
                                                                      <Label for="lectureOrder">
                                                                        {this.props.t(
                                                                          "Lecture Order"
                                                                        )}
                                                                      </Label>
                                                                    </Col>
                                                                    <Col className="col-4">
                                                                      <Field
                                                                        type="text"
                                                                        name="lectureOrder"
                                                                        id="lectureOrder"
                                                                        className={
                                                                          "form-control"
                                                                        }
                                                                      />
                                                                    </Col>
                                                                  </Row>
                                                                  <Row className="mb-3">
                                                                    <Col className="col-2">
                                                                      <Label for="enLectureTitle">
                                                                        {this.props.t(
                                                                          "Lecture Title(En)"
                                                                        )}
                                                                      </Label>
                                                                      <span className="text-danger">
                                                                        *
                                                                      </span>
                                                                    </Col>
                                                                    <Col className="col-4">
                                                                      <Field
                                                                        type="text"
                                                                        name="enLectureTitle"
                                                                        id="enLectureTitle"
                                                                        className={
                                                                          "form-control" +
                                                                          ((errors.enLectureTitle &&
                                                                            touched.enLectureTitle) ||
                                                                          enLectureTitleError
                                                                            ? " is-invalid"
                                                                            : "")
                                                                        }
                                                                      />

                                                                      {enLectureTitleError && (
                                                                        <div className="invalid-feedback">
                                                                          {this.props.t(
                                                                            "Lecture Title (En) is required"
                                                                          )}
                                                                        </div>
                                                                      )}
                                                                      <ErrorMessage
                                                                        name="enLectureTitle"
                                                                        component="div"
                                                                        className="invalid-feedback"
                                                                      />
                                                                    </Col>
                                                                    <Col className="col-2">
                                                                      <Label for="weekOrder">
                                                                        {this.props.t(
                                                                          "Week Order"
                                                                        )}
                                                                      </Label>
                                                                    </Col>
                                                                    <Col className="col-4">
                                                                      <Field
                                                                        type="text"
                                                                        name="weekOrder"
                                                                        id="weekOrder"
                                                                        className={
                                                                          "form-control"
                                                                        }
                                                                      />
                                                                    </Col>
                                                                  </Row>
                                                                  <Row>
                                                                    <Col className="col-2 mb-3">
                                                                      <Label for="inst">
                                                                        {t(
                                                                          "Instructor"
                                                                        )}
                                                                      </Label>
                                                                      <span className="text-danger">
                                                                        *
                                                                      </span>
                                                                    </Col>
                                                                    <Col className="col-4">
                                                                      <Field
                                                                        name="instructorId"
                                                                        as="input"
                                                                        type="text"
                                                                        placeholder="Search..."
                                                                        className={
                                                                          "form-control" +
                                                                          (errors.instructorId &&
                                                                          touched.instructorId
                                                                            ? " is-invalid"
                                                                            : "")
                                                                        }
                                                                        value={
                                                                          employeesNames.find(
                                                                            empl =>
                                                                              empl.key ===
                                                                              this
                                                                                .state
                                                                                .selectedInstructorId
                                                                          )
                                                                            ?.value ||
                                                                          ""
                                                                        }
                                                                        onChange={e => {
                                                                          const newValue =
                                                                            e
                                                                              .target
                                                                              .value;

                                                                          const selectedInstructor =
                                                                            employeesNames.find(
                                                                              empl =>
                                                                                empl.value ===
                                                                                newValue
                                                                            );

                                                                          if (
                                                                            selectedInstructor
                                                                          ) {
                                                                            this.setState(
                                                                              {
                                                                                selectedInstructorId:
                                                                                  selectedInstructor.key,
                                                                                defaultInstructorName:
                                                                                  selectedInstructor.value,
                                                                              }
                                                                            );
                                                                          } else {
                                                                            this.setState(
                                                                              {
                                                                                selectedInstructorId:
                                                                                  null,
                                                                                defaultInstructorName:
                                                                                  newValue,
                                                                              }
                                                                            );
                                                                          }
                                                                        }}
                                                                        list="instructorIdList"
                                                                        autoComplete="off"
                                                                      />

                                                                      <datalist id="instructorIdList">
                                                                        {employeesNames.map(
                                                                          employee => (
                                                                            <option
                                                                              key={
                                                                                employee.key
                                                                              }
                                                                              value={
                                                                                employee.value
                                                                              }
                                                                            />
                                                                          )
                                                                        )}
                                                                      </datalist>
                                                                    </Col>
                                                                    <Col className="col-2 mb-3">
                                                                      <Label for="room">
                                                                        {t(
                                                                          "Room"
                                                                        )}
                                                                      </Label>
                                                                      <span className="text-danger">
                                                                        *
                                                                      </span>
                                                                    </Col>
                                                                    <Col className="col-4">
                                                                      <Field
                                                                        name="hallId"
                                                                        as="input"
                                                                        type="text"
                                                                        placeholder="Search..."
                                                                        className={
                                                                          "form-control" +
                                                                          (errors.hallId &&
                                                                          touched.hallId
                                                                            ? " is-invalid"
                                                                            : "")
                                                                        }
                                                                        value={
                                                                          halls.find(
                                                                            h =>
                                                                              h.key ===
                                                                              this
                                                                                .state
                                                                                .selectedHallKey
                                                                          )
                                                                            ?.value ||
                                                                          ""
                                                                        }
                                                                        onChange={e => {
                                                                          const newValue =
                                                                            e
                                                                              .target
                                                                              .value;

                                                                          const selectedHall =
                                                                            halls.find(
                                                                              h =>
                                                                                h.value ===
                                                                                newValue
                                                                            );

                                                                          if (
                                                                            selectedHall
                                                                          ) {
                                                                            this.setState(
                                                                              {
                                                                                selectedHallKey:
                                                                                  selectedHall.key,
                                                                                defaultHallName:
                                                                                  selectedHall.value,
                                                                              }
                                                                            );
                                                                          } else {
                                                                            this.setState(
                                                                              {
                                                                                selectedHallKey:
                                                                                  null,
                                                                                defaultHallName:
                                                                                  newValue,
                                                                              }
                                                                            );
                                                                          }
                                                                        }}
                                                                        list="hallIdList"
                                                                        autoComplete="off"
                                                                      />

                                                                      <datalist id="hallIdList">
                                                                        {halls.map(
                                                                          hall => (
                                                                            <option
                                                                              key={
                                                                                hall.key
                                                                              }
                                                                              value={
                                                                                hall.value
                                                                              }
                                                                            />
                                                                          )
                                                                        )}
                                                                      </datalist>
                                                                    </Col>

                                                                    <Col className="col-2 mb-3">
                                                                      <Label for="altInst">
                                                                        {t(
                                                                          "Alt.Instructor"
                                                                        )}
                                                                      </Label>
                                                                    </Col>
                                                                    <Col className="col-4">
                                                                      <Field
                                                                        name="altInstructor"
                                                                        as="input"
                                                                        type="text"
                                                                        placeholder="Search..."
                                                                        className={
                                                                          "form-control"
                                                                        }
                                                                        value={
                                                                          employeesNames.find(
                                                                            e =>
                                                                              e.key ===
                                                                              this
                                                                                .state
                                                                                .selectedAltInstructorId
                                                                          )
                                                                            ?.value ||
                                                                          ""
                                                                        }
                                                                        onChange={e => {
                                                                          const newValue =
                                                                            e
                                                                              .target
                                                                              .value;

                                                                          const selectedAltInstructor =
                                                                            employeesNames.find(
                                                                              e =>
                                                                                e.value ===
                                                                                newValue
                                                                            );

                                                                          if (
                                                                            selectedAltInstructor
                                                                          ) {
                                                                            this.setState(
                                                                              {
                                                                                selectedAltInstructorId:
                                                                                  selectedAltInstructor.key,
                                                                                defaultAltInstructorName:
                                                                                  selectedAltInstructor.value,
                                                                              }
                                                                            );
                                                                          } else {
                                                                            this.setState(
                                                                              {
                                                                                selectedAltInstructorId:
                                                                                  null,
                                                                                defaultAltInstructorName:
                                                                                  newValue,
                                                                              }
                                                                            );
                                                                          }
                                                                        }}
                                                                        list="altInstructorList"
                                                                        autoComplete="off"
                                                                      />

                                                                      <datalist id="altInstructorList">
                                                                        {employeesNames.map(
                                                                          altEmp => (
                                                                            <option
                                                                              key={
                                                                                altEmp.key
                                                                              }
                                                                              value={
                                                                                altEmp.value
                                                                              }
                                                                            />
                                                                          )
                                                                        )}
                                                                      </datalist>
                                                                    </Col>
                                                                    <Col className="col-2 mb-3">
                                                                      <Label for="altroom">
                                                                        {t(
                                                                          "Alt Room"
                                                                        )}
                                                                      </Label>
                                                                    </Col>
                                                                    <Col className="col-4">
                                                                      <Field
                                                                        name="altHallId"
                                                                        as="input"
                                                                        type="text"
                                                                        placeholder="Search..."
                                                                        className={
                                                                          "form-control"
                                                                        }
                                                                        value={
                                                                          halls.find(
                                                                            h =>
                                                                              h.key ===
                                                                              this
                                                                                .state
                                                                                .selectedAltHallKey
                                                                          )
                                                                            ?.value ||
                                                                          ""
                                                                        }
                                                                        onChange={e => {
                                                                          const newValue =
                                                                            e
                                                                              .target
                                                                              .value;

                                                                          const selectedAltHall =
                                                                            halls.find(
                                                                              h =>
                                                                                h.value ===
                                                                                newValue
                                                                            );

                                                                          if (
                                                                            selectedAltHall
                                                                          ) {
                                                                            this.setState(
                                                                              {
                                                                                selectedAltHallKey:
                                                                                  selectedAltHall.key,
                                                                                defaultAltHallName:
                                                                                  selectedAltHall.value,
                                                                              }
                                                                            );
                                                                          } else {
                                                                            this.setState(
                                                                              {
                                                                                selectedAltHallKey:
                                                                                  null,
                                                                                defaultAltHallName:
                                                                                  newValue,
                                                                              }
                                                                            );
                                                                          }
                                                                        }}
                                                                        list="altHallIdList"
                                                                        autoComplete="off"
                                                                      />

                                                                      <datalist id="altHallIdList">
                                                                        {halls.map(
                                                                          althall => (
                                                                            <option
                                                                              key={
                                                                                althall.key
                                                                              }
                                                                              value={
                                                                                althall.value
                                                                              }
                                                                            />
                                                                          )
                                                                        )}
                                                                      </datalist>
                                                                    </Col>
                                                                  </Row>
                                                                  <Row>
                                                                    <div className="mb-3">
                                                                      <Row>
                                                                        <Col className="col-4">
                                                                          <Row>
                                                                            <Col className="col-6">
                                                                              <Label for="instAttend">
                                                                                {this.props.t(
                                                                                  "Inst. Attend"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col className="col-6">
                                                                              <div
                                                                                className={
                                                                                  "btn-group"
                                                                                  // +
                                                                                  // (NeedSectionError
                                                                                  //   ? " border border-danger rounded p-1"
                                                                                  //   : "")
                                                                                }
                                                                              >
                                                                                <button
                                                                                  type="button"
                                                                                  className={`btn ${
                                                                                    this
                                                                                      .state
                                                                                      .selectedInstAttend ===
                                                                                    1
                                                                                      ? "btn-primary"
                                                                                      : "btn-outline-secondary"
                                                                                  }`}
                                                                                  onClick={() =>
                                                                                    this.handleToggleChange(
                                                                                      "selectedInstAttend",
                                                                                      1
                                                                                    )
                                                                                  }
                                                                                >
                                                                                  {this.props.t(
                                                                                    "Yes"
                                                                                  )}
                                                                                </button>
                                                                                <button
                                                                                  type="button"
                                                                                  className={`btn ${
                                                                                    this
                                                                                      .state
                                                                                      .selectedInstAttend ===
                                                                                    0
                                                                                      ? "btn-primary"
                                                                                      : "btn-outline-secondary"
                                                                                  }`}
                                                                                  onClick={() =>
                                                                                    this.handleToggleChange(
                                                                                      "selectedInstAttend",
                                                                                      0
                                                                                    )
                                                                                  }
                                                                                >
                                                                                  {this.props.t(
                                                                                    "No"
                                                                                  )}
                                                                                </button>
                                                                              </div>
                                                                            </Col>
                                                                          </Row>
                                                                        </Col>
                                                                        <Col className="col-4">
                                                                          <Row>
                                                                            <Col className="col-6">
                                                                              <Label for="online">
                                                                                {this.props.t(
                                                                                  "Online"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col className="col-6">
                                                                              <div
                                                                                className={
                                                                                  "btn-group"
                                                                                  // +
                                                                                  // (NeedSectionError
                                                                                  //   ? " border border-danger rounded p-1"
                                                                                  //   : "")
                                                                                }
                                                                              >
                                                                                <button
                                                                                  type="button"
                                                                                  className={`btn ${
                                                                                    this
                                                                                      .state
                                                                                      .selectedOnline ===
                                                                                    1
                                                                                      ? "btn-primary"
                                                                                      : "btn-outline-secondary"
                                                                                  }`}
                                                                                  onClick={() =>
                                                                                    this.handleToggleChange(
                                                                                      "selectedOnline",
                                                                                      1
                                                                                    )
                                                                                  }
                                                                                >
                                                                                  {this.props.t(
                                                                                    "Yes"
                                                                                  )}
                                                                                </button>
                                                                                <button
                                                                                  type="button"
                                                                                  className={`btn ${
                                                                                    this
                                                                                      .state
                                                                                      .selectedOnline ===
                                                                                    0
                                                                                      ? "btn-primary"
                                                                                      : "btn-outline-secondary"
                                                                                  }`}
                                                                                  onClick={() =>
                                                                                    this.handleToggleChange(
                                                                                      "selectedOnline",
                                                                                      0
                                                                                    )
                                                                                  }
                                                                                >
                                                                                  {this.props.t(
                                                                                    "No"
                                                                                  )}
                                                                                </button>
                                                                              </div>
                                                                            </Col>
                                                                          </Row>
                                                                        </Col>
                                                                        <Col className="col-4">
                                                                          <Row>
                                                                            <Col className="col-6">
                                                                              <Label for="additional">
                                                                                {this.props.t(
                                                                                  "Additional"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col className="col-6">
                                                                              <div
                                                                                className={
                                                                                  "btn-group"
                                                                                  // +
                                                                                  // (NeedSectionError
                                                                                  //   ? " border border-danger rounded p-1"
                                                                                  //   : "")
                                                                                }
                                                                              >
                                                                                <button
                                                                                  type="button"
                                                                                  className={`btn ${
                                                                                    this
                                                                                      .state
                                                                                      .selectedAdditional ===
                                                                                    1
                                                                                      ? "btn-primary"
                                                                                      : "btn-outline-secondary"
                                                                                  }`}
                                                                                  onClick={() =>
                                                                                    this.handleToggleChange(
                                                                                      "selectedAdditional",
                                                                                      1
                                                                                    )
                                                                                  }
                                                                                >
                                                                                  {this.props.t(
                                                                                    "Yes"
                                                                                  )}
                                                                                </button>
                                                                                <button
                                                                                  type="button"
                                                                                  className={`btn ${
                                                                                    this
                                                                                      .state
                                                                                      .selectedAdditional ===
                                                                                    0
                                                                                      ? "btn-primary"
                                                                                      : "btn-outline-secondary"
                                                                                  }`}
                                                                                  onClick={() =>
                                                                                    this.handleToggleChange(
                                                                                      "selectedAdditional",
                                                                                      0
                                                                                    )
                                                                                  }
                                                                                >
                                                                                  {this.props.t(
                                                                                    "No"
                                                                                  )}
                                                                                </button>
                                                                              </div>
                                                                            </Col>
                                                                          </Row>
                                                                        </Col>
                                                                      </Row>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                      <Row>
                                                                        <Col className="col-4">
                                                                          <Row>
                                                                            <Col className="col-6">
                                                                              <Label for="altInstAttend">
                                                                                {this.props.t(
                                                                                  "Alt. Inst. Attend"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col className="col-6">
                                                                              <div
                                                                                className={
                                                                                  "btn-group"
                                                                                  // +
                                                                                  // (NeedSectionError
                                                                                  //   ? " border border-danger rounded p-1"
                                                                                  //   : "")
                                                                                }
                                                                              >
                                                                                <button
                                                                                  type="button"
                                                                                  className={`btn ${
                                                                                    this
                                                                                      .state
                                                                                      .selectedAltInstAttend ===
                                                                                    1
                                                                                      ? "btn-primary"
                                                                                      : "btn-outline-secondary"
                                                                                  }`}
                                                                                  onClick={() =>
                                                                                    this.handleToggleChange(
                                                                                      "selectedAltInstAttend",
                                                                                      1
                                                                                    )
                                                                                  }
                                                                                >
                                                                                  {this.props.t(
                                                                                    "Yes"
                                                                                  )}
                                                                                </button>
                                                                                <button
                                                                                  type="button"
                                                                                  className={`btn ${
                                                                                    this
                                                                                      .state
                                                                                      .selectedAltInstAttend ===
                                                                                    0
                                                                                      ? "btn-primary"
                                                                                      : "btn-outline-secondary"
                                                                                  }`}
                                                                                  onClick={() =>
                                                                                    this.handleToggleChange(
                                                                                      "selectedAltInstAttend",
                                                                                      0
                                                                                    )
                                                                                  }
                                                                                >
                                                                                  {this.props.t(
                                                                                    "No"
                                                                                  )}
                                                                                </button>
                                                                              </div>
                                                                            </Col>
                                                                          </Row>
                                                                        </Col>
                                                                        <Col className="col-4">
                                                                          <Row>
                                                                            <Col className="col-6">
                                                                              <Label for="canceled">
                                                                                {this.props.t(
                                                                                  "Canceled"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col className="col-6">
                                                                              <div
                                                                                className={
                                                                                  "btn-group"
                                                                                  // +
                                                                                  // (NeedSectionError
                                                                                  //   ? " border border-danger rounded p-1"
                                                                                  //   : "")
                                                                                }
                                                                              >
                                                                                <button
                                                                                  type="button"
                                                                                  className={`btn ${
                                                                                    this
                                                                                      .state
                                                                                      .selectedCanceled ===
                                                                                    1
                                                                                      ? "btn-primary"
                                                                                      : "btn-outline-secondary"
                                                                                  }`}
                                                                                  onClick={() =>
                                                                                    this.handleToggleChange(
                                                                                      "selectedCanceled",
                                                                                      1
                                                                                    )
                                                                                  }
                                                                                >
                                                                                  {this.props.t(
                                                                                    "Yes"
                                                                                  )}
                                                                                </button>
                                                                                <button
                                                                                  type="button"
                                                                                  className={`btn ${
                                                                                    this
                                                                                      .state
                                                                                      .selectedCanceled ===
                                                                                    0
                                                                                      ? "btn-primary"
                                                                                      : "btn-outline-secondary"
                                                                                  }`}
                                                                                  onClick={() =>
                                                                                    this.handleToggleChange(
                                                                                      "selectedCanceled",
                                                                                      0
                                                                                    )
                                                                                  }
                                                                                >
                                                                                  {this.props.t(
                                                                                    "No"
                                                                                  )}
                                                                                </button>
                                                                              </div>
                                                                            </Col>
                                                                          </Row>
                                                                        </Col>
                                                                        <Col className="col-4">
                                                                          <Row>
                                                                            <Col className="col-6">
                                                                              <Label for="closeLecture">
                                                                                {this.props.t(
                                                                                  "Close Lecture"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col className="col-6">
                                                                              <div
                                                                                className={
                                                                                  "btn-group"
                                                                                  // +
                                                                                  // (NeedSectionError
                                                                                  //   ? " border border-danger rounded p-1"
                                                                                  //   : "")
                                                                                }
                                                                              >
                                                                                <button
                                                                                  type="button"
                                                                                  className={`btn ${
                                                                                    this
                                                                                      .state
                                                                                      .selectedCloseLecture ===
                                                                                    1
                                                                                      ? "btn-primary"
                                                                                      : "btn-outline-secondary"
                                                                                  }`}
                                                                                  onClick={() =>
                                                                                    this.handleToggleChange(
                                                                                      "selectedCloseLecture",
                                                                                      1
                                                                                    )
                                                                                  }
                                                                                >
                                                                                  {this.props.t(
                                                                                    "Yes"
                                                                                  )}
                                                                                </button>
                                                                                <button
                                                                                  type="button"
                                                                                  className={`btn ${
                                                                                    this
                                                                                      .state
                                                                                      .selectedCloseLecture ===
                                                                                    0
                                                                                      ? "btn-primary"
                                                                                      : "btn-outline-secondary"
                                                                                  }`}
                                                                                  onClick={() =>
                                                                                    this.handleToggleChange(
                                                                                      "selectedCloseLecture",
                                                                                      0
                                                                                    )
                                                                                  }
                                                                                >
                                                                                  {this.props.t(
                                                                                    "No"
                                                                                  )}
                                                                                </button>
                                                                              </div>
                                                                            </Col>
                                                                          </Row>
                                                                        </Col>
                                                                      </Row>
                                                                    </div>
                                                                  </Row>
                                                                  <Row>
                                                                    <Col>
                                                                      <div className="text-center">
                                                                        <Link
                                                                          to="#"
                                                                          className="btn btn-primary me-2"
                                                                          onClick={() => {
                                                                            this.handleSave(
                                                                              values
                                                                            );
                                                                          }}
                                                                        >
                                                                          {t(
                                                                            "Save"
                                                                          )}
                                                                        </Link>
                                                                      </div>
                                                                    </Col>
                                                                  </Row>
                                                                </CardBody>
                                                              </Card>
                                                            </Form>
                                                          )}
                                                        </Formik>
                                                      </ModalBody>
                                                    </Modal>
                                                    <Modal
                                                      isOpen={this.state.modal2}
                                                      className={
                                                        this.props.className
                                                      }
                                                      size="xl"
                                                    >
                                                      <ModalHeader
                                                        toggle={this.toggle2}
                                                        tag="h4"
                                                      >
                                                        {!!isOpen1
                                                          ? this.props.t(
                                                              "Attendance Recording"
                                                            )
                                                          : ""}
                                                      </ModalHeader>
                                                      <Row>
                                                        <div>
                                                          {errorMessage && (
                                                            <Alert
                                                              color="danger"
                                                              className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                              role="alert"
                                                            >
                                                              {errorMessage}
                                                              <button
                                                                type="button"
                                                                className="btn-close"
                                                                aria-label="Close"
                                                                onClick={
                                                                  this
                                                                    .handleErrorClose
                                                                }
                                                              ></button>
                                                            </Alert>
                                                          )}
                                                        </div>
                                                      </Row>
                                                      <ModalBody>
                                                        <BootstrapTable
                                                          keyField="Id"
                                                          data={regTrainees}
                                                          columns={
                                                            attendRecordingColumns
                                                          }
                                                          cellEdit={cellEditFactory(
                                                            {
                                                              mode: "dbclick",
                                                              blurToSave: true,
                                                              // afterSaveCell: (
                                                              //   oldValue,
                                                              //   newValue,
                                                              //   row,
                                                              //   column
                                                              // ) => {
                                                              //   this.handleParentsDataChange(
                                                              //     row.Id,
                                                              //     column.dataField,
                                                              //     newValue
                                                              //   );
                                                              // },
                                                            }
                                                          )}
                                                          noDataIndication={t(
                                                            "No Relatives Found"
                                                          )}
                                                          defaultSorted={
                                                            defaultSorting
                                                          }
                                                        />
                                                      </ModalBody>{" "}
                                                    </Modal>
                                                    <Modal
                                                      isOpen={this.state.modal3}
                                                      className={
                                                        this.props.className
                                                      }
                                                      size="xl"
                                                    >
                                                      <ModalHeader
                                                        toggle={this.toggle3}
                                                        tag="h4"
                                                      >
                                                        {!!isView
                                                          ? this.props.t(
                                                              "Trainee Abesent Details"
                                                            )
                                                          : ""}
                                                      </ModalHeader>
                                                      <Row>
                                                        <div>
                                                          {errorMessage && (
                                                            <Alert
                                                              color="danger"
                                                              className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                              role="alert"
                                                            >
                                                              {errorMessage}
                                                              <button
                                                                type="button"
                                                                className="btn-close"
                                                                aria-label="Close"
                                                                onClick={
                                                                  this
                                                                    .handleErrorClose
                                                                }
                                                              ></button>
                                                            </Alert>
                                                          )}
                                                        </div>
                                                      </Row>
                                                      <ModalBody>
                                                        <BootstrapTable
                                                          keyField="Id"
                                                          data={regTrainees}
                                                          columns={
                                                            attendRecordingColumns
                                                          }
                                                          cellEdit={cellEditFactory(
                                                            {
                                                              mode: "dbclick",
                                                              blurToSave: true,
                                                              // afterSaveCell: (
                                                              //   oldValue,
                                                              //   newValue,
                                                              //   row,
                                                              //   column
                                                              // ) => {
                                                              //   this.handleParentsDataChange(
                                                              //     row.Id,
                                                              //     column.dataField,
                                                              //     newValue
                                                              //   );
                                                              // },
                                                            }
                                                          )}
                                                          noDataIndication={t(
                                                            "No Relatives Found"
                                                          )}
                                                          defaultSorted={
                                                            defaultSorting
                                                          }
                                                        />
                                                      </ModalBody>{" "}
                                                    </Modal>
                                                  </CardBody>
                                                </Card>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </ModalBody>
                                    </Modal>
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
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({
  enteredGrades,
  regTraineesAttendance,
  menu_items,
  employees,
  academyBuildingStructures,
}) => ({
  regTrainees: regTraineesAttendance.regTrainees,
  deleted: regTraineesAttendance.deleted,
  user_menu: menu_items.user_menu || [],
  employeesNames: employees.employeesNames,
  halls: academyBuildingStructures.halls,
  courseStatistics: enteredGrades.courseStatistics,
});

const mapDispatchToProps = dispatch => ({
  onGetRegisterTraineesAttendance: lng =>
    dispatch(getRegisterTraineesAttendance(lng)),
  onAddNewRegisterTraineeAttendance: regTrainees =>
    dispatch(addNewRegisterTraineeAttendance(regTrainees)),
  onUpdateRegisterTraineeAttendance: regTrainees =>
    dispatch(updateRegisterTraineeAttendance(regTrainees)),
  onDeleteRegisterTraineeAttendance: regTrainees =>
    dispatch(deleteRegisterTraineeAttendance(regTrainees)),

  OnGetCourseStatistics: course => dispatch(getCourseStatistics(course)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(RegisterTraineesAttendance));
