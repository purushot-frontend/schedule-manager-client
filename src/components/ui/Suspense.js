import Placeholder from "react-bootstrap/Placeholder";

const Suspense = (props) => {
  return (
    <Suspense
      fallback={
        <Placeholder
          as="p"
          animation="wave"
          style={{ height: "100vh" }}
          xs={12}
          bg="dark"
        />
      }
    >
      {props.children}
    </Suspense>
  );
};

export default Suspense;
