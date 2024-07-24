import React, { Component } from "react";
import {
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Input,
  Button,
  ModalHeader,
  Modal,
  ModalBody,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Label,
} from "reactstrap";
import Select from "react-select";
import classnames from "classnames";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import {
  getCoursesRegistration,
  addNewCoursesRegistration,
  updateCoursesRegistration,
  deleteCoursesRegistration,
  getAvailableCourses,
  addNewAvailableCourse,
  getNonActiveStdCurr,
  updateNonActiveStdCurr,
  deleteNonActiveStdCurr,
  getTempStdSchedules,
  deleteAllNonActiveStdCurr,
  getAchievedCourses,
  getStudentRegisterInfo,
  saveAllNonActiveStdCurr
} from "store/courses-registration/actions";
import { fetchYearsSemesters } from "store/general-management/actions";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import { getReqTypes } from "store/req-types/actions";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
const LECTURE_PERIOD_STORAGE_KEY = "editableCoursesRegistration";
import { Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";
import { CoPresent } from "@mui/icons-material";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
class CoursesRegistrationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab1: "5",
      activeTab: "0",
      activeTab2: "0",
      mainTab: "5",
      duplicateError: null,
      duplicateStudent: null,
      successMessage:null,
      newStartTime: "",
      newEndTime: "",
      newDuration: "",
      modal: false,
      studentEdit: {},
      nonActiveCourse: {},
      deleteModal: false,
      currReqType: null,
      totalHours: null,
      colorsArray: [
        "#CDF5F6",
        "#fbffd5",
        "#F9D8D6",
        "#D6CDEA",
        "#CAF1DE",
        "#C4DDFE",
        "#FFECFB",
        "#ff8b94",
        "#cbf7b7",
        "#7E8CD2",
      ],
      selectedEducation: "Only Failed Courses",
      defaultSemester: "",
      failedCourses: false,
      failedWithPassed: false,
      timings: [],
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,

    };
    this.colorMap = {};
    this.colors = ["#A9E6EB", "#f7f7bf", "#F0B9B7", "#BEB4DA", "#B0EBCF", "#AFCDFD", "#FCCDF5", "#ff7179", "#c7f0a5", "#6E7BBF"];
    this.shuffleColors();
    this.colorIndex = 0;

    this.toggle = this.toggle.bind(this);
    this.toggle1 = this.toggle1.bind(this);
    this.toggleTab = this.toggleTab.bind(this);
  }
  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };
  toggle1(tab) {
    if (this.state.activeTab1 !== tab) {
      this.setState({
        activeTab1: tab,
        activeTab: "0",
        activeTab2: "0",
      });

    }
    
  }
  toggleTab(tab) {
    const { onGetAvailableCourses, onGetTempStdSchedules } = this.props;
    const { studentEdit } = this.state;
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
        currReqType: tab,
      });
    }
  }
  toggleMainTab(tab) {
    const {studentEdit} = this.state;
    const {onGetNonActiveStdCurr} = this.props;
    if (this.state.mainTab !== tab) {
      this.setState({
        mainTab: tab,
        duplicateError:null,
        duplicateStudent:null,
        successMessage:null
      });
      if(tab==="6"){
        onGetNonActiveStdCurr(1, studentEdit.SID);
      } 
      else{
        onGetNonActiveStdCurr(0, studentEdit.SID);

      }
    }
  }
  toggleTab2(tab) {
    if (this.state.activeTab2 !== tab) {
      this.setState({
        activeTab2: tab,
      });
    }
  }
  calculateTotalHours = () => {
    const { nonActiveStdCurrs } = this.props;
    const total = nonActiveStdCurrs.reduce(
      (acc, item) => acc + item.nbHours,
      0
    );
    return total;
  };
  componentDidUpdate(prevProps, prevState) {
    const { timings } = this.state;
    const { nonActiveStdCurrs } = this.props;
    if (prevProps.nonActiveStdCurrs !== this.props.nonActiveStdCurrs) {
      const totalHours = this.calculateTotalHours();
      this.setState({ totalHours });
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

  forceRender = () => {
    this.setState(prevState => ({
      dummyVariable: prevState.dummyVariable + 1,
    }));
  };

  generateRandomColor() {
    const { colorsArray } = this.state;
    const { nonActiveStdCurrs } = this.props;

    const usedColors = nonActiveStdCurrs.map(course => course.color);

    const availableColors = colorsArray.filter(
      color => !usedColors.includes(color)
    );

    if (availableColors.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * availableColors.length);
    return availableColors[randomIndex];
  }

  componentDidMount() {
    const {
      coursesRegistration,
      onGetCoursesRegistration,
      weekDays,
      lecturePeriods,
      onGetReqTypes,
      reqTypes,
      onfetchSetting,
      yearSemesters,
      user_menu
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (coursesRegistration && !coursesRegistration.length) {
      onfetchSetting();
      onGetCoursesRegistration();

      this.setState({ coursesRegistration });
      this.setState({ weekDays });
      this.setState({ lecturePeriods });
      this.setState({ reqTypes });
      this.setState({ yearSemesters });
    }
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
    this.setState({ activeTab1: "5" });
  }

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

  handleAlertClose = () => {
    this.setState({ duplicateError: null,
      duplicateStudent:null
    });
  };

  handleEditUniStudent = universityStudent => {
    const { studentEdit } = this.state;
    const {
      onGetNonActiveStdCurr,
      onGetTempStdSchedules,
      onGetAchievedCourses,
      onGetReqTypes,
      onGetAvailableCourses,
      onGetStudentRegisterInfo,
    } = this.props;
    console.log("universityStudent",universityStudent)
    onGetNonActiveStdCurr(0, universityStudent.SID);
    this.setState({ studentEdit: universityStudent });

    onGetReqTypes({facultyId :universityStudent.FacultyId});
    onGetTempStdSchedules(universityStudent.SID);

    onGetAchievedCourses(universityStudent.SID);
    onGetAvailableCourses(0, universityStudent.SID);
    onGetStudentRegisterInfo(universityStudent.SID);
    this.toggle();
  };

  onClickDelete = (row,active) => {
    this.setState({ nonActiveCourse: row, active:active });
    this.setState({ deleteModal: true });
  };
  handleDeleteNonActiveStdCurr = () => {
    const { onDeleteNonActiveStdCurr } = this.props;
    const { nonActiveCourse,active } = this.state;
    if(active==0){
    this.resetNonActiveStdCurrs(nonActiveCourse);
  }
    let del = { Id: nonActiveCourse.Id,
     };
    onDeleteNonActiveStdCurr(del);
    this.setState({ deleteModal: false })

  };
  handleAddToAddedCourses = (row, currentStatus, fieldName) => {
    const { onAddNewAvailableCourse, currentSemester, onGetNonActiveStdCurr } =
      this.props;
    const { studentEdit, currReqType } = this.state;
    const newRow = {
      courseId: row.courseId,
      StudentId: studentEdit.SID,
      Code: row.courseCode,
      YearSemesterId: currentSemester.cuYearSemesterId,
      active: 0,
      color: this.generateRandomColor(),
    };
    onAddNewAvailableCourse(newRow);
  };
 
   

  handleActiveSelectChange = (rowId, fieldName, selectedValue, oldValue) => {
    const { onUpdateNonActiveStdCurr, nonActiveStdCurrs } = this.props;
    const {studentEdit} = this.state
    let onUpdate = { Id: rowId };
    onUpdate["studentId"] = studentEdit.SID;
    const checkOverlap = (interval1, interval2) => {
        return interval1.startTimeValue < interval2.endTimeValue && interval1.endTimeValue > interval2.startTimeValue;
    };

    const checkOverlapWithSelected = (selectedValue) => {
        const overlaps = [];
        const selectedIntervals = selectedValue.details.map(detail => ({
            startTimeValue: detail.startTimeValue,
            endTimeValue: detail.endTimeValue
        }));

        selectedIntervals.forEach(selectedInterval => {
            selectedDetails.forEach(detail => {
                if (detail.type === selectedValue.type && detail.rowId === selectedValue.rowId) {
                    return;
                }

                const detailInterval = {
                    startTimeValue: detail.startTimeValue,
                    endTimeValue: detail.endTimeValue
                };
                if (checkOverlap(selectedInterval, detailInterval)) {
                    overlaps.push(detail);
                }
            });
        });

        return overlaps;
    };

    

    const selectedDetails = [];

nonActiveStdCurrs.forEach(course => {
    if (course.sections) {
        course.sections.forEach(section => {
            if (course.SectionId && section.value === course.SectionId) {
                section.details.forEach(detail => {
                    selectedDetails.push({ ...detail, type: 'section', rowId: course.Id });
                });
            }
        });
    }

    if (course.labs) {
        course.labs.forEach(lab => {
            if (course.LabId && lab.value === course.LabId) {
                lab.details.forEach(detail => {
                    selectedDetails.push({ ...detail, type: 'lab', rowId: course.Id });
                });
            }
        });
    }
});


    const overlaps = checkOverlapWithSelected(selectedValue);

    
    if (overlaps.length > 0) {
      
      this.setState({duplicateStudent:"There is a time conflict"})
  } else {
     
      if (fieldName === "section") {
        onUpdate["SectionId"] = selectedValue.value;
    } else {
        onUpdate["LabId"] = selectedValue.value;
    }

    onUpdateNonActiveStdCurr(onUpdate, 1);
    this.setState({duplicateStudent:null})

  }
}
handleSelectChange = (row, fieldName, selectedValue) => {
  const { studentEdit, timings } = this.state;
  const { onUpdateNonActiveStdCurr } = this.props;
  let onUpdate = { Id: row.Id };
  onUpdate["studentId"] = studentEdit.SID;
  if (fieldName === "section") {
    const selectedSection = row.sections.find(
      section => section.value === selectedValue
    );
    onUpdate["SectionId"] = selectedValue;
    const newTimings = [...timings];
    const existingIndex = newTimings.findIndex(
      timing => timing.type === "section" && timing.rowId === row.Id
    );
    if (existingIndex !== -1) {
      newTimings[existingIndex] = selectedSection;
    } else {
      newTimings.push(selectedSection);
    }
    this.setState({ timings: newTimings });
  } else {
    const selectedLab = row.labs.find(lab => lab.value === selectedValue);
    onUpdate["LabId"] = selectedValue;
    const newTimings = [...timings];
    const existingIndex = newTimings.findIndex(
      timing => timing.type === "lab" && timing.rowId === row.Id
    );
    if (existingIndex !== -1) {
      newTimings[existingIndex] = selectedLab;
    } else {
      newTimings.push(selectedLab);
    }
    this.setState({ timings: newTimings });
  }
  onUpdateNonActiveStdCurr(onUpdate,0);
};
  handleRadioChange = value => {
    this.setState({ selectedEducation: value });
  };
  resetAllNonActiveStdCurrs = () => {
    const { studentEdit } = this.state;
    const { onDeleteAllNonActiveStdCurr, currentSemester } = this.props;
    let ob = {};
    ob["studentId"] = studentEdit.SID;
    ob["flag"] = "reset";
    ob["semesterYearId"] = currentSemester.cuYearSemesterId;
    onDeleteAllNonActiveStdCurr(ob);
    this.setState({ timings: [] });
  };
  deleteAllNonActiveStdCurrs = () => {
    this.resetAllNonActiveStdCurrs();
    const { studentEdit } = this.state;
    const { onDeleteAllNonActiveStdCurr, currentSemester } = this.props;
    let ob = {};
    ob["studentId"] = studentEdit.SID;
    ob["flag"] = "delete";
    ob["semesterYearId"] = currentSemester.cuYearSemesterId;

    onDeleteAllNonActiveStdCurr(ob);
  };
  handleActiveFailed = course => {
    if (course === "failedOnly") {
      this.setState(prevState => ({
        failedCourses: !prevState.failedCourses,
      }));
      this.setState({ failedWithPassed: false });
    } else if (course === "failedWithPassed") {
      this.setState(prevState => ({
        failedWithPassed: !prevState.failedWithPassed,
      }));
      this.setState({ failedCourses: false });
    }
  };
  saveStudent = () => {
    const { studentRegisterInfo ,nonActiveStdCurrs,onSaveAllNonActiveStdCurr,currentSemester} = this.props;
    const { totalHours,studentEdit } = this.state;
    const minHours =
      studentRegisterInfo &&
      studentRegisterInfo[0] &&
      studentRegisterInfo[0].minRegisteredHour;
    let errors = [];
    let ob = {};
    ob["studentId"] = studentEdit.SID;
    ob["yearSemesterId"] = currentSemester.cuYearSemesterId;
    
    if (minHours > totalHours) {
      errors.push("Minimum registered hours requirement not met.");
      this.setState({duplicateError:"Minimum registered hours requirement not met."})
    } else {
      nonActiveStdCurrs.forEach(student => {
        if (!student.SectionId) {
          errors.push(`SectionId is empty for student: ${student.code}`);
          this.setState({duplicateError:"Fill the options"})

        }
        if (student.hasLab === 1 && !student.LabId) {
          errors.push(`LabId is empty for student: ${student.code}`);
          this.setState({duplicateError:"Fill the options"})


        }
      });
    }
  
    if (errors.length > 0) {
      console.error("Errors occurred:", errors);

    } else {
     
      onSaveAllNonActiveStdCurr(ob);
    this.setState({totalHours:0,
      timings:[],
      duplicateError:null
    });
    this.setState({successMessage:"Data filled in successfully"})
  setTimeout(() => {
    this.toggleMainTab("6");
  }, 1000);  }
  };
  resetNonActiveStdCurrs = row => {
    const { studentEdit, timings } = this.state;
    const { onUpdateNonActiveStdCurr, onGetNonActiveStdCurr } = this.props;

    const newTimings = timings.filter(timing => timing.rowId !== row.Id);

    this.setState({ timings: newTimings });

    let ob = {
      Id: row.Id,
      LabId: null,
      SectionId: null,
      studentId: studentEdit.SID,
    };
    onUpdateNonActiveStdCurr(ob,0);
  };
  shuffleColors = () => {
    for (let i = this.colors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.colors[i], this.colors[j]] = [this.colors[j], this.colors[i]];
    }
  }

  getNextColor = () => {
    if (this.colorIndex >= this.colors.length) {
      this.shuffleColors();
      this.colorIndex = 0;
    }
    return this.colors[this.colorIndex++];
  }

  getColorForRequirementType = (requirementType) => {
    if (!this.colorMap[requirementType]) {
      this.colorMap[requirementType] = this.getNextColor();
    }
    return this.colorMap[requirementType];
  }
  render() {
    const {
      nonActiveStdCurrs,
      coursesRegistration,
      t,
      weekDays,
      lecturePeriods,
      reqTypes,
      availableCourses,
      tempStdSchedules,
      onGetTempStdSchedules,
      currentSemester,
      yearSemesters,
      achievedCourses,
      studentRegisterInfo,
      labs
    } = this.props;
    const {
      duplicateError,
      duplicateStudent,
      successMessage,
      deleteModal,
      studentEdit,
      totalHours,
      failedCourses,
      failedWithPassed,
      timings,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
    } = this.state;
    const minHours =  (studentRegisterInfo &&
    studentRegisterInfo[0] &&
    studentRegisterInfo[0].minRegisteredHour)
    const { SearchBar } = Search;
    const weekDaysColumns = weekDays.map(weekday =>
      this.props.t(weekday.enTitle)
    );
    console.log("coursesRegistration",coursesRegistration)
console.log("nonActiveStdCurrs",nonActiveStdCurrs)

    console.log("labs",labs)
    console.log("timings",timings)
    const uniStudentListColumns = [
      {
        text: "SID",
        key: "SID",
        dataField: "SID",
        sort: true,
        formatter: (cellContent, universityStudent) => (
          <>{universityStudent.SID}</>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden :!showSearchButton
        }),
      },
      {
        dataField: "img",
        key: "img",
        text: "#",
        hidden: true,
        formatter: (cellContent, student) => (
          <>
            {!student.img ? (
              <div className="avatar-xs">
                <span>{student.FirstName}</span>
              </div>
            ) : (
              <div>
                <img
                  className="rounded-circle avatar-xs"
                  src={images[student.img]}
                  alt=""
                />
              </div>
            )}
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden :!showSearchButton
        }),
      },
      {
        dataField: "studentname",
        key: "fName",
        text: this.props.t("Full Name"),
        sort: true,
        formatter: (cellContent, universityStudent) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {universityStudent.studentname}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden :!showSearchButton
        }),
      },
      {
        dataField: "Faculty",
        key: "faculty",
        text: this.props.t("Faculty"),
        sort: true,
        formatter: (cellContent, universityStudent) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {universityStudent.Faculty}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden :!showSearchButton
        }),
      },
      {
        dataField: "major",
        key: "major",
        text: this.props.t("Major"),
        sort: true,
        formatter: (cellContent, universityStudent) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {universityStudent.major}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden :!showSearchButton
        }),
      },
      {
        dataField: "nbHours",
        key: "nbHours",
        text: this.props.t("No of Hours"),
        sort: true,
        formatter: (cellContent, universityStudent) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {universityStudent.nbHours}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden :!showSearchButton
        }),
      },
      {
        dataField: "year",
        key: "year",
        text: this.props.t("Year"),
        sort: true,
        formatter: (cellContent, universityStudent) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {universityStudent.year}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden :!showSearchButton
        }),
      },
      {
        dataField: "registered",
        key: "registered",
        text: this.props.t("Registered"),
        sort: true,
        formatter: (cellContent, universityStudent) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {universityStudent.registered}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden :!showSearchButton
        }),
      },
      {
        dataField: "studentacception",
        key: "studentacception",
        text: this.props.t("Student Acception"),
        sort: true,
        formatter: (cellContent, universityStudent) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {universityStudent.studentacception}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden :!showSearchButton
        }),
      },
      {
        dataField: "hoursSatisfied",
        key: "hoursSatisfied",
        text: this.props.t("Hours Filled"),
        sort: true,
        formatter: (cellContent, universityStudent) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {universityStudent.hoursSatisfied}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden :!showSearchButton
        }),
      },
      {
        dataField: "prediction",
        key: "prediction",
        text: this.props.t("Prediction"),
        sort: true,
        formatter: (cellContent, universityStudent) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {universityStudent.prediction}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden :!showSearchButton
        }),
      },
      {
        dataField: "menu",
        isDummyField: true,
        editable: false,
        text: "",
        formatter: (cellContent, universityStudent) => (
          <div className="d-flex gap-3">
            <Tooltip
              title={this.props.t("Course Registration")}
              placement="top"
            >
              <Link className="" to="#">
                <i
                  className="bx bx-id-card font-size-18"
                  id="edittooltip"
                  onClick={() => this.handleEditUniStudent(universityStudent)}
                ></i>
              </Link>
            </Tooltip>
          </div>
        ),
      },
    ];
    console.log("achieved courses",achievedCourses)
    const col = [];
    const columns = [
      { dataField: "courseId", text: this.props.t("ID"), hidden: true },
      {
        dataField: "requirementType",
        text: this.props.t("Requirement Type"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden :!showSearchButton
        }),
      },
      {
        dataField: "courseName",
        text: this.props.t("Course Name"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden :!showSearchButton
        }),
      },
      {
        dataField: "courseCode",
        text: this.props.t("Course Code"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden :!showSearchButton
        }),
      },
      {
        dataField: "avNbHours",
        text: this.props.t("Number Of Hours"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden :!showSearchButton
        }),
      },
      {
        dataField: "enTitle13",
        text: this.props.t("Score"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden :!showSearchButton
        }),
      },
      {
        dataField: "enTitle14",
        text: this.props.t("Grade"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden :!showSearchButton
        }),
      },
      {
        dataField: "menu",
        text: this.props.t("Registration"),
        sort: true,
        formatter: (cellContent, row, universityStudent) => (
          <div className="d-flex justify-content-center gap-3">
            <Input
              type="checkbox"
              onChange={event =>
                this.handleAddToAddedCourses(
                  row,
                  event.target.checked,
                  "Registration"
                )
              }
            />
          </div>
        ),
      },
    ];
    
    
    
    const columns12 = [
      { dataField: "Id", text: t("ID"), hidden: true },
      { dataField: "arTitle", text: t("Course Name"), sort: true },
      { dataField: "enTitle11", text: "Course Code", sort: true },
      { dataField: "arTitle12", text: t("Number Of Hours"), sort: true },
      { dataField: "enTitle15", text: "Registration", sort: true },
    ];
    const rowClasses = (row, rowIndex) => {
      const achievedHours = parseFloat(row.nbHours);
      const requiredHours = parseFloat(row.requiredHours);
      return achievedHours >= requiredHours ? "table-success" : "table-danger";
    };
    const achievedCoursesColumn = [
      { dataField: "Id", text: t("ID"), hidden: true },
      { dataField: "CoursePlanType", text: t("Course Plan Type"), sort: true },
      {
        dataField: "nbHours",
        text: "Hours Achieved",
        sort: true,
      },
      { dataField: "requiredHours", text: t("Required hours"), sort: true },
    ];
    const columnToBeRegistered = [
      {
        dataField: "color",
        text: "",
        formatter: (cell, row) => (
          <div
            className="colorNonActiveCourses"
            style={{
              backgroundColor: nonActiveStdCurrs.find(
                item => item.Id === row.Id
              )?.color,
            }}
          ></div>
        ),
        style: { width: "2rem" },
      },
      { dataField: "Id", text: t("ID"), hidden: true },
      { dataField: "SectionId", text: t("SectionId"), hidden: true },
      { dataField: "LabId", text: t("labId"), hidden: true },
      { dataField: "CourseName", text: t("Course Name"), sort: true },
      { dataField: "code", text: this.props.t("Course Code"), sort: true },
      { dataField: "hasLab", text: this.props.t("Has Lab"), hidden: true },
      {
        dataField: "sections",
        text: this.props.t("Section"),
        sort: true,
        formatter: (cell, row) => {
          const curriculum =
            nonActiveStdCurrs.find(item => item.Id === row.Id) || {};

          const checkOverlap = (newTimingDetails, rowId, type) => {
            if (
              !Array.isArray(newTimingDetails) ||
              newTimingDetails.length === 0
            ) {
              return false;
            }

            for (const newDetail of newTimingDetails) {
              if (newDetail.rowId === rowId && newDetail.type === type) {
                continue;
              }

              for (const existingTiming of timings) {
                if (
                
                  existingTiming.rowId === rowId &&
                  existingTiming.type === type 
                  
                ) {
                  continue;
                }
                
                for (const existingDetail of existingTiming.details) {
                  if (
                    (newDetail.startTimeValue >=
                      existingDetail.startTimeValue &&
                      newDetail.startTimeValue < existingDetail.endTimeValue) ||
                    (newDetail.endTimeValue > existingDetail.startTimeValue &&
                      newDetail.endTimeValue <= existingDetail.endTimeValue) ||
                    (newDetail.startTimeValue <=
                      existingDetail.startTimeValue &&
                      newDetail.endTimeValue >= existingDetail.endTimeValue)
                  ) {
                    return true;
                  }
                }
              }
            }
            return false;
          };
          const filteredSections = curriculum.sections.filter(
            section => !checkOverlap(section.details, row.Id, "section")
          );
          return filteredSections.length > 0 ? (
            <Select
              name="facultyId"
              key={`faculty_select_${row.Id}`}
              options={filteredSections}
              onChange={newValue => {
                this.handleSelectChange(row, "section", newValue.value);
              }}
              value={
                filteredSections.find(
                  section => section.value === row.SectionId
                ) || null
              }
              isDisabled={
                nonActiveStdCurrs[0].nonActiveNbhours< minHours
          
              }
            />
          ) : null;
        },
      },
      {
        dataField: "labs",
        text: t("Lab"),
        sort: true,
        formatter: (cell, row) => {
          if (row.hasLab === 0) {
            return null;
          }
          const curriculum =
            nonActiveStdCurrs.find(item => item.Id === row.Id) || {};

          const checkOverlap = (newTimingDetails, rowId, type) => {
            if (
              !Array.isArray(newTimingDetails) ||
              newTimingDetails.length === 0
            ) {
              return false;
            }

            for (const newDetail of newTimingDetails) {
              if (newDetail.rowId === rowId && newDetail.type === type) {
                continue;
              }

              for (const existingTiming of timings) {
                if (
                  existingTiming.rowId === rowId &&
                  existingTiming.type === type
                ) {
                  continue;
                }

                for (const existingDetail of existingTiming.details) {
                  if (
                    (newDetail.startTimeValue >=
                      existingDetail.startTimeValue &&
                      newDetail.startTimeValue < existingDetail.endTimeValue) ||
                    (newDetail.endTimeValue > existingDetail.startTimeValue &&
                      newDetail.endTimeValue <= existingDetail.endTimeValue) ||
                    (newDetail.startTimeValue <=
                      existingDetail.startTimeValue &&
                      newDetail.endTimeValue >= existingDetail.endTimeValue)
                  ) {
                    return true;
                  }
                }
              }
            }
            return false;
          };

          const filteredLabs = curriculum.labs.filter(
            lab => !checkOverlap(lab.details, row.Id, "lab")
          );
          return filteredLabs.length > 0 ? (
            <Select
              name="facultyId"
              key={`faculty_select_${row.Id}`}
              options={filteredLabs}
              onChange={newValue => {
                this.handleSelectChange(row, "lab", newValue.value);
              }}
              isDisabled={
                nonActiveStdCurrs[0].nonActiveNbhours<minHours
          
              }
              value={filteredLabs.find(lab => lab.value === row.LabId) || null}
            />
          ) : null;
        },
        style: (cell, row) => {
          return {
            backgroundImage: row.hasLab === 0
              ? 'linear-gradient(45deg, #FFFFFF 25%, #DFDFDF 25%, #A1A1A1 50%, #FFFFFF 50%, #FFFFFF 75%, #CFCFCF 75%)'
              : 'none',
            backgroundSize: '8px 8px'
          };
        }
      },      

      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, row) => (
          <div className="d-flex gap-3">
            <IconButton
              color="primary"
              onClick={() => this.resetNonActiveStdCurrs(row)}
              id="TooltipTop"
              disabled={
                (row.LabId === null && row.SectionId === null) ||
                (row.LabId == 0 && row.SectionId == 0)
              }
            >
              <i className="bx bx-reset font-size-18" />
            </IconButton>
            <IconButton
              id="deletetooltip"
              className="text-danger"
              onClick={() => this.onClickDelete(row,0)}
            >
              <i className="mdi mdi-delete font-size-18" />
            </IconButton>
          </div>
        ),
      },
    ];


    const columns2 = [
      { dataField: "Id", text: t("ID"), hidden: true },
      { dataField: "SectionId", text: t("SectionId"), hidden: true },
      { dataField: "LabId", text: t("labId"), hidden: true },
      { dataField: "CourseName", text: t("Course Name"), sort: true },
      { dataField: "hasLab", text: this.props.t("Has Lab"), hidden: true },
      { dataField: "code", text: this.props.t("Course Code"), sort: true },
      {
        dataField: "sections",
        text: this.props.t("Section"),
        sort: true,
        formatter: (cell, row) => (
          <Select
            name="facultyId"
            key={`faculty_select`}
            options={
              (nonActiveStdCurrs.find(item => item.Id === row.Id) || {})
                .sections || []
            }
            onChange={newValue => {
              this.handleActiveSelectChange(row.Id, "section", newValue,row.SectionId);
            }}
            value={
              (
                (nonActiveStdCurrs.find(item => item.Id === row.Id) || {})
                  .sections || []
              ).find(section => section.value === row.SectionId) || null
            }
          />
        ),
      },
      {
        dataField: "labs",
        text: this.props.t("Lab"),
        sort: true,
        formatter: (cell, row) => {
          if (row.hasLab === 0) {
            return null;
          }
      
          const rowLabs = (nonActiveStdCurrs.find(item => item.Id === row.Id) || {}).labs || [];
      
          if (rowLabs.length === 0) {
            return null;
          }
      
          return (
            <Select
              name="facultyId"
              key={`faculty_select`}
              options={rowLabs}
              onChange={newValue => {
                this.handleActiveSelectChange(row.Id, "lab", newValue,row.LabId);
              }}
              value={rowLabs.find(lab => lab.value === row.LabId) || null}
            />
          );
        },
        style: (cell, row) => {
          return {
            backgroundImage: row.hasLab === 0
              ? 'linear-gradient(45deg, #FFFFFF 25%, #DFDFDF 25%, #A1A1A1 50%, #FFFFFF 50%, #FFFFFF 75%, #CFCFCF 75%)'
              : 'none',
            backgroundSize: '8px 8px'
          };
        }},

      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, row) => (
          <div className="d-flex gap-3">
            <IconButton
              id="deletetooltip"
              className="text-danger"

              onClick={() => this.onClickDelete(row, 1)}
            >
              <i className="mdi mdi-delete font-size-18" />
            </IconButton>

            
          </div>
        ),
      },
    ];
    const defaultSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: coursesRegistration.length,
      custom: true,
    };
    const filteredAvailableCourses = availableCourses.filter(avCourse => {
      const achievedCourse = achievedCourses.find(
        acCourse => acCourse.CoursePlanType === avCourse.requirementType
      );
      return (
        !achievedCourse || achievedCourse.nbHours < achievedCourse.requiredHours
      );
    });

    const rowStyle = (row, rowIndex) => {
      return { backgroundColor: this.getColorForRequirementType(row.requirementType) };
    };

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteNonActiveStdCurr}
          onCloseClick={() =>
            this.setState({ deleteModal: false, selectedRowId: null })
          }
        />
        <div className="page-content">
          <div className="container-fluid">
            <Breadcrumbs
              title={t("Courses Registration")}
              breadcrumbItem={t("Courses Registration")}
            />
            <Modal
              isOpen={this.state.modal}
              className={this.props.className}
              fullscreen
            >
              <ModalHeader
                toggle={this.toggle}
                tag="h4"
                className="pb-0 d-flex"
              >
                {studentEdit.studentname}
                {" - "}
                {studentEdit.SID}

                <Dropdown
                  className="d-lg-inline-block ms-1"
                  isOpen={this.state.socialDrp}
                  toggle={() => {
                    this.setState({ socialDrp: !this.state.socialDrp });
                  }}
                >
                  {" "}
                  <DropdownToggle
                    className="btn header-item noti-icon"
                    tag="button"
                  >
                    <i className="dripicons-information blue-noti-icon" />
                  </DropdownToggle>
                  <DropdownMenu className=" dropdown-mega-menu-fullWidth dropdown-megamenu">
                    {" "}
                    <Row>
                      <Col>
                        <p className="text-muted fw-medium">Study Plan</p>
                        <h5 className="mb-0 blue-noti-icon ">
                          {studentRegisterInfo &&
                            studentRegisterInfo[0] &&
                            studentRegisterInfo[0].planStudy}
                        </h5>
                      </Col>
                      <Col>
                        <p className="text-muted fw-medium">Faculty</p>
                        <h5 className="mb-0 blue-noti-icon">
                          {studentRegisterInfo &&
                            studentRegisterInfo[0] &&
                            studentRegisterInfo[0].facultyName}
                        </h5>
                      </Col>
                      <Col>
                        <p className="text-muted fw-medium">Warnings</p>
                        <h5 className="mb-0 blue-noti-icon">
                          {studentRegisterInfo &&
                            studentRegisterInfo[0] &&
                            studentRegisterInfo[0].warning}
                        </h5>
                      </Col>
                      <Col>
                        <p className="text-muted fw-medium">Hours Fulfilled</p>
                        <h5 className="mb-0 blue-noti-icon">16 hours</h5>
                      </Col>
                      <Col>
                        <p className="text-muted fw-medium">GPA</p>
                        <h5 className="mb-0 blue-noti-icon">
                          {studentRegisterInfo &&
                            studentRegisterInfo[0] &&
                            studentRegisterInfo[0].GPA}
                        </h5>
                      </Col>
                      <Col>
                        <p className="text-muted fw-medium">Number of Hours</p>
                        <h5 className="mb-0 blue-noti-icon">16 hours</h5>
                      </Col>
                      <Col>
                        <p className="text-muted fw-medium">Least Amount</p>
                        <h5 className="mb-0 blue-noti-icon">
                          {studentRegisterInfo &&
                            studentRegisterInfo[0] &&
                            studentRegisterInfo[0].minRegisteredHour}{" "}
                          hours
                        </h5>
                      </Col>
                      <Col>
                        <p className="text-muted fw-medium">Highest Amount</p>
                        <h5 className="mb-0 blue-noti-icon">
                          {studentRegisterInfo &&
                            studentRegisterInfo[0] &&
                            studentRegisterInfo[0].maxRegisteredHour}{" "}
                          hours
                        </h5>
                      </Col>
                    </Row>
                  </DropdownMenu>
                </Dropdown>

                <Dropdown
                  className=" d-lg-inline-block  "
                  isOpen={this.state.otherDrp}
                  toggle={() => {
                    this.setState({ otherDrp: !this.state.otherDrp });
                  }}
                >
                  {" "}
                  <DropdownToggle
                    className="btn header-item noti-icon  p-0 mb-1"
                    tag="button"
                  >
                    <i className="fas fa-user-graduate blue-noti-icon" />
                  </DropdownToggle>
                  <DropdownMenu className=" dropdown-mega-menu-fullWidth dropdown-megamenu">
                    {" "}
                    <Row>
                      <Col>
                        <p className="text-muted fw-medium">Student Average</p>
                        <h5 className="mb-0 blue-noti-icon ">14</h5>
                      </Col>
                      <Col>
                        <p className="text-muted fw-medium">Finance</p>
                        <h5 className="mb-0 blue-noti-icon">450,000 SP</h5>
                      </Col>
                      <Col>
                        <p className="text-muted fw-medium">Warnings</p>
                        <h5 className="mb-0 blue-noti-icon">1</h5>
                      </Col>
                      <Col>
                        <p className="text-muted fw-medium">Hours Fulfilled</p>
                        <h5 className="mb-0 blue-noti-icon">16 hours</h5>
                      </Col>
                      <Col>
                        <p className="text-muted fw-medium">GPA</p>
                        <h5 className="mb-0 blue-noti-icon">3.4</h5>
                      </Col>
                      <Col>
                        <p className="text-muted fw-medium">Number of Hours</p>
                        <h5 className="mb-0 blue-noti-icon">16 hours</h5>
                      </Col>
                      <Col>
                        <p className="text-muted fw-medium">Least Amount</p>
                        <h5 className="mb-0 blue-noti-icon">1 hours</h5>
                      </Col>
                      <Col>
                        <p className="text-muted fw-medium">Highest Amount</p>
                        <h5 className="mb-0 blue-noti-icon">6 hours</h5>
                      </Col>
                    </Row>
                  </DropdownMenu>
                </Dropdown>
                <Dropdown
                  className="d-lg-inline-block ms-3"
                  isOpen={this.state.achievements}
                  toggle={() => {
                    this.setState({ achievements: !this.state.achievements });
                  }}
                >
                                 <Tooltip title={this.props.t("Student's Achievement")}
              placement="top">

                  {" "}
                  <DropdownToggle
                    className="btn header-item noti-icon  p-0 mb-1"
                    tag="button"
                  >
                    <i className="fas fa-chalkboard-teacher blue-noti-icon" />
                  </DropdownToggle>
                  </Tooltip>
                  <DropdownMenu className=" dropdown-mega-menu-fullWidth dropdown-megamenu">
                    {" "}
                    <Row>
                      <Col>
                        <BootstrapTable
                          keyField="Id"
                          data={achievedCourses}
                          columns={achievedCoursesColumn}
                          defaultSorted={defaultSorting}
                          rowClasses={rowClasses}
                        />
                      </Col>
                    </Row>
                  </DropdownMenu>
                </Dropdown>
                
                <label className="cu-Semes-modal form-label text-center">
                  {yearSemesters.find(
                    opt => opt.key === currentSemester.cuYearSemesterId
                  )?.value || null}
                </label>
              </ModalHeader>

              <ModalBody>
                <Row>
                  <Col md="3"></Col>
                  <Col md="6">
                    <Nav pills className="navtab-bg nav-justified">
                      <NavItem>
                        <NavLink
                          id="vertical-home-link"
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: this.state.mainTab === "5",
                          })}
                          onClick={() => {
                            this.toggleMainTab("5");
                          }}
                        >
                          {this.props.t("Certificate Requirements")}
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          id="vertical-home-link"
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: this.state.mainTab === "6",
                          })}
                          onClick={() => {
                            this.toggleMainTab("6");
                          }}
                        >
                          {this.props.t("Student Registered Courses")}
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </Col>
                  <Col md="3"></Col>
                </Row>
                <TabContent
                  activeTab={this.state.mainTab}
                  className="p-3 text-muted"
                  id="verticalTabContent"
                >
                  <TabPane tabId="5">
                    <Row className="mt-3">
                      <Col lg="7">
                        <Row>
                          <Col lg="4">
                            <h5 className="header pt-2 ms-3" id="title">
                              {this.props.t("Available Courses")}
                            </h5>
                          </Col>
                          <Col lg="4">
                            <div className="btn-group" role="group">
                              <Tooltip
                                title={t("Failed With Passed")}
                                placement="top"
                              >
                                <input
                                  type="checkbox"
                                  name="failedWithPassed"
                                  className={`form-check-input-CR form-check-input input-mini warning`}
                                  id="behaviorButton"
                                  checked={failedWithPassed}
                                  onChange={() =>
                                    this.handleActiveFailed("failedWithPassed")
                                  }
                                />
                              </Tooltip>
                              <Tooltip
                                title={t("Failed Courses")}
                                placement="top"
                              >
                                <input
                                  type="checkbox"
                                  name="failedCourses"
                                  className={`form-check-input-CR form-check-input input-mini warning`}
                                  id="behaviorButton"
                                  checked={failedCourses}
                                  onChange={() =>
                                    this.handleActiveFailed("failedOnly")
                                  }
                                />
                              </Tooltip>
                            </div>
                          </Col>
                          <Col lg="3"></Col>
                          <Col>
                            <Tooltip
                              title={t("Print Available Material")}
                              key={"print_thing"}
                              placement="top"
                            >
                              <IconButton
                                className=""
                                to="#"
                                color="primary"
                                onClick={() =>
                                  this.handleEditUniStudent(universityStudent)
                                }
                              >
                                <i
                                  className="bx bxs-printer fs-3"
                                  id="edittooltip"
                                ></i>
                              </IconButton>
                            </Tooltip>
                          </Col>
                        </Row>
                        <div className="bordered mt-1">
                          <Row>
                            <Col>
                              <BootstrapTable
                                keyField="courseId"
                                data={filteredAvailableCourses}
                                columns={columns}
                                defaultSorted={defaultSorting}
                                filter={filterFactory()}
                                filterPosition="top"
                                rowStyle={rowStyle}


                              />
                              <TabContent
                                activeTab={this.state.activeTab2}
                                className="p-3 text-muted"
                                id="verticalTabContent"
                              >
                                <TabPane key={5} tabId="5">
                                  <BootstrapTable
                                    keyField="Id"
                                    data={coursesRegistration}
                                    columns={columns12}
                                    defaultSorted={defaultSorting}
                                  />
                                </TabPane>
                                <TabPane key={6} tabId="6">
                                  <BootstrapTable
                                    keyField="Id"
                                    data={coursesRegistration}
                                    columns={columns12}
                                    defaultSorted={defaultSorting}
                                  />
                                </TabPane>
                              </TabContent>
                            </Col>
                          </Row>
                        </div>
                        <Col lg="12">
                          <Row>
                            <Col lg="12">
                              <Row>
                                <Col lg="8">
                                  <Row>
                                    <Col lg="6">
                                      <h5 className="pt-2 ms-3" id="title">
                                        {`${this.props.t(
                                          "Courses to be registered"
                                        )}  `}
                                      </h5>
                                    </Col>
                                    <Col lg="4">
                                      <h5 className="header-hours pt-2 ms-3 ">
                                        {`${totalHours}`}{" "}
                                        {this.props.t("hours")}
                                      </h5>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <div className="bordered mt-1 mb-0 pb-0">
                            <div className="d-flex m-0 p-0 ms-3 justify-content-center">
                              <div
                                className="p-2 d-inline-flex align-items-center justify-content-center m-0"
                                style={{ width: "fit-content" }}
                              >
                                <Tooltip
                                  title={t("Save All")}
                                  key={"print_thing"}
                                  placement="top"
                                >
                                  <IconButton
                                    to="#"
                                    color="primary"
                                    onClick={() => this.saveStudent()}
                                    className="p-0"
                                  >
                                    <i
                                      className="mdi mdi-content-save-all-outline font-size-18"
                                      id="edittooltip"
                                    ></i>
                                  </IconButton>
                                </Tooltip>
                              </div>
                              <div
                                className="p-2 d-inline-flex align-items-center justify-content-center m-0"
                                style={{ width: "fit-content" }}
                              >
                                <Tooltip
                                  title={t("Reset All")}
                                  key={"print_thing"}
                                  placement="top"
                                >
                                  <IconButton
                                    color="primary"
                                    onClick={() =>
                                      this.resetAllNonActiveStdCurrs()
                                    }
                                    id="TooltipTop"
                                    className="p-0"
                                  >
                                    <i className="bx bx-reset font-size-18" />
                                  </IconButton>
                                </Tooltip>
                              </div>

                              <div
                                className="p-2 d-inline-flex align-items-center justify-content-center m-0 "
                                style={{ width: "fit-content" }}
                              >
                                <Tooltip
                                  title={t("Delete All")}
                                  key={"print_thing"}
                                  placement="top"
                                >
                                  <IconButton
                                    id="deletetooltip"
                                    onClick={() =>
                                      this.deleteAllNonActiveStdCurrs()
                                    }
                                    
                                    className="p-0 text-danger"
                                  >
                                    <i className="mdi mdi-delete font-size-18" />
                                  </IconButton>
                                </Tooltip>
                              </div>
                            </div>
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
                    </div>
                    <div>
                        {successMessage && (
                        <Alert
                          color="success"
                          className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                          role="alert"
                        >
                          {successMessage}
                          
                        </Alert>
                      )}
                    </div>
                            <BootstrapTable
                              keyField="Id"
                              data={nonActiveStdCurrs.filter(item => item.active === 0)}
                              columns={columnToBeRegistered}
                              defaultSorted={defaultSorting}
                              

                            />
                          </div>
                        </Col>
                      </Col>
                      <Col lg="5">
                        <Col lg="4">
                          <h5 className="header pt-2 ms-3" id="title">
                            {this.props.t("Scheduling Lectures")}
                          </h5>
                        </Col>
                        <div className="bordered mt-1">
                          <div className="timetable-container">
                            <table className="timetable">
                              <thead>
                                <tr>
                                  <th>{t("Lecture Periods")}</th>
                                  {weekDaysColumns.map((header, index) => (
                                    <th key={index}>{header}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {lecturePeriods.map((lecture, rowIndex) => (
                                  <tr key={lecture.Id}>
                                    <td className="lecture-cell">
                                      {lecture.duration}
                                    </td>
                                    {weekDays.map((weekday, cellIndex) => {
                                      const schedule = tempStdSchedules.find(
                                        item =>
                                          item.dayOrder === weekday.dayOrder &&
                                          item.duration === lecture.duration
                                      );

                                      const cellStyle = schedule
                                        ? { backgroundColor: schedule.color }
                                        : {};

                                      return (
                                        <td
                                          key={cellIndex}
                                          className={`timetable-cell`}
                                          style={cellStyle}
                                        ></td>
                                      );
                                    })}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="6">
                    <Row>
                      <Col>
                        <Col lg="4">
                          <h5 className="header pt-2 ms-3" id="title">
                            {this.props.t("Student Courses")}
                          </h5>
                        </Col>
                        <div>
                        {duplicateStudent && (
                        <Alert
                          color="danger"
                          className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                          role="alert"
                        >
                          {duplicateStudent}
                          <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={this.handleAlertClose}
                          ></button>
                        </Alert>
                      )}
                    </div>
                   
                        <div className="bordered mt-1">
                          <BootstrapTable
                            keyField="Id"
                            columns={columns2}
                            defaultSorted={defaultSorting}
                            data={nonActiveStdCurrs.filter(item => item.active === 1)}
                          />
                        </div>
                      </Col>
                    </Row>
                  </TabPane>
                </TabContent>
              </ModalBody>
            </Modal>
            <Row>
              <Col>
                <Card>
                  <CardBody>
                    
                    <div className="table-responsive">
                      <PaginationProvider
                        pagination={paginationFactory(pageOptions)}
                        keyField="Id"
                        columns={uniStudentListColumns}
                        data={coursesRegistration}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={coursesRegistration}
                            columns={uniStudentListColumns}
                            search
                          >
                            {toolkitprops => (
                              <React.Fragment>
                                <Row>
                                  <Col sm="4"></Col>
                                </Row>

                                <BootstrapTable
                                  keyField="Id"
                                  {...toolkitprops.baseProps}
                                  {...paginationTableProps}
                                  data={coursesRegistration}
                                  columns={uniStudentListColumns}
                                  defaultSorted={defaultSorting}
                                  filter={filterFactory()}
                                  filterPosition="top"
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
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({
  coursesRegistration,
  weekDays,
  lecturePeriods,
  reqTypes,
  semesters,
  generalManagements,
  menu_items
}) => ({
  yearSemesters: generalManagements.yearSemesters,
  coursesRegistration: coursesRegistration.coursesRegistration,
  weekDays: weekDays.weekDays,
  lecturePeriods: lecturePeriods.lecturePeriods,
  reqTypes: reqTypes.reqTypes,
  availableCourses: coursesRegistration.availableCourses,
  nonActiveStdCurrs: coursesRegistration.nonActiveStdCurrs,
  currentSemester: semesters.currentSemester,
  tempStdSchedules: coursesRegistration.tempStdSchedules,
  achievedCourses: coursesRegistration.achievedCourses,
  studentRegisterInfo: coursesRegistration.studentRegisterInfo,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onfetchSetting: () => dispatch(fetchYearsSemesters()),
  onGetCoursesRegistration: () => dispatch(getCoursesRegistration()),
  onGetReqTypes: facultyId => dispatch(getReqTypes(facultyId)),
  onAddNewCoursesRegistration: coursesRegistration =>
    dispatch(addNewCoursesRegistration(coursesRegistration)),
  onUpdateCoursesRegistration: coursesRegistration =>
    dispatch(updateCoursesRegistration(coursesRegistration)),
  onDeleteCoursesRegistration: coursesRegistration =>
    dispatch(deleteCoursesRegistration(coursesRegistration)),
  onGetAvailableCourses: (reqType, studentId) =>
    dispatch(getAvailableCourses(reqType, studentId)),
  onGetStudentRegisterInfo: studentId =>
    dispatch(getStudentRegisterInfo(studentId)),

  onAddNewAvailableCourse: availableCourse =>
    dispatch(addNewAvailableCourse(availableCourse)),
  onGetNonActiveStdCurr: (active, studentId) =>
    dispatch(getNonActiveStdCurr(active, studentId)),
  onUpdateNonActiveStdCurr: (nonActiveStdCurrs, active) =>
    dispatch(updateNonActiveStdCurr(nonActiveStdCurrs,active)),
  onDeleteNonActiveStdCurr: nonActiveStdCurrs =>
    dispatch(deleteNonActiveStdCurr(nonActiveStdCurrs)),

  onGetTempStdSchedules: studentId => dispatch(getTempStdSchedules(studentId)),
  onGetAchievedCourses: studentId => dispatch(getAchievedCourses(studentId)),
  onDeleteAllNonActiveStdCurr: nonActiveStdCurrs =>
    dispatch(deleteAllNonActiveStdCurr(nonActiveStdCurrs)),
  onSaveAllNonActiveStdCurr: nonActiveStdCurrs =>
    dispatch(saveAllNonActiveStdCurr(nonActiveStdCurrs)),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(CoursesRegistrationList));
