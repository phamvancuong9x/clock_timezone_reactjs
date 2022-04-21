import React from "react";
import "./style.css";
import { numberClockArray } from "../Constants";
import { getTimezone } from "../Function";
const NumberClock = (props) => {
  return (
    <div className={`number-clock ${props.className}`}>
      <span>{props.number1}</span> <span>{props.number2}</span>
    </div>
  );
};
const Select = ({ totalTimezone, setTimezone, timezone }) => {
  const newTotalTimezone = totalTimezone.map((timezones, i) => {
    return {
      location: getTimezone(timezones),
      timezone: timezones,
    };
  });
  newTotalTimezone.sort(function (a, b) {
    let x = a.location.toLowerCase();
    let y = b.location.toLowerCase();
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  });
  return (
    <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
      {newTotalTimezone.map((location, i) => {
        return (
          <option key={i} value={location.timezone}>
            {location.location}
          </option>
        );
      })}
      (
    </select>
  );
};
const timeDate = (date, utcOffset) => {
  let seconds = +date.getSeconds();
  let minutes = +date.getMinutes();
  let hours = +date.getUTCHours() + utcOffset;
  if (hours < 0) {
    hours += 24;
  } else if (hours >= 24) {
    hours -= 24;
  }
  let hourHandDeg = -90 + hours * 30 + Math.floor((minutes / 60) * 30);
  let minuteHandDeg = -90 + minutes * 6;
  let secondHandDeg = -90 + seconds * 6;
  return { hours, minutes, seconds, hourHandDeg, minuteHandDeg, secondHandDeg };
};
const ClockTimeZone = (props) => {
  let totalTimezone = React.useRef(undefined);
  const [time, setTime] = React.useState(new Date());
  const [utcOffset, setUtcOffset] = React.useState(7);
  const timeDateObj = timeDate(time, utcOffset);
  let [clockHand, setClockHand] = React.useState({
    hourHand: timeDateObj.hourHandDeg,
    minuteHand: timeDateObj.minuteHandDeg,
    secondHand: timeDateObj.secondHandDeg,
  });
  const [timezone, setTimezone] = React.useState("Asia/Ho_Chi_Minh");

  React.useEffect(() => {
    fetch(`https://worldtimeapi.org/api/timezone`)
      .then((response) => response.json())
      .then((timezone) => {
        totalTimezone.current = timezone;
      });
    setInterval(() => {
      setTime(new Date());
    }, 1000);
  }, []);
  React.useEffect(() => {
    fetch(`https://worldtimeapi.org/api/timezone/${timezone}`)
      .then((response) => response.json())
      .then((date) => {
        let timezones = +date.utc_offset.slice(0, 3);
        setUtcOffset(timezones);
      });
  }, [timezone]);
  React.useEffect(() => {
    setClockHand({
      hourHand: timeDateObj.hourHandDeg,
      minuteHand: timeDateObj.minuteHandDeg,
      secondHand: timeDateObj.secondHandDeg,
    });
  }, [time]);
  React.useEffect(() => {
    document.title = getTimezone(timezone);
  });
  return (
    <div className="container">
      <h3 className="header"> Đồng hồ treo tường</h3>
      <div className="clock2">
        <div
          className="hour-hand"
          style={{
            transform: `rotate(${clockHand.hourHand}deg) translateY( -50%)`,
          }}
        ></div>
        <div
          className="minute-hand"
          style={{
            transform: `rotate(${clockHand.minuteHand}deg) translateY( -50%)`,
          }}
        ></div>
        <div
          className="seconds-hand"
          style={{
            transform: `rotate(${clockHand.secondHand}deg) translateY( -50%)`,
          }}
        ></div>
        <div className="circleCenter"></div>
        {numberClockArray.map((value, index) => {
          return (
            <NumberClock
              key={index}
              className={value.className}
              number1={value.number1}
              number2={value.number2}
            />
          );
        })}
      </div>
      <h3 style={{ marginTop: "30px" }}>
        {timeDateObj.hours} : {timeDateObj.minutes} : {timeDateObj.seconds}
      </h3>
      {totalTimezone.current != undefined ? (
        <Select
          totalTimezone={totalTimezone.current}
          timezone={timezone}
          setTimezone={setTimezone}
        />
      ) : (
        <Select
          totalTimezone={[`${timezone}`]}
          timezone={timezone}
          setTimezone={setTimezone}
        />
      )}
    </div>
  );
};

export default ClockTimeZone;
