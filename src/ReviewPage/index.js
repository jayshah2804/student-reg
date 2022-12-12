import React, { useEffect, useState } from "react";
import "./index.css";
import TickmarkImage from "../Tickmark.png";
import ErrorImage from "../Error.png";
import useHttp from "../use-http/use-http";
import loadingGif from "../loading-gif.gif";


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
    if (data.Message && data.Message.toLoweCase() === "success")
      setApiResponse("Success");
    else setApiResponse("Error");
  };

  const { isLoading, sendRequest } = useHttp();

  useEffect(() => {
    // console.log({
    //   corporateID: props.corpId,
    //   corporateName: props.corpName,
    //   staffFirstName: props.studentfirstname,
    //   staffLastName: props.studentlastname,
    //   classstandards: props.studentclass,
    //   staffImage: props.studentPhoto,
    //   parentFirstName: props.parentfirstname,
    //   parentLastName: props.parentlastname,
    //   parentsMobileNumber: props.parentmobilenumber,
    //   parentEmailAddress: props.parentemailaddress,
    //   address: props.address,
    //   pickupLL: props.pickupLatLng.lat + "," + props.pickupLatLng.lng,
    //   dropLL: props.dropLatLng.lat + "," + props.dropLatLng.lng,
    //   staffMobileNumber: "",
    //   pincode: props.pincode,
    //   area: props.area,
    //   city: props.city,
    //   state: props.state,
    //   emailID: "",
    //   pickupStop: props.pickupStop,
    //   dropStop: props.dropStop
    // });
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
            staffImage: props.studentPhoto,
            parentFirstName: props.parentfirstname,
            parentLastName: props.parentlastname,
            parentsMobileNumber: props.parentmobilenumber,
            parentEmailAddress: props.parentemailaddress,
            address: props.address,
            pickupLL: props.pickupLatLng.lat + "," + props.pickupLatLng.lng,
            dropLL: props.dropLatLng.lat + "," + props.dropLatLng.lng,
            staffMobileNumber: "",
            pincode: props.pincode,
            area: props.area,
            city: props.city,
            state: props.state,
            emailID: "",
            pickupStop: props.pickupStop,
            dropStop: props.dropStop
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
      // center: props.pickupLatLng,
      center: props.pickupLatLng,
      zoom: 12,
      disableDefaultUI: true,
      fullscreenControl: true,
      zoomControl: true,
    });

    const infoWindow = new window.google.maps.InfoWindow();
    // let marker = new window.google.maps.Marker({
    //   position: props.pickupLatLng,
    //   map,
    //   myTitle: `Pickup Stop: ${props.pickupStop.split(",")[0]}`,
    //   draggable: false,
    // });
    let position = [props.pickupLatLng, props.dropLatLng];
    let title = [`Pickup Stop: ${props.pickupStop.split(",")[0]}`, `Drop Stop: ${props.dropStop.split(",")[0]}`]
    for (let i = 0; i < 2; i++) {
      const marker = new window.google.maps.Marker({
        position: position[i],
        map,
        myTitle: title[i],
        draggable: false,
      });
      marker.addListener("mouseover", () => {
        console.log(marker);
        infoWindow.close();
        infoWindow.setContent(marker.myTitle);
        infoWindow.open(marker.getMap(), marker);
      });
    }
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
                    <label>{props.type === "sc" ? "School/Institute Name" : "Corporate Name"} </label>
                    <input
                      type="text"
                      value={props.schoolname}
                      readOnly
                    ></input>
                  </div>
                  <h4>{props.type === "sc" ? "Student Details" : "Staff Details"}</h4>
                  <div className="student-details">
                    <div>
                      <div>
                        <label>{(props.type === "sc" ? "Student" : "Staff") + " passport size photo"}</label>
                        <div className="student-photo">
                          <img src={props.myOriginalFile} alt="student"></img>
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
                        <label>{props.type === "sc" ? "class standards" : "Department"}</label>
                        <input
                          type="text"
                          value={props.studentclass}
                          readOnly
                        ></input>
                      </div>
                    </div>
                  </div>
                  {props.type === "sc" && <React.Fragment>
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
                            value={props.parentemailaddress}
                            readOnly
                          ></input>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                  }
                  <h4>Address Details</h4>
                  <div className="parent-details">
                    <div>
                      <input
                        className="address"
                        type="text"
                        value={props.address}
                        readOnly
                      ></input>
                    </div>
                  </div>
                </div>
                <div className="review-address-details">
                  <div>
                    <label>{(props.type === "sc" ? "Bus" : "Bus/ Cab") + " Pickup Stop"}</label>
                    {/* <input type="text" value={props.address} readOnly></input> */}
                    <div className="mystudent-address">{props.pickupStop}</div>
                  </div>
                  <div>
                    <label>{(props.type === "sc" ? "Bus" : "Bus/ Cab") + " Drop Stop"}</label>
                    {/* <input type="text" value={props.address} readOnly></input> */}
                    <div className="mystudent-address">{props.dropStop}</div>
                  </div>
                  <br />
                  {/* <div> */}
                  <div id="map-modal"></div>
                  {/* </div> */}
                </div>
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
        </div>
      )}
      {isLoading &&
        <img src={loadingGif} style={{ position: "absolute", top: "40%", left: "45%", height: "80px" }} />
      }
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
