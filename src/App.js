import React, { useCallback, useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import "./App.css";
import little_image from "./Little Logo.png";
import Modal from "./ReviewPage";
import { GoLocation } from "react-icons/go";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FiUpload } from "react-icons/fi";

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Address from "./Address";

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
let valid = false;
let studentAddress;
let myLat;
let myLng;
let originalFile;
let corpName = new URLSearchParams(window.location.search).get("name");
let corpId = new URLSearchParams(window.location.search).get("corpId");
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

  const [val, setVal] = useState();
  const [myImg, setMyImg] = useState();

  const nearbyAddressClickHandler = (e) => {
    // console.log(e.target.id);
    console.log(isNearbyAddresses[e.target.id - 11]);
    cityInputRef.current.value = isNearbyAddresses[e.target.id - 11].District;
    stateInputRef.current.value = isNearbyAddresses[e.target.id - 11].Circle;
    areaInputRef.current.value = isNearbyAddresses[e.target.id - 11].Name;
    setIsNearbyAddresses([]);
  };

  useEffect(() => {
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
      valid = true;
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
      valid = true;
      setError((prev) => ({ ...prev, areaError: "Please Enter valid area" }));
    }
  };

  const cityChangeHandler = () => {
    if (cityInputRef.current.value) {
      valid = true;
      setError((prev) => ({ ...prev, cityError: "" }));
    } else {
      valid = true;
      setError((prev) => ({ ...prev, cityError: "Please Enter valid city" }));
    }
  };

  const stateChangeHandler = () => {
    if (stateInputRef.current.value) {
      valid = true;
      setError((prev) => ({ ...prev, stateError: "" }));
    }
    else {
      valid = true;
      setError((prev) => ({ ...prev, stateError: "Please Enter valid state" }));
    }
  };

  const studentFirstNameChangeHandler = () => {
    if (studentFirstNameRef.current.value) {
      valid = true;
      setError((prev) => ({ ...prev, studentFirstNameError: "" }));
    }
    else {
      valid = true;
      setError((prev) => ({ ...prev, studentFirstNameError: "Please Enter valid first name" }));
    }
  };

  const studentLastNameChangeHandler = () => {
    if (studentLastNameRef.current.value) {
      valid = true;
      setError((prev) => ({ ...prev, studentLastNameError: "" }));
    }
    else {
      valid = true;
      setError((prev) => ({ ...prev, studentLastNameError: "Please Enter valid last name" }));
    }
  };

  const studentClassChangeHandler = () => {
    if (studentClassRef.current.value) {
      valid = true;
      setError((prev) => ({ ...prev, studentClassError: "" }));
    }
    else {
      valid = true;
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
      // console.log(e.target.files.file.size);
      setError((prev) => ({ ...prev, studentPhotoError: "" }));
      const [file] = e.target.files;
      originalFile = file;
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
      valid = true;
      setError((prev) => ({ ...prev, parentFirstNameError: "Please Enter Valid first name" }));
    }
  };

  const parentMobileChangeHandler = () => {
    if (parentMobileNumberRef.current.value) {
      valid = true;
      setError((prev) => ({ ...prev, parentMobileNumberError: "" }));
    }
    else {
      valid = true;
      setError((prev) => ({ ...prev, parentMobileNumberError: "Please Enter Valid Mobile number" }));
    }
  };

  const parentLastNameChangeHanler = () => {
    if (parentLastNameRef.current.value) {
      valid = true;
      setError((prev) => ({ ...prev, parentLastNameError: "" }));
    }
    else {
      valid = true;
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
      valid = true;
      setError((prev) => ({ ...prev, parentEmailError: "Please Enter Valid email" }));
    }
  };

  const addressChangeHandler = () => {
    if (addressRef.current.value) {
      valid = true;
      setError((prev) => ({ ...prev, addressError: "" }));
    }
    else {
      valid = true;
      setError((prev) => ({ ...prev, addressError: "Please Enter Valid address" }));
    }
  };

  const resetClickHandler = () => {
    valid = false;
    formRef.current.reset();
    img_placeHolder = "Only Upload Jpg/Png/Jpeg";
    setError(defaultState);
  };

  const getAddress = useCallback((addressValue, lat, lng) => {
    // console.log("data",addressValue, lat, lng);
    myLat = lat;
    myLng = lng;
    studentAddress = addressValue;
  }, []);

  const submitCLickHandler = (event) => {
    let studentPhotoPath = studentPhotoRef.current.value;
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
    if (!/^\d{1,2}$/.test(studentClassRef.current.value)) {
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
    if (valid) {
      schoolNameRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
      setFormIsValid(true);
      setError(false);
    }
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
      {myImg && (
        <div className="modalBackgroundForImageCrop">
          <div className="modalContainerForImageCrop">
            <Cropper
              src={myImg}
              style={{ height: 400, width: "50%" }}
              initialAspectRatio={16 / 9}
              guides={false}
              crop={onCrop}
              ref={cropperRef}
            />
            <div className="imageCrop-footer">
              <div className="sub-footer">
                <span className="text">Resultant Image:</span>{" "}
                <img id="asd" src={val} className="image" alt="cropped" />
              </div>
              <button onClick={submitCLicked} className="imageCrop-submit">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="header">
        <img src={little_image} alt="little pic" className="little-image" />
        <p className="student-header">STUDENT REGISTRATION</p>
      </div>
      <br />
      {/* <br /> */}
      <form ref={formRef} onSubmit={submitCLickHandler} autoComplete="off">
        <main>
          <div className="normal-data">
            <div className="student-school-details">
              <h4 className="sub-header-title">school / institute details</h4>
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
              <h4 className="sub-header-title">student details</h4>
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
                  </div>
                  {error.studentPhotoError && (
                    <p className="error">{error.studentPhotoError}</p>
                  )}
                </div>
                <div>
                  {/* <label htmlFor="last-name" className="required">
                    Last name
                  </label> */}
                  {/* <br /> */}
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
                  {/* <label htmlFor="student-class" className="required">
                    class standards
                  </label> */}
                  {/* <br /> */}
                  <input
                    type="text"
                    id="student-class"
                    className="tags"
                    ref={studentClassRef}
                    onChange={studentClassChangeHandler}
                    placeholder="Enter Students class"
                    maxLength="8"
                  />
                  {error.studentClassError && (
                    <p className="error">{error.studentClassError}</p>
                  )}
                </div>
              </div>
            </div>
            <br />
            <div className="parent-details">
              <h4 className="sub-header-title">Parent Details</h4>
              <div className="sub-container">
                <div>
                  {/* <label htmlFor="first-name" className="required">
                    First name
                  </label> */}
                  {/* <br /> */}
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
                  {/* <label htmlFor="mobile-number" className="required">
                    Parent Mobile Number
                  </label> */}
                  {/* <br /> */}
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
                  {/* <label htmlFor="last-name" className="required">
                    Last name
                  </label> */}
                  {/* <br /> */}
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
                  {/* <label htmlFor="email-address" className="required">
                    Email Address
                  </label> */}
                  {/* <br /> */}
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
            <div className="address-details">
              <h4 className="sub-header-title">Address Details</h4>
              <input
                style={{ width: "685px" }}
                type="text"
                id="address"
                className="tags"
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
                    onBlur={() => setIsNearbyAddresses(false)}
                  />
                  {error.pincodeError && (
                    <p className="error">{error.pincodeError}</p>
                  )}
                  <div className="nearbyLocations">
                    {console.log(isNearbyAddresses)}
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
          <div className="location-data">
            <Address addressEntered={getAddress} />
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
            &#169; <span className="year">2022</span>{" "}
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
      {formIsValid && (
        <Modal
          corpId={corpId}
          corpName={corpName}
          myOriginalFile={val}
          lat={myLat}
          lng={myLng}
          address={addressRef.current.value}
          pickupStop={studentAddress}
          studentPhoto={val}
          schoolname={schoolNameRef.current.value}
          studentfirstname={studentFirstNameRef.current.value}
          studentlastname={studentLastNameRef.current.value}
          studentclass={studentClassRef.current.value}
          parentfirstname={parentFirstNameRef.current.value}
          parentlastname={parentLastNameRef.current.value}
          parentmobilenumber={parentMobileNumberRef.current.value}
          parentemailaddress={parentEmailRef.current.value}
          closeCLickHandler={setFormIsValid}
        />
      )}
    </React.Fragment>
  );
}

export default App;
