import React from "react";

// with great thanks to @carlsednaoui for his work in https://github.com/carlsednaoui/add-to-calendar-buttons

const MS_IN_MINUTES = 60 * 1000;

var formatTime = function(date) {
  return date.toISOString().replace(/-|:|\.\d+/g, "");
};

var calculateEndTime = function(event) {
  return event.end ?
    formatTime(event.end) :
    formatTime(new Date(event.start_datetime.getTime() + (event.duration * MS_IN_MINUTES)));
};

var calendarURLs = {
  google: function (event) {
    var startTime = formatTime(event.start_datetime);
    var endTime = calculateEndTime(event);

    return encodeURI([
      "https://www.google.com/calendar/render",
      "?action=TEMPLATE",
      "&text=" + (event.title || ""),
      "&dates=" + (startTime || ""),
      "/" + (endTime || ""),
      "&details=" + (event.description || ""),
      "&location=" + (event.address || ""),
      "&sprop=&sprop=name:"
    ].join(""));

  },

  yahoo: function (event) {
    var eventDuration = event.end ?
            ((event.end.getTime() - event.start_datetime.getTime()) / MS_IN_MINUTES) :
            event.duration;

    // Yahoo dates are crazy, we need to convert the duration from minutes to hh:mm
    var yahooHourDuration = eventDuration < 600 ?
    "0" + Math.floor((eventDuration / 60)) :
    Math.floor((eventDuration / 60)) + "";

    var yahooMinuteDuration = eventDuration % 60 < 10 ?
    "0" + eventDuration % 60 :
    eventDuration % 60 + "";

    var yahooEventDuration = yahooHourDuration + yahooMinuteDuration;

    // Remove timezone from event time
    var st = formatTime(new Date(event.start_datetime - (event.start_datetime.getTimezoneOffset() *
                    MS_IN_MINUTES))) || "";

    return encodeURI([
      "http://calendar.yahoo.com/?v=60&view=d&type=20",
      "&title=" + (event.title || ""),
      "&st=" + st,
      "&dur=" + (yahooEventDuration || ""),
      "&desc=" + (event.description || ""),
      "&in_loc=" + (event.address || "")
    ].join(""));

  },

  ics: function (event) {
    var startTime = formatTime(event.start_datetime);
    var endTime = calculateEndTime(event);

    return encodeURI(
            "data:text/calendar;charset=utf8," + [
              "BEGIN:VCALENDAR",
              "VERSION:2.0",
              "BEGIN:VEVENT",
              "URL:" + document.URL,
              "DTSTART:" + (startTime || ""),
              "DTEND:" + (endTime || ""),
              "SUMMARY:" + (event.title || ""),
              "DESCRIPTION:" + (event.description || ""),
              "LOCATION:" + (event.address || ""),
              "END:VEVENT",
              "END:VCALENDAR"].join("\n"));

  },

  ical: function (event) {
    return this.ics(event);
  },

  outlook: function (event) {
    return this.ics(event);
  }
};


var AddToCalendar = React.createClass({

  propTypes: {
    event: React.PropTypes.object
  },

  render: function (){
    return (
      <div className="add-to-calendar-panel">
        <ul>
          <li><a className="google-calendar-link"
                 href={calendarURLs.google(this.props.event)}>Google Calendar</a></li>
          <li><a className="yahoo-calendar-link"
                 href={calendarURLs.yahoo(this.props.event)}>Yahoo Calendar</a></li>
          <li><a className="ical-link"
                 href={calendarURLs.ical(this.props.event)}>iCal</a></li>
          <li><a className="outlook-calendar-link"
                 href={calendarURLs.outlook(this.props.event)}>Outlook</a></li>
        </ul>
      </div>
    );
  }


});

export default AddToCalendar;
