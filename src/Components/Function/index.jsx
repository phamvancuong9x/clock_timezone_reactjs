export const getTimezone = (timezone) => {
  let location = "";
  for (let i = timezone.length - 1; i > 0; i--) {
    if (timezone[i] == "/") {
      break;
    } else {
      location = timezone[i] + location;
    }
  }

  return location.replaceAll("_", " ");
};
