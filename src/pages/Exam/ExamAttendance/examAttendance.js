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
} from "store/examAttendance/actions";
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
      academicCodeError: false,
      isEdit: false,
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
      examsAttendance,
      examAttendanceTypes,
      deleted,
      user_menu,
      userTypesOpt,
      sectors,
      years,
      filteredExamAttendanceGrades,
      filteredMembers,
      onGetUsers,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (examsAttendance && !examsAttendance.length) {
      // onGetUsers();
    }
    this.props.onGetExamsAttendance();
    this.setState({
      examsAttendance,
      examAttendanceTypes,
      deleted,
      userTypesOpt,
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

  handleSelectExamAttendanceType = (rowId, fieldName, selectedValue) => {
    this.setState({
      selectedCertLevel: selectedValue,
    });
    const { onUpdateExamAttendance } = this.props;
    let onUpdate = { Id: rowId, [fieldName]: selectedValue };
    onUpdateExamAttendance(onUpdate);
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

  /*   handleSelectChange = (rowId, fieldName, selectedValue) => {
    const { onUpdateExamAttendance } = this.props;
    let onUpdate = { Id: rowId, [fieldName]: selectedValue };
    onUpdateExamAttendance(onUpdate);
  }; */

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  // handleSelectChange = (fieldName, selectedValue) => {
  //   if (fieldName === "trainerId") {
  //     this.setState({
  //       selectedMember: selectedValue,
  //     });
  //   } else if (fieldName == "userTypeId") {
  //     console.log("selected value", selectedValue);

  //     const { onGetExamsAttendance } = this.props;
  //     onGetExamsAttendance({ userTypeId: selectedValue });
  //     this.setState({
  //       selectedUserType: selectedValue,
  //     });
  //   } else if (fieldName == "trainerGradeId") {
  //     this.setState({
  //       selectedMemberGrade: selectedValue,
  //     });
  //   } else if (fieldName == "examAttendanceTypeId") {
  //     this.setState({
  //       selectedExamAttendanceType: selectedValue,
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
    values["userTypeId"] = selectedUserType;
    values["examAttendanceTypeId"] = selectedExamAttendanceType;
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

  handleSearch = () => {
    const { exam, period, course, room, observer } = this.state;
    const { examsAttendance } = this.props;

    const filtered = examsAttendance.filter(row => {
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

  render() {
    const { filteredData } = this.state;
    const { SearchBar } = Search;
    const {
      examsAttendance,
      user_menu,
      deleted,
      userTypesOpt,
      years,
      sectors,
      examAttendanceTypes,
      filteredExamAttendanceGrades,
      filteredMembers,
      t,
    } = this.props;
    const {
      modal,
      examAttendance,
      isEdit,
      academicCodeError,
      sectorsArray,
      QRModal,
      qr,
      sidebarOpen,
      selectedUserType,
    } = this.state;

    const alertMessage =
      deleted == 0 ? "Can't Delete " : "Deleted Successfully";
    const {
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
        text: this.props.t("Sector"),
        sort: true,
        editable: false,
        formatter: (cellContent, row) => {
          if (row.sector && Array.isArray(row.sector)) {
            return row.sector.map(item => item.label).join(", ");
          }
          return "";
        },
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          //  hidden: !showSearchButton,
        }),
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
        text: "Room Details",
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
                            <div className="mb-3">
                              <Row>
                                <Col lg="3">
                                  <Label className="form-label user-style">
                                    {t("Exam")}
                                    {""}:
                                  </Label>
                                </Col>
                                <Col lg="5">
                                  <Select
                                    className="select-style "
                                    name="userTypeId1"
                                    key="courseType1_select"
                                    options={userTypesOpt}
                                    onChange={newValue =>
                                      this.handleSelectChange(
                                        "userTypeId1",
                                        newValue.value
                                      )
                                    }
                                    value={userTypesOpt.find(
                                      opt => opt.label === selectedUserType
                                    )}
                                  />
                                </Col>
                              </Row>
                            </div>
                            <div className="mb-3">
                              <Row>
                                <Col lg="3">
                                  <Label className="form-label user-style">
                                    {t("Period")}
                                    {""}:
                                  </Label>
                                </Col>

                                <Col lg="5">
                                  <Select
                                    className="select-style "
                                    name="userTypeId2"
                                    key="courseType2_select"
                                    options={userTypesOpt}
                                    onChange={newValue =>
                                      this.handleSelectChange(
                                        "userTypeId2",
                                        newValue.value
                                      )
                                    }
                                    value={userTypesOpt.find(
                                      opt => opt.label === selectedUserType
                                    )}
                                  />
                                </Col>
                              </Row>
                            </div>
                            <div className="mb-3">
                              <Row>
                                <Col lg="3">
                                  <Label className="form-label user-style">
                                    {t("Course")}
                                    {""}:
                                  </Label>
                                </Col>

                                <Col lg="5">
                                  <Select
                                    className="select-style "
                                    name="userTypeId3"
                                    key="courseType3_select"
                                    options={userTypesOpt}
                                    onChange={newValue =>
                                      this.handleSelectChange(
                                        "userTypeId3",
                                        newValue.value
                                      )
                                    }
                                    value={userTypesOpt.find(
                                      opt => opt.label === selectedUserType
                                    )}
                                  />
                                </Col>
                              </Row>
                            </div>
                            <div className="mb-3">
                              <Row>
                                <Col lg="3">
                                  <Label className="form-label user-style">
                                    {t("Room")}
                                    {""}:
                                  </Label>
                                </Col>

                                <Col lg="5">
                                  <Select
                                    className="select-style "
                                    name="userTypeId4"
                                    key="courseType4_select"
                                    options={userTypesOpt}
                                    onChange={newValue =>
                                      this.handleSelectChange(
                                        "userTypeId4",
                                        newValue.value
                                      )
                                    }
                                    value={userTypesOpt.find(
                                      opt => opt.label === selectedUserType
                                    )}
                                  />
                                </Col>
                              </Row>
                            </div>
                            <div className="mb-3">
                              <Row>
                                <Col lg="3">
                                  <Label className="form-label user-style">
                                    {t("Observer")}
                                    {""}:
                                  </Label>
                                </Col>

                                <Col lg="5">
                                  <Select
                                    className="select-style "
                                    name="userTypeId5"
                                    key="courseType5_select"
                                    options={userTypesOpt}
                                    onChange={newValue =>
                                      this.handleSelectChange(
                                        "userTypeId5",
                                        newValue.value
                                      )
                                    }
                                    value={userTypesOpt.find(
                                      opt => opt.label === selectedUserType
                                    )}
                                  />
                                </Col>
                              </Row>
                            </div>
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
                                          "No ExamAttendance Types found"
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
                                      >
                                        <ModalHeader
                                          toggle={this.toggle}
                                          tag="h4"
                                        >
                                          {!!isEdit
                                            ? t("Edit ExamAttendance")
                                            : t("Add ExamAttendance")}
                                        </ModalHeader>

                                        <ModalBody>
                                          <Formik
                                            enableReinitialize={true}
                                            initialValues={{
                                              ...(isEdit && {
                                                Id: examAttendance.Id,
                                              }),
                                              academicCode:
                                                (examAttendance &&
                                                  examAttendance.academicCode) ||
                                                "01",
                                              userTypeId:
                                                (examAttendance &&
                                                  examAttendance.userTypeId) ||
                                                "",
                                              yearId:
                                                (examAttendance &&
                                                  examAttendance.yearId) ||
                                                "",
                                              trainerGradeId:
                                                (examAttendance &&
                                                  examAttendance.trainerGradeId) ||
                                                "",
                                              trainerId:
                                                (examAttendance &&
                                                  examAttendance.trainerId) ||
                                                "",
                                              sector:
                                                (examAttendance &&
                                                  examAttendance.sector) ||
                                                "",
                                            }}
                                            validationSchema={Yup.object().shape(
                                              {
                                                academicCode:
                                                  Yup.string().required(
                                                    t(
                                                      "Academic Code is required"
                                                    )
                                                  ),
                                                sector: Yup.string().required(
                                                  t("Faculty is required")
                                                ),
                                              }
                                            )}
                                          >
                                            {({
                                              errors,
                                              status,
                                              touched,
                                              values,
                                            }) => (
                                              <Form>
                                                <Row>
                                                  {emptyError && (
                                                    <Alert
                                                      color="danger"
                                                      className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                      role="alert"
                                                    >
                                                      {emptyError}
                                                      <button
                                                        type="button"
                                                        className="btn-close"
                                                        aria-label="Close"
                                                        onClick={
                                                          this.handleAlertClose
                                                        }
                                                      ></button>
                                                    </Alert>
                                                  )}
                                                  <Col>
                                                    {/* <Row className="mb-3">
                                                      <Col
                                                        lg="3"
                                                        className="col-padding"
                                                      >
                                                        <Label>
                                                          <strong>
                                                            {t("Name")}
                                                          </strong>
                                                          <span
                                                            className=""
                                                            style={{
                                                              color: "red",
                                                            }}
                                                          >
                                                            *
                                                          </span>
                                                        </Label>
                                                      </Col>
                                                      <Col lg="6">
                                                        <Select
                                                          name="trainerId"
                                                          key={`select_fromSemester`}
                                                          options={
                                                            filteredMembers
                                                          }
                                                          onChange={newValue => {
                                                            this.handleSelectChange(
                                                              "trainerId",
                                                              newValue.value
                                                            );
                                                          }}
                                                          defaultValue={filteredMembers.find(
                                                            opt =>
                                                              opt.value ===
                                                              examAttendance.trainerId
                                                          )}
                                                        />
                                                      </Col>
                                                    </Row> */}

                                                    {/* <Row className="mb-3">
                                                      <Col
                                                        lg="3"
                                                        className="col-padding"
                                                      >
                                                        <Label>
                                                          <strong>
                                                            {t(
                                                              "ExamAttendance Type"
                                                            )}
                                                          </strong>
                                                          <span
                                                            className=""
                                                            style={{
                                                              color: "red",
                                                            }}
                                                          >
                                                            *
                                                          </span>
                                                        </Label>
                                                      </Col>
                                                      <Col lg="6">
                                                        <Select
                                                          name="examAttendanceTypeId"
                                                          key={`select_fromSemester`}
                                                          options={
                                                            examAttendanceTypes
                                                          }
                                                          onChange={newValue => {
                                                            this.handleSelectChange(
                                                              "examAttendanceTypeId",
                                                              newValue.value
                                                            );
                                                          }}
                                                          defaultValue={examAttendanceTypes.find(
                                                            opt =>
                                                              opt.value ===
                                                              examAttendance.examAttendanceTypeId
                                                          )}
                                                        />
                                                      </Col>
                                                    </Row> */}

                                                    {/* <Row>
                                                      <Col lg="6">
                                                        <label
                                                          htmlFor="exampleDataList"
                                                          className="form-label"
                                                        >
                                                          <strong>
                                                            {t("Academic Code")}
                                                          </strong>
                                                          <span
                                                            className=""
                                                            style={{
                                                              color: "red",
                                                            }}
                                                          >
                                                            *
                                                          </span>
                                                        </label>
                                                      </Col>

                                                      <Col lg="6">
                                                        <label
                                                          htmlFor="exampleDataList"
                                                          className="form-label"
                                                        >
                                                          <strong>
                                                            {t("Grade")}
                                                          </strong>
                                                          <span
                                                            className=""
                                                            style={{
                                                              color: "red",
                                                            }}
                                                          >
                                                            *
                                                          </span>
                                                        </label>
                                                      </Col>
                                                    </Row>

                                                    <Row className="mb-3">
                                                      <Col sm="6">
                                                        {" "}
                                                        <Field
                                                          name="academicCode"
                                                          type="text"
                                                          className={
                                                            "form-control" +
                                                            ((errors.academicCode &&
                                                              touched.academicCode) ||
                                                            academicCodeError
                                                              ? " is-invalid"
                                                              : "")
                                                          }
                                                        />
                                                        {academicCodeError && (
                                                          <div className="invalid-feedback">
                                                            {t(
                                                              "Academic Code is required"
                                                            )}
                                                          </div>
                                                        )}
                                                        <ErrorMessage
                                                          name="academicCode"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </Col>

                                                      <Col sm="6">
                                                        <Select
                                                          name="trainerGradeId"
                                                          key={`select_endSemester`}
                                                          options={
                                                            filteredExamAttendanceGrades
                                                          }
                                                          onChange={newValue => {
                                                            this.handleSelectChange(
                                                              "trainerGradeId",
                                                              newValue.value
                                                            );
                                                          }}
                                                          defaultValue={filteredExamAttendanceGrades.find(
                                                            opt =>
                                                              opt.value ===
                                                              examAttendance.trainerGradeId
                                                          )}
                                                        />
                                                      </Col>
                                                    </Row> */}

                                                    {/* <Row>
                                                      <Col lg="6">
                                                        <label
                                                          htmlFor="exampleDataList"
                                                          className="form-label"
                                                        >
                                                          <strong>
                                                            {t("Sector")}
                                                          </strong>
                                                          <span
                                                            className=""
                                                            style={{
                                                              color: "red",
                                                            }}
                                                          >
                                                            *
                                                          </span>
                                                        </label>
                                                      </Col>

                                                      <Col lg="6">
                                                        <label
                                                          htmlFor="exampleDataList"
                                                          className="form-label"
                                                        >
                                                          <strong>
                                                            {t("Year")}
                                                          </strong>
                                                          <span
                                                            className=""
                                                            style={{
                                                              color: "red",
                                                            }}
                                                          >
                                                            *
                                                          </span>
                                                        </label>
                                                      </Col>
                                                    </Row>

                                                    <Row className="mb-3">
                                                      <Col sm="6">
                                                        {" "}
                                                        <Select
                                                          name="sector"
                                                          key={`select_fromSemester`}
                                                          options={sectors}
                                                          onChange={selectedOption =>
                                                            this.handleMulti(
                                                              "sector",
                                                              selectedOption
                                                            )
                                                          }
                                                          value={sectorsArray}
                                                          isMulti={true}
                                                        />
                                                      </Col>

                                                      <Col sm="6">
                                                        <Select
                                                          name="yearId"
                                                          key={`select_endSemester`}
                                                          options={years}
                                                          onChange={newValue => {
                                                            this.handleSelectChange(
                                                              "yearId",
                                                              newValue.value
                                                            );
                                                          }}
                                                          defaultValue={years.find(
                                                            opt =>
                                                              opt.value ===
                                                              examAttendance.yearId
                                                          )}
                                                        />
                                                      </Col>
                                                    </Row> */}
                                                  </Col>
                                                </Row>
                                                {/* <Row>
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
                                                        {t("Save")}
                                                      </Link>
                                                    </div>
                                                  </Col>
                                                </Row> */}
                                              </Form>
                                            )}
                                          </Formik>
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
                                                  {examAttendance.trainerName}
                                                </h4>
                                                <h6 className="text-primary">
                                                  {
                                                    examAttendance.examAttendanceNum
                                                  }
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
                                                        examAttendance.trainerName +
                                                        examAttendance.examAttendanceNum
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
  examsAttendance,
  menu_items,
  years,
  userTypes,
  examAttendanceTypes,
  sectors,
  examAttendanceGrades,
  trainingMembers,
}) => ({
  examsAttendance: examsAttendance.examsAttendance,
  userTypesOpt: userTypes.userTypesOpt,
  sectors: sectors.sectors,
  filteredMembers: trainingMembers.filteredMembers,
  //   filteredExamAttendanceGrades:
  //     examAttendanceGrades.filteredExamAttendanceGrades,
  years: years.years,
  deleted: examsAttendance.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetExamsAttendance: examAttendance =>
    dispatch(getExamsAttendance(examAttendance)),
  onGetUsers: () => dispatch(getUserTypesOpt()),
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
