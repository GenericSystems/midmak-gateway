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
  getHallSchedules,
  addNewHallSchedule,
  updateHallSchedule,
  deleteHallSchedule,
  getHallScheduleDeletedValue,
} from "store/hallSchedules/actions";
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
import QRCode from "qrcode";

class HallSchedules extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hallSchedules: [],
      hallSchedule: "",
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
      selectedUserType: "",
    };
  }

  /*  initializeState() {
    const {selectedUserType} = this.state
    console.log("selectedUserType in initail state", selectedUserType)
    this.setState({selectedUserType :selectedUserType})
  } */

  componentDidMount() {
    const {
      hallSchedules,
      hallScheduleTypes,
      deleted,
      user_menu,
      userTypesOpt,
      sectors,
      years,
      attendStatus,
      filteredHallScheduleGrades,
      filteredMembers,
      onGetUsers,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (hallSchedules && !hallSchedules.length) {
      // onGetUsers();
    }
    this.props.onGetHallSchedules();
    this.setState({
      attendStatus,
      hallSchedules,
      hallScheduleTypes,
      deleted,
      userTypesOpt,
      sectors,
      filteredHallScheduleGrades,
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
      hallSchedule: "",
      isEdit: false,
    });
    this.toggle();
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null, emptyError: null });
  };

  handleDeleteRow = () => {
    const { onDeleteHallSchedule } = this.props;
    const { selectedRowId } = this.state;
    if (selectedRowId !== null) {
      onDeleteHallSchedule({ Id: selectedRowId });

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };
  handleHallScheduleDataChange = (rowId, fieldName, fieldValue) => {
    const { hallSchedules, onUpdateHallSchedule } = this.props;
    const isDuplicate = hallSchedules.some(
      hallSchedule =>
        hallSchedule.Id !== rowId &&
        hallSchedule.arTitle.trim() === fieldValue.trim()
    );

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateHallSchedule(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateHallSchedule(onUpdate);
    }
  };

  handleSuccessClose = () => {
    const { onGetHallScheduleDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetHallScheduleDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetHallScheduleDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetHallScheduleDeletedValue();
  };

  /*   handleSelectChange = (rowId, fieldName, selectedValue) => {
    const { onUpdateHallSchedule } = this.props;
    let onUpdate = { Id: rowId, [fieldName]: selectedValue };
    onUpdateHallSchedule(onUpdate);
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

  //     const { onGetHallSchedules } = this.props;
  //     onGetHallSchedules({ userTypeId: selectedValue });
  //     this.setState({
  //       selectedUserType: selectedValue,
  //     });
  //   } else if (fieldName == "trainerGradeId") {
  //     this.setState({
  //       selectedMemberGrade: selectedValue,
  //     });
  //   } else if (fieldName == "hallScheduleTypeId") {
  //     this.setState({
  //       selectedHallScheduleType: selectedValue,
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
      selectedHallScheduleType,
      selectedMemberGrade,
      selectedSector,
      selectedYear,
      hallSchedule,
      sectorsArray,
    } = this.state;
    const { onAddNewHallSchedule, onUpdateHallSchedule, hallSchedules } =
      this.props;
    console.log("values", values);

    values["yearId"] = selectedYear;
    values["trainerId"] = selectedMember;
    values["userTypeId"] = selectedUserType;
    values["hallScheduleTypeId"] = selectedHallScheduleType;
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
      selectedHallScheduleType !== null &&
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
        onUpdateHallSchedule(sectionInfo);
      } else {
        onAddNewHallSchedule(sectionInfo);
      }
      this.setState({
        selectedAcademicHallSchedule: null,
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
      if (selectedHallScheduleType === undefined) {
        emptyError = "Fill the empty select";
      }
      this.setState({ emptyError: emptyError });
    }
  };

  handleHallDetails = arg => {
    const { hallSchedule } = this.state;
    console.log("arg", arg);

    this.setState({
      hallSchedule: arg,
      isEdit: true,
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
    const { hallSchedules } = this.props;

    const filtered = hallSchedules.filter(row => {
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
    const { onUpdateHiddenGrade } = this.props;

    let onUpdate;
    if (fieldName === "attendStatusId") {
      onUpdate = {
        Id: rowId,
        [fieldName]: selectedValue.value,
      };
    }

    // onUpdateHallSchedule(onUpdate);
  };

  handlePrint = arg => {
    const { hallSchedule } = this.state;
    console.log("arg", arg);

    this.setState({
      hallSchedule: arg,
      isPrint: true,
    });

    this.toggle1();
  };

  render() {
    const { filteredData } = this.state;
    const { SearchBar } = Search;
    const {
      hallSchedules,
      user_menu,
      deleted,
      userTypesOpt,
      years,
      sectors,
      hallScheduleTypes,
      filteredHallScheduleGrades,
      filteredMembers,
      t,
      attendStatus,
    } = this.props;
    const {
      modal,
      modal1,
      hallSchedule,
      isEdit,
      isPrint,
      academicCodeError,
      sectorsArray,
      QRModal,
      qr,
      sidebarOpen,
      selectedUserType,
      duplicateError,
      errorMessage,
      emptyError,
      deleteModal,
      showAlert,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
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
        dataField: "hallScheduleType",
        text: this.props.t("Day"),
        sort: true,

        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          //  hidden: !showSearchButton,
        }),
      },
      {
        dataField: "userType",
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
        text: this.props.t("Room"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          //  hidden: !showSearchButton,
        }),
      },
      {
        dataField: "hallScheduleYear",
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
        formatter: (cellContent, hallSchedule) => (
          <div className="d-flex gap-3">
            <Tooltip title={this.props.t("Room Details")} placement="top">
              <Link className="text-secondary" to="#">
                <i
                  className="bx bx-bx bxs-report"
                  id="printtooltip"
                  onClick={() => this.handleHallDetails(hallSchedule)}
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
        dataField: "hallScheduleType",
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
        formatter: (cellContent, hallSchedule) => (
          <div className="d-flex gap-3">
            <Tooltip title={this.props.t("Print")} placement="top">
              <Link className="text-secondary" to="#">
                <i
                  className="fas fa-print"
                  id="printtooltip"
                  onClick={() => this.handlePrint(hallSchedule)}
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
        dataField: "hallScheduleType",
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
    ];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: hallSchedules.length,
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
            <Breadcrumbs breadcrumbItem={this.props.t("HallSchedules")} />

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
                                    <input
                                      type="text"
                                      list="examOptions"
                                      name="exam"
                                      placeholder="Type to search..."
                                      className="form-control"
                                      value={this.state.selectedExam || ""}
                                      onChange={e =>
                                        this.setState({
                                          selectedExam: e.target.value,
                                        })
                                      }
                                    />
                                    <datalist id="examOptions">
                                      {userTypesOpt.map(opt => (
                                        <option
                                          key={opt.value}
                                          value={opt.label}
                                        />
                                      ))}
                                    </datalist>
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
                                      name="period"
                                      placeholder="Type to search..."
                                      className="form-control"
                                      value={this.state.selectedPeriod || ""}
                                      onChange={e =>
                                        this.setState({
                                          selectedPeriod: e.target.value,
                                        })
                                      }
                                    />
                                    <datalist id="periodOptions">
                                      {userTypesOpt.map(opt => (
                                        <option
                                          key={opt.value}
                                          value={opt.label}
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
                                      value={this.state.selectedCourse || ""}
                                      onChange={e =>
                                        this.setState({
                                          selectedCourse: e.target.value,
                                        })
                                      }
                                    />
                                    <datalist id="courseOptions">
                                      {userTypesOpt.map(opt => (
                                        <option
                                          key={opt.value}
                                          value={opt.label}
                                        />
                                      ))}
                                    </datalist>
                                  </Col>
                                </Row>

                                {/* Room */}
                                <Row className="mb-3">
                                  <Col lg="4">
                                    <Label className="form-label user-style">
                                      {t("Room")}:
                                    </Label>
                                  </Col>
                                  <Col lg="8">
                                    <input
                                      type="text"
                                      list="roomOptions"
                                      name="room"
                                      placeholder="Type to search..."
                                      className="form-control"
                                      value={this.state.selectedRoom || ""}
                                      onChange={e =>
                                        this.setState({
                                          selectedRoom: e.target.value,
                                        })
                                      }
                                    />
                                    <datalist id="roomOptions">
                                      {userTypesOpt.map(opt => (
                                        <option
                                          key={opt.value}
                                          value={opt.label}
                                        />
                                      ))}
                                    </datalist>
                                  </Col>
                                </Row>

                                {/* Observer */}
                                <Row className="mb-3">
                                  <Col lg="4">
                                    <Label className="form-label user-style">
                                      {t("Observer")} {""}:
                                    </Label>
                                  </Col>
                                  <Col lg="8">
                                    <input
                                      type="text"
                                      list="observerOptions"
                                      name="observer"
                                      placeholder="Type to search..."
                                      className="form-control"
                                      value={this.state.selectedObserver || ""}
                                      onChange={e =>
                                        this.setState({
                                          selectedObserver: e.target.value,
                                        })
                                      }
                                    />
                                    <datalist id="observerOptions">
                                      {userTypesOpt.map(opt => (
                                        <option
                                          key={opt.value}
                                          value={opt.label}
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
                              data={hallSchedules}
                            >
                              {({ paginationProps, paginationTableProps }) => (
                                <ToolkitProvider
                                  keyField="Id"
                                  data={hallSchedules}
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

                                      <BootstrapTable
                                        keyField="Id"
                                        {...toolkitprops.baseProps}
                                        {...paginationTableProps}
                                        data={hallSchedules}
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
                                            this.handleHallScheduleDataChange(
                                              row.Id,
                                              column.dataField,
                                              newValue
                                            );
                                          },
                                        })}
                                        noDataIndication={this.props.t(
                                          "No HallSchedule Types found"
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
                                                data={hallSchedules}
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
                                                    this.handleHallScheduleDataChange(
                                                      row.Id,
                                                      column.dataField,
                                                      newValue
                                                    );
                                                  },
                                                })}
                                                noDataIndication={this.props.t(
                                                  "No HallSchedule Types found"
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
                                                data={hallSchedules}
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
                                                    this.handleHallScheduleDataChange(
                                                      row.Id,
                                                      column.dataField,
                                                      newValue
                                                    );
                                                  },
                                                })}
                                                noDataIndication={this.props.t(
                                                  "No HallSchedule Types found"
                                                )}
                                                defaultSorted={defaultSorting}
                                                filter={filterFactory()}
                                              />
                                            </Col>
                                          </Row>
                                        </ModalBody>
                                      </Modal>
                                      <Modal isOpen={QRModal} centered={true}>
                                        <ModalHeader
                                          toggle={this.onCloseQRModal}
                                          tag="h4"
                                        >
                                          <div className="text-center">
                                            {this.props.t("QR Code")}
                                          </div>
                                        </ModalHeader>
                                        <ModalBody className="py-3 px-5">
                                          <Row>
                                            <Col lg={12}>
                                              <div className="text-center">
                                                <h4 className="text-primary">
                                                  {hallSchedule.trainerName}
                                                </h4>
                                                <h6 className="text-primary">
                                                  {hallSchedule.hallScheduleNum}
                                                </h6>

                                                {qr && (
                                                  <img src={qr} alt="QR Code" />
                                                )}
                                              </div>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col>
                                              <div className="text-center mt-3">
                                                {qr && (
                                                  <Button
                                                    color="success"
                                                    size="lg"
                                                    className="me-2"
                                                    onClick={() => {
                                                      const link =
                                                        document.createElement(
                                                          "a"
                                                        );
                                                      link.href = qr;
                                                      link.download = `${
                                                        hallSchedule.trainerName +
                                                        hallSchedule.hallScheduleNum
                                                      }.png`;
                                                      link.click();
                                                    }}
                                                  >
                                                    {this.props.t("Download")}
                                                  </Button>
                                                )}
                                              </div>
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
                                                data={hallSchedules}
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
                                                    this.handleHallScheduleDataChange(
                                                      row.Id,
                                                      column.dataField,
                                                      newValue
                                                    );
                                                  },
                                                })}
                                                noDataIndication={this.props.t(
                                                  "No HallSchedule Types found"
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
                                                data={hallSchedules}
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
                                                    this.handleHallScheduleDataChange(
                                                      row.Id,
                                                      column.dataField,
                                                      newValue
                                                    );
                                                  },
                                                })}
                                                noDataIndication={this.props.t(
                                                  "No HallSchedule Types found"
                                                )}
                                                defaultSorted={defaultSorting}
                                                filter={filterFactory()}
                                              />
                                            </Col>
                                          </Row>
                                        </ModalBody>
                                      </Modal>
                                      <Modal isOpen={QRModal} centered={true}>
                                        <ModalHeader
                                          toggle={this.onCloseQRModal}
                                          tag="h4"
                                        >
                                          <div className="text-center">
                                            {this.props.t("QR Code")}
                                          </div>
                                        </ModalHeader>
                                        <ModalBody className="py-3 px-5">
                                          <Row>
                                            <Col lg={12}>
                                              <div className="text-center">
                                                <h4 className="text-primary">
                                                  {hallSchedule.trainerName}
                                                </h4>
                                                <h6 className="text-primary">
                                                  {hallSchedule.hallScheduleNum}
                                                </h6>

                                                {qr && (
                                                  <img src={qr} alt="QR Code" />
                                                )}
                                              </div>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col>
                                              <div className="text-center mt-3">
                                                {qr && (
                                                  <Button
                                                    color="success"
                                                    size="lg"
                                                    className="me-2"
                                                    onClick={() => {
                                                      const link =
                                                        document.createElement(
                                                          "a"
                                                        );
                                                      link.href = qr;
                                                      link.download = `${
                                                        hallSchedule.trainerName +
                                                        hallSchedule.hallScheduleNum
                                                      }.png`;
                                                      link.click();
                                                    }}
                                                  >
                                                    {this.props.t("Download")}
                                                  </Button>
                                                )}
                                              </div>
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
  hallSchedules,
  menu_items,
  years,
  userTypes,
  hallScheduleTypes,
  sectors,
  hallScheduleGrades,
  trainingMembers,
}) => ({
  hallSchedules: hallSchedules.hallSchedules,
  attendStatus: hallSchedules.attendStatus,
  userTypesOpt: userTypes.userTypesOpt,
  sectors: sectors.sectors,
  filteredMembers: trainingMembers.filteredMembers,
  //   filteredHallScheduleGrades:
  //     hallScheduleGrades.filteredHallScheduleGrades,
  years: years.years,
  deleted: hallSchedules.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetHallSchedules: () => dispatch(getHallSchedules()),
  onGetUsers: () => dispatch(getUserTypesOpt()),
  onAddNewHallSchedule: hallSchedule =>
    dispatch(addNewHallSchedule(hallSchedule)),
  onUpdateHallSchedule: hallSchedule =>
    dispatch(updateHallSchedule(hallSchedule)),
  onDeleteHallSchedule: hallSchedule =>
    dispatch(deleteHallSchedule(hallSchedule)),
  onGetHallScheduleDeletedValue: () => dispatch(getHallScheduleDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(HallSchedules)));
