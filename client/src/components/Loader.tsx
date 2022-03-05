import { CircularProgress } from "@mui/material";

const Loader = () => (
  <div
    style={{
      zIndex: "200",
      backdropFilter: "brightness(0.5)",
      width: "100%",
      height: "100%",
      position: "absolute",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <CircularProgress />
  </div>
);

export default Loader;
