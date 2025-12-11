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

import Tooltip from "@mui/material/Tooltip";
import {
  getGrades,
  getCourseContentsEnteredGrades,
  getCoursesOpt,
} from "store/grades/actions";

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
      updatedColumn: "",
      updatedCells: [],
      sidebarOpen: true,
      showSearchButton: false,
      showEditButton: false,
      selectedCourseId: null,
      languageState: "",
      grades: [],
    };
    // this.handleGradeDataChange = this.handleGradeDataChange.bind(this);
  }
  componentDidMount() {
    const authUserStr = localStorage.getItem("authUser");
    let traineeId = "";

    if (authUserStr) {
      try {
        const parsed = JSON.parse(authUserStr);

        if (parsed && parsed.length > 0) {
          traineeId = parsed[0].traineeId;
        }
      } catch (e) {
        console.error("authUser parsing failed", e);
      }
    }
    this.setState({ traineeId });
    console.log("Trainee ID:", traineeId);
    const lang = localStorage.getItem("I18N_LANGUAGE");
    const {
      i18n,
      grades,
      onGetCoursesOpt,
      coursesOpt,
      onGetCourseContentsGrades,
      courseContentsEnteredGrades,
      user_menu,
    } = this.props;
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    if (grades && !grades.length) {
      const obj = {
        courseId: 0,
      };
      onGetCoursesOpt() && onGetCourseContentsGrades(obj);
      this.setState({ grades });
      this.setState({ courseContentsEnteredGrades });
      this.setState({ coursesOpt });
    }
    this.setState({ languageState: lang });
    i18n.on("languageChanged", this.handleLanguageChange);
  }
  handleLanguageChange = lng => {
    const { i18n, onGetGrades } = this.props;
    const lang = localStorage.getItem("I18N_LANGUAGE");

    // if (lang != lng) {
    // onGetGrades(lang);
    this.setState({ languageState: lng });
    // }
  };

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

  handleSelectCourse = (fieldName, selectedValue) => {
    const {
      coursesOpt,
      onGetGrades,
      onGetCourseContentsGrades,
      courseContentsEnteredGrades,
    } = this.props;

    const { traineeId } = this.state;
    console.log("44444444444444", traineeId);
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
      const obj2 = {
        courseId: courseobj.key,
        CourseCode: courseobj.value,
        active: 1,
        traineeId: traineeId,
      };
      const obj3 = {
        courseId: courseobj.key,
      };
      obj2[
        "filter"
      ] = `courseId = ${obj2.courseId} and code = ''''${obj2.CourseCode}'''' and active = ${obj2.active} and traineeId = ${obj2.traineeId}`;

      onGetGrades(obj2) && onGetCourseContentsGrades(obj3);
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

  // handleGradeDataChange = (row, dataField, fieldValue) => {
  //   const {
  //     onUpdatedGrade,
  //     grades,
  //     courseContentsEnteredGrades,
  //   } = this.props;

  //   if (!dataField) {
  //     console.error("dataField is undefined");
  //     return;
  //   }

  //   if (typeof row[dataField] === "undefined") {
  //     console.error(`${dataField} is undefined in the row data`);
  //     return;
  //   }

  //   const rowId = row.Id;
  //   const { updatedCells } = this.state;
  //   const updatedCell = { rowId, dataField };
  //   this.setState({ updatedCells: [...updatedCells, updatedCell] });

  //   this.setState({
  //     updatedColumn: dataField,
  //   });

  //   const termInput = dataField.match(/\d+/).input;

  //   const gradeInput = termInput.match(/\((\d+)\)/);

  //   if (termInput) {
  //     const gradeValue = gradeInput[1];
  //     if (!isNaN(gradeValue)) {
  //       if (parseInt(fieldValue) > gradeValue) {
  //         console.error("Entered value is greater than grade value");
  //         const errorGreaterGrade = this.props.t(
  //           `Enter Grade From 0 to ${gradeValue}`
  //         );
  //         this.setState({ errorMessage: errorGreaterGrade });
  //       } else if (parseInt(fieldValue) < 0) {
  //         console.error("Entered value is negative");
  //         const errorNegativeGrade = this.props.t(
  //           "You Entered Negative Grade "
  //         );
  //         this.setState({ errorMessage: errorNegativeGrade });
  //       } else {
  //         const matchingField = courseContentsEnteredGrades.find(
  //           field => field.dataField === termInput
  //         );

  //         if (matchingField) {
  //           const FieldToUpdate = `Ex${matchingField.orderContent}`;
  //           if (fieldValue == "") {
  //             const updateData = {
  //               Id: row.Id,
  //               TraineeNum: row.TraineeNum,
  //               [FieldToUpdate]: null,
  //             };
  //             updateData["examType"] = `${FieldToUpdate}`;
  //             onUpdatedGrade(updateData);
  //           } else {
  //             const updateData = {
  //               Id: row.Id,
  //               TraineeNum: row.TraineeNum,
  //               [FieldToUpdate]: fieldValue,
  //             };
  //             updateData["examType"] = `${FieldToUpdate}`;

  //             onUpdatedGrade(updateData);
  //           }
  //         } else {
  //           console.error("Matching field not found");
  //         }
  //       }
  //     }
  //   }
  // };

  // handleGradeDataChange = (row, dataField, fieldValue) => {
  //   const {
  //     onUpdatedGrade,
  //     grades,
  //     courseContentsEnteredGrades,
  //   } = this.props;

  //   if (!dataField) {
  //     console.error("dataField is undefined");
  //     return;
  //   }

  //   if (typeof row[dataField] === "undefined") {
  //     console.error(`${dataField} is undefined in the row data`);
  //     return;
  //   }

  //   const rowId = row.Id;
  //   const { updatedCells } = this.state;
  //   const updatedCell = { rowId, dataField };
  //   this.setState({ updatedCells: [...updatedCells, updatedCell] });

  //   const checkboxFields = ["deprivedFromExam", "inProgress", "d"];
  //   if (checkboxFields.includes(dataField)) {
  //     const updateData = {
  //       Id: row.Id,
  //       [dataField]: fieldValue,
  //     };
  //     onUpdatedGrade(updateData);
  //     return;
  //   }

  //   if (!dataField || typeof row[dataField] === "undefined") return;

  //   const termInput = dataField.match(/\d+/)?.input;
  //   const gradeInput = termInput?.match(/\((\d+)\)/);

  //   if (termInput && gradeInput) {
  //     const gradeValue = gradeInput[1];
  //     if (!isNaN(gradeValue)) {
  //       if (parseInt(fieldValue) > gradeValue) {
  //         this.setState({
  //           errorMessage: `Enter Grade From 0 to ${gradeValue}`,
  //         });
  //       } else if (parseInt(fieldValue) < 0) {
  //         this.setState({ errorMessage: "You Entered Negative Grade" });
  //       } else {
  //         const matchingField = this.props.courseContentsEnteredGrades.find(
  //           field => field.dataField === termInput
  //         );
  //         if (matchingField) {
  //           const FieldToUpdate = `Ex${matchingField.orderContent}`;
  //           const updateData = {
  //             Id: row.Id,
  //             TraineeNum: row.TraineeNum,
  //             [FieldToUpdate]: fieldValue || null,
  //             examType: `${FieldToUpdate}`,
  //           };
  //           onUpdatedGrade(updateData);
  //         }
  //       }
  //     }
  //   }
  // };

  handleErrorClose = () => {
    this.setState({ errorMessage: null });
  };

  toggleSidebar() {
    this.setState(prevState => ({
      sidebarOpen: !prevState.sidebarOpen,
    }));
  }

  handleFileChange = event => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file);
    }
  };

  // handleAll = () => {
  //   const { grades } = this.props;

  //   const updatedData = grades.map(row => ({
  //     ...row,
  //     d: 1,
  //   }));

  //   this.setState({ updatedCells: updatedData });

  //   updatedData.forEach(row => {
  //     this.props.onUpdatedGrade({ Id: row.Id, d: 1 });
  //   });
  // };

  handleAll = () => {
    const { updatedCells } = this.state;
    const { grades, onUpdatedGrade } = this.props;

    const newStatus = grades.every(row => row.d === 1) ? 0 : 1;

    const updatedData = grades.map(row => ({
      ...row,
      d: newStatus,
    }));

    this.setState({ updatedCells: updatedData });

    updatedData.forEach(row => {
      onUpdatedGrade({ Id: row.Id, d: newStatus });
    });
  };

  // handleChangeCheckbox = (row, fieldName) => {
  //   const { onUpdatedGrade } = this.props;
  //   const newStatus = row[fieldName] ? 0 : 1;

  //   let ob = {
  //     ...row,
  //     [fieldName]: newStatus,
  //   };

  //   if (row.documentTypeId !== 0) {
  //     onUpdatedGrade(ob);
  //   }
  // };

  handleChangeCheckbox = (row, fieldName) => {
    const { onUpdatedGrade } = this.props;
    const newStatus = row[fieldName] ? 0 : 1;

    if (row.documentTypeId !== 0) {
      onUpdatedGrade({
        Id: row.Id,
        [fieldName]: newStatus,
      });
    }
  };

  toggleLanguage = () => {
    this.setState(prevState => ({
      languageState: prevState.languageState === "ar" ? "en" : "ar",
    }));
  };

  render() {
    const { grades, courseContentsEnteredGrades, coursesOpt, t } = this.props;
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
      languageState,
      selectedCourseId,
    } = this.state;
    const { SearchBar } = Search;
    console.log("4444444444", coursesOpt);
    const defaultSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];
    const direction = languageState === "ar" ? "rtl" : "ltr";
    const renderClassName = (rowId, dataField) => {
      const isUpdated = updatedCells.some(
        cell => cell.rowId === rowId && cell.dataField === dataField
      );
      return isUpdated ? "warning-cell" : "";
    };

    const generateColumns = updatedCells => {
      if (courseContentsEnteredGrades.length === 0) {
        return [
          {
            key: "deprivedFromExam",
            dataField: "deprivedFromExam",
            text: "Deprived from Exam 25%",
            formatter: cell => (
              <input type="checkbox" checked={!!cell} disabled={true} />
            ),
          },
        ];
      }
      const columns = courseContentsEnteredGrades.map(column => ({
        key: column.orderContent,
        dataField: column.dataField,
        text: languageState === "ar" ? column.textField : column.textFieldE,
        editable: false,
        classes: (cell, row, rowIndex, colIndex) => {
          if (!cell) return "";

          const parts = cell.split("|").map(p => parseFloat(p.trim()));
          if (parts.length === 2 && parts[0] !== parts[1]) {
            return "warning-cell";
          }

          return "";
        },
      }));

      columns.push({
        key: "deprivedFromExam",
        dataField: "deprivedFromExam",
        text: t("Deprived from Exam 25%"),
        formatter: cell => (
          <input type="checkbox" checked={!!cell} disabled={true} />
        ),
      });

      return columns;
    };

    const selectedCourseColumns = generateColumns(updatedCells);

    const generateData = () => {
      //clear cash
      console.log("selectedCourseId", selectedCourseId);
      if (!selectedCourseId || !grades || grades.length === 0) {
        return [];
      }

      let mappedDataArray = [];

      if (grades && grades.length !== 0) {
        grades.forEach(grade => {
          const courseIdColumns = courseContentsEnteredGrades.filter(
            column => column.courseId === selectedCourseId
          );

          const mappedData = {
            Id: grade.Id || "",
            TraineeNum: grade.TraineeNum || "",
            traineeName: grade.traineeName || "",
            totalGrade: grade.totalGrade || "",
            letter_grade: grade.letter_grade || "",
            deprivedFromExam: grade.deprivedFromExam || false,
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
          deprivedFromExam: false,
          d: false,
        });
      }

      return mappedDataArray;
    };

    const selectedCourseData = generateData();

    const updatedArray = grades.filter(grade => grade.identical === 0);

    const pageOptions = {
      sizePerPage: 10,
      totalSize: grades.length,
      custom: true,
    };

    return (
      <React.Fragment>
        <div dir={direction} className="page-content">
          <div className="container-fluid">
            <Breadcrumbs title={t("Grades")} breadcrumbItem={t(" Grades")} />

            <Card>
              <CardBody>
                <Row>
                  {sidebarOpen && (
                    <Col lg="3">
                      <Card>
                        <CardTitle id="course_header">
                          {t("Search for the course")}
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
                                  placeholder={t("Search")}
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
                                            </div>
                                          )}
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
                                      // cellEdit={cellEditFactory({
                                      //   mode: "click",
                                      //   blurToSave: true,
                                      //   afterSaveCell: (
                                      //     oldValue,
                                      //     newValue,
                                      //     row,
                                      //     column
                                      //   ) => {
                                      //     this.handleGradeDataChange(
                                      //       row,
                                      //       column.dataField,
                                      //       newValue
                                      //     );
                                      //   },
                                      // })}
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

const mapStateToProps = ({ grades, menu_items }) => ({
  grades: grades.grades,
  courseContentsEnteredGrades: grades.courseContentsEnteredGrades,
  coursesOpt: grades.coursesOpt,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetGrades: course => dispatch(getGrades(course)),
  onGetCourseContentsGrades: courseContents =>
    dispatch(getCourseContentsEnteredGrades(courseContents)),
  onUpdatedGrade: grade => dispatch(updateGrade(grade)),
  onGetCoursesOpt: () => dispatch(getCoursesOpt()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(GradesList));
