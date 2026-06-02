import * as XLSX from 'xlsx';
import { NotificationItem } from '../types';

/**
 * Parses a time string into minutes from midnight for sorting.
 * Handles formats like "5:00 PM", "8PM", "12:00 - 1:00 PM", etc.
 */
const parseTimeToMinutes = (timeStr: string): number => {
  try {
    const match = timeStr.match(/(\d+)(?::(\d+))?\s*(AM|PM|am|pm)?/i);
    if (!match) return 0;

    let [_, hoursStr, minutesStr, meridiem] = match;
    let hours = parseInt(hoursStr);
    let minutes = minutesStr ? parseInt(minutesStr) : 0;

    // Check for meridiem later in the string if not found in the first segment
    if (!meridiem) {
      const fullMeridiem = timeStr.match(/(AM|PM|am|pm)/i);
      if (fullMeridiem) meridiem = fullMeridiem[0];
    }

    if (meridiem?.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (meridiem?.toUpperCase() === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
  } catch (e) {
    return 0;
  }
};

export const exportToExcel = (notifications: NotificationItem[]) => {
  if (notifications.length === 0) return;

  // Sort notifications: First by Date, then by Time Slot minutes
  const sortedNotifications = [...notifications].sort((a, b) => {
    // 1. Date Sort (Ascending)
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (dateA !== dateB) return dateA - dateB;

    // 2. Time Sort using the parser
    const timeA = parseTimeToMinutes(a.timeSlot);
    const timeB = parseTimeToMinutes(b.timeSlot);
    return timeA - timeB;
  });

  // Format data for Excel
  const dataToExport = sortedNotifications.map(item => ({
    Date: item.date,
    Time_Slot: item.timeSlot,
    Category: item.category,
    Title: item.title,
    Body: item.body
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(dataToExport);

  // Auto-width columns
  const wscols = [
    { wch: 15 }, // Date
    { wch: 20 }, // Time
    { wch: 25 }, // Category
    { wch: 40 }, // Title
    { wch: 80 }, // Body
  ];
  worksheet['!cols'] = wscols;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Push Schedule");

  // Generate file name with date
  const dateStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `ZebPay_Content_Plan_${dateStr}.xlsx`);
};
