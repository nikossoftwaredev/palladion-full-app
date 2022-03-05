const express = require("express");
const moment = require("moment");
const cors = require("cors");
const { port } = require("./config");
const { dateToCron } = require("./utils/general");
const cron = require("node-cron");
const { getClassId, makeReservation } = require("./utils/reservation");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post("/getClassId", async (req, res) => {
  try {
    const { rsdate, time, type, previousSunday } = req.body;

    if (!previousSunday || !rsdate || !time || !type) {
      res.send({
        message: `${!previousSunday ? "previousSunday" : ""} ${
          !rsdate ? "Date" : ""
        } ${!time ? "Time" : ""} ${!type ? "Type" : ""} is required`,
      });
    }

    const classId = await getClassId({ rsdate, time, type, previousSunday });
    if (!classId) res.send({ error: "class not found" });
    else res.send({ classId });
  } catch (error) {
    res.send({ error });
  }
});

app.post("/reservation", async (req, res) => {
  const { email, rsdate, time, classId, actualDate, executeNow } = req.body;

  if (executeNow) {
    const { html, error } = await makeReservation({
      classId,
      email,
      rsdate,
      time,
    });

    res.send({
      message: `scheduledFor ${scheduledFor}, cronTab ${cronTab}`,
      error,
      html,
    });
  } else {
    const date = moment(actualDate).format("YYYY-MM-DD");

    const timeAndDate = moment(`${date} ${time}`);

    timeAndDate.subtract("1", "day").subtract("2", "minutes");

    const cronTab = dateToCron(timeAndDate.toDate());
    const scheduledFor = moment(timeAndDate).format("DD/MM/YYYY HH:mm");

    cron.schedule(
      cronTab,
      async () => {
        await makeReservation({
          classId,
          email: encodeURIComponent(email),
          rsdate,
          time,
          cronTab,
        });
      },
      {
        scheduled: true,
        timezone: "Europe/Athens",
      }
    );

    res.send({
      message: `Res Scheduled for ${scheduledFor}`,
      cronTab,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
