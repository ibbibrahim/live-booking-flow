export interface CrewMember {
  name: string;
  role: string;
  department: string;
  contactNumber?: string;
  email?: string;
}

export interface CallSheet {
  id: string;
  title: string;
  program: string;
  date: string;
  callTime: string;
  wrapTime: string;
  location: string;
  status: 'Completed' | 'In Progress' | 'Scheduled' | 'Cancelled';
  crew: CrewMember[];
  sceneNumbers: string[];
  productionNotes?: string;
  weather?: string;
  crewSize: number;
  duration: number; // in hours
}

export const mockCallSheets: CallSheet[] = [
  {
    id: 'CS-001',
    title: 'Morning News - Episode 245',
    program: 'Morning Show',
    date: '2025-01-15',
    callTime: '05:00',
    wrapTime: '10:00',
    location: 'Studio A - Main Set',
    status: 'Completed',
    crewSize: 15,
    duration: 5,
    sceneNumbers: ['1A', '1B', '2A'],
    weather: 'Clear',
    crew: [
      { name: 'Sarah Johnson', role: 'Producer', department: 'Production', contactNumber: '+971-50-123-4567', email: 'sarah.j@channel.com' },
      { name: 'Michael Chen', role: 'Director', department: 'Production', contactNumber: '+971-50-234-5678', email: 'michael.c@channel.com' },
      { name: 'Ahmed Al Mansoori', role: 'Camera Operator', department: 'Camera', contactNumber: '+971-50-345-6789', email: 'ahmed.m@channel.com' },
      { name: 'Fatima Hassan', role: 'Camera Operator', department: 'Camera', contactNumber: '+971-50-456-7890', email: 'fatima.h@channel.com' },
      { name: 'James Martinez', role: 'Audio Engineer', department: 'Sound', contactNumber: '+971-50-567-8901', email: 'james.m@channel.com' },
      { name: 'Layla Ibrahim', role: 'Lighting Technician', department: 'Lighting', contactNumber: '+971-50-678-9012', email: 'layla.i@channel.com' },
      { name: 'David Park', role: 'Grip', department: 'Grip & Electric', contactNumber: '+971-50-789-0123', email: 'david.p@channel.com' },
      { name: 'Maria Garcia', role: 'Makeup Artist', department: 'Hair & Makeup', contactNumber: '+971-50-890-1234', email: 'maria.g@channel.com' },
      { name: 'Omar Khalid', role: 'Production Assistant', department: 'Production', contactNumber: '+971-50-901-2345', email: 'omar.k@channel.com' },
      { name: 'Jennifer Williams', role: 'Script Supervisor', department: 'Production', contactNumber: '+971-50-012-3456', email: 'jennifer.w@channel.com' },
      { name: 'Ali Mohammed', role: 'Gaffer', department: 'Lighting', contactNumber: '+971-50-123-7890', email: 'ali.m@channel.com' },
      { name: 'Sophie Anderson', role: 'Sound Mixer', department: 'Sound', contactNumber: '+971-50-234-8901', email: 'sophie.a@channel.com' },
      { name: 'Hassan Rashid', role: 'Camera Assistant', department: 'Camera', contactNumber: '+971-50-345-9012', email: 'hassan.r@channel.com' },
      { name: 'Emma Thompson', role: 'Production Coordinator', department: 'Production', contactNumber: '+971-50-456-0123', email: 'emma.t@channel.com' },
      { name: 'Youssef Ali', role: 'Assistant Director', department: 'Production', contactNumber: '+971-50-567-1234', email: 'youssef.a@channel.com' },
    ],
  },
  {
    id: 'CS-002',
    title: 'Evening News - Special Report',
    program: 'Evening News',
    date: '2025-01-15',
    callTime: '17:00',
    wrapTime: '22:00',
    location: 'Studio B - News Desk',
    status: 'Completed',
    crewSize: 12,
    duration: 5,
    sceneNumbers: ['3A', '3B', '4A', '4B'],
    weather: 'Partly Cloudy',
    crew: [
      { name: 'Sarah Johnson', role: 'Producer', department: 'Production', contactNumber: '+971-50-123-4567', email: 'sarah.j@channel.com' },
      { name: 'Dr. Samira Patel', role: 'Director', department: 'Production', contactNumber: '+971-50-678-2345', email: 'samira.p@channel.com' },
      { name: 'Michael Chen', role: 'Camera Operator', department: 'Camera', contactNumber: '+971-50-234-5678', email: 'michael.c@channel.com' },
      { name: 'James Martinez', role: 'Audio Engineer', department: 'Sound', contactNumber: '+971-50-567-8901', email: 'james.m@channel.com' },
      { name: 'Fatima Hassan', role: 'Camera Operator', department: 'Camera', contactNumber: '+971-50-456-7890', email: 'fatima.h@channel.com' },
      { name: 'Ali Mohammed', role: 'Gaffer', department: 'Lighting', contactNumber: '+971-50-123-7890', email: 'ali.m@channel.com' },
      { name: 'Layla Ibrahim', role: 'Lighting Technician', department: 'Lighting', contactNumber: '+971-50-678-9012', email: 'layla.i@channel.com' },
      { name: 'Omar Khalid', role: 'Production Assistant', department: 'Production', contactNumber: '+971-50-901-2345', email: 'omar.k@channel.com' },
      { name: 'Sophie Anderson', role: 'Sound Mixer', department: 'Sound', contactNumber: '+971-50-234-8901', email: 'sophie.a@channel.com' },
      { name: 'Emma Thompson', role: 'Production Coordinator', department: 'Production', contactNumber: '+971-50-456-0123', email: 'emma.t@channel.com' },
      { name: 'David Park', role: 'Grip', department: 'Grip & Electric', contactNumber: '+971-50-789-0123', email: 'david.p@channel.com' },
      { name: 'Hassan Rashid', role: 'Camera Assistant', department: 'Camera', contactNumber: '+971-50-345-9012', email: 'hassan.r@channel.com' },
    ],
  },
  {
    id: 'CS-003',
    title: 'Weekend Edition - Interview Special',
    program: 'Weekend Edition',
    date: '2025-01-13',
    callTime: '09:00',
    wrapTime: '15:00',
    location: 'Studio C - Interview Set',
    status: 'Completed',
    crewSize: 10,
    duration: 6,
    sceneNumbers: ['5A', '5B'],
    weather: 'Sunny',
    crew: [
      { name: 'Michael Chen', role: 'Producer', department: 'Production', contactNumber: '+971-50-234-5678', email: 'michael.c@channel.com' },
      { name: 'Jennifer Williams', role: 'Director', department: 'Production', contactNumber: '+971-50-012-3456', email: 'jennifer.w@channel.com' },
      { name: 'Ahmed Al Mansoori', role: 'Camera Operator', department: 'Camera', contactNumber: '+971-50-345-6789', email: 'ahmed.m@channel.com' },
      { name: 'Sophie Anderson', role: 'Audio Engineer', department: 'Sound', contactNumber: '+971-50-234-8901', email: 'sophie.a@channel.com' },
      { name: 'Ali Mohammed', role: 'Lighting Technician', department: 'Lighting', contactNumber: '+971-50-123-7890', email: 'ali.m@channel.com' },
      { name: 'Maria Garcia', role: 'Makeup Artist', department: 'Hair & Makeup', contactNumber: '+971-50-890-1234', email: 'maria.g@channel.com' },
      { name: 'Omar Khalid', role: 'Production Assistant', department: 'Production', contactNumber: '+971-50-901-2345', email: 'omar.k@channel.com' },
      { name: 'David Park', role: 'Grip', department: 'Grip & Electric', contactNumber: '+971-50-789-0123', email: 'david.p@channel.com' },
      { name: 'Youssef Ali', role: 'Assistant Director', department: 'Production', contactNumber: '+971-50-567-1234', email: 'youssef.a@channel.com' },
      { name: 'Hassan Rashid', role: 'Camera Assistant', department: 'Camera', contactNumber: '+971-50-345-9012', email: 'hassan.r@channel.com' },
    ],
  },
  {
    id: 'CS-004',
    title: 'Special Report - Technology Summit',
    program: 'Special Report',
    date: '2025-01-14',
    callTime: '08:00',
    wrapTime: '18:00',
    location: 'Convention Center - Hall A',
    status: 'Completed',
    crewSize: 18,
    duration: 10,
    sceneNumbers: ['6A', '6B', '6C', '7A'],
    weather: 'Clear',
    crew: [
      { name: 'Dr. Samira Patel', role: 'Producer', department: 'Production', contactNumber: '+971-50-678-2345', email: 'samira.p@channel.com' },
      { name: 'Sarah Johnson', role: 'Director', department: 'Production', contactNumber: '+971-50-123-4567', email: 'sarah.j@channel.com' },
      { name: 'Ahmed Al Mansoori', role: 'Camera Operator', department: 'Camera', contactNumber: '+971-50-345-6789', email: 'ahmed.m@channel.com' },
      { name: 'Fatima Hassan', role: 'Camera Operator', department: 'Camera', contactNumber: '+971-50-456-7890', email: 'fatima.h@channel.com' },
      { name: 'Michael Chen', role: 'Camera Operator', department: 'Camera', contactNumber: '+971-50-234-5678', email: 'michael.c@channel.com' },
      { name: 'James Martinez', role: 'Audio Engineer', department: 'Sound', contactNumber: '+971-50-567-8901', email: 'james.m@channel.com' },
      { name: 'Sophie Anderson', role: 'Sound Mixer', department: 'Sound', contactNumber: '+971-50-234-8901', email: 'sophie.a@channel.com' },
      { name: 'Ali Mohammed', role: 'Gaffer', department: 'Lighting', contactNumber: '+971-50-123-7890', email: 'ali.m@channel.com' },
      { name: 'Layla Ibrahim', role: 'Lighting Technician', department: 'Lighting', contactNumber: '+971-50-678-9012', email: 'layla.i@channel.com' },
      { name: 'David Park', role: 'Grip', department: 'Grip & Electric', contactNumber: '+971-50-789-0123', email: 'david.p@channel.com' },
      { name: 'Maria Garcia', role: 'Makeup Artist', department: 'Hair & Makeup', contactNumber: '+971-50-890-1234', email: 'maria.g@channel.com' },
      { name: 'Omar Khalid', role: 'Production Assistant', department: 'Production', contactNumber: '+971-50-901-2345', email: 'omar.k@channel.com' },
      { name: 'Jennifer Williams', role: 'Script Supervisor', department: 'Production', contactNumber: '+971-50-012-3456', email: 'jennifer.w@channel.com' },
      { name: 'Emma Thompson', role: 'Production Coordinator', department: 'Production', contactNumber: '+971-50-456-0123', email: 'emma.t@channel.com' },
      { name: 'Youssef Ali', role: 'Assistant Director', department: 'Production', contactNumber: '+971-50-567-1234', email: 'youssef.a@channel.com' },
      { name: 'Hassan Rashid', role: 'Camera Assistant', department: 'Camera', contactNumber: '+971-50-345-9012', email: 'hassan.r@channel.com' },
      { name: 'Nina Kowalski', role: 'Production Assistant', department: 'Production', contactNumber: '+971-50-678-3456', email: 'nina.k@channel.com' },
      { name: 'Carlos Rodriguez', role: 'Grip', department: 'Grip & Electric', contactNumber: '+971-50-789-4567', email: 'carlos.r@channel.com' },
    ],
  },
  {
    id: 'CS-005',
    title: 'Documentary Series - Episode 3',
    program: 'Documentary Series',
    date: '2025-01-12',
    callTime: '06:00',
    wrapTime: '20:00',
    location: 'Desert Location - Al Ain',
    status: 'Completed',
    crewSize: 14,
    duration: 14,
    sceneNumbers: ['8A', '8B', '9A'],
    weather: 'Hot & Sunny',
    crew: [
      { name: 'Jennifer Williams', role: 'Producer', department: 'Production', contactNumber: '+971-50-012-3456', email: 'jennifer.w@channel.com' },
      { name: 'Michael Chen', role: 'Director', department: 'Production', contactNumber: '+971-50-234-5678', email: 'michael.c@channel.com' },
      { name: 'Ahmed Al Mansoori', role: 'Camera Operator', department: 'Camera', contactNumber: '+971-50-345-6789', email: 'ahmed.m@channel.com' },
      { name: 'Fatima Hassan', role: 'Camera Operator', department: 'Camera', contactNumber: '+971-50-456-7890', email: 'fatima.h@channel.com' },
      { name: 'James Martinez', role: 'Audio Engineer', department: 'Sound', contactNumber: '+971-50-567-8901', email: 'james.m@channel.com' },
      { name: 'Ali Mohammed', role: 'Gaffer', department: 'Lighting', contactNumber: '+971-50-123-7890', email: 'ali.m@channel.com' },
      { name: 'Layla Ibrahim', role: 'Lighting Technician', department: 'Lighting', contactNumber: '+971-50-678-9012', email: 'layla.i@channel.com' },
      { name: 'David Park', role: 'Grip', department: 'Grip & Electric', contactNumber: '+971-50-789-0123', email: 'david.p@channel.com' },
      { name: 'Carlos Rodriguez', role: 'Grip', department: 'Grip & Electric', contactNumber: '+971-50-789-4567', email: 'carlos.r@channel.com' },
      { name: 'Omar Khalid', role: 'Production Assistant', department: 'Production', contactNumber: '+971-50-901-2345', email: 'omar.k@channel.com' },
      { name: 'Nina Kowalski', role: 'Production Assistant', department: 'Production', contactNumber: '+971-50-678-3456', email: 'nina.k@channel.com' },
      { name: 'Emma Thompson', role: 'Production Coordinator', department: 'Production', contactNumber: '+971-50-456-0123', email: 'emma.t@channel.com' },
      { name: 'Youssef Ali', role: 'Assistant Director', department: 'Production', contactNumber: '+971-50-567-1234', email: 'youssef.a@channel.com' },
      { name: 'Hassan Rashid', role: 'Camera Assistant', department: 'Camera', contactNumber: '+971-50-345-9012', email: 'hassan.r@channel.com' },
    ],
  },
  {
    id: 'CS-006',
    title: 'Live Events - Sports Coverage',
    program: 'Live Events',
    date: '2025-01-16',
    callTime: '14:00',
    wrapTime: '23:00',
    location: 'Stadium - Dubai Sports City',
    status: 'In Progress',
    crewSize: 20,
    duration: 9,
    sceneNumbers: ['10A', '10B', '11A'],
    weather: 'Clear',
    crew: [
      { name: 'Sarah Johnson', role: 'Producer', department: 'Production', contactNumber: '+971-50-123-4567', email: 'sarah.j@channel.com' },
      { name: 'Dr. Samira Patel', role: 'Producer', department: 'Production', contactNumber: '+971-50-678-2345', email: 'samira.p@channel.com' },
      { name: 'Michael Chen', role: 'Director', department: 'Production', contactNumber: '+971-50-234-5678', email: 'michael.c@channel.com' },
      { name: 'Ahmed Al Mansoori', role: 'Camera Operator', department: 'Camera', contactNumber: '+971-50-345-6789', email: 'ahmed.m@channel.com' },
      { name: 'Fatima Hassan', role: 'Camera Operator', department: 'Camera', contactNumber: '+971-50-456-7890', email: 'fatima.h@channel.com' },
      { name: 'Hassan Rashid', role: 'Camera Operator', department: 'Camera', contactNumber: '+971-50-345-9012', email: 'hassan.r@channel.com' },
      { name: 'James Martinez', role: 'Audio Engineer', department: 'Sound', contactNumber: '+971-50-567-8901', email: 'james.m@channel.com' },
      { name: 'Sophie Anderson', role: 'Sound Mixer', department: 'Sound', contactNumber: '+971-50-234-8901', email: 'sophie.a@channel.com' },
      { name: 'Ali Mohammed', role: 'Gaffer', department: 'Lighting', contactNumber: '+971-50-123-7890', email: 'ali.m@channel.com' },
      { name: 'Layla Ibrahim', role: 'Lighting Technician', department: 'Lighting', contactNumber: '+971-50-678-9012', email: 'layla.i@channel.com' },
      { name: 'David Park', role: 'Grip', department: 'Grip & Electric', contactNumber: '+971-50-789-0123', email: 'david.p@channel.com' },
      { name: 'Carlos Rodriguez', role: 'Grip', department: 'Grip & Electric', contactNumber: '+971-50-789-4567', email: 'carlos.r@channel.com' },
      { name: 'Omar Khalid', role: 'Production Assistant', department: 'Production', contactNumber: '+971-50-901-2345', email: 'omar.k@channel.com' },
      { name: 'Nina Kowalski', role: 'Production Assistant', department: 'Production', contactNumber: '+971-50-678-3456', email: 'nina.k@channel.com' },
      { name: 'Jennifer Williams', role: 'Script Supervisor', department: 'Production', contactNumber: '+971-50-012-3456', email: 'jennifer.w@channel.com' },
      { name: 'Emma Thompson', role: 'Production Coordinator', department: 'Production', contactNumber: '+971-50-456-0123', email: 'emma.t@channel.com' },
      { name: 'Youssef Ali', role: 'Assistant Director', department: 'Production', contactNumber: '+971-50-567-1234', email: 'youssef.a@channel.com' },
      { name: 'Maria Garcia', role: 'Makeup Artist', department: 'Hair & Makeup', contactNumber: '+971-50-890-1234', email: 'maria.g@channel.com' },
      { name: 'Rashid Ahmed', role: 'Camera Assistant', department: 'Camera', contactNumber: '+971-50-901-5678', email: 'rashid.a@channel.com' },
      { name: 'Linda Chen', role: 'Production Assistant', department: 'Production', contactNumber: '+971-50-012-6789', email: 'linda.c@channel.com' },
    ],
  },
  {
    id: 'CS-007',
    title: 'Morning Show - Cooking Segment',
    program: 'Morning Show',
    date: '2025-01-17',
    callTime: '05:30',
    wrapTime: '10:30',
    location: 'Studio A - Kitchen Set',
    status: 'Scheduled',
    crewSize: 11,
    duration: 5,
    sceneNumbers: ['12A', '12B'],
    weather: 'Clear',
    crew: [
      { name: 'Sarah Johnson', role: 'Producer', department: 'Production', contactNumber: '+971-50-123-4567', email: 'sarah.j@channel.com' },
      { name: 'Jennifer Williams', role: 'Director', department: 'Production', contactNumber: '+971-50-012-3456', email: 'jennifer.w@channel.com' },
      { name: 'Ahmed Al Mansoori', role: 'Camera Operator', department: 'Camera', contactNumber: '+971-50-345-6789', email: 'ahmed.m@channel.com' },
      { name: 'Fatima Hassan', role: 'Camera Operator', department: 'Camera', contactNumber: '+971-50-456-7890', email: 'fatima.h@channel.com' },
      { name: 'James Martinez', role: 'Audio Engineer', department: 'Sound', contactNumber: '+971-50-567-8901', email: 'james.m@channel.com' },
      { name: 'Layla Ibrahim', role: 'Lighting Technician', department: 'Lighting', contactNumber: '+971-50-678-9012', email: 'layla.i@channel.com' },
      { name: 'David Park', role: 'Grip', department: 'Grip & Electric', contactNumber: '+971-50-789-0123', email: 'david.p@channel.com' },
      { name: 'Maria Garcia', role: 'Makeup Artist', department: 'Hair & Makeup', contactNumber: '+971-50-890-1234', email: 'maria.g@channel.com' },
      { name: 'Omar Khalid', role: 'Production Assistant', department: 'Production', contactNumber: '+971-50-901-2345', email: 'omar.k@channel.com' },
      { name: 'Emma Thompson', role: 'Production Coordinator', department: 'Production', contactNumber: '+971-50-456-0123', email: 'emma.t@channel.com' },
      { name: 'Youssef Ali', role: 'Assistant Director', department: 'Production', contactNumber: '+971-50-567-1234', email: 'youssef.a@channel.com' },
    ],
  },
  {
    id: 'CS-008',
    title: 'Evening News - Political Debate',
    program: 'Evening News',
    date: '2025-01-11',
    callTime: '16:00',
    wrapTime: '21:00',
    location: 'Studio B - Debate Set',
    status: 'Completed',
    crewSize: 13,
    duration: 5,
    sceneNumbers: ['13A', '13B', '14A'],
    weather: 'Partly Cloudy',
    crew: [
      { name: 'Michael Chen', role: 'Producer', department: 'Production', contactNumber: '+971-50-234-5678', email: 'michael.c@channel.com' },
      { name: 'Dr. Samira Patel', role: 'Director', department: 'Production', contactNumber: '+971-50-678-2345', email: 'samira.p@channel.com' },
      { name: 'Ahmed Al Mansoori', role: 'Camera Operator', department: 'Camera', contactNumber: '+971-50-345-6789', email: 'ahmed.m@channel.com' },
      { name: 'Fatima Hassan', role: 'Camera Operator', department: 'Camera', contactNumber: '+971-50-456-7890', email: 'fatima.h@channel.com' },
      { name: 'Hassan Rashid', role: 'Camera Operator', department: 'Camera', contactNumber: '+971-50-345-9012', email: 'hassan.r@channel.com' },
      { name: 'James Martinez', role: 'Audio Engineer', department: 'Sound', contactNumber: '+971-50-567-8901', email: 'james.m@channel.com' },
      { name: 'Sophie Anderson', role: 'Sound Mixer', department: 'Sound', contactNumber: '+971-50-234-8901', email: 'sophie.a@channel.com' },
      { name: 'Ali Mohammed', role: 'Gaffer', department: 'Lighting', contactNumber: '+971-50-123-7890', email: 'ali.m@channel.com' },
      { name: 'Layla Ibrahim', role: 'Lighting Technician', department: 'Lighting', contactNumber: '+971-50-678-9012', email: 'layla.i@channel.com' },
      { name: 'David Park', role: 'Grip', department: 'Grip & Electric', contactNumber: '+971-50-789-0123', email: 'david.p@channel.com' },
      { name: 'Omar Khalid', role: 'Production Assistant', department: 'Production', contactNumber: '+971-50-901-2345', email: 'omar.k@channel.com' },
      { name: 'Emma Thompson', role: 'Production Coordinator', department: 'Production', contactNumber: '+971-50-456-0123', email: 'emma.t@channel.com' },
      { name: 'Youssef Ali', role: 'Assistant Director', department: 'Production', contactNumber: '+971-50-567-1234', email: 'youssef.a@channel.com' },
    ],
  },
  {
    id: 'CS-009',
    title: 'Weekend Edition - Cultural Feature',
    program: 'Weekend Edition',
    date: '2025-01-10',
    callTime: '10:00',
    wrapTime: '16:00',
    location: 'Heritage Village - Sharjah',
    status: 'Completed',
    crewSize: 12,
    duration: 6,
    sceneNumbers: ['15A', '15B'],
    weather: 'Sunny',
    crew: [
      { name: 'Jennifer Williams', role: 'Producer', department: 'Production', contactNumber: '+971-50-012-3456', email: 'jennifer.w@channel.com' },
      { name: 'Sarah Johnson', role: 'Director', department: 'Production', contactNumber: '+971-50-123-4567', email: 'sarah.j@channel.com' },
      { name: 'Ahmed Al Mansoori', role: 'Camera Operator', department: 'Camera', contactNumber: '+971-50-345-6789', email: 'ahmed.m@channel.com' },
      { name: 'Fatima Hassan', role: 'Camera Operator', department: 'Camera', contactNumber: '+971-50-456-7890', email: 'fatima.h@channel.com' },
      { name: 'Sophie Anderson', role: 'Audio Engineer', department: 'Sound', contactNumber: '+971-50-234-8901', email: 'sophie.a@channel.com' },
      { name: 'Ali Mohammed', role: 'Lighting Technician', department: 'Lighting', contactNumber: '+971-50-123-7890', email: 'ali.m@channel.com' },
      { name: 'David Park', role: 'Grip', department: 'Grip & Electric', contactNumber: '+971-50-789-0123', email: 'david.p@channel.com' },
      { name: 'Maria Garcia', role: 'Makeup Artist', department: 'Hair & Makeup', contactNumber: '+971-50-890-1234', email: 'maria.g@channel.com' },
      { name: 'Omar Khalid', role: 'Production Assistant', department: 'Production', contactNumber: '+971-50-901-2345', email: 'omar.k@channel.com' },
      { name: 'Emma Thompson', role: 'Production Coordinator', department: 'Production', contactNumber: '+971-50-456-0123', email: 'emma.t@channel.com' },
      { name: 'Youssef Ali', role: 'Assistant Director', department: 'Production', contactNumber: '+971-50-567-1234', email: 'youssef.a@channel.com' },
      { name: 'Hassan Rashid', role: 'Camera Assistant', department: 'Camera', contactNumber: '+971-50-345-9012', email: 'hassan.r@channel.com' },
    ],
  },
  {
    id: 'CS-010',
    title: 'Special Report - Economic Forum',
    program: 'Special Report',
    date: '2025-01-09',
    callTime: '07:00',
    wrapTime: '19:00',
    location: 'Dubai World Trade Center',
    status: 'Completed',
    crewSize: 16,
    duration: 12,
    sceneNumbers: ['16A', '16B', '17A', '17B'],
    weather: 'Clear',
    crew: [
      { name: 'Dr. Samira Patel', role: 'Producer', department: 'Production', contactNumber: '+971-50-678-2345', email: 'samira.p@channel.com' },
      { name: 'Michael Chen', role: 'Director', department: 'Production', contactNumber: '+971-50-234-5678', email: 'michael.c@channel.com' },
      { name: 'Ahmed Al Mansoori', role: 'Camera Operator', department: 'Camera', contactNumber: '+971-50-345-6789', email: 'ahmed.m@channel.com' },
      { name: 'Fatima Hassan', role: 'Camera Operator', department: 'Camera', contactNumber: '+971-50-456-7890', email: 'fatima.h@channel.com' },
      { name: 'Hassan Rashid', role: 'Camera Operator', department: 'Camera', contactNumber: '+971-50-345-9012', email: 'hassan.r@channel.com' },
      { name: 'James Martinez', role: 'Audio Engineer', department: 'Sound', contactNumber: '+971-50-567-8901', email: 'james.m@channel.com' },
      { name: 'Sophie Anderson', role: 'Sound Mixer', department: 'Sound', contactNumber: '+971-50-234-8901', email: 'sophie.a@channel.com' },
      { name: 'Ali Mohammed', role: 'Gaffer', department: 'Lighting', contactNumber: '+971-50-123-7890', email: 'ali.m@channel.com' },
      { name: 'Layla Ibrahim', role: 'Lighting Technician', department: 'Lighting', contactNumber: '+971-50-678-9012', email: 'layla.i@channel.com' },
      { name: 'David Park', role: 'Grip', department: 'Grip & Electric', contactNumber: '+971-50-789-0123', email: 'david.p@channel.com' },
      { name: 'Carlos Rodriguez', role: 'Grip', department: 'Grip & Electric', contactNumber: '+971-50-789-4567', email: 'carlos.r@channel.com' },
      { name: 'Omar Khalid', role: 'Production Assistant', department: 'Production', contactNumber: '+971-50-901-2345', email: 'omar.k@channel.com' },
      { name: 'Nina Kowalski', role: 'Production Assistant', department: 'Production', contactNumber: '+971-50-678-3456', email: 'nina.k@channel.com' },
      { name: 'Emma Thompson', role: 'Production Coordinator', department: 'Production', contactNumber: '+971-50-456-0123', email: 'emma.t@channel.com' },
      { name: 'Youssef Ali', role: 'Assistant Director', department: 'Production', contactNumber: '+971-50-567-1234', email: 'youssef.a@channel.com' },
      { name: 'Jennifer Williams', role: 'Script Supervisor', department: 'Production', contactNumber: '+971-50-012-3456', email: 'jennifer.w@channel.com' },
    ],
  },
];

// Helper functions to extract unique values
export const getUniqueCrewRoles = (): string[] => {
  const roles = new Set<string>();
  mockCallSheets.forEach(sheet => {
    sheet.crew.forEach(member => roles.add(member.role));
  });
  return Array.from(roles).sort();
};

export const getUniquePrograms = (): string[] => {
  const programs = new Set<string>();
  mockCallSheets.forEach(sheet => programs.add(sheet.program));
  return Array.from(programs).sort();
};

export const getCrewMembersByRole = (role: string): string[] => {
  const names = new Set<string>();
  mockCallSheets.forEach(sheet => {
    sheet.crew.forEach(member => {
      if (member.role === role) {
        names.add(member.name);
      }
    });
  });
  return Array.from(names).sort();
};

export const getAllCrewMembers = (): string[] => {
  const names = new Set<string>();
  mockCallSheets.forEach(sheet => {
    sheet.crew.forEach(member => names.add(member.name));
  });
  return Array.from(names).sort();
};
