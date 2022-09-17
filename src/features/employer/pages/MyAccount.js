/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import Card from "./../../../components/ui/Card";
import Button from "./../../../components/Button";
import Input from "./../../../components/Input";
import ProfileImg from "./../../../assets/images/34-4245653.jpg";
const MyAccount = () => {
  const ProfilePicForm = () => {
    return (
      <form className="text-center" onSubmit={(e) => e.preventDefault}>
        <div className="form-group py-2">
          <label className="mb-3">Your Profile Picture.</label>
          <br />

          <img src={ProfileImg} className="img-fluid my-3" alt="..." />

          <div className="col-md-6 offset-md-3 col-12">
            <Input
              type="file"
              className="form-control text-center"
              placeholder="Company Name"
            />
          </div>
          <small className="form-text text-danger"></small>
        </div>

        <Button text="Upload" className="btn-warning mt-3" />
      </form>
    );
  };

  return (
    <React.Fragment>
      <div className={` col col-12 mt-5  mb-1 py-2 px-2 `}>
        <Card className="py-2 px-2 mb-3 text-center">
          <h3>My Account</h3>
        </Card>
      </div>
      <div className="row px-2 ">
        <div className={`col col-md-6  col-12    `}>
          <Card className="py-3 px-4">{ProfilePicForm()}</Card>
        </div>
        <div className={`col col-md-6  col-12    `}>
          <Card className="py-3 px-4">{}</Card>
        </div>
      </div>

      <div className={` col col-12 mt-5  mb-1 py-2 px-2 `}>
        <Card className="py-2 px-2 mb-3 text-center">
          <h3>Payment Info</h3>
        </Card>
      </div>
      <div className="row px-2 ">
        <div className={`col  col-12    `}>
          <Card className="py-3 px-4">{}</Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default MyAccount;
