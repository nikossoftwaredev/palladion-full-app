import Authentication from "../src/components/Authentication";
import { useState } from "react";
import ReservationPage from "./components/ReservationPage";
import { createTheme, IconButton } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import NightlightIcon from "@mui/icons-material/Nightlight";
import WbSunnyIcon from "@mui/icons-material/WbSunny";

const App = () => {
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const lightTheme = createTheme({
    palette: {
      mode: "light",
    },
  });

  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [mode, setMode] = useState(localStorage.getItem("mode") || "dark");

  return (
    <ThemeProvider theme={mode === "dark" ? darkTheme : lightTheme}>
      <div
        className="App"
        style={{
          backgroundColor: mode === "dark" ? "rgb(23, 23, 26)" : "white",
        }}
      >
        <IconButton
          style={{
            position: "absolute",
            top: "5px",
            left: "5px",
          }}
          onClick={() =>
            setMode((prev) => (prev === "dark" ? "light" : "dark"))
          }
        >
          {mode === "dark" ? <WbSunnyIcon /> : <NightlightIcon />}
        </IconButton>
        {isUserAuthenticated ? (
          <ReservationPage />
        ) : (
          <Authentication setIsUserAuthenticated={setIsUserAuthenticated} />
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;
