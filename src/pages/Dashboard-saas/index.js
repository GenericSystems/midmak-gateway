import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//Import Components
import CardUser from "./card-user";
import CardWelcome from "./card-welcome";
import MiniWidget from "./mini-widget";
import Earning from "./earning";
import SalesAnalytics from "./sales-analytics";
import TotalSellingProduct from "./total-selling-product";
import Tasks from "./tasks";
import ChatBox from "./chat-box";

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reports: [
        {
          icon: "fas fa-user-clock",
          title: "number of applicant  Students",
          value: "200",
          badgeValue: "+ 5%",
          color: "success",
          desc: "Total applicant students",
        },
        {
          icon: "fas fa-user-check",
          title: "number of accptent students",
          value: "150",
          badgeValue: "+ 10%",
          color: "success",
          desc: "Available Student",
        },
        {
          icon: "fas fa-user-graduate",
          title: "Graduates Per Year",
          value: "200",
          badgeValue: "+ 15%",
          color: "success",
          desc: "Number of graduates this year",
        },
    
      ],
    };
  }

  render() {

    //meta title
    document.title="Saas Dashboard | keyInHands - React Admin & Dashboard Template";

    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumbs title="Dashboards" breadcrumbItem="Saas" />

            {/* Card User */}
            <CardUser />

            <Row>
              {/* welcome card */}
              <CardWelcome />

              <Col xl="8">
                <Row>
                  {/*mimi widgets */}
                  <MiniWidget reports={this.state.reports} />
                </Row>
              </Col>
            </Row>

            <Row>
              {/* earning */}
              <Earning />

              {/* sales anytics */}
              <SalesAnalytics />
            </Row>

            <Row>
              {/* total selling product */}
              <TotalSellingProduct />

              {/* tasks */}
              <Tasks />

              {/* chat box */}
              <ChatBox />
            </Row>
          </Container>
        </div>
      </React.Fragment>
    )
  }
}

export default Dashboard
