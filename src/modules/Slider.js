import { Slide } from "react-slideshow-image";
const Slider = () => {
  const slideImages = [
    {
      url: "images/slide1.png",
      caption: "guide 1 : Register",
    },
    {
      url: "images/slide2.png",
      caption: "guide 2 : Verify account",
    },
    {
      url: "images/slide3.png",
      caption: "guide 3 : Login",
    },
    {
      url: "images/slide4.png",
      caption: "guide 4 : Create employee role",
    },
    {
      url: "images/slide5.png",
      caption: "guide 5 : Create employee",
    },
    {
      url: "images/slide6.png",
      caption: "guide 6 : Create blueprint",
    },
    {
      url: "images/slide7.png",
      caption: "guide 7 : Configure blueprint",
    },
    {
      url: "images/slide8.png",
      caption: "guide 8 : Create schedule",
    },
    {
      url: "images/slide9.png",
      caption:
        "guide 8 : Enjoy automated schedule based on blueprint. Configure, Create new company and do more!",
    },
  ];

  return (
    <Slide>
      {slideImages.map((slideImage, index) => (
        <div className="each-slide" key={index}>
          <div
            style={{
              backgroundImage: `url(${slideImage.url})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center center",
              height: "300px",
            }}
          >
            <span>{slideImage.caption}</span>
          </div>
        </div>
      ))}
    </Slide>
  );
};

export default Slider;
