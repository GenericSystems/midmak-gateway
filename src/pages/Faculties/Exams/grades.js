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
} from "reactstrap";
import Tooltip from "@mui/material/Tooltip";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
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

import {
  getGrades,
  updateGrade,
  getCourseContentsGrades,
  getCourseStatistics,
} from "store/grades/actions";
import { getFilteredSections } from "store/scheduling-lectures/actions";
import { getCoursesOpt } from "store/courses/actions";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import { withRouter, Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
import { CollectionsOutlined } from "@mui/icons-material";
class GradesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowId: null,
      selectedView: "",
      selectedSection: "",
      selectedCourse: "",
      selectedCourseId: "",
      selectedCourseCode: "",
      selectedCourseData: [],
      errorMessage: null,
      sidebarOpen: true,
      selectedCourseId: null,
    };
    this.toggleSidebar = this.toggleSidebar.bind(this);
  }
  componentDidMount() {
    const {
      grades,
      onGetCoursesOpt,
      coursesOpt,
      onGetCourseContentsGrades,
      courseContents_grades,
      filteredSections,
      currentSemester,
      user_menu
    } = this.props;
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (grades && !grades.length) {
      const obj = {
        courseId: 0,
      };
      onGetCoursesOpt() && onGetCourseContentsGrades(obj);
      this.setState({ grades });
      this.setState({ courseContents_grades });
      this.setState({ coursesOpt });
      this.setState({ currentSemester });
      this.setState({ filteredSections });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      this.props.user_menu !== prevProps.user_menu ||
      this.props.location.pathname !== prevProps.location.pathname
    ) {
    
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

  handleButtonClick = (fieldName, selectedValue) => {
    const { selectedCourseId, selectedCourseCode } = this.state;
    const { onGetGrades } = this.props;
    this.setState({ selectedView: selectedValue });
    if (selectedValue == "all") {
      const obj = {
        courseId: selectedCourseId,
        CourseCode: selectedCourseCode,
        active: 1,
      };
      obj[
        "filter"
      ] = `courseId = ${obj.courseId} and code = ''''${obj.CourseCode}'''' and active = ${obj.active}`;
      onGetGrades(obj);
    } else if (selectedValue == "notAll") {
      const obj = {
        courseId: selectedCourseId,
        CourseCode: selectedCourseCode,
        active: 1,
      };
      obj[
        "filter"
      ] = `courseId = ${obj.courseId} and code = ''''${obj.CourseCode}'''' and active = ${obj.active} and (totalGrade = 0 OR totalGrade IS NULL)`;
      onGetGrades(obj);
    }
  };

  handleSelectCourse = (fieldName, selectedValue) => {
    const {
      onGetFilteredSections,
      coursesOpt,
      onGetGrades,
      onGetCourseContentsGrades,
      courseContents_grades,
      currentSemester,
    } = this.props;
    const courseobj =  coursesOpt.find(courseOpt => 
      `${courseOpt.value} ${courseOpt.courseName}` === selectedValue
    );


    this.setState({
      selectedCourse: selectedValue,
      selectedCourseId: courseobj? courseobj.key : "",
      selectedSection: 0,
    });
    if (courseobj) {
      this.setState({
        selectedCourseId: courseobj.key,
        selectedCourseCode: courseobj.value,
      });
      const obj = {
        courseId: courseobj.key,
        CourseCode: courseobj.value,
        yearSemesterId: currentSemester.cuYearSemesterId,
      };
      const obj2 = {
        courseId: courseobj.key,
        CourseCode: courseobj.value,
        active: 1,
      };
      const obj3 = {
        courseId: courseobj.key,
      };
      obj2[
        "filter"
      ] = `courseId = ${obj2.courseId} and code = ''''${obj2.CourseCode}'''' and active = ${obj2.active}`;
      onGetFilteredSections(obj) &&
      onGetGrades(obj2) &&
      onGetCourseContentsGrades(obj3);
    }
  };

  handleSelectSection = (fieldName, selectedValue) => {
    const { onGetGrades, filteredSections } = this.props;
    const { selectedCourseId, selectedCourseCode } = this.state;
    if (fieldName == "courseId") {
      this.setState({
        selectedSection: selectedValue,
      });
    }
    const sectionObj = filteredSections.find(
      filteredSection => filteredSection.value === selectedValue
    );

    const obj = {
      courseId: selectedCourseId,
      CourseCode: selectedCourseCode,
      SectionNumber: sectionObj.label,
      active: 1,
    };
    obj[
      "filter"
    ] = `courseId = ${obj.courseId} and code = ''''${obj.CourseCode}'''' and  SectionNumber = ${obj.SectionNumber} and active = ${obj.active}`;
    onGetGrades(obj);
  };

  handleGradeDataChange = (row, fieldName, fieldValue) => {
    const { onUpdateGrade, grades, courseContents_grades } = this.props;

    const termInput = fieldName.match(/\d+/).input;

    const gradeInput = termInput.match(/\((\d+)\)/);

    if (termInput) {
      const gradeValue = gradeInput[1];
      if (!isNaN(gradeValue)) {
        if (parseInt(fieldValue) > gradeValue) {
          console.error("Entered value is greater than grade value");
          const errorGreaterGrade = this.props.t(
            `Enter Grade From 0 to ${gradeValue}`
          );
          this.setState({ errorMessage: errorGreaterGrade });
        } else if (parseInt(fieldValue) < 0) {
          console.error("Entered value is negative");
          const errorNegativeGrade = this.props.t(
            "You Entered Negative Grade "
          );
          this.setState({ errorMessage: errorNegativeGrade });
        } else {
          const matchingField = courseContents_grades.find(
            field => field.dataField === termInput
          );

          if (matchingField) {
            const FieldToUpdate = `Ex${matchingField.orderContent}`;
            if (fieldValue == "") {
              const updateData = {
                Id: row.Id,
                studentId: row.studentId,
                [FieldToUpdate]: null,
              };
              onUpdateGrade(updateData);
            } else {
              const updateData = {
                Id: row.Id,
                studentId: row.studentId,
                [FieldToUpdate]: fieldValue,
              };
              onUpdateGrade(updateData);
            }
          } else {
            console.error("Matching field not found");
          }
        }
      }
    }
  };

  handleErrorClose = () => {
    this.setState({ errorMessage: null });
  };
  handleDropdownToggle = flag => {
    const { selectedCourseId } = this.state;
    const { OnGetCourseStatistics } = this.props;
    if (flag == 0) {
      let flagg = {};
      flagg["courseId"] = selectedCourseId;

      flagg["flag"] = 0;
      OnGetCourseStatistics(flagg);
    } else {
      let flagg = {};
      flagg["courseId"] = selectedCourseId;

      flagg["flag"] = 1;

      OnGetCourseStatistics(flagg);
    }
  };

  toggleSidebar() {
    this.setState(prevState => ({
      sidebarOpen: !prevState.sidebarOpen,
    }));
  }

  render() {
    const {
      grades,
      courseContents_grades,
      courseStatistics,
      coursesOpt,
      filteredSections,
      t,
    } = this.props;
    const {
      selectedView,
      selectedCourse,
      selectedSection,
      errorMessage,
      sidebarOpen,
      showEditButton,
      showSearchButton,
      selectedCourseId
    } = this.state;
    const { SearchBar } = Search;

    const defaultSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];

    const generateColumns = () => {
      if (courseContents_grades.length != 0) {
        const columns = courseContents_grades.map(column => ({
          key: column.orderContent,
          dataField: column.dataField,
          text: column.textField,
          editable: showEditButton?
            (column.dataField !== "studentId" &&
            column.dataField !== "studentName" &&
            column.dataField !== "totalGrade" &&
            column.dataField !== "letter_grade") : false,
        }));

        return columns;
      } else {
        const columns = [{ key: 0, dataField: "Id", text: "Id" }];

        return columns;
      }
    };

    const selectedCourseColumns = generateColumns();

    const generateData = () => {
      let mappedDataArray = [];

      if (grades && grades.length !== 0) {
        grades.forEach(grade => {
          const courseIdColumns = courseContents_grades.filter(
            column => column.courseId === selectedCourseId
          );

          const mappedData = {
            Id: grade.Id || "",
            studentId: grade.studentId || "",
            studentName: grade.studentName || "",
            totalGrade: grade.totalGrade || "",
            letter_grade: grade.letter_grade || "",
          };

          courseIdColumns.forEach(column => {
            const exNumber = column.orderContent;
            if (exNumber) {
              const exField = `Ex${exNumber}`;
              if (grade.hasOwnProperty(exField) && grade[exField] !== null) {
                mappedData[column.dataField] = grade[exField];
              } else {
                mappedData[column.dataField] = "";
              }
            } else {
              mappedData[column.dataField] = "";
            }
          });

          mappedDataArray.push(mappedData);
        });
      } else {
        mappedDataArray.push({
          Id: "",
          studentId: "",
          studentName: "",
          Total: "",
          Letter: "",
        });
      }

      return mappedDataArray;
    };

    const selectedCourseData = generateData();

    const pageOptions = {
      sizePerPage: 10,
      totalSize: grades.length,
      custom: true,
    };
    let combinedArray = [];
    if (courseStatistics[1]) {
      const totalSuccessArray = courseStatistics[0].map(
        item => item.totalSuccessStd
      );
      const totalFailArray = courseStatistics[0].map(item => item.totalFailStd);
      combinedArray = [...totalSuccessArray, ...totalFailArray];
    }

    return (
      <React.Fragment>
        <div className="page-content">
          <div className="container-fluid">
            <Breadcrumbs
              title={t("Grades")}
              breadcrumbItem={t("Enter Grades")}
            />

            <Card>
              <CardBody>
                <Row>
                  {sidebarOpen && (
                    <Col lg={sidebarOpen ? "3" : "1"}>
                      <Card>
                        <CardTitle id="course_header">
                          {t("Search for the course student")}
                        </CardTitle>
                        <CardBody>
                          <div className="mb-3">
                            <Row>
                              <Col lg="4">
                                <Label className="form-label">
                                  {t("Course name")}
                                </Label>
                              </Col>
                              <Col lg="8">
                                <Input
                                  type="text"
                                  id="prerequiseCourseId"
                                  list="CoursedatalistOptions"
                                  className="form-control"
                                  placeholder="search.."
                                  defaultValue={
                                    (
                                      coursesOpt.find(
                                        courseOpt =>
                                          courseOpt.key === grades.courseName
                                      ) || {}
                                    ).value
                                  }
                                  onChange={event => {
                                    this.handleSelectCourse(
                                      "prerequiseCourseId",
                                      event.target.value
                                    );
                                  }}
                                  autoComplete="off"
                                />

                                <datalist id="CoursedatalistOptions">
                                  {coursesOpt.map(courseOpt => (
                                    <option
                                      key={courseOpt.key}
                                      value={`${courseOpt.value} ${courseOpt.courseName}`}
                                    />
                                  ))}
                                </datalist>
                              </Col>
                            </Row>
                          </div>

                          <div className="mb-3">
                            <Row>
                              <Col lg="4">
                                <Label className="form-label">
                                  {t("View")}
                                </Label>
                              </Col>
                              <Col lg="4">
                                <div className="d-flex flex-wrap gap-3">
                                  <div
                                    className="btn-group button-or"
                                    role="group"
                                  >
                                    <input
                                      type="radio"
                                      className="btn-check button-or"
                                      name="btnradio"
                                      id="btnradio4"
                                      autoComplete="off"
                                      defaultChecked
                                      onClick={() =>
                                        this.handleButtonClick("view", "all")
                                      }
                                    />
                                    <label
                                      className="btn btn-outline-primary smallButton  w-sm "
                                      htmlFor="btnradio4"
                                    >
                                      {this.props.t("All")}
                                    </label>

                                    <input
                                      type="radio"
                                      className="btn-check button-or"
                                      name="btnradio"
                                      id="btnradio6"
                                      autoComplete="off"
                                      onClick={() =>
                                        this.handleButtonClick("view", "notAll")
                                      }
                                    />
                                    <label
                                      className="btn btn-outline-primary smallButton  w-sm "
                                      htmlFor="btnradio6"
                                    >
                                      {this.props.t("Not Entered")}
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
                                  {t("Section Code")}
                                </Label>
                              </Col>
                              <Col lg="4">
                                <Select
                                  className="select-style"
                                  name="courseId"
                                  key="courseType_select"
                                  options={filteredSections}
                                  onChange={newValue =>
                                    this.handleSelectSection(
                                      "courseId",
                                      newValue.value
                                    )
                                  }
                                  defaultValue={
                                    selectedSection == 0
                                      ? " "
                                      : filteredSections.find(
                                          opt => opt.label === selectedSection
                                        )
                                  }
                                />
                              </Col>
                            </Row>
                          </div>
                          <div className="mb-3 d-flex justify-content-end">
                            <Tooltip title={"upload"} placement="top">
                              <i className="bx bx-upload blue-noti-icon fs-1 mx-2" />
                            </Tooltip>
                            <Tooltip title={"download"} placement="top">
                              <i className="bx bx-download blue-noti-icon fs-1 mx-2" />
                            </Tooltip>
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
                      <CardTitle className="exam_header">
                        {selectedCourse ? (
                          <>{selectedCourse}</>
                        ) : (
                          <>{this.props.t("Course Name")}</>
                        )}
                      </CardTitle>
                      <CardBody>
                        <div className="table-responsive">
                          <PaginationProvider
                            pagination={paginationFactory(pageOptions)}
                            keyField="Id"
                            columns={selectedCourseColumns}
                            data={grades}
                          >
                            {({ paginationProps, paginationTableProps }) => (
                              <ToolkitProvider
                                keyField="Id"
                                data={grades}
                                columns={selectedCourseColumns}
                                search
                              >
                                {toolkitprops => (
                                  <React.Fragment>
                                    <Row>
                                      <Col sm="3">
                                        <div className="search-box ms-2 mb-2 d-inline-block">
                                  {showSearchButton && (
                                          <div className="position-relative">
                                            <SearchBar
                                              {...toolkitprops.searchProps}
                                            />
                                          </div>)}
                                        </div>
                                      </Col>

                                      <Col
                                        sm="1"
                                        className="d-flex align-items-center"
                                      >
                                        <div className="info-icon">
                                          <Dropdown
                                            className=" d-lg-inline-block ms-1"
                                            isOpen={this.state.socialDrp}
                                            toggle={() => {
                                              this.setState({
                                                socialDrp:
                                                  !this.state.socialDrp,
                                              });
                                            }}
                                          >
                                            {" "}
                                            <DropdownToggle
                                              className="btn header-item noti-icon"
                                              tag="button"
                                              onClick={() =>
                                                this.handleDropdownToggle(0)
                                              }
                                            >
                                              <i className="dripicons-information blue-noti-icon" />
                                            </DropdownToggle>
                                            <DropdownMenu className="dropdown-megamenu dropdown-mega-menu-xl">
                                              {" "}
                                              <Row>
                                                <Col>
                                                  <p className="text-muted fw-medium">
                                                    {this.props.t(
                                                      "Number of Students"
                                                    )}
                                                  </p>
                                                  <h5 className="mb-3 blue-noti-icon ">
                                                    {courseStatistics[0] &&
                                                      courseStatistics[0]
                                                        .totalNbStd}
                                                  </h5>
                                                </Col>
                                                <Col>
                                                  <p className="text-muted fw-medium">
                                                    {this.props.t(
                                                      "Successful Students"
                                                    )}
                                                  </p>
                                                  <h5 className="mb-3 blue-noti-icon">
                                                    {courseStatistics[0] &&
                                                      courseStatistics[0]
                                                        .totalSuccessStd}
                                                  </h5>
                                                </Col>
                                                <Col>
                                                  <p className="text-muted fw-medium">
                                                    {this.props.t(
                                                      "Failed Students"
                                                    )}
                                                  </p>
                                                  <h5 className="mb-3 blue-noti-icon">
                                                    {courseStatistics[0] &&
                                                      courseStatistics[0]
                                                        .totalFailStd}
                                                  </h5>
                                                </Col>
                                                <Col>
                                                  <p className="text-muted fw-medium">
                                                    {this.props.t(
                                                      "Applicant Students"
                                                    )}
                                                  </p>
                                                  <h5 className="mb-3 blue-noti-icon">
                                                    {courseStatistics[0] &&
                                                      courseStatistics[0]
                                                        .totalApplicantStd}
                                                  </h5>
                                                </Col>
                                                <Col>
                                                  <p className="text-muted fw-medium">
                                                    {this.props.t(
                                                      "Success Rate"
                                                    )}
                                                  </p>
                                                  <h5 className="mb-3 blue-noti-icon">
                                                    {courseStatistics[0] &&
                                                      courseStatistics[0]
                                                        .successRate}
                                                  </h5>
                                                </Col>
                                              </Row>
                                            </DropdownMenu>
                                          </Dropdown>
                                        </div>

                                        <div className="info-icon">
                                          <Dropdown
                                            className=" d-lg-inline-block ms-1"
                                            isOpen={this.state.Analytics}
                                            toggle={() => {
                                              this.setState({
                                                Analytics:
                                                  !this.state.Analytics,
                                              });
                                            }}
                                          >
                                            {" "}
                                            <DropdownToggle
                                              className="btn header-item noti-icon"
                                              tag="button"
                                              onClick={() =>
                                                this.handleDropdownToggle(1)
                                              }
                                            >
                                              <i className="mdi mdi-google-analytics blue-noti-icon" />
                                            </DropdownToggle>
                                            <DropdownMenu className="dropdown-megamenu dropdown-mega-menu-analytics">
                                              {" "}
                                              <Row>
                                               
                                                <Col className="col-2"></Col>
                                                
                                              </Row>
                                            </DropdownMenu>
                                          </Dropdown>
                                        </div>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <div>
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
                                      data={selectedCourseData}
                                      columns={selectedCourseColumns}
                                      cellEdit={cellEditFactory({
                                        mode: "click",
                                        blurToSave: true,
                                        afterSaveCell: (
                                          oldValue,
                                          newValue,
                                          row,
                                          column
                                        ) => {
                                          this.handleGradeDataChange(
                                            row,
                                            column.dataField,
                                            newValue
                                          );
                                        },
                                      })}
                                      noDataIndication={t("No Grades found")}
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
              </CardBody>
            </Card>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({
  grades,
  courses,
  schedulingLectures,
  semesters,
  menu_items
}) => ({
  grades: grades.grades,
  courseContents_grades: grades.courseContents_grades,
  courseStatistics: grades.courseStatistics,
  coursesOpt: courses.coursesOpt,
  filteredSections: schedulingLectures.filteredSections,
  currentSemester: semesters.currentSemester,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  OnGetCourseStatistics: course => dispatch(getCourseStatistics(course)),
  onGetGrades: course => dispatch(getGrades(course)),
  onGetCourseContentsGrades: courseContents =>
    dispatch(getCourseContentsGrades(courseContents)),
  onUpdateGrade: grade => dispatch(updateGrade(grade)),
  onGetCoursesOpt: () => dispatch(getCoursesOpt()),
  onGetFilteredSections: filteredSections =>
    dispatch(getFilteredSections(filteredSections)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(GradesList));
