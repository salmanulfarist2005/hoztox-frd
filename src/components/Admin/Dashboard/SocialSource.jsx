import React from "react";
import RadialChart from "./RadialChart";

import { Card, CardBody, Col, Row } from "reactstrap";

import { SocialSourceData } from "./dashboard";

const SocialSource = () => {
  return (
    <React.Fragment>
      <Col xl={4}>
      <div className='mt-3'>
        <Card>
          <CardBody>
            <div className="d-flex  align-items-center">
              <div className="flex-grow-1">
                <h5 className="card-title">Social Source</h5>
              </div>
              <div className="flex-shrink-0">
                <select className="form-select form-select-sm mb-0 my-n1">
                  {[
                    "May",
                    "April",
                    "March",
                    "February",
                    "January",
                    "December",
                  ].map((item, key) => (
                    <option key={key} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* RadialChart */}
            <RadialChart />
            <Row>
            {SocialSourceData.map((item, key) => (
  <div key={key} className="col-4">
    <div className="social-source text-center">
      <div className="avatar-xs  mb-3">
        <span
          className={
            "avatar-title rounded-circle font-size-18 bg-" + item.bgcolor
          }
          style={{
            width: "35px",   
            height: "35px",  
            display: "flex",   
            justifyContent: "center",  
            alignItems: "center", 
            marginBottom: "10px" 
          }}
        >
          <i className={item.icon + " text-white"}></i>
        </span>
      </div>
      <h5 className="font-size-15">{item.title}</h5>
      <p className="text-muted mb-0">{item.count} sales</p>
    </div>
  </div>
))}

            </Row>
          </CardBody>
        </Card>
        </div>
      </Col>
    </React.Fragment>
  );
};

export default SocialSource;
