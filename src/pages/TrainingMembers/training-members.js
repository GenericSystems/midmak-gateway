import React, { Component } from "react";
import { Row, Col, Card, Alert, CardBody } from "reactstrap";
import Select from "react-select";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import Tooltip from "@mui/material/Tooltip";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import filterFactory, { textFilter, customFilter } from "react-bootstrap-table2-filter";

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
} from "react-bootstrap-table2-paginator";
import { withRouter, Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../utils/menuUtils";
class TrainingMembersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteModal: false,
      duplicateError: null,
      selectedRowId: null,
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
    };
  }
  componentDidMount() {
    const { trainingMembers, onGetTrainingMembers, deleted, user_menu, userTypes } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (trainingMembers && !trainingMembers.length) {
      onGetTrainingMembers();
      this.setState({ trainingMembers, deleted, userTypes });
    }
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
  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };

  handleAddRow = () => {
    const { onAddNewTrainingMember, trainingMembers } = this.props;

    const newRow = {
      name: "-----",
    };

    const emptyRowsExist = trainingMembers.some(
      trainingMember => trainingMember.name.trim() === "-----"
    );

    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewTrainingMember(newRow);
    }
  };

  handleDeleteRow = () => {
    const { onDeleteTrainingMember } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteTrainingMember(selectedRowId);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  handletrainingMemberDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateTrainingMember, trainingMembers } = this.props;

    const isDuplicate = trainingMembers.some(
      trainingMember =>
        trainingMember.Id !== rowId &&
        trainingMember.arTitle &&
        trainingMember.arTitle.trim() === fieldValue.trim()
    );

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateTrainingMember(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateTrainingMember(onUpdate);
    }
  };
  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleSuccessClose = () => {
    const { onGetTrainingMemberDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetTrainingMemberDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetTrainingMemberDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetTrainingMemberDeletedValue();
  };

  handleSelectChangeUserType = (rowId, fieldName, fieldValue) =>{
    const {onUpdateTrainingMember} =this.props;
    let onUpdate= {Id: rowId, [fieldName]: fieldValue}
    onUpdateTrainingMember(onUpdate)
  }

  render() {
    const { trainingMembers, t, deleted ,userTypes} = this.props;
    const {
      duplicateError,
      deleteModal,
      showAlert,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
    } = this.state;
    const alertMessage =
      deleted == 0 ? t("Can't Delete") : t("Deleted Successfully");
      console.log("userTypes",userTypes)
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
        // editable: showEditButton,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          //  hidden: !showSearchButton,
        }),
        headerStyle: (column, colIndex) => {
          return { 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center' 
          };
        },
        headerFormatter: (column, colIndex, { sortElement, filterElement }) => (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="mx-3">{t("Name")}</span> {sortElement}
            </div>
            <div style={{ marginTop: '5px', width: '100%' }}>
              {filterElement}
            </div>
          </div>
        )
      },
      {
        dataField: "phone",
        text: t("Phone"),
        sort: true,
        // editable: showEditButton,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          //  hidden: !showSearchButton,
        }),
        headerFormatter: (column, colIndex, { sortElement, filterElement }) => (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="mx-3">{t("Phone")}</span> {sortElement}
            </div>
            <div style={{ marginTop: '5px', width: '100%' }}>
              {filterElement}
            </div>
          </div>
        )
      },
      {
        dataField: "IdNum",
        text: t("Id Number"),
        sort: true,
        // editable: showEditButton,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          //  hidden: !showSearchButton,
        }),
        headerFormatter: (column, colIndex, { sortElement, filterElement }) => (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="mx-3">{t("Id Num")}</span> {sortElement}
            </div>
            <div style={{ marginTop: '5px', width: '100%' }}>
              {filterElement}
            </div>
          </div>
        )
      },
      {
        dataField: "email",
        text: t("Email"),
        sort: true,
        // editable: showEditButton,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          //  hidden: !showSearchButton,
        }),
        headerFormatter: (column, colIndex, { sortElement, filterElement }) => (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="mx-3">{t("Email")}</span> {sortElement}
            </div>
            <div style={{ marginTop: '5px', width: '100%' }}>
              {filterElement}
            </div>
          </div>
        )
      },
      {
        dataField: "userTypeId",
        text: t("Member Type"),
        sort: true,
        editable: false,

        formatter: (cellContent, row) => (
          <Select
          name="userTypeId"
          key={`select_endSemester`}
          options={userTypes}
          onChange={newValue => {
            this.handleSelectChangeUserType(
              row.Id,
              "userTypeId",
              newValue.value
            );
          }}
          defaultValue ={userTypes.find(
            opt =>
              opt.value ===
            row.userTypeId
          )}
         //  isDisabled={!showEditButton}
        />
        ),
        filter: customFilter(),
        filterRenderer: (onFilter, column) => (
          <div>
          {/*   {showSearchButton && ( */}
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
              />
            {/* )} */}
          </div>
        ),
        // headerFormatter: (column, colIndex, { sortElement, filterElement }) => (
        //   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        //     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        //       <span className="mx-3">{t("Member Type")}</span>{sortElement}{/* Adjust marginLeft as needed */}
        //     </div>
        //     <div style={{ marginTop: '5px', width: '100%' }}>
        //       {filterElement}
        //     </div>
        //   </div>
        // )
      },
      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        //  hidden: !showDeleteButton,
        formatter: (cellContent, trainingMember) => (
          <Tooltip title={this.props.t("Delete")} placement="top">
            <Link className="text-danger" to="#">
              <i
                className="mdi mdi-delete font-size-18"
                id="deletetooltip"
                onClick={() => this.onClickDelete(trainingMember)}
              ></i>
            </Link>
          </Tooltip>
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
                                  cellEdit={cellEditFactory({
                                    mode: "click",
                                    blurToSave: true,
                                    afterSaveCell: (
                                      oldValue,
                                      newValue,
                                      row,
                                      column
                                    ) => {
                                      this.handletrainingMemberDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  noDataIndication={t("No trainingMembers found")}
                                  defaultSorted={defaultSorting}
                                  filter={filterFactory()}
                                  rowStyle={(row) => {
                                    if (row.userTypeId === 1) {
                                      return { color: "#282828",backgroundColor:"rgba(17, 76, 144,.1)", fontWeight: 500  }; // Blue background with white text for userTypeId 1
                                    } else {
                                      return {color: "#282828", fontSize:"24px",backgroundColor:"rgba(197, 170, 90,.1)"}; // Gold background with black text for others
                                    }
                                  }}
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

const mapStateToProps = ({ trainingMembers, menu_items, userTypes }) => ({
  trainingMembers: trainingMembers.trainingMembers,
  deleted: trainingMembers.deleted,
  userTypes: userTypes.userTypes,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetTrainingMembers: () => dispatch(getTrainingMembers()),
  onAddNewTrainingMember: trainingMember => dispatch(addNewTrainingMember(trainingMember)),
  onUpdateTrainingMember: trainingMember => dispatch(updateTrainingMember(trainingMember)),
  onDeleteTrainingMember: trainingMember => dispatch(deleteTrainingMember(trainingMember)),
  onGetTrainingMemberDeletedValue: () => dispatch(getTrainingMemberDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(TrainingMembersList));
