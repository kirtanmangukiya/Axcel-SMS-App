import {NativeStackScreenProps} from '@react-navigation/native-stack';

// src/types.ts
export type MainStackParamList = {
  NewsSelectedScreen: undefined;
  AddAssignmentScreen: undefined;

  SearchResultsScreen: {results: any[]};
  ResourceAndGuide: undefined;
  BooksLibraryResult: {results: any[]};
  TopBarCalender: undefined;
  TopBarAssignment: undefined;
  NewsComponent: {data: any};
  InsideNewsComponent2: {data: any};
  ShowDataStudent: {students: any[]; sourceScreen: string; topbarName: string};
  SearchScreen: {
    students: any[];
    sourceScreen:
      | 'TeachersScreen'
      | 'HomeScreen'
      | 'StudentScreen'
      | 'ParentsScreen'
      | 'InvoiceScreen'
      | 'YearScreen'
      | 'CredentialsNotesScreen'
      | 'SubjectsScreen'
      | 'GradeLevel'
      | 'NewsBoard'
      | 'EventsScreen'
      | 'TransportScreen'
      | 'BooksLibraryScreen';
  };
  StudentProfileComponent: undefined;
  MessageSearch: undefined;
  showDataScreen: {screenName: string};
  InsideEventComponent: {data: any};
  PdfShowComponent: {pdfUrl: string};
  PdfShowComponentw: {pdfUrl: string};
  ChatScreen: {data: ChatItem}; // De

  NewsBoardComponent: undefined;

  InsideNewsComponent: {data: any};
  InvoiceComponent: {url: string};
  InvoiceSearchResult: {results: any[]};
  YearScreenResult: {results: any[]};
  CredentialsNotesScreen: {results: any[]};

  WebViewComponent: {url: string};
  MessageList: undefined;
  StripeMain: undefined;
  SideBarTeacher: undefined;
  SideBarEmployee: undefined;
  SideBarParent: undefined;
  SideBarStudent: {userData: object};
  AssignmentScreen: {results: any[]};
  SubjectsScreen: {results: any[]};
  ParentScreen: {results: any[]};
  GradeLevel: undefined;
  OnlineExam: undefined;
  ExamList: undefined;
  ParentsScreen: undefined;
  HomeWork: undefined;
  DueInvoice: undefined;
  ResourcesAndGuardScreen: {results: any[]};
  TransportScreen: undefined;
  ClassScreen: {results: any[]};
  YearScreen: {results: any[]};
  TeachersScreen: {results: any[]};
  ApiTesting: undefined;
  Splash: undefined;
  Login: undefined;
  DrawerRoutes: {
    moduleType: string;
    userData: object;
    selectedScreen?: string; // Make sure this matches the expected type
    params?: object; // Make this optional if it's not always provided
  };
  HomeScreen: undefined;
  HomeRoute: undefined;
  HelloTesting: undefined;
  HelloTesing2: undefined;
  Dashboard: undefined;
  NewsBoard: {results: any[]};
  MessageScreen: {results: any[]};
  EventsScreen: {results: any[]};
  MediaCenterScreen: undefined;
  InvoiceScreen: {results: any[]};
  CrediantsNotesScreen: undefined;
  AttendenceScreen: undefined;
  AttendanceListScreen: {data: object};
  BooksLibraryScreen: {results: any[]};
  HostelScreen: {results: any[]};
  LogoutScreen: undefined;
  CalenderScreen: undefined;
  ClassSchedule: undefined;
  StudentScreen: {results: any[]};
  StudyMaterial: undefined;
};

export type RootStackParamList = {
  ChatScreen: {data: ChatItem};
  ShowDataScreen: {screenName: string};
  InsideEventComponent: {data: any};
  InsideNewsComponent: {data: any};
  Splash: undefined;
  Login: undefined;
  Landing: undefined;
  RateUs: undefined;
  ShareWithFriends: undefined;
  UpdateApp: undefined;
  AboutUs: undefined;
  TermsOfUse: undefined;
  PrivacyPolicy: undefined;
  FollowUs: undefined;
  HomeScreen: undefined;
  StateSelectedScreen: undefined;
  NewsBoard: undefined;
  HomeWork: {results: any[]};

  InvoiceScreen: undefined;
};
export type SplashProps = NativeStackScreenProps<MainStackParamList, 'Splash'>;
export type HomeStackParamList = {
  Home: undefined;
  DrawerRoutes: undefined;
};
export type DrawerProps = NativeStackScreenProps<
  MainStackParamList,
  'DrawerRoutes'
>;
// types.ts
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface insideNewsBoard {
  id: number;
  newsTitle: string;
  newsText: string;
  newsFor: string | null;
  newsDate: string;
  newsImage: string;
  fe_active: number;
  creationDate: number;
  newsImage2?: string;
  newsImage3?: string;
  newsImage4?: string;
  newsImage5?: string;
  newsImage6?: string;
  newsImage7?: string;
  newsImage8?: string;
  newsImage9?: string;
  newsImage10?: string;
}

export interface ProfileImageResponce {
  image: any;
}
interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  role_perm: number;
  department: number;
  designation: number;
  activated: number;
  studentRollId: number | null;
  admission_number: string;
  admission_date: number;
  std_category: number;
  auth_session: string;
  birthday: number;
  gender: string | null;
  sector: string;
  status: string;
  address: string;
  address2: string | null;
  address3: string | null;
  phoneNo: string;
  mobileNo: string;
  studentAcademicYear: number;
  studentClass: number;
  studentSection: number;
  religion: string;
  parentProfession: string | null;
  parentOf: string;
  photo: string;
  isLeaderBoard: string;
  restoreUniqId: string;
  transport: string;
  transport_vehicle: string;
  hostel: string;
  medical: string;
  user_position: string;
  defLang: number;
  defTheme: string;
  salary_type: string;
  salary_base_id: number;
  comVia: string;
  father_info: string;
  mother_info: string;
  biometric_id: string;
  library_id: string;
  account_active: number;
  updated_at: string;
  customPermissionsType: string;
  customPermissions: string;
  firebase_token: string;
  point: number;
  lockinfeecode: number | null;
  otherName: string | null;
  role2: string | null;
  demeritPoint: number;
  dateupdatePoint: string;
  attendance: string | null;
  sportHouse: string | null;
}

export interface Subject {
  id: number;
  subjectTitle: string;
  passGrade: string;
  finalGrade: string;
  teacherId: string;
  teacherName: string | null;
  name: string;
}

export interface Teacher {
  id: number;
  fullName: string;
}

export interface SubjectApiResponse {
  error: string;
  subjects: Subject[];
  teachers: {[key: string]: Teacher};
}
interface Dormitory {
  // Assuming dormitory data structure based on context
}

export interface Subject2 {
  [key: string]: string;
}

export interface ClassTeacher {
  id: string;
}

export interface Class {
  id: number;
  className: string;
  classTeacher: string[];
  classSubjects: string[];
  dormitory: Dormitory | null;
  dormitoryName: string | null;
}

export interface Teacher2 {
  id: number;
  fullName: string;
}

export interface classApiResponce {
  dormitory: Dormitory[];
  subject: Subject2;
  classes: Class[];
  teachers: {[key: string]: Teacher2};
}
export interface HostelDataApiResponce {
  hostel: HostelObject;
}
export interface HostelObject {
  id: number;
  hostelTitle: string;
  hostelAddress: string;
  hostelType: string;
  hostelManager: string;
  managerContact: string;
  managerPhoto: string;
  hostelNotes: string;
}

export interface ClassAssignment {
  id: number;
  className: string;
  classTeacher: string[];
  classAcademicYear: number;
  classSubjects: string[];
  dormitoryId: number;
}

export interface AssignmentApiResponce {
  classes: ClassAssignment[];
  assignments: any[]; // Adjust the type if you have a structure for assignments
  userRole: string;
}
export interface AssignmentData2 {
  classId: number;
  sectionId: number;
  subjectId: string;
  teacherId: any[]; // Adjust based on actual type
  AssignTitle: string;
  AssignDescription: string;
  AssignDeadLine: string; // Ensure this matches the expected format (ISO string)
}

export interface sectionsApiResponce {
  teachers: any[];
  sections: any[];
  classes: any[];
}

export interface Class {
  id: number;
  className: string;
  classTeacher: string[]; // Change to an array of strings
  classAcademicYear: number;
  classSubjects: string[]; // Change to an array of strings
  dormitoryId: number;
}

export interface DataResponse {
  exams: any[];
  classes: Class[];
  subjects: {[key: string]: string};
  userRole: string;
}

export interface NewsBoardItem {
  id: number;
  newsTitle: string;
  newsText: string;
  newsFor: string;
  newsDate: string;
  newsImage: string;
  fe_active: number;
  creationDate: number;
  newsImage2: string;
  newsImage3: string;
  newsImage4: string;
  newsImage5: string;
  newsImage6: string;
  newsImage7: string;
  newsImage8: string;
  newsImage9: string;
  newsImage10: string;
}

export interface NewsBoardResponse {
  newsboard: NewsBoardItem[];
}

export interface InvoiceResponse {
  classes: any;
  currency_symbol: string;
  feetypes: any[];
  formated: any[];
  invoices: InvoiceItemResponce[];
  totalItems: number;
}
export interface Event {
  id: number;
  eventTitle: string;
  eventDescription: string;
  eventFor: string;
  enentPlace: string;
  eventImage: string;
  fe_active: number;
  eventDate: string;
}

export interface EventApiResponse {
  role: string;
  events: Event[];
}
export interface HomeworkApiResponce {
  id: number;
  classId: string[];
  sectionId: string[];
  subjectId: number;
  teacherId: number;
  homeworkTitle: string;
  homeworkDescription: string;
  homeworkFile: string;
  homeworkDate: string;
  homeworkSubmissionDate: string;
  homeworkEvaluationDate: string;
  studentsCompleted: string | null;
  classes: ClassHomeWork[];
  sections: SectionHomeWork[];
  subject: Subject;
  teacher: Teacher;
  student_applied: any[];
  student_not_applied: Record<string, string>;
}

interface ClassHomeWork {
  className: string;
}

interface SectionHomeWork {
  sectionName: string;
}

interface SubjectHomeWork {
  subjectTitle: string;
}

interface TeacherHomeWork {
  fullName: string;
}

export interface CreditNoteApiResponce {
  invoices2: invoices2;
  totalItems: number;
  formated: any[];
  currency_symbol: string;
  classes: any[];
  feetypes: any[];
}

export interface invoices2 {
  dueDate: string;
  fullName: string;
  id: number;
  invoicePyaments: any[];
  paymentDate: string;
  paymentStatus: number;
  receipt: any[]; // Assuming receipt can hold various types of objects; adjust if needed
  studentId: number;
}

interface Album {
  // define properties of Album
}
interface Media {
  // define properties of Media
}

export interface MediaApiResponse {
  albums: Album[];
  media: Media[];
}

export interface MediaApiResponse {
  albums: Album[];
  media: Media[];
}

export interface StudentApiRespoce {
  totalItems: string;
  class: any[];
  userRole: string;
  transport_vehicles: any[];
  transports: any[];
  students: any[] | undefined;
}
export interface classStudent {
  id: number;
  className: string;
  classTeacher: string;
  classSubjects: string;
  dormitoryId: string;
  classAcademicYear: string;
}
export interface studentsItem {
  username: string;
  studentSection: string;
  studentRollId: string;
  studentClass: string;
  isLeaderBoard: string;
  id: number;
}

export interface StudentApiRespoce {
  totalItems: string;
  class: any[];
  userRole: string;
  transport_vehicles: any[];
  transports: any[];
  students: any[] | undefined;
}
export interface ParentApiRespoce {
  totalItems: number;
  parents: any[];
  roles: any[];
}

export interface ParentProfileProps {
  id: number;
  username: string;
  email: string;
  remember_token: string;
  fullName: string;
  role: string;
  role_perm: number;
  department: number;
  designation: number;
  activated: number;
  studentRollId: number | null;
  admission_number: string;
  admission_date: number;
  std_category: number;
  auth_session: string;
  birthday: number;
  gender: string;
  sector: string | null;
  status: string | null;
  address: string;
  address2: string | null;
  address3: string | null;
  phoneNo: string;
  mobileNo: string;
  studentAcademicYear: number;
  studentClass: number;
  studentSection: number;
  religion: string;
  parentProfession: string;
  parentOf: Array<{student: string; relation: string; id: string}>;
  photo: string;
  isLeaderBoard: string;
  restoreUniqId: string;
  transport: string;
  transport_vehicle: string | null;
  hostel: string;
  medical: string;
  user_position: string;
  defLang: number;
  defTheme: string;
  salary_type: string;
  salary_base_id: number;
  comVia: Array<string>;
  father_info: string;
  mother_info: string;
  biometric_id: string;
  library_id: string;
  account_active: number;
  updated_at: string;
  customPermissionsType: string | null;
  customPermissions: string;
  firebase_token: string;
  point: number;
  lockinfeecode: string | null;
  otherName: string | null;
  role2: string | null;
  demeritPoint: number;
  dateupdatePoint: string | null;
  attendance: string | null;
  sportHouse: string | null;
}

export interface TeacherProfileProps {
  // username: string;
  username: string;
  email: string;
  profileImageUri: string;
}

export interface TeacherApiRespoce {
  transports: any[];
  transport_vehicles: any[];
  totalItems: number;
  teachers: any[];
  userRole: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  date: string;
  url: string;
  backgroundColor: string;
  textColor: string;
  allDay: boolean;
}

export type CalendarApiResponse = CalendarEvent[];
export interface subjectAndTeaceherApiResponce {
  subjects: any[];
  teachers: any[];
}
export interface subjectsData {
  teacherName: string;
  teacherId: string;
  subjectTitle: string;
  passGrade: string;
  idfinalGrade: string;
  id: number;
  finalGrade: string;
}

export interface transportItem {
  vehicles: any[];
  transportFare: string;
  routeDetails: string;
  id: number;
  transportTitle: string;
}

export interface gradleLevelApiResponce {
  object: gradeItem;
}

export interface stripeStatusApiResponce {
  stripe_secret_key: string;
  stripe_publishable_key: string;
  stripe_enabled: boolean | undefined;
}
export interface gradeItem {
  id: number;
  gradeTo: string;
  gradePoints: string;
  gradeName: string;
  gradeFrom: string;
  gradeDescription: string;
}

export interface BooksLibraryApiResponce {
  bookLibrary: bookSlibrarayItem[];
  userRole: string;
  totalItems: number;
}

export interface bookSlibrarayItem {
  bookSlibrarayItem: string;
  bookAuthor: string;
  bookDescription: string;
  bookFile: string;
  bookISBN: string;
  bookName: string;
  bookPrice: string;
  bookPublisher: string;
  bookQuantity: string;
  bookShelf: string;
  bookState: string;
  bookType: string;
  category: string;
  id: number;
  picture: string;
  url: string;
}
export interface InvoiceItemResponce {
  dueDate: string;
  filename: string;
  fullName: string;
  id: number;
  invoicePyaments: any[];
  paymentDate: string;
  paymentStatus: number;
  receipt: any[];
  studentId: number;
}

export interface dashBoardApiResponce {
  teacherLeaderBoard: any[];
  studentLeaderBoard: any[];
  newsEvents: any[];
}
export interface deviceTokenResponce {
  success: string;
}

export interface MessageListApiResponce {
  messages: [ChatItem];
}

export interface MessageListApiResponce {
  messages: [ChatItem];
}

export interface ChatItem {
  lastMessageTimestamp: number;
  messages: string; // Note: This should be an array of message objects
  id: number;
  lastMessageDate: string;
  lastMessage: string;
  messageStatus: number;
  fullName: string;
  userId: number | null;
}
export interface ChatDataResponse {
  messages: {
    id: number;
    text: string;
    timestamp: string;
    userId: string | number;
    userName: string;
    userAvatar: string;
  }[];
}

interface AssignmentResponse {
  status: string;
  title: string;
  message: string;
  data: AssignmentData;
}

interface AssignmentData {
  classId: number[];
  sectionId: number[];
  subjectId: number;
  teacherId: number;
  AssignTitle: string;
  AssignDescription: string;
  AssignDeadLine: string;
  id: number;
}

interface ClassInfo {
  id: number;
  className: string;
  classTeacher: string[];
  classAcademicYear: number;
  classSubjects: string[];
  dormitoryId: number;
}

interface SubjectInfo {
  id: number;
  subjectTitle: string;
  teacherId: string[];
  passGrade: string;
  finalGrade: string;
}

export interface AttendenceListApiResponse {
  class: ClassInfo;
  subject: SubjectInfo;
  students: any[]; // Adjust the type according to the structure of students if available
}
export interface AttendenceResponse {
  status: string;
  title: string;
  message: string; // Adjust the type according to the structure of students if available
}

interface Class2 {
  id: number;
  className: string;
  classTeacher: string[]; // Changed from string to string[] based on the given data
  classAcademicYear: number;
  classSubjects: string[]; // Changed from string to string[] based on the given data
  dormitoryId: number;
}

interface SubjectList {
  [key: string]: string; // Mapping of subject ID to subject name
}

export interface onlineExamApiResponce {
  classes: Class2[];
  onlineExams: any[]; // Assuming it can be any type or empty array as per the provided data
  subject_list: SubjectList;
}

export interface homeWorkApiResponce {
  class: any[];
  homeworks: any[];
  totalItems: number;
}

export interface leaderBoardApiResponce {
  status: string;
  title: string;
  message: string;
}
export interface atttendenceList {
  attendence: [];
  attendanceModel: string;
}

export interface crerateMessageApiResponce {
  messageId: string;
}

export interface beforeObject {
  fullName: string;
  id: number;
  lastMessage: string;
  lastMessageDate: string;
  lastMessageTimestamp: string;
  messageStatus: number;
  userId: number;
}
export interface studyMaterialDataApiResponce {
  studymaterial: any[];
}
export interface invoiceUploadApiResponce {
  invoiceData: any;
}
export interface resourceAndGuideApiResponce {
  classes: any[];
  materials: any[];
  useRole: string;
}
export interface InvoiceUploadParams {
  fileName: string;
  fileMimetype: string;
  fileExtension: string;
  fileData: string;
  paymentId: number;
}

export interface InvoiceUploadApiResponse {
  success: boolean;
  message: string;
  // Add other fields as per your API response
}

export interface Class3 {
  classAcademicYear: number;
  className: string;
  classSubjects: string;
  classTeacher: string;
  dormitoryId: number;
  id: number;
}

export interface Homework {
  classes: string;
  homeworkDate: string;
  homeworkDescription: string;
  homeworkEvaluationDate: string;
  homeworkFile: string;
  homeworkSubmissionDate: string;
  homeworkTitle: string;
  id: number;
  sections: string;
  subject: string;
  subjectId: number;
}

export interface HomeWorkApiResponceData {
  classes: Class3[];
  homeworks: Homework[];
  totalItems: number;
  userRole: string;
}
export interface homeworkApiData {
  classId: number[];
  sectionId: number[];
  subjectId: number;
  homeworkTitle: string;
  homeworkDescription: string;
  homeworkSubmissionDate: string;
  homeworkEvaluationDate: string;
}

export interface AssignmentApiResponce {
  message: string;
  data?: any;
}

interface Teacher {
  id: number;
  fullName: string;
}

// Interface for the subject map
interface SubjectMap {
  [key: number]: string;
}

// Interface for a single class
export interface Class4 {
  id: number;
  className: string;
  classTeacher: string[];
  classSubjects: string[];
  dormitory: any; // Use appropriate type if available, otherwise 'any'
  dormitoryName: any; // Use appropriate type if available, otherwise 'any'
}

interface ClassApiResponse {
  dormitory: any[];
  subject: SubjectMap;
  classes: Class4[];
  teachers: {
    [key: number]: Teacher;
  };
}
export interface HomeworkResponse {
  status: string;
  title: string;
  message: string;
  data: HomeworkData;
}

export interface HomeworkData {
  id: number;
  classId: string[];
  sectionId: string[];
  subjectId: number;
  teacherId: number;
  homeworkTitle: string;
  homeworkDescription: string;
  homeworkFile: string;
  homeworkDate: string;
  homeworkSubmissionDate: string;
  homeworkEvaluationDate: string;
  studentsCompleted: Record<string, number>;
  classes: HomeworkClass[];
  sections: HomeworkSection[];
  subject: HomeworkSubject;
  teacher: HomeworkTeacher;
  student_applied: Record<string, string>;
  student_not_applied: Record<string, string>;
}

interface HomeworkClass {
  className: string;
}

interface HomeworkSection {
  sectionName: string;
}

interface HomeworkSubject {
  subjectTitle: string;
}

interface HomeworkTeacher {
  fullName: string;
}

export interface ScheduleItem {
  id: number;
  sectionId: number;
  subjectId: string;
  start: string;
  end: string;
}

export interface DaySchedule {
  dayName: string;
  data: any[]; // Assuming 'data' can be of any type or can be replaced with the appropriate type
  sub?: ScheduleItem[];
}

export interface IStudentTasks {
  assignments: any[];
  homeworks: any[];
}

export interface ScheduleData {
  schedule: {
    [key: string]: DaySchedule;
  };
  section: {
    sectionTitle: string;
    classId: number;
  };
  class: {
    className: string;
  };
}
// Interface for Assignment
interface AssignmentCalender {
  id: number;
  classId: string; // This is a JSON string, so we keep it as a string
  sectionId: string | null;
  subjectId: number;
  teacherId: number;
  AssignTitle: string;
  AssignDescription: string;
  AssignFile: string;
  AssignDeadLine: string;
}

// Interface for Homework
interface HomeworkCalender {
  id: number;
  classId: string; // This is a JSON string, so we keep it as a string
  sectionId: string; // This is also a JSON string, so we keep it as a string
  subjectId: number;
  teacherId: number;
  homeworkTitle: string;
  homeworkDescription: string;
  homeworkFile: string;
  homeworkDate: string;
  homeworkSubmissionDate: string;
}

// Interface for NewsEvent (empty in this case)
interface NewsEvent {
  // Define any properties if newsEvents array contains objects
}

// Interface for the main structure
export interface CalenderNewApiResopence {
  date: string;
  newsEvents: NewsEvent[]; // Assuming this will be an array of NewsEvent
  assignments: AssignmentCalender[];
  homeworks: HomeworkCalender[];
}

// Example response structure (array of DayData)
// type CalenderNewApiResopence = DayData[];
