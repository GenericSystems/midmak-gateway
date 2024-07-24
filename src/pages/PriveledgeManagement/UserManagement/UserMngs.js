import React, { Component } from "react";
import {
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Input,
  Modal,
  CardTitle,
  ModalHeader,
  Button,
  ModalBody,
  Label,
} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Treebeard } from "react-treebeard";
import { Formik, Field, Form, ErrorMessage } from "formik";
import DualListBox from "react-dual-listbox";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import Select from "react-select";
import {
  getUserMngs,
  addNewUserMng,
  updateUserMng,
  deleteUserMng,
  getUserMngDeletedValue,
  getUserFaculties,
  addNewUserFaculty,
  deleteUserFaculty,
  getUserFacultyDeletedValue,
  addNewUserRole,
} from "store/user-mngs/actions";
import { fetchSetting } from "store/mob-app-faculty-accs/actions";
import { getRoles } from "store/roles/actions";
import { getUniversityOrgStructure } from "store/universityOrgStructure/actions";
import * as Yup from "yup";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import { withRouter, Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";
import { DirectionsOutlined } from "@mui/icons-material";
const USER_MNG_STORAGE_KEY = "editableUserMng";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
class UserMngsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteModal: false,
      duplicateError: null,
      duplicateUserFaculty: null,
      selectedRowId: null,
      showAlert: null,
      modal: false,
      passwordChangeModal: false,
      usersModal: false,
      selectedData: null,
      newPassword: "",
      retypePassword: "",
      passwordDuplicateError: null,
      showPassword: false,
      updatedFaculties: [],
      selectedNode: null,
      columnName: "",
      updatedUserFaculties: [],
      usersArray: [],
      selectedMulti: [],
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
    };

    this.handleChangePasswordModal = this.handleChangePasswordModal.bind(this);
    this.togglePassword = this.togglePassword.bind(this);
    this.handleUsersModal = this.handleUsersModal.bind(this);
    this.toggleUsersModal = this.toggleUsersModal.bind(this);
    this.toggle = this.toggle.bind(this);
  }
  componentDidMount() {
    const {
      userMngs,
      onGetUserMngs,
      deleted,
      deletedDetail,
      onGetRoles,
      roles,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (userMngs && !userMngs.length) {
      onGetUserMngs();
      onGetRoles();
      this.setState({ userMngs, roles });
      this.setState({ deleted, deletedDetail });
    }
  }
  togglePasswordVisibility = () => {
    this.setState(prevState => ({
      showPassword: !prevState.showPassword,
    }));
  };
  transformFaculty(item) {
    const { t } = this.props;
    const transformedItem = {
      ...item,
      label: item.title,
      title: undefined,
      value: item.Id,
      Id: undefined,
    };
    return transformedItem;
  }
  transfromUserFaculty(array) {
    return array.map(item => item.facultyId);
  }

  getUpdatedFaculties(faculties) {
    return faculties.map(item => {
      return this.transformFaculty(item);
    });
  }

  handleSave = values => {
    const { onAddNewUserMng } = this.props;
    const isEmployeeNumber = values["isEmployee"] ? 1 : 0;
    const obj = {
      userName: values["userName"],
      fullName: values["fullName"],
      email: values["email"],
      isEmployee: isEmployeeNumber,
      status: "Active",
      password: values["password"],
    };
    onAddNewUserMng(obj);
    this.toggle();
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.faculties !== prevProps.faculties) {
      const updatedFaculties = this.getUpdatedFaculties(this.props.faculties);

      this.setState({ updatedFaculties });
    }
    if (this.props.userFaculties !== prevProps.userFaculties) {
      const updatedUserFaculties = this.transfromUserFaculty(
        this.props.userFaculties
      );

      this.setState({ updatedUserFaculties });
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

  togglePassword() {
    this.setState(prevState => ({
      passwordChangeModal: !prevState.passwordChangeModal,
    }));
    this.setState({
      newPassword: "",
      retypePassword: "",
      passwordDuplicateError: null,
      showPassword: false,
    });
  }

  toggleUsersModal() {
    const { onGetFaculties, onGetUniversityOrgStructures } = this.props;
    onGetFaculties();
    onGetUniversityOrgStructures();
    this.setState(prevState => ({
      usersModal: !prevState.usersModal,
    }));
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
    this.setState({ showPassword: false });
  }

  onClickDelete = (rowId, columnName) => {
    this.setState({
      selectedRowId: rowId,
      deleteModal: true,
      columnName: columnName,
    });
  };

  handleAddRow = () => {
    const { onAddNewUserMng, userMngs } = this.props;

    const newRow = {
      userName: "",
    };

    const emptyRowsExist = userMngs.some(
      userMng => userMng.userName.trim() === "-----"
    );

    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewUserMng(newRow);
    }
  };

  handleDeleteRow = () => {
    const { onDeleteUserMng, onDeleteUserFaculty } = this.props;
    const { selectedRowId, columnName } = this.state;

    if (selectedRowId !== null) {
      if (columnName === "columns") {
        onDeleteUserMng(selectedRowId);
      } else {
        onDeleteUserFaculty({ Id: selectedRowId.Id });
      }
      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  handleUserMngDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateUserMng, userMngs } = this.props;

    const isDuplicate = userMngs.some(
      userMng =>
        userMng.Id !== rowId &&
        userMng[fieldName] &&
        userMng[fieldName].trim() === fieldValue.trim()
    );

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateUserMng(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateUserMng(onUpdate);
    }
  };
  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };
  handleAlertCloseError = () => {
    this.setState({ duplicateUserFaculty: null });
  };
  handlePasswordClose = () => {
    this.setState({ passwordDuplicateError: null });
  };
  handleSuccessClose = () => {
    const { onGetUserMngDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetUserMngDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetUserMngDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetUserMngDeletedValue();
  };
  handleChangeCheckbox = (row, fieldName) => {
    const { onUpdateUserMng } = this.props;
    const newStatus = row[fieldName] ? 0 : 1;
    let ob = {
      Id: row.Id,
      [fieldName]: newStatus,
    };
    onUpdateUserMng(ob);
  };

  handleSelectUser = (rowId, fieldName, selectedValue) => {
    const { onUpdateUserMng } = this.props;
    let onUpdate = { Id: rowId, [fieldName]: selectedValue };
    onUpdateUserMng(onUpdate);
  };

  handleChangePasswordModal = arg => {
    this.setState({
      selectedData: arg,
    });

    this.togglePassword();
  };
  handleUsersModal = arg => {
    const {
      onGetFaculties,
      onGetUniversityOrgStructures,
      faculties,
      onGetUserFaculties,
      userFaculties,
    } = this.props;
    this.setState({
      selectedData: arg,
      usersModal: !this.state.usersModal,
    });
    onGetFaculties();
    onGetUniversityOrgStructures();
    onGetUserFaculties(arg.Id);

    const updatedFaculties = this.getUpdatedFaculties(faculties);
    const updatedUserFaculties = this.transfromUserFaculty(userFaculties);

    this.setState({ updatedFaculties });
    this.setState({ updatedUserFaculties });
  };
  handlePasswordChange = (fieldName, value) => {
    const { newPassword, retypePassword } = this.state;

    if (fieldName == "newPassword") {
      this.setState({
        newPassword: value,
      });
    }
    if (fieldName == "retypePassword") {
      this.setState({
        retypePassword: value,
      });
    }
  };
  submitChangePassword = () => {
    const { newPassword, selectedData, retypePassword } = this.state;
    const { onUpdateUserMng } = this.props;
    if (newPassword === "" || retypePassword === "") {
      const errorMessage = this.props.t("Empty Password");
      this.setState({ passwordDuplicateError: errorMessage });
      return;
    }
    if (newPassword !== retypePassword) {
      const errorMessage = this.props.t("Passwords do not match");
      this.setState({ passwordDuplicateError: errorMessage });
      return;
    }

    let obj = {
      Id: selectedData.Id,
      password: newPassword,
    };
    onUpdateUserMng(obj);
    this.togglePassword();
  };
  onToggle(node, toggled) {
    const { cursor } = this.state;
    if (cursor) {
      cursor.active = false;
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    }

    this.setState({
      cursor: node,
      addForm: false,
    });
  }
  onNodeClick(node) {
    const { selectedNode } = this.state;
    this.setState({
      selectedNode: node,
    });
  }
  AddToUserFaculties = () => {
    const { selectedNode, selectedData } = this.state;
    const { userFaculties, onAddNewUserFaculty } = this.props;
    const isDuplicate = userFaculties.some(
      faculty => faculty.facultyId === selectedNode.Id
    );
    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateUserFaculty: errorMessage });
    } else {
      const ob = {
        userId: selectedData.Id,
        facultyId: selectedNode.Id,
      };
      this.setState({ duplicateUserFaculty: null });
      onAddNewUserFaculty(ob);
    }
  };

  handleDeleteDetailsClose = () => {
    const { onGetUserFacultyDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetUserFacultyDeletedValue();
  };
  onChange = selected => {
    this.setState({ updatedUserFaculties: selected });
    const { selectedData, updatedFaculties, onGetUserFaculties } = this.state;
    const { onAddNewUserFaculty } = this.props;
    const ob = {
      userId: selectedData && selectedData.Id,
      faculties: selected,
    };
    onAddNewUserFaculty(ob);
  };

  handleUserRoles = userData => {
    this.setState({
      isModalUserRolesOpen: !this.state.isModalUserRolesOpen,
      userRole: userData,
      rolesArray: userData.userRoles,
    });
  };

  toggleUserRolesModal = () => {
    this.setState(prevState => ({
      isModalUserRolesOpen: !prevState.isModalUserRolesOpen,
    }));
  };

  handleMultiRoles = selectedMulti => {
    const { onAddNewUserRole } = this.props;
    const { userRole, decisionObj } = this.state;
    const selectedMultiWithRoleId = selectedMulti.map(item => ({
      ...item,
      value1: userRole.Id,
    }));

    let newRoleDecisions = {
      multiArray: selectedMultiWithRoleId,
      userId: userRole.Id,
    };
    onAddNewUserRole(newRoleDecisions);
  };

  render() {
    const { userMngs, t, deleted, userFaculties, deletedDetail, roles } =
      this.props;
    const {
      duplicateError,
      deleteModal,
      showAlert,
      newPassword,
      updatedFaculties,
      showPassword,
      retypePassword,
      passwordDuplicateError,
      duplicateUserFaculty,
      updatedUserFaculties,
      isModalUserRolesOpen,
      userRole,
      rolesArray,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
    } = this.state;

    const modifiedRoles = roles.map(role => ({
      value: role.Id,
      label: role.arTitle,
    }));

    const alertMessageDetail =
      deletedDetail == 0
        ? "Can't Delete (Delete data related to it)"
        : "Deleted Successfully";
    const alertMessage =
      deleted == 0 ? "Can't Delete " : "Deleted Successfully";
    const { SearchBar } = Search;
    const defaultSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];
    const statuses = [
      { value: "Active", label: t("Active") },
      { value: "Inactive", label: t("Inactive") },
      { value: "Locked", label: t("Locked") },
    ];

    const columns = [
      { dataField: "Id", text: t("ID"), hidden: true },

      {
        dataField: "userName",
        text: t("Username"),
        sort: true,
        editable: (cellContent, row) =>
          !cellContent || cellContent.trim() === "",
      },
      {
        dataField: "fullName",
        text: t("Full Name"),
        sort: true,
        editable: showEditButton,
      },
      {
        dataField: "isEmployee",
        text: t("Employee"),
        sort: true,
        editable: false,
        formatter: (cellContent, row, column) => (
          <Input
            type="checkbox"
            name="RequireAttestation"
            className={`form-check-input input-mini warning}`}
            id="attestationButton"
            defaultChecked={cellContent == 1}
            onChange={event => this.handleChangeCheckbox(row, "isEmployee")}
            disabled={!showEditButton}
          />
        ),
      },
      {
        dataField: "email",
        text: t("Email"),
        sort: true,
        editable: showEditButton,
      },
      {
        dataField: "password",
        text: t("password"),
        sort: true,
        hidden: true,
        editable: showEditButton,
      },
      {
        dataField: "numberofgroups",
        text: t("Groups"),
        sort: true,
        editable: false,
      },
      { dataField: "roles", text: t("Roles"), sort: true, editable: false },
      {
        dataField: "privileges",
        text: t("Privileges"),
        sort: true,
        editable: false,
      },
      {
        dataField: "status",
        text: t("Status"),
        sort: true,
        editable: false,
        style: { width: "8rem" },
        formatter: (cellContent, row) => (
          <Select
            key={`${row.Id}_select`}
            options={statuses}
            onChange={newValue => {
              this.handleSelectUser(row.Id, "status", newValue.value);
            }}
            defaultValue={statuses.find(opt => opt.value == row.status)}
            disabled={!showEditButton}
          />
        ),
      },
      {
        dataField: "delete",
        text: "Actions",
        style: { width: "3rem" },
        isDummyField: true,
        editable: false,
        formatter: (cellContent, userMng) => (
          <div className="d-flex" style={{ width: "fit-content" }}>
            <Tooltip title={this.props.t("Reset Password")} placement="top">
              <Link to="#">
                <i
                  className="bx bx-reset font-size-20 mr-2 icon-style"
                  id="edittooltip"
                  onClick={() => {
                    if (showEditButton) {
                      this.handleChangePasswordModal(userMng);
                    }
                  }}
                ></i>
              </Link>
            </Tooltip>

            <Tooltip title={this.props.t("User's Entities")} placement="top">
              <Link className="text-secondary ml-1" to="#">
                <i
                  className="far fa-building font-size-15 mr-2 icon-style"
                  id="edittooltip"
                  onClick={() => this.handleUsersModal(userMng)}
                ></i>
              </Link>
            </Tooltip>

            <Tooltip title={this.props.t("User's Roles")} placement="top">
              <Link className="text-secondary" to="#">
                <i
                  className="fas fa-user-cog font-size-15 mr-2 "
                  id="edittooltip"
                  onClick={() => this.handleUserRoles(userMng)}
                ></i>
              </Link>
            </Tooltip>
            {showDeleteButton && (
              <Tooltip title={this.props.t("Delete")} placement="top">
                <Link className="text-danger" to="#">
                  <i
                    className="mdi mdi-delete font-size-18"
                    id="deletetooltip"
                    onClick={() => this.onClickDelete(userMng, "columns")}
                  ></i>
                </Link>
              </Tooltip>
            )}
          </div>
        ),
      },
    ];
    const userFacultiesColumns = [
      { dataField: "Id", text: t("ID"), hidden: true },
      {
        dataField: "facultyName",
        text: t("facultyName"),
        style: { paddingBottom: "3px", paddingTop: "3px", fontSize: "15px" },
      },
      {
        dataField: "delete",
        text: "Actions",
        style: { width: "3rem", paddingBottom: "3px", paddingTop: "3px" },
        isDummyField: true,
        editable: false,
        formatter: (cellContent, userMng) => (
          <Tooltip title={this.props.t("Delete ")} placement="top">
            <Link className="text-danger" to="#">
              <i
                className="mdi mdi-delete font-size-18"
                id="deletetooltip"
                onClick={() =>
                  this.onClickDelete(userMng, "userFacultiesColumns")
                }
              ></i>
            </Link>
          </Tooltip>
        ),
      },
    ];
    // const options = updatedFaculties.filter(
    //   faculty => updatedUserFaculties.some(
    //     userFaculty => userFaculty.label === faculty.label
    //   )
    // );

    const pageOptions = {
      sizePerPage: 10,
      totalSize: userMngs.length,
      custom: true,
    };
    const forbiddenUsernames = userMngs.map(user => user.userName); // Extract usernames from userMngs
    const treeStyle = {
      tree: {
        base: {
          listStyle: "none",
          backgroundColor: "#F8F8F8",
          margin: 0,
          padding: "5px",
          color: "gray",
          fontFamily: "Lucida Grande, Tahoma, Verdana, Arial, sans-serif",
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
              margin: "-7px 0 0 -7px",
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
            paddingRight: "30px",
            color: "green",
          },
        },
      },
    };
    return (
      <React.Fragment>
        <Modal
          isOpen={this.state.usersModal}
          className={this.props.className}
          size="lg"
        >
          <ModalHeader toggle={() => this.toggleUsersModal()} tag="h4">
            {t("Users")}
          </ModalHeader>
          <ModalBody className="py-3 px-5">
            {" "}
            <Card>
              <CardTitle className="exam_header">
                {t("Management Structure")}
              </CardTitle>
              <CardBody>
                <Row className="justify-content-center">
                  {duplicateUserFaculty && (
                    <Alert
                      color="danger"
                      className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                      role="alert"
                    >
                      {duplicateUserFaculty}
                      <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={this.handleAlertCloseError}
                      ></button>
                    </Alert>
                  )}
                  {deletedDetail == 0 && showAlert && (
                    <Alert
                      color="danger"
                      className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                      role="alert"
                    >
                      {alertMessageDetail}
                      <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={this.handleDeleteDetailsClose}
                      ></button>
                    </Alert>
                  )}
                  {deletedDetail == 1 && showAlert && (
                    <Alert
                      color="success"
                      className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                      role="alert"
                    >
                      {alertMessageDetail}
                      <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={this.handleDeleteDetailsClose}
                      ></button>
                    </Alert>
                  )}

                  <Row>
                    <Col lg="6">
                      <CardTitle id="course_header">{t("Faculties")}</CardTitle>
                    </Col>
                    <Col lg="6">
                      <CardTitle id="course_header">
                        {t("User's Entities")}
                      </CardTitle>
                    </Col>
                  </Row>
                  <Col lg="11">
                    <DualListBox
                      options={this.state.updatedFaculties}
                      selected={this.state.updatedUserFaculties}
                      onChange={this.onChange}
                      icons={{
                        moveLeft: <span className="fa fa-chevron-right" />,
                        moveAllLeft: [
                          <span key={0} className="fa fa-chevron-right" />,
                          <span key={1} className="fa fa-chevron-right" />,
                        ],
                        moveRight: <span className="fa fa-chevron-left" />,
                        moveAllRight: [
                          <span key={0} className="fa fa-chevron-left" />,
                          <span key={1} className="fa fa-chevron-left" />,
                        ],
                      }}
                      className="duallistbox-user-faculties"
                      disabled={!showEditButton}
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </ModalBody>
        </Modal>
        <Modal
          isOpen={this.state.passwordChangeModal}
          className={this.props.className}
          centered={true}
        >
          <ModalHeader toggle={() => this.togglePassword()} tag="h4">
            {t("Reset Password")}
          </ModalHeader>
          <ModalBody className="py-3 px-5">
            {passwordDuplicateError && (
              <Alert
                color="danger"
                className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                role="alert"
              >
                {passwordDuplicateError}
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={this.handlePasswordClose}
                ></button>
              </Alert>
            )}
            <Row>
              <Col lg={12}>
                <div className="text-center">
                  <div className="input-group">
                    <Input
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      placeholder="password"
                      autoComplete="new-password"
                      onChange={event =>
                        this.handlePasswordChange(
                          "newPassword",
                          event.target.value
                        )
                      }
                    />
                    <div className="input-group-append">
                      <span className="input-group-text p-0 bg-transparent">
                        <button
                          className="btn btn-light "
                          type="button"
                          onClick={this.togglePasswordVisibility}
                        >
                          <i
                            className={`fas ${
                              showPassword ? "fa-eye" : "fa-eye-slash"
                            } font-size-12`}
                          ></i>
                        </button>
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 input-group auth-pass-inputgroup">
                    <Input
                      name="retypePassword"
                      type={showPassword ? "text" : "password"}
                      value={retypePassword}
                      autoComplete="new-password"
                      placeholder="Re-Type password"
                      onChange={event =>
                        this.handlePasswordChange(
                          "retypePassword",
                          event.target.value
                        )
                      }
                    />
                    <div className="input-group-append">
                      <span className="input-group-text p-0 bg-transparent">
                        <button
                          className="btn btn-light "
                          type="button"
                          onClick={this.togglePasswordVisibility}
                        >
                          <i
                            className={`fas ${
                              showPassword ? "fa-eye" : "fa-eye-slash"
                            } font-size-12`}
                          ></i>
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="text-center mt-3">
                  <button
                    type="button"
                    className="btn btn-success btn-lg me-2"
                    onClick={() => this.submitChangePassword()}
                  >
                    {this.props.t("Reset")}
                  </button>
                </div>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
        <Modal isOpen={isModalUserRolesOpen}>
          <ModalHeader
            toggle={this.toggleUserRolesModal}
            tag="h4"
            className="horizontalTitles"
          ></ModalHeader>
          <ModalBody>
            <br />
            <Row>
              <Col>
                <div className="TitleStyle">
                  {t("User's Roles")}
                  {" - "}
                  {userRole && userRole.fullName}
                </div>
              </Col>
            </Row>
            <br />
            <Row>
              <Col>
                <Card>
                  <Row>
                    <Select
                      options={modifiedRoles}
                      defaultValue={
                        rolesArray && rolesArray.length > 0 ? rolesArray : []
                      }
                      onChange={this.handleMultiRoles}
                      isMulti
                      isDisabled={!showEditButton}
                    />
                  </Row>
                </Card>
              </Col>
            </Row>
          </ModalBody>
        </Modal>

        {/* add user form */}
        <Modal
          isOpen={this.state.modal}
          className={this.props.className}
          centered={true}
        >
          <ModalHeader toggle={this.toggle} tag="h4">
            {t("Add User")}
          </ModalHeader>
          <ModalBody className="py-3 px-5">
            <Formik
              initialValues={{
                isEmployee: false,
                userName: "",
                fullName: "",
                email: "",
                password: "",
                retypePassword: "",
              }}
              enableReinitialize={true}
              validationSchema={Yup.object().shape({
                userName: Yup.string()
                  .required("Username is required")
                  .notOneOf(
                    userMngs.map(user => user.userName),
                    this.props.t("Username already taken")
                  ),

                fullName: Yup.string().required(
                  this.props.t("Full Name is required")
                ),
                email: Yup.string()
                  .required(this.props.t("Email is required"))
                  .notOneOf(
                    userMngs.map(user => user.email),
                    this.props.t("Email already taken")
                  ),
                password: Yup.string().required("Password is required"),

                retypePassword: Yup.string()
                  .required("Retype Password is required")
                  .test(
                    this.props.t("password-match"),
                    this.props.t("Passwords do not match"),
                    function (value) {
                      return value === this.parent.password;
                    }
                  ),
              })}
              onSubmit={(values, { setSubmitting }) => {
                this.handleSave(values);

                setSubmitting(false);
              }}
            >
              {({ errors, status, touched, values, handleSubmit }) => (
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col className="col-12">
                      <div className="mb-3">
                        <Row>
                          <Label className="form-label">
                            {this.props.t("Username")}
                            <span className="text-danger ms-2">*</span>
                          </Label>
                        </Row>
                        <Field
                          name="userName"
                          type="text"
                          className={
                            "form-control" +
                            (errors.userName && touched.userName
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="userName"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>

                      <div className="mb-3">
                        <Row>
                          <Col>
                            <Row>
                              <Label className="form-label">
                                {t("Full Name")}
                                <span className="text-danger ms-2">*</span>
                              </Label>
                            </Row>
                            <Field
                              name="fullName"
                              type="text"
                              className={
                                "form-control" +
                                (errors.fullName && touched.fullName
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <ErrorMessage
                              name="fullName"
                              component="div"
                              className="invalid-feedback"
                            />
                          </Col>
                        </Row>
                      </div>
                      <div className="mb-3">
                        <Row>
                          <Col>
                            <Row>
                              <Label className="form-label">
                                {t("Email")}
                                <span className="text-danger ms-2">*</span>
                              </Label>
                            </Row>
                            <Field
                              name="email"
                              type="text"
                              className={
                                "form-control" +
                                (errors.email && touched.email
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <ErrorMessage
                              name="email"
                              component="div"
                              className="invalid-feedback"
                            />
                          </Col>
                        </Row>
                      </div>
                      <div className="mb-3">
                        <Row>
                          <Col>
                            <Row>
                              <Label className="form-label">
                                {t("Password")}
                                <span className="text-danger ms-2">*</span>
                              </Label>
                            </Row>
                            <div className="input-group auth-pass-inputgroup">
                              <Field
                                name="password"
                                type={showPassword ? "text" : "password"}
                                className={
                                  "form-control" +
                                  (errors.password && touched.password
                                    ? " is-invalid"
                                    : "")
                                }
                              />
                              <div className="input-group-append">
                                <span className="input-group-text p-0 bg-transparent">
                                  <button
                                    className="btn btn-light "
                                    type="button"
                                    id="password-addon"
                                    onClick={this.togglePasswordVisibility}
                                  >
                                    <i
                                      className={`fas ${
                                        showPassword ? "fa-eye" : "fa-eye-slash"
                                      } font-size-12`}
                                    ></i>
                                  </button>
                                </span>
                              </div>
                              <ErrorMessage
                                name="password"
                                component="div"
                                className="invalid-feedback"
                              />
                            </div>
                          </Col>
                          <Col>
                            <Row>
                              <Label className="form-label">
                                {t("Retype Password")}
                                <span className="text-danger ms-2">*</span>
                              </Label>
                            </Row>
                            <div className="input-group auth-pass-inputgroup">
                              <Field
                                name="retypePassword"
                                type={showPassword ? "text" : "password"}
                                className={
                                  "form-control" +
                                  (errors.retypePassword &&
                                  touched.retypePassword
                                    ? " is-invalid"
                                    : "")
                                }
                              />
                              <div className="input-group-append">
                                <span className="input-group-text p-0 bg-transparent">
                                  <button
                                    className="btn btn-light "
                                    type="button"
                                    id="password-addon"
                                    onClick={this.togglePasswordVisibility}
                                  >
                                    <i
                                      className={`fas ${
                                        showPassword ? "fa-eye" : "fa-eye-slash"
                                      } font-size-12`}
                                    ></i>
                                  </button>
                                </span>
                              </div>
                              <ErrorMessage
                                name="retypePassword"
                                component="div"
                                className="invalid-feedback"
                              />
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div className="mb-3">
                        <Row>
                          <Col>
                            <Label className="form-label">
                              {t("Employee")}
                            </Label>
                            <Field
                              name="isEmployee"
                              type="checkbox"
                              className={
                                "form-check-input mt-3 mb-3" +
                                (errors.isEmployee && touched.isEmployee
                                  ? " is-invalid"
                                  : " mt-3 mb-3")
                              }
                            />
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="text-end">
                        <Button type="submit" className="primary">
                          {t("Save")}
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </ModalBody>
        </Modal>
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
              title={t("User Managements")}
              breadcrumbItem={t("User Managements List")}
            />

            <Row>
              <Col>
                <Card>
                  <CardBody>
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
                    <div className="table-responsive">
                      <PaginationProvider
                        pagination={paginationFactory(pageOptions)}
                        keyField="Id"
                        columns={columns}
                        data={userMngs}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={userMngs}
                            columns={columns}
                            search
                          >
                            {toolkitprops => (
                              <React.Fragment>
                                <Row>
                                  <Col sm="4">
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
                                  <Col sm="8">
                                    {showAddButton && (
                                      <div className="text-sm-end">
                                        <Tooltip
                                          title={this.props.t("Add")}
                                          placement="top"
                                        >
                                          <IconButton
                                            color="primary"
                                            onClick={this.toggle}
                                          >
                                            <i className="mdi mdi-plus-circle blue-noti-icon" />
                                          </IconButton>
                                        </Tooltip>
                                      </div>
                                    )}
                                  </Col>
                                </Row>

                                <BootstrapTable
                                  keyField="Id"
                                  {...toolkitprops.baseProps}
                                  {...paginationTableProps}
                                  data={userMngs}
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
                                      this.handleUserMngDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  noDataIndication={t(
                                    "No User management found"
                                  )}
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
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({
  userMngs,
  mobAppFacultyAccs,
  roles,
  menu_items,
}) => ({
  userMngs: userMngs.userMngs,
  deleted: userMngs.deleted,
  roles: roles.roles,
  faculties: mobAppFacultyAccs.faculties,
  userFaculties: userMngs.userFaculties,
  deletedDetail: userMngs.deletedDetail,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetFaculties: () => dispatch(fetchSetting()),
  onGetUniversityOrgStructures: () => dispatch(getUniversityOrgStructure()),
  onGetUserMngs: () => dispatch(getUserMngs()),
  onGetRoles: () => dispatch(getRoles()),
  onAddNewUserMng: userMng => dispatch(addNewUserMng(userMng)),
  onUpdateUserMng: userMng => dispatch(updateUserMng(userMng)),
  onDeleteUserMng: userMng => dispatch(deleteUserMng(userMng)),
  onGetUserMngDeletedValue: () => dispatch(getUserMngDeletedValue()),
  onGetUserFaculties: userId => dispatch(getUserFaculties(userId)),
  onAddNewUserFaculty: userMng => dispatch(addNewUserFaculty(userMng)),
  onDeleteUserFaculty: userMng => dispatch(deleteUserFaculty(userMng)),
  onGetUserFacultyDeletedValue: () => dispatch(getUserFacultyDeletedValue()),
  onAddNewUserRole: userRole => dispatch(addNewUserRole(userRole)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(UserMngsList));
