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
  getArchivedGrades,
  updateArchivedGrade,
} from "store/archiveGrades/actions";
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
import archived_grades from "store/archiveGrades/reducer";
class ArchiveGradesList extends Component {
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
      archived_grades: [],
    };
    // this.handleGradeDataChange = this.handleGradeDataChange.bind(this);
  }
  componentDidMount() {
    const lang = localStorage.getItem("I18N_LANGUAGE");
    const {
      i18n,
      archived_grades,
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
    if (archived_grades && !archived_grades.length) {
      const obj = {
        courseId: 0,
      };
      onGetCoursesOpt() && onGetCourseContentsGrades(obj);
      this.setState({ archived_grades });
      this.setState({ courseContentsEnteredGrades });
      this.setState({ courseStatistics });
      this.setState({ coursesOpt });
      this.setState({ filteredSections });
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

  handleButtonClick = (fieldName, selectedValue) => {
    const { selectedCourseId, selectedCourseCode } = this.state;
    const { onGetArchivedGrades } = this.props;
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
      onGetArchivedGrades(obj);
    } else if (selectedValue == "notAll") {
      const obj = {
        courseId: selectedCourseId,
        CourseCode: selectedCourseCode,
        active: 1,
      };
      obj[
        "filter"
      ] = `courseId = ${obj.courseId} and code = ''''${obj.CourseCode}'''' and active = ${obj.active} and (totalGrade = 0 OR totalGrade IS NULL)`;
      onGetArchivedGrades(obj);
    }
  };

  handleSelectCourse = (fieldName, selectedValue) => {
    const {
      onGetFilteredSections,
      coursesOpt,
      onGetArchivedGrades,
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
        onGetArchivedGrades(obj2) &&
        onGetCourseContentsGrades(obj3);
    }
  };

  handleSelectSection = (fieldName, selectedValue) => {
    const { onGetArchivedGrades, filteredSections } = this.props;
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
    onGetArchivedGrades(obj);
  };

  // handleGradeDataChange = (row, dataField, fieldValue) => {
  //   const {
  //     onUpdateArchivedGrade,
  //     archived_grades,
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
  //             onUpdateArchivedGrade(updateData);
  //           } else {
  //             const updateData = {
  //               Id: row.Id,
  //               TraineeNum: row.TraineeNum,
  //               [FieldToUpdate]: fieldValue,
  //             };
  //             updateData["examType"] = `${FieldToUpdate}`;

  //             onUpdateArchivedGrade(updateData);
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
  //     onUpdateArchivedGrade,
  //     archived_grades,
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

  //   const checkboxFields = ["deprivedFromExam", "inProgress", "archived"];
  //   if (checkboxFields.includes(dataField)) {
  //     const updateData = {
  //       Id: row.Id,
  //       [dataField]: fieldValue,
  //     };
  //     onUpdateArchivedGrade(updateData);
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
  //           onUpdateArchivedGrade(updateData);
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

  // handleArchiveAll = () => {
  //   const { archived_grades } = this.props;

  //   const updatedData = archived_grades.map(row => ({
  //     ...row,
  //     archived: 1,
  //   }));

  //   this.setState({ updatedCells: updatedData });

  //   updatedData.forEach(row => {
  //     this.props.onUpdateArchivedGrade({ Id: row.Id, archived: 1 });
  //   });
  // };

  handleArchiveAll = () => {
    const { updatedCells } = this.state;
    const { archived_grades, onUpdateArchivedGrade } = this.props;

    const newStatus = archived_grades.every(row => row.archived === 1) ? 0 : 1;

    const updatedData = archived_grades.map(row => ({
      ...row,
      archived: newStatus,
    }));

    this.setState({ updatedCells: updatedData });

    updatedData.forEach(row => {
      onUpdateArchivedGrade({ Id: row.Id, archived: newStatus });
    });
  };

  // handleChangeCheckbox = (row, fieldName) => {
  //   const { onUpdateArchivedGrade } = this.props;
  //   const newStatus = row[fieldName] ? 0 : 1;

  //   let ob = {
  //     ...row,
  //     [fieldName]: newStatus,
  //   };

  //   if (row.documentTypeId !== 0) {
  //     onUpdateArchivedGrade(ob);
  //   }
  // };

  handleChangeCheckbox = (row, fieldName) => {
    const { onUpdateArchivedGrade } = this.props;
    const newStatus = row[fieldName] ? 0 : 1;

    if (row.documentTypeId !== 0) {
      onUpdateArchivedGrade({
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
    const {
      archived_grades,
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
      languageState,
      selectedCourseId,
    } = this.state;
    const { SearchBar } = Search;

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

    // const generateColumns = updatedCells => {
    //   if (courseContentsEnteredGrades.length !== 0) {
    //     const columns = courseContentsEnteredGrades.map(column => ({
    //       key: column.orderContent,
    //       dataField: column.dataField,
    //       text: column.textField,

    //       editable: false,

    //       classes: (cell, row, rowIndex, colIndex) => {
    //         const grade = archived_grades.find(grade => grade.Id === row.Id);
    //         const isIdenticalZero = grade && grade.identical === 0;

    //         const isUpdated = updatedCells.some(
    //           updatedCell =>
    //             updatedCell.rowId === row.Id &&
    //             updatedCell.dataField === column.dataField
    //         );

    //         return isIdenticalZero && isUpdated ? "warning-cell" : "";
    //       },
    //     }));

    //     columns.push(
    //       {
    //         key: "deprivedFromExam",
    //         dataField: "deprivedFromExam",
    //         text: "Deprived from Exam 25%",
    //         formatter: cell => (
    //           <input type="checkbox" checked={!!cell} disabled={true} />
    //         ),
    //       },
    //       {
    //         key: "inProgress",
    //         dataField: "inProgress",
    //         text: "In Progress",
    //         formatter: (cellContent, row, column) => (
    //           <input
    //             type="checkbox"
    //             defaultChecked={cellContent == 1}
    //             disabled={true}
    //           />
    //         ),
    //       },
    //       {
    //         key: "archived",
    //         dataField: "archived",
    //         text: this.props.t("Archived"),
    //         sort: true,
    //         editable: false,
    //         formatter: (cellContent, row, column) => (
    //           <Input
    //             type="checkbox"
    //             name="AllowArchived"
    //             className={`form-check-input input-mini warning}`}
    //             id="archivedButton"
    //             defaultChecked={cellContent == 1}
    //             onChange={event => this.handleChangeCheckbox(row, "archived")}
    //           />
    //         ),
    //       }
    //     );

    //     return columns;
    //   } else {
    //     return [{ key: 0, dataField: "Id", text: "Id" }];
    //   }
    // };

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
          {
            key: "archived",
            dataField: "archived",
            text: "Archived",
            sort: true,
            editable: false,
            formatter: (cellContent, row, column) => (
              <Input
                type="checkbox"
                name="AllowArchived"
                className="form-check-input input-mini"
                id="archivedButton"
                defaultChecked={cellContent == 1}
                onChange={event => this.handleChangeCheckbox(row, "archived")}
              />
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

      columns.push(
        {
          key: "deprivedFromExam",
          dataField: "deprivedFromExam",
          text: t("Deprived from Exam 25%"),
          formatter: cell => (
            <input type="checkbox" checked={!!cell} disabled={true} />
          ),
        },
        {
          key: "archived",
          dataField: "archived",
          text: t("Archived"),
          sort: true,
          editable: false,
          formatter: (cellContent, row, column) => (
            <Input
              type="checkbox"
              name="AllowArchived"
              className="form-check-input input-mini"
              id="archivedButton"
              defaultChecked={cellContent == 1}
              onChange={event => this.handleChangeCheckbox(row, "archived")}
            />
          ),
        }
      );

      return columns;
    };

    const selectedCourseColumns = generateColumns(updatedCells);

    const generateData = () => {
      let mappedDataArray = [];

      if (archived_grades && archived_grades.length !== 0) {
        archived_grades.forEach(grade => {
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
            archived: grade.archived || false,
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
          archived: false,
        });
      }

      return mappedDataArray;
    };

    const selectedCourseData = generateData();

    const updatedArray = archived_grades.filter(grade => grade.identical === 0);

    const pageOptions = {
      sizePerPage: 10,
      totalSize: archived_grades.length,
      custom: true,
    };

    return (
      <React.Fragment>
        <div dir={direction} className="page-content">
          <div className="container-fluid">
            <Breadcrumbs
              title={t("Grades")}
              breadcrumbItem={t("Archive Grades")}
            />

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
                                          courseOpt.key ===
                                          archived_grades.courseName
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

                          {/* <div className="mb-3">
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
                          </div> */}
                          {/* <Col lg="12">
                            <div
                              className="upload-box"
                              onClick={() =>
                                document.getElementById("fileInput").click()
                              }
                            >
                              <div className="upload-content text-center">
                                <div className="upload-icon-wrapper">
                                  <i className="bx bx-upload upload-icon"></i>
                                </div>
                                <p className="upload-text">
                                  {this.props.t("Click or drag file to upload")}
                                </p>
                              </div>

                              <input
                                id="fileInput"
                                name="file"
                                type="file"
                                className="d-none"
                                onChange={this.handleFileChange}
                              />
                            </div>
                          </Col> */}
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
                            data={archived_grades}
                          >
                            {({ paginationProps, paginationTableProps }) => (
                              <ToolkitProvider
                                keyField="Id"
                                data={archived_grades}
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
                                                      "Number of Students"
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
                                                      "Successful Students"
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
                                                      "Failed Students"
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
                                                      "Applicant Students"
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
                                      <Col sm="6"></Col>
                                      <Col sm="1">
                                        <Tooltip
                                          title={t("Archive All")}
                                          placement="top"
                                        >
                                          <div className="square-switch square-switch-view">
                                            <input
                                              type="checkbox"
                                              id="square-switch1"
                                              switch="none"
                                              onClick={() =>
                                                this.handleArchiveAll()
                                              }
                                            />
                                            <label
                                              htmlFor="square-switch1"
                                              data-on-label="View"
                                              data-off-label="Off"
                                            />
                                          </div>
                                        </Tooltip>
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

const mapStateToProps = ({
  archived_grades,
  enteredGrades,
  courses,
  classScheduling,
  menu_items,
}) => ({
  archived_grades: archived_grades.archived_grades,
  courseContentsEnteredGrades: enteredGrades.courseContentsEnteredGrades,
  courseStatistics: enteredGrades.courseStatistics,
  coursesOpt: courses.coursesOpt,
  filteredSections: classScheduling.filteredSections,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetArchivedGrades: course => dispatch(getArchivedGrades(course)),
  onGetCourseContentsGrades: courseContents =>
    dispatch(getCourseContentsEnteredGrades(courseContents)),
  onUpdateArchivedGrade: grade => dispatch(updateArchivedGrade(grade)),
  onGetCoursesOpt: () => dispatch(getCoursesOpt()),
  onGetFilteredSections: filteredSections =>
    dispatch(getFilteredSections(filteredSections)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(ArchiveGradesList));
