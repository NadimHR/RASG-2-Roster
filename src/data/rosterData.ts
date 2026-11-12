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
}

export interface RoleRoutineRow {
  roleKey: string; // 'G', '1', 'EXT_FRONT', 'EXT_BACK', 'SQUAD_1', 'SQUAD_2', 'SQUAD_3'
  dayEn: string; // 'All' (প্রতিদিন) অথবা নির্দিষ্ট বার: 'Saturday' ... 'Thursday'
  timeBn: string; // '০৭:৩০–০৯:০০'
  workBn: string;
}

export interface SpreadsheetDatabase {
  staffList: StaffMember[];
  roleRoutines?: RoleRoutineRow[]; // Google Sheet ট্যাব: Role_Weekday_Routines
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
    'আকস্মিক ছুটি বা অনুপস্থিতির বিকল্প ব্যবস্থা: কোনো তলার নির্ধারিত কর্মী হঠাৎ অসুস্থ বা অনুপস্থিত থাকলে সহায়ক দলের কর্মী (সরিয়া বেগম / মোসাঃ তাসলিমা খাতুন / নবনিযুক্ত কর্মী) তাৎক্ষণিকভাবে ওই তলার প্রাত্যহিক পরিচ্ছন্নতা ও কক্ষ পরিষ্কারের দায়িত্ব পালন করবেন। কোনো অবস্থাতেই কোনো তলার কাজ অসমাপ্ত থাকবে না।'
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
    auxiliaryResponsibilityBn: '২য় তলার পানির ফিল্টারের বাহ্যিক অংশ পরিষ্কার ও জুতার র‍্যাকের বাইরের অংশ মোছা (সপ্তাহে ১ বার)'
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
    auxiliaryResponsibilityBn: '৩য় তলার পানির ফিল্টারের বাহ্যিক অংশ পরিষ্কার ও জুতার র‍্যাকের বাইরের অংশ মোছা (সপ্তাহে ১ বার)'
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
    auxiliaryResponsibilityBn: '৪র্থ তলার পানির ফিল্টারের বাহ্যিক অংশ পরিষ্কার ও জুতার র‍্যাকের বাইরের অংশ মোছা (সপ্তাহে ১ বার)'
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
    auxiliaryResponsibilityBn: '৫ম তলার পানির ফিল্টারের বাহ্যিক অংশ পরিষ্কার ও জুতার র‍্যাকের বাইরের অংশ মোছা (সপ্তাহে ১ বার)'
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
    auxiliaryResponsibilityBn: '৬ষ্ঠ তলার পানির ফিল্টারের বাহ্যিক অংশ পরিষ্কার ও জুতার র‍্যাকের বাইরের অংশ মোছা (সপ্তাহে ১ বার)'
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
    auxiliaryResponsibilityBn: '৭ম তলার পানির ফিল্টারের বাহ্যিক অংশ পরিষ্কার ও জুতার র‍্যাকের বাইরের অংশ মোছা (সপ্তাহে ১ বার)'
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
    auxiliaryResponsibilityBn: '৮ম তলার পানির ফিল্টারের বাহ্যিক অংশ পরিষ্কার ও জুতার র‍্যাকের বাইরের অংশ মোছা (সপ্তাহে ১ বার)'
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
    auxiliaryResponsibilityBn: '৯ম তলার পানির ফিল্টারের বাহ্যিক অংশ পরিষ্কার ও জুতার র‍্যাকের বাইরের অংশ মোছা (সপ্তাহে ১ বার)'
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
    auxiliaryResponsibilityBn: '১০ম তলার পানির ফিল্টারের বাহ্যিক অংশ পরিষ্কার ও জুতার র‍্যাকের বাইরের অংশ মোছা (সপ্তাহে ১ বার)'
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
    auxiliaryResponsibilityBn: '১১তম তলার পানির ফিল্টারের বাহ্যিক অংশ পরিষ্কার ও জুতার র‍্যাকের বাইরের অংশ মোছা (সপ্তাহে ১ বার)'
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
    auxiliaryResponsibilityBn: '১২তম তলার পানির ফিল্টারের বাহ্যিক অংশ পরিষ্কার ও জুতার র‍্যাকের বাইরের অংশ মোছা (সপ্তাহে ১ বার)'
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
    auxiliaryResponsibilityBn: '১৩তম তলার পানির ফিল্টারের বাহ্যিক অংশ পরিষ্কার ও জুতার র‍্যাকের বাইরের অংশ মোছা (সপ্তাহে ১ বার)'
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
    auxiliaryResponsibilityBn: '১৪তম তলার পানির ফিল্টারের বাহ্যিক অংশ পরিষ্কার ও জুতার র‍্যাকের বাইরের অংশ মোছা (সপ্তাহে ১ বার)'
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
    auxiliaryResponsibilityBn: '১৫তম তলার পানির ফিল্টারের বাহ্যিক অংশ পরিষ্কার ও জুতার র‍্যাকের বাইরের অংশ মোছা (সপ্তাহে ১ বার)'
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
    auxiliaryResponsibilityBn: 'কমন স্পেস, স্টাডি রুম, নামাজের রুম, টিভি রুম, মূল প্রবেশপথ লবি ও গ্রাউন্ড ফ্লোরের পানির ফিল্টার'
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
    auxiliaryResponsibilityBn: 'হলের সামনের প্রাঙ্গণ, বাগান, চলাচলের পথ এবং রবিবার ও বুধবার ১ ঘণ্টা ভবনের বাইরের অংশ ও কমন ডাস্টবিন পরিষ্কার'
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
    auxiliaryResponsibilityBn: 'হলের পেছনের প্রাঙ্গণ, ড্রেনেজ লাইন এবং রবিবার ও বুধবার ১ ঘণ্টা ভবনের বাইরের অংশ ও কমন ডাস্টবিন পরিষ্কার'
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
    auxiliaryResponsibilityBn: 'গ্রাউন্ড হতে ৫ম তলার সকল সিঁড়ি, সকল তলার পানির ফিল্টার পরিষ্কার, ওয়াশরুমের এক্সজস্ট ফ্যান ও জানালা, ৪টি ছাদ (বৃহস্পতিবার ৪০ মি.) ও ক্যান্টিন'
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
    auxiliaryResponsibilityBn: '৬ষ্ঠ হতে ১০ম তলার সকল সিঁড়ি, ওয়াশরুমের জানালা ও এক্সজস্ট ফ্যান (সপ্তাহে ১ বার), বাইরের কমন ডাস্টবিন পরিষ্কারে সহায়তা, ৪টি ছাদ ও ক্যান্টিন'
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
    auxiliaryResponsibilityBn: '১১তম হতে ১৫তম তলার সকল সিঁড়ি, ওয়াশরুমের জানালা ও এক্সজস্ট ফ্যান, আকস্মিক অনুপস্থিত কর্মীর জরুরি বদলি, ৪টি ছাদ ও ক্যান্টিন'
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

export const AUXILIARY_TASKS_LIST: AuxiliaryTaskItem[] = [
  {
    id: 'aux-1',
    taskTitleBn: '১. পানির ফিল্টার নিয়মিত দেখা ও পরিষ্কার করা',
    frequencyBn: 'প্রতিদিন (বাহ্যিক) ও সাপ্তাহিক পূর্ণাঙ্গ পরিষ্কার',
    durationBn: 'প্রতি তলায় ১০–১৫ মিনিট',
    timeSlotBn: 'সকাল ০৭:৩০–০৯:০০ (তলার কর্মী) ও বেলা ১১:৩০–০১:০০ (সহায়ক কর্মী-১)',
    assignedStaffBn: 'সংশ্লিষ্ট তলার কর্মী + সরিয়া বেগম (ID: 760000168)',
    floorsOrZonesBn: 'গ্রাউন্ড ফ্লোর হতে ১৫তম তলা (সকল ১৬টি তলার পানির ফিল্টার)',
    verificationMethodBn: 'সুপারভাইজার কর্তৃক প্রাত্যহিক যাচাই'
  },
  {
    id: 'aux-2',
    taskTitleBn: '২. সিঁড়ি পরিষ্কার (নির্ধারিত তলার সকল সিঁড়ি ও রেলিং)',
    frequencyBn: 'প্রতিদিন (২ বার ঝাড়ু দেওয়া ও ১ বার মোছা)',
    durationBn: 'সকাল ১ ঘণ্টা ৩০ মিনিট ও দুপুর ৪০ মিনিট',
    timeSlotBn: 'সকাল ০৭:৩০–০৯:০০ এবং দুপুর ০২:০০–০২:৪০',
    assignedStaffBn:
      'সরিয়া বেগম (গ্রাউন্ড হতে ৫ম তলার সব সিঁড়ি), মোসাঃ তাসলিমা খাতুন (৬ষ্ঠ হতে ১০ম তলার সব সিঁড়ি), New Cleaner (১১তম হতে ১৫তম তলার সব সিঁড়ি)',
    floorsOrZonesBn: 'গ্রাউন্ড ফ্লোর এবং ১ম হতে ১৫তম তলার উভয় পাশের সকল সিঁড়ি, ল্যান্ডিং ও রেলিং',
    verificationMethodBn: 'সুপারভাইজার প্রাত্যহিক পরিদর্শন'
  },
  {
    id: 'aux-3',
    taskTitleBn: '৩. হলের বাইরের এলাকা (সামনের অংশ ও পেছনের অংশ)',
    frequencyBn: 'প্রতিদিন (সকাল ৭:৩০ – বিকাল ৪:৩০)',
    durationBn: 'প্রাত্যহিক রুটিন অনুযায়ী ২ রাউন্ড',
    timeSlotBn: 'সকাল ০৭:৩০–০৯:০০, ১০:৩০–০১:০০ এবং দুপুর ০২:০০–০৪:০০',
    assignedStaffBn:
      'সামনের অংশ (Front Zone): ইয়াসমিন বেগম (ID: 760000084) | পেছনের অংশ (Back Zone): রুলিয়া খাতুন (ID: 760000177)',
    floorsOrZonesBn: 'হলের সামনের বাগান, মূল ফটক, হাঁটার পথ এবং পেছনের প্রাঙ্গণ ও ড্রেনেজ লাইন',
    verificationMethodBn: 'বহির্ভাগ পরিদর্শন রেজিস্টার'
  },
  {
    id: 'aux-4',
    taskTitleBn: '৪. ভবনের বাইরের অংশ ও কমন ডাস্টবিন পরিষ্কার করা',
    frequencyBn: 'সপ্তাহে অন্তত ২ দিন (প্রতি রবিবার ও বুধবার)',
    durationBn: '১ ঘণ্টা',
    timeSlotBn: 'সকাল ০৯:৩০ – ১০:৩০ (১ ঘণ্টা)',
    assignedStaffBn:
      'ইয়াসমিন বেগম (সামনের অংশ), রুলিয়া খাতুন (পেছনের অংশ) এবং মোসাঃ তাসলিমা খাতুন (সহায়ক কর্মী-২)',
    floorsOrZonesBn: 'ভবনের চারপাশের বাইরের অংশ এবং সকল কমন ডাস্টবিন',
    verificationMethodBn: 'রবিবার ও বুধবার সুপারভাইজার স্বাক্ষর'
  },
  {
    id: 'aux-5',
    taskTitleBn: '৫. প্রতি তলার ২টি ওয়াশরুম জোনের জানালা ও এক্সজস্ট ফ্যান পরিষ্কার',
    frequencyBn: 'সপ্তাহে ১ বার (প্রতি তলায়)',
    durationBn: 'প্রতি তলায় ৪০ মিনিট (২টি ওয়াশরুম জোন)',
    timeSlotBn: 'সকাল ০৯:৩০ – ১১:৩০',
    assignedStaffBn:
      'সরিয়া বেগম, মোসাঃ তাসলিমা খাতুন ও New Cleaner (সহায়ক পরিচ্ছন্নতা দল)',
    floorsOrZonesBn:
      'শনিবার: গ্রাউন্ড, ১ম ও ২য় তলা | রবিবার: ৩য়, ৪র্থ ও ৫ম তলা | সোমবার: ৬ষ্ঠ, ৭ম ও ৮ম তলা | মঙ্গলবার: ৯ম, ১০ম ও ১১তম তলা | বুধবার: ১২তম ও ১৩তম তলা | বৃহস্পতিবার: ১৪তম ও ১৫তম তলা',
    verificationMethodBn: 'ওয়াশরুম পরিদর্শন কার্ড'
  },
  {
    id: 'aux-6',
    taskTitleBn: '৬. জুতার র‍্যাকের বাইরের অংশ পরিষ্কার করা',
    frequencyBn: 'সপ্তাহে ১ বার (প্রতিটি র‍্যাক)',
    durationBn: 'প্রতিটি ৫–১০ মিনিট',
    timeSlotBn: 'বেলা ১১:৫০–১২:০০ এবং দুপুর ১২:২০–১২:৩০ (কক্ষ পরিষ্কারের মধ্যবর্তী ১০ মিনিটের বিরতিতে)',
    assignedStaffBn: 'সংশ্লিষ্ট তলার নিয়মিত পরিচ্ছন্নতাকর্মী (১ম হতে ১৫তম তলা)',
    floorsOrZonesBn: 'প্রতি তলার কক্ষগুলোর বাইরের করিডোরে রাখা জুতার র‍্যাকের বাইরের অংশ (দরজার কার্ডে উল্লেখ থাকবে না)',
    verificationMethodBn: 'করিডোর পরিদর্শন'
  },
  {
    id: 'aux-7',
    taskTitleBn: '৭. ভবনের ৪টি ছাদ পরিষ্কার করা',
    frequencyBn: 'সপ্তাহে ১ দিন (প্রতি বৃহস্পতিবার)',
    durationBn: '৪০ মিনিট',
    timeSlotBn: 'বিকাল ০৩:১০ – ০৩:৫০ (৪০ মিনিট)',
    assignedStaffBn:
      'সরিয়া বেগম (ছাদ-১), মোসাঃ তাসলিমা খাতুন (ছাদ-২) এবং New Cleaner (ছাদ-৩ ও ৪)',
    floorsOrZonesBn: '১৫তম তলার ওপরের ৪টি ছাদ এবং পানি নিষ্কাশন পথ',
    verificationMethodBn: 'বৃহস্পতিবার ছাদ পরিদর্শন রেজিস্টার'
  },
  {
    id: 'aux-8',
    taskTitleBn: '৮. হলের ক্যান্টিন পরিষ্কার করা',
    frequencyBn: 'মাসে ১ দিন (১৫ নভেম্বর ২০২৬, রবিবার)',
    durationBn: '১ ঘণ্টা',
    timeSlotBn: 'দুপুর ০২:০০ – ০৩:০০ (১ ঘণ্টা)',
    assignedStaffBn:
      'সরিয়া বেগম, মোসাঃ তাসলিমা খাতুন, New Cleaner এবং ইয়াসমিন বেগম',
    floorsOrZonesBn: 'ছাত্রী হলের ক্যান্টিন ডাইনিং হল, হাত ধোয়ার বেসিন, জানালা ও ফ্যান',
    verificationMethodBn: 'ক্যান্টিন ও হল সুপারভাইজার স্বাক্ষর'
  }
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

export const ROSTER_CALENDAR_DAYS: RosterCalendarDay[] = (() => {
  const days: RosterCalendarDay[] = [];
  for (let i = 0; i < 30; i++) {
    const isNov = i < 17;
    const dayOfMonth = isNov ? 14 + i : i - 16;
    const monthNum = isNov ? 11 : 12;
    const monthNameBn = isNov ? 'নভেম্বর' : 'ডিসেম্বর';
    const dateIso = `2026-${String(monthNum).padStart(2, '0')}-${String(dayOfMonth).padStart(2, '0')}`;
    const dowIndex = (6 + i) % 7;
    const dayBn = toBengaliNumber(String(dayOfMonth).padStart(2, '0'));
    days.push({
      dayIndex: i + 1,
      dateIso,
      dateDisplayBn: `${dayBn} ${monthNameBn} ২০২৬`,
      dateShortBn: `${dayBn} ${monthNameBn}`,
      dayNameEn: DAY_NAMES_EN[dowIndex],
      dayNameBn: DAY_NAMES_BN[dowIndex],
      weekNumber: Math.floor(i / 7) + 1
    });
  }
  return days;
})();

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

  return ROSTER_CALENDAR_DAYS.map((cal, idx) => {
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
      const starRoom = zones[starIdx];
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
        specialTaskBn:
          cal.dayNameEn === 'Saturday'
            ? 'সকাল ০৯:৩০–১১:৩০: ওয়াশরুমের জানালা ও এক্সজস্ট ফ্যান পরিষ্কার'
            : 'মূল প্রবেশপথ লবি, অভ্যর্থনা কক্ষ ও পানির ফিল্টারের বাহ্যিক অংশ পরিষ্কার'
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
        specialTaskBn:
          cal.dayNameEn === 'Saturday'
            ? 'ওয়াশরুম জোনের জানালা ও এক্সজস্ট ফ্যান পরিষ্কার'
            : `জুতার র‍্যাকের বাইরের অংশ (কক্ষ ১০${toBengaliNumber(((idx % 7) * 2) + 1)}–১০${toBengaliNumber(Math.min(14, ((idx % 7) * 2) + 2))})`
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
          isDustbinDay ? 'ভবনের বাইরের অংশ ও কমন ডাস্টবিন (১ ঘণ্টা)' : `${zoneLabel}: ড্রেনেজ ও প্রাঙ্গণ`,
          'কমন ডাস্টবিন খালি ও জীবাণুমুক্তকরণ'
        ],
        starRoom: `${zoneLabel}: মূল ফটক, নামফলক ও ল্যাম্পপোস্ট পরিষ্কার`,
        isWeeklyOff: false,
        activeWorkerNameBn: worker.nameBn,
        activeWorkerId: worker.employeeId,
        substituteNoteBn: 'নিয়মিত বহির্ভাগ দায়িত্ব',
        specialTaskBn: isDustbinDay
          ? 'সকাল ০৯:৩০–১০:৩০: ১ ঘণ্টা ভবনের বাইরের অংশ ও কমন ডাস্টবিন পরিষ্কার'
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

    const washroomFanFloorsByDay: Record<string, string> = {
      Saturday: 'গ্রাউন্ড, ১ম ও ২য় তলা',
      Sunday: '৩য়, ৪র্থ ও ৫ম তলা',
      Monday: '৬ষ্ঠ, ৭ম ও ৮ম তলা',
      Tuesday: '৯ম, ১০ম ও ১১তম তলা',
      Wednesday: '১২তম ও ১৩তম তলা',
      Thursday: '১৪তম ও ১৫তম তলা'
    };

    const isCanteenDay = cal.dateIso === '2026-11-15';
    const isRoofDay = cal.dayNameEn === 'Thursday';
    const isDustbinDay = (cal.dayNameEn === 'Sunday' || cal.dayNameEn === 'Wednesday') && worker.floorKey === 'SQUAD_2';

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
        stairRange,
        `ওয়াশরুমের জানালা ও এক্সজস্ট ফ্যান (${washroomFanFloorsByDay[cal.dayNameEn] || ''})`,
        worker.floorKey === 'SQUAD_1'
          ? 'পানির ফিল্টার পরিষ্কার (৩টি তলা)'
          : isDustbinDay
          ? 'বাইরের কমন ডাস্টবিন পরিষ্কার (১ ঘণ্টা)'
          : 'সিঁড়ির রেলিং ও করিডোরের জানালা পরিষ্কার'
      ],
      starRoom: isCanteenDay
        ? 'ক্যান্টিন পরিষ্কার (১ ঘণ্টা)'
        : isRoofDay
        ? '৪টি ছাদ পরিষ্কার (৪০ মিনিট)'
        : `${washroomFanFloorsByDay[cal.dayNameEn] || ''} ফ্যান ও জানালা পরিষ্কার`,
      isWeeklyOff: false,
      activeWorkerNameBn: worker.nameBn,
      activeWorkerId: worker.employeeId,
      substituteNoteBn: 'নিয়মিত সহায়ক পরিচ্ছন্নতা রুটিন',
      specialTaskBn: isCanteenDay
        ? 'দুপুর ০২:০০–০৩:০০: হলের ক্যান্টিন ১ ঘণ্টা পরিষ্কার'
        : isRoofDay
        ? 'বিকাল ০৩:১০–০৩:৫০: ভবনের ৪টি ছাদ ৪০ মিনিট পরিষ্কার'
        : `${stairRange} ও ওয়াশরুমের এক্সজস্ট ফ্যান পরিষ্কার`
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
  actionType: 'master' | 'worker' | 'floor_doors' | 'all_workers' | 'auxiliary';
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
    pageFormatBn: 'A4 পোর্ট্রেট (গ্রে-স্কেল)',
    directUrl: `${cleanBase}/?view=master&print=true`,
    actionType: 'master',
    targetId: 'all'
  });

  list.push({
    sl: sl++,
    categoryBn: 'সকল কর্মীর একত্রে শিডিউল',
    titleBn: `সকল কর্মীর ব্যক্তিগত শিডিউল একত্রে (${toBengaliNumber(staffList.length)} জন)`,
    targetCode: 'WORKERS-ALL',
    pageFormatBn: 'A4 গ্রে-স্কেল: তলার কর্মী ২ পৃষ্ঠা, অন্যান্য কর্মী বারভিত্তিক পাতা',
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
      pageFormatBn: isDayWiseWorker(s)
        ? 'A4: ১ পাতা সাপ্তাহিক সারাংশ + প্রতিটি কর্মদিবসের আলাদা পাতা'
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
  SQUAD_3: 'সহায়ক কর্মী-৩ (১১তম–১৫তম তলার সিঁড়ি)'
};

const N = 'নাস্তার বিরতি';
const L = 'নামাজ ও দুপুরের খাবারের বিরতি';
const R = (roleKey: string, dayEn: string, timeBn: string, workBn: string): RoleRoutineRow => ({
  roleKey,
  dayEn,
  timeBn,
  workBn
});

const WASHROOM_WINDOW_FLOORS: [string, string][] = [
  ['Saturday', 'গ্রাউন্ড, ১ম ও ২য় তলা'],
  ['Sunday', '৩য়, ৪র্থ ও ৫ম তলা'],
  ['Monday', '৬ষ্ঠ, ৭ম ও ৮ম তলা'],
  ['Tuesday', '৯ম, ১০ম ও ১১তম তলা'],
  ['Wednesday', '১২তম ও ১৩তম তলা'],
  ['Thursday', '১৪তম ও ১৫তম তলা']
];

function squadRows(key: string, stairs: string, midday: string, roof: string): RoleRoutineRow[] {
  const rows: RoleRoutineRow[] = [
    R(key, 'All', '০৭:৩০–০৯:০০', `${stairs}র সকল সিঁড়ি ও রেলিং ঝাড়ু দেওয়া ও মোছা`),
    R(key, 'All', '০৯:০০–০৯:৩০', N),
    R(key, 'All', '১১:৩০–০১:০০', midday),
    R(key, 'All', '০১:০০–০২:০০', L),
    R(key, 'All', '০২:০০–০৩:১০', `${stairs}র সকল সিঁড়ি দ্বিতীয়বার দেখা ও পরিষ্কার করা`),
    R(key, 'All', '০৩:১০–০৪:০০', 'সুপারভাইজারের নির্দেশ অনুযায়ী তলার কর্মীদের ভারী কাজে সহায়তা'),
    R(key, 'Thursday', '০৩:১০–০৪:০০', `${roof} পরিষ্কার (০৩:১০–০৩:৫০, ৪০ মিনিট)`),
    R(key, 'All', '০৪:০০–০৪:৩০', 'সিঁড়ি শেষবার দেখা, সরঞ্জাম ধুয়ে গুছিয়ে রাখা ও সুপারভাইজারকে রিপোর্ট করা')
  ];
  WASHROOM_WINDOW_FLOORS.forEach(([day, floors]) => {
    if (key === 'SQUAD_2' && (day === 'Sunday' || day === 'Wednesday')) {
      rows.push(R(key, day, '০৯:৩০–১০:৩০', 'ভবনের বাইরের কমন ডাস্টবিন পরিষ্কারে সহায়তা (১ ঘণ্টা)'));
      rows.push(R(key, day, '১০:৩০–১১:৩০', `${floors}র ওয়াশরুম জোনের জানালা ও এক্সজস্ট ফ্যান পরিষ্কার`));
    } else {
      rows.push(R(key, day, '০৯:৩০–১১:৩০', `${floors}র ওয়াশরুম জোনের জানালা ও এক্সজস্ট ফ্যান পরিষ্কার`));
    }
  });
  return rows;
}

function extRows(key: string, zone: string, morning: string, wash: string, afternoon: string): RoleRoutineRow[] {
  return [
    R(key, 'All', '০৭:৩০–০৯:০০', morning),
    R(key, 'All', '০৯:০০–০৯:৩০', N),
    R(key, 'All', '০৯:৩০–১০:৩০', `${zone}র ড্রেন ও সীমানাপ্রাচীর সংলগ্ন পথ পরিষ্কার`),
    R(key, 'Sunday', '০৯:৩০–১০:৩০', 'ভবনের বাইরের অংশ ও কমন ডাস্টবিন ধুয়ে পরিষ্কার (১ ঘণ্টা)'),
    R(key, 'Wednesday', '০৯:৩০–১০:৩০', 'ভবনের বাইরের অংশ ও কমন ডাস্টবিন ধুয়ে পরিষ্কার (১ ঘণ্টা)'),
    R(key, 'All', '১০:৩০–১১:৩০', wash),
    R(key, 'All', '১১:৩০–০১:০০', 'কমন ডাস্টবিনের ময়লা সরানো, ব্লিচিং পাউডার ছিটানো এবং বাইরের বসার স্থান পরিষ্কার'),
    R(key, 'All', '০১:০০–০২:০০', L),
    R(key, 'All', '০২:০০–০৩:১০', `${zone} দ্বিতীয়বার ঝাড়ু দেওয়া এবং কমন ডাস্টবিন আবার দেখা`),
    R(key, 'All', '০৩:১০–০৪:০০', afternoon),
    R(key, 'All', '০৪:০০–০৪:৩০', 'ডাস্টবিনের ঢাকনা বন্ধ আছে কি না দেখা, সরঞ্জাম ধুয়ে রাখা ও সুপারভাইজারকে রিপোর্ট করা')
  ];
}

export const DEFAULT_ROLE_ROUTINES: RoleRoutineRow[] = [
  // গ্রাউন্ড ফ্লোর
  R('G', 'All', '০৭:৩০–০৯:০০', 'টাস্ক ১: মূল প্রবেশপথের লবি ও অভ্যর্থনা করিডোরের ময়লার ঝুড়ি ও বালতি পরিষ্কার, মেঝে ঝাড়ু দেওয়া ও মোছা'),
  R('G', 'All', '০৯:০০–০৯:৩০', N),
  R('G', 'All', '০৯:৩০–১১:৩০', 'টাস্ক ২: ২টি ওয়াশরুম জোন ও অজুখানা হারপিক ও পরিচ্ছন্নতা সামগ্রী দিয়ে পরিষ্কার'),
  R('G', 'All', '১১:৩০–০১:০০', 'মাসিক সূচির ৩টি কক্ষ (কমন স্পেস / স্টাডি রুম / নামাজের রুম / টিভি রুম) — প্রতিটি ২০ মিনিট; প্রতিটির পর ১০ মিনিট ওয়াশরুম জোন দেখা'),
  R('G', 'All', '০১:০০–০২:০০', L),
  R('G', 'All', '০২:০০–০৩:১০', '২টি ওয়াশরুম জোন শুধু পানি দিয়ে ধোয়া এবং মূল করিডোর আবার ঝাড়ু দেওয়া ও ঝুড়ি খালি করা'),
  R('G', 'All', '০৩:১০–০৪:০০', '★ চিহ্নিত কক্ষের সকল ফ্যান ও জানালা পরিষ্কার এবং মেঝে ঝাড়ু দেওয়া ও মোছা'),
  R('G', 'All', '০৪:০০–০৪:৩০', 'ওয়াশরুম জোন শেষবার দেখা, সরঞ্জাম ধুয়ে গুছিয়ে রাখা ও সুপারভাইজারকে রিপোর্ট করা'),
  // ১ম তলা
  R('1', 'All', '০৭:৩০–০৯:০০', 'টাস্ক ১: করিডোরের ময়লার ঝুড়ি ও বালতি পরিষ্কার, ঝাড়ু দেওয়া ও মোছা এবং ৪টি অফিসের সামনের লবি পরিষ্কার'),
  R('1', 'All', '০৯:০০–০৯:৩০', N),
  R('1', 'All', '০৯:৩০–১১:৩০', 'টাস্ক ২: ২টি ওয়াশরুম জোন হারপিক ও পরিচ্ছন্নতা সামগ্রী দিয়ে পরিষ্কার'),
  R('1', 'All', '১১:৩০–১১:৫০', 'মাসিক সূচির ১টি আবাসিক কক্ষ বারান্দাসহ ঝাড়ু দেওয়া ও মোছা'),
  R('1', 'All', '১১:৫০–১২:০০', 'ওয়াশরুম জোন দেখা এবং জুতার র‍্যাকের বাইরের অংশ মোছা'),
  R('1', 'All', '১২:০০–১২:২০', 'অফিস-১০১ ও অফিস-১০২ ঝাড়ু দেওয়া, মোছা ও আসবাবপত্র পরিষ্কার'),
  R('1', 'All', '১২:২০–১২:৩০', 'ওয়াশরুম জোন দেখা ও জরুরি কাজ'),
  R('1', 'All', '১২:৩০–১২:৫০', 'অফিস-১০৩, অফিস-১০৪ ও লবি ঝাড়ু দেওয়া, মোছা ও কাচের দরজা পরিষ্কার'),
  R('1', 'All', '১২:৫০–০১:০০', 'ওয়াশরুম জোন দেখা এবং রক্ষণাবেক্ষণ কাজ চললে তদারকি'),
  R('1', 'All', '০১:০০–০২:০০', L),
  R('1', 'All', '০২:০০–০৩:১০', 'ওয়াশরুম জোন পানি দিয়ে ধোয়া এবং করিডোরের ঝুড়ি খালি করা ও আবার ঝাড়ু দেওয়া'),
  R('1', 'All', '০৩:১০–০৪:০০', '★ চিহ্নিত ১টি আবাসিক কক্ষের সকল ফ্যান ও জানালা পরিষ্কার এবং বারান্দাসহ মেঝে ঝাড়ু দেওয়া ও মোছা'),
  R('1', 'All', '০৪:০০–০৪:৩০', 'ওয়াশরুম জোন শেষবার দেখা, সরঞ্জাম ধুয়ে গুছিয়ে রাখা ও সুপারভাইজারকে রিপোর্ট করা'),
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
  // সহায়ক কর্মী
  ...squadRows('SQUAD_1', 'গ্রাউন্ড হতে ৫ম তলা', 'সকল তলার পানির ফিল্টার দেখা ও বাইরের অংশ পরিষ্কার', 'ছাদ-১'),
  ...squadRows('SQUAD_2', '৬ষ্ঠ হতে ১০ম তলা', '৬ষ্ঠ–১০ম তলার করিডোরের জানালা ও অগ্নিনির্বাপক বক্স মোছা', 'ছাদ-২'),
  ...squadRows('SQUAD_3', '১১তম হতে ১৫তম তলা', '১১তম–১৫তম তলার করিডোরের জানালা ও অগ্নিনির্বাপক বক্স মোছা', 'ছাদ-৩ ও ছাদ-৪')
];

function bnTimeToMinutes(t: string): number {
  const en = t.replace(/[০-৯]/g, (d) => String('০১২৩৪৫৬৭৮৯'.indexOf(d)));
  const m = en.match(/(\d{1,2})[:.](\d{2})/);
  if (!m) return 9999;
  let h = Number(m[1]);
  if (h < 7) h += 12;
  return h * 60 + Number(m[2]);
}

export function isBreakText(work: string): boolean {
  return work.includes('বিরতি');
}

/** কোনো পদের (roleKey) নির্দিষ্ট বারের রুটিন — শিটের 'All' সারি + ওই বারের সারি মিলিয়ে */
export function getRoleRoutineForDay(db: SpreadsheetDatabase, roleKey: string, dayEn: string): { timeBn: string; workBn: string }[] {
  const all = (db.roleRoutines && db.roleRoutines.length ? db.roleRoutines : DEFAULT_ROLE_ROUTINES).filter(
    (r) => r.roleKey === roleKey
  );
  const base = all.filter((r) => r.dayEn === 'All' || r.dayEn === '' || r.dayEn === 'প্রতিদিন');
  const special = all.filter((r) => r.dayEn === dayEn || DAY_EN_BY_BN[r.dayEn] === dayEn);
  const map = new Map<string, { timeBn: string; workBn: string }>();
  base.forEach((r) => map.set(r.timeBn.trim(), { timeBn: r.timeBn, workBn: r.workBn }));
  special.forEach((r) => map.set(r.timeBn.trim(), { timeBn: r.timeBn, workBn: r.workBn }));
  // একই সময়ের আংশিক মিল (যেমন ০৯:৩০–১০:৩০ ও ০৯:৩০–১১:৩০) থাকলে নির্দিষ্ট বারের সারিটিই রাখা হয়
  const rows = [...map.values()];
  const specialStarts = new Set(special.map((r) => bnTimeToMinutes(r.timeBn)));
  const filtered = rows.filter(
    (r) => !specialStarts.has(bnTimeToMinutes(r.timeBn)) || special.some((s) => s.timeBn.trim() === r.timeBn.trim())
  );
  return filtered.sort((a, b) => bnTimeToMinutes(a.timeBn) - bnTimeToMinutes(b.timeBn));
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
