import { UserRole } from './types';

// Helper to unique and sort
const uniqueSort = (arr: string[]) => Array.from(new Set(arr)).sort((a, b) => a.localeCompare(b));

export interface TaskDefinition {
  name: string;
  time: number | 'runtime';
}

/**
 * Parses a time string (e.g., "4 min / Section") into a decimal hour value.
 * Returns 'runtime' if the time is variable.
 * @param timeStr The string to parse.
 * @returns A number (decimal hours) or the string 'runtime'.
 */
const parseTime = (timeStr: string): number | 'runtime' => {
  if (timeStr.toLowerCase().includes('based on run time')) {
    return 'runtime';
  }
  const match = timeStr.match(/(\d+)/);
  if (match) {
    const minutes = parseInt(match[1], 10);
    // Convert minutes to decimal hours and round to 2 decimal places
    return Math.round((minutes / 60) * 100) / 100;
  }
  return 'runtime';
};

const rawTasksFromCSV = [
  { task: "Time Table Creation", time: "4 min / Section" },
  { task: "Materials Required Sending", time: "5 min / Section" },
  { task: "Live Class Scheduling", time: "3 mins/class" },
  { task: "Live Class Schedule Checking", time: "2 mins/Class" },
  { task: "Course Access Message", time: "4 min / Section" },
  { task: "Absent Sheet Updation / Message Sending", time: "5 min / Section" },
  { task: "Progression Sheet Updation / Message Sending", time: "5 min / Section" },
  { task: "Assignment Remainder Message", time: "4 min / Section" },
  { task: "Assessment Remainder Message", time: "5 min / Section" },
  { task: "Frequent Absentees Call", time: "3 mins/ call" },
  { task: "Absentees chat updation in sheet / Reply", time: "1 min / Message" },
  { task: "Course absentees sheet Updation", time: "5 min / Section" },
  { task: "Course absentees Call", time: "5 min / Student" },
  { task: "Course Feedback message", time: "3 min / Class" },
  { task: "PTM Schedule Template Making", time: "3 mins/ call" },
  { task: "PTM Schedule Sending", time: "2 mins/Class" },
  { task: "PTM Absent sheet updation / Message sending", time: "3 mins/class" },
  { task: "PTM Reschedule Sheet Updation", time: "2 min / Student" },
  { task: "PTM Reschedule Call", time: "7 min / Student" },
  { task: "Batch Changing", time: "3 mins/ Student" },
  { task: "Whatsapp Message Number Changing", time: "2 mins/ Student" },
  { task: "Kit Address Sheet Updation", time: "7 Min / Section" },
  { task: "Graduation and Event calls", time: "4 mins/ Student" },
  { task: "Leave Holiday message", time: "30 min Overall" },
  { task: "Hold Calls", time: "5 min / Student" },
  { task: "Course Preparation Message From Trainer Team", time: "Based on run time" },
  { task: "Competition Message From Trainers Team", time: "Based on run time" },
  { task: "Trainer Follow Up Messages", time: "Based on run time" },
  { task: "Trainer Follow Up calls", time: "Based on run time" },
  { task: "Innovation Club Messages", time: "3 mins/class" },
  { task: "Morning Club Inaguration Message", time: "3 mins/class" },
  { task: "Payment Follow Sheet - Sales Team", time: "7 min / Section" },
  { task: "Discontinue Process From Sales Team", time: "2 Min / Student" },
  { task: "Other", time: "Based on run time" },
];

export const TASKS_WITH_TIME: TaskDefinition[] = [
    ...rawTasksFromCSV.map(t => ({
        name: t.task,
        time: parseTime(t.time)
    })),
    { name: 'Custom', time: 'runtime' } // Add the custom option
];


const rawTeams = [
  "Stem Educational Program Onboarding",
  "Stem Educational Program Operations",
  "Neet/Jee Operations and Onboarding",
  "Pick My Career Onboarding",
  "Pick My Career Operations",
  "Chitti Future School Onboarding",
  "Chitti Future School Operations"
];

const rawFrequency = [
  "Daily",
  "Weekly",
  "Weekend",
  "Monthly",
  "Yearly"
];

export const TEAMS = uniqueSort(rawTeams);
export const FREQUENCIES = uniqueSort(rawFrequency);

export const DEFAULT_ADMIN = {
  id: 'admin-001',
  username: 'admin',
  password: 'password123',
  name: 'Super Admin',
  role: UserRole.ADMIN
};

export const TIME_STUDY_DATA = [
  { time: "00:01", num: 0.02 }, { time: "00:02", num: 0.03 }, { time: "00:03", num: 0.05 }, { time: "00:04", num: 0.07 },
  { time: "00:05", num: 0.08 }, { time: "00:06", num: 0.1 }, { time: "00:07", num: 0.12 }, { time: "00:08", num: 0.13 },
  { time: "00:09", num: 0.15 }, { time: "00:10", num: 0.17 }, { time: "00:11", num: 0.18 }, { time: "00:12", num: 0.2 },
  { time: "00:13", num: 0.22 }, { time: "00:14", num: 0.23 }, { time: "00:15", num: 0.25 }, { time: "00:16", num: 0.27 },
  { time: "00:17", num: 0.28 }, { time: "00:18", num: 0.3 }, { time: "00:19", num: 0.32 }, { time: "00:20", num: 0.33 },
  { time: "00:21", num: 0.35 }, { time: "00:22", num: 0.37 }, { time: "00:23", num: 0.38 }, { time: "00:24", num: 0.4 },
  { time: "00:25", num: 0.42 }, { time: "00:26", num: 0.43 }, { time: "00:27", num: 0.45 }, { time: "00:28", num: 0.47 },
  { time: "00:29", num: 0.48 }, { time: "00:30", num: 0.5 }, { time: "00:31", num: 0.52 }, { time: "00:32", num: 0.53 },
  { time: "00:33", num: 0.55 }, { time: "00:34", num: 0.57 }, { time: "00:35", num: 0.58 }, { time: "00:36", num: 0.6 },
  { time: "00:37", num: 0.62 }, { time: "00:38", num: 0.63 }, { time: "00:39", num: 0.65 }, { time: "00:40", num: 0.67 },
  { time: "00:41", num: 0.68 }, { time: "00:42", num: 0.7 }, { time: "00:43", num: 0.72 }, { time: "00:44", num: 0.73 },
  { time: "00:45", num: 0.75 }, { time: "00:46", num: 0.77 }, { time: "00:47", num: 0.78 }, { time: "00:48", num: 0.8 },
  { time: "00:49", num: 0.82 }, { time: "00:50", num: 0.83 }, { time: "00:51", num: 0.85 }, { time: "00:52", num: 0.87 },
  { time: "00:53", num: 0.88 }, { time: "00:54", num: 0.9 }, { time: "00:55", num: 0.92 }, { time: "00:56", num: 0.93 },
  { time: "00:57", num: 0.95 }, { time: "00:58", num: 0.97 }, { time: "00:59", num: 0.98 }, { time: "01:00", num: 1 }
];
