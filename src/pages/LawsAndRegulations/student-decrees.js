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
  getStudentsDecrees,
  addNewStudentsDecree,
  updateStudentsDecree,
  deleteStudentsDecree,
  getStudentsDecreeDeletedValue,
  getFilteredCoursesPlans,
  getUniversityStudentsDecrees,
  getStudentDecreesDismiss,
  getCoursesDecrees,
} from "store/student-decrees/actions";
import { getUniversityStudents } from "store/university-students/actions";
import {
  getDecisions,
  getDecisionsRulesReasons,
} from "store/decisions/actions";

import { isEmpty, size, map } from "lodash";
import { CloseBoxMultipleIcon } from "@icons/material";
import { checkIsAddForPage , checkIsDeleteForPage,   checkIsEditForPage,
  checkIsSearchForPage,} from "../../utils/menuUtils";
class StudentsDecreesList extends Component {
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
      studentsDecree: "",
      modal: false,
      addModal: false,
      deleteModal: false,
      selectedFaculty: null,
      selectedDepartment: null,
      selectedBeginSemester: null,
      selectedEndSemester: null,
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

    this.handleStudentsDecreeClick = this.handleStudentsDecreeClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleStudentsDecreeClicks =
      this.handleStudentsDecreeClicks.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.handleMulti = this.handleMulti.bind(this);
  }

  componentDidMount() {
    const {
      studentsDecrees,
      onGetStudentsDecrees,
      faculties,
      yearSemesters,
      filteredDepartments,
      departments,
      deleted,
      studentDecreesDismiss,
      decreeStatus,
      onGetDecisions,
      onGetUniversityStudents,
      onGetCoursesDecrees,
      onGetDecisionsRulesReason,
      universityStudents,
      user_menu
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (!studentsDecrees || studentsDecrees.length === 0) {
      onGetStudentsDecrees();
      onGetDecisions();
      onGetUniversityStudents();
      onGetCoursesDecrees();
      onGetDecisionsRulesReason();
    }
    this.setState({ studentsDecrees, deleted, decreeStatus, studentDecreesDismiss });
    this.setState({ faculties });
    this.setState({ yearSemesters });
    this.setState({ filteredDepartments });
    this.setState({ departments });
    this.setState({ universityStudents });
  }
  componentDidUpdate(prevProps) {
    if (this.props.universityStudents !== prevProps.universityStudents) {
      this.forceUpdate();
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

  toggle(decision) {
    const { decisionCategoryId, studentsDecree } = this.state;
    const { filteredCourses, coursesDecrees } = this.props;

    if (decision == 3 || decision == 2) {
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

  handleStudentsDecreeClicks = () => {
    this.setState({
      studentsDecree: "",
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

  onClickDelete = studentsDecree => {
    this.setState({ studentsDecree: studentsDecree });
    this.setState({ deleteModal: true });
  };

  handleDeleteStudentsDecree = () => {
    const { onDeleteStudentsDecree } = this.props;
    const { studentsDecree } = this.state;

    if (studentsDecree.Id !== undefined) {
      let onDelete = { Id: studentsDecree.Id };
      onDeleteStudentsDecree(onDelete);
    }
    this.setState({ deleteModal: false, showAlert: true });
  };

  handleStudentsDecreeClick = arg => {
    const {
      universityStudents,
      decisions,
      onGetFilteredCoursesPlan,
      coursesDecrees,
      decisionRulesReasons
    } = this.props;
    let studentsDecree = arg;

    const decisionRulesReasonsModified = decisionRulesReasons.map(item => ({
      value: item.Id,
      label: item.arTitle,
    }));



    studentsDecree["studentname"] = universityStudents.find(
      student => student.SID === arg["StudentId"]
    ).studentname;
    studentsDecree["decision"] = decisions.find(
      decision => decision.Id === arg["decisionRuleId"]
    ).arTitle;
    let decisionCat = decisions.find(
      decision => decision.Id === arg["decisionRuleId"]
    ).decisionCategoryId;
    if (decisionCat == 3 || decisionCat == 2) {
      const plan = universityStudents.find(
        student => student.studentname === studentsDecree["studentname"]
      );
      if (plan) {
        onGetFilteredCoursesPlan(plan.plan);
      }
    }

    const{onGetStudentDecreesDismiss,  onGetDecisionsRulesReason} = this.props
    onGetStudentDecreesDismiss(studentsDecree)
    onGetDecisionsRulesReason(studentsDecree.decisionRuleId);

    studentsDecree["StudentsDecreesCourses"] = arg["StudentsDecreesCourses"];

    this.setState({
      studentsDecree,
      decisionCategoryId: decisionCat,
      selectedFaculty: arg.facultyId,
      selectedEducation: arg.educationType,
      stdCoursesArray: studentsDecree["StudentsDecreesCourses"],
      selectedReason:  studentsDecree["decisionRuleReasonId"],
      selectedReasonName:  studentsDecree["decreeReasonName"],
      selectedDecreeStatus:  studentsDecree["decreeStateId"],
      selectedDecreeType:  studentsDecree["decreeType"],
      isEdit: true,
    });

    this.toggle(decisionCat);
  };
  handleMulti = selectedMulti => {
    this.setState({ selectedMulti });
  };
  handleSuccessClose = () => {
    const { onGetStudentsDecreeDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetStudentsDecreeDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetStudentsDecreeDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetStudentsDecreeDeletedValue();
  };

  handleAlertClose = () => {
    this.setState({ minMaxValueError: null });
  };
  handleChangeDecision = option => {
    if (option && option.decisionCategoryId) {
      this.setState({ decisionCategoryId: option.decisionCategoryId });
    } else {
      this.setState({ decisionCategoryId: null });
    }
  };
  
  handleSave = values => {
    const {
      onAddNewStudentsDecree,
      decisions,
      universityStudents,
      onUpdateStudentsDecree,
    } = this.props;
    const { studentsDecree , isEdit} = this.state;
    const emptyDecree = {};

    Object.keys(values).forEach(function (key) {
      if (
        values[key] != undefined &&
        (values[key].length > 0 || values[key] != "")
      )
        emptyDecree[key] = values[key];
    });
    emptyDecree["decision"] = undefined;
    emptyDecree["studentName"] = undefined;

    emptyDecree["decisionRuleId"] = decisions.find(
      decision => decision.arTitle === values["decision"]
    ).Id;
    emptyDecree["StudentId"] = universityStudents.find(
      student => student.studentname === values["studentName"]
    ).SID;
    emptyDecree["StudentsDecreesCourses"] = values["StudentsDecreesCourses"];

    if (isEdit == false) {
    emptyDecree["decreeStateId"] = 4;
      onAddNewStudentsDecree(emptyDecree);
      this.setState(prevState => ({
        addModal: !prevState.addModal,
      }));
    } else if (isEdit == true) {
      console.log("edit")
      emptyDecree["Id"] = studentsDecree["Id"];
      onUpdateStudentsDecree(emptyDecree);
      this.setState(prevState => ({
        modal: !prevState.modal,
      }));
    }
  };
  render() {
    //!meta title
    document.title =
      "StudentsDecree List | keyInHands - React Admin & Dashboard Template";

    // const { studentsDecrees } = this.state
    const { SearchBar } = Search;

    const {
      universityStudents,
      studentsDecrees,
      faculties,
      yearSemesters,
      filteredDepartments,
      departments,
      deleted,
      studentDecreesDismiss,
      decisions,
      onGetDecisionsRulesReason,
      decisionRulesReasons,
      onGetFilteredCoursesPlan,
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
    } = this.state;
    const { onAddNewStudentsDecree, onUpdateStudentsDecree } = this.props;
    const studentsDecree = this.state.studentsDecree;

console.log("decreeStatus",decreeStatus)

console.log("isEdit",isEdit)
    const defaultSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: studentsDecrees.length, // replace later with size(studentsDecrees),
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
    const yearSemestersModified = yearSemesters.map(item => ({
      value: item.key,
      label: item.value,
      yearId: item.yearId,
      semesterId: item.semesterId,
    }));

    let filteredOptions = null;
    const updateToSemesterOptions = selectedFromSemester => {
      filteredOptions = yearSemestersModified.filter(
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
      studentsDecree["StudentsDecreesCourses"] &&
      typeof studentsDecree["StudentsDecreesCourses"] === "string"
    ) {
      studentsDecree["StudentsDecreesCourses"] = JSON.parse(
        studentsDecree["StudentsDecreesCourses"]
      );
    }
 
    const { t } = this.props;

    const decisionRulesReasonsModified = decisionRulesReasons.map(item => ({
      value: item.Id,
      label: item.arTitle,
    }));

  
    const l= (decisionRulesReasonsModified.find(
      opt =>
        opt.value ===
        studentsDecree.decisionRuleReasonId
    || ""))



    const studentsDecreeListColumns = [
      {
        text: "id",
        dataField: "Id",
        sort: true,
        hidden: true,
        formatter: (cellContent, studentsDecrees) => <>{studentsDecrees.Id}</>,
        sort: true,
      },
      {
        text: this.props.t("Student Id"),
        dataField: "StudentId",
        sort: true,
        formatter: (cellContent, studentsDecrees) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {studentsDecrees.StudentId}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton
        }),
      },
      {
        text: this.props.t("Student Name"),
        dataField: "studentName",
        sort: true,
        formatter: (cellContent, studentsDecrees) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {studentsDecrees.studentName}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton
        }),
      },
      {
        text: this.props.t("decision Rule"),
        dataField: "decisionRuleId",
        sort: true,
        formatter: (cellContent, studentsDecrees) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {studentsDecrees.decreeName}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton
        }),
      },
      {
        text: this.props.t("Decision Rule Reason"),
        dataField: "decisionRuleReasonId",
        sort: true,
        formatter: (cellContent, studentsDecrees) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
              {studentsDecrees.decreeReasonName}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton
        }),
      },
      {
        text: this.props.t("Date"),
        dataField: "insertDate",
        sort: true,
        formatter: (cellContent, studentsDecrees) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {studentsDecrees.insertDate
                  ? studentsDecrees.insertDate.slice(0, 10)
                  : ""}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton
        }),
      },
      {
        text: this.props.t("Decree Status"),
        dataField: "decreeStateId",
        sort: true,
        formatter: (cellContent, studentsDecrees) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
              {studentsDecrees.decreeStateName}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton
        }),
      },

      {
        text: this.props.t("Semester"),
        dataField: "yearSemesterId",
        sort: true,
        formatter: (cellContent, studentsDecrees) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
              {studentsDecrees.yearSemesterName}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton
        }),
      },

      {
        dataField: "menu",
        isDummyField: true,
        editable: false,
        text: this.props.t("Action"),
        formatter: (cellContent, studentsDecree) => (
          <div className="d-flex gap-3">
            {showEditButton &&(
            <Link className="text-success" to="#">
              <i
                className="mdi mdi-pencil font-size-18"
                id="edittooltip"
                onClick={() => this.handleStudentsDecreeClick(studentsDecree)}
              ></i>
            </Link>)}
            {showDeleteButton &&(
            <Link className="text-danger" to="#">
              <i
                className="mdi mdi-delete font-size-18"
                id="deletetooltip"
                onClick={() => this.onClickDelete(studentsDecree)}
              ></i>
            </Link>)}
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
        formatter: (cellContent, studentsDecrees) => (
          <>
                {studentsDecrees.insertDate
                  ? studentsDecrees.insertDate.slice(0, 10)
                  : ""}
          </>
        ),
        sort: true,
      },

      {
        text: this.props.t("Decree Date"),
        dataField: "decreeDate",
        formatter: (cellContent, studentsDecrees) => (
          <>
                {studentsDecrees.decreeDate
                  ? studentsDecrees.decreeDate.slice(0, 10)
                  : ""}
          </>
        ),
        sort: true,
      },
      {
        text: this.props.t("Decree Semester"),
        dataField: "yearSemesterName",
        sort: true,
      },
      {
        text: this.props.t("Decree Status"),
        dataField: "decreeStateName",
        sort: true,
      },
    ];

    const stdDecreeRegisterData =[]

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
        text: this.props.t("Student Status"),
        dataField: "stdStatus",
        sort: true,
      },
    ];

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteStudentsDecree}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title={t("Students Decrees")}
              breadcrumbItem={t("Students Decrees List")}
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
                      columns={studentsDecreeListColumns}
                      data={studentsDecrees}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="Id"
                          columns={studentsDecreeListColumns}
                          data={this.props.studentsDecrees}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4"></Col>
                                <Col sm="8">
                                  {showAddButton && (
                                  <div className="text-sm-end">
                                    <Tooltip
                                      title={t("Create New")}
                                      placement="top"
                                    >
                                      <IconButton
                                        color="primary"
                                        onClick={
                                          this.handleStudentsDecreeClicks
                                        }
                                      >
                                        <i className="mdi mdi-plus-circle blue-noti-icon" />
                                      </IconButton>
                                    </Tooltip>
                                  </div>)}
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
                                          ? this.props.t("Edit StudentsDecree")
                                          : this.props.t("Add StudentsDecree")}
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
                                              initialValues={
                                               {
                                                yearSemesterId:
                                                  null ||
                                                  studentsDecree.yearSemesterId,
                                                studentName:
                                                  studentsDecree.studentname ||
                                                  "",
                                                decisionRuleReasonId: studentsDecree.decisionRuleReasonId,
                                                decision:
                                                  "" || studentsDecree.decision,
                                                absenceRate:
                                                  studentsDecree.absenceRate ||
                                                  "",
                                                insertDate:
                                                  studentsDecree.insertDate
                                                    ? studentsDecree.insertDate.split(
                                                        "T"
                                                      )[0]
                                                    : "",
                                                note: "",
                                                StudentsDecreesCourses:
                                                 [],
                                                fromYearSemesterId:
                                                  null ||
                                                  studentsDecree.fromYearSemesterId,
                                                toYearSemesterId:
                                                  null ||
                                                  studentsDecree.toYearSemesterId,
                                                 

                                              }}
                                              validationSchema={Yup.object().shape(
                                                {
                                                  yearSemesterId: Yup.number()
                                                    .required(
                                                      "Current Semester is required"
                                                    )
                                                    .nullable(),
                                                  
                                                  fromYearSemesterId:
                                                    Yup.number().when(
                                                      "decision",
                                                      {
                                                        is: decision => {
                                                          const decisionObject =
                                                            decisions.find(
                                                              d =>
                                                                d.arTitle ===
                                                                decision
                                                            );
                                                          return (
                                                            decisionObject &&
                                                            decisionObject.decisionCategoryId ===
                                                              6
                                                          );
                                                        },
                                                        then: Yup.number()
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
                                                      "decision",
                                                      {
                                                        is: decision => {
                                                          const decisionObject =
                                                            decisions.find(
                                                              d =>
                                                                d.arTitle ===
                                                                decision
                                                            );
                                                          return (
                                                            decisionObject &&
                                                            decisionObject.decisionCategoryId ===
                                                              6
                                                          );
                                                        },
                                                        then: Yup.number()
                                                          .required(
                                                            "Semester is required"
                                                          )
                                                          .nullable(),
                                                        otherwise:
                                                          Yup.number().nullable(),
                                                      }
                                                    ),
                                                  StudentsDecreesCourses:
                                                    Yup.array()
                                                      .nullable()
                                                      .when("decision", {
                                                        is: decision => {
                                                          const decisionObject =
                                                            decisions.find(
                                                              d =>
                                                                d.arTitle ===
                                                                decision
                                                            );
                                                          return (
                                                            decisionObject &&
                                                            (decisionObject.decisionCategoryId ===
                                                              3 ||
                                                              decisionObject.decisionCategoryId ===
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
                                                  decisionRuleReasonId:
                                                    Yup.object().nullable(),
                                                  decision: Yup.string()
                                                    .required(
                                                      "Decision is required"
                                                    )
                                                    .test(
                                                      "is-valid-decision",
                                                      "Invalid decision",
                                                      value => {
                                                        return decisions.some(
                                                          decision =>
                                                            decision.arTitle ===
                                                            value
                                                        );
                                                      }
                                                    ),
                                                  studentName: Yup.string()
                                                    .required(
                                                      "Student is required"
                                                    )
                                                    .test(
                                                      "is-valid-student",
                                                      "Invalid student",
                                                      value => {
                                                        return universityStudents.some(
                                                          student =>
                                                            student.studentname ===
                                                            value
                                                        );
                                                      }
                                                    ),
                                                  absenceRate:
                                                    Yup.number().when(
                                                      "decision",
                                                      {
                                                        is: decision => {
                                                          const decisionObject =
                                                            decisions.find(
                                                              d =>
                                                                d.arTitle ===
                                                                decision
                                                            );

                                                          return (
                                                            decisionObject &&
                                                            decisionObject.decisionCategoryId ===
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
                                                            yearSemestersModified
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
                                                          defaultValue={yearSemestersModified.find(
                                                            opt =>
                                                              opt.value ===
                                                              studentsDecree.yearSemesterId
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
                                                          htmlFor="decision"
                                                          className="form-label d-flex"
                                                        >
                                                          {this.props.t(
                                                            "Decision"
                                                          )}
                                                          <span className="text-danger">
                                                            *
                                                          </span>
                                                        </label>
                                                      </Col>
                                                      <Col lg="8">
                                                        <Field
                                                          name="decision"
                                                          type="text"
                                                          list="decisionList"
                                                          className={`form-control ${
                                                            errors.decision &&
                                                            touched.decision
                                                              ? "is-invalid"
                                                              : ""
                                                          }`}
                                                          onChange={e => {
                                                            handleChange(e);
                                                            const arTitle =
                                                              e.target.value;

                                                            const decision =
                                                              decisions.find(
                                                                decision =>
                                                                  decision.arTitle ===
                                                                  arTitle
                                                              );

                                                            if (decision) {
                                                              onGetDecisionsRulesReason(
                                                                decision.Id
                                                              );
                                                            }
                                                            this.handleChangeDecision(
                                                              decision
                                                            );
                                                          }}
                                                        />
                                                        <datalist id="decisionList">
                                                          {decisions.map(
                                                            decision => (
                                                              <option
                                                                key={
                                                                  decision.Id
                                                                }
                                                                value={
                                                                  decision.arTitle
                                                                }
                                                              />
                                                            )
                                                          )}
                                                        </datalist>
                                                        <ErrorMessage
                                                          name="decision"
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
                                                          htmlFor="studentName"
                                                          className="form-label d-flex"
                                                        >
                                                          {this.props.t(
                                                            "Student Names"
                                                          )}{" "}
                                                          <span className="text-danger">
                                                            *
                                                          </span>
                                                        </label>
                                                      </Col>
                                                      <Col lg="8">
                                                        <Field
                                                          name="studentName"
                                                          type="text"
                                                          list="studentNameList"
                                                          className={`form-control ${
                                                            errors.studentName &&
                                                            touched.studentName
                                                              ? "is-invalid"
                                                              : ""
                                                          }`}
                                                          onChange={e => {
                                                            const studentname =
                                                              e.target.value;

                                                            const plan =
                                                              universityStudents.find(
                                                                student =>
                                                                  student.studentname ===
                                                                  studentname
                                                              );

                                                            if (plan) {
                                                              onGetFilteredCoursesPlan(
                                                                plan.plan
                                                              );
                                                            }
                                                            handleChange(e);
                                                          }}
                                                        />
                                                        <datalist id="studentNameList">
                                                          {universityStudents.map(
                                                            student => (
                                                              <option
                                                                key={student.Id}
                                                                value={
                                                                  student.studentname
                                                                }
                                                              />
                                                            )
                                                          )}
                                                        </datalist>
                                                        <ErrorMessage
                                                          name="studentName"
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
                                                          htmlFor="decisionRuleReasonId"
                                                          className="form-label d-flex"
                                                        >
                                                          {this.props.t("Reason")}
                                                          <span className="text-danger">
                                                            *
                                                          </span>
                                                        </label>
                                                      </Col>
                                                      <Col lg="8">
                                                        <Field
                                                          name="decisionRuleReasonId"
                                                          options={
                                                            decisionRulesReasonsModified
                                                          }
                                                          component={Select}
                                                          onChange={option =>
                                                            setFieldValue(
                                                              "decisionRuleReasonId",
                                                              option.value
                                                            )
                                                          }
                                                          className={`select-style-std ${
                                                            errors.decisionRuleReasonId &&
                                                            touched.decisionRuleReasonId
                                                              ? "is-invalid"
                                                              : ""
                                                          }`}
                                                        />
                                                        <ErrorMessage
                                                          name="decisionRuleReasonId"
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
                                                               {this.props.t("Absence Percentage")}
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
                                                      <div className="mb-3">
                                                        <Row>
                                                          <Col lg="4">
                                                            <label
                                                              htmlFor="absenceRate"
                                                              className="form-label d-flex"
                                                            >
                                                          {this.props.t("Courses")}
                                                              <span className="text-danger">
                                                                *
                                                              </span>
                                                            </label>
                                                          </Col>
                                                          <Col lg="8">
                                                            <Field
                                                              name="StudentsDecreesCourses"
                                                              component={Select}
                                                              options={
                                                                filteredCoursesModified
                                                              }
                                                              defaultValue={
                                                                stdCoursesArray
                                                              }
                                                              isMulti
                                                              onChange={selectedOptions => {
                                                                setFieldValue(
                                                                  "StudentsDecreesCourses",
                                                                  selectedOptions
                                                                );
                                                              }}
                                                              className={`${
                                                                errors.StudentsDecreesCourses &&
                                                                touched.StudentsDecreesCourses
                                                                  ? "is-invalid"
                                                                  : ""
                                                              }`}
                                                            />
                                                            <ErrorMessage
                                                              name="StudentsDecreesCourses"
                                                              component="div"
                                                              className="invalid-feedback"
                                                            />
                                                          </Col>
                                                        </Row>
                                                      </div>
                                                    )}
                                                  {decisionCategoryId &&
                                                    decisionCategoryId == 6 && (
                                                      <>
                                                        <Row className="mb-3">
                                                          <Col lg="4">
                                                            <label
                                                              htmlFor="fromYearSemesterId"
                                                              className="form-label d-flex"
                                                            >
                                                              From{" "}
                                                              <span className="text-danger">
                                                                *
                                                              </span>
                                                            </label>{" "}
                                                          </Col>

                                                          <Col lg="8">
                                                            <Field
                                                              name="fromYearSemesterId"
                                                              options={
                                                                yearSemestersModified
                                                              }
                                                              onChange={option => {
                                                                setFieldValue(
                                                                  "fromYearSemesterId",
                                                                  option.value
                                                                );

                                                                updateToSemesterOptions(
                                                                  option
                                                                );
                                                              }}
                                                              component={Select}
                                                              className={`select-style-std ${
                                                                errors.fromYearSemesterId &&
                                                                touched.fromYearSemesterId
                                                                  ? "is-invalid"
                                                                  : ""
                                                              }`}
                                                              placeholder="From Semester"
                                                              defaultValue={yearSemestersModified.find(
                                                                opt =>
                                                                  opt.value ===
                                                                  studentsDecree.fromYearSemesterId
                                                              )}
                                                            />

                                                            <ErrorMessage
                                                              name="fromYearSemesterId"
                                                              component="div"
                                                              className="invalid-feedback"
                                                            />
                                                          </Col>
                                                        </Row>
                                                        <Row className="mb-3">
                                                          <Col lg="4">
                                                            <label
                                                              htmlFor="toYearSemesterId"
                                                              className="form-label d-flex"
                                                            >
                                                              To{" "}
                                                              <span className="text-danger">
                                                                *
                                                              </span>
                                                            </label>{" "}
                                                          </Col>
                                                          <Col lg="8">
                                                            {" "}
                                                            <Field
                                                              name="toYearSemesterId"
                                                              key={`select_endSemester`}
                                                              options={
                                                                filteredOptions
                                                              }
                                                              onChange={option => {
                                                                setFieldValue(
                                                                  "toYearSemesterId",
                                                                  option.value
                                                                );
                                                              }}
                                                              component={Select}
                                                              className={`select-style-std ${
                                                                errors.toYearSemesterId &&
                                                                touched.toYearSemesterId
                                                                  ? "is-invalid"
                                                                  : ""
                                                              }`}
                                                              defaultValue={yearSemestersModified.find(
                                                                opt =>
                                                                  opt.value ===
                                                                  studentsDecree.toYearSemesterId
                                                              )}
                                                              placeholder="To Semester"
                                                            />
                                                            <ErrorMessage
                                                              name="toYearSemesterId"
                                                              component="div"
                                                              className="invalid-feedback"
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
                                                           {this.props.t("Adding Date")}
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
                                                      {this.props.t(
                                                                      "Save"
                                                                    )}                               
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
                                          ? this.props.t("Edit StudentsDecree")
                                          : this.props.t("Add StudentsDecree")}
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
                                                (isEdit &&{
                                                  Id: studentsDecree.Id,
                                                yearSemesterId:
                                                  null ||
                                                  studentsDecree.yearSemesterId,
                                                studentName:
                                                  studentsDecree.studentname ||
                                                  "",
                                                decisionRuleReasonId: studentsDecree.decisionRuleReasonId,
                                                decision:
                                                  "" || studentsDecree.decision,
                                                absenceRate:
                                                  studentsDecree.absenceRate ||
                                                  "",
                                                insertDate: studentsDecree.insertDate
                                                  ? new Date(studentsDecree.insertDate).toISOString().split("T")[0]
                                                  : "",
                                                note: studentsDecree.note,
                                                StudentsDecreesCourses:
                                                stdCoursesArray ,
                                                fromYearSemesterId:
                                                  null ||
                                                  studentsDecree.fromYearSemesterId,
                                                toYearSemesterId:
                                                  null ||
                                                  studentsDecree.toYearSemesterId,
                                                  decreeNum:  studentsDecree.decreeNum,
                                                  decreeType:  studentsDecree.decreeType,
                                                  decreeDate: studentsDecree.decreeDate
                                                  ? new Date(studentsDecree.decreeDate).toISOString().split("T")[0]
                                                  : "",
                                                  decreeStateId:  studentsDecree.decreeStateId,
                                                  councilDecree:  studentsDecree.councilDecree,
                                                  councilDate: studentsDecree.councilDate
                                                  ? new Date(studentsDecree.councilDate).toISOString().split("T")[0]
                                                  : "",

                                              })}
                                              validationSchema={Yup.object().shape(
                                                {
                                                  yearSemesterId: Yup.number()
                                                    .required(
                                                      "Current Semester is required"
                                                    )
                                                    .nullable(),
                                               
                                                  fromYearSemesterId:
                                                    Yup.number().when(
                                                      "decision",
                                                      {
                                                        is: decision => {
                                                          const decisionObject =
                                                            decisions.find(
                                                              d =>
                                                                d.arTitle ===
                                                                decision
                                                            );
                                                          return (
                                                            decisionObject &&
                                                            decisionObject.decisionCategoryId ===
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
                                                      "decision",
                                                      {
                                                        is: decision => {
                                                          const decisionObject =
                                                            decisions.find(
                                                              d =>
                                                                d.arTitle ===
                                                                decision
                                                            );
                                                          return (
                                                            decisionObject &&
                                                            decisionObject.decisionCategoryId ===
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
                                                  StudentsDecreesCourses:
                                                    Yup.array()
                                                      .nullable()
                                                      .when("decision", {
                                                        is: decision => {
                                                          const decisionObject =
                                                            decisions.find(
                                                              d =>
                                                                d.arTitle ===
                                                                decision
                                                            );
                                                          return (
                                                            decisionObject &&
                                                            (decisionObject.decisionCategoryId ===
                                                              3 ||
                                                              decisionObject.decisionCategoryId ===
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
                                                  decisionRuleReasonId:
                                                    Yup.object().nullable(),
                                                  decision: Yup.string()
                                                    .required(
                                                      "Decision is required"
                                                    )
                                                    .test(
                                                      "is-valid-decision",
                                                      "Invalid decision",
                                                      value => {
                                                        return decisions.some(
                                                          decision =>
                                                            decision.arTitle ===
                                                            value
                                                        );
                                                      }
                                                    ),
                                                  studentName: Yup.string()
                                                    .required(
                                                      "Student is required"
                                                    )
                                                    .test(
                                                      "is-valid-student",
                                                      "Invalid student",
                                                      value => {
                                                        return universityStudents.some(
                                                          student =>
                                                            student.studentname ===
                                                            value
                                                        );
                                                      }
                                                    ),
                                                  absenceRate:
                                                    Yup.number().when(
                                                      "decision",
                                                      {
                                                        is: decision => {
                                                          const decisionObject =
                                                            decisions.find(
                                                              d =>
                                                                d.arTitle ===
                                                                decision
                                                            );

                                                          return (
                                                            decisionObject &&
                                                            decisionObject.decisionCategoryId ===
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
                                                              yearSemestersModified
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
                                                            defaultValue={yearSemestersModified.find(
                                                              opt =>
                                                                opt.value ===
                                                                studentsDecree.yearSemesterId
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
                                                            htmlFor="decision"
                                                            className="form-label d-flex"
                                                          >
                                                            {this.props.t(
                                                              "Decision"
                                                            )}
                                                            <span className="text-danger">
                                                              *
                                                            </span>
                                                          </label>
                                                        </Col>
                                                        <Col lg="8">
                                                          <Field
                                                            name="decision"
                                                            type="text"
                                                            list="decisionList"
                                                            className={`form-control ${
                                                              errors.decision &&
                                                              touched.decision
                                                                ? "is-invalid"
                                                                : ""
                                                            }`}
                                                            onChange={e => {
                                                              handleChange(e);
                                                              const arTitle =
                                                                e.target.value;

                                                              const decision =
                                                                decisions.find(
                                                                  decision =>
                                                                    decision.arTitle ===
                                                                    arTitle
                                                                );

                                                              if (decision) {
                                                                onGetDecisionsRulesReason(
                                                                  decision.Id
                                                                );
                                                              }
                                                              this.handleChangeDecision(
                                                                decision
                                                              );
                                                            }}
                                                          />
                                                          <datalist id="decisionList">
                                                            {decisions.map(
                                                              decision => (
                                                                <option
                                                                  key={
                                                                    decision.Id
                                                                  }
                                                                  value={
                                                                    decision.arTitle
                                                                  }
                                                                />
                                                              )
                                                            )}
                                                          </datalist>
                                                          <ErrorMessage
                                                            name="decision"
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
                                                            htmlFor="studentName"
                                                            className="form-label d-flex"
                                                          >
                                                            {this.props.t(
                                                              "Student Names"
                                                            )}{" "}
                                                            <span className="text-danger">
                                                              *
                                                            </span>
                                                          </label>
                                                        </Col>
                                                        <Col lg="8">
                                                          <Field
                                                            name="studentName"
                                                            type="text"
                                                            list="studentNameList"
                                                            className={`form-control ${
                                                              errors.studentName &&
                                                              touched.studentName
                                                                ? "is-invalid"
                                                                : ""
                                                            }`}
                                                            onChange={e => {
                                                              const studentname =
                                                                e.target.value;

                                                              const plan =
                                                                universityStudents.find(
                                                                  student =>
                                                                    student.studentname ===
                                                                    studentname
                                                                );

                                                              if (plan) {
                                                                onGetFilteredCoursesPlan(
                                                                  plan.plan
                                                                );
                                                              }
                                                              handleChange(e);
                                                            }}
                                                          />
                                                          <datalist id="studentNameList">
                                                            {universityStudents.map(
                                                              student => (
                                                                <option
                                                                  key={
                                                                    student.Id
                                                                  }
                                                                  value={
                                                                    student.studentname
                                                                  }
                                                                />
                                                              )
                                                            )}
                                                          </datalist>
                                                          <ErrorMessage
                                                            name="studentName"
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
                                                            htmlFor="decisionRuleReasonId"
                                                            className="form-label d-flex"
                                                          >
                                                            {this.props.t("Reason")}
                                                            <span className="text-danger">
                                                              *
                                                            </span>
                                                          </label>
                                                        </Col>
                                                        <Col lg="8">
                                                          <Field
                                                            name="decisionRuleReasonId"
                                                            component={Select}
                                                            options={
                                                              decisionRulesReasonsModified
                                                            }
                                                            onChange={option =>
                                                              setFieldValue(
                                                                "decisionRuleReasonId",
                                                                option.value
                                                              )
                                                            }
                                               
                                                            defaultValue={decisionRulesReasonsModified.find(
                                                              opt =>
                                                                opt.value ===
                                                                studentsDecree.decisionRuleReasonId
                                                           )}
                                                            className={`select-style-std ${
                                                              errors.decisionRuleReasonId &&
                                                              touched.decisionRuleReasonId
                                                                ? "is-invalid"
                                                                : ""
                                                            }`}
                                                          />
                                                          <ErrorMessage
                                                            name="decisionRuleReasonId"
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
                                                                  {this.props.t("Absence Percentage")}
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
                                                        <div className="mb-3">
                                                          <Row>
                                                            <Col>
                                                              <label
                                                                htmlFor="absenceRate"
                                                                className="form-label d-flex"
                                                              >
                                                                {this.props.t("Courses")}
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </label>
                                                            </Col>
                                                            <Col lg="7">
                                                              <Field
                                                                name="StudentsDecreesCourses"
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
                                                                    "StudentsDecreesCourses",
                                                                    selectedOptions
                                                                  );
                                                                }}
                                                                className={`${
                                                                  errors.StudentsDecreesCourses &&
                                                                  touched.StudentsDecreesCourses
                                                                    ? "is-invalid"
                                                                    : ""
                                                                }`}
                                                              />
                                                              <ErrorMessage
                                                                name="StudentsDecreesCourses"
                                                                component="div"
                                                                className="invalid-feedback"
                                                              />
                                                            </Col>
                                                          </Row>
                                                        </div>
                                                      )}
                                                    {decisionCategoryId &&
                                                      decisionCategoryId ==
                                                        6 && (
                                                        <>
                                                          <Row className="mb-3">
                                                            <Col>
                                                              <label
                                                                htmlFor="fromYearSemesterId"
                                                                className="form-label d-flex"
                                                              >
                                                                From{" "}
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </label>{" "}
                                                            </Col>

                                                            <Col lg="7">
                                                              <Field
                                                                name="fromYearSemesterId"
                                                                options={
                                                                  yearSemestersModified
                                                                }
                                                                onChange={option => {
                                                                  setFieldValue(
                                                                    "fromYearSemesterId",
                                                                    option.value
                                                                  );

                                                                  updateToSemesterOptions(
                                                                    option
                                                                  );
                                                                }}
                                                                component={
                                                                  Select
                                                                }
                                                                className={`select-style-std ${
                                                                  errors.fromYearSemesterId &&
                                                                  touched.fromYearSemesterId
                                                                    ? "is-invalid"
                                                                    : ""
                                                                }`}
                                                                placeholder="From Semester"
                                                                defaultValue={yearSemestersModified.find(
                                                                  opt =>
                                                                    opt.value ===
                                                                    studentsDecree.fromYearSemesterId
                                                                )}
                                                              />

                                                              <ErrorMessage
                                                                name="fromYearSemesterId"
                                                                component="div"
                                                                className="invalid-feedback"
                                                              />
                                                            </Col>
                                                          </Row>
                                                          <Row className="mb-3">
                                                            <Col>
                                                              <label
                                                                htmlFor="toYearSemesterId"
                                                                className="form-label d-flex"
                                                              >
                                                                To{" "}
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </label>{" "}
                                                            </Col>
                                                            <Col lg="7">
                                                              {" "}
                                                              <Field
                                                                name="toYearSemesterId"
                                                                key={`select_endSemester`}
                                                                options={
                                                                  filteredOptions
                                                                }
                                                                onChange={option => {
                                                                  setFieldValue(
                                                                    "toYearSemesterId",
                                                                    option.value
                                                                  );
                                                                }}
                                                                component={
                                                                  Select
                                                                }
                                                                className={`select-style-std ${
                                                                  errors.toYearSemesterId &&
                                                                  touched.toYearSemesterId
                                                                    ? "is-invalid"
                                                                    : ""
                                                                }`}
                                                                defaultValue={yearSemestersModified.find(
                                                                  opt =>
                                                                    opt.value ===
                                                                    studentsDecree.toYearSemesterId
                                                                )}
                                                                placeholder="To Semester"
                                                              />
                                                              <ErrorMessage
                                                                name="toYearSemesterId"
                                                                component="div"
                                                                className="invalid-feedback"
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
                                                            {this.props.t("Adding Date")}
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
                                                             {this.props.t("note")}
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
                                                            {this.props.t("Decree Date")}
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
                                                           {this.props.t("Decree Number")}
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
                                                            {this.props.t("Council Date")}
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
                                                             {this.props.t("Council Decree")}
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
                                                     {this.props.t(
                                                                      "Save"
                                                                    )}
                                                  </button>
                                                </Form>
                                              )}
                                            </Formik>
                                          </Col>
                                          <Col lg="8">
                                            <Row>
                                              <Card>
                                                <CardTitle id="add_header">
                                                  {studentsDecree.studentName +
                                                    "  " +
                                                    studentsDecree.StudentId}
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
                                                           
                                                              {this.props.t( "Academic Advisor")}
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
                                                                "Student State"
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
                                                            
                                                              {this.props.t( "Current Semes State")}
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
                                                    "Students Decrees (Dismiss)"
                                                  )}
                                                </CardTitle>
                                                <CardBody>
                                                  <Row>
                                                    <BootstrapTable
                                                      keyField="Id"
                                                      data={studentDecreesDismiss}
                                                      columns={stdDecreeDismissColumns}
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
                                                    "Students Decrees (Register)"
                                                  )}
                                                </CardTitle>
                                                <CardBody>
                                                  <Row>
                                                    <BootstrapTable
                                                      keyField="Id"
                                                      data={stdDecreeRegisterData}
                                                      columns={stdDecreeRegisterColumns}
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
  studentsDecrees: state.studentsDecrees,
});
*/

const mapStateToProps = ({
  studentsDecrees,
  generalManagements,
  mobAppFacultyAccs,
  departments,
  decisions,
  menu_items
}) => ({
  filteredCourses: studentsDecrees.filteredCoursesPlans,
  studentsDecrees: studentsDecrees.studentsDecrees,
  deleted: studentsDecrees.deleted,
  decreeStatus: studentsDecrees.decreeStatus,
  studentDecreesDismiss: studentsDecrees.studentDecreesDismiss,
  faculties: mobAppFacultyAccs.faculties,
  yearSemesters: generalManagements.yearSemesters,
  filteredDepartments: departments.filteredDepartments,
  departments: departments.departments,
  decisions: decisions.decisions,
  decisionRulesReasons: decisions.decisionRulesReasons,
  universityStudents: studentsDecrees.universityStudentsDecrees,
  coursesDecrees: studentsDecrees.coursesDecrees,
  user_menu: menu_items.user_menu || [],

});

const mapDispatchToProps = dispatch => ({
  onGetFilteredCoursesPlan: planId => dispatch(getFilteredCoursesPlans(planId)),
  onGetStudentDecreesDismiss: studentId => dispatch(getStudentDecreesDismiss(studentId)),
  onGetCoursesDecrees: () => dispatch(getCoursesDecrees()),
  onGetUniversityStudents: () => dispatch(getUniversityStudentsDecrees()),
  onGetStudentsDecrees: () => dispatch(getStudentsDecrees()),
  onGetDecisions: () => dispatch(getDecisions()),
  onGetDecisionsRulesReason: decisionId =>
    dispatch(getDecisionsRulesReasons(decisionId)),
  onAddNewStudentsDecree: studentsDecree =>
    dispatch(addNewStudentsDecree(studentsDecree)),
  onUpdateStudentsDecree: studentsDecree =>
    dispatch(updateStudentsDecree(studentsDecree)),
  onDeleteStudentsDecree: studentsDecree =>
    dispatch(deleteStudentsDecree(studentsDecree)),
  onGetStudentsDecreeDeletedValue: () =>
    dispatch(getStudentsDecreeDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(StudentsDecreesList)));
