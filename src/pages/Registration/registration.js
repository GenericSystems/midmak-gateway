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
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import {
  getRegistrations,
  addNewRegistration,
  updateRegistration,
  deleteRegistration,
  getAvailableCourses,
  addNewAvailableCourse,
  getNonActiveStdCurr,
  updateNonActiveStdCurr,
  deleteNonActiveStdCurr,
  getTempStdSchedules,
  deleteAllNonActiveStdCurr,
  getAchievedCourses,
  getTraineeRegisterInfo,
  saveAllNonActiveStdCurr,
} from "store/Registration/actions";
import { fetchYearsSemesters } from "store/general-management/actions";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
// import { getReqTypes } from "store/req-types/actions";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import { Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";
import { CoPresent } from "@mui/icons-material";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../utils/menuUtils";
class RegistrationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      years: [],
      selectedYear: null,
      currentYearObj: {},
      activeTab1: "5",
      activeTab: "0",
      activeTab2: "0",
      mainTab: "5",
      duplicateError: null,
      duplicateTrainee: null,
      successMessage: null,
      newStartTime: "",
      newEndTime: "",
      newDuration: "",
      modal: false,
      traineeEdit: {},
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
    this.colors = [
      "#A9E6EB",
      "#f7f7bf",
      "#F0B9B7",
      "#BEB4DA",
      "#B0EBCF",
      "#AFCDFD",
      "#FCCDF5",
      "#ff7179",
      "#c7f0a5",
      "#6E7BBF",
    ];
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
    // const { onGetAvailableCourses, onGetTempStdSchedules } = this.props;
    const { traineeEdit } = this.state;
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
        currReqType: tab,
      });
    }
  }
  toggleMainTab(tab) {
    const { traineeEdit } = this.state;
    const { onGetNonActiveStdCurr } = this.props;
    if (this.state.mainTab !== tab) {
      this.setState({
        mainTab: tab,
        duplicateError: null,
        duplicateTrainee: null,
        successMessage: null,
      });
      if (tab === "6") {
        onGetNonActiveStdCurr(1, traineeEdit.TraineeNum);
      } else {
        onGetNonActiveStdCurr(0, traineeEdit.TraineeNum);
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
      registrations,
      onGetRegistrations,
      weekDays,
      lecturePeriods,
      onGetReqTypes,
      reqTypes,
      onfetchSetting,
      years,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (registrations && !registrations.length) {
      // onfetchSetting();
      onGetRegistrations();

      this.setState({ registrations });
      this.setState({ weekDays });
      this.setState({ lecturePeriods });
      this.setState({ reqTypes });
      this.setState({ years });
    }
    let curentueardata = localStorage.getItem("authUser");
    if (curentueardata) {
      try {
        const parsed = JSON.parse(curentueardata);
        const firstYear = parsed[0];
        const selectedYear = {
          value: firstYear.currentYearId,
          label: firstYear.currentYearName,
        };
        this.setState({
          selectedYear,
          currentYearObj: {
            currentYearId: firstYear.currentYearId,
            currentYearName: firstYear.currentYearName,
          },
        });
      } catch (error) {
        console.error("Error parsing authUser:", error);
      }
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
    this.setState({ duplicateError: null, duplicateTrainee: null });
  };

  handleEditTrainee = trainee => {
    const { traineeEdit } = this.state;
    const {
      onGetNonActiveStdCurr,
      onGetTempStdSchedules,
      onGetAchievedCourses,
      onGetReqTypes,
      onGetAvailableCourses,
    } = this.props;
    console.log("trainees", trainee);
    onGetNonActiveStdCurr(0, trainee.Id);
    this.setState({ traineeEdit: trainee });
    // onGetTempStdSchedules(academyTrainee.TraineeNum);
    onGetAvailableCourses(trainee.Id);
    this.toggle();
  };

  onClickDelete = (row, active) => {
    this.setState({ nonActiveCourse: row, active: active });
    this.setState({ deleteModal: true });
  };
  handleDeleteNonActiveStdCurr = () => {
    const { onDeleteNonActiveStdCurr } = this.props;
    const { nonActiveCourse, active } = this.state;
    console.log(
      "nonActiveCoursenonActiveCoursenonActiveCourse",
      nonActiveCourse
    );
    if (active == 0) {
      this.resetNonActiveStdCurrs(nonActiveCourse);
    }
    let del = { Id: nonActiveCourse.Id };
    onDeleteNonActiveStdCurr(del);
    this.setState({ deleteModal: false });
  };
  handleAddToAddedCourses = (row, currentStatus, fieldName) => {
    const { onAddNewAvailableCourse, onGetNonActiveStdCurr, ava } = this.props;
    const { traineeEdit } = this.state;
    console.log("traineeEdit", traineeEdit);
    const newRow = {
      courseId: row.courseId,
      traineeId: traineeEdit.Id,
      Code: row.Code,
      active: 0,
      color: this.generateRandomColor(),
    };
    onAddNewAvailableCourse(newRow);
    this.setState({
      availableCourses: availableCourses.filter(
        c => c.courseId !== row.courseId
      ),
    });
  };

  handleActiveSelectChange = (rowId, fieldName, selectedValue, oldValue) => {
    const { onUpdateNonActiveStdCurr, nonActiveStdCurrs } = this.props;
    const { traineeEdit } = this.state;
    let onUpdate = { Id: rowId };
    onUpdate["traineeId"] = traineeEdit.traineeId;
    const checkOverlap = (interval1, interval2) => {
      return (
        interval1.startTimeValue < interval2.endTimeValue &&
        interval1.endTimeValue > interval2.startTimeValue
      );
    };

    const checkOverlapWithSelected = selectedValue => {
      const overlaps = [];
      const selectedIntervals = selectedValue.details.map(detail => ({
        startTimeValue: detail.startTimeValue,
        endTimeValue: detail.endTimeValue,
      }));

      selectedIntervals.forEach(selectedInterval => {
        selectedDetails.forEach(detail => {
          if (
            detail.type === selectedValue.type &&
            detail.rowId === selectedValue.rowId
          ) {
            return;
          }

          const detailInterval = {
            startTimeValue: detail.startTimeValue,
            endTimeValue: detail.endTimeValue,
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
              selectedDetails.push({
                ...detail,
                type: "section",
                rowId: course.Id,
              });
            });
          }
        });
      }

      if (course.labs) {
        course.labs.forEach(lab => {
          if (course.LabId && lab.value === course.LabId) {
            lab.details.forEach(detail => {
              selectedDetails.push({
                ...detail,
                type: "lab",
                rowId: course.Id,
              });
            });
          }
        });
      }
    });

    const overlaps = checkOverlapWithSelected(selectedValue);

    if (overlaps.length > 0) {
      this.setState({ duplicateTrainee: "There is a time conflict" });
    } else {
      if (fieldName === "section") {
        onUpdate["SectionId"] = selectedValue.value;
      } else {
        onUpdate["LabId"] = selectedValue.value;
      }

      onUpdateNonActiveStdCurr(onUpdate, 1);
      this.setState({ duplicateTrainee: null });
    }
  };

  handleSelectYear = (name, value) => {
    const { onGetRegistrations } = this.props;
    this.setState({
      selectedYear: value,
      currentYearObj: {
        currentYearId: value.value,
        currentYearName: value.label,
      },
    });
    onGetRegistrations();
  };

  handleSelectChange = (row, fieldName, selectedValue) => {
    const { traineeEdit, timings } = this.state;
    const { onUpdateNonActiveStdCurr } = this.props;
    let onUpdate = { Id: row.Id };
    onUpdate["traineeId"] = traineeEdit.TraineeNum;
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
    onUpdateNonActiveStdCurr(onUpdate, 0);
  };
  handleRadioChange = value => {
    this.setState({ selectedEducation: value });
  };
  resetAllNonActiveStdCurrs = () => {
    const { traineeEdit } = this.state;
    const { onDeleteAllNonActiveStdCurr, currentSemester } = this.props;
    let ob = {};
    ob["traineeId"] = traineeEdit.TraineeNum;
    ob["flag"] = "reset";
    ob["semesterYearId"] = currentSemester.cuYearSemesterId;
    onDeleteAllNonActiveStdCurr(ob);
    this.setState({ timings: [] });
  };
  deleteAllNonActiveStdCurrs = () => {
    this.resetAllNonActiveStdCurrs();
    const { traineeEdit } = this.state;
    const { onDeleteAllNonActiveStdCurr, currentSemester } = this.props;
    let ob = {};
    ob["traineeId"] = traineeEdit.TraineeNum;
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
    }
  };
  saveTrainee = () => {
    const {
      traineeRegisterInfo,
      nonActiveStdCurrs,
      onSaveAllNonActiveStdCurr,
      currentSemester,
    } = this.props;
    const { totalHours, traineeEdit } = this.state;
    const minHours =
      traineeRegisterInfo &&
      traineeRegisterInfo[0] &&
      traineeRegisterInfo[0].minRegisteredHour;
    let errors = [];
    let ob = {};
    ob["traineeId"] = traineeEdit.TraineeNum;
    ob["yearSemesterId"] = currentSemester.cuYearSemesterId;

    if (minHours > totalHours) {
      errors.push("Minimum registered hours requirement not met.");
      this.setState({
        duplicateError: "Minimum registered hours requirement not met.",
      });
    } else {
      nonActiveStdCurrs.forEach(trainee => {
        if (!trainee.SectionId) {
          errors.push(`SectionId is empty for trainee: ${trainee.code}`);
          this.setState({ duplicateError: "Fill the options" });
        }
        if (trainee.hasLab === 1 && !trainee.LabId) {
          errors.push(`LabId is empty for trainee: ${trainee.code}`);
          this.setState({ duplicateError: "Fill the options" });
        }
      });
    }

    if (errors.length > 0) {
      console.error("Errors occurred:", errors);
    } else {
      onSaveAllNonActiveStdCurr(ob);
      this.setState({ totalHours: 0, timings: [], duplicateError: null });
      this.setState({ successMessage: "Data filled in successfully" });
      setTimeout(() => {
        this.toggleMainTab("6");
      }, 1000);
    }
  };
  resetNonActiveStdCurrs = row => {
    const { traineeEdit, timings } = this.state;
    // const { onUpdateNonActiveStdCurr, onGetNonActiveStdCurr } = this.props;

    const newTimings = timings.filter(timing => timing.rowId !== row.Id);

    this.setState({ timings: newTimings });

    let ob = {
      Id: row.Id,
      LabId: null,
      SectionId: null,
      traineeId: traineeEdit.TraineeNum,
    };
    // onUpdateNonActiveStdCurr(ob, 0);
  };
  shuffleColors = () => {
    for (let i = this.colors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.colors[i], this.colors[j]] = [this.colors[j], this.colors[i]];
    }
  };

  getNextColor = () => {
    if (this.colorIndex >= this.colors.length) {
      this.shuffleColors();
      this.colorIndex = 0;
    }
    return this.colors[this.colorIndex++];
  };

  getColorForRequirementType = requirementType => {
    if (!this.colorMap[requirementType]) {
      this.colorMap[requirementType] = this.getNextColor();
    }
    return this.colorMap[requirementType];
  };
  render() {
    const {
      nonActiveStdCurrs,
      registrations,
      t,
      weekDays,
      lecturePeriods,
      reqTypes,
      availableCourses,
      tempStdSchedules,
      onGetTempStdSchedules,
      currentYear,
      years,
      achievedCourses,
      traineeRegisterInfo,
      labs,
    } = this.props;
    const {
      duplicateError,
      duplicateTrainee,
      successMessage,
      deleteModal,
      traineeEdit,
      totalHours,
      failedCourses,
      failedWithPassed,
      timings,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
      currentYearObj,
      selectedYear,
    } = this.state;
    const minHours =
      traineeRegisterInfo &&
      traineeRegisterInfo[0] &&
      traineeRegisterInfo[0].minRegisteredHour;
    const { SearchBar } = Search;
    const weekDaysColumns = weekDays.map(weekday =>
      this.props.t(weekday.enTitle)
    );
    console.log("registrations", registrations);
    console.log("nonActiveStdCurrs", nonActiveStdCurrs);

    console.log("labs", labs);
    console.log("timings", timings);
    const traineeListColumns = [
      {
        text: "Trainee Num",
        // key: "TraineeNum",
        dataField: "TraineeNum",
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },
      {
        dataField: "fullName",
        // key: "fullName",
        text: this.props.t("Full Name"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },

      {
        dataField: "lastRegisteredSession",
        // key: "lastRegisteredSession",
        text: this.props.t("Last registered session"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },
      {
        dataField: "traineeStatus",
        // key: "traineeStatus",
        text: this.props.t("Trainer Status"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },
      {
        dataField: "menu",
        isDummyField: true,
        editable: false,
        text: "",
        formatter: (cellContent, registration) => (
          <div className="d-flex gap-3">
            <Tooltip title={this.props.t("Registration")} placement="top">
              <Link className="" to="#">
                <i
                  className="bx bx-id-card font-size-18"
                  id="edittooltip"
                  onClick={() => this.handleEditTrainee(registration)}
                ></i>
              </Link>
            </Tooltip>
          </div>
        ),
      },
    ];
    console.log("achieved courses", achievedCourses);
    const col = [];
    const columns = [
      { dataField: "courseId", text: this.props.t("ID"), hidden: true },
      {
        dataField: "courseName",
        text: this.props.t("Course Name"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },
      {
        dataField: "Code",
        text: this.props.t("Course Code"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },
      {
        dataField: "totalTrainingHours",
        text: this.props.t("Number Of Hours"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },
      {
        dataField: "enTitle13",
        text: this.props.t("Score"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },
      {
        dataField: "enTitle14",
        text: this.props.t("Grade"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },
      {
        dataField: "menu",
        text: this.props.t("Registration"),
        sort: true,
        formatter: (cellContent, row, academyTrainee) => (
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
    // const achievedCoursesColumn = [
    //   { dataField: "Id", text: t("ID"), hidden: true },
    //   { dataField: "CoursePlanType", text: t("Course Plan Type"), sort: true },
    //   {
    //     dataField: "nbHours",
    //     text: "Hours Achieved",
    //     sort: true,
    //   },
    //   { dataField: "requiredHours", text: t("Required hours"), sort: true },
    // ];
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
              isDisabled={nonActiveStdCurrs[0].nonActiveNbhours < minHours}
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
              isDisabled={nonActiveStdCurrs[0].nonActiveNbhours < minHours}
              value={filteredLabs.find(lab => lab.value === row.LabId) || null}
            />
          ) : null;
        },
        style: (cell, row) => {
          return {
            backgroundImage:
              row.hasLab === 0
                ? "linear-gradient(45deg, #FFFFFF 25%, #DFDFDF 25%, #A1A1A1 50%, #FFFFFF 50%, #FFFFFF 75%, #CFCFCF 75%)"
                : "none",
            backgroundSize: "8px 8px",
          };
        },
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
              onClick={() => this.onClickDelete(row, 0)}
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
              this.handleActiveSelectChange(
                row.Id,
                "section",
                newValue,
                row.SectionId
              );
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

          const rowLabs =
            (nonActiveStdCurrs.find(item => item.Id === row.Id) || {}).labs ||
            [];

          if (rowLabs.length === 0) {
            return null;
          }

          return (
            <Select
              name="facultyId"
              key={`faculty_select`}
              options={rowLabs}
              onChange={newValue => {
                this.handleActiveSelectChange(
                  row.Id,
                  "lab",
                  newValue,
                  row.LabId
                );
              }}
              value={rowLabs.find(lab => lab.value === row.LabId) || null}
            />
          );
        },
        style: (cell, row) => {
          return {
            backgroundImage:
              row.hasLab === 0
                ? "linear-gradient(45deg, #FFFFFF 25%, #DFDFDF 25%, #A1A1A1 50%, #FFFFFF 50%, #FFFFFF 75%, #CFCFCF 75%)"
                : "none",
            backgroundSize: "8px 8px",
          };
        },
      },

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
      totalSize: registrations.length,
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
      return {
        backgroundColor: this.getColorForRequirementType(row.requirementType),
      };
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
              title={t("Registration")}
              breadcrumbItem={t("Registration")}
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
                {traineeEdit.fullName}
                {" - "}
                {traineeEdit.TraineeNum}

                {/* <Dropdown
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
                          {traineeRegisterInfo &&
                            traineeRegisterInfo[0] &&
                            traineeRegisterInfo[0].planStudy}
                        </h5>
                      </Col>
                      <Col>
                        <p className="text-muted fw-medium">Faculty</p>
                        <h5 className="mb-0 blue-noti-icon">
                          {traineeRegisterInfo &&
                            traineeRegisterInfo[0] &&
                            traineeRegisterInfo[0].facultyName}
                        </h5>
                      </Col>
                      <Col>
                        <p className="text-muted fw-medium">Warnings</p>
                        <h5 className="mb-0 blue-noti-icon">
                          {traineeRegisterInfo &&
                            traineeRegisterInfo[0] &&
                            traineeRegisterInfo[0].warning}
                        </h5>
                      </Col>
                      <Col>
                        <p className="text-muted fw-medium">Hours Fulfilled</p>
                        <h5 className="mb-0 blue-noti-icon">16 hours</h5>
                      </Col>
                      <Col>
                        <p className="text-muted fw-medium">GPA</p>
                        <h5 className="mb-0 blue-noti-icon">
                          {traineeRegisterInfo &&
                            traineeRegisterInfo[0] &&
                            traineeRegisterInfo[0].GPA}
                        </h5>
                      </Col>
                      <Col>
                        <p className="text-muted fw-medium">Number of Hours</p>
                        <h5 className="mb-0 blue-noti-icon">16 hours</h5>
                      </Col>
                      <Col>
                        <p className="text-muted fw-medium">Least Amount</p>
                        <h5 className="mb-0 blue-noti-icon">
                          {traineeRegisterInfo &&
                            traineeRegisterInfo[0] &&
                            traineeRegisterInfo[0].minRegisteredHour}{" "}
                          hours
                        </h5>
                      </Col>
                      <Col>
                        <p className="text-muted fw-medium">Highest Amount</p>
                        <h5 className="mb-0 blue-noti-icon">
                          {traineeRegisterInfo &&
                            traineeRegisterInfo[0] &&
                            traineeRegisterInfo[0].maxRegisteredHour}{" "}
                          hours
                        </h5>
                      </Col>
                    </Row>
                  </DropdownMenu>
                </Dropdown> */}

                {/* <Dropdown
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
                        <p className="text-muted fw-medium">Trainee Average</p>
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
                </Dropdown> */}
                {/* <Dropdown
                  className="d-lg-inline-block ms-3"
                  isOpen={this.state.achievements}
                  toggle={() => {
                    this.setState({ achievements: !this.state.achievements });
                  }}
                >
                  <Tooltip
                    title={this.props.t("Trainee's Achievement")}
                    placement="top"
                  >
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
                </Dropdown> */}

                {/* <label className="cu-Semes-modal form-label text-center">
                  {years.find(opt => opt.key === currentYear.cuYearId)?.value ||
                    null}
                </label> */}
              </ModalHeader>

              <ModalBody>
                <Row>
                  <Col md="2">
                    <Nav pills className="flex-column">
                      <NavItem>
                        <NavLink
                          id="horizontal-home-link"
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
                          id="horizontal-home-link"
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: this.state.mainTab === "6",
                          })}
                          onClick={() => {
                            this.toggleMainTab("6");
                          }}
                        >
                          {this.props.t("Trainee Registered Courses")}
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </Col>

                  <Col md="10">
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
                                      this.handleEditTrainee(trainee)
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
                                        data={registrations}
                                        columns={columns12}
                                        defaultSorted={defaultSorting}
                                      />
                                    </TabPane>
                                    <TabPane key={6} tabId="6">
                                      <BootstrapTable
                                        keyField="Id"
                                        data={registrations}
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
                                        onClick={() => this.saveTrainee()}
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
                                  data={nonActiveStdCurrs.filter(
                                    item => item.active === 0
                                  )}
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
                                          const schedule =
                                            tempStdSchedules.find(
                                              item =>
                                                item.dayOrder ===
                                                  weekday.dayOrder &&
                                                item.duration ===
                                                  lecture.duration
                                            );

                                          const cellStyle = schedule
                                            ? {
                                                backgroundColor: schedule.color,
                                              }
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
                                {this.props.t("Trainee Courses")}
                              </h5>
                            </Col>
                            <div>
                              {duplicateTrainee && (
                                <Alert
                                  color="danger"
                                  className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                  role="alert"
                                >
                                  {duplicateTrainee}
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
                                data={nonActiveStdCurrs.filter(
                                  item => item.active === 1
                                )}
                              />
                            </div>
                          </Col>
                        </Row>
                      </TabPane>
                    </TabContent>
                  </Col>
                </Row>
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
                        columns={traineeListColumns}
                        data={registrations}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={registrations}
                            columns={traineeListColumns}
                            search
                          >
                            {toolkitprops => (
                              <React.Fragment>
                                <Row className="mb-2">
                                  <Col sm="5"></Col>
                                  <Col sm="3">
                                    <Select
                                      className="select-style-year"
                                      name="yearId"
                                      key={`yearId`}
                                      options={years}
                                      onChange={newValue => {
                                        this.handleSelectYear(
                                          "yearId",
                                          newValue
                                        );
                                      }}
                                      value={selectedYear}
                                    />
                                  </Col>
                                  <Col sm="4"></Col>
                                </Row>

                                <BootstrapTable
                                  keyField="Id"
                                  {...toolkitprops.baseProps}
                                  {...paginationTableProps}
                                  data={registrations}
                                  columns={traineeListColumns}
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
  registrations,
  weekDays,
  lecturePeriods,
  years,
  // reqTypes,
  // generalManagements,
  menu_items,
}) => ({
  years: years.years,
  registrations: registrations.registrations,
  weekDays: weekDays.weekDays,
  lecturePeriods: lecturePeriods.lecturePeriods,
  // reqTypes: reqTypes.reqTypes,
  availableCourses: registrations.availableCourses,
  nonActiveStdCurrs: registrations.nonActiveStdCurrs,
  tempStdSchedules: registrations.tempStdSchedules,
  achievedCourses: registrations.achievedCourses,
  // traineeRegisterInfo: registrations.traineeRegisterInfo,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  // onfetchSetting: () => dispatch(fetchYearsSemesters()),
  onGetRegistrations: () => dispatch(getRegistrations()),
  // onAddNewRegistrations: registrations =>
  //   dispatch(addNewRegistration(registrations)),
  // onUpdateRegistrations: registrations =>
  //   dispatch(updateRegistration(registrations)),
  // onDeleteRegistrations: registrations =>
  //   dispatch(deleteRegistration(registrations)),
  onGetAvailableCourses: traineeId => dispatch(getAvailableCourses(traineeId)),
  // onGetTraineeRegisterInfo: traineeId =>
  //   dispatch(getTraineeRegisterInfo(traineeId)),

  onAddNewAvailableCourse: availableCourse =>
    dispatch(addNewAvailableCourse(availableCourse)),
  onGetNonActiveStdCurr: (active, traineeId) =>
    dispatch(getNonActiveStdCurr(active, traineeId)),
  // onUpdateNonActiveStdCurr: (nonActiveStdCurrs, active) =>
  //   dispatch(updateNonActiveStdCurr(nonActiveStdCurrs, active)),
  onDeleteNonActiveStdCurr: nonActiveStdCurrs =>
    dispatch(deleteNonActiveStdCurr(nonActiveStdCurrs)),

  // onGetTempStdSchedules: traineeId => dispatch(getTempStdSchedules(traineeId)),
  // onGetAchievedCourses: traineeId => dispatch(getAchievedCourses(traineeId)),
  // onDeleteAllNonActiveStdCurr: nonActiveStdCurrs =>
  //   dispatch(deleteAllNonActiveStdCurr(nonActiveStdCurrs)),
  // onSaveAllNonActiveStdCurr: nonActiveStdCurrs =>
  //   dispatch(saveAllNonActiveStdCurr(nonActiveStdCurrs)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(RegistrationList));
