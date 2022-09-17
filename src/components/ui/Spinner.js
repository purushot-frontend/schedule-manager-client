const Spinner = (props) => {
  return (
    <div
      className="spinner-border  spinner-border-sm text-warning"
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

export default Spinner;
