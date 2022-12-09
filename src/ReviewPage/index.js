import React, { useEffect, useState } from "react";
import "./index.css";
import axios from "axios";
import TickmarkImage from "../Tickmark.png";
import ErrorImage from "../Error.png";
import useHttp from "../use-http/use-http";
var FormData = require("form-data");

let flag = false;
let croppedFile;
const Modal = (props) => {
  const script = document.createElement("script");
  script.src =
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyAq88vEj-mQ9idalgeP1IuvulowkkFA-Nk&callback=myInitMap&libraries=places&v=weekly";
  script.async = true;
  document.body.appendChild(script);

  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [apiResponse, setApiResponse] = useState("");

  const authenticateUser = (data) => {
    console.log(data);
  };

  const { isLoading, sendRequest } = useHttp();

  useEffect(() => {
    if (isSubmitClicked)
      sendRequest(
        {
          url: "/api/v1/Staff/AddEditStaff",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            corporateID: props.corpId,
            corporateName: props.corpName,
            staffFirstName: props.studentfirstname,
            staffLastName: props.studentlastname,
            classstandards: props.studentclass,
            staffImage: props.studentfirstname,
            parentFirstName: props.parentfirstname,
            parentLastName: props.parentlastname,
            parentsMobileNumber: props.parentmobilenumber,
            parentEmailAddress: props.parentemailaddress,
            address: props.address,
            pickupLL: props.lat + "," + props.lng,
            staffMobileNumber: "",
            emailID: "",
            pickupStop: props.pickupStop,
          },
        },
        authenticateUser
      );
  }, [sendRequest, isSubmitClicked]);

  const DataSubmitHandler = () => {
    let element = document.getElementsByClassName("header")[0];
    element.scrollIntoView({ behavior: "smooth", block: "end" });
    flag = true;
    setIsSubmitClicked(true);
  };
  const closeDataSavedClickHandler = () => {
    setTimeout(() => {
      window.location.reload();
    });
  };

  function myInitMap() {
    var map = new window.google.maps.Map(document.getElementById("map-modal"), {
      center: { lat: props.lat, lng: props.lng },
      zoom: 16,
      mapTypeControl: false,
    });

    let marker = new window.google.maps.Marker({
      position: { lat: props.lat, lng: props.lng },
      map,
      draggable: false,
    });
  }
  window.myInitMap = myInitMap;

  return (
    <React.Fragment>
      {!isSubmitClicked && (
        <div className="modalBackground">
          <div className="modalContainer">
            <div className="header">
              <div className="header-text">Please Verify Your Details</div>
              <div
                className="close"
                onClick={() => props.closeCLickHandler(false)}
              >
                &times;
              </div>
            </div>
            <div className="main-container">
              <div className="sub-container">
                <div>
                  <div className="student-school">
                    <label>School/Institute Name </label>
                    <input
                      type="text"
                      value={props.schoolname}
                      readOnly
                    ></input>
                  </div>
                  <h4>Student Details</h4>
                  <div className="student-details">
                    <div>
                      <div>
                        <label>Student passport size photo</label>
                        <div className="student-photo">
                          <img src={props.studentPhoto} alt="student"></img>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div>
                        <label>First Name</label>
                        <input
                          type="text"
                          value={props.studentfirstname}
                          readOnly
                        ></input>
                      </div>
                      <div>
                        <label>last name</label>
                        <input
                          type="text"
                          value={props.studentlastname}
                          readOnly
                        ></input>
                      </div>
                      <div>
                        <label>class standards</label>
                        <input
                          type="text"
                          value={props.studentclass}
                          readOnly
                        ></input>
                      </div>
                    </div>
                  </div>
                  <h4>Parent Details</h4>
                  <div className="parent-details">
                    <div>
                      <div>
                        <label>first name</label>
                        <input
                          type="text"
                          value={props.parentfirstname}
                          readOnly
                        ></input>
                      </div>
                      <div>
                        <label>Mobile number</label>
                        <input
                          type="text"
                          value={props.parentmobilenumber}
                          readOnly
                        ></input>
                      </div>
                    </div>
                    <div>
                      <div>
                        <label>last name </label>
                        <input
                          type="text"
                          value={props.parentlastname}
                          readOnly
                        ></input>
                      </div>
                      <div>
                        <label>Email Address</label>
                        <input
                          type="email"
                          value={props.parenteemailaddress}
                          readOnly
                        ></input>
                      </div>
                    </div>
                  </div>
                  <h4>Address Details</h4>
                  <div className="parent-details">
                    <div>
                      <input
                        style={{ width: "600px" }}
                        type="text"
                        value={props.address}
                        readOnly
                      ></input>
                    </div>
                  </div>
                  <div className="footer">
                    <div className="text">
                      <span>Need to Edit some details?</span>
                      <button
                        onClick={() => props.closeCLickHandler(false)}
                        className="back-button"
                      >
                        Go Back
                      </button>
                      <button
                        onClick={DataSubmitHandler}
                        className="submit-button"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
                <div className="address-details">
                  <div>
                    <label>Bus Pickup Stop</label>
                    {/* <input type="text" value={props.address} readOnly></input> */}
                    <div className="mystudent-address">{props.pickupStop}</div>
                  </div>
                  <br />
                  {/* <div> */}
                  <div id="map-modal"></div>
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {apiResponse === "Success" && (
        <div className="container-success-msg">
          <div className="success-sub-container">
            <div className="success-msg">
              <img src={TickmarkImage} />
              <p className="data-save">Your data has been successfully saved</p>
            </div>
            <hr />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              <button onClick={closeDataSavedClickHandler}>OK</button>
            </div>
          </div>
        </div>
      )}
      {apiResponse === "Error" && (
        <div className="container-success-msg">
          <div className="success-sub-container">
            <div className="success-msg">
              <img src={ErrorImage} />
              <p className="data-save">Some Error Occured</p>
            </div>
            <hr />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              <button onClick={closeDataSavedClickHandler} className="error">
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Modal;
