import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { Card, CardBody, Col, Container, Row, Alert } from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import {
  getMismatchedGrades,
  addNewMismatchedGrade,
  updateMismatchedGrade,
  deleteMismatchedGrade,
  getMismatchedGradeDeletedValue,
} from "store/mismatchedGrades/actions";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";

class MismatchedGradesList extends Component {
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
      languageState: "",
    };
  }

  componentDidMount() {
    const lang = localStorage.getItem("I18N_LANGUAGE");
    const {
      mismatchedGrades,
      i18n,
      onGetMismatchedGrades,
      user_menu,
      location,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    onGetMismatchedGrades();
    this.setState({ mismatchedGrades });
    this.setState({ languageState: lang });

    i18n.on("languageChanged", this.handleLanguageChange);
  }

  handleLanguageChange = lng => {
    const { onGetMismatchedGrades } = this.props;
    const lang = localStorage.getItem("I18N_LANGUAGE");

    // if (lang != lng) {
    this.setState({ languageState: lng });
    // onGetMismatchedGrades(lng);
    // }
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

  toggleDeleteModal = () => {
    this.setState(prev => ({ deleteModal: !prev.deleteModal }));
  };

  toggleLanguage = () => {
    this.setState(prevState => ({
      languageState: prevState.languageState === "ar" ? "en" : "ar",
    }));
  };

  onClickDelete = row => {
    this.setState({ selectedRowId: row, deleteModal: true });
  };

  handleAddRow = () => {
    const { mismatchedGrades, onAddNewMismatchedGrade } = this.props;
    const newRow = { arTitle: "-----" };

    const exists = mismatchedGrades.some(
      item => item.arTitle.trim() === "-----"
    );

    if (exists) {
      this.setState({ duplicateError: this.props.t("Fill in the empty row") });
    } else {
      this.setState({ duplicateError: null });
      onAddNewMismatchedGrade(newRow);
    }
  };

  handleDeleteRow = () => {
    const { onDeleteMismatchedGrade } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId) {
      onDeleteMismatchedGrade(selectedRowId);
      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  handleMismatchedGradeChange = (rowId, fieldName, newValue) => {
    const { mismatchedGrades, onUpdateMismatchedGrade } = this.props;

    const isDuplicate = mismatchedGrades.some(
      type => type.Id !== rowId && type.arTitle.trim() === newValue.trim()
    );

    if (isDuplicate) {
      this.setState({ duplicateError: this.props.t("Value already exists") });
      onUpdateMismatchedGrade({ Id: rowId, [fieldName]: "-----" });
    } else {
      this.setState({ duplicateError: null });
      onUpdateMismatchedGrade({ Id: rowId, [fieldName]: newValue });
    }
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleSuccessClose = () => {
    this.setState({ showAlert: null });
    this.props.onGetMismatchedGradeDeletedValue();
  };

  handleErrorClose = () => {
    this.setState({ showAlert: null });
    this.props.onGetMismatchedGradeDeletedValue();
  };

  render() {
    const { mismatchedGrades, deleted, t } = this.props;
    const {
      duplicateError,
      deleteModal,
      showAlert,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
      languageState,
    } = this.state;

    const { SearchBar } = Search;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: mismatchedGrades.length,
      custom: true,
      page: 1,
    };
    const direction = languageState === "ar" ? "rtl" : "ltr";
    const columns = [
      { dataField: "Id", text: t("ID"), hidden: true },
      {
        dataField: "serial",
        text: "#",
        formatter: (cell, row, rowIndex, extraData) => {
          const currentPage = extraData?.currentPage || 1;
          const sizePerPage = extraData?.sizePerPage || pageOptions.sizePerPage;
          return rowIndex + 1 + (currentPage - 1) * sizePerPage;
        },
        editable: false,
      },
      {
        dataField: "TraineeNum",
        text: t("Trainee Num"),
        sort: true,
      },
      {
        dataField: "traineeName",
        text: t("Trainee Name"),
        sort: true,
      },
      {
        dataField: "examName",
        text: t("Exam Name"),
        sort: true,
      },
      {
        dataField: "enterGrade",
        text: t("Enter Grade"),
        sort: true,
      },
      {
        dataField: "auditGrade",
        text: t("Audit Grade"),
        sort: true,
      },
      {
        dataField: "marksDifference",
        text: t("Marks Difference"),
        sort: true,
      },
    ];

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteRow}
          onCloseClick={() =>
            this.setState({ deleteModal: false, selectedRowId: null })
          }
        />
        <div dir={direction} className="page-content">
          <Container fluid>
            <Breadcrumbs breadcrumbItem={t("Mismatched Grades")} />
            <Row>
              <Col>
                <Card>
                  <CardBody>
                    {duplicateError && (
                      <Alert color="danger" toggle={this.handleAlertClose}>
                        {duplicateError}
                      </Alert>
                    )}
                    {deleted === 0 && showAlert && (
                      <Alert color="danger" toggle={this.handleErrorClose}>
                        {t("Can't Delete")}
                      </Alert>
                    )}
                    {deleted === 1 && showAlert && (
                      <Alert color="success" toggle={this.handleSuccessClose}>
                        {t("Deleted Successfully")}
                      </Alert>
                    )}
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="Id"
                      columns={columns}
                      data={mismatchedGrades}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="Id"
                          data={mismatchedGrades}
                          columns={columns}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4">
                                  {/* {showSearchButton && ( */}
                                  <SearchBar
                                    {...toolkitprops.searchProps}
                                    placeholder={t("Search...")}
                                  />
                                  {/* )} */}
                                </Col>
                              </Row>
                              <BootstrapTable
                                keyField="Id"
                                {...toolkitprops.baseProps}
                                {...paginationTableProps}
                                columns={columns.map(col => ({
                                  ...col,
                                  formatter:
                                    col.dataField === "serial"
                                      ? (cell, row, rowIndex) =>
                                          rowIndex +
                                          1 +
                                          (paginationProps.page - 1) *
                                            paginationProps.sizePerPage
                                      : col.formatter,
                                }))}
                                data={mismatchedGrades}
                                noDataIndication={t(
                                  "No Mismatched Grades found"
                                )}
                                defaultSorted={[
                                  { dataField: "Id", order: "desc" },
                                ]}
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

const mapStateToProps = ({ mismatchedGrades, menu_items }) => ({
  mismatchedGrades: mismatchedGrades.mismatchedGrades || [],
  deleted: mismatchedGrades.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetMismatchedGrades: () => dispatch(getMismatchedGrades()),
  onAddNewMismatchedGrade: data => dispatch(addNewMismatchedGrade(data)),
  onUpdateMismatchedGrade: data => dispatch(updateMismatchedGrade(data)),
  onDeleteMismatchedGrade: data => dispatch(deleteMismatchedGrade(data)),
  onGetMismatchedGradeDeletedValue: () =>
    dispatch(getMismatchedGradeDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(withRouter(MismatchedGradesList)));
