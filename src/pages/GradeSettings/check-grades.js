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
} from "reactstrap";
import Tooltip from "@mui/material/Tooltip";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
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

import {
  getCheckedGrades,
  updateCheckedGrade,
  importCheckedGrades,
} from "store/checkGrades/actions";
import { getFilteredSections } from "store/classScheduling/actions";
import { getCoursesOpt } from "store/courses/actions";
import { getCourseContentsEnteredGrades } from "store/enterGrades/actions";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import { withRouter, Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";
import { TripOriginSharp } from "@mui/icons-material";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../utils/menuUtils";
import checkedGradesSaga from "store/checkGrades/saga";
import checked_grades from "store/checkGrades/reducer";
class CheckGradesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked_grades: {},
      checked_grade: "",
      selectedRowId: null,
      selectedView: "",
      selectedSection: "",
      selectedCourse: "",
      selectedCourseId: "",
      selectedCourseCode: "",
      selectedCourseData: [],
      errorMessage: null,
      updatedColumn: "",
      updatedCells: [],
      sidebarOpen: true,
      showSearchButton: false,
      showEditButton: false,
      selectedCourseId: null,
      isFirstSelect: true,
    };
    this.handleGradeDataChange = this.handleGradeDataChange.bind(this);
  }
  componentDidMount() {
    const {
      checked_grades,
      onGetCoursesOpt,
      coursesOpt,
      onGetCourseContentsGrades,
      courseContentsEnteredGrades,
      courseStatistics,
      filteredSections,
      user_menu,
    } = this.props;
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    if (checked_grades && !checked_grades.length) {
      const obj = {
        courseId: 0,
      };
      onGetCoursesOpt() && onGetCourseContentsGrades(obj);
      this.setState({ checked_grades });
      this.setState({ courseContentsEnteredGrades });
      this.setState({ courseStatistics });
      this.setState({ coursesOpt });
      this.setState({ filteredSections });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      this.props.user_menu !== prevProps.user_menu ||
      this.props.location.pathname !== prevProps.location.pathname
    ) {
      this.updateShowSearchButton(
        this.props.user_menu,
        this.props.location.pathname
      );
      this.updateShowEditButton(
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
    const { onGetCheckedGrades } = this.props;
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
      onGetCheckedGrades(obj);
    } else if (selectedValue == "notAll") {
      const obj = {
        courseId: selectedCourseId,
        CourseCode: selectedCourseCode,
        active: 1,
      };
      obj[
        "filter"
      ] = `courseId = ${obj.courseId} and code = ''''${obj.CourseCode}'''' and active = ${obj.active} and (totalGrade = 0 OR totalGrade IS NULL)`;
      onGetCheckedGrades(obj);
    }
  };

  handleSelectCourse = (fieldName, selectedValue) => {
    const {
      onGetFilteredSections,
      coursesOpt,
      onGetCheckedGrades,
      onGetCourseContentsGrades,
      courseContentsEnteredGrades,
    } = this.props;
    const courseobj = coursesOpt.find(
      courseOpt =>
        `${courseOpt.value} ${courseOpt.courseName}` === selectedValue
    );
    this.setState({
      selectedCourse: selectedValue,
      selectedCourseId: courseobj ? courseobj.key : "",
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
        onGetCheckedGrades(obj2) &&
        onGetCourseContentsGrades(obj3);
    }
  };

  handleSelectSection = (fieldName, selectedValue) => {
    const { onGetCheckedGrades, filteredSections } = this.props;
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
    onGetCheckedGrades(obj);
  };

  handleGradeDataChange = (row, dataField, fieldValue) => {
    const {
      onUpdateCheckedGrade,
      checked_grades,
      courseContentsEnteredGrades,
    } = this.props;

    if (!dataField) {
      console.error("dataField is undefined");
      return;
    }

    if (typeof row[dataField] === "undefined") {
      console.error(`${dataField} is undefined in the row data`);
      return;
    }

    const rowId = row.Id;
    const { updatedCells } = this.state;
    const updatedCell = { rowId, dataField };
    this.setState({ updatedCells: [...updatedCells, updatedCell] });

    this.setState({
      updatedColumn: dataField,
    });

    const termInput = dataField.match(/\d+/).input;

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
          const matchingField = courseContentsEnteredGrades.find(
            field => field.dataField === termInput
          );

          if (matchingField) {
            const FieldToUpdate = `Ex${matchingField.orderContent}`;
            if (fieldValue == "") {
              const updateData = {
                Id: row.Id,
                // traineeId: row.traineeId,
                [FieldToUpdate]: null,
              };
              updateData["examType"] = `${FieldToUpdate}`;
              onUpdateCheckedGrade(updateData);
            } else {
              const updateData = {
                Id: row.Id,
                // traineeId: row.traineeId,
                [FieldToUpdate]: fieldValue,
              };
              updateData["examType"] = `${FieldToUpdate}`;

              onUpdateCheckedGrade(updateData);
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

  toggleSidebar() {
    this.setState(prevState => ({
      sidebarOpen: !prevState.sidebarOpen,
    }));
  }

  handleImport = () => {
    const { onImportCheckedGrades } = this.props;
    const { selectedSection, selectedCourseId, selectedCourseCode } =
      this.state;

    if (!selectedCourseId) {
      alert("Please select a course first");
      return;
    }

    const obj = {
      courseId: selectedCourseId,
      // CourseCode: selectedCourseCode,
      // SectionNumber: selectedSection,
      // active: 1,
    };

    // obj[
    //   "filter"
    // ] = `courseId = ${obj.courseId} and code = ''''${obj.CourseCode}'''' and active = ${obj.active}`;

    onImportCheckedGrades(obj);
  };

  //if we want condition to first select
  // handleSelectCourse = (fieldName, selectedValue) => {
  //   const {
  //     coursesOpt,
  //     onGetFilteredSections,
  //     onGetCheckedGrades,
  //     onGetCourseContentsGrades,
  //   } = this.props;

  //   if (!selectedValue) return;

  //   const courseobj = coursesOpt.find(
  //     courseOpt =>
  //       `${courseOpt.value} ${courseOpt.courseName}` === selectedValue
  //   );

  //   if (!courseobj) return;

  //   const isFirst = this.state.isFirstSelect;

  //   // تحديث الـ state
  //   this.setState(
  //     {
  //       selectedCourse: selectedValue,
  //       selectedCourseId: courseobj.key,
  //       selectedCourseCode: courseobj.value,
  //       selectedSection: 0,
  //       isFirstSelect: false,
  //     },
  //     () => {

  //       if (!isFirst) {
  //         const objFilteredSections = {
  //           courseId: courseobj.key,
  //           CourseCode: courseobj.value,
  //         };
  //         const objCheckedGrades = {
  //           courseId: courseobj.key,
  //           CourseCode: courseobj.value,
  //           active: 1,
  //           filter: `courseId = ${courseobj.key} and code = ''''${courseobj.value}'''' and active = 1`,
  //         };
  //         const objCourseContents = { courseId: courseobj.key };

  //         onGetFilteredSections(objFilteredSections);
  //         onGetCheckedGrades(objCheckedGrades);
  //         onGetCourseContentsGrades(objCourseContents);
  //       }
  //     }
  //   );
  // };

  handleImport = () => {
    const { onImportCheckedGrades } = this.props;
    const { selectedCourseId } = this.state;

    if (!selectedCourseId) {
      alert("Please select a course first");
      return;
    }

    onImportCheckedGrades({ courseId: selectedCourseId });
  };

  render() {
    const {
      checked_grades,
      courseContentsEnteredGrades,
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
      updatedColumn,
      updatedCells,
      sidebarOpen,
      showSearchButton,
      showEditButton,
      selectedCourseId,
    } = this.state;
    const { SearchBar } = Search;

    const defaultSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];

    const renderClassName = (rowId, dataField) => {
      const isUpdated = updatedCells.some(
        cell => cell.rowId === rowId && cell.dataField === dataField
      );
      return isUpdated ? "warning-cell" : "";
    };

    const generateColumns = () => {
      if (courseContentsEnteredGrades.length != 0) {
        const columns = courseContentsEnteredGrades.map(column => ({
          key: column.orderContent,
          dataField: column.dataField,
          text: column.textField,
          editable: ![
            "TraineeNum",
            "traineeName",
            "totalGrade",
            "letter_grade",
          ].includes(column.dataField),
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

      if (checked_grades && checked_grades.length !== 0) {
        checked_grades.forEach(grade => {
          const courseIdColumns = courseContentsEnteredGrades.filter(
            column => column.courseId === selectedCourseId
          );

          const mappedData = {
            Id: grade.Id || "",
            TraineeNum: grade.TraineeNum || "",
            traineeName: grade.traineeName || "",
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
          TraineeNum: "",
          traineeName: "",
          Total: "",
          Letter: "",
        });
      }

      return mappedDataArray;
    };

    const selectedCourseData = generateData();

    const updatedArray = checked_grades.filter(grade => grade.identical === 0);

    const pageOptions = {
      sizePerPage: 10,
      totalSize: checked_grades.length,
      custom: true,
    };

    return (
      <React.Fragment>
        <div className="page-content">
          <div className="container-fluid">
            <Breadcrumbs
              title={t("Grades")}
              breadcrumbItem={t("Check Grades")}
            />

            <Card>
              <CardBody>
                <Row>
                  {sidebarOpen && (
                    <Col lg="3">
                      <Card>
                        <CardTitle id="course_header">
                          {t("Search for the course trainee")}
                        </CardTitle>
                        <CardBody>
                          <div className="mb-3">
                            <Row>
                              <Col lg="4">
                                <Label className="form-label">
                                  {t("Course Name")}
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
                                          courseOpt.key ===
                                          checked_grades.courseName
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
                                      {this.props.t("Not Checked")}
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
                          <div className="text-sm-end">
                            <Tooltip
                              title={this.props.t("Import")}
                              placement="top"
                            >
                              <IconButton
                                color="primary"
                                onClick={this.handleImport}
                              >
                                <i className="bx bx-upload blue-noti-icon fs-1 mx-2" />
                              </IconButton>
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
                            data={checked_grades}
                          >
                            {({ paginationProps, paginationTableProps }) => (
                              <ToolkitProvider
                                keyField="Id"
                                data={checked_grades}
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
                                            </div>
                                          )}
                                        </div>
                                      </Col>

                                      <Col sm="2">
                                        <div className="info-icon">
                                          <Dropdown
                                            className="dropdown-mega-menu-xl d-lg-inline-block ms-1"
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
                                            >
                                              <i className="dripicons-information blue-noti-icon" />
                                            </DropdownToggle>
                                            <DropdownMenu className="dropdown-megamenu">
                                              {" "}
                                              <Row>
                                                <Col>
                                                  <p className="text-muted fw-medium">
                                                    {this.props.t(
                                                      "Number of Trainees"
                                                    )}
                                                  </p>
                                                  <h5 className="mb-3 blue-noti-icon ">
                                                    {courseStatistics
                                                      ? courseStatistics.totalNbStd
                                                      : ""}
                                                  </h5>
                                                </Col>
                                                <Col>
                                                  <p className="text-muted fw-medium">
                                                    {this.props.t(
                                                      "Successful Trainees"
                                                    )}
                                                  </p>
                                                  <h5 className="mb-3 blue-noti-icon">
                                                    {courseStatistics
                                                      ? courseStatistics.totalSuccessStd
                                                      : ""}
                                                  </h5>
                                                </Col>
                                                <Col>
                                                  <p className="text-muted fw-medium">
                                                    {this.props.t(
                                                      "Failed Trainees"
                                                    )}
                                                  </p>
                                                  <h5 className="mb-3 blue-noti-icon">
                                                    {courseStatistics
                                                      ? courseStatistics.totalFailStd
                                                      : ""}
                                                  </h5>
                                                </Col>
                                                <Col>
                                                  <p className="text-muted fw-medium">
                                                    {this.props.t(
                                                      "Applicant Trainees"
                                                    )}
                                                  </p>
                                                  <h5 className="mb-3 blue-noti-icon">
                                                    {courseStatistics
                                                      ? courseStatistics.totalApplicantStd
                                                      : ""}
                                                  </h5>
                                                </Col>
                                                <Col>
                                                  <p className="text-muted fw-medium">
                                                    {this.props.t(
                                                      "Success Rate"
                                                    )}
                                                  </p>
                                                  <h5 className="mb-3 blue-noti-icon">
                                                    {courseStatistics
                                                      ? courseStatistics.successRate
                                                      : ""}
                                                  </h5>
                                                </Col>
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
                                        mode: "dbclick",
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
  checked_grades,
  enteredGrades,
  courses,
  classScheduling,
  semesters,
  menu_items,
}) => ({
  checked_grades: checked_grades.checked_grades,
  courseContentsEnteredGrades: enteredGrades.courseContentsEnteredGrades,
  courseStatistics: enteredGrades.courseStatistics,
  coursesOpt: courses.coursesOpt,
  filteredSections: classScheduling.filteredSections,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetCheckedGrades: course => dispatch(getCheckedGrades(course)),
  onImportCheckedGrades: course => dispatch(importCheckedGrades(course)),
  onGetCourseContentsGrades: courseContents =>
    dispatch(getCourseContentsEnteredGrades(courseContents)),
  onUpdateCheckedGrade: grade => dispatch(updateCheckedGrade(grade)),
  onGetCoursesOpt: () => dispatch(getCoursesOpt()),
  onGetFilteredSections: filteredSections =>
    dispatch(getFilteredSections(filteredSections)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(CheckGradesList));
