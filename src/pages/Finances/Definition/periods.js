import React, { Component } from "react";
import {
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Input,
  Modal,
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

import { Formik, Field, Form, ErrorMessage } from "formik";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import Select from "react-select";
import {
  getPeriods,
  addNewPeriod,
  updatePeriod,
  deletePeriod,
  getPeriodDeletedValue,
  getFiscalYearContents,
} from "store/periods/actions";
import * as Yup from "yup";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import { withRouter, Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";
const USER_MNG_STORAGE_KEY = "editablePeriod";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
class PeriodsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteModal: false,
      duplicateError: null,
      selectedRowId: null,
      showAlert: null,
      modal: false,
      passwordChangeModal: false,
      selectedData: null,
      newPassword: "",
      toSemesterId: "",
      passwordDuplicateError: null,
      selectedFromSemester: null,
      selectedToSemester: null,
      selectedContentId: null,
      selectedFinanceYear: null,
      contentName: "",
      fiscalYearName: "",
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
    };
  }
  componentDidMount() {
    const {
      periods,
      onGetPeriods,
      deleted,
      yearSemesters,
      fiscalYearContents,
      fiscalYears,
      onGetFiscalYearContents,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (periods && !periods.length) {
      onGetPeriods();
      this.setState({ periods });
      this.setState({ deleted });
      this.setState({ yearSemesters });
      this.setState({ fiscalYearContents });
      this.setState({ fiscalYears });
    }
    this.toggle = this.toggle.bind(this);
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

  handleSave = values => {
    console.log("valuesvalues", values);
    const { onAddNewPeriod, yearSemesters } = this.props;
    const { selectedContentId, selectedToSemester, selectedFromSemester } =
      this.state;

    // const fromSemesterObj = yearSemesters.find(
    //   semes => semes.value === selectedFromSemester
    // );

    // const toSemesterObj = yearSemesters.find(
    //   semes => semes.value === selectedToSemester
    // );

    const obj = {
      arTitle: values.arTitle,
      enTitle: values.enTitle,
      contentId: selectedContentId,
      // fromSemesterId: fromSemesterObj.key,
      // toSemesterId: toSemesterObj.key,
      note: values.note,
      isDefault: 0,
    };
    onAddNewPeriod(obj);
    this.toggle();
  };

  handleUpdate = values => {
    const { onUpdatePeriod, yearSemesters } = this.props;
    const {
      selectedContentId,
      selectedFromSemester,
      selectedToSemester,
      periodId,
    } = this.state;

    // const fromSemesterObj = yearSemesters.find(
    //   opt => opt.value === selectedFromSemester
    // );

    // const toSemesterObj = yearSemesters.find(
    //   semes => semes.value === selectedToSemester
    // );

    const obj = {
      Id: periodId,
      arTitle: values["arTitle"],
      enTitle: values["enTitle"],
      contentId: selectedContentId,
      // fromSemesterId: fromSemesterObj.key,
      // toSemesterId: toSemesterObj.key,
      note: values["note"],
    };

    onUpdatePeriod(obj);
    this.toggle();
  };

  onPaginationPageChange = page => {
    if (
      this.node &&
      this.node.current &&
      this.node.current.props &&
      this.node.current.props.pagination &&
      this.node.current.props.pagination.options
    ) {
      this.node.current.p0rops.pagination.options.onPageChange(page);
    }
  };
  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };

  handleAddRow = () => {
    const { onAddNewPeriod, periods } = this.props;

    const newRow = {
      arTitle: "",
    };

    const emptyRowsExist = periods.some(
      period => period.arTitle.trim() === "-----"
    );

    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewPeriod(newRow);
    }
  };

  handleDeleteRow = () => {
    const { onDeletePeriod } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeletePeriod(selectedRowId);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  handlePeriodDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdatePeriod, periods } = this.props;

    const isDuplicate = periods.some(
      period =>
        period.Id !== rowId &&
        period[fieldName] &&
        period[fieldName].trim() === fieldValue.trim()
    );

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdatePeriod(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdatePeriod(onUpdate);
    }
  };
  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };
  handlePasswordClose = () => {
    this.setState({ passwordDuplicateError: null });
  };
  handleSuccessClose = () => {
    const { onGetPeriodDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetPeriodDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetPeriodDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetPeriodDeletedValue();
  };

  handleDataListChange = (event, fieldName) => {
    const { onGetFiscalYearContents, fiscalYears } = this.props;
    const selectedValue = event.target.value;

    const { selectedFromSemester, selectedToSemester, selectedFinanceYear } =
      this.state;

    if (fieldName == "fromSemesterId") {
      this.setState({ selectedFromSemester: selectedValue });
    }

    if (fieldName == "toSemesterId") {
      this.setState({ selectedToSemester: selectedValue });
    }

    if (fieldName == "financeYearId") {
      const financeObj = fiscalYears.find(
        fiscalYear => fiscalYear.value === selectedValue
      );
      this.setState({ selectedFinanceYear: selectedValue });
      console.log(
        "financeObjfinanceObjfinanceObjfinanceObjfinanceObj",
        fiscalYears
      );
      let obj = { fiscalYearId: financeObj.key };
      onGetFiscalYearContents(obj);
    }
  };

  handleInputFocus = fieldName => {
    const { selectedFromSemester, selectedToSemester, selectedFinanceYear } =
      this.state;

    if (fieldName == "fromSemesterId") {
      this.setState({ selectedFromSemester });
    }

    if (fieldName == "toSemesterId") {
      this.setState({ selectedToSemester });
    }

    if (fieldName == "financeYearId") {
      this.setState({ selectedFinanceYear });
    }
  };

  handleInputBlur = fieldName => {
    const { selectedFromSemester, selectedToSemester, selectedFinanceYear } =
      this.state;

    if (fieldName == "fromSemesterId") {
      this.setState({ selectedFromSemester });
    }

    if (fieldName == "toSemesterId") {
      this.setState({ selectedToSemester });
    }

    if (fieldName == "financeYearId") {
      this.setState({ selectedFinanceYear });
    }
  };

  handleSelectChange = (fieldName, selectedValue) => {
    if (fieldName == "contentId") {
      this.setState({
        contentObj: selectedValue,
        selectedContentId: selectedValue.value,
      });
    }
  };

  handleEditPeriod = arg => {
    const period = arg;
    const { yearSemesters } = this.props;
    this.setState({
      periodId: period.Id,
      arPeriod: period.arTitle,
      enPeriod: period.enTitle,
      selectedContentId: period.contentId,
      contentName: period.contentName,
      fiscalYearName: period.fiscalYear,
      // selectedFromSemesterId: period.fromSemesterId,
      // selectedToSemesterId: period.toSemesterId,
      notePeriod: period.note,

      isEdit: true,
    });
    const { fiscalYears } = this.props;

    if (period.fiscalYear) {
      const fiscalYear = fiscalYears.find(
        fiscalYear => fiscalYear.value === period.fiscalYear
      );
      this.setState({
        selectedFinanceYear: fiscalYear.key,
      });

      let obj = { fiscalYearId: fiscalYear.key };
      const { onGetFiscalYearContents } = this.props;
      onGetFiscalYearContents(obj);
    }

    // if (period.fromSemesterId) {
    //   const fromSemes = yearSemesters.find(
    //     yearSemester => yearSemester.key === period.fromSemesterId
    //   );
    //   this.setState({
    //     selectedFromSemester: fromSemes.value,
    //   });
    // }

    // if (period.toSemesterId) {
    //   const toSemes = yearSemesters.find(
    //     yearSemester => yearSemester.key === period.toSemesterId
    //   );
    //   this.setState({
    //     selectedToSemester: toSemes.value,
    //   });
    // }

    this.toggle();
  };

  handlePeriodClicks = () => {
    this.setState({
      period: "",
      isEdit: false,
      periodId: "",
      arPeriod: "",
      enPeriod: "",
      selectedContentId: null,
      contentName: "",
      fiscalYearName: "",
      selectedFromSemesterId: null,
      selectedToSemesterId: null,
      notePeriod: "",
    });
    this.toggle();
  };

  render() {
    const {
      periods,
      t,
      deleted,
      yearSemesters,
      fiscalYearContents,
      fiscalYears,
    } = this.props;
    const {
      duplicateError,
      deleteModal,
      showAlert,
      newPassword,
      toSemesterId,
      passwordDuplicateError,
      selectedFromSemester,
      selectedToSemester,
      selectedContentId,
      selectedFinanceYear,
      isEdit,
      modal,
      contentName,
      fiscalYearName,
      selectedFiscalYearId,
      periodId,
      arPeriod,
      enPeriod,
      notePeriod,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
    } = this.state;

    const period = this.state.period;

    const alertMessage =
      deleted == 0
        ? this.props.t("Can't Delete ")
        : this.props.t("Deleted Successfully");
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
        dataField: "arTitle",
        text: t("Period (ar)"),
        sort: true,
        editable: false,
      },
      {
        dataField: "enTitle",
        text: t("Period (en)"),
        sort: true,
        editable: false,
      },

      {
        dataField: "contentName",
        text: t("content type"),
        sort: true,
        editable: false,
      },
      {
        dataField: "fromSemesterId",
        text: t("from Semester"),
        sort: true,
        editable: false,
        formatter: (cell, row) => (
          <div>
            <Input
              type="text"
              name="fromSemesterId"
              id="year-semester"
              list="yearSemesterdatalistOptions"
              placeholder="Type to search..."
              className={"form-control"}
              defaultValue={
                (
                  yearSemesters.find(
                    yearSemester => yearSemester.key === row.fromSemesterId
                  ) || ""
                ).value
              }
              readOnly
            />
            <datalist id="yearSemesterdatalistOptions">
              {yearSemesters.map(yearSemester => (
                <option key={yearSemester.key} value={yearSemester.value} />
              ))}
            </datalist>
          </div>
        ),
      },
      {
        dataField: "toSemesterId",
        text: t("to Semester"),
        sort: true,
        editable: false,
        formatter: (cell, row) => (
          <div>
            <Input
              type="text"
              name="toSemesterId"
              id="year-semester"
              list="yearSemesterdatalistOptions"
              placeholder="Type to search..."
              className={"form-control"}
              defaultValue={
                (
                  yearSemesters.find(
                    yearSemester => yearSemester.key === row.toSemesterId
                  ) || ""
                ).value
              }
              readOnly
            />
            <datalist id="yearSemesterdatalistOptions">
              {yearSemesters.map(yearSemester => (
                <option key={yearSemester.key} value={yearSemester.value} />
              ))}
            </datalist>
          </div>
        ),
      },
      { dataField: "note", text: t("Note"), sort: true, editable: false },
      {
        dataField: "delete",
        text: "",
        style: { width: "3rem" },
        isDummyField: true,
        editable: false,
        hidden: !showDeleteButton,
        formatter: (cellContent, period) => (
          <div className="d-flex" style={{ width: "fit-content" }}>
            <Tooltip title={this.props.t("Delete ")} placement="top">
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(period)}
                ></i>
              </Link>
            </Tooltip>
            {showEditButton && (
              <Tooltip title={this.props.t("Create New")} placement="top">
                <Link className="text-secondary" to="#">
                  <i
                    className="mdi mdi-pencil font-size-18"
                    id="edittooltip"
                    onClick={() => this.handleEditPeriod(period)}
                  ></i>
                </Link>
              </Tooltip>
            )}
          </div>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: periods.length,
      custom: true,
    };

    return (
      <React.Fragment>
        <Modal
          isOpen={this.state.passwordChangeModal}
          className={this.props.className}
          centered={true}
        >
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
          </ModalBody>
        </Modal>

        <Modal
          isOpen={this.state.modal}
          className={this.props.className}
          centered={true}
        >
          <ModalHeader toggle={this.toggle} tag="h4">
            {!!isEdit
              ? this.props.t("Edit Period")
              : this.props.t("Add Period")}
          </ModalHeader>
          <ModalBody className="py-3 px-5">
            <Formik
              initialValues={
                (isEdit && {
                  arTitle: arPeriod,
                  enTitle: enPeriod,
                  contentId: period && period.contentId,
                  // fromSemesterId: period && period.fromSemesterId,
                  // toSemesterId: period && period.toSemesterId,
                  note: notePeriod,
                }) ||
                (!isEdit && {
                  arTitle: "",
                  enTitle: "",
                  contentId: null,
                  // fromSemesterId: null,
                  // toSemesterId: null,
                  note: "",
                })
              }
              enableReinitialize={true}
              // validationSchema={
              //   (!isEdit &&
              //     Yup.object().shape({
              //       arTitle: Yup.string()
              //         .required("arTitle is required")
              //         .notOneOf(
              //           periods.map(user => user.arTitle),
              //           "arTitle already taken"
              //         ),

              //       enTitle: Yup.string().required("enTitle is required"),
              //     })) ||
              //   (isEdit &&
              //     Yup.object().shape({
              //       arTitle: Yup.string().required("arTitle is required"),

              //       enTitle: Yup.string().required("enTitle is required"),
              //     }))
              // }
              onSubmit={(values, { setSubmitting }) => {
                if (isEdit) {
                  const updatePeriod = {
                    Id: periodId,
                    arTitle: values.arTitle,
                    enTitle: values.enTitle,
                    contentId: values.contentId,
                    fromSemesterId: values.fromSemesterId,
                    toSemesterId: values.toSemesterId,
                    note: values.note,
                  };
                  this.handleUpdate(updatePeriod);
                } else {
                  this.handleSave(values);
                }
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
                            {this.props.t("(ar)Title")}
                            <span className="text-danger ms-2">*</span>
                          </Label>
                        </Row>
                        <Field
                          name="arTitle"
                          type="text"
                          className={
                            "form-control" +
                            (errors.arTitle && touched.arTitle
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="arTitle"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>

                      <div className="mb-3">
                        <Row>
                          <Col>
                            <Row>
                              <Label className="form-label">
                                {t("(en)Title")}
                                <span className="text-danger ms-2">*</span>
                              </Label>
                            </Row>
                            <Field
                              name="enTitle"
                              type="text"
                              className={
                                "form-control" +
                                (errors.enTitle && touched.enTitle
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <ErrorMessage
                              name="enTitle"
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
                                {t("finance year")}
                              </Label>
                            </Row>
                            <Field
                              type="text"
                              name="financeYearId"
                              id="year-semester"
                              list="fiscalYeardatalistOptions"
                              placeholder="Type to search..."
                              className={"form-control"}
                              onBlur={() =>
                                this.handleInputBlur("financeYearId")
                              }
                              onFocus={() =>
                                this.handleInputFocus("financeYearId")
                              }
                              onChange={event =>
                                this.handleDataListChange(
                                  event,
                                  "financeYearId"
                                )
                              }
                              defaultValue={
                                (
                                  fiscalYears.find(
                                    fiscalYear =>
                                      fiscalYear.value === fiscalYearName
                                  ) || ""
                                ).value
                              }
                            />
                            <datalist id="fiscalYeardatalistOptions">
                              {fiscalYears.map(fiscalYear => (
                                <option
                                  key={fiscalYear.key}
                                  value={fiscalYear.value}
                                />
                              ))}
                            </datalist>
                          </Col>
                          <Col>
                            <Row>
                              <Label className="form-label">
                                {t("content type")}
                              </Label>
                            </Row>
                            <Select
                              className={`select-style-std`}
                              name="contentId"
                              key={`content_select`}
                              options={fiscalYearContents}
                              onChange={newValue => {
                                this.handleSelectChange("contentId", newValue);
                              }}
                              value={
                                (
                                  fiscalYearContents.find(
                                    opt => opt.label == contentName
                                  ) || ""
                                ).label
                              }
                            />
                          </Col>
                        </Row>
                      </div>

                      <div className="mb-3">
                        <Row>
                          <Col>
                            <Row>
                              <Label className="form-label">
                                {t("from Semester")}
                              </Label>
                            </Row>
                            <Field
                              type="text"
                              name="fromSemesterId"
                              id="year-semester"
                              list="yearSemesterdatalistOptions"
                              placeholder="Type to search..."
                              className={"form-control"}
                              onBlur={() =>
                                this.handleInputBlur("fromSemesterId")
                              }
                              onFocus={() =>
                                this.handleInputFocus("fromSemesterId")
                              }
                              onChange={event =>
                                this.handleDataListChange(
                                  event,
                                  "fromSemesterId"
                                )
                              }
                              value={
                                (
                                  yearSemesters.find(
                                    yearSemester =>
                                      yearSemester.value ===
                                      selectedFromSemester
                                  ) || ""
                                ).value
                              }
                            />
                            <datalist id="yearSemesterdatalistOptions">
                              {yearSemesters.map(yearSemester => (
                                <option
                                  key={yearSemester.key}
                                  value={yearSemester.value}
                                />
                              ))}
                            </datalist>
                          </Col>
                          <Col>
                            <Row>
                              <Label className="form-label">
                                {t("to Semester")}
                              </Label>
                            </Row>
                            <Field
                              type="text"
                              name="toSemesterId"
                              id="year-semester"
                              list="toSemesterdatalistOptions"
                              placeholder="Type to search..."
                              className={"form-control"}
                              onBlur={() =>
                                this.handleInputBlur("toSemesterId")
                              }
                              onFocus={() =>
                                this.handleInputFocus("toSemesterId")
                              }
                              onChange={event =>
                                this.handleDataListChange(event, "toSemesterId")
                              }
                              value={
                                (
                                  yearSemesters.find(
                                    yearSemester =>
                                      yearSemester.value === selectedToSemester
                                  ) || ""
                                ).value
                              }
                            />
                            <datalist id="toSemesterdatalistOptions">
                              {yearSemesters.map(yearSemester => (
                                <option
                                  key={yearSemester.key}
                                  value={yearSemester.value}
                                />
                              ))}
                            </datalist>
                          </Col>
                        </Row>
                      </div>

                      <div className="mb-3">
                        <Row>
                          <Col>
                            <Row>
                              <Label className="form-label">{t("Note")}</Label>
                            </Row>
                            <Field
                              name="note"
                              type="textarea"
                              className={"form-control"}
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
              title={t("Periods")}
              breadcrumbItem={t("Periods List")}
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
                        data={periods}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={periods}
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
                                            onClick={this.handlePeriodClicks}
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
                                  data={periods}
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
                                      this.handlePeriodDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  noDataIndication={t("No Periods found")}
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

const mapStateToProps = ({ periods, generalManagements, menu_items }) => ({
  periods: periods.periods,
  deleted: periods.deleted,
  yearSemesters: generalManagements.yearSemesters,
  fiscalYearContents: periods.fiscalYearContents,
  fiscalYears: periods.fiscalYears,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetPeriods: () => dispatch(getPeriods()),
  onAddNewPeriod: period => dispatch(addNewPeriod(period)),
  onUpdatePeriod: period => dispatch(updatePeriod(period)),
  onDeletePeriod: period => dispatch(deletePeriod(period)),
  onGetPeriodDeletedValue: () => dispatch(getPeriodDeletedValue()),
  onGetFiscalYearContents: fiscalYear =>
    dispatch(getFiscalYearContents(fiscalYear)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(PeriodsList));
