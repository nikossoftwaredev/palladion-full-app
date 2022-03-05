export const getParams = (url: string) => {
  const stationId = url
    .match(/statio(?:n|ns)\/\d+/)
    ?.join("")
    .replace(/statio(?:n|ns)\//, "");

  const pageId = url
    .match(/page\/\d+/)
    ?.join("")
    .replace(/page\//, "");

  return { stationId, pageId };
};

export const isMailValid = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
