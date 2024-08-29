import React, { useState } from "react";
import { Button, Box, Typography, Grid } from "@mui/material";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
} from "date-fns";

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const renderHeader = () => {
    return (
      <Box className="flex justify-between items-center mb-4">
        <Button onClick={prevMonth} variant="contained">
          Prev
        </Button>
        <Typography variant="h6">
          {format(currentMonth, "MMMM yyyy")}
        </Typography>
        <Button onClick={nextMonth} variant="contained">
          Next
        </Button>
      </Box>
    );
  };

  const renderDays = () => {
    const days: JSX.Element[] = [];
    const dateFormat = "E";
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <Typography key={i} className="text-center font-semibold">
          {format(addDays(startDate, i), dateFormat)}
        </Typography>
      );
    }

    return (
      <Grid container>
        {days.map((day, index) => (
          <Grid item xs key={index}>
            {day}
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows: JSX.Element[] = [];
    let days: JSX.Element[] = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");
        const cloneDay = day;
        days.push(
          <Grid
            item
            xs
            key={day.toString()}
            className={`text-center p-2 rounded-md cursor-pointer ${
              !isSameMonth(day, monthStart) ? "text-gray-400" : ""
            } ${
              isSameDay(day, selectedDate)
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
            onClick={() => onDateClick(cloneDay)}
          >
            <Typography>{formattedDate}</Typography>
          </Grid>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <Grid container key={day.toString()}>
          {days}
        </Grid>
      );
      days = [];
    }

    return <Box>{rows}</Box>;
  };

  const onDateClick = (day: Date) => {
    setSelectedDate(day);
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1));
  };

  return (
    <Box className="p-4">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </Box>
  );
};

export default Calendar;
