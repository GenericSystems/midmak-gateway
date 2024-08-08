// Importing necessary modules and components for the component
import React, { Component } from "react";
import Select from "react-select"; // Dropdown selection component
import BootstrapTable from "react-bootstrap-table-next"; // Bootstrap table component
import { IconButton } from "@mui/material"; // Material UI icon button component
import Breadcrumbs from "../../components/Common/Breadcrumb"; // Breadcrumb navigation component
import { withTranslation } from "react-i18next"; // i18n translation HOC
import { connect } from "react-redux"; // Redux connect function to bind state and dispatch to props
import Tooltip from "@mui/material/Tooltip"; // Tooltip component from Material UI
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit"; // Toolkit for advanced Bootstrap Table features
import filterFactory, {
  textFilter,
  customFilter,
} from "react-bootstrap-table2-filter"; // Filtering features for Bootstrap Table
import { Formik, Field, Form, ErrorMessage } from "formik"; // Formik for form handling and validation
import {
  Row,
  Col,
  Card,
  CardBody,
  Alert,
  Modal,
  Label,
  Button,
  ModalHeader,
  ModalBody,
} from "reactstrap"; // Reactstrap components for layout and styling
import * as Yup from "yup"; // Yup for form validation schema

// Importing action creators for managing training members
import {
  getTrainingMembers,
  addNewTrainingMember,
  updateTrainingMember,
  deleteTrainingMember,
  getTrainingMemberDeletedValue,
} from "store/trainingMembers/actions";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator"; // Pagination factory for table
import { withRouter, Link } from "react-router-dom"; // React Router components
import DeleteModal from "components/Common/DeleteModal"; // Custom delete modal component
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../utils/menuUtils"; // Utility functions for checking page permissions

class TrainingMembersList extends Component {
  constructor(props) {
    super(props);
    // Initial state for the component
    this.state = {
      deleteModal: false, // Controls visibility of the delete confirmation modal
      duplicateError: null, // Stores any duplicate entry error messages
      selectedRowId: null, // ID of the row selected for editing or deleting
      showAlert: null, // Controls visibility of the alert messages
      showAddButton: false, // Controls visibility of the "Add" button based on user permissions
      showDeleteButton: false, // Controls visibility of the "Delete" button based on user permissions
      showEditButton: false, // Controls visibility of the "Edit" button based on user permissions
      showSearchButton: false, // Controls visibility of the search feature based on user permissions
      modal: false, // Controls visibility of the add/edit modal
      isEdit: false, // Tracks whether the modal is in "edit" mode
    };
  }

  // Lifecycle method called when the component mounts
  componentDidMount() {
    const {
      trainingMembers,
      onGetTrainingMembers,
      deleted,
      user_menu,
      userTypes,
    } = this.props;

    // Update visibility of buttons based on user permissions and page
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);

    // If no training members are loaded, fetch them from the store
    if (trainingMembers && !trainingMembers.length) {
      onGetTrainingMembers();
      this.setState({ trainingMembers, deleted, userTypes });
    }
  }

  // Lifecycle method called when the component updates
  componentDidUpdate(prevProps, prevState, snapshot) {
    // If user menu or page changes, update button visibility
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

  // Toggles the visibility of the modal for adding/editing a training member
  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  // Updates the visibility of the "Add" button based on user permissions
  updateShowAddButton = (menu, pathname) => {
    const showAddButton = checkIsAddForPage(menu, pathname);
    this.setState({ showAddButton });
  };

  // Updates the visibility of the "Delete" button based on user permissions
  updateShowDeleteButton = (menu, pathname) => {
    const showDeleteButton = checkIsDeleteForPage(menu, pathname);
    this.setState({ showDeleteButton });
  };

  // Updates the visibility of the "Edit" button based on user permissions
  updateShowEditButton = (menu, pathname) => {
    const showEditButton = checkIsEditForPage(menu, pathname);
    this.setState({ showEditButton });
  };

  // Updates the visibility of the search feature based on user permissions
  updateShowSearchButton = (menu, pathname) => {
    const showSearchButton = checkIsSearchForPage(menu, pathname);
    this.setState({ showSearchButton });
  };

  // Opens the delete confirmation modal
  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  // Handles the click event for deleting a row, opens the delete modal
  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };

  // Handles form submission for adding or editing a training member
  handleFormSubmit = values => {
    const { isEdit, selectedRowId } = this.state;
    const { onAddNewTrainingMember, onUpdateTrainingMember } = this.props;

    if (isEdit) {
      // If editing, update the existing member with the new values
      onUpdateTrainingMember({ Id: selectedRowId, ...values });
    } else {
      // If adding a new member, submit the form values to the store
      onAddNewTrainingMember(values);
    }

    // Close the modal after submission and reset the selectedRowId
    this.setState({ modal: false, selectedRowId: null });
  };

  // Opens the modal for adding a new training member
  handleAddRow = () => {
    this.setState({
      isEdit: false,
      modal: true,
    });
  };

  // Handles the deletion of a training member
  handleDeleteRow = () => {
    const { onDeleteTrainingMember } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      console.log("DELETE >> ", selectedRowId);
      // Dispatch the delete action to the store
      onDeleteTrainingMember({ Id: selectedRowId.Id });

      // Reset the state after deletion
      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  // Handles changes to the training member data during editing
  handletrainingMemberDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateTrainingMember, trainingMembers } = this.props;

    // Check if the new value is a duplicate
    const isDuplicate = trainingMembers.some(
      trainingMember =>
        trainingMember.Id !== rowId &&
        trainingMember.arTitle &&
        trainingMember.arTitle.trim() === fieldValue.trim()
    );

    if (isDuplicate) {
      // If duplicate, show an error message
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateTrainingMember(onUpdate);
    } else {
      // Otherwise, update the training member with the new value
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateTrainingMember(onUpdate);
    }
  };

  // Closes the alert messages
  handleAlertClose = () => {
    this.setState({ duplicateError: null, emptyError: null });
  };

  // Closes the success alert message after deletion
  handleSuccessClose = () => {
    const { onGetTrainingMemberDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetTrainingMemberDeletedValue();
  };

  // Closes the error alert message after deletion fails
  handleErrorClose = () => {
    const { onGetTrainingMemberDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetTrainingMemberDeletedValue();
  };

  // Handles changes to the user type of a training member during editing
  handleSelectChangeUserType = (rowId, fieldName, fieldValue) => {
    const { onUpdateTrainingMember } = this.props;
    let onUpdate = { Id: rowId, [fieldName]: fieldValue };
    onUpdateTrainingMember(onUpdate);
  };

  // Handles the click event for editing a training member, opens the modal with the selected member's data
  handleMemberClick = member => {
    this.setState({
      selectedMember: member,
      selectedRowId: member.Id,
      isEdit: true,
      modal: true,
    });
  };

  render() {
    const { trainingMembers, t, deleted, userTypes } = this.props;
    const { duplicateError, deleteModal, showAlert, isEdit, modal } =
      this.state;
    const alertMessage =
      deleted == 0 ? t("Can't Delete") : t("Deleted Successfully");
    console.log("userTypes", userTypes);
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
        dataField: "name",
        text: t("Name"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          //  hidden: !showSearchButton,
        }),
        headerStyle: (column, colIndex) => {
          return {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          };
        },
        headerFormatter: (column, colIndex, { sortElement, filterElement }) => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="mx-3">{t("Name")}</span> {sortElement}
            </div>
            <div style={{ marginTop: "5px", width: "100%" }}>
              {filterElement}
            </div>
          </div>
        ),
      },
      {
        dataField: "phone",
        text: t("Phone"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          //  hidden: !showSearchButton,
        }),
        headerFormatter: (column, colIndex, { sortElement, filterElement }) => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="mx-3">{t("Phone")}</span> {sortElement}
            </div>
            <div style={{ marginTop: "5px", width: "100%" }}>
              {filterElement}
            </div>
          </div>
        ),
      },
      {
        dataField: "IdNum",
        text: t("Id Number"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          //  hidden: !showSearchButton,
        }),
        headerFormatter: (column, colIndex, { sortElement, filterElement }) => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="mx-3">{t("Id Num")}</span> {sortElement}
            </div>
            <div style={{ marginTop: "5px", width: "100%" }}>
              {filterElement}
            </div>
          </div>
        ),
      },
      {
        dataField: "email",
        text: t("Email"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          //  hidden: !showSearchButton,
        }),
        headerFormatter: (column, colIndex, { sortElement, filterElement }) => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="mx-3">{t("Email")}</span> {sortElement}
            </div>
            <div style={{ marginTop: "5px", width: "100%" }}>
              {filterElement}
            </div>
          </div>
        ),
      },
      {
        dataField: "userTypeId",
        text: t("Member Type"),
        sort: true,
        editable: false,
      
        formatter: (cellContent, row) => {
          const selectedUserType = userTypes.find(
            opt => opt.value === row.userTypeId
          );
          return selectedUserType ? selectedUserType.label : "";
        },
      
        filter: customFilter(),
        filterRenderer: (onFilter, column) => (
          <div>
            <Select
            
              onChange={selectedOption => {
                if (selectedOption && selectedOption.value === "") {
                  onFilter("", column);
                } else {
                  onFilter(selectedOption.value, column);
                }
              }}
              options={[
                { label: this.props.t("Select..."), value: "" },
                ...userTypes,
              ]}
              defaultValue={""}
              styles={{
                control: (provided) => ({
                  ...provided,
                  backgroundColor: '#ebf5ff', // Change to your desired background color
                  borderColor: '#ced4da',     // Optional: Change border color
                  boxShadow: 'none',          // Optional: Remove box shadow
                }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: '#ebf5ff', // Optional: Change menu background color
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isFocused ? '#ffffff' : '#ebf5ff', // Change on focus
                  color: '#333', // Optional: Change font color
                }),
              }}
            />
          </div>
        ),
      
        headerFormatter: (column, colIndex, { sortElement, filterElement }) => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
            className="mb-1"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="mx-3">{t("Member Type")}</span> {sortElement}
            </div>
            <div style={{ width: "90%" }} className="mb-2 ">
              <span className="text-secondary fw-normal">{filterElement}</span>
            </div>
          </div>
        ),
      },

      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        //  hidden: !showDeleteButton,
        formatter: (cellContent, trainingMember) => (
          <div className="d-flex gap-3">
            <Tooltip title={this.props.t("Edit")} placement="top">
              <Link className="text-secondary" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={() => this.handleMemberClick(trainingMember)}
                ></i>
              </Link>
            </Tooltip>
            <Tooltip title={this.props.t("Delete")} placement="top">
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(trainingMember)}
                ></i>
              </Link>
            </Tooltip>
          </div>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: trainingMembers.length,
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
            <Breadcrumbs breadcrumbItem={t("trainingMembers List")} />

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
                        data={trainingMembers}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={trainingMembers}
                            columns={columns}
                            search
                          >
                            {toolkitprops => (
                              <React.Fragment>
                                <Row>
                                  <Col sm="4">
                                    <div className="search-box ms-2 mb-2 d-inline-block">
                                      {/*   {showSearchButton && ( */}
                                      <div className="position-relative">
                                        <SearchBar
                                          {...toolkitprops.searchProps}
                                          placeholder={t("Search...")}
                                        />
                                      </div>
                                    </div>
                                  </Col>
                                  <Col sm="8">
                                    {/* {showAddButton && ( */}
                                    <div className="text-sm-end">
                                      <Tooltip
                                        title={this.props.t("Add")}
                                        placement="top"
                                      >
                                        <IconButton
                                          color="primary"
                                          onClick={this.handleAddRow}
                                        >
                                          <i className="mdi mdi-plus-circle blue-noti-icon" />
                                        </IconButton>
                                      </Tooltip>
                                    </div>
                                  </Col>
                                </Row>
                                <BootstrapTable
                                  keyField="Id"
                                  {...toolkitprops.baseProps}
                                  {...paginationTableProps}
                                  data={trainingMembers}
                                  columns={columns}
                                  noDataIndication={t(
                                    "No trainingMembers found"
                                  )}
                                  defaultSorted={defaultSorting}
                                  filter={filterFactory()}
                                  rowStyle={row => {
                                    if (row.userTypeId === 1) {
                                      return {
                                        color: "#282828",
                                        backgroundColor: "rgba(17, 76, 144,.1)",
                                        fontWeight: 500,
                                      };
                                    } else {
                                      return {
                                        color: "#282828",
                                        fontSize: "24px",
                                        backgroundColor:
                                          "rgba(197, 170, 90,.1)",
                                      };
                                    }
                                  }}
                                />
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </Col>
                                <Modal
                                  isOpen={modal}
                                  className={this.props.className}
                                >
                                  <ModalHeader toggle={this.toggle} tag="h4">
                                    {isEdit
                                      ? t("Edit Member")
                                      : t("Add Member")}
                                  </ModalHeader>

                                  <ModalBody>
                                    <Formik
                                      initialValues={{
                                        name: isEdit
                                          ? this.state.selectedMember.name
                                          : "",
                                        phone: isEdit
                                          ? this.state.selectedMember.phone
                                          : "",
                                        IdNum: isEdit
                                          ? this.state.selectedMember.IdNum
                                          : "",
                                        email: isEdit
                                          ? this.state.selectedMember.email
                                          : "",
                                        userTypeId: isEdit
                                          ? this.state.selectedMember.userTypeId
                                          : "",
                                      }}
                                      validationSchema={Yup.object().shape({
                                        name: Yup.string().required(
                                          t("Name is required")
                                        ),
                                        phone: Yup.string().required(
                                          t("Phone is required")
                                        ),
                                        IdNum: Yup.string().required(
                                          t("ID Number is required")
                                        ),
                                        email: Yup.string()
                                          .email(t("Invalid email"))
                                          .required(t("Email is required")),
                                        userTypeId: Yup.string().required(
                                          t("Member Type is required")
                                        ),
                                      })}
                                      onSubmit={this.handleFormSubmit}
                                    >
                                      {({ errors, touched }) => (
                                        <Form>
                                          <Row>
                                            <Col md="6">
                                              <Label>{t("Name")}</Label>
                                              <Field
                                                name="name"
                                                type="text"
                                                className={`form-control ${
                                                  errors.name && touched.name
                                                    ? "is-invalid"
                                                    : ""
                                                }`}
                                              />
                                              <ErrorMessage
                                                name="name"
                                                component="div"
                                                className="invalid-feedback"
                                              />
                                            </Col>
                                            <Col md="6">
                                              <Label>{t("Phone")}</Label>
                                              <Field
                                                name="phone"
                                                type="text"
                                                className={`form-control ${
                                                  errors.phone && touched.phone
                                                    ? "is-invalid"
                                                    : ""
                                                }`}
                                              />
                                              <ErrorMessage
                                                name="phone"
                                                component="div"
                                                className="invalid-feedback"
                                              />
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col md="6">
                                              <Label>{t("ID Number")}</Label>
                                              <Field
                                                name="IdNum"
                                                type="text"
                                                className={`form-control ${
                                                  errors.IdNum && touched.IdNum
                                                    ? "is-invalid"
                                                    : ""
                                                }`}
                                              />
                                              <ErrorMessage
                                                name="IdNum"
                                                component="div"
                                                className="invalid-feedback"
                                              />
                                            </Col>
                                            <Col md="6">
                                              <Label>{t("Email")}</Label>
                                              <Field
                                                name="email"
                                                type="email"
                                                className={`form-control ${
                                                  errors.email && touched.email
                                                    ? "is-invalid"
                                                    : ""
                                                }`}
                                              />
                                              <ErrorMessage
                                                name="email"
                                                component="div"
                                                className="invalid-feedback"
                                              />
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col md="6">
                                              <Label>{t("Member Type")}</Label>
                                              <Field name="userTypeId">
                                                {({ field, form }) => (
                                                  <Select
                                                    name="userTypeId"
                                                    key={`select_userType`}
                                                    options={userTypes}
                                                    defaultValue={userTypes.find(
                                                      opt =>
                                                        opt.value ===
                                                        form.values.userTypeId
                                                    )}
                                                    onChange={option =>{
                                                      console.log(form.values,"FORM")
                                                      form.setFieldValue(
                                                        "userTypeId",
                                                        option.value
                                                      )}
                                                    }
                                                  />
                                                )}
                                              </Field>
                                              <ErrorMessage
                                                name="userTypeId"
                                                component="div"
                                                className="invalid-feedback"
                                              />
                                            </Col>
                                          </Row>
                                          <div className="text-end mt-4">
                                            <Button
                                              type="submit"
                                              color="primary"
                                            >
                                              {t("Save")}
                                            </Button>
                                          </div>
                                        </Form>
                                      )}
                                    </Formik>
                                  </ModalBody>
                                </Modal>
                                ;
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

const mapStateToProps = ({ trainingMembers, menu_items, userTypes }) => ({
  trainingMembers: trainingMembers.trainingMembers,
  deleted: trainingMembers.deleted,
  userTypes: userTypes.userTypes,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetTrainingMembers: () => dispatch(getTrainingMembers()),
  onAddNewTrainingMember: trainingMember =>
    dispatch(addNewTrainingMember(trainingMember)),
  onUpdateTrainingMember: trainingMember =>
    dispatch(updateTrainingMember(trainingMember)),
  onDeleteTrainingMember: trainingMember =>
    dispatch(deleteTrainingMember(trainingMember)),
  onGetTrainingMemberDeletedValue: () =>
    dispatch(getTrainingMemberDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(TrainingMembersList));
