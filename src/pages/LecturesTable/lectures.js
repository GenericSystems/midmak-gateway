import React, { Component } from "react";
import classnames from "classnames";
import { fetchFile } from "../../store/_common/actions"; // adjust path

import {
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  CardTitle,
  Input,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  InputGroup,
  FormGroup,
  TabContent,
  TabPane,
} from "reactstrap";
import * as Yup from "yup";
import Tooltip from "@mui/material/Tooltip";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import filterFactory, {
  textFilter,
  customFilter,
} from "react-bootstrap-table2-filter";
import Select from "react-select";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import Accordion from "react-bootstrap/Accordion";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as moment from "moment";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import { withRouter, Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";
import FilePage from "pages/FilePage";
import FullPageModal from "components/FileView/FullPageModal";
import { uploadFile } from "store/_common/actions";

import { getLectures } from "store/lectures/actions";
import { BackburgerIcon } from "@icons/material";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../utils/menuUtils";

class LecturesList extends Component {
  constructor(props) {
    super(props);
    this.fileInputRef = React.createRef();
    console.log("Constructor props", props);
    this.state = {
      lectures: {},
      lecture: "",
      errorMessage: null,
      deleteModal: false,
      selectedRowId: null,
      isEdit: false,
      modal: false,
      modal1: false,
      showModal: false,
      fileName: "",
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      successMessage: null,
      selectedYear: null,
      currentYearObj: {},
      values: "",
      errorMessage1: null,
      successMessage1: null,
      HasBrotherCheck: false,
      showGenerateButton: false,
      totalGradeValue: "",
      traineeGrade: "",
      studentGrade: "",
      attestatedValue: 0,
      rows: [],
      bloodTypeName: "",
      duplicateRelativeError: null,
      duplicateError: null,
      duplicateErrorSibling: null,
      lastUsedId: 0,
      stdDocsArray: [],
      lastUsedExperienceId: 0,
      trnProfExperiences: {},
      trnProfExperience: "",
      showSiblingsSelect: false,
      siblingsArray: [],
      deleteBroModal: false,
      languageState: "",
      selectedTraineeId: 0,
      mimeType: null,
      dataUrl: null,
      downloadfinished: 0,
    };
  }

  componentDidMount() {
    const authUserStr = localStorage.getItem("authUser");
    let traineeId = "";

    if (authUserStr) {
      try {
        const parsed = JSON.parse(authUserStr);

        if (parsed && parsed.length > 0) {
          traineeId = parsed[0].traineeId;
        }
      } catch (e) {
        console.error("authUser parsing failed", e);
      }
    }

    console.log("Trainee ID:", traineeId);
    const lang = localStorage.getItem("I18N_LANGUAGE");
    const {
      lectures,
      onGetLectures,
      deleted,
      user_menu,
      i18n,
      mimeType,
      dataUrl,
      downloadfinished,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    // if (lectures && !lectures.length) {
    onGetLectures(lang, traineeId);
    console.log("9999999999", traineeId);
    this.setState({ dataUrl, mimeType, downloadfinished });
    this.setState({ lectures });
    this.setState({
      deleted,
    });
    // }

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
    this.setState({ languageState: lang });
    i18n.on("languageChanged", this.handleLanguageChange);
  }

  handleFetch(fileName) {
    const { onFetchFile } = this.props;
    console.log("Calling with fileData", fileName, onFetchFile);
    this.setState({
      dataUrl: null,
      mimeType: null,
      downloadfinished: this.props.downloadfinished,
    });
    onFetchFile(fileName);
  }

  openModal = (event, fileName) => {
    console.log("Opening modal", event, fileName);
    this.handleFetch(fileName);
  };

  closeModal = () => {
    console.log("Closing modal");
    this.setState({ showModal: false });
  };

  handleLanguageChange = lng => {
    // const { onGetLectures } = this.props;
    // const lang = localStorage.getItem("I18N_LANGUAGE");

    // if (lang != lng) {
    this.setState({ languageState: lng });
    // onGetLectures(lng);
    // }
  };

  componentDidUpdate(prevProps) {
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
      this.updateShowSearchButton(
        this.props.user_menu,
        this.props.location.pathname
      );
    }
  }

  toggleLanguage = () => {
    this.setState(prevState => ({
      languageState: prevState.languageState === "ar" ? "en" : "ar",
    }));
  };

  updateShowAddButton = (menu, pathname) => {
    const showAddButton = checkIsAddForPage(menu, pathname);
    this.setState({ showAddButton });
  };

  updateShowDeleteButton = (menu, pathname) => {
    const showDeleteButton = checkIsDeleteForPage(menu, pathname);
    this.setState({ showDeleteButton });
  };

  updateShowSearchButton = (menu, pathname) => {
    const showSearchButton = checkIsSearchForPage(menu, pathname);
    this.setState({ showSearchButton });
  };

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
    this.props.onGetLectures();
  };

  toggle1 = () => {
    this.setState(prevState => ({
      modal1: !prevState.modal1,
    }));
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

  handleSuccessClose = () => {
    this.setState({ successMessage: null });
  };

  handleExpSuccessClose = () => {
    this.setState({ successMessage1: null, showAlert: null });
  };

  handleExpErrorClose = () => {
    this.setState({ errorMessage1: null, showAlert: null });
  };

  handleErrorClose = () => {
    this.setState({ errorMessage: null });
  };

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      if (tab >= 1 && tab <= 2) {
        var modifiedSteps = [...this.state.passedSteps, tab];
        this.setState({
          activeTab: tab,
          passedSteps: modifiedSteps,
        });
      }
    }
  }

  render() {
    const { lectures, socialStatus, deleted, t, nationalities, genders } =
      this.props;
    const {
      trainee,
      languageState,
      deleteModal,
      successMessage,
      errorMessage,
    } = this.state;

    const direction = languageState === "ar" ? "rtl" : "ltr";

    const traineeData = lectures && lectures.length > 0 ? lectures[0] : {};

    const { SearchBar } = Search;

    const alertMessage =
      deleted == 0
        ? this.props.t("Can't Delete")
        : this.props.t("Deleted Successfully");

    const defaultSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];

    const columns = [
      { dataField: "Id", text: t("ID"), hidden: true },
      {
        dataField: "serial",
        text: "#",
        formatter: (cell, row, rowIndex) => rowIndex + 1,
      },
      { dataField: "courseName", text: t("Course Name"), sort: true },
      { dataField: "courseCode", text: t("Course Code"), sort: true },
      { dataField: "creditsCount", text: t("Credits Count"), sort: true },
      {
        dataField: "theoreticalGroup",
        text: t("Theoretical Group"),
        sort: true,
      },
      { dataField: "practicalGroup", text: t("Practical Group"), sort: true },
      // { dataField: "clinicalGroup", text: t("Clinical Group"), sort: true },

      { dataField: "saturday", text: t("Saturday"), sort: true },
      { dataField: "sunday", text: t("Sunday"), sort: true },
      { dataField: "monday", text: t("Monday"), sort: true },
      { dataField: "tuesday", text: t("Tuesday"), sort: true },
      { dataField: "wednesday", text: t("Wednesday"), sort: true },
      { dataField: "thursday", text: t("Thursday"), sort: true },
      { dataField: "friday", text: t("Friday"), sort: true },
    ];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: lectures.length,
      custom: true,
    };

    return (
      <div dir={direction} className="page-content">
        <React.Fragment>
          <DeleteModal
            show={deleteModal}
            onDeleteClick={this.handleDeleteRow}
            onCloseClick={() => this.setState({ deleteModal: false })}
          />
          <div className="container-fluid">
            <Breadcrumbs breadcrumbItem={t("Lectures")} />

            <Row>
              <Col lg="12">
                <Card>
                  <CardHeader>
                    <h4>
                      <i className="fas fa-user-circle" />{" "}
                      {languageState === "ar"
                        ? `${traineeData.fullName}`
                        : `${traineeData.fullNameE}`}
                    </h4>
                  </CardHeader>
                  <CardBody>
                    <React.Fragment>
                      <Row className="mt-4">
                        <Col lg="12">
                          <Row>
                            <Col lg="6">
                              <h5 className="header-table text-center mb-2">
                                {t("Study Courses")}
                              </h5>
                            </Col>
                            <Col lg="6">
                              <h5 className="header-table text-center mb-2">
                                {t("Lecture Dates")}
                              </h5>
                            </Col>
                          </Row>
                          <BootstrapTable
                            keyField="Id"
                            columns={columns}
                            defaultSorted={defaultSorting}
                            bootstrap4
                            data={lectures}
                          />
                        </Col>
                      </Row>
                    </React.Fragment>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </React.Fragment>
      </div>
    );
  }
}

const mapStateToProps = ({ lectures }) => ({
  lectures: lectures.lectures,
});

const mapDispatchToProps = dispatch => ({
  onGetLectures: (lng, traineeId) => dispatch(getLectures(lng, traineeId)),
  onUploadFile: fileData => dispatch(uploadFile(fileData)),
  onFetchFile: fileId => dispatch(fetchFile(fileId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(LecturesList));
