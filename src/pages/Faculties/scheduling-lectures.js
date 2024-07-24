import $ from "jquery";
import classnames from "classnames";
import TimeTable from "./TimeTable";
import React, { Component } from "react";
import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  ModalFooter,
  FormGroup,
  Alert,
} from "reactstrap";
import filterFactory, {
  textFilter,
  selectFilter,
  customFilter,
} from "react-bootstrap-table2-filter";
import DeleteModal from "components/Common/DeleteModal";
import { Formik, Field, Form, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import BootstrapTheme from "@fullcalendar/bootstrap";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import AddIcon from "@mui/icons-material/Add";
import { withRouter, Link } from "react-router-dom";
//import "./studyplans.scss";
import { withTranslation } from "react-i18next";
//Import Breadcrumb
import { connect } from "react-redux";
import Breadcrumbs from "../../components/Common/Breadcrumb";

import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";

import { IconButton, Tooltip } from "@mui/material";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";

import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import Select from "react-select";
import {
  addNewSchedulingLecture,
  deleteSchedulingLecture,
  getAllSchedulingLectures,
  getSchedulingLectures,
  updateSchedulingLecture,
  getSectionLabs,
  addNewSectionLab,
  updateSectionLab,
  deleteSectionLab,
  getScheduleTimings,
  deleteScheduleTiming,
  addNewScheduleTiming,
  getScheduleTimingDescs,
  fetchDefaultSettings,
  getScheduleMsgValue,
  getHallTimings,
} from "store/scheduling-lectures/actions";
import {
  getHalls
} from "store/halls/actions";
import { fetchYearsSemesters } from "store/general-management/actions";
import { getFilteredAcademicCertificates } from "store/academicvertificates/actions";
import { returnMessage, schedulingLectures } from "common/data";
import {
  FaceRetouchingOffSharp,
  SignalCellularConnectedNoInternet0BarRounded,
} from "@mui/icons-material";
import lecturePeriods from "pages/Setting/Faculties/lecture-periods";
import { is } from "date-fns/locale";
import { CurrencyEthIcon } from "@icons/material";
import currentSemester from "pages/PriveledgeManagement/SystemManagement/current-semester";
import { initialize } from "redux-form";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../utils/menuUtils";
class SchedulingLecture extends Component {
  constructor(props) {
    super(props);
    this.calendarComponentRef = React.createRef();
    this.state = {
      sectionLabData: "",
      activeTab1: "5",
      activeTab2: "5",
      showAll: false,
      isModalOpen: false,
      selectedRowData: null,
      selectedRowSectionLab: null,
      isNestedModalOpen: false,
      isHallModalOpen: false,
      selectedOption: "",
      values: "",
      deleteModal: false,
      isEdit: false,
      isSectionRadioDisabled: false,
      isLabRadioDisabled: false,
      selectedCells: new Set(),
      isDragging: false,
      selectedRow: null,
      selectedType:"",
      ifUpdateSchedule: 0,
      selectedSchedule: null,
      showMessage: false,
      oldHallId: null,
      newHallId: null,
      defaultHallName: "",
      matchingHallModal: null,
      matchingTimings: [],
      matchingError: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
    };
    this.toggle1 = this.toggle1.bind(this);
    this.toggle = this.toggle.bind(this);
  }
  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  toggle1(tab) {
    const { onGetSchedulingLectures } = this.props;
    const { ifUpdateSchedule, selectedSchedule } = this.state;
    if (this.state.activeTab1 !== tab) {
      this.setState({
        activeTab1: tab,
        showAll:false
      });
    }
    if (ifUpdateSchedule != 0) {
      onGetSchedulingLectures(selectedSchedule["value"]);
      this.setState({ ifUpdateSchedule: 0 });
    }

    document.getElementById("square-switch1").checked = false;
  }
  toggle2(tab) {
    if (this.state.activeTab2 !== tab) {
      this.setState({
        activeTab2: tab,
      });
    }
  }

  componentDidMount() {
    const {
      onGetSchedulingLectures,
      offeringLectures,
      halls,
      instructors,
      sectionLabs,
      departments,
      faculties,
      filteredAcademicCertificates,
      weekDays,
      lecturePeriods,
      yearSemesters,
      onfetchSetting,
      currentSemester,
      onfetchDefaultSettings,
      returnMessage,
      user_menu
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (offeringLectures && !offeringLectures.length) {
      onfetchSetting();
      onfetchDefaultSettings();
      this.setState({ offeringLectures });
      this.setState({ halls });
      this.setState({ faculties });
      this.setState({ instructors });
      this.setState({ departments });
      this.setState({ filteredAcademicCertificates });
      this.setState({ weekDays });
      this.setState({ lecturePeriods });
      this.setState({ yearSemesters });
      this.setState({ returnMessage });
    }
  }

  componentDidUpdate(prevProps) {
    const { currentSemester, yearSemesters, onGetSchedulingLectures } =
      this.props;
    const { selectedSchedule } = this.state;
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

  initializeState() {
    const { currentSemester, yearSemesters, onGetSchedulingLectures } =
      this.props;
    const { selectedSchedule } = this.state;
    const yearsSemestersModified = yearSemesters
      .map(item => ({
        label: item.value,
        value: item.key,
        yearId: item.yearId,
        semesterId: item.semesterId,
      }))
      .filter(item => item.value >= currentSemester.cuYearSemesterId);

    this.setState({
      selectedSchedule: yearsSemestersModified.find(
        opt => opt.value === currentSemester.cuYearSemesterId
      ),
    });
    onGetSchedulingLectures(currentSemester.cuYearSemesterId);
  }

  handleViewAll = isChecked => {
    const { onGetAllSchedulingLectures, onGetSchedulingLectures } = this.props;
    const { selectedSchedule } = this.state;
    this.setState({ showAll: isChecked }, () => {
      if (isChecked) {
        onGetAllSchedulingLectures(selectedSchedule["value"]);
      } else {
        onGetSchedulingLectures(selectedSchedule["value"]);
      }
    });
  };
  handleChangeCheckbox = (row, currentStatus, fieldName) => {
    const {
      onUpdateSchedulingLecture,
      onAddNewSchedulingLecture,
      onDeleteSchedulingLecture,
      currentSemester,
      onGetSchedulingLectures,
      onGetAllSchedulingLectures,
    } = this.props;
    const { showAll, selectedSchedule } = this.state;

    const newRow = {
      Id: row.Id,
      courseId: row.courseId,
      courseCode: row.courseCode,
      isCompletedStudy:
        fieldName === "isCompletedStudy"
          ? currentStatus
            ? 1
            : 0
          : row.isCompletedStudy,
      isOnlyExam:
        fieldName === "isOnlyExam" ? (currentStatus ? 1 : 0) : row.isOnlyExam,
      isWaitingList:
        fieldName === "isWaitingList"
          ? currentStatus
            ? 1
            : 0
          : row.isWaitingList,
      yearSemesterId: selectedSchedule["value"],
      queryname: "_courseOffering",
      fieldName: fieldName,
      fieldValue: currentStatus ? 1 : 0,
    };
    const payload = {
      newRow: newRow,
      showAll: showAll,
      semester: selectedSchedule["value"],
    };
    if (
      !newRow.isCompletedStudy &&
      !newRow.isOnlyExam &&
      !newRow.isWaitingList
    ) {
      //onAddNewSchedulingLecture(newRow);
      const delId = { Id: row.Id };
      const delPayload = {
        delId: delId,
        showAll: showAll,
        semester: selectedSchedule["value"],
      };
      onDeleteSchedulingLecture(delPayload);
    } else {
      if (row.Id) {
        onUpdateSchedulingLecture(payload);
      } else {
        const delId = { Id: row.Id };
        const delPayload = {
          delId: delId,
          showAll: showAll,
          semester: selectedSchedule["value"],
        };
        onDeleteSchedulingLecture(delPayload);
      }
    }
    console.log("showAll",showAll)
       if (showAll == false) {
      onGetSchedulingLectures(selectedSchedule["value"]);
      this.setState({ ifUpdateSchedule: 0 });
    } else {
      onGetAllSchedulingLectures(selectedSchedule["value"]);
      this.setState({ ifUpdateSchedule: 1 });
    }
  };

  handleCheckboxAddOfferedCourseOrDelete = (row, currentStatus, fieldName) => {
    const { onAddNewSchedulingLecture, currentSemester } = this.props;
    const { selectedSchedule } = this.state;
    const newStatus = currentStatus ? 1 : 0;
    let ob = {};
    ob["Id"] = row.Id;
    ob[fieldName] = newStatus;
    if (fieldName === "isOffered" && newStatus === 0) {
      const { onDeleteSchedulingLecture } = this.props;
      let onDelete = { Id: row.Id };
      onDeleteSchedulingLecture(onDelete);
    } else if (fieldName === "isOffered" && newStatus === 1) {
      let rCompleteStudy =
        row.isCompletedStudy == null ? 0 : row.isCompletedStudy;
      let rExam = row.isOnlyExam == null ? 0 : row.isOnlyExam;
      let rWaitingList = row.isWaitingList == null ? 0 : row.isWaitingList;
      const newRow = {
        Id: row.Id,
        courseId: row.courseId,
        courseCode: row.courseCode,
        isOffered: 1,
        isCompletedStudy: rCompleteStudy,
        isOnlyExam: rExam,
        isWaitingList: rWaitingList,
        yearSemesterId: selectedSchedule["value"],
        queryname: "_courseOffering",
      };

      onAddNewSchedulingLecture(newRow);
    }
  };

  handleEditBranch = branchData => {
    const { selectedRowData } = this.state;
    const { onGetSectionLabs } = this.props;

    this.setState({
      selectedRowData: branchData,
      isModalOpen: !this.state.isModalOpen,
    });

    onGetSectionLabs(branchData);
  };

  toggle() {
    const {
      sectionLabData,
      onGetScheduleTimingDescs,
      onGetScheduleTimings,
      onGetHallTimings,
    } = this.props;
    this.setState(prevState => ({
      isModalOpen: !prevState.isModalOpen,
    }));
    this.setState({ selectedRowSectionLab: null });
    onGetScheduleTimings(0);
    onGetScheduleTimingDescs(0);
    onGetHallTimings(0);
    this.setState({ selectedRow: null, 
      selectedType: ""
    });
  }
  toggleNestedModal = () => {
    const { isEdit, selectedOption, selectedSchedule } = this.state;
    const { onGetScheduleTimings,onGetScheduleTimingDescs,onGetHallTimings } = this.props;
    console.log("isEdit",isEdit)
    if (selectedOption === "Section") {
      if (isEdit) {
        this.setState({
          sectionLabData: {
            Capacity: "",
            SectionNumber: "",
            instructorName: "",
            hallName: "",
          },
          isEdit: false,
          selectedOption: "",
          defaultHallName: "",
        });

          }
    } else {
      if (isEdit) {
        this.setState({
          sectionLabData: {
            Capacity: "",
            LabNumber: "",
            instructorName: "",
            hallName: "",
          },
          isEdit: false,
          selectedOption: "",
          defaultHallName: "",
        });
        
      }
      this.setState({selectedRow:null,selectedType: ""})
    }

    this.setState(prevState => ({
      isNestedModalOpen: !prevState.isNestedModalOpen,
    }));
    this.setState({
      selectedRowSectionLab: null,
    });
  };
  toggleHallModal = () => {
    this.setState(prevState => ({
      isHallModalOpen: !prevState.isHallModalOpen,
    }));
  };
  toggleMatchingModal = () => {
    this.setState(prevState => ({
      matchingHallModal: !prevState.matchingHallModal,
    }));
  };
  handleChangeOption = event => {
  const {onGetScheduleTimings,onGetScheduleTimingDescs,onGetHallTimings} = this.props
    this.setState({
      selectedOption: event.target.value,
    });
    this.setState({
      sectionLabData: {
        Capacity: "",
        SectionNumber: "",
        instructorName: "",
        hallName: "",
      },
      defaultHallName: "",
    });

    onGetScheduleTimings(0);
        onGetScheduleTimingDescs(0);
        onGetHallTimings(0);
  };
  handleSave = values => {
    let flag = 0;
    const {
      selectedRowData,
      selectedOption,
      isEdit,
      sectionLabData,
      selectedSchedule,
      oldHallId,
      newHallId,
    } = this.state;

    const {
      onAddNewSectionLab,
      halls,
      onUpdateSectionLab,
      instructors,
      sectionLabs,
      faculties,
      filteredAcademicCertificates,
      currentSemester,
      hallTimings,
    } = this.props;

    let sectionInfo = {};
    if (!isEdit) {
      Object.keys(values).forEach(function (key) {
        if (
          values[key] != undefined &&
          (values[key].length > 0 || values[key] != "")
        )
          sectionInfo[key] = values[key];
      });
    } else {
      sectionInfo = values;
    }
    const fieldErrors = {};

    if (selectedOption === "Section") {
      if (!sectionInfo.SectionNumber) {
        fieldErrors.SectionNumber = "Please enter Section Number.";
      }
    }
    if (selectedOption === "Lab") {
      if (!sectionInfo.LabNumber) {
        fieldErrors.LabNumber = "Please enter Lab Number.";
      }
    }

    if (sectionInfo.Instructorid) {
      const instructorExists = instructors.some(
        instructor => instructor.fullName === sectionInfo.Instructorid
      );
      if (!instructorExists) {
        fieldErrors.Instructorid = "Please select a valid instructor.";
      }
    }

    if (sectionInfo.hallId) {
      const hallExists = halls.some(hall => hall.value === sectionInfo.hallId);
      if (!hallExists) {
        fieldErrors.hallId = "Please select a valid hall.";
      }
    }
    if (sectionInfo.facultyId) {
      const facultyExists = faculties.some(
        faculty => faculty.label === sectionInfo.facultyId
      );
      if (!facultyExists) {
        fieldErrors.facultyId = "Please select a valid faculty.";
      }
    }
    if (sectionInfo.majorId) {
      const majorExists = filteredAcademicCertificates.some(
        major => major.label === sectionInfo.majorId
      );
      if (!majorExists) {
        fieldErrors.majorId = "Please select a valid major.";
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      return fieldErrors;
    }

    const enteredNumber =
      selectedOption === "Section"
        ? sectionInfo.SectionNumber
        : sectionInfo.LabNumber;

    const filteredSectionLabs = sectionLabs.filter(
      sectionLab =>
        (selectedOption === "Section" && sectionLab.type === "Section") ||
        (selectedOption === "Lab" && sectionLab.type === "Lab")
    );

    let isDuplicate = false;

    for (const sectionLab of filteredSectionLabs) {
      if (sectionLab.SectionLabNumber == enteredNumber && !isEdit) {
        isDuplicate = true;
        break;
      }
    }

    if (isDuplicate) {
      const errorMessage = this.props.t(
        `${selectedOption} Number already exists.`
      );
      this.setState({ duplicateError: errorMessage });
    } else {
      if (sectionInfo.hallId !== undefined) {
        const selectedHallName = sectionInfo.hallId;
        const selectedHall = halls.find(
          hall => hall.value === selectedHallName
        );

        if (selectedHall) {
          sectionInfo.hallId = selectedHall.key;
        } else if (isEdit) {
          sectionInfo.hallId = 0;
        } else {
          sectionInfo.hallId = null;
          flag = 1;
        }
      }

      if (sectionInfo.facultyId !== undefined) {
        const selectedFacultyName = sectionInfo.facultyId;
        const selectedFaculty = faculties.find(
          faculty => faculty.label === selectedFacultyName
        );

        if (selectedFaculty) {
          sectionInfo.facultyId = selectedFaculty.value;
        } else if (isEdit) {
          sectionInfo.facultyId = 0;
        } else {
          sectionInfo.facultyId = null;
          flag = 1;
        }
      }
      if (sectionInfo.majorId !== undefined) {
        const selectedMajorName = sectionInfo.majorId;
        const selectedMajor = filteredAcademicCertificates.find(
          major => major.label === selectedMajorName
        );

        if (selectedMajor) {
          sectionInfo.majorId = selectedMajor.value;
        } else if (isEdit) {
          sectionInfo.majorId = 0;
        } else {
          sectionInfo.majorId = null;
          flag = 1;
        }
      }

      if (sectionInfo.Instructorid !== undefined) {
        const selectedInstructorid = sectionInfo.Instructorid;
        const selectedInstructor = instructors.find(
          instructor => instructor.fullName === selectedInstructorid
        );

        if (selectedInstructor) {
          sectionInfo.Instructorid = selectedInstructor.Id;
        } else if (isEdit) {
          sectionInfo.Instructorid = 0;
        } else {
          sectionInfo.Instructorid = null;
          flag = 1;
        }
      }

      sectionInfo["yearSemesterId"] = selectedSchedule["value"];
      sectionInfo["CourseId"] = selectedRowData.courseId;
      sectionInfo["CourseCode"] = selectedRowData.courseCode;
      sectionInfo["tablename"] =
        selectedOption === "Section" ? "Common_Section" : "Common_Lab";
      if (flag === 0) {
        if (isEdit) {
          sectionInfo["Id"] = sectionLabData.Id;
          const filteredSectionLabsEdit = sectionLabs.filter(
            sectionLab =>
              (selectedOption === "Section" && sectionLab.type === "Section") ||
              (selectedOption === "Lab" && sectionLab.type === "Lab")
          );

          let isDuplicateEdit = false;

          for (const sectionLab of filteredSectionLabsEdit) {
            if (
              sectionInfo.Id != sectionLab.Id &&
              sectionLab.SectionLabNumber == enteredNumber
            ) {
              isDuplicateEdit = true;
              break;
            }
          }
          if (!isDuplicateEdit) {
            console.log("sectionInfo",sectionInfo)
            onUpdateSectionLab(sectionInfo);
            this.setState({selectedOption:""})
            this.toggleNestedModal();
          } else {
            const errorMessage = this.props.t(
              `${selectedOption} Number already exists.`
            );
            this.setState({ duplicateError: errorMessage });
          }
        } else {
          onAddNewSectionLab(sectionInfo);
          this.setState({selectedOption:""})
          this.toggleNestedModal();
        }
      }
    }

  };
  hasMatchingTimings = (hallTimings1, hallTimings2) => {
    for (const timing1 of hallTimings1) {
      for (const timing2 of hallTimings2) {
        if (
          timing1.dayId === timing2.dayId &&
          timing1.lecturePeriodId === timing2.lecturePeriodId
        ) {
          return true;
        }
      }
    }
    return false;
  };
  joinMatchingTimings = (hallTimings1, hallTimings2) => {
    const matchingTimings = [];
    for (const timing1 of hallTimings1) {
      for (const timing2 of hallTimings2) {
        if (
          timing1.dayId === timing2.dayId &&
          timing1.lecturePeriodId === timing2.lecturePeriodId
        ) {
          matchingTimings.push(timing1);
        }
      }
    }
    return matchingTimings;
  };
  onClickDelete = sectionLabData => {
    this.setState({ sectionLabData: sectionLabData });
    this.setState({ deleteModal: true });
  };
  handleDeleteSectionLab = () => {
    const { onDeleteSectionLab, selectedOption } = this.props;
    const { sectionLabData } = this.state;
    if (sectionLabData.Id !== undefined) {
      let onDelete = { Id: sectionLabData.Id };
      onDelete["tablename"] =
        sectionLabData.type === "Lab" ? "Common_Lab" : "Common_Section";
      onDeleteSectionLab(onDelete);
    }
    this.setState({ deleteModal: false, selectedOption: "" });
    this.setState({
      sectionLabData: {
        Capacity: "",
        SectionNumber: "",
        instructorName: "",
        hallName: "",
        LabNumber: "",
      },
      isEdit: false,
    });
  };
  handleEditSectionLab = SLD => {
    const {onGetScheduleTimings} = this.props

console.log("in edit SLD",SLD)   
 this.setState({
      defaultHallName: SLD.hallName,
      isEdit: true,
      sectionLabData: {
        Id: SLD.Id,
        Capacity: SLD.Capacity,
        SectionLabNumber: SLD.SectionLabNumber,
        hallName: SLD.hallName,
        instructorName: SLD.instructorName,
        type: SLD.type,
        facultyName: SLD.facultyName,
        majorName: SLD.majorName,
      },
      selectedOption: SLD.type,
      isSectionRadioDisabled: SLD.type === "Lab",
      isLabRadioDisabled: SLD.type === "Section",
    });
    this.handleScheduleTiming(SLD, 1)
    const OB = {
      yearSemesterId: this.state.selectedSchedule["value"],
      check: 1,
    };
    this.props.onGetHallTimings(OB);

    this.toggleNestedModal();
  };
  handleViewHallSchedule = SLD => {
    const { halls, currentSemester, onGetHallTimings } = this.props;
    const { selectedSchedule } = this.state;
    const findingHallId = halls.find(
      hall => hall.value === SLD.hallName
    ).key;

    const OB = {
      hallId: findingHallId,
      yearSemesterId: selectedSchedule["value"],
      check: 0,
    };

    onGetHallTimings(OB);
    this.toggleHallModal();
  };
  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };
  handleAlertMatching = () => {
    this.setState({ matchingError: null });
  };

  handleScheduleTiming = (sectionLabData, fromCalender) => {
    const { selectedRowSectionLab } = this.state;
    const {
      onGetScheduleTimings,
      onGetScheduleTimingDescs,
      returnMessage,
      onGetScheduleMsgValue,
    } = this.props;

    this.setState({
      selectedRowSectionLab: sectionLabData,
    });
    if (returnMessage.msg) {
      onGetScheduleMsgValue();
    } else {
      onGetScheduleTimings(sectionLabData);
      onGetScheduleTimingDescs(sectionLabData);
      this.setState({ selectedRow: sectionLabData.Id,selectedType:sectionLabData.type });
    }
    if (fromCalender == 1) {
      onGetScheduleTimings(sectionLabData);
      onGetScheduleTimingDescs(sectionLabData);
      this.setState({ selectedRow: sectionLabData.Id,selectedType:sectionLabData.type });
    }
  };

  handleMouseDown = (cellIndex, lectureId, weekdayId) => {
    const {
      onAddNewScheduleTiming,
      onDeleteScheduleTiming,
      scheduleTimings,
      onGetScheduleMsgValue,
      onGetScheduleTimings,
      onGetScheduleTimingDescs,
    } = this.props;
    const { selectedRowSectionLab, selectedSchedule } = this.state;
    onGetScheduleMsgValue();
    this.setState({
      isDragging: true,
    });

    const scheduledTiming = scheduleTimings.find(
      timing =>
        timing.dayId === weekdayId && timing.lecturePeriodId === lectureId
    );

    if (scheduledTiming && !returnMessage.msg) {
      onDeleteScheduleTiming(scheduledTiming);

      onGetScheduleTimings(this.state.selectedRowSectionLab);
      onGetScheduleTimingDescs(this.state.selectedRowSectionLab);
    } else {
      const ob = {};
      ob["type"] = selectedRowSectionLab.type;
      ob["sectionLabId"] = selectedRowSectionLab.Id;
      ob["dayId"] = weekdayId;
      ob["lecturePeriodId"] = lectureId;
      ob["yearSemesterId"] = selectedSchedule.value;
      if (
        selectedRowSectionLab.Instructorid !== null &&
        selectedRowSectionLab.Instructorid !== 0
      ) {
        ob["Instructorid"] = selectedRowSectionLab.Instructorid;
      }

      if (
        selectedRowSectionLab.hallId !== null &&
        selectedRowSectionLab.hallId !== 0
      ) {
        ob["hallId"] = selectedRowSectionLab.hallId;
      }

      onAddNewScheduleTiming(ob);
      this.handleScheduleTiming(this.state.selectedRowSectionLab);
    }
  };
  handleMouseEnter = (cellIndex, lectureId, weekdayId) => {
    const { onAddNewScheduleTiming, onDeleteScheduleTiming, scheduleTimings } =
      this.props;
    const { selectedRowSectionLab, selectedSchedule } = this.state;
    this.setState({
      isDragging: true,
    });

    const scheduledTiming = scheduleTimings.find(
      timing =>
        timing.dayId === weekdayId && timing.lecturePeriodId === lectureId
    );

    if (scheduledTiming) {
      onDeleteScheduleTiming(scheduledTiming);
      onGetScheduleTimings(this.state.selectedRowSectionLab);
      onGetScheduleTimingDescs(this.state.selectedRowSectionLab);
    } else {
      const ob = {};
      ob["type"] = selectedRowSectionLab.type;
      ob["sectionLabId"] = selectedRowSectionLab.Id;
      ob["dayId"] = weekdayId;
      ob["lecturePeriodId"] = lectureId;
      ob["yearSemesterId"] = selectedSchedule.value;
      if (
        selectedRowSectionLab.Instructorid !== null &&
        selectedRowSectionLab.Instructorid !== 0
      ) {
        ob["Instructorid"] = selectedRowSectionLab.Instructorid;
      }
      if (
        selectedRowSectionLab.hallId !== null &&
        selectedRowSectionLab.hallId !== 0
      ) {
        ob["hallId"] = selectedRowSectionLab.hallId;
      }

      onAddNewScheduleTiming(ob);

      this.handleScheduleTiming(this.state.selectedRowSectionLab);
    }
  };

  handleMouseUp = () => {
    this.setState({
      isDragging: false,
    });
  };

  handleFacultyBlur = e => {
    const { onGetFilteredAcademicCertificates, faculties } = this.props;
    const selectedFacultyName2 = e.target.value;

    let selectedFaculty = faculties.find(
      faculty => faculty.label === selectedFacultyName2
    );

    if (selectedFaculty) {
      let selectedFacultyId2 = selectedFaculty.value;
      onGetFilteredAcademicCertificates(selectedFacultyId2);
    }
  };
  handleSelectChange = (name, value) => {
    document.getElementById("square-switch1").checked = false;
    const { onGetSchedulingLectures } = this.props;
    this.setState({ selectedSchedule: value });
    onGetSchedulingLectures(value["value"]);
  };
  onChangeHall(oldValue,newValue) {
console.log("oldValue",oldValue)
    const { halls, hallTimings,scheduleTimings } = this.props;
    if(oldValue===null || oldValue ===undefined|| oldValue === "") {
      oldValue = ""
    }
    console.log("oldValue after condition",oldValue)
    this.setState({ defaultHallName: newValue });
    console.log("scheduleTimings",scheduleTimings)
    if (halls.some(hall => hall.value === newValue)) {
      let oldHallId = null
      if(oldValue !== ""){
       oldHallId = halls.find(hall => hall.value === oldValue).key;
    }
      const newHallId = halls.find(hall => hall.value === newValue).key;
      if (oldValue === "" || oldHallId != newHallId) {
        const newHallTimings = hallTimings.filter(
          timing => timing.hallId === newHallId
        );
        const isMatching = this.hasMatchingTimings(
          scheduleTimings,
          newHallTimings
        );
        if (isMatching == true) {
          const matchingTimings = this.joinMatchingTimings(
            scheduleTimings,
            newHallTimings
          );
          this.setState({ defaultHallName: oldValue, matchingTimings });
          this.setState({
            matchingError: `${newValue} Intersects `,
          });
          this.toggleMatchingModal();
        }
      }
    }
  }
  render() {
    const {
      schedulingLectures,
      t,
      offeringLectures,
      halls,
      sectionLabs,
      instructors,
      faculties,
      onGetFilteredAcademicCertificates,
      filteredAcademicCertificates,
      weekDays,
      lecturePeriods,
      scheduleTimings,
      scheduleTimingDescs,
      currentSemester,
      yearSemesters,
      returnMessage,
      hallTimings,
    } = this.props;

    const {
      showAll,
      isModalOpen,
      selectedRowData,
      isNestedModalOpen,
      isHallModalOpen,
      selectedOption,
      deleteModal,
      isEdit,
      sectionLabData,
      isLabRadioDisabled,
      isSectionRadioDisabled,
      duplicateError,
      selectedCells,
      selectedRowSectionLab,
      selectedSchedule,
      showMessage,
      matchingHallModal,
      matchingTimings,
      matchingError,
      showEditButton,
      showSearchButton,
      showAddButton,
      showDeleteButton
    } = this.state;
    const { SearchBar } = Search;

    console.log("sectionLabs",sectionLabs)

    const pageOptions = {
      sizePerPage: 20,
      totalSize: schedulingLectures.length,
      custom: true,
    };
    const pageOptions2 = {
      sizePerPage: 20,
      totalSize: offeringLectures.length,
      custom: true,
    };

    const yearsSemestersModified = yearSemesters
      .map(item => ({
        label: item.value,
        value: item.key,
        yearId: item.yearId,
        semesterId: item.semesterId,
      }))
      .filter(item => item.value >= currentSemester.cuYearSemesterId);

    //meta title
    document.title = "keyInHands - React Admin & Dashboard Template";

    const columns = [
      { dataField: "Id", text: t("ID"), hidden: true },
      {
        dataField: "courseName",
        text: t("Course Name"),
        editable: false,
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton
        }),
      },
      {
        dataField: "courseCode",
        text: t("Course Code"),
        editable: false,
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton
        }),
      },
      {
        dataField: "faculty",
        text: t("Faculty"),
        editable: false,
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton
        }),
      },
      {
        dataField: "depName",
        text: t("Department Name"),
        editable: false,
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton
        }),
      },
      {
        dataField: "courseType",
        text: t("Course Type"),
        editable: false,
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton
        }),
      },
      {
        dataField: "isOffered",
        text: t("isOffered"),
        editable: false,
        hidden: true,
        formatter: (cellContent, row, column) => (
          <Input
            type="checkbox"
            className={`form-check-input input-mini warning}`}
            id="behaviorButton"
            defaultChecked={cellContent == 1}
            onChange={event =>
              this.handleCheckboxAddOfferedCourseOrDelete(
                row,
                event.target.checked,
                "isOffered"
              )
            }
          />
        ),
      },
      {
        key: "isCompletedStudy",
        dataField: "isCompletedStudy",
        text: t("Completed Study"),
        editable: false,

        formatter: (cellContent, row, column) => {
          return (
            <div className="form-check form-switch form-switch-md mb-3 ">
              <input
                type="checkbox"
                className="form-check-input"
                id="customSwitchsizemd"
                defaultChecked={cellContent === 1}
                onChange={event => {
                  this.handleChangeCheckbox(
                    row,
                    event.target.checked,
                    "isCompletedStudy"
                  );
                }}
                disabled={!showEditButton}
                // disabled={row.isOffered === 0}
              />
            </div>
          );
        },
      },

      {
        key: "isOnlyExam",
        dataField: "isOnlyExam",
        text: t("Only Exams"),
        editable: false,

        formatter: (cellContent, row, column) => {
          const isDisabled = !row.isOffered;

          return (
            <div className="form-check form-switch form-switch-md mb-3 ">
              <input
                type="checkbox"
                className="form-check-input"
                id={"isOnlyExam" + row.Id}
                defaultChecked={row.isOnlyExam === 1}
                onChange={event => {
                  this.handleChangeCheckbox(
                    row,
                    event.target.checked,
                    "isOnlyExam"
                  );
                }}
                disabled={!showEditButton}
                // disabled={row.isOffered === 0}
              />
            </div>
          );
        },
      },
      {
        key: "isWaitingList",
        dataField: "isWaitingList",
        text: t("Waiting List"),
        editable: false,
        formatter: (cellContent, row, column) => {
          const isDisabled = !row.isOffered;

          return (
            <div className="form-check form-switch form-switch-md mb-3 ">
              <input
                type="checkbox"
                className="form-check-input"
                id="customSwitchsizemd"
                defaultChecked={cellContent === 1}
                onChange={event => {
                  this.handleChangeCheckbox(
                    row,
                    event.target.checked,
                    "isWaitingList"
                  );
                }}
                disabled={!showEditButton}
                // disabled={row.isOffered === 0}
              />
            </div>
          );
        },
      },
    ];
    const columns2 = [
      { dataField: "Id", text: t("ID"), hidden: true },
      {
        dataField: "courseName",
        text: t("Course Name"),
        editable: false,
        sort: true,
      },

      {
        dataField: "courseCode",
        text: t("Course Code"),
        editable: false,
        sort: true,
      },

      {
        dataField: "nbHours",
        text: t("Number of Hours"),
        editable: false,
        sort: true,
      },
      {
        dataField: "courseType",
        text: t("Course Type"),
        editable: false,
        sort: true,
      },
      {
        dataField: "numOfSections ",
        text: t("Number of Sections"),
        editable: false,
        sort: true,
      },
      {
        dataField: "numOfLabs ",
        text: t("Number of Labs"),
        editable: false,
        sort: true,
      },
      {
        dataField: "courses",
        text: t("Courses"),
        editable: false,
        sort: true,
      },
      {
        dataField: "menu",
        isDummyField: true,
        editable: false,
        text: this.props.t(""),
        formatter: (cellContent, branch) => (
          <div
            className="d-flex gap-3"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Tooltip title={t("Sections & Labs")} placement="top">
              <Link className="section-button text-secondary" to="#">
                <i
                  className="bx bx-calendar-event font-size-18"
                  id="edittooltip"
                  onClick={() => this.handleEditBranch(branch)}
                ></i>
              </Link>
            </Tooltip>
          </div>
        ),
      },
    ];
    const sectionLabColumns = [
      { dataField: "Id", text: t("ID"), hidden: true },
      {
        dataField: "type",
        text: t("Type"),
        editable: false,
        sort: true,
      },
      {
        dataField: "SectionLabNumber",
        text: t("Section Lab Number"),
        editable: false,
        sort: true,
      },
      {
        dataField: "hallName",
        text: t("Hall"),
        editable: false,
        sort: true,
      },
      {
        dataField: "instructorName",
        text: t("Instructor"),
        editable: false,
        sort: true,
      },
      {
        dataField: "Capacity",
        text: t("Capacity"),
        editable: false,
        sort: true,
      },

      {
        dataField: "menu",
        isDummyField: true,
        editable: false,
        text: this.props.t("Action"),
        formatter: (cellContent, sectionLabData) => (
          <div className="d-flex gap-3">
            <Tooltip title={t("Schedule Timing")} placement="top">
              <Link className="warning" to="#">
                <i
                  className="mdi mdi-calendar-blank font-size-18"
                  onClick={() => this.handleScheduleTiming(sectionLabData, 1)}
                ></i>
              </Link>
            </Tooltip>
            <Tooltip title={t("View Hall Timing")} placement="top">
              <Link className="" to="#">
                <i
                  className="mdi mdi-google-classroom font-size-18"
                  id="edittooltip"
                  onClick={() => this.handleViewHallSchedule(sectionLabData)}
                ></i>
              </Link>
            </Tooltip>
            <Tooltip title={t("Edit Section/Lab")} placement="top">
              <Link className="text-secondary" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={() => this.handleEditSectionLab(sectionLabData)}
                ></i>
              </Link>
            </Tooltip>
          {showDeleteButton && (
            <Tooltip title={t("Delete Section/Lab")} placement="top">
              <Link className="text-danger m-0" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(sectionLabData)}
                ></i>
              </Link>
            </Tooltip>)}
          </div>
        ),
      },
    ];
    const ScheduleTimingDescsCol = [
      {
        dataField: "dayTitle",
        text: t("Day"),
        editable: false,
        sort: true,
      },
      {
        dataField: "periodTime",
        text: t("Period Time"),
        editable: false,
        sort: true,
      },
    ];

    const weekDaysColumns = weekDays.map(weekday =>
      this.props.t(weekday.enTitle)
    );
    const addButtonStyle = {
      backgroundColor: "#75dfd1",
      color: "#ffffff",
      textAlign: "left",
    };

    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Faculties"
              breadcrumbItem={this.props.t("Scheduling Lectures")}
            />

            <div className="checkout-tabs">
              <Row>
                <Col>
                  <Card>
                    <CardBody>
                      <CardTitle className="h4"></CardTitle>
                      <Nav pills className="navtab-bg nav-justified">
                        <NavItem>
                          <NavLink
                            id="horizontal-home-link"
                            style={{ cursor: "pointer" }}
                            className={classnames({
                              active: this.state.activeTab1 === "5",
                            })}
                            onClick={() => {
                              this.toggle1("5");
                            }}
                          >
                            {this.props.t("Offering Courses")}
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            id="horizontal-home-link"
                            style={{ cursor: "pointer" }}
                            className={classnames({
                              active: this.state.activeTab1 === "6",
                            })}
                            onClick={() => {
                              this.toggle1("6");
                            }}
                          >
                            {this.props.t("Sections & Labs")}
                          </NavLink>
                        </NavItem>
                      </Nav>

                      <TabContent
                        activeTab={this.state.activeTab1}
                        className="p-3 text-muted"
                      >
                        <TabPane tabId="5">
                          <PaginationProvider
                            pagination={paginationFactory(pageOptions)}
                            keyField="Id"
                            columns={columns}
                            data={schedulingLectures}
                          >
                            {({ paginationProps, paginationTableProps }) => (
                              <ToolkitProvider
                                keyField="Id"
                                columns={columns}
                                data={schedulingLectures}
                                search
                              >
                                {toolkitprops => (
                                  <React.Fragment>
                                    <Row className="mb-2">
                                      <Col sm="3">
                                        <div className="search-box ms-2 mb-2 d-inline-block">
                                       {showSearchButton && (
                                          <div className="position-relative">
                                            <SearchBar
                                              {...toolkitprops.searchProps}
                                            />
                                            <i className="bx bx-search-alt search-icon" />
                                          </div>)}
                                        </div>
                                      </Col>
                                      <Col lg="3">
                                        <Select
                                          className="select-style-schedule"
                                          name="schedule"
                                          key={`schedule`}
                                          options={yearsSemestersModified}
                                          onChange={newValue => {
                                            this.handleSelectChange(
                                              "schedule",
                                              newValue
                                            );
                                          }}
                                          value={selectedSchedule}
                                        />
                                        <br />
                                      </Col>
                                      <Col sm="5"></Col>

                                      <Col sm="1">
                                        {/* <Button
                                          color="primary"
                                          className="font-16 btn-block btn btn-warning"
                                          onClick={this.handleViewAll}
                                        >
                                          {t("View All")}
                                        </Button> */}
                                        <Tooltip
                                          title={t("View All")}
                                          placement="top"
                                        >
                                          <div className="square-switch square-switch-view">
                                            <input
                                              type="checkbox"
                                              id="square-switch1"
                                              switch="none"
                                              onChange={event => {
                                                this.handleViewAll(
                                                  event.target.checked
                                                );
                                              }}
                                            />
                                            <label
                                              htmlFor="square-switch1"
                                              data-on-label="View"
                                              data-off-label="Off"
                                            />
                                          </div>
                                        </Tooltip>
                                        {/* onChange={(event) => {
                                              this.handleViewAll(event.target.checked);
                                            }} */}
                                      </Col>
                                    </Row>
                                    <Row>
                                      <BootstrapTable
                                        {...toolkitprops.baseProps}
                                        {...paginationTableProps}
                                        keyField="Id"
                                        data={schedulingLectures}
                                        filter={filterFactory()}
                                        filterPosition="top"
                                        columns={columns}
                                        cellEdit={cellEditFactory({
                                          mode: "click",
                                          blurToSave: true,
                                        })}
                                        noDataIndication={t(
                                          "No Scheduling Lectures"
                                        )}
                                      />
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
                        </TabPane>
                        <TabPane tabId="6">
                          <Modal isOpen={isModalOpen} fullscreen>
                            <ModalHeader
                              toggle={this.toggle}
                              tag="h4"
                              className="horizontalTitles"
                            ></ModalHeader>
                            <ModalBody>
                              {selectedRowData && (
                                <div className="TitleStyle">
                                  {selectedRowData.courseName}{" "}
                                  {selectedRowData.courseCode}
                                </div>
                              )}
                              <Row>
                                <Col
                                  sm="4"
                                  className="branches-categories-responsive"
                                >
                                  <div className="bordered">
                                    <Card className="mb-0">
                                      <CardBody className="pb-0">
                                        <Col>
                                          <Row className="mb-2">
                                            <Col>
                                              <h5
                                                className="header pt-2 me-2"
                                                id="title"
                                              >
                                                {" "}
                                                {this.props.t(
                                                  "Sections & Labs"
                                                )}
                                              </h5>
                                            </Col>
                                            <Col sm="6">
                                              <div className="text-sm-end">
                                                {showAddButton &&(
                                                <IconButton
                                                  className="ms-2"
                                                  onClick={
                                                    this.toggleNestedModal
                                                  }
                                                >
                                                  {" "}
                                                  <i className="mdi mdi-plus-circle blue-noti-icon" />
                                                </IconButton>)}
                                              </div>
                                            </Col>
                                          </Row>
                                        </Col>

                                        <BootstrapTable
                                          keyField="rowNumber"
                                          data={sectionLabs}
                                          columns={sectionLabColumns}
                                          cellEdit={cellEditFactory({
                                            mode: "click",
                                            blurToSave: true,
                                          })}
                                          noDataIndication={t(
                                            "No Scheduling Lectures"
                                          )}
                                          rowStyle={(row, rowIndex) => {
                                            const type = row.type;
                                            const isSelected =
                                              row.Id === this.state.selectedRow;
const isSelectedType = row.type ===this.state.selectedType
                                            let backgroundColor = "";
                                            if (type === "Section") {
                                              backgroundColor =
                                                "rgb(192 220 245)";
                                            } else if (type === "Lab") {
                                              backgroundColor =
                                                "rgb(152 152 235 / 30%)";
                                            }

                                            if (isSelected && isSelectedType) {
                                              backgroundColor = "#f9cf87";
                                            }

                                            return {
                                              backgroundColor: backgroundColor,
                                            };
                                          }}
                                        />
                                      </CardBody>
                                    </Card>
                                    <Card>
                                      <CardBody className="pt-0">
                                        <Row className="mb-2">
                                          <Col
                                            sm="6"
                                            className="schedule-timing-responsive"
                                          >
                                            <h5
                                              className="header pt-2 me-2"
                                              id="title"
                                            >
                                              {this.props.t("Schedule Timing")}
                                            </h5>
                                          </Col>
                                        </Row>
                                        <BootstrapTable
                                          keyField="Id"
                                          data={scheduleTimingDescs}
                                          columns={ScheduleTimingDescsCol}
                                          cellEdit={cellEditFactory({
                                            mode: "click",
                                            blurToSave: true,
                                          })}
                                          noDataIndication={t(
                                            "No Scheduling Lectures"
                                          )}
                                          rowStyle={(row, rowIndex) => {
                                            const type = row.type;
                                            if (type === "Section") {
                                              return {
                                                backgroundColor:
                                                  "rgb(189 199 124 / 23%)",
                                              };
                                            } else if (type === "Lab") {
                                              return {
                                                backgroundColor:
                                                  "rgb(189 199 124 / 23%)",
                                              };
                                            }
                                          }}
                                        />
                                      </CardBody>
                                    </Card>
                                  </div>
                                </Col>
                                <Col>
                                  <div className="bordered pb-0">
                                    <Card>
                                      <CardBody className="pb-0">
                                        <Col>
                                          {" "}
                                          <h5
                                            className="header pt-2"
                                            id="title"
                                          >
                                            {selectedRowSectionLab
                                              ? `${this.props.t(
                                                  "Schedule Timing"
                                                )} - ${
                                                  selectedRowSectionLab.type
                                                } - ${
                                                  selectedRowSectionLab.SectionLabNumber
                                                }`
                                              : this.props.t("Schedule Timing")}
                                          </h5>
                                        </Col>

                                        <div className="timetable-container">
                                          <table
                                            className="timetable"
                                            onMouseUp={this.handleMouseUp}
                                          >
                                            <thead>
                                              <tr>
                                                <th>{t("Lecture Periods")}</th>
                                                {weekDaysColumns.map(
                                                  (header, index) => (
                                                    <th key={index}>
                                                      {header}
                                                    </th>
                                                  )
                                                )}
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {lecturePeriods.map(
                                                (lecture, rowIndex) => (
                                                  <tr key={lecture.Id}>
                                                    <td className="lecture-cell">
                                                      {lecture.duration}
                                                    </td>
                                                    {weekDays.map(
                                                      (weekday, cellIndex) => {
                                                        const scheduledTiming =
                                                          scheduleTimings.find(
                                                            timing =>
                                                              timing.dayId ===
                                                                weekday.Id &&
                                                              timing.lecturePeriodId ===
                                                                lecture.Id
                                                          );

                                                        const cellValue =
                                                          scheduledTiming
                                                            ? "selected"
                                                            : "";

                                                        return scheduledTiming &&
                                                          scheduledTiming.msg ? (
                                                          <Tooltip
                                                            title={
                                                              scheduledTiming.msg ===
                                                              1
                                                                ? t(
                                                                    "Busy Hall & Instructor"
                                                                  )
                                                                : scheduledTiming.msg ===
                                                                  2
                                                                ? t("Busy Hall")
                                                                : scheduledTiming.msg ===
                                                                  3
                                                                ? t(
                                                                    "Busy Instructor"
                                                                  )
                                                                : null
                                                            }
                                                            placement="top-end"
                                                            key={cellIndex}
                                                          >
                                                            <td
                                                              key={cellIndex}
                                                              className={`timetable-cell ${cellValue}`}
                                                              onMouseDown={() => {
                                                                this.handleMouseDown(
                                                                  cellIndex +
                                                                    rowIndex *
                                                                      weekDays.length,
                                                                  lecture.Id,
                                                                  weekday.Id
                                                                );
                                                              }}
                                                              onMouseEnter={() => {
                                                                if (
                                                                  this.state
                                                                    .isDragging
                                                                ) {
                                                                  this.handleMouseEnter(
                                                                    cellIndex +
                                                                      rowIndex *
                                                                        weekDays.length,
                                                                    lecture.Id,
                                                                    weekday.Id
                                                                  );
                                                                }
                                                              }}
                                                              style={{
                                                                backgroundColor:
                                                                  scheduledTiming
                                                                    ? scheduledTiming.msg ===
                                                                      1
                                                                      ? "orange"
                                                                      : scheduledTiming.msg ===
                                                                        2
                                                                      ? "#48b3fb"
                                                                      : scheduledTiming.msg ===
                                                                        3
                                                                      ? "#f9544e"
                                                                      : "lightgreen"
                                                                    : "",
                                                              }}
                                                            ></td>
                                                          </Tooltip>
                                                        ) : (
                                                          <td
                                                            key={cellIndex}
                                                            className={`timetable-cell ${cellValue}`}
                                                            onMouseDown={() => {
                                                              this.handleMouseDown(
                                                                cellIndex +
                                                                  rowIndex *
                                                                    weekDays.length,
                                                                lecture.Id,
                                                                weekday.Id
                                                              );
                                                            }}
                                                            onMouseEnter={() => {
                                                              if (
                                                                this.state
                                                                  .isDragging
                                                              ) {
                                                                this.handleMouseEnter(
                                                                  cellIndex +
                                                                    rowIndex *
                                                                      weekDays.length,
                                                                  lecture.Id,
                                                                  weekday.Id
                                                                );
                                                              }
                                                            }}
                                                            style={{
                                                              backgroundColor:
                                                                scheduledTiming
                                                                  ? scheduledTiming.msg ===
                                                                    1
                                                                    ? "orange"
                                                                    : scheduledTiming.msg ===
                                                                      2
                                                                    ? "#48b3fb"
                                                                    : scheduledTiming.msg ===
                                                                      3
                                                                    ? "#f9544e"
                                                                    : "lightgreen"
                                                                  : "",
                                                            }}
                                                          ></td>
                                                        );
                                                      }
                                                    )}
                                                  </tr>
                                                )
                                              )}
                                            </tbody>
                                          </table>
                                        </div>
                                        <div className="row mt-5">
                                          <div className="col-2">
                                            <div
                                              className="color-block"
                                              style={{
                                                backgroundColor: "#f9544e",
                                              }}
                                            ></div>
                                            <p className="description">
                                              {t("Busy Instructor")}
                                            </p>
                                          </div>
                                          <div className="col-2">
                                            <div
                                              className="color-block"
                                              style={{
                                                backgroundColor: "#48b3fb",
                                              }}
                                            ></div>
                                            <p className="description">
                                              {t("Busy Hall")}
                                            </p>
                                          </div>
                                          <div className="col-2">
                                            <div
                                              className="color-block"
                                              style={{
                                                backgroundColor: "lightgreen",
                                              }}
                                            ></div>
                                            <p className="description">
                                              {t("Selected Time")}
                                            </p>
                                          </div>
                                          <div className="col-2">
                                            <div
                                              className="color-block"
                                              style={{
                                                backgroundColor: "white",
                                              }}
                                            ></div>
                                            <p className="description">
                                              {t("Available Time")}
                                            </p>
                                          </div>
                                          <div className="col-3">
                                            <div
                                              className="color-block"
                                              style={{
                                                backgroundColor: "orange",
                                              }}
                                            ></div>
                                            <p className="description">
                                              {t("Busy Hall & Instructor")}
                                            </p>
                                          </div>
                                        </div>
                                      </CardBody>
                                    </Card>
                                  </div>
                                </Col>
                              </Row>
                              <Modal
                                isOpen={isHallModalOpen}
                                toggle={this.toggleHallModal}
                                className="modal-lg"
                              >
                                <ModalHeader
                                  toggle={this.toggleHallModal}
                                ></ModalHeader>
                                <ModalBody>
                                  <div className="timetable-container">
                                    <table className="timetable">
                                      <thead>
                                        <tr>
                                          <th>{t("Lecture Periods")}</th>
                                          {weekDaysColumns.map(
                                            (header, index) => (
                                              <th key={index}>{header}</th>
                                            )
                                          )}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {lecturePeriods.map(
                                          (lecture, rowIndex) => (
                                            <tr key={lecture.Id}>
                                              <td className="lecture-cell">
                                                {lecture.duration}
                                              </td>
                                              {weekDays.map(
                                                (weekday, cellIndex) => {
                                                  const hallTiming =
                                                    hallTimings.find(
                                                      timing =>
                                                        timing.dayId ===
                                                          weekday.Id &&
                                                        timing.lecturePeriodId ===
                                                          lecture.Id
                                                    );

                                                  const cellValue = hallTiming
                                                    ? "selected"
                                                    : "";

                                                  return hallTiming &&
                                                    hallTiming.msg ? (
                                                    <Tooltip
                                                      title={
                                                        hallTiming.msg === 1
                                                          ? t(
                                                              "Busy Hall & Instructor"
                                                            )
                                                          : hallTiming.msg === 2
                                                          ? t("Busy Hall")
                                                          : hallTiming.msg === 3
                                                          ? t("Busy Instructor")
                                                          : null
                                                      }
                                                      placement="top-end"
                                                      key={cellIndex}
                                                    >
                                                      <td
                                                        key={cellIndex}
                                                        className={`timetable-cell ${cellValue}`}
                                                        style={{
                                                          backgroundColor:
                                                            hallTiming
                                                              ? hallTiming.msg ===
                                                                1
                                                                ? "orange"
                                                                : hallTiming.msg ===
                                                                  2
                                                                ? "#48b3fb"
                                                                : hallTiming.msg ===
                                                                  3
                                                                ? "#f9544e"
                                                                : "#f9544e"
                                                              : "",
                                                        }}
                                                      ></td>
                                                    </Tooltip>
                                                  ) : (
                                                    <td
                                                      key={cellIndex}
                                                      className={`timetable-cell ${cellValue}`}
                                                      style={{
                                                        backgroundColor:
                                                          hallTiming
                                                            ? hallTiming.msg ===
                                                              1
                                                              ? "orange"
                                                              : hallTiming.msg ===
                                                                2
                                                              ? "#48b3fb"
                                                              : hallTiming.msg ===
                                                                3
                                                              ? "#f9544e"
                                                              : "#f9544e"
                                                            : "",
                                                      }}
                                                    ></td>
                                                  );
                                                }
                                              )}
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </ModalBody>
                              </Modal>
                              <Modal
                                isOpen={matchingHallModal}
                                toggle={this.toggleMatchingModal}
                                className="modal-lg"
                              >
                                <ModalHeader
                                  toggle={this.toggleMatchingModal}
                                ></ModalHeader>
                                <ModalBody>
                                  <div>
                                    {matchingError && (
                                      <Alert
                                        color="danger"
                                        className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                        role="alert"
                                      >
                                        {matchingError}
                                        <button
                                          type="button"
                                          className="btn-close"
                                          aria-label="Close"
                                          onClick={this.handleAlertMatching}
                                        ></button>
                                      </Alert>
                                    )}
                                  </div>
                                  <div className="timetable-container">
                                    <table className="timetable">
                                      <thead>
                                        <tr>
                                          <th>{t("Lecture Periods")}</th>
                                          {weekDaysColumns.map(
                                            (header, index) => (
                                              <th key={index}>{header}</th>
                                            )
                                          )}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {lecturePeriods.map(
                                          (lecture, rowIndex) => (
                                            <tr key={lecture.Id}>
                                              <td className="lecture-cell">
                                                {lecture.duration}
                                              </td>
                                              {weekDays.map(
                                                (weekday, cellIndex) => {
                                                  const matchingTiming =
                                                    matchingTimings.find(
                                                      timing =>
                                                        timing.dayId ===
                                                          weekday.Id &&
                                                        timing.lecturePeriodId ===
                                                          lecture.Id
                                                    );

                                                  const cellValue =
                                                    matchingTiming
                                                      ? "selected"
                                                      : "";

                                                  return matchingTiming &&
                                                    matchingTiming.msg ? (
                                                    <Tooltip
                                                      title={
                                                        matchingTiming.msg === 1
                                                          ? t(
                                                              "Busy Hall & Instructor"
                                                            )
                                                          : matchingTiming.msg ===
                                                            2
                                                          ? t("Busy Hall")
                                                          : matchingTiming.msg ===
                                                            3
                                                          ? t("Busy Instructor")
                                                          : null
                                                      }
                                                      placement="top-end"
                                                      key={cellIndex}
                                                    >
                                                      <td
                                                        key={cellIndex}
                                                        className={`timetable-cell ${cellValue}`}
                                                        style={{
                                                          backgroundColor:
                                                            matchingTiming
                                                              ? matchingTiming.msg ===
                                                                1
                                                                ? "orange"
                                                                : matchingTiming.msg ===
                                                                  2
                                                                ? "#48b3fb"
                                                                : matchingTiming.msg ===
                                                                  3
                                                                ? "#f9544e"
                                                                : "#f9544e"
                                                              : "",
                                                        }}
                                                      ></td>
                                                    </Tooltip>
                                                  ) : (
                                                    <td
                                                      key={cellIndex}
                                                      className={`timetable-cell ${cellValue}`}
                                                      style={{
                                                        backgroundColor:
                                                          matchingTiming
                                                            ? matchingTiming.msg ===
                                                              1
                                                              ? "orange"
                                                              : matchingTiming.msg ===
                                                                2
                                                              ? "#48b3fb"
                                                              : matchingTiming.msg ===
                                                                3
                                                              ? "#f9544e"
                                                              : "#f9544e"
                                                            : "",
                                                      }}
                                                    ></td>
                                                  );
                                                }
                                              )}
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </ModalBody>
                              </Modal>
                              <Modal
                                isOpen={isNestedModalOpen}
                                toggle={this.toggleNestedModal}
                              >
                                <ModalHeader toggle={this.toggleNestedModal}>
                                  {isEdit
                                    ? t(
                                        `Edit ${
                                          selectedOption === "Section"
                                            ? "Section"
                                            : "Lab"
                                        }`
                                      )
                                    : selectedOption === "Section"
                                    ? t("Add Section")
                                    : selectedOption === "Lab"
                                    ? t("Add Lab")
                                    : t("Add Form")}
                                </ModalHeader>
                                <ModalBody>
                                  <div>
                                    <div>
                                      <Label>
                                        <Input
                                          type="radio"
                                          id="Section"
                                          name="radioOption"
                                          value="Section"
                                          checked={selectedOption === "Section"}
                                          onChange={this.handleChangeOption}
                                          disabled={
                                            isEdit && isSectionRadioDisabled
                                          }
                                        />
                                        {"  "} {t("Section")}
                                      </Label>

                                      <Label>
                                        <Input
                                          type="radio"
                                          id="Lab"
                                          name="radioOption"
                                          value="Lab"
                                          checked={selectedOption === "Lab"}
                                          onChange={this.handleChangeOption}
                                          disabled={
                                            isEdit && isLabRadioDisabled
                                          }
                                        />
                                        {"  "} {t("Lab")}
                                      </Label>
                                    </div>

                                    <div>
                                      {selectedOption === "Section" && (
                                        <Formik
                                          enableReinitialize={true}
                                          validate={values => {
                                            const errors = {};

                                            if (
                                              values.Instructorid &&
                                              !instructors.some(
                                                instructor =>
                                                  instructor.fullName ===
                                                  values.Instructorid
                                              )
                                            ) {
                                              errors.Instructorid =
                                                "Please select a valid instructor.";
                                            }

                                            if (
                                              values.hallId &&
                                              !halls.some(
                                                hall =>
                                                  hall.value === values.hallId
                                              )
                                            ) {
                                              errors.hallId =
                                                "Please select a valid hall.";
                                            }
                                            if (
                                              values.facultyId &&
                                              !faculties.some(
                                                faculty =>
                                                  faculty.label ===
                                                  values.facultyId
                                              )
                                            ) {
                                              errors.facultyId =
                                                "Please select a valid faculty.";
                                            }

                                            return errors;
                                          }}
                                          initialValues={{
                                            SectionNumber:
                                              (sectionLabData &&
                                                sectionLabData.SectionLabNumber) ||
                                              "",
                                            Instructorid:
                                              (sectionLabData &&
                                                sectionLabData.instructorName) ||
                                              "",
                                            hallId:
                                              (sectionLabData &&
                                                sectionLabData.hallName) ||
                                              "",

                                            Capacity:
                                              (sectionLabData &&
                                                sectionLabData.Capacity) ||
                                              "",
                                            facultyId:
                                              (sectionLabData &&
                                                sectionLabData.facultyName) ||
                                              "",
                                            majorId:
                                              (sectionLabData &&
                                                sectionLabData.majorName) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            SectionNumber:
                                              Yup.string().required(
                                                "Please Enter Your Section Number"
                                              ),
                                          })}
                                          onSubmit={values => {}}
                                        >
                                          {({
                                            errors,
                                            status,
                                            touched,
                                            values,
                                            handleChange,
                                          }) => (
                                            <>
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
                                                      onClick={
                                                        this.handleAlertClose
                                                      }
                                                    ></button>
                                                  </Alert>
                                                )}
                                              </div>
                                              <Form className="needs-validation">
                                                <div className="bordered">
                                                  <h5
                                                    className="header pt-2"
                                                    id="title"
                                                  >
                                                    {this.props.t(
                                                      "Basic Information"
                                                    )}
                                                  </h5>
                                                  <Row>
                                                    <Col md="6">
                                                      <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom01">
                                                          {t("Section Number")}
                                                        </Label>
                                                        <span className="text-danger">
                                                          *
                                                        </span>
                                                        <Field
                                                          name="SectionNumber"
                                                          placeholder="Section Number"
                                                          type="number"
                                                          className={
                                                            "form-control" +
                                                            (errors.SectionNumber &&
                                                            touched.SectionNumber
                                                              ? " is-invalid"
                                                              : "")
                                                          }
                                                          autoComplete="Off"
                                                        />
                                                        <ErrorMessage
                                                          name="SectionNumber"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </FormGroup>
                                                    </Col>
                                                    <Col md="6">
                                                      <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom05">
                                                          {t(
                                                            "Section Capacity"
                                                          )}
                                                        </Label>
                                                        <Field
                                                          name="Capacity"
                                                          placeholder="Section Capacity"
                                                          type="number"
                                                          className={
                                                            "form-control" +
                                                            (errors.Capacity &&
                                                            touched.Capacity
                                                              ? " is-invalid"
                                                              : "")
                                                          }
                                                          autoComplete="Off"
                                                        />
                                                      </FormGroup>
                                                    </Col>
                                                  </Row>

                                                  <Row>
                                                    <Col md="6">
                                                      <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom03">
                                                          {t("Room")}
                                                        </Label>
                                                        <Field
                                                          name="hallId"
                                                          type="text"
                                                          placeholder="Search..."
                                                          className={
                                                            "form-control" +
                                                            (errors.hallId &&
                                                            touched.hallId
                                                              ? " is-invalid"
                                                              : "")
                                                          }
                                                          value={
                                                            this.state
                                                              .defaultHallName
                                                          }
                                                          onChange={e => {
                                                            handleChange(e);
                                                            const newValue =
                                                              e.target.value;
                                                            const defaultValue =
                                                              (sectionLabData &&
                                                                sectionLabData.hallName) ||
                                                              "";

                                                            this.onChangeHall(
                                                              defaultValue,
                                                              newValue
                                                            );
                                                          }}
                                                          list="hallIdList"
                                                          autoComplete="Off"
                                                        />
                                                        <datalist id="hallIdList">
                                                          {" "}
                                                          {halls.map(hall => (
                                                            <option
                                                              key={hall.key}
                                                              value={hall.value}
                                                            />
                                                          ))}
                                                        </datalist>
                                                        <ErrorMessage
                                                          name="hallId"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </FormGroup>
                                                    </Col>
                                                    <Col md="6">
                                                      <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom02">
                                                          {t("Instructor")}
                                                        </Label>
                                                        <Field
                                                          name="Instructorid"
                                                          placeholder="Search..."
                                                          type="text"
                                                          className={
                                                            "form-control" +
                                                            (errors.Instructorid &&
                                                            touched.Instructorid
                                                              ? " is-invalid"
                                                              : "")
                                                          }
                                                          autoComplete="Off"
                                                          list="instructorList"
                                                        />
                                                        <datalist id="instructorList">
                                                          {instructors.map(
                                                            instructor => (
                                                              <option
                                                                key={
                                                                  instructor.Id
                                                                }
                                                                value={
                                                                  instructor.fullName
                                                                }
                                                              />
                                                            )
                                                          )}
                                                        </datalist>
                                                        <ErrorMessage
                                                          name="Instructorid"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </FormGroup>
                                                    </Col>
                                                  </Row>
                                                </div>
                                                <div className="bordered">
                                                  <h5
                                                    className="header pt-2"
                                                    id="title"
                                                  >
                                                    {this.props.t(
                                                      "Specific Students"
                                                    )}
                                                  </h5>
                                                  <Row>
                                                    <Col md="12">
                                                      <FormGroup className="mb-3 mt-3">
                                                        <Row>
                                                          <Col md="2">
                                                            <Label htmlFor="facultyId">
                                                              {t("Faculty")}:
                                                            </Label>
                                                          </Col>
                                                          <Col>
                                                            <Field
                                                              name="facultyId"
                                                              placeholder="facultyId"
                                                              type="text"
                                                              className={
                                                                "form-control" +
                                                                (errors.facultyId &&
                                                                touched.facultyId
                                                                  ? " is-invalid"
                                                                  : "")
                                                              }
                                                              autoComplete="Off"
                                                              list="facultyList"
                                                              onBlur={e => {
                                                                const selectedFacultyName =
                                                                  e.target
                                                                    .value;

                                                                let selectedFaculty =
                                                                  faculties.find(
                                                                    faculty =>
                                                                      faculty.label ===
                                                                      selectedFacultyName
                                                                  );
                                                                if (
                                                                  selectedFaculty
                                                                ) {
                                                                  let selectedFacultyId =
                                                                    selectedFaculty.value;

                                                                  onGetFilteredAcademicCertificates(
                                                                    selectedFacultyId
                                                                  );
                                                                }
                                                              }}
                                                            />
                                                            <datalist id="facultyList">
                                                              {" "}
                                                              {faculties.map(
                                                                faculty => (
                                                                  <option
                                                                    key={
                                                                      faculty.value
                                                                    }
                                                                    value={
                                                                      faculty.label
                                                                    }
                                                                  />
                                                                )
                                                              )}
                                                            </datalist>
                                                            <ErrorMessage
                                                              name="facultyId"
                                                              component="div"
                                                              className="invalid-feedback"
                                                            />
                                                          </Col>
                                                        </Row>
                                                      </FormGroup>
                                                    </Col>
                                                  </Row>

                                                  <Row>
                                                    <Col md="12">
                                                      <FormGroup className="mb-3 mt-3">
                                                        <Row>
                                                          <Col md="2">
                                                            <Label htmlFor="validationCustom02">
                                                              {t("Major")}:
                                                            </Label>
                                                          </Col>
                                                          <Col>
                                                            <Field
                                                              name="majorId"
                                                              placeholder="Search..."
                                                              type="text"
                                                              className={
                                                                "form-control" +
                                                                (errors.majorId &&
                                                                touched.majorId
                                                                  ? " is-invalid"
                                                                  : "")
                                                              }
                                                              autoComplete="Off"
                                                              list="departmentList"
                                                            />
                                                            <datalist id="departmentList">
                                                              {" "}
                                                              {filteredAcademicCertificates.map(
                                                                department => (
                                                                  <option
                                                                    key={
                                                                      department.value
                                                                    }
                                                                    value={
                                                                      department.label
                                                                    }
                                                                  />
                                                                )
                                                              )}
                                                            </datalist>
                                                          </Col>
                                                        </Row>
                                                      </FormGroup>
                                                    </Col>
                                                  </Row>
                                                </div>
                                                <Row className="justify-content-center">
                                                  <Col
                                                    lg="3"
                                                    className="d-flex justify-content-center"
                                                  >
                                                    <Link
                                                      to="#"
                                                      className="btn btn-primary me-2"
                                                      onClick={() => {
                                                        this.handleSave(values);
                                                      }}
                                                    >
                                                      {t("Save")}
                                                    </Link>
                                                  </Col>
                                                </Row>
                                              </Form>
                                            </>
                                          )}
                                        </Formik>
                                      )}

                                      {selectedOption === "Lab" && (
                                        <Formik
                                          enableReinitialize={true}
                                          validate={values => {
                                            const errors = {};
                                            if (
                                              values.Instructorid &&
                                              !instructors.some(
                                                instructor =>
                                                  instructor.fullName ===
                                                  values.Instructorid
                                              )
                                            ) {
                                              errors.Instructorid =
                                                "Please select a valid instructor.";
                                            }
                                            if (
                                              values.hallId &&
                                              !halls.some(
                                                hall =>
                                                  hall.value === values.hallId
                                              )
                                            ) {
                                              errors.hallId =
                                                "Please select a valid hallId.";
                                            }
                                            if (
                                              values.facultyId &&
                                              !faculties.some(
                                                faculty =>
                                                  faculty.label ===
                                                  values.facultyId
                                              )
                                            ) {
                                              errors.facultyId =
                                                "Please select a valid faculty.";
                                            }

                                            return errors;
                                          }}
                                          initialValues={{
                                            LabNumber:
                                              (sectionLabData &&
                                                sectionLabData.SectionLabNumber) ||
                                              "",
                                            Instructorid:
                                              (sectionLabData &&
                                                sectionLabData.instructorName) ||
                                              "",
                                            hallId:
                                              (sectionLabData &&
                                                sectionLabData.hallName) ||
                                              "",

                                            Capacity:
                                              (sectionLabData &&
                                                sectionLabData.Capacity) ||
                                              "",
                                            facultyId:
                                              (sectionLabData &&
                                                sectionLabData.facultyName) ||
                                              "",
                                            majorId:
                                              (sectionLabData &&
                                                sectionLabData.majorName) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            SectionNumber:
                                              Yup.string().required(
                                                "Please Enter Your Section Number"
                                              ),
                                          })}
                                          onSubmit={values => {}}
                                        >
                                          {({
                                            errors,
                                            status,
                                            touched,
                                            values,
                                            handleChange,
                                          }) => (
                                            <>
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
                                                    onClick={
                                                      this.handleAlertClose
                                                    }
                                                  ></button>
                                                </Alert>
                                              )}
                                              <Form className="needs-validation">
                                                <div className="bordered">
                                                  <h5
                                                    className="header pt-2"
                                                    id="title"
                                                  >
                                                    {this.props.t(
                                                      "Basic Information"
                                                    )}
                                                  </h5>
                                                  <Row>
                                                    <Col md="6">
                                                      <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom01">
                                                          {t("Lab Number")}
                                                        </Label>
                                                        <span className="text-danger">
                                                          *
                                                        </span>
                                                        <Field
                                                          name="LabNumber"
                                                          placeholder="Lab Number"
                                                          type="number"
                                                          className={
                                                            "form-control" +
                                                            (errors.LabNumber &&
                                                            touched.LabNumber
                                                              ? " is-invalid"
                                                              : "")
                                                          }
                                                          autoComplete="Off"
                                                        />
                                                        <ErrorMessage
                                                          name="LabNumber"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </FormGroup>
                                                    </Col>
                                                    <Col md="6">
                                                      <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom05">
                                                          {t("Lab Capacity")}
                                                        </Label>
                                                        <Field
                                                          name="Capacity"
                                                          placeholder="Lab Capacity"
                                                          type="number"
                                                          className={
                                                            "form-control" +
                                                            (errors.Capacity &&
                                                            touched.Capacity
                                                              ? " is-invalid"
                                                              : "")
                                                          }
                                                          autoComplete="Off"
                                                        />
                                                      </FormGroup>
                                                    </Col>
                                                  </Row>

                                                  <Row>
                                                    <Col md="6">
                                                      <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom03">
                                                          {t("Room")}
                                                        </Label>
                                                        <Field
                                                          name="hallId"
                                                          type="text"
                                                          placeholder="Search..."
                                                          className={
                                                            "form-control" +
                                                            (errors.hallId &&
                                                            touched.hallId
                                                              ? " is-invalid"
                                                              : "")
                                                          }
                                                          list="hallIdList"
                                                          autoComplete="Off"
                                                          value={
                                                            this.state
                                                              .defaultHallName
                                                          }
                                                          onChange={e => {
                                                            handleChange(e);
                                                            const newValue =
                                                              e.target.value;
                                                            const defaultValue =
                                                              (sectionLabData &&
                                                                sectionLabData.hallName) ||
                                                              "";

                                                            this.onChangeHall(
                                                              defaultValue,
                                                              newValue
                                                            );
                                                          }}
                                                        />
                                                        <datalist id="hallIdList">
                                                          {" "}
                                                          {halls.map(hall => (
                                                            <option
                                                              key={hall.key}
                                                              value={hall.value}
                                                            />
                                                          ))}
                                                        </datalist>
                                                        <ErrorMessage
                                                          name="hallId"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </FormGroup>
                                                    </Col>
                                                    <Col md="6">
                                                      <FormGroup className="mb-3">
                                                        <Label htmlFor="validationCustom02">
                                                          {t("Instructor")}
                                                        </Label>
                                                        <Field
                                                          name="Instructorid"
                                                          placeholder="Search..."
                                                          type="text"
                                                          className={
                                                            "form-control" +
                                                            (errors.Instructorid &&
                                                            touched.Instructorid
                                                              ? " is-invalid"
                                                              : "")
                                                          }
                                                          autoComplete="Off"
                                                          list="instructorList"
                                                        />
                                                        <datalist id="instructorList">
                                                          {instructors.map(
                                                            instructor => (
                                                              <option
                                                                key={
                                                                  instructor.Id
                                                                }
                                                                value={
                                                                  instructor.fullName
                                                                }
                                                              />
                                                            )
                                                          )}
                                                        </datalist>
                                                        <ErrorMessage
                                                          name="Instructorid"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </FormGroup>
                                                    </Col>
                                                  </Row>
                                                </div>
                                                <div className="bordered">
                                                  <h5
                                                    className="header pt-2"
                                                    id="title"
                                                  >
                                                    {this.props.t(
                                                      "Specific Students"
                                                    )}
                                                  </h5>
                                                  <Row>
                                                    <Col md="12">
                                                      <FormGroup className="mb-3 mt-3">
                                                        <Row>
                                                          <Col md="2">
                                                            <Label htmlFor="facultyId">
                                                              {t("Faculty")}:
                                                            </Label>
                                                          </Col>
                                                          <Col>
                                                            <Field
                                                              name="facultyId"
                                                              placeholder="facultyId"
                                                              type="text"
                                                              className={
                                                                "form-control" +
                                                                (errors.facultyId &&
                                                                touched.facultyId
                                                                  ? " is-invalid"
                                                                  : "")
                                                              }
                                                              autoComplete="Off"
                                                              list="facultyList"
                                                              onBlur={e =>
                                                                this.handleFacultyBlur(
                                                                  e
                                                                )
                                                              }
                                                            />
                                                            <datalist id="facultyList">
                                                              {" "}
                                                              {faculties.map(
                                                                faculty => (
                                                                  <option
                                                                    key={
                                                                      faculty.value
                                                                    }
                                                                    value={
                                                                      faculty.label
                                                                    }
                                                                  />
                                                                )
                                                              )}
                                                            </datalist>
                                                            <ErrorMessage
                                                              name="facultyId"
                                                              component="div"
                                                              className="invalid-feedback"
                                                            />
                                                          </Col>
                                                        </Row>
                                                      </FormGroup>
                                                    </Col>
                                                  </Row>

                                                  <Row>
                                                    <Col md="12">
                                                      <FormGroup className="mb-3 mt-3">
                                                        <Row>
                                                          <Col md="2">
                                                            <Label htmlFor="validationCustom02">
                                                              {t("Major")}:
                                                            </Label>
                                                          </Col>
                                                          <Col>
                                                            <Field
                                                              name="majorId"
                                                              placeholder="Search..."
                                                              type="text"
                                                              className={
                                                                "form-control" +
                                                                (errors.majorId &&
                                                                touched.majorId
                                                                  ? " is-invalid"
                                                                  : "")
                                                              }
                                                              autoComplete="Off"
                                                              list="departmentList"
                                                            />
                                                            <datalist id="departmentList">
                                                              {" "}
                                                              {filteredAcademicCertificates !=
                                                                [] &&
                                                                filteredAcademicCertificates.map(
                                                                  department => (
                                                                    <option
                                                                      key={
                                                                        department.value
                                                                      }
                                                                      value={
                                                                        department.label
                                                                      }
                                                                    />
                                                                  )
                                                                )}
                                                            </datalist>
                                                          </Col>
                                                        </Row>
                                                      </FormGroup>
                                                    </Col>
                                                  </Row>
                                                </div>
                                                <Row className="justify-content-center">
                                                  <Col
                                                    lg="3"
                                                    className="d-flex justify-content-center"
                                                  >
                                                    <Link
                                                      className="btn btn-primary me-2"
                                                      to="#"
                                                      onClick={() => {
                                                        this.handleSave(values);
                                                      }}
                                                    >
                                                      {t("Save")}
                                                    </Link>
                                                  </Col>
                                                </Row>
                                              </Form>
                                            </>
                                          )}
                                        </Formik>
                                      )}
                                    </div>
                                  </div>
                                </ModalBody>
                              </Modal>
                            </ModalBody>
                          </Modal>
                          <DeleteModal
                            show={deleteModal}
                            onDeleteClick={this.handleDeleteSectionLab}
                            onCloseClick={() =>
                              this.setState({
                                deleteModal: false,
                              })
                            }
                          />
                          <PaginationProvider
                            pagination={paginationFactory(pageOptions2)}
                            keyField="id"
                            columns={columns2}
                            data={offeringLectures}
                          >
                            {({ paginationProps, paginationTableProps }) => (
                              <ToolkitProvider
                                keyField="id"
                                columns={columns2}
                                data={offeringLectures}
                                search
                              >
                                {toolkitprops => (
                                  <React.Fragment>
                                    <Row className="mb-2">
                                      <Col sm="3">
                                        <div className="search-box ms-2 mb-2 d-inline-block">
                                        {showSearchButton && (
                                          <div className="position-relative">
                                            <SearchBar
                                              {...toolkitprops.searchProps}
                                            />
                                            <i className="bx bx-search-alt search-icon" />
                                          </div>)}
                                        </div>
                                      </Col>
                                      <Col>
                                        <label className="cu-Semes form-label mt-1">
                                          {selectedSchedule &&
                                            selectedSchedule["label"]}{" "}
                                        </label>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <BootstrapTable
                                        {...toolkitprops.baseProps}
                                        {...paginationTableProps}
                                        keyField="Id"
                                        data={offeringLectures}
                                        columns={columns2}
                                        cellEdit={cellEditFactory({
                                          mode: "click",
                                          blurToSave: true,
                                        })}
                                        noDataIndication={t(
                                          "No Scheduling Lectures"
                                        )}
                                      />
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
                        </TabPane>
                      </TabContent>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({
  schedulingLectures,
  halls,
  mobAppFacultyAccs,
  departments,
  weekDays,
  lecturePeriods,
  semesters,
  academiccertificates,
  generalManagements,
  menu_items
}) => {
  return {
    schedulingLectures: schedulingLectures.schedulingLectures,
    offeringLectures: schedulingLectures.offeringLectures,
    halls: halls.halls,
    instructors: schedulingLectures.instructors,
    sectionLabs: schedulingLectures.sectionLabs,
    scheduleTimings: schedulingLectures.scheduleTimings,
    faculties: mobAppFacultyAccs.faculties,
    departments: departments.departments,
    weekDays: weekDays.weekDays,
    lecturePeriods: lecturePeriods.lecturePeriods,
    scheduleTimingDescs: schedulingLectures.scheduleTimingDescs,
    currentSemester: semesters.currentSemester,
    filteredAcademicCertificates:
      academiccertificates.filteredAcademicCertificates,
    yearSemesters: generalManagements.yearSemesters,
    returnMessage: schedulingLectures.returnMessage,
    hallTimings: schedulingLectures.hallTimings,
    user_menu: menu_items.user_menu || [],
  };
};

const mapDispatchToProps = dispatch => ({
  onGetSchedulingLectures: yearSemesterId =>
    dispatch(getSchedulingLectures(yearSemesterId)),
  onGetAllSchedulingLectures: yearSemesterId =>
    dispatch(getAllSchedulingLectures(yearSemesterId)),
  onAddNewSchedulingLecture: schedulingLecture =>
    dispatch(addNewSchedulingLecture(schedulingLecture)),
  onUpdateSchedulingLecture: schedulingLecture =>
    dispatch(updateSchedulingLecture(schedulingLecture)),
  onDeleteSchedulingLecture: schedulingLecture =>
    dispatch(deleteSchedulingLecture(schedulingLecture)),
  onGetSectionLabs: Course => dispatch(getSectionLabs(Course)),
  onAddNewSectionLab: sectionLab => dispatch(addNewSectionLab(sectionLab)),
  onUpdateSectionLab: sectionLab => dispatch(updateSectionLab(sectionLab)),
  onDeleteSectionLab: sectionLab => dispatch(deleteSectionLab(sectionLab)),
  onGetFilteredAcademicCertificates: academicCer =>
    dispatch(getFilteredAcademicCertificates(academicCer)),
  onGetScheduleTimings: SectLab => dispatch(getScheduleTimings(SectLab)),
  onDeleteScheduleTiming: scheduleTiming =>
    dispatch(deleteScheduleTiming(scheduleTiming)),
  onAddNewScheduleTiming: scheduleTiming =>
    dispatch(addNewScheduleTiming(scheduleTiming)),
  onGetScheduleTimingDescs: LabSect =>
    dispatch(getScheduleTimingDescs(LabSect)),
  onfetchSetting: () => dispatch(fetchYearsSemesters()),
  onfetchDefaultSettings: () => dispatch(fetchDefaultSettings()),
  onGetScheduleMsgValue: () => dispatch(getScheduleMsgValue()),
  onGetHallTimings: SectLab => dispatch(getHallTimings(SectLab)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(SchedulingLecture));
