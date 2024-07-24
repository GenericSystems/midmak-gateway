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

import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import {
  addNewAcademicCertificate,
  updateAcademicCertificate,
  deleteAcademicCertificate,
} from "store/academicvertificates/actions";

import {
  getStudentsHistory,
  calculateStudentHistory,
  calculateAllStudentHistory,
} from "store/students-history/actions";

import { isEmpty, size, map } from "lodash";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../utils/menuUtils";

import { getUnivStdDataList } from "store/transportLines/actions";

class StudentsHistory extends Component {
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
      modal: false,
      deleteModal: false,
      selectedFaculty: null,
      selectedMajorType: null,
      selectedDepartment: null,
      selectedBeginSemester: null,
      selectedEndSemester: null,
      selectedEducation: "",
      showAlert: null,
      minMaxValueError: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      hideSemester: true,
    };
    this.toggle = this.toggle.bind(this);
    this.handleStudentClicks = this.handleStudentClicks.bind(this);
  }

  componentDidMount() {
    const {
      studentsHistory,
      onGetStudentsHistory,
      faculties,
      majorsTypes,
      yearSemesters,
      filteredDepartments,
      departments,
      deleted,
      user_menu,
      univStds,
      onGetUnivStds,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (studentsHistory && !studentsHistory.length) {
      onGetUnivStds();
    }
    this.setState({ studentsHistory, univStds, deleted });
    this.setState({ faculties });
    this.setState({ yearSemesters });
    this.setState({ filteredDepartments });
    this.setState({ departments });
    this.setState({ majorsTypes });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleRadioChange = value => {
    this.setState({ selectedEducation: value });
  };

  handleStudentClicks = () => {
    this.setState({
      academiccertificate: "",
      isEdit: false,
      selectedEducation: "",
    });
    this.toggle();
  };

  initializeState() {
    const { currentSemester, yearSemesters, onGetStudentsHistory } = this.props;
    const { selectedSemester } 
    = this.state;
    const yearsSemestersModified = yearSemesters.map(item => ({
      label: item.value,
      value: item.key,
      yearId: item.yearId,
      semesterId: item.semesterId,
    }));

    this.setState({
      selectedSemester: yearsSemestersModified.find(
        opt => opt.value === currentSemester.cuYearSemesterId
      ),
    });
    onGetStudentsHistory({ yearSemesterId: currentSemester.cuYearSemesterId });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { currentSemester, yearSemesters } = this.props;
    const { selectedSemester } = this.state;
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

  /* Insert,Update Delete data */

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  handleAlertClose = () => {
    this.setState({ minMaxValueError: null });
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

 

  handleSelectChange = (name, value) => {
    const { onGetStudentsHistory } = this.props;
    this.setState({ selectedSemester: value });
    console.log("value", value);
    if (value) {
      const semesterId = value.value;
      onGetStudentsHistory({ yearSemesterId: semesterId, hideSemester: true });
    }
  };

  calculateAllStdHistories = studentId => {
    const { onCalculateAllStudentHistory } = this.props;
    onCalculateAllStudentHistory(studentId);
    console.log("studentId", studentId);
  };

  handleCalculateStdHistory = studentHistory => {
    console.log("studentHistory", studentHistory);
    const { onCalculateStudentHistory } = this.props;
    if (studentHistory) {
      onCalculateStudentHistory({ StudentId: studentHistory.StudentId , YearSemesterId: studentHistory.YearSemesterId});
    }
  };

  render() {
    //meta title
    document.title =
      "AcademicCertificate List | keyInHands - React Admin & Dashboard Template";

    const { SearchBar } = Search;

    const {
      studentsHistory,
      faculties,
      majorsTypes,
      yearSemesters,
      filteredDepartments,
      departments,
      deleted,
      univStds,
    } = this.props;

    const {
      isEdit,
      deleteModal,
      showAlert,
      arTitleSaveError,
      academicNumberError,
      facultieIdError,
      minMaxValueError,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
      selectedSemester,
      hideSemester,
      selectedStudentId,
    } = this.state;

    const universityStdModified = univStds.map(student => ({
      key: student.key,
      value: `${student.value}${student.key}`,
    }));

    const yearsSemestersModified = yearSemesters.map(item => ({
      label: item.value,
      value: item.key,
      yearId: item.yearId,
      semesterId: item.semesterId,
    }));

    // console.log("in render selectedStudentId", selectedStudentId);

    const { onAddNewAcademicCertificate, onUpdateAcademicCertificate } =
      this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: studentsHistory.length,
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "Id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    const selectRow = {
      mode: "checkbox",
    };

    const studentsHistoryColumns = [
      {
        text: "id",
        dataField: "Id",
        sort: true,
        hidden: true,
        formatter: (cellContent, studentsHistory) => <>{studentsHistory.Id}</>,
        sort: true,
      },
      {
        text: this.props.t("Student Id"),
        dataField: "StudentId",
        sort: true,
        formatter: (cellContent, studentsHistory) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {studentsHistory.StudentId}
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
        text: this.props.t("Student Name"),
        dataField: "studentName",
        sort: true,
        formatter: (cellContent, studentsHistory) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {studentsHistory.studentName}
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
        text: this.props.t("Semester"),
        dataField: "yearSemester",
        sort: true,
        hidden: hideSemester,
        formatter: (cellContent, studentsHistory) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {studentsHistory.yearSemester}
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
        text: this.props.t("Reg Hrs at Semes"),
        dataField: "RegisterdhoursAtSemester",
        sort: true,
        formatter: (cellContent, studentsHistory) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {studentsHistory.RegisterdhoursAtSemester}
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
        text: this.props.t("Succ Hrs at Semes"),
        dataField: "SuccedhoursAtSemester",
        sort: true,
        formatter: (cellContent, studentsHistory) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {studentsHistory.SuccedhoursAtSemester}
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
        text: this.props.t("MGPA"),
        dataField: "MGPA",
        sort: true,
        formatter: (cellContent, studentsHistory) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {studentsHistory.MGPA}
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
        text: this.props.t("Cumulative Succ Hrs"),
        dataField: "CumulativeSuccedNHour",
        sort: true,
        formatter: (cellContent, studentsHistory) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {studentsHistory.CumulativeSuccedNHour}
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
        text: this.props.t("Cumulative A GPA"),
        dataField: "CumulativeAGPA",
        sort: true,
        formatter: (cellContent, studentsHistory) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {studentsHistory.CumulativeAGPA}
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
        text: this.props.t("Status"),
        dataField: "stdStatus",
        sort: true,
        formatter: (cellContent, studentsHistory) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {studentsHistory.stdStatus}
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
        text: this.props.t("Warning"),
        dataField: "stdWarning",
        sort: true,
        formatter: (cellContent, studentsHistory) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {studentsHistory.stdWarning}
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
        formatter: (cellContent, studentHistory) => (
          <div className="d-flex gap-3">
            {/*   {showEditButton && ( */}
            <Link className="text-primary" to="#">
              <i
                className="bx bx-calculator font-size-18"
                id="edittooltip"
                onClick={() => this.handleCalculateStdHistory(studentHistory)}
              ></i>
            </Link>
            {/* )} */}
          </div>
        ),
      },
    ];
    const yearSemestersModified = yearSemesters.map(item => ({
      value: item.key,
      label: item.value,
      yearId: item.yearId,
      semesterId: item.semesterId,
    }));

    const { t } = this.props;

    const alertMessage =
      deleted === 0
        ? t("Can't Delete (Delete data related to it)")
        : t("Deleted Successfully");
    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteAcademicCertificate}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <Container fluid>
            <Breadcrumbs
              title={t("Academic Certificates")}
              breadcrumbItem={t("Students History")}
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
                      columns={studentsHistoryColumns}
                      data={studentsHistory}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="Id"
                          columns={studentsHistoryColumns}
                          data={studentsHistory}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col lg="4">
                                  <div>
                                    <Dropdown
                                      className=" d-lg-inline-block  "
                                      isOpen={this.state.otherDrp}
                                      toggle={() => {
                                        this.setState({
                                          otherDrp: !this.state.otherDrp,
                                        });
                                      }}
                                    >
                                      {" "}
                                      <DropdownToggle
                                        className="btn header-item noti-icon  p-0 mb-1"
                                        tag="button"
                                      >
                                        <div className="text-sm-end">
                                          <Tooltip
                                            title={t("Student History")}
                                            placement="top"
                                          >
                                            <IconButton
                                              color="primary"
                                              onClick={this.handleStudentClicks}
                                            >
                                              <i className="fas fa-user-graduate blue-noti-icon" />
                                            </IconButton>
                                          </Tooltip>
                                        </div>
                                      </DropdownToggle>
                                      <DropdownMenu className="dropdown-mega-menu-xl dropdown-megamenu">
                                        {" "}
                                        <Row>
                                          <Col>
                                            <Input
                                              type="text"
                                              name="studentId"
                                              id="student-Id"
                                              list="certificateDatalistOptions"
                                              placeholder="Type to search..."
                                              onBlur={() =>
                                                this.handleInputBlur(
                                                  "studentId"
                                                )
                                              }
                                              onFocus={() =>
                                                this.handleInputFocus(
                                                  "studentId"
                                                )
                                              }
                                              onChange={event =>
                                                this.handleSelectStudent(
                                                  event,
                                                  "studentId"
                                                )
                                              }
                                              className={`form-control`}
                                              value={
                                                (
                                                  univStds.find(
                                                    student =>
                                                      student.key === ""
                                                  ) || ""
                                                ).value
                                              }
                                            />
                                            <datalist id="certificateDatalistOptions">
                                              {universityStdModified.map(
                                                student => (
                                                  <option
                                                    key={student.key}
                                                    value={student.value}
                                                  />
                                                )
                                              )}
                                            </datalist>
                                          </Col>
                                        </Row>
                                        <Row className="d-flex mt-2 justify-content-center">
                                          <Col className="text-center">
                                            <button
                                              size="md"
                                              className="btn save-button"
                                              style={{ background: "#0086BF" }}
                                              onClick={() =>
                                                this.calculateAllStdHistories(
                                                  selectedStudentId
                                                )
                                              }
                                              disabled={!selectedStudentId}
                                            >
                                              {this.props.t(
                                                "Calculate all history for student"
                                              )}
                                            </button>
                                          </Col>
                                        </Row>
                                      </DropdownMenu>
                                    </Dropdown>
                                  </div>
                                </Col>
                                <Col lg="3">
                                  <Select
                                    className="select-style-semesterId mt-3"
                                    name="semesterId"
                                    key={`semesterId`}
                                    options={yearsSemestersModified}
                                    onChange={newValue => {
                                      this.handleSelectChange(
                                        "semesterId",
                                        newValue
                                      );
                                    }}
                                    value={selectedSemester}
                                  />
                                  <br />
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

const mapStateToProps = ({
  studentsHistory,
  transportLines,
  generalManagements,
  mobAppFacultyAccs,
  departments,
  menu_items,
  majorsTypes,
  semesters,
}) => ({
  studentsHistory: studentsHistory.studentsHistory,
  deleted: studentsHistory.deleted,
  univStds: transportLines.univStds,
  currentSemester: semesters.currentSemester,
  faculties: mobAppFacultyAccs.faculties,
  yearSemesters: generalManagements.yearSemesters,
  filteredDepartments: departments.filteredDepartments,
  departments: departments.departments,
  majorsTypes: majorsTypes.majorsTypes,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetStudentsHistory: yearSemester =>
    dispatch(getStudentsHistory(yearSemester)),
  onCalculateStudentHistory: studentHistory =>
    dispatch(calculateStudentHistory(studentHistory)),
  onCalculateAllStudentHistory: studentHistory =>
    dispatch(calculateAllStudentHistory(studentHistory)),
  onGetUnivStds: () => dispatch(getUnivStdDataList()),
  onGetCurrentSemester: () => dispatch(getCurrentSemester()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(StudentsHistory)));
