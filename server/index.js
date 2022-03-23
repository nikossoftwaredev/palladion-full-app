const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { port } = require("./config");
const { dateToCron } = require("./utils/general");
const cron = require("node-cron");
const { getClassId, makeReservation } = require("./utils/reservation");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

app.post("/api/getClassId", async (req, res) => {
  try {
    const { rsdate, time, type, previousSunday, actualDate } = req.body;

    if (!previousSunday || !rsdate || !time || !type) {
      res.send({
        message: `${!previousSunday ? "previousSunday" : ""} ${
          !rsdate ? "Date" : ""
        } ${!time ? "Time" : ""} ${!type ? "Type" : ""} is required`,
      });
    }

    const classId = await getClassId({
      rsdate,
      time,
      type,
      previousSunday,
      actualDate,
    });
    if (!classId) res.send({ error: "class not found" });
    else res.send({ classId });
  } catch (error) {
    res.send({ error });
  }
});

app.post("/api/reservation", async (req, res) => {
  const { email, rsdate, time, classId, executeNow, cronTab } = req.body;

  try {
    if (executeNow) {
      const { html, error } = await makeReservation({
        classId,
        email,
        rsdate,
        time,
      });

      res.send({
        error,
        html,
      });
    } else {
      cron.schedule(
        cronTab,
        async () => {
          try {
            await makeReservation({
              classId,
              email: encodeURIComponent(email),
              rsdate,
              time,
              cronTab,
            });
          } catch (e) {
            console.log("error" + e.message);
          }
        },
        {
          scheduled: true,
          timezone: "Europe/Athens",
        }
      );

      console.log({ email, classId, time, cronTab });
      res.send({
        message: `Res Scheduled for ${cronTab}`,
        cronTab,
      });
    }
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
