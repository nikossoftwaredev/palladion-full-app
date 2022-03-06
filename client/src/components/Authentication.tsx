import React, { useCallback, useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const Authentication = ({
  setConfirmClicked,
}: {
  setConfirmClicked: (prevState: boolean | (() => boolean)) => void;
}) => {
  const [passphrase, setPassphrase] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onConfirm = useCallback(() => {
    if (passphrase === "youfat")
      localStorage.setItem("isAuthenticated", "true");
    else localStorage.setItem("isAuthenticated", "false");

    setConfirmClicked(true);
  }, []);

  return (
    <Stack spacing={2}>
      <Typography>You must enter secret passphrase to continue:</Typography>
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
    </Stack>
  );
};

export default Authentication;
