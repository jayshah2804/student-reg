import React, { useCallback, useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import "./App.css";
// import little_image from "./Little Logo.png";
import little_image from "./Little_Logo150.png";
import Modal from "./ReviewPage";
import { GoLocation } from "react-icons/go";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FiUpload } from "react-icons/fi";
import { BsEyeFill } from "react-icons/bs";
import loadingGif from "./loading-gif.gif";

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Address from "./Address";
import useHttp from "./use-http/use-http";


//http://localhost:3000/?type=sc&corpId=1232323&name=allen
const defaultState = {
  schoolNameError: "",
  studentFirstNameError: "",
  studentLastNameError: "",
  studentClassError: "",
  studentPhotoError: "",
  parentFirstNameError: "",
  parentLastNameError: "",
  parentMobileNumberError: "",
  parentEmailError: "",
  addressError: "",
  pincodeError: "",
  areaError: "",
  cityError: "",
  stateError: ""
};

let img;
let img_placeHolder = "Passport Size photo";
let valid = true;
let studentpickupAddress;
let studentdropAddress;
let pickupLatLng;
let dropLatLng;
let riderData;
let corpName = new URLSearchParams(window.location.search).get("name");
let corpId = new URLSearchParams(window.location.search).get("corpId");
let type = new URLSearchParams(window.location.search).get("type");
let edit = new URLSearchParams(window.location.search).get("edit");
let editPageImgFlag = 1;
function App() {
  const formRef = useRef();
  const schoolNameRef = useRef();
  const studentFirstNameRef = useRef();
  const studentLastNameRef = useRef();
  const studentPhotoRef = useRef();
  const studentClassRef = useRef();
  const parentFirstNameRef = useRef();
  const parentLastNameRef = useRef();
  const parentMobileNumberRef = useRef();
  const parentEmailRef = useRef();
  const addressRef = useRef();
  const pincodeRef = useRef();
  const cityInputRef = useRef();
  const stateInputRef = useRef();
  const areaInputRef = useRef();

  const cropperRef = useRef(null);

  const [error, setError] = useState(defaultState);
  const [formIsValid, setFormIsValid] = useState();
  const [isNearbyAddresses, setIsNearbyAddresses] = useState([]);
  const [isPincodeChanged, setIsPincodeChanged] = useState(false);
  const [isRender, setIsRender] = useState();

  const [val, setVal] = useState();
  const [myImg, setMyImg] = useState();

  const nearbyAddressClickHandler = (e) => {
    // console.log(e.target.id);
    // console.log("here", isNearbyAddresses[e.target.id - 11]);
    cityInputRef.current.value = isNearbyAddresses[e.target.id - 11].District;
    stateInputRef.current.value = isNearbyAddresses[e.target.id - 11].Circle;
    areaInputRef.current.value = isNearbyAddresses[e.target.id - 11].Name;
    setIsNearbyAddresses([]);
  };

  const editPageFileViewHandler = () => {
    if (val)
      viewDocument(val);
  }

  const viewDocument = (file) => {
    let pdfWindow = window.open("");
    pdfWindow.document.write("<html<head><title>" + "document" + "</title><style>body{margin: 0px;}iframe{border-width: 0px;}</style></head>");
    file.split(",")[0].includes("pdf") ?
      pdfWindow.document.write("<body><embed width='50%' height='50%' src='data:application/pdf;base64, " + encodeURI(file.split(",")[1]) + "#toolbar=0&navpanes=0&scrollbar=0'></embed></body></html>")
      :
      pdfWindow?.document.write(
        `<head><title>Document preview</title></head><body><img src="${file}" width="30%" height="50%" ></body></html >`);
  };

  const authenticateUser = (data) => {
    console.log(data);
    if (data.Staffdetails.length > 0) {
      riderData = data.Staffdetails;
      let otherDetails = JSON.parse(data.Staffdetails[0].OtherDetails);
      areaInputRef.current.value = otherDetails.Area;
      stateInputRef.current.value = otherDetails.State;
      cityInputRef.current.value = otherDetails.City;
      pincodeRef.current.value = otherDetails.Pincode;
      addressRef.current.value = otherDetails.Address;
      studentFirstNameRef.current.value = data.Staffdetails[0].FirstName;
      studentLastNameRef.current.value = data.Staffdetails[0].LastName;
      if (type !== "sc")
        studentClassRef.current.value = data.Staffdetails[0].MobileNumber;
      if (type === "sc") {
        studentClassRef.current.value = otherDetails.Classstandards;
        parentFirstNameRef.current.value = otherDetails.ParentFirstName;
        parentLastNameRef.current.value = otherDetails.ParentLastName;
        parentMobileNumberRef.current.value = otherDetails.ParentsMobileNumber;
        parentEmailRef.current.value = otherDetails?.ParentEmailAddress;
      }
      pickupLatLng = { lat: +data.Staffdetails[0].PickupLL.split(",")[0], lng: +data.Staffdetails[0].PickupLL.split(",")[1] };
      dropLatLng = { lat: +data.Staffdetails[0].DropLL.split(",")[0], lng: +data.Staffdetails[0].DropLL.split(",")[1] };
      studentpickupAddress = data.Staffdetails[0].PickupPoint;
      studentdropAddress = data.Staffdetails[0].DropPoint;
      // studentPhotoRef.current.value = "new";
      setVal(data.Staffdetails[0].RiderImage);
    }
    // setIsRender(prev => !prev);
  };

  const { isLoading, sendRequest } = useHttp();

  useEffect(() => {

    if (edit) {
      sendRequest(
        {
          url: "/api/v1/Staff/GetStaffDetails",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            emailID: sessionStorage.getItem("user"),
            mobileNumber: edit,
            corporateType: type === "sc" ? "school" : "corporate"
          },
        },
        authenticateUser
      );
    }

    if (isPincodeChanged) {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch(
        `https://api.postalpincode.in/pincode/${isPincodeChanged}`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          if (JSON.parse(result)[0].PostOffice)
            setIsNearbyAddresses(JSON.parse(result)[0].PostOffice)
          else setIsNearbyAddresses([{ Name: "No nearby address found" }])
        }
        )
        .catch((error) => console.log("error", error));
      setIsPincodeChanged(false);
    }
  }, [isPincodeChanged]);

  const pincodeChangeHandler = (e) => {
    if (e.target.value.length > 5) {
      setIsPincodeChanged(e.target.value);
      valid = true;
      setError((prev) => ({ ...prev, pincodeError: "" }));
    } else if (!e.target.value) {
      setIsNearbyAddresses(false);
    }
    else {
      valid = false;
      setError((prev) => ({ ...prev, pincodeError: "" }));
      setIsNearbyAddresses([{ Name: "Please Enter Atleast 6 digits" }]);
    }
  };

  const areaChangeHandler = () => {
    if (areaInputRef.current.value) {
      valid = true;
      setError((prev) => ({ ...prev, areaError: "" }));
    }
    else {
      valid = false;
      setError((prev) => ({ ...prev, areaError: "Please Enter valid area" }));
    }
  };

  const cityChangeHandler = () => {
    if (cityInputRef.current.value) {
      valid = true;
      setError((prev) => ({ ...prev, cityError: "" }));
    } else {
      valid = false;
      setError((prev) => ({ ...prev, cityError: "Please Enter valid city" }));
    }
  };

  const stateChangeHandler = () => {
    if (stateInputRef.current.value) {
      valid = true;
      setError((prev) => ({ ...prev, stateError: "" }));
    }
    else {
      valid = false;
      setError((prev) => ({ ...prev, stateError: "Please Enter valid state" }));
    }
  };

  const studentFirstNameChangeHandler = () => {
    if (studentFirstNameRef.current.value) {
      valid = true;
      setError((prev) => ({ ...prev, studentFirstNameError: "" }));
    }
    else {
      valid = false;
      setError((prev) => ({ ...prev, studentFirstNameError: "Please Enter valid first name" }));
    }
  };

  const studentLastNameChangeHandler = () => {
    if (studentLastNameRef.current.value) {
      valid = true;
      setError((prev) => ({ ...prev, studentLastNameError: "" }));
    }
    else {
      valid = false;
      setError((prev) => ({ ...prev, studentLastNameError: "Please Enter valid last name" }));
    }
  };

  const studentClassChangeHandler = () => {
    // console.log(studentClassRef.current.value);
    if (studentClassRef.current.value) {
      valid = true;
      setError((prev) => ({ ...prev, studentClassError: "" }));
    }
    else {
      valid = false;
      setError((prev) => ({ ...prev, studentClassError: "Please Enter Valid Class" }));
    }
  };

  const studentPhotoChangeHandler = (e) => {
    let studentPhotoPath = studentPhotoRef.current.value;
    if (
      studentPhotoPath.includes("jpg") ||
      studentPhotoPath.includes("jpeg") ||
      studentPhotoPath.includes("png")
    ) {
      valid = true;
      editPageImgFlag = false;
      // console.log(e.target.files.file.size);
      setError((prev) => ({ ...prev, studentPhotoError: "" }));
      const [file] = e.target.files;
      // originalFile = file;
      img = URL.createObjectURL(file);
      let imageName = studentPhotoPath.split("fakepath");
      img_placeHolder = imageName[1].split("\\");
      // console.log(imageName);
      setMyImg(img);
    } else {
      valid = false;
      setError((prev) => ({
        ...prev,
        studentPhotoError: "Photo must be of jpg/jpeg/png",
      }));
    }
  };

  const ParentFirstNameChangeHandler = () => {
    if (parentFirstNameRef.current.value) {
      valid = true;
      setError((prev) => ({ ...prev, parentFirstNameError: "" }));
    }
    else {
      valid = false;
      setError((prev) => ({ ...prev, parentFirstNameError: "Please Enter Valid first name" }));
    }
  };

  const parentMobileChangeHandler = () => {
    if (parentMobileNumberRef.current.value) {
      valid = true;
      setError((prev) => ({ ...prev, parentMobileNumberError: "" }));
    }
    else {
      valid = false;
      setError((prev) => ({ ...prev, parentMobileNumberError: "Please Enter Valid Mobile number" }));
    }
  };

  const parentLastNameChangeHanler = () => {
    if (parentLastNameRef.current.value) {
      valid = true;
      setError((prev) => ({ ...prev, parentLastNameError: "" }));
    }
    else {
      valid = false;
      setError((prev) => ({ ...prev, parentLastNameError: "Please Enter Valid last name" }));
    }
  };

  const parentEmailChangeHanlder = () => {
    if (parentEmailRef.current.value) {
      valid = true;
      setError((prev) => ({ ...prev, parentEmailError: "" }));
    }
    else if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/.test(
        parentEmailRef.current.value
      )
    ) {
      valid = false;
      setError((prev) => ({ ...prev, parentEmailError: "Please Enter Valid email" }));
    }
  };

  const addressChangeHandler = () => {
    if (addressRef.current.value) {
      valid = true;
      setError((prev) => ({ ...prev, addressError: "" }));
    }
    else {
      valid = false;
      setError((prev) => ({ ...prev, addressError: "Please Enter Valid address" }));
    }
  };

  const resetClickHandler = () => {
    valid = false;
    formRef.current.reset();
    img_placeHolder = "Only Upload Jpg/Png/Jpeg";
    setError(defaultState);
  };

  const getAddress = useCallback((type, addressValue, lat, lng) => {
    // console.log("data",addressValue, lat, lng);
    if (type === "pickup") {
      pickupLatLng = { lat: +lat, lng: +lng };
      studentpickupAddress = addressValue;
    } else {
      dropLatLng = { lat: +lat, lng: +lng };
      studentdropAddress = addressValue;
    }
  }, [type]);

  const submitCLickHandler = (event) => {
    let studentPhotoPath = studentPhotoRef.current.value;
    edit ? studentPhotoPath = "dummy" : studentPhotoPath = studentPhotoRef.current.value;
    // console.log(studentPhotoPath);
    event.preventDefault();
    if (!schoolNameRef.current.value) {
      valid = false;
      setError((prev) => ({
        ...prev,
        schoolNameError: "Please select School/Institute name",
      }));
    }
    if (!addressRef.current.value) {
      valid = false;
      setError((prev) => ({
        ...prev,
        addressError: "Please Enter Valid Address",
      }));
    }
    if (!pincodeRef.current.value) {
      valid = false;
      setError((prev) => ({
        ...prev,
        pincodeError: "Please Enter Valid Pincode",
      }));
    }
    if (!cityInputRef.current.value) {
      valid = false;
      setError((prev) => ({
        ...prev,
        cityError: "Please Enter Valid City",
      }));
    }
    if (!stateInputRef.current.value) {
      valid = false;
      setError((prev) => ({
        ...prev,
        stateError: "Please Enter Valid State",
      }));
    }
    if (!areaInputRef.current.value) {
      valid = false;
      setError((prev) => ({
        ...prev,
        areaError: "Please Enter Valid Area",
      }));
    }
    if (!/^[a-zA-Z ]{1,15}$/.test(studentFirstNameRef.current.value)) {
      valid = false;
      setError((prev) => ({
        ...prev,
        studentFirstNameError: "Please Enter Valid First name",
      }));
    }
    if (!/^[a-zA-Z ]{1,15}$/.test(studentLastNameRef.current.value)) {
      valid = false;
      setError((prev) => ({
        ...prev,
        studentLastNameError: "Please Enter Valid Last name",
      }));
    }
    if (!/^[a-zA-Z0-9 ]{1,15}$/.test(studentClassRef.current.value)) {
      valid = false;
      setError((prev) => ({
        ...prev,
        studentClassError: "Please Enter Valid class",
      }));
    }

    if (!studentPhotoPath) {
      valid = false;
      setError((prev) => ({
        ...prev,
        studentPhotoError: "photo can not be empty",
      }));
    }
    // if (!(studentPhotoPath.includes("jpg") || studentPhotoPath.includes("jepg") || studentPhotoPath.includes("png"))) {
    //   valid = false;
    //   setError(prev => ({ ...prev, studentPhotoError: "Photo must be of jpg/jpeg/png" }));
    // }
    if (type === "sc") {
      if (!/^[a-zA-Z ]{1,15}$/.test(parentFirstNameRef.current.value)) {
        valid = false;
        setError((prev) => ({
          ...prev,
          parentFirstNameError: "Please Enter Valid First name ",
        }));
      }
      if (!/^[a-zA-Z ]{1,15}$/.test(parentLastNameRef.current.value)) {
        valid = false;
        setError((prev) => ({
          ...prev,
          parentLastNameError: "Please Enter Valid Last name",
        }));
      }
      if (!/^[0]?[789]\d{9}$/.test(parentMobileNumberRef.current.value)) {
        valid = false;
        setError((prev) => ({
          ...prev,
          parentMobileNumberError: "Please Enter valid Mobile number",
        }));
      }
      if (
        !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/.test(
          parentEmailRef.current.value
        )
      ) {
        valid = false;
        setError((prev) => ({
          ...prev,
          parentEmailError: "Please Enter Valid Email",
        }));
      }
    }
    // console.log(error);
    if (valid) {
      let element = document.getElementsByClassName("header")[0];
      element.scrollIntoView({ behavior: "smooth", block: "end" });
      setFormIsValid(true);
      setError(false);
    }
    // console.log(val);
  };

  const onCrop = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    setVal(cropper.getCroppedCanvas().toDataURL());
  };

  const submitCLicked = () => {
    // setIsSubmit(val);
    setMyImg(false);
  };
  return (
    <React.Fragment>
      {isLoading &&
        <img src={loadingGif} style={{ position: "absolute", top: "40%", left: "45%", height: "80px" }} />
      }
      {myImg && (
        <div className="modalBackgroundForImageCrop">
          <div className="modalContainerForImageCrop">
            <Cropper
              src={myImg}
              style={{ height: 300, width: 300 }}
              initialAspectRatio={16 / 9}
              guides={false}
              crop={onCrop}
              ref={cropperRef}
            />
            < br/>
            <p className="text">Resultant Image:</p>{" "}
            <div className="imageCrop-footer">
              {/* <div className="sub-footer"> */}
                <img id="asd" src={val} className="image" alt="cropped" />
                <button onClick={submitCLicked} className="imageCrop-submit">Submit</button>
              </div>
            {/* </div> */}
          </div>
        </div>
      )
      }

      <div className="header">
        <img src={little_image} alt="little pic" className="little-image" />
        <p className="student-header">{type === "sc" ? "STUDENT REGISTRATION" : "STAFF REGISTRATION"}</p>
      </div>
      <br />
      {/* <br /> */}
      <form ref={formRef} onSubmit={submitCLickHandler} autoComplete="off" >
        <main>
          <div className="normal-data">
            <div className="student-school-details">
              <h4 className="sub-header-title">{type === "sc" ? "school / institute details" : "Corporate details"}</h4>
              {/* <label htmlFor="school-details" className="required">school / institute name</label> */}
              {/* <br /> */}
              <input
                type="text"
                readOnly
                value={corpName}
                ref={schoolNameRef}
                className="tags"
              />
              {error.schoolNameError && (
                <p className="error">{error.schoolNameError}</p>
              )}
            </div>
            <br />
            <div className="student-self-details">
              <h4 className="sub-header-title">{(type === "sc" ? "student " : "staff ") + "details"}</h4>
              <div className="sub-container">
                <div>
                  {/* <label htmlFor="first-name" className="required">
                    first name
                  </label> */}
                  {/* <br /> */}
                  <input
                    type="text"
                    id="first-name"
                    className="tags"
                    ref={studentFirstNameRef}
                    onChange={studentFirstNameChangeHandler}
                    placeholder="Enter First Name"
                    maxLength="20"
                  />
                  {error.studentFirstNameError && (
                    <p className="error">{error.studentFirstNameError}</p>
                  )}
                  <br />
                  {/* <label htmlFor="student-photo" className="required">
                    student passport size photo
                  </label> */}
                  {/* <br /> */}
                  <div className="file-upload">
                    <span>{img_placeHolder}</span>
                    <input
                      type="file"
                      id="student-photo"
                      className="tags photo"
                      ref={studentPhotoRef}
                      onChange={studentPhotoChangeHandler}
                      placeholder="Only upload PNG & JPG file"
                    />
                    <FiUpload className="logo" />
                    <BsEyeFill className="logo eye" onClick={editPageFileViewHandler} />
                  </div>
                  {error.studentPhotoError && (
                    <p className="error">{error.studentPhotoError}</p>
                  )}
                  {/* {edit && editPageImgFlag && <span onClick={editPageFileViewHandler} style={{ color: "grey", fontSize: "10px", position: "absolute", cursor: "pointer" }}>click to view</span>} */}
                </div>
                <div>
                  {/* <label htmlFor="last-name" className="required">
                    Last name
                  </label> */}
                  {window.screen.width <= 768 &&
                    <br />
                  }
                  <input
                    type="text"
                    id="last-name"
                    className="tags"
                    ref={studentLastNameRef}
                    onChange={studentLastNameChangeHandler}
                    placeholder="Enter Last Name"
                    maxLength="20"
                  />
                  {error.studentLastNameError && (
                    <p className="error">{error.studentLastNameError}</p>
                  )}
                  <br />
                  <input
                    type="text"
                    id="student-class"
                    className="tags"
                    ref={studentClassRef}
                    onChange={studentClassChangeHandler}
                    placeholder={type === "sc" ? "Enter Students class" : "Enter Staff Mobile Number"}
                    maxLength="30"
                  />
                  {error.studentClassError && (
                    <p className="error">{error.studentClassError}</p>
                  )}
                </div>
              </div>
            </div>
            <br />
            {type === "sc" &&
              <div className="parent-details">
                <h4 className="sub-header-title">Parent Details</h4>
                <div className="sub-container">
                  <div>
                    <input
                      type="text"
                      id="first-name"
                      className="tags"
                      ref={parentFirstNameRef}
                      onChange={ParentFirstNameChangeHandler}
                      placeholder="Enter Parent's First Name"
                      maxLength="20"
                    />
                    {error.parentFirstNameError && (
                      <p className="error">{error.parentFirstNameError}</p>
                    )}
                    <br />
                    <input
                      type="number"
                      id="mobile-name"
                      className="tags"
                      ref={parentMobileNumberRef}
                      onChange={parentMobileChangeHandler}
                      placeholder="Enter Parent's Mobile Number"
                      autoComplete="off"
                    />
                    {error.parentMobileNumberError && (
                      <p className="error">{error.parentMobileNumberError}</p>
                    )}
                    <br />
                  </div>
                  <div>
                    <input
                      type="text"
                      id="last-name"
                      className="tags"
                      ref={parentLastNameRef}
                      onChange={parentLastNameChangeHanler}
                      placeholder="Enter Parent's Last Name"
                      maxLength="20"
                    />
                    {error.parentLastNameError && (
                      <p className="error">{error.parentLastNameError}</p>
                    )}
                    <br />
                    <input
                      type="email"
                      id="email-address"
                      className="tags"
                      ref={parentEmailRef}
                      onChange={parentEmailChangeHanlder}
                      placeholder="Enter Email Address"
                      maxLength="30"
                    />
                    {error.parentEmailError && (
                      <p className="error">{error.parentEmailError}</p>
                    )}
                  </div>
                </div>
              </div>
            }
            <div className="address-details">
              <h4 className="sub-header-title">Address Details</h4>
              <input
                type="text"
                id="address"
                className="tags address-line"
                ref={addressRef}
                onChange={addressChangeHandler}
                placeholder="Enter Address Line"
                maxLength="100"
              />
              {error.addressError && (
                <p className="error">{error.addressError}</p>
              )}
              <br />
              <div className="sub-container">
                <div>
                  <input
                    type="text"
                    className="tags"
                    ref={pincodeRef}
                    placeholder="Enter Pincode"
                    onChange={pincodeChangeHandler}
                  // onBlur={() => setIsNearbyAddresses(false)}
                  />
                  {error.pincodeError && (
                    <p className="error">{error.pincodeError}</p>
                  )}
                  <div className="nearbyLocations">
                    {isNearbyAddresses?.length > 0 && isNearbyAddresses.map((address, index) => (
                      <p id={index + 11} onClick={nearbyAddressClickHandler}>
                        {address.Name}
                      </p>
                    ))}
                  </div>
                  <br />
                  <div>
                    <input
                      type="text"
                      className="tags"
                      ref={cityInputRef}
                      placeholder="Enter City"
                      onChange={cityChangeHandler}
                    />
                    {error.cityError && (
                      <p className="error">{error.cityError}</p>
                    )}
                    {/* {console.log(isNearbyAddresses)} */}
                  </div>
                </div>
                {window.screen.width <= 768 &&
                  <br />
                }
                <div>
                  <input
                    type="text"
                    className="tags"
                    ref={areaInputRef}
                    placeholder="Enter Area"
                    onChange={areaChangeHandler}
                  />
                  {error.areaError && (
                    <p className="error">{error.areaError}</p>
                  )}
                  <br />
                  <input
                    type="text"
                    className="tags"
                    ref={stateInputRef}
                    placeholder="Enter State"
                    onChange={stateChangeHandler}
                  />
                  {error.stateError && (
                    <p className="error">{error.stateError}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {window.screen.width <= 768 &&
            <br />
          }
          <div className="location-data">
            <Address addressEntered={getAddress} type={type} edit={edit} riderData={riderData} />
          </div>
        </main>
        <input type="submit" value="Submit" className="submit button" />
        <input
          type="button"
          value="Reset"
          className="reset button"
          onClick={resetClickHandler}
        />
      </form>
      <div className="copyright">
        <div>
          <p>
            <span style={{ fontSize: "13px" }}>&#169;</span><span className="year">{new Date().getFullYear()}</span>{" "}
            <span className="lFirst">L</span>
            <span className="i">i</span>
            <span className="tFirst">t</span>
            <span className="tSecond">t</span>
            <span className="lSecond">l</span>
            <span className="e">e</span>
          </p>
        </div>
      </div>
      {/* {console.log("val",img)} */}
      {
        formIsValid && (
          <Modal
            corpId={corpId}
            corpName={corpName}
            type={type}
            myOriginalFile={val}
            pickupLatLng={pickupLatLng}
            dropLatLng={dropLatLng}
            address={addressRef.current.value}
            pickupStop={studentpickupAddress}
            dropStop={studentdropAddress}
            studentPhoto={val}
            schoolname={schoolNameRef.current.value}
            studentfirstname={studentFirstNameRef.current.value}
            studentlastname={studentLastNameRef.current.value}
            studentclass={studentClassRef.current.value}
            parentfirstname={parentFirstNameRef?.current?.value}
            parentlastname={parentLastNameRef?.current?.value}
            parentmobilenumber={parentMobileNumberRef?.current?.value}
            parentemailaddress={parentEmailRef?.current?.value}
            pincode={pincodeRef.current.value}
            area={areaInputRef.current.value}
            city={cityInputRef.current.value}
            state={stateInputRef.current.value}
            closeCLickHandler={() => setFormIsValid(false)}
          />
        )
      }
    </React.Fragment >
  );
}

export default App;
