// Mock visitor log data
export const visitorLogs = [
  { id: 1, date: '10-11-2025', timeIn: '1:30 PM', timeOut: '3:30 PM',  name: 'Chester Field',    address: 'Brgy. Maestrang Kikay, Talavera NE.',    destination: 'Registrar',  purpose: 'TOR',                 isActive: false },
  { id: 2, date: '10-11-2025', timeIn: '10:30 AM', timeOut: null,       name: 'Angelo Cruz',      address: 'Brgy. Tibagan, Talavera NE.',             destination: 'Accounting', purpose: 'Payment',             isActive: true  },
  { id: 3, date: '10-11-2025', timeIn: '9:00 AM',  timeOut: '1:00 PM',  name: 'John Marston',     address: 'Brgy. Bantug, Cabanatuan NE.',            destination: 'Registrar',  purpose: 'TOR',                 isActive: false },
  { id: 4, date: '10-11-2025', timeIn: '9:30 AM',  timeOut: '4:00 PM',  name: 'Arthur Morgan',    address: 'Brgy. Sumacab, Cabanatuan NE.',           destination: 'Faculty',    purpose: 'Enrollment',          isActive: false },
  { id: 5, date: '10-11-2025', timeIn: '9:45 AM',  timeOut: '4:40 PM',  name: 'Mark Garcia',      address: 'Brgy. San Vicente, Gapan City NE.',       destination: 'Accounting', purpose: 'Payment',             isActive: false },
  { id: 6, date: '10-11-2025', timeIn: '9:45 AM',  timeOut: '4:40 PM',  name: 'John Goma',        address: 'Brgy. Caballero, Palayan City NE.',        destination: 'OSA',        purpose: 'ID/Document Request', isActive: false },
  { id: 7, date: '10-11-2025', timeIn: '1:30 PM',  timeOut: null,       name: 'Carl James Gose',  address: 'Brgy. Tibagan, Talavera NE.',             destination: 'Registrar',  purpose: 'TOR',                 isActive: true  },
  { id: 8, date: '10-11-2025', timeIn: '8:00 AM',  timeOut: '12:30 PM', name: 'Camel Doe',        address: 'Brgy. Tibagan, Talavera NE.',             destination: 'Accounting', purpose: 'Payment',             isActive: false },
  { id: 9, date: '10-10-2025', timeIn: '9:30 AM',  timeOut: '1:00 PM',  name: 'John Marston',     address: 'Brgy. Bantug, Cabanatuan NE.',            destination: 'Registrar',  purpose: 'TOR',                 isActive: false },
  { id: 10, date: '10-10-2025', timeIn: '9:00 AM', timeOut: '4:00 PM',  name: 'Arthur Morgan',    address: 'Brgy. Sumacab, Cabanatuan NE.',           destination: 'Faculty',    purpose: 'Enrollment',          isActive: false },
  { id: 11, date: '10-10-2025', timeIn: '11:00 AM',timeOut: '4:40 PM',  name: 'Mark Garcia',      address: 'Brgy. San Vicente, Gapan City NE.',       destination: 'Accounting', purpose: 'Payment',             isActive: false },
  { id: 12, date: '10-9-2025',  timeIn: '11:00 AM',timeOut: '4:40 PM',  name: 'John Goma',        address: 'Brgy. Caballero, Palayan City NE.',        destination: 'OSA',        purpose: 'ID/Document Request', isActive: false },
  { id: 13, date: '10-9-2025',  timeIn: '10:40 AM',timeOut: '1:30 PM',  name: 'Lester Santos',    address: 'Brgy. Bantug, Cabanatuan City NE.',       destination: 'Faculty',    purpose: 'Enrollment',          isActive: false },
  { id: 14, date: '10-9-2025',  timeIn: '10:35 AM',timeOut: '2:20 PM',  name: 'Sarah Discaya',    address: 'Brgy. Caimito, Palayan City NE.',         destination: 'OSA',        purpose: 'ID/Document Request', isActive: false },
  { id: 15, date: '10-9-2025',  timeIn: '10:35 AM',timeOut: '4:10 PM',  name: 'Mark Garcia',      address: 'Brgy. San Isidro, Cabanatuan City NE.',  destination: 'Registrar',  purpose: 'TOR',                 isActive: false },
  { id: 16, date: '10-9-2025',  timeIn: '10:31 AM',timeOut: '3:30 PM',  name: 'Abigail Roberts',  address: 'Brgy. Luna, Sta. Rosa NE.',              destination: 'Accounting', purpose: 'Payment',             isActive: false },
  { id: 17, date: '10-8-2025',  timeIn: '10:30 AM',timeOut: '2:00 PM',  name: 'Bryce Hernadez',   address: 'Brgy. Caimito, Palayan City NE',          destination: 'Accounting', purpose: 'Enrollment',          isActive: false },
  { id: 18, date: '10-8-2025',  timeIn: '9:36 AM', timeOut: '1:00 PM',  name: 'Abella Rhodes',    address: 'Brgy. Sta Arcadia, Cabanatuan City NE.', destination: 'Registrar',  purpose: 'ID/Document Request', isActive: false },
  { id: 19, date: '10-8-2025',  timeIn: '9:30 AM', timeOut: '2:00 PM',  name: 'Roberto Doe',      address: 'Brgy. Cabu, Cabanatuan City NE.',        destination: 'Accounting', purpose: 'Enrollment',          isActive: false },
  { id: 20, date: '10-8-2025',  timeIn: '9:00 AM', timeOut: '12:00 PM', name: 'Robert William',   address: 'Brgy. Mabini Ext, Cab City NE.',         destination: 'Registrar',  purpose: 'Payment',             isActive: false },
  { id: 21, date: '09-30-2025', timeIn: '8:30 AM', timeOut: '2:00 PM',  name: 'Erik Martin',      address: 'Brgy. Magsaysay Norte, Cab City NE.',    destination: 'Registrar',  purpose: 'ID/Document Request', isActive: false },
  { id: 22, date: '09-30-2025', timeIn: '7:30 AM', timeOut: '5:00 PM',  name: 'John Doe',         address: 'Brgy. Luna, Sta. Rosa NE.',              destination: 'Accounting', purpose: 'Payment',             isActive: false },
];

// VIP visitors (subset)
export const vipVisitors = [
  { id: 1, date: '10-11-2025', name: 'Angelo Cruz',     destination: 'Registrar', timeIn: '10:30 am' },
  { id: 2, date: '10-11-25',   name: 'Carl James Gose', destination: 'Registrar', timeIn: '1:30 pm'  },
];

// VIP Queue (Expected VIPs/Cars)
export const vipQueue = [
  { id: 101, date: '10-20-2025', name: 'Mayor Cruz', plate: '', destination: 'President\'s Office', addedBy: 'Admin' }
];

// Currently in-campus (active)
export const inCampus = [
  { id: 1, date: '10-11-2025', name: 'Angelo Cruz',     destination: 'Registrar', timeIn: '10:30 am' },
  { id: 2, date: '10-11-25',   name: 'Carl James Gose', destination: 'Registrar', timeIn: '1:30 pm'  },
];

// Guards data
export const initialGuards = [
  { id: 1, name: 'Leo Rivera',        guardId: '09-08-7',   password: 'guard123' },
  { id: 2, name: 'Kristine Joy Luis', guardId: '113-264-17',password: 'guard123' },
  { id: 3, name: 'James Roque',       guardId: '773-344-42',password: 'guard123' },
  { id: 4, name: 'Jose Joseph',       guardId: '221-342-54',password: 'guard123' },
  { id: 5, name: 'Michael Santos',    guardId: '751-488-12',password: 'guard123' },
];

export const DESTINATIONS = ['Registrar', 'Accounting', 'Faculty', 'OSA', 'Library', 'VPAA Office', 'President\'s Office', 'Guidance Office', 'Clinic', 'Other'];
export const PURPOSES = ['TOR', 'Payment', 'Enrollment', 'ID/Document Request', 'Meeting', 'Visit', 'Delivery', 'Other'];

export const ADMIN_USER = {
  id: 'admin',
  password: 'admin123',
  name: 'Gerald Santos',
  role: 'admin',
};
