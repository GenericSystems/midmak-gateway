import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Media,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  CardText,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Button,
  Table,
  Alert,
  Collapse,
} from "reactstrap";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import classnames from "classnames";
/* import "./studyplans.scss"; */
import Editable from "react-bootstrap-editable";
import { withTranslation } from "react-i18next";
//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import {
  getGeneralManagements,
  addNewGeneralManagement,
  updateGeneralManagement,
  deleteGeneralManagement,
  fetchYearsSemesters,
} from "store/general-management/actions";
import { generalManagements } from "common/data";
import { checkIsEditForPage } from "../../../utils/menuUtils";
class GeneralManagementsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputFields: {
        currentSemester: {
          selectedValue: "",
          showButtons: false,
        },
        showSemester: {
          selectedValue: "",
          showButtons: false,
        },
        registerSemester: {
          selectedValue: "",
          showButtons: false,
        },
        blockAmount: {
          selectedValue: 0,
          showButtons: false,
        },
        secondBlockAmount: {
          selectedValue: 0,
          showButtons: false,
        },
        currency: {
          selectedValue: "",
          showButtons: false,
        },
        secondCurrency: {
          selectedValue: "",
          showButtons: false,
        },
      },
      inputFocused: false,
      showButtons: false,

      duplicateError: null,
      isShowFinanceTotal: false,
      isShowGrades: false,
      showEditButton: false,
    };
  }

  componentDidMount() {
    this.initializeState();
    const {
      onGetGeneralManagements,
      generalManagements,
      yearSemesters,
      onfetchSetting,
      user_menu,
    } = this.props;
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    if (generalManagements && !generalManagements.length) {
      onGetGeneralManagements();

      this.setState({ generalManagements });
    }
    onfetchSetting();
  }

  componentDidUpdate(prevProps) {
    // Update the state if necessary when props change
    if (prevProps.generalManagements !== this.props.generalManagements) {
      this.initializeState();
    }
    if (
      this.props.user_menu !== prevProps.user_menu ||
      this.props.location.pathname !== prevProps.location.pathname
    ) {
      this.updateShowEditButton(
        this.props.user_menu,
        this.props.location.pathname
      );
    }
  }

  updateShowEditButton = (menu, pathname) => {
    const showEditButton = checkIsEditForPage(menu, pathname);
    this.setState({ showEditButton });
  };

  // Function to initialize the state
  initializeState() {
    const { generalManagements } = this.props;
    // Check if generalManagements is available and not empty
    if (generalManagements && generalManagements.length > 0) {
      const {
        Id,
        blockAmount,
        secondBlockAmount,
        currentSemester,
        isShowFinanceTotal,
        isShowGrades,
        registerSemester,
        showSemester,
        blockAmountCurrencyId,
        secondBlockAmountCurrencyId,
      } = generalManagements[0];

      this.setState({
        inputFields: {
          currentSemester: {
            selectedValue: currentSemester,
            showButtons: false,
          },
          showSemester: {
            selectedValue: showSemester,
            showButtons: false,
          },
          registerSemester: {
            selectedValue: registerSemester,
            showButtons: false,
          },
          blockAmount: {
            selectedValue: blockAmount,
            showButtons: false,
          },
          secondBlockAmount: {
            selectedValue: secondBlockAmount,
            showButtons: false,
          },
          currency: {
            selectedValue: blockAmountCurrencyId,
            showButtons: false,
          },
          secondCurrency: {
            selectedValue: secondBlockAmountCurrencyId,
            showButtons: false,
          },
        },
        isShowFinanceTotal,
        isShowGrades,
      });
    }
  }
  handleCheckboxChange = event => {
    const { name, checked } = event.target;

    this.setState({ [name]: checked });

    const { onUpdateGeneralManagement } = this.props;
    const onUpdate = {
      Id: 1,
      [name]: checked ? 1 : 0,
    };

    onUpdateGeneralManagement(onUpdate);
  };
  handleInputChange = (event, index) => {
    const { inputFields } = this.state;
    inputFields[index].selectedValue = event.target.value;
    this.setState({ inputFields });
  };
  handleClearInput = field => {
    const { inputFields } = this.state;
    inputFields[field].selectedValue = "";
    this.setState({ inputFields });
  };

  handleInputBlur = index => {
    setTimeout(() => {
      const { inputFields } = this.state;
      inputFields[index].showButtons = false;
      this.setState({ inputFields });
    }, 200);
  };

  handleInputFocus = index => {
    const { inputFields } = this.state;
    inputFields[index].showButtons = true;
    this.setState({ inputFields });
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };
  handleSuccess = field => {
    const { inputFields } = this.state;
    const selectedValue = inputFields[field].selectedValue;

    let management;
    const { generalManagements, yearSemesters } = this.props;
    if (field != "blockAmount" && field != "secondBlockAmount") {
      management = yearSemesters.find(item => item.value === selectedValue);
    }
    const { onUpdateGeneralManagement } = this.props;
    let onUpdate;
    if (management) {
      if (field === "currentSemester") {
        onUpdate = {
          Id: 1,
          semesterId: management.semesterId,
          yearId: management.yearId,
        };
      }
      if (field === "showSemester") {
        onUpdate = {
          Id: 1,
          showSemesterId: management.semesterId,
          showYearId: management.yearId,
        };
      } else if (field === "registerSemester") {
        onUpdate = {
          Id: 1,
          regSemesterId: management.semesterId,
          regYearId: management.yearId,
        };
      }
    } else if (field === "blockAmount") {
      management = selectedValue;

      onUpdate = { Id: 1, blockoutAmount: management };
    } else if (field === "secondBlockAmount") {
      management = selectedValue;

      onUpdate = { Id: 1, secondBlockoutAmount: management };
    } else if (field === "currency") {
      management = selectedValue;
      onUpdate = { Id: 1, blockAmountCurrencyId: management };
    } else if (field === "secondCurrency") {
      management = selectedValue;
      onUpdate = { Id: 1, secondBlockAmountCurrencyId: management };
    }

    onUpdateGeneralManagement(onUpdate);
  };

  render() {
    const { t, yearSemesters, currencies } = this.props;
    const currencyLabels = currencies.map(currency => currency.label);
    const {
      duplicateError,
      inputFields,
      isShowFinanceTotal,
      isShowGrades,
      showEditButton,
    } = this.state;
    const confirmElement = (
      <button
        type="submit"
        className="btn btn-success editable-submit btn-sm me-1"
      >
        <i className="mdi mdi-check"></i>
      </button>
    );

    /** Cancel button */
    const cancelElement = (
      <button type="button" className="btn btn-danger editable-cancel btn-sm">
        <i className="mdi mdi-close"></i>
      </button>
    );
    // const columnValues = ["the one", "second", "3rd", "fourth"];

    //meta title
    document.title = "keyInHands - React Admin & Dashboard Template";
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            <Breadcrumbs
              title={t("Mobile Application")}
              breadcrumbItem={t("General Management")}
            />
            <div className="checkout-tabs">
              <Card>
                <CardBody>
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

                  <CardTitle className="h4"></CardTitle>
                  {/* current Semester */}
                  <div className="form-group mb-3 row align-items-center">
                    <label
                      htmlFor="currentSemester"
                      className="col-md-2 col-form-label"
                    >
                      {t("Current Semester")}:
                    </label>
                    <div className="col-md-4">
                      {/* Input field */}
                      <div className="input-group">
                        <Input
                          type="text"
                          id="currentSemester"
                          list="datalistOptions9"
                          className="form-control"
                          value={inputFields.currentSemester.selectedValue}
                          onChange={event =>
                            this.handleInputChange(event, "currentSemester")
                          }
                          onFocus={() =>
                            this.handleInputFocus("currentSemester")
                          }
                          onBlur={() => this.handleInputBlur("currentSemester")}
                          autoComplete="off"
                          disabled={!showEditButton}
                        />
                        <datalist id="datalistOptions9">
                          {yearSemesters.map(yearsem => (
                            <option key={yearsem.key} value={yearsem.value} />
                          ))}
                        </datalist>
                        {inputFields.currentSemester.showButtons && (
                          <div className="input-group-append d-flex align-items-center">
                            <Button
                              color="success"
                              size="sm"
                              id="sucBut"
                              onClick={() =>
                                this.handleSuccess("currentSemester")
                              }
                            >
                              &#10004; {/* Checkmark */}
                            </Button>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() =>
                                this.handleClearInput("currentSemester")
                              }
                            >
                              &#10006; {/* X mark */}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Show Semester */}
                  <div className="form-group mb-3 row align-items-center">
                    <label
                      htmlFor="showSemester"
                      className="col-md-2 col-form-label"
                    >
                      {t("Show Semester")}:
                    </label>
                    <div className="col-md-4">
                      {/* Input field */}
                      <div className="input-group">
                        <Input
                          type="text"
                          id="showSemester"
                          list="datalistOptions1"
                          className="form-control"
                          value={inputFields.showSemester.selectedValue}
                          onChange={event =>
                            this.handleInputChange(event, "showSemester")
                          }
                          onFocus={() => this.handleInputFocus("showSemester")}
                          onBlur={() => this.handleInputBlur("showSemester")}
                          autoComplete="off"
                          disabled={!showEditButton}
                        />
                        <datalist id="datalistOptions1">
                          {yearSemesters.map(yearsem => (
                            <option key={yearsem.key} value={yearsem.value} />
                          ))}
                        </datalist>
                        {inputFields.showSemester.showButtons && (
                          <div className="input-group-append d-flex align-items-center">
                            <Button
                              color="success"
                              size="sm"
                              id="sucBut"
                              onClick={() => this.handleSuccess("showSemester")}
                            >
                              &#10004; {/* Checkmark */}
                            </Button>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() =>
                                this.handleClearInput("showSemester")
                              }
                            >
                              &#10006; {/* X mark */}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Register Semester */}
                  <div className="form-group mb-3 row align-items-center">
                    <label
                      htmlFor="registerSemester"
                      className="col-md-2 col-form-label"
                    >
                      {t("Register Semester")}:
                    </label>
                    <div className="col-md-4">
                      <div className="input-group">
                        <Input
                          type="text"
                          id="registerSemester"
                          list="datalistOptions2"
                          className="form-control"
                          value={inputFields.registerSemester.selectedValue}
                          onChange={event =>
                            this.handleInputChange(event, "registerSemester")
                          }
                          onFocus={() =>
                            this.handleInputFocus("registerSemester")
                          }
                          onBlur={() =>
                            this.handleInputBlur("registerSemester")
                          }
                          autoComplete="off"
                          disabled={!showEditButton}
                        />
                        <datalist id="datalistOptions2">
                          {yearSemesters.map(yearsem => (
                            <option key={yearsem.key} value={yearsem.value} />
                          ))}
                        </datalist>
                        {inputFields.registerSemester.showButtons && (
                          <div className="input-group-append d-flex align-items-center">
                            <Button
                              color="success"
                              id="sucBut"
                              size="sm"
                              onClick={() =>
                                this.handleSuccess("registerSemester")
                              }
                            >
                              &#10004; {/* Checkmark */}
                            </Button>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() =>
                                this.handleClearInput("registerSemester")
                              }
                            >
                              &#10006; {/* X mark */}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Block Amount */}
                  <div className="form-group mb-3 row align-items-center">
                    <label
                      htmlFor="blockAmount"
                      className="col-md-2 col-form-label"
                    >
                      {t("Block Amount")}:
                    </label>
                    <div className="col-md-4">
                      <div className="input-group">
                        <Input
                          type="number"
                          id="blockAmount"
                          className="form-control"
                          value={inputFields.blockAmount.selectedValue}
                          onChange={event =>
                            this.handleInputChange(event, "blockAmount")
                          }
                          onFocus={() => this.handleInputFocus("blockAmount")}
                          onBlur={() => this.handleInputBlur("blockAmount")}
                          autoComplete="off"
                          disabled={!showEditButton}
                        />
                        {inputFields.blockAmount.showButtons && (
                          <div className="input-group-append d-flex align-items-center">
                            <Button
                              color="success"
                              id="sucBut"
                              size="sm"
                              onClick={() => this.handleSuccess("blockAmount")}
                            >
                              &#10004; {/* Checkmark */}
                            </Button>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() =>
                                this.handleClearInput("blockAmount")
                              }
                            >
                              &#10006; {/* X mark */}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="input-group">
                        <select
                          id="currency"
                          className="form-control"
                          value={inputFields.currency.selectedValue}
                          onChange={event =>
                            this.handleInputChange(event, "currency")
                          }
                          onFocus={() => this.handleInputFocus("currency")}
                          onBlur={() => this.handleInputBlur("currency")}
                          style={{ height: "36.53px" }}
                          disabled={!showEditButton}
                        >
                          {currencies.map(currency => (
                            <option key={currency.value} value={currency.value}>
                              {currency.label}
                            </option>
                          ))}
                        </select>
                        {inputFields.currency.showButtons && (
                          <div className="input-group-append d-flex align-items-center">
                            <Button
                              type="submit"
                              color="success"
                              size="sm"
                              className="me-1"
                              onClick={() => this.handleSuccess("currency")}
                            >
                              &#10004; {/* Checkmark */}
                            </Button>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => this.handleClearInput("currency")}
                            >
                              &#10006; {/* X mark */}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Block Amount 2*/}
                  <div className="form-group mb-3 row align-items-center">
                    <label
                      htmlFor="secondBlockAmount"
                      className="col-md-2 col-form-label"
                    >
                      {t("Second Block Amount")}:
                    </label>
                    <div className="col-md-4">
                      <div className="input-group">
                        <Input
                          type="number"
                          id="secondBlockAmount"
                          className="form-control"
                          value={inputFields.secondBlockAmount.selectedValue}
                          onChange={event =>
                            this.handleInputChange(event, "secondBlockAmount")
                          }
                          onFocus={() =>
                            this.handleInputFocus("secondBlockAmount")
                          }
                          onBlur={() =>
                            this.handleInputBlur("secondBlockAmount")
                          }
                          autoComplete="off"
                          disabled={!showEditButton}
                        />
                        {inputFields.secondBlockAmount.showButtons && (
                          <div className="input-group-append d-flex align-items-center">
                            <Button
                              color="success"
                              id="sucBut"
                              size="sm"
                              onClick={() =>
                                this.handleSuccess("secondBlockAmount")
                              }
                            >
                              &#10004; {/* Checkmark */}
                            </Button>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() =>
                                this.handleClearInput("secondBlockAmount")
                              }
                            >
                              &#10006; {/* X mark */}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="input-group">
                        <select
                          id="secondCurrency"
                          className="form-control"
                          value={inputFields.secondCurrency.selectedValue}
                          onChange={event =>
                            this.handleInputChange(event, "secondCurrency")
                          }
                          onFocus={() =>
                            this.handleInputFocus("secondCurrency")
                          }
                          onBlur={() => this.handleInputBlur("secondCurrency")}
                          style={{ height: "36.53px" }}
                          disabled={!showEditButton}
                        >
                          {currencies.map(currency => (
                            <option key={currency.value} value={currency.value}>
                              {currency.label}
                            </option>
                          ))}
                        </select>
                        {inputFields.secondCurrency.showButtons && (
                          <div className="input-group-append d-flex align-items-center">
                            <Button
                              type="submit"
                              color="success"
                              size="sm"
                              className="me-1"
                              onClick={() =>
                                this.handleSuccess("secondCurrency")
                              }
                            >
                              &#10004; {/* Checkmark */}
                            </Button>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() =>
                                this.handleClearInput("secondCurrency")
                              }
                            >
                              &#10006; {/* X mark */}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Show Finance Total */}
                  <div className="form-group row align-items-center">
                    <label
                      className="col-md-2 col-form-label"
                      htmlFor="isShowFinanceTotal"
                    >
                      {t("Show Finance Total")}:
                    </label>
                    <div className="col-md-4">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          id="isShowFinanceTotal"
                          name="isShowFinanceTotal"
                          className="form-check-input"
                          checked={isShowFinanceTotal}
                          onChange={this.handleCheckboxChange}
                          disabled={!showEditButton}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Show Grades */}
                  <div className="form-group row align-items-center">
                    <label
                      className="col-md-2 col-form-label"
                      htmlFor="isShowGrades"
                    >
                      {t("Show Grades")}:
                    </label>
                    <div className="col-md-4">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          id="isShowGrades"
                          name="isShowGrades"
                          className="form-check-input"
                          checked={isShowGrades}
                          onChange={this.handleCheckboxChange}
                          disabled={!showEditButton}
                        />
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = ({ generalManagements, currencies, menu_items }) => ({
  generalManagements: generalManagements.generalManagements,
  yearSemesters: generalManagements.yearSemesters,
  currencies: currencies.currencies,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onfetchSetting: () => dispatch(fetchYearsSemesters()),
  onGetGeneralManagements: () => dispatch(getGeneralManagements()),
  onAddNewGeneralManagement: generalManagement =>
    dispatch(addNewGeneralManagement(generalManagement)),
  onUpdateGeneralManagement: generalManagement =>
    dispatch(updateGeneralManagement(generalManagement)),
  onDeleteGeneralManagement: generalManagement =>
    dispatch(deleteGeneralManagement(generalManagement)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(GeneralManagementsList));
