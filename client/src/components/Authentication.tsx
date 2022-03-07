import React, { useCallback, useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  Button,
  IconButton,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import fatGif from "../assets/fat.gif";

const Authentication = ({
  setIsUserAuthenticated,
}: {
  setIsUserAuthenticated: (prevState: boolean | (() => boolean)) => void;
}) => {
  const [passphrase, setPassphrase] = useState(
    localStorage.getItem("passphrase") || ""
  );
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const onConfirm = useCallback(() => {
    if (passphrase === "fat") {
      setIsUserAuthenticated(true);
      localStorage.setItem("passphrase", "fat");
    } else {
      setIsUserAuthenticated(false);
      setPassphrase("");
      setError("Nope :/");
      localStorage.setItem("passphrase", "");
    }
  }, [passphrase]);

  return (
    <Stack spacing={2}>
      <Typography variant="h6" color="textPrimary">
        Answer the following riddle...
      </Typography>
      <Typography color="textPrimary">What are you?</Typography>
      <img src={fatGif} width="300" />
      <TextField
        fullWidth
        size="small"
        type={showPassword ? "text" : "password"}
        value={passphrase}
        onChange={(e) => setPassphrase(e.target.value)}
        id="outlined-basic"
        label="Passphrase"
        variant="outlined"
        onKeyUp={(e) => {
          if (e.key === "Enter" || e.keyCode === 13) {
            onConfirm();
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button variant="contained" onClick={onConfirm}>
        Confirm
      </Button>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Stack>
  );
};

export default Authentication;
