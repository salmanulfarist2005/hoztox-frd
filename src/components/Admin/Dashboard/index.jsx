import React from "react";
import UsePanel from "./UserPanel";
import OrderStatus from "./OrderStatus";
// import Notifications from "./Notifications";
import SocialSource from "./SocialSource";
import OverView from "./OverView";
// import RevenueByLocation from "./RevenueByLocation";
// import LatestTransation from "./LatestTransation";

import { Row, Container } from "reactstrap";
import './Dashbord.css';

//Import Breadcrumb
import Breadcrumbs from "../../../components/Admin/Breadcrumb";

const Dashboard = () => {
  document.title = " Caratree Diamonds-Dahboard";
  return (
    <React.Fragment>
      <div className="main-content">
        <div className="page-content ">
          <Container fluid={true}>
            <Breadcrumbs title="Caratree" breadcrumbItem="Dashboard" />

            <UsePanel />

            <Row>

              <OverView />

              <SocialSource />
            </Row>

            <Row>

              <OrderStatus />

              {/* <Notifications /> */}

              {/* <RevenueByLocation /> */}
            </Row>


            {/* <LatestTransation />   */}
          </Container>
        </div>
        </div>
    </React.Fragment>
  );
};

export default Dashboard;
