export interface StaffMember {
  sl: number;
  name: string;
  nameBn: string;
  employeeId: string;
  assignedRole: string;
  assignedRoleBn: string;
  floorKey: string; // 'G', '1'..'15', 'EXT_FRONT', 'EXT_BACK', 'REL_1'..'REL_3', 'SQUAD_1'..'SQUAD_3'
  weeklyOff: string;
  weeklyOffBn: string;
  designatedSubstitute: string;
  designatedSubstituteBn: string;
  substituteId: string;
  dutyCategory: string;
  dutyCategoryBn: string;
  auxiliaryResponsibilityBn: string;
}

export interface DailyTimeSlot {
  id: string;
  timeRange: string;
  timeRangeBn: string;
  durationBn: string;
  iconKey: 'broom' | 'coffee' | 'sparkles' | 'door' | 'check' | 'utensils' | 'droplet' | 'fan' | 'clipboard';
  titleBn: string;
  detailsBn: string;
  category: 'task1' | 'break' | 'task2' | 'rooms' | 'washroom_check' | 'afternoon' | 'star_room' | 'closing';
}

export interface DayScheduleEntry {
  floorKey: string;
  dateIso: string; // '2026-11-14'
  dayIndex: number; // 1..30
  dateDisplayBn: string; // '১৪ নভেম্বর ২০২৬'
  dateShortBn: string; // '১৪ নভেম্বর'
  dayNameEn: string; // 'Saturday'
  dayNameBn: string; // 'শনিবার'
  weekNumber: number; // 1..5
  morningRooms: string[]; // 3 items (each 20 min + 10 min check)
  starRoom: string; // ★ afternoon deep clean room (fans + windows + veranda + floor)
  isWeeklyOff: boolean;
  activeWorkerNameBn: string;
  activeWorkerId: string;
  substituteNoteBn: string;
  specialTaskBn: string;
}

export interface RoomDoorCardEntry {
  dateIso: string;
  dateDisplayBn: string;
  dayNameBn: string;
  timeSlotBn: string;
  isStarClean: boolean;
  workDescriptionBn: string;
  assignedWorkerBn: string;
}

export interface AuxiliaryTaskItem {
  id: string;
  taskTitleBn: string;
  frequencyBn: string;
  durationBn: string;
  timeSlotBn: string;
  assignedStaffBn: string;
  floorsOrZonesBn: string;
  verificationMethodBn: string;
}

export interface OfficialNoticesConfig {
  institutionNameBn: string;
  hallNameBn: string;
  rosterTitleBn: string;
  rosterPeriodBn: string;
  officeHoursBn: string;
  doorCardInstructionBn: string;
  workerMonthlyHeaderBn: string;
  maintenanceRuleBn: string;
  emergencyBackupRuleBn: string;
  rosterStartDate: string; // 'YYYY-MM-DD' — শিটের Official_Notices থেকে বদলানো যায়
  rosterEndDate: string; // 'YYYY-MM-DD'
}

export interface RoleRoutineRow {
  roleKey: string; // 'G', '1', 'EXT_FRONT', 'EXT_BACK', 'SQUAD_1', 'SQUAD_2', 'SQUAD_3'
  dayEn: string; // 'All' (প্রতিদিন) অথবা নির্দিষ্ট বার: 'Saturday' ... 'Thursday'
  timeBn: string; // '০৭:৩০–০৯:০০'
  workBn: string;
}

export interface AssignmentHistoryRow {
  periodStart: string; // 'YYYY-MM-DD'
  periodEnd: string;
  sl: number;
  name: string;
  employeeId: string;
  floorKey: string;
  roleBn: string;
}

export interface SpreadsheetDatabase {
  staffList: StaffMember[];
  roleRoutines?: RoleRoutineRow[]; // Google Sheet ট্যাব: Role_Weekday_Routines
  assignmentHistory?: AssignmentHistoryRow[]; // Google Sheet ট্যাব: Assignment_History
  dailyRoutine: DailyTimeSlot[];
  floorSchedules: Record<string, DayScheduleEntry[]>; // keyed by 'G', '1'..'15'
  auxiliaryTasks: AuxiliaryTaskItem[];
  notices: OfficialNoticesConfig;
}

export const ROSTER_START_DATE = '2026-11-14';
export const ROSTER_END_DATE = '2026-12-13';

export const DEFAULT_OFFICIAL_NOTICES: OfficialNoticesConfig = {
  institutionNameBn: 'ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি',
  hallNameBn: 'ছাত্রী হল (RASG-2) • হল প্রশাসন ও ব্যবস্থাপনা বিভাগ',
  rosterTitleBn: 'পরিচ্ছন্নতা কার্যক্রম ও মাসিক দায়িত্ব বণ্টন সূচি',
  rosterPeriodBn: '১৪ নভেম্বর ২০২৬ হতে ১৩ ডিসেম্বর ২০২৬ পর্যন্ত',
  officeHoursBn: 'সকাল ৭:৩০ মি. হতে বিকাল ৪:৩০ মি. পর্যন্ত',
  doorCardInstructionBn:
    'আবাসিক ছাত্রীদের প্রতি নির্দেশনা: পরিষ্কার করার নির্ধারিত সময়ে কক্ষে কোনো ছাত্রী উপস্থিত না থাকলে পরিচ্ছন্নতাকর্মী কক্ষ পরিষ্কার করবেন না। তবে, ছাত্রীরা হল কর্তৃপক্ষের মাধ্যমে কাউকে উপস্থিত রাখার ব্যবস্থা করলে পরিষ্কার করা হবে। কক্ষে কেউ না থাকার কারণে পরিষ্কার করা সম্ভব না হলে পরবর্তীতে তা আর পরিষ্কার করা হবে না; শুধুমাত্র পরিচ্ছন্নতাকর্মী অন্য কাজে নিযুক্ত থাকলে বা তাঁর কারণে পরিষ্কার করা সম্ভব না হলে পরবর্তী তারিখে তা পরিষ্কার করা হবে। কাজ শেষে সুপারভাইজার তা যাচাই করে স্বাক্ষর করবেন।',
  workerMonthlyHeaderBn:
    'নির্ধারিত তলার সকল পরিচ্ছন্নতার কাজ। যেমন: ময়লার ঝুড়ি ও বালতি পরিষ্কার, করিডোর ঝাড়ু দেওয়া ও মোছা, ২টি ওয়াশরুম জোন ক্লিনিং, ৩টি রুম বারান্দাসহ ঝাড়ু দেওয়া ও মোছা, ১টি রুমের সকল ফ্যান ও জানালা পরিষ্কার, বারান্দাসহ ফ্লোর ঝাড়ু দেওয়া ও মোছা।',
  maintenanceRuleBn:
    'রক্ষণাবেক্ষণ ও উন্নয়ন কাজের নিয়মাবলি: হলে কোনো মেরামত বা উন্নয়ন কাজের জন্য বহিরাগত কর্মী প্রবেশ করলে নিরাপত্তাকর্মী তাঁদের নির্ধারিত স্থানে নিয়ে যাবেন। এরপর সংশ্লিষ্ট তলার পরিচ্ছন্নতাকর্মী কাজ শেষ হওয়া পর্যন্ত উপস্থিত থেকে তদারকি করবেন এবং কাজ শেষে স্থানটি পরিষ্কার করবেন।',
  emergencyBackupRuleBn:
    'আকস্মিক ছুটি বা অনুপস্থিতির বিকল্প ব্যবস্থা: কোনো তলার নির্ধারিত কর্মী হঠাৎ অসুস্থ বা অনুপস্থিত থাকলে সহায়ক দলের কর্মী (সরিয়া বেগম / মোসাঃ তাসলিমা খাতুন / নবনিযুক্ত কর্মী) তাৎক্ষণিকভাবে ওই তলার প্রাত্যহিক পরিচ্ছন্নতা ও কক্ষ পরিষ্কারের দায়িত্ব পালন করবেন। কোনো অবস্থাতেই কোনো তলার কাজ অসমাপ্ত থাকবে না।',
  rosterStartDate: '2026-11-14',
  rosterEndDate: '2026-12-13'
};

export const DOOR_CARD_INSTRUCTION_BN = DEFAULT_OFFICIAL_NOTICES.doorCardInstructionBn;
export const WORKER_MONTHLY_HEADER_BN = DEFAULT_OFFICIAL_NOTICES.workerMonthlyHeaderBn;
export const MAINTENANCE_SUPERVISION_RULE_BN = DEFAULT_OFFICIAL_NOTICES.maintenanceRuleBn;

export const INITIAL_STAFF_LIST: StaffMember[] = [
  {
    sl: 1,
    name: 'Ms. Jarna Akter',
    nameBn: 'মোসাঃ ঝর্ণা আক্তার',
    employeeId: '760000270',
    assignedRole: 'Floor 2',
    assignedRoleBn: '২য় তলা (কক্ষ ২০১–২২৯)',
    floorKey: '2',
    weeklyOff: 'Saturday',
    weeklyOffBn: 'শনিবার',
    designatedSubstitute: 'Mst. Mim',
    designatedSubstituteBn: 'মোসাঃ মিম (রিলিভার-১)',
    substituteId: '760000199',
    dutyCategory: 'Residential Floor Cleaner',
    dutyCategoryBn: 'ফ্লোর পরিচ্ছন্নতাকর্মী',
    auxiliaryResponsibilityBn: '২য় তলার পানির ফিল্টারের বাহ্যিক অংশ পরিষ্কার'
  },
  {
    sl: 2,
    name: 'Ms. Mst. Sufia Begum',
    nameBn: 'মোসাঃ সুফিয়া বেগম',
    employeeId: '760000267',
    assignedRole: 'Floor 3',
    assignedRoleBn: '৩য় তলা (কক্ষ ৩০১–৩২৯)',
    floorKey: '3',
    weeklyOff: 'Saturday',
    weeklyOffBn: 'শনিবার',
    designatedSubstitute: 'Ms. Nasima Begum',
    designatedSubstituteBn: 'মোসাঃ নাসিমা বেগম (রিলিভার-২)',
    substituteId: '760000264',
    dutyCategory: 'Residential Floor Cleaner',
    dutyCategoryBn: 'ফ্লোর পরিচ্ছন্নতাকর্মী',
    auxiliaryResponsibilityBn: '৩য় তলার পানির ফিল্টারের বাহ্যিক অংশ পরিষ্কার'
  },
  {
    sl: 3,
    name: 'Alema Khatun',
    nameBn: 'আলেমা খাতুন',
    employeeId: '760000169',
    assignedRole: 'Floor 4',
    assignedRoleBn: '৪র্থ তলা (কক্ষ ৪০১–৪২৯)',
    floorKey: '4',
    weeklyOff: 'Saturday',
    weeklyOffBn: 'শনিবার',
    designatedSubstitute: 'Shrifa Akter',
    designatedSubstituteBn: 'শরিফা আক্তার (রিলিভার-৩)',
    substituteId: '760000364',
    dutyCategory: 'Residential Floor Cleaner',
    dutyCategoryBn: 'ফ্লোর পরিচ্ছন্নতাকর্মী',
    auxiliaryResponsibilityBn: '৪র্থ তলার পানির ফিল্টারের বাহ্যিক অংশ পরিষ্কার'
  },
  {
    sl: 4,
    name: 'Moyna Khatun',
    nameBn: 'ময়না খাতুন',
    employeeId: '760000179',
    assignedRole: 'Floor 5',
    assignedRoleBn: '৫ম তলা (কক্ষ ৫০১–৫২৯)',
    floorKey: '5',
    weeklyOff: 'Sunday',
    weeklyOffBn: 'রবিবার',
    designatedSubstitute: 'Mst. Mim',
    designatedSubstituteBn: 'মোসাঃ মিম (রিলিভার-১)',
    substituteId: '760000199',
    dutyCategory: 'Residential Floor Cleaner',
    dutyCategoryBn: 'ফ্লোর পরিচ্ছন্নতাকর্মী',
    auxiliaryResponsibilityBn: '৫ম তলার পানির ফিল্টারের বাহ্যিক অংশ পরিষ্কার'
  },
  {
    sl: 5,
    name: 'Monjuara Begum',
    nameBn: 'মঞ্জুয়ারা বেগম',
    employeeId: '760000344',
    assignedRole: 'Floor 6',
    assignedRoleBn: '৬ষ্ঠ তলা (কক্ষ ৬০১–৬২৯)',
    floorKey: '6',
    weeklyOff: 'Sunday',
    weeklyOffBn: 'রবিবার',
    designatedSubstitute: 'Ms. Nasima Begum',
    designatedSubstituteBn: 'মোসাঃ নাসিমা বেগম (রিলিভার-২)',
    substituteId: '760000264',
    dutyCategory: 'Residential Floor Cleaner',
    dutyCategoryBn: 'ফ্লোর পরিচ্ছন্নতাকর্মী',
    auxiliaryResponsibilityBn: '৬ষ্ঠ তলার পানির ফিল্টারের বাহ্যিক অংশ পরিষ্কার'
  },
  {
    sl: 6,
    name: 'Aymala Khatun',
    nameBn: 'আয়মালা খাতুন',
    employeeId: '760000171',
    assignedRole: 'Floor 7',
    assignedRoleBn: '৭ম তলা (কক্ষ ৭০১–৭২৯)',
    floorKey: '7',
    weeklyOff: 'Sunday',
    weeklyOffBn: 'রবিবার',
    designatedSubstitute: 'Shrifa Akter',
    designatedSubstituteBn: 'শরিফা আক্তার (রিলিভার-৩)',
    substituteId: '760000364',
    dutyCategory: 'Residential Floor Cleaner',
    dutyCategoryBn: 'ফ্লোর পরিচ্ছন্নতাকর্মী',
    auxiliaryResponsibilityBn: '৭ম তলার পানির ফিল্টারের বাহ্যিক অংশ পরিষ্কার'
  },
  {
    sl: 7,
    name: 'Sajuna Akter',
    nameBn: 'সাজুনা আক্তার',
    employeeId: '760000178',
    assignedRole: 'Floor 8',
    assignedRoleBn: '৮ম তলা (কক্ষ ৮০১–৮২৯)',
    floorKey: '8',
    weeklyOff: 'Monday',
    weeklyOffBn: 'সোমবার',
    designatedSubstitute: 'Mst. Mim',
    designatedSubstituteBn: 'মোসাঃ মিম (রিলিভার-১)',
    substituteId: '760000199',
    dutyCategory: 'Residential Floor Cleaner',
    dutyCategoryBn: 'ফ্লোর পরিচ্ছন্নতাকর্মী',
    auxiliaryResponsibilityBn: '৮ম তলার পানির ফিল্টারের বাহ্যিক অংশ পরিষ্কার'
  },
  {
    sl: 8,
    name: 'Mst. Mariom Khatun',
    nameBn: 'মোসাঃ মরিয়ম খাতুন',
    employeeId: '760000414',
    assignedRole: 'Floor 9',
    assignedRoleBn: '৯ম তলা (কক্ষ ৯০১–৯২৯)',
    floorKey: '9',
    weeklyOff: 'Monday',
    weeklyOffBn: 'সোমবার',
    designatedSubstitute: 'Ms. Nasima Begum',
    designatedSubstituteBn: 'মোসাঃ নাসিমা বেগম (রিলিভার-২)',
    substituteId: '760000264',
    dutyCategory: 'Residential Floor Cleaner',
    dutyCategoryBn: 'ফ্লোর পরিচ্ছন্নতাকর্মী',
    auxiliaryResponsibilityBn: '৯ম তলার পানির ফিল্টারের বাহ্যিক অংশ পরিষ্কার'
  },
  {
    sl: 9,
    name: 'Asa Khatun Khokela',
    nameBn: 'আশা খাতুন খোকেলা',
    employeeId: '760000323',
    assignedRole: 'Floor 10',
    assignedRoleBn: '১০ম তলা (কক্ষ ১০০১–১০২৯)',
    floorKey: '10',
    weeklyOff: 'Monday',
    weeklyOffBn: 'সোমবার',
    designatedSubstitute: 'Shrifa Akter',
    designatedSubstituteBn: 'শরিফা আক্তার (রিলিভার-৩)',
    substituteId: '760000364',
    dutyCategory: 'Residential Floor Cleaner',
    dutyCategoryBn: 'ফ্লোর পরিচ্ছন্নতাকর্মী',
    auxiliaryResponsibilityBn: '১০ম তলার পানির ফিল্টারের বাহ্যিক অংশ পরিষ্কার'
  },
  {
    sl: 10,
    name: 'Sabina Yasmin',
    nameBn: 'সাবিনা ইয়াসমিন',
    employeeId: '760000362',
    assignedRole: 'Floor 11',
    assignedRoleBn: '১১তম তলা (কক্ষ ১১০১–১১২৯)',
    floorKey: '11',
    weeklyOff: 'Tuesday',
    weeklyOffBn: 'মঙ্গলবার',
    designatedSubstitute: 'Mst. Mim',
    designatedSubstituteBn: 'মোসাঃ মিম (রিলিভার-১)',
    substituteId: '760000199',
    dutyCategory: 'Residential Floor Cleaner',
    dutyCategoryBn: 'ফ্লোর পরিচ্ছন্নতাকর্মী',
    auxiliaryResponsibilityBn: '১১তম তলার পানির ফিল্টারের বাহ্যিক অংশ পরিষ্কার'
  },
  {
    sl: 11,
    name: 'Mst. Munniara Khatun',
    nameBn: 'মোসাঃ মুন্নিয়ারা খাতুন',
    employeeId: '760000269',
    assignedRole: 'Floor 12',
    assignedRoleBn: '১২তম তলা (কক্ষ ১২০১–১২২৯)',
    floorKey: '12',
    weeklyOff: 'Tuesday',
    weeklyOffBn: 'মঙ্গলবার',
    designatedSubstitute: 'Ms. Nasima Begum',
    designatedSubstituteBn: 'মোসাঃ নাসিমা বেগম (রিলিভার-২)',
    substituteId: '760000264',
    dutyCategory: 'Residential Floor Cleaner',
    dutyCategoryBn: 'ফ্লোর পরিচ্ছন্নতাকর্মী',
    auxiliaryResponsibilityBn: '১২তম তলার পানির ফিল্টারের বাহ্যিক অংশ পরিষ্কার'
  },
  {
    sl: 12,
    name: 'Ms. Mst. Aduri Khatun',
    nameBn: 'মোসাঃ আদুরী খাতুন',
    employeeId: '760000266',
    assignedRole: 'Floor 13',
    assignedRoleBn: '১৩তম তলা (কক্ষ ১৩০১–১৩২৯)',
    floorKey: '13',
    weeklyOff: 'Tuesday',
    weeklyOffBn: 'মঙ্গলবার',
    designatedSubstitute: 'Shrifa Akter',
    designatedSubstituteBn: 'শরিফা আক্তার (রিলিভার-৩)',
    substituteId: '760000364',
    dutyCategory: 'Residential Floor Cleaner',
    dutyCategoryBn: 'ফ্লোর পরিচ্ছন্নতাকর্মী',
    auxiliaryResponsibilityBn: '১৩তম তলার পানির ফিল্টারের বাহ্যিক অংশ পরিষ্কার'
  },
  {
    sl: 13,
    name: 'Ms. Mst. Mabia Khatun',
    nameBn: 'মোসাঃ মাবিয়া খাতুন',
    employeeId: '760000241',
    assignedRole: 'Floor 14',
    assignedRoleBn: '১৪তম তলা (কক্ষ ১৪০১–১৪২৯)',
    floorKey: '14',
    weeklyOff: 'Wednesday',
    weeklyOffBn: 'বুধবার',
    designatedSubstitute: 'Mst. Mim',
    designatedSubstituteBn: 'মোসাঃ মিম (রিলিভার-১)',
    substituteId: '760000199',
    dutyCategory: 'Residential Floor Cleaner',
    dutyCategoryBn: 'ফ্লোর পরিচ্ছন্নতাকর্মী',
    auxiliaryResponsibilityBn: '১৪তম তলার পানির ফিল্টারের বাহ্যিক অংশ পরিষ্কার'
  },
  {
    sl: 14,
    name: 'Fatema Akter',
    nameBn: 'ফাতেমা আক্তার',
    employeeId: '760000187',
    assignedRole: 'Floor 15',
    assignedRoleBn: '১৫তম তলা (কক্ষ ১৫০১–১৫২৯)',
    floorKey: '15',
    weeklyOff: 'Wednesday',
    weeklyOffBn: 'বুধবার',
    designatedSubstitute: 'Ms. Nasima Begum',
    designatedSubstituteBn: 'মোসাঃ নাসিমা বেগম (রিলিভার-২)',
    substituteId: '760000264',
    dutyCategory: 'Residential Floor Cleaner',
    dutyCategoryBn: 'ফ্লোর পরিচ্ছন্নতাকর্মী',
    auxiliaryResponsibilityBn: '১৫তম তলার পানির ফিল্টারের বাহ্যিক অংশ পরিষ্কার'
  },
  {
    sl: 15,
    name: 'Ms. Mst. Hana Akther',
    nameBn: 'মোসাঃ হানা আক্তার',
    employeeId: '760000219',
    assignedRole: 'Floor 1',
    assignedRoleBn: '১ম তলা (১৪টি কক্ষ ১০১–১১৪ ও ৪টি অফিস)',
    floorKey: '1',
    weeklyOff: 'Wednesday',
    weeklyOffBn: 'বুধবার',
    designatedSubstitute: 'Shrifa Akter',
    designatedSubstituteBn: 'শরিফা আক্তার (রিলিভার-৩)',
    substituteId: '760000364',
    dutyCategory: 'Residential & Office Floor Cleaner',
    dutyCategoryBn: '১ম তলা ও অফিস পরিচ্ছন্নতাকর্মী',
    auxiliaryResponsibilityBn: '৪টি প্রশাসনিক অফিস কক্ষ প্রাত্যহিক পরিষ্কার, অভ্যর্থনা কক্ষ, প্রধান সিঁড়ি ল্যান্ডিং ও পানির ফিল্টার'
  },
  {
    sl: 16,
    name: 'Mst. Fatema Khatun',
    nameBn: 'মোসাঃ ফাতেমা খাতুন',
    employeeId: '760000361',
    assignedRole: 'Ground Floor',
    assignedRoleBn: 'গ্রাউন্ড ফ্লোর (কমন স্পেস, স্টাডি, নামাজ ও টিভি রুম)',
    floorKey: 'G',
    weeklyOff: 'Thursday',
    weeklyOffBn: 'বৃহস্পতিবার',
    designatedSubstitute: 'Mst. Mim',
    designatedSubstituteBn: 'মোসাঃ মিম (রিলিভার-১)',
    substituteId: '760000199',
    dutyCategory: 'Ground Floor & Common Area',
    dutyCategoryBn: 'গ্রাউন্ড ফ্লোর পরিচ্ছন্নতাকর্মী',
    auxiliaryResponsibilityBn: 'কমন স্পেস, স্টাডি রুম, নামাজের রুম, টিভি রুম ও মূল প্রবেশপথ লবি; রবিবার ও বুধবার সকাল ০৯:৩০–১১:১০ কমন ডাস্টবিন এলাকা (সামনের ও পেছনের কর্মীর সাথে)'
  },
  {
    sl: 17,
    name: 'Eyasmin Begum',
    nameBn: 'ইয়াসমিন বেগম',
    employeeId: '760000084',
    assignedRole: 'Exterior Front Zone',
    assignedRoleBn: 'হলের বাইরের সামনের অংশ (Front Zone)',
    floorKey: 'EXT_FRONT',
    weeklyOff: 'Thursday',
    weeklyOffBn: 'বৃহস্পতিবার',
    designatedSubstitute: 'Ms. Nasima Begum',
    designatedSubstituteBn: 'মোসাঃ নাসিমা বেগম (রিলিভার-২)',
    substituteId: '760000264',
    dutyCategory: 'Exterior & Landscape Specialist',
    dutyCategoryBn: 'বহির্ভাগ পরিচ্ছন্নতাকর্মী (সামনের অংশ)',
    auxiliaryResponsibilityBn: 'হলের সামনের প্রাঙ্গণ, বাগান ও চলাচলের পথ; রবিবার ও বুধবার সকাল ০৯:৩০–১১:১০ কমন ডাস্টবিন এলাকা (পেছনের ও গ্রাউন্ড ফ্লোরের কর্মীর সাথে)'
  },
  {
    sl: 18,
    name: 'Rulia Khatun',
    nameBn: 'রুলিয়া খাতুন',
    employeeId: '760000177',
    assignedRole: 'Exterior Back Zone',
    assignedRoleBn: 'হলের বাইরের পেছনের অংশ (Back Zone)',
    floorKey: 'EXT_BACK',
    weeklyOff: 'Thursday',
    weeklyOffBn: 'বৃহস্পতিবার',
    designatedSubstitute: 'Shrifa Akter',
    designatedSubstituteBn: 'শরিফা আক্তার (রিলিভার-৩)',
    substituteId: '760000364',
    dutyCategory: 'Exterior & Drainage Specialist',
    dutyCategoryBn: 'বহির্ভাগ পরিচ্ছন্নতাকর্মী (পেছনের অংশ)',
    auxiliaryResponsibilityBn: 'হলের পেছনের প্রাঙ্গণ ও ড্রেন; রবিবার ও বুধবার সকাল ০৯:৩০–১১:১০ কমন ডাস্টবিন এলাকা (সামনের ও গ্রাউন্ড ফ্লোরের কর্মীর সাথে)'
  },
  {
    sl: 19,
    name: 'Mst. Mim',
    nameBn: 'মোসাঃ মিম',
    employeeId: '760000199',
    assignedRole: 'Reliever 1 (Covers Sat-Thu)',
    assignedRoleBn: 'রিলিভার-১ (শনি: ২য়, রবি: ৫ম, সোম: ৮ম, মঙ্গল: ১১তম, বুধ: ১৪তম, বৃহঃ: গ্রাউন্ড ফ্লোর)',
    floorKey: 'REL_1',
    weeklyOff: 'Friday',
    weeklyOffBn: 'শুক্রবার',
    designatedSubstitute: 'Regular Floor Staff',
    designatedSubstituteBn: 'শুক্রবার সকল তলার নিয়মিত কর্মী কর্মরত থাকেন',
    substituteId: 'ALL_REGULAR',
    dutyCategory: 'Reliever Pool',
    dutyCategoryBn: 'রিলিভার কর্মী (বদলি দায়িত্ব)',
    auxiliaryResponsibilityBn: 'সপ্তাহে ৬ দিন ছুটিতে থাকা ৬ জন তলার কর্মীর পূর্ণাঙ্গ প্রাত্যহিক দায়িত্ব পালন (২য়, ৫ম, ৮ম, ১১তম, ১৪তম ও গ্রাউন্ড ফ্লোর)'
  },
  {
    sl: 20,
    name: 'Ms. Nasima Begum',
    nameBn: 'মোসাঃ নাসিমা বেগম',
    employeeId: '760000264',
    assignedRole: 'Reliever 2 (Covers Sat-Thu)',
    assignedRoleBn: 'রিলিভার-২ (শনি: ৩য়, রবি: ৬ষ্ঠ, সোম: ৯ম, মঙ্গল: ১২তম, বুধ: ১৫তম, বৃহঃ: সামনের অংশ)',
    floorKey: 'REL_2',
    weeklyOff: 'Friday',
    weeklyOffBn: 'শুক্রবার',
    designatedSubstitute: 'Regular Floor Staff',
    designatedSubstituteBn: 'শুক্রবার সকল তলার নিয়মিত কর্মী কর্মরত থাকেন',
    substituteId: 'ALL_REGULAR',
    dutyCategory: 'Reliever Pool',
    dutyCategoryBn: 'রিলিভার কর্মী (বদলি দায়িত্ব)',
    auxiliaryResponsibilityBn: 'সপ্তাহে ৬ দিন ছুটিতে থাকা ৬ জন কর্মীর পূর্ণাঙ্গ প্রাত্যহিক দায়িত্ব পালন (৩য়, ৬ষ্ঠ, ৯ম, ১২তম, ১৫তম তলা ও সামনের অংশ)'
  },
  {
    sl: 21,
    name: 'Shrifa Akter',
    nameBn: 'শরিফা আক্তার',
    employeeId: '760000364',
    assignedRole: 'Reliever 3 (Covers Sat-Thu)',
    assignedRoleBn: 'রিলিভার-৩ (শনি: ৪র্থ, রবি: ৭ম, সোম: ১০ম, মঙ্গল: ১৩তম, বুধ: ১ম তলা, বৃহঃ: পেছনের অংশ)',
    floorKey: 'REL_3',
    weeklyOff: 'Friday',
    weeklyOffBn: 'শুক্রবার',
    designatedSubstitute: 'Regular Floor Staff',
    designatedSubstituteBn: 'শুক্রবার সকল তলার নিয়মিত কর্মী কর্মরত থাকেন',
    substituteId: 'ALL_REGULAR',
    dutyCategory: 'Reliever Pool',
    dutyCategoryBn: 'রিলিভার কর্মী (বদলি দায়িত্ব)',
    auxiliaryResponsibilityBn: 'সপ্তাহে ৬ দিন ছুটিতে থাকা ৬ জন কর্মীর পূর্ণাঙ্গ প্রাত্যহিক দায়িত্ব পালন (৪র্থ, ৭ম, ১০ম, ১৩তম, ১ম তলা ও পেছনের অংশ)'
  },
  {
    sl: 22,
    name: 'Soriya Begum',
    nameBn: 'সরিয়া বেগম',
    employeeId: '760000168',
    assignedRole: 'Deep Clean Squad 1',
    assignedRoleBn: 'সহায়ক ও বিশেষ পরিচ্ছন্নতাকর্মী-১ (গ্রাউন্ড–৫ম তলার সিঁড়ি, পানির ফিল্টার ও ছাদ)',
    floorKey: 'SQUAD_1',
    weeklyOff: 'Friday',
    weeklyOffBn: 'শুক্রবার',
    designatedSubstitute: 'Weekly Schedule',
    designatedSubstituteBn: 'শুক্রবার সাপ্তাহিক ছুটি (তলার নিয়মিত কাজ চালু থাকে)',
    substituteId: 'SQUAD_ROTATION',
    dutyCategory: 'Deep Clean Squad',
    dutyCategoryBn: 'সহায়ক ও বিশেষ পরিচ্ছন্নতাকর্মী',
    auxiliaryResponsibilityBn: 'গ্রাউন্ড–৫ম তলার ২টি সচল সিঁড়ি (দিনে ২ বার), প্রতিদিন ১টি তলার ওয়াশরুমের জানালা ও এক্সজস্ট ফ্যান, পানির ফিল্টার, বৃহস্পতিবার ছাদ-১, মাসে ১ দিন ক্যান্টিন'
  },
  {
    sl: 23,
    name: 'Ms. Taslima Khatun',
    nameBn: 'মোসাঃ তাসলিমা খাতুন',
    employeeId: '760000265',
    assignedRole: 'Deep Clean Squad 2',
    assignedRoleBn: 'সহায়ক ও বিশেষ পরিচ্ছন্নতাকর্মী-২ (৬ষ্ঠ–১০ম তলার সিঁড়ি, ডাস্টবিন ও ছাদ)',
    floorKey: 'SQUAD_2',
    weeklyOff: 'Friday',
    weeklyOffBn: 'শুক্রবার',
    designatedSubstitute: 'Weekly Schedule',
    designatedSubstituteBn: 'শুক্রবার সাপ্তাহিক ছুটি (তলার নিয়মিত কাজ চালু থাকে)',
    substituteId: 'SQUAD_ROTATION',
    dutyCategory: 'Deep Clean Squad',
    dutyCategoryBn: 'সহায়ক ও বিশেষ পরিচ্ছন্নতাকর্মী',
    auxiliaryResponsibilityBn: '৬ষ্ঠ–১০ম তলার ২টি সচল সিঁড়ি (দিনে ২ বার), প্রতিদিন ১টি তলার ওয়াশরুমের জানালা ও এক্সজস্ট ফ্যান, পানির ফিল্টার, বৃহস্পতিবার ছাদ-২, মাসে ১ দিন ক্যান্টিন'
  },
  {
    sl: 24,
    name: 'New Cleaner',
    nameBn: 'New Cleaner (নবনিযুক্ত কর্মী)',
    employeeId: 'Pending Recruitment',
    assignedRole: 'Deep Clean Squad 3',
    assignedRoleBn: 'সহায়ক ও বিশেষ পরিচ্ছন্নতাকর্মী-৩ (১১তম–১৫তম তলার সিঁড়ি, জরুরি বদলি ও ছাদ)',
    floorKey: 'SQUAD_3',
    weeklyOff: 'Friday',
    weeklyOffBn: 'শুক্রবার',
    designatedSubstitute: 'Weekly Schedule',
    designatedSubstituteBn: 'শুক্রবার সাপ্তাহিক ছুটি (তলার নিয়মিত কাজ চালু থাকে)',
    substituteId: 'SQUAD_ROTATION',
    dutyCategory: 'Deep Clean Squad',
    dutyCategoryBn: 'সহায়ক ও বিশেষ পরিচ্ছন্নতাকর্মী',
    auxiliaryResponsibilityBn: '১১তম–১৫তম তলার ২টি সচল সিঁড়ি (দিনে ২ বার), প্রতিদিন ১টি তলার ওয়াশরুমের জানালা ও এক্সজস্ট ফ্যান, পানির ফিল্টার, বৃহস্পতিবার ছাদ-৩ ও ৪, মাসে ১ দিন ক্যান্টিন'
  }
];

export const STANDARD_FLOOR_DAILY_ROUTINE: DailyTimeSlot[] = [
  {
    id: 'slot-1',
    timeRange: '07:30 - 09:00',
    timeRangeBn: 'সকাল ০৭:৩০ – ০৯:০০',
    durationBn: '১ ঘণ্টা ৩০ মিনিট',
    iconKey: 'broom',
    titleBn: 'টাস্ক ১: ময়লার ঝুড়ি ও বালতি পরিষ্কার, করিডোর ঝাড়ু দেওয়া ও মোছা',
    detailsBn:
      'নির্ধারিত তলার সকল ময়লার ঝুড়ি ও বালতি খালি করে পরিষ্কার করা, সম্পূর্ণ করিডোর ও লিফট লবি ঝাড়ু দেওয়া ও জীবাণুনাশক দিয়ে মোছা এবং পানির ফিল্টারের বাইরের অংশ মুছে পরিষ্কার রাখা।',
    category: 'task1'
  },
  {
    id: 'slot-2',
    timeRange: '09:00 - 09:30',
    timeRangeBn: 'সকাল ০৯:০০ – ০৯:৩০',
    durationBn: '৩০ মিনিট',
    iconKey: 'coffee',
    titleBn: 'সকালের নাস্তার বিরতি',
    detailsBn: 'সকালের নাস্তার নির্ধারিত বিরতি।',
    category: 'break'
  },
  {
    id: 'slot-3',
    timeRange: '09:30 - 11:30',
    timeRangeBn: 'সকাল ০৯:৩০ – ১১:৩০',
    durationBn: '২ ঘণ্টা',
    iconKey: 'sparkles',
    titleBn: 'টাস্ক ২: ২টি ওয়াশরুম জোন প্রোপার ক্লিনিং (হারপিক ও ক্লিনিং ম্যাটেরিয়াল দিয়ে)',
    detailsBn:
      'তলার ২টি ওয়াশরুম জোনের সকল টয়লেট, বাথরুম, অজুখানা, বেসিন, আয়না ও মেঝে হারপিক ও অনুমোদিত পরিচ্ছন্নতা সামগ্রী দিয়ে ভালোভাবে পরিষ্কার করা। (বিশেষ দ্রষ্টব্য: ওয়াশরুম পরিষ্কারের আগে কোনো ওয়াশরুম চেক রাখা হয়নি)।',
    category: 'task2'
  },
  {
    id: 'slot-4',
    timeRange: '11:30 - 11:50',
    timeRangeBn: 'সকাল ১১:৩০ – ১১:৫০',
    durationBn: '২০ মিনিট',
    iconKey: 'door',
    titleBn: '১ম কক্ষ পরিষ্কার (বারান্দাসহ ঝাড়ু দেওয়া ও মোছা)',
    detailsBn:
      'মাসিক সূচি অনুযায়ী নির্ধারিত ১ম কক্ষটি বারান্দাসহ ঝাড়ু দেওয়া ও মোছা (সর্বোচ্চ ২০ মিনিট)। কক্ষে আবাসিক ছাত্রী বা হল কর্তৃপক্ষের প্রতিনিধি উপস্থিত থাকা সাপেক্ষে।',
    category: 'rooms'
  },
  {
    id: 'slot-5',
    timeRange: '11:50 - 12:00',
    timeRangeBn: 'সকাল ১১:৫০ – ১২:০০',
    durationBn: '১০ মিনিট (মধ্যবর্তী সময়-১)',
    iconKey: 'check',
    titleBn: 'ওয়াশরুম জোন পর্যবেক্ষণ (১ম বার), জুতার র‍্যাক পরিষ্কার বা জরুরি কাজ',
    detailsBn:
      'বাড়তি ৩০ মিনিটের ১ম ১০ মিনিট: ২টি ওয়াশরুম জোন ঘুরে দেখা (অপরিষ্কার থাকলে পরিষ্কার করা), নির্ধারিত জুতার র‍্যাকের বাইরের অংশ মোছা (৫–১০ মিনিট) অথবা তাৎক্ষণিক জরুরি কাজ।',
    category: 'washroom_check'
  },
  {
    id: 'slot-6',
    timeRange: '12:00 - 12:20',
    timeRangeBn: 'দুপুর ১২:০০ – ১২:২০',
    durationBn: '২০ মিনিট',
    iconKey: 'door',
    titleBn: '২য় কক্ষ পরিষ্কার (বারান্দাসহ ঝাড়ু দেওয়া ও মোছা)',
    detailsBn:
      'মাসিক সূচি অনুযায়ী নির্ধারিত ২য় কক্ষটি বারান্দাসহ ঝাড়ু দেওয়া ও মোছা (সর্বোচ্চ ২০ মিনিট)।',
    category: 'rooms'
  },
  {
    id: 'slot-7',
    timeRange: '12:20 - 12:30',
    timeRangeBn: 'দুপুর ১২:২০ – ১২:৩০',
    durationBn: '১০ মিনিট (মধ্যবর্তী সময়-২)',
    iconKey: 'check',
    titleBn: 'ওয়াশরুম জোন পর্যবেক্ষণ (২য় বার), জুতার র‍্যাক পরিষ্কার বা জরুরি কাজ',
    detailsBn:
      'বাড়তি ৩০ মিনিটের ২য় ১০ মিনিট: ওয়াশরুম জোন পুনরায় দেখা, নির্ধারিত জুতার র‍্যাকের বাইরের অংশ পরিষ্কার করা অথবা জরুরি কাজ সম্পন্ন করা।',
    category: 'washroom_check'
  },
  {
    id: 'slot-8',
    timeRange: '12:30 - 12:50',
    timeRangeBn: 'দুপুর ১২:৩০ – ১২:৫০',
    durationBn: '২০ মিনিট',
    iconKey: 'door',
    titleBn: '৩য় কক্ষ পরিষ্কার (বারান্দাসহ ঝাড়ু দেওয়া ও মোছা)',
    detailsBn:
      'মাসিক সূচি অনুযায়ী নির্ধারিত ৩য় কক্ষটি বারান্দাসহ ঝাড়ু দেওয়া ও মোছা (সর্বোচ্চ ২০ মিনিট)।',
    category: 'rooms'
  },
  {
    id: 'slot-9',
    timeRange: '12:50 - 01:00',
    timeRangeBn: 'দুপুর ১২:৫০ – ০১:০০',
    durationBn: '১০ মিনিট (মধ্যবর্তী সময়-৩)',
    iconKey: 'check',
    titleBn: 'দুপুরের বিরতির পূর্বে ওয়াশরুম জোন পর্যবেক্ষণ (৩য় বার) ও জরুরি কাজ',
    detailsBn:
      'বাড়তি ৩০ মিনিটের ৩য় ১০ মিনিট: দুপুরের বিরতিতে যাওয়ার পূর্বে ২টি ওয়াশরুম জোন দেখা (প্রয়োজনে পরিষ্কার করা) এবং রক্ষণাবেক্ষণ কাজ চলমান থাকলে তদারকি করা।',
    category: 'washroom_check'
  },
  {
    id: 'slot-10',
    timeRange: '01:00 - 02:00',
    timeRangeBn: 'দুপুর ০১:০০ – ০২:০০',
    durationBn: '১ ঘণ্টা',
    iconKey: 'utensils',
    titleBn: 'নামাজ ও দুপুরের খাবারের বিরতি',
    detailsBn: 'যোহরের নামাজ আদায় ও দুপুরের খাবারের নির্ধারিত বিরতি।',
    category: 'break'
  },
  {
    id: 'slot-11',
    timeRange: '02:00 - 02:40',
    timeRangeBn: 'দুপুর ০২:০০ – ০২:৪০',
    durationBn: '৪০ মিনিট',
    iconKey: 'droplet',
    titleBn: 'ওয়াশরুম ২য় রাউন্ড: শুধু পানি দিয়ে ধোয়া',
    detailsBn:
      'তলার ২টি ওয়াশরুম জোন (টয়লেট, অজুখানা, বেসিন ও মেঝে) ২য় পর্যায়ে শুধু পানি দিয়ে ধুয়ে ও ওয়াইপার টেনে শুকনো রাখা।',
    category: 'afternoon'
  },
  {
    id: 'slot-12',
    timeRange: '02:40 - 03:10',
    timeRangeBn: 'দুপুর ০২:৪০ – ০৩:১০',
    durationBn: '৩০ মিনিট',
    iconKey: 'broom',
    titleBn: 'করিডোর ২য় রাউন্ড: ঝুড়ি-বালতি খালি করা ও করিডোর ঝাড়ু দেওয়া',
    detailsBn:
      'করিডোরের ময়লার ঝুড়ি ও বালতি পুনরায় খালি করা এবং সম্পূর্ণ করিডোর ২য় বার ঝাড়ু দেওয়া।',
    category: 'afternoon'
  },
  {
    id: 'slot-13',
    timeRange: '03:10 - 04:00',
    timeRangeBn: 'বিকাল ০৩:১০ – ০৪:০০',
    durationBn: '৫০ মিনিট',
    iconKey: 'fan',
    titleBn: 'বিকালে ১টি কক্ষ (★ তারকা চিহ্নিত): সব ফ্যান ও জানালা পরিষ্কার, বারান্দাসহ ঝাড়ু ও মোছা',
    detailsBn:
      'মাসিক সূচিতে তারকা (★) চিহ্নিত ১টি কক্ষের সকল সিলিং ফ্যান ও জানালা পরিষ্কার করা এবং বারান্দাসহ সম্পূর্ণ মেঝে ঝাড়ু দেওয়া ও মোছা।',
    category: 'star_room'
  },
  {
    id: 'slot-14',
    timeRange: '04:00 - 04:30',
    timeRangeBn: 'বিকাল ০৪:০০ – ০৪:৩০',
    durationBn: '৩০ মিনিট',
    iconKey: 'clipboard',
    titleBn: 'দিনের শেষে: ওয়াশরুম জোন পর্যবেক্ষণ, সরঞ্জাম ধুয়ে গুছিয়ে রাখা ও সুপারভাইজারকে রিপোর্ট',
    detailsBn:
      'ছুটির পূর্বে ২টি ওয়াশরুম জোন চূড়ান্ত পর্যবেক্ষণ করা, ঝাড়ু, মপ ও বালতি ধুয়ে নির্ধারিত স্থানে গুছিয়ে রাখা এবং সুপারভাইজারের নিকট প্রতিদিনের কাজের রিপোর্ট প্রদান করা।',
    category: 'closing'
  }
];

export const ROLE_SPECIFIC_DAILY_NOTES: Record<string, { titleBn: string; summaryBn: string; slotsOverrideBn: { timeBn: string; workBn: string }[] }> = {
  G: {
    titleBn: 'গ্রাউন্ড ফ্লোর কর্মীর প্রাত্যহিক কার্যসূচি (অন্যান্য তলার সমান কাজের চাপ)',
    summaryBn:
      'গ্রাউন্ড ফ্লোরে আবাসিক কক্ষের পরিবর্তে ৪টি বড় কমন রুম (কমন স্পেস, স্টাডি রুম, নামাজের রুম ও টিভি রুম), মূল প্রবেশপথ লবি এবং ২টি ওয়াশরুম জোন রয়েছে। অন্যান্য তলার কর্মীদের সাথে কাজের সমতা বজায় রাখতে গ্রাউন্ড ফ্লোরের প্রাত্যহিক রুটিন নিম্নরূপ:',
    slotsOverrideBn: [
      { timeBn: '০৭:৩০–০৯:০০', workBn: 'টাস্ক ১: মূল প্রবেশপথ লবি, অভ্যর্থনা করিডোর, ময়লার ঝুড়ি ও বালতি পরিষ্কার এবং মেঝে ঝাড়ু দেওয়া ও মোছা' },
      { timeBn: '০৯:০০–০৯:৩০', workBn: 'সকালের নাস্তার বিরতি' },
      { timeBn: '০৯:৩০–১১:৩০', workBn: 'টাস্ক ২: গ্রাউন্ড ফ্লোরের ২টি ওয়াশরুম জোন ও অজুখানা হারপিক ও পরিচ্ছন্নতা সামগ্রী দিয়ে পরিপূর্ণভাবে পরিষ্কার করা' },
      { timeBn: '১১:৩০–০১:০০', workBn: 'কমন স্পেস (২০ মি.) + ১০ মি. ওয়াশরুম পর্যবেক্ষণ + স্টাডি রুম (২০ মি.) + ১০ মি. ওয়াশরুম পর্যবেক্ষণ + নামাজের রুম/টিভি রুম (২০ মি.) + ১০ মি. পর্যবেক্ষণ' },
      { timeBn: '০১:০০–০২:০০', workBn: 'নামাজ ও দুপুরের খাবারের বিরতি' },
      { timeBn: '০২:০০–০৩:১০', workBn: 'গ্রাউন্ড ফ্লোরের ২টি ওয়াশরুম জোন শুধু পানি দিয়ে ধোয়া (২য় রাউন্ড) এবং মূল করিডোর পুনরায় ঝাড়ু দেওয়া ও ঝুড়ি খালি করা' },
      { timeBn: '০৩:১০–০৪:০০', workBn: '★ তারকা চিহ্নিত ১টি হলরুমের (কমন স্পেস / স্টাডি রুম / নামাজের রুম / টিভি রুম) সকল ফ্যান ও জানালা পরিষ্কার এবং মেঝে ঝাড়ু দেওয়া ও মোছা' },
      { timeBn: '০৪:০০–০৪:৩০', workBn: 'ওয়াশরুম জোন চূড়ান্ত পর্যবেক্ষণ এবং পরিচ্ছন্নতা সরঞ্জাম ধুয়ে গুছিয়ে রেখে সুপারভাইজারকে রিপোর্ট করা' }
    ]
  },
  '1': {
    titleBn: '১ম তলার কর্মীর প্রাত্যহিক কার্যসূচি (১৪টি আবাসিক কক্ষ ও ৪টি অফিস কক্ষ)',
    summaryBn:
      '১ম তলায় ১৪টি আবাসিক কক্ষ (১০১–১১৪) এবং ৪টি প্রশাসনিক অফিস রয়েছে। নিয়ম অনুযায়ী ১ম তলার আবাসিক কক্ষগুলো অন্য তলার (২৯ কক্ষের) চেয়ে বেশিবার পরিষ্কার করা যাবে না। তাই প্রতিদিন ২টি আবাসিক কক্ষ পরিষ্কার করা হবে এবং বাকি সময়ে ৪টি অফিস কক্ষ, অভ্যর্থনা লবি ও প্রধান সিঁড়ি ল্যান্ডিং পরিষ্কার করা হবে:',
    slotsOverrideBn: [
      { timeBn: '০৭:৩০–০৯:০০', workBn: 'টাস্ক ১: ১ম তলার করিডোর, ময়লার ঝুড়ি ও বালতি পরিষ্কার, ঝাড়ু দেওয়া ও মোছা এবং ৪টি অফিসের সামনের লবি পরিষ্কার' },
      { timeBn: '০৯:০০–০৯:৩০', workBn: 'সকালের নাস্তার বিরতি' },
      { timeBn: '০৯:৩০–১১:৩০', workBn: 'টাস্ক ২: ১ম তলার ২টি ওয়াশরুম জোন হারপিক ও পরিচ্ছন্নতা সামগ্রী দিয়ে পরিপূর্ণভাবে পরিষ্কার করা' },
      { timeBn: '১১:৩০–১১:৫০', workBn: 'নির্ধারিত ১টি আবাসিক কক্ষ (১০১–১১৪ হতে পর্যায়ক্রমে) বারান্দাসহ ঝাড়ু দেওয়া ও মোছা' },
      { timeBn: '১১:৫০–১২:০০', workBn: 'ওয়াশরুম জোন পর্যবেক্ষণ (১ম বার) এবং জুতার র‍্যাকের বাইরের অংশ পরিষ্কার করা' },
      { timeBn: '১২:০০–১২:২০', workBn: 'অফিস-১০১ ও অফিস-১০২ (প্রভোস্ট ও হাউজ টিউটর অফিস) ঝাড়ু দেওয়া, মোছা ও আসবাবপত্র পরিষ্কার করা' },
      { timeBn: '১২:২০–১২:৩০', workBn: 'ওয়াশরুম জোন পর্যবেক্ষণ (২য় বার) এবং তাৎক্ষণিক জরুরি কাজ' },
      { timeBn: '১২:৩০–১২:৫০', workBn: 'অফিস-১০৩ ও অফিস-১০৪ (প্রশাসনিক ও হিসাব অফিস) ঝাড়ু দেওয়া, মোছা ও কাঁচের দরজা পরিষ্কার করা' },
      { timeBn: '১২:৫০–০১:০০', workBn: 'ওয়াশরুম জোন পর্যবেক্ষণ (৩য় বার) এবং রক্ষণাবেক্ষণ কাজ তদারকি' },
      { timeBn: '০১:০০–০২:০০', workBn: 'নামাজ ও দুপুরের খাবারের বিরতি' },
      { timeBn: '০২:০০–০৩:১০', workBn: 'ওয়াশরুম ২য় রাউন্ড (পানি দিয়ে ধোয়া) এবং করিডোর ২য় রাউন্ড (ঝুড়ি খালি করা ও ঝাড়ু দেওয়া)' },
      { timeBn: '০৩:১০–০৪:০০', workBn: '★ তারকা চিহ্নিত ১টি আবাসিক কক্ষের সকল ফ্যান ও জানালা পরিষ্কার এবং বারান্দাসহ মেঝে ঝাড়ু দেওয়া ও মোছা' },
      { timeBn: '০৪:০০–০৪:৩০', workBn: 'ওয়াশরুম জোন চূড়ান্ত পর্যবেক্ষণ এবং সরঞ্জাম ধুয়ে গুছিয়ে রেখে সুপারভাইজারকে রিপোর্ট করা' }
    ]
  },
  EXT: {
    titleBn: 'হলের বাইরের অংশ (সামনের জোন ও পেছনের জোন) কর্মীদের প্রাত্যহিক কার্যসূচি',
    summaryBn:
      'সামনের জোনে ইয়াসমিন বেগম (ID: 760000084) এবং পেছনের জোনে রুলিয়া খাতুন (ID: 760000177) নিয়মিত দায়িত্ব পালন করবেন। সপ্তাহে ২ দিন (রবিবার ও বুধবার) সকাল ০৯:৩০ হতে ১০:৩০ পর্যন্ত ১ ঘণ্টা ভবনের বাইরের অংশ ও কমন ডাস্টবিন পরিষ্কার করবেন:',
    slotsOverrideBn: [
      { timeBn: '০৭:৩০–০৯:০০', workBn: 'হলের বাইরের নির্ধারিত অংশ (সামনের বাগান ও রাস্তা অথবা পেছনের প্রাঙ্গণ) ঝাড়ু দেওয়া ও আবর্জনা অপসারণ' },
      { timeBn: '০৯:০০–০৯:৩০', workBn: 'সকালের নাস্তার বিরতি' },
      { timeBn: '০৯:৩০–১০:৩০', workBn: 'রবিবার ও বুধবার: ১ ঘণ্টা ভবনের বাইরের অংশ ও কমন ডাস্টবিন ধুয়ে পরিষ্কার করা। অন্যান্য দিন: ড্রেনেজ লাইন ও সীমানা প্রাচীর সংলগ্ন পথ পরিষ্কার' },
      { timeBn: '১০:৩০–১১:৩০', workBn: 'নিরাপত্তা কক্ষ সংলগ্ন ওয়াশরুম, মূল ফটক, পার্কিং ও হাঁটার পথ পানি দিয়ে ধোয়া' },
      { timeBn: '১১:৩০–০১:০০', workBn: 'কমন ডাস্টবিন হতে বর্জ্য অপসারণ, ব্লিচিং পাউডার ছিটানো এবং বাইরের বসার স্থান পরিষ্কার করা' },
      { timeBn: '০১:০০–০২:০০', workBn: 'নামাজ ও দুপুরের খাবারের বিরতি' },
      { timeBn: '০২:০০–০৩:১০', workBn: 'বাইরের নির্ধারিত অংশ ২য় রাউন্ড ঝাড়ু দেওয়া এবং কমন ডাস্টবিন পুনরায় পর্যবেক্ষণ ও পরিষ্কার করা' },
      { timeBn: '০৩:১০–০৪:০০', workBn: '★ বাইরের ল্যাম্পপোস্ট, নামফলক, মূল ফটকের গ্রিল এবং নিরাপত্তা কক্ষের জানালা ও ফ্যান পরিষ্কার করা' },
      { timeBn: '০৪:০০–০৪:৩০', workBn: 'ডাস্টবিনের ঢাকনা বন্ধ নিশ্চিত করা এবং সরঞ্জাম ধুয়ে গুছিয়ে রেখে সুপারভাইজারকে রিপোর্ট করা' }
    ]
  },
  SQUAD: {
    titleBn: 'রিলিভার (৩ জন) ও সহায়ক পরিচ্ছন্নতাকর্মীদের (৩ জন) প্রাত্যহিক কার্যসূচি',
    summaryBn:
      'রিলিভার ৩ জন (মিম, নাসিমা ও শরিফা) শনিবার হতে বৃহস্পতিবার প্রতিদিন ১টি করে ছুটিতে থাকা তলার পূর্ণাঙ্গ দায়িত্ব পালন করেন। সহায়ক দলের ৩ জন কর্মী (সরিয়া, তাসলিমা ও নবনিযুক্ত কর্মী) প্রতিদিন নির্ধারিত সময় অনুযায়ী সিঁড়ি, পানির ফিল্টার, ওয়াশরুমের জানালা ও এক্সজস্ট ফ্যান, ৪টি ছাদ এবং ক্যান্টিন পরিষ্কার করেন:',
    slotsOverrideBn: [
      { timeBn: '০৭:৩০–০৯:০০', workBn: 'নির্ধারিত তলার সকল সিঁড়ি ও রেলিং ঝাড়ু দেওয়া ও মোছা (সরিয়া: গ্রাউন্ড–৫ম তলা, তাসলিমা: ৬ষ্ঠ–১০ম তলা, নবনিযুক্ত কর্মী: ১১তম–১৫তম তলা)' },
      { timeBn: '০৯:০০–০৯:৩০', workBn: 'সকালের নাস্তার বিরতি' },
      { timeBn: '০৯:৩০–১১:৩০', workBn: 'প্রতি তলার ২টি ওয়াশরুম জোনের জানালা ও এক্সজস্ট ফ্যান পরিষ্কার করা (সপ্তাহে ১ বার: শনি G–২য়, রবি ৩য়–৫ম, সোম ৬ষ্ঠ–৮ম, মঙ্গল ৯ম–১১তম, বুধ ১২–১৩তম, বৃহঃ ১৪–১৫তম তলা)। রবি ও বুধবার ০৯:৩০–১০:৩০: কমন ডাস্টবিন পরিষ্কারে সহায়তা' },
      { timeBn: '১১:৩০–০১:০০', workBn: '১৬ তলার সকল পানির ফিল্টার নিয়মিত দেখা ও পরিষ্কার করা (সরিয়া বেগম) এবং করিডোরের জানালা ও অগ্নিনির্বাপক বক্স মুছে পরিষ্কার রাখা (তাসলিমা ও নবনিযুক্ত কর্মী)' },
      { timeBn: '০১:০০–০২:০০', workBn: 'নামাজ ও দুপুরের খাবারের বিরতি' },
      { timeBn: '০২:০০–০৩:১০', workBn: 'সকল সিঁড়ি ২য় রাউন্ড পর্যবেক্ষণ ও পরিষ্কার করা। মাসের ১৫ নভেম্বর (রবিবার) দুপুর ০২:০০–০৩:০০ (১ ঘণ্টা): হলের ক্যান্টিন পরিষ্কার করা' },
      { timeBn: '০৩:১০–০৪:০০', workBn: 'প্রতি বৃহস্পতিবার বিকাল ০৩:১০–০৩:৫০ (৪০ মিনিট): ভবনের ৪টি ছাদ পরিষ্কার করা। অন্যান্য দিন: তলার কর্মীদের ভারী কাজে সহায়তা প্রদান' },
      { timeBn: '০৪:০০–০৪:৩০', workBn: 'সকল সিঁড়ি চূড়ান্ত পর্যবেক্ষণ এবং পরিচ্ছন্নতা সরঞ্জাম ধুয়ে গুছিয়ে রেখে সুপারভাইজারকে রিপোর্ট করা' }
    ]
  }
};

const aux = (id: string, taskTitleBn: string, frequencyBn: string, durationBn: string, timeSlotBn: string, assignedStaffBn: string, floorsOrZonesBn: string, verificationMethodBn: string): AuxiliaryTaskItem => ({
  id, taskTitleBn, frequencyBn, durationBn, timeSlotBn, assignedStaffBn, floorsOrZonesBn, verificationMethodBn
});

export const AUXILIARY_TASKS_LIST: AuxiliaryTaskItem[] = [
  aux('aux-1', '১. সিঁড়ি পরিষ্কার (প্রতি তলার ২টি সচল সিঁড়ি)', 'প্রতিদিন: সকালে ঝাড়ু ও মোছা, দুপুরে আবার ঝাড়ু',
    'এক পাশের এক তলা ১৫ মিনিট → প্রতি তলা ৩০ মিনিট (দ্বিতীয় রাউন্ডে ১৫ মিনিট)',
    'সকাল ০৭:৩০–০৯:০০ ও ০৯:৩০–১০:৩০/১১:০০ এবং দুপুর ০২:০০ হতে',
    'সহায়ক কর্মী-১ (গ্রাউন্ড–৫ম), সহায়ক কর্মী-২ (৬ষ্ঠ–১০ম), সহায়ক কর্মী-৩ (১১তম–১৫তম)',
    'সকল তলার ২টি সচল সিঁড়ি, ল্যান্ডিং ও রেলিং; বন্ধ (৩য়) সিঁড়ি সপ্তাহে ১ দিন (বৃহস্পতিবার)', 'সুপারভাইজারের আকস্মিক পরিদর্শন'),
  aux('aux-2', '২. কমন ডাস্টবিন এলাকা ধুয়ে পরিষ্কার', 'সপ্তাহে ২ দিন (রবিবার ও বুধবার)',
    'মোট ৩০০ কর্ম-মিনিট (১০ জন × ৩০ মিনিটের সমান) → ৩ জন × ১০০ মিনিট', 'সকাল ০৯:৩০ – ১১:১০',
    'সামনের অংশের কর্মী, পেছনের অংশের কর্মী ও গ্রাউন্ড ফ্লোরের কর্মী', 'ভবনের বাইরের সকল কমন ডাস্টবিন (৮–১০টি) ও চারপাশ', 'সুপারভাইজারের স্বাক্ষর (সকাল ১০:৫০–১১:১০)'),
  aux('aux-3', '৩. ওয়াশরুম জোনের জানালা ও এক্সজস্ট ফ্যান', 'প্রতি তলায় সপ্তাহে ১ বার', 'প্রতি তলায় ৪০–৬০ মিনিট',
    'সহায়ক কর্মী-১: ১১:০০–১২:০০ | সহায়ক কর্মী-২ ও ৩: ১০:৩০–১১:৩০',
    'সহায়ক কর্মী-১, ২ ও ৩ (নিজ নিজ তলার অংশ)', 'প্রতিদিন একটি তলা — শনিবার প্রথম তলা থেকে শুরু করে বৃহস্পতিবারের মধ্যে সব তলা', 'সুপারভাইজারের পরিদর্শন'),
  aux('aux-4', '৪. পানির ফিল্টারের বাইরের অংশ', 'প্রতিদিন', 'প্রতি তলায় ৫ মিনিট', 'দুপুর ১২:৩০ – ০১:০০',
    'সহায়ক কর্মী-১, ২ ও ৩ (নিজ নিজ তলার অংশ)', 'গ্রাউন্ড ফ্লোর হতে ১৫তম তলা', 'সুপারভাইজারের পরিদর্শন'),
  aux('aux-5', '৫. হলের বাইরের সামনের ও পেছনের অংশ', 'প্রতিদিন', 'রুটিন অনুযায়ী ২ রাউন্ড', 'সকাল ০৭:৩০ – বিকাল ০৪:৩০',
    'সামনের অংশের কর্মী ও পেছনের অংশের কর্মী', 'বাগান, মূল ফটক, হাঁটার পথ, পেছনের প্রাঙ্গণ ও ড্রেন', 'সুপারভাইজারের আকস্মিক পরিদর্শন'),
  aux('aux-6', '৬. ছাদ পরিষ্কার', 'সপ্তাহে ১ দিন (বৃহস্পতিবার)', '৪০ মিনিট', 'বিকাল ০৩:১৫ – ০৪:১০',
    'সহায়ক কর্মী-১ (ছাদ-১), সহায়ক কর্মী-২ (ছাদ-২), সহায়ক কর্মী-৩ (ছাদ-৩ ও ৪)', 'ভবনের ছাদ ও পানি নামার পথ', 'সুপারভাইজারের স্বাক্ষর'),
  aux('aux-7', '৭. হলের ক্যান্টিন পরিষ্কার', 'মাসে ১ দিন (মেয়াদের প্রথম রবিবার)', '১ ঘণ্টা', 'দুপুর ০২:০০ – ০৩:০০',
    'সহায়ক কর্মী-১, ২, ৩ এবং সামনের অংশের কর্মী', 'ক্যান্টিনের ডাইনিং, হাত ধোয়ার বেসিন, জানালা ও ফ্যান', 'ক্যান্টিন ও হল সুপারভাইজারের স্বাক্ষর')
];

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliNumber(val: number | string): string {
  return String(val).replace(/[0-9]/g, (d) => BENGALI_DIGITS[Number(d)]);
}

const DAY_NAMES_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_NAMES_BN = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];

export interface RosterCalendarDay {
  dayIndex: number;
  dateIso: string;
  dateDisplayBn: string;
  dateShortBn: string;
  dayNameEn: string;
  dayNameBn: string;
  weekNumber: number;
}

const MONTH_NAMES_BN = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];

function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, (m || 1) - 1, d || 1));
}
function toIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}
export function addDaysIso(iso: string, n: number): string {
  const d = parseIsoDate(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return toIso(d);
}
export function daysBetweenIso(a: string, b: string): number {
  return Math.round((parseIsoDate(b).getTime() - parseIsoDate(a).getTime()) / 86400000);
}
export function dateBn(iso: string, withYear = true): string {
  const d = parseIsoDate(iso);
  const day = toBengaliNumber(String(d.getUTCDate()).padStart(2, '0'));
  return `${day} ${MONTH_NAMES_BN[d.getUTCMonth()]}${withYear ? ' ' + toBengaliNumber(d.getUTCFullYear()) : ''}`;
}
export function periodTextBn(start: string, end: string): string {
  return `${dateBn(start)} হতে ${dateBn(end)} পর্যন্ত`;
}

/** কক্ষ পালাক্রম এই তারিখ থেকে গোনা হয়, তাই নতুন মাসেও আগের মাসের ধারাবাহিকতা থাকে */
export const ROTATION_EPOCH = '2026-11-14';

function buildCalendar(start: string, end: string): RosterCalendarDay[] {
  const days: RosterCalendarDay[] = [];
  const total = Math.max(1, Math.min(62, daysBetweenIso(start, end) + 1));
  for (let i = 0; i < total; i++) {
    const iso = addDaysIso(start, i);
    const dow = parseIsoDate(iso).getUTCDay();
    days.push({
      dayIndex: i + 1,
      dateIso: iso,
      dateDisplayBn: dateBn(iso),
      dateShortBn: dateBn(iso, false),
      dayNameEn: DAY_NAMES_EN[dow],
      dayNameBn: DAY_NAMES_BN[dow],
      weekNumber: Math.floor(i / 7) + 1
    });
  }
  return days;
}

/** চলতি রোস্টারের তারিখগুলো (শুরু ও শেষ তারিখ বদলালে setActiveRosterPeriod দিয়ে নতুন করে তৈরি হয়) */
export const ROSTER_CALENDAR_DAYS: RosterCalendarDay[] = buildCalendar('2026-11-14', '2026-12-13');
let activePeriodKey = '2026-11-14|2026-12-13';

/** শিট থেকে আসা তারিখ (2026-11-14 / 14/11/2026 / 11/14/2026) → 'YYYY-MM-DD' */
export function toIsoDateLoose(v: string): string {
  const t = (v || '').trim().replace(/[০-৯]/g, (d) => String('০১২৩৪৫৬৭৮৯'.indexOf(d)));
  let m = t.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (m) return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
  m = t.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
  if (m) {
    let d = Number(m[1]);
    let mo = Number(m[2]);
    if (mo > 12 && d <= 12) [d, mo] = [mo, d];
    return `${m[3]}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }
  return '';
}

export function isIsoDate(v?: string): v is string {
  return !!v && /^\d{4}-\d{2}-\d{2}$/.test(v);
}

export function setActiveRosterPeriod(start?: string, end?: string): void {
  if (!isIsoDate(start) || !isIsoDate(end) || daysBetweenIso(start, end) < 0) return;
  const key = `${start}|${end}`;
  if (key === activePeriodKey) return;
  activePeriodKey = key;
  ROSTER_CALENDAR_DAYS.length = 0;
  ROSTER_CALENDAR_DAYS.push(...buildCalendar(start, end));
}

/** মেয়াদের প্রথম রবিবার ক্যান্টিন পরিষ্কারের দিন */
export function getCanteenDateIso(): string {
  return (ROSTER_CALENDAR_DAYS.find((d) => d.dayNameEn === 'Sunday') || ROSTER_CALENDAR_DAYS[0]).dateIso;
}

export const ALL_FLOOR_KEYS = ['G', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];

export function getFloorNameBn(floorKey: string): string {
  if (floorKey === 'G') return 'গ্রাউন্ড ফ্লোর';
  const ordinals: Record<string, string> = {
    '1': '১ম তলা',
    '2': '২য় তলা',
    '3': '৩য় তলা',
    '4': '৪র্থ তলা',
    '5': '৫ম তলা',
    '6': '৬ষ্ঠ তলা',
    '7': '৭ম তলা',
    '8': '৮ম তলা',
    '9': '৯ম তলা',
    '10': '১০ম তলা',
    '11': '১১তম তলা',
    '12': '১২তম তলা',
    '13': '১৩তম তলা',
    '14': '১৪তম তলা',
    '15': '১৫তম তলা'
  };
  return ordinals[floorKey] || `${toBengaliNumber(floorKey)}তম তলা`;
}

export function getRoomsForFloor(floorKey: string): string[] {
  if (floorKey === 'G') {
    return ['কমন স্পেস', 'স্টাডি রুম', 'নামাজের রুম', 'টিভি রুম'];
  }
  if (floorKey === '1') {
    const resRooms: string[] = [];
    for (let r = 1; r <= 14; r++) {
      resRooms.push(`1${String(r).padStart(2, '0')}`);
    }
    return resRooms;
  }
  const floorNum = Number(floorKey);
  if (!Number.isNaN(floorNum) && floorNum >= 2 && floorNum <= 15) {
    const rooms: string[] = [];
    for (let r = 1; r <= 29; r++) {
      rooms.push(`${floorNum}${String(r).padStart(2, '0')}`);
    }
    return rooms;
  }
  return [];
}

export function generateFloorMonthlySchedule(
  floorKey: string,
  staffList: StaffMember[],
  enableWeeklyRelieverSwap = false
): DayScheduleEntry[] {
  const regularCleaner = staffList.find((s) => s.floorKey === floorKey);
  const floorNum = Number(floorKey);
  const floorOffset = Number.isNaN(floorNum) ? 0 : (floorNum - 1) * 2;

  return ROSTER_CALENDAR_DAYS.map((cal) => {
    // মেয়াদ বদলালেও কক্ষের পালা যেন ধারাবাহিক থাকে, তাই নির্দিষ্ট শুরুর তারিখ থেকে দিন গোনা
    const idx = Math.max(0, daysBetweenIso(ROTATION_EPOCH, cal.dateIso));
    const isRegularOff = regularCleaner ? regularCleaner.weeklyOff === cal.dayNameEn : false;
    const isSwappedWeek = enableWeeklyRelieverSwap && cal.weekNumber % 2 === 0;

    let activeWorkerNameBn = regularCleaner?.nameBn || 'নির্ধারিত কর্মী';
    let activeWorkerId = regularCleaner?.employeeId || '';
    let substituteNoteBn = 'নিয়মিত দায়িত্ব';

    if (regularCleaner) {
      if (isRegularOff) {
        activeWorkerNameBn = regularCleaner.designatedSubstituteBn;
        activeWorkerId = regularCleaner.substituteId;
        substituteNoteBn = `সাপ্তাহিক ছুটি (${regularCleaner.nameBn}) — বদলি দায়িত্ব: ${regularCleaner.designatedSubstituteBn}`;
      } else if (isSwappedWeek && cal.dayNameEn !== 'Friday') {
        substituteNoteBn = `সাপ্তাহিক দায়িত্ব সমন্বয় রোটেশন (সপ্তাহ-${toBengaliNumber(cal.weekNumber)})`;
      }
    }

    if (floorKey === 'G') {
      const zones = ['কমন স্পেস', 'স্টাডি রুম', 'নামাজের রুম', 'টিভি রুম'];
      const starIdx = idx % 4;
      const isDustbinDay = cal.dayNameEn === 'Sunday' || cal.dayNameEn === 'Wednesday';
      const starRoom = isDustbinDay ? '' : zones[starIdx];
      const morningRooms = zones.filter((_, i) => i !== starIdx);
      return {
        floorKey,
        dateIso: cal.dateIso,
        dayIndex: cal.dayIndex,
        dateDisplayBn: cal.dateDisplayBn,
        dateShortBn: cal.dateShortBn,
        dayNameEn: cal.dayNameEn,
        dayNameBn: cal.dayNameBn,
        weekNumber: cal.weekNumber,
        morningRooms,
        starRoom,
        isWeeklyOff: isRegularOff,
        activeWorkerNameBn,
        activeWorkerId,
        substituteNoteBn,
        specialTaskBn: isDustbinDay
          ? 'সকাল ০৯:৩০–১১:১০: কমন ডাস্টবিন এলাকা (সামনের ও পেছনের কর্মীর সাথে)'
          : 'মূল প্রবেশপথ লবি ও অভ্যর্থনা কক্ষ পরিপাটি রাখা'
      };
    }

    if (floorKey === '1') {
      const resRooms = getRoomsForFloor('1');
      const resA = resRooms[(idx * 2) % 14];
      const resB = resRooms[(idx * 2 + 1) % 14];
      const starRoom = resB;
      const morningRooms = [
        resA,
        'অফিস-১০১ ও অফিস-১০২',
        'অফিস-১০৩, অফিস-১০৪ ও লবি'
      ];

      return {
        floorKey,
        dateIso: cal.dateIso,
        dayIndex: cal.dayIndex,
        dateDisplayBn: cal.dateDisplayBn,
        dateShortBn: cal.dateShortBn,
        dayNameEn: cal.dayNameEn,
        dayNameBn: cal.dayNameBn,
        weekNumber: cal.weekNumber,
        morningRooms,
        starRoom,
        isWeeklyOff: isRegularOff,
        activeWorkerNameBn,
        activeWorkerId,
        substituteNoteBn,
        specialTaskBn: 'অফিসের সামনের লবি ও কাচের দরজা পরিপাটি রাখা'
      };
    }

    const rooms = getRoomsForFloor(floorKey);
    if (rooms.length === 29) {
      const starIdx = (idx * 4 + floorOffset) % 29;
      const m1Idx = (idx * 4 + 1 + floorOffset) % 29;
      const m2Idx = (idx * 4 + 2 + floorOffset) % 29;
      const m3Idx = (idx * 4 + 3 + floorOffset) % 29;

      const shoeStart = ((idx % 6) * 5) + 1;
      const shoeEnd = Math.min(29, shoeStart + 4);

      return {
        floorKey,
        dateIso: cal.dateIso,
        dayIndex: cal.dayIndex,
        dateDisplayBn: cal.dateDisplayBn,
        dateShortBn: cal.dateShortBn,
        dayNameEn: cal.dayNameEn,
        dayNameBn: cal.dayNameBn,
        weekNumber: cal.weekNumber,
        morningRooms: [rooms[m1Idx], rooms[m2Idx], rooms[m3Idx]],
        starRoom: rooms[starIdx],
        isWeeklyOff: isRegularOff,
        activeWorkerNameBn,
        activeWorkerId,
        substituteNoteBn,
        specialTaskBn: `জুতার র‍্যাকের বাইরের অংশ (কক্ষ ${rooms[shoeStart - 1]}–${rooms[shoeEnd - 1]}) ও পানির ফিল্টার পর্যবেক্ষণ`
      };
    }

    return {
      floorKey,
      dateIso: cal.dateIso,
      dayIndex: cal.dayIndex,
      dateDisplayBn: cal.dateDisplayBn,
      dateShortBn: cal.dateShortBn,
      dayNameEn: cal.dayNameEn,
      dayNameBn: cal.dayNameBn,
      weekNumber: cal.weekNumber,
      morningRooms: ['জোন-১', 'জোন-২', 'জোন-৩'],
      starRoom: 'জোন-৪',
      isWeeklyOff: isRegularOff,
      activeWorkerNameBn,
      activeWorkerId,
      substituteNoteBn,
      specialTaskBn: 'নিয়মিত তদারকি'
    };
  });
}

export function createInitialSpreadsheetDatabase(): SpreadsheetDatabase {
  const floorSchedules: Record<string, DayScheduleEntry[]> = {};
  ALL_FLOOR_KEYS.forEach((f) => {
    floorSchedules[f] = generateFloorMonthlySchedule(f, INITIAL_STAFF_LIST, false);
  });

  return {
    staffList: INITIAL_STAFF_LIST,
    dailyRoutine: STANDARD_FLOOR_DAILY_ROUTINE,
    floorSchedules,
    auxiliaryTasks: AUXILIARY_TASKS_LIST,
    notices: DEFAULT_OFFICIAL_NOTICES,
    roleRoutines: DEFAULT_ROLE_ROUTINES
  };
}

/**
 * Generates a worker's 30-day schedule directly from the live `SpreadsheetDatabase`
 * so any edits to `floorSchedules` or `staffList` in the Google Sheet reflect immediately!
 */
export function getWorkerMonthlyScheduleFromDb(
  worker: StaffMember,
  db: SpreadsheetDatabase,
  enableWeeklyRelieverSwap = false
): DayScheduleEntry[] {
  const { staffList, floorSchedules } = db;

  if (
    worker.floorKey === 'G' ||
    (!Number.isNaN(Number(worker.floorKey)) && Number(worker.floorKey) >= 1 && Number(worker.floorKey) <= 15)
  ) {
    const floorSched =
      floorSchedules[worker.floorKey] ||
      generateFloorMonthlySchedule(worker.floorKey, staffList, enableWeeklyRelieverSwap);

    return floorSched.map((entry) => {
      const isOff = worker.weeklyOff === entry.dayNameEn;
      if (isOff) {
        return {
          ...entry,
          isWeeklyOff: true,
          morningRooms: ['সাপ্তাহিক ছুটি'],
          starRoom: 'ছুটি',
          substituteNoteBn: `সাপ্তাহিক ছুটি — বদলি দায়িত্ব পালন করবেন: ${worker.designatedSubstituteBn}`
        };
      }
      return {
        ...entry,
        isWeeklyOff: false,
        activeWorkerNameBn: worker.nameBn,
        activeWorkerId: worker.employeeId
      };
    });
  }

  if (worker.floorKey.startsWith('REL_')) {
    return ROSTER_CALENDAR_DAYS.map((cal) => {
      if (cal.dayNameEn === worker.weeklyOff) {
        return {
          floorKey: worker.floorKey,
          dateIso: cal.dateIso,
          dayIndex: cal.dayIndex,
          dateDisplayBn: cal.dateDisplayBn,
          dateShortBn: cal.dateShortBn,
          dayNameEn: cal.dayNameEn,
          dayNameBn: cal.dayNameBn,
          weekNumber: cal.weekNumber,
          morningRooms: ['সাপ্তাহিক ছুটি'],
          starRoom: 'ছুটি',
          isWeeklyOff: true,
          activeWorkerNameBn: worker.nameBn,
          activeWorkerId: worker.employeeId,
          substituteNoteBn: 'শুক্রবার সাপ্তাহিক ছুটি (সকল তলার নিয়মিত কর্মী কর্মরত থাকেন)',
          specialTaskBn: 'সাপ্তাহিক ছুটি'
        };
      }

      const coveredStaff = staffList.find(
        (s) =>
          s.weeklyOff === cal.dayNameEn &&
          (s.substituteId === worker.employeeId ||
            s.designatedSubstituteBn.includes(worker.nameBn) ||
            s.designatedSubstitute.includes(worker.name))
      );

      if (coveredStaff) {
        const coveredFloorSched =
          floorSchedules[coveredStaff.floorKey] ||
          generateFloorMonthlySchedule(coveredStaff.floorKey, staffList, enableWeeklyRelieverSwap);
        const dayEntry = coveredFloorSched.find((d) => d.dateIso === cal.dateIso);
        if (dayEntry) {
          return {
            ...dayEntry,
            isWeeklyOff: false,
            activeWorkerNameBn: worker.nameBn,
            activeWorkerId: worker.employeeId,
            substituteNoteBn: `${coveredStaff.assignedRoleBn}-এ বদলি দায়িত্ব (${coveredStaff.nameBn}-এর ছুটি)`,
            specialTaskBn: `${coveredStaff.assignedRoleBn}-এর প্রাত্যহিক রুটিন ও কক্ষ পরিষ্কার`
          };
        }
      }

      return {
        floorKey: worker.floorKey,
        dateIso: cal.dateIso,
        dayIndex: cal.dayIndex,
        dateDisplayBn: cal.dateDisplayBn,
        dateShortBn: cal.dateShortBn,
        dayNameEn: cal.dayNameEn,
        dayNameBn: cal.dayNameBn,
        weekNumber: cal.weekNumber,
        morningRooms: ['করিডোর পরিষ্কারে সহায়তা', 'সিঁড়ি পর্যবেক্ষণ', 'পানির ফিল্টার জোন'],
        starRoom: 'বিশেষ পরিষ্কারে সহায়তা',
        isWeeklyOff: false,
        activeWorkerNameBn: worker.nameBn,
        activeWorkerId: worker.employeeId,
        substituteNoteBn: 'সহায়ক দায়িত্ব',
        specialTaskBn: 'জরুরি বদলি ও তদারকি'
      };
    });
  }

  if (worker.floorKey === 'EXT_FRONT' || worker.floorKey === 'EXT_BACK') {
    const zoneLabel = worker.floorKey === 'EXT_FRONT' ? 'সামনের অংশ' : 'পেছনের অংশ';
    return ROSTER_CALENDAR_DAYS.map((cal) => {
      const isOff = cal.dayNameEn === worker.weeklyOff;
      if (isOff) {
        return {
          floorKey: worker.floorKey,
          dateIso: cal.dateIso,
          dayIndex: cal.dayIndex,
          dateDisplayBn: cal.dateDisplayBn,
          dateShortBn: cal.dateShortBn,
          dayNameEn: cal.dayNameEn,
          dayNameBn: cal.dayNameBn,
          weekNumber: cal.weekNumber,
          morningRooms: ['সাপ্তাহিক ছুটি'],
          starRoom: 'ছুটি',
          isWeeklyOff: true,
          activeWorkerNameBn: worker.nameBn,
          activeWorkerId: worker.employeeId,
          substituteNoteBn: `সাপ্তাহিক ছুটি (বদলি দায়িত্ব: ${worker.designatedSubstituteBn})`,
          specialTaskBn: 'সাপ্তাহিক ছুটি'
        };
      }
      const isDustbinDay = cal.dayNameEn === 'Sunday' || cal.dayNameEn === 'Wednesday';
      return {
        floorKey: worker.floorKey,
        dateIso: cal.dateIso,
        dayIndex: cal.dayIndex,
        dateDisplayBn: cal.dateDisplayBn,
        dateShortBn: cal.dateShortBn,
        dayNameEn: cal.dayNameEn,
        dayNameBn: cal.dayNameBn,
        weekNumber: cal.weekNumber,
        morningRooms: [
          `${zoneLabel}: চলাচলের পথ ও বাগান`,
          isDustbinDay ? 'কমন ডাস্টবিন এলাকা ধোয়া (০৯:৩০–১১:১০)' : `${zoneLabel}: ড্রেনেজ ও প্রাঙ্গণ`,
          'কমন ডাস্টবিন খালি ও জীবাণুমুক্তকরণ'
        ],
        starRoom: `${zoneLabel}: মূল ফটক, নামফলক ও ল্যাম্পপোস্ট পরিষ্কার`,
        isWeeklyOff: false,
        activeWorkerNameBn: worker.nameBn,
        activeWorkerId: worker.employeeId,
        substituteNoteBn: 'নিয়মিত বহির্ভাগ দায়িত্ব',
        specialTaskBn: isDustbinDay
          ? 'সকাল ০৯:৩০–১১:১০: কমন ডাস্টবিন এলাকা (অন্য বাইরের কর্মী ও গ্রাউন্ড ফ্লোরের কর্মীর সাথে)'
          : 'বাইরের অংশ ও ডাস্টবিন নিয়মিত পরিষ্কার'
      };
    });
  }

  return ROSTER_CALENDAR_DAYS.map((cal) => {
    const isOff = cal.dayNameEn === worker.weeklyOff;
    if (isOff) {
      return {
        floorKey: worker.floorKey,
        dateIso: cal.dateIso,
        dayIndex: cal.dayIndex,
        dateDisplayBn: cal.dateDisplayBn,
        dateShortBn: cal.dateShortBn,
        dayNameEn: cal.dayNameEn,
        dayNameBn: cal.dayNameBn,
        weekNumber: cal.weekNumber,
        morningRooms: ['সাপ্তাহিক ছুটি'],
        starRoom: 'ছুটি',
        isWeeklyOff: true,
        activeWorkerNameBn: worker.nameBn,
        activeWorkerId: worker.employeeId,
        substituteNoteBn: 'শুক্রবার সাপ্তাহিক ছুটি',
        specialTaskBn: 'সাপ্তাহিক ছুটি'
      };
    }

    const stairRange =
      worker.floorKey === 'SQUAD_1'
        ? 'গ্রাউন্ড–৫ম তলার সব সিঁড়ি'
        : worker.floorKey === 'SQUAD_2'
        ? '৬ষ্ঠ–১০ম তলার সব সিঁড়ি'
        : '১১তম–১৫তম তলার সব সিঁড়ি';

    const squadFloors: Record<string, string[]> = {
      SQUAD_1: ['G', '1', '2', '3', '4', '5'],
      SQUAD_2: ['6', '7', '8', '9', '10'],
      SQUAD_3: ['11', '12', '13', '14', '15']
    };
    const myFloors = squadFloors[worker.floorKey] || [];
    const dayPos = WEEK_ORDER_EN.indexOf(cal.dayNameEn);
    const windowFloor = dayPos >= 0 && dayPos < myFloors.length ? getFloorNameBn(myFloors[dayPos]) : '';
    const windowTask = windowFloor ? `জানালা ও এক্সজস্ট ফ্যান: ${windowFloor}` : 'বন্ধ (৩য়) সিঁড়ি ঝাড়ু দেওয়া';

    const isCanteenDay = cal.dateIso === getCanteenDateIso();
    const isRoofDay = cal.dayNameEn === 'Thursday';
    const roof = worker.floorKey === 'SQUAD_1' ? 'ছাদ-১' : worker.floorKey === 'SQUAD_2' ? 'ছাদ-২' : 'ছাদ-৩ ও ৪';

    return {
      floorKey: worker.floorKey,
      dateIso: cal.dateIso,
      dayIndex: cal.dayIndex,
      dateDisplayBn: cal.dateDisplayBn,
      dateShortBn: cal.dateShortBn,
      dayNameEn: cal.dayNameEn,
      dayNameBn: cal.dayNameBn,
      weekNumber: cal.weekNumber,
      morningRooms: [stairRange, windowTask, 'করিডোরের জানালা ও পানির ফিল্টার'],
      starRoom: isCanteenDay ? 'ক্যান্টিন পরিষ্কার (০২:০০–০৩:০০)' : isRoofDay ? `${roof} পরিষ্কার` : 'সিঁড়ি দ্বিতীয় রাউন্ড',
      isWeeklyOff: false,
      activeWorkerNameBn: worker.nameBn,
      activeWorkerId: worker.employeeId,
      substituteNoteBn: 'নিয়মিত সহায়ক পরিচ্ছন্নতা রুটিন',
      specialTaskBn: [
        windowTask,
        isRoofDay ? `বিকালে ${roof} পরিষ্কার` : '',
        isCanteenDay ? 'দুপুর ০২:০০–০৩:০০ হলের ক্যান্টিন পরিষ্কার' : ''
      ]
        .filter(Boolean)
        .join(' • ')
    };
  });
}

/**
 * Generates Room Door Card schedule directly from the live `SpreadsheetDatabase.floorSchedules`
 * so any room number change in the linked Google Sheet immediately updates that room's Door Card!
 */
export function getRoomDoorCardScheduleFromDb(
  floorKey: string,
  roomNumber: string,
  db: SpreadsheetDatabase,
  enableWeeklyRelieverSwap = false
): RoomDoorCardEntry[] {
  const floorSched =
    db.floorSchedules[floorKey] ||
    generateFloorMonthlySchedule(floorKey, db.staffList, enableWeeklyRelieverSwap);

  const entries: RoomDoorCardEntry[] = [];
  // সময় সরাসরি Daily_Time_Routine শিট থেকে নেওয়া হয়, তাই শিটে সময় বদলালে কার্ডেও বদলাবে
  const roomSlots = db.dailyRoutine.filter((r) => r.category === 'rooms');
  const starSlot = db.dailyRoutine.find((r) => r.category === 'star_room');
  const morningTimeSlots = roomSlots.length
    ? roomSlots.map((r) => `${r.timeRangeBn} (${r.durationBn})`)
    : ['সকাল ১১:৩০ – ১১:৫০ (২০ মিনিট)', 'দুপুর ১২:০০ – ১২:২০ (২০ মিনিট)', 'দুপুর ১২:৩০ – ১২:৫০ (২০ মিনিট)'];
  const starTimeSlot = starSlot ? `${starSlot.timeRangeBn} (${starSlot.durationBn})` : 'বিকাল ০৩:১০ – ০৪:০০ (৫০ মিনিট)';

  floorSched.forEach((day) => {
    const mIdx = day.morningRooms.findIndex(
      (r) => r.trim() === roomNumber.trim() || r.includes(roomNumber.trim())
    );
    if (mIdx !== -1) {
      entries.push({
        dateIso: day.dateIso,
        dateDisplayBn: day.dateDisplayBn,
        dayNameBn: day.dayNameBn,
        timeSlotBn: morningTimeSlots[mIdx] || 'সকাল ১১:৩০ – দুপুর ০১:০০',
        isStarClean: false,
        workDescriptionBn: 'বারান্দাসহ সম্পূর্ণ কক্ষ ঝাড়ু দেওয়া ও মোছা',
        assignedWorkerBn: day.activeWorkerNameBn
      });
    }
    const cleanStar = day.starRoom.replace(/★/g, '').trim();
    if (cleanStar === roomNumber.trim() || cleanStar.includes(roomNumber.trim())) {
      entries.push({
        dateIso: day.dateIso,
        dateDisplayBn: day.dateDisplayBn,
        dayNameBn: day.dayNameBn,
        timeSlotBn: starTimeSlot,
        isStarClean: true,
        workDescriptionBn: 'কক্ষের সকল ফ্যান ও জানালা পরিষ্কার এবং বারান্দাসহ কক্ষ ঝাড়ু দেওয়া ও মোছা',
        assignedWorkerBn: day.activeWorkerNameBn
      });
    }
  });

  return entries;
}

export interface PdfDownloadLinkItem {
  sl: number;
  categoryBn: string;
  titleBn: string;
  targetCode: string;
  pageFormatBn: string;
  directUrl: string;
  actionType: 'master' | 'worker' | 'floor_doors' | 'all_workers' | 'auxiliary' | 'supervisor';
  targetId: string;
}

export function generatePdfDownloadLinks(baseUrl: string, staffList: StaffMember[]): PdfDownloadLinkItem[] {
  const cleanBase = baseUrl.replace(/\/$/, '');
  const list: PdfDownloadLinkItem[] = [];
  let sl = 1;

  list.push({
    sl: sl++,
    categoryBn: 'মাস্টার রোস্টার ও নীতিমালা',
    titleBn: 'সম্পূর্ণ হল মাস্টার রোস্টার, প্রাত্যহিক রুটিন ও সহায়ক কাজের সূচি (গ্রে-স্কেল পিডিএফ)',
    targetCode: 'MASTER-ALL',
    pageFormatBn: 'A4 ল্যান্ডস্কেপ, ১ পাতা (তারিখ অনুযায়ী সবার দায়িত্বের ছক)',
    directUrl: `${cleanBase}/?view=master&print=true`,
    actionType: 'master',
    targetId: 'all'
  });

  list.push({
    sl: sl++,
    categoryBn: 'সুপারভাইজারের রুটিন',
    titleBn: 'সুপারভাইজারের দৈনিক ২ ঘণ্টার রুটিন ও পরিদর্শন তালিকা',
    targetCode: 'SUPERVISOR',
    pageFormatBn: 'A4: ১ কাগজ, ২ পিঠ',
    directUrl: `${cleanBase}/?view=supervisor&print=true`,
    actionType: 'supervisor',
    targetId: 'supervisor'
  });

  list.push({
    sl: sl++,
    categoryBn: 'সকল কর্মীর একত্রে শিডিউল',
    titleBn: `সকল কর্মীর ব্যক্তিগত শিডিউল একত্রে (${toBengaliNumber(staffList.length)} জন)`,
    targetCode: 'WORKERS-ALL',
    pageFormatBn: 'A4: প্রত্যেকে ১ কাগজের ২ পিঠ, রিলিভার ১ পাতা',
    directUrl: `${cleanBase}/?view=worker&workerId=ALL&print=true`,
    actionType: 'all_workers',
    targetId: 'ALL'
  });

  staffList.forEach((s) => {
    list.push({
      sl: sl++,
      categoryBn: 'কর্মীর ব্যক্তিগত শিডিউল (২ পিঠ)',
      titleBn: `${s.nameBn} (${s.name}) — ${s.assignedRoleBn}`,
      targetCode: `WORKER-${s.sl}-${s.employeeId}`,
      pageFormatBn: s.floorKey.startsWith('REL')
        ? 'A4: ১ পাতা (কোন বারে কার বদলি)'
        : isDayWiseWorker(s)
        ? 'A4: ১ কাগজ, ২ পিঠ (সামনে রুটিন ও বারভিত্তিক পরিবর্তন, পেছনে তারিখ অনুযায়ী কাজ)'
        : 'A4: ১ কাগজ, ২ পিঠ (সামনে প্রতিদিনের রুটিন, পেছনে মাসিক কক্ষ সূচি)',
      directUrl: `${cleanBase}/?view=worker&workerId=${s.sl}&print=true`,
      actionType: 'worker',
      targetId: String(s.sl)
    });
  });

  ALL_FLOOR_KEYS.forEach((f) => {
    const labelBn =
      f === 'G'
        ? 'গ্রাউন্ড ফ্লোর (কমন স্পেস, স্টাডি, নামাজ ও টিভি রুম)'
        : f === '1'
        ? '১ম তলা (কক্ষ ১০১–১১৪ ও ৪টি অফিস)'
        : `${getFloorNameBn(f)} (কক্ষ ${toBengaliNumber(f)}০১–${toBengaliNumber(f)}২৯ — ২৯টি কক্ষ)`;
    list.push({
      sl: sl++,
      categoryBn: 'কক্ষের দরজার কার্ড (তলাভিত্তিক)',
      titleBn: `${labelBn} — সকল দরজার কার্ড পিডিএফ`,
      targetCode: `DOOR-FLOOR-${f}`,
      pageFormatBn: 'A4 গ্রে-স্কেল (সুপারভাইজারের স্বাক্ষরের ঘরসহ)',
      directUrl: `${cleanBase}/?view=doors&floor=${f}&print=true`,
      actionType: 'floor_doors',
      targetId: f
    });
  });

  return list;
}

// ============================================================================
// বারভিত্তিক রুটিন (রিলিভার, বাইরের এলাকা ও সহায়ক কর্মীদের জন্য)
// Google Sheet ট্যাব: Role_Weekday_Routines
//   কলাম: Role Key | বার (All = প্রতিদিন) | সময় | কাজের বিবরণ
//   নির্দিষ্ট বারের সারিতে যে সময় লেখা থাকবে, সেদিন ওই সময়ের 'All' সারির বদলে সেটি দেখানো হবে।
// ============================================================================

export const WEEK_ORDER_EN = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
export const DAY_BN_BY_EN: Record<string, string> = {
  Saturday: 'শনিবার',
  Sunday: 'রবিবার',
  Monday: 'সোমবার',
  Tuesday: 'মঙ্গলবার',
  Wednesday: 'বুধবার',
  Thursday: 'বৃহস্পতিবার',
  Friday: 'শুক্রবার'
};
const DAY_EN_BY_BN: Record<string, string> = Object.fromEntries(
  Object.entries(DAY_BN_BY_EN).map(([en, bn]) => [bn, en])
);

export const ROLE_LABEL_BN: Record<string, string> = {
  G: 'গ্রাউন্ড ফ্লোর',
  '1': '১ম তলা',
  EXT_FRONT: 'হলের বাইরের সামনের অংশ',
  EXT_BACK: 'হলের বাইরের পেছনের অংশ',
  SQUAD_1: 'সহায়ক কর্মী-১ (গ্রাউন্ড–৫ম তলার সিঁড়ি ও পানির ফিল্টার)',
  SQUAD_2: 'সহায়ক কর্মী-২ (৬ষ্ঠ–১০ম তলার সিঁড়ি)',
  SQUAD_3: 'সহায়ক কর্মী-৩ (১১তম–১৫তম তলার সিঁড়ি)',
  REL_1: 'রিলিভার-১',
  REL_2: 'রিলিভার-২',
  REL_3: 'রিলিভার-৩',
  REL: 'রিলিভার',
  SUPERVISOR: 'সুপারভাইজার (RASG-2)'
};

const N = 'নাস্তার বিরতি';
const L = 'নামাজ ও দুপুরের খাবারের বিরতি';
const R = (roleKey: string, dayEn: string, timeBn: string, workBn: string): RoleRoutineRow => ({
  roleKey,
  dayEn,
  timeBn,
  workBn
});

/*
 * সময়ের হিসাব (মাপজোখ অনুযায়ী):
 *  • প্রতি তলায় ২টি সচল সিঁড়ি; এক পাশের এক তলার সিঁড়ি ঝাড়ু ও মোছা = ১৫ মিনিট → প্রতি তলা ৩০ মিনিট
 *  • দ্বিতীয় রাউন্ডে শুধু ঝাড়ু (প্রতি তলা ১৫ মিনিট)
 *  • কমন ডাস্টবিন এলাকা = ১০ জন × ৩০ মিনিট = ৩০০ মিনিট → সামনের, পেছনের ও গ্রাউন্ড ফ্লোরের কর্মী মিলে ১০০ মিনিট (রবি ও বুধবার)
 */
const BN_FLOOR_SHORT: Record<string, string> = {
  G: 'গ্রাউন্ড ফ্লোর', '1': '১ম তলা', '2': '২য় তলা', '3': '৩য় তলা', '4': '৪র্থ তলা', '5': '৫ম তলা',
  '6': '৬ষ্ঠ তলা', '7': '৭ম তলা', '8': '৮ম তলা', '9': '৯ম তলা', '10': '১০ম তলা', '11': '১১তম তলা',
  '12': '১২তম তলা', '13': '১৩তম তলা', '14': '১৪তম তলা', '15': '১৫তম তলা'
};
const fl = (k: string) => BN_FLOOR_SHORT[k] || k;
const DUSTBIN_DAYS = ['Sunday', 'Wednesday'];
const WORK_DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

function squadRows(key: string, floors: string[], rangeBn: string, middayBn: string, roof: string): RoleRoutineRow[] {
  const big = floors.length === 6; // সহায়ক কর্মী-১: গ্রাউন্ড–৫ম (৬টি তলা)
  const firstPart = floors.slice(0, 3).map(fl).join(', ');
  const secondPart = floors.slice(3).map(fl).join(', ');
  const rows: RoleRoutineRow[] = [
    R(key, 'All', '০৭:৩০–০৯:০০', `সিঁড়ি ঝাড়ু দেওয়া ও মোছা (দুই পাশ): ${firstPart} — প্রতি তলা ৩০ মিনিট`),
    R(key, 'All', '০৯:০০–০৯:৩০', N),
    R(key, 'All', big ? '০৯:৩০–১১:০০' : '০৯:৩০–১০:৩০', `সিঁড়ি ঝাড়ু দেওয়া ও মোছা (দুই পাশ): ${secondPart} — প্রতি তলা ৩০ মিনিট`),
    R(key, 'All', big ? '১২:০০–১২:৩০' : '১১:৩০–১২:৩০', middayBn),
    R(key, 'All', '১২:৩০–০১:০০', `${rangeBn}র পানির ফিল্টারের বাইরের অংশ মোছা ও চারপাশ শুকনো রাখা`),
    R(key, 'All', '০১:০০–০২:০০', L),
    R(key, 'All', big ? '০২:০০–০৩:৩০' : '০২:০০–০৩:১৫', `সিঁড়ি দ্বিতীয়বার শুধু ঝাড়ু দেওয়া: ${rangeBn} — প্রতি তলা ১৫ মিনিট`),
    R(key, 'All', big ? '০৩:৩০–০৪:০০' : '০৩:১৫–০৪:০০', 'সুপারভাইজারের নির্দেশে তলার কর্মীর ভারী কাজে সহায়তা বা অনুপস্থিত কর্মীর তলা'),
    R(key, 'All', '০৪:০০–০৪:৩০', 'সিঁড়ি শেষবার দেখা, সরঞ্জাম ধুয়ে গুছিয়ে রাখা ও সুপারভাইজারকে জানানো')
  ];
  // প্রতিদিন একটি তলার ওয়াশরুম জোনের জানালা ও এক্সজস্ট ফ্যান (৬ কর্মদিবসে সব তলা একবার)
  WORK_DAYS.forEach((day, i) => {
    const slot = big ? '১১:০০–১২:০০' : '১০:৩০–১১:৩০';
    if (i < floors.length) {
      rows.push(R(key, day, slot, `আজকের তলা: ${fl(floors[i])} — ২টি ওয়াশরুম জোনের জানালা ও এক্সজস্ট ফ্যান পরিষ্কার`));
    } else {
      rows.push(R(key, day, slot, `বন্ধ (৩য়) সিঁড়ি ঝাড়ু দেওয়া ও মাকড়সার জাল সরানো: ${rangeBn}`));
    }
  });
  if (big) rows.push(R(key, 'Thursday', '১২:০০–১২:৩০', `বন্ধ (৩য়) সিঁড়ি ঝাড়ু দেওয়া: ${rangeBn}`));
  // বৃহস্পতিবার ছাদ
  if (big) {
    rows.push(R(key, 'Thursday', '০৩:৩০–০৪:১০', `${roof} পরিষ্কার ও পানি নামার পথ খোলা রাখা`));
    rows.push(R(key, 'Thursday', '০৪:১০–০৪:৩০', 'সরঞ্জাম ধুয়ে গুছিয়ে রাখা ও সুপারভাইজারকে জানানো'));
  } else {
    rows.push(R(key, 'Thursday', '০৩:১৫–০৩:৫৫', `${roof} পরিষ্কার ও পানি নামার পথ খোলা রাখা`));
    rows.push(R(key, 'Thursday', '০৩:৫৫–০৪:০০', 'ছাদের দরজা বন্ধ করা'));
  }
  return rows;
}

function extRows(key: string, zone: string, morning: string, wash: string, afternoon: string): RoleRoutineRow[] {
  const rows: RoleRoutineRow[] = [
    R(key, 'All', '০৭:৩০–০৯:০০', morning),
    R(key, 'All', '০৯:০০–০৯:৩০', N),
    R(key, 'All', '০৯:৩০–১০:৩০', `${zone}র ড্রেন ও সীমানাপ্রাচীর সংলগ্ন পথ পরিষ্কার`),
    R(key, 'All', '১০:৩০–১১:৩০', wash),
    R(key, 'All', '১১:৩০–০১:০০', 'কমন ডাস্টবিনের চারপাশের ময়লা সরানো, ব্লিচিং পাউডার ছিটানো ও বাইরের বসার স্থান পরিষ্কার'),
    R(key, 'All', '০১:০০–০২:০০', L),
    R(key, 'All', '০২:০০–০৩:১০', `${zone} দ্বিতীয়বার ঝাড়ু দেওয়া এবং ডাস্টবিনের ঢাকনা দেখা`),
    R(key, 'All', '০৩:১০–০৪:০০', afternoon),
    R(key, 'All', '০৪:০০–০৪:৩০', 'সরঞ্জাম ধুয়ে গুছিয়ে রাখা ও সুপারভাইজারকে জানানো')
  ];
  DUSTBIN_DAYS.forEach((d) => {
    rows.push(R(key, d, '০৯:৩০–১১:১০', 'কমন ডাস্টবিন এলাকা ধুয়ে পরিষ্কার — অন্য বাইরের কর্মী ও গ্রাউন্ড ফ্লোরের কর্মী একসাথে'));
    rows.push(R(key, d, '১১:১০–১১:৩০', `${zone}র হাঁটার পথে পানি ছিটিয়ে ঝাড়ু দেওয়া`));
  });
  return rows;
}

export const DEFAULT_ROLE_ROUTINES: RoleRoutineRow[] = [
  // গ্রাউন্ড ফ্লোর
  R('G', 'All', '০৭:৩০–০৯:০০', 'টাস্ক ১: মূল প্রবেশপথের লবি ও করিডোরের ময়লার ঝুড়ি ও বালতি পরিষ্কার, মেঝে ঝাড়ু দেওয়া ও মোছা'),
  R('G', 'All', '০৯:০০–০৯:৩০', N),
  R('G', 'All', '০৯:৩০–১১:৩০', 'টাস্ক ২: ২টি ওয়াশরুম জোন ও অজুখানা হারপিক ও পরিচ্ছন্নতা সামগ্রী দিয়ে পরিষ্কার'),
  R('G', 'All', '১১:৩০–০১:০০', 'মাসিক সূচির ৩টি কক্ষ — প্রতিটি ২০ মিনিট; প্রতিটির পর ১০ মিনিট ওয়াশরুম জোন দেখা'),
  R('G', 'All', '০১:০০–০২:০০', L),
  R('G', 'All', '০২:০০–০৩:১০', '২টি ওয়াশরুম জোন শুধু পানি দিয়ে ধোয়া এবং করিডোর আবার ঝাড়ু দেওয়া ও ঝুড়ি খালি করা'),
  R('G', 'All', '০৩:১০–০৪:০০', '★ চিহ্নিত কক্ষের সকল ফ্যান ও জানালা পরিষ্কার এবং মেঝে ঝাড়ু দেওয়া ও মোছা'),
  R('G', 'All', '০৪:০০–০৪:৩০', 'ওয়াশরুম জোন শেষবার দেখা, সরঞ্জাম ধুয়ে গুছিয়ে রাখা ও সুপারভাইজারকে জানানো'),
  ...DUSTBIN_DAYS.flatMap((d) => [
    R('G', d, '০৯:৩০–১১:১০', 'কমন ডাস্টবিন এলাকা ধুয়ে পরিষ্কার — সামনের ও পেছনের অংশের কর্মীর সাথে'),
    R('G', d, '১১:১০–০১:০০', 'টাস্ক ২: ২টি ওয়াশরুম জোন ও অজুখানা হারপিক ও পরিচ্ছন্নতা সামগ্রী দিয়ে পরিষ্কার'),
    R('G', d, '০২:০০–০৩:২০', 'মাসিক সূচির ৩টি কক্ষ — প্রতিটি ২০ মিনিট; মাঝে ১০ মিনিট ওয়াশরুম জোন দেখা (এদিন ★ কক্ষ নেই)'),
    R('G', d, '০৩:২০–০৪:০০', '২টি ওয়াশরুম জোন পানি দিয়ে ধোয়া এবং করিডোর আবার ঝাড়ু দেওয়া')
  ]),
  // ১ম তলা
  R('1', 'All', '০৭:৩০–০৯:০০', 'টাস্ক ১: করিডোরের ময়লার ঝুড়ি ও বালতি পরিষ্কার, ঝাড়ু দেওয়া ও মোছা এবং ৪টি অফিসের সামনের লবি পরিষ্কার'),
  R('1', 'All', '০৯:০০–০৯:৩০', N),
  R('1', 'All', '০৯:৩০–১১:৩০', 'টাস্ক ২: ২টি ওয়াশরুম জোন হারপিক ও পরিচ্ছন্নতা সামগ্রী দিয়ে পরিষ্কার'),
  R('1', 'All', '১১:৩০–১১:৫০', 'মাসিক সূচির ১টি আবাসিক কক্ষ বারান্দাসহ ঝাড়ু দেওয়া ও মোছা'),
  R('1', 'All', '১১:৫০–১২:০০', 'ওয়াশরুম জোন দেখা'),
  R('1', 'All', '১২:০০–১২:২০', 'অফিস-১০১ ও অফিস-১০২ ঝাড়ু দেওয়া, মোছা ও আসবাবপত্র পরিষ্কার'),
  R('1', 'All', '১২:২০–১২:৩০', 'ওয়াশরুম জোন দেখা ও জরুরি কাজ'),
  R('1', 'All', '১২:৩০–১২:৫০', 'অফিস-১০৩, অফিস-১০৪ ও লবি ঝাড়ু দেওয়া, মোছা ও কাচের দরজা পরিষ্কার'),
  R('1', 'All', '১২:৫০–০১:০০', 'ওয়াশরুম জোন দেখা এবং রক্ষণাবেক্ষণ কাজ চললে তদারকি'),
  R('1', 'All', '০১:০০–০২:০০', L),
  R('1', 'All', '০২:০০–০৩:১০', 'ওয়াশরুম জোন পানি দিয়ে ধোয়া এবং করিডোরের ঝুড়ি খালি করা ও আবার ঝাড়ু দেওয়া'),
  R('1', 'All', '০৩:১০–০৪:০০', '★ চিহ্নিত ১টি আবাসিক কক্ষের সকল ফ্যান ও জানালা পরিষ্কার এবং বারান্দাসহ মেঝে ঝাড়ু দেওয়া ও মোছা'),
  R('1', 'All', '০৪:০০–০৪:৩০', 'ওয়াশরুম জোন শেষবার দেখা, সরঞ্জাম ধুয়ে গুছিয়ে রাখা ও সুপারভাইজারকে জানানো'),
  // বাইরের এলাকা
  ...extRows(
    'EXT_FRONT',
    'সামনের অংশ',
    'হলের সামনের বাগান, মূল ফটক ও চলাচলের পথ ঝাড়ু দেওয়া ও আবর্জনা সরানো',
    'নিরাপত্তা কক্ষ সংলগ্ন ওয়াশরুম, মূল ফটক, পার্কিং ও হাঁটার পথ পানি দিয়ে ধোয়া',
    'বাইরের ল্যাম্পপোস্ট, নামফলক, মূল ফটকের গ্রিল এবং নিরাপত্তা কক্ষের জানালা ও ফ্যান পরিষ্কার'
  ),
  ...extRows(
    'EXT_BACK',
    'পেছনের অংশ',
    'হলের পেছনের প্রাঙ্গণ ও ড্রেনের পাশের পথ ঝাড়ু দেওয়া ও আবর্জনা সরানো',
    'পেছনের প্রাঙ্গণের হাঁটার পথ ও ড্রেনের মুখ পানি দিয়ে ধোয়া',
    'পেছনের ফটকের গ্রিল, ড্রেনের ঢাকনা ও দেয়ালের নিচের অংশ পরিষ্কার'
  ),
  // সহায়ক কর্মী (সিঁড়ি)
  ...squadRows('SQUAD_1', ['G', '1', '2', '3', '4', '5'], 'গ্রাউন্ড–৫ম তলা', 'আজকের তলার করিডোরের জানালা ও অগ্নিনির্বাপক বক্স মোছা', 'ছাদ-১'),
  ...squadRows('SQUAD_2', ['6', '7', '8', '9', '10'], '৬ষ্ঠ–১০ম তলা', '৬ষ্ঠ–১০ম তলার করিডোরের জানালা ও অগ্নিনির্বাপক বক্স মোছা', 'ছাদ-২'),
  ...squadRows('SQUAD_3', ['11', '12', '13', '14', '15'], '১১তম–১৫তম তলা', '১১তম–১৫তম তলার করিডোরের জানালা ও অগ্নিনির্বাপক বক্স মোছা', 'ছাদ-৩ ও ছাদ-৪'),
  // রিলিভার — যেদিন কারও বদলি নেই সেদিনের রুটিন
  R('REL', 'All', '০৭:৩০–০৯:০০', 'সুপারভাইজারের কাছে হাজিরা দিয়ে যে তলার কর্মী অনুপস্থিত, সেই তলার টাস্ক ১'),
  R('REL', 'All', '০৯:০০–০৯:৩০', N),
  R('REL', 'All', '০৯:৩০–০১:০০', 'অনুপস্থিত কর্মীর তলার রুটিন অনুযায়ী কাজ; কেউ অনুপস্থিত না থাকলে সুপারভাইজারের নির্দেশে ভারী কাজে সহায়তা'),
  R('REL', 'All', '০১:০০–০২:০০', L),
  R('REL', 'All', '০২:০০–০৪:০০', 'একই তলার বিকালের রুটিন অথবা সুপারভাইজারের দেওয়া কাজ'),
  R('REL', 'All', '০৪:০০–০৪:৩০', 'সরঞ্জাম ধুয়ে গুছিয়ে রাখা ও সুপারভাইজারকে জানানো'),
  // সুপারভাইজার — দিনে মোট ২ ঘণ্টা (বাকি সময় হলের অন্যান্য দায়িত্ব)
  R('SUPERVISOR', 'All', '০৭:৩০–০৭:৫০', 'হাজিরা যাচাই; কেউ অনুপস্থিত থাকলে রিলিভার বা সহায়ক কর্মীকে ওই তলায় পাঠানো (২০ মিনিট)'),
  R('SUPERVISOR', 'All', '১১:৩০–১২:৪০', 'আজকের পরিদর্শন তালিকার তলাগুলো ঘোরা: করিডোর, ২টি ওয়াশরুম জোন ও পরিষ্কার শেষ হওয়া ১টি কক্ষ দেখা এবং দরজার কার্ডে স্বাক্ষর (৭০ মিনিট)'),
  R('SUPERVISOR', 'All', '০৩:১০–০৩:৩০', 'যেকোনো ২টি তলার সিঁড়ি ও বাইরের অংশ আকস্মিক পরিদর্শন (২০ মিনিট)'),
  R('SUPERVISOR', 'All', '০৪:১০–০৪:২০', 'কর্মীদের রিপোর্ট নেওয়া, পরিদর্শন খাতায় লেখা ও সমস্যা থাকলে হল প্রশাসনকে জানানো (১০ মিনিট)'),
  ...DUSTBIN_DAYS.map((d) => R('SUPERVISOR', d, '১০:৫০–১১:১০', 'কমন ডাস্টবিন এলাকার কাজ যাচাই ও স্বাক্ষর (২০ মিনিট)')),
  ...DUSTBIN_DAYS.map((d) => R('SUPERVISOR', d, '১১:৩০–১২:২০', 'আজকের পরিদর্শন তালিকার তলাগুলো ঘোরা (সময় কম বলে প্রতি তলায় ৭–৮ মিনিট) এবং দরজার কার্ডে স্বাক্ষর (৫০ মিনিট)')),
  R('SUPERVISOR', 'Thursday', '০৩:১০–০৩:৩০', 'ছাদ পরিষ্কারের কাজ যাচাই (২০ মিনিট)')
];

function bnTimeToMinutes(t: string): number {
  const en = t.replace(/[০-৯]/g, (d) => String('০১২৩৪৫৬৭৮৯'.indexOf(d)));
  const m = en.match(/(\d{1,2})[:.](\d{2})/);
  if (!m) return 9999;
  let h = Number(m[1]);
  if (h < 7) h += 12;
  return h * 60 + Number(m[2]);
}

function bnRange(t: string): [number, number] {
  const parts = t.split(/[–-]/);
  const s = bnTimeToMinutes(parts[0] || '');
  const e = parts.length > 1 ? bnTimeToMinutes(parts[parts.length - 1]) : s + 1;
  return [s, e > s ? e : s + 1];
}

export function isBreakText(work: string): boolean {
  return work.includes('বিরতি');
}

/** কোনো পদের (roleKey) নির্দিষ্ট বারের রুটিন — শিটের 'All' সারি + ওই বারের সারি; সময় মিলে গেলে বারের সারিটিই থাকে */
export function getRoleRoutineForDay(db: SpreadsheetDatabase, roleKey: string, dayEn: string): { timeBn: string; workBn: string }[] {
  const source = db.roleRoutines && db.roleRoutines.some((r) => r.roleKey === roleKey) ? db.roleRoutines : DEFAULT_ROLE_ROUTINES;
  const all = source.filter((r) => r.roleKey === roleKey);
  const base = all.filter((r) => r.dayEn === 'All' || r.dayEn === '' || r.dayEn === 'প্রতিদিন');
  const special = all.filter((r) => r.dayEn === dayEn || DAY_EN_BY_BN[r.dayEn] === dayEn);
  const specialRanges = special.map((r) => bnRange(r.timeBn));
  const keptBase = base.filter((r) => {
    const [s, e] = bnRange(r.timeBn);
    return !specialRanges.some(([ss, se]) => s < se && ss < e);
  });
  return [...keptBase, ...special]
    .map((r) => ({ timeBn: r.timeBn, workBn: r.workBn }))
    .sort((a, b) => bnTimeToMinutes(a.timeBn) - bnTimeToMinutes(b.timeBn));
}

/** তালিকার একটি দিনের বার (ইংরেজি) — শিট থেকে লোড হলে dayNameEn খালি থাকতে পারে */
export function weekdayOfEntry(e: { dayNameEn?: string; dayNameBn?: string; dateIso?: string }): string {
  if (e.dayNameEn) return e.dayNameEn;
  if (e.dayNameBn && DAY_EN_BY_BN[e.dayNameBn.trim()]) return DAY_EN_BY_BN[e.dayNameBn.trim()];
  if (e.dateIso && /^\d{4}-\d{2}-\d{2}$/.test(e.dateIso)) {
    const d = new Date(e.dateIso + 'T00:00:00');
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
  }
  return '';
}

export function isFloorKey(k: string): boolean {
  return ALL_FLOOR_KEYS.includes(k);
}

/** যাঁদের জন্য বারভিত্তিক আলাদা পাতা তৈরি হবে: রিলিভার, বাইরের এলাকা ও সহায়ক কর্মী */
export function isDayWiseWorker(w: StaffMember): boolean {
  return !isFloorKey(w.floorKey);
}

export interface WeekdayPlan {
  dayEn: string;
  dayBn: string;
  isOff: boolean;
  postKey: string; // যে পদে কাজ: তলা ('G','1'..'15') বা 'EXT_FRONT' / 'SQUAD_1' ইত্যাদি
  postLabelBn: string;
  coveredStaff?: StaffMember; // রিলিভার হলে যাঁর ছুটির দিনে বদলি
  dates: DayScheduleEntry[]; // এই মাসে ওই বারের সব তারিখ
}

function postLabel(key: string): string {
  return isFloorKey(key) ? getFloorNameBn(key) : ROLE_LABEL_BN[key] || key;
}

/** একজন কর্মীর সপ্তাহের ৭ দিনের পরিকল্পনা (কোন বারে কোথায় কাজ এবং ওই বারের তারিখগুলো) */
export function getWorkerWeekPlan(worker: StaffMember, db: SpreadsheetDatabase): WeekdayPlan[] {
  const monthly = getWorkerMonthlyScheduleFromDb(worker, db);
  return WEEK_ORDER_EN.map((dayEn) => {
    const isOff = worker.weeklyOff === dayEn;
    let postKey = worker.floorKey;
    let coveredStaff: StaffMember | undefined;
    if (!isOff && worker.floorKey.startsWith('REL_')) {
      coveredStaff = db.staffList.find(
        (s) =>
          s.weeklyOff === dayEn &&
          s.sl !== worker.sl &&
          ((worker.employeeId && s.substituteId === worker.employeeId) ||
            (worker.nameBn && s.designatedSubstituteBn.includes(worker.nameBn)) ||
            (worker.name && s.designatedSubstitute.includes(worker.name)))
      );
      if (coveredStaff) postKey = coveredStaff.floorKey;
    }
    let dates: DayScheduleEntry[];
    if (!isOff && isFloorKey(postKey)) {
      const sched = db.floorSchedules[postKey] || [];
      dates = sched.filter((d) => weekdayOfEntry(d) === dayEn);
    } else {
      dates = monthly.filter((d) => weekdayOfEntry(d) === dayEn);
    }
    return {
      dayEn,
      dayBn: DAY_BN_BY_EN[dayEn],
      isOff,
      postKey,
      postLabelBn: isOff ? 'সাপ্তাহিক ছুটি' : postLabel(postKey),
      coveredStaff,
      dates
    };
  });
}

/** কোনো পদের নির্দিষ্ট বারের রুটিন: সাধারণ তলা হলে Daily_Time_Routine, অন্যথায় Role_Weekday_Routines */
export function getPostRoutineForDay(db: SpreadsheetDatabase, postKey: string, dayEn: string): { timeBn: string; workBn: string; detailBn?: string }[] {
  const n = Number(postKey);
  if (!Number.isNaN(n) && n >= 2 && n <= 15) {
    return db.dailyRoutine.map((r) => ({ timeBn: r.timeRangeBn, workBn: r.titleBn, detailBn: r.detailsBn }));
  }
  return getRoleRoutineForDay(db, postKey, dayEn);
}

/** মাসিক সূচির কলামের শিরোনামের সময় (Daily_Time_Routine থেকে) */
export function getRoomColumnTimes(db: SpreadsheetDatabase): { roomsBn: string; starBn: string } {
  const rooms = db.dailyRoutine.filter((r) => r.category === 'rooms');
  const star = db.dailyRoutine.find((r) => r.category === 'star_room');
  const lunchIdx = db.dailyRoutine.findIndex((r) => r.category === 'break' && r.id !== db.dailyRoutine[1]?.id);
  const start = rooms[0]?.timeRangeBn.split(/[–-]/)[0]?.trim() || 'সকাল ১১:৩০';
  const endSlot = lunchIdx > 0 ? db.dailyRoutine[lunchIdx - 1] : rooms[rooms.length - 1];
  let end = endSlot?.timeRangeBn.split(/[–-]/).pop()?.trim() || '০১:০০';
  if (/^[০-৯]/.test(end)) {
    const word = endSlot?.timeRangeBn.match(/^(সকাল|দুপুর|বিকাল|বেলা)/)?.[1];
    if (word) end = `${word} ${end}`;
  }
  return { roomsBn: `${start} – ${end}`, starBn: star?.timeRangeBn || 'বিকাল ০৩:১০ – ০৪:০০' };
}

/* ===================== মেয়াদ (তারিখের সীমা) ===================== */

export function getActivePeriod(db: SpreadsheetDatabase): { start: string; end: string } {
  const start = isIsoDate(db.notices.rosterStartDate) ? db.notices.rosterStartDate : ROSTER_START_DATE;
  const end = isIsoDate(db.notices.rosterEndDate) ? db.notices.rosterEndDate : ROSTER_END_DATE;
  return { start, end };
}

/** শিট/লোকাল ডাটা পুরোনো সংস্করণের হলে প্রয়োজনীয় ঘাটতি পূরণ এবং মেয়াদ অনুযায়ী তলার সূচি ঠিক রাখা */
export function normalizeDatabase(db: SpreadsheetDatabase): SpreadsheetDatabase {
  const notices = { ...DEFAULT_OFFICIAL_NOTICES, ...db.notices };
  if (!isIsoDate(notices.rosterStartDate)) notices.rosterStartDate = ROSTER_START_DATE;
  if (!isIsoDate(notices.rosterEndDate)) notices.rosterEndDate = ROSTER_END_DATE;
  setActiveRosterPeriod(notices.rosterStartDate, notices.rosterEndDate);
  let roleRoutines = db.roleRoutines && db.roleRoutines.length ? db.roleRoutines : DEFAULT_ROLE_ROUTINES;
  // পুরোনো শিটে সুপারভাইজার/রিলিভার সারি না থাকলে নতুন ডিফল্ট সারিগুলো যোগ
  ['SUPERVISOR', 'REL'].forEach((k) => {
    if (!roleRoutines.some((r) => r.roleKey === k)) roleRoutines = [...roleRoutines, ...DEFAULT_ROLE_ROUTINES.filter((r) => r.roleKey === k)];
  });
  const next: SpreadsheetDatabase = {
    ...db,
    notices,
    roleRoutines,
    assignmentHistory: db.assignmentHistory || []
  };
  return ensureScheduleMatchesPeriod(next);
}

/** তলার সূচির তারিখ চলতি মেয়াদের সাথে না মিললে নতুন মেয়াদের সূচি তৈরি */
export function ensureScheduleMatchesPeriod(db: SpreadsheetDatabase): SpreadsheetDatabase {
  const first = ROSTER_CALENDAR_DAYS[0]?.dateIso;
  const last = ROSTER_CALENDAR_DAYS[ROSTER_CALENDAR_DAYS.length - 1]?.dateIso;
  const ok = ALL_FLOOR_KEYS.every((f) => {
    const s = db.floorSchedules[f];
    return s && s.length === ROSTER_CALENDAR_DAYS.length && s[0]?.dateIso === first && s[s.length - 1]?.dateIso === last;
  });
  if (ok) return db;
  const floorSchedules: Record<string, DayScheduleEntry[]> = {};
  ALL_FLOOR_KEYS.forEach((f) => {
    floorSchedules[f] = generateFloorMonthlySchedule(f, db.staffList, false);
  });
  return { ...db, floorSchedules };
}

export function changeRosterPeriod(db: SpreadsheetDatabase, start: string, end: string): SpreadsheetDatabase {
  setActiveRosterPeriod(start, end);
  const notices = { ...db.notices, rosterStartDate: start, rosterEndDate: end, rosterPeriodBn: periodTextBn(start, end) };
  return ensureScheduleMatchesPeriod({ ...db, notices, floorSchedules: {} });
}

/* ===================== দায়িত্বের পালাবদল (রোটেশন) ===================== */

export const POST_ORDER = [...Array.from({ length: 14 }, (_, i) => String(i + 2)), '1', 'G', 'EXT_FRONT', 'EXT_BACK', 'REL_1', 'REL_2', 'REL_3', 'SQUAD_1', 'SQUAD_2', 'SQUAD_3'];

export function postShortLabelBn(key: string): string {
  if (isFloorKey(key)) return getFloorNameBn(key);
  return ROLE_LABEL_BN[key]?.replace(/\s*\(.*\)$/, '') || key;
}

function sameStaff(h: AssignmentHistoryRow, s: StaffMember): boolean {
  if (h.employeeId && s.employeeId) return h.employeeId === s.employeeId;
  return h.name === s.name;
}

/** কর্মীর আগের সব মেয়াদের দায়িত্ব (নতুন থেকে পুরোনো) — চলতি মেয়াদসহ */
export function getStaffHistory(db: SpreadsheetDatabase, s: StaffMember): AssignmentHistoryRow[] {
  const { start, end } = getActivePeriod(db);
  const hist = (db.assignmentHistory || []).filter((h) => sameStaff(h, s) && h.periodStart !== start);
  const current: AssignmentHistoryRow = {
    periodStart: start, periodEnd: end, sl: s.sl, name: s.name, employeeId: s.employeeId, floorKey: s.floorKey, roleBn: s.assignedRoleBn
  };
  return [current, ...hist.sort((a, b) => (a.periodStart < b.periodStart ? 1 : -1))];
}

export interface RotationSuggestion {
  sl: number;
  currentPost: string;
  suggestedPost: string;
  reasonBn: string;
  relieverCount: number; // কতবার রিলিভার ছিলেন (চলতি মেয়াদসহ)
}

function permutations<T>(arr: T[]): T[][] {
  if (arr.length <= 1) return [arr];
  return arr.flatMap((x, i) => permutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map((p) => [x, ...p]));
}

/**
 * পরামর্শ (নিয়মভিত্তিক): চলতি রিলিভাররা পরের মেয়াদে তলার দায়িত্বে যাবেন,
 * আর যে তলার কর্মীরা সবচেয়ে কম বার রিলিভার হয়েছেন তাঁরা রিলিভার হবেন।
 * কে কোন তলা পাবেন তা আগের দায়িত্ব দেখে ঠিক করা হয় (আগে যে তলায় কম ছিলেন সেটি)।
 * বাকিরা নিজ দায়িত্বে থাকবেন। অ্যাডমিন চাইলে প্রতিটি পরিবর্তন করতে পারবেন।
 */
export function suggestNextRotation(db: SpreadsheetDatabase): RotationSuggestion[] {
  const staff = db.staffList;
  const hist = new Map(staff.map((s) => [s.sl, getStaffHistory(db, s)]));
  const relCount = (s: StaffMember) => (hist.get(s.sl) || []).filter((h) => h.floorKey.startsWith('REL_')).length;
  const timesOn = (s: StaffMember, key: string) => (hist.get(s.sl) || []).filter((h) => h.floorKey === key).length;
  const streak = (s: StaffMember) => {
    let n = 0;
    for (const h of hist.get(s.sl) || []) {
      if (h.floorKey.startsWith('REL_')) break;
      n++;
    }
    return n;
  };
  const relievers = staff.filter((s) => s.floorKey.startsWith('REL_'));
  const floorWorkers = staff.filter((s) => {
    const n = Number(s.floorKey);
    return !Number.isNaN(n) && n >= 2 && n <= 15;
  });
  const result = new Map<number, { post: string; reason: string }>();
  staff.forEach((s) => result.set(s.sl, { post: s.floorKey, reason: 'অপরিবর্তিত' }));

  const k = Math.min(relievers.length, floorWorkers.length);
  if (k > 0) {
    const chosen = [...floorWorkers]
      .sort((a, b) => relCount(a) - relCount(b) || streak(b) - streak(a) || a.sl - b.sl)
      .slice(0, k);
    const relSlots = relievers.map((r) => r.floorKey);
    const freedFloors = chosen.map((c) => c.floorKey);
    // পুরোনো রিলিভার → খালি হওয়া তলা (আগে যেখানে সবচেয়ে কম ছিলেন)
    let bestFloorPerm = freedFloors;
    let bestCost = Infinity;
    permutations(freedFloors).forEach((perm) => {
      const cost = relievers.reduce((sum, r, i) => sum + timesOn(r, perm[i]) * 10, 0);
      if (cost < bestCost) { bestCost = cost; bestFloorPerm = perm; }
    });
    relievers.forEach((r, i) =>
      result.set(r.sl, {
        post: bestFloorPerm[i],
        reason: `চলতি মেয়াদে রিলিভার; এবার তলার দায়িত্ব${timesOn(r, bestFloorPerm[i]) ? '' : ' (এই তলায় আগে ছিলেন না)'}`
      })
    );
    // নতুন রিলিভার → রিলিভার পদ (যে পদে আগে কম ছিলেন)
    let bestRelPerm = relSlots;
    bestCost = Infinity;
    permutations(relSlots).forEach((perm) => {
      const cost = chosen.reduce((sum, c, i) => sum + timesOn(c, perm[i]), 0);
      if (cost < bestCost) { bestCost = cost; bestRelPerm = perm; }
    });
    chosen.forEach((c, i) =>
      result.set(c.sl, {
        post: bestRelPerm[i],
        reason: `এ পর্যন্ত রিলিভার ${toBengaliNumber(relCount(c))} বার; টানা ${toBengaliNumber(streak(c))} মেয়াদ তলায়`
      })
    );
  }
  return staff.map((s) => ({
    sl: s.sl,
    currentPost: s.floorKey,
    suggestedPost: result.get(s.sl)!.post,
    reasonBn: result.get(s.sl)!.reason,
    relieverCount: relCount(s)
  }));
}

type PostTemplate = Pick<
  StaffMember,
  'assignedRole' | 'assignedRoleBn' | 'floorKey' | 'weeklyOff' | 'weeklyOffBn' | 'designatedSubstitute' | 'designatedSubstituteBn' | 'substituteId' | 'dutyCategory' | 'dutyCategoryBn' | 'auxiliaryResponsibilityBn'
>;

/** নতুন দায়িত্ব প্রয়োগ: পদের সব তথ্য (ছুটির দিন, বদলি, কাজ) পদের সাথেই থাকে, শুধু কর্মী বদলায় */
export function applyRotation(
  db: SpreadsheetDatabase,
  assignment: Record<number, string>,
  newStart: string,
  newEnd: string
): SpreadsheetDatabase {
  const { start, end } = getActivePeriod(db);
  const templates = new Map<string, PostTemplate>();
  db.staffList.forEach((s) =>
    templates.set(s.floorKey, {
      assignedRole: s.assignedRole, assignedRoleBn: s.assignedRoleBn, floorKey: s.floorKey, weeklyOff: s.weeklyOff, weeklyOffBn: s.weeklyOffBn,
      designatedSubstitute: s.designatedSubstitute, designatedSubstituteBn: s.designatedSubstituteBn, substituteId: s.substituteId,
      dutyCategory: s.dutyCategory, dutyCategoryBn: s.dutyCategoryBn, auxiliaryResponsibilityBn: s.auxiliaryResponsibilityBn
    })
  );
  const newHolder = new Map<string, StaffMember>();
  db.staffList.forEach((s) => newHolder.set(assignment[s.sl] || s.floorKey, s));
  const findOldHolder = (t: PostTemplate) =>
    db.staffList.find(
      (o) => (t.substituteId && o.employeeId === t.substituteId) || (o.nameBn && t.designatedSubstituteBn.includes(o.nameBn))
    );

  const nextStaff = db.staffList.map((person) => {
    const post = assignment[person.sl] || person.floorKey;
    const t = templates.get(post) || templates.get(person.floorKey)!;
    const next: StaffMember = { ...person, ...t };
    const oldSub = findOldHolder(t);
    if (oldSub) {
      const nh = newHolder.get(oldSub.floorKey);
      if (nh) {
        next.designatedSubstituteBn = t.designatedSubstituteBn.split(oldSub.nameBn).join(nh.nameBn);
        next.designatedSubstitute = t.designatedSubstitute.includes(oldSub.name)
          ? t.designatedSubstitute.split(oldSub.name).join(nh.name)
          : nh.name;
        next.substituteId = nh.employeeId;
      }
    }
    return next;
  });
  nextStaff.sort((a, b) => POST_ORDER.indexOf(a.floorKey) - POST_ORDER.indexOf(b.floorKey));

  const history = (db.assignmentHistory || []).filter((h) => h.periodStart !== start);
  db.staffList.forEach((s) =>
    history.push({ periodStart: start, periodEnd: end, sl: s.sl, name: s.name, employeeId: s.employeeId, floorKey: s.floorKey, roleBn: s.assignedRoleBn })
  );
  const moved = changeRosterPeriod({ ...db, staffList: nextStaff, assignmentHistory: history }, newStart, newEnd);
  return moved;
}

/* ===================== সুপারভাইজারের পরিদর্শন পরিকল্পনা ===================== */

export const INSPECTION_GROUPS: { key: string; labelBn: string; points: string[] }[] = [
  { key: 'ক', labelBn: 'দল-ক: গ্রাউন্ড ফ্লোর ও ১ম–৫ম তলা', points: ['G', '1', '2', '3', '4', '5'] },
  { key: 'খ', labelBn: 'দল-খ: ৬ষ্ঠ–১০ম তলা ও সামনের অংশ', points: ['6', '7', '8', '9', '10', 'EXT_FRONT'] },
  { key: 'গ', labelBn: 'দল-গ: ১১তম–১৫তম তলা ও পেছনের অংশ', points: ['11', '12', '13', '14', '15', 'EXT_BACK'] }
];

function seeded(seedText: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seedText.length; i++) h = Math.imul(h ^ seedText.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export interface InspectionDay {
  dateIso: string;
  dateShortBn: string;
  dayNameBn: string;
  isOff: boolean;
  groupKey: string;
  order: string[]; // পরিদর্শনের ক্রম (তলা/এলাকা কী)
  surprise: string; // অন্য দলের ১টি আকস্মিক পরিদর্শন
}

/** প্রতিটি তলা ৩ কর্মদিবসে অন্তত একবার; দলের ভেতরে ক্রম প্রতিদিন এলোমেলো, সাথে অন্য দলের ১টি আকস্মিক পরিদর্শন */
export function getSupervisorInspectionPlan(offDayEn = 'Friday'): InspectionDay[] {
  let work = 0;
  return ROSTER_CALENDAR_DAYS.map((cal) => {
    if (cal.dayNameEn === offDayEn) {
      return { dateIso: cal.dateIso, dateShortBn: cal.dateShortBn, dayNameBn: cal.dayNameBn, isOff: true, groupKey: '', order: [], surprise: '' };
    }
    const workIdx = daysBetweenIso(ROTATION_EPOCH, cal.dateIso);
    const g = INSPECTION_GROUPS[work % 3];
    work++;
    const rnd = seeded(cal.dateIso + '|' + workIdx);
    const order = [...g.points];
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    const others = INSPECTION_GROUPS.filter((x) => x.key !== g.key).flatMap((x) => x.points);
    const surprise = others[Math.floor(rnd() * others.length)];
    return { dateIso: cal.dateIso, dateShortBn: cal.dateShortBn, dayNameBn: cal.dayNameBn, isOff: false, groupKey: g.key, order, surprise };
  });
}

export function pointLabelBn(k: string): string {
  if (k === 'EXT_FRONT') return 'সামনের অংশ';
  if (k === 'EXT_BACK') return 'পেছনের অংশ';
  return getFloorNameBn(k);
}

/* ===================== মাস্টার রোস্টার গ্রিডের সংকেত ===================== */

export const GRID_CODE_LEGEND: { code: string; meaningBn: string }[] = [
  { code: 'গ্রা', meaningBn: 'গ্রাউন্ড ফ্লোর' },
  { code: '১–১৫', meaningBn: 'সংশ্লিষ্ট তলা' },
  { code: 'সা', meaningBn: 'বাইরের সামনের অংশ' },
  { code: 'পে', meaningBn: 'বাইরের পেছনের অংশ' },
  { code: 'সি১/সি২/সি৩', meaningBn: 'সহায়ক কর্মী — সিঁড়ি (গ্রা–৫ / ৬–১০ / ১১–১৫)' },
  { code: 'রি', meaningBn: 'রিলিভার — সুপারভাইজারের নির্দেশে' },
  { code: 'ছু', meaningBn: 'সাপ্তাহিক ছুটি' }
];

export function postGridCode(key: string): string {
  if (key === 'G') return 'গ্রা';
  if (isFloorKey(key)) return toBengaliNumber(key);
  if (key === 'EXT_FRONT') return 'সা';
  if (key === 'EXT_BACK') return 'পে';
  if (key.startsWith('SQUAD_')) return 'সি' + toBengaliNumber(key.slice(6));
  if (key.startsWith('REL')) return 'রি';
  return key;
}

/** এক কর্মীর মেয়াদের প্রতিটি দিনের সংকেত (মাস্টার গ্রিডের এক সারি) */
export function getWorkerGridRow(worker: StaffMember, db: SpreadsheetDatabase): { code: string; isOff: boolean; isCover: boolean }[] {
  const plan = getWorkerWeekPlan(worker, db);
  const byDay = new Map(plan.map((p) => [p.dayEn, p]));
  return ROSTER_CALENDAR_DAYS.map((cal) => {
    const p = byDay.get(cal.dayNameEn);
    if (!p || p.isOff) return { code: 'ছু', isOff: true, isCover: false };
    return { code: postGridCode(p.postKey), isOff: false, isCover: !!p.coveredStaff };
  });
}
