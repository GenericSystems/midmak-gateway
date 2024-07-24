import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import cellEditFactory from "react-bootstrap-table2-editor";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  Label,
  InputGroup,
  Input,
  FormGroup,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  CardText,
  Alert,
} from "reactstrap";
import Select from "react-select";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import InputMask from "react-input-mask";
import Accordion from "react-bootstrap/Accordion";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

import BootstrapTable from "react-bootstrap-table-next";

import images from "assets/images";

import classnames from "classnames";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import {
  getCourses,
  addNewCourse,
  updateCourse,
  deleteCourse,
  getCourseRequiredCourses,
  addNewCourseRequiredCourse,
  updateCourseRequiredCourse,
  deleteCourseRequiredCourse,
  getCourseDeletedValue,
} from "store/courses/actions";

import { getFilteredDepartments } from "store/departments/actions";

import { isEmpty, size, map } from "lodash";
import { departments, prereqs } from "common/data";

import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
  getPageFromMenu
} from "../../utils/menuUtils";
class Courses extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      course: "",
      modal: false,
      modal2: false,
      deleteModal: false,
      deleteModal2: false,
      activeTab1: "5",
      selectedContent: {},
      selectedCourseType: null,
      selectedCourseLevel: null,
      selectedFaculty: null,
      selectedDepartment: null,
      selectedRequiredLevel: null,
      selectedCourseContent: null,
      selectedPreReqCourse: "",
      selectedPreReqCondition: null,
      selectFilterDeps: [],
      isUniversity: 0,
      deanAcception: null,
      departmentAcception: null,
      showAlert: null,
      lastUsedContentId: 0,
      courseContentArray: [],
      duplicateCourseContentError: null,
      lastUsedPreReqId: 0,
      preReqArray: [],
      duplicatePreReqError: null,
      courseId: null,
      courseCode: "",
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
    };
    this.handleEditCourse = this.handleEditCourse.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggle2 = this.toggle2.bind(this);
    this.handleCourseClicks = this.handleCourseClicks.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  toggle1(tab) {
    if (this.state.activeTab1 !== tab) {
      this.setState({
        activeTab1: tab,
      });
    }
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  toggle2() {
    this.setState(prevState => ({
      modal2: !prevState.modal2,
    }));
  }

  handleCourseClicks = () => {
    this.setState({
      course: "",
      courseContentArray: [],
      preReqArray: [],
      isEdit: false,
    });
    this.toggle2();
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

  toggleDeleteModal2 = () => {
    this.setState(prevState => ({
      deleteModal2: !prevState.deleteModal2,
    }));
  };

  onClickDelete = course => {
    this.setState({ course: course });
    this.setState({ deleteModal: true });
    this.setState({ deleteModal2: true });
  };

  handleDeleteCourse = () => {
    const { onDeleteCourse } = this.props;
    const { course } = this.state;
    if (course.Id !== undefined) {
      let onDelete = { Id: course.Id };
      onDeleteCourse(onDelete);
    }
    this.setState({ deleteModal: false, showAlert: true });
  };

  handleEditCourse = arg => {
    const course = arg;
    console.log("edit course",course)

    this.setState({
      selectedGroup: null,
      course: {
        Id: course.Id,
        arCourseName: course.arCourseName,
        enCourseName: course.enCourseName,
        code: course.code,
        isUniversityReq: course.isUniversityReq,
        nbHours: course.nbHours,
        nbHoursPractice: course.nbHoursPractice,
        nbHoursTheory: course.nbHoursTheory,
        arDescriptionDetails: course.arDescriptionDetails,
        enDescriptionDetails: course.enDescriptionDetails,
        courseTypeId: course.courseTypeId,
        selectedCourseType: course.courseTypeId,
        courseLevelId: course.courseLevelId,
        selectedCourseLevel:  course.courseLevelId,
        facultyId: course.facultyId,
        selectedFaculty:course.facultyId,
        depId: course.depId,
        selectedDepartment: course.depId,
        requiredLevelId: course && course.requiredLevelId,
        isDepartmentAccption: course.isDepartmentAccption,
        isDeanAccption: course.isDeanAccption,
        requiredHours: course.requiredHours,
        requiredAvg: course.requiredAvg,
      },
      courseId: course.Id,
      courseCode: course.code,
      courseContentArray:
        course &&
        course.CoursesContents != null &&
        course.CoursesContents != undefined
          ? course.CoursesContents
          : [],
      preReqArray:
        course &&
        course.CoursePrerequisites != null &&
        course.CoursePrerequisites != undefined
          ? course.CoursePrerequisites
          : [],
      isEdit: true,
    });

    const { courses, onGetFilteredDepartments } = this.props;
    this.setState({
      isUniversity: course.isUniversityReq,
      deanAcception: course.isDeanAccption,
      departmentAcception: course.isDepartmentAccption,
    });
    if (course) {
      let obj = { facultyId: course.facultyId };
      onGetFilteredDepartments(obj);
    }

    this.toggle2();
  };

  handleSelectChange = (fieldName, selectedValue) => {
    if (fieldName == "courseTypeId") {
      this.setState({
        selectedCourseType: selectedValue,
      });
    } else if (fieldName == "courseLevelId") {
      this.setState({
        selectedCourseLevel: selectedValue,
      });
    } else if (fieldName === "facultyId") {
      let selectFilterDeps = this.state;
      this.setState({
        selectedFaculty: selectedValue,
      });
      const { onGetFilteredDepartments } = this.props;
      let obj = { facultyId: selectedValue };
      onGetFilteredDepartments(obj);
    } else if (fieldName == "depId") {
      this.setState({
        selectedDepartment: selectedValue,
      });
    } else if (fieldName == "requiredLevelId") {
      this.setState({
        selectedRequiredLevel: selectedValue,
      });
    }
  };

  componentDidMount() {
    const {
      courses,
      onGetCourses,
      onGetFilteredDepartments,
      courseTypes,
      levels,
      faculties,
      departments,
      filteredDepartments,
      coursecontents,
      defaultValues,
      prereqs,
      coursesOpt,
      deleted,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    this.getAllObject(
      this.props.user_menu,
      this.props.location.pathname
    );
    if (courses && !courses.length) {
      onGetCourses();
    }
    if (courseTypes && !courseTypes.length) {
    }
    this.setState({ courses });
    this.setState({ courseTypes });
    this.setState({ levels });
    this.setState({ faculties });
    this.setState({ departments });
    this.setState({ filteredDepartments });
    this.setState({ coursecontents });
    this.setState({ defaultValues });
    this.setState({ prereqs });
    this.setState({ coursesOpt });
    this.setState({ deleted });
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
      this.getAllObject(
        this.props.user_menu,
        this.props.location.pathname
      );
    }
  }

  getAllObject = (menu, pathname) => {
    const menuObject =   getPageFromMenu(menu, pathname);
    this.setState({ menuObject });
  };


  updateShowAddButton = (menu, pathname) => {
    const showAddButton = checkIsAddForPage(menu, pathname);
    this.setState({ showAddButton });
  };

  updateShowDeleteButton = (menu, pathname) => {
    const showDeleteButton = checkIsDeleteForPage(menu, pathname);
    this.setState({ showDeleteButton });
  };

  updateShowSearchButton = (menu, pathname) => {
    const showSearchButton = checkIsSearchForPage(menu, pathname);
    this.setState({ showSearchButton });
  };
  updateShowEditButton = (menu, pathname) => {
    const showEditButton = checkIsEditForPage(menu, pathname);
    this.setState({ showEditButton });
  };

  handleCheckboxChange(isChecked, field) {
    const newStatus = isChecked ? 1 : 0;

    let { selectedFaculty, selectedDepartment } = this.state;
    if (field == "isUniversityReq") {
      if (newStatus == 1) {
        this.setState({
          selectedFaculty: 0,
          selectedDepartment: 0,
        });
      }
      this.setState({
        isUniversity: newStatus,
      });
    } else if (field == "isDeanAccption") {
      this.setState({
        deanAcception: newStatus,
      });
    } else if (field == "isDepartmentAccption") {
      this.setState({
        departmentAcception: newStatus,
      });
    }
  }

  handleSuccessClose = () => {
    const { onGetCourseDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetCourseDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetCourseDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetCourseDeletedValue();
  };

  handleAlertCloseCourseContent = () => {
    this.setState({ duplicateCourseContentError: null });
  };

  handleAddNewCourseContent = () => {
    const {
      courseContentArray,
      lastUsedContentId,
      isEdit,
      student,
      courseId,
      courseCode,
    } = this.state;
    const emptyRowsExist = courseContentArray.some(
      CourseCont => CourseCont.courseContentId == null
    );
    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateCourseContentError: errorMessage });
    } else {
      const newCourseContent = {
        Id: lastUsedContentId,
        courseContentId: null,
        percentage: null,
        courseCode: courseCode,
        courseId: courseId,
      };
      this.setState({
        courseContentArray: [...courseContentArray, newCourseContent],
        lastUsedContentId: lastUsedContentId - 1,
      });
      this.setState({ duplicateErrorCourseContent: null });
    }
  };

  handleCourseContentDataChange = (id, fieldName, newValue) => {
    const { isEdit } = this.state;
    this.setState(prevState => {
      const updatedCourseContent = prevState.courseContentArray.map(
        courseContent => {
          if (courseContent.Id === id) {
            return {
              ...courseContent,
              [fieldName]: newValue,
            };
          }
          return courseContent;
        }
      );

      return {
        courseContentArray: updatedCourseContent,
      };
    });
  };

  handleSelectChangeDetails = (
    rowId,
    fieldName,
    selectedValue,
    defaultValue
  ) => {
    const { isEdit } = this.state;
    this.setState(prevState => {
      const updatedCourseContent = prevState.courseContentArray.map(
        courseContent => {
          if (courseContent.Id === rowId) {
            return {
              ...courseContent,
              [fieldName]: selectedValue,
              ["percentage"]: defaultValue,
            };
          }
          return courseContent;
        }
      );

      return {
        courseContentArray: updatedCourseContent,
      };
    });
  };

  deleteCourseContent = courseContent => {
    const { isEdit } = this.state;
    this.setState(prevState => {
      const updatedCourseContent = prevState.courseContentArray.filter(
        item => item.Id !== courseContent.Id
      );
      return {
        courseContentArray: updatedCourseContent,
      };
    });
  };

  handleAlertClosePreReq = () => {
    this.setState({ duplicatePreReqError: null });
  };

  handleAddNewPreReq = () => {
    const {
      preReqArray,
      lastUsedPreReqId,
      isEdit,
      student,
      courseId,
      courseCode,
    } = this.state;
    const emptyRowsExist = preReqArray.some(
      CourseCont => CourseCont.prerequiseCourseId == null
    );
    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicatePreReqError: errorMessage });
    } else {
      const newPreReq = {
        Id: lastUsedPreReqId,
        prerequiseCourseId: null,
        courseCode: courseCode,
        courseId: courseId,
      };
      this.setState({
        preReqArray: [...preReqArray, newPreReq],
        lastUsedPreReqId: lastUsedPreReqId - 1,
      });
      this.setState({ duplicatePreReqError: null });
    }
  };

  handleSelectPreReqCondition = (rowId, fieldName, selectedValue) => {
    const { isEdit } = this.state;
    this.setState(prevState => {
      const updatedpreReq = prevState.preReqArray.map(preReq => {
        if (preReq.Id === rowId) {
          return {
            ...preReq,
            [fieldName]: selectedValue,
          };
        }
        return preReq;
      });

      return {
        preReqArray: updatedpreReq,
      };
    });
  };

  handleSelectPreReqCourse = (rowId, fieldName, selectedValue) => {
    const { coursesOpt } = this.props;

    const newCoursesOpt = coursesOpt.map(course => ({
      key: course.key,
      value: `${course.value} ${course.arCourseName}`,
      code: course.value,
    }));

    coursesOpt.filter(courseOpt => courseOpt.key !== rowId.courseId);
    const selectedCourse = newCoursesOpt.find(
      courseOpt => courseOpt.value === selectedValue
    );

    if (selectedCourse) {
      this.setState(prevState => {
        const updatedpreReq = prevState.preReqArray.map(preReq => {
          if (preReq.Id === rowId) {
            return {
              ...preReq,
              prerequiseCourseId: selectedCourse.key,
              prerequiseCode: selectedCourse.code,
            };
          }
          return preReq;
        });

        return {
          preReqArray: updatedpreReq,
        };
      });
    }
  };

  deletepreReq = preReq => {
    const { isEdit } = this.state;
    this.setState(prevState => {
      const updatedpreReq = prevState.preReqArray.filter(
        item => item.Id !== preReq.Id
      );
      return {
        preReqArray: updatedpreReq,
      };
    });
  };

  render() {
    //meta title
    document.title =
      "Course List | keyInHands - React Admin & Dashboard Template";

    const {
      selectedCourseType,
      selectedCourseLevel,
      selectedFaculty,
      selectedDepartment,
      selectedRequiredLevel,
      selectedCourseContent,
      selectedPreReqCourse,
      selectedPreReqCondition,
      isUniversity,
      selectFilterDeps,
      deanAcception,
      departmentAcception,
      courseContentArray,
      duplicateCourseContentError,
      preReqArray,
      duplicatePreReqError,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
      menuObject
    } = this.state;

    const { selectedGroup, tables } = this.state;

    const { SearchBar } = Search;

    const { isEdit, deleteModal, showAlert } = this.state;

    const {
      onGetCourses,
      onGetFilteredDepartments,
      onAddNewCourse,
      onUpdateCourse,
      courses,
      mobAppFacultyAccs,
      course_requiredCourses,
      courseTypes,
      levels,
      faculties,
      departments,
      filteredDepartments,
      coursecontents,
      defaultValues,
      prereqs,
      coursesOpt,
      deleted,
      t,
    } = this.props;

    const newCoursesOpt = coursesOpt.map(course => ({
      key: course.key,
      value: `${course.value} ${course.arCourseName}`,
    }));

    const courseListColumns = [
      {
        text: "id",
        dataField: "Id",
        sort: true,
        hidden: true,
        formatter: (cellContent, courses) => <>{courses.Id}</>,
      },
      {
        text: this.props.t("Course(ar)"),
        dataField: "arCourseName",
        sort: true,
        formatter: (cellContent, courses) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {courses.arCourseName}
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
        text: "Course",
        dataField: "enCourseName",
        sort: true,
        formatter: (cellContent, courses) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {courses.enCourseName}
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
        text: this.props.t("Course Code"),
        dataField: "code",
        sort: true,
        formatter: (cellContent, courses) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {courses.code}
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
        text: this.props.t("Number of Hours"),
        dataField: "nbHours",
        sort: true,
        formatter: (cellContent, courses) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {courses.nbHours}
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
        text: this.props.t("Course Type"),
        dataField: "courseTypeName",
        sort: true,
        formatter: (cellContent, courses) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {courses.courseTypeName}
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
        text: this.props.t("University Requirement"),
        dataField: "isUniversityReqLabel",
        sort: true,
        formatter: (cellContent, courses) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {courses.isUniversityReqLabel == "yes" ? (
                  <i style={{ color: "#0086BF" }}>
                    {" "}
                    {courses.isUniversityReqLabel}{" "}
                  </i>
                ) : (
                  <i style={{ color: "#FF8A00" }}>
                    {" "}
                    {courses.isUniversityReqLabel}{" "}
                  </i>
                )}
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
        text: this.props.t("Faculty"),
        dataField: "faculty",
        sort: true,
        formatter: (cellContent, courses) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {courses.faculty}
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
        text: this.props.t("Department"),
        dataField: "department",
        sort: true,
        formatter: (cellContent, courses) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {courses.department}
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
        formatter: (cellContent, course) => (
          <div className="d-flex gap-3">
              <Link className="text-secondary" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={() => this.handleEditCourse(course)}
                ></i>
              </Link>
          
            {showDeleteButton && (
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(course)}
                ></i>
              </Link>
            )}
          </div>
        ),
      },
    ];

    const alertMessage =
      deleted == 0
        ? this.props.t("Can't Delete")
        : this.props.t("Deleted Successfully");

    const course = this.state.course;

    const filteredCourses = coursesOpt.filter(
      courseOpt => courseOpt.key !== course.Id
    );

    const pageOptions = {
      sizePerPage: 10,
      totalSize: courses.length,
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];

    const selectRow = {
      mode: "checkbox",
    };

    const courseContentColumn = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      {
        dataField: "courseContentId",
        text: this.props.t("Course Content"),
        formatter: (cell, row) => {
          const filteredOptions = coursecontents.filter(
            opt =>
              !courseContentArray.some(
                courseContent => courseContent.courseContentId === opt.value
              )
          );

          return (
            <Select
              key={`content_select`}
              options={filteredOptions}
              onChange={newValue => {
                this.handleSelectChangeDetails(
                  row.Id,
                  "courseContentId",
                  newValue.value,
                  newValue.defaultValue
                );
              }}
              defaultValue={coursecontents.find(
                opt => opt.value == row.courseContentId
              )}
            />
          );
        },
        editable: false,
      },
      { dataField: "percentage", text: this.props.t("Percentage") },
      {
        dataField: "delete",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, course) => (
          <IconButton
            color="secondary"
            onClick={() => this.deleteCourseContent(course)}
          >
            <DeleteIcon style={{ color: "red" }} />
          </IconButton>
        ),
      },
    ];

    const preReqColumn = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      {
        dataField: "prerequiseCourseId",
        text: this.props.t("Pre Requisite Course"),
        formatter: (cell, row) => (
          <div className="col-9">
            <Input
              type="text"
              id="prerequiseCourseId"
              list="CoursedatalistOptions"
              className="form-control"
              defaultValue={
                (
                  newCoursesOpt.find(
                    courseOpt => courseOpt.key === row.prerequiseCourseId
                  ) || {}
                ).value
              }
              onChange={event => {
                this.handleSelectPreReqCourse(
                  row.Id,
                  "prerequiseCourseId",
                  event.target.value
                );
              }}
              autoComplete="off"
            />

            <datalist id="CoursedatalistOptions">
              {filteredCourses.map(courseOpt => (
                <option
                  key={courseOpt.key}
                  value={courseOpt.value + " " + courseOpt.arCourseName}
                />
              ))}
            </datalist>
          </div>
        ),
        editable: false,
      },
      {
        dataField: "prerequiseConditiontId",
        text: this.props.t("Registration Requirement"),
        formatter: (cell, row) => (
          <Select
            key={`pre_req_condition_select`}
            options={prereqs}
            onChange={newValue => {
              this.handleSelectPreReqCondition(
                row.Id,
                "prerequiseConditiontId",
                newValue.value
              );
            }}
            defaultValue={prereqs.find(
              opt => opt.value == row.prerequiseConditiontId
            )}
          />
        ),
        editable: false,
      },
      {
        dataField: "delete",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, course) => (
          <IconButton
            color="secondary"
            onClick={() => this.deletepreReq(course)}
          >
            <DeleteIcon style={{ color: "red" }} />
          </IconButton>
        ),
      },
    ];
    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteCourse}
          onCloseClick={() =>
            this.setState({ deleteModal: false, deleteModal2: false })
          }
        />
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title={this.props.t("Courses")}
              breadcrumbItem={this.props.t("Courses List")}
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
                      columns={courseListColumns}
                      data={courses}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="Id"
                          columns={courseListColumns}
                          data={this.props.courses}
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
                                        title={this.props.t(
                                          "Create New Course"
                                        )}
                                        placement="top"
                                      >
                                        <IconButton
                                          color="primary"
                                          onClick={this.handleCourseClicks}
                                        >
                                          <i className="mdi mdi-plus-circle blue-noti-icon" />
                                        </IconButton>
                                      </Tooltip>
                                    </div>
                                  )}
                                </Col>
                              </Row>
                              <Row>
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      //  selectRow={selectRow}
                                      defaultSorted={defaultSorted}
                                      classes={
                                        "table align-middle table-nowrap table-hover"
                                      }
                                      bordered={true}
                                      striped={false}
                                      responsive
                                      ref={this.node}
                                      filter={filterFactory()}
                                      filterPosition="top"
                                    />

                                    <Modal
                                      isOpen={this.state.modal2}
                                      className={this.props.className}
                                      fullscreen
                                    >
                                      <ModalHeader
                                        toggle={this.toggle2}
                                        tag="h4"
                                      >
                                        {!!isEdit
                                          ? this.props.t("Edit Course")
                                          : this.props.t("Add Course")}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            Id: course.Id,
                                            arCourseName:
                                              (course && course.arCourseName) ||
                                              "",
                                            enCourseName:
                                              (course && course.enCourseName) ||
                                              "",
                                            facultyId:
                                              course && course.facultyId,
                                            depId: course && course.depId,
                                            requiredLevelId:
                                              course && course.requiredLevelId,
                                            code: (course && course.code) || "",
                                            isUniversityReq:
                                              course && course.isUniversityReq,
                                            courseTypeId:
                                              course && course.courseTypeId,
                                            courseLevelId:
                                              course && course.courseLevelId,
                                            nbHours:
                                              (course && course.nbHours) || "",
                                            nbHoursPractice:
                                              (course &&
                                                course.nbHoursPractice) ||
                                              "",
                                            nbHoursTheory:
                                              (course &&
                                                course.nbHoursTheory) ||
                                              "",
                                            arDescriptionDetails:
                                              (course &&
                                                course.arDescriptionDetails) ||
                                              "",
                                            enDescriptionDetails:
                                              (course &&
                                                course.enDescriptionDetails) ||
                                              "",
                                            isDepartmentAccption:
                                              course &&
                                              course.isDepartmentAccption,
                                            isDeanAccption:
                                              course && course.isDeanAccption,
                                            requiredHours:
                                              (course &&
                                                course.requiredHours) ||
                                              "",
                                            requiredAvg:
                                              (course && course.requiredAvg) ||
                                              "",
                                            courseContentArray:
                                              (course &&
                                                course.CoursesContents) ||
                                              "",
                                            preReqArray:
                                              (course &&
                                                course.CoursePrerequisites) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            arCourseName: Yup.string().required(
                                              "Please Enter The Course"
                                            ),
                                            code: Yup.string().required(
                                              "Please Enter The Course code"
                                            ),
                                            nbHours: Yup.number().required(
                                              "Please Enter The Number of Hours"
                                            ),
                                          })}
                                          onSubmit={values => {
                                            if (isEdit) {
                                              const updateCourse = {
                                                Id: values.Id,
                                                arCourseName:
                                                  values["arCourseName"],
                                                enCourseName:
                                                  values["enCourseName"],
                                                facultyId: selectedFaculty ||  values["facultyId"] ,
                                                depId: selectedDepartment ||  values["depId"],
                                                requiredLevelId:
                                                  selectedRequiredLevel || values["requiredLevelId"],
                                                code: values["code"],
                                                isUniversityReq: isUniversity,
                                                courseTypeId:
                                                  selectedCourseType || values["courseTypeId"],
                                                nbHours: values["nbHours"],
                                                nbHoursPractice:
                                                  values["nbHoursPractice"] !==
                                                  ""
                                                    ? parseInt(
                                                        values[
                                                          "nbHoursPractice"
                                                        ]
                                                      )
                                                    : 0,
                                                arDescriptionDetails:
                                                  values[
                                                    "arDescriptionDetails"
                                                  ],
                                                nbHoursTheory:
                                                  values["nbHoursTheory"] !== ""
                                                    ? parseInt(
                                                        values["nbHoursTheory"]
                                                      )
                                                    : 0,
                                                enDescriptionDetails:
                                                  values[
                                                    "enDescriptionDetails"
                                                  ],
                                                courseLevelId:
                                                  selectedCourseLevel || values["courseLevelId"],
                                                isDepartmentAccption:
                                                  departmentAcception,
                                                isDeanAccption: deanAcception,
                                                requiredHours:
                                                  values["requiredHours"] !== ""
                                                    ? parseInt(
                                                        values["requiredHours"]
                                                      )
                                                    : 0,
                                                requiredAvg:
                                                  values["requiredAvg"] !== ""
                                                    ? parseFloat(
                                                        values["requiredAvg"]
                                                      )
                                                    : 0,
                                                CoursesContents:
                                                  courseContentArray,
                                                CoursePrerequisites:
                                                  preReqArray,
                                              };

                                              onUpdateCourse(updateCourse);
                                            } else if (!isEdit) {
                                              const newCourse = {
                                                arCourseName:
                                                  values["arCourseName"],
                                                enCourseName:
                                                  values["enCourseName"],
                                                code: values["code"],
                                                isUniversityReq: isUniversity,

                                                nbHours: values["nbHours"],
                                                nbHoursPractice:
                                                  values["nbHoursPractice"] !==
                                                  ""
                                                    ? parseInt(
                                                        values[
                                                          "nbHoursPractice"
                                                        ]
                                                      )
                                                    : 0,
                                                arDescriptionDetails:
                                                  values[
                                                    "arDescriptionDetails"
                                                  ],
                                                nbHoursTheory:
                                                  values["nbHoursTheory"] !== ""
                                                    ? parseInt(
                                                        values["nbHoursTheory"]
                                                      )
                                                    : 0,
                                                enDescriptionDetails:
                                                  values[
                                                    "enDescriptionDetails"
                                                  ],
                                                courseTypeId:
                                                  selectedCourseType,
                                                courseLevelId:
                                                  selectedCourseLevel,
                                                facultyId: selectedFaculty,
                                                depId: selectedDepartment,
                                                requiredLevelId:
                                                  selectedRequiredLevel,
                                                isDepartmentAccption:
                                                  departmentAcception,
                                                isDeanAccption: deanAcception,
                                                requiredHours:
                                                  values["requiredHours"] !== ""
                                                    ? parseInt(
                                                        values["requiredHours"]
                                                      )
                                                    : 0,
                                                requiredAvg:
                                                  values["requiredAvg"] !== ""
                                                    ? parseFloat(
                                                        values["requiredAvg"]
                                                      )
                                                    : 0,
                                                CoursesContents:
                                                  courseContentArray,
                                                CoursePrerequisites:
                                                  preReqArray,
                                              };
                                              const { onAddNewCourse } =
                                                this.props;
                                              onAddNewCourse(newCourse);
                                              this.setState(prevState => ({
                                                courses: [
                                                  ...prevState.courses,
                                                  newCourse,
                                                ],
                                              }));
                                            }

                                            this.toggle2();
                                          }}
                                        >
                                          {({ errors, status, touched }) => (
                                            <Form>
                                              <Card>
                                                <CardBody>
                                                  <Nav
                                                    pills
                                                    className="navtab-bg nav-justified"
                                                  >
                                                    <NavItem>
                                                      <NavLink
                                                        id="vertical-home-link"
                                                        style={{
                                                          cursor: "pointer",
                                                        }}
                                                        className={classnames({
                                                          active:
                                                            this.state
                                                              .activeTab1 ===
                                                            "5",
                                                        })}
                                                        onClick={() => {
                                                          this.toggle1("5");
                                                        }}
                                                      >
                                                        {t(
                                                          "General Informations"
                                                        )}
                                                      </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                      <NavLink
                                                        id="vertical-home-link"
                                                        style={{
                                                          cursor: "pointer",
                                                        }}
                                                        className={classnames({
                                                          active:
                                                            this.state
                                                              .activeTab1 ===
                                                            "6",
                                                        })}
                                                        onClick={() => {
                                                          this.toggle1("6");
                                                        }}
                                                      >
                                                        {t("Course Content")}
                                                      </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                      <NavLink
                                                        id="vertical-home-link"
                                                        style={{
                                                          cursor: "pointer",
                                                        }}
                                                        className={classnames({
                                                          active:
                                                            this.state
                                                              .activeTab1 ===
                                                            "7",
                                                        })}
                                                        onClick={() => {
                                                          this.toggle1("7");
                                                        }}
                                                      >
                                                        {t("Required Courses")}
                                                      </NavLink>
                                                    </NavItem>
                                                  </Nav>

                                                  <TabContent
                                                    activeTab={
                                                      this.state.activeTab1
                                                    }
                                                    className="p-3 text-muted"
                                                  >
                                                    <TabPane tabId="5">
                                                      <Row>
                                                        <Col sm="12">
                                                          <CardText className="mb-0">
                                                            <Row>
                                                              <Col className="col-6">
                                                                <Card>
                                                                  <div
                                                                    className="header pt-2"
                                                                    id="title"
                                                                  >
                                                                    {this.props.t(
                                                                      "Basic Information"
                                                                    )}
                                                                  </div>
                                                                  <CardBody>
                                                                    <Row>
                                                                      <Col lg="6">
                                                                        <div className="mb-3">
                                                                          <Row>
                                                                            <Col lg="4">
                                                                              <Label className="form-label">
                                                                                {this.props.t(
                                                                                  "Course Name(ar)"
                                                                                )}
                                                                              </Label>
                                                                              <span className="text-danger">
                                                                                *
                                                                              </span>
                                                                            </Col>
                                                                            <Col lg="8">
                                                                              <Field
                                                                                name="arCourseName"
                                                                                type="text"
                                                                                className={
                                                                                  "form-control" +
                                                                                  (errors.arCourseName &&
                                                                                  touched.arCourseName
                                                                                    ? " is-invalid"
                                                                                    : "")
                                                                                }
                                                                              />
                                                                              <ErrorMessage
                                                                                name="arCourseName"
                                                                                component="div"
                                                                                className="invalid-feedback"
                                                                              />
                                                                            </Col>
                                                                          </Row>
                                                                        </div>

                                                                        <div className="mb-3">
                                                                          <Row>
                                                                            <Col lg="4">
                                                                              <Label className="form-label">
                                                                                {this.props.t(
                                                                                  "Course Code"
                                                                                )}
                                                                              </Label>
                                                                              <span className="text-danger">
                                                                                *
                                                                              </span>
                                                                            </Col>
                                                                            <Col lg="8">
                                                                              <Field
                                                                                name="code"
                                                                                type="text"
                                                                                className={
                                                                                  "form-control" +
                                                                                  (errors.code &&
                                                                                  touched.code
                                                                                    ? " is-invalid"
                                                                                    : "")
                                                                                }
                                                                              />
                                                                              <ErrorMessage
                                                                                name="code"
                                                                                component="div"
                                                                                className="invalid-feedback"
                                                                              />
                                                                            </Col>
                                                                          </Row>
                                                                        </div>

                                                                        <div className="mb-3">
                                                                          <Row>
                                                                            <Col lg="6">
                                                                              <Label className="form-label">
                                                                                {this.props.t(
                                                                                  "Course Type"
                                                                                )}
                                                                              </Label>
                                                                              <Select
                                                                                className="select-style-course"
                                                                                name="courseTypeId"
                                                                                key="courseType_select"
                                                                                options={
                                                                                  courseTypes
                                                                                }
                                                                                onChange={newValue => {
                                                                                  this.handleSelectChange(
                                                                                    "courseTypeId",
                                                                                    newValue.value
                                                                                  );
                                                                                }}
                                                                                defaultValue={courseTypes.find(
                                                                                  opt =>
                                                                                    opt.value ===
                                                                                    course.courseTypeId
                                                                                )}
                                                                              />
                                                                            </Col>
                                                                            <Col lg="6">
                                                                              <Label className="form-label">
                                                                                {this.props.t(
                                                                                  "Level"
                                                                                )}
                                                                              </Label>
                                                                              <Select
                                                                                className="select-style-course"
                                                                                name="courseLevelId"
                                                                                key={`courseLevel_select`}
                                                                                options={
                                                                                  levels
                                                                                }
                                                                                onChange={newValue => {
                                                                                  this.handleSelectChange(
                                                                                    "courseLevelId",
                                                                                    newValue.value
                                                                                  );
                                                                                }}
                                                                                defaultValue={levels.find(
                                                                                  opt =>
                                                                                    opt.value ===
                                                                                    course.courseLevelId
                                                                                )}
                                                                              />
                                                                            </Col>
                                                                          </Row>
                                                                        </div>

                                                                        <div className="mb-3">
                                                                          <Row>
                                                                            <Col lg="4">
                                                                              <Label className="form-label">
                                                                                {this.props.t(
                                                                                  "Hours Number"
                                                                                )}
                                                                              </Label>
                                                                              <span className="text-danger">
                                                                                *
                                                                              </span>
                                                                            </Col>
                                                                            <Col lg="8">
                                                                              <Field
                                                                                name="nbHours"
                                                                                type="number"
                                                                                className={
                                                                                  "form-control" +
                                                                                  (errors.nbHours &&
                                                                                  touched.nbHours
                                                                                    ? " is-invalid"
                                                                                    : "")
                                                                                }
                                                                              />
                                                                              <ErrorMessage
                                                                                name="nbHours"
                                                                                component="div"
                                                                                className="invalid-feedback"
                                                                              />
                                                                            </Col>
                                                                          </Row>
                                                                        </div>

                                                                        <div className="mb-3">
                                                                          <Row>
                                                                            <Col lg="4">
                                                                              <Label className="form-label">
                                                                                {this.props.t(
                                                                                  "Description(ar)"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col lg="8">
                                                                              <Field
                                                                                name="arDescriptionDetails"
                                                                                type="textarea"
                                                                                as="textarea"
                                                                                className={
                                                                                  "form-control" +
                                                                                  (errors.arDescriptionDetails &&
                                                                                  touched.arDescriptionDetails
                                                                                    ? " is-invalid"
                                                                                    : "")
                                                                                }
                                                                              />
                                                                              <ErrorMessage
                                                                                name="arDescriptionDetails"
                                                                                component="div"
                                                                                className="invalid-feedback"
                                                                              />
                                                                            </Col>
                                                                          </Row>
                                                                        </div>
                                                                      </Col>
                                                                      <Col lg="6">
                                                                        <div className="mb-3">
                                                                          <Row>
                                                                            <Col lg="4">
                                                                              <Label className="form-label">
                                                                                Course
                                                                                Name
                                                                              </Label>
                                                                            </Col>
                                                                            <Col lg="8">
                                                                              <Field
                                                                                name="enCourseName"
                                                                                type="text"
                                                                                className={
                                                                                  "form-control" +
                                                                                  (errors.enCourseName &&
                                                                                  touched.enCourseName
                                                                                    ? " is-invalid"
                                                                                    : "")
                                                                                }
                                                                              />
                                                                              <ErrorMessage
                                                                                name="enCourseName"
                                                                                component="div"
                                                                                className="invalid
                                                      -feedback"
                                                                              />
                                                                            </Col>
                                                                          </Row>
                                                                        </div>

                                                                        <div
                                                                          className="mb-3"
                                                                          style={{
                                                                            paddingTop:
                                                                              "3px",
                                                                            paddingBottom:
                                                                              "8px",
                                                                          }}
                                                                        >
                                                                          <Row>
                                                                            <Col lg="4">
                                                                              <Label className="form-label">
                                                                                {this.props.t(
                                                                                  "University Requirement"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col lg="8">
                                                                              <Input
                                                                                type="checkbox"
                                                                                name="isUniversityReq"
                                                                                className={`form-check-input input-mini ${
                                                                                  course.isUniversityReq &&
                                                                                  errors.isUniversityReq &&
                                                                                  touched.isUniversityReq
                                                                                    ? "is-invalid"
                                                                                    : ""
                                                                                }`}
                                                                                id="behaviorButton"
                                                                                defaultChecked={
                                                                                  course.isUniversityReq
                                                                                }
                                                                                onChange={event =>
                                                                                  this.handleCheckboxChange(
                                                                                    event
                                                                                      .target
                                                                                      .checked,
                                                                                    "isUniversityReq"
                                                                                  )
                                                                                }
                                                                              />
                                                                            </Col>
                                                                          </Row>
                                                                        </div>

                                                                        {!isUniversity && (
                                                                          <div className="uni-req">
                                                                            <FormGroup>
                                                                              <div className="mb-3">
                                                                                <Row>
                                                                                  <Col lg="6">
                                                                                    <Col lg="6">
                                                                                      <Label className="form-label">
                                                                                        {this.props.t(
                                                                                          "Faculty"
                                                                                        )}
                                                                                      </Label>
                                                                                    </Col>
                                                                                    <Col lg="6">
                                                                                      <Select
                                                                                        className="select-style"
                                                                                        name="facultyId"
                                                                                        key={`faculty_select`}
                                                                                        options={
                                                                                          faculties
                                                                                        }
                                                                                        onChange={newValue => {
                                                                                          this.handleSelectChange(
                                                                                            "facultyId",
                                                                                            newValue.value
                                                                                          );
                                                                                        }}
                                                                                        defaultValue={faculties.find(
                                                                                          opt =>
                                                                                            opt.value ===
                                                                                            course.facultyId
                                                                                        )}
                                                                                      />
                                                                                    </Col>
                                                                                  </Col>
                                                                                  <Col lg="6">
                                                                                    <Col lg="6">
                                                                                      <Label className="form-label">
                                                                                        {this.props.t(
                                                                                          "Department"
                                                                                        )}
                                                                                      </Label>
                                                                                    </Col>
                                                                                    <Col lg="6">
                                                                                      <Select
                                                                                        className="select-style"
                                                                                        name="depId"
                                                                                        key={`department_select`}
                                                                                        options={
                                                                                          filteredDepartments
                                                                                        }
                                                                                        onChange={newValue => {
                                                                                          this.handleSelectChange(
                                                                                            "depId",
                                                                                            newValue.value
                                                                                          );
                                                                                        }}
                                                                                        defaultValue={departments.find(
                                                                                          opt =>
                                                                                            opt.value ===
                                                                                            course.depId
                                                                                        )}
                                                                                      />
                                                                                    </Col>
                                                                                  </Col>
                                                                                </Row>
                                                                              </div>
                                                                            </FormGroup>
                                                                          </div>
                                                                        )}

                                                                        <div className="mb-3">
                                                                          <Row>
                                                                            <Col lg="3">
                                                                              <Label className="form-label">
                                                                                {this.props.t(
                                                                                  "Theory Hours"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col lg="3">
                                                                              <Field
                                                                                name="nbHoursTheory"
                                                                                type="number"
                                                                                className={
                                                                                  "form-control" +
                                                                                  (errors.nbHoursTheory &&
                                                                                  touched.nbHoursTheory
                                                                                    ? " is-invalid"
                                                                                    : "")
                                                                                }
                                                                              />
                                                                              <ErrorMessage
                                                                                name="nbHoursTheory"
                                                                                component="div"
                                                                                className="invalid-feedback"
                                                                              />
                                                                            </Col>
                                                                            <Col lg="3">
                                                                              <Label className="form-label">
                                                                                {this.props.t(
                                                                                  "Practice Hours"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col lg="3">
                                                                              <Field
                                                                                name="nbHoursPractice"
                                                                                type="number"
                                                                                className={
                                                                                  "form-control" +
                                                                                  (errors.nbHoursPractice &&
                                                                                  touched.nbHoursPractice
                                                                                    ? " is-invalid"
                                                                                    : "")
                                                                                }
                                                                              />
                                                                              <ErrorMessage
                                                                                name="nbHoursPractice"
                                                                                component="div"
                                                                                className="invalid-feedback"
                                                                              />
                                                                            </Col>
                                                                          </Row>
                                                                        </div>

                                                                        <div className="mb-3">
                                                                          <Row>
                                                                            <Col lg="4">
                                                                              <Label className="form-label">
                                                                                Description
                                                                              </Label>
                                                                            </Col>
                                                                            <Col lg="8">
                                                                              <Field
                                                                                name="enDescriptionDetails"
                                                                                type="textarea"
                                                                                as="textarea"
                                                                                className={
                                                                                  "form-control" +
                                                                                  (errors.enDescriptionDetails &&
                                                                                  touched.enDescriptionDetails
                                                                                    ? " is-invalid"
                                                                                    : "")
                                                                                }
                                                                              />
                                                                              <ErrorMessage
                                                                                name="enDescriptionDetails"
                                                                                component="div"
                                                                                className="invalid-feedback"
                                                                              />
                                                                            </Col>
                                                                          </Row>
                                                                        </div>
                                                                      </Col>
                                                                    </Row>
                                                                  </CardBody>
                                                                </Card>
                                                              </Col>

                                                              <Col className="col-6">
                                                                <Card>
                                                                  <div
                                                                    className="header pt-2"
                                                                    id="title"
                                                                  >
                                                                    {this.props.t(
                                                                      "Course Requirements"
                                                                    )}
                                                                  </div>
                                                                  <CardBody>
                                                                    <Row>
                                                                      <Col lg="6">
                                                                        <div className="mb-3">
                                                                          <Row>
                                                                            <Col lg="4">
                                                                              <Label className="form-label">
                                                                                {this.props.t(
                                                                                  "Required Level"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col lg="4">
                                                                              <Select
                                                                                className="select-style"
                                                                                name="requiredLevelId"
                                                                                key={`req_level_select`}
                                                                                options={
                                                                                  levels
                                                                                }
                                                                                onChange={newValue => {
                                                                                  this.handleSelectChange(
                                                                                    "requiredLevelId",
                                                                                    newValue.value
                                                                                  );
                                                                                }}
                                                                                defaultValue={levels.find(
                                                                                  opt =>
                                                                                    opt.value ===
                                                                                    course.requiredLevelId
                                                                                )}
                                                                              />
                                                                            </Col>
                                                                          </Row>
                                                                        </div>

                                                                        <div className="mb-3">
                                                                          <Row>
                                                                            <Col lg="4">
                                                                              <label className="form-label">
                                                                                {this.props.t(
                                                                                  "Required Average"
                                                                                )}
                                                                              </label>
                                                                            </Col>
                                                                            <Col lg="8">
                                                                              <InputGroup>
                                                                                <Field
                                                                                  type="number"
                                                                                  name="requiredAvg"
                                                                                  id="autoSizingInputGroup"
                                                                                  className={
                                                                                    "form-control" +
                                                                                    (errors.requiredAvg &&
                                                                                    touched.requiredAvg
                                                                                      ? " is-invalid"
                                                                                      : "")
                                                                                  }
                                                                                />
                                                                                <div className="input-group-text">
                                                                                  <span>
                                                                                    %
                                                                                  </span>
                                                                                </div>
                                                                              </InputGroup>
                                                                            </Col>
                                                                          </Row>
                                                                        </div>

                                                                        <div className="mb-3">
                                                                          <Row>
                                                                            <Col lg="4">
                                                                              <Label className="form-label">
                                                                                {this.props.t(
                                                                                  "Dean Acception"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col lg="8">
                                                                              <div
                                                                                name="isDeanAccption"
                                                                                id="basicpill-isDeanAccption-input2"
                                                                                role="group"
                                                                                className={`btn-group btn-group-example mb-3 ${
                                                                                  course.isDeanAccption &&
                                                                                  errors.isDeanAccption &&
                                                                                  touched.isDeanAccption
                                                                                    ? "is-invalid"
                                                                                    : ""
                                                                                }`}
                                                                              >
                                                                                <div className="square-switch">
                                                                                  <input
                                                                                    name="isDeanAccption"
                                                                                    type="checkbox"
                                                                                    id="square-switch2"
                                                                                    switch="info"
                                                                                    defaultChecked={
                                                                                      course.isDeanAccption
                                                                                    }
                                                                                    onChange={event =>
                                                                                      this.handleCheckboxChange(
                                                                                        event
                                                                                          .target
                                                                                          .checked,
                                                                                        "isDeanAccption"
                                                                                      )
                                                                                    }
                                                                                  />
                                                                                  <label
                                                                                    htmlFor="square-switch2"
                                                                                    data-on-label={t(
                                                                                      "Yes"
                                                                                    )}
                                                                                    data-off-label={t(
                                                                                      "No"
                                                                                    )}
                                                                                  />
                                                                                </div>
                                                                              </div>
                                                                            </Col>
                                                                          </Row>
                                                                        </div>

                                                                        <div className="mb-3">
                                                                          <Row>
                                                                            <Col lg="4">
                                                                              <Label className="form-label">
                                                                                {this.props.t(
                                                                                  "Department Acception"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col lg="8">
                                                                              <div
                                                                                name="isDepartmentAccption"
                                                                                id="basicpill-isDepartmentAccption-input2"
                                                                                role="group"
                                                                                className={`btn-group btn-group-example mb-3 ${
                                                                                  course.isDepartmentAccption &&
                                                                                  errors.isDepartmentAccption &&
                                                                                  touched.isDepartmentAccption
                                                                                    ? "is-invalid"
                                                                                    : ""
                                                                                }`}
                                                                              >
                                                                                <div className="square-switch">
                                                                                  <input
                                                                                    name="isDepartmentAccption"
                                                                                    type="checkbox"
                                                                                    id="square-switch1"
                                                                                    switch="info"
                                                                                    defaultChecked={
                                                                                      course.isDepartmentAccption
                                                                                    }
                                                                                    onChange={event =>
                                                                                      this.handleCheckboxChange(
                                                                                        event
                                                                                          .target
                                                                                          .checked,
                                                                                        "isDepartmentAccption"
                                                                                      )
                                                                                    }
                                                                                  />
                                                                                  <label
                                                                                    htmlFor="square-switch1"
                                                                                    data-on-label={t(
                                                                                      "Yes"
                                                                                    )}
                                                                                    data-off-label={t(
                                                                                      "No"
                                                                                    )}
                                                                                  />
                                                                                </div>
                                                                              </div>
                                                                            </Col>
                                                                          </Row>
                                                                        </div>
                                                                      </Col>
                                                                      <Col lg="6">
                                                                        <div className="mb-3">
                                                                          <Row>
                                                                            <Col lg="4">
                                                                              <Label className="form-label">
                                                                                {this.props.t(
                                                                                  "Required Hours"
                                                                                )}
                                                                              </Label>
                                                                            </Col>
                                                                            <Col lg="8">
                                                                              <Field
                                                                                name="requiredHours"
                                                                                type="number"
                                                                                className={
                                                                                  "form-control" +
                                                                                  (errors.requiredHours &&
                                                                                  touched.requiredHours
                                                                                    ? " is-invalid"
                                                                                    : "")
                                                                                }
                                                                              />
                                                                              <ErrorMessage
                                                                                name="requiredHours"
                                                                                component="div"
                                                                                className="invalid-feedback"
                                                                              />
                                                                            </Col>
                                                                          </Row>
                                                                        </div>
                                                                      </Col>
                                                                    </Row>
                                                                  </CardBody>
                                                                </Card>
                                                              </Col>
                                                            </Row>
                                                            <Row>
                                                              <Col className="col-md-8 mx-auto">
                                                                <div className="text-center">
                                                                  <button
                                                                    type="submit"
                                                                    className="btn save-button"
                                                                  >
                                                                    {this.props.t(
                                                                      "Save"
                                                                    )}
                                                                  </button>
                                                                </div>
                                                              </Col>
                                                            </Row>
                                                          </CardText>
                                                        </Col>
                                                      </Row>
                                                    </TabPane>
                                                    <TabPane tabId="6">
                                                      {duplicateCourseContentError && (
                                                        <Alert
                                                          color="danger"
                                                          className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                          role="alert"
                                                        >
                                                          {
                                                            duplicateCourseContentError
                                                          }
                                                          <button
                                                            type="button"
                                                            className="btn-close"
                                                            aria-label="Close"
                                                            onClick={
                                                              this
                                                                .handleAlertCloseCourseContent
                                                            }
                                                          ></button>
                                                        </Alert>
                                                      )}
                                                      <Row>
                                                        <Col>
                                                          <div className="text-sm-end">
                                                            <Tooltip
                                                              title={this.props.t(
                                                                "Add"
                                                              )}
                                                              placement="top"
                                                            >
                                                              <IconButton
                                                                color="primary"
                                                                onClick={
                                                                  this
                                                                    .handleAddNewCourseContent
                                                                }
                                                              >
                                                                <i className="mdi mdi-plus-circle blue-noti-icon" />
                                                              </IconButton>
                                                            </Tooltip>
                                                          </div>
                                                        </Col>
                                                      </Row>
                                                      <BootstrapTable
                                                        keyField="Id"
                                                        data={
                                                          courseContentArray
                                                        }
                                                        columns={
                                                          courseContentColumn
                                                        }
                                                        cellEdit={cellEditFactory(
                                                          {
                                                            mode: "click",
                                                            blurToSave: true,
                                                            afterSaveCell: (
                                                              oldValue,
                                                              newValue,
                                                              row,
                                                              column
                                                            ) => {
                                                              this.handleCourseContentDataChange(
                                                                row.Id,
                                                                column.dataField,
                                                                newValue
                                                              );
                                                            },
                                                          }
                                                        )}
                                                        noDataIndication={t(
                                                          "No Required courses Found"
                                                        )}
                                                        defaultSorted={
                                                          defaultSorted
                                                        }
                                                      />

                                                      <Row>
                                                        <Col className="col-md-8 mx-auto">
                                                          <div className="text-center">
                                                            <button
                                                              type="submit"
                                                              className="btn save-button"
                                                            >
                                                              {this.props.t(
                                                                "Save"
                                                              )}
                                                            </button>
                                                          </div>
                                                        </Col>
                                                      </Row>
                                                    </TabPane>
                                                    <TabPane tabId="7">
                                                      {duplicateCourseContentError && (
                                                        <Alert
                                                          color="danger"
                                                          className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                          role="alert"
                                                        >
                                                          {duplicatePreReqError}
                                                          <button
                                                            type="button"
                                                            className="btn-close"
                                                            aria-label="Close"
                                                            onClick={
                                                              this
                                                                .handleAlertClosePreReq
                                                            }
                                                          ></button>
                                                        </Alert>
                                                      )}
                                                      <Row>
                                                        <Col>
                                                          <div className="text-sm-end">
                                                            <Tooltip
                                                              title={this.props.t(
                                                                "Add"
                                                              )}
                                                              placement="top"
                                                            >
                                                              <IconButton
                                                                color="primary"
                                                                onClick={
                                                                  this
                                                                    .handleAddNewPreReq
                                                                }
                                                              >
                                                                <i className="mdi mdi-plus-circle blue-noti-icon" />
                                                              </IconButton>
                                                            </Tooltip>
                                                          </div>
                                                        </Col>
                                                      </Row>
                                                      <BootstrapTable
                                                        keyField="Id"
                                                        data={preReqArray}
                                                        columns={preReqColumn}
                                                        cellEdit={cellEditFactory(
                                                          {
                                                            mode: "click",
                                                            blurToSave: true,
                                                            /*   afterSaveCell:
                                                                            (
                                                                              oldValue,
                                                                              newValue,
                                                                              row,
                                                                              column
                                                                            ) => {
                                                                              this.handlePreReqDataChange(
                                                                                row.Id,
                                                                                column.dataField,
                                                                                newValue
                                                                              );
                                                                            }, */
                                                          }
                                                        )}
                                                        noDataIndication={t(
                                                          "No Relatives Found"
                                                        )}
                                                        defaultSorted={
                                                          defaultSorted
                                                        }
                                                      />

                                                      <Row>
                                                        <Col className="col-md-8 mx-auto">
                                                          <div className="text-center">
                                                            <button
                                                              type="submit"
                                                              className="btn save-button"
                                                            >
                                                              {this.props.t(
                                                                "Save"
                                                              )}
                                                            </button>
                                                          </div>
                                                        </Col>
                                                      </Row>
                                                    </TabPane>
                                                  </TabContent>
                                                </CardBody>
                                              </Card>
                                            </Form>
                                          )}
                                        </Formik>
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

const mapStateToProps = ({
  courses,
  mobAppFacultyAccs,
  courseTypes,
  levels,
  departments,
  coursecontents,
  prereqs,
  menu_items,
}) => ({
  courses: courses.courses,
  coursesOpt: courses.coursesOpt,
  deleted: courses.deleted,
  course_requiredCourses: courses.course_requiredCourses,
  courseTypes: courseTypes.courseTypes,
  levels: levels.levels,
  departments: departments.departments,
  filteredDepartments: departments.filteredDepartments,
  coursecontents: coursecontents.coursecontents,
  prereqs: prereqs.prereqs,
  faculties: mobAppFacultyAccs.faculties,
  defaultValues: coursecontents.defaultValues,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetCourses: () => dispatch(getCourses()),
  onAddNewCourse: course => dispatch(addNewCourse(course)),
  onUpdateCourse: course => dispatch(updateCourse(course)),
  onDeleteCourse: course => dispatch(deleteCourse(course)),
  onGetCourseRequiredCourses: course =>
    dispatch(getCourseRequiredCourses(course)),
  onAddNewCourseRequiredCourse: reqCourse =>
    dispatch(addNewCourseRequiredCourse(reqCourse)),
  onUpdateCourseRequiredCourse: reqCourse =>
    dispatch(updateCourseRequiredCourse(reqCourse)),
  onDeleteCourseRequiredCourse: reqCourse =>
    dispatch(deleteCourseRequiredCourse(reqCourse)),
  onGetFilteredDepartments: facultyId =>
    dispatch(getFilteredDepartments(facultyId)),
  onGetCourseDeletedValue: () => dispatch(getCourseDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(Courses)));
