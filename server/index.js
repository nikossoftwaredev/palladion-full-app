const express = require("express");
const moment = require("moment");
const cors = require("cors");
const cron = require("node-cron");
const { port } = require("./config");

const app = express();

app.use(cors());

app.get("/getClassId", async (req, res) => {
  const { rsdate, time, type, previousSunday } = req.body;

  if (!previousSunday || !rsdate || !time || !type)
    res.send({
      message: `${!previousSunday ? "previousSunday" : ""} ${
        !rsdate ? "Date" : ""
      } ${!time ? "Time" : ""} ${!type ? "Type" : ""} is required`,
    });

  const classId = await getClassId({ rsdate, time, type, previousSunday });
  if (!classId) res.send({ error: "class not found" });

  res.send({ classId });
});

app.get("/reservation", async (req, res) => {
  const { email, rsdate, time, classId, actualDate, executeNow } = req.body;

  if (executeNow) {
    const { html, error } = await makeReservation({
      classId,
      email,
      rsdate,
      time,
    });

    res.send({
      message: `Reservation made`,
      html,
      error,
    });
  } else {
    const date = moment(actualDate).format("YYYY-MM-DD");

    const timeAndDate = moment(`${date} ${time}`);

    timeAndDate.subtract("1", "day").subtract("2", "minutes");

    const cronTab = dateToCron(timeAndDate.toDate());
    const scheduledFor = moment(timeAndDate).format("DD/MM/YYYY HH:mm");

    cron.schedule(cronTab, async () => {
      await makeReservation({
        classId,
        email: encodeURIComponent(email),
        rsdate,
        time,
        cronTab,
      });
    });

    res.send({
      message: `Res Scheduled for ${scheduledFor}`,
      cronTab,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
