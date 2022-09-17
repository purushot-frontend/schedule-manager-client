import React from "react";

import Card from "./../components/ui/Card";
import Button from "./../components/Button";
import Input from "./../components/Input";
import Select from "./../components/Select";
const Contact = () => {
  const contactReasons = [
    { value: "Accounts", text: "Accounts" },
    {
      value: "Payments",
      text: "Billings/Payments",
    },
    {
      value: "Employees",
      text: "Employees",
    },
    {
      value: "Other",
      text: "Other",
    },
  ];
  return (
    <React.Fragment>
      <div className={`col col-md-5 offset-md-2 col-12 my-5  py-5 px-5`}>
        <Card className="py-3 px-4">
          <form className="text-start">
            <h3>Contact Us</h3>

            <div className="row">
              <div className="form-group col-md-6">
                <label></label>

                <Select
                  data={contactReasons}
                  defaultOption="-- select subject --"
                  className="sched-select form-select"
                />
                <small className="form-text text-muted"></small>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-6">
                <label></label>

                <Input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                />
                <small className="form-text text-muted"></small>
              </div>
            </div>
            <div className="form-group my-4">
              <textarea rows="10" className="form-control"></textarea>
            </div>

            <Button type="button" text="Submit" className="btn-warning" />
          </form>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default Contact;
