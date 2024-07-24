import React, { Component } from "react";
import { Card, CardBody, Container } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

// import Component
import FileLeftBar from "./FileLeftBar";
import FileList from "./FileList";
import RecentFile from "./RecentFile";
import Storage from "./Storage";
const series = [76];
const options = {
  chart: {
    height: 150,
    type: "radialBar",
    sparkline: {
      enabled: true,
    },
  },
  colors: ["#556ee6"],
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 90,
      track: {
        background: "#e7e7e7",
        strokeWidth: "97%",
        margin: 5, // margin is in pixels
      },

      hollow: {
        size: "60%",
      },

      dataLabels: {
        name: {
          show: false,
        },
        value: {
          offsetY: -2,
          fontSize: "16px",
        },
      },
    },
  },
  grid: {
    padding: {
      top: -10,
    },
  },
  stroke: {
    dashArray: 3,
  },
  labels: ["Storage"],
};

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filemanager: {
        options: options,
        series: series,
      },
      fileUrl: "",
    };
  }
  handleUrl = (data) => {
    this.setState({ fileUrl: data });
  };
  render() {
    console.log("url in parent",this.state.fileUrl)
    //meta title
    document.title = "File Manager | keyInHands - React Admin & Dashboard Template";

    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            <Breadcrumbs title="Apps" breadcrumbItem="File Manager" />
            <div className="d-xl-flex">
              <div className="w-100">
                <div className="d-md-flex">
                  {/* FileRightBar  */}
                  <FileLeftBar />
                  <div className="w-100">
                    <Card>
                      <CardBody>
                        <FileList />
                        <RecentFile takingUrl={this.handleUrl} />
                      </CardBody>
                    </Card>
                  </div>
                </div>
              </div>
              <Storage filemanager={this.state.filemanager} fileUrl={this.state.fileUrl}/>
            </div>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}
