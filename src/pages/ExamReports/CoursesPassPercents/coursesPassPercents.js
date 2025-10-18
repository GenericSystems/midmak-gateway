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
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import Accordion from "react-bootstrap/Accordion";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import { withRouter, Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";
import { getYears } from "store/years/actions";

// import { getCurrentSemester } from "store/semesters/actions";
// import { getStudentsRequests } from "store/students-requests/actions";
import { BackburgerIcon } from "@icons/material";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
class CoursesPassPercentsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedView: "",
      years: [],
      errorMessage: null,
      sidebarOpen: true,
      deleteModal: false,
      selectedRowId: null,
      isEdit: false,
      showStartDate: false,
      showTotalRegistered: false,
      showTotalRegisteredExW: false,
      showPassedCount: false,
      showFailsCount: false,
      showArchivedTraineeMarks: false,
      withdrawnCount: false,
      startDate: false,
      showCourseName: false,
      showCourseCode: false,
      showPassPercentExW: false,
      showUnarchivedTrainees: false,
      showFailPercentExW: false,
      showWithdrawPercent: false,
      showArchivingPercent: false,
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
      selectedYear: null,
      trainees: [
        { Id: 1, Name: "أحمد", Grade: 90 },
        { Id: 2, Name: "مريم", Grade: 85 },
        { Id: 3, Name: "خالد", Grade: 78 },
      ],
    };
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
      years,
      user_menu,
      onGetYears,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (studentsRequests && !studentsRequests.length) {
      // onGetStudentsRequests({ yearSemesterId: 78 });
      onGetYears();
      this.setState({ studentsRequests, stdWarningTestOpt });
      this.setState({ studentStates });
      this.setState({ currencies });
      this.setState({ faculties, years });
      this.setState({ yearSemesters });
      this.setState({ currentSemester, semesters });
      this.setState({ deleted });
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
    if (fieldName == "credits") {
      this.setState(prevState => ({
        showCredits: !prevState.showCredits,
      }));
    }

    if (fieldName == "totalRegistered") {
      this.setState(prevState => ({
        showTotalRegistered: !prevState.showTotalRegistered,
      }));
    }

    if (fieldName == "totalRegisteredExW") {
      this.setState(prevState => ({
        showTotalRegisteredExW: !prevState.showTotalRegisteredExW,
      }));
    }

    if (fieldName == "passedCount") {
      this.setState(prevState => ({
        showPassedCount: !prevState.showPassedCount,
      }));
    }

    if (fieldName == "failsCount") {
      this.setState(prevState => ({
        showFailsCount: !prevState.showFailsCount,
      }));
    }

    if (fieldName == "archivedTraineeMarks") {
      this.setState(prevState => ({
        showArchivedTraineeMarks: !prevState.showArchivedTraineeMarks,
      }));
    }

    if (fieldName == "archivedTraineeMarks") {
      this.setState(prevState => ({
        showToRegSemester: !prevState.showToRegSemester,
      }));
    }

    if (fieldName == "withdrawnCount") {
      this.setState(prevState => ({
        withdrawnCount: !prevState.withdrawnCount,
      }));
    }
    if (fieldName == "startDate") {
      this.setState(prevState => ({
        startDate: !prevState.startDate,
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

    if (fieldName == "passPercentExW") {
      this.setState(prevState => ({
        showPassPercentExW: !prevState.showPassPercentExW,
      }));
    }

    if (fieldName == "un-archivedTrainees") {
      this.setState(prevState => ({
        showUnarchivedTrainees: !prevState.showUnarchivedTrainees,
      }));
    }

    if (fieldName == "failPercentExW") {
      this.setState(prevState => ({
        showFailPercentExW: !prevState.showFailPercentExW,
      }));
    }

    if (fieldName == "withdrawPercent") {
      this.setState(prevState => ({
        showWithdrawPercent: !prevState.showWithdrawPercent,
      }));
    }

    if (fieldName == "archivingPercent") {
      this.setState(prevState => ({
        showArchivingPercent: !prevState.showArchivingPercent,
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

    if (fieldName === "un-archivedTrainees") {
      this.setState({ prevStatusSemesArray: selectedMulti });
    }

    if (fieldName === "passPercentExW") {
      this.setState({ prevAcademicWarningArray: selectedMulti });
    }

    if (fieldName === "failPercentExW") {
      this.setState({ applyStatusArray: selectedMulti });
    }
  };

  handlePriorityChange = event => {
    const priorityValue = event.target.value;
    this.setState({ priorityWarning: priorityValue });
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
    const {
      studentsRequests,
      stdWarningTestOpt,
      yearSemesters,
      currencies,
      semesters,
      studentStates,
      deleted,
      years,
      t,
    } = this.props;
    const {
      selectedYear,
      errorMessage,
      sidebarOpen,
      deleteModal,
      isEdit,
      showStudentID,
      showStudentName,
      showCredits,
      showTotalRegistered,
      showTotalRegisteredExW,
      showPassedCount,
      showFailsCount,
      showArchivedTraineeMarks,
      withdrawnCount,
      startDate,
      showToRegSemester,
      showCourseName,
      showCourseCode,
      showPassPercentExW,
      showUnarchivedTrainees,
      showFailPercentExW,
      showWithdrawPercent,
      showArchivingPercent,
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

    const studentsRequestsColumns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
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
        dataField: "credits",
        text: this.props.t("Credits"),
        sort: true,
        editable: false,
        hidden: !showCredits,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "startDate",
        text: this.props.t("Start Date"),
        sort: true,
        editable: false,
        hidden: !startDate,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "totalRegistered",
        text: this.props.t("Total Registered"),
        sort: true,
        editable: false,
        hidden: !showTotalRegistered,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "totalRegisteredExW",
        text: this.props.t("Total Registered(Exclude W)"),
        sort: true,
        editable: false,
        hidden: !showTotalRegisteredExW,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "passedCount",
        text: this.props.t("Passed Count"),
        sort: true,
        editable: false,
        hidden: !showPassedCount,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "withdrawnCount",
        text: this.props.t("Withdrawn Count"),
        sort: true,
        editable: false,
        hidden: !withdrawnCount,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "failsCount",

        text: this.props.t("Fails Count"),
        sort: true,
        editable: false,
        hidden: !showFailsCount,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "archivedTraineeMarks",

        text: this.props.t("Archived Trainee Marks"),
        sort: true,
        editable: false,
        hidden: !showArchivedTraineeMarks,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "un-archivedTrainees",
        text: this.props.t("Un-archived Trainees"),
        sort: true,
        editable: false,
        hidden: !showUnarchivedTrainees,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "passPercentExW",
        text: this.props.t("Pass Percent(Exclude W)"),
        sort: true,
        editable: false,
        hidden: !showPassPercentExW,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "failPercentExW",
        text: this.props.t("Fail Percent(Exclude W)"),
        editable: false,
        hidden: !showFailPercentExW,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "withdrawPercent",
        text: this.props.t("Withdraw Percent"),
        editable: false,
        hidden: !showWithdrawPercent,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "archivingPercent",
        text: this.props.t("Archiving Percent"),
        editable: false,
        hidden: !showArchivingPercent,
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
            <Breadcrumbs
              title={t("Courses Pass Percents")}
              breadcrumbItem={t("Courses Pass Percents List")}
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
                                  defaultChecked={showCourseName}
                                  onClick={() =>
                                    this.handleShowColumn("courseName")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck1"
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
                                  id="btncheck2"
                                  autoComplete="off"
                                  defaultChecked={showCourseCode}
                                  onClick={() =>
                                    this.handleShowColumn("courseCode")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck2"
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
                                  id="btncheck3"
                                  autoComplete="off"
                                  defaultChecked={showCredits}
                                  onClick={() =>
                                    this.handleShowColumn("credits")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check big-width-check"
                                  htmlFor="btncheck3"
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
                                  id="btncheck4"
                                  autoComplete="off"
                                  defaultChecked={startDate}
                                  onClick={() =>
                                    this.handleShowColumn("startDate")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check big-width-check"
                                  htmlFor="btncheck4"
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
                                  id="btncheck5"
                                  autoComplete="off"
                                  defaultChecked={showTotalRegistered}
                                  onClick={() =>
                                    this.handleShowColumn("totalRegistered")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check big-width-check"
                                  htmlFor="btncheck5"
                                >
                                  {this.props.t("Total Registered")}
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
                                  defaultChecked={showTotalRegisteredExW}
                                  onClick={() =>
                                    this.handleShowColumn("totalRegisteredExW")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check big-width-check"
                                  htmlFor="btncheck6"
                                >
                                  {this.props.t("Total Registered(Exclude W)")}
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
                                  defaultChecked={showPassedCount}
                                  onClick={() =>
                                    this.handleShowColumn("passedCount")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck7"
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
                                  id="btncheck16"
                                  autoComplete="off"
                                  defaultChecked={withdrawnCount}
                                  onClick={() =>
                                    this.handleShowColumn("withdrawnCount")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck16"
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
                                  id="btncheck8"
                                  autoComplete="off"
                                  defaultChecked={showFailsCount}
                                  onClick={() =>
                                    this.handleShowColumn("failsCount")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck8"
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
                                  id="btncheck9"
                                  autoComplete="off"
                                  defaultChecked={showArchivedTraineeMarks}
                                  onClick={() =>
                                    this.handleShowColumn(
                                      "archivedTraineeMarks"
                                    )
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck9"
                                >
                                  {this.props.t("Archived Trainee Marks")}
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
                                  defaultChecked={showUnarchivedTrainees}
                                  onClick={() =>
                                    this.handleShowColumn("un-archivedTrainees")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck10"
                                >
                                  {this.props.t("Un-archived Trainees")}
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
                                  defaultChecked={showPassPercentExW}
                                  onClick={() =>
                                    this.handleShowColumn("passPercentExW")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck11"
                                >
                                  {this.props.t("Pass Percent(Exclude W)")}
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
                                  defaultChecked={showFailPercentExW}
                                  onClick={() =>
                                    this.handleShowColumn("failPercentExW")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck12"
                                >
                                  {this.props.t("Fail Percent(Exclude W)")}
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
                                  defaultChecked={showWithdrawPercent}
                                  onClick={() =>
                                    this.handleShowColumn("withdrawPercent")
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck13"
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
                                  defaultChecked={showArchivingPercent}
                                  onClick={() =>
                                    this.handleShowColumn("archivingPercent")
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
                            columns={studentsRequestsColumns}
                            data={studentsRequests}
                          >
                            {({ paginationProps, paginationTableProps }) => (
                              <ToolkitProvider
                                keyField="Id"
                                data={studentsRequests}
                                columns={studentsRequestsColumns}
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
                                      <ModalBody className="py-3 px-5"></ModalBody>
                                    </Modal>

                                    <Row>
                                      <Col sm="5">
                                        <div className="search-box ms-2 mb-2 d-inline-block">
                                          {/* {showSearchButton && ( */}
                                          <div className="position-relative">
                                            <SearchBar
                                              {...toolkitprops.searchProps}
                                            />
                                          </div>
                                          {/* )} */}
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
                                      <Col lg="3">
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
                                      data={studentsRequests}
                                      columns={studentsRequestsColumns}
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
  studentsRequests,
  currencies,
  mobAppFacultyAccs,
  generalManagements,
  semesters,
  menu_items,
  years,
}) => ({
  studentsRequests: studentsRequests.studentsRequests,
  deleted: studentsRequests.deleted,
  faculties: mobAppFacultyAccs.faculties,
  currencies: currencies.currencies,
  years: years.years,
  semesters: semesters.semesters,
  currentSemester: semesters.currentSemester,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  // onGetStudentsRequests: regReqDocs =>
  //   dispatch(getStudentsRequests(regReqDocs)),
  // onGetCurrentSemester: () => dispatch(getCurrentSemester()),
  onGetYears: () => dispatch(getYears()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(CoursesPassPercentsList));
