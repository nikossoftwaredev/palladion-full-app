const axios = require("axios");
const qs = require("qs");
const cheerio = require("cheerio");
const { baseUrl, endpoint } = require("../config");

const seats = { cross: 3, weights: 60 };

const data = {
  nonpaid: "",
  cancelCredit: "0",
  option: "accept",
};

const getClassId = async ({ rsdate, time, type, previousSunday }) => {
  // Scraping for class Id
  const dataToSend = qs.stringify({ monday: previousSunday, type: "next" });

  const { data } = await axios({
    method: "post",
    url: `${baseUrl}mainSchedule`,
    data: dataToSend,
  });

  const $ = cheerio.load(data);

  const numberOfSeats = seats[type];
  const aTag = $(
    `[scheduledate=${rsdate}][scheduletime=${time}][scheduleseats=${numberOfSeats}]`
  );

  const id = aTag.attr("id");

  return id;
};

const makeReservation = async ({ rsdate, time, email, classId }) => {
  const dataToSend = qs.stringify({ ...data, rsdate, time, email, classId });
  try {
    const response = await axios({
      method: "post",
      url: `${baseUrl}${endpoint}/?${dataToSend}`,
      data: dataToSend,
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        pragma: "no-cache",
        "sec-ch-ua":
          '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        cookie: `loggedIn=${email}`,
      },
    });

    return { html: response.data, error: "" };
  } catch (e) {
    return { error: e.message, html: "" };
  }
};

module.exports = { getClassId, makeReservation };
