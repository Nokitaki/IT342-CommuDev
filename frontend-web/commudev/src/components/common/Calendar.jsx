// src/components/common/Calendar.jsx
import React, { useState } from 'react';
import '../../styles/components/calendar.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Get the number of days in the current month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get the first day of the month (e.g., Sunday = 0, Monday = 1)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  
  // Build the calendar grid
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }
  
  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = 
      today.getDate() === day && 
      today.getMonth() === month && 
      today.getFullYear() === year;
    
    calendarDays.push(
      <div 
        key={`day-${day}`} 
        className={`calendar-day ${isToday ? 'today' : ''}`}
      >
        {day}
      </div>
    );
  }
  
  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button 
          className="calendar-nav-button" 
          onClick={goToPreviousMonth}
          aria-label="Previous month"
        >
          &lt;
        </button>
        <div className="calendar-title">
          {monthNames[month]} {year}
        </div>
        <button 
          className="calendar-nav-button" 
          onClick={goToNextMonth}
          aria-label="Next month"
        >
          &gt;
        </button>
      </div>
      
      <div className="calendar-weekdays">
        {daysOfWeek.map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>
      
      <div className="calendar-grid">
        {calendarDays}
      </div>
    </div>
  );
};

export default Calendar;