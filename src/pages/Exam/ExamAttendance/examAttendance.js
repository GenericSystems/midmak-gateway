import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Alert,
  Modal,
  Label,
  Button,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { withRouter } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import Select from "react-select";
import { Formik, Field, Form, ErrorMessage } from "formik";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import {
  getExamsAttendance,
  addNewExamAttendance,
  updateExamAttendance,
  deleteExamAttendance,
  getExamAttendanceDeletedValue,
  getExamsNames,
} from "store/examAttendance/actions";

import * as Yup from "yup";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import { isEmpty, size, map } from "lodash";
import { Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
import QRCode from "qrcode";

class ExamsAttendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      examsAttendance: [],
      examAttendance: "",
      selectedCertLevel: null,
      deleteModal: false,
      duplicateError: null,
      selectedRowId: null,
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      modal: false,
      modal1: false,
      academicCodeError: false,
      isEdit: false,
      isPrint: false,
      sectorsArray: [],
      QRModal: false,
      qr: "",
      sidebarOpen: true,
      selectedExamName: "",
      selectedExamKey: null,
      selectedExamValue: "",
      selectedPeriodKey: null,
      selectedPeriodValue: "",
      selectedCourseKey: null,
      selectedCourseValue: "",
      selectedHallKey: null,
      selectedHallValue: "",
      selectedObserverKey: null,
      selectedObserverValue: "",
    };
  }

  /*  initializeState() {
    const {selectedExamName} = this.state
    console.log("selectedExamName in initail state", selectedExamName)
    this.setState({selectedExamName :selectedExamName})
  } */

  componentDidMount() {
    const {
      examsAttendance,
      examAttendanceTypes,
      deleted,
      user_menu,
      examsNames,
      coursesOffering,
      employeesNames,
      halls,
      examsPeriods,
      sectors,
      years,
      attendStatus,
      filteredExamAttendanceGrades,
      filteredMembers,
      onGetExamsNames,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (examsAttendance && !examsAttendance.length) {
      onGetExamsNames();
    }
    // this.props.onGetExamsAttendance();
    this.setState({
      attendStatus,
      examsAttendance,
      examAttendanceTypes,
      deleted,
      examsNames,
      coursesOffering,
      employeesNames,
      halls,
      examsPeriods,
      sectors,
      filteredExamAttendanceGrades,
      filteredMembers,
      years,
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
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
      this.updateShowEditButton(
        this.props.user_menu,
        this.props.location.pathname
      );
      this.updateShowSearchButton(
        this.props.user_menu,
        this.props.location.pathname
      );
    }
    /*     const {selectedExamName} = this.state
    if (
      (selectedExamName &&
        selectedExamName !==
          prevProps.selectedExamName) 
    ) {
      this.initializeState();
    } */
  }

  updateShowAddButton = (menu, pathname) => {
    const showAddButton = checkIsAddForPage(menu, pathname);
    this.setState({ showAddButton });
  };

  updateShowDeleteButton = (menu, pathname) => {
    const showDeleteButton = checkIsDeleteForPage(menu, pathname);
    this.setState({ showDeleteButton });
  };

  updateShowEditButton = (menu, pathname) => {
    const showEditButton = checkIsEditForPage(menu, pathname);
    this.setState({ showEditButton });
  };

  updateShowSearchButton = (menu, pathname) => {
    const showSearchButton = checkIsSearchForPage(menu, pathname);
    this.setState({ showSearchButton });
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

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  onClickDelete = row => {
    this.setState({ selectedRowId: row.Id, deleteModal: true });
  };

  handleAddRow = () => {
    this.setState({
      examAttendance: "",
      isEdit: false,
    });
    this.toggle();
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null, emptyError: null });
  };

  handleDeleteRow = () => {
    const { onDeleteExamAttendance } = this.props;
    const { selectedRowId } = this.state;
    if (selectedRowId !== null) {
      onDeleteExamAttendance({ Id: selectedRowId });

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };
  handleExamAttendanceDataChange = (rowId, fieldName, fieldValue) => {
    const { examsAttendance, onUpdateExamAttendance } = this.props;
    const isDuplicate = examsAttendance.some(
      examAttendance =>
        examAttendance.Id !== rowId &&
        examAttendance.arTitle.trim() === fieldValue.trim()
    );

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateExamAttendance(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateExamAttendance(onUpdate);
    }
  };

  handleSuccessClose = () => {
    const { onGetExamAttendanceDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetExamAttendanceDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetExamAttendanceDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetExamAttendanceDeletedValue();
  };

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  toggle1 = () => {
    this.setState(prevState => ({
      modal1: !prevState.modal1,
    }));
  };

  handleDatalistChange = (fieldName, optionsArray, value) => {
    const selected = optionsArray.find(opt => opt.value === value);
    if (selected) {
      this.setState({
        [`selected${fieldName}Key`]: selected.key,
        [`selected${fieldName}Value`]: selected.value,
      });
    } else {
      this.setState({
        [`selected${fieldName}Key`]: null,
        [`selected${fieldName}Value`]: value,
      });
    }
  };

  handleExamChange = selectedOption => {
    if (!selectedOption) return;
    const selectedExamId = selectedOption.value;
    const filteredPeriods = (this.props.examsPeriods || []).filter(
      item => item.key === selectedExamId && item.value
    );

    this.setState({
      selectedExamKey: selectedExamId,
      selectedExamValue: selectedOption.label,
      filteredPeriods,
      selectedPeriodKey: null,
      selectedPeriodValue: "",
    });
  };

  handleSearch = () => {
    const {
      selectedExamKey,
      selectedPeriodKey,
      selectedCourseKey,
      selectedHallKey,
      selectedObserverKey,
    } = this.state;

    const filterData = {};
    if (selectedExamKey) filterData.Id = Number(selectedExamKey);
    if (selectedPeriodKey) filterData.periodId = selectedPeriodKey;
    if (selectedCourseKey) filterData.courseId = selectedCourseKey;
    if (selectedHallKey) filterData.hallId = selectedHallKey;
    if (selectedObserverKey) filterData.observerId = selectedObserverKey;

    console.log("Search filterData:", filterData);

    if (this.props.onGetExamsAttendance) {
      this.props.onGetExamsAttendance(filterData);
    }
  };
  handleSave = values => {
    const {
      isEdit,
      selectedExamName,
      selectedMember,
      selectedExamAttendanceType,
      selectedMemberGrade,
      selectedSector,
      selectedYear,
      examAttendance,
      sectorsArray,
    } = this.state;
    const { onAddNewExamAttendance, onUpdateExamAttendance, examsAttendance } =
      this.props;
    console.log("values", values);

    values["yearId"] = selectedYear;
    values["trainerId"] = selectedMember;
    values["examNameId"] = selectedExamName;
    values["examAttendanceTypeId"] = selectedExamAttendanceType;
    values["trainerGradeId"] = selectedMemberGrade;
    values["sector"] = sectorsArray;

    console.log("selectedExamName0", selectedExamName);

    if (values.academicCode === "") {
      this.setState({ academicCodeError: true });
    } else {
      this.setState({ academicCodeError: false });
    }

    if (
      values.academicCode &&
      selectedExamName !== null &&
      selectedMember !== null &&
      selectedYear !== null &&
      selectedExamAttendanceType !== null &&
      selectedMemberGrade !== null &&
      sectorsArray.length !== 0
    ) {
      let sectionInfo = {};
      Object.keys(values).forEach(function (key) {
        if (
          values[key] != undefined &&
          (values[key].length > 0 || values[key] != "")
        )
          sectionInfo[key] = values[key];
      });
      if (isEdit) {
        onUpdateExamAttendance(sectionInfo);
      } else {
        onAddNewExamAttendance(sectionInfo);
      }
      this.setState({
        selectedAcademicExamAttendance: null,
        errorMessages: {},
      });
      this.toggle();
    } else {
      let emptyError = "";
      console.log("selectedExamName", selectedExamName);
      if (selectedExamName === undefined) {
        emptyError = "Fill the empty select";
      }
      if (selectedMember === undefined) {
        emptyError = "Fill the empty select";
      }
      if (selectedMemberGrade === undefined) {
        emptyError = "Fill the empty select";
      }
      if (selectedYear === undefined) {
        emptyError = "Fill the empty select";
      }
      if (sectorsArray.length == 0) {
        emptyError = "Fill the empty select";
      }
      if (selectedExamAttendanceType === undefined) {
        emptyError = "Fill the empty select";
      }
      this.setState({ emptyError: emptyError });
    }
  };

  handleExamAttendanceClick = arg => {
    const { examAttendance } = this.state;
    console.log("arg", arg);

    this.setState({
      examAttendance: arg,
      isEdit: true,
    });

    this.toggle();
  };

  toggleSidebar = () => {
    this.setState(prevState => ({
      sidebarOpen: !prevState.sidebarOpen,
    }));
  };

  handleSelect = (rowId, fieldName, selectedValue) => {
    const { onUpdateHiddenGrade } = this.props;

    let onUpdate;
    if (fieldName === "attendStatusId") {
      onUpdate = {
        Id: rowId,
        [fieldName]: selectedValue.value,
      };
    }

    // onUpdateExamAttendance(onUpdate);
  };

  // handlePrint = arg => {
  //   const { examAttendance } = this.state;
  //   console.log("arg", arg);

  //   this.setState({
  //     examAttendance: arg,
  //     isPrint: true,
  //   });

  //   this.toggle1();
  // };

  render() {
    const { filteredData } = this.state;
    const { SearchBar } = Search;
    const {
      examsAttendance,
      user_menu,
      deleted,
      examsNames,
      coursesOffering,
      employeesNames,
      halls,
      examsPeriods,
      years,
      sectors,
      examAttendanceTypes,
      filteredExamAttendanceGrades,
      filteredMembers,
      t,
      attendStatus,
    } = this.props;
    const {
      modal,
      modal1,
      examAttendance,
      isEdit,
      isPrint,
      academicCodeError,
      sectorsArray,
      QRModal,
      qr,
      sidebarOpen,
      selectedExamName,
      duplicateError,
      errorMessage,
      emptyError,
      deleteModal,
      showAlert,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
      selectedExamValue,
      selectedPeriodValue,
      selectedCourseValue,
      selectedHallValue,
      selectedObserverValue,
      filteredPeriods,
    } = this.state;
    console.log("eaaaaaaaaaaaa", examsPeriods);
    const alertMessage =
      deleted == 0 ? "Can't Delete " : "Deleted Successfully";
    const {} = this.state;
    console.log("filteredMembers", filteredMembers);

    const defaultSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];

    const columns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      {
        dataField: "arTitle",
        text: this.props.t("Course Name"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          //  hidden: !showSearchButton,
        }),
      },
      {
        dataField: "academicCode",
        text: this.props.t("Course Code"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          //  hidden: !showSearchButton,
        }),
      },

      {
        dataField: "examAttendanceType",
        text: this.props.t("Day"),
        sort: true,

        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          //  hidden: !showSearchButton,
        }),
      },
      {
        dataField: "examDate",
        text: this.props.t("Exam Date"),
        sort: true,

        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          //  hidden: !showSearchButton,
        }),
      },

      {
        dataField: "trainerGrade",
        text: this.props.t("Exam Time"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          //  hidden: !showSearchButton,
        }),
      },
      {
        dataField: "Room",
        text: this.props.t("Sector"),
        sort: true,
        editable: false,
      },
      {
        dataField: "examAttendanceYear",
        text: this.props.t("Trainees Count"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          //  hidden: !showSearchButton,
        }),
      },

      {
        dataField: "delete",
        text: this.props.t(""),
        //   hidden: !showDeleteButton,
        isDummyField: true,
        editable: false, // Set the "Action" column to not editable
        formatter: (cellContent, examAttendance) => (
          <div className="d-flex gap-3">
            <Tooltip title={this.props.t("Room Details")} placement="top">
              <Link className="text-secondary" to="#">
                <i
                  className="bx bx-bx bxs-report"
                  id="roomDetails"
                  onClick={() => this.handleExamAttendanceClick(examAttendance)}
                ></i>
              </Link>
            </Tooltip>
          </div>
        ),
      },
    ];
    const columns2 = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      {
        dataField: "trainerName",
        text: this.props.t("Course Name"),
        sort: true,
        editable: false,
      },
      {
        dataField: "academicCode",
        text: this.props.t("Course Code"),
        sort: true,
        editable: false,
      },

      {
        dataField: "examAttendanceType",
        text: this.props.t("Trainees Count"),
        sort: true,

        editable: false,
      },
      {
        dataField: "delete",
        text: this.props.t("Print"),
        //   hidden: !showDeleteButton,
        isDummyField: true,
        editable: false, // Set the "Action" column to not editable
        formatter: (cellContent, examAttendance) => (
          <div className="d-flex gap-3">
            <Tooltip title={this.props.t("Print")} placement="top">
              <Link className="text-secondary" to="#">
                <i
                  className="fas fa-print"
                  id="printtooltip"
                  onClick={() => this.handlePrint(examAttendance)}
                ></i>
              </Link>
            </Tooltip>
          </div>
        ),
      },
    ];
    const columns3 = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      {
        dataField: "trainerName",
        text: this.props.t("Trainee Num"),
        sort: true,
        editable: false,
      },
      {
        dataField: "academicCode",
        text: this.props.t("Trainee Name"),
        sort: true,
        editable: false,
      },

      {
        dataField: "examAttendanceType",
        text: this.props.t("Postition"),
        sort: true,

        editable: false,
      },
      {
        dataField: "userType",
        text: this.props.t("Course Name"),
        sort: true,

        editable: false,
      },

      {
        dataField: "trainerGrade",
        text: this.props.t("Course Code"),
        sort: true,
        editable: false,
      },
      {
        dataField: "attendStatusId",
        text: this.props.t("Attend Status"),
        sort: true,
        editable: false,
        formatter: (cell, row) => (
          <Select
            key={`hide_reason_select_${row.Id}`}
            options={attendStatus}
            value={attendStatus.find(opt => opt.value === row.attendStatusId)}
            onChange={selectedValue =>
              this.handleSelect(row.Id, "attendStatusId ", selectedValue)
            }
          />
        ),
      },
      {
        dataField: "examAttendanceYear",
        text: this.props.t("Notes"),
        sort: true,
        editable: true,
      },
    ];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: examsAttendance.length,
      custom: true,
    };

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteRow}
          onCloseClick={() =>
            this.setState({ deleteModal: false, selectedRowId: null })
          }
        />
        <div className="page-content">
          <div className="container-fluid">
            <Breadcrumbs breadcrumbItem={this.props.t("ExamsAttendance")} />

            <Row>
              <Col>
                <Card>
                  <CardBody className="card-style">
                    {sidebarOpen && (
                      <Col lg="2">
                        <Card>
                          <CardTitle id="course_header">
                            {t("Search Criteria")}
                          </CardTitle>
                          <CardBody>
                            <Card>
                              <CardBody>
                                {/* Exam */}
                                <Row className="mb-3">
                                  <Col lg="4">
                                    <Label className="form-label user-style">
                                      {t("Exam")}:
                                    </Label>
                                  </Col>
                                  <Col lg="8">
                                    <Select
                                      className="form-style "
                                      name="examNameId"
                                      key="examName_select"
                                      options={examsNames}
                                      value={examsNames.find(
                                        opt =>
                                          opt.value ===
                                          this.state.selectedExamKey
                                      )}
                                      onChange={this.handleExamChange}
                                    />
                                  </Col>
                                </Row>

                                {/* Period */}
                                <Row className="mb-3">
                                  <Col lg="4">
                                    <Label className="form-label user-style">
                                      {t("Period")}:
                                    </Label>
                                  </Col>
                                  <Col lg="8">
                                    <input
                                      type="text"
                                      list="periodOptions"
                                      name="periodId"
                                      placeholder="Type to search..."
                                      className="form-control"
                                      value={selectedPeriodValue || ""}
                                      onChange={e =>
                                        this.handleDatalistChange(
                                          "Period",
                                          filteredPeriods.flatMap(item =>
                                            JSON.parse(item.value)
                                          ),
                                          e.target.value
                                        )
                                      }
                                    />
                                    <datalist id="periodOptions">
                                      {(filteredPeriods || [])
                                        .flatMap(item => JSON.parse(item.value))
                                        .map(period => (
                                          <option
                                            key={period.Id}
                                            value={`${period.flag} (${period.startTime} → ${period.endTime})`}
                                          />
                                        ))}
                                    </datalist>
                                  </Col>
                                </Row>

                                {/* Course */}
                                <Row className="mb-3">
                                  <Col lg="4">
                                    <Label className="form-label user-style">
                                      {t("Course")}:
                                    </Label>
                                  </Col>
                                  <Col lg="8">
                                    <input
                                      type="text"
                                      list="courseOptions"
                                      name="course"
                                      placeholder="Type to search..."
                                      className="form-control"
                                      value={selectedCourseValue || ""}
                                      onChange={e =>
                                        this.handleDatalistChange(
                                          "Course",
                                          coursesOffering,
                                          e.target.value
                                        )
                                      }
                                    />
                                    <datalist id="courseOptions">
                                      {coursesOffering.map(opt => (
                                        <option
                                          key={opt.key}
                                          value={opt.value}
                                        />
                                      ))}
                                    </datalist>
                                  </Col>
                                </Row>

                                {/* Room */}
                                <Row className="mb-3">
                                  <Col lg="4">
                                    <Label
                                      className="form-label user-style"
                                      for="hall-Id"
                                    >
                                      {t("Room")}:
                                    </Label>
                                  </Col>
                                  <Col lg="8">
                                    <input
                                      type="text"
                                      list="roomOptions"
                                      name="hallId"
                                      id="hall-Id"
                                      placeholder="Type to search..."
                                      className="form-control"
                                      value={selectedHallValue || ""}
                                      onChange={e =>
                                        this.handleDatalistChange(
                                          "Hall",
                                          halls,
                                          e.target.value
                                        )
                                      }
                                    />
                                    <datalist id="roomOptions">
                                      {halls.map(opt => (
                                        <option
                                          key={opt.key}
                                          value={opt.value}
                                        />
                                      ))}
                                    </datalist>
                                  </Col>
                                </Row>

                                {/* Observer */}
                                <Row className="mb-3">
                                  <Col lg="4">
                                    <Label
                                      className="form-label user-style"
                                      for="observer_Id"
                                    >
                                      {t("Observer")} {""}:
                                    </Label>
                                  </Col>
                                  <Col lg="8">
                                    <input
                                      type="text"
                                      list="observerOptions"
                                      name="observerId"
                                      id="observer_Id"
                                      placeholder="Type to search..."
                                      className="form-control"
                                      value={selectedObserverValue || ""}
                                      onChange={e =>
                                        this.handleDatalistChange(
                                          "Observer",
                                          employeesNames,
                                          e.target.value
                                        )
                                      }
                                    />
                                    <datalist id="observerOptions">
                                      {employeesNames.map(altEmp => (
                                        <option
                                          key={altEmp.key}
                                          value={altEmp.value}
                                        />
                                      ))}
                                    </datalist>
                                  </Col>
                                </Row>
                              </CardBody>
                            </Card>

                            <div className="text-center mt-4">
                              <Button
                                color="primary"
                                className="px-4"
                                onClick={() => this.handleSearch()}
                              >
                                <i className="fas fa-search me-2"></i>{" "}
                                {t("Search")}
                              </Button>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                    )}

                    <Col lg="auto" className="p-0">
                      <div className="collapse-course">
                        <i
                          onClick={this.toggleSidebar}
                          className="bx bx-menu"
                        ></i>
                      </div>
                    </Col>

                    <Col lg={sidebarOpen ? "" : "11"}>
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
                              columns={columns}
                              data={examsAttendance}
                            >
                              {({ paginationProps, paginationTableProps }) => (
                                <ToolkitProvider
                                  keyField="Id"
                                  data={examsAttendance}
                                  columns={columns}
                                  search
                                >
                                  {toolkitprops => (
                                    <React.Fragment>
                                      <Row>
                                        <Col sm="4">
                                          <div className="search-box ms-2 mb-2 d-inline-block">
                                            {showSearchButton && (
                                              <div className="position-relative">
                                                <SearchBar
                                                  {...toolkitprops.searchProps}
                                                />
                                              </div>
                                            )}
                                          </div>
                                        </Col>
                                        <Col sm="8">
                                          {/* {selectedExamName && (
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
                                          )} */}
                                        </Col>
                                      </Row>

                                      <BootstrapTable
                                        keyField="Id"
                                        {...toolkitprops.baseProps}
                                        {...paginationTableProps}
                                        data={examsAttendance}
                                        columns={columns}
                                        cellEdit={cellEditFactory({
                                          mode: "click",
                                          blurToSave: true,
                                          afterSaveCell: (
                                            oldValue,
                                            newValue,
                                            row,
                                            column
                                          ) => {
                                            this.handleExamAttendanceDataChange(
                                              row.Id,
                                              column.dataField,
                                              newValue
                                            );
                                          },
                                        })}
                                        noDataIndication={this.props.t(
                                          "No Exam Attendance found"
                                        )}
                                        defaultSorted={defaultSorting}
                                        filter={filterFactory()}
                                      />
                                      <Col className="pagination pagination-rounded justify-content-end mb-2">
                                        <PaginationListStandalone
                                          {...paginationProps}
                                        />
                                      </Col>
                                      <Modal
                                        isOpen={modal}
                                        className={this.props.className}
                                        size={"xl"}
                                      >
                                        <ModalHeader
                                          toggle={this.toggle}
                                          tag="h4"
                                        >
                                          {!!isEdit ? t("Room Details") : ""}
                                        </ModalHeader>

                                        <ModalBody>
                                          <Row>
                                            <Col lg="5">
                                              <BootstrapTable
                                                keyField="Id"
                                                {...toolkitprops.baseProps}
                                                {...paginationTableProps}
                                                data={examsAttendance}
                                                columns={columns2}
                                                cellEdit={cellEditFactory({
                                                  mode: "click",
                                                  blurToSave: true,
                                                  afterSaveCell: (
                                                    oldValue,
                                                    newValue,
                                                    row,
                                                    column
                                                  ) => {
                                                    this.handleExamAttendanceDataChange(
                                                      row.Id,
                                                      column.dataField,
                                                      newValue
                                                    );
                                                  },
                                                })}
                                                noDataIndication={this.props.t(
                                                  "No Exam Attendance  found"
                                                )}
                                                defaultSorted={defaultSorting}
                                                filter={filterFactory()}
                                              />
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg="12">
                                              <BootstrapTable
                                                keyField="Id"
                                                {...toolkitprops.baseProps}
                                                {...paginationTableProps}
                                                data={examsAttendance}
                                                columns={columns3}
                                                cellEdit={cellEditFactory({
                                                  mode: "click",
                                                  blurToSave: true,
                                                  afterSaveCell: (
                                                    oldValue,
                                                    newValue,
                                                    row,
                                                    column
                                                  ) => {
                                                    this.handleExamAttendanceDataChange(
                                                      row.Id,
                                                      column.dataField,
                                                      newValue
                                                    );
                                                  },
                                                })}
                                                noDataIndication={this.props.t(
                                                  "No Exam Attendance found"
                                                )}
                                                defaultSorted={defaultSorting}
                                                filter={filterFactory()}
                                              />
                                            </Col>
                                          </Row>
                                        </ModalBody>
                                      </Modal>
                                      <Modal
                                        isOpen={modal1}
                                        className={this.props.className}
                                        size={"xl"}
                                      >
                                        <ModalHeader
                                          toggle={this.toggle1}
                                          tag="h4"
                                        >
                                          {!!isPrint ? t("Print") : ""}
                                        </ModalHeader>

                                        <ModalBody>
                                          <Row>
                                            <Col lg="5">
                                              <BootstrapTable
                                                keyField="Id"
                                                {...toolkitprops.baseProps}
                                                {...paginationTableProps}
                                                data={examsAttendance}
                                                columns={columns2}
                                                cellEdit={cellEditFactory({
                                                  mode: "click",
                                                  blurToSave: true,
                                                  afterSaveCell: (
                                                    oldValue,
                                                    newValue,
                                                    row,
                                                    column
                                                  ) => {
                                                    this.handleExamAttendanceDataChange(
                                                      row.Id,
                                                      column.dataField,
                                                      newValue
                                                    );
                                                  },
                                                })}
                                                noDataIndication={this.props.t(
                                                  "No Exam Attendance found"
                                                )}
                                                defaultSorted={defaultSorting}
                                                filter={filterFactory()}
                                              />
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg="12">
                                              <BootstrapTable
                                                keyField="Id"
                                                {...toolkitprops.baseProps}
                                                {...paginationTableProps}
                                                data={examsAttendance}
                                                columns={columns3}
                                                cellEdit={cellEditFactory({
                                                  mode: "click",
                                                  blurToSave: true,
                                                  afterSaveCell: (
                                                    oldValue,
                                                    newValue,
                                                    row,
                                                    column
                                                  ) => {
                                                    this.handleExamAttendanceDataChange(
                                                      row.Id,
                                                      column.dataField,
                                                      newValue
                                                    );
                                                  },
                                                })}
                                                noDataIndication={this.props.t(
                                                  "No Exam Attendance found"
                                                )}
                                                defaultSorted={defaultSorting}
                                                filter={filterFactory()}
                                              />
                                            </Col>
                                          </Row>
                                        </ModalBody>
                                      </Modal>
                                    </React.Fragment>
                                  )}
                                </ToolkitProvider>
                              )}
                            </PaginationProvider>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
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
  examsAttendance,
  menu_items,
  years,
  employees,
  sectors,
  examAttendanceGrades,
  classScheduling,
  academyBuildingStructures,
}) => ({
  examsAttendance: examsAttendance.examsAttendance,
  coursesOffering: classScheduling.coursesOffering,
  attendStatus: examsAttendance.attendStatus,
  examsNames: examsAttendance.examsNames,
  examsPeriods: examsAttendance.examsPeriods,
  sectors: sectors.sectors,
  halls: academyBuildingStructures.halls,
  employeesNames: employees.employeesNames,
  //   filteredExamAttendanceGrades:
  //     examAttendanceGrades.filteredExamAttendanceGrades,
  years: years.years,
  deleted: examsAttendance.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetExamsAttendance: examAttendance =>
    dispatch(getExamsAttendance(examAttendance)),
  onGetExamsNames: () => dispatch(getExamsNames()),
  onAddNewExamAttendance: examAttendance =>
    dispatch(addNewExamAttendance(examAttendance)),
  onUpdateExamAttendance: examAttendance =>
    dispatch(updateExamAttendance(examAttendance)),
  onDeleteExamAttendance: examAttendance =>
    dispatch(deleteExamAttendance(examAttendance)),
  onGetExamAttendanceDeletedValue: () =>
    dispatch(getExamAttendanceDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(ExamsAttendance)));
