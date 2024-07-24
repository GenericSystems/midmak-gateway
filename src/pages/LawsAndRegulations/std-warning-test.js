import React, { Component } from "react";
import {
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  CardHeader,
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
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import Accordion from "react-bootstrap/Accordion";
import { Formik, Field, Form, ErrorMessage } from "formik";

import {
  getStdWarningTest,
  addNewStdWarningTest,
  updateStdWarningTest,
  deleteStdWarningTest,
  getStdWarningTestDeletedValue,
} from "store/stdWarningTest/actions";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import { withRouter, Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";
import OtherChart from "pages/generate-SIDs/OtherChart";

import { getCurrentSemester } from "store/semesters/actions";
import { BackburgerIcon } from "@icons/material";
import { checkIsAddForPage, checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
 } from "../../utils/menuUtils";
class StdWarningTest extends Component {
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
      showFaculty: true,
      showStudentID: true,
      showRecordStatus: true,
      showAcademicStatus: true,
      showTemporaryWarning: true,
      showGPA: true,
      showCredits: true,
      showTemporaryState: false,
      showPermanentState: false,
      showSemester: false,
      showRegisteredRegularSemestersNum: false,
      showRegisteredSemestersNum: false,
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
    };
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
  }
  componentDidMount() {
    const {
      stdWarningTest,
      studentStates,
      stdWarningTestOpt,
      currencies,
      yearSemesters,
      currentSemester,
      semesters,
      faculties,
      onGetStdWarningTest,
      deleted,
      user_menu
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (stdWarningTest && !stdWarningTest.length) {
      onGetStdWarningTest();

      this.setState({ stdWarningTest, stdWarningTestOpt });
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

  handleSelectOption = (fieldName, selectedValue) => {
    const { onGetStdWarningTest, faculties } = this.props;
    const {
      selectedCurrency,
      selectedFaculty,
      selectedSemester,
      defaultSemester,
    } = this.state;
    if (fieldName == "currencyId") {
      this.setState({
        selectedCurrency: selectedValue,
      });
      let obj = {
        currencyId: selectedValue,
        facultyId: selectedFaculty,
        yearSemesterId: defaultSemester["value"],
      };
      onGetStdWarningTest(obj);
    }

    if (fieldName == "semesterId") {
      this.setState({
        defaultSemester: selectedValue,
      });
      let obj = {
        currencyId: selectedCurrency,
        facultyId: selectedFaculty,
        yearSemesterId: selectedValue["value"],
      };
      onGetStdWarningTest(obj);
    }

    if (fieldName == "facultyId") {
      const facultyObj = faculties.find(
        faculty => faculty.value === selectedValue
      );
      if (facultyObj) {
        this.setState({
          selectedFaculty: facultyObj.key,
        });
        let obj = {
          currencyId: selectedCurrency,
          facultyId: facultyObj.key,
          yearSemesterId: defaultSemester["value"],
        };
        onGetStdWarningTest(obj);
      } else if (!facultyObj) {
        this.setState({
          selectedFaculty: null,
        });
        let obj = {
          currencyId: selectedCurrency,
          facultyId: null,
          yearSemesterId: defaultSemester["value"],
        };
        onGetStdWarningTest(obj);
      }
    }
  };

  handleStdWarningTestDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateStdWarningTest, stdWarningTest } = this.props;

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
    const { stdWarningTest } = this.state;

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
    if (fieldName == "warningStatus") {
      this.setState(prevState => ({
        showStudentID: !prevState.showStudentID,
      }));
    }

    if (fieldName == "studentName") {
      this.setState(prevState => ({
        showStudentName: !prevState.showStudentName,
      }));
    }

    if (fieldName == "facultyId") {
      this.setState(prevState => ({
        showFaculty: !prevState.showFaculty,
      }));
    }

    if (fieldName == "recordStatus") {
      this.setState(prevState => ({
        showRecordStatus: !prevState.showRecordStatus,
      }));
    }

    if (fieldName == "toSemester") {
      this.setState(prevState => ({
        showAcademicStatus: !prevState.showAcademicStatus,
      }));
    }

    if (fieldName == "temporaryWarning") {
      this.setState(prevState => ({
        showTemporaryWarning: !prevState.showTemporaryWarning,
      }));
    }

    if (fieldName == "temporaryWarning") {
      this.setState(prevState => ({
        showToRegSemester: !prevState.showToRegSemester,
      }));
    }

    if (fieldName == "GPA") {
      this.setState(prevState => ({
        showGPA: !prevState.showGPA,
      }));
    }

    if (fieldName == "credits") {
      this.setState(prevState => ({
        showCredits: !prevState.showCredits,
      }));
    }

    if (fieldName == "temporaryState") {
      this.setState(prevState => ({
        showTemporaryState: !prevState.showTemporaryState,
      }));
    }

    if (fieldName == "permanentState") {
      this.setState(prevState => ({
        showPermanentState: !prevState.showPermanentState,
      }));
    }

    if (fieldName == "smesterId") {
      this.setState(prevState => ({
        showSemester: !prevState.showSemester,
      }));
    }

    if (fieldName == "registeredRegularSemestersNum") {
      this.setState(prevState => ({
        showRegisteredRegularSemestersNum:
          !prevState.showRegisteredRegularSemestersNum,
      }));
    }

    if (fieldName == "registeredSemestersNum") {
      this.setState(prevState => ({
        showRegisteredSemestersNum: !prevState.showRegisteredSemestersNum,
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

    if (fieldName === "permanentState") {
      this.setState({ prevStatusSemesArray: selectedMulti });
    }

    if (fieldName === "temporaryState") {
      this.setState({ prevAcademicWarningArray: selectedMulti });
    }

    if (fieldName === "smesterId") {
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

    if (fieldName == "recordStatus") {
      this.setState({ selectedFromAdmSemes });
    }

    if (fieldName == "academicStatus") {
      this.setState({ selectedToAdmSemes });
    }

    if (fieldName == "temporaryWarning ") {
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

    if (fieldName == "recordStatus") {
      this.setState({ selectedFromAdmSemes });
    }

    if (fieldName == "academicStatus") {
      this.setState({ selectedToAdmSemes });
    }

    if (fieldName == "temporaryWarning ") {
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

    if (fieldName == "recordStatus") {
      this.setState({ selectedFromAdmSemes: selectedValue });
    }

    if (fieldName == "academicStatus") {
      this.setState({ selectedToAdmSemes: selectedValue });
    }

    if (fieldName == "temporaryWarning ") {
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
      recordStatus: fromAdmSemesterObj.key,
      academicStatus: toAdmSemesterObj.key,
      temporaryWarning: fromRegSemesterObj.key,
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
      smesterId: applyStatusArray,
      applyForSemester: applyForSemesterArray,
      permanentState: prevStatusSemesArray,
      temporaryState: prevAcademicWarningArray,
    };

    onAddNewStdWarningTest(obj);
  };

  handleEditStdWarningTest = arg => {
    const stdWarningTest = arg;

    this.setState({
      warningId: stdWarningTest.Id,
      arWarning: stdWarningTest.SID,
      enWarning: stdWarningTest.enWarningStatus,
      arTransStatementWarning: stdWarningTest.studentName,
      enTransStatementWarning: stdWarningTest.enTransStatement,
      priorityWarning: stdWarningTest.priority,
      selectedColor: stdWarningTest.warningColor,
      selectedRuleType: stdWarningTest.ruleType,
      selectedFromAdmSemesId: stdWarningTest.recordStatus,
      selectedToAdmSemesId: stdWarningTest.academicStatus,
      selectedFromRegSemesId: stdWarningTest.temporaryWarning,
      selectedToRegSemesId: stdWarningTest.toRegSemesId,
      stdFromGPAWarning: stdWarningTest.stdFromGPA,
      stdTillGPAWarning: stdWarningTest.stdTillGPA,
      stdFromCreditsWarning: stdWarningTest.stdFromCredits,
      stdTillCreditsWarning: stdWarningTest.stdTillCredits,
      selectedCalculatedTransferCred:
        stdWarningTest.calculatedTransferCred == 1 ? "yes" : "no",
      selectedActiveAdditionalPeriod:
        stdWarningTest.activeAdditionalPeriod == 1 ? "yes" : "no",
      stdSemestersNumber: stdWarningTest.stdSemestersNb,
      prevFromGPAWarning: stdWarningTest.prevFromGPA,
      prevTillGPAWarning: stdWarningTest.prevTillGPA,
      prevFromCreditsWarning: stdWarningTest.prevFromCredits,
      prevTillCreditsWarning: stdWarningTest.prevTillCredits,
      applyForSemesterArray: stdWarningTest.applyForSemester,
      applyStatusArray: stdWarningTest.smesterId,
      prevAcademicWarningArray: stdWarningTest.temporaryState,
      prevStatusSemesArray: stdWarningTest.permanentState,
      isEdit: true,
    });

    this.toggle();
    const { fiscalYears, yearSemesters, onGetFeesConditions, currencies } =
      this.props;
    let obj = { Id: stdWarningTest.Id };

    if (stdWarningTest.recordStatus) {
      const fromAdmSemes = yearSemesters.find(
        yearSemester => yearSemester.key === stdWarningTest.recordStatus
      );
      this.setState({
        selectedFromAdmSemes: fromAdmSemes.value,
      });
    }

    if (stdWarningTest.academicStatus) {
      const toAdmSemes = yearSemesters.find(
        yearSemester => yearSemester.key === stdWarningTest.academicStatus
      );
      this.setState({
        selectedToAdmSemes: toAdmSemes.value,
      });
    }

    if (stdWarningTest.temporaryWarning) {
      const fromRegSemes = yearSemesters.find(
        yearSemester => yearSemester.key === stdWarningTest.temporaryWarning
      );
      this.setState({
        selectedFromRegSemes: fromRegSemes.value,
      });
    }

    if (stdWarningTest.toRegSemesId) {
      const toRegSemes = yearSemesters.find(
        yearSemester => yearSemester.key === stdWarningTest.toRegSemesId
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
      recordStatus: fromAdmSemesterObj.key,
      academicStatus: toAdmSemesterObj.key,
      temporaryWarning: fromRegSemesterObj.key,
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
      smesterId: applyStatusArray,
      applyForSemester: applyForSemesterArray,
      permanentState: prevStatusSemesArray,
      temporaryState: prevAcademicWarningArray,
    };

    onUpdateStdWarningTest(obj);
    this.toggle();
  };

  handleDeletedSuccessClose = () => {
    const { onGetStdWarningTestDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetStdWarningTestDeletedValue();
  };

  handleDeletedErrorClose = () => {
    const { onGetStdWarningTestDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetStdWarningTestDeletedValue();
  };

  handlePriorityChange = event => {
    const priorityValue = event.target.value;
    this.setState({ priorityWarning: priorityValue });
  };

  render() {
    const {
      stdWarningTest,
      stdWarningTestOpt,
      yearSemesters,
      currencies,
      semesters,
      studentStates,
      deleted,
      t,
    } = this.props;
    const {
      errorMessage,
      sidebarOpen,
      deleteModal,
      isEdit,
      showStudentID,
      showStudentName,
      showFaculty,
      showRecordStatus,
      showAcademicStatus,
      showTemporaryWarning,
      showGPA,
      showToRegSemester,
      showCredits,
      showTemporaryState,
      showPermanentState,
      showSemester,
      showRegisteredRegularSemestersNum,
      showRegisteredSemestersNum,
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
      showSearchButton
    } = this.state;
    const { SearchBar } = Search;

    let filteredOptions = stdWarningTestOpt.filter(
      option => option.value !== warningId
    );

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

    const stdWarningTestColumns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },

      {
        dataField: "SID",
        text: this.props.t("Student ID"),
        sort: true,
        editable: false,
        hidden: !showStudentID,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "studentName",
        text: this.props.t("Student Name"),
        sort: true,
        editable: false,
        hidden: !showStudentName,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "facultyId",
        text: this.props.t("Faculty"),
        sort: true,
        editable: false,
        hidden: !showFaculty,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "GPA",
        text: this.props.t("Cumulative Average"),
        sort: true,
        editable: false,
        hidden: !showGPA,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "credits",
        text: this.props.t("Completed Hours"),
        sort: true,
        editable: false,
        hidden: !showCredits,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "recordStatus",
        text: this.props.t("Record Status"),
        sort: true,
        editable: false,
        hidden: !showRecordStatus,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "academicStatus",

        text: this.props.t("Academic Status"),
        sort: true,
        editable: false,
        hidden: !showAcademicStatus,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "temporaryWarning",

        text: this.props.t("Temporary Warning"),
        sort: true,
        editable: false,
        hidden: !showTemporaryWarning,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "temporaryState",
        text: this.props.t("Temporary State"),
        sort: true,
        formatter: (cell, row) =>
          cell && Array.isArray(cell)
            ? cell.map(option => option.label).join(" , ")
            : "",
        editable: false,
        hidden: !showTemporaryState,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "permanentState",
        text: this.props.t("Permanent State"),
        sort: true,
        formatter: (cell, row) =>
          cell && Array.isArray(cell)
            ? cell.map(option => option.label).join(" , ")
            : "",
        editable: false,
        hidden: !showPermanentState,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "smesterId",
        text: this.props.t("Semester"),
        editable: false,
        hidden: !showSemester,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "registeredRegularSemestersNum",
        text: this.props.t("Num of Regular Registered Semesters"),
        editable: false,
        hidden: !showRegisteredRegularSemestersNum,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "registeredSemestersNum",
        text: this.props.t("Num of Registered Semesters "),
        editable: false,
        hidden: !showRegisteredSemestersNum,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "action",
        text: "",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, warning) => (
          <div className="d-flex justify-content-center gap-3">
            <Tooltip title={this.props.t("Calculate Warnings")} placement="top">
              <IconButton>
                <i
                  className="bx bxs-calculator font-size-18 text-secondary"
                  id="deletetooltip"
                  onClick={() => this.onClickCalculate(warning)}
                ></i>
              </IconButton>
            </Tooltip>

{showDeleteButton &&(
            <Tooltip title={this.props.t("Delete")} placement="top">
              <IconButton color="danger">
                <i
                  className="mdi mdi-delete font-size-18 text-danger"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(warning)}
                ></i>
              </IconButton>
            </Tooltip>)}

            <Tooltip title={this.props.t("Delete")} placement="top">
              <IconButton>
                <i
                  className="mdi mdi-delete font-size-18 text-secondary"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(warning)}
                ></i>
              </IconButton>
            </Tooltip>

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
      totalSize: stdWarningTest.length,
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
            <Breadcrumbs
              title={t("Academic Warning Rules")}
              breadcrumbItem={t("Academic Warning Rules List")}
            />

            <Card>
              <CardBody>
                <DeleteModal
                  show={deleteModal}
                  onDeleteClick={this.handleDeleteRow}
                  onCloseClick={() =>
                    this.setState({ deleteModal: false, selectedRowId: null })
                  }
                />
                <Row>
                  {sidebarOpen && (
                    <div style={{ width: sidebarOpen ? "14%" : "0" }}>
                      <Card>
                        <CardTitle id="warning_rules_header">
                          {t("Main Info")}
                        </CardTitle>
                        <CardBody>
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
                                    this.handleShowColumn("warningStatus")
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
                          <div className="mb-1">
                            <Row>
                              <Col>
                                <input
                                  type="checkbox"
                                  className="btn-check"
                                  id="btncheck3"
                                  autoComplete="off"
                                  defaultChecked={showFaculty}
                                  onClick={() =>
                                    this.handleShowColumn("facultyId")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check big-width-check"
                                  htmlFor="btncheck3"
                                >
                                  {this.props.t("Faculty")}
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
                                  defaultChecked={showCredits}
                                  onClick={() =>
                                    this.handleShowColumn("credits")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck4"
                                >
                                  {this.props.t("Completed Hours")}
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
                                  defaultChecked={showGPA}
                                  onClick={() => this.handleShowColumn("GPA")}
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck5"
                                >
                                  {this.props.t("Cumulative Average")}
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
                                  defaultChecked={showRecordStatus}
                                  onClick={() =>
                                    this.handleShowColumn("recordStatus")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck6"
                                >
                                  {this.props.t("Record Status")}
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
                                  defaultChecked={showAcademicStatus}
                                  onClick={() =>
                                    this.handleShowColumn("toSemester")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck7"
                                >
                                  {this.props.t("Academic Status")}
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
                                  defaultChecked={showTemporaryWarning}
                                  onClick={() =>
                                    this.handleShowColumn("temporaryWarning")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck8"
                                >
                                  {this.props.t("Temporary Warning")}
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
                                  defaultChecked={showPermanentState}
                                  onClick={() =>
                                    this.handleShowColumn("permanentState")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck9"
                                >
                                  {this.props.t("Permanent State")}
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
                                  defaultChecked={showTemporaryState}
                                  onClick={() =>
                                    this.handleShowColumn("temporaryState")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck10"
                                >
                                  {this.props.t("Temporary State")}
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
                                  defaultChecked={showSemester}
                                  onClick={() =>
                                    this.handleShowColumn("smesterId")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck11"
                                >
                                  {this.props.t("Semester")}
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
                                  defaultChecked={
                                    showRegisteredRegularSemestersNum
                                  }
                                  onClick={() =>
                                    this.handleShowColumn(
                                      "registeredRegularSemestersNum"
                                    )
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck12"
                                >
                                  {this.props.t(
                                    "Num of Regular Registered Semesters"
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
                                  id="btncheck13"
                                  autoComplete="off"
                                  defaultChecked={showRegisteredSemestersNum}
                                  onClick={() =>
                                    this.handleShowColumn(
                                      "registeredSemestersNum"
                                    )
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck13"
                                >
                                  {this.props.t("Num of Registered Semesters")}
                                </label>
                              </Col>
                            </Row>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  )}

                  <Col lg="auto" className="p-0">
                    <div className="collapse-course">
                      <i
                        onClick={this.toggleSidebar}
                        className="bx bx-menu"
                      ></i>
                    </div>
                  </Col>

                  <Col lg={sidebarOpen ? "" : ""}>
                    <Card>
                      <CardBody>
                        <div className="table-responsive">
                          <PaginationProvider
                            pagination={paginationFactory(pageOptions)}
                            keyField="Id"
                            columns={stdWarningTestColumns}
                            data={stdWarningTest}
                          >
                            {({ paginationProps, paginationTableProps }) => (
                              <ToolkitProvider
                                keyField="Id"
                                data={stdWarningTest}
                                columns={stdWarningTestColumns}
                                search
                              >
                                {toolkitprops => (
                                  <React.Fragment>
                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                      centered={true}
                                      size="xl"
                                      fullscreen
                                    >
                                      <ModalHeader
                                        toggle={this.toggle}
                                        tag="h4"
                                      >
                                        {!!isEdit
                                          ? this.props.t("Edit Warning")
                                          : this.props.t("Add Warning")}
                                      </ModalHeader>
                                      <ModalBody className="py-3 px-5">
                                        <Formik
                                          initialValues={
                                            (isEdit && {
                                              Id: warningId,
                                              SID: arWarning,
                                              enWarningStatus: enWarning,
                                              studentName:
                                                arTransStatementWarning,
                                              enTransStatement:
                                                enTransStatementWarning,
                                              priority: priorityWarning,
                                              warningColor: selectedColor,
                                              ruleType: selectedRuleType,
                                              recordStatus:
                                                selectedFromAdmSemes,
                                              academicStatus:
                                                selectedToAdmSemes,
                                              temporaryWarning:
                                                selectedFromRegSemes,
                                              toRegSemesId: selectedToRegSemes,
                                              stdFromGPA: stdFromGPAWarning,
                                              stdTillGPA: stdTillGPAWarning,
                                              stdFromCredits:
                                                stdFromCreditsWarning,
                                              stdTillCredits:
                                                stdTillCreditsWarning,
                                              calculatedTransferCred:
                                                selectedCalculatedTransferCred,
                                              activeAdditionalPeriod:
                                                selectedActiveAdditionalPeriod,
                                              stdSemestersNb:
                                                stdSemestersNumber,
                                              prevFromGPA: prevFromGPAWarning,
                                              prevTillGPA: prevTillGPAWarning,
                                              prevFromCredits:
                                                prevFromCreditsWarning,
                                              prevTillCredits:
                                                prevTillCreditsWarning,
                                            }) ||
                                            (!isEdit && {
                                              SID: "",
                                              enWarningStatus: "",
                                              studentName: "",
                                              enTransStatement: "",
                                              priority: "",
                                              warningColor: "",
                                              ruleType: "",
                                              recordStatus: "",
                                              academicStatus: "",
                                              temporaryWarning: "",
                                              toRegSemesId: "",
                                              stdFromGPA: "",
                                              stdTillGPA: "",
                                              calculatedTransferCred: "",
                                              activeAdditionalPeriod: "",
                                              stdSemestersNb: "",
                                              prevFromGPA: "",
                                              prevTillGPA: "",
                                            })
                                          }
                                          enableReinitialize={true}
                                          validationSchema={
                                            (!isEdit &&
                                              Yup.object().shape({
                                                SID: Yup.string()
                                                  .required(
                                                    "Warning Status(ar) is required"
                                                  )
                                                  .notOneOf(
                                                    stdWarningTest.map(
                                                      user => user.warningStatus
                                                    ),
                                                    "warningStatus already taken"
                                                  ),
                                                enWarningStatus:
                                                  Yup.string().required(
                                                    "Warning Status is required"
                                                  ),
                                              })) ||
                                            (isEdit &&
                                              Yup.object().shape({
                                                SID: Yup.string().required(
                                                  "Warning Status(ar) is required"
                                                ),
                                                enWarningStatus:
                                                  Yup.string().required(
                                                    "Warning Status is required"
                                                  ),
                                              }))
                                          }
                                          onSubmit={(
                                            values,
                                            { setSubmitting }
                                          ) => {
                                            if (isEdit) {
                                              const updateFees = {
                                                Id: warningId,
                                                SID: values.SID,
                                                enWarningStatus:
                                                  values.enWarningStatus,
                                                studentName: values.studentName,
                                                enTransStatement:
                                                  values.enTransStatement,
                                                priority: values.priority,
                                                warningColor: selectedColor,
                                                ruleType: values.ruleType,
                                                recordStatus:
                                                  selectedFromAdmSemes,
                                                academicStatus:
                                                  selectedToAdmSemes,
                                                temporaryWarning:
                                                  selectedFromRegSemes,
                                                toRegSemesId:
                                                  selectedToRegSemes,
                                                stdFromGPA: values.stdFromGPA,
                                                stdTillGPA: values.stdTillGPA,
                                                stdFromCredits:
                                                  values.stdFromCredits,
                                                stdTillCredits:
                                                  values.stdTillCredits,
                                                calculatedTransferCred:
                                                  values.calculatedTransferCred,
                                                activeAdditionalPeriod:
                                                  values.activeAdditionalPeriod,
                                                stdSemestersNb:
                                                  values.stdSemestersNb,
                                                prevFromGPA: values.prevFromGPA,
                                                prevTillGPA: values.prevTillGPA,
                                                prevFromCredits:
                                                  values.prevFromCredits,
                                                prevTillCredits:
                                                  values.prevTillCredits,
                                              };
                                              this.handleUpdate(updateFees);
                                            } else {
                                              this.handleSave(values);
                                            }
                                            setSubmitting(false);
                                          }}
                                        >
                                          {({
                                            errors,
                                            status,
                                            touched,
                                            values,
                                            handleSubmit,
                                            setFieldValue,
                                          }) => (
                                            <Form onSubmit={handleSubmit}>
                                              <Row>
                                                <Col className="col-6">
                                                  <Card>
                                                    <CardTitle id="add_header">
                                                      {this.props.t(
                                                        "Basic Information"
                                                      )}
                                                    </CardTitle>
                                                    <CardBody>
                                                      <Row>
                                                        <Col lg="6">
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Warning Status(ar)"
                                                                  )}
                                                                </Label>
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Field
                                                                  name="SID"
                                                                  type="text"
                                                                  className={
                                                                    "form-control" +
                                                                    (errors.SID &&
                                                                    touched.SID
                                                                      ? " is-invalid"
                                                                      : "")
                                                                  }
                                                                />
                                                                <ErrorMessage
                                                                  name="SID"
                                                                  component="div"
                                                                  className="invalid-feedback"
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Transcript Statement(ar)"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Field
                                                                  name="studentName"
                                                                  type="text"
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div className="mb-4">
                                                            <Row>
                                                              <Col lg="4">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Priority"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <InputGroup>
                                                                  <Field
                                                                    type="number"
                                                                    name="priority"
                                                                    id="applying-order"
                                                                    className={`form-control`}
                                                                    defaultValue={
                                                                      priorityWarning
                                                                    }
                                                                  />
                                                                  <div className="input-group-ques">
                                                                    ?
                                                                  </div>
                                                                </InputGroup>
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Rule Type"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <div className="d-flex flex-wrap gap-3">
                                                                  <div
                                                                    className="btn-group button-or"
                                                                    role="group"
                                                                  >
                                                                    <input
                                                                      type="radio"
                                                                      className={`btn-check button-or ${
                                                                        selectedRuleType ===
                                                                        "addWarning"
                                                                          ? "active"
                                                                          : ""
                                                                      }`}
                                                                      name="ruleType"
                                                                      id="btnradio4"
                                                                      autoComplete="off"
                                                                      defaultChecked={
                                                                        selectedRuleType ==
                                                                        "addWarning"
                                                                          ? "active"
                                                                          : ""
                                                                      }
                                                                      onChange={() =>
                                                                        setFieldValue(
                                                                          "ruleType",
                                                                          "addWarning"
                                                                        )
                                                                      }
                                                                    />
                                                                    <label
                                                                      className="btn btn-outline-primary smallButton  w-sm "
                                                                      htmlFor="btnradio4"
                                                                    >
                                                                      {this.props.t(
                                                                        "Add Warning"
                                                                      )}
                                                                    </label>

                                                                    <input
                                                                      type="radio"
                                                                      className={`btn-check button-or ${
                                                                        selectedRuleType ===
                                                                        "removeWarning"
                                                                          ? "active"
                                                                          : ""
                                                                      }`}
                                                                      name="ruleType"
                                                                      id="btnradio6"
                                                                      autoComplete="off"
                                                                      defaultChecked={
                                                                        selectedRuleType ==
                                                                        "removeWarning"
                                                                          ? "active"
                                                                          : ""
                                                                      }
                                                                      onChange={() =>
                                                                        setFieldValue(
                                                                          "ruleType",
                                                                          "removeWarning"
                                                                        )
                                                                      }
                                                                    />
                                                                    <label
                                                                      className="btn btn-outline-primary smallButton  w-sm "
                                                                      htmlFor="btnradio6"
                                                                    >
                                                                      {this.props.t(
                                                                        "Remove Warning"
                                                                      )}
                                                                    </label>
                                                                  </div>
                                                                </div>
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Warning Color"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <div className="row justify-content-center">
                                                                  <input
                                                                    name="warningColor"
                                                                    className="form-control form-control-color mw-100"
                                                                    value={
                                                                      selectedColor
                                                                    }
                                                                    onChange={
                                                                      this
                                                                        .handleColorChange
                                                                    }
                                                                    onBlur={() =>
                                                                      this.handleInputBlur(
                                                                        "warningColor"
                                                                      )
                                                                    }
                                                                    type="color"
                                                                    id="example-color-input"
                                                                  />
                                                                </div>
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                        </Col>
                                                        <Col lg="6">
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Warning Status(en)"
                                                                  )}
                                                                </Label>
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Field
                                                                  name="enWarningStatus"
                                                                  type="text"
                                                                  className={
                                                                    "form-control" +
                                                                    (errors.enWarningStatus &&
                                                                    touched.enWarningStatus
                                                                      ? " is-invalid"
                                                                      : "")
                                                                  }
                                                                />
                                                                <ErrorMessage
                                                                  name="enWarningStatus"
                                                                  component="div"
                                                                  className="invalid
                                                                       -feedback"
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Transcript Statement(en)"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Field
                                                                  name="enTransStatement"
                                                                  type="text"
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Apply for Semesters"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Select
                                                                  value={
                                                                    applyForSemesterArray
                                                                  }
                                                                  name="applyForSemester"
                                                                  isMulti={true}
                                                                  onChange={selectedOption =>
                                                                    this.handleMulti(
                                                                      "applyForSemester",
                                                                      selectedOption
                                                                    )
                                                                  }
                                                                  options={
                                                                    semesters
                                                                  }
                                                                  classNamePrefix="select2-selection"
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Semester"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Select
                                                                  value={
                                                                    applyStatusArray
                                                                  }
                                                                  name="smesterId"
                                                                  isMulti={true}
                                                                  onChange={selectedOption =>
                                                                    this.handleMulti(
                                                                      "smesterId",
                                                                      selectedOption
                                                                    )
                                                                  }
                                                                  options={
                                                                    studentStates
                                                                  }
                                                                  classNamePrefix="select2-selection"
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                        </Col>
                                                      </Row>
                                                    </CardBody>
                                                  </Card>

                                                  <Card>
                                                    <CardTitle id="add_header">
                                                      {this.props.t(
                                                        "Prev. Status"
                                                      )}
                                                    </CardTitle>
                                                    <CardBody>
                                                      <Row>
                                                        <Col lg="6">
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="5">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Prev. Academic Warn"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="7">
                                                                <Select
                                                                  value={
                                                                    prevAcademicWarningArray
                                                                  }
                                                                  name="temporaryState"
                                                                  isMulti={true}
                                                                  onChange={selectedOption =>
                                                                    this.handleMulti(
                                                                      "temporaryState",
                                                                      selectedOption
                                                                    )
                                                                  }
                                                                  options={
                                                                    filteredOptions
                                                                  }
                                                                  classNamePrefix="select2-selection"
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div>
                                                            <Row>
                                                              <Col lg="5">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Prev. Status Semester"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="7">
                                                                <Select
                                                                  value={
                                                                    prevStatusSemesArray
                                                                  }
                                                                  name="permanentState"
                                                                  isMulti={true}
                                                                  onChange={selectedOption =>
                                                                    this.handleMulti(
                                                                      "permanentState",
                                                                      selectedOption
                                                                    )
                                                                  }
                                                                  options={
                                                                    semesters
                                                                  }
                                                                  classNamePrefix="select2-selection"
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                        </Col>
                                                        <Col lg="6">
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "End AGPA"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="4">
                                                                <InputGroup>
                                                                  <Field
                                                                    type="number"
                                                                    name="prevFromGPA"
                                                                    id="avg"
                                                                    className={`form-control`}
                                                                  />
                                                                  <div className="input-group-ques">
                                                                    Pts
                                                                  </div>
                                                                </InputGroup>
                                                              </Col>
                                                              <Col lg="4">
                                                                <InputGroup>
                                                                  <Field
                                                                    type="number"
                                                                    name="prevTillGPA"
                                                                    id="avg"
                                                                    className={`form-control`}
                                                                  />
                                                                  <div className="input-group-ques">
                                                                    Pts
                                                                  </div>
                                                                </InputGroup>
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Passed Credits"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="4">
                                                                <InputGroup>
                                                                  <Field
                                                                    type="number"
                                                                    name="prevFromCredits"
                                                                    id="avg"
                                                                    className={`form-control`}
                                                                  />
                                                                  <div className="input-group-ques">
                                                                    CHs
                                                                  </div>
                                                                </InputGroup>
                                                              </Col>
                                                              <Col lg="4">
                                                                <InputGroup>
                                                                  <Field
                                                                    type="number"
                                                                    name="prevTillCredits"
                                                                    id="avg"
                                                                    className={`form-control`}
                                                                  />
                                                                  <div className="input-group-ques">
                                                                    CHs
                                                                  </div>
                                                                </InputGroup>
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                        </Col>
                                                      </Row>
                                                    </CardBody>
                                                  </Card>
                                                </Col>

                                                <Col className="col-6">
                                                  <Card>
                                                    <CardTitle id="add_header">
                                                      {this.props.t(
                                                        "Students Included"
                                                      )}
                                                    </CardTitle>
                                                    <CardBody>
                                                      <Row>
                                                        <Col lg="6">
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <label className="form-label">
                                                                  {this.props.t(
                                                                    "From Adm. Semester"
                                                                  )}
                                                                </label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Input
                                                                  type="text"
                                                                  name="recordStatus"
                                                                  id="year-semester"
                                                                  list="fromAdmSemesterdatalistOptions"
                                                                  placeholder="Type to search..."
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                  onBlur={() =>
                                                                    this.handleInputBlur(
                                                                      "recordStatus"
                                                                    )
                                                                  }
                                                                  onFocus={() =>
                                                                    this.handleInputFocus(
                                                                      "recordStatus"
                                                                    )
                                                                  }
                                                                  onChange={event =>
                                                                    this.handleDataListChange(
                                                                      event,
                                                                      "recordStatus"
                                                                    )
                                                                  }
                                                                  value={
                                                                    selectedFromAdmSemes
                                                                      ? (
                                                                          yearSemesters.find(
                                                                            yearSemester =>
                                                                              yearSemester.value ===
                                                                              selectedFromAdmSemes
                                                                          ) ||
                                                                          ""
                                                                        ).value
                                                                      : ""
                                                                  }
                                                                />
                                                                <datalist id="fromAdmSemesterdatalistOptions">
                                                                  {yearSemesters.map(
                                                                    yearSemester => (
                                                                      <option
                                                                        key={
                                                                          yearSemester.key
                                                                        }
                                                                        value={
                                                                          yearSemester.value
                                                                        }
                                                                      />
                                                                    )
                                                                  )}
                                                                </datalist>
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <label className="form-label">
                                                                  {this.props.t(
                                                                    "From Reg. Semester"
                                                                  )}
                                                                </label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Input
                                                                  type="text"
                                                                  name="temporaryWarning "
                                                                  id="year-semester"
                                                                  list="fromRegSemesterdatalistOptions"
                                                                  placeholder="Type to search..."
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                  onBlur={() =>
                                                                    this.handleInputBlur(
                                                                      "temporaryWarning "
                                                                    )
                                                                  }
                                                                  onFocus={() =>
                                                                    this.handleInputFocus(
                                                                      "temporaryWarning "
                                                                    )
                                                                  }
                                                                  onChange={event =>
                                                                    this.handleDataListChange(
                                                                      event,
                                                                      "temporaryWarning "
                                                                    )
                                                                  }
                                                                  value={
                                                                    selectedFromRegSemes
                                                                      ? (
                                                                          yearSemesters.find(
                                                                            yearSemester =>
                                                                              yearSemester.value ===
                                                                              selectedFromRegSemes
                                                                          ) ||
                                                                          ""
                                                                        ).value
                                                                      : ""
                                                                  }
                                                                />
                                                                <datalist id="fromRegSemesterdatalistOptions">
                                                                  {yearSemesters.map(
                                                                    yearSemester => (
                                                                      <option
                                                                        key={
                                                                          yearSemester.key
                                                                        }
                                                                        value={
                                                                          yearSemester.value
                                                                        }
                                                                      />
                                                                    )
                                                                  )}
                                                                </datalist>
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "End AGPA"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="4">
                                                                <InputGroup>
                                                                  <Field
                                                                    type="number"
                                                                    name="stdFromGPA"
                                                                    id="avg"
                                                                    className={`form-control`}
                                                                  />
                                                                  <div className="input-group-ques">
                                                                    Pts
                                                                  </div>
                                                                </InputGroup>
                                                              </Col>
                                                              <Col lg="4">
                                                                <InputGroup>
                                                                  <Field
                                                                    type="number"
                                                                    name="stdTillGPA"
                                                                    id="avg"
                                                                    className={`form-control`}
                                                                  />
                                                                  <div className="input-group-ques">
                                                                    Pts
                                                                  </div>
                                                                </InputGroup>
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="5">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Calculating the Transfer Credits"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="7">
                                                                <div className="d-flex flex-wrap gap-3">
                                                                  <div
                                                                    className="btn-group button-or"
                                                                    role="group"
                                                                  >
                                                                    <input
                                                                      type="radio"
                                                                      className="btn-check button-or"
                                                                      name="calculatedTransferCred"
                                                                      id="btnradio10"
                                                                      autoComplete="off"
                                                                      defaultChecked={
                                                                        selectedCalculatedTransferCred ==
                                                                        "yes"
                                                                          ? "active"
                                                                          : ""
                                                                      }
                                                                      onChange={() =>
                                                                        setFieldValue(
                                                                          "calculatedTransferCred",
                                                                          "yes"
                                                                        )
                                                                      }
                                                                    />
                                                                    <label
                                                                      className="btn btn-outline-primary smallButton  w-sm "
                                                                      htmlFor="btnradio10"
                                                                    >
                                                                      {this.props.t(
                                                                        "Yes"
                                                                      )}
                                                                    </label>

                                                                    <input
                                                                      type="radio"
                                                                      className="btn-check button-or"
                                                                      name="calculatedTransferCred"
                                                                      id="btnradio11"
                                                                      autoComplete="off"
                                                                      onChange={() =>
                                                                        setFieldValue(
                                                                          "calculatedTransferCred",
                                                                          "no"
                                                                        )
                                                                      }
                                                                      defaultChecked={
                                                                        selectedCalculatedTransferCred ==
                                                                        "no"
                                                                          ? "active"
                                                                          : ""
                                                                      }
                                                                    />
                                                                    <label
                                                                      className="btn btn-outline-primary smallButton  w-sm "
                                                                      htmlFor="btnradio11"
                                                                    >
                                                                      {this.props.t(
                                                                        "No"
                                                                      )}
                                                                    </label>
                                                                  </div>
                                                                </div>
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div>
                                                            <Row>
                                                              <Col lg="5">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Student Semesters"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="4">
                                                                <Field
                                                                  type="number"
                                                                  name="stdSemestersNb"
                                                                  className={`form-control`}
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                        </Col>
                                                        <Col lg="6">
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <label className="form-label">
                                                                  {this.props.t(
                                                                    "To Adm. Semester"
                                                                  )}
                                                                </label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Input
                                                                  type="text"
                                                                  name="academicStatus"
                                                                  id="year-semester"
                                                                  list="toAdmSemesterdatalistOptions"
                                                                  placeholder="Type to search..."
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                  onBlur={() =>
                                                                    this.handleInputBlur(
                                                                      "academicStatus"
                                                                    )
                                                                  }
                                                                  onFocus={() =>
                                                                    this.handleInputFocus(
                                                                      "academicStatus"
                                                                    )
                                                                  }
                                                                  onChange={event =>
                                                                    this.handleDataListChange(
                                                                      event,
                                                                      "academicStatus"
                                                                    )
                                                                  }
                                                                  value={
                                                                    selectedToAdmSemes
                                                                      ? (
                                                                          yearSemesters.find(
                                                                            yearSemester =>
                                                                              yearSemester.value ===
                                                                              selectedToAdmSemes
                                                                          ) ||
                                                                          ""
                                                                        ).value
                                                                      : ""
                                                                  }
                                                                />
                                                                <datalist id="toAdmSemesterdatalistOptions">
                                                                  {yearSemesters.map(
                                                                    yearSemester => (
                                                                      <option
                                                                        key={
                                                                          yearSemester.key
                                                                        }
                                                                        value={
                                                                          yearSemester.value
                                                                        }
                                                                      />
                                                                    )
                                                                  )}
                                                                </datalist>
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <label className="form-label">
                                                                  {this.props.t(
                                                                    "To Reg. Semester"
                                                                  )}
                                                                </label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Input
                                                                  type="text"
                                                                  name="toRegSemesId "
                                                                  id="year-semester"
                                                                  list="toRegSemesterdatalistOptions"
                                                                  placeholder="Type to search..."
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                  onBlur={() =>
                                                                    this.handleInputBlur(
                                                                      "toRegSemesId "
                                                                    )
                                                                  }
                                                                  onFocus={() =>
                                                                    this.handleInputFocus(
                                                                      "toRegSemesId "
                                                                    )
                                                                  }
                                                                  onChange={event =>
                                                                    this.handleDataListChange(
                                                                      event,
                                                                      "toRegSemesId "
                                                                    )
                                                                  }
                                                                  value={
                                                                    selectedToRegSemes
                                                                      ? (
                                                                          yearSemesters.find(
                                                                            yearSemester =>
                                                                              yearSemester.value ===
                                                                              selectedToRegSemes
                                                                          ) ||
                                                                          ""
                                                                        ).value
                                                                      : ""
                                                                  }
                                                                />
                                                                <datalist id="toRegSemesterdatalistOptions">
                                                                  {yearSemesters.map(
                                                                    yearSemester => (
                                                                      <option
                                                                        key={
                                                                          yearSemester.key
                                                                        }
                                                                        value={
                                                                          yearSemester.value
                                                                        }
                                                                      />
                                                                    )
                                                                  )}
                                                                </datalist>
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Passed Credits"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="4">
                                                                <InputGroup>
                                                                  <Field
                                                                    type="number"
                                                                    name="stdFromCredits"
                                                                    id="avg"
                                                                    className={`form-control`}
                                                                  />
                                                                  <div className="input-group-ques">
                                                                    CHs
                                                                  </div>
                                                                </InputGroup>
                                                              </Col>
                                                              <Col lg="4">
                                                                <InputGroup>
                                                                  <Field
                                                                    type="number"
                                                                    name="stdTillCredits"
                                                                    id="avg"
                                                                    className={`form-control`}
                                                                  />
                                                                  <div className="input-group-ques">
                                                                    CHs
                                                                  </div>
                                                                </InputGroup>
                                                              </Col>
                                                            </Row>
                                                          </div>

                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="5">
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Active with Additional Period"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="7">
                                                                <div className="d-flex flex-wrap gap-3">
                                                                  <div
                                                                    className="btn-group button-or"
                                                                    role="group"
                                                                  >
                                                                    <input
                                                                      type="radio"
                                                                      className="btn-check button-or"
                                                                      name="activeAdditionalPeriod"
                                                                      id="btnradio12"
                                                                      autoComplete="off"
                                                                      onChange={() =>
                                                                        setFieldValue(
                                                                          "activeAdditionalPeriod",
                                                                          "yes"
                                                                        )
                                                                      }
                                                                      defaultChecked={
                                                                        selectedActiveAdditionalPeriod ==
                                                                        "yes"
                                                                          ? "active"
                                                                          : ""
                                                                      }
                                                                    />
                                                                    <label
                                                                      className="btn btn-outline-primary smallButton  w-sm "
                                                                      htmlFor="btnradio12"
                                                                    >
                                                                      {this.props.t(
                                                                        "Yes"
                                                                      )}
                                                                    </label>

                                                                    <input
                                                                      type="radio"
                                                                      className="btn-check button-or"
                                                                      name="activeAdditionalPeriod"
                                                                      id="btnradio13"
                                                                      autoComplete="off"
                                                                      onChange={() =>
                                                                        setFieldValue(
                                                                          "activeAdditionalPeriod",
                                                                          "no"
                                                                        )
                                                                      }
                                                                      defaultChecked={
                                                                        selectedActiveAdditionalPeriod ==
                                                                        "no"
                                                                          ? "active"
                                                                          : ""
                                                                      }
                                                                    />
                                                                    <label
                                                                      className="btn btn-outline-primary smallButton  w-sm "
                                                                      htmlFor="btnradio13"
                                                                    >
                                                                      {this.props.t(
                                                                        "No"
                                                                      )}
                                                                    </label>
                                                                  </div>
                                                                </div>
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                        </Col>
                                                      </Row>
                                                    </CardBody>
                                                  </Card>
                                                </Col>
                                              </Row>
                                              <Row>
                                                <Col>
                                                  <div className="text-center">
                                                    <Button
                                                      type="submit"
                                                      style={{
                                                        backgroundColor:
                                                          "#0086BF",
                                                        border: "#0086BF",
                                                      }}
                                                    >
                                                      {t("Save")}
                                                    </Button>
                                                  </div>
                                                </Col>
                                              </Row>

                                              <Row></Row>
                                            </Form>
                                          )}
                                        </Formik>
                                      </ModalBody>
                                    </Modal>

                                    <Row>
                                      <Col sm="3">
                                        <div className="search-box ms-2 mb-2 d-inline-block">
                                      { showSearchButton &&(
                                          <div className="position-relative">
                                            <SearchBar
                                              {...toolkitprops.searchProps}
                                            />
                                          </div>)}
                                        </div>
                                      </Col>
                                      <Col>
                                      {showAddButton && (
                                        <div className="text-sm-end">
                                          <Tooltip
                                            title={this.props.t("Add")}
                                            placement="top"
                                          >
                                            <IconButton
                                              color="primary"
                                              onClick={this.handleAddWarning}
                                            >
                                              <i className="mdi mdi-plus-circle blue-noti-icon" />
                                            </IconButton>
                                          </Tooltip>
                                        </div>)}
                                      </Col>
                                    </Row>
                                    <Row>
                                      <div>
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
                                              onClick={
                                                this.handleDeletedErrorClose
                                              }
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
                                              onClick={
                                                this.handleDeletedSuccessClose
                                              }
                                            ></button>
                                          </Alert>
                                        )}
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
                                    <BootstrapTable
                                      keyField="Id"
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      data={stdWarningTest}
                                      columns={stdWarningTestColumns}
                                      cellEdit={cellEditFactory({
                                        mode: "click",
                                        blurToSave: true,
                                        afterSaveCell: (
                                          oldValue,
                                          newValue,
                                          row,
                                          column
                                        ) => {
                                          this.handleStdWarningTestDataChange(
                                            row.Id,
                                            column.dataField,
                                            newValue
                                          );
                                        },
                                      })}
                                      noDataIndication={t(
                                        "No Warning Rules Definition found"
                                      )}
                                      defaultSorted={defaultSorting}
                                      filter={filterFactory()}
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
              </CardBody>
            </Card>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({
  stdWarningTest,
  currencies,
  mobAppFacultyAccs,
  generalManagements,
  semesters,
  menu_items
}) => ({
  stdWarningTest: stdWarningTest.stdWarningTest,
  stdWarningTestOpt: stdWarningTest.stdWarningTestOpt,
  studentStates: stdWarningTest.studentStates,
  deleted: stdWarningTest.deleted,
  faculties: mobAppFacultyAccs.faculties,
  currencies: currencies.currencies,
  yearSemesters: generalManagements.yearSemesters,
  semesters: semesters.semesters,
  currentSemester: semesters.currentSemester,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetStdWarningTest: stdWarningTest =>
    dispatch(getStdWarningTest(stdWarningTest)),
  onAddNewStdWarningTest: stdWarningTest =>
    dispatch(addNewStdWarningTest(stdWarningTest)),
  onUpdateStdWarningTest: stdWarningTest =>
    dispatch(updateStdWarningTest(stdWarningTest)),
  onDeleteStdWarningTest: stdWarningTest =>
    dispatch(deleteStdWarningTest(stdWarningTest)),
  onGetStdWarningTestDeletedValue: () =>
    dispatch(getStdWarningTestDeletedValue()),
  onGetCurrentSemester: () => dispatch(getCurrentSemester()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(StdWarningTest));
