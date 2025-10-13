import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import Tooltip from "@mui/material/Tooltip";
import { IconButton } from "@mui/material";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  Label,
  Alert,
  CardTitle,
  FormGroup,
  Input,
} from "reactstrap";
import Select from "react-select";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import images from "assets/images";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import {
  getTraineesDecrees,
  addNewTraineesDecree,
  updateTraineesDecree,
  deleteTraineesDecree,
  getTraineesDecreeDeletedValue,
  getFilteredCoursesPlans,
  getAcademyTraineesDecrees,
  getTraineeDecreesDismiss,
  getCoursesDecrees,
} from "store/trainee-decrees/actions";
// import { getAcademyTrainees } from "store/university-trainees/actions";
import { getDecrees, getDecreesRulesReasons } from "store/decrees/actions";

import { isEmpty, size, map } from "lodash";
import { CloseBoxMultipleIcon } from "@icons/material";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../utils/menuUtils";
class TraineesDecreesList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      errorMessages: {
        artitle: "",
        certificateNum: "",
        facultyId: "",
      },
      arTitleSaveError: false,
      academicNumberError: false,
      facultieIdError: false,
      traineesDecree: "",
      modal: false,
      addModal: false,
      deleteModal: false,
      selectedFaculty: null,
      selectedDepartment: null,
      selectedBeginSemester: null,
      selectedEndSemester: null,
      selectedTraineeId: null,
      selectedEducation: "",
      showAlert: null,
      minMaxValueError: null,
      decisionCategoryId: null,
      selectedMulti: null,
      toSemesterOptions: [],
      selectedDecreeStatus: "",
      selectedDecreeType: "",
      selectedReason: "",
      stdCoursesArray: [],
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
    };

    this.handleTraineesDecreeClick = this.handleTraineesDecreeClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleTraineesDecreeClicks =
      this.handleTraineesDecreeClicks.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.handleMulti = this.handleMulti.bind(this);
  }

  componentDidMount() {
    const {
      traineesDecrees,
      onGetTraineesDecrees,
      faculties,
      years,
      filteredDepartments,
      departments,
      deleted,
      traineeDecreesDismiss,
      decreeStatus,
      onGetDecrees,
      onGetCoursesDecrees,
      onGetDecreesRulesReason,
      traineesOpt,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (!traineesDecrees || traineesDecrees.length === 0) {
      onGetTraineesDecrees();
      onGetDecrees();
      onGetCoursesDecrees();
      onGetDecreesRulesReason();
    }
    this.setState({
      traineesDecrees,
      deleted,
      decreeStatus,
      traineeDecreesDismiss,
    });
    this.setState({ faculties });
    this.setState({ years });
    this.setState({ filteredDepartments });
    this.setState({ departments });
    this.setState({ traineesOpt });
  }
  componentDidUpdate(prevProps) {
    // if (this.props.trainees !== prevProps.trainees) {
    //   this.forceUpdate();
    // }
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

  toggle(decree) {
    const { decisionCategoryId, traineesDecree } = this.state;
    const { filteredCourses, coursesDecrees } = this.props;

    if (decree == 3 || decree == 2) {
      const filteredCoursesModified =
        coursesDecrees &&
        coursesDecrees.map(item => ({
          label: `${item.code} - ${item.courseName}`,
          value: item.Id,
        }));
    }
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  addToggle = () => {
    this.setState(prevState => ({
      addModal: !prevState.addModal,
    }));
  };

  handleTraineesDecreeClicks = () => {
    this.setState({
      traineesDecree: "",
      isEdit: false,
      selectedEducation: "",
      stdCoursesArray: [],
      decisionCategoryId: null,
    });
    this.addToggle();
  };

  // eslint-disable-next-line no-unused-vars

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

  /* Insert,Update Delete data */

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  onClickDelete = traineesDecree => {
    this.setState({ traineesDecree: traineesDecree });
    this.setState({ deleteModal: true });
  };

  handleDeleteTraineesDecree = () => {
    const { onDeleteTraineesDecree } = this.props;
    const { traineesDecree } = this.state;

    if (traineesDecree.Id !== undefined) {
      let onDelete = { Id: traineesDecree.Id };
      onDeleteTraineesDecree(onDelete);
    }
    this.setState({ deleteModal: false, showAlert: true });
  };

  handleTraineesDecreeClick = arg => {
    const {
      traineesOpt,
      decrees,
      // onGetFilteredCoursesPlan,
      coursesDecrees,
      decreeRulesReasons,
    } = this.props;
    let traineesDecree = arg;

    const decreeRulesReasonsModified = decreeRulesReasons.map(item => ({
      value: item.Id,
      label: item.arTitle,
    }));

    traineesDecree["fullName"] = traineesOpt.find(
      trainee => trainee.SID === arg["TraineeId"]
    ).fullName;
    traineesDecree["decree"] = decrees.find(
      decree => decree.Id === arg["decreeRuleId"]
    ).arTitle;
    let decreeCat = decrees.find(
      decree => decree.Id === arg["decreeRuleId"]
    ).decisionCategoryId;
    if (decreeCat == 3 || decreeCat == 2) {
      const plan = traineesOpt.find(
        trainee => trainee.fullName === traineesDecree["fullName"]
      );
      // if (plan) {
      //   onGetFilteredCoursesPlan(plan.plan);
      // }
    }

    const { onGetTraineeDecreesDismiss, onGetDecreesRulesReason } = this.props;
    onGetTraineeDecreesDismiss(traineesDecree);
    onGetDecreesRulesReason(traineesDecree.decisionRuleId);

    traineesDecree["TraineesDecreesCourses"] = arg["TraineesDecreesCourses"];

    this.setState({
      traineesDecree,
      decisionCategoryId: decreeCat,
      selectedFaculty: arg.facultyId,
      selectedEducation: arg.educationType,
      stdCoursesArray: traineesDecree["TraineesDecreesCourses"],
      selectedReason: traineesDecree["decisioneRuleReasonId"],
      selectedReasonName: traineesDecree["decreeReasonName"],
      selectedDecreeStatus: traineesDecree["decreeStateId"],
      selectedDecreeType: traineesDecree["decreeType"],
      isEdit: true,
    });

    this.toggle(decreeCat);
  };
  handleMulti = selectedMulti => {
    this.setState({ selectedMulti });
  };
  handleSuccessClose = () => {
    const { onGetTraineesDecreeDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetTraineesDecreeDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetTraineesDecreeDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetTraineesDecreeDeletedValue();
  };

  handleAlertClose = () => {
    this.setState({ minMaxValueError: null });
  };
  handleChangeDecree = option => {
    console.log("optionoptionoption", option);
    if (option && option.decisionCategoryId) {
      this.setState({ decisionCategoryId: option.decisionCategoryId });
    } else {
      this.setState({ decisionCategoryId: null });
    }
  };

  handleSave = values => {
    console.log("valuesvalues", values);
    const {
      onAddNewTraineesDecree,
      decrees,
      traineesOpt,
      onUpdateTraineesDecree,
    } = this.props;
    const { traineesDecree, isEdit } = this.state;
    const emptyDecree = {};
    console.log("valuesvalues", values);
    Object.keys(values).forEach(function (key) {
      if (
        values[key] != undefined &&
        (values[key].length > 0 || values[key] != "")
      )
        emptyDecree[key] = values[key];
    });
    emptyDecree["decree"] = undefined;
    emptyDecree["traineeName"] = undefined;

    emptyDecree["decreeRuleId"] = decrees.find(
      decree => decree.arTitle === values["decree"]
    ).Id;
    emptyDecree["TraineeNum"] = traineesOpt.find(
      trainee => trainee.fullName === values["fullName"]
    ).TraineeNum;
    emptyDecree["TraineesDecreesCourses"] = values["TraineesDecreesCourses"];

    if (isEdit == false) {
      emptyDecree["decreeStateId"] = 4;
      onAddNewTraineesDecree(emptyDecree);
      this.setState(prevState => ({
        addModal: !prevState.addModal,
      }));
    } else if (isEdit == true) {
      console.log("edit");
      emptyDecree["Id"] = traineesDecree["Id"];
      onUpdateTraineesDecree(emptyDecree);
      this.setState(prevState => ({
        modal: !prevState.modal,
      }));
    }
  };
  render() {
    //!meta title
    document.title =
      "TraineesDecree List | keyInHands - React Admin & Dashboard Template";

    // const { traineesDecrees } = this.state
    const { SearchBar } = Search;

    const {
      traineesOpt,
      traineesDecrees,
      faculties,
      years,
      filteredDepartments,
      departments,
      deleted,
      traineeDecreesDismiss,
      decrees,
      onGetDecreesRulesReason,
      decreeRulesReasons,
      // onGetFilteredCoursesPlan,
      filteredCourses,
      coursesDecrees,
      decreeStatus,
    } = this.props;
    const {
      isEdit,
      deleteModal,
      showAlert,
      arTitleSaveError,
      academicNumberError,
      facultieIdError,
      minMaxValueError,
      validationSchema,
      decisionCategoryId,
      selectedMulti,
      selectedDecreeStatus,
      selectedDecreeType,
      selectedReason,
      stdCoursesArray,
      selectedReasonName,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
      selectedTraineeId,
    } = this.state;
    const { onAddNewTraineesDecree, onUpdateTraineesDecree } = this.props;
    const traineesDecree = this.state.traineesDecree;

    console.log("decreeStatus", decrees);
    const defaultSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: traineesDecrees.length, // replace later with size(traineesDecrees),
      custom: true,
    };
    const alertMessage =
      deleted == 0
        ? this.props.t("Can't Delete")
        : this.props.t("Deleted Successfully");
    const defaultSorted = [
      {
        dataField: "Id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    const selectRow = {
      mode: "checkbox",
    };
    const yearsModified = years.map(item => ({
      value: item.key,
      label: item.value,
      yearId: item.yearId,
      semesterId: item.semesterId,
    }));

    let filteredOptions = null;
    const updateToSemesterOptions = selectedFromSemester => {
      filteredOptions = yearsModified.filter(
        option => option.value > selectedFromSemester.value
      );
    };

    const filteredCoursesModified =
      filteredCourses &&
      filteredCourses.map(item => ({
        label: `${item.code} - ${item.courseName}`,
        value: item.Id,
      }));

    const filteredCoursesDecrees =
      coursesDecrees &&
      coursesDecrees.map(item => ({
        label: item.code,
        value: item.Id,
      }));

    if (
      traineesDecree["TraineesDecreesCourses"] &&
      typeof traineesDecree["TraineesDecreesCourses"] === "string"
    ) {
      traineesDecree["TraineesDecreesCourses"] = JSON.parse(
        traineesDecree["TraineesDecreesCourses"]
      );
    }

    const { t } = this.props;

    const decreeRulesReasonsModified = decreeRulesReasons.map(item => ({
      value: item.Id,
      label: item.arTitle,
    }));

    const l = decreeRulesReasonsModified.find(
      opt => opt.value === traineesDecree.decreeRuleReasonId || ""
    );

    const traineesDecreeListColumns = [
      {
        text: "id",
        dataField: "Id",
        sort: true,
        hidden: true,
        formatter: (cellContent, traineesDecrees) => <>{traineesDecrees.Id}</>,
        sort: true,
      },
      {
        text: this.props.t("Trainee Num"),
        dataField: "TraineeNum",
        sort: true,
        formatter: (cellContent, traineesDecrees) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {traineesDecrees.TraineeNum}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },
      {
        text: this.props.t("Trainee Name"),
        dataField: "traineeName",
        sort: true,
        formatter: (cellContent, traineesDecrees) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {traineesDecrees.traineeName}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },
      {
        text: this.props.t("decree Rule"),
        dataField: "decreeRuleId",
        sort: true,
        formatter: (cellContent, traineesDecrees) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {traineesDecrees.decreeName}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },
      {
        text: this.props.t("Decree Rule Reason"),
        dataField: "decreeRuleReasonId",
        sort: true,
        formatter: (cellContent, traineesDecrees) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {traineesDecrees.decreeReasonName}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },
      {
        text: this.props.t("Date"),
        dataField: "insertDate",
        sort: true,
        formatter: (cellContent, traineesDecrees) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {traineesDecrees.insertDate
                  ? traineesDecrees.insertDate.slice(0, 10)
                  : ""}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },
      {
        text: this.props.t("Decree Status"),
        dataField: "decreeStateId",
        sort: true,
        formatter: (cellContent, traineesDecrees) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {traineesDecrees.decreeStateName}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },
      {
        dataField: "menu",
        isDummyField: true,
        editable: false,
        text: this.props.t("Action"),
        formatter: (cellContent, traineesDecree) => (
          <div className="d-flex gap-3">
            {/* {showEditButton && ( */}
            <Link className="text-success" to="#">
              <i
                className="mdi mdi-pencil font-size-18"
                id="edittooltip"
                onClick={() => this.handleTraineesDecreeClick(traineesDecree)}
              ></i>
            </Link>
            {/* )} */}
            {showDeleteButton && (
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(traineesDecree)}
                ></i>
              </Link>
            )}
          </div>
        ),
      },
    ];

    const stdDecreeDismissColumns = [
      {
        text: "id",
        dataField: "Id",
        sort: true,
        hidden: true,
        sort: true,
      },
      {
        text: this.props.t("Decree Type"),
        dataField: "decreeName",
        sort: true,
      },
      {
        text: this.props.t("Adding Date"),
        dataField: "insertDate",
        formatter: (cellContent, traineesDecrees) => (
          <>
            {traineesDecrees.insertDate
              ? traineesDecrees.insertDate.slice(0, 10)
              : ""}
          </>
        ),
        sort: true,
      },

      {
        text: this.props.t("Decree Date"),
        dataField: "decreeDate",
        formatter: (cellContent, traineesDecrees) => (
          <>
            {traineesDecrees.decreeDate
              ? traineesDecrees.decreeDate.slice(0, 10)
              : ""}
          </>
        ),
        sort: true,
      },
      {
        text: this.props.t("Decree Status"),
        dataField: "decreeStateName",
        sort: true,
      },
    ];

    const stdDecreeRegisterData = [];

    const stdDecreeRegisterColumns = [
      {
        text: "id",
        dataField: "Id",
        sort: true,
        hidden: true,
        sort: true,
      },
      {
        text: this.props.t("Decree Type"),
        dataField: "decreeType",
        sort: true,
      },
      {
        text: this.props.t("Uni Decree Num"),
        dataField: "uniDecreeNum",
        sort: true,
      },

      {
        text: this.props.t("Uni Decree Date"),
        dataField: "uniDecreeDate",
        sort: true,
      },
      {
        text: this.props.t("Faculty Decree Num"),
        dataField: "facultyDecreeNum",
        sort: true,
      },
      {
        text: this.props.t("Faculty Decree Date"),
        dataField: "facultyDecreeDate",
        sort: true,
      },
      {
        text: this.props.t("Semester"),
        dataField: "semesterId",
        sort: true,
      },
      {
        text: this.props.t("Trainee Status"),
        dataField: "stdStatus",
        sort: true,
      },
    ];

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteTraineesDecree}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title={t("Trainees Decrees")}
              breadcrumbItem={t("Trainees Decrees List")}
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
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
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="Id"
                      columns={traineesDecreeListColumns}
                      data={traineesDecrees}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="Id"
                          columns={traineesDecreeListColumns}
                          data={this.props.traineesDecrees}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4"></Col>
                                <Col sm="8">
                                  {/* {showAddButton && ( */}
                                  <div className="text-sm-end">
                                    <Tooltip
                                      title={t("Create New")}
                                      placement="top"
                                    >
                                      <IconButton
                                        color="primary"
                                        onClick={
                                          this.handleTraineesDecreeClicks
                                        }
                                      >
                                        <i className="mdi mdi-plus-circle blue-noti-icon" />
                                      </IconButton>
                                    </Tooltip>
                                  </div>
                                  {/* )} */}
                                </Col>
                              </Row>
                              <Row>
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      //selectRow={selectRow}

                                      defaultSorted={defaultSorted}
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
                                    <Modal
                                      isOpen={this.state.addModal}
                                      className={this.props.className}
                                      size="l"
                                    >
                                      <ModalHeader
                                        toggle={this.addToggle}
                                        tag="h4"
                                      >
                                        {!!isEdit
                                          ? this.props.t("Edit Trainees Decree")
                                          : this.props.t("Add Trainees Decree")}
                                      </ModalHeader>

                                      <ModalBody>
                                        <div>
                                          {minMaxValueError && (
                                            <Alert
                                              color="danger"
                                              className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                              role="alert"
                                            >
                                              {minMaxValueError}
                                              <button
                                                type="button"
                                                className="btn-close"
                                                aria-label="Close"
                                                onClick={this.handleAlertClose}
                                              ></button>
                                            </Alert>
                                          )}
                                        </div>
                                        <Row>
                                          <Col>
                                            <Formik
                                              initialValues={{
                                                traineeName:
                                                  traineesDecree.traineeName ||
                                                  "",
                                                decreeRuleReasonId:
                                                  traineesDecree.decreeRuleReasonId,
                                                decreeId:
                                                  "" || traineesDecree.decreeId,
                                                absenceRate:
                                                  traineesDecree.absenceRate ||
                                                  "",
                                                insertDate:
                                                  traineesDecree.insertDate
                                                    ? traineesDecree.insertDate.split(
                                                        "T"
                                                      )[0]
                                                    : "",
                                                note: "",
                                                TraineesDecreesCourses: [],
                                                startDate:
                                                  traineesDecree?.startDate
                                                    ? moment
                                                        .utc(
                                                          traineesDecree.startDate
                                                        )
                                                        .local()
                                                        .format("YYYY-MM-DD")
                                                    : "",
                                                endDate: traineesDecree?.endDate
                                                  ? moment
                                                      .utc(
                                                        traineesDecree.endDate
                                                      )
                                                      .local()
                                                      .format("YYYY-MM-DD")
                                                  : "",
                                                fromDate:
                                                  traineesDecree?.fromDate
                                                    ? moment
                                                        .utc(
                                                          traineesDecree.fromDate
                                                        )
                                                        .local()
                                                        .format("YYYY-MM-DD")
                                                    : "",
                                                toDate: traineesDecree?.toDate
                                                  ? moment
                                                      .utc(
                                                        traineesDecree.toDate
                                                      )
                                                      .local()
                                                      .format("YYYY-MM-DD")
                                                  : "",
                                              }}
                                              validationSchema={Yup.object().shape(
                                                {
                                                  TraineesDecreesCourses:
                                                    Yup.array()
                                                      .nullable()
                                                      .when("decree", {
                                                        is: decree => {
                                                          const decreeObject =
                                                            decrees.find(
                                                              d =>
                                                                d.arTitle ===
                                                                decree
                                                            );
                                                          return (
                                                            decreeObject &&
                                                            (decreeObject.decisionCategoryId ===
                                                              3 ||
                                                              decreeObject.decisionCategoryId ===
                                                                2)
                                                          );
                                                        },
                                                        then: Yup.array()
                                                          .of(
                                                            Yup.object().shape({
                                                              value:
                                                                Yup.number().required(
                                                                  "Course value is required"
                                                                ),
                                                              label:
                                                                Yup.string().required(
                                                                  "Course label is required"
                                                                ),
                                                            })
                                                          )
                                                          .nullable()
                                                          .required(
                                                            "Selected Courses is required"
                                                          )
                                                          .min(
                                                            1,
                                                            "At least one course must be selected"
                                                          ),
                                                        otherwise: Yup.array()
                                                          .nullable()
                                                          .notRequired(),
                                                      }),
                                                  decreeRuleReasonId:
                                                    Yup.object().nullable(),
                                                  decree: Yup.string()
                                                    .required(
                                                      "Decree is required"
                                                    )
                                                    .test(
                                                      "is-valid-decree",
                                                      "Invalid decree",
                                                      value => {
                                                        return decrees.some(
                                                          decree =>
                                                            decree.arTitle ===
                                                            value
                                                        );
                                                      }
                                                    ),
                                                  traineeName: Yup.string()
                                                    .required(
                                                      "Trainee is required"
                                                    )
                                                    .test(
                                                      "is-valid-trainee",
                                                      "Invalid trainee",
                                                      value => {
                                                        return traineesOpt.some(
                                                          trainee =>
                                                            trainee.fullName ===
                                                            value
                                                        );
                                                      }
                                                    ),
                                                  absenceRate:
                                                    Yup.number().when(
                                                      "decree",
                                                      {
                                                        is: decree => {
                                                          const decreeObject =
                                                            decrees.find(
                                                              d =>
                                                                d.arTitle ===
                                                                decree
                                                            );

                                                          return (
                                                            decreeObject &&
                                                            decreeObject.decisionCategoryId ===
                                                              3
                                                          );
                                                        },
                                                        then: Yup.number().required(
                                                          "Absence Percentage is required"
                                                        ),
                                                        otherwise: Yup.number(),
                                                      }
                                                    ),
                                                  insertDate:
                                                    Yup.date().required(
                                                      "Adding Date is required"
                                                    ),
                                                  note: Yup.string(),
                                                }
                                              )}
                                              onSubmit={values => {
                                                this.handleSave(values);
                                              }}
                                            >
                                              {({
                                                errors,
                                                status,
                                                touched,
                                                values,
                                                handleSubmit,
                                                setFieldValue,
                                                handleBlur,
                                                handleChange,
                                              }) => (
                                                <Form onSubmit={handleSubmit}>
                                                  <div className="mb-3">
                                                    <Row>
                                                      <Col lg="4">
                                                        <label
                                                          htmlFor="decree"
                                                          className="form-label d-flex"
                                                        >
                                                          {this.props.t(
                                                            "Decree"
                                                          )}
                                                          <span className="text-danger">
                                                            *
                                                          </span>
                                                        </label>
                                                      </Col>
                                                      <Col lg="8">
                                                        <Field
                                                          name="decreeId"
                                                          type="text"
                                                          list="decreeList"
                                                          className={`form-control ${
                                                            errors.decreeId &&
                                                            touched.decreeId
                                                              ? "is-invalid"
                                                              : ""
                                                          }`}
                                                          onChange={e => {
                                                            handleChange(e);
                                                            const arTitle =
                                                              e.target.value;

                                                            const decree =
                                                              decrees.find(
                                                                decree =>
                                                                  decree.arTitle ===
                                                                  arTitle
                                                              );

                                                            if (decree) {
                                                              onGetDecreesRulesReason(
                                                                decree.Id
                                                              );
                                                            }
                                                            this.handleChangeDecree(
                                                              decree
                                                            );
                                                          }}
                                                        />
                                                        <datalist id="decreeList">
                                                          {decrees.map(
                                                            decree => (
                                                              <option
                                                                key={decree.Id}
                                                                value={
                                                                  decree.arTitle
                                                                }
                                                              />
                                                            )
                                                          )}
                                                        </datalist>
                                                        <ErrorMessage
                                                          name="decree"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </Col>
                                                    </Row>
                                                  </div>

                                                  <div className="mb-3">
                                                    <Row>
                                                      <Col lg="4">
                                                        <Label
                                                          htmlFor="traineeName"
                                                          className="form-label d-flex"
                                                        >
                                                          {this.props.t(
                                                            "Trainee Names"
                                                          )}{" "}
                                                          <span className="text-danger">
                                                            *
                                                          </span>
                                                        </Label>
                                                      </Col>
                                                      <Col lg="8">
                                                        <Field
                                                          name="traineeName"
                                                          as="input"
                                                          type="text"
                                                          list="traineeNameList"
                                                          placeholder="Search..."
                                                          className={`form-control ${
                                                            errors.traineeName &&
                                                            touched.traineeName
                                                              ? "is-invalid"
                                                              : ""
                                                          }`}
                                                          value={
                                                            traineesOpt.find(
                                                              t =>
                                                                t.key ===
                                                                this.state
                                                                  .selectedTraineeId
                                                            )?.value || ""
                                                          }
                                                          onChange={e => {
                                                            const newValue =
                                                              e.target.value;

                                                            const selectedTrainee =
                                                              traineesOpt.find(
                                                                t =>
                                                                  t.value ===
                                                                  newValue
                                                              );

                                                            if (
                                                              selectedTrainee
                                                            ) {
                                                              this.setState({
                                                                selectedTraineeId:
                                                                  selectedTrainee.key,
                                                                defaultTraineeName:
                                                                  selectedTrainee.value,
                                                              });
                                                            } else {
                                                              this.setState({
                                                                selectedTraineeId:
                                                                  null,
                                                                defaultTraineeName:
                                                                  newValue,
                                                              });
                                                            }
                                                          }}
                                                        />
                                                        <datalist id="traineeNameList">
                                                          {traineesOpt.map(
                                                            trainee => (
                                                              <option
                                                                key={
                                                                  trainee.key
                                                                }
                                                                value={
                                                                  trainee.value
                                                                }
                                                              />
                                                            )
                                                          )}
                                                        </datalist>
                                                        <ErrorMessage
                                                          name="traineeName"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </Col>
                                                    </Row>
                                                  </div>

                                                  <div className="mb-3">
                                                    <Row>
                                                      <Col lg="4">
                                                        <label
                                                          htmlFor="decreeRuleReasonId"
                                                          className="form-label d-flex"
                                                        >
                                                          {this.props.t(
                                                            "Reason"
                                                          )}
                                                          <span className="text-danger">
                                                            *
                                                          </span>
                                                        </label>
                                                      </Col>
                                                      <Col lg="8">
                                                        <Field
                                                          name="decreeRuleReasonId"
                                                          options={
                                                            decreeRulesReasonsModified
                                                          }
                                                          component={Select}
                                                          onChange={option =>
                                                            setFieldValue(
                                                              "decreeRuleReasonId",
                                                              option.value
                                                            )
                                                          }
                                                          className={`select-style-std ${
                                                            errors.decreeRuleReasonId &&
                                                            touched.decreeRuleReasonId
                                                              ? "is-invalid"
                                                              : ""
                                                          }`}
                                                        />
                                                        <ErrorMessage
                                                          name="decreeRuleReasonId"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </Col>
                                                    </Row>
                                                  </div>

                                                  {decisionCategoryId &&
                                                    decisionCategoryId == 3 && (
                                                      <>
                                                        {" "}
                                                        <div className="mb-3">
                                                          <Row>
                                                            <Col lg="4">
                                                              <label
                                                                htmlFor="absenceRate"
                                                                className="form-label d-flex"
                                                              >
                                                                {this.props.t(
                                                                  "Absence Percentage"
                                                                )}
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </label>
                                                            </Col>
                                                            <Col lg="8">
                                                              <Field
                                                                name="absenceRate"
                                                                type="number"
                                                                className={`form-control ${
                                                                  errors.absenceRate &&
                                                                  touched.absenceRate
                                                                    ? "is-invalid"
                                                                    : ""
                                                                }`}
                                                              />
                                                              <ErrorMessage
                                                                name="absenceRate"
                                                                component="div"
                                                                className="invalid-feedback"
                                                              />
                                                            </Col>
                                                          </Row>
                                                        </div>
                                                      </>
                                                    )}
                                                  {decisionCategoryId &&
                                                    (decisionCategoryId == 3 ||
                                                      decisionCategoryId ==
                                                        2) && (
                                                      <>
                                                        <div className="mb-3">
                                                          <Row>
                                                            <Col lg="4">
                                                              <label
                                                                htmlFor="courses"
                                                                className="form-label d-flex"
                                                              >
                                                                {this.props.t(
                                                                  "Courses"
                                                                )}
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </label>
                                                            </Col>
                                                            <Col lg="8">
                                                              <Field
                                                                name="TraineesDecreesCourses"
                                                                component={
                                                                  Select
                                                                }
                                                                options={
                                                                  filteredCoursesModified
                                                                }
                                                                defaultValue={
                                                                  stdCoursesArray
                                                                }
                                                                isMulti
                                                                onChange={selectedOptions => {
                                                                  setFieldValue(
                                                                    "TraineesDecreesCourses",
                                                                    selectedOptions
                                                                  );
                                                                }}
                                                                className={`${
                                                                  errors.TraineesDecreesCourses &&
                                                                  touched.TraineesDecreesCourses
                                                                    ? "is-invalid"
                                                                    : ""
                                                                }`}
                                                              />
                                                              <ErrorMessage
                                                                name="TraineesDecreesCourses"
                                                                component="div"
                                                                className="invalid-feedback"
                                                              />
                                                            </Col>
                                                          </Row>
                                                        </div>
                                                        <div className="mb-3">
                                                          <Row>
                                                            <Col className="col-4">
                                                              <Label for="startDate">
                                                                {this.props.t(
                                                                  "Start Date"
                                                                )}
                                                              </Label>
                                                              <span className="text-danger">
                                                                *
                                                              </span>
                                                            </Col>
                                                            <Col className="col-8">
                                                              <Field
                                                                name="startDate"
                                                                className={`form-control`}
                                                                type="date"
                                                                value={
                                                                  values.startDate
                                                                    ? new Date(
                                                                        values.startDate
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
                                                                id="startDate-date-input"
                                                              />
                                                            </Col>
                                                          </Row>
                                                        </div>
                                                        <div className="mb-3">
                                                          <Row>
                                                            <Col className="col-4">
                                                              <Label for="endDate">
                                                                {this.props.t(
                                                                  "End Date"
                                                                )}
                                                              </Label>
                                                              <span className="text-danger">
                                                                *
                                                              </span>
                                                            </Col>
                                                            <Col className="col-8">
                                                              <Field
                                                                name="endDate"
                                                                className={`form-control`}
                                                                type="date"
                                                                value={
                                                                  values.endDate
                                                                    ? new Date(
                                                                        values.endDate
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
                                                                id="endDate-date-input"
                                                              />
                                                            </Col>
                                                          </Row>
                                                        </div>
                                                      </>
                                                    )}
                                                  {decisionCategoryId &&
                                                    decisionCategoryId == 6 && (
                                                      <>
                                                        <Row className="mb-3">
                                                          <Col lg="4">
                                                            <Label for="fromDate">
                                                              {this.props.t(
                                                                "From Date"
                                                              )}
                                                            </Label>
                                                          </Col>
                                                          <Col className="col-8">
                                                            <Field
                                                              name="fromDate"
                                                              className={`form-control`}
                                                              type="date"
                                                              value={
                                                                values.fromDate
                                                                  ? new Date(
                                                                      values.fromDate
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
                                                              id="fromDate-date-input"
                                                            />
                                                          </Col>
                                                        </Row>
                                                        <div className="mb-3">
                                                          <Row>
                                                            <Col className="col-4">
                                                              <Label for="toDate">
                                                                {this.props.t(
                                                                  "To Date"
                                                                )}
                                                              </Label>
                                                            </Col>
                                                            <Col className="col-8">
                                                              <Field
                                                                name="toDate"
                                                                className={`form-control`}
                                                                type="date"
                                                                value={
                                                                  values.toDate
                                                                    ? new Date(
                                                                        values.toDate
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
                                                                id="toDate-date-input"
                                                              />
                                                            </Col>
                                                          </Row>
                                                        </div>
                                                      </>
                                                    )}
                                                  {decisionCategoryId &&
                                                    decisionCategoryId == 4 && (
                                                      <>
                                                        <Row className="mb-3">
                                                          <Col lg="4">
                                                            <Label for="fromDateAcademy">
                                                              {this.props.t(
                                                                "From Date"
                                                              )}
                                                            </Label>
                                                          </Col>
                                                          <Col className="col-8">
                                                            <Field
                                                              name="fromDateAcademy"
                                                              className={`form-control`}
                                                              type="date"
                                                              value={
                                                                values.fromDateAcademy
                                                                  ? new Date(
                                                                      values.fromDateAcademy
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
                                                              id="fromDateAcademy-date-input"
                                                            />
                                                          </Col>
                                                        </Row>
                                                      </>
                                                    )}

                                                  <div className="mb-3">
                                                    <Row>
                                                      <Col lg="4">
                                                        <label
                                                          htmlFor="insertDate"
                                                          className="form-label d-flex"
                                                        >
                                                          {this.props.t(
                                                            "Adding Date"
                                                          )}
                                                          <span className="text-danger">
                                                            *
                                                          </span>
                                                        </label>
                                                      </Col>
                                                      <Col lg="8">
                                                        <Field
                                                          name="insertDate"
                                                          type="date"
                                                          className={`form-control ${
                                                            errors.insertDate &&
                                                            touched.insertDate
                                                              ? "is-invalid"
                                                              : ""
                                                          }`}
                                                          onChange={
                                                            handleChange
                                                          }
                                                        />

                                                        <ErrorMessage
                                                          name="insertDate"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </Col>
                                                    </Row>
                                                  </div>

                                                  <button
                                                    type="submit"
                                                    className="btn btn-primary"
                                                  >
                                                    {this.props.t("Save")}
                                                  </button>
                                                </Form>
                                              )}
                                            </Formik>
                                          </Col>
                                        </Row>
                                      </ModalBody>
                                    </Modal>
                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                      size="xl"
                                      fullscreen
                                    >
                                      <ModalHeader
                                        toggle={this.toggle}
                                        tag="h4"
                                      >
                                        {!!isEdit
                                          ? this.props.t("Edit TraineesDecree")
                                          : this.props.t("Add TraineesDecree")}
                                      </ModalHeader>

                                      <ModalBody>
                                        <div>
                                          {minMaxValueError && (
                                            <Alert
                                              color="danger"
                                              className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                              role="alert"
                                            >
                                              {minMaxValueError}
                                              <button
                                                type="button"
                                                className="btn-close"
                                                aria-label="Close"
                                                onClick={this.handleAlertClose}
                                              ></button>
                                            </Alert>
                                          )}
                                        </div>
                                        <Row>
                                          <Col lg="4">
                                            <Formik
                                              initialValues={
                                                isEdit && {
                                                  Id: traineesDecree.Id,
                                                  yearSemesterId:
                                                    null ||
                                                    traineesDecree.yearSemesterId,
                                                  traineeName:
                                                    traineesDecree.fullName ||
                                                    "",
                                                  decreeRuleReasonId:
                                                    traineesDecree.decreeRuleReasonId,
                                                  decree:
                                                    "" || traineesDecree.decree,
                                                  absenceRate:
                                                    traineesDecree.absenceRate ||
                                                    "",
                                                  insertDate:
                                                    traineesDecree.insertDate
                                                      ? new Date(
                                                          traineesDecree.insertDate
                                                        )
                                                          .toISOString()
                                                          .split("T")[0]
                                                      : "",
                                                  note: traineesDecree.note,
                                                  TraineesDecreesCourses:
                                                    stdCoursesArray,
                                                  fromYearSemesterId:
                                                    null ||
                                                    traineesDecree.fromYearSemesterId,
                                                  toYearSemesterId:
                                                    null ||
                                                    traineesDecree.toYearSemesterId,
                                                  decreeNum:
                                                    traineesDecree.decreeNum,
                                                  decreeType:
                                                    traineesDecree.decreeType,
                                                  decreeDate:
                                                    traineesDecree.decreeDate
                                                      ? new Date(
                                                          traineesDecree.decreeDate
                                                        )
                                                          .toISOString()
                                                          .split("T")[0]
                                                      : "",
                                                  decreeStateId:
                                                    traineesDecree.decreeStateId,
                                                  councilDecree:
                                                    traineesDecree.councilDecree,
                                                  startDate:
                                                    traineesDecree?.startDate
                                                      ? moment
                                                          .utc(
                                                            traineesDecree.startDate
                                                          )
                                                          .local()
                                                          .format("YYYY-MM-DD")
                                                      : "",
                                                  endDate:
                                                    traineesDecree?.endDate
                                                      ? moment
                                                          .utc(
                                                            traineesDecree.endDate
                                                          )
                                                          .local()
                                                          .format("YYYY-MM-DD")
                                                      : "",
                                                  fromDate:
                                                    traineesDecree?.fromDate
                                                      ? moment
                                                          .utc(
                                                            traineesDecree.fromDate
                                                          )
                                                          .local()
                                                          .format("YYYY-MM-DD")
                                                      : "",
                                                  toDate: traineesDecree?.toDate
                                                    ? moment
                                                        .utc(
                                                          traineesDecree.toDate
                                                        )
                                                        .local()
                                                        .format("YYYY-MM-DD")
                                                    : "",
                                                  councilDate:
                                                    traineesDecree.councilDate
                                                      ? new Date(
                                                          traineesDecree.councilDate
                                                        )
                                                          .toISOString()
                                                          .split("T")[0]
                                                      : "",
                                                }
                                              }
                                              validationSchema={Yup.object().shape(
                                                {
                                                  yearSemesterId: Yup.number()
                                                    .required(
                                                      "Current Semester is required"
                                                    )
                                                    .nullable(),

                                                  fromYearSemesterId:
                                                    Yup.number().when(
                                                      "decree",
                                                      {
                                                        is: decree => {
                                                          const decreeObject =
                                                            decrees.find(
                                                              d =>
                                                                d.arTitle ===
                                                                decree
                                                            );
                                                          return (
                                                            decreeObject &&
                                                            decreeObject.decisionCategoryId ===
                                                              6
                                                          );
                                                        },
                                                        then: /* Yup.object().nullable().required("Semester is required").shape({
                                                        value: Yup.string().required("Semester value is required"),
                                                        label: Yup.string().required("Semester label is required"),
                                                      }), */ Yup.number()
                                                          .required(
                                                            "Semester is required"
                                                          )
                                                          .nullable(),
                                                        otherwise:
                                                          Yup.number().nullable(),
                                                      }
                                                    ),
                                                  toYearSemesterId:
                                                    Yup.number().when(
                                                      "decree",
                                                      {
                                                        is: decree => {
                                                          const decreeObject =
                                                            decrees.find(
                                                              d =>
                                                                d.arTitle ===
                                                                decree
                                                            );
                                                          return (
                                                            decreeObject &&
                                                            decreeObject.decisionCategoryId ===
                                                              6
                                                          );
                                                        },
                                                        then: /* Yup.object().nullable().required("Semester is required").shape({
                                                        value: Yup.string().required("Semester value is required"),
                                                        label: Yup.string().required("Semester label is required"),
                                                      }), */ Yup.number()
                                                          .required(
                                                            "Semester is required"
                                                          )
                                                          .nullable(),
                                                        otherwise:
                                                          Yup.number().nullable(),
                                                      }
                                                    ),
                                                  TraineesDecreesCourses:
                                                    Yup.array()
                                                      .nullable()
                                                      .when("decree", {
                                                        is: decree => {
                                                          const decreeObject =
                                                            decrees.find(
                                                              d =>
                                                                d.arTitle ===
                                                                decree
                                                            );
                                                          return (
                                                            decreeObject &&
                                                            (decreeObject.decisionCategoryId ===
                                                              3 ||
                                                              decreeObject.decisionCategoryId ===
                                                                2)
                                                          );
                                                        },
                                                        then: Yup.array()
                                                          .of(
                                                            Yup.object().shape({
                                                              value:
                                                                Yup.number().required(
                                                                  "Course value is required"
                                                                ),
                                                              label:
                                                                Yup.string().required(
                                                                  "Course label is required"
                                                                ),
                                                            })
                                                          )
                                                          .nullable()
                                                          .required(
                                                            "Selected Courses is required"
                                                          )
                                                          .min(
                                                            1,
                                                            "At least one course must be selected"
                                                          ),
                                                        otherwise: Yup.array()
                                                          .nullable()
                                                          .notRequired(),
                                                      }),
                                                  decreeRuleReasonId:
                                                    Yup.object().nullable(),
                                                  decree: Yup.string()
                                                    .required(
                                                      "Decree is required"
                                                    )
                                                    .test(
                                                      "is-valid-decree",
                                                      "Invalid decree",
                                                      value => {
                                                        return decrees.some(
                                                          decree =>
                                                            decree.arTitle ===
                                                            value
                                                        );
                                                      }
                                                    ),
                                                  traineeName: Yup.string()
                                                    .required(
                                                      "Trainee is required"
                                                    )
                                                    .test(
                                                      "is-valid-trainee",
                                                      "Invalid trainee",
                                                      value => {
                                                        return traineesOpt.some(
                                                          trainee =>
                                                            trainee.fullName ===
                                                            value
                                                        );
                                                      }
                                                    ),
                                                  absenceRate:
                                                    Yup.number().when(
                                                      "decree",
                                                      {
                                                        is: decree => {
                                                          const decreeObject =
                                                            decrees.find(
                                                              d =>
                                                                d.arTitle ===
                                                                decree
                                                            );

                                                          return (
                                                            decreeObject &&
                                                            decreeObject.decisionCategoryId ===
                                                              3
                                                          );
                                                        },
                                                        then: Yup.number().required(
                                                          "Absence Percentage is required"
                                                        ),
                                                        otherwise: Yup.number(),
                                                      }
                                                    ),
                                                  insertDate:
                                                    Yup.date().required(
                                                      "Adding Date is required"
                                                    ),
                                                  note: Yup.string(),
                                                }
                                              )}
                                              onSubmit={values => {
                                                this.handleSave(values);
                                              }}
                                            >
                                              {({
                                                errors,
                                                status,
                                                touched,
                                                values,
                                                handleSubmit,
                                                setFieldValue,
                                                handleBlur,
                                                handleChange,
                                                setTouched,
                                              }) => (
                                                <Form onSubmit={handleSubmit}>
                                                  <div className="bordered">
                                                    <div className="mb-3">
                                                      <Row>
                                                        <Col lg="4">
                                                          <label
                                                            htmlFor="yearSemesterId"
                                                            className="form-label d-flex"
                                                          >
                                                            {this.props.t(
                                                              "Current Semester"
                                                            )}{" "}
                                                            <span className="text-danger">
                                                              *
                                                            </span>
                                                          </label>
                                                        </Col>
                                                        <Col lg="8">
                                                          <Field
                                                            name="yearSemesterId"
                                                            options={
                                                              yearsModified
                                                            }
                                                            component={Select}
                                                            onChange={option =>
                                                              setFieldValue(
                                                                "yearSemesterId",
                                                                option.value
                                                              )
                                                            }
                                                            className={`select-style-std ${
                                                              errors.yearSemesterId &&
                                                              touched.yearSemesterId
                                                                ? "is-invalid"
                                                                : ""
                                                            }`}
                                                            defaultValue={yearsModified.find(
                                                              opt =>
                                                                opt.value ===
                                                                traineesDecree.yearSemesterId
                                                            )}
                                                          />
                                                          <ErrorMessage
                                                            name="yearSemesterId"
                                                            component="div"
                                                            className="invalid-feedback"
                                                          />
                                                        </Col>
                                                      </Row>
                                                    </div>

                                                    <div className="mb-3">
                                                      <Row>
                                                        <Col lg="4">
                                                          <label
                                                            htmlFor="decree"
                                                            className="form-label d-flex"
                                                          >
                                                            {this.props.t(
                                                              "Decree"
                                                            )}
                                                            <span className="text-danger">
                                                              *
                                                            </span>
                                                          </label>
                                                        </Col>
                                                        <Col lg="8">
                                                          <Field
                                                            name="decree"
                                                            type="text"
                                                            list="decreeList"
                                                            className={`form-control ${
                                                              errors.decree &&
                                                              touched.decree
                                                                ? "is-invalid"
                                                                : ""
                                                            }`}
                                                            onChange={e => {
                                                              handleChange(e);
                                                              const arTitle =
                                                                e.target.value;

                                                              const decree =
                                                                decrees.find(
                                                                  decree =>
                                                                    decree.arTitle ===
                                                                    arTitle
                                                                );

                                                              if (decree) {
                                                                onGetDecreesRulesReason(
                                                                  decree.Id
                                                                );
                                                              }
                                                              this.handleChangeDecree(
                                                                decree
                                                              );
                                                            }}
                                                          />
                                                          <datalist id="decreeList">
                                                            {decrees.map(
                                                              decree => (
                                                                <option
                                                                  key={
                                                                    decree.Id
                                                                  }
                                                                  value={
                                                                    decree.arTitle
                                                                  }
                                                                />
                                                              )
                                                            )}
                                                          </datalist>
                                                          <ErrorMessage
                                                            name="decree"
                                                            component="div"
                                                            className="invalid-feedback"
                                                          />
                                                        </Col>
                                                      </Row>
                                                    </div>

                                                    <div className="mb-3">
                                                      <Row>
                                                        <Col lg="4">
                                                          <label
                                                            htmlFor="traineeName"
                                                            className="form-label d-flex"
                                                          >
                                                            {this.props.t(
                                                              "Trainee Names"
                                                            )}{" "}
                                                            <span className="text-danger">
                                                              *
                                                            </span>
                                                          </label>
                                                        </Col>
                                                        <Col lg="8">
                                                          <Field
                                                            name="traineeName"
                                                            type="text"
                                                            list="traineeNameList"
                                                            className={`form-control ${
                                                              errors.traineeName &&
                                                              touched.traineeName
                                                                ? "is-invalid"
                                                                : ""
                                                            }`}
                                                            value={
                                                              traineesOpt.find(
                                                                t =>
                                                                  t.key ===
                                                                  this.state
                                                                    .selectedTraineeId
                                                              )?.value || ""
                                                            }
                                                            onChange={e => {
                                                              const newValue =
                                                                e.target.value;

                                                              const selectedTrainee =
                                                                traineesOpt.find(
                                                                  t =>
                                                                    t.value ===
                                                                    newValue
                                                                );

                                                              if (
                                                                selectedTrainee
                                                              ) {
                                                                this.setState({
                                                                  selectedTraineeId:
                                                                    selectedTrainee.key,
                                                                  defaultTraineeName:
                                                                    selectedTrainee.value,
                                                                });
                                                              } else {
                                                                this.setState({
                                                                  selectedTraineeId:
                                                                    null,
                                                                  defaultTraineeName:
                                                                    newValue,
                                                                });
                                                              }
                                                            }}
                                                          />
                                                          <datalist id="traineeNameList">
                                                            {traineesOpt.map(
                                                              trainee => (
                                                                <option
                                                                  key={
                                                                    trainee.key
                                                                  }
                                                                  value={
                                                                    trainee.value
                                                                  }
                                                                />
                                                              )
                                                            )}
                                                          </datalist>
                                                          <ErrorMessage
                                                            name="traineeName"
                                                            component="div"
                                                            className="invalid-feedback"
                                                          />
                                                        </Col>
                                                      </Row>
                                                    </div>

                                                    <div className="mb-3">
                                                      <Row>
                                                        <Col lg="4">
                                                          <label
                                                            htmlFor="decreeRuleReasonId"
                                                            className="form-label d-flex"
                                                          >
                                                            {this.props.t(
                                                              "Reason"
                                                            )}
                                                            <span className="text-danger">
                                                              *
                                                            </span>
                                                          </label>
                                                        </Col>
                                                        <Col lg="8">
                                                          <Field
                                                            name="decreeRuleReasonId"
                                                            component={Select}
                                                            options={
                                                              decreeRulesReasonsModified
                                                            }
                                                            onChange={option =>
                                                              setFieldValue(
                                                                "decreeRuleReasonId",
                                                                option.value
                                                              )
                                                            }
                                                            defaultValue={decreeRulesReasonsModified.find(
                                                              opt =>
                                                                opt.value ===
                                                                traineesDecree.decreeRuleReasonId
                                                            )}
                                                            className={`select-style-std ${
                                                              errors.decreeRuleReasonId &&
                                                              touched.decreeRuleReasonId
                                                                ? "is-invalid"
                                                                : ""
                                                            }`}
                                                          />
                                                          <ErrorMessage
                                                            name="decreeRuleReasonId"
                                                            component="div"
                                                            className="invalid-feedback"
                                                          />
                                                        </Col>
                                                      </Row>
                                                    </div>

                                                    {decisionCategoryId &&
                                                      decisionCategoryId ==
                                                        3 && (
                                                        <>
                                                          {" "}
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <label
                                                                  htmlFor="absenceRate"
                                                                  className="form-label d-flex"
                                                                >
                                                                  {this.props.t(
                                                                    "Absence Percentage"
                                                                  )}
                                                                  <span className="text-danger">
                                                                    *
                                                                  </span>
                                                                </label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Field
                                                                  name="absenceRate"
                                                                  type="number"
                                                                  className={`form-control ${
                                                                    errors.absenceRate &&
                                                                    touched.absenceRate
                                                                      ? "is-invalid"
                                                                      : ""
                                                                  }`}
                                                                />
                                                                <ErrorMessage
                                                                  name="absenceRate"
                                                                  component="div"
                                                                  className="invalid-feedback"
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                        </>
                                                      )}
                                                    {decisionCategoryId &&
                                                      (decisionCategoryId ==
                                                        3 ||
                                                        decisionCategoryId ==
                                                          2) && (
                                                        <>
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <label
                                                                  htmlFor="courses"
                                                                  className="form-label d-flex"
                                                                >
                                                                  {this.props.t(
                                                                    "Courses"
                                                                  )}
                                                                  <span className="text-danger">
                                                                    *
                                                                  </span>
                                                                </label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <Field
                                                                  name="TraineesDecreesCourses"
                                                                  component={
                                                                    Select
                                                                  }
                                                                  options={
                                                                    filteredCoursesModified
                                                                  }
                                                                  defaultValue={
                                                                    stdCoursesArray
                                                                  }
                                                                  isMulti
                                                                  onChange={selectedOptions => {
                                                                    setFieldValue(
                                                                      "TraineesDecreesCourses",
                                                                      selectedOptions
                                                                    );
                                                                  }}
                                                                  className={`${
                                                                    errors.TraineesDecreesCourses &&
                                                                    touched.TraineesDecreesCourses
                                                                      ? "is-invalid"
                                                                      : ""
                                                                  }`}
                                                                />
                                                                <ErrorMessage
                                                                  name="TraineesDecreesCourses"
                                                                  component="div"
                                                                  className="invalid-feedback"
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col className="col-4">
                                                                <Label for="startDate">
                                                                  {this.props.t(
                                                                    "Start Date"
                                                                  )}
                                                                </Label>
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  name="startDate"
                                                                  className={`form-control`}
                                                                  type="date"
                                                                  value={
                                                                    values.startDate
                                                                      ? new Date(
                                                                          values.startDate
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
                                                                  id="startDate-date-input"
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col className="col-4">
                                                                <Label for="endDate">
                                                                  {this.props.t(
                                                                    "End Date"
                                                                  )}
                                                                </Label>
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  name="endDate"
                                                                  className={`form-control`}
                                                                  type="date"
                                                                  value={
                                                                    values.endDate
                                                                      ? new Date(
                                                                          values.endDate
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
                                                                  id="endDate-date-input"
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                        </>
                                                      )}
                                                    {decisionCategoryId &&
                                                      decisionCategoryId ==
                                                        6 && (
                                                        <>
                                                          <Row className="mb-3">
                                                            <Col lg="4">
                                                              <Label for="fromDate">
                                                                {this.props.t(
                                                                  "From Date"
                                                                )}
                                                              </Label>
                                                            </Col>
                                                            <Col className="col-8">
                                                              <Field
                                                                name="fromDate"
                                                                className={`form-control`}
                                                                type="date"
                                                                value={
                                                                  values.fromDate
                                                                    ? new Date(
                                                                        values.fromDate
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
                                                                id="fromDate-date-input"
                                                              />
                                                            </Col>
                                                          </Row>
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col className="col-4">
                                                                <Label for="toDate">
                                                                  {this.props.t(
                                                                    "To Date"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  name="toDate"
                                                                  className={`form-control`}
                                                                  type="date"
                                                                  value={
                                                                    values.toDate
                                                                      ? new Date(
                                                                          values.toDate
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
                                                                  id="toDate-date-input"
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                        </>
                                                      )}
                                                    {decisionCategoryId &&
                                                      decisionCategoryId ==
                                                        4 && (
                                                        <>
                                                          <Row className="mb-3">
                                                            <Col lg="4">
                                                              <Label for="fromDateAcademy">
                                                                {this.props.t(
                                                                  "From Date"
                                                                )}
                                                              </Label>
                                                            </Col>
                                                            <Col className="col-8">
                                                              <Field
                                                                name="fromDateAcademy"
                                                                className={`form-control`}
                                                                type="date"
                                                                value={
                                                                  values.fromDateAcademy
                                                                    ? new Date(
                                                                        values.fromDateAcademy
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
                                                                id="fromDateAcademy-date-input"
                                                              />
                                                            </Col>
                                                          </Row>
                                                        </>
                                                      )}

                                                    <div className="mb-3">
                                                      <Row>
                                                        <Col lg="4">
                                                          <label
                                                            htmlFor="decreeStatus"
                                                            className="form-label d-flex"
                                                          >
                                                            {this.props.t(
                                                              "Decree Status"
                                                            )}
                                                            <span className="text-danger">
                                                              *
                                                            </span>
                                                          </label>
                                                        </Col>
                                                        <Col lg="8">
                                                          <div className="d-flex flex-wrap gap-3">
                                                            <div
                                                              className="btn-group button-or"
                                                              role="group"
                                                            >
                                                              {decreeStatus.map(
                                                                (
                                                                  status,
                                                                  index
                                                                ) => (
                                                                  <React.Fragment
                                                                    key={index}
                                                                  >
                                                                    <input
                                                                      type="radio"
                                                                      className={`btn-check button-or ${
                                                                        selectedDecreeStatus ===
                                                                        status.Id
                                                                          ? "active"
                                                                          : ""
                                                                      }`}
                                                                      name="decreeStateId"
                                                                      id={`btnradio${index}`}
                                                                      autoComplete="off"
                                                                      defaultChecked={
                                                                        selectedDecreeStatus ===
                                                                        status.Id
                                                                          ? "active"
                                                                          : ""
                                                                      }
                                                                      onChange={() =>
                                                                        setFieldValue(
                                                                          "decreeStateId",
                                                                          status.Id
                                                                        )
                                                                      }
                                                                    />
                                                                    <label
                                                                      className="btn btn-outline-primary smallButton w-sm"
                                                                      htmlFor={`btnradio${index}`}
                                                                    >
                                                                      {
                                                                        status.arTitle
                                                                      }
                                                                    </label>
                                                                  </React.Fragment>
                                                                )
                                                              )}
                                                            </div>
                                                          </div>
                                                        </Col>
                                                      </Row>
                                                    </div>

                                                    <div className="mb-3">
                                                      <Row>
                                                        <Col lg="4">
                                                          <label
                                                            htmlFor="insertDate"
                                                            className="form-label d-flex"
                                                          >
                                                            {this.props.t(
                                                              "Adding Date"
                                                            )}
                                                            <span className="text-danger">
                                                              *
                                                            </span>
                                                          </label>
                                                        </Col>
                                                        <Col lg="8">
                                                          <Field
                                                            name="insertDate"
                                                            type="date"
                                                            className={`form-control ${
                                                              errors.insertDate &&
                                                              touched.insertDate
                                                                ? "is-invalid"
                                                                : ""
                                                            }`}
                                                            onChange={
                                                              handleChange
                                                            }
                                                          />

                                                          <ErrorMessage
                                                            name="insertDate"
                                                            component="div"
                                                            className="invalid-feedback"
                                                          />
                                                        </Col>
                                                      </Row>
                                                    </div>

                                                    <div className="mb-3">
                                                      <Row>
                                                        <Col lg="4">
                                                          <label
                                                            htmlFor="note"
                                                            className="form-label d-flex"
                                                          >
                                                            {this.props.t(
                                                              "note"
                                                            )}
                                                          </label>
                                                        </Col>
                                                        <Col lg="8">
                                                          <Field
                                                            name="note"
                                                            as="textarea"
                                                            className={`form-control ${
                                                              window.confirmWindowOpen
                                                                ? "is-invalid"
                                                                : ""
                                                            }`}
                                                          />
                                                          <ErrorMessage
                                                            name="note"
                                                            component="div"
                                                            className="invalid-feedback"
                                                          />
                                                        </Col>
                                                      </Row>
                                                    </div>
                                                  </div>

                                                  <div className="bordered">
                                                    <div className="mb-3">
                                                      <Row>
                                                        <Col lg="4">
                                                          <label
                                                            htmlFor="decreeType"
                                                            className="form-label d-flex"
                                                          >
                                                            {this.props.t(
                                                              "Decree Type"
                                                            )}
                                                          </label>
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
                                                                  selectedDecreeType ===
                                                                  "faculty"
                                                                    ? "active"
                                                                    : ""
                                                                }`}
                                                                name="decreeType"
                                                                id="btnradio4"
                                                                autoComplete="off"
                                                                defaultChecked={
                                                                  selectedDecreeType ==
                                                                  "faculty"
                                                                    ? "active"
                                                                    : ""
                                                                }
                                                                onChange={() =>
                                                                  setFieldValue(
                                                                    "decreeType",
                                                                    "faculty"
                                                                  )
                                                                }
                                                              />
                                                              <label
                                                                className="btn btn-outline-primary smallButton  w-sm "
                                                                htmlFor="btnradio4"
                                                              >
                                                                {this.props.t(
                                                                  "Faculty"
                                                                )}
                                                              </label>

                                                              <input
                                                                type="radio"
                                                                className={`btn-check button-or ${
                                                                  selectedDecreeType ===
                                                                  "committe"
                                                                    ? "active"
                                                                    : ""
                                                                }`}
                                                                name="decreeType"
                                                                id="btnradio6"
                                                                autoComplete="off"
                                                                defaultChecked={
                                                                  selectedDecreeType ==
                                                                  "committe"
                                                                    ? "active"
                                                                    : ""
                                                                }
                                                                onChange={() =>
                                                                  setFieldValue(
                                                                    "decreeType",
                                                                    "committe"
                                                                  )
                                                                }
                                                              />
                                                              <label
                                                                className="btn btn-outline-primary smallButton  w-sm "
                                                                htmlFor="btnradio6"
                                                              >
                                                                {this.props.t(
                                                                  "Committe"
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
                                                          <label
                                                            htmlFor="decreeDate"
                                                            className="form-label d-flex"
                                                          >
                                                            {this.props.t(
                                                              "Decree Date"
                                                            )}
                                                          </label>
                                                        </Col>
                                                        <Col lg="8">
                                                          <Field
                                                            name="decreeDate"
                                                            type="date"
                                                            className={`form-control`}
                                                            onChange={
                                                              handleChange
                                                            }
                                                          />
                                                        </Col>
                                                      </Row>
                                                    </div>

                                                    <div className="mb-3">
                                                      <Row>
                                                        <Col lg="4">
                                                          <label
                                                            htmlFor="decreeNum"
                                                            className="form-label d-flex"
                                                          >
                                                            {this.props.t(
                                                              "Decree Number"
                                                            )}
                                                          </label>
                                                        </Col>
                                                        <Col lg="8">
                                                          <Field
                                                            name="decreeNum"
                                                            type="text"
                                                            className={`form-control `}
                                                          />
                                                          <ErrorMessage
                                                            name="decreeNum"
                                                            component="div"
                                                            className="invalid-feedback"
                                                          />
                                                        </Col>
                                                      </Row>
                                                    </div>

                                                    <div className="mb-3">
                                                      <Row>
                                                        <Col lg="4">
                                                          <label
                                                            htmlFor="councilDate"
                                                            className="form-label d-flex"
                                                          >
                                                            {this.props.t(
                                                              "Council Date"
                                                            )}
                                                          </label>
                                                        </Col>
                                                        <Col lg="8">
                                                          <Field
                                                            name="councilDate"
                                                            type="date"
                                                            className={`form-control `}
                                                            onChange={
                                                              handleChange
                                                            }
                                                          />
                                                        </Col>
                                                      </Row>
                                                    </div>

                                                    <div className="mb-3">
                                                      <Row>
                                                        <Col lg="4">
                                                          <label
                                                            htmlFor="councilDecree"
                                                            className="form-label d-flex"
                                                          >
                                                            {this.props.t(
                                                              "Council Decree"
                                                            )}
                                                          </label>
                                                        </Col>
                                                        <Col lg="8">
                                                          <Field
                                                            name="councilDecree"
                                                            type="text"
                                                            className={`form-control`}
                                                            onChange={
                                                              handleChange
                                                            }
                                                          />
                                                        </Col>
                                                      </Row>
                                                    </div>
                                                  </div>

                                                  <button
                                                    type="submit"
                                                    className="btn btn-primary"
                                                  >
                                                    {this.props.t("Save")}
                                                  </button>
                                                </Form>
                                              )}
                                            </Formik>
                                          </Col>
                                          <Col lg="8">
                                            <Row>
                                              <Card>
                                                <CardTitle id="add_header">
                                                  {traineesDecree.traineeName +
                                                    "  " +
                                                    traineesDecree.TraineeId}
                                                </CardTitle>
                                                <CardBody>
                                                  <Row>
                                                    <Col lg="6">
                                                      <div>
                                                        <Row>
                                                          <Col lg="4">
                                                            <Label className="form-label">
                                                              {this.props.t(
                                                                "Faculty"
                                                              )}
                                                            </Label>
                                                          </Col>
                                                          <Col lg="8"></Col>
                                                        </Row>
                                                      </div>

                                                      <div>
                                                        <Row>
                                                          <Col lg="4">
                                                            <Label className="form-label">
                                                              {this.props.t(
                                                                "Study Pattern"
                                                              )}
                                                            </Label>
                                                          </Col>
                                                          <Col lg="8"></Col>
                                                        </Row>
                                                      </div>

                                                      <div>
                                                        <Row>
                                                          <Col lg="4">
                                                            <Label className="form-label">
                                                              {this.props.t(
                                                                "Level"
                                                              )}
                                                            </Label>
                                                          </Col>
                                                          <Col lg="8"></Col>
                                                        </Row>
                                                      </div>

                                                      <div>
                                                        <Row>
                                                          <Col lg="4">
                                                            <Label className="form-label">
                                                              {this.props.t(
                                                                "Completed Hours"
                                                              )}
                                                            </Label>
                                                          </Col>
                                                          <Col lg="8"></Col>
                                                        </Row>
                                                      </div>

                                                      <div>
                                                        <Row>
                                                          <Col lg="4">
                                                            <Label className="form-label">
                                                              {this.props.t(
                                                                "Cumulative Average"
                                                              )}
                                                            </Label>
                                                          </Col>
                                                          <Col lg="8"></Col>
                                                        </Row>
                                                      </div>
                                                    </Col>
                                                    <Col lg="6">
                                                      <div>
                                                        <Row>
                                                          <Col lg="4">
                                                            <Label className="form-label">
                                                              {this.props.t(
                                                                "Academic Advisor"
                                                              )}
                                                            </Label>
                                                          </Col>
                                                          <Col lg="8"></Col>
                                                        </Row>
                                                      </div>

                                                      <div
                                                        style={{
                                                          paddingTop: "3px",
                                                          paddingBottom: "8px",
                                                        }}
                                                      >
                                                        <Row>
                                                          <Col lg="4">
                                                            <Label className="form-label">
                                                              {this.props.t(
                                                                "Trainee State"
                                                              )}
                                                            </Label>
                                                          </Col>
                                                          <Col lg="8"></Col>
                                                        </Row>
                                                      </div>

                                                      <div>
                                                        <Row>
                                                          <Col lg="4">
                                                            <Label className="form-label">
                                                              {this.props.t(
                                                                "Current Semes State"
                                                              )}
                                                            </Label>
                                                          </Col>
                                                          <Col lg="8"></Col>
                                                        </Row>
                                                      </div>

                                                      <div>
                                                        <Row>
                                                          <Col lg="4">
                                                            <Label className="form-label">
                                                              {this.props.t(
                                                                "Trans. Credits"
                                                              )}
                                                            </Label>
                                                          </Col>
                                                          <Col lg="8"></Col>
                                                        </Row>
                                                      </div>

                                                      <div>
                                                        <Row>
                                                          <Col lg="4">
                                                            <Label className="form-label">
                                                              {this.props.t(
                                                                "Academic Warning"
                                                              )}
                                                            </Label>
                                                          </Col>
                                                          <Col lg="8"></Col>
                                                        </Row>
                                                      </div>
                                                    </Col>
                                                  </Row>
                                                </CardBody>
                                              </Card>
                                            </Row>
                                            <Row>
                                              <Card>
                                                <CardTitle id="add_header">
                                                  {this.props.t(
                                                    "Trainees Decrees (Dismiss)"
                                                  )}
                                                </CardTitle>
                                                <CardBody>
                                                  <Row>
                                                    <BootstrapTable
                                                      keyField="Id"
                                                      data={
                                                        traineeDecreesDismiss
                                                      }
                                                      columns={
                                                        stdDecreeDismissColumns
                                                      }
                                                      noDataIndication={t(
                                                        "No Warning Rules Definition found"
                                                      )}
                                                      defaultSorted={
                                                        defaultSorting
                                                      }
                                                      filter={filterFactory()}
                                                    />
                                                  </Row>
                                                </CardBody>
                                              </Card>
                                            </Row>

                                            <Row>
                                              <Card>
                                                <CardTitle id="add_header">
                                                  {this.props.t(
                                                    "Trainees Decrees (Register)"
                                                  )}
                                                </CardTitle>
                                                <CardBody>
                                                  <Row>
                                                    <BootstrapTable
                                                      keyField="Id"
                                                      data={
                                                        stdDecreeRegisterData
                                                      }
                                                      columns={
                                                        stdDecreeRegisterColumns
                                                      }
                                                      noDataIndication={t(
                                                        "No Warning Rules Definition found"
                                                      )}
                                                      defaultSorted={
                                                        defaultSorting
                                                      }
                                                      filter={filterFactory()}
                                                    />
                                                  </Row>
                                                </CardBody>
                                              </Card>
                                            </Row>
                                          </Col>
                                        </Row>
                                      </ModalBody>
                                    </Modal>
                                  </div>
                                </Col>
                              </Row>
                              <Row className="align-items-md-center mt-30">
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </Col>
                              </Row>
                            </React.Fragment>
                          )}
                        </ToolkitProvider>
                      )}
                    </PaginationProvider>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

/*
const mapStateToProps = ({ state }) => ({
  traineesDecrees: state.traineesDecrees,
});
*/

const mapStateToProps = ({
  traineesDecrees,
  trainees,
  mobAppFacultyAccs,
  departments,
  years,
  decrees,
  menu_items,
}) => ({
  filteredCourses: traineesDecrees.filteredCoursesPlans,
  traineesDecrees: traineesDecrees.traineesDecrees,
  deleted: traineesDecrees.deleted,
  decreeStatus: traineesDecrees.decreeStatus,
  traineeDecreesDismiss: traineesDecrees.traineeDecreesDismiss,
  faculties: mobAppFacultyAccs.faculties,
  years: years.years,
  filteredDepartments: departments.filteredDepartments,
  departments: departments.departments,
  decrees: decrees.decrees,
  decreeRulesReasons: decrees.decreeRulesReasons,
  traineesOpt: trainees.traineesOpt,
  coursesDecrees: traineesDecrees.coursesDecrees,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  // onGetFilteredCoursesPlan: planId => dispatch(getFilteredCoursesPlans(planId)),
  onGetTraineeDecreesDismiss: traineeId =>
    dispatch(getTraineeDecreesDismiss(traineeId)),
  onGetCoursesDecrees: () => dispatch(getCoursesDecrees()),
  onGetTraineesDecrees: () => dispatch(getTraineesDecrees()),
  onGetDecrees: () => dispatch(getDecrees()),
  onGetDecreesRulesReason: decreeId =>
    dispatch(getDecreesRulesReasons(decreeId)),
  onAddNewTraineesDecree: traineesDecree =>
    dispatch(addNewTraineesDecree(traineesDecree)),
  onUpdateTraineesDecree: traineesDecree =>
    dispatch(updateTraineesDecree(traineesDecree)),
  onDeleteTraineesDecree: traineesDecree =>
    dispatch(deleteTraineesDecree(traineesDecree)),
  onGetTraineesDecreeDeletedValue: () =>
    dispatch(getTraineesDecreeDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(TraineesDecreesList)));
