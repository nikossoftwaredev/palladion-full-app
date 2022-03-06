import Authentication from "../src/components/Authentication";
import { useMemo, useState } from "react";
import ReservationPage from "./components/ReservationPage";

const App = () => {
  const [confirmClicked, setConfirmClicked] = useState(false);
  const isUserAuthenticated = useMemo(
    () => localStorage.getItem("isAuthenticated"),
    [confirmClicked]
  );

  return (
    <div className="App">
      {isUserAuthenticated ? (
        <ReservationPage />
      ) : (
        <Authentication setConfirmClicked={setConfirmClicked} />
      )}
    </div>
  );
};

export default App;
