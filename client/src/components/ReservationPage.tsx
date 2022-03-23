import { useEffect, useMemo, useRef, useState } from "react";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import {
  Alert,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DateAdapter from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Loader from "./Loader";
import { crossDates, weightDates } from "../utils/data";
import moment from "moment";
import { isMailValid } from "../utils/general";
import logo from "../assets/logo.png";
import gym from "../assets/gym.gif";
import axios from "axios";
import { baseUrl } from "../config";
import { dateToCron } from "../utils/date";

interface InputFormData {
  email: string;
  time: string;
  type: "cross" | "weights";
  rsdate: Date;
  classId: string;
}

const initFormData: InputFormData = {
  email: localStorage.getItem("email") || "",
  time: "18:00",
  type: "cross",
  rsdate: new Date(),
  classId: "",
};

const ReservationPage = () => {
  const [loading, setLoading] = useState(false);
  const [fetchingClass, setFetchingClass] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [willExecuteAt, setWillExecuteAt] = useState("");
  const [cronTab, setCronTab] = useState("");

  const [formData, setFormData] = useState<InputFormData>(initFormData);

  const mailIsInvalid = useMemo(
    () => !isMailValid(formData.email),
    [formData.email]
  );

  const previousSunday = useMemo(() => {
    return moment(formData.rsdate).startOf("weeks").format("YYYY-MM-DD");
  }, [formData.rsdate]);

  const isDisabled = useMemo(
    () =>
      !Object.keys(formData).every(
        (key) => formData[key as keyof InputFormData]
      ),
    [formData]
  );

  const dates = useMemo(
    () => (formData.type === "cross" ? crossDates : weightDates),
    [formData.type]
  );

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        rsdate: moment(formData.rsdate).format("DD/MM/YYYY"),
        executeNow: !willExecuteAt,
        cronTab,
      };
      localStorage.setItem("email", formData.email);
      await axios.post(`${baseUrl}/reservation`, dataToSend);

      setSuccess(true);
    } catch (e) {
      setError((e as Error).message as string);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name: keyof InputFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    handleChange("classId", "");
    setFetchingClass(true);
    axios
      .post(`${baseUrl}/getClassId`, {
        time: formData.time,
        type: formData.type,
        rsdate: moment(formData.rsdate).format("DD/MM/YYYY"),
        actualDate: formData.rsdate,
        previousSunday,
      })
      .then((response) => {
        const { data } = response;

        if (data.error) {
          setError(data.error);
          handleChange("classId", "");
        } else {
          handleChange("classId", data.classId);
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setFetchingClass(false));
  }, [formData.time, formData.type, formData.rsdate, previousSunday]);

  useEffect(() => {
    const date = moment(formData.rsdate).format("YYYY-MM-DD");
    const time = formData.time;

    const timeAndDate = moment(`${date} ${time}`);
    timeAndDate.subtract("1", "day").subtract("1", "minutes");

    const currentDate = new Date();

    if (timeAndDate.diff(moment(currentDate)) > 0) {
      setCronTab(dateToCron(timeAndDate.toDate()));
      setWillExecuteAt(moment(timeAndDate).format("DD/MM/YYYY HH:mm"));
    } else {
      setCronTab("");

      setWillExecuteAt("");
    }
  }, [formData.time, formData.rsdate]);

  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      {loading && <Loader />}
      <Stack direction="row" spacing={3} justifyContent="center">
        <Stack spacing={2} justifyContent="center" alignItems="center">
          <img
            alt="logo"
            style={{ borderRadius: "10px", height: "50px", width: "50px" }}
            src={logo}
          />
          <Typography color="textPrimary" variant="h4">
            Make Reservation
          </Typography>
          <img
            alt="gymgif"
            style={{ borderRadius: "10px", height: "200px", width: "100%" }}
            src={gym}
          />
          <TextField
            fullWidth
            size="small"
            type="email"
            error={mailIsInvalid}
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            id="outlined-basic"
            label="E-mail"
            variant="outlined"
            onKeyUp={(e) => {
              if (e.key === "Enter" || e.keyCode === 13) {
                handleSubmit();
              }
            }}
          />
          <Stack
            direction={{ xs: "column", md: "row" }}
            style={{ width: "100%" }}
            spacing={2}
          >
            <FormControl size="small">
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formData.type}
                sx={{ minWidth: 150 }}
                label="Type"
                onChange={(e) => handleChange("type", e.target.value)}
              >
                <MenuItem value="cross">X-Cross</MenuItem>
                <MenuItem value="weights">Βάρη - Cardio</MenuItem>
              </Select>
            </FormControl>
            <DesktopDatePicker
              label="Date"
              inputFormat="DD/MM/yyyy"
              value={formData.rsdate}
              onChange={(date) => handleChange("rsdate", date)}
              renderInput={(params) => <TextField size="small" {...params} />}
            />
            <FormControl size="small">
              <InputLabel id="demo-simple-select-label">Time</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formData.time}
                label="Time"
                onChange={(e) => handleChange("time", e.target.value)}
              >
                {dates.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Stack
            style={{ width: "100%", padding: "4px" }}
            justifyContent="center"
            alignItems="center"
          >
            {fetchingClass ? (
              <CircularProgress />
            ) : (
              <Typography color="textPrimary">
                Execute: {willExecuteAt ? `at ${willExecuteAt}` : "now"}
              </Typography>
            )}
            <Button
              disabled={isDisabled}
              onClick={handleSubmit}
              style={{ marginTop: "16px" }}
              variant="contained"
            >
              {willExecuteAt ? "Schedule" : "Reserve"}
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success">Reservation Made</Alert>
      </Snackbar>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </LocalizationProvider>
  );
};

export default ReservationPage;
