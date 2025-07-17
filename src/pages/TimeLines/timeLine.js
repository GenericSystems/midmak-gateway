import React, { Component } from "react";
import PropTypes, { node } from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  TabPane,
  TabContent,
  NavLink,
  Nav,
  NavItem,
  CardTitle,
  Alert,
  Form,
  FormGroup,
  InputGroup,
  Input,
} from "reactstrap";
import Select from "react-select";
import { Link } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import { Hidden, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Breadcrumbs from "components/Common/Breadcrumb";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import Tooltip from "@mui/material/Tooltip";
import {
  getTimeLines,
  addNewTimeLine,
  updateTimeLine,
  deleteTimeLine,
  getTimeLineDeletedValue,
  getRequestsPeriodAllowance,
  getRequestsPeriodAllowanceTime,
  updateRequestsPeriodAllowanceTime,
  generalizeRequestsPeriodAllowanceTime,
  getRequestsPeriodPermission,
  updateRequestsPeriodPermission,
  addRequestsPeriodPermission,
  deleteRequestsPeriodPermission,
} from "store/timeline/actions";
import filterFactory, {
  textFilter,
  customFilter,
} from "react-bootstrap-table2-filter";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import classnames from "classnames";
import { isEmpty, size, map, max } from "lodash";

import { Treebeard } from "react-treebeard";
import DeleteModal from "components/Common/DeleteModal";

import "../../assets/scss/custom/pages/_time-line.scss";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
} from "../../utils/menuUtils";
import { timeLines } from "common/data";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
class TimeLines extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeLines: [],
      timeLine: "",
      deleteModal: false,
      cursor: null,
      selectedNode: null,
      addForm: false,
      newName: "",
      newStartDate: "",
      newEndDate: "",
      newCode: "",
      editForm: false,
      editName: "",
      editStartDate: "",
      editEndDate: "",
      editCode: "",
      errorMessage: null,
      successMessage: null,
      yearNameError: false,
      saveError: false,
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      modal: false,
      permissionModal: false,
      deletePermissionModal: false,
      sidebarOpen: true,
      adOfficeApp: true,
      regOfficeApp: false,
      requestToReg: false,
      checkAndArchive: false,
      reqToChangeMarks: false,
      docRequest: false,
      activeTab: "0",
      checkedId: null,
      fileterdDepar: [],
      errorDateMessage: "",
      startDateErrors: {},
      endDateErrors: {},
      startTimeErrors: {},
      endTimeErrors: {},
      timeLines: this.reverseTree(props.timeLines),
    };
    this.onToggle = this.onToggle.bind(this);
    this.onNodeClick = this.onNodeClick.bind(this);
    this.handleShowColumn = this.handleShowColumn.bind(this);
  }

  componentDidMount() {
    const {
      timeLines,
      onGetTimeLines,
      user_menu,
      deleted,
      requestsPeriodAllowance,
      requestsPeriodAllowanceTime,
      requestsPeriodPermission,
      faculties,
      levels,
      departments,
    } = this.props;

    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    if (timeLines && !timeLines.length) {
      onGetTimeLines();
    }
    this.setState({
      timeLines,
      deleted,
      requestsPeriodAllowance,
      requestsPeriodAllowanceTime,
      requestsPeriodPermission,
      faculties,
      levels,
      departments,
    });
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
    }
    if (prevProps.timeLines !== this.props.timeLines) {
      this.setState({ timeLines: this.reverseTree(this.props.timeLines) });
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

  handleAddNode = () => {
    this.setState({
      newName: "",
      newCode: "",
      newStartDate: "",
      newEndDate: "",
      addForm: true,
      editForm: false,
    });
  };

  handleDeleteNode = () => {
    const { selectedNode, showAlert } = this.state;
    const { onDeleteTimeLine } = this.props;
    const obj = { Id: selectedNode.Id };
    onDeleteTimeLine(obj);
    this.setState({
      selectedNode: null,
      addForm: false,
      editForm: false,
      deleteModal: false,
      showAlert: true,
    });
  };

  handleTimeLineDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateTimeLine } = this.props;
    let onUpdate = { Id: rowId, [fieldName]: fieldValue };
    onUpdateTimeLine(onUpdate);
  };

  handleInputNewChange = (fieldName, value) => {
    if (fieldName == "name") {
      this.setState({ newName: value });
    }
    if (fieldName == "Code") {
      this.setState({ newCode: value });
    }

    if (fieldName == "startDate") {
      this.setState({ newStartDate: value });
    }

    if (fieldName == "endDate") {
      if (new Date(value) > new Date(this.state.newStartDate)) {
        this.setState({ newEndDate: value });
      } else {
        const errorDate = this.props.t(
          "End date must be greater than start date"
        );
        this.setState({ errorMessage: errorDate });
      }
    }
  };

  handleInputEditChange = (fieldName, value) => {
    if (fieldName == "name") {
      this.setState({ editName: value });
    }
    if (fieldName == "Code") {
      this.setState({ editCode: value });
    }

    if (fieldName == "startDate") {
      this.setState({ editStartDate: value });
    }

    if (fieldName == "endDate") {
      if (new Date(value) > new Date(this.state.editStartDate)) {
        this.setState({ editEndDate: value });
      } else {
        const errorDate = this.props.t(
          "End date must be greater than start date"
        );
        this.setState({ errorMessage: errorDate });
      }
    }
  };

  onToggle = (node, toggled) => {
    const { cursor, timeLines } = this.state;

    if (cursor) {
      cursor.active = false;
    }

    node.active = true;
    node.toggled = toggled;

    this.setState({
      cursor: node,
      timeLines: [...timeLines],
      addForm: false,
    });
  };

  onNodeClick(node) {
    const { onGetRequestsPeriodAllowance } = this.props;
    onGetRequestsPeriodAllowance();
    this.setState({
      selectedNode: node,
      editForm: true,
      addForm: false,
      editName: node.name,
      editStartDate: node.startDate,
      editEndDate: node.endDate,
      editCode: node.Code,
      selectedYearId: node.Id,
    });
  }

  handleSaveNewTimeLine = () => {
    const { newName, newStartDate, newEndDate, newCode } = this.state;
    const { onAddNewTimeLine, timeLines } = this.props;
    if (newName.trim() === "") {
      this.setState({ yearNameError: true, saveError: true });
    } else {
      this.setState({ yearNameError: false, saveError: false });

      const isDuplicateYear = timeLines.some(
        timeLine => timeLine.name && timeLine.name.trim() === newName.trim()
      );

      if (isDuplicateYear) {
        const duplicateErrorMessage = this.props.t("Year already exists");
        this.setState({
          errorMessage: duplicateErrorMessage,
          successMessage: null,
        });
      } else {
        const successSavedMessage = this.props.t("Year saved successfully");
        this.setState({
          successMessage: successSavedMessage,
          errorMessage: null,
        });

        const obj = {
          arTitle: newName,
          startDate: newStartDate,
          endDate: newEndDate,
          Code: newCode,
        };
        onAddNewTimeLine(obj);
      }
    }
  };

  handleSaveEditTimeLine = () => {
    const { editName, editStartDate, editEndDate, editCode, selectedNode } =
      this.state;
    const { onUpdateTimeLine } = this.props;
    if (selectedNode && selectedNode.flag === 1) {
      const obj = {
        Id: selectedNode.Id,
        startDate: editStartDate,
        endDate: editEndDate,
        Code: editCode,
      };
      obj["tablename"] = "Common_Timeline";
      onUpdateTimeLine(obj);
    }

    if (selectedNode && selectedNode.flag === 0) {
      const startDateString = editStartDate;

      const startDate = new Date(startDateString);
      const startYear = startDate.getFullYear();
      const startMonth = String(startDate.getMonth() + 1).padStart(2, "0");
      const startDay = String(startDate.getDate()).padStart(2, "0");

      const formattedStartDate = `${startYear}-${startMonth}-${startDay}`;

      const endDateString = editEndDate;
      const endDate = new Date(endDateString);
      const endYear = endDate.getFullYear();
      const endMonth = String(endDate.getMonth() + 1).padStart(2, "0");
      const endDay = String(endDate.getDate()).padStart(2, "0");

      const formattedEndDate = `${endYear}-${endMonth}-${endDay}`;
      const obj = {
        Id: selectedNode.Id,
        arTitle: editName,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        Code: editCode,
      };
      obj["tablename"] = "settings_Years";
      onUpdateTimeLine(obj);
    }

    const successUpdatedMessage = this.props.t("TimeLine updated successfully");
    this.setState({ successMessage: successUpdatedMessage });
  };

  handleChangeTimeLine = () => {
    this.toggle();

    const { onGetRequestsPeriodAllowanceTime, requestsPeriodAllowance } =
      this.props;
    const { selectedYearId, activeTab } = this.state;

    let obj = {
      yearSemesterId: selectedYearId,
      requestsPeriodId: requestsPeriodAllowance[0].Id,
    };
    if (activeTab == 0) {
      obj["tablename"] = "settings_requestsPeriodAllowanceTime";
    } else if (activeTab == 1) {
      obj["tablename"] = "settings_mobileRequestsPeriodAllowanceTime";
    }

    onGetRequestsPeriodAllowanceTime(obj);
    this.setState({
      checkedId: requestsPeriodAllowance[0].Id,
    });
  };

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  togglePermission = () => {
    this.setState(prevState => ({
      permissionModal: !prevState.permissionModal,
    }));
  };

  toggleSidebar = () => {
    this.setState(prevState => ({
      sidebarOpen: !prevState.sidebarOpen,
    }));
  };

  handleResetData = () => {
    this.setState({
      newName: "",
      newCode: "",
      newStartDate: "",
      newEndDate: "",
    });
  };

  handleErrorClose = () => {
    this.setState({ errorMessage: null });
  };

  handleSuccessClose = () => {
    this.setState({ successMessage: null });
  };

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  onClickDelete = student => {
    this.setState({ student: student });
    this.setState({ deleteModal: true });
  };

  handleDeletedSuccessClose = () => {
    const { onGetTimeLineDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetTimeLineDeletedValue();
  };

  handleDeletedErrorClose = () => {
    const { onGetTimeLineDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetTimeLineDeletedValue();
  };

  handleShowColumn = (fieldName, Id) => {
    const { onGetRequestsPeriodAllowanceTime } = this.props;
    const { selectedYearId, activeTab } = this.state;

    let obj = { yearSemesterId: selectedYearId, requestsPeriodId: Id };
    if (activeTab == 0) {
      obj["tablename"] = "settings_requestsPeriodAllowanceTime";
    } else if (activeTab == 1) {
      obj["tablename"] = "settings_mobileRequestsPeriodAllowanceTime";
    }
    onGetRequestsPeriodAllowanceTime(obj);

    this.setState({ checkedId: Id });
  };

  toggle1(tab) {
    const { onGetRequestsPeriodAllowanceTime } = this.props;
    const { selectedYearId, checkedId } = this.state;

    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });

      let obj = { yearSemesterId: selectedYearId, requestsPeriodId: checkedId };
      if (tab == 0) {
        obj["tablename"] = "settings_requestsPeriodAllowanceTime";
      } else if (tab == 1) {
        obj["tablename"] = "settings_mobileRequestsPeriodAllowanceTime";
      }
      onGetRequestsPeriodAllowanceTime(obj);
    }
  }

  reverseTreeChildren = node => {
    if (node.children && node.children.length > 0) {
      const reversedChildren = node.children
        .map(this.reverseTreeChildren)
        .reverse();
      return { ...node, children: reversedChildren, toggled: false };
    }
    return { ...node, toggled: false };
  };

  reverseTree = treeData => {
    return treeData.map(this.reverseTreeChildren);
  };

  handleRequestPeriodDataChange = (rowId, fieldName, fieldValue) => {
    const { activeTab } = this.state;
    const { onUpdateRequestsPeriodAllowanceTime } = this.props;
    let onUpdate = { Id: rowId, [fieldName]: fieldValue };

    if (activeTab == 0) {
      onUpdate["tablename"] = "settings_requestsPeriodAllowanceTime";
    } else if (activeTab == 1) {
      onUpdate["tablename"] = "settings_mobileRequestsPeriodAllowanceTime";
    }

    onUpdateRequestsPeriodAllowanceTime(onUpdate);
  };

  handleRequestPeriodTimeChange = (rowId, fieldName, fieldValue) => {
    const { activeTab } = this.state;
    const { onUpdateRequestsPeriodAllowanceTime } = this.props;
    const date = new Date(fieldValue);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    const time = `${hours}:${minutes}:${seconds}`;
    console.log(time);
    let onUpdate = { Id: rowId, [fieldName]: time };

    if (activeTab == 0) {
      onUpdate["tablename"] = "settings_requestsPeriodAllowanceTime";
    } else if (activeTab == 1) {
      onUpdate["tablename"] = "settings_mobileRequestsPeriodAllowanceTime";
    }

    onUpdateRequestsPeriodAllowanceTime(onUpdate);
  };

  handleRequestPeriodTimePermissionChange = (rowId, fieldName, fieldValue) => {
    const { activeTab } = this.state;
    const { onUpdateRequestsPeriodPermission } = this.props;
    const date = new Date(fieldValue);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    const time = `${hours}:${minutes}:${seconds}`;
    let onUpdate = { Id: rowId, [fieldName]: time };

    if (activeTab == 0) {
      onUpdate["tablename"] = "settings_requestsPeriodPermission";
    } else if (activeTab == 1) {
      onUpdate["tablename"] = "settings_mobileRequestsPeriodPermission";
    }

    onUpdateRequestsPeriodPermission(onUpdate);
  };

  onClickGeneralize = clickedRow => {
    const formatDate = dateString => {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    };

    const formattedStartDate = clickedRow.startDate
      ? formatDate(clickedRow.startDate)
      : "";
    const formattedEndDate =
      clickedRow.endDate && clickedRow.endDate !== "0000-00-00"
        ? formatDate(clickedRow.endDate)
        : "";
    const { onGeneralizeRequestsPeriodAllowanceTime } = this.props;
    const { selectedYearId, activeTab, checkedId } = this.state;
    let generalizedObj = {
      Id: clickedRow.Id,
      yearSemesterId: selectedYearId,
      requestsPeriodId: checkedId,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      startTime: clickedRow.startTime,
      endTime: clickedRow.endTime,
    };

    if (activeTab == 0) {
      generalizedObj["tablename"] = "settings_requestsPeriodAllowanceTime";
    } else if (activeTab == 1) {
      generalizedObj["tablename"] =
        "settings_mobileRequestsPeriodAllowanceTime";
    }
    onGeneralizeRequestsPeriodAllowanceTime(generalizedObj);
  };

  onClickPermission = row => {
    this.togglePermission();
    const { onGetRequestsPeriodPermission } = this.props;
    const { activeTab } = this.state;
    this.setState({ selectedPeriodTime: row.Id });
    let obj = { requestsPeriodTimeId: row.Id };
    if (activeTab == 0) {
      obj["tablename"] = "settings_requestsPeriodPermission";
    } else if (activeTab == 1) {
      obj["tablename"] = "settings_mobileRequestsPeriodPermission";
    }
    onGetRequestsPeriodPermission(obj);
  };

  handleAddPermissionRow = () => {
    const { onAddRequestsPeriodPermission, requestsPeriodPermission } =
      this.props;
    const { activeTab, selectedPeriodTime } = this.state;
    const today = new Date().toISOString().split("T")[0];
    let newRow = {
      startDate: today,
      endDate: today,
    };
    let emptyRow = requestsPeriodPermission.some(
      permission => permission.facultyId === null
    );

    if (emptyRow) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      if (activeTab == 0) {
        newRow["requestsPeriodTimeId"] = selectedPeriodTime;
        newRow["tablename"] = "settings_requestsPeriodPermission";
      } else if (activeTab == 1) {
        newRow["mobileRequestsPeriodTimeId"] = selectedPeriodTime;
        newRow["tablename"] = "settings_mobileRequestsPeriodPermission";
      }
      onAddRequestsPeriodPermission(newRow);
    }
  };

  handleSelectOption = (fieldName, selectedValue, rowId) => {
    const { onUpdateRequestsPeriodPermission, faculties, departments, levels } =
      this.props;
    const { activeTab } = this.state;
    let obj = {};

    if (fieldName == "facultyId") {
      const facultyObj = faculties.find(
        faculty => faculty.value === selectedValue
      );
      if (facultyObj) {
        obj = { Id: rowId, facultyId: facultyObj.key };

        if (activeTab == 0) {
          obj["tablename"] = "settings_requestsPeriodPermission";
        } else if (activeTab == 1) {
          obj["tablename"] = "settings_mobileRequestsPeriodPermission";
        }
        onUpdateRequestsPeriodPermission(obj);
      }
    } else if (fieldName == "levelId") {
      const levelObj = levels.find(level => level.value === selectedValue);

      if (levelObj) {
        obj = { Id: rowId, levelId: levelObj.key };
        if (activeTab == 0) {
          obj["tablename"] = "settings_requestsPeriodPermission";
        } else if (activeTab == 1) {
          obj["tablename"] = "settings_mobileRequestsPeriodPermission";
        }
        onUpdateRequestsPeriodPermission(obj);
      }
    } else if (fieldName == "majorId") {
      const departmentObj = departments.find(
        department => department.value === selectedValue
      );
      if (departmentObj) {
        obj = { Id: rowId, majorId: departmentObj.key };
        if (activeTab == 0) {
          obj["tablename"] = "settings_requestsPeriodPermission";
        } else if (activeTab == 1) {
          obj["tablename"] = "settings_mobileRequestsPeriodPermission";
        }
        onUpdateRequestsPeriodPermission(obj);
      }
    }
  };

  handleDeletePermissionRow = () => {
    const { onDeleteRequestsPeriodPermission } = this.props;
    const { selectedRow, activeTab } = this.state;
    if (activeTab == 0) {
      selectedRow["tablename"] = "settings_requestsPeriodPermission";
    } else if (activeTab == 1) {
      selectedRow["tablename"] = "settings_mobileRequestsPeriodPermission";
    }
    onDeleteRequestsPeriodPermission(selectedRow);
    this.setState({ deletePermissionModal: false, selectedRow: null });
  };

  onClickDeletePermission = rowId => {
    this.setState({ selectedRow: rowId, deletePermissionModal: true });
  };

  handleRequestPeriodPermissionDataChange = (rowId, fieldName, fieldValue) => {
    const { activeTab } = this.state;
    const { onUpdateRequestsPeriodPermission } = this.props;
    let onUpdate = { Id: rowId, [fieldName]: fieldValue };

    if (activeTab == 0) {
      onUpdate["tablename"] = "settings_requestsPeriodPermission";
    } else if (activeTab == 1) {
      onUpdate["tablename"] = "settings_mobileRequestsPeriodPermission";
    }
    onUpdateRequestsPeriodPermission(onUpdate);
    this.handleAlertClose();
  };

  handleSelectDepartment = (fieldName, selectedValue, rowId) => {
    const { onUpdateRequestsPeriodPermission } = this.props;
    const { activeTab } = this.state;
    if (fieldName == "majorId") {
      let onUpdate = { Id: rowId, [fieldName]: selectedValue };

      if (activeTab == 0) {
        onUpdate["tablename"] = "settings_requestsPeriodPermission";
      } else if (activeTab == 1) {
        onUpdate["tablename"] = "settings_mobileRequestsPeriodPermission";
      }

      onUpdateRequestsPeriodPermission(onUpdate);
    }
  };

  handleErrorTime = () => {
    this.setState({
      errorTimeMessage: "End time must be greater than  start time",
    });
  };

  handleAlertClose = () => {
    this.setState({ errorDateMessage: null, errorTimeMessage: null });
  };

  resetPermission = (row) => {
    const { onUpdateRequestsPeriodPermission } = this.props;
  
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];
  
    let resetRow = {
      Id :row.Id,
      startDate: formattedToday,
      endDate: formattedToday,
      startTime: "00:00:00",
      endTime: "00:00:00",
      facultyId: null,
      fromDoneHour: 0,
      fromGPA: 0,
      levelId: null,
      majorId: null,
      toDoneHour: 0,
      toGPA: 0,
    };
    const { activeTab } = this.state;

      if (activeTab == 0) {
        resetRow["tablename"] = "settings_requestsPeriodPermission";
      } else if (activeTab == 1) {
        resetRow["tablename"] = "settings_mobileRequestsPeriodPermission";

    }

    onUpdateRequestsPeriodPermission(resetRow);
  }
  

  render() {
    const {
      t,
      timeLines,
      deleted,
      requestsPeriodAllowance,
      requestsPeriodAllowanceTime,
      requestsPeriodPermission,
      faculties,
      levels,
      departments,
    } = this.props;
    const { SearchBar } = Search;
    const {
      cursor,
      selectedNode,
      addForm,
      editForm,
      newName,
      newStartDate,
      newEndDate,
      newCode,
      editName,
      editStartDate,
      editEndDate,
      editCode,
      successMessage,
      errorMessage,
      yearNameError,
      deleteModal,
      showAlert,
      showAddButton,
      showDeleteButton,
      showEditButton,
      modal,
      permissionModal,
      sidebarOpen,
      checkedId,
      deletePermissionModal,
      endDateErrors,
      errorDateMessage,
      errorTimeMessage,
      startTimeErrors,
      endTimeErrors,
    } = this.state;

    const reversedTimeLines = this.reverseTree(this.state.timeLines);

    const alertMessage =
      deleted == 0 ? "Can't Delete " : "Deleted Successfully";

    const treeStyle = {
      tree: {
        base: {
          listStyle: "none",
          backgroundColor: "#F8F8F8",
          margin: 0,
          padding: "5px",
          color: "gery",
          fontFamily: "lucida grande ,tahoma,verdana,arial,sans-serif",
          fontSize: "14px",
        },
        node: {
          link: {
            cursor: "pointer",
            listStyle: "none",
            height: "30px",
            lineHeight: "30px",
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid lightblue",
          },
          activeLink: {
            background: "#A3D2E7",
            arrow: {
              fill: "white",
            },
          },
          toggle: {
            base: {
              margin: "5px",
              display: "inline-block",
              marginLeft: "-5px",
              width: "24px",
              height: "24px",
            },
            wrapper: {
              top: "50%",
              left: "50%",
              //   margin: "-7px 0 0 -7px",
              height: "14px",
            },
            height: 10,
            width: 10,
            arrow: {
              fill: "#0086BF",
              position: "left",
            },
          },
          header: {
            base: {
              display: "inline-block",
              verticalAlign: "top",
              color: "#333",
            },
            connector: {
              width: "2px",
              height: "12px",
              borderLeft: "solid 2px black",
              borderBottom: "solid 2px black",
              position: "absolute",
              top: "0px",
              left: "-21px",
            },
            title: {
              lineHeight: "24px",
              verticalAlign: "middle",
            },
          },
          subtree: {
            listStyle: "none",
            paddingRight: "30px",
          },
        },
      },
    };
    const addButtonStyle = {
      color: "#FFFFFF",
      textAlign: "left",
      marginLeft: "-3%",
    };
    const deleteButtonStyle = {
      color: "#FFFFFF",
      textAlign: "left",
    };

    const startDateString = editStartDate;
    const startDate = new Date(startDateString);

    const startYear = startDate.getFullYear();
    const startMonth = String(startDate.getMonth() + 1).padStart(2, "0");
    const startDay = String(startDate.getDate()).padStart(2, "0");

    const formattedStartDate = `${startYear}-${startMonth}-${startDay}`;

    const endDateString = editEndDate;
    const endDate = new Date(endDateString);

    const endYear = endDate.getFullYear();
    const endMonth = String(endDate.getMonth() + 1).padStart(2, "0");
    const endDay = String(endDate.getDate()).padStart(2, "0");

    const formattedEndDate = `${endYear}-${endMonth}-${endDay}`;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: timeLines.length,
      custom: true,
    };

    const columns = [
      {
        dataField: "Id",
        text: "ID",
        editable: false,
        sort: true,
        hidden: true,
      },
      {
        dataField: "arTitle",
        text: this.props.t("Period"),
        editable: false,
        sort: true,
      },
      {
        dataField: "startTime",
        text: this.props.t("Start Time"),
        sort: true,
        editable: false,
        formatter: (cellContent, row, column) => (
            <Input
            className="form-control"
            type="time"
            value={row.startTime}
            onChange={newValue => {
              this.handleRequestPeriodDataChange(
                row.Id,
                "startTime",
                newValue.target.value
              );
            }}
            disabled={!showEditButton}
          /> 
        ),
      },
      {
        dataField: "startDate",
        text: this.props.t("Start Date"),
        sort: true,
        editable: false,
        formatter: (cellContent, row, column) => {
          const endDate = row.endDate ? new Date(row.endDate) : null;
          const startDate = row.startDate ? new Date(row.startDate) : null;
          const formattedEndDate = endDate
            ? endDate.toISOString().split("T")[0]
            : "";
          const formattedStartDate = startDate
            ? startDate.toISOString().split("T")[0]
            : "";

          return (
            <input
              className="form-control"
              type="date"
              value={formattedStartDate}
              max={formattedEndDate}
              onChange={newValue => {
                this.handleRequestPeriodDataChange(
                  row.Id,
                  "startDate",
                  newValue.target.value
                );
              }}
              disabled={!showEditButton}
            />
          );
        },
      },
      {
        dataField: "endTime",
        text: this.props.t("End Time"),
        sort: true,
        editable: false,
        formatter: (cellContent, row, column) => (
            <Input
            className="form-control"
            type="time"
            value={row.endTime}
            onChange={newValue => {
              this.handleRequestPeriodDataChange(
                row.Id,
                "endTime",
                newValue.target.value
              );
            }}
            disabled={!showEditButton}
          /> 
         
        ),
      },
      {
        dataField: "endDate",
        text: this.props.t("End Date"),
        sort: true,
        editable: false,
        formatter: (cellContent, row, column) => {
          const endDate = row.endDate ? new Date(row.endDate) : null;
          const startDate = row.startDate ? new Date(row.startDate) : null;
          const formattedEndDate = endDate
            ? endDate.toISOString().split("T")[0]
            : "";
          const formattedStartDate = startDate
            ? startDate.toISOString().split("T")[0]
            : "";

          return (
            <input
              className="form-control"
              type="date"
              value={formattedEndDate}
              min={formattedStartDate}
              onChange={newValue => {
                this.handleRequestPeriodDataChange(
                  row.Id,
                  "endDate",
                  newValue.target.value
                );
              }}
              disabled={!showEditButton}
            />
          );
        },
      },
      {
        dataField: "permissions",
        text: this.props.t("Permissions"),
        isDummyField: true,
        editable: false,
        formatter: (cellContent, timeLine) => (
          <Link className="text-warning" to="#">
            <i
              className="dripicons-warning font-size-18"
              id="deletetooltip"
              onClick={() => this.onClickPermission(timeLine)}
            ></i>
          </Link>
        ),
      },
      {
        dataField: "generalize",
        text: this.props.t("Generalize"),
        editable: false,
        hidden: !showEditButton,
        formatter: (cellContent, timeLine) => (
          <div className="d-flex gap-3">
              
             <Tooltip
              title={this.props.t("Generalize")}
              onClick={() => this.onClickGeneralize(timeLine)}
              placement="top"
            >
              <IconButton color="primary" id="TooltipTop">
                <i   className="mdi mdi-content-copy" />
              </IconButton>
            </Tooltip>
        
          </div>
        )}
      
    ];

    const permissionColumns = [
      {
        dataField: "Id",
        text: "ID",
        editable: false,
        sort: true,
        hidden: true,
      },
      {
        dataField: "facultyId",
        text: this.props.t("Faculty"),
        formatter: (cell, row) => (
          <div>
            <Input
              type="text"
              id="facultyId"
              key="faculty_select"
              list="FacultydatalistOptions"
              className="form-control"
              placeholder="search..."
              defaultValue={
                (faculties.find(faculty => faculty.key === row.facultyId) || {})
                  .value
              }
              onChange={event => {
                this.handleSelectOption(
                  "facultyId",
                  event.target.value,
                  row.Id
                );
              }}
              autoComplete="off"
              disabled={!showEditButton}
            />

            <datalist id="FacultydatalistOptions">
              {faculties.map(faculty => (
                <option key={faculty.key} value={faculty.value} />
              ))}
            </datalist>
          </div>
        ),
        editable: false,
        sort: true,
      },
      {
        dataField: "majorId",
        text: this.props.t("Major"),
        sort: true,
        formatter: (cell, row) => {
          const newfacultyId = row.facultyId;
          const filteredDepars = departments.filter(
            depar => depar.facultyId === newfacultyId
          );
          return (
            <div>
              <Select
                className={`select-style-std`}
                name="majorId"
                key={`planStudy_select`}
                options={filteredDepars}
                onChange={newValue => {
                  this.handleSelectDepartment(
                    "majorId",
                    newValue.value,
                    row.Id
                  );
                }}
                defaultValue={departments.find(
                  opt => opt.value === row.majorId
                )}
                isDisabled={!showEditButton}
              />
            </div>
          );
        },
        editable: false,
        headerStyle: { width: "150px" },
        style: { width: "150px" },
      },
      {
        dataField: "levelId",
        text: this.props.t("Study Level"),
        sort: true,
        formatter: (cell, row) => (
          <div>
            <Input
              type="text"
              id="levelId"
              key="level_select"
              list="leveldatalistOptions"
              className="form-control"
              placeholder="search..."
              defaultValue={
                (levels.find(level => level.key === row.levelId) || {}).value
              }
              onChange={event => {
                this.handleSelectOption("levelId", event.target.value, row.Id);
              }}
              autoComplete="off"
              disabled={!showEditButton}
            />

            <datalist id="leveldatalistOptions">
              {levels.map(level => (
                <option key={level.key} value={level.value} />
              ))}
            </datalist>
          </div>
        ),
        editable: false,
      },
      {
        dataField: "fromDoneHour",
        text: this.props.t("From Hour"),
        sort: true,
        editable : showEditButton
      },
      {
        dataField: "toDoneHour",
        text: this.props.t("To Hour"),
        sort: true,
        editable : showEditButton
      },
      {
        dataField: "fromGPA",
        text: this.props.t("From GPA"),
        sort: true,
        editable : showEditButton
      },
      {
        dataField: "toGPA",
        text: this.props.t("To GPA"),
        sort: true,
        editable : showEditButton
      },
      {
        dataField: "startTime",
        text: this.props.t("Start Time"),
        sort: true,
        editable: false,
        formatter: (cellContent, row, column) => (
          <Input
            className="form-control"
            type="time"
            value={row.startTime}
            onChange={newValue => {
              this.handleRequestPeriodPermissionDataChange(
                row.Id,
                "startTime",
                newValue.target.value
              );
            }}
            disabled={!showEditButton}
          /> 

         
        ),
      },

      {
        dataField: "startDate",
        text: this.props.t("Start Date"),
        sort: true,
        editable: false,
        formatter: (cellContent, row, column) => {
          const isValidDate = date => date instanceof Date && !isNaN(date);

          const getDate = dateString => {
            if (!dateString || dateString === "0000-00-00") {
              return new Date();
            }
            const date = new Date(dateString);
            return isValidDate(date) ? date : new Date();
          };

          const startDate = getDate(row.startDate);
          const endDate = getDate(row.endDate);

          const formattedStartDate = startDate.toISOString().split("T")[0];
          const formattedEndDate = endDate.toISOString().split("T")[0];

          return (
            <input
              className="form-control"
              type="date"
              value={formattedStartDate}
              max={formattedEndDate}
              onChange={newValue => {
                const updatedDate = newValue.target.value;
                this.handleRequestPeriodPermissionDataChange(
                  row.Id,
                  "startDate",
                  updatedDate
                );
              }}
                  disabled={!showEditButton}
            />
          );
        },
      },

       {
        dataField: "endTime",
        text: this.props.t("End Time"),
        sort: true,
        editable: false,
        formatter: (cellContent, row, column) => {
          const isError =
            row.endDate === row.startDate && row.endTime < row.startTime;
          const errorClass = isError ? "is-invalid" : "";

          return (
           <Input
            className="form-control"
            type="time"
            value={row.endTime}
            onChange={newValue => {
              this.handleRequestPeriodPermissionDataChange(
                row.Id,
                "endTime",
                newValue.target.value
              );
            }}
            disabled={!showEditButton}
          /> 

          
          );
        },
      },
 
      {
        dataField: "endDate",
        text: this.props.t("End Date"),
        sort: true,
        editable: false,
        formatter: (cellContent, row, column) => {
          const isValidDate = date => date instanceof Date && !isNaN(date);

          const getDate = dateString => {
            if (!dateString || dateString === "0000-00-00") {
              return new Date();
            }
            const date = new Date(dateString);
            return isValidDate(date) ? date : new Date();
          };

          const startDate = getDate(row.startDate);
          const endDate = getDate(row.endDate);

          const formattedStartDate = startDate.toISOString().split("T")[0];
          const formattedEndDate = endDate.toISOString().split("T")[0];

          const isError = endDate < startDate;
          const errorClass = isError ? "is-invalid" : "";

          return (
            <input
              className={`form-control ${errorClass}`}
              type="date"
              value={formattedEndDate}
              min={formattedStartDate}
              onChange={newValue => {
                const newEndDate = new Date(newValue.target.value);
                if (newEndDate >= startDate) {
                  this.handleRequestPeriodPermissionDataChange(
                    row.Id,
                    "endDate",
                    newEndDate.toISOString().split("T")[0]
                  );
                } else {
                  console.log(
                    "End date must be greater than or equal to start date"
                  );
                }
              }}
              disabled={!showEditButton}
            />
          );
        },
      },
     
      {
        dataField: "action",
        text: "",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, row) => (
          <div className="d-flex gap-3">
              {showEditButton && (
             <Tooltip
              title={this.props.t("Reset")}
              onClick={() => this.resetPermission(row)}
              placement="top"
            >
              <IconButton color="primary" id="TooltipTop">
                <i className="bx bx-reset" />
              </IconButton>
            </Tooltip>)}
            {showDeleteButton && (
              <Tooltip
                title={this.props.t("Delete")}
                onClick={() => this.onClickDeletePermission(row)}
                placement="top"
              >
                <IconButton color="error" id="deletetooltip">
                  <i className="mdi mdi-delete" />
                </IconButton>
              </Tooltip>
            )}
        
          </div>
        ),
      },
    ];

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteNode}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <div className="container-fluid">
            <Breadcrumbs
              title={this.props.t("TimeLines")}
              breadcrumbItem={this.props.t("TimeLines List")}
            />
            <Row>
              <Col lg="3">
                <Container className="p-0 mb-3">
                  <div className="timeLine-header">
                    <h4 className="headertree pt-2">
                      <span style={{ marginRight: "-43%" }}>TimeLine</span>
                      <span>
                        {showAddButton && (
                          <IconButton
                            style={addButtonStyle}
                            onClick={this.handleAddNode}
                          >
                            <AddIcon />
                          </IconButton>
                        )}
                        {selectedNode &&
                          selectedNode.flag == 0 &&
                          showDeleteButton && (
                            <IconButton
                              style={deleteButtonStyle}
                              onClick={this.onClickDelete}
                              disabled={
                                !selectedNode || !selectedNode.flag === 1
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                      </span>
                    </h4>
                    <Treebeard
                      style={treeStyle}
                      data={this.state.timeLines}
                      onToggle={(node, toggled) => {
                        this.onToggle(node, toggled);
                        this.onNodeClick(node);
                      }}
                    />
                  </div>
                </Container>
              </Col>
              <Col lg="9" className="p-0">
                <Container fluid className="p-0">
                  <Row>
                    <Col>
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
                              onClick={this.handleDeletedErrorClose}
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
                              onClick={this.handleDeletedSuccessClose}
                            ></button>
                          </Alert>
                        )}
                      </div>
                      {addForm && (
                        <div className="p-0">
                          <h4 className="header pt-2" id="title">
                            {t("New TimeLine")}
                          </h4>
                          <Card>
                            <CardBody>
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

                              {successMessage && (
                                <Alert
                                  color="success"
                                  className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                  role="alert"
                                >
                                  {successMessage}
                                  <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={this.handleSuccessClose}
                                  ></button>
                                </Alert>
                              )}

                              <form>
                                <div className="university-info mb-5">
                                  <Row className="form-row">
                                    <div className="mb-3 col-md-6">
                                      <label
                                        htmlFor="Name-input"
                                        className="col-form-label"
                                      >
                                        {t("Name")}:
                                      </label>
                                      <Col lg="8">
                                        <div className="input-group">
                                          <input
                                            type="text"
                                            id="Name-input"
                                            name="semester-name-english"
                                            className={`form-control ${
                                              yearNameError ? "is-invalid" : ""
                                            }`}
                                            value={newName}
                                            onChange={e =>
                                              this.handleInputNewChange(
                                                "name",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </Col>
                                    </div>
                                    <div className="mb-3 col-md-6">
                                      <label
                                        htmlFor="code-input"
                                        className="col-form-label"
                                      >
                                        {t("Code")}:
                                      </label>
                                      <Col lg="8">
                                        <div className="input-group">
                                          <input
                                            type="text"
                                            id="code-input"
                                            name="semester-name-english"
                                            className="form-control"
                                            value={newCode}
                                            onChange={e =>
                                              this.handleInputNewChange(
                                                "Code",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </Col>
                                    </div>
                                  </Row>
                                  <Row className="form-row">
                                    <div className="mb-3 col-md-6">
                                      <label
                                        htmlFor="beginning-date-input"
                                        className="col-form-label"
                                      >
                                        {t("Beginning Date")}:
                                      </label>
                                      <Col lg="8">
                                        <div className="input-group">
                                          <input
                                            className="form-control"
                                            type="date"
                                            id="beginning-date-input"
                                            value={newStartDate}
                                            onChange={e =>
                                              this.handleInputNewChange(
                                                "startDate",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </Col>
                                    </div>
                                    <div className="mb-3 col-md-6">
                                      <label
                                        htmlFor="end-date-input"
                                        className="col-form-label"
                                      >
                                        {t("End Date")}:
                                      </label>
                                      <Col lg="8">
                                        <div className="input-group">
                                          <input
                                            className="form-control"
                                            type="date"
                                            id="end-date-input"
                                            value={newEndDate}
                                            onChange={e =>
                                              this.handleInputNewChange(
                                                "endDate",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </Col>
                                    </div>
                                  </Row>
                                </div>
                              </form>
                              <div className="d-flex justify-content-center mt-0">
                                <button
                                  type="button"
                                  style={{
                                    backgroundColor: "#0086BF",
                                    color: "white",
                                  }}
                                  className="btn m-2"
                                  onClick={this.handleSaveNewTimeLine}
                                >
                                  {t("Save")}
                                </button>

                                <button
                                  type="button"
                                  style={{
                                    backgroundColor: "#f1b44c",
                                    color: "white",
                                  }}
                                  className="btn m-2"
                                  onClick={this.handleResetData}
                                >
                                  {t("Reset")}
                                </button>
                              </div>
                            </CardBody>
                          </Card>
                        </div>
                      )}

                      {editForm && selectedNode && (
                        <div className="p-0">
                          <h4 className="header pt-2" id="title">
                            {selectedNode && selectedNode.name}
                          </h4>
                          <Card>
                            <CardBody>
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
                              {successMessage && (
                                <Alert
                                  color="success"
                                  className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                  role="alert"
                                >
                                  {successMessage}
                                  <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={this.handleSuccessClose}
                                  ></button>
                                </Alert>
                              )}
                              <form>
                                <div className="university-info mb-5">
                                  <Row className="form-row">
                                    {selectedNode.flag == 1 && (
                                      <div className="mb-3 col-md-6">
                                        <label
                                          htmlFor="Name-input"
                                          className="col-form-label"
                                        >
                                          {t("Name")}:
                                        </label>
                                        <Col lg="8">
                                          <div className="input-group">
                                            <input
                                              type="text"
                                              id="Name-input"
                                              name="semester-name-english"
                                              className="form-control"
                                              value={
                                                selectedNode
                                                  ? selectedNode.name
                                                  : ""
                                              }
                                              readOnly
                                            />
                                          </div>
                                        </Col>
                                      </div>
                                    )}
                                    {selectedNode.flag == 0 && (
                                      <div className="mb-3 col-md-6">
                                        <label
                                          htmlFor="Name-input"
                                          className="col-form-label"
                                        >
                                          {t("Name")}:
                                        </label>
                                        <Col lg="8">
                                          <div className="input-group">
                                            <input
                                              type="text"
                                              id="Name-input"
                                              name="semester-name-english"
                                              className="form-control"
                                              value={editName || ""}
                                              onChange={e =>
                                                this.handleInputEditChange(
                                                  "name",
                                                  e.target.value
                                                )
                                              }
                                              disabled={!showEditButton}
                                            />
                                          </div>
                                        </Col>
                                      </div>
                                    )}
                                    <div className="mb-3 col-md-6">
                                      <label
                                        htmlFor="code-input"
                                        className="col-form-label"
                                      >
                                        {t("Code")}:
                                      </label>
                                      <Col lg="8">
                                        <div className="input-group">
                                          <input
                                            type="text"
                                            id="code-input"
                                            name="semester-name-english"
                                            className="form-control"
                                            value={editCode || ""}
                                            onChange={e =>
                                              this.handleInputEditChange(
                                                "Code",
                                                e.target.value
                                              )
                                            }
                                            disabled={!showEditButton}
                                          />
                                        </div>
                                      </Col>
                                    </div>
                                  </Row>
                                  <Row className="form-row">
                                    <div className="mb-3 col-md-6">
                                      <label
                                        htmlFor="beginning-date-input"
                                        className="col-form-label"
                                      >
                                        {t("Beginning Date")}:
                                      </label>
                                      <Col lg="8">
                                        <div className="input-group">
                                          <input
                                            className="form-control"
                                            type="date"
                                            id="beginning-date-input"
                                            value={
                                              selectedNode
                                                ? formattedStartDate
                                                : ""
                                            }
                                            onChange={e =>
                                              this.handleInputEditChange(
                                                "startDate",
                                                e.target.value
                                              )
                                            }
                                            disabled={!showEditButton}
                                          />
                                        </div>
                                      </Col>
                                    </div>
                                    <div className="mb-3 col-md-6">
                                      <label
                                        htmlFor="end-date-input"
                                        className="col-form-label"
                                      >
                                        {t("End Date")}:
                                      </label>
                                      <Col lg="8">
                                        <div className="input-group">
                                          <input
                                            className="form-control"
                                            type="date"
                                            id="end-date-input"
                                            value={
                                              selectedNode
                                                ? formattedEndDate
                                                : ""
                                            }
                                            onChange={e =>
                                              this.handleInputEditChange(
                                                "endDate",
                                                e.target.value
                                              )
                                            }
                                            disabled={!showEditButton}
                                          />
                                        </div>
                                      </Col>
                                    </div>
                                  </Row>
                                </div>
                              </form>
                              <div className="d-flex justify-content-center mt-0">
                                {selectedNode && selectedNode.flag == 1 && (
                                  <button
                                    type="button"
                                    className="btn m-2"
                                    style={{
                                      backgroundColor: "#FFA500",
                                      color: "white",
                                    }}
                                    onClick={this.handleChangeTimeLine}
                                  >
                                    {t("Edit")}
                                  </button>
                                )}

                                <button
                                  type="button"
                                  className="btn m-2"
                                  style={{
                                    backgroundColor: "#0086BF",
                                    color: "white",
                                  }}
                                  onClick={this.handleSaveEditTimeLine}
                                >
                                  {t("Save")}
                                </button>
                              </div>
                            </CardBody>
                          </Card>
                        </div>
                      )}
                    </Col>
                  </Row>
                </Container>
              </Col>
            </Row>

            <Row>
              <Modal isOpen={modal} className={this.props.className} fullscreen>
                <ModalHeader toggle={this.toggle} tag="h4">
                  {this.props.t("Determine the academic line for the semester")}
                </ModalHeader>
                <ModalBody>
                  <Card>
                    <CardBody>
                      <Row>
                        {sidebarOpen && (
                          <div style={{ width: sidebarOpen ? "14%" : "0" }}>
                            <Card>
                              <CardTitle
                                id="warning_rules_header"
                                style={{ height: "60px", width: "100%" }}
                              >
                                {t("Types of requests and operations")}
                              </CardTitle>
                              <CardBody>
                                {requestsPeriodAllowance.map(
                                  (request, index) => (
                                    <div className="mb-1" key={request.Id}>
                                      <Row>
                                        <Col>
                                          <input
                                            type="checkbox"
                                            className="btn-check"
                                            id={`btncheck${request.Id}`}
                                            autoComplete="off"
                                            checked={checkedId === request.Id}
                                            onChange={() =>
                                              this.handleShowColumn(
                                                `checked${request.Id}`,
                                                request.Id
                                              )
                                            }
                                          />
                                          <label
                                            className="btn btn-outline-primary big-width-check"
                                            htmlFor={`btncheck${request.Id}`}
                                          >
                                            {this.props.t(request.enTitle)}
                                          </label>
                                        </Col>
                                      </Row>
                                    </div>
                                  )
                                )}
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
                          <Nav pills className="navtab-bg nav-justified">
                            <NavItem>
                              <NavLink
                                id="vertical-home-link"
                                style={{ cursor: "pointer" }}
                                className={classnames({
                                  active: this.state.activeTab === "0",
                                })}
                                onClick={() => {
                                  this.toggle1("0");
                                }}
                              >
                                {this.props.t("System")}
                              </NavLink>
                            </NavItem>
                            <NavItem>
                              <NavLink
                                id="vertical-home-link"
                                style={{ cursor: "pointer" }}
                                className={classnames({
                                  active: this.state.activeTab === "1",
                                })}
                                onClick={() => {
                                  this.toggle1("1");
                                }}
                              >
                                {this.props.t("Mobile App")}
                              </NavLink>
                            </NavItem>
                          </Nav>
                          <Card>
                            <CardBody>
                              <h4 className="header pt-2" id="title">
                                {selectedNode && selectedNode.name}
                              </h4>
                              <div className="table-responsive">
                                <BootstrapTable
                                  keyField="Id"
                                  data={
                                    requestsPeriodAllowanceTime
                                      ? requestsPeriodAllowanceTime
                                      : []
                                  }
                                  columns={columns}
                                  cellEdit={cellEditFactory({
                                    mode: "click",
                                    blurToSave: true,
                                    afterSaveCell: (
                                      oldValue,
                                      newValue,
                                      row,
                                      column
                                    ) => {
                                      this.handleWarningRuleDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  noDataIndication={t(
                                    "No Warning Rules Definition found"
                                  )}
                                  // defaultSorted={defaultSorting}
                                  filter={filterFactory()}
                                />
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </ModalBody>
              </Modal>
            </Row>

            <Modal
              isOpen={permissionModal}
              contentClassName="custom-modal-width"
              modalClassName="custom-modal-dialog"
              fullscreen
              style={{ height: "600px" }}
            >
              <ModalHeader toggle={this.togglePermission} tag="h4">
                {this.props.t("Add Permission Times")}
              </ModalHeader>

              <ModalBody>
                <Row>
                  <DeleteModal
                    show={deletePermissionModal}
                    onDeleteClick={this.handleDeletePermissionRow}
                    onCloseClick={() =>
                      this.setState({ deletePermissionModal: false })
                    }
                  />
                </Row>
                <Row>
                  <Col>
                    <Card>
                      <CardBody>
                        <div className="table-responsive">
                          {showAddButton && (
                            <div className="text-sm-end">
                              <Tooltip
                                title={this.props.t("Add")}
                                placement="top"
                              >
                                <IconButton
                                  color="primary"
                                  onClick={this.handleAddPermissionRow}
                                >
                                  <i className="mdi mdi-plus-circle blue-noti-icon" />
                                </IconButton>
                              </Tooltip>
                            </div>
                          )}

                          <div>
                            {errorDateMessage && (
                              <Alert
                                color="danger"
                                className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                role="alert"
                              >
                                {errorDateMessage}
                                <button
                                  type="button"
                                  className="btn-close"
                                  aria-label="Close"
                                  onClick={this.handleAlertClose}
                                ></button>
                              </Alert>
                            )}
                            {errorTimeMessage && (
                              <Alert
                                color="danger"
                                className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                role="alert"
                              >
                                {errorTimeMessage}
                                <button
                                  type="button"
                                  className="btn-close"
                                  aria-label="Close"
                                  onClick={this.handleAlertClose}
                                ></button>
                              </Alert>
                            )}
                          </div>

                          <BootstrapTable
                            keyField="Id"
                            data={
                              requestsPeriodPermission
                                ? requestsPeriodPermission
                                : []
                            }
                            columns={permissionColumns}
                            cellEdit={cellEditFactory({
                              mode: "click",
                              blurToSave: true,
                              afterSaveCell: (
                                oldValue,
                                newValue,
                                row,
                                column
                              ) => {
                                this.handleRequestPeriodPermissionDataChange(
                                  row.Id,
                                  column.dataField,
                                  newValue
                                );
                              },
                            })}
                            noDataIndication={t(
                              "No Warning Rules Definition found"
                            )}
                            // defaultSorted={defaultSorting}
                            filter={filterFactory()}
                          />
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </ModalBody>
            </Modal>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({
  timeLines,
  menu_items,
  mobAppFacultyAccs,
  levels,
  departments,
}) => ({
  timeLines: timeLines.timeLines,
  requestsPeriodAllowance: timeLines.requestsPeriodAllowance,
  requestsPeriodAllowanceTime: timeLines.requestsPeriodAllowanceTime,
  requestsPeriodPermission: timeLines.requestsPeriodPermission,
  deleted: timeLines.deleted,
  faculties: mobAppFacultyAccs.faculties,
  departments: departments.departments,
  levels: levels.levels,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetTimeLines: () => dispatch(getTimeLines()),
  onGetRequestsPeriodAllowance: () => dispatch(getRequestsPeriodAllowance()),
  onGetRequestsPeriodAllowanceTime: requestsPeriodAllowanceTime =>
    dispatch(getRequestsPeriodAllowanceTime(requestsPeriodAllowanceTime)),
  onUpdateRequestsPeriodAllowanceTime: requestsPeriodAllowanceTime =>
    dispatch(updateRequestsPeriodAllowanceTime(requestsPeriodAllowanceTime)),
  onGeneralizeRequestsPeriodAllowanceTime: requestsPeriodAllowanceTime =>
    dispatch(
      generalizeRequestsPeriodAllowanceTime(requestsPeriodAllowanceTime)
    ),
  onGetRequestsPeriodPermission: requestsPeriodPermission =>
    dispatch(getRequestsPeriodPermission(requestsPeriodPermission)),
  onAddRequestsPeriodPermission: requestsPeriodPermission =>
    dispatch(addRequestsPeriodPermission(requestsPeriodPermission)),
  onUpdateRequestsPeriodPermission: requestsPeriodPermission =>
    dispatch(updateRequestsPeriodPermission(requestsPeriodPermission)),
  onDeleteRequestsPeriodPermission: requestsPeriodPermission =>
    dispatch(deleteRequestsPeriodPermission(requestsPeriodPermission)),
  onAddNewTimeLine: timeLine => dispatch(addNewTimeLine(timeLine)),
  onUpdateTimeLine: timeLine => dispatch(updateTimeLine(timeLine)),
  onDeleteTimeLine: timeLine => dispatch(deleteTimeLine(timeLine)),
  onGetTimeLineDeletedValue: () => dispatch(getTimeLineDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(TimeLines));
