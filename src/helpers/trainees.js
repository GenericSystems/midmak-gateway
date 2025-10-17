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
import Breadcrumbs from "components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import Accordion from "react-bootstrap/Accordion";
import { Formik, Field, Form, ErrorMessage } from "formik";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import { withRouter, Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";
// import OtherChart from "pages/generate-SIDs/OtherChart";

// import { getCurrentSemester } from "store/semesters/actions";
// import { getStudentsRequests } from "store/students-requests/actions";
import { BackburgerIcon } from "@icons/material";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "utils/menuUtils";
class TraineesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedView: "",
      errorMessage: null,
      sidebarOpen: true,
      deleteModal: false,
      selectedRowId: null,
      isEdit: false,
      showStudentName: true,
      showYearSemester: true,
      showActivationSemester: true,
      showStudentID: true,
      showStateId: true,
      showRequestOrganizer: true,
      showRequestOrgNotes: true,
      requestDate: true,
      showRequestNum: true,
      showRequestId: true,
      showDecreeOrganizer: false,
      showDecreeDate: false,
      showDecreeOrgNotes: false,
      showFoldingDate: false,
      showFoldingOrganizer: false,
      showFoldingOrgNotes: false,
      modal: false,
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
      activeAccordion: "personalInfo",
    };
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
  }

  componentDidMount() {
    const {
      studentsRequests,
      studentStates,
      stdWarningTestOpt,
      currencies,
      yearSemesters,
      currentSemester,
      semesters,
      faculties,
      onGetStudentsRequests,
      deleted,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (studentsRequests && !studentsRequests.length) {
      // onGetStudentsRequests({ yearSemesterId: 78 });

      this.setState({ studentsRequests, stdWarningTestOpt });
      this.setState({ studentStates });
      this.setState({ currencies });
      this.setState({ faculties });
      this.setState({ yearSemesters });
      this.setState({ currentSemester, semesters });
      this.setState({ deleted });
    }
  }
  componentDidUpdate(prevProps) {
    const { currentSemester, yearSemesters } = this.props;
    if (
      (currentSemester &&
        currentSemester.cuYearSemesterId !==
          prevProps.currentSemester.cuYearSemesterId) ||
      yearSemesters !== prevProps.yearSemesters
    ) {
      this.initializeState();
    }
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

  initializeState() {
    const { currentSemester, yearSemesters, onGetSchedulingLectures } =
      this.props;
    const defaultSemester =
      yearSemesters.find(
        opt => opt.value === currentSemester.cuYearSemesterId
      ) || "";
    this.setState({ defaultSemester: defaultSemester });
  }

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
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

  handleStdWarningTestDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateStdWarningTest, studentsRequests } = this.props;

    if (fieldName == "percentage") {
      const numericValue = parseFloat(fieldValue);

      if (isNaN(numericValue)) {
        console.error("Entered value is not a number");
        const errorNonNumeric = this.props.t(`Please enter a valid number`);
        this.setState({ errorMessage: errorNonNumeric });
      } else if (numericValue > 100) {
        console.error("Entered value is greater than grade value");
        const errorGreaterGrade = this.props.t(`Enter Grade From 0 to 100`);
        this.setState({ errorMessage: errorGreaterGrade });
      } else if (numericValue < 0) {
        console.error("Entered value is negative");
        const errorNegativeGrade = this.props.t("You Entered Negative Grade");
        this.setState({ errorMessage: errorNegativeGrade });
      } else {
        const onUpdate = { Id: rowId, [fieldName]: numericValue };
        this.setState({ errorMessage: null });
        onUpdateStdWarningTest(onUpdate);
      }
    }

    if (fieldName == "amount") {
      const onUpdate = { Id: rowId, [fieldName]: fieldValue };
      this.setState({ errorMessage: null });
      onUpdateStdWarningTest(onUpdate);
    }

    if (fieldName == "fromdate") {
      const fromDate = new Date(fieldValue).toISOString().split("T")[0];
      const onUpdate = { Id: rowId, [fieldName]: fromDate };
      this.setState({ errorMessage: null });
      onUpdateStdWarningTest(onUpdate);
    }

    if (fieldName == "toDate") {
      const fromDate = new Date(fieldValue).toISOString().split("T")[0];
      const onUpdate = { Id: rowId, [fieldName]: fromDate };
      this.setState({ errorMessage: null });
      onUpdateStdWarningTest(onUpdate);
    }
  };

  handleSelectFine = (rowId, fieldName, selectedValue) => {
    const { onUpdateStdWarningTest } = this.props;
    const { studentsRequests } = this.state;

    this.setState({
      selectedFine: selectedValue,
    });

    let onUpdate = { Id: rowId, [fieldName]: selectedValue };
    onUpdateStdWarningTest(onUpdate);
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
    if (fieldName == "studentId") {
      this.setState(prevState => ({
        showStudentID: !prevState.showStudentID,
      }));
    }

    if (fieldName == "studentName") {
      this.setState(prevState => ({
        showStudentName: !prevState.showStudentName,
      }));
    }

    if (fieldName == "yearSemester") {
      this.setState(prevState => ({
        showYearSemester: !prevState.showYearSemester,
      }));
    }

    if (fieldName == "activationSemester") {
      this.setState(prevState => ({
        showActivationSemester: !prevState.showActivationSemester,
      }));
    }

    if (fieldName == "stateId") {
      this.setState(prevState => ({
        showStateId: !prevState.showStateId,
      }));
    }

    if (fieldName == "requestOrganizer") {
      this.setState(prevState => ({
        showRequestOrganizer: !prevState.showRequestOrganizer,
      }));
    }

    if (fieldName == "requestOrgNotes") {
      this.setState(prevState => ({
        showRequestOrgNotes: !prevState.showRequestOrgNotes,
      }));
    }

    if (fieldName == "requestOrgNotes") {
      this.setState(prevState => ({
        showToRegSemester: !prevState.showToRegSemester,
      }));
    }

    if (fieldName == "requestDate") {
      this.setState(prevState => ({
        requestDate: !prevState.requestDate,
      }));
    }

    if (fieldName == "requestNum") {
      this.setState(prevState => ({
        showRequestNum: !prevState.showRequestNum,
      }));
    }

    if (fieldName == "requestId") {
      this.setState(prevState => ({
        showRequestId: !prevState.showRequestId,
      }));
    }

    if (fieldName == "decreeOrganizer") {
      this.setState(prevState => ({
        showDecreeOrganizer: !prevState.showDecreeOrganizer,
      }));
    }

    if (fieldName == "decreeDate") {
      this.setState(prevState => ({
        showDecreeDate: !prevState.showDecreeDate,
      }));
    }

    if (fieldName == "decreeOrgNotes") {
      this.setState(prevState => ({
        showDecreeOrgNotes: !prevState.showDecreeOrgNotes,
      }));
    }

    if (fieldName == "foldingDate") {
      this.setState(prevState => ({
        showFoldingDate: !prevState.showFoldingDate,
      }));
    }

    if (fieldName == "foldingOrganizer") {
      this.setState(prevState => ({
        showFoldingOrganizer: !prevState.showFoldingOrganizer,
      }));
    }

    if (fieldName == "foldingOrgNotes") {
      this.setState(prevState => ({
        showFoldingOrgNotes: !prevState.showFoldingOrgNotes,
      }));
    }
  };

  handleAddWarning = () => {
    this.setState({
      warningId: "",
      arWarning: "",
      enWarning: "",
      arTransStatementWarning: "",
      enTransStatementWarning: "",
      priorityWarning: "",
      selectedColor: "#FFFFFF",
      selectedRuleType: "",
      selectedFromAdmSemes: "",
      selectedToAdmSemes: "",
      selectedFromRegSemes: "",
      selectedToRegSemes: "",
      stdFromGPAWarning: "",
      stdTillGPAWarning: "",
      stdFromCreditsWarning: "",
      stdTillCreditsWarning: "",
      selectedCalculatedTransferCred: "",
      selectedActiveAdditionalPeriod: "",
      stdSemestersNumber: "",
      prevFromGPAWarning: "",
      prevTillGPAWarning: "",
      prevFromCreditsWarning: "",
      prevTillCreditsWarning: "",
      applyForSemesterArray: [],
      applyStatusArray: [],
      prevAcademicWarningArray: [],
      prevStatusSemesArray: [],

      isEdit: false,
    });
    this.toggle();
  };

  handleButtonClick = (fieldName, option) => {
    if (fieldName == "ruleType") {
      this.setState({ selectedRuleType: option });
    }
    if (fieldName == "calculatedTransferCred") {
      this.setState({
        selectedCalculatedTransferCred: option == "yes" ? 1 : 0,
      });
    }
    if (fieldName == "activeAdditionalPeriod") {
      this.setState({
        selectedActiveAdditionalPeriod: option == "yes" ? 1 : 0,
      });
    }
  };

  handleMulti = (fieldName, selectedMulti) => {
    if (fieldName === "applyForSemester") {
      this.setState({ applyForSemesterArray: selectedMulti });
    }

    if (fieldName === "decreeDate") {
      this.setState({ prevStatusSemesArray: selectedMulti });
    }

    if (fieldName === "decreeOrganizer") {
      this.setState({ prevAcademicWarningArray: selectedMulti });
    }

    if (fieldName === "decreeOrgNotes") {
      this.setState({ applyStatusArray: selectedMulti });
    }
  };

  handleInputBlur = fieldName => {
    const {
      selectedFromAdmSemes,
      selectedToAdmSemes,
      selectedFromRegSemes,
      selectedToRegSemes,
      selectedOldWarningStatus,
      selectedColor,
    } = this.state;

    if (fieldName == "stateId") {
      this.setState({ selectedFromAdmSemes });
    }

    if (fieldName == "academicStatus") {
      this.setState({ selectedToAdmSemes });
    }

    if (fieldName == "requestOrgNotes ") {
      this.setState({ selectedFromRegSemes });
    }

    if (fieldName == "toRegSemesId ") {
      this.setState({ selectedToRegSemes });
    }

    if (fieldName == "oldWarningStatusId") {
      this.setState({ selectedOldWarningStatus });
    }

    if (fieldName == "warningColor") {
      this.setState({ selectedColor });
    }
  };

  handleInputFocus = fieldName => {
    const {
      selectedFromAdmSemes,
      selectedToAdmSemes,
      selectedFromRegSemes,
      selectedToRegSemes,
      selectedOldWarningStatus,
    } = this.state;

    if (fieldName == "stateId") {
      this.setState({ selectedFromAdmSemes });
    }

    if (fieldName == "academicStatus") {
      this.setState({ selectedToAdmSemes });
    }

    if (fieldName == "requestOrgNotes ") {
      this.setState({ selectedFromRegSemes });
    }

    if (fieldName == "toRegSemesId ") {
      this.setState({ selectedToRegSemes });
    }

    if (fieldName == "oldWarningStatusId") {
      this.setState({ selectedOldWarningStatus });
    }
  };

  handleDataListChange = (event, fieldName) => {
    const selectedValue = event.target.value;

    if (fieldName == "stateId") {
      this.setState({ selectedFromAdmSemes: selectedValue });
    }

    if (fieldName == "academicStatus") {
      this.setState({ selectedToAdmSemes: selectedValue });
    }

    if (fieldName == "requestOrgNotes ") {
      this.setState({ selectedFromRegSemes: selectedValue });
    }

    if (fieldName == "toRegSemesId ") {
      this.setState({ selectedToRegSemes: selectedValue });
    }

    if (fieldName == "oldWarningStatusId") {
      this.setState({ selectedOldWarningStatus: selectedValue });
    }
  };

  handleColorChange(event) {
    const selectedValue = event.target.value;
    this.setState({ selectedColor: selectedValue });
  }

  handleSave = values => {
    const { onAddNewStdWarningTest, yearSemesters } = this.props;
    const {
      selectedColor,
      selectedFromAdmSemes,
      selectedToAdmSemes,
      selectedFromRegSemes,
      selectedToRegSemes,
      selectedRuleType,
      selectedActiveAdditionalPeriod,
      selectedCalculatedTransferCred,
      applyStatusArray,
      applyForSemesterArray,
      prevStatusSemesArray,
      prevAcademicWarningArray,
    } = this.state;

    const fromAdmSemesterObj = yearSemesters.find(
      semes => semes.value === selectedFromAdmSemes
    );

    const toAdmSemesterObj = yearSemesters.find(
      semes => semes.value === selectedToAdmSemes
    );

    const fromRegSemesterObj = yearSemesters.find(
      semes => semes.value === selectedFromRegSemes
    );

    const toRegSemesterObj = yearSemesters.find(
      semes => semes.value === selectedToRegSemes
    );

    const obj = {
      SID: values["SID"],
      enWarningStatus: values["enWarningStatus"],
      studentName: values["studentName"],
      enTransStatement: values["enTransStatement"],
      priority: values["priority"],
      warningColor: selectedColor,
      ruleType: selectedRuleType,
      stateId: fromAdmSemesterObj.key,
      academicStatus: toAdmSemesterObj.key,
      requestOrgNotes: fromRegSemesterObj.key,
      toRegSemesId: toRegSemesterObj.key,
      stdFromGPA: values["stdFromGPA"],
      stdTillGPA: values["stdTillGPA"],
      stdFromCredits: values["stdFromCredits"],
      stdTillCredits: values["stdTillCredits"],
      calculatedTransferCred: selectedCalculatedTransferCred,
      activeAdditionalPeriod: selectedActiveAdditionalPeriod,
      stdSemestersNb: values["stdSemestersNb"],
      prevFromGPA: values["prevFromGPA"],
      prevTillGPA: values["prevTillGPA"],
      prevFromCredits: values["prevFromCredits"],
      prevTillCredits: values["prevTillCredits"],
      decreeOrgNotes: applyStatusArray,
      applyForSemester: applyForSemesterArray,
      decreeDate: prevStatusSemesArray,
      decreeOrganizer: prevAcademicWarningArray,
    };

    onAddNewStdWarningTest(obj);
  };

  handleEditStdWarningTest = arg => {
    const studentsRequests = arg;

    this.setState({
      warningId: studentsRequests.Id,
      arWarning: studentsRequests.SID,
      enWarning: studentsRequests.enWarningStatus,
      arTransStatementWarning: studentsRequests.studentName,
      enTransStatementWarning: studentsRequests.enTransStatement,
      priorityWarning: studentsRequests.priority,
      selectedColor: studentsRequests.warningColor,
      selectedRuleType: studentsRequests.ruleType,
      selectedFromAdmSemesId: studentsRequests.stateId,
      selectedToAdmSemesId: studentsRequests.academicStatus,
      selectedFromRegSemesId: studentsRequests.requestOrgNotes,
      selectedToRegSemesId: studentsRequests.toRegSemesId,
      stdFromGPAWarning: studentsRequests.stdFromGPA,
      stdTillGPAWarning: studentsRequests.stdTillGPA,
      stdFromCreditsWarning: studentsRequests.stdFromCredits,
      stdTillCreditsWarning: studentsRequests.stdTillCredits,
      selectedCalculatedTransferCred:
        studentsRequests.calculatedTransferCred == 1 ? "yes" : "no",
      selectedActiveAdditionalPeriod:
        studentsRequests.activeAdditionalPeriod == 1 ? "yes" : "no",
      stdSemestersNumber: studentsRequests.stdSemestersNb,
      prevFromGPAWarning: studentsRequests.prevFromGPA,
      prevTillGPAWarning: studentsRequests.prevTillGPA,
      prevFromCreditsWarning: studentsRequests.prevFromCredits,
      prevTillCreditsWarning: studentsRequests.prevTillCredits,
      applyForSemesterArray: studentsRequests.applyForSemester,
      applyStatusArray: studentsRequests.decreeOrgNotes,
      prevAcademicWarningArray: studentsRequests.decreeOrganizer,
      prevStatusSemesArray: studentsRequests.decreeDate,
      isEdit: true,
    });

    this.toggle();
    const { fiscalYears, yearSemesters, onGetFeesConditions, currencies } =
      this.props;
    let obj = { Id: studentsRequests.Id };

    if (studentsRequests.stateId) {
      const fromAdmSemes = yearSemesters.find(
        yearSemester => yearSemester.key === studentsRequests.stateId
      );
      this.setState({
        selectedFromAdmSemes: fromAdmSemes.value,
      });
    }

    if (studentsRequests.academicStatus) {
      const toAdmSemes = yearSemesters.find(
        yearSemester => yearSemester.key === studentsRequests.academicStatus
      );
      this.setState({
        selectedToAdmSemes: toAdmSemes.value,
      });
    }

    if (studentsRequests.requestOrgNotes) {
      const fromRegSemes = yearSemesters.find(
        yearSemester => yearSemester.key === studentsRequests.requestOrgNotes
      );
      this.setState({
        selectedFromRegSemes: fromRegSemes.value,
      });
    }

    if (studentsRequests.toRegSemesId) {
      const toRegSemes = yearSemesters.find(
        yearSemester => yearSemester.key === studentsRequests.toRegSemesId
      );
      this.setState({
        selectedToRegSemes: toRegSemes.value,
      });
    }
  };

  handleUpdate = values => {
    const { onUpdateStdWarningTest, yearSemesters } = this.props;
    const {
      warningId,
      selectedColor,
      selectedFromAdmSemes,
      selectedToAdmSemes,
      selectedFromRegSemes,
      selectedToRegSemes,
      selectedRuleType,
      selectedActiveAdditionalPeriod,
      selectedCalculatedTransferCred,
      applyStatusArray,
      applyForSemesterArray,
      prevStatusSemesArray,
      prevAcademicWarningArray,
    } = this.state;

    const fromAdmSemesterObj = yearSemesters.find(
      semes => semes.value === selectedFromAdmSemes
    );

    const toAdmSemesterObj = yearSemesters.find(
      semes => semes.value === selectedToAdmSemes
    );

    const fromRegSemesterObj = yearSemesters.find(
      semes => semes.value === selectedFromRegSemes
    );

    const toRegSemesterObj = yearSemesters.find(
      semes => semes.value === selectedToRegSemes
    );

    const obj = {
      Id: warningId,
      SID: values["SID"],
      enWarningStatus: values["enWarningStatus"],
      studentName: values["studentName"],
      enTransStatement: values["enTransStatement"],
      priority: values["priority"],
      warningColor: selectedColor,
      ruleType: values["ruleType"],
      stateId: fromAdmSemesterObj.key,
      academicStatus: toAdmSemesterObj.key,
      requestOrgNotes: fromRegSemesterObj.key,
      toRegSemesId: toRegSemesterObj.key,
      stdFromGPA: values["stdFromGPA"],
      stdTillGPA: values["stdTillGPA"],
      stdFromCredits: values["stdFromCredits"],
      stdTillCredits: values["stdTillCredits"],
      calculatedTransferCred:
        values["calculatedTransferCred"] == "yes"
          ? 1
          : values["calculatedTransferCred"] == "no"
          ? 0
          : values["calculatedTransferCred"],
      activeAdditionalPeriod:
        values["activeAdditionalPeriod"] == "yes"
          ? 1
          : values["activeAdditionalPeriod"] == "no"
          ? 0
          : values["activeAdditionalPeriod"],
      stdSemestersNb: values["stdSemestersNb"],
      prevFromGPA: values["prevFromGPA"],
      prevTillGPA: values["prevTillGPA"],
      prevFromCredits: values["prevFromCredits"],
      prevTillCredits: values["prevTillCredits"],
      decreeOrgNotes: applyStatusArray,
      applyForSemester: applyForSemesterArray,
      decreeDate: prevStatusSemesArray,
      decreeOrganizer: prevAcademicWarningArray,
    };

    onUpdateStdWarningTest(obj);
    this.toggle();
  };

  handlePriorityChange = event => {
    const priorityValue = event.target.value;
    this.setState({ priorityWarning: priorityValue });
  };

  render() {
    const {
      studentsRequests,
      stdWarningTestOpt,
      yearSemesters,
      currencies,
      semesters,
      studentStates,
      deleted,
      t,
    } = this.props;
    const {
      duplicateError,
      errorMessage,
      sidebarOpen,
      deleteModal,
      isEdit,
      showStudentID,
      showStudentName,
      showYearSemester,
      showActivationSemester,
      showStateId,
      showRequestOrganizer,
      showRequestOrgNotes,
      requestDate,
      showToRegSemester,
      showRequestNum,
      showRequestId,
      showDecreeOrganizer,
      showDecreeDate,
      showDecreeOrgNotes,
      showFoldingDate,
      showFoldingOrganizer,
      showFoldingOrgNotes,
      modal,
      warningId,
      arWarning,
      enWarning,
      arTransStatementWarning,
      enTransStatementWarning,
      priorityWarning,
      stdFromGPAWarning,
      stdTillGPAWarning,
      stdFromCreditsWarning,
      stdTillCreditsWarning,
      stdSemestersNumber,
      prevFromGPAWarning,
      prevTillGPAWarning,
      prevFromCreditsWarning,
      prevTillCreditsWarning,
      selectedRuleType,
      selectedActiveAdditionalPeriod,
      selectedCalculatedTransferCred,
      selectedMulti,
      selectedFromAdmSemes,
      selectedToAdmSemes,
      selectedFromRegSemes,
      selectedToRegSemes,
      selectedColor,
      applyForSemesterArray,
      prevStatusSemesArray,
      applyStatusArray,
      prevAcademicWarningArray,
      showAlert,
      showAddButton,
      showDeleteButton,
      showSearchButton,
    } = this.state;
    const { SearchBar } = Search;

    console.log("studentsRequests", studentsRequests);
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

    const MainInfoColumns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      // {
      //   dataField: "FirstName",
      //   text: this.props.t("First Name"),
      //   sort: true,
      //   editable: false,
      //   hidden: !showRequestNum,
      //   filter: textFilter({
      //     placeholder: this.props.t("Search..."),
      //   }),
      // },
      // {
      //   dataField: "LastName",
      //   text: this.props.t("Last Name"),
      //   sort: true,
      //   editable: false,
      //   hidden: !showRequestId,
      //   filter: textFilter({
      //     placeholder: this.props.t("Search..."),
      //   }),
      // },

      // {
      //   dataField: "FatherName",
      //   text: this.props.t("Father Name"),
      //   sort: true,
      //   editable: false,
      //   hidden: !showYearSemester,
      //   filter: textFilter({
      //     placeholder: this.props.t("Search..."),
      //   }),
      // },

      // {
      //   dataField: "MotherName",
      //   text: this.props.t("Mother Name"),
      //   sort: true,
      //   editable: false,
      //   hidden: !showActivationSemester,
      //   filter: textFilter({
      //     placeholder: this.props.t("Search..."),
      //   }),
      // },
      // {
      //   dataField: "grandFatherName",
      //   text: this.props.t("grand Father Name"),
      //   sort: true,
      //   editable: false,
      //   hidden: !showStateId,
      //   filter: textFilter({
      //     placeholder: this.props.t("Search..."),
      //   }),
      // },

      // {
      //   dataField: "BirthLocation",
      //   text: this.props.t("Birth Location"),
      //   sort: true,
      //   editable: false,
      //   hidden: !requestDate,
      //   filter: textFilter({
      //     placeholder: this.props.t("Search..."),
      //   }),
      // },

      // {
      //   dataField: "birthdate",

      //   text: this.props.t("Birth Date"),
      //   sort: true,
      //   editable: false,
      //   hidden: !showRequestOrganizer,
      //   filter: textFilter({
      //     placeholder: this.props.t("Search..."),
      //   }),
      // },
      // {
      //   dataField: "IdNumber",

      //   text: this.props.t("Id Number"),
      //   sort: true,
      //   editable: false,
      //   hidden: !showRequestOrgNotes,
      //   filter: textFilter({
      //     placeholder: this.props.t("Search..."),
      //   }),
      // },
      // {
      //   dataField: "perosonalCardNum",
      //   text: this.props.t("perosonal Card Number"),
      //   sort: true,
      //   editable: false,
      //   hidden: !showDecreeDate,
      //   filter: textFilter({
      //     placeholder: this.props.t("Search..."),
      //   }),
      // },
      // {
      //   dataField: "EmissionDate",
      //   text: this.props.t("Emission Date"),
      //   sort: true,
      //   formatter: (cell, row) =>
      //     cell && Array.isArray(cell)
      //       ? cell.map(option => option.label).join(" , ")
      //       : "",
      //   editable: false,
      //   hidden: !showDecreeOrganizer,
      //   filter: textFilter({
      //     placeholder: this.props.t("Search..."),
      //   }),
      // },

      // {
      //   dataField: "PassNumber",
      //   text: this.props.t("Passport Number"),
      //   editable: false,
      //   hidden: !showDecreeOrgNotes,
      //   filter: textFilter({
      //     placeholder: this.props.t("Search..."),
      //   }),
      // },
      // {
      //   dataField: "passportGrantDate",
      //   text: this.props.t("Passport Grant Date"),
      //   editable: false,
      //   hidden: !showFoldingDate,
      //   filter: textFilter({
      //     placeholder: this.props.t("Search..."),
      //   }),
      // },
      // {
      //   dataField: "passportExpirationDate",
      //   text: this.props.t("Passport Expiration Date"),
      //   editable: false,
      //   hidden: !showFoldingOrganizer,
      //   filter: textFilter({
      //     placeholder: this.props.t("Search..."),
      //   }),
      // },
      // {
      //   dataField: "Gender",
      //   text: this.props.t("Gender"),
      //   editable: false,
      //   hidden: !showFoldingOrgNotes,
      //   filter: textFilter({
      //     placeholder: this.props.t("Search..."),
      //   }),
      // },
      // {
      //   dataField: "Nationality",
      //   text: this.props.t("Nationality"),
      //   sort: true,
      //   editable: false,
      //   hidden: !showStudentID,
      //   filter: textFilter({
      //     placeholder: this.props.t("Search..."),
      //   }),
      // },
      // {
      //   dataField: "perCardCaza",
      //   text: this.props.t("Amana"),
      //   sort: true,
      //   editable: false,
      //   hidden: !showStudentName,
      //   filter: textFilter({
      //     placeholder: this.props.t("Search..."),
      //   }),
      // },
      // {
      //   dataField: "perCardPlaceRegistration",
      //   text: this.props.t("Place Registration"),
      //   sort: true,
      //   editable: false,
      //   hidden: !showStudentName,
      //   filter: textFilter({
      //     placeholder: this.props.t("Search..."),
      //   }),
      // },
      // {
      //   dataField: "perCardRegNum",
      //   text: this.props.t("Registration Number"),
      //   sort: true,
      //   editable: false,
      //   hidden: !showStudentName,
      //   filter: textFilter({
      //     placeholder: this.props.t("Search..."),
      //   }),
      // },

      // {
      //   dataField: "action",
      //   text: "",
      //   isDummyField: true,
      //   editable: false,
      //   formatter: (cellContent, warning) => (
      //     <div className="d-flex justify-content-center gap-3">
      //       {showDeleteButton && (
      //         <Tooltip title={this.props.t("Delete")} placement="top">
      //           <IconButton color="danger">
      //             <i
      //               className="mdi mdi-delete font-size-18 text-danger"
      //               id="deletetooltip"
      //               onClick={() => this.onClickDelete(warning)}
      //             ></i>
      //           </IconButton>
      //         </Tooltip>
      //       )}

      //       <Tooltip title={this.props.t("Student Status")} placement="top">
      //         <IconButton>
      //           <i
      //             className="bx bxs-user font-size-18 text-secondary"
      //             id="deletetooltip"
      //             onClick={() => this.onClickStdStatus(warning)}
      //           ></i>
      //         </IconButton>
      //       </Tooltip>
      //     </div>
      //   ),
      // },
      {
        dataField: "requestNum",
        text: this.props.t("Course Name"),
        sort: true,
        editable: false,
        hidden: !showRequestNum,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "requestId",
        text: this.props.t("Course Code"),
        sort: true,
        editable: false,
        hidden: !showRequestId,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },

      {
        dataField: "yearSemester",
        text: this.props.t("Credits"),
        sort: true,
        editable: false,
        hidden: !showYearSemester,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "activationSemester",
        text: this.props.t("Total Registered(Exclude W)"),
        sort: true,
        editable: false,
        hidden: !showActivationSemester,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "stateId",
        text: this.props.t("Passed Count"),
        sort: true,
        editable: false,
        hidden: !showStateId,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },

      {
        dataField: "requestDate",
        text: this.props.t("Withdrawn Count"),
        sort: true,
        editable: false,
        hidden: !requestDate,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },

      {
        dataField: "requestOrganizer",

        text: this.props.t("Fails Count"),
        sort: true,
        editable: false,
        hidden: !showRequestOrganizer,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "requestOrgNotes",

        text: this.props.t("Archived Trainee Marks"),
        sort: true,
        editable: false,
        hidden: !showRequestOrgNotes,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "decreeDate",
        text: this.props.t("Un-archived Students"),
        sort: true,
        editable: false,
        hidden: !showDecreeDate,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "decreeOrganizer",
        text: this.props.t("Pass Percent(Exclude W)"),
        sort: true,
        // formatter: (cell, row) =>
        //   cell && Array.isArray(cell)
        //     ? cell.map(option => option.label).join(" , ")
        //     : "",
        editable: false,
        hidden: !showDecreeOrganizer,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },

      {
        dataField: "decreeOrgNotes",
        text: this.props.t("Fail Percent(Exclude W)"),
        editable: false,
        hidden: !showDecreeOrgNotes,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "foldingDate",
        text: this.props.t("Withdraw Percent"),
        editable: false,
        hidden: !showFoldingDate,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "foldingOrganizer",
        text: this.props.t("Archiving Percent"),
        editable: false,
        hidden: !showFoldingOrganizer,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      // {
      //   dataField: "foldingOrgNotes",
      //   text: this.props.t("Folding Notes"),
      //   editable: false,
      //   hidden: !showFoldingOrgNotes,
      //   filter: textFilter({
      //     placeholder: this.props.t("Search..."),
      //   }),
      // },
      // {
      //   dataField: "studentId",
      //   text: this.props.t("Student ID"),
      //   sort: true,
      //   editable: false,
      //   hidden: !showStudentID,
      //   filter: textFilter({
      //     placeholder: this.props.t("Search..."),
      //   }),
      // },
      // {
      //   dataField: "studentName",
      //   text: this.props.t("Student Name"),
      //   sort: true,
      //   editable: false,
      //   hidden: !showStudentName,
      //   filter: textFilter({
      //     placeholder: this.props.t("Search..."),
      //   }),
      // },

      {
        dataField: "action",
        text: "",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, warning) => (
          <div className="d-flex justify-content-center gap-3">
            {showDeleteButton && (
              <Tooltip title={this.props.t("Delete")} placement="top">
                <IconButton color="danger">
                  <i
                    className="mdi mdi-delete font-size-18 text-danger"
                    id="deletetooltip"
                    onClick={() => this.onClickDelete(warning)}
                  ></i>
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title={this.props.t("Student Status")} placement="top">
              <IconButton>
                <i
                  className="bx bxs-user font-size-18 text-secondary"
                  id="deletetooltip"
                  onClick={() => this.onClickStdStatus(warning)}
                ></i>
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: studentsRequests.length,
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
            <Breadcrumbs breadcrumbItem={t("Acadmey Students")} />

            <Row>
              {sidebarOpen && (
                <Row>
                  <Col lg={3} key={1}>
                    <div
                      style={{
                        marginLeft: "220px",
                        padding: "20px",
                      }}
                    >
                      <Card className="accordion-card">
                        <CardHeader>{t("Required data")}</CardHeader>
                        <CardBody style={{ padding: "0" }}>
                          <Accordion defaultActiveKey="0" flush>
                            <Accordion.Item eventKey="0">
                              <Accordion.Header>
                                {t("Personal Information")}
                              </Accordion.Header>
                              <Accordion.Body>
                                <Col>
                                  <div className="mb-1">
                                    <Row>
                                      <Col>
                                        <input
                                          type="checkbox"
                                          className="btn-check"
                                          id="btncheck15"
                                          autoComplete="off"
                                          defaultChecked={showRequestNum}
                                          onClick={() =>
                                            this.handleShowColumn("requestNum")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck15"
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
                                          id="btncheck4"
                                          autoComplete="off"
                                          defaultChecked={showRequestId}
                                          onClick={() =>
                                            this.handleShowColumn("requestId")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck4"
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
                                          id="btncheck16"
                                          autoComplete="off"
                                          defaultChecked={showYearSemester}
                                          onClick={() =>
                                            this.handleShowColumn(
                                              "yearSemester"
                                            )
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check big-width-check"
                                          htmlFor="btncheck16"
                                        >
                                          {this.props.t("Credits")}
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
                                          defaultChecked={
                                            showActivationSemester
                                          }
                                          onClick={() =>
                                            this.handleShowColumn(
                                              "activationSemester"
                                            )
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check big-width-check"
                                          htmlFor="btncheck3"
                                        >
                                          {this.props.t(
                                            "Total Registered(Exclude W)"
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
                                          id="btncheck6"
                                          autoComplete="off"
                                          defaultChecked={showStateId}
                                          onClick={() =>
                                            this.handleShowColumn("stateId")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck6"
                                        >
                                          {this.props.t("Passed Count")}
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
                                          defaultChecked={requestDate}
                                          onClick={() =>
                                            this.handleShowColumn("requestDate")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck5"
                                        >
                                          {this.props.t("Withdrawn Count")}
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
                                          defaultChecked={showRequestOrganizer}
                                          onClick={() =>
                                            this.handleShowColumn(
                                              "requestOrganizer"
                                            )
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck7"
                                        >
                                          {this.props.t("Fails Count")}
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
                                          defaultChecked={showRequestOrgNotes}
                                          onClick={() =>
                                            this.handleShowColumn(
                                              "requestOrgNotes"
                                            )
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck8"
                                        >
                                          {this.props.t(
                                            "Archived Trainee Marks"
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
                                          defaultChecked={showDecreeDate}
                                          onClick={() =>
                                            this.handleShowColumn("decreeDate")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck9"
                                        >
                                          {this.props.t("Un-archived Students")}
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
                                          defaultChecked={showDecreeOrganizer}
                                          onClick={() =>
                                            this.handleShowColumn(
                                              "decreeOrganizer"
                                            )
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck10"
                                        >
                                          {this.props.t(
                                            "Pass Percent(Exclude W)"
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
                                          id="btncheck11"
                                          autoComplete="off"
                                          defaultChecked={showDecreeOrgNotes}
                                          onClick={() =>
                                            this.handleShowColumn(
                                              "decreeOrgNotes"
                                            )
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck11"
                                        >
                                          {this.props.t(
                                            "Fail Percent(Exclude W)"
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
                                          id="btncheck12"
                                          autoComplete="off"
                                          defaultChecked={showFoldingDate}
                                          onClick={() =>
                                            this.handleShowColumn("foldingDate")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck12"
                                        >
                                          {this.props.t("Withdraw Percent")}
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
                                          defaultChecked={showFoldingOrganizer}
                                          onClick={() =>
                                            this.handleShowColumn(
                                              "foldingOrganizer"
                                            )
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck14"
                                        >
                                          {this.props.t("Archiving Percent")}
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
                                          id="btncheck13"
                                          autoComplete="off"
                                          defaultChecked={showFoldingOrgNotes}
                                          onClick={() =>
                                            this.handleShowColumn(
                                              "foldingOrgNotes"
                                            )
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck13"
                                        >
                                          {this.props.t("Folding Notes")}
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
                                          id="btncheck1"
                                          autoComplete="off"
                                          defaultChecked={showStudentID}
                                          onClick={() =>
                                            this.handleShowColumn("studentId")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check"
                                          htmlFor="btncheck1"
                                        >
                                          {this.props.t("Student ID")}
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
                                          defaultChecked={showStudentName}
                                          onClick={() =>
                                            this.handleShowColumn("studentName")
                                          }
                                        />
                                        <label
                                          className="btn btn-outline-primary big-width-check big-width-check"
                                          htmlFor="btncheck2"
                                        >
                                          {this.props.t("Student Name")}
                                        </label>
                                      </Col>
                                    </Row>
                                  </div>
                                </Col>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                              <Accordion.Header>
                                {t("Basic Information")}
                              </Accordion.Header>
                              <Accordion.Body></Accordion.Body>{" "}
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
                            keyField="Id"
                            columns={MainInfoColumns}
                            data={studentsRequests}
                          >
                            {({ paginationProps, paginationTableProps }) => (
                              <ToolkitProvider
                                keyField="Id"
                                data={studentsRequests}
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
                                      <Col sm="8">
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
                                      </Col>
                                    </Row>

                                    <BootstrapTable
                                      keyField="Id"
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      data={studentsRequests}
                                      columns={MainInfoColumns}
                                      cellEdit={cellEditFactory({
                                        mode: "dbclick",
                                        blurToSave: true,
                                        afterSaveCell: (
                                          oldValue,
                                          newValue,
                                          row,
                                          column
                                        ) => {
                                          this.handleContractTypeDataChange(
                                            row.Id,
                                            column.dataField,
                                            newValue
                                          );
                                        },
                                      })}
                                      noDataIndication={this.props.t(
                                        "No ContractsTypes found"
                                      )}
                                      defaultSorted={defaultSorting}
                                    />
                                    <Col className="pagination pagination-rounded justify-content-end mb-2">
                                      <PaginationListStandalone
                                        {...paginationProps}
                                      />
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
  studentsRequests,
  currencies,
  mobAppFacultyAccs,
  generalManagements,
  semesters,
  menu_items,
}) => ({
  studentsRequests: studentsRequests.studentsRequests,
  deleted: studentsRequests.deleted,
  faculties: mobAppFacultyAccs.faculties,
  currencies: currencies.currencies,
  yearSemesters: generalManagements.yearSemesters,
  semesters: semesters.semesters,
  currentSemester: semesters.currentSemester,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  // onGetStudentsRequests: regReqDocs =>
  //   dispatch(getStudentsRequests(regReqDocs)),
  // onGetCurrentSemester: () => dispatch(getCurrentSemester()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(TraineesList));
