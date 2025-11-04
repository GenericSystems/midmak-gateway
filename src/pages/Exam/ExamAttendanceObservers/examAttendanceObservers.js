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
  getExamAttendanceObservers,
  addNewExamAttendanceObserver,
  updateExamAttendanceObserver,
  deleteExamAttendanceObserver,
  getExamAttendanceObserverDeletedValue,
} from "store/examAttendanceObservers/actions";
// import { getAttendStatus } from "store/examAttendance/actions";
import { getUserTypesOpt } from "store/user-types/actions";

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

class ExamAttendanceObservers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attendanceObservers: [],
      attendanceObserver: "",
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
      isEdit1: false,
      sectorsArray: [],
      QRModal: false,
      qr: "",
      sidebarOpen: true,
      selectedUserType: null,
      selectedAttendStatus: null,
      selectedExamTime: null,
      selectedObserver: null,
      selectedAltObserver: null,
      selectedAltObserverId: null,
      selectedObserverId: null,
      selectedResponsibility: null,
      selectedAttendType: null,
    };
  }

  /*  initializeState() {
    const {selectedUserType} = this.state
    console.log("selectedUserType in initail state", selectedUserType)
    this.setState({selectedUserType :selectedUserType})
  } */

  componentDidMount() {
    const {
      examsAttendance,
      attendanceObservers,
      deleted,
      user_menu,
      userTypesOpt,
      years,
      attendStatus,
      examsNames,
      coursesOffering,
      employeesNames,
      halls,
      examsPeriods,
      onGetUsers,
      onGetAttendStatus,
      onGetExamAttendanceObservers,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (examsAttendance && !examsAttendance.length) {
      onGetExamsNames();
    }
    onGetExamAttendanceObservers();
    // onGetAttendStatus();
    this.setState({
      attendStatus,
      attendanceObservers,
      deleted,
      userTypesOpt,
      // filteredExamAttendanceObserverGrades,
      // filteredMembers,
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
    /*     const {selectedUserType} = this.state
    if (
      (selectedUserType &&
        selectedUserType !==
          prevProps.selectedUserType) 
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
      attendanceObserver: "",
      isEdit: false,
    });
    this.toggle();
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null, emptyError: null });
  };

  handleDeleteRow = () => {
    const { onDeleteExamAttendanceObserver } = this.props;
    const { selectedRowId } = this.state;
    if (selectedRowId !== null) {
      onDeleteExamAttendanceObserver({ Id: selectedRowId });

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  handleSuccessClose = () => {
    const { onGetExamAttendanceObserverDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetExamAttendanceObserverDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetExamAttendanceObserverDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetExamAttendanceObserverDeletedValue();
  };

  /*   handleSelectChange = (rowId, fieldName, selectedValue) => {
    const { onUpdateExamAttendanceObserver } = this.props;
    let onUpdate = { Id: rowId, [fieldName]: selectedValue };
    onUpdateExamAttendanceObserver(onUpdate);
  }; */

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

  // handleSelectChange = (fieldName, selectedValue) => {
  //   if (fieldName === "trainerId") {
  //     this.setState({
  //       selectedMember: selectedValue,
  //     });
  //   } else if (fieldName == "userTypeId") {
  //     console.log("selected value", selectedValue);

  //     const { onGetExamAttendanceObservers } = this.props;
  //     onGetExamAttendanceObservers({ userTypeId: selectedValue });
  //     this.setState({
  //       selectedUserType: selectedValue,
  //     });
  //   } else if (fieldName == "trainerGradeId") {
  //     this.setState({
  //       selectedMemberGrade: selectedValue,
  //     });
  //   } else if (fieldName == "attendanceObserverTypeId") {
  //     this.setState({
  //       selectedExamAttendanceObserverType: selectedValue,
  //     });
  //   } else if (fieldName == "yearId") {
  //     this.setState({
  //       selectedYear: selectedValue,
  //     });
  //   }
  // };

  handleMulti = (fieldName, selectedMulti) => {
    if (fieldName === "sector") {
      this.setState({ sectorsArray: selectedMulti });
    }
  };

  handleSave = values => {
    const {
      isEdit,
      selectedUserType,
      selectedMember,
      selectedMemberGrade,
      attendanceObserver,

      selectedAttendStatus,
    } = this.state;
    const {
      onAddNewExamAttendanceObserver,
      onUpdateExamAttendanceObserver,
      attendanceObservers,
    } = this.props;

    values["attendStatusId"] = selectedAttendStatus;
    console.log("vvvvvvvvvvvvvvvval", values);
    if (selectedAttendStatus !== null) {
      let attendInfo = {};
      attendInfo["attendStatusId"] = selectedAttendStatus;
      if (isEdit) {
        // onUpdateExamAttendanceObserver(attendInfo);
      } else {
        // onAddNewExamAttendanceObserver(attendInfo);
      }
      console.log("attendInfo", attendInfo);
      this.setState({
        selectedAcademicExamAttendanceObserver: null,
        errorMessages: {},
      });
      this.toggle();
    } else {
      let emptyError = "";
      if (selectedAttendStatus === undefined) {
        emptyError = "Fill the empty select";
      }

      this.setState({ emptyError: emptyError });
    }
  };
  handleSubmit = values => {
    const {
      isEdit,
      selectedUserType,
      selectedMember,
      selectedExamAttendanceObserverType,
      selectedMemberGrade,
      selectedSector,
      selectedYear,
      attendanceObserver,
      sectorsArray,
    } = this.state;
    const {
      onAddNewExamAttendanceObserver,
      onUpdateExamAttendanceObserver,
      attendanceObservers,
    } = this.props;
    console.log("values", values);

    values["yearId"] = selectedYear;
    values["trainerId"] = selectedMember;
    values["userTypeId"] = selectedUserType;
    values["attendanceObserverTypeId"] = selectedExamAttendanceObserverType;
    values["trainerGradeId"] = selectedMemberGrade;
    values["sector"] = sectorsArray;

    console.log("selectedUserType0", selectedUserType);

    if (values.academicCode === "") {
      this.setState({ academicCodeError: true });
    } else {
      this.setState({ academicCodeError: false });
    }

    if (
      values.academicCode &&
      selectedUserType !== null &&
      selectedMember !== null &&
      selectedYear !== null &&
      selectedExamAttendanceObserverType !== null &&
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
        onUpdateExamAttendanceObserver(sectionInfo);
      } else {
        onAddNewExamAttendanceObserver(sectionInfo);
      }
      this.setState({
        selectedAcademicExamAttendanceObserver: null,
        errorMessages: {},
      });
      this.toggle();
    } else {
      let emptyError = "";
      console.log("selectedUserType", selectedUserType);
      if (selectedUserType === undefined) {
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
      if (selectedExamAttendanceObserverType === undefined) {
        emptyError = "Fill the empty select";
      }
      this.setState({ emptyError: emptyError });
    }
  };

  handleAttendanceObserverEdit = arg => {
    console.log("arg", arg);

    this.setState({
      attendanceObserver: arg,
      isEdit: true,
      selectedAttendStatus: arg.attendStatusId,
    });

    this.toggle();
  };

  toggleSidebar = () => {
    this.setState(prevState => ({
      sidebarOpen: !prevState.sidebarOpen,
    }));
  };

  handleSearch = () => {
    const { exam, period, course, room, observer } = this.state;
    const { attendanceObservers } = this.props;

    const filtered = attendanceObservers.filter(row => {
      return (
        (!exam || row.exam === exam) &&
        (!period || row.period === period) &&
        (!course || row.course === course) &&
        (!room || row.room === room) &&
        (!observer || row.observer === observer)
      );
    });

    this.setState({ filteredData: filtered });
  };

  handleSelect = (rowId, fieldName, selectedValue) => {
    console.log("selectedValue", selectedValue);
    if (fieldName === "attendStatusId") {
      this.setState({
        selectedAttendStatus: selectedValue,
      });
    }
  };

  handleObserverEdit = arg => {
    const { attendanceObserver } = this.state;
    console.log("arg", arg);

    this.setState({
      attendanceObserver: arg,
      isEdit1: true,
    });

    this.toggle1();
  };

  handleObserverSelect = (event, fieldName, setFieldValue, values) => {
    const { observers } = this.props;
    const selectedValue = event.target.value;
    console.log("selectedValue", selectedValue);

    this.setState({
      attendanceObserver: values,
    });

    const observerObject = observers.find(
      observer => observer.value === event.target.value
    );
    console.log(observerObject, "ollllllll");
    setFieldValue("observerId", selectedValue);

    if (diplomaObject) {
      this.setState({
        selectedObserverId: observers.key,
        selectedObserver: selectedValue,
        attendanceObserver: values,
      });
    }
  };

  handleAltObserverSelect = (event, fieldName, setFieldValue, values) => {
    const { observers } = this.props;
    const selectedValue = event.target.value;
    console.log("selectedValue", selectedValue);

    this.setState({
      attendanceObserver: values,
    });

    const altObserverObject = observers.find(
      observer => observer.value === event.target.value
    );
    console.log(altObserverObject, "altObserverObjectaltObserverObject");
    setFieldValue("altObserverId", selectedValue);

    if (diplomaObject) {
      this.setState({
        selectedAltObserverId: observers.key,
        selectedAltObserver: selectedValue,
        attendanceObserver: values,
      });
    }
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

  render() {
    const { filteredData } = this.state;
    const { SearchBar } = Search;
    const {
      attendanceObservers,
      user_menu,
      deleted,
      examsNames,
      coursesOffering,
      employeesNames,
      halls,
      examsPeriods,
      filteredMembers,
      t,
      attendStatus,
    } = this.props;
    const {
      modal,
      modal1,
      attendanceObserver,
      isEdit,
      isEdit1,
      academicCodeError,
      sectorsArray,
      QRModal,
      qr,
      sidebarOpen,
      selectedUserType,
      selectedAttendStatus,
      duplicateError,
      errorMessage,
      emptyError,
      deleteModal,
      showAlert,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
      selectedExamTime,
      selectedResponsibility,
      filteredPeriods,
      selectedAttendType,
    } = this.state;

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
        dataField: "trainerName",
        text: this.props.t("Employee Name"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          //  hidden: !showSearchButton,
        }),
      },
      {
        dataField: "academicCode",
        text: this.props.t("Course Name"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          //  hidden: !showSearchButton,
        }),
      },

      {
        dataField: "attendanceObserverType",
        text: this.props.t("Exam Date"),
        sort: true,

        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          //  hidden: !showSearchButton,
        }),
      },
      {
        dataField: "userType",
        text: this.props.t("Exam Period"),
        sort: true,

        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          //  hidden: !showSearchButton,
        }),
      },

      {
        dataField: "trainerGrade",
        text: this.props.t("Room"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          //  hidden: !showSearchButton,
        }),
      },
      {
        dataField: "Room",
        text: this.props.t("Responsibility"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          //  hidden: !showSearchButton,
        }),
      },
      {
        dataField: "attendStatusId",
        text: this.props.t("Attend Status"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
        // formatter: (cell, row) => (
        //   <Select
        //     key={`hide_reason_select_${row.Id}`}
        //     options={attendStatus}
        //     value={attendStatus.find(opt => opt.value === row.attendStatusId)}
        //     onChange={selectedValue =>
        //       this.handleSelect(row.Id, "attendStatusId ", selectedValue)
        //     }
        //   />
        // ),
      },
      {
        dataField: "attendanceObserverYear",
        text: this.props.t("Notes"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          //  hidden: !showSearchButton,
        }),
      },

      {
        dataField: "action",
        text: "",
        //   hidden: !showDeleteButton,
        isDummyField: true,
        editable: false, // Set the "Action" column to not editable
        formatter: (cellContent, attendanceObserver) => (
          <div className="d-flex gap-3">
            <Tooltip title={this.props.t("Attend Status Edit")} placement="top">
              <Link className="text-secondary" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edit"
                  onClick={() =>
                    this.handleAttendanceObserverEdit(attendanceObserver)
                  }
                ></i>
              </Link>
            </Tooltip>
            <Tooltip title={this.props.t("Observer Edit")} placement="top">
              <Link className="text-secondary" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edit"
                  onClick={() => this.handleObserverEdit(attendanceObserver)}
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
        dataField: "attendanceObserverType",
        text: this.props.t("Trainees Count"),
        sort: true,

        editable: false,
      },
      {
        dataField: "delete",
        text: "Room Details",
        //   hidden: !showDeleteButton,
        isDummyField: true,
        editable: false, // Set the "Action" column to not editable
        formatter: (cellContent, attendanceObserver) => (
          <div className="d-flex gap-3">
            <Tooltip title={this.props.t("Print")} placement="top">
              <Link className="text-secondary" to="#">
                <i
                  className="fas fa-print"
                  id="printtooltip"
                  onClick={() => this.handlePrint(attendanceObserver)}
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
        dataField: "attendanceObserverType",
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
        dataField: "attendanceObserverYear",
        text: this.props.t("Notes"),
        sort: true,
        editable: true,
      },
    ];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: attendanceObservers.length,
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
            <Breadcrumbs
              breadcrumbItem={this.props.t("ExamAttendanceObservers")}
            />

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
                                      value={
                                        this.state.selectedPeriodValue || ""
                                      }
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
                              data={attendanceObservers}
                            >
                              {({ paginationProps, paginationTableProps }) => (
                                <ToolkitProvider
                                  keyField="Id"
                                  data={attendanceObservers}
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
                                          {selectedUserType && (
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
                                          )}
                                        </Col>
                                      </Row>
                                      <div>
                                        <BootstrapTable
                                          keyField="Id"
                                          {...toolkitprops.baseProps}
                                          {...paginationTableProps}
                                          data={attendanceObservers}
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
                                              this.handleExamAttendanceObserverDataChange(
                                                row.Id,
                                                column.dataField,
                                                newValue
                                              );
                                            },
                                          })}
                                          noDataIndication={this.props.t(
                                            "No ExamAttendanceObserver Types found"
                                          )}
                                          defaultSorted={defaultSorting}
                                          filter={filterFactory()}
                                        />
                                        <div className="d-flex justify-content-center mt-3">
                                          <button
                                            className="btn"
                                            onClick={() => window.print()}
                                          >
                                            <i className="fas fa-print"></i>
                                          </button>
                                        </div>
                                      </div>
                                      <Col className="pagination pagination-rounded justify-content-end mb-2">
                                        <PaginationListStandalone
                                          {...paginationProps}
                                        />
                                      </Col>
                                      <Modal
                                        isOpen={modal}
                                        className={this.props.className}
                                        size={"lg"}
                                      >
                                        <ModalHeader
                                          toggle={this.toggle}
                                          tag="h4"
                                        >
                                          {!!isEdit
                                            ? t("Attend Status Edit")
                                            : ""}
                                        </ModalHeader>

                                        <ModalBody>
                                          <Formik
                                            enableReinitialize={true}
                                            initialValues={{
                                              ...(isEdit && {
                                                Id: attendanceObserver.Id,
                                              }),
                                              attendStatusId:
                                                (attendanceObserver &&
                                                  attendanceObserver.attendStatusId) ||
                                                "",
                                              notes:
                                                (attendanceObserver &&
                                                  attendanceObserver.notes) ||
                                                "",
                                            }}
                                            validationSchema={Yup.object().shape(
                                              {
                                                // attendStatusId: Yup.string()
                                                //   .required(
                                                //     "Please Enter Your First Name"
                                                //   ),
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
                                                <Card>
                                                  <CardBody>
                                                    <Row>
                                                      <div className="mb-3">
                                                        <Row>
                                                          <Col className="col-4">
                                                            <Label className="form-label user-style">
                                                              {t(
                                                                "Attend Status"
                                                              )}
                                                              {""}:
                                                            </Label>
                                                          </Col>

                                                          <Col className="col-8">
                                                            <Select
                                                              className={
                                                                "form-control"
                                                              }
                                                              name="attendStatusId"
                                                              key="attendStatus_select"
                                                              options={
                                                                attendStatus
                                                              }
                                                              onChange={newValue =>
                                                                this.handleSelect(
                                                                  "attendStatusId",
                                                                  newValue.value
                                                                )
                                                              }
                                                              value={attendStatus.find(
                                                                opt =>
                                                                  opt.label ===
                                                                  selectedAttendStatus
                                                              )}
                                                            />
                                                          </Col>
                                                        </Row>
                                                      </div>
                                                    </Row>
                                                    <Row>
                                                      <div className="md-3">
                                                        <Row>
                                                          <Col className="col-4">
                                                            <Label for="note">
                                                              {this.props.t(
                                                                "Notes"
                                                              )}{" "}
                                                              {""}:
                                                            </Label>
                                                          </Col>
                                                          <Col className="col-8">
                                                            <Field
                                                              type="textarea"
                                                              name="GeneralNote"
                                                              as="textarea"
                                                              id="note"
                                                              className={
                                                                "form-control"
                                                              }
                                                            />
                                                          </Col>
                                                        </Row>
                                                      </div>
                                                    </Row>
                                                  </CardBody>
                                                </Card>

                                                <Row>
                                                  <Col>
                                                    <div className="text-center">
                                                      <button
                                                        type="button"
                                                        className="btn btn-primary me-2"
                                                        onClick={() => {
                                                          this.handleSave(
                                                            values
                                                          );
                                                        }}
                                                      >
                                                        {t("Save")}
                                                      </button>
                                                    </div>
                                                  </Col>
                                                </Row>
                                              </Form>
                                            )}
                                          </Formik>
                                        </ModalBody>
                                      </Modal>
                                      <Modal
                                        isOpen={modal1}
                                        className={this.props.className}
                                        size="xl"
                                      >
                                        <ModalHeader
                                          toggle={this.toggle1}
                                          tag="h4"
                                        >
                                          {!!isEdit1
                                            ? t("Exam Alternative")
                                            : ""}
                                        </ModalHeader>

                                        <ModalBody>
                                          <Formik
                                            enableReinitialize={true}
                                            initialValues={{
                                              ...(isEdit1 && {
                                                Id: attendanceObserver.Id,
                                              }),
                                              examTimeId:
                                                (attendanceObserver &&
                                                  attendanceObserver.examTimeId) ||
                                                "",
                                              observerId:
                                                (attendanceObserver &&
                                                  attendanceObserver.observerId) ||
                                                "",
                                              responsibilityId:
                                                (attendanceObserver &&
                                                  attendanceObserver.responsibilityId) ||
                                                "",
                                              attendTypeId:
                                                (attendanceObserver &&
                                                  attendanceObserver.attendTypeId) ||
                                                "",
                                              altObserverId:
                                                (attendanceObserver &&
                                                  attendanceObserver.altObserverId) ||
                                                "",
                                              notesObs:
                                                (attendanceObserver &&
                                                  attendanceObserver.notesObs) ||
                                                "",
                                            }}
                                            validationSchema={Yup.object().shape(
                                              {
                                                // attendStatusId: Yup.string()
                                                //   .required(
                                                //     "Please Enter Your First Name"
                                                //   ),
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
                                                <Card id="employee-card mt-8">
                                                  <CardBody className="cardBody">
                                                    <Row>
                                                      <div className="mb-3">
                                                        <Row>
                                                          <Col className="col-4">
                                                            <Label className="form-label user-style">
                                                              {t("Exam Time")}
                                                              {""}:
                                                            </Label>
                                                          </Col>

                                                          <Col className="col-8">
                                                            <Select
                                                              className={
                                                                "form-control"
                                                              }
                                                              name="examTimeId"
                                                              key="examTime_select"
                                                              options={
                                                                attendStatus
                                                              }
                                                              onChange={newValue =>
                                                                this.handleSelect(
                                                                  "examTimeId",
                                                                  newValue.value
                                                                )
                                                              }
                                                              value={attendStatus.find(
                                                                opt =>
                                                                  opt.label ===
                                                                  selectedExamTime
                                                              )}
                                                            />
                                                          </Col>
                                                        </Row>
                                                      </div>
                                                    </Row>
                                                    <Row>
                                                      <div className="mb-3">
                                                        <Row>
                                                          <Col className="col-4">
                                                            <Label for="observer-id">
                                                              {this.props.t(
                                                                "Observer"
                                                              )}
                                                            </Label>
                                                          </Col>
                                                          <Col className="col-8">
                                                            <Field
                                                              type="text"
                                                              name="observerId"
                                                              id="observer-Id"
                                                              list="observerDatalistOptions"
                                                              placeholder="Type to search..."
                                                              autoComplete="off"
                                                              // onChange={event =>
                                                              //   this.handleObserverSelect(
                                                              //     event,
                                                              //     "observerId",
                                                              //     setFieldValue,
                                                              //     values
                                                              //   )
                                                              // }
                                                              className={
                                                                "form-control"
                                                              }
                                                            />
                                                            {/* <datalist id="observerDatalistOptions">
                                                              {observers.map(
                                                                observer => (
                                                                  <option
                                                                    key={
                                                                      observer.key
                                                                    }
                                                                    value={
                                                                      observer.value
                                                                    }
                                                                  />
                                                                )
                                                              )}
                                                            </datalist> */}
                                                          </Col>
                                                        </Row>
                                                      </div>
                                                    </Row>
                                                    <Row>
                                                      <div className="mb-3">
                                                        <Row>
                                                          <Col className="col-4">
                                                            <Label className="form-label user-style">
                                                              {t(
                                                                "Responsibility"
                                                              )}
                                                              {""}:
                                                            </Label>
                                                          </Col>

                                                          <Col className="col-8">
                                                            <Select
                                                              className={
                                                                "form-control"
                                                              }
                                                              name="responsibilityId"
                                                              key="responsibility_select"
                                                              options={
                                                                attendStatus
                                                              }
                                                              onChange={newValue =>
                                                                this.handleSelect(
                                                                  "responsibilityId",
                                                                  newValue.value
                                                                )
                                                              }
                                                              value={attendStatus.find(
                                                                opt =>
                                                                  opt.label ===
                                                                  selectedResponsibility
                                                              )}
                                                            />
                                                          </Col>
                                                        </Row>
                                                      </div>
                                                    </Row>
                                                    <Row>
                                                      <div className="mb-3">
                                                        <Row>
                                                          <Col className="col-4">
                                                            <Label className="form-label user-style">
                                                              {t("Attend Type")}
                                                              {""}:
                                                            </Label>
                                                          </Col>

                                                          <Col className="col-8">
                                                            <Select
                                                              className={
                                                                "form-control"
                                                              }
                                                              name="attendTypeId"
                                                              key="attendType_select"
                                                              options={
                                                                attendStatus
                                                              }
                                                              onChange={newValue =>
                                                                this.handleSelect(
                                                                  "attendTypeId",
                                                                  newValue.value
                                                                )
                                                              }
                                                              value={attendStatus.find(
                                                                opt =>
                                                                  opt.label ===
                                                                  selectedAttendType
                                                              )}
                                                            />
                                                          </Col>
                                                        </Row>
                                                      </div>
                                                    </Row>
                                                    <Row>
                                                      <div className="mb-3">
                                                        <Row>
                                                          <Col className="col-4">
                                                            <Label for="observer-id">
                                                              {this.props.t(
                                                                "Alt Observer"
                                                              )}
                                                            </Label>
                                                          </Col>
                                                          <Col className="col-8">
                                                            <Field
                                                              type="text"
                                                              name="observerId"
                                                              id="observer-Id"
                                                              list="observerDatalistOptions"
                                                              placeholder="Type to search..."
                                                              autoComplete="off"
                                                              onChange={event =>
                                                                this.handleObserverSelect(
                                                                  event,
                                                                  "observerId",
                                                                  setFieldValue,
                                                                  values
                                                                )
                                                              }
                                                              className={
                                                                "form-control"
                                                              }
                                                            />
                                                            {/* <datalist id="observerDatalistOptions">
                                                              {observers.map(
                                                                observer => (
                                                                  <option
                                                                    key={
                                                                      observer.key
                                                                    }
                                                                    value={
                                                                      observer.value
                                                                    }
                                                                  />
                                                                )
                                                              )}
                                                            </datalist> */}
                                                          </Col>
                                                        </Row>
                                                      </div>
                                                    </Row>
                                                    <Row>
                                                      <div className="md-3">
                                                        <Row>
                                                          <Col className="col-4">
                                                            <Label for="note">
                                                              {this.props.t(
                                                                "Notes"
                                                              )}{" "}
                                                              {""}:
                                                            </Label>
                                                          </Col>
                                                          <Col className="col-8">
                                                            <Field
                                                              type="textarea"
                                                              name="GeneralNote"
                                                              as="textarea"
                                                              id="note"
                                                              className={
                                                                "form-control"
                                                              }
                                                            />
                                                          </Col>
                                                        </Row>
                                                      </div>
                                                    </Row>
                                                  </CardBody>
                                                </Card>

                                                <Row>
                                                  <Col>
                                                    <div className="text-center">
                                                      <button
                                                        type="button"
                                                        className="btn btn-primary me-2"
                                                        onClick={() => {
                                                          this.handleSave(
                                                            values
                                                          );
                                                        }}
                                                      >
                                                        {t("Save")}
                                                      </button>
                                                    </div>
                                                  </Col>
                                                </Row>
                                              </Form>
                                            )}
                                          </Formik>
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
  attendanceObservers,
  examsAttendance,
  menu_items,
  years,
  employees,
  classScheduling,
  academyBuildingStructures,
}) => ({
  attendanceObservers: attendanceObservers.attendanceObservers,
  attendStatus: examsAttendance.attendStatus,
  coursesOffering: classScheduling.coursesOffering,
  examsNames: examsAttendance.examsNames,
  examsPeriods: examsAttendance.examsPeriods,
  halls: academyBuildingStructures.halls,
  employeesNames: employees.employeesNames,
  years: years.years,
  deleted: attendanceObservers.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetExamAttendanceObservers: () => dispatch(getExamAttendanceObservers()),
  // onGetAttendStatus: () => dispatch(getAttendStatus()),
  onGetUsers: () => dispatch(getUserTypesOpt()),
  onAddNewExamAttendanceObserver: attendanceObserver =>
    dispatch(addNewExamAttendanceObserver(attendanceObserver)),
  onUpdateExamAttendanceObserver: attendanceObserver =>
    dispatch(updateExamAttendanceObserver(attendanceObserver)),
  onDeleteExamAttendanceObserver: attendanceObserver =>
    dispatch(deleteExamAttendanceObserver(attendanceObserver)),
  onGetExamAttendanceObserverDeletedValue: () =>
    dispatch(getExamAttendanceObserverDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(ExamAttendanceObservers)));
