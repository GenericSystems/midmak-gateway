import React, { Component } from "react";
import { connect } from "react-redux";
import Breadcrumbs from "components/Common/Breadcrumb";
import Select from "react-select";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  FormGroup,
  Row,
  Label,
  Alert,
  Form,
  Input,
  CardTitle,
} from "reactstrap";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import "./Academy.scss";
import {
  getAcademyInfo,
  updateAcademyInfo,
  addAcademyInfo,
} from "store/academydef/actions";
import { Email } from "@mui/icons-material";

class AcademyInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AcademyName: "",
      AcademyNameEn: "",
      Email: "",
      Website: "",
      // logo: null,
      countries: [
        {
          country: "",
          location: "",
          whatsappNumber: "",
          phoneNumber: "",
          phoneAndWhatsappNumber: "",
          faxNumber: "",
          AcademyNameError: "",
          AcademyNameEnError: "",
        },
      ],
      successMessage: null,
    };
  }

  componentDidMount() {
    const { academyInfo, onGetAcademyInfo, countriesOpt } = this.props;

    if (academyInfo && !academyInfo.length) {
      onGetAcademyInfo();
    }

    this.setState({ academyInfo, countriesOpt });
  }

  componentDidUpdate(prevProps) {
    const { academyInfo } = this.props;
    if (prevProps.academyInfo !== this.props.academyInfo) {
      this.setState({
        AcademyName:
          academyInfo && academyInfo.length > 0
            ? academyInfo[0].AcademyName
            : "",
        AcademyNameEn:
          academyInfo && academyInfo.length > 0
            ? academyInfo[0].AcademyNameEn
            : "",
        // academyEventDecision:
        //   academyInfo && academyInfo.length > 0
        //     ? academyInfo[0].academyEventDecision
        //     : "",
        location:
          academyInfo && academyInfo.length > 0 ? academyInfo[0].location : "",
        faxNumber:
          academyInfo && academyInfo.length > 0 ? academyInfo[0].faxNumber : "",
        Website:
          academyInfo && academyInfo.length > 0 ? academyInfo[0].Website : "",
        // logo: academyInfo && academyInfo.length > 0 ? academyInfo[0].logo : "",
        Email:
          academyInfo && academyInfo.length > 0 ? academyInfo[0].Email : "",
      });
    }
  }

  isUrlValid = event => {
    const pattern = /^(https?:\/\/|www\.)[^\s/$.?#].[^\s]*$/i;
    return pattern.test(event);
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
    if (name === "AcademyName") {
      this.setState({ AcademyNameError: value.trim() === "" });
    }
  };
  handleSelectChange = (fieldName, value) => {
    this.setState(prevState => ({
      academyInfo: {
        ...prevState.academyInfo,
        [fieldName]: value,
      },
    }));
  };
  handleSubmit = () => {
    const {
      AcademyName,
      AcademyNameEn,
      Email,
      // EventDecision,
      // location,
      // faxNumber,
      Website,
      // logo,
    } = this.state;

    const { academyInfo } = this.props;

    if (academyInfo && academyInfo.length > 0) {
      const formData = {
        Id: academyInfo[0].Id, // always use Id from DB
        AcademyName,
        AcademyNameEn,
        Email,

        // location,
        // faxNumber,
        Website,
        // logo,
      };

      if (
        this.state.AcademyName.trim() === "" &&
        academyInfo[0].AcademyName.trim() === ""
      ) {
        this.setState({ AcademyNameError: true, saveError: true });
      } else {
        console.log("1111");
        const updateMessage = this.props.t("Academy info updated successfully");
        this.setState({
          setErrormessage: null,
          saveError: false,
          successMessage: updateMessage,
        });

        this.props.onUpdateAcademyInfo(formData);
      }
    }
  };

  // handleLogoUpload = event => {
  //   const { name, files } = event.target;
  //   if (name === "logo") {
  //     this.setState({ logo: files[0] });
  //   } else if (name === "academyEventDecision") {
  //     this.setState({ academyEventDecision: files[0] });
  //   }
  // };
  handleLinkChange = (event, index) => {
    const { value } = event.target;

    if (index === 0) {
      this.setState({
        link1: value,
      });
    }
    if (index === 1) {
      this.setState({
        link2: value,
      });
    }
    if (index === 2) {
      this.setState({
        link3: value,
      });
    }
  };

  testAcademyWebsite = () => {
    const Website = this.state.Website;

    if (!Website.trim()) {
      return "";
    }

    const isUrlValid = /^(https?:\/\/|www\.)[^\s/$.?#].[^\s]*$/i.test(Website);

    return isUrlValid ? "" : Website;
  };

  handleAddRow = () => {
    this.setState(prev => ({
      academyInfo: [
        ...prev.academyInfo,
        {
          AcademyName: "",
          location: "",
          Website: "",
          faxNumber: "",
          // academyEventDecision: null,
          // logo: null,
          links: ["", "", ""],
        },
      ],
    }));
  };
  handleRemoveRow = index => {
    const academyInfo = [...this.state.academyInfo];
    academyInfo.splice(index, 1);
    this.setState({ academyInfo });
  };
  handleChange = e => {
    const { name, value, files } = e.target;
    this.setState({ [name]: files ? files[0] : value });
  };
  handleCountryChange = (idx, e) => {
    const { name, value } = e.target;
    this.setState(prevState => {
      const updatedCountries = [...prevState.countries];
      updatedCountries[idx] = {
        ...updatedCountries[idx],
        [name]: value,
      };
      return { countries: updatedCountries };
    });
  };

  handleAddCountry = () => {
    this.setState(prevState => ({
      countries: [
        ...prevState.countries,
        {
          country: "",
          location: "",
          whatsappNumber: "",
          phoneNumber: "",
          phoneAndWhatsappNumber: "",
          faxNumber: "",
        },
      ],
    }));
  };
  handleRemoveCountry = idx => {
    const countries = [...this.state.countries];
    countries.splice(idx, 1);
    this.setState({ countries });
  };

  handleFileUpload = (idx, field, file) => {
    const academyInfo = [...this.state.academyInfo];
    academyInfo[idx][field] = file;
    this.setState({ academyInfo });
  };

  handleLinkChange = (academyIdx, linkIdx, value) => {
    const academyInfo = [...this.state.academyInfo];
    academyInfo[academyIdx].links[linkIdx] = value;
    this.setState({ academyInfo });
  };

  // handleReset = () => {
  //   const restedata = {
  //     Id: 1,
  //     AcademyName: "",
  //     AcademyNameEn: "",
  //     // academyEventDecision: null,
  //     location: 0,
  //     faxNumber: 0,
  //     Website: "",
  //     // logo: null,
  //   };
  //   const { onUpdateAcademyInfo } = this.props;
  //   onUpdateAcademyInfo(restedata);
  //   this.setState({
  //     AcademyName: "",
  //     AcademyNameEn: "",
  //     // academyEventDecision: null,
  //     location: null,
  //     faxNumber: null,
  //     Website: "",
  //     // logo: null,
  //   });
  // };

  handleAlertClose = () => {
    this.setState({ setErrormessage: null });
  };

  handleSuccessClose = () => {
    this.setState({ successMessage: null });
  };
  render() {
    const {
      AcademyName,
      AcademyNameEn,
      location,
      Website,
      Email,
      logo,
      countries,
      AcademyNameError,
      successMessage,
      setErrormessage,
    } = this.state;
    const { countriesOpt } = this.props;

    const { t } = this.props;

    return (
      <React.Fragment>
        <div className="page-content">
          <Breadcrumbs
            title={this.props.t("Academy Definition")}
            breadcrumbItem={this.props.t("AcademyDefinition")}
          />
          <div>
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
            {setErrormessage && (
              <Alert
                color="danger"
                className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                role="alert"
              >
                {setErrormessage}
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={this.handleAlertClose}
                ></button>
              </Alert>
            )}
          </div>

          <Form>
            <Card>
              <CardBody>
                <Row>
                  <Col className="col-12">
                    <Card>
                      <CardTitle id="add_header">
                        {" "}
                        {t("Academy Information")}
                      </CardTitle>
                      <CardBody>
                        <Row>
                          <Col lg="12">
                            <div className="mb-3">
                              <Row>
                                <Col lg="6" className="mt-2">
                                  <Label>{t("Academy Name (ar)")}</Label>
                                  <span className="text-danger">*</span>

                                  <input
                                    type="text"
                                    id="AcademyName"
                                    name="AcademyName"
                                    autoComplete="off"
                                    className={`form-control ${
                                      AcademyNameError ? "is-invalid" : ""
                                    }`}
                                    placeholder={t("Academy Name")}
                                    value={AcademyName}
                                    onChange={this.handleInputChange}
                                  />

                                  {AcademyNameError && (
                                    <div className="invalid-feedback">
                                      {t("Academy Name is required")}
                                    </div>
                                  )}
                                </Col>
                                <Col lg="6" className="mt-2">
                                  <label
                                    htmlFor="Email"
                                    className="col-form-label"
                                  >
                                    {t("Email")}:
                                  </label>

                                  <input
                                    type="text"
                                    id="Email"
                                    name="Email"
                                    className="form-control"
                                    placeholder="Enter Email"
                                    value={Email}
                                    onChange={this.handleInputChange}
                                  />
                                </Col>
                              </Row>
                              <Row className="mt-3">
                                <Col lg="6" className="mt-2">
                                  <Label>{t("Academy Name (en)")}</Label>
                                  <span className="text-danger">*</span>

                                  <input
                                    type="text"
                                    id="AcademyNameEn"
                                    name="AcademyNameEn"
                                    autoComplete="off"
                                    className={`form-control ${
                                      AcademyNameError ? "is-invalid" : ""
                                    }`}
                                    placeholder={t("Academy Name (en)")}
                                    value={AcademyNameEn}
                                    onChange={this.handleInputChange}
                                  />

                                  {/* {AcademyNameError && (
                                <div className="invalid-feedback">
                                  {t("Academy Name in English is required")}
                                </div>
                              )} */}
                                </Col>
                                <Col lg="6" className="mt-2">
                                  <label
                                    htmlFor="Website"
                                    className="col-form-label"
                                  >
                                    {t("Website")}:
                                  </label>

                                  <input
                                    type="text"
                                    id="Website"
                                    name="Website"
                                    className="form-control"
                                    placeholder="Enter Website"
                                    value={Website}
                                    onChange={this.handleInputChange}
                                  />
                                </Col>
                              </Row>
                            </div>

                            {countries.map((row, idx) => (
                              <div
                                key={idx}
                                className="mb-3 border p-3 rounded"
                              >
                                <Row className="mb-3">
                                  <Col lg="4">
                                    <label className="form-label">
                                      {t("Country")}
                                    </label>
                                    <Select
                                      className="form-control"
                                      name="country"
                                      id={`country_${idx}`}
                                      key={`country_select_${idx}`}
                                      options={
                                        Array.isArray(countriesOpt)
                                          ? countriesOpt
                                          : []
                                      }
                                      onChange={newValue =>
                                        this.handleCountryChange(idx, {
                                          target: {
                                            name: "country",
                                            value: newValue
                                              ? newValue.value
                                              : "",
                                          },
                                        })
                                      }
                                      value={
                                        Array.isArray(countriesOpt)
                                          ? countriesOpt.find(
                                              opt => opt.value === row.country
                                            ) || null
                                          : null
                                      }
                                      placeholder={t("Select Country")}
                                    />
                                  </Col>
                                  <Col lg="4" className="mt-2">
                                    <label className="col-form-label">
                                      {t("Location")} :
                                    </label>

                                    <input
                                      type="text"
                                      name="Location"
                                      className="form-control"
                                      value={row.whatsappNumber}
                                      onChange={e =>
                                        this.handleCountryChange(idx, e)
                                      }
                                    />
                                  </Col>
                                  <Col lg="4" className="mt-2">
                                    <label className="col-form-label">
                                      {t("Only WhatsApp Number")} :
                                    </label>

                                    <input
                                      type="text"
                                      name="whatsappNumber"
                                      className="form-control"
                                      value={row.whatsappNumber}
                                      onChange={e =>
                                        this.handleCountryChange(idx, e)
                                      }
                                    />
                                  </Col>
                                </Row>

                                <Row className="mt-2"></Row>

                                <Row className="mt-2">
                                  <Col lg="4" className="mt-2">
                                    <label className="col-form-label">
                                      {t("Phone & WhatsApp")} :
                                    </label>

                                    <input
                                      type="text"
                                      name="phoneAndWhatsappNumber"
                                      className="form-control"
                                      value={row.phoneAndWhatsappNumber}
                                      onChange={e =>
                                        this.handleCountryChange(idx, e)
                                      }
                                    />
                                  </Col>
                                  <Col lg="4" className="mt-2">
                                    <label className="col-form-label">
                                      {t("Only Phone")}:
                                    </label>

                                    <input
                                      type="text"
                                      name="phoneNumber"
                                      className="form-control"
                                      value={row.phoneNumber}
                                      onChange={e =>
                                        this.handleCountryChange(idx, e)
                                      }
                                    />
                                  </Col>
                                  <Col lg="4" className="mt-2">
                                    <label className="col-form-label">
                                      {t("Fax")}:
                                    </label>

                                    <input
                                      type="text"
                                      name="faxNumber"
                                      className="form-control"
                                      value={row.faxNumber}
                                      onChange={e =>
                                        this.handleCountryChange(idx, e)
                                      }
                                    />
                                  </Col>
                                </Row>

                                <Button
                                  type="button"
                                  color="danger"
                                  className="mt-2"
                                  onClick={() => this.handleRemoveCountry(idx)}
                                >
                                  {t("Remove")}
                                </Button>
                              </div>
                            ))}

                            <Row className="mt-3">
                              <Col lg="12">
                                <Button
                                  type="button"
                                  color="success"
                                  onClick={this.handleAddCountry}
                                >
                                  {t("Add Country Info")}
                                </Button>
                              </Col>
                            </Row>

                            <Row className="mt-3">
                              <Col lg="6" className="mt-2">
                                <label
                                  htmlFor="academyEventDecision"
                                  className="col-form-label"
                                >
                                  {t("Academy Event Decision")}:
                                </label>

                                <Input
                                  type="file"
                                  id="academyEventDecision"
                                  name="academyEventDecision"
                                  accept="image/*"
                                />
                              </Col>
                            </Row>
                          </Col>

                          <Col lg="6">
                            <div className="mb-3">
                              <Row>
                                <Col lg="4" className="mt-2">
                                  <Label
                                    htmlFor="logoUpload"
                                    className="btn btn-primary"
                                  >
                                    {t("Academy Logo")}
                                    <Input
                                      name="logo"
                                      type="file"
                                      id="logoUpload"
                                      accept="image/*"
                                      style={{ display: "none" }}
                                      onChange={this.handleChange}
                                    />
                                  </Label>
                                </Col>
                                <Col lg="8" className="mt-4">
                                  {logo && (
                                    <img
                                      src={URL.createObjectURL(logo)}
                                      alt="Academy Logo"
                                      className="academy-logo"
                                    />
                                  )}
                                </Col>
                              </Row>
                            </div>
                          </Col>
                        </Row>
                        {/* {this.state.successMessage && (
                      <div className="text-success mb-3">
                        {this.state.successMessage}
                      </div>
                    )} */}

                        <div className="d-flex justify-content-end mt-4">
                          <Button
                            type="button"
                            color="primary"
                            className="me-2"
                            onClick={this.handleSubmit}
                          >
                            Submit
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Form>
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = ({ academyInfo, employees }) => ({
  academyInfo: academyInfo.academyInfo,
  countriesOpt: employees.countriesOpt,
});
const mapDispatchToProps = dispatch => ({
  onGetAcademyInfo: () => dispatch(getAcademyInfo()),

  onUpdateAcademyInfo: academyInfo => dispatch(updateAcademyInfo(academyInfo)),

  onAddAcademyInfo: academyInfo => dispatch(addAcademyInfo(academyInfo)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(AcademyInfo));
