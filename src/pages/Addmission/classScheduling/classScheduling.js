import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { returnMessage } from "common/data";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import * as Yup from "yup";
import Select from "react-select";
import * as moment from "moment";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Modal,
  ModalHeader,
  FormGroup,
  ModalBody,
  Label,
  Alert,
  Input,
} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";
import {
  getCoursesOffering,
  getMethodsOfOfferingCourses,
  getAllCoursesOffering,
  addNewCourseOffering,
  updateCourseOffering,
  getSectionLabs,
  addNewSectionLab,
  addNewSectionLabDetail,
  updateSectionLab,
  deleteSectionLab,
  updateSectionLabDetail,
  deleteSectionLabDetail,
  getScheduleTimings,
  deleteScheduleTiming,
  addNewScheduleTiming,
  getScheduleTimingDescs,
  fetchDefaultSettings,
  getScheduleMsgValue,
  getHallTimings,
  getSectionLabDetails,
} from "store/classScheduling/actions";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import { isEmpty, size, map } from "lodash";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
import { sectionLabs } from "common/data/sectionLabs";
class ClassSchedulingList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coursesOffering: [],
      sectionLabs: [],
      sectionLabData: [],
      sectionLabDetails: [],
      years: [],
      halls: [],
      instructorsArray: [],
      methodsOffering: [],
      courseOffering: "",
      activeTab1: "5",
      activeTab2: "5",
      selectConId: null,
      showAlert: null,
      selectedCourse: null,
      selectedMethodOffering: "",
      selectedYear: null,
      selectedInstructor: null,
      selectedHall: null,
      selectedCourseId: "",
      selectedEndDate: "",
      selectedStartDate: "",
      ifUpdateCourse: 0,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      selectedRows: [],
      selectedRow: null,
      deleteModal: false,
      deleteModal1: false,
      duplicateError: null,
      startDateError: null,
      endDateError: null,
      selectedRowId: null,
      selectedRowSectionLab: null,
      isNestedModalOpen: false,
      isHallModalOpen: false,
      selectedOption: "",
      isSectionRadioDisabled: false,
      isLabRadioDisabled: false,
      selectedCells: new Set(),
      isDragging: false,
      modal: false,
      isEdit: false,
      isEdit1: false,
      isAdd: false,
      isOpen: false,
      isModalOpen: false,
      modal3: false,
      selectedRowData: null,
      selectedHallKey: null,
      defaultHallName: "",
      errorMessage: null,
      successMessage: null,
      values: "",
      oldHallId: null,
      newHallId: null,
      defaultHallName: null,
      matchingHallModal: null,
      matchingTimings: [],
      matchingError: null,
      checkedRows: {},
      currentYearObj: {},
      isPlusButtonEnabled: false,
      languageState: "",
      showAddWarning: false,
      isScheduleEditable: false,
      selectedScheduleRow: null,
    };
    this.toggle1 = this.toggle1.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggle2 = this.toggle2.bind(this);
    this.toggle3 = this.toggle3.bind(this);
  }
  toggle1(tab) {
    console.log(
      "000000000000000000111111111111111111111",
      this.props.coursesOffering
    );
    const { onGetCoursesOffering } = this.props;
    const { ifUpdateCourse, selectedYear } = this.state;
    if (this.state.activeTab1 !== tab) {
      this.setState({
        activeTab1: tab,
      });
    }
    if (ifUpdateCourse != 0) {
      onGetCoursesOffering();
      this.setState({ ifUpdateCourse: 0 });
    }

    document.getElementById("square-switch1").checked = false;
  }

  componentDidMount() {
    const lang = localStorage.getItem("I18N_LANGUAGE");
    const {
      i18n,
      coursesOffering,
      returnMessage,
      sectionLabs,
      onGetCoursesOffering,
      halls,
      sectionLabDetails,
      faculties,
      filteredAcademicCertificates,
      weekDays,
      lecturePeriods,
      employeesNames,
      onGetMethodsOfOfferingCourses,
      methodsOffering,
      allCoursesOffering,
      deleted,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    onGetCoursesOffering(lang);
    onGetMethodsOfOfferingCourses();
    this.setState({
      coursesOffering,
      allCoursesOffering,
      methodsOffering,
      deleted,
      sectionLabs,
      halls,
      faculties,
      filteredAcademicCertificates,
      weekDays,
      lecturePeriods,
      languageState: lang,
      employeesNames,
      returnMessage,
      sectionLabDetails,
    });
    i18n.on("languageChanged", this.handleLanguageChange);

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

    console.log(this.state.currentYearObj, "gggg");
  }

  handleLanguageChange = lng => {
    const { onGetCoursesOffering } = this.props;
    const lang = localStorage.getItem("I18N_LANGUAGE");

    if (lang != lng) {
      onGetCoursesOffering(lng);
      this.setState({ languageState: lng });
    }
  };
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
    }
    if (
      prevProps.coursesOffering !== this.props.coursesOffering &&
      Array.isArray(this.props.coursesOffering) &&
      this.props.coursesOffering.length > 0
    ) {
      this.setState({
        selectedCourseId: this.props.coursesOffering[0].courseId,
      });
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

  toggleDeleteModal1 = () => {
    this.setState(prevState => ({
      deleteModal1: !prevState.deleteModal1,
    }));
  };

  toggle = () => {
    this.setState(prevState => ({
      isModalOpen: !prevState.isModalOpen,
    }));
  };

  toggle3 = () => {
    const { selectedRowSectionLab, selectedScheduleRow } = this.state;

    if (!selectedRowSectionLab) {
      this.setState({ showAddWarning: true });
      return;
    }
    this.setState(prevState => ({
      modal3: !prevState.modal3,
      showAddWarning: false,
    }));
    this.setState({
      sectionLabDetails: {},
    });
  };

  handleCourseOfferingClick = row => {
    console.log("branch", row);
    this.setState({
      courseOffering: "",
      selectedCourseId: row.courseId,
      isOpen: true,
    });
    this.toggle();
  };

  handleViewAll = isChecked => {
    const { onGetAllCoursesOffering, onGetCoursesOffering } = this.props;
    console.log("sssssssssssss", isChecked);
    this.setState({ showAll: isChecked }, () => {
      if (isChecked) {
        onGetAllCoursesOffering();
      } else {
        console.log("noooooooooooo", isChecked);
        onGetCoursesOffering();
      }
    });
  };

  handleCheckboxAddOfferedCourseOrDelete = (row, currentStatus, fieldName) => {
    const { onAddNewCourseOffering } = this.props;
    const { selectedYear } = this.state;
    const newStatus = currentStatus ? 1 : 0;
    let ob = {};
    ob["Id"] = row.Id;
    ob[fieldName] = newStatus;
    if (fieldName === "isOffered" && newStatus === 0) {
      const { onDeleteCourseOffering } = this.props;
      let onDelete = { Id: row.Id };
      onDeleteCourseOffering(onDelete);
    } else if (fieldName === "isOffered" && newStatus === 1) {
      const newRow = {
        Id: row.Id,
        courseId: row.courseId,
        courseCode: row.courseCode,
        isOffered: 1,
        yearId: selectedYear["value"],
        queryname: "co_courseOffering",
      };

      onAddNewCourseOffering(newRow);
    }
  };

  handleSelectChange = (fieldName, selectedValue) => {
    if (fieldName === "methodOfferingId") {
      this.setState({ selectedMethodOffering: selectedValue });
    }
  };
  handleSelect = e => {
    const selectedValue = e.target.value;

    const selected = this.props.halls.find(
      hall => hall.value === selectedValue
    );

    console.log("selectedValue", selectedValue);
    console.log("selected hall object:", selected);

    this.setState({
      defaultHallName: selectedValue,
      selectedHallKey: selected ? selected.key : null,
    });
  };

  toggle2() {
    const {
      sectionLabData,
      onGetScheduleTimingDescs,
      onGetSectionLabDetails,
      onGetScheduleTimings,
      onGetHallTimings,
    } = this.props;
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
    this.setState({ selectedRowSectionLab: null });
    onGetScheduleTimings(0);
    onGetSectionLabDetails(0);
    // onGetScheduleTimingDescs(0);
    // onGetHallTimings(0);
    this.setState({ selectedRow: null, selectedType: "" });
  }
  toggleNestedModal = () => {
    const { isEdit, selectedOption } = this.state;
    if (selectedOption === "Section") {
      if (isEdit) {
        this.setState({
          sectionLabData: {
            Capacity: "",
            SectionNumber: "",
          },
          isEdit: false,
          selectedOption: "",
        });
      }
    } else {
      if (isEdit) {
        this.setState({
          sectionLabData: {
            Capacity: "",
            LabNumber: "",
          },
          isEdit: false,
          selectedOption: "",
        });
      }
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
    const { onGetScheduleTimings, onGetScheduleTimingDescs, onGetHallTimings } =
      this.props;
    this.setState({
      selectedOption: event.target.value,
    });
  };

  hasMatchingTimings = (hallTimings1, hallTimings2) => {
    console.log("hallTimings1", hallTimings1, hallTimings2);

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

  onClickDelete1 = sectionLabDetails => {
    this.setState({ sectionLabDetails: sectionLabDetails });
    this.setState({ deleteModal1: true });
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
        LabNumber: "",
      },
      isEdit: false,
    });
  };

  handleDeleteSectionLabDetails = () => {
    const { onDeleteSectionLabDetail } = this.props;
    // const { selectedScheduleRow } = this.state;
    const { sectionLabDetails } = this.state;
    //
    // console.log("selectedScheduleRowselectedScheduleRow", selectedScheduleRow);
    if (sectionLabDetails && sectionLabDetails.Id !== undefined) {
      let onDelete = { Id: sectionLabDetails.Id };
      onDeleteSectionLabDetail(onDelete);
    }
    this.setState({
      sectionLabDetails: {},
      deleteModal1: false,
      showAlert: true,
      isEdit1: false,
    });
  };

  handleEditSectionLab = SLD => {
    console.log("ssssssssld", SLD);
    this.setState({
      // defaultHallName: SLD.hallName,
      isEdit: true,
      sectionLabData: {
        Id: SLD.Id,
        Capacity: SLD.Capacity,
        SectionLabNumber: SLD.SectionLabNumber,
        startDate: SLD.startDate,
        endDate: SLD.endDate,
        type: SLD.type,
      },
      selectedOption: SLD.type,
      isSectionRadioDisabled: SLD.type === "Lab",
      isLabRadioDisabled: SLD.type === "Section",
    });

    this.toggleNestedModal();
  };

  handleEditScheduleTiming = SLD => {
    console.log("ssssssssld", SLD);
    this.setState({
      // defaultHallName: SLD.hallName,
      isEdit1: true,
      sectionLabDetails: SLD,
      Id: SLD.Id,
      instructorsArray: SLD.instructorsId,
      selectedHallKey: SLD.hallId,
      defaultHallName: SLD.hallName,
    });

    this.toggle3();
  };

  handleEditBranch = branchData => {
    const { selectedRowData, languageState } = this.state;
    const { onGetSectionLabs } = this.props;
    // Yara
    this.setState({
      selectedRowData: branchData,
      modal: !this.state.modal,
    });
    console.log(languageState, "fff222");

    let newdata = {
      branchData,
      languageState,
    };
    console.log(newdata, "ssssssss");

    onGetSectionLabs(newdata);
  };

  handleViewHallSchedule = SLD => {
    console.log("SLD", SLD);
    const { onGetHallTimings } = this.props;

    const findingHallId = SLD.hallId;
    if (!findingHallId) {
      console.error("❌ Missing hallId in SLD");
      return;
    }

    const OB = {
      hallId: findingHallId,
      check: 0,
    };

    onGetHallTimings(OB);
    this.toggleHallModal();
  };

  handleAlertClose = alertName => {
    this.setState({ [alertName]: null });
  };

  handleAlertMatching = () => {
    this.setState({ matchingError: null });
  };

  handleScheduleTiming = sectionLabData => {
    //Yara

    console.log("11111111111ddddddddddd111", sectionLabData);
    const { selectedRowSectionLab } = this.state;
    const { onGetSectionLabDetails } = this.props;

    this.setState({
      selectedRowSectionLab: sectionLabData,      
      isPlusButtonEnabled: true,
      isScheduleEditable: false,
    });
    // Yara
    onGetSectionLabDetails(sectionLabData);
    this.setState({
      selectedRow: sectionLabData.Id,
      selectedType: sectionLabData.type,
    });
  };

  handleMouseDown = (cellIndex, lectureId, weekdayId) => {
    const {
      onAddNewScheduleTiming,
      onDeleteScheduleTiming,
      scheduleTimings,
      onGetScheduleMsgValue,
    //  onGetSectionLabDetails,
      onGetScheduleTimings,
      // onGetScheduleTimingDescs,
    } = this.props;
    const { selectedScheduleRow, selectedRowSectionLab } = this.state;
    console.log("selectedScheduleRow", selectedScheduleRow);
    // onGetScheduleMsgValue();
    this.setState({
      isDragging: true,
    });
    const scheduledTiming = scheduleTimings.find(
      timing =>
        timing.teachingScheduleId === selectedScheduleRow?.Id &&
        timing.dayId === weekdayId &&
        timing.lecturePeriodId === lectureId
    );
    console.log("✅ scheduledTiming:", scheduledTiming);

    if (
      scheduledTiming
      // && !returnMessage.msg
    ) {
      console.log("scheduledTiming", scheduledTiming);

      onDeleteScheduleTiming(scheduledTiming);
      onGetScheduleTimings(selectedScheduleRow);
      // onGetScheduleTimingDescs(selectedScheduleRow);
    } else {
      const ob = {};
       ob["type"] = selectedRowSectionLab.type;
       ob["sectionLabId"] = selectedRowSectionLab.Id;
      ob["teachingScheduleId"] = selectedScheduleRow.Id;
      ob["dayId"] = weekdayId;
      ob["lecturePeriodId"] = lectureId;
  
      console.log(
        "thhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhe obeeeeeeeeeeee",
        this.state.selectedRowSectionLab
      );
      //Yara
      onAddNewScheduleTiming(ob);
         // this.handleScheduleTiming(this.state.selectedRowSectionLab);
     // onGetSectionLabDetails(this.state.selectedRowSectionLab);
    }
  };

  handleMouseEnter = (cellIndex, lectureId, weekdayId) => {
    const {
      onAddNewScheduleTiming,
      onDeleteScheduleTiming,
      onGetScheduleTimings,
      onGetScheduleTimingDescs,
      onGetSectionLabDetails,
      scheduleTimings,
    } = this.props;
    const { selectedRowSectionLab, selectedScheduleRow } = this.state;
    this.setState({
      isDragging: true,
    });

    const scheduledTiming = scheduleTimings.find(
      timing =>
        timing.teachingScheduleId === selectedScheduleRow?.Id &&
        timing.dayId === weekdayId &&
        timing.lecturePeriodId === lectureId
    );
    if (scheduledTiming) {
      onDeleteScheduleTiming(scheduledTiming);
      onGetScheduleTimings(selectedScheduleRow);
      // onGetScheduleTimingDescs(selectedScheduleRow);
    } else {
      const ob = {};
      ob["teachingScheduleId"] = selectedScheduleRow.Id;
      ob["dayId"] = weekdayId;
      ob["lecturePeriodId"] = lectureId;
      console.log("thhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhe ob", ob);

      onAddNewScheduleTiming(ob);
      onGetSectionLabDetails(this.state.selectedRowSectionLab);
    }
  };

  handleMouseUp = () => {
    this.setState({
      isDragging: false,
    });
  };

  handleSelectYear = (name, value) => {
    document.getElementById("square-switch1").checked = false;
    const { onGetCoursesOffering } = this.props;
    this.setState({
      selectedYear: value,
      currentYearObj: {
        currentYearId: value.value,
        currentYearName: value.label,
      },
    });
    onGetCoursesOffering();
  };

  onChangeHall(oldValue, newValue) {
    const { halls, hallTimings } = this.props;
    this.setState({ defaultHallName: newValue });
    if (halls.some(hall => hall.hallName === newValue)) {
      const oldHallId = halls.find(hall => hall.hallName === oldValue).key;
      const newHallId = halls.find(hall => hall.hallName === newValue).key;
      if (oldHallId != newHallId) {
        const oldHallTimings = hallTimings.filter(
          timing => timing.hallId === oldHallId
        );
        const newHallTimings = hallTimings.filter(
          timing => timing.hallId === newHallId
        );
        const isMatching = this.hasMatchingTimings(
          oldHallTimings,
          newHallTimings
        );
        if (isMatching == true) {
          const matchingTimings = this.joinMatchingTimings(
            oldHallTimings,
            newHallTimings
          );
          this.setState({ defaultHallName: oldValue, matchingTimings });
          this.setState({
            matchingError: `${oldValue} and ${newValue} Intersect Together`,
          });
          this.toggleMatchingModal();
        }
      }
    }
  }

  handleSave = values => {
    const {
      selectedMethodOffering,
      selectedYear,
      selectedOption,
      selectedCourseId,
      selectedEndDate,
      selectedStartDate,
      courseOffering,
    } = this.state;
    const { onAddNewCourseOffering } = this.props;

    values["yearId"] = selectedYear["value"];
    values["courseId"] = selectedCourseId;
    values["methodOfferingId"] = selectedMethodOffering["value"];

    let courseOfferingInfo = {};
    if (values.startDate && values.endDate && selectedMethodOffering !== null) {
      Object.keys(values).forEach(function (key) {
        if (
          values[key] != undefined &&
          (values[key].length > 0 || values[key] != "")
        )
          console.log("9999999", courseOfferingInfo);
        courseOfferingInfo[key] = values[key];
      });

      onAddNewCourseOffering(courseOfferingInfo);

      this.setState({
        errorMessages: {},
      });
      this.toggle();
    } else {
      if (selectedMethodOffering === undefined) {
        this.setState({ methodOfferingError: true, saveError: true });
      }
      if (selectedEndDate === undefined) {
        this.setState({ endDateError: true, saveError: true });
      }
      if (selectedStartDate === undefined) {
        this.setState({ startDateError: true, saveError: true });
      }
      const emptyError = this.props.t("Fill the Required Fields");

      this.setState({ emptyError: emptyError });
    }
  };

  handleSubmit = values => {
    console.log("values", values);
    let flag = 0;
    const { selectedRowData, selectedOption, isEdit, sectionLabData } =
      this.state;

    const { onAddNewSectionLab, onUpdateSectionLab, sectionLabs } = this.props;

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

    console.log("sectionInfo", sectionInfo);
    const fieldErrors = {};

    if (selectedOption === "Section") {
      if (
        !sectionInfo.SectionNumber ||
        (typeof sectionInfo.SectionNumber === "string" &&
          sectionInfo.SectionNumber.trim() === "")
      ) {
        fieldErrors.SectionNumber = "Please enter Section Number.";
      }
    }
    if (selectedOption === "Lab") {
      if (
        !sectionInfo.LabNumber ||
        (typeof sectionInfo.LabNumber === "string" &&
          sectionInfo.LabNumber.trim() === "")
      ) {
        fieldErrors.LabNumber = "Please enter Lab Number.";
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
      return;
    }

    sectionInfo["CourseId"] = selectedRowData.courseId;
    sectionInfo["courseOfferingId"] = selectedRowData.Id;
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
          onUpdateSectionLab(sectionInfo);
          this.setState({ selectedOption: "" });

          this.toggleNestedModal();
        } else {
          const errorMessage = this.props.t(
            `${selectedOption} Number already exists.`
          );
          this.setState({ duplicateError: errorMessage });
          return;
        }
      } else {
        console.log("saaaaave", sectionInfo);
        onAddNewSectionLab(sectionInfo);
        this.setState({ selectedOption: "" });

        this.toggleNestedModal();
      }
    }
  };

  handleSaveScheduleTiming = values => {
    console.log("values", values);
    let flag = 0;
    const {
      selectedOption,
      isEdit1,
      selectedRowSectionLab,
      selectedHall,
      instructorsArray,
      selectedHallKey,
      selectedInstructor,
      oldHallId,
      newHallId,
    } = this.state;

    const { onAddNewSectionLabDetail, onUpdateSectionLabDetail } = this.props;
    //output instructorsId: "{25},{23}"
    // const formattedInstructors = instructorsArray
    //   ?.map(item => item.value)
    //   .filter(val => val != null)
    //   .map(val => `{${val}}`)
    //   .join(",");

    //numbers
    // const formattedInstructors = instructorsArray
    //   ?.map(item => item.value)
    //   .filter(val => val != null)
    //   .join(",");

    //array
    //values["instructorsId"] = instructorsArray.map(item => item.value);

    //instructorsId: "{23},{2}"
    // const instructorsId =
    //   instructorsArray?.map(item => item?.value).filter(val => val != null) ||
    //   [];
    // const formattedInstructors = instructorsId.map(Id => `{${Id}}`).join(",");
    // console.log("✅ instructorsId to send:", formattedInstructors);

    //obj label+value
    const formattedInstructors =
      instructorsArray?.map(item => ({
        label: item.label,
        value: item.value,
      })) || [];

    // values["instructorsId"] = Array.isArray(instructorsArray)
    //   ? instructorsArray.map(item => item.value)
    //   : [];

    //instructorsId: Array(2)0: {value: 23}1: {value: 25}
    // const formattedInstructors =
    //   instructorsArray?.map(item => ({
    //     value: item.value,
    //   })) || [];

    values["type"] = selectedRowSectionLab.type;
    values["sectionLabId"] = selectedRowSectionLab.Id;
    values["hallId"] = this.state.selectedHallKey;
    values["instructorsId"] = formattedInstructors;

    let scheduleTimingInfo = {};

    Object.keys(values).forEach(function (key) {
      if (
        values[key] != undefined &&
        values[key] !== null &&
        (values[key].length > 0 || values[key] != "")
      )
        scheduleTimingInfo[key] = values[key];
    });
    scheduleTimingInfo.hallId = this.state.selectedHallKey;

    console.log("scheduleTimingInfo", scheduleTimingInfo);
    const fieldErrors = {};
    // if (
    //   scheduleTimingInfo.instructorsId &&
    //   scheduleTimingInfo.instructorsId.length > 0
    // ) {
    //   const invalidInstructors = scheduleTimingInfo.instructorsId.filter(
    //     id => !instructors.some(ins => ins.value === id)
    //   );
    //   if (invalidInstructors.length > 0) {
    //     fieldErrors.instructorsId = "Please select valid instructor(s).";
    //   }
    // }

    // if (
    //   scheduleTimingInfo.hallId === null ||
    //   scheduleTimingInfo.hallId === undefined
    // ) {
    //   fieldErrors.hallId = "Hall is required.";
    // } else {
    //   const hallExists = halls.some(
    //     hall => hall.value === scheduleTimingInfo.hallId
    //   );
    //   if (!hallExists) {
    //     fieldErrors.hallId = "Please select a valid hall.";
    //   }
    // }

    if (Object.keys(fieldErrors).length > 0) {
      return fieldErrors;
    }
    // const selectedHallObj = halls.find(hall => hall.value === selectedHall);
    // if (selectedHallObj) {
    //   scheduleTimingInfo.hallId = selectedHallObj.key;
    // } else {
    //   scheduleTimingInfo.hallId = null;
    // }

    // if (
    //   scheduleTimingInfo.instructorsId &&
    //   scheduleTimingInfo.instructorsId.length > 0
    // ) {
    //   scheduleTimingInfo.instructorsId = scheduleTimingInfo.instructorsId
    //     .map(id => {
    //       const instructorObj = instructors.find(ins => ins.value === id);
    //       return instructorObj ? instructorObj.Id : null;
    //     })
    //     .filter(id => id !== null);
    // } else {
    //   scheduleTimingInfo.instructorsId = [];
    // }

    // scheduleTimingInfo["type"] = selectedRowSectionLab.type;
    // scheduleTimingInfo["sectionLabId"] = selectedRowSectionLab.Id;
    if (isEdit1) {
      onUpdateSectionLabDetail(scheduleTimingInfo);
      this.toggle3();
    } else {
      console.log("saaaaave", scheduleTimingInfo);
      onAddNewSectionLabDetail(scheduleTimingInfo);
      this.toggle3();
    }
  };

  handleMultiInstructors = (fieldName, selectedMulti) => {
    // if (fieldName === "instructorsId") {
    //   const selectedIds = selectedMulti
    //     ? selectedMulti.map(option => option.value)
    //     : [];

    //   this.setState({
    //     instructorsArray: selectedMulti,
    //     instructorsId: selectedIds,
    //   });
    // }

    // this.setState({
    //   instructorsArray: selectedMulti,
    // });

    if (fieldName === "instructorsId") {
      this.setState({
        instructorsArray: selectedMulti || [],
      });
    }
  };
  handleAddRow = () => {
    this.setState({
      sectionLabDetails: "",
      selectedHallKey: null,
      defaultHallName: "",
      isEdit1: false,
    });
    this.toggle3();
  };
  handleValidDate = date => {
    if (
      !date ||
      date === "1970-01-01" ||
      date === "0000-00-00" ||
      moment(date).year() === 1970
    ) {
      return "";
    }
    return moment(date).format("DD-MM-YYYY");
  };

  handleClickOn = row => {
    console.log("roooooooooooooooooow", row);
    const { onGetScheduleTimings, onGetScheduleTimingDescs } = this.props;
    this.setState({
      selectedScheduleRow: row,
      selectedRow: row.Id,
      isScheduleEditable: true,
    });
    onGetScheduleTimings(row);
    // onGetScheduleTimingDescs(row);
  };

  render() {
    const { courseOffering } = this.state;
    const {
      coursesOffering,
      sectionLabs,
      sectionLabDetails,
      halls,
      years,
      instructorsArray,
      weekDays,
      lecturePeriods,
      scheduleTimings,
      scheduleTimingDescs,
      t,
      deleted,
      methodsOffering,
      employeesNames,
      hallTimings,
    } = this.props;
    const {
      duplicateError,
      deleteModal,
      deleteModal1,
      modal,
      isOpen,
      emptyError,
      startDateError,
      endDateError,
      isModalOpen,
      modal3,
      selectedRowData,
      isNestedModalOpen,
      isHallModalOpen,
      selectedOption,
      isEdit,
      isEdit1,
      isAdd,
      sectionLabData,
      isLabRadioDisabled,
      isSectionRadioDisabled,
      selectedRowSectionLab,
      matchingHallModal,
      matchingTimings,
      matchingError,
      showAlert,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
      selectedCourse,
      selectedMethodOffering,
      selectedEndDate,
      selectedStartDate,
      selectedYear,
      languageState,
      showAddWarning,
      isScheduleEditable,
    } = this.state;
    console.log(
      "sectionlab scheduletiming",
      sectionLabDetails,
      scheduleTimings,
      scheduleTimingDescs
    );
    console.log(isScheduleEditable, "we needddddddd");
    const selectRow = {
      mode: "checkbox",
      clickToSelect: false,
      selected: coursesOffering
        .filter(row => Number(row.isOffered) === 1)
        .map(row => row.Id),
      selectionRenderer: ({ checked }) => (
        <input
          type="checkbox"
          checked={checked}
          disabled={true}
          className="form-check-input custom-check"
          readOnly
          onChange={() => {}}
        />
      ),
    };

    const { SearchBar } = Search;
    const defaultSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];
    const columns = [
      { dataField: "Id", text: t("ID"), hidden: true },
      {
        dataField: languageState === "ar" ? "arTitle" : "enTitle",
        text:
          languageState === "ar"
            ? this.props.t("Course Name (ar)")
            : this.props.t("Course Name (en)"),
        editable: false,
        sort: true,
      },
      {
        dataField: "Code",
        text: this.props.t("Course Code"),
        editable: false,
        sort: true,
      },
      {
        dataField: "sectorName",
        text: this.props.t("Training Sector"),
        sort: true,
        editable: false,
      },
      {
        dataField: "trainingFormat",
        text: this.props.t("Training Format"),
        editable: false,
        sort: true,
      },
      {
        dataField: "program",
        text: this.props.t("Training Program"),
        sort: true,
        editable: false,
      },
      {
        dataField: "methodOfferingName",
        text: this.props.t("Method Of Offering"),
        sort: true,
        editable: false,
      },
      {
        dataField: "startDate",
        text: this.props.t("Start Date"),
        sort: true,
        editable: false,
        formatter: (cellContent, row) => this.handleValidDate(row.startDate),
      },
      {
        dataField: "endDate",
        text: this.props.t("End Date"),
        sort: true,
        editable: false,

        formatter: (cellContent, row) => this.handleValidDate(row.endDate),
      },
      {
        dataField: "menu",
        text: "",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, row) => {
          if (row.isOffered === 1) return null;
          return (
            <div className="d-flex gap-3">
              <Tooltip placement="top" title={this.props.t("Add Method")}>
                <Link className="text-sm-end" to="#">
                  <i
                    color="primary"
                    onClick={() => this.handleCourseOfferingClick(row)}
                    className="mdi mdi-plus-circle blue-noti-icon"
                  ></i>
                </Link>
              </Tooltip>
            </div>
          );
        },
      },
      {
        key: "isOffered",
        dataField: "isOffered",
        text: t("isOffered"),
        editable: false,
        hidden: true,
        formatter: (cellContent, row, column) => (
          <Input
            type="checkbox"
            name="isOffered"
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
    ];
    const columns2 = [
      { dataField: "Id", text: t("ID"), hidden: true },
      {
        dataField: languageState === "ar" ? "arTitle" : "enTitle",
        text:
          languageState === "ar"
            ? this.props.t("Course Name (ar)")
            : this.props.t("Course Name (en)"),
        editable: false,
        sort: true,
      },
      {
        dataField: "Code",
        text: this.props.t("Course Code"),
        editable: false,
        sort: true,
      },
      {
        dataField: "totalTrainingHours",
        text: this.props.t("Number of Hours"),
        editable: false,
        sort: true,
      },
      {
        dataField: "program",
        text: this.props.t("Training Program"),
        editable: false,
        sort: true,
      },
      {
        dataField: "sectionsTotal ",
        text: this.props.t("Number of Sections"),
        editable: false,
        sort: true,
      },
      {
        dataField: "labsTotal ",
        text: this.props.t("Number of Labs"),
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
        dataField: "Capacity",
        text: t("Capacity"),
        editable: false,
        sort: true,
      },
      {
        dataField: "NumOfRegStud",
        text: t("Number Of Registered Students"),
        editable: false,
        sort: true,
      },
      {
        dataField: "startDate",
        text: t("Start Date"),
        editable: false,
        sort: true,
        formatter: (cellContent, row) => this.handleValidDate(row.startDate),
      },
      {
        dataField: "endDate",
        text: t("End Date"),
        editable: false,
        sort: true,
        formatter: (cellContent, row) => this.handleValidDate(row.endDate),
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
            <Tooltip title={t("Edit Section/Lab")} placement="top">
              <Link className="text-secondary" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={() => this.handleEditSectionLab(sectionLabData)}
                ></i>
              </Link>
            </Tooltip>
            <Tooltip title={t("Delete Section/Lab")} placement="top">
              <Link className="text-danger m-0" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(sectionLabData)}
                ></i>
              </Link>
            </Tooltip>
          </div>
        ),
      },
    ];
    const rowEvents = {
      onClick: (e, row) => {
        this.handleClickOn(row);
      },
    };

    const ScheduleTimingDescsCol = [
      {
        dataField: "periodTime",
        text: t("Period Time"),
        editable: false,
        sort: true,
        formatter: (cellContent, row) => {
          if (cellContent) {
            return cellContent
              .split(",")
              .map((item, index) => <div key={index}>{item.trim()}</div>);
          }
          return null;
        },
      },
      {
        dataField: "instructorNames",
        text: t("Instructor"),
        editable: false,
        sort: true,
      },

      {
        dataField: "hallName",
        text: t("Room"),
        editable: false,
        sort: true,
      },
      {
        dataField: "menu",
        isDummyField: true,
        editable: false,
        text: this.props.t("Action"),
        formatter: (cellContent, sectionLabDetails) => (
          <div className="d-flex gap-3">
            {/* <Tooltip title={t("View Hall Timing")} placement="top">
            <Link className="" to="#">
              <i
                className="mdi mdi-google-classroom font-size-18"
                id="edittooltip"
                onClick={() => this.handleViewHallSchedule(sectionLabDetails)}
              ></i>
            </Link>
          </Tooltip> */}
            <Tooltip title={t("Edit Schedule Timing")} placement="top">
              <Link className="text-secondary" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={() =>
                    this.handleEditScheduleTiming(sectionLabDetails)
                  }
                ></i>
              </Link>
            </Tooltip>
            <Tooltip title={t("Delete Schedule Timing")} placement="top">
              <Link className="text-danger m-0" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete1(sectionLabDetails)}
                ></i>
              </Link>
            </Tooltip>
          </div>
        ),
      },
    ];
    const weekDaysColumns = weekDays.map(weekday =>
      this.props.t(weekday.enTitle)
    );
    const pageOptions = {
      sizePerPage: 20,
      totalSize: coursesOffering.length,
      custom: true,
    };
    const pageOptions2 = {
      sizePerPage: 20,
      totalSize: sectionLabs.length,
      custom: true,
    };
    return (
      <React.Fragment>
        <div className="page-content">
          <div className="container-fluid">
            <Breadcrumbs breadcrumbItem={this.props.t("Class Scheduling")} />
            <div className="checkout-tabs">
              <Row>
                <Card>
                  <CardBody>
                    <CardTitle className="h4"></CardTitle>
                    <Row>
                      <Col md="2">
                        <Nav pills className="flex-column" id="margTop">
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
                              {this.props.t("Course Offering")}
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
                              {this.props.t("Section&Labs")}
                            </NavLink>
                          </NavItem>
                        </Nav>
                      </Col>
                      <Col md="10">
                        <TabContent
                          activeTab={this.state.activeTab1}
                          className="p-3 text-muted"
                          id="verticalTabContent"
                        >
                          <TabPane tabId="5">
                            <PaginationProvider
                              pagination={paginationFactory(pageOptions)}
                              keyField="Id"
                              columns={columns}
                              data={coursesOffering}
                            >
                              {({ paginationProps, paginationTableProps }) => (
                                <ToolkitProvider
                                  keyField="Id"
                                  data={coursesOffering}
                                  columns={columns}
                                  search
                                >
                                  {toolkitprops => (
                                    <React.Fragment>
                                      <Row className="mb-2">
                                        <Col lg="4">
                                          <div className="search-box ms-2 mb-2 d-inline-block">
                                            <div className="position-relative">
                                              <SearchBar
                                                {...toolkitprops.searchProps}
                                                placeholder={t("Search...")}
                                              />
                                              <i className="bx bx-search-alt search-icon" />
                                            </div>
                                          </div>
                                        </Col>
                                        <Col lg="3">
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
                                        <Col sm="1">
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
                                        </Col>
                                      </Row>
                                      <Row>
                                        <BootstrapTable
                                          {...toolkitprops.baseProps}
                                          {...paginationTableProps}
                                          keyField="Id"
                                          data={coursesOffering}
                                          selectRow={selectRow}
                                          defaultSorted={defaultSorting}
                                          sectionLabs={
                                            "table align-middle table-nowrap table-hover"
                                          }
                                          columns={columns.map(col => {
                                            if (col.dataField === "select") {
                                              return {
                                                ...col,
                                                formatExtraData: {
                                                  ...col.formatExtraData,
                                                  pageRows:
                                                    paginationTableProps.data ||
                                                    [],
                                                },
                                              };
                                            }
                                            return col;
                                          })}
                                          cellEdit={cellEditFactory({
                                            mode: "click",
                                            blurToSave: true,
                                          })}
                                          noDataIndication={t(
                                            "No Courses Offering"
                                          )}
                                        />
                                      </Row>
                                      <Row className="align-items-md-center mt-30">
                                        <Col className="pagination pagination-rounded justify-content-end mb-2">
                                          <PaginationListStandalone
                                            {...paginationProps}
                                          />
                                          <Modal
                                            isOpen={isModalOpen}
                                            toggle={this.toggle}
                                            size="4"
                                          >
                                            <ModalHeader
                                              toggle={this.toggle}
                                              tag="h4"
                                            >
                                              {!!isOpen ? t("") : ""}
                                            </ModalHeader>
                                            <ModalBody>
                                              <Formik
                                                enableReinitialize={true}
                                                initialValues={{
                                                  ...(isOpen &&
                                                    courseOffering && {
                                                      Id: courseOffering.Id,
                                                    }),
                                                  methodOfferingId:
                                                    (courseOffering &&
                                                      courseOffering.methodOfferingId) ||
                                                    selectedMethodOffering,
                                                  startDate:
                                                    (courseOffering &&
                                                      courseOffering.startDate) ||
                                                    selectedStartDate,
                                                  endDate:
                                                    (courseOffering &&
                                                      courseOffering.endDate) ||
                                                    selectedEndDate,
                                                }}
                                                validationSchema={Yup.object().shape(
                                                  {
                                                    methodOfferingId:
                                                      Yup.string().required(
                                                        "Please Enter Your Methods Offering"
                                                      ),
                                                    startDate:
                                                      Yup.date().required(
                                                        "Please Enter Your Start Date"
                                                      ),
                                                    endDate: Yup.date()
                                                      .required(
                                                        "Please Enter Your End Date"
                                                      )
                                                      .min(
                                                        Yup.ref("startDate"),
                                                        "End date must be after start date"
                                                      ),
                                                  }
                                                )}
                                              >
                                                {({
                                                  errors,
                                                  status,
                                                  touched,
                                                  values,
                                                  handleChange,
                                                  handleBlur,
                                                  setFieldValue,
                                                }) => (
                                                  <Form>
                                                    <Card id="employee-card">
                                                      <CardTitle id="course_header">
                                                        {t("Course Offering")}
                                                      </CardTitle>
                                                      <CardBody className="cardBody">
                                                        {emptyError && (
                                                          <Alert
                                                            color="danger"
                                                            className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                            role="alert"
                                                          >
                                                            {emptyError}
                                                            <button
                                                              type="button"
                                                              className="btn-close"
                                                              aria-label="Close"
                                                              onClick={() =>
                                                                this.handleAlertClose(
                                                                  "emptyError"
                                                                )
                                                              }
                                                            ></button>
                                                          </Alert>
                                                        )}
                                                        <Row>
                                                          <Col lg="12">
                                                            <Row className="mb-3">
                                                              <Col md={5}>
                                                                <Label className="form-label">
                                                                  {this.props.t(
                                                                    "Method Offering"
                                                                  )}
                                                                </Label>
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </Col>
                                                              <Col md={7}>
                                                                <Select
                                                                  className="select-style-method"
                                                                  name="methodOfferingId"
                                                                  key={`methodOfferingId`}
                                                                  options={
                                                                    methodsOffering
                                                                  }
                                                                  onChange={newValue => {
                                                                    this.handleSelectChange(
                                                                      "methodOfferingId",
                                                                      newValue
                                                                    );
                                                                  }}
                                                                  value={
                                                                    selectedMethodOffering
                                                                  }
                                                                />
                                                              </Col>
                                                            </Row>

                                                            <div className="mb-3">
                                                              <Row>
                                                                <Col className="col-4">
                                                                  <Label for="startDate">
                                                                    {this.props.t(
                                                                      "Start Date"
                                                                    )}
                                                                  </Label>
                                                                  <span className="text-danger">
                                                                    *
                                                                  </span>
                                                                </Col>
                                                                <Col className="col-8">
                                                                  <Field
                                                                    name="startDate"
                                                                    className={`form-control ${
                                                                      startDateError
                                                                        ? "is-invalid"
                                                                        : ""
                                                                    }`}
                                                                    type="date"
                                                                    value={
                                                                      values.startDate
                                                                        ? new Date(
                                                                            values.startDate
                                                                          )
                                                                            .toISOString()
                                                                            .split(
                                                                              "T"
                                                                            )[0]
                                                                        : ""
                                                                    }
                                                                    onChange={
                                                                      handleChange
                                                                    }
                                                                    onBlur={
                                                                      handleBlur
                                                                    }
                                                                    id="startDate-date-input"
                                                                  />
                                                                  {startDateError && (
                                                                    <div className="invalid-feedback">
                                                                      {this.props.t(
                                                                        "Offering Date is required"
                                                                      )}
                                                                    </div>
                                                                  )}
                                                                </Col>
                                                              </Row>
                                                            </div>
                                                            <div className="mb-3">
                                                              <Row>
                                                                <Col className="col-4">
                                                                  <Label for="endDate">
                                                                    {this.props.t(
                                                                      "End Date"
                                                                    )}
                                                                  </Label>
                                                                  <span className="text-danger">
                                                                    *
                                                                  </span>
                                                                </Col>
                                                                <Col className="col-8">
                                                                  <Field
                                                                    name="endDate"
                                                                    className={`form-control ${
                                                                      endDateError
                                                                        ? "is-invalid"
                                                                        : ""
                                                                    }`}
                                                                    type="date"
                                                                    value={
                                                                      values.endDate
                                                                        ? new Date(
                                                                            values.endDate
                                                                          )
                                                                            .toISOString()
                                                                            .split(
                                                                              "T"
                                                                            )[0]
                                                                        : ""
                                                                    }
                                                                    onChange={
                                                                      handleChange
                                                                    }
                                                                    onBlur={
                                                                      handleBlur
                                                                    }
                                                                    id="endDate-date-input"
                                                                  />
                                                                  {endDateError && (
                                                                    <div className="invalid-feedback">
                                                                      {this.props.t(
                                                                        "Offering Date is required"
                                                                      )}
                                                                    </div>
                                                                  )}
                                                                </Col>
                                                              </Row>
                                                            </div>
                                                          </Col>
                                                        </Row>
                                                        <Row>
                                                          <Col>
                                                            <div className="text-center">
                                                              <Link
                                                                to="#"
                                                                className="btn btn-primary me-2"
                                                                onClick={() => {
                                                                  this.handleSave(
                                                                    values
                                                                  );
                                                                }}
                                                              >
                                                                {t("Save")}
                                                              </Link>
                                                            </div>
                                                          </Col>
                                                        </Row>
                                                      </CardBody>
                                                    </Card>
                                                  </Form>
                                                )}
                                              </Formik>
                                            </ModalBody>
                                          </Modal>
                                        </Col>
                                      </Row>
                                    </React.Fragment>
                                  )}
                                </ToolkitProvider>
                              )}
                            </PaginationProvider>
                          </TabPane>
                          <TabPane tabId="6">
                            <Modal
                              isOpen={modal}
                              toggle={this.toggle2}
                              fullscreen
                            >
                              <ModalHeader
                                toggle={this.toggle2}
                                tag="h4"
                                className="horizontalTitles"
                              ></ModalHeader>
                              <ModalBody>
                                {selectedRowData && (
                                  <div className="TitleStyle">
                                    {selectedRowData.arTitle}{" "}
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
                                                  <IconButton
                                                    className="ms-2"
                                                    onClick={
                                                      this.toggleNestedModal
                                                    }
                                                  >
                                                    {" "}
                                                    <i className="mdi mdi-plus-circle blue-noti-icon" />
                                                  </IconButton>
                                                </div>
                                              </Col>
                                            </Row>
                                          </Col>

                                          <BootstrapTable
                                            keyField="Id"
                                            data={sectionLabs}
                                            columns={sectionLabColumns}
                                            cellEdit={cellEditFactory({
                                              mode: "click",
                                              blurToSave: true,
                                            })}
                                            noDataIndication={t(
                                              "No Scheduling"
                                            )}
                                            rowStyle={(row, rowIndex) => {
                                              const type = row.type;
                                              const isSelected =
                                                row.Id ===
                                                this.state.selectedRow;

                                              let backgroundColor = "";
                                              if (type === "Section") {
                                                backgroundColor =
                                                  "rgb(192 220 245)";
                                              } else if (type === "Lab") {
                                                backgroundColor =
                                                  "rgb(152 152 235 / 30%)";
                                              }

                                              if (isSelected) {
                                                backgroundColor = "#c5ab5a";
                                              }

                                              return {
                                                backgroundColor:
                                                  backgroundColor,
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
                                                {this.props.t(
                                                  "Schedule Timing"
                                                )}
                                              </h5>
                                            </Col>
                                            {showAddWarning && (
                                              <Alert
                                                color="danger"
                                                className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                role="alert"
                                              >
                                                Please click on the Schedule
                                                Timing button before adding
                                                <button
                                                  type="button"
                                                  className="btn-close"
                                                  aria-label="Close"
                                                  onClick={() =>
                                                    this.handleAlertClose(
                                                      "showAddWarning"
                                                    )
                                                  }
                                                  style={{ outline: "none" }}
                                                ></button>
                                              </Alert>
                                            )}
                                            <Col sm="6">
                                              <div className="text-sm-end">
                                                <IconButton
                                                  className="ms-2"
                                                  onClick={this.handleAddRow}
                                                >
                                                  {" "}
                                                  <i className="mdi mdi-plus-circle blue-noti-icon" />
                                                </IconButton>
                                              </div>
                                            </Col>
                                          </Row>
                                          <BootstrapTable
                                            keyField="Id"
                                            data={sectionLabDetails}
                                            columns={ScheduleTimingDescsCol}
                                            cellEdit={cellEditFactory({
                                              mode: "click",
                                              blurToSave: true,
                                            })}
                                            noDataIndication={t(
                                              "No Scheduling Timing"
                                            )}
                                            rowEvents={rowEvents}
                                            rowStyle={(row, rowIndex) => {
                                              const { selectedRow } =
                                                this.state;
                                              const isSelected =
                                                row.Id === selectedRow;

                                              let backgroundColor =
                                                "rgb(189 199 124 / 23%)";

                                              if (isSelected) {
                                                backgroundColor = "#ffcccb";
                                              }
                                              return {
                                                backgroundColor:
                                                  backgroundColor,
                                              };
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
                                                : this.props.t(
                                                    "Schedule Timing"
                                                  )}
                                            </h5>
                                          </Col>

                                          <div className="timetable-container">
                                            <table
                                              className="timetable"
                                              onMouseUp={this.handleMouseUp}
                                            >
                                              <thead>
                                                <tr>
                                                  <th>
                                                    {t("Lecture Periods")}
                                                  </th>
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
                                                        (
                                                          weekday,
                                                          cellIndex
                                                        ) => {
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
                                                                  ? t(
                                                                      "Busy Hall"
                                                                    )
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
                                                                  pointerEvents:
                                                                    isScheduleEditable
                                                                      ? "auto"
                                                                      : "none",
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
                                                                pointerEvents:
                                                                  isScheduleEditable
                                                                    ? "auto"
                                                                    : "none",
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
                                                            : hallTiming.msg ===
                                                              2
                                                            ? t("Busy Hall")
                                                            : hallTiming.msg ===
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
                                                          matchingTiming.msg ===
                                                          1
                                                            ? t(
                                                                "Busy Hall & Instructor"
                                                              )
                                                            : matchingTiming.msg ===
                                                              2
                                                            ? t("Busy Hall")
                                                            : matchingTiming.msg ===
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
                                <DeleteModal
                                  show={deleteModal1}
                                  onDeleteClick={
                                    this.handleDeleteSectionLabDetails
                                  }
                                  onCloseClick={() =>
                                    this.setState({
                                      deleteModal1: false,
                                      selectedScheduleRow: null,
                                    })
                                  }
                                />
                                <Modal
                                  isOpen={modal3}
                                  toggle={this.toggle3}
                                  size="4"
                                >
                                  <ModalHeader
                                    toggle={this.toggle3}
                                    tag="h4"
                                    className="horizontalTitles"
                                  >
                                    {selectedRowSectionLab
                                      ? `${this.props.t(
                                          isEdit1
                                            ? "Edit Details"
                                            : "Add Details"
                                        )} - ${selectedRowSectionLab.type}${
                                          selectedRowSectionLab.SectionLabNumber
                                        } `
                                      : this.props.t("Schedule Timing")}
                                  </ModalHeader>
                                  <ModalBody>
                                    <Formik
                                      initialValues={{
                                        instructorsId:
                                          (sectionLabDetails &&
                                            sectionLabDetails.instructorName) ||
                                          "",
                                        hallId:
                                          (sectionLabDetails &&
                                            sectionLabDetails.hallName) ||
                                          "",
                                      }}
                                      enableReinitialize={true}
                                      validationSchema={Yup.object().shape({
                                        methodOfferingId: Yup.string().required(
                                          "Please Enter Your Methods Offering"
                                        ),
                                        startDate: Yup.date().required(
                                          "Please Enter Your Start Date"
                                        ),
                                        endDate: Yup.date()
                                          .required(
                                            "Please Enter Your End Date"
                                          )
                                          .min(
                                            Yup.ref("startDate"),
                                            "End date must be after start date"
                                          ),
                                      })}
                                    >
                                      {({
                                        errors,
                                        status,
                                        touched,
                                        values,
                                        handleChange,
                                        handleBlur,
                                        setFieldValue,
                                      }) => (
                                        <Form>
                                          <Col md="12">
                                            <Row>
                                              <Col className="col-4 mb-3">
                                                <Label for="room">
                                                  {t("Room")}
                                                </Label>
                                                <span className="text-danger">
                                                  *
                                                </span>
                                              </Col>
                                              <Col className="col-8">
                                                <Field
                                                  name="hallId"
                                                  as="input"
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
                                                    halls.find(
                                                      h =>
                                                        h.key ===
                                                        this.state
                                                          .selectedHallKey
                                                    )?.value || ""
                                                  }
                                                  onChange={e => {
                                                    const newValue =
                                                      e.target.value;

                                                    const selectedHall =
                                                      halls.find(
                                                        h =>
                                                          h.value === newValue
                                                      );

                                                    if (selectedHall) {
                                                      this.setState({
                                                        selectedHallKey:
                                                          selectedHall.key,
                                                        defaultHallName:
                                                          selectedHall.value,
                                                      });
                                                    } else {
                                                      this.setState({
                                                        selectedHallKey: null,
                                                        defaultHallName:
                                                          newValue,
                                                      });
                                                    }
                                                    this.onChangeHall(
                                                      this.state
                                                        .defaultHallName,
                                                      newValue
                                                    );
                                                  }}
                                                  list="hallIdList"
                                                  autoComplete="off"
                                                />

                                                <datalist id="hallIdList">
                                                  {halls.map(hall => (
                                                    <option
                                                      key={hall.key}
                                                      value={hall.value}
                                                    />
                                                  ))}
                                                </datalist>
                                              </Col>
                                            </Row>
                                            <Row>
                                              <Col className="col-4 mb-3">
                                                <Label for="instructor">
                                                  {t("Instructor")}
                                                </Label>
                                                <span className="text-danger">
                                                  *
                                                </span>
                                              </Col>
                                              <Col className="col-8">
                                                <Select
                                                  classNamePrefix="select2-selection"
                                                  id="instructor"
                                                  name="instructorsId"
                                                  key={`instructorsId`}
                                                  options={employeesNames}
                                                  onChange={selectedOption =>
                                                    this.handleMultiInstructors(
                                                      "instructorsId",
                                                      selectedOption
                                                    )
                                                  }
                                                  isMulti
                                                  value={instructorsArray}
                                                />
                                                <ErrorMessage
                                                  name="instructorsId"
                                                  component="div"
                                                  className="invalid-feedback"
                                                />
                                              </Col>
                                            </Row>
                                          </Col>

                                          <Row className="justify-content-center">
                                            <Col
                                              lg="3"
                                              className="d-flex justify-content-center"
                                            >
                                              <Link
                                                to="#"
                                                className="btn btn-primary me-2"
                                                onClick={() => {
                                                  this.handleSaveScheduleTiming(
                                                    values
                                                  );
                                                }}
                                              >
                                                {t("Save")}
                                              </Link>
                                            </Col>
                                          </Row>
                                        </Form>
                                      )}
                                    </Formik>
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
                                            checked={
                                              selectedOption === "Section"
                                            }
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
                                            initialValues={{
                                              SectionNumber:
                                                (sectionLabData &&
                                                  sectionLabData.SectionLabNumber) ||
                                                "",
                                              Capacity:
                                                (sectionLabData &&
                                                  sectionLabData.Capacity) ||
                                                "",
                                              startDate:
                                                (sectionLabData &&
                                                  sectionLabData.startDate) ||
                                                "",
                                              endDate:
                                                (sectionLabData &&
                                                  sectionLabData.endDate) ||
                                                "",
                                            }}
                                            validationSchema={Yup.object().shape(
                                              {
                                                SectionNumber:
                                                  Yup.string().required(
                                                    "Please Enter Your Section Number"
                                                  ),
                                                Capacity: Yup.string().required(
                                                  "Please Enter Your Section Capacity"
                                                ),
                                                startDate: Yup.date().required(
                                                  "Please Enter Your Start Date"
                                                ),
                                                endDate: Yup.date()
                                                  .required(
                                                    "Please Enter Your End Date"
                                                  )
                                                  .min(
                                                    Yup.ref("startDate"),
                                                    "End date must be after start date"
                                                  ),
                                              }
                                            )}
                                            onSubmit={values => {}}
                                          >
                                            {({
                                              errors,
                                              status,
                                              touched,
                                              values,
                                              handleChange,
                                              handleBlur,
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
                                                        onClick={() =>
                                                          this.handleAlertClose(
                                                            "duplicateError"
                                                          )
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
                                                            {t(
                                                              "Section Number"
                                                            )}
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
                                                          <span className="text-danger">
                                                            *
                                                          </span>
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
                                                          <ErrorMessage
                                                            name="Capacity"
                                                            component="div"
                                                            className="invalid-feedback"
                                                          />
                                                        </FormGroup>
                                                      </Col>
                                                    </Row>
                                                    <Row>
                                                      <Col md="6">
                                                        <FormGroup className="mb-3">
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col>
                                                                <Label for="startDate">
                                                                  {this.props.t(
                                                                    "Start Date"
                                                                  )}
                                                                </Label>
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </Col>
                                                              <Col>
                                                                <Field
                                                                  name="startDate"
                                                                  className={
                                                                    "form-control" +
                                                                    (errors.startDate &&
                                                                    touched.startDate
                                                                      ? " is-invalid"
                                                                      : "")
                                                                  }
                                                                  type="date"
                                                                  value={
                                                                    values.startDate
                                                                      ? new Date(
                                                                          values.startDate
                                                                        )
                                                                          .toISOString()
                                                                          .split(
                                                                            "T"
                                                                          )[0]
                                                                      : ""
                                                                  }
                                                                  onChange={
                                                                    handleChange
                                                                  }
                                                                  onBlur={
                                                                    handleBlur
                                                                  }
                                                                  id="startDate-date-input"
                                                                />
                                                                <ErrorMessage
                                                                  name="startDate"
                                                                  component="div"
                                                                  className="invalid-feedback"
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                        </FormGroup>
                                                      </Col>
                                                      <Col md="6">
                                                        <FormGroup className="mb-3">
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col>
                                                                <Label for="endDate">
                                                                  {this.props.t(
                                                                    "End Date"
                                                                  )}
                                                                </Label>
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </Col>
                                                              <Col>
                                                                <Field
                                                                  name="endDate"
                                                                  className={
                                                                    "form-control" +
                                                                    (errors.endDate &&
                                                                    touched.endDate
                                                                      ? " is-invalid"
                                                                      : "")
                                                                  }
                                                                  type="date"
                                                                  value={
                                                                    values.endDate
                                                                      ? new Date(
                                                                          values.endDate
                                                                        )
                                                                          .toISOString()
                                                                          .split(
                                                                            "T"
                                                                          )[0]
                                                                      : ""
                                                                  }
                                                                  onChange={
                                                                    handleChange
                                                                  }
                                                                  onBlur={
                                                                    handleBlur
                                                                  }
                                                                  id="endDate-date-input"
                                                                />
                                                                <ErrorMessage
                                                                  name="endDate"
                                                                  component="div"
                                                                  className="invalid-feedback"
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                        </FormGroup>
                                                      </Col>
                                                    </Row>
                                                    <Row>
                                                      {/* <Col md="6">
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
                                                  </Col> */}
                                                      {/* <Col md="6">
                                                    <FormGroup className="mb-3">
                                                      <Label htmlFor="validationCustom02">
                                                        {t("Instructor")}
                                                      </Label>
                                                      <Field
                                                        name="instructorsId"
                                                        placeholder="Search..."
                                                        type="text"
                                                        className={
                                                          "form-control" +
                                                          (errors.instructorsId &&
                                                          touched.instructorsId
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
                                                        name="instructorsId"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </FormGroup>
                                                  </Col> */}
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
                                                      {/* <Col md="12">
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
                                                                e.target.value;

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
                                                  </Col> */}
                                                    </Row>

                                                    <Row>
                                                      {/* <Col md="12">
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
                                                  </Col> */}
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
                                                          this.handleSubmit(
                                                            values
                                                          );
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
                                            initialValues={{
                                              LabNumber:
                                                (sectionLabData &&
                                                  sectionLabData.SectionLabNumber) ||
                                                "",

                                              Capacity:
                                                (sectionLabData &&
                                                  sectionLabData.Capacity) ||
                                                "",
                                              startDate:
                                                (sectionLabData &&
                                                  sectionLabData.startDate) ||
                                                "",
                                              endDate:
                                                (sectionLabData &&
                                                  sectionLabData.endDate) ||
                                                "",
                                            }}
                                            validationSchema={Yup.object().shape(
                                              {
                                                LabNumber:
                                                  Yup.string().required(
                                                    "Please Enter Your Lab Number"
                                                  ),
                                                Capacity: Yup.string().required(
                                                  "Please Enter Your Lab Capacity"
                                                ),
                                                startDate: Yup.date().required(
                                                  "Please Enter Your Start Date"
                                                ),
                                                endDate: Yup.date()
                                                  .required(
                                                    "Please Enter Your End Date"
                                                  )
                                                  .min(
                                                    Yup.ref("startDate"),
                                                    "End date must be after start date"
                                                  ),
                                              }
                                            )}
                                            onSubmit={values => {}}
                                          >
                                            {({
                                              errors,
                                              status,
                                              touched,
                                              values,
                                              handleChange,
                                              handleBlur,
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
                                                      onClick={() =>
                                                        this.handleAlertClose(
                                                          "duplicateError"
                                                        )
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
                                                          <span className="text-danger">
                                                            *
                                                          </span>
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
                                                          <ErrorMessage
                                                            name="Capacity"
                                                            component="div"
                                                            className="invalid-feedback"
                                                          />
                                                        </FormGroup>
                                                      </Col>
                                                    </Row>

                                                    <Row>
                                                      <Col md="6">
                                                        <FormGroup className="mb-3">
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col>
                                                                <Label for="startDate">
                                                                  {this.props.t(
                                                                    "Start Date"
                                                                  )}
                                                                </Label>
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </Col>
                                                              <Col>
                                                                <Field
                                                                  name="startDate"
                                                                  className={
                                                                    "form-control" +
                                                                    (errors.startDate &&
                                                                    touched.startDate
                                                                      ? " is-invalid"
                                                                      : "")
                                                                  }
                                                                  type="date"
                                                                  value={
                                                                    values.startDate
                                                                      ? new Date(
                                                                          values.startDate
                                                                        )
                                                                          .toISOString()
                                                                          .split(
                                                                            "T"
                                                                          )[0]
                                                                      : ""
                                                                  }
                                                                  onChange={
                                                                    handleChange
                                                                  }
                                                                  onBlur={
                                                                    handleBlur
                                                                  }
                                                                  id="startDate-date-input"
                                                                />
                                                                <ErrorMessage
                                                                  name="startDate"
                                                                  component="div"
                                                                  className="invalid-feedback"
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                        </FormGroup>
                                                      </Col>
                                                      <Col md="6">
                                                        <FormGroup className="mb-3">
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col>
                                                                <Label for="endDate">
                                                                  {this.props.t(
                                                                    "End Date"
                                                                  )}
                                                                </Label>
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </Col>
                                                              <Col>
                                                                <Field
                                                                  name="endDate"
                                                                  className={
                                                                    "form-control" +
                                                                    (errors.endDate &&
                                                                    touched.endDate
                                                                      ? " is-invalid"
                                                                      : "")
                                                                  }
                                                                  type="date"
                                                                  value={
                                                                    values.endDate
                                                                      ? new Date(
                                                                          values.endDate
                                                                        )
                                                                          .toISOString()
                                                                          .split(
                                                                            "T"
                                                                          )[0]
                                                                      : ""
                                                                  }
                                                                  onChange={
                                                                    handleChange
                                                                  }
                                                                  onBlur={
                                                                    handleBlur
                                                                  }
                                                                  id="endDate-date-input"
                                                                />
                                                                <ErrorMessage
                                                                  name="endDate"
                                                                  component="div"
                                                                  className="invalid-feedback"
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
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
                                                      {/* <Col md="12">
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
                                                  </Col> */}
                                                    </Row>

                                                    <Row>
                                                      {/* <Col md="12">
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
                                                  </Col>*/}
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
                                                          this.handleSubmit(
                                                            values
                                                          );
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
                              data={coursesOffering}
                            >
                              {({ paginationProps, paginationTableProps }) => (
                                <ToolkitProvider
                                  keyField="id"
                                  columns={columns2}
                                  data={coursesOffering}
                                  search
                                >
                                  {toolkitprops => (
                                    <React.Fragment>
                                      <Row className="mb-2">
                                        <Col sm="3">
                                          <div className="search-box ms-2 mb-2 d-inline-block">
                                            <div className="position-relative">
                                              <SearchBar
                                                {...toolkitprops.searchProps}
                                              />
                                              <i className="bx bx-search-alt search-icon" />
                                            </div>
                                          </div>
                                        </Col>
                                        <Col>
                                          <label className="cu-Semes form-label mt-1">
                                            {selectedYear &&
                                              selectedYear["label"]}{" "}
                                          </label>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <BootstrapTable
                                          {...toolkitprops.baseProps}
                                          {...paginationTableProps}
                                          keyField="Id"
                                          data={coursesOffering}
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
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Row>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({
  classScheduling,
  years,
  employees,
  weekDays,
  lecturePeriods,
  academiccertificates,
  academyBuildingStructures,
  menu_items,
}) => ({
  coursesOffering: classScheduling.coursesOffering,
  sectionLabDetails: classScheduling.sectionLabDetails,
  sectionLabs: classScheduling.sectionLabs,
  years: years.years,
  halls: academyBuildingStructures.halls,
  scheduleTimings: classScheduling.scheduleTimings,
  weekDays: weekDays.weekDays,
  lecturePeriods: lecturePeriods.lecturePeriods,
  scheduleTimingDescs: classScheduling.scheduleTimingDescs,
  filteredAcademicCertificates:
    academiccertificates.filteredAcademicCertificates,
  returnMessage: classScheduling.returnMessage,
  hallTimings: classScheduling.hallTimings,
  methodsOffering: classScheduling.methodsOffering,
  employeesNames: employees.employeesNames,
  deleted: classScheduling.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetCoursesOffering: lng => dispatch(getCoursesOffering(lng)),
  onGetMethodsOfOfferingCourses: () => dispatch(getMethodsOfOfferingCourses()),
  onGetAllCoursesOffering: () => dispatch(getAllCoursesOffering()),
  onAddNewCourseOffering: CourseOffering =>
    dispatch(addNewCourseOffering(CourseOffering)),
  onUpdateCourseOffering: CourseOffering =>
    dispatch(updateCourseOffering(CourseOffering)),

  onGetSectionLabs: Course => dispatch(getSectionLabs(Course)),
  onAddNewSectionLab: sectionLab => dispatch(addNewSectionLab(sectionLab)),
  onUpdateSectionLab: sectionLab => dispatch(updateSectionLab(sectionLab)),
  onDeleteSectionLab: sectionLab => dispatch(deleteSectionLab(sectionLab)),

  onGetSectionLabDetails: sectionLabs =>
    dispatch(getSectionLabDetails(sectionLabs)),
  onAddNewSectionLabDetail: sectionLabDetail =>
    dispatch(addNewSectionLabDetail(sectionLabDetail)),
  onUpdateSectionLabDetail: sectionLabDetail =>
    dispatch(updateSectionLabDetail(sectionLabDetail)),
  onDeleteSectionLabDetail: sectionLabDetail =>
    dispatch(deleteSectionLabDetail(sectionLabDetail)),

  onGetScheduleTimings: SectLabDet => dispatch(getScheduleTimings(SectLabDet)),
  onDeleteScheduleTiming: scheduleTiming =>
    dispatch(deleteScheduleTiming(scheduleTiming)),
  onAddNewScheduleTiming: scheduleTiming =>
    dispatch(addNewScheduleTiming(scheduleTiming)),
  // onGetScheduleTimingDescs: SectLabDet =>
  //   dispatch(getScheduleTimingDescs(SectLabDet)),
  // onGetHallTimings: SectLab => dispatch(getHallTimings(SectLab)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(ClassSchedulingList)));
