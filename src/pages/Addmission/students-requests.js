import React, { Component } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";

import {
  Row,
  Col,
  Card,
  CardBody,
  Alert,
  Input,
  CardTitle,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  InputGroup,
} from "reactstrap";
import Accordion from "react-bootstrap/Accordion";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import Select from "react-select";
import { getUnivStdDataList } from "store/transportLines/actions";

// Editable
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";

import { getCurrentSemester } from "store/semesters/actions";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import {
  getStudentsRequests,
  addNewStudentRequest,
  updateStudentRequest,
  deleteStudentRequest,
  getPrevUnivCourse,
  addNewPrevUnivCourse,
  updatePrevUnivCourse,
  deletePrevUnivCourse,
  getTransferCourses,
  addNewTransferCourse,
  updateTransferCourse,
  updateTransferCourseState,
  deleteTransferCourse,
  getLastReqNum,
  getRequestDetails,
} from "store/students-requests/actions";
import { getUserMngs } from "store/user-mngs/actions";
import DeleteModal from "components/Common/DeleteModal";
import { isEmpty, size, map } from "lodash";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//i18n
import { withTranslation } from "react-i18next";

//import documents from "store/documents-types/reducer";
import { ConsoleLineIcon } from "@icons/material";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../utils/menuUtils";
import currentSemester from "pages/PriveledgeManagement/SystemManagement/current-semester";

class StudentsRequests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDocument: null,
      regReqDocuments: props.regReqDocuments || [],
      checkboxEditable: false,
      duplicateError: null,
      deleteModal: false,
      selectedRowId: null,
      showAlert: null,
      defaultYear: null,
      isCurrentYear: true,
      selectedSemester: 0,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      sidebarOpen: true,
      selectedRequestId: "",
      modal: false,
      editModal: false,
      courseModal: false,
      studentRequest: "",
      selectedStatus: "",
      viewOnly: false,
      isCurrentSemester: true,
      transferCoursesArray: [],
      prevUnivCoursesArray: [],
      studentRequestsArray: [],
    };
    this.handleSave = this.handleSave.bind(this);
  }

  initializeState() {
    const { currentSemester, yearSemesters, onGetStudentsRequests } =
      this.props;
    const { selectedSemester } = this.state;
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
      isCurrentSemester: true,
    });
    onGetStudentsRequests({
      yearSemesterId: currentSemester.cuYearSemesterId,
    });
  }

  componentDidMount() {
    const {
      regReqDocuments,
      user_menu,
      onGetStudentsRequests,
      documents,
      deleted,
      currentSemester,
      years,
      requests,
      decreeStatus,
      studentsRequests,
      yearSemesters,
      univStds,
      onGetUnivStds,
      prevUnivCourses,
      transferCourses,
      coursesOpt,
      academiccertificates,
      userId,
      userMngs,
      onGetUserMngs,
      lastReqNum,
      onGetRequestDetails,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    const defaultYear = years.find(
      year => year.value === currentSemester.cuYearSemesterId
    );
    if (regReqDocuments && !regReqDocuments.length) {
      let ob = {
        yearSemesterId: currentSemester.cuYearSemesterId,
        requestId: 31,
      };

      //  onGetStudentsRequests(ob)
      onGetRequestDetails() && onGetUnivStds() && onGetUserMngs();

      this.setState({ regReqDocuments, deleted });
      this.setState({
        documents,
        currentSemester,
        years,
        userId,
        userMngs,
        requests,
        decreeStatus,
        univStds,
        coursesOpt,
        academiccertificates,
        lastReqNum,
        prevUnivCoursesArray:
          prevUnivCourses != undefined && prevUnivCourses != null
            ? prevUnivCourses
            : [],
        transferCoursesArray:
          transferCourses != undefined && transferCourses != null
            ? transferCourses
            : [],
      });
      this.setState({ yearSemesters });
    }

    this.setState({ defaultYear: defaultYear, isCurrentYear: true });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { currentSemester, yearSemesters, prevUnivCourses, transferCourses } =
      this.props;
    const { selectedSemester } = this.state;
    if (
      (currentSemester &&
        currentSemester.cuYearSemesterId !==
          prevProps.currentSemester.cuYearSemesterId) ||
      yearSemesters !== prevProps.yearSemesters
    ) {
      this.initializeState();
    }

    if (prevState.prevUnivCoursesArray !== prevUnivCourses) {
      this.setState({
        prevUnivCoursesArray: prevUnivCourses,
      });
    }
    if (prevState.transferCoursesArray !== transferCourses) {
      this.setState({
        transferCoursesArray: transferCourses,
        courseNum: transferCourses.length,
      });
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

  handleUpload = (id, event) => {
    event.preventDefault();
    const fileContent = "This is a sample file for upload.";
    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const tempAnchor = document.createElement("a");
    tempAnchor.href = url;
    tempAnchor.setAttribute("upload", `upload_${id}.txt`);
    tempAnchor.click();
    window.URL.revokeObjectURL(url);
    tempAnchor.remove();
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
  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };

  handleCopyRegReqDoc = () => {
    const { onCopyRegReqDoc } = this.props;
    onCopyRegReqDoc();
  };

  handleDeleteRow = () => {
    const { onDeleteStudentRequest } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteStudentRequest(selectedRowId);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };
  handleStudentRequestDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateStudentRequest } = this.props;
    const { selectedRequestId } = this.state;
    let onUpdate = {
      Id: rowId,
      [fieldName]: fieldValue,
      requestId: selectedRequestId,
    };
    onUpdateStudentRequest(onUpdate);
  };

  handleSelectDocument = (rowId, fieldName, selectedValue) => {
    const { onUpdateStudentRequest } = this.props;
    const { regReqDocuments } = this.state;

    const isValueExists = regReqDocuments.some(
      row => row.documentTypeId === selectedValue
    );

    if (isValueExists) {
      console.error("Value already exists in the table.");
      return;
    }

    this.setState({
      selectedDocument: selectedValue,
    });

    let onUpdate = { Id: rowId, [fieldName]: selectedValue };
    onUpdateStudentRequest(onUpdate);
  };

  handleChangeCheckbox = (row, fieldName) => {
    const { onUpdateStudentRequest } = this.props;
    const newStatus = row[fieldName] ? 0 : 1;
    let ob = {
      Id: row.Id,
      [fieldName]: newStatus,
    };

    if (row.documentTypeId !== 0) {
      onUpdateStudentRequest(ob);
    }
  };

  toggleCheckboxEditMode = () => {
    this.setState(prevState => ({
      checkboxEditable: !prevState.checkboxEditable,
    }));
  };

  handleAlertClose = () => {
    this.setState({
      duplicateError: null,
      emptyPrevError: null,
      emptyTransferError: null,
      requestError: null,
      updateMessage: null,
    });
  };

  handleSuccessClose = () => {
    const { onGetStudentRequestDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetStudentRequestDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetStudentRequestDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetStudentRequestDeletedValue();
  };

  toggleSidebar = () => {
    this.setState(prevState => ({
      sidebarOpen: !prevState.sidebarOpen,
    }));
  };

  handleCheckboxClick(clickedCheckboxId, fieldName) {
    const checkboxIds = ["btncheck1"];
    checkboxIds.forEach(checkboxId => {
      if (checkboxId === clickedCheckboxId) {
        document.getElementById(checkboxId).checked = true;
      } else {
        document.getElementById(checkboxId).checked = false;
      }
    });

    if (fieldName == "numOfAppStd") {
      this.setState({
        showApplicantStd: true,
      });
    }
  }

  handleGetData = (fieldName, Id) => {
    const { onGetStudentsRequests, currentSemester } = this.props;
    const { selectedSemester, defaultYear } = this.state;
    let obj;
    if (defaultYear) {
      obj = { yearSemesterId: defaultYear.value, requestId: Id };
    } else {
      obj = { yearSemesterId: currentSemester.cuYearSemesterId, requestId: Id };
    }
    onGetStudentsRequests(obj);

    this.setState({ selectedRequestId: Id, isCurrentSemester: true });
  };

  addToggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  editToggle = () => {
    this.setState(prevState => ({
      editModal: !prevState.editModal,
    }));
  };

  viewToggle = () => {
    const { studentRequestsArray } = this.state;

    this.setState(prevState => ({
      viewOnly: !prevState.viewOnly,
    }));
    this.setState({
      studentRequestsArray: studentRequestsArray,
    });
  };

  courseToggle = () => {
    this.setState(prevState => ({
      courseModal: !prevState.courseModal,
    }));
    const { prevUnivCourses, transferCourses, decreeStatus } = this.props;
    const { transferCoursesArray, prevUnivCoursesArray } = this.state;
    let stateName = "";

    if (transferCoursesArray.length != 0) {
      const state = decreeStatus.find(
        s => s.Id === transferCoursesArray[0].stateId
      );
      if (state) {
        stateName = state.arTitle.includes("مقبول") ? "معادلة" : state.arTitle;
      }
    }

    this.setState({
      transferCoursesArray: transferCoursesArray,
      prevUnivCoursesArray: prevUnivCoursesArray,
      stateName: stateName,
    });
  };

  handleSelectSemester = (name, value) => {
    const { onGetStudentsRequests, currentSemester } = this.props;
    const { selectedRequestId, selectedStateObject } = this.state;
    this.setState({ selectedSemester: value });
    if (value) {
      let semesterId = value.value;
      let obj = {};
      if (selectedStateObject) {
        obj = {
          yearSemesterId: semesterId,
          requestId: selectedRequestId,
          stateId: selectedStateObject.value,
        };
      } else {
        obj = {
          yearSemesterId: semesterId,
          requestId: selectedRequestId,
        };
      }
      onGetStudentsRequests(obj);

      if (semesterId == currentSemester.cuYearSemesterId) {
        this.setState({ isCurrentSemester: true });
      } else {
        this.setState({ isCurrentSemester: false });
      }
    }
  };

  handleSelectState = (name, value) => {
    const { onGetStudentsRequests } = this.props;
    const { selectedRequestId, selectedSemester } = this.state;
    this.setState({ selectedStateObject: value });
    if (value) {
      const stateId = value.value;
      onGetStudentsRequests({
        yearSemesterId: selectedSemester.value,
        requestId: selectedRequestId,
        stateId: stateId,
      });
    }
  };

  handleAddStudentRequest = () => {
    const { selectedRequestId } = this.state;
    this.setState({
      studentRequest: "",
      courseContentArray: [],
      prevUnivCoursesArray: [],
      isEdit: false,
    });
    if (selectedRequestId) {
      const { onGetLastReqNum, lastReqNum } = this.props;
      onGetLastReqNum({ requestId: selectedRequestId });
      this.addToggle();
      this.setState({ generatedRequestNumber: lastReqNum });

    } else {
      const error = this.props.t("Select Request Type");
      this.setState({ requestError: error });
    }
  };

  handleSave = values => {
    const {
      onAddNewStudentRequest,
      userId,
      univStds,
      onUpdateStudentRequest,
      academiccertificates,
      currentSemester
    } = this.props;
    const {
      studentRequest,
      isEdit,
      selectedRequestId,
      studentRequestId,
      selectedStateObject,
      selectedStatus,
      generatedRequestNumber,
      selectedRequest,
    } = this.state;
    const emptyRequest = {};
    Object.keys(values).forEach(function (key) {
      if (
        values[key] != undefined &&
        (values[key].length > 0 || values[key] != "")
      )
        emptyRequest[key] = values[key];
    });

    if (isEdit == false) {
      const universityStdModified = univStds.map(student => ({
        key: student.key,
        value: `${student.value}${student.key}`,
      }));

      const studentObject = universityStdModified.find(
        student => student.value === values["studentId"]
      );

      emptyRequest["requestNum"] = generatedRequestNumber;
      emptyRequest["studentId"] = studentObject.key;
      emptyRequest["requestId"] = selectedRequestId;
      emptyRequest["requestOrganizer"] = userId;
      emptyRequest["stateId"] = 4;

      if (emptyRequest["newSpecialtyId"]) {
        const facultyObj = academiccertificates.find(
          cetificate => cetificate.value === values["newSpecialtyId"]
        );
        emptyRequest["newFacultyId"] = facultyObj.facultyId;
      }

      if (
        emptyRequest["requestNum"] &&
        emptyRequest["studentId"] &&
        emptyRequest["requestId"]
      ) {
        onAddNewStudentRequest(emptyRequest);
        this.setState(prevState => ({
          modal: !prevState.modal,
        }));
      } else {
        const error = "Fill the required fields";
        this.setState({ fieldError: error });
      }
    } else if (isEdit == true) {
      emptyRequest["Id"] = studentRequestId;
      emptyRequest["stateId"] = values["stateId"];
      if (values["decreeDate"] != "" && values["decreeDate"] != undefined) {
        emptyRequest["decreeOrganizer"] = parseInt(userId);
        emptyRequest["decreeOrgNotes"] = values["decreeOrgNotes"];
      }
      if (values["foldingDate"] != "" && values["foldingDate"] != undefined) {
        emptyRequest["foldingOrganizer"] = parseInt(userId);
        emptyRequest["foldingOrgNotes"] = values["foldingOrgNotes"];
      }

console.log("in update selectedStatus", selectedStatus)
console.log("in update emptyRequest[ stateId", emptyRequest["stateId"])
   
      const message = "Request Updated Successfully";
      this.setState({ updateMessage: message });
      if (selectedStatus != emptyRequest["stateId"]) {
        const { onUpdateTransferCourseState, transferCourses } = this.props;

        let obj = {
          studentRequestId: studentRequestId,
          stateId: emptyRequest["stateId"],
        };

        onUpdateTransferCourseState(obj);

        emptyRequest["activationSemesterId"]= currentSemester.cuYearSemesterId
      }
         onUpdateStudentRequest(emptyRequest);
    }
  };

  handleViewRequest = studentRequest => {
    const {
      univStds,
      yearSemesters,
      onGetCoursesInfo,
      userMngs,
      decreeStatus,
    } = this.props;
    const { studentRequestsArray } = this.state;
    onGetCoursesInfo({ studentRequestId: studentRequest.Id });
    this.setState({
      isEdit: false,
      viewOnly: true,
    });
    const yearsSemestersModified = yearSemesters.map(item => ({
      label: item.value,
      value: item.key,
      yearId: item.yearId,
      semesterId: item.semesterId,
    }));

    const universityStdModified = univStds.map(student => ({
      key: student.key,
      value: `${student.value}${student.key}`,
    }));

    const semesterObj = yearsSemestersModified.find(
      opt => opt.value === studentRequest.yearSemesterId
    );

    const requestOrgObj = userMngs.find(
      opt => opt.Id === studentRequest.requestOrganizer
    );
    const decreeOrgObj = userMngs.find(
      opt => opt.Id === studentRequest.decreeOrganizer
    );
    const foldingOrgObj = userMngs.find(
      opt => opt.Id === studentRequest.foldingOrganizer
    );

    const stateObj = decreeStatus.find(
      opt => opt.Id === studentRequest.stateId
    );
    let stateName = "";
    if (stateObj) {
      stateName = stateObj.arTitle.includes("مقبول")
        ? "معادلة"
        : stateObj.arTitle;
    }

    this.setState({
      viewStudentRequest: studentRequest,
      studentRequestId: studentRequest.Id,
      selectedSemester: studentRequest.yearSemesterId,
      selectedStatus: studentRequest["stateId"],
      prevUnivCoursesArray:
        studentRequest.prevUnivCourses != undefined &&
        studentRequest.prevUnivCourses != null
          ? studentRequest.prevUnivCourses
          : [],
      transferCoursesArray:
        studentRequest.transferCourses != undefined &&
        studentRequest.transferCourses != null
          ? studentRequest.transferCourses
          : [],
      studentRequestsArray:
        studentRequestsArray != undefined && studentRequestsArray != null
          ? studentRequestsArray
          : [],
      requestOrgName: requestOrgObj ? requestOrgObj.fullName : "",
      decreeOrgName: decreeOrgObj ? decreeOrgObj.fullName : "",
      foldingOrgName: foldingOrgObj ? foldingOrgObj.fullName : "",
      stateName: stateName,
      courseNum: studentRequest.transferCourses
        ? studentRequest.transferCourses.length
        : 0,
    });
  };

  handleViewStdRequest = studentRequest => {
    const {
      univStds,
      yearSemesters,
      onGetCoursesInfo,
      userMngs,
      decreeStatus,
    } = this.props;
    const { studentRequestsArray } = this.state;
    onGetCoursesInfo({ studentRequestId: studentRequest.Id });

    this.setState({
      isEdit: true,
      viewOnly: true,
    });
    const yearsSemestersModified = yearSemesters.map(item => ({
      label: item.value,
      value: item.key,
      yearId: item.yearId,
      semesterId: item.semesterId,
    }));

    const universityStdModified = univStds.map(student => ({
      key: student.key,
      value: `${student.value}${student.key}`,
    }));

    const semesterObj = yearsSemestersModified.find(
      opt => opt.value === studentRequest.yearSemesterId
    );

    const requestOrgObj = userMngs.find(
      opt => opt.Id === studentRequest.requestOrganizer
    );
    const decreeOrgObj = userMngs.find(
      opt => opt.Id === studentRequest.decreeOrganizer
    );
    const foldingOrgObj = userMngs.find(
      opt => opt.Id === studentRequest.foldingOrganizer
    );

    const stateObj = decreeStatus.find(
      opt => opt.Id === studentRequest.stateId
    );
    let stateName = "";
    if (stateObj) {
      stateName = stateObj.arTitle.includes("مقبول")
        ? "معادلة"
        : stateObj.arTitle;
    }

    this.setState({
      viewStudentRequest: studentRequest,
      studentRequestId: studentRequest.Id,
      selectedSemester: studentRequest.yearSemesterId,
      selectedStatus: studentRequest["stateId"],
      prevUnivCoursesArray:
        studentRequest.prevUnivCourses != undefined &&
        studentRequest.prevUnivCourses != null
          ? studentRequest.prevUnivCourses
          : [],
      transferCoursesArray:
        studentRequest.transferCourses != undefined &&
        studentRequest.transferCourses != null
          ? studentRequest.transferCourses
          : [],
      studentRequestsArray:
        studentRequestsArray != undefined && studentRequestsArray != null
          ? studentRequestsArray
          : [],
      requestOrgName: requestOrgObj ? requestOrgObj.fullName : "",
      decreeOrgName: decreeOrgObj ? decreeOrgObj.fullName : "",
      foldingOrgName: foldingOrgObj ? foldingOrgObj.fullName : "",
      stateName: stateName,
      courseNum: studentRequest.transferCourses
        ? studentRequest.transferCourses.length
        : 0,
    });
  };

  handleEditRequest = studentRequest => {
    const {
      univStds,
      yearSemesters,
      onGetCoursesInfo,
      userMngs,
      decreeStatus,
    } = this.props;

    console.log("studentRequest", studentRequest)

    onGetCoursesInfo({ studentRequestId: studentRequest.Id });

    this.setState({
      isEdit: true,
      viewOnly: false,
    });
    const yearsSemestersModified = yearSemesters.map(item => ({
      label: item.value,
      value: item.key,
      yearId: item.yearId,
      semesterId: item.semesterId,
    }));

    const universityStdModified = univStds.map(student => ({
      key: student.key,
      value: `${student.value}${student.key}`,
    }));

    const semesterObj = yearsSemestersModified.find(
      opt => opt.value === studentRequest.yearSemesterId
    );

    const requestOrgObj = userMngs.find(
      opt => opt.Id === studentRequest.requestOrganizer
    );
    const decreeOrgObj = userMngs.find(
      opt => opt.Id === studentRequest.decreeOrganizer
    );
    const foldingOrgObj = userMngs.find(
      opt => opt.Id === studentRequest.foldingOrganizer
    );

    const stateObj = decreeStatus.find(
      opt => opt.Id === studentRequest.stateId
    );
    let stateName = "";
    if (stateObj) {
      stateName = stateObj.arTitle.includes("مقبول")
        ? "معادلة"
        : stateObj.arTitle;
    }

    this.setState({
      studentRequest: studentRequest,
      studentRequestId: studentRequest.Id,
      selectedSemester: studentRequest.yearSemesterId,
      selectedStatus: studentRequest["stateId"],
      prevUnivCoursesArray:
        studentRequest.prevUnivCourses != undefined &&
        studentRequest.prevUnivCourses != null
          ? studentRequest.prevUnivCourses
          : [],
      transferCoursesArray:
        studentRequest.transferCourses != undefined &&
        studentRequest.transferCourses != null
          ? studentRequest.transferCourses
          : [],
      studentRequestsArray:
        studentRequest.studentRequests != undefined &&
        studentRequest.studentRequests != null
          ? studentRequest.studentRequests
          : [],
      requestOrgName: requestOrgObj ? requestOrgObj.fullName : "",
      decreeOrgName: decreeOrgObj ? decreeOrgObj.fullName : "",
      foldingOrgName: foldingOrgObj ? foldingOrgObj.fullName : "",
      stateName: stateName,
      courseNum: studentRequest.transferCourses
        ? studentRequest.transferCourses.length
        : 0,
      viewStdName: studentRequest.studentName,
    });
    this.editToggle();
  };

  handleEditStdRequest = studentRequest => {
    const {
      univStds,
      yearSemesters,
      onGetCoursesInfo,
      userMngs,
      decreeStatus,
    } = this.props;
    const { studentRequestsArray } = this.state;
    onGetCoursesInfo({ studentRequestId: studentRequest.Id });

    this.setState({
      isEdit: true,
      viewOnly: false,
    });
    const yearsSemestersModified = yearSemesters.map(item => ({
      label: item.value,
      value: item.key,
      yearId: item.yearId,
      semesterId: item.semesterId,
    }));

    const universityStdModified = univStds.map(student => ({
      key: student.key,
      value: `${student.value}${student.key}`,
    }));

    const semesterObj = yearsSemestersModified.find(
      opt => opt.value === studentRequest.yearSemesterId
    );

    const requestOrgObj = userMngs.find(
      opt => opt.Id === studentRequest.requestOrganizer
    );
    const decreeOrgObj = userMngs.find(
      opt => opt.Id === studentRequest.decreeOrganizer
    );
    const foldingOrgObj = userMngs.find(
      opt => opt.Id === studentRequest.foldingOrganizer
    );

    const stateObj = decreeStatus.find(
      opt => opt.Id === studentRequest.stateId
    );
    let stateName = "";
    if (stateObj) {
      stateName = stateObj.arTitle.includes("مقبول")
        ? "معادلة"
        : stateObj.arTitle;
    }

    this.setState({
      studentRequest: studentRequest,
      studentRequestId: studentRequest.Id,
      selectedSemester: studentRequest.yearSemesterId,
      selectedStatus: studentRequest["stateId"],
      prevUnivCoursesArray:
        studentRequest.prevUnivCourses != undefined &&
        studentRequest.prevUnivCourses != null
          ? studentRequest.prevUnivCourses
          : [],
      transferCoursesArray:
        studentRequest.transferCourses != undefined &&
        studentRequest.transferCourses != null
          ? studentRequest.transferCourses
          : [],
      studentRequestsArray:
        studentRequestsArray != undefined && studentRequestsArray != null
          ? studentRequestsArray
          : [],
      requestOrgName: requestOrgObj ? requestOrgObj.fullName : "",
      decreeOrgName: decreeOrgObj ? decreeOrgObj.fullName : "",
      foldingOrgName: foldingOrgObj ? foldingOrgObj.fullName : "",
      stateName: stateName,
      courseNum: studentRequest.transferCourses
        ? studentRequest.transferCourses.length
        : 0,
    });
  };

  handleInputBlur = fieldName => {
    const { selectedRequest, selectedCourse } = this.state;

    if (fieldName == "requestId") {
      this.setState({ selectedRequest });
    }

    if (fieldName == "courseId") {
      this.setState({ selectedCourse });
    }
  };

  handleInputFocus = fieldName => {
    const { selectedRequest, selectedCourse } = this.state;

    if (fieldName == "courseId") {
      this.setState({ selectedCourse });
    }

    if (fieldName == "requestId") {
      this.setState({ selectedRequest });
    }
  };

  handleSelectRequest = (event, fieldName) => {
    const { requests, onGetStudentsRequests } = this.props;
    const { selectedSemester, selectedStateObject } = this.state;
    const selectedValue = event.target.value;

    if (fieldName === "requestId") {
      this.setState({ selectedRequest: selectedValue, studentError: false });

      const requestObject = requests.find(
        student => student.value === event.target.value
      );

      if (requestObject) {
        let obj = {};
        if (selectedStateObject) {
          obj = {
            requestId: requestObject.key,
            yearSemesterId: selectedSemester.value,
            stateId: selectedStateObject.value,
          };
        } else {
          obj = {
            requestId: requestObject.key,
            yearSemesterId: selectedSemester.value,
          };
        }
        onGetStudentsRequests(obj);
        this.setState({
          selectedRequestId: requestObject.key,
        });
      } else {
        this.setState({ selectedRequestId: undefined });
      }
    }
  };

  handleSelectCourse = (event, rowId, fieldName) => {
    const { coursesOpt, onUpdateTransferCourse } = this.props;
    const { selectedCourse, selectedStateObject } = this.state;
    const selectedValue = event.target.value;

    if (fieldName === "courseId") {
      this.setState({ selectedCourse: selectedValue, courseError: false });

      const coursesModified = coursesOpt.map(course => ({
        key: course.code,
        value: `${course.arCourseName}${course.code}`,
        Id: course.Id,
      }));

      const courseObject = coursesModified.find(
        course => course.value === event.target.value
      );

      if (courseObject) {
        let obj = {
          Id: rowId,
          courseId: courseObject.Id,
          courseGrade: 60,
        };
        onUpdateTransferCourse(obj);

        this.setState({
          selectedCourseId: courseObject.Id,
        });
      }
    }
  };

  handleAddPrevCourse = () => {
    const { onAddNewPrevUnivCourse } = this.props;
    const { studentRequestId, prevUnivCoursesArray } = this.state;

    const emptyRowsExist = prevUnivCoursesArray.some(
      course => course.courseName == null
    );
    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ emptyPrevError: errorMessage });
    } else {
      this.setState({ emptyPrevError: null });
      onAddNewPrevUnivCourse({ studentRequestId: studentRequestId });
    }
  };

  handleAddTransferCourse = () => {
    const { onAddNewTransferCourse } = this.props;
    const { studentRequestId, transferCoursesArray } = this.state;

    const emptyRowsExist = transferCoursesArray.some(
      course => course.courseId == null
    );
    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ emptyTransferError: errorMessage });
    } else {
      this.setState({ emptyTransferError: null });
      onAddNewTransferCourse({ studentRequestId: studentRequestId });
    }
  };

  handlePrevCourseDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdatePrevUnivCourse } = this.props;
    let onUpdate = { Id: rowId, [fieldName]: fieldValue };
    onUpdatePrevUnivCourse(onUpdate);
  };

  handleTransferCourseDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateTransferCourse } = this.props;
    let onUpdate = { Id: rowId, [fieldName]: fieldValue };
    onUpdateTransferCourse(onUpdate);
  };

  onClickDeletePrevCourse = row => {
    const { onDeletePrevUnivCourse } = this.props;
    onDeletePrevUnivCourse({ Id: row.Id });
  };

  onClickDeleteTransferCourse = row => {
    const { onDeleteTransferCourse } = this.props;
    onDeleteTransferCourse({ Id: row.Id });
  };

  render() {
    //meta title
    document.title =
      "Registration Required Documents | keyInHands - React Admin & Dashboard Template";
    const {
      selectedDocument,
      fieldError,
      updateMessage,
      deleteModal,
      emptyTransferError,
      emptyPrevError,
      showAlert,
      defaultYear,
      sidebarOpen,
      selectedRequestId,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
      selectedSemester,
      isEdit,
      studentRequest,
      editModal,
      courseModal,
      selectedStatus,
      selectedStateObject,
      prevUnivCoursesArray,
      transferCoursesArray,
      studentRequestsArray,
      requestOrgName,
      decreeOrgName,
      foldingOrgName,
      courseNum,
      stateName,
      requestError,
      viewOnly,
      selectedRequest,
      viewStudentRequest,
      isCurrentSemester,
      generatedRequestNumber,
      viewStdName,
    } = this.state;

    const { SearchBar } = Search;
    const {
      regReqDocuments,
      prevUnivCourses,
      transferCourses,
      documents,
      t,
      deleted,
      years,
      currentSemester,
      yearSemesters,
      requests,
      decreeStatus,
      studentsRequests,
      univStds,
      coursesOpt,
      userId,
      academiccertificates,
    } = this.props;

    const coursesModified = coursesOpt.map(course => ({
      Id: course.Id,
      key: course.code,
      value: `${course.arCourseName}${course.code}`,
    }));
    const alertMessage =
      deleted == 0 ? "Can't Delete " : "Deleted Successfully";

    const defaultSorted = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];

    const yearsSemestersModified = yearSemesters.map(item => ({
      label: item.value,
      value: item.key,
      yearId: item.yearId,
      semesterId: item.semesterId,
    }));

    const universityStdModified = univStds.map(student => ({
      key: student.key,
      value: `${student.value}${student.key}`,
    }));

    const stateModified = decreeStatus.map(item => ({
      label: item.arTitle,
      value: item.Id,
    }));

    const studentsRequestsColumns = [
      {
        text: "id",
        dataField: "Id",
        sort: true,
        hidden: true,
        formatter: (cellContent, studentsRequests) => (
          <>{studentsRequests.Id}</>
        ),
        sort: true,
      },
      {
        text: this.props.t("Student Id"),
        dataField: "studentId",
        sort: true,
        formatter: (cellContent, studentsRequests) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {studentsRequests.studentId}
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
        formatter: (cellContent, studentsRequests) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {studentsRequests.studentName}
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
        text: this.props.t("Request Number"),
        dataField: "requestNum",
        sort: true,
        formatter: (cellContent, studentsRequests) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {studentsRequests.requestNum}
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
        dataField: "facultyName",
        sort: true,
        formatter: (cellContent, studentsRequests) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {studentsRequests.facultyName}
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
        text: this.props.t("Specialty"),
        dataField: "specialtyName",
        sort: true,
        formatter: (cellContent, studentsRequests) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {studentsRequests.specialtyName}
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
        text: this.props.t("State"),
        dataField: "stateId",
        sort: true,
        formatter: (cellContent, studentsRequests) => {
          const state = decreeStatus.find(
            state => state.Id === studentsRequests.stateId
          );
          return (
            <>
              <h5 className="font-size-14 mb-1">
                <Link to="#" className="text-dark">
                  {state ? state.arTitle : "Unknown State"}
                </Link>
              </h5>
            </>
          );
        },
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },
      {
        text: this.props.t("Requesting Date"),
        dataField: "requestDate",
        sort: true,
        formatter: (cellContent, studentsRequests) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {
                  new Date(studentsRequests.requestDate)
                    .toISOString()
                    .split("T")[0]
                }
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
        text: this.props.t("Activation Semester"),
        dataField: "activationSemester",
        sort: true,
        formatter: (cellContent, studentsRequests) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {studentsRequests.activationSemester }
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
        formatter: (cellContent, studentRequest) => (
          <div className="d-flex gap-3">
            <Link className="text-secondary" to="#">
              <i
                className="dripicons-preview font-size-18"
                id="edittooltip"
                onClick={() => this.handleViewRequest(studentRequest)}
              ></i>
            </Link>
            {/*   {showEditButton && ( */}
            <Link className="text-secondary" to="#">
              <i
                className="mdi mdi-pencil font-size-18"
                id="edittooltip"
                onClick={() => this.handleEditRequest(studentRequest)}
              ></i>
            </Link>
            {/* )} */}
          </div>
        ),
      },
    ];

    const prevUnivCoursesColumns = [
      { dataField: "Id", text: t("ID"), hidden: true },
      {
        dataField: "courseName",
        text: t("Course Name"),
        sort: true,
        editable: showEditButton,
      },
      {
        dataField: "courseCode",
        text: t("Course Code"),
        sort: true,
        editable: showEditButton,
      },
      {
        dataField: "nbHours",
        text: t("Nb of Hours"),
        sort: true,
        editable: showEditButton,
      },
      {
        dataField: "courseGrade",
        text: t("Course Grade"),
        sort: true,
        editable: showEditButton,
      },
      {
        dataField: "delete",
        text: "Action",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, course) => (
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => this.onClickDeletePrevCourse(course)}
            ></i>
          </Link>
        ),
      },
    ];

    const viewprevUnivCoursesColumns = [
      { dataField: "Id", text: t("ID"), hidden: true },
      {
        dataField: "courseName",
        text: t("Course Name"),
        sort: true,
        editable: false,
      },
      {
        dataField: "courseCode",
        text: t("Course Code"),
        sort: true,
        editable: false,
      },
      {
        dataField: "nbHours",
        text: t("Nb of Hours"),
        sort: true,
        editable: false,
      },
      {
        dataField: "courseGrade",
        text: t("Course Grade"),
        sort: true,
        editable: false,
      },
    ];

    const transferCoursesColumns = [
      { dataField: "Id", text: t("ID"), hidden: true },
      {
        dataField: "courseId",
        text: t("Course Name"),
        sort: true,
        editable: false,
        formatter: (cellContent, row) => (
          <div>
            <Input
              type="text"
              name="courseId"
              id="student-Id"
              list="coursesDatalistOptions"
              placeholder="Type to search..."
              onBlur={() => this.handleInputBlur("courseId")}
              onFocus={() => this.handleInputFocus("courseId")}
              onChange={event =>
                this.handleSelectCourse(event, row.Id, "courseId")
              }
              className={`form-control mt-3`}
              value={
                (
                  coursesModified.find(course => course.Id === row.courseId) ||
                  ""
                ).value
              }
            />
            <datalist id="coursesDatalistOptions">
              {coursesModified.map(course => (
                <option key={course.key} value={course.value} />
              ))}
            </datalist>
          </div>
        ),
      },
      {
        dataField: "nbHours",
        text: t("Nb of Hours"),
        sort: true,
        editable: false,
        formatter: (cellContent, row) => {
          const course = coursesOpt.find(c => c.Id === row.courseId);
          return course ? course.nbHours : "";
        },
      },

      {
        dataField: "courseGrade",
        text: t("Course Grade"),
        sort: true,
        editable: showEditButton || !viewOnly,
      },
      {
        dataField: "stateId",
        text: t("State"),
        sort: true,
        editable: false,
        formatter: (cellContent, row) => {
          const state = decreeStatus.find(s => s.Id === row.stateId);
          return state ? stateName : "";
        },
      },
      {
        dataField: "delete",
        text: "Action",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, course) => (
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => this.onClickDeleteTransferCourse(course)}
            ></i>
          </Link>
        ),
      },
    ];

    const studentRequestsColumns = [
      {
        text: "id",
        dataField: "Id",
        sort: true,
        hidden: true,
        sort: true,
      },
      {
        text: this.props.t("Request Number"),
        dataField: "requestNum",
        sort: true,
      },
      {
        text: this.props.t("Request Type"),
        dataField: "requestType",
        sort: true,
        editable: false,
        formatter: (cellContent, row) => {
          const request = requests.find(r => r.key === row.requestId);
          return request ? request.value : "";
        },
      },
      {
        text: this.props.t("Request Date"),
        dataField: "requestDate",
        formatter: (cellContent, studentsRequests) => (
          <>
            {studentsRequests.requestDate
              ? studentsRequests.requestDate.slice(0, 10)
              : ""}
          </>
        ),
        sort: true,
      },
      {
        text: this.props.t("Semester"),
        dataField: "yearSemester",
        sort: true,
      },
      {
        text: this.props.t("Request Status"),
        dataField: "state",
        sort: true,
      },
      {
        text: this.props.t("Activation Semester"),
        dataField: "activationSemester",
        sort: true,
      },
      {
        dataField: "menu",
        isDummyField: true,
        editable: false,
        text: this.props.t("Action"),
        formatter: (cellContent, studentRequest) => (
          <div className="d-flex justify-content-center gap-3">
            <Link className="text-secondary" to="#">
              <i
                className="dripicons-preview font-size-18"
                id="edittooltip"
                onClick={() => this.handleViewStdRequest(studentRequest)}
              ></i>
            </Link>
          </div>
        ),
      },
    ];

    const stdRequestRegisterData = [];

    const stdRequestRegisterColumns = [
      {
        text: "id",
        dataField: "Id",
        sort: true,
        hidden: true,
        sort: true,
      },
      {
        text: this.props.t("Request Number"),
        dataField: "requestNum",
        sort: true,
      },
      {
        text: this.props.t("Request Type"),
        dataField: "requestType",
        sort: true,
        formatter: (cellContent, row) => {
          const request = requests.find(r => r.value === row.requestId);
          return request ? request.label : "";
        },
      },

      {
        text: this.props.t("Request Date"),
        dataField: "requestDate",
        sort: true,
      },
      {
        text: this.props.t("Semester"),
        dataField: "yearSemesterId",
        sort: true,
      },
      {
        text: this.props.t("Student Status"),
        dataField: "stdStatus",
        sort: true,
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
      totalSize: regReqDocuments.length,
      custom: true,
    };

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteRow}
          onCloseClick={() =>
            this.setState({ deleteModal: false, selectedRowId: null })
          }
        />
        <div className="page-content">
          <div className="container-fluid">
            <Breadcrumbs
              title={this.props.t("Documents")}
              breadcrumbItem={this.props.t("Registration Required Documents")}
            />

            <div>
              {requestError && (
                <Alert
                  color="danger"
                  className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                  role="alert"
                >
                  {requestError}
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={this.handleAlertClose}
                  ></button>
                </Alert>
              )}
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

            <Card>
              <CardBody>
                <Row>
                  {sidebarOpen && (
                    <div style={{ width: sidebarOpen ? "18%" : "0" }}>
                      <Card>
                        <CardTitle id="std_requests_header">
                          {t("Requests")}
                        </CardTitle>
                        <CardBody>
                          <div className="mb-1">
                            <strong>{t("Semesters")}</strong>
                            <Select
                              className="select-style-semesterId mt-2"
                              name="semesterId"
                              key={`semesterId`}
                              options={yearsSemestersModified}
                              onChange={newValue => {
                                this.handleSelectSemester(
                                  "semesterId",
                                  newValue
                                );
                              }}
                              value={selectedSemester}
                            />
                            <br />
                          </div>

                          <div
                            className="mb-2"
                            style={{ margin: "0px 0px 8px" }}
                          >
                            <strong>{t("Requests")}</strong>
                            <Input
                              type="text"
                              name="requestId"
                              id="student-Id"
                              list="certificateDatalistOptions"
                              placeholder="Type to search..."
                              onBlur={() => this.handleInputBlur("requestId")}
                              onFocus={() => this.handleInputFocus("requestId")}
                              onChange={event =>
                                this.handleSelectRequest(event, "requestId")
                              }
                              className={`form-control mt-2 mb-3`}
                              value={
                                (
                                  requests.find(
                                    request => request.key === ""
                                  ) || ""
                                ).value
                              }
                            />
                            <datalist id="certificateDatalistOptions">
                              {requests.map(request => (
                                <option
                                  key={request.key}
                                  value={request.value}
                                />
                              ))}
                            </datalist>
                          </div>

                          <div className="mb-2">
                            <strong>{t("Status")}</strong>
                            <Select
                              className="select-style-stateId mt-2"
                              name="stateId"
                              key={`stateId`}
                              options={stateModified}
                              onChange={newValue => {
                                this.handleSelectState("stateId", newValue);
                              }}
                              placeholder={t("All State")}
                              value={selectedStateObject}
                            />
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  )}

                  <Col lg="auto" className="p-0">
                    <div className="collapse-course">
                      <i
                        onClick={this.toggleSidebar}
                        className="bx bx-menu"
                      ></i>
                    </div>
                  </Col>

                  <Col lg={sidebarOpen ? "" : ""}>
                    <div className="table-responsive">
                      <PaginationProvider
                        pagination={paginationFactory(pageOptions)}
                        keyField="Id"
                        columns={studentsRequestsColumns}
                        data={studentsRequests}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            columns={studentsRequestsColumns}
                            data={studentsRequests}
                            search
                          >
                            {toolkitprops => (
                              <React.Fragment>
                                <Row className="mb-2">
                                  <Col lg="4"></Col>
                                  <Col lg="3"></Col>
                                  <Col>
                                    {isCurrentSemester && (
                                      <div className="text-sm-end">
                                        <Tooltip
                                          title={this.props.t("Add")}
                                          placement="top"
                                        >
                                          <IconButton
                                            color="primary"
                                            onClick={
                                              this.handleAddStudentRequest
                                            }
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

                                <Modal
                                  isOpen={this.state.modal}
                                  className={this.props.className}
                                >
                                  <ModalHeader toggle={this.addToggle} tag="h4">
                                    {!!isEdit
                                      ? this.props.t("Edit Request")
                                      : this.props.t("Add Request")}
                                  </ModalHeader>
                                  <ModalBody>
                                    <Row>
                                      {fieldError && (
                                        <Alert
                                          color="danger"
                                          className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                          role="alert"
                                        >
                                          {fieldError}
                                          <button
                                            type="button"
                                            className="btn-close"
                                            aria-label="Close"
                                            onClick={this.handleAlertClose}
                                          ></button>
                                        </Alert>
                                      )}
                                      <Col>
                                        <Formik
                                          initialValues={{
                                            requestNum:
                                              generatedRequestNumber || "",
                                            yearSemesterId:
                                              null || selectedSemester
                                                ? selectedSemester.value
                                                : null,
                                            studentId:
                                              studentRequest.studentId || "",
                                            requestDate:
                                              new Date()
                                                .toISOString()
                                                .split("T")[0] || "",
                                            notes: "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            yearSemesterId: Yup.number()
                                              .required(
                                                "Current Semester is required"
                                              )
                                              .nullable(),

                                            yearSemesterId: Yup.number(),
                                            studentId: Yup.string()
                                              .required("Student is required")
                                              .test(
                                                "is-valid-student",
                                                "Invalid student",
                                                value => {
                                                  return universityStdModified.some(
                                                    student =>
                                                      student.value === value
                                                  );
                                                }
                                              ),

                                            requestDate: Yup.date().required(
                                              "Request Date is required"
                                            ),
                                            requestOrgNotes: Yup.string(),
                                          })}
                                          onSubmit={values => {
                                            this.handleSave(values);
                                          }}
                                        >
                                          {({
                                            errors,
                                            status,
                                            touched,
                                            values,
                                            handleSubmit,
                                            setFieldValue,
                                            handleBlur,
                                            handleChange,
                                          }) => (
                                            <Form>
                                              <div className="mb-3">
                                                <Row>
                                                  <Col lg="4">
                                                    <label
                                                      htmlFor="requestNum"
                                                      className="form-label d-flex"
                                                    >
                                                      {this.props.t(
                                                        "Request Number"
                                                      )}
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </label>
                                                  </Col>
                                                  <Col lg="8">
                                                    <Field
                                                      name="requestNum"
                                                      type="text"
                                                      list="requestNum"
                                                      className={`form-control
                                                      `}
                                                      readOnly
                                                    />
                                                  </Col>
                                                </Row>
                                              </div>

                                              <div className="mb-3">
                                                <Row>
                                                  <Col lg="4">
                                                    <label
                                                      htmlFor="requestDate"
                                                      className="form-label d-flex"
                                                    >
                                                      {this.props.t(
                                                        "Request Date"
                                                      )}
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </label>
                                                  </Col>
                                                  <Col lg="8">
                                                    <Field
                                                      name="requestDate"
                                                      type="date"
                                                      className={`form-control ${
                                                        errors.requestDate &&
                                                        touched.requestDate
                                                          ? "is-invalid"
                                                          : ""
                                                      }`}
                                                      onChange={handleChange}
                                                    />

                                                    <ErrorMessage
                                                      name="requestDate"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </Col>
                                                </Row>
                                              </div>

                                              <div className="mb-3">
                                                <Row>
                                                  <Col lg="4">
                                                    <label
                                                      htmlFor="yearSemesterId"
                                                      className="form-label d-flex"
                                                    >
                                                      {this.props.t(
                                                        "Current Semester"
                                                      )}{" "}
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </label>
                                                  </Col>
                                                  <Col lg="8">
                                                    <Field
                                                      name="yearSemesterId"
                                                      options={
                                                        yearsSemestersModified
                                                      }
                                                      component={Select}
                                                      onChange={option =>
                                                        setFieldValue(
                                                          "yearSemesterId",
                                                          option.value
                                                        )
                                                      }
                                                      className={`select-style-std ${
                                                        errors.yearSemesterId &&
                                                        touched.yearSemesterId
                                                          ? "is-invalid"
                                                          : ""
                                                      }`}
                                                      value={selectedSemester}
                                                      disabled={true}
                                                    />
                                                    <ErrorMessage
                                                      name="yearSemesterId"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </Col>
                                                </Row>
                                              </div>

                                              <div className="mb-3">
                                                <Row>
                                                  <Col lg="4">
                                                    <label
                                                      htmlFor="studentId"
                                                      className="form-label d-flex"
                                                    >
                                                      {this.props.t(
                                                        "Student Name"
                                                      )}{" "}
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </label>
                                                  </Col>
                                                  <Col lg="8">
                                                    <Field
                                                      name="studentId"
                                                      type="text"
                                                      list="studentIdList"
                                                      className={`form-control ${
                                                        errors.studentId &&
                                                        touched.studentId
                                                          ? "is-invalid"
                                                          : ""
                                                      }`}
                                                      onChange={e => {
                                                        handleChange(e);
                                                      }}
                                                    />
                                                    <datalist id="studentIdList">
                                                      {universityStdModified.map(
                                                        student => (
                                                          <option
                                                            key={student.key}
                                                            value={
                                                              student.value
                                                            }
                                                          />
                                                        )
                                                      )}
                                                    </datalist>
                                                    <ErrorMessage
                                                      name="studentId"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </Col>
                                                </Row>
                                              </div>

                                              {selectedRequest &&
                                                typeof selectedRequest ===
                                                  "string" &&
                                                selectedRequest.includes(
                                                  "اختصاص"
                                                ) && (
                                                  <div className="mb-3">
                                                    <Row>
                                                      <Col lg="4">
                                                        <label
                                                          htmlFor="newSpecialtyId"
                                                          className="form-label d-flex"
                                                        >
                                                          {this.props.t(
                                                            "New Specialty"
                                                          )}{" "}
                                                          <span className="text-danger">
                                                            *
                                                          </span>
                                                        </label>
                                                      </Col>
                                                      <Col lg="8">
                                                        <Field
                                                          name="newSpecialtyId"
                                                          options={
                                                            academiccertificates
                                                          }
                                                          component={Select}
                                                          onChange={option =>
                                                            setFieldValue(
                                                              "newSpecialtyId",
                                                              option.value
                                                            )
                                                          }
                                                          className={`select-style-std ${
                                                            errors.newSpecialtyId &&
                                                            touched.newSpecialtyId
                                                              ? "is-invalid"
                                                              : ""
                                                          }`}
                                                          disabled={true}
                                                        />
                                                        <ErrorMessage
                                                          name="newSpecialtyId"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </Col>
                                                    </Row>
                                                  </div>
                                                )}

                                              <div className="mb-3">
                                                <Row>
                                                  <Col lg="4">
                                                    <label
                                                      htmlFor="requestOrgNotes"
                                                      className="form-label d-flex"
                                                    >
                                                      {this.props.t(
                                                        "Request Organizer Notes"
                                                      )}
                                                    </label>
                                                  </Col>
                                                  <Col lg="8">
                                                    <Field
                                                      name="requestOrgNotes"
                                                      as="textarea"
                                                      className={`form-control ${
                                                        window.confirmWindowOpen
                                                          ? "is-invalid"
                                                          : ""
                                                      }`}
                                                    />
                                                    <ErrorMessage
                                                      name="requestOrgNotes"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </Col>
                                                </Row>
                                              </div>
                                              <div className="d-flex justify-content-center">
                                                <button
                                                  type="submit"
                                                  className="btn btn-primary"
                                                >
                                                  {this.props.t("Save")}
                                                </button>
                                              </div>
                                            </Form>
                                          )}
                                        </Formik>
                                      </Col>
                                    </Row>
                                  </ModalBody>
                                </Modal>

                                <Modal
                                  isOpen={editModal}
                                  className={this.props.className}
                                  fullscreen
                                >
                                  <ModalHeader
                                    toggle={this.editToggle}
                                    tag="h4"
                                  >
                                    {this.props.t("Edit Student Request")}
                                  </ModalHeader>

                                  <ModalBody>
                                    {updateMessage && (
                                      <Alert
                                        color="success"
                                        className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                        role="alert"
                                      >
                                        {updateMessage}
                                        <button
                                          type="button"
                                          className="btn-close"
                                          aria-label="Close"
                                          onClick={this.handleAlertClose}
                                        ></button>
                                      </Alert>
                                    )}
                                    <Row>
                                      <Col lg="4">
                                        <Formik
                                          initialValues={
                                            isEdit && {
                                              Id: studentRequest.Id,
                                              requestNum:
                                                studentRequest.requestNum,
                                              yearSemesterId:
                                                null ||
                                                studentRequest.yearSemesterId,
                                              requestOrgNotes:
                                                studentRequest.requestOrgNotes ||
                                                "",
                                              decreeOrganizer:
                                                decreeOrgName || "",
                                              decreeDate:
                                                studentRequest.decreeDate
                                                  ? new Date(
                                                      studentRequest.decreeDate
                                                    )
                                                      .toISOString()
                                                      .split("T")[0]
                                                  : "",
                                              decreeOrgNotes:
                                                studentRequest.decreeOrgNotes ||
                                                "",
                                              stateId: selectedStatus || null,
                                              foldingDate:
                                                studentRequest.foldingDate
                                                  ? new Date(
                                                      studentRequest.foldingDate
                                                    )
                                                      .toISOString()
                                                      .split("T")[0]
                                                  : "",
                                              foldingOrganizer:
                                                foldingOrgName || "",
                                              foldingOrgNotes:
                                                studentRequest.foldingOrgNotes ||
                                                "",
                                            }
                                          }
                                          validationSchema={Yup.object().shape({
                                            yearSemesterId: Yup.number()
                                              .required(
                                                "Current Semester is required"
                                              )
                                              .nullable(),

                                            decisionRuleReasonId:
                                              Yup.object().nullable(),

                                            requestOrgNotes: Yup.string(),
                                          })}
                                          onSubmit={values => {
                                            this.handleSave(values);
                                          }}
                                        >
                                          {({
                                            errors,
                                            status,
                                            touched,
                                            values,
                                            handleSubmit,
                                            setFieldValue,
                                            handleBlur,
                                            handleChange,
                                            setTouched,
                                          }) => (
                                            <Form onSubmit={handleSubmit}>
                                              <Card>
                                                <CardTitle
                                                  id="req_header"
                                                  className="req-header"
                                                >
                                                  <div className="header-content">
                                                    <span>
                                                      {studentRequest.studentName +
                                                        " " +
                                                        studentRequest.studentId}
                                                    </span>
                                                    <span>
                                                      {t("Request Number")}{" "}
                                                      {
                                                        studentRequest.requestNum
                                                      }
                                                    </span>
                                                  </div>
                                                </CardTitle>
                                                <CardBody>
                                                  <div className="bordered">
                                                    <div className="mb-3">
                                                      <Row>
                                                        <Col lg="4">
                                                          <label
                                                            htmlFor="yearSemesterId"
                                                            className="form-label d-flex"
                                                          >
                                                            {this.props.t(
                                                              "Current Semester"
                                                            )}{" "}
                                                            <span className="text-danger">
                                                              *
                                                            </span>
                                                          </label>
                                                        </Col>
                                                        <Col lg="8">
                                                          <Field
                                                            name="yearSemesterId"
                                                            options={
                                                              yearsSemestersModified
                                                            }
                                                            component={Select}
                                                            onChange={option =>
                                                              setFieldValue(
                                                                "yearSemesterId",
                                                                option.value
                                                              )
                                                            }
                                                            className={`select-style-std ${
                                                              errors.yearSemesterId &&
                                                              touched.yearSemesterId
                                                                ? "is-invalid"
                                                                : ""
                                                            }`}
                                                            defaultValue={yearsSemestersModified.find(
                                                              opt =>
                                                                opt.value ===
                                                                studentRequest.yearSemesterId
                                                            )}
                                                            isDisabled={true}
                                                          />
                                                          <ErrorMessage
                                                            name="yearSemesterId"
                                                            component="div"
                                                            className="invalid-feedback"
                                                          />
                                                        </Col>
                                                      </Row>
                                                    </div>

                                                    {(selectedRequest &&
                                                      typeof selectedRequest ===
                                                        "string" &&
                                                      selectedRequest.includes(
                                                        "اختصاص"
                                                      )) ||
                                                      (studentRequest.requestId ==
                                                        25 && (
                                                        <div className="mb-3">
                                                          <Row>
                                                            <Col lg="4">
                                                              <label
                                                                htmlFor="newSpecialtyId"
                                                                className="form-label d-flex"
                                                              >
                                                                {this.props.t(
                                                                  "New Specialty"
                                                                )}{" "}
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </label>
                                                            </Col>
                                                            <Col lg="8">
                                                              <Field
                                                                name="newSpecialtyId"
                                                                options={
                                                                  academiccertificates
                                                                }
                                                                component={
                                                                  Select
                                                                }
                                                                onChange={option =>
                                                                  setFieldValue(
                                                                    "newSpecialtyId",
                                                                    option.value
                                                                  )
                                                                }
                                                                className={`select-style-std ${
                                                                  errors.newSpecialtyId &&
                                                                  touched.newSpecialtyId
                                                                    ? "is-invalid"
                                                                    : ""
                                                                }`}
                                                                isDisabled={
                                                                  true
                                                                }
                                                                defaultValue={academiccertificates.find(
                                                                  opt =>
                                                                    opt.value ===
                                                                    studentRequest.newSpecialtyId
                                                                )}
                                                              />
                                                              <ErrorMessage
                                                                name="newSpecialtyId"
                                                                component="div"
                                                                className="invalid-feedback"
                                                              />
                                                            </Col>
                                                          </Row>
                                                        </div>
                                                      ))}

                                                    {(selectedRequest &&
                                                      typeof selectedRequest ===
                                                        "string" &&
                                                      selectedRequest.includes(
                                                        "مقررات"
                                                      )) ||
                                                      (studentRequest.requestId ==
                                                        31 && (
                                                        <div className="mb-3">
                                                          <Row>
                                                            <Col lg="4">
                                                              <Label className="form-label">
                                                                {this.props.t(
                                                                  "Transfer Courses"
                                                                )}
                                                              </Label>
                                                            </Col>
                                                            <Col lg="4">
                                                              <InputGroup>
                                                                <Field
                                                                  type="number"
                                                                  name="transferCourse"
                                                                  id="avg"
                                                                  className={`form-control`}
                                                                  value={
                                                                    courseNum ||
                                                                    0
                                                                  }
                                                                  readOnly
                                                                />
                                                                <div className="input-group-ques">
                                                                  <i
                                                                    className="mdi mdi-pencil font-size-18"
                                                                    id="edittooltip"
                                                                    onClick={() =>
                                                                      this.courseToggle()
                                                                    }
                                                                  ></i>
                                                                  <Modal
                                                                    isOpen={
                                                                      courseModal
                                                                    }
                                                                    className={
                                                                      this.props
                                                                        .className
                                                                    }
                                                                    size="xl"
                                                                  >
                                                                    <ModalHeader
                                                                      toggle={
                                                                        this
                                                                          .courseToggle
                                                                      }
                                                                      tag="h4"
                                                                    >
                                                                      {this.props.t(
                                                                        "Transfer Courses"
                                                                      )}
                                                                    </ModalHeader>
                                                                    <ModalBody>
                                                                      <Row>
                                                                        <Col lg="6">
                                                                          {emptyPrevError && (
                                                                            <Alert
                                                                              color="danger"
                                                                              className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                                              role="alert"
                                                                            >
                                                                              {
                                                                                emptyPrevError
                                                                              }
                                                                              <button
                                                                                type="button"
                                                                                className="btn-close"
                                                                                aria-label="Close"
                                                                                onClick={
                                                                                  this
                                                                                    .handleAlertClose
                                                                                }
                                                                              ></button>
                                                                            </Alert>
                                                                          )}
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
                                                                                    .handleAddPrevCourse
                                                                                }
                                                                              >
                                                                                <i className="mdi mdi-plus-circle blue-noti-icon" />
                                                                              </IconButton>
                                                                            </Tooltip>
                                                                          </div>
                                                                          <BootstrapTable
                                                                            keyField="Id"
                                                                            data={
                                                                              prevUnivCoursesArray !=
                                                                              null
                                                                                ? prevUnivCoursesArray
                                                                                : []
                                                                            }
                                                                            columns={
                                                                              prevUnivCoursesColumns
                                                                            }
                                                                            filter={filterFactory()}
                                                                            filterPosition="top"
                                                                            cellEdit={cellEditFactory(
                                                                              {
                                                                                mode: "click",
                                                                                blurToSave: true,
                                                                                afterSaveCell:
                                                                                  (
                                                                                    oldValue,
                                                                                    newValue,
                                                                                    row,
                                                                                    column
                                                                                  ) => {
                                                                                    this.handlePrevCourseDataChange(
                                                                                      row.Id,
                                                                                      column.dataField,
                                                                                      newValue
                                                                                    );
                                                                                  },
                                                                              }
                                                                            )}
                                                                            noDataIndication={t(
                                                                              "No Courses found"
                                                                            )}
                                                                            defaultSorted={
                                                                              defaultSorting
                                                                            }
                                                                          />
                                                                        </Col>
                                                                        <Col lg="6">
                                                                          {emptyTransferError && (
                                                                            <Alert
                                                                              color="danger"
                                                                              className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                                              role="alert"
                                                                            >
                                                                              {
                                                                                emptyTransferError
                                                                              }
                                                                              <button
                                                                                type="button"
                                                                                className="btn-close"
                                                                                aria-label="Close"
                                                                                onClick={
                                                                                  this
                                                                                    .handleAlertClose
                                                                                }
                                                                              ></button>
                                                                            </Alert>
                                                                          )}
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
                                                                                    .handleAddTransferCourse
                                                                                }
                                                                              >
                                                                                <i className="mdi mdi-plus-circle blue-noti-icon" />
                                                                              </IconButton>
                                                                            </Tooltip>
                                                                          </div>
                                                                          <BootstrapTable
                                                                            keyField="Id"
                                                                            data={
                                                                              transferCoursesArray !=
                                                                              null
                                                                                ? transferCoursesArray
                                                                                : []
                                                                            }
                                                                            columns={
                                                                              transferCoursesColumns
                                                                            }
                                                                            filter={filterFactory()}
                                                                            filterPosition="top"
                                                                            cellEdit={cellEditFactory(
                                                                              {
                                                                                mode: "click",
                                                                                blurToSave: true,
                                                                                afterSaveCell:
                                                                                  (
                                                                                    oldValue,
                                                                                    newValue,
                                                                                    row,
                                                                                    column
                                                                                  ) => {
                                                                                    this.handleTransferCourseDataChange(
                                                                                      row.Id,
                                                                                      column.dataField,
                                                                                      newValue
                                                                                    );
                                                                                  },
                                                                              }
                                                                            )}
                                                                            noDataIndication={t(
                                                                              "No Courses found"
                                                                            )}
                                                                            defaultSorted={
                                                                              defaultSorting
                                                                            }
                                                                          />
                                                                        </Col>
                                                                      </Row>
                                                                    </ModalBody>
                                                                  </Modal>
                                                                </div>
                                                              </InputGroup>
                                                            </Col>
                                                          </Row>
                                                        </div>
                                                      ))}

                                                    <div className="mb-3">
                                                      <Row>
                                                        <Col lg="4">
                                                          <label
                                                            htmlFor="requestOrganizer"
                                                            className="form-label d-flex"
                                                          >
                                                            {this.props.t(
                                                              "Request Organizer"
                                                            )}
                                                          </label>
                                                        </Col>
                                                        <Col lg="8">
                                                          <Field
                                                            name="requestOrganizer"
                                                            type="text"
                                                            className={`form-control`}
                                                            value={
                                                              requestOrgName
                                                            }
                                                            readOnly
                                                          />
                                                        </Col>
                                                      </Row>
                                                    </div>

                                                    <div className="mb-3">
                                                      <Row>
                                                        <Col lg="4">
                                                          <label
                                                            htmlFor="requestOrgNotes"
                                                            className="form-label d-flex"
                                                          >
                                                            {this.props.t(
                                                              "Request Organizer Notes"
                                                            )}
                                                          </label>
                                                        </Col>
                                                        <Col lg="8">
                                                          <Field
                                                            name="requestOrgNotes"
                                                            as="textarea"
                                                            className={`form-control ${
                                                              window.confirmWindowOpen
                                                                ? "is-invalid"
                                                                : ""
                                                            }`}
                                                            readOnly
                                                          />
                                                          <ErrorMessage
                                                            name="decreeOrgNotes"
                                                            component="div"
                                                            className="invalid-feedback"
                                                          />
                                                        </Col>
                                                      </Row>
                                                    </div>
                                                  </div>
                                                </CardBody>
                                              </Card>
                                              <Row>
                                                <Accordion defaultActiveKey="1">
                                                  <Accordion.Item eventKey="2">
                                                    <Accordion.Header>
                                                      {this.props.t(
                                                        "Decree Information"
                                                      )}
                                                    </Accordion.Header>
                                                    <Accordion.Body>
                                                      <div className="mb-3">
                                                        <Row>
                                                          <Col lg="4">
                                                            <label
                                                              htmlFor="decreeDate"
                                                              className="form-label d-flex"
                                                            >
                                                              {this.props.t(
                                                                "Decree Date"
                                                              )}
                                                            </label>
                                                          </Col>
                                                          <Col lg="8">
                                                            <Field
                                                              name="decreeDate"
                                                              type="date"
                                                              className={`form-control`}
                                                              onChange={
                                                                handleChange
                                                              }
                                                              readOnly={
                                                                selectedStatus !=
                                                                4
                                                              }
                                                              defaultValue={
                                                                new Date(
                                                                  studentRequest.decreeDate
                                                                )
                                                                  .toISOString()
                                                                  .split("T")[0]
                                                              }
                                                            />
                                                          </Col>
                                                        </Row>
                                                      </div>

                                                      <div className="mb-3">
                                                        <Row>
                                                          <Col lg="4">
                                                            <label
                                                              htmlFor="decreeOrganizer"
                                                              className="form-label d-flex"
                                                            >
                                                              {this.props.t(
                                                                "Decree Organizer"
                                                              )}
                                                            </label>
                                                          </Col>
                                                          <Col lg="8">
                                                            <Field
                                                              name="decreeOrganizer"
                                                              type="text"
                                                              className={`form-control`}
                                                              onChange={
                                                                handleChange
                                                              }
                                                              value={
                                                                decreeOrgName
                                                              }
                                                              readOnly
                                                            />
                                                          </Col>
                                                        </Row>
                                                      </div>

                                                      <div className="mb-3">
                                                        <Row>
                                                          <Col lg="4">
                                                            <label
                                                              htmlFor="decreeOrgrNotes"
                                                              className="form-label d-flex"
                                                            >
                                                              {this.props.t(
                                                                "Decree Organizer Notes"
                                                              )}
                                                            </label>
                                                          </Col>
                                                          <Col lg="8">
                                                            <Field
                                                              name="decreeOrgNotes"
                                                              as="textarea"
                                                              className={`form-control`}
                                                              onChange={
                                                                handleChange
                                                              }
                                                              readOnly={
                                                                selectedStatus !=
                                                                4
                                                              }
                                                            />
                                                          </Col>
                                                        </Row>
                                                      </div>

                                                      <div className="mb-3">
                                                        <Row>
                                                          <Col lg="4">
                                                            <label
                                                              htmlFor="decreeStatus"
                                                              className="form-label d-flex"
                                                            >
                                                              {this.props.t(
                                                                "Request Status"
                                                              )}
                                                              <span className="text-danger">
                                                                *
                                                              </span>
                                                            </label>
                                                          </Col>
                                                          <Col lg="8">
                                                            <div className="d-flex flex-wrap gap-3">
                                                              <div
                                                                className="btn-group button-or"
                                                                role="group"
                                                              >
                                                                {decreeStatus.map(
                                                                  (
                                                                    status,
                                                                    index
                                                                  ) => (
                                                                    <React.Fragment
                                                                      key={
                                                                        index
                                                                      }
                                                                    >
                                                                      <input
                                                                        type="radio"
                                                                        className={`btn-check button-or ${
                                                                          selectedStatus ===
                                                                          status.Id
                                                                            ? "active"
                                                                            : ""
                                                                        }`}
                                                                        name="stateId"
                                                                        id={`btnradio${index}`}
                                                                        autoComplete="off"
                                                                        defaultChecked={
                                                                          selectedStatus ===
                                                                          status.Id
                                                                            ? "active"
                                                                            : ""
                                                                        }
                                                                        onChange={() =>
                                                                          setFieldValue(
                                                                            "stateId",
                                                                            status.Id
                                                                          )
                                                                        }
                                                                        //disabled={viewOnly}
                                                                      />
                                                                      <label
                                                                        className="btn btn-outline-primary smallButton w-sm"
                                                                        htmlFor={`btnradio${index}`}
                                                                      >
                                                                        {
                                                                          status.arTitle
                                                                        }
                                                                      </label>
                                                                    </React.Fragment>
                                                                  )
                                                                )}
                                                              </div>
                                                            </div>
                                                          </Col>
                                                        </Row>
                                                      </div>
                                                    </Accordion.Body>
                                                  </Accordion.Item>
                                                </Accordion>
                                              </Row>
                                              {values["stateId"] == 2 && (
                                                <Row>
                                                  <Accordion defaultActiveKey="1">
                                                    <Accordion.Item eventKey="2">
                                                      <Accordion.Header>
                                                        {this.props.t(
                                                          "Folding Information"
                                                        )}
                                                      </Accordion.Header>
                                                      <Accordion.Body>
                                                        <div className="mb-3">
                                                          <Row>
                                                            <Col lg="4">
                                                              <label
                                                                htmlFor="foldingDate"
                                                                className="form-label d-flex"
                                                              >
                                                                {this.props.t(
                                                                  "Folding Date"
                                                                )}
                                                              </label>
                                                            </Col>
                                                            <Col lg="8">
                                                              <Field
                                                                name="foldingDate"
                                                                type="date"
                                                                className={`form-control`}
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                readOnly={
                                                                  selectedStatus ==
                                                                  2
                                                                }
                                                              />
                                                            </Col>
                                                          </Row>
                                                        </div>

                                                        <div className="mb-3">
                                                          <Row>
                                                            <Col lg="4">
                                                              <label
                                                                htmlFor="foldingOrganizer"
                                                                className="form-label d-flex"
                                                              >
                                                                {this.props.t(
                                                                  "Folding Organizer"
                                                                )}
                                                              </label>
                                                            </Col>
                                                            <Col lg="8">
                                                              <Field
                                                                name="foldingOrganizer"
                                                                type="text"
                                                                className={`form-control`}
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                value={
                                                                  foldingOrgName
                                                                }
                                                                readOnly
                                                              />
                                                            </Col>
                                                          </Row>
                                                        </div>

                                                        <div className="mb-3">
                                                          <Row>
                                                            <Col lg="4">
                                                              <label
                                                                htmlFor="foldingOrgNotes"
                                                                className="form-label d-flex"
                                                              >
                                                                {this.props.t(
                                                                  "Folding Organizer Notes"
                                                                )}
                                                              </label>
                                                            </Col>
                                                            <Col lg="8">
                                                              <Field
                                                                name="foldingOrgNotes"
                                                                as="textarea"
                                                                className={`form-control`}
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                readOnly={
                                                                  selectedStatus ==
                                                                  2
                                                                }
                                                              />
                                                            </Col>
                                                          </Row>
                                                        </div>
                                                      </Accordion.Body>
                                                    </Accordion.Item>
                                                  </Accordion>
                                                </Row>
                                              )}

                                              <div className="d-flex justify-content-center">
                                                <button
                                                  type="submit"
                                                  className="btn btn-primary"
                                                >
                                                  {this.props.t("Save")}
                                                </button>
                                              </div>
                                            </Form>
                                          )}
                                        </Formik>
                                      </Col>
                                      <Col lg="8">
                                        <Row>
                                          <Card>
                                            <CardTitle id="add_header">
                                              {this.props.t("Student Requests")}
                                            </CardTitle>
                                            <CardBody>
                                              <Row>
                                                <BootstrapTable
                                                  keyField="Id"
                                                  data={
                                                    studentRequestsArray
                                                      ? studentRequestsArray
                                                      : []
                                                  }
                                                  columns={
                                                    studentRequestsColumns
                                                  }
                                                  noDataIndication={t(
                                                    "No Warning Rules Definition found"
                                                  )}
                                                  defaultSorted={defaultSorting}
                                                  filter={filterFactory()}
                                                />
                                              </Row>
                                            </CardBody>
                                          </Card>
                                        </Row>

                                        <Row>
                                          <Card>
                                            <CardTitle id="add_header">
                                              {this.props.t(
                                                "Students Requests (Register)"
                                              )}
                                            </CardTitle>
                                            <CardBody>
                                              <Row>
                                                <BootstrapTable
                                                  keyField="Id"
                                                  data={stdRequestRegisterData}
                                                  columns={
                                                    stdRequestRegisterColumns
                                                  }
                                                  noDataIndication={t(
                                                    "No Warning Rules Definition found"
                                                  )}
                                                  defaultSorted={defaultSorting}
                                                  filter={filterFactory()}
                                                />
                                              </Row>
                                            </CardBody>
                                          </Card>
                                        </Row>
                                      </Col>
                                    </Row>
                                  </ModalBody>
                                </Modal>

                                <Modal
                                  isOpen={viewOnly}
                                  className={this.props.className}
                                >
                                  <ModalHeader
                                    toggle={this.viewToggle}
                                    tag="h4"
                                  >
                                    {this.props.t("View Student Request")}
                                  </ModalHeader>

                                  <ModalBody>
                                    <Row>
                                      <Col lg={!viewOnly ? "4" : ""}>
                                        <Formik
                                          initialValues={
                                            viewOnly && {
                                              Id: viewStudentRequest.Id,
                                              requestNum:
                                                viewStudentRequest.requestNum,
                                              yearSemesterId:
                                                null ||
                                                viewStudentRequest.yearSemesterId,
                                              requestOrgNotes:
                                                viewStudentRequest.requestOrgNotes ||
                                                "",
                                              decreeOrganizer:
                                                decreeOrgName || "",
                                              decreeDate:
                                                viewStudentRequest.decreeDate
                                                  ? new Date(
                                                      viewStudentRequest.decreeDate
                                                    )
                                                      .toISOString()
                                                      .split("T")[0]
                                                  : "",
                                              decreeOrgNotes:
                                                viewStudentRequest.decreeOrgNotes ||
                                                "",
                                              stateId: selectedStatus || null,
                                              foldingDate:
                                                viewStudentRequest.foldingDate
                                                  ? new Date(
                                                      viewStudentRequest.foldingDate
                                                    )
                                                      .toISOString()
                                                      .split("T")[0]
                                                  : "",
                                              foldingOrganizer:
                                                foldingOrgName || "",
                                              foldingOrgNotes:
                                                viewStudentRequest.foldingOrgNotes ||
                                                "",
                                            }
                                          }
                                          validationSchema={Yup.object().shape({
                                            yearSemesterId: Yup.number()
                                              .required(
                                                "Current Semester is required"
                                              )
                                              .nullable(),

                                            decisionRuleReasonId:
                                              Yup.object().nullable(),

                                            requestOrgNotes: Yup.string(),
                                          })}
                                          onSubmit={values => {
                                            this.handleSave(values);
                                          }}
                                        >
                                          {({
                                            errors,
                                            status,
                                            touched,
                                            values,
                                            handleSubmit,
                                            setFieldValue,
                                            handleBlur,
                                            handleChange,
                                            setTouched,
                                          }) => (
                                            <Form onSubmit={handleSubmit}>
                                              <Card>
                                                <CardTitle
                                                  id="req_header"
                                                  className="req-header"
                                                >
                                                  <div className="header-content">
                                                    <span>
                                                      {viewStudentRequest &&
                                                      viewStudentRequest.studentName !=
                                                        undefined
                                                        ? viewStudentRequest.studentName +
                                                          " " +
                                                          viewStudentRequest.studentId
                                                        : viewStdName +
                                                          " " +
                                                          viewStudentRequest.studentId}
                                                    </span>
                                                    <span>
                                                      {t("Request Number")}{" "}
                                                      {
                                                        viewStudentRequest.requestNum
                                                      }
                                                    </span>
                                                  </div>
                                                </CardTitle>
                                                <CardBody>
                                                  <div className="bordered">
                                                    <div className="mb-3">
                                                      <Row>
                                                        <Col lg="4">
                                                          <label
                                                            htmlFor="yearSemesterId"
                                                            className="form-label d-flex"
                                                          >
                                                            {this.props.t(
                                                              "Current Semester"
                                                            )}{" "}
                                                            <span className="text-danger">
                                                              *
                                                            </span>
                                                          </label>
                                                        </Col>
                                                        <Col lg="8">
                        
                                                          <Field
                                                            name="yearSemesterId"
                                                            options={
                                                              yearsSemestersModified
                                                            }
                                                            component={Select}
                                                            onChange={option =>
                                                              setFieldValue(
                                                                "yearSemesterId",
                                                                option.value
                                                              )
                                                            }
                                                            className={`select-style-std ${
                                                              errors.yearSemesterId &&
                                                              touched.yearSemesterId
                                                                ? "is-invalid"
                                                                : ""
                                                            }`}
                                                            defaultValue={yearsSemestersModified.find(
                                                              opt =>
                                                                opt.value ===
                                                              viewStudentRequest.yearSemesterId
                                                            )}
                                                            isDisabled={true}
                                                          />
                                                          <ErrorMessage
                                                            name="yearSemesterId"
                                                            component="div"
                                                            className="invalid-feedback"
                                                          />
                                                        </Col>
                                                      </Row>
                                                    </div>

                                                    {(selectedRequest &&
                                                      typeof selectedRequest ===
                                                        "string" &&
                                                      selectedRequest.includes(
                                                        "اختصاص"
                                                      )) ||
                                                      (viewStudentRequest.requestId ==
                                                        25 && (
                                                        <div className="mb-3">
                                                          <Row>
                                                            <Col lg="4">
                                                              <label
                                                                htmlFor="newSpecialtyId"
                                                                className="form-label d-flex"
                                                              >
                                                                {this.props.t(
                                                                  "New Specialty"
                                                                )}{" "}
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </label>
                                                            </Col>
                                                            <Col lg="8">
                                                              <Field
                                                                name="newSpecialtyId"
                                                                options={
                                                                  academiccertificates
                                                                }
                                                                component={
                                                                  Select
                                                                }
                                                                onChange={option =>
                                                                  setFieldValue(
                                                                    "newSpecialtyId",
                                                                    option.value
                                                                  )
                                                                }
                                                                className={`select-style-std ${
                                                                  errors.newSpecialtyId &&
                                                                  touched.newSpecialtyId
                                                                    ? "is-invalid"
                                                                    : ""
                                                                }`}
                                                                isDisabled={
                                                                  true
                                                                }
                                                                defaultValue={academiccertificates.find(
                                                                  opt =>
                                                                    opt.value ===
                                                                    studentRequest.newSpecialtyId
                                                                )}
                                                              />
                                                              <ErrorMessage
                                                                name="newSpecialtyId"
                                                                component="div"
                                                                className="invalid-feedback"
                                                              />
                                                            </Col>
                                                          </Row>
                                                        </div>
                                                      ))}

                                                    {(selectedRequest &&
                                                      typeof selectedRequest ===
                                                        "string" &&
                                                      selectedRequest.includes(
                                                        "مقررات"
                                                      )) ||
                                                      (viewStudentRequest.requestId ==
                                                        31 && (
                                                        <div className="mb-3">
                                                          <Row>
                                                            <Col lg="4">
                                                              <Label className="form-label">
                                                                {this.props.t(
                                                                  "Transfer Courses"
                                                                )}
                                                              </Label>
                                                            </Col>
                                                            <Col lg="4">
                                                              <InputGroup>
                                                                <Field
                                                                  type="number"
                                                                  name="transferCourse"
                                                                  id="avg"
                                                                  className={`form-control`}
                                                                  value={
                                                                    courseNum ||
                                                                    0
                                                                  }
                                                                  readOnly
                                                                />
                                                                <div className="input-group-ques">
                                                                  <i
                                                                    className="mdi mdi-pencil font-size-18"
                                                                    id="edittooltip"
                                                                    onClick={() =>
                                                                      this.courseToggle()
                                                                    }
                                                                  ></i>
                                                                  <Modal
                                                                    isOpen={
                                                                      courseModal
                                                                    }
                                                                    className={
                                                                      this.props
                                                                        .className
                                                                    }
                                                                    size="xl"
                                                                  >
                                                                    <ModalHeader
                                                                      toggle={
                                                                        this
                                                                          .courseToggle
                                                                      }
                                                                      tag="h4"
                                                                    >
                                                                      {this.props.t(
                                                                        "Transfer Courses"
                                                                      )}
                                                                    </ModalHeader>
                                                                    <ModalBody>
                                                                      <Row>
                                                                        <Col lg="6">
                                                                          {emptyPrevError && (
                                                                            <Alert
                                                                              color="danger"
                                                                              className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                                              role="alert"
                                                                            >
                                                                              {
                                                                                emptyPrevError
                                                                              }
                                                                              <button
                                                                                type="button"
                                                                                className="btn-close"
                                                                                aria-label="Close"
                                                                                onClick={
                                                                                  this
                                                                                    .handleAlertClose
                                                                                }
                                                                              ></button>
                                                                            </Alert>
                                                                          )}
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
                                                                                    .handleAddPrevCourse
                                                                                }
                                                                              >
                                                                                <i className="mdi mdi-plus-circle blue-noti-icon" />
                                                                              </IconButton>
                                                                            </Tooltip>
                                                                          </div>
                                                                          <BootstrapTable
                                                                            keyField="Id"
                                                                            data={
                                                                              prevUnivCoursesArray !=
                                                                              null
                                                                                ? prevUnivCoursesArray
                                                                                : []
                                                                            }
                                                                            columns={
                                                                              viewprevUnivCoursesColumns
                                                                            }
                                                                            filter={filterFactory()}
                                                                            filterPosition="top"
                                                                            cellEdit={cellEditFactory(
                                                                              {
                                                                                mode: "click",
                                                                                blurToSave: true,
                                                                                afterSaveCell:
                                                                                  (
                                                                                    oldValue,
                                                                                    newValue,
                                                                                    row,
                                                                                    column
                                                                                  ) => {
                                                                                    this.handlePrevCourseDataChange(
                                                                                      row.Id,
                                                                                      column.dataField,
                                                                                      newValue
                                                                                    );
                                                                                  },
                                                                              }
                                                                            )}
                                                                            noDataIndication={t(
                                                                              "No Courses found"
                                                                            )}
                                                                            defaultSorted={
                                                                              defaultSorting
                                                                            }
                                                                          />
                                                                        </Col>
                                                                        <Col lg="6">
                                                                          {emptyTransferError && (
                                                                            <Alert
                                                                              color="danger"
                                                                              className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                                              role="alert"
                                                                            >
                                                                              {
                                                                                emptyTransferError
                                                                              }
                                                                              <button
                                                                                type="button"
                                                                                className="btn-close"
                                                                                aria-label="Close"
                                                                                onClick={
                                                                                  this
                                                                                    .handleAlertClose
                                                                                }
                                                                              ></button>
                                                                            </Alert>
                                                                          )}
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
                                                                                    .handleAddTransferCourse
                                                                                }
                                                                              >
                                                                                <i className="mdi mdi-plus-circle blue-noti-icon" />
                                                                              </IconButton>
                                                                            </Tooltip>
                                                                          </div>
                                                                          <BootstrapTable
                                                                            keyField="Id"
                                                                            data={
                                                                              transferCoursesArray !=
                                                                              null
                                                                                ? transferCoursesArray
                                                                                : []
                                                                            }
                                                                            columns={
                                                                              transferCoursesColumns
                                                                            }
                                                                            filter={filterFactory()}
                                                                            filterPosition="top"
                                                                            cellEdit={cellEditFactory(
                                                                              {
                                                                                mode: "click",
                                                                                blurToSave: true,
                                                                                afterSaveCell:
                                                                                  (
                                                                                    oldValue,
                                                                                    newValue,
                                                                                    row,
                                                                                    column
                                                                                  ) => {
                                                                                    this.handleTransferCourseDataChange(
                                                                                      row.Id,
                                                                                      column.dataField,
                                                                                      newValue
                                                                                    );
                                                                                  },
                                                                              }
                                                                            )}
                                                                            noDataIndication={t(
                                                                              "No Courses found"
                                                                            )}
                                                                            defaultSorted={
                                                                              defaultSorting
                                                                            }
                                                                          />
                                                                        </Col>
                                                                      </Row>
                                                                    </ModalBody>
                                                                  </Modal>
                                                                </div>
                                                              </InputGroup>
                                                            </Col>
                                                          </Row>
                                                        </div>
                                                      ))}

                                                    <div className="mb-3">
                                                      <Row>
                                                        <Col lg="4">
                                                          <label
                                                            htmlFor="requestOrganizer"
                                                            className="form-label d-flex"
                                                          >
                                                            {this.props.t(
                                                              "Request Organizer"
                                                            )}
                                                          </label>
                                                        </Col>
                                                        <Col lg="8">
                                                          <Field
                                                            name="requestOrganizer"
                                                            type="text"
                                                            className={`form-control`}
                                                            value={
                                                              requestOrgName
                                                            }
                                                            readOnly
                                                          />
                                                        </Col>
                                                      </Row>
                                                    </div>

                                                    <div className="mb-3">
                                                      <Row>
                                                        <Col lg="4">
                                                          <label
                                                            htmlFor="requestOrgNotes"
                                                            className="form-label d-flex"
                                                          >
                                                            {this.props.t(
                                                              "Request Organizer Notes"
                                                            )}
                                                          </label>
                                                        </Col>
                                                        <Col lg="8">
                                                          <Field
                                                            name="requestOrgNotes"
                                                            as="textarea"
                                                            className={`form-control ${
                                                              window.confirmWindowOpen
                                                                ? "is-invalid"
                                                                : ""
                                                            }`}
                                                            readOnly
                                                          />
                                                          <ErrorMessage
                                                            name="decreeOrgNotes"
                                                            component="div"
                                                            className="invalid-feedback"
                                                          />
                                                        </Col>
                                                      </Row>
                                                    </div>
                                                  </div>
                                                </CardBody>
                                              </Card>
                                              <Row>
                                                <Accordion defaultActiveKey="1">
                                                  <Accordion.Item eventKey="2">
                                                    <Accordion.Header>
                                                      {this.props.t(
                                                        "Decree Information"
                                                      )}
                                                    </Accordion.Header>
                                                    <Accordion.Body>
                                                      <div className="mb-3">
                                                        <Row>
                                                          <Col lg="4">
                                                            <label
                                                              htmlFor="decreeDate"
                                                              className="form-label d-flex"
                                                            >
                                                              {this.props.t(
                                                                "Decree Date"
                                                              )}
                                                            </label>
                                                          </Col>
                                                          <Col lg="8">
                                                            <Field
                                                              name="decreeDate"
                                                              type="date"
                                                              className={`form-control`}
                                                              onChange={
                                                                handleChange
                                                              }
                                                              readOnly={
                                                                selectedStatus !=
                                                                  4 || viewOnly
                                                              }
                                                            />
                                                          </Col>
                                                        </Row>
                                                      </div>

                                                      <div className="mb-3">
                                                        <Row>
                                                          <Col lg="4">
                                                            <label
                                                              htmlFor="decreeOrganizer"
                                                              className="form-label d-flex"
                                                            >
                                                              {this.props.t(
                                                                "Decree Organizer"
                                                              )}
                                                            </label>
                                                          </Col>
                                                          <Col lg="8">
                                                            <Field
                                                              name="decreeOrganizer"
                                                              type="text"
                                                              className={`form-control`}
                                                              onChange={
                                                                handleChange
                                                              }
                                                              value={
                                                                decreeOrgName
                                                              }
                                                              readOnly
                                                            />
                                                          </Col>
                                                        </Row>
                                                      </div>

                                                      <div className="mb-3">
                                                        <Row>
                                                          <Col lg="4">
                                                            <label
                                                              htmlFor="decreeOrgrNotes"
                                                              className="form-label d-flex"
                                                            >
                                                              {this.props.t(
                                                                "Decree Organizer Notes"
                                                              )}
                                                            </label>
                                                          </Col>
                                                          <Col lg="8">
                                                            <Field
                                                              name="decreeOrgNotes"
                                                              as="textarea"
                                                              className={`form-control`}
                                                              onChange={
                                                                handleChange
                                                              }
                                                              readOnly={
                                                                selectedStatus !=
                                                                  4 || viewOnly
                                                              }
                                                            />
                                                          </Col>
                                                        </Row>
                                                      </div>

                                                      <div className="mb-3">
                                                        <Row>
                                                          <Col lg="4">
                                                            <label
                                                              htmlFor="decreeStatus"
                                                              className="form-label d-flex"
                                                            >
                                                              {this.props.t(
                                                                "Request Status"
                                                              )}
                                                              <span className="text-danger">
                                                                *
                                                              </span>
                                                            </label>
                                                          </Col>
                                                          <Col lg="8">
                                                            <div className="d-flex flex-wrap gap-3">
                                                              <div
                                                                className="btn-group button-or"
                                                                role="group"
                                                              >
                                                                {decreeStatus.map(
                                                                  (
                                                                    status,
                                                                    index
                                                                  ) => (
                                                                    <React.Fragment
                                                                      key={
                                                                        index
                                                                      }
                                                                    >
                                                                      <input
                                                                        type="radio"
                                                                        className={`btn-check button-or ${
                                                                          selectedStatus ===
                                                                          status.Id
                                                                            ? "active"
                                                                            : ""
                                                                        }`}
                                                                        name="stateId"
                                                                        id={`btnradio${index}`}
                                                                        autoComplete="off"
                                                                        defaultChecked={
                                                                          selectedStatus ===
                                                                          status.Id
                                                                            ? "active"
                                                                            : ""
                                                                        }
                                                                        onChange={() =>
                                                                          setFieldValue(
                                                                            "stateId",
                                                                            status.Id
                                                                          )
                                                                        }
                                                                        disabled={
                                                                          viewOnly
                                                                        }
                                                                      />
                                                                      <label
                                                                        className="btn btn-outline-primary smallButton w-sm"
                                                                        htmlFor={`btnradio${index}`}
                                                                      >
                                                                        {
                                                                          status.arTitle
                                                                        }
                                                                      </label>
                                                                    </React.Fragment>
                                                                  )
                                                                )}
                                                              </div>
                                                            </div>
                                                          </Col>
                                                        </Row>
                                                      </div>
                                                    </Accordion.Body>
                                                  </Accordion.Item>
                                                </Accordion>
                                              </Row>
                                              {values["stateId"] == 2 && (
                                                <Row>
                                                  <Accordion defaultActiveKey="1">
                                                    <Accordion.Item eventKey="2">
                                                      <Accordion.Header>
                                                        {this.props.t(
                                                          "Folding Information"
                                                        )}
                                                      </Accordion.Header>
                                                      <Accordion.Body>
                                                        <div className="mb-3">
                                                          <Row>
                                                            <Col lg="4">
                                                              <label
                                                                htmlFor="foldingDate"
                                                                className="form-label d-flex"
                                                              >
                                                                {this.props.t(
                                                                  "Folding Date"
                                                                )}
                                                              </label>
                                                            </Col>
                                                            <Col lg="8">
                                                              <Field
                                                                name="foldingDate"
                                                                type="date"
                                                                className={`form-control`}
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                readOnly={
                                                                  selectedStatus ==
                                                                    2 ||
                                                                  viewOnly
                                                                }
                                                              />
                                                            </Col>
                                                          </Row>
                                                        </div>

                                                        <div className="mb-3">
                                                          <Row>
                                                            <Col lg="4">
                                                              <label
                                                                htmlFor="foldingOrganizer"
                                                                className="form-label d-flex"
                                                              >
                                                                {this.props.t(
                                                                  "Folding Organizer"
                                                                )}
                                                              </label>
                                                            </Col>
                                                            <Col lg="8">
                                                              <Field
                                                                name="foldingOrganizer"
                                                                type="text"
                                                                className={`form-control`}
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                value={
                                                                  foldingOrgName
                                                                }
                                                                readOnly
                                                              />
                                                            </Col>
                                                          </Row>
                                                        </div>

                                                        <div className="mb-3">
                                                          <Row>
                                                            <Col lg="4">
                                                              <label
                                                                htmlFor="foldingOrgNotes"
                                                                className="form-label d-flex"
                                                              >
                                                                {this.props.t(
                                                                  "Folding Organizer Notes"
                                                                )}
                                                              </label>
                                                            </Col>
                                                            <Col lg="8">
                                                              <Field
                                                                name="foldingOrgNotes"
                                                                as="textarea"
                                                                className={`form-control`}
                                                                onChange={
                                                                  handleChange
                                                                }
                                                                readOnly={
                                                                  selectedStatus ==
                                                                    2 ||
                                                                  viewOnly
                                                                }
                                                              />
                                                            </Col>
                                                          </Row>
                                                        </div>
                                                      </Accordion.Body>
                                                    </Accordion.Item>
                                                  </Accordion>
                                                </Row>
                                              )}

                                              {!viewOnly && (
                                                <div className="d-flex justify-content-center">
                                                  <button
                                                    type="submit"
                                                    className="btn btn-primary"
                                                  >
                                                    {this.props.t("Save")}
                                                  </button>
                                                </div>
                                              )}
                                            </Form>
                                          )}
                                        </Formik>
                                      </Col>
                                      {!viewOnly && (
                                        <Col lg="8">
                                          <Row>
                                            <Card>
                                              <CardTitle id="add_header">
                                                {this.props.t(
                                                  "Students Requests"
                                                )}
                                              </CardTitle>
                                              <CardBody>
                                                <Row>
                                                  <BootstrapTable
                                                    keyField="Id"
                                                    data={studentRequestsArray}
                                                    columns={
                                                      studentRequestsColumns
                                                    }
                                                    noDataIndication={t(
                                                      "No Warning Rules Definition found"
                                                    )}
                                                    defaultSorted={
                                                      defaultSorting
                                                    }
                                                    filter={filterFactory()}
                                                  />
                                                </Row>
                                              </CardBody>
                                            </Card>
                                          </Row>

                                          <Row>
                                            <Card>
                                              <CardTitle id="add_header">
                                                {this.props.t(
                                                  "Students Requests (Register)"
                                                )}
                                              </CardTitle>
                                              <CardBody>
                                                <Row>
                                                  <BootstrapTable
                                                    keyField="Id"
                                                    data={
                                                      stdRequestRegisterData
                                                    }
                                                    columns={
                                                      stdRequestRegisterColumns
                                                    }
                                                    noDataIndication={t(
                                                      "No Warning Rules Definition found"
                                                    )}
                                                    defaultSorted={
                                                      defaultSorting
                                                    }
                                                    filter={filterFactory()}
                                                  />
                                                </Row>
                                              </CardBody>
                                            </Card>
                                          </Row>
                                        </Col>
                                      )}
                                    </Row>
                                  </ModalBody>
                                </Modal>

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
                    </div>
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
  studentsRequests,
  regReqDocuments,
  documents,
  semesters,
  menu_items,
  years,
  requests,
  generalManagements,
  transportLines,
  studentsDecrees,
  courses,
  userMngs,
  academiccertificates,
}) => ({
  studentsRequests: studentsRequests.studentsRequests,
  prevUnivCourses: studentsRequests.prevUnivCourses,
  transferCourses: studentsRequests.transferCourses,
  lastReqNum: studentsRequests.lastReqNum,
  regReqDocuments: regReqDocuments.regReqDocuments,
  univStds: transportLines.univStds,
  deleted: regReqDocuments.deleted,
  currentSemester: semesters.currentSemester,
  years: years.years,
  user_menu: menu_items.user_menu || [],
  requests: requests.requests,
  yearSemesters: generalManagements.yearSemesters,
  decreeStatus: studentsDecrees.decreeStatus,
  coursesOpt: courses.coursesOpt,
  academiccertificates: academiccertificates.academiccertificates,
  userMngs: userMngs.userMngs,
  userId: localStorage.getItem("userId"),
});

const mapDispatchToProps = dispatch => ({
  onGetStudentsRequests: regReqDocs =>
    dispatch(getStudentsRequests(regReqDocs)),
  onCopyRegReqDoc: () => dispatch(copyRegReqDoc()),
  onAddNewStudentRequest: stdRequest =>
    dispatch(addNewStudentRequest(stdRequest)),
  onUpdateStudentRequest: stdRequest =>
    dispatch(updateStudentRequest(stdRequest)),
  onDeleteStudentRequest: stdRequest =>
    dispatch(deleteStudentRequest(stdRequest)),
  onGetStudentRequestDeletedValue: () =>
    dispatch(getStudentRequestDeletedValue()),
  onGetCurrentSemester: () => dispatch(getCurrentSemester()),
  onGetUnivStds: () => dispatch(getUnivStdDataList()),
  onAddNewTransferCourse: transferCourse =>
    dispatch(addNewTransferCourse(transferCourse)),
  onUpdateTransferCourse: transferCourse =>
    dispatch(updateTransferCourse(transferCourse)),
  onUpdateTransferCourseState: transferCourse =>
    dispatch(updateTransferCourseState(transferCourse)),
  onDeleteTransferCourse: transferCourse =>
    dispatch(deleteTransferCourse(transferCourse)),
  onAddNewPrevUnivCourse: prevUnivCourse =>
    dispatch(addNewPrevUnivCourse(prevUnivCourse)),
  onUpdatePrevUnivCourse: prevUnivCourse =>
    dispatch(updatePrevUnivCourse(prevUnivCourse)),
  onDeletePrevUnivCourse: prevUnivCourse =>
    dispatch(deletePrevUnivCourse(prevUnivCourse)),
  onGetCoursesInfo: regReqDocs => dispatch(getTransferCourses(regReqDocs)),
  onGetUserMngs: () => dispatch(getUserMngs()),
  onGetLastReqNum: reqId => dispatch(getLastReqNum(reqId)),
  onGetRequestDetails: () => dispatch(getRequestDetails()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(StudentsRequests)));
