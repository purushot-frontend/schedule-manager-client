import React from "react";
import Card from "./../components/ui/Card";
const AboutUs = () => {
  return (
    <React.Fragment>
      <div className={`col col-md-8 offset-md-2 col-12  my-5  py-5 px-5 `}>
        <Card className="py-2 px-2 mb-3 text-center">
          <h3>About Us</h3>
        </Card>
        <Card className="py-3 px-4">
          <p>
            Welcome to Schedule Manager, the number one source for scheduling! We are
            dedicated to giving you the ultimate scheduling program with a
            specific focus on time management, dependability, and simplicity.
            This easy-to-use program will forever change the way you keep track
            of your employees and team members!
          </p>
          <p>
            Having experience in a company that has over 100 employees,
            scheduling each week can be tough without the right program to do
            it. Some people spend 30 minutes to create a schedule for just one
            week, others prefer to have one drawn up and pencil in names… but
            who knows how long that possibly takes!
          </p>
          <p>
            What if in just one click you could have a schedule generate
            instantly? What if there was a program that didn’t require you to
            edit availability times of your employees to make a schedule? What
            if you didn’t have to worry about overtime hours every week?
            Everything you look for in a scheduling program is bundled into one
            system for your management needs and eliminates all the “what if’s”.
          </p>
          <p>
            Schedule Manager should be a part of your business or company because of
            one simple fact: IT WORKS. We hope you enjoy using our program as
            much as we like offering it to you, and will continue to make sure
            we are your number 1 choice when it comes to you and your team!
          </p>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default AboutUs;
