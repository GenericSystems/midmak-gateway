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

class AcademyInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      academyName: "",
      contactEmail: "",
      website: "",
      // logo: null,
      countries: [
        {
          country: "",
          contactNumber: "",
          whatsappNumber: "",
          phoneNumber: "",
          phoneAndWhatsappNumber: "",
          faxNumber: "",
          academyNameError:"",
        },
      ],
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
        academyName:
          academyInfo && academyInfo.length > 0
            ? academyInfo[0].academyName
            : "",
        // academyEventDecision:
        //   academyInfo && academyInfo.length > 0
        //     ? academyInfo[0].academyEventDecision
        //     : "",
        contactNumber:
          academyInfo && academyInfo.length > 0
            ? academyInfo[0].contactNumber
            : "",
        faxNumber:
          academyInfo && academyInfo.length > 0 ? academyInfo[0].faxNumber : "",
        academyWebsite:
          academyInfo && academyInfo.length > 0
            ? academyInfo[0].academyWebsite
            : "",
        // logo: academyInfo && academyInfo.length > 0 ? academyInfo[0].logo : "",
        
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
    if (name === "academyName") {
      this.setState({ academyNameError: value.trim() === "" });
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

  handleSubmit = e => {
    e.preventDefault();
    const { academyInfo, onAddAcademyInfo, onUpdateAcademyInfo } = this.props;

    if (academyInfo?.id) {
      onUpdateAcademyInfo(academyInfo);
    } else {
      onAddAcademyInfo(academyInfo);
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
    const academyWebsite = this.state.academyWebsite;

    if (!academyWebsite.trim()) {
      return "";
    }

    const isUrlValid = /^(https?:\/\/|www\.)[^\s/$.?#].[^\s]*$/i.test(
      academyWebsite
    );

    return isUrlValid ? "" : academyWebsite;
  };

  handleSubmit = () => {
    const {
      academyName,
      // academyEventDecision,
      location,
      faxNumber,
      academyWebsite,
      // logo,
    } = this.state;
    const { academyInfo } = this.props;
    if (academyInfo && academyInfo.length > 0) {
      const formData = {
        Id: 1,
        academyName,
        academyNameEn,
        // academyEventDecision,
        academyWebsite,
        location,
        // logo,
      };
      if (
        this.state.academyName.trim() === "" &&
        academyInfo[0].academyName.trim() === ""
      ) {
        this.setState({ academyNameError: true, saveError: true });
      } else {
        const updateUniMessage = this.props.t(
          "Academy info updated successfully"
        );
        this.setState({
          setErrormessage: null,
          saveError: false,
          successMessage: updateUniMessage,
        });

        this.props.onUpdateAcademyInfo(formData);
      }
    } else if (academyInfo && academyInfo.length == 0) {
      const formData = {
        academyName,
        // academyEventDecision,
        location,
        faxNumber,
        academyWebsite,
        // logo,
      };
      if (this.state.academyName.trim() === "") {
        this.setState({ academyNameError: true, saveError: true });
      } else {
        const savedUniMessage = this.props.t("Academy info added successfully");
        this.setState({
          setErrormessage: null,
          saveError: false,
          successMessage: savedUniMessage,
        });

        this.props.onAddAcademyInfo(formData);
      }
    }
  };

  handleAddRow = () => {
    this.setState(prev => ({
      academyInfo: [
        ...prev.academyInfo,
        {
          academyName: "",
          contactNumber: "",
          academyWebsite: "",
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

  handleReset = () => {
    const restedata = {
      Id: 1,
      academyName: "",
      // academyEventDecision: null,
      contactNumber: 0,
      faxNumber: 0,
      academyWebsite: "",
      // logo: null,
    };
    const { onUpdateAcademyInfo } = this.props;
    onUpdateAcademyInfo(restedata);
    this.setState({
      academyName: "",
      // academyEventDecision: null,
      contactNumber: null,
      faxNumber: null,
      academyWebsite: "",
      // logo: null,
    });
  };

  handleAlertClose = () => {
    this.setState({ setErrormessage: null });
  };

  handleSuccessClose = () => {
    this.setState({ successMessage: null });
  };
  render() {
    const { academyName, website, contactEmail, logo, countries ,academyNameError} = this.state;
    const { countriesOpt } = this.props;
    const { t } = this.props;

    return (
      <Form onSubmit={this.handleSubmit}>
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
                      <Col lg="6">
                        <div className="mb-3">
                          <Row>
                            <Col lg="4" className="mt-2">
                              <Label>{t("Academy Name")}</Label>
                              <span className="text-danger">*</span>
                            </Col>
                            <Col lg="8" className="mt-3">
                                  <input
                                    type="text"
                                    id="academyName"
                                    name="academyName"
                                    autoComplete="off"
                                    className={`form-control ${
                                      academyNameError ? "is-invalid" : ""
                                    }`}
                                    placeholder={t("Academy Name")}
                                    value={academyName}
                                    onChange={this.handleInputChange}
                                  />

                                  {academyNameError && (
                                    <div className="invalid-feedback">
                                      {t("Academy Name is required")}
                                    </div>
                                  )}
                                </Col>
                          </Row>

                          
                           <Row>
                            <Col lg="4" className="mt-2">
                              <Label>{t("Academy Name (en)")}</Label>
                              <span className="text-danger">*</span>
                            </Col>
                            <Col lg="8" className="mt-3">
                                  <input
                                    type="text"
                                    id="academyNameEn"
                                    name="academyNameEn"
                                    autoComplete="off"
                                    className={`form-control ${
                                      academyNameError ? "is-invalid" : ""
                                    }`}
                                    placeholder={t("Academy Name (en)")}
                                    value={academyName}
                                    onChange={this.handleInputChange}
                                  />

                                  {academyNameError && (
                                    <div className="invalid-feedback">
                                      {t("Academy Name in English is required")}
                                    </div>
                                  )}
                                </Col>
                          </Row>
                        </div>

                        {countries.map((row, idx) => (
                          <div key={idx} className="mb-3 border p-2 rounded">
                            <Row>
                              <Col lg="4" className="mt-2">
                                <label className="col-form-label">
                                  {t("Country")} :
                                </label>
                              </Col>
                              <Col lg="8" className="mt-3">
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
                                        value: newValue ? newValue.value : "",
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
                            </Row>
                            <Row className="mt-2">
                              <Col lg="4" className="mt-2">
                                <label className="col-form-label">
                                  {t("Location")} :
                                </label>
                              </Col>
                              <Col lg="8" className="mt-3">
                                <input
                                  type="text"
                                  name="location"
                                  className="form-control"
                                  value={row.contactlocationNumber}
                                  onChange={e =>
                                    this.handleCountryChange(idx, e)
                                  }
                                />
                              </Col>
                            </Row>
                            <Row className="mt-2">
                              <Col lg="4" className="mt-2">
                                <label className="col-form-label">
                                  {t("Only WhatsApp Number")} :
                                </label>
                              </Col>
                              <Col lg="8" className="mt-3">
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
                            <Row className="mt-2">
                              <Col lg="4" className="mt-2">
                                <label className="col-form-label">
                                  {t("Only Phone")}:
                                </label>
                              </Col>
                              <Col lg="8" className="mt-3">
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
                            </Row>
                            <Row className="mt-2">
                              <Col lg="4" className="mt-2">
                                <label className="col-form-label">
                                  {t("Phone & WhatsApp")} :
                                </label>
                              </Col>
                              <Col lg="8" className="mt-3">
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
                            </Row>
                            <Row className="mt-2">
                              <Col lg="4" className="mt-2">
                                <label className="col-form-label">
                                  {t("Fax")}:
                                </label>
                              </Col>
                              <Col lg="8" className="mt-3">
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
                          <Col lg="4" className="mt-2">
                            <label
                              htmlFor="contactEmail"
                              className="col-form-label"
                            >
                              {t("Email")}:
                            </label>
                          </Col>
                          <Col lg="8" className="mt-3">
                            <input
                              type="email"
                              id="contactEmail"
                              name="contactEmail"
                              className="form-control"
                              placeholder="Enter Email"
                              value={contactEmail}
                              onChange={this.handleChange}
                            />
                          </Col>
                        </Row>

                        <Row className="mt-3">
                          <Col lg="4" className="mt-2">
                            <label htmlFor="website" className="col-form-label">
                              {t("Website")}:
                            </label>
                          </Col>
                          <Col lg="8" className="mt-3">
                            <input
                              type="text"
                              id="website"
                              name="website"
                              className="form-control"
                              placeholder="Enter Website"
                              value={website}
                              onChange={this.handleChange}
                            />
                          </Col>
                        </Row>
{/* 
                        <Row className="mt-3">
                          <Col lg="4" className="mt-2">
                            <label
                              htmlFor="academyEventDecision"
                              className="col-form-label"
                            >
                              {t("Academy Event Decision")}:
                            </label>
                          </Col>
                          <Col lg="8" className="mt-3">
                            <Input
                              type="file"
                              id="academyEventDecision"
                              name="academyEventDecision"
                              accept="image/*"
                            />
                          </Col>
                        </Row> */}
                      </Col>

                      {/* <Col lg="6">
                        <div className="mb-3">
                          <Row>
                            <Col lg="4" className="mt-2">
                              <Label
                                htmlFor="logoUpload"
                                className="btn btn-primary"
                              >
                                Academy Logo
                                <Input
                                  name="logo"
                                  type="file"
                                  id="logoUpload"
                                  accept="image/*"
                                  style={{ display: "none" }}
                                  onChange={this.handleChange}
                                />
                              </Label>
                            </Col> */}
                            {/* <Col lg="8" className="mt-4">
                              {logo && (
                                <img
                                  src={URL.createObjectURL(logo)}
                                  alt="Academy Logo"
                                  className="academy-logo"
                                />
                              )}
                            </Col>
                          </Row>
                        </div> */}
                      {/* </Col> */}
                    </Row>

                    <div className="d-flex justify-content-end mt-4">
                      <Button type="submit" color="primary" className="me-2">
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
