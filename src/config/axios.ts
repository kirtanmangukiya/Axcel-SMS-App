import {
  AssignmentApiResponce,
  AssignmentData2,
  AttendenceListApiResponse,
  AttendenceResponse,
  BooksLibraryApiResponce,
  ChatItem,
  Class,
  ClassAssignment,
  CreditNoteApiResponce,
  EventApiResponse,
  HomeWorkApiResponceData,
  Homework,
  HomeworkData,
  HomeworkResponse,
  HostelDataApiResponce,
  IStudentTasks,
  InvoiceResponse,
  InvoiceUploadApiResponse,
  InvoiceUploadParams,
  LoginResponse,
  MediaApiResponse,
  MessageListApiResponce,
  NewsBoardResponse,
  ParentApiRespoce,
  ProfileImageResponce,
  ScheduleData,
  StudentApiRespoce,
  SubjectApiResponse,
  TeacherApiRespoce,
  atttendenceList,
  beforeObject,
  classApiResponce,
  crerateMessageApiResponce,
  dashBoardApiResponce,
  deviceTokenResponce,
  gradleLevelApiResponce,
  homeWorkApiResponce,
  homeworkApiData,
  insideNewsBoard,
  invoiceUploadApiResponce,
  leaderBoardApiResponce,
  onlineExamApiResponce,
  resourceAndGuideApiResponce,
  sectionsApiResponce,
  stripeStatusApiResponce,
  studyMaterialDataApiResponce,
  subjectAndTeaceherApiResponce,
} from '../types';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../constant/constant';
import HomeWork from '../screens/Home_Work/HomeWork';
import {stat} from 'react-native-fs';

const LOGIN_ENDPOINT = 'auth/authenticate';
export async function login(
  username: string,
  password: string,
  fcmToken: string | null,
): Promise<LoginResponse> {
  try {
    console.log(
      'check the login press ---------------------------------------------',
      {username, password, android_token: fcmToken},
    );

    const response = await fetch(`${BASE_URL}${LOGIN_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username, password, android_token: fcmToken}),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(` ${errorText}`);
    }

    const text = await response.text();
    let data: LoginResponse;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Login failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

let AUTH_TOKEN: string | null = null;

// Function to initialize AUTH_TOKEN from AsyncStorage
export async function initializeAuthToken() {
  try {
    const loginData = await AsyncStorage.getItem('loginData');

    if (!loginData) {
      throw new Error('No login data found in AsyncStorage');
    }

    const userData = JSON.parse(loginData);
    AUTH_TOKEN = userData.token;
  } catch (error) {
    console.error('Failed to initialize AUTH_TOKEN:', error);
    // Handle error as per your application's requirements
  }
}

export async function SubjectsData(): Promise<SubjectApiResponse> {
  try {
    // Refresh the token before making the API call
    await initializeAuthToken();

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }

    const response = await fetch(`${BASE_URL}/subjects/listAll`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    let data: SubjectApiResponse;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export async function ClassesData(): Promise<classApiResponce> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }
    const response = await fetch(`${BASE_URL}/subjects/listAll`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    // console.log('Response text:', text);

    let data: classApiResponce;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}
export async function NewsInsideData({
  id,
}: {
  id: number;
}): Promise<insideNewsBoard> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }
    const response = await fetch(`${BASE_URL}newsboard/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    // console.log('Response text news Board:', text);

    let data: insideNewsBoard;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}
export async function profileImageData({
  id,
}: {
  id: number;
}): Promise<ProfileImageResponce> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }
    // https://axcel.schoolmgmtsys.com/dashboard/profileImage/profileID
    const response = await fetch(
      `https://axcel.schoolmgmtsys.com/dashboard/profileImage/2184`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    // console.log('Response text news Board:', text);

    let data: ProfileImageResponce;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}
export async function HostelData(): Promise<HostelDataApiResponce> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }
    const response = await fetch(`${BASE_URL}/hostel/listAll`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    // console.log('Response text:', text);

    let data: HostelDataApiResponce;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export async function DailyAssignmentHomeworkData(): Promise<IStudentTasks> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }
    const response = await fetch(`${BASE_URL}todays-homework-assignments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    // console.log('Response text:', text);

    let data: IStudentTasks;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export async function AssignmentsData(): Promise<AssignmentApiResponce> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }
    const response = await fetch(`${BASE_URL}/assignments/listAll`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    // console.log('Response text:', text);

    let data: AssignmentApiResponce;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}
export async function sectionsData(): Promise<sectionsApiResponce> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }
    const response = await fetch(`${BASE_URL}/sections/listAll`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    console.log('Response text:', text);

    let data: sectionsApiResponce;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export async function classSchduleData(): Promise<sectionsApiResponce> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }
    const response = await fetch(`${BASE_URL}/classschedule/listAll`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    console.log('Response text:', text);

    let data: sectionsApiResponce;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}
export async function classData(): Promise<classApiResponce> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }
    const response = await fetch(`${BASE_URL}/classes/listAll`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    console.log('Response text:', text);

    let data: sectionsApiResponce;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export async function NewsBoardData(page: number): Promise<NewsBoardResponse> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }
    const response = await fetch(`${BASE_URL}/newsboard/listAll/${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    // console.log('Response text:', text);

    let data: NewsBoardResponse;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export async function InvoiceData(page: number): Promise<InvoiceResponse> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }
    const response = await fetch(`${BASE_URL}/invoices/listAll/${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    let data: InvoiceResponse;
    console.log('invoice response----------->', JSON.stringify(data, null, 2));

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export async function DueInvoiceData(): Promise<any> {
  // No need to pass 'page'
  console.log('Calling DueInvoice API function');

  try {
    // Initialize AUTH_TOKEN if it's not available
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }

    const params = new URLSearchParams({
      'searchInput[dueInv]': true,
      page: 1,
    });

    // Make the API request
    const response = await fetch(
      `${BASE_URL}/invoices/listAll?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      },
    );

    // Check if response is not OK
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    // Read and log response text
    const text = await response.text();
    // Parse and return JSON data if available
    if (text.trim() !== '') {
      try {
        const data = JSON.parse(text);
        return data; // Return the parsed data
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }
  } catch (error) {
    console.error('Error fetching invoice data:', error);
    throw error;
  }
}

export async function EventData(): Promise<EventApiResponse> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }
    const response = await fetch(`${BASE_URL}/events/listAll`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    console.log('Response text:', text);

    let data: EventApiResponse;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export async function homeworksViewData(id: number): Promise<homeworkApiData> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken(); // Ensure this function sets AUTH_TOKEN
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }

    const response = await fetch(`${BASE_URL}/homeworks_view/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    console.log('Response text:', text);

    let data: homeworkApiData;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch homework data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export async function studentAssignmentAddedData(
  id: number,
): Promise<homeworkApiData> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken(); // Ensure this function sets AUTH_TOKEN
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }

    const response = await fetch(`${BASE_URL}/assignments/upload/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    console.log('Response text: Add Student Assignment', text);

    let data: homeworkApiData;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch homework data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export async function getStripeConfig(): Promise<{
  stripeEnabled: boolean;
  stripePublishableKey: string;
  stripeSecretKey: string;
}> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }

    const response = await fetch(`${BASE_URL}stripe/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    let data;

    if (text.trim() !== '') {
      try {
        const rawData = JSON.parse(text);
        data = {
          stripeEnabled: rawData.stripe_enabled || false,
          stripePublishableKey: rawData.stripe_publishable_key || '',
          stripeSecretKey: rawData.stripe_secret_key || '',
        };
      } catch (jsonError) {
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Get Stripe config failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export async function createPaymentIntentData(
  amount: number,
  currency: string,
  description: string,
  invoiceId: string | number,
  studentId: string | number,
): Promise<{
  clientSecret: string;
  paymentIntentId: string;
  paymentEnabled?: boolean;
}> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }

    const requestBody = {
      amount: amount * 100,
      currency: currency,
      description: description,
      invoiceId: invoiceId,
      studentId: studentId,
    };

    const response = await fetch(`${BASE_URL}api/payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    let rawData;
    let data: {
      clientSecret: string;
      paymentIntentId: string;
      paymentEnabled?: boolean;
    };

    if (text.trim() !== '') {
      try {
        rawData = JSON.parse(text);

        // Check if payment is disabled by admin
        if (rawData.payment === false) {
          return {
            clientSecret: rawData.client_secret || '',
            paymentIntentId: '',
            paymentEnabled: false,
          };
        }

        // Handle different response formats
        data = {
          clientSecret: rawData.clientSecret || rawData.client_secret || '',
          paymentIntentId:
            rawData.paymentIntentId ||
            rawData.payment_intent_id ||
            (rawData.client_secret
              ? rawData.client_secret.split('_secret_')[0]
              : ''),
          paymentEnabled: rawData.payment !== false,
        };

        if (!data.clientSecret) {
          throw new Error('Missing client secret in server response');
        }

        if (
          !data.paymentIntentId &&
          data.clientSecret &&
          data.clientSecret.includes('_secret_')
        ) {
          data.paymentIntentId = data.clientSecret.split('_secret_')[0];
        }
      } catch (jsonError) {
        throw new Error(`JSON parse error: ${jsonError.message}`);
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Create payment intent failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export async function updatePaymentStatus(
  invoiceId: string | number,
  status: number = 1,
): Promise<boolean> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }

    const response = await fetch(
      `${BASE_URL}api/payment-status/${invoiceId}/${status}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();

    if (!text || text.trim() === '') {
      return true;
    }

    try {
      const data = JSON.parse(text);
      return data?.success ? true : false;
    } catch (jsonError) {
      return response.ok;
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Update payment status failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export async function secitonDaysData(id: number): Promise<ScheduleData> {
  console.log('--------------------------------', id);

  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }

    const response = await fetch(`${BASE_URL}/classschedule/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    console.log('Response text:', text);

    let data: ScheduleData;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch homework data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}
export async function creditNoteData(): Promise<CreditNoteApiResponce> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }
    const response = await fetch(`${BASE_URL}invoices2/listAll/1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    // console.log('Response text:', text);

    let data: CreditNoteApiResponce;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export async function MediaCenterData(
  albumId?: number,
): Promise<MediaApiResponse> {
  try {
    // console.log('Debug: albumId parameter received:', albumId);

    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }

    // Conditionally add the album ID to the URL if it's provided
    const url = albumId
      ? `${BASE_URL}/media/listAll/${albumId}`
      : `${BASE_URL}/media/listAll`;

    // console.log('Debug: URL being called:', url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    // console.log('Debug: Response text from API:', text);
    let data: MediaApiResponse;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
        // console.log('Debug: Parsed JSON data:', data);
      } catch (jsonError) {
        console.error(
          'Debug: JSON parse error:',
          jsonError,
          'Response text:',
          text,
        );
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    console.error('Debug: Error in MediaCenterData function:', error); // Log any errors for debugging
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}
export async function StudentsData(page: number): Promise<StudentApiRespoce> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }

    // Construct and log the API URL
    const apiUrl = `${BASE_URL}students/listAll/${page}`;
    console.log('Fetching data from API:', apiUrl); // Log the API URL
    console.log();

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    console.log('Response text:-->', text);
    let data: StudentApiRespoce;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export async function searchStudentsData(
  searchText: string,
): Promise<StudentApiRespoce> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }

    // Construct the API URL with query parameters
    const apiUrl = `${BASE_URL}/students/search?text=${encodeURIComponent(
      searchText,
    )}`;
    console.log('Fetching data from API:', apiUrl); // Log the API URL

    const response = await fetch(apiUrl, {
      method: 'GET', // Use GET method
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    let data: StudentApiRespoce;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export async function ParentData(page: number): Promise<ParentApiRespoce> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }
    const response = await fetch(`${BASE_URL}/parents/listAll/${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    // console.log('Response text:', text);

    let data: ParentApiRespoce;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}
export async function TeacherData(page: number): Promise<TeacherApiRespoce> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }
    const response = await fetch(`${BASE_URL}/teachers/listAll`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    // console.log('Response text:', text);

    let data: TeacherApiRespoce;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}
export async function CalendarData(
  startDate: string,
  endDate: string,
): Promise<any> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }

    // Construct the URL with query parameters
    const url = `${BASE_URL}calender?start=${encodeURIComponent(
      startDate,
    )}&end=${encodeURIComponent(endDate)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    console.log('Response text:', text);

    let data: any;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch calendar data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export async function CalendarNewData(): Promise<any> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }

    // Construct the URL with query parameters
    const url = `${BASE_URL}/new-calender`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    console.log('Response text:', text);

    let data: any;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch calendar data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export async function SubjectAndTeacherData(): Promise<subjectAndTeaceherApiResponce> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }
    const response = await fetch(`${BASE_URL}subjects/listAll`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    // console.log('Response text:', text);

    let data: subjectAndTeaceherApiResponce;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}
export async function GradleLevelData(): Promise<gradleLevelApiResponce> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }
    const response = await fetch(`${BASE_URL}gradeLevels/listAll`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    // console.log('Response text:', text);

    let data: gradleLevelApiResponce;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}
export async function StripeStatusData(): Promise<stripeStatusApiResponce> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }
    const response = await fetch(`${BASE_URL}stripe/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    // console.log('Response text:', text);

    let data: stripeStatusApiResponce;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export async function LibraryBooksData(): Promise<BooksLibraryApiResponce> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }
    const response = await fetch(`${BASE_URL}library/listAll`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    // console.log('Response text:', text);

    let data: BooksLibraryApiResponce;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}
export async function ResourceAndGuideData(): Promise<resourceAndGuideApiResponce> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }
    const response = await fetch(`${BASE_URL}materials/listAll`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    // console.log('Response text:', text);

    let data: resourceAndGuideApiResponce;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}
export async function onlineExamData(): Promise<onlineExamApiResponce> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }
    const response = await fetch(`${BASE_URL}onlineExams/listAll`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    // console.log('Response text:', text);

    let data: onlineExamApiResponce;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}
export async function homeWorkData(
  page: number,
): Promise<HomeWorkApiResponceData> {
  console.log('page number insid the homeworkdata ', page);

  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }
    const response = await fetch(
      `${BASE_URL}homeworks/listAll/1?page=${page}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();

    let data: HomeWorkApiResponceData;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}
export async function DashboardData(): Promise<dashBoardApiResponce> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }
    const response = await fetch(`${BASE_URL}dashaboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        nLowAndVersion: 'test',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    // console.log('Response text:', text);

    let data: dashBoardApiResponce;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}
interface DeviceTokenResponse {
  // Define the shape of your response here based on the API response
  success: boolean;
  message: string;
  // Add other fields as per your response structure
}

interface DeviceTokenProps {
  deviceToken: string;
}

export async function deviceToken({
  deviceToken,
}: DeviceTokenProps): Promise<DeviceTokenResponse> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }

    const response = await fetch(
      `https://sms.psleprimary.com/user/update-device-token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          android_token: deviceToken, // Pass the deviceToken correctly
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();

    let data: DeviceTokenResponse;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export async function MessageListData(
  page: number,
  // limit: number = 10,
): Promise<MessageListApiResponce> {
  try {
    await initializeAuthToken();

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }

    const response = await fetch(`${BASE_URL}/messages/listAll/${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();

    let data: MessageListApiResponce;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export async function ChatData(
  userId: number,
  chaterId: number,
  unixTimestamp: number,
): Promise<ChatItem> {
  console.log('----------------------', userId, chaterId, unixTimestamp);

  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }
    // ${BASE_URL}messages/getchat/${userId}/${chaterId}
    const response = await fetch(`${BASE_URL}messages/getchat/1/2198`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();

    let data: ChatItem;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }
    console.log('chat data into chat list data ', data);

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export async function AssigmentAddData({
  classId,
  sectionId,
  subjectId,
  teacherId,
  AssignTitle,
  AssignDescription,
  AssignDeadLine,
}: AssignmentData2): Promise<AssignmentApiResponce> {
  console.log(
    classId,
    sectionId,
    subjectId,
    teacherId,
    AssignTitle,
    AssignDescription,
    AssignDeadLine,
  );

  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }

    const response = await fetch(`${BASE_URL}assignments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        classId,
        sectionId,
        subjectId,
        teacherId,
        AssignTitle,
        AssignDescription,
        AssignDeadLine,
      }),
    });

    // {
    //   "classId": ["51", "50"],
    //   "sectionId": ["1"],
    //   "subjectId": 1,
    //   "teacherId": 1,
    //   "AssignTitle": "Sample Assignment by ashwini",
    //   "AssignDescription": "This is a sample description for the assignment. by ashwini 2",
    //   "AssignDeadLine": "23/08/2024"
    // }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();

    let data: AssignmentApiResponce;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}
export async function homeworkAddData({
  classId,
  sectionId,
  subjectId,
  homeworkTitle,
  homeworkDescription,
  homeworkSubmissionDate,
  homeworkEvaluationDate,
}: Homework): Promise<homeWorkApiResponce> {
  console.log(
    classId,
    sectionId,
    subjectId,
    homeworkTitle,
    homeworkDescription,
    homeworkSubmissionDate,
    homeworkEvaluationDate,
  );

  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }

    const response = await fetch(`${BASE_URL}homeworks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        classId,
        sectionId,
        subjectId,
        homeworkTitle,
        homeworkDescription,
        homeworkSubmissionDate,
        homeworkEvaluationDate,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();

    let data: homeWorkApiResponce;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export async function AttendenceAddData(
  classId: number,
  sectionId: number,
  attendanceDay: string,
): Promise<AttendenceListApiResponse> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }

    const response = await fetch(`${BASE_URL}attendance/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        classId,
        sectionId,
        attendanceDay,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();

    let data: AttendenceListApiResponse;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
        console.log('data -------------------------------', data);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}
export async function StatusAppliedAddData(
  homework: number,
  studentId: number,
  status: number,
): Promise<HomeworkResponse> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }
    console.log('---------------------------', homework, studentId, status);

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }
    const response = await fetch(`${BASE_URL}/homeworks/apply/${homework}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        student: studentId,
        status: status,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();

    let data: HomeworkResponse;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
        console.log('data -------------------------------', data);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}
export async function AttendenceData(finalData: {
  attendanceDay: string;
  classId: number;
  subjectId: string | null;
  stAttendance: Array<{
    id: number;
    attendance: string;
    attNotes: string;
  }>;
}): Promise<AttendenceResponse> {
  console.log(finalData);

  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }

    const response = await fetch(`${BASE_URL}attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify(finalData), // Corrected: Pass finalData directly
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();

    let data: AttendenceResponse;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
        console.log('data -------------------------------', data);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    }
    // Removed the empty else block
  }
}

export async function LeaderBoardData(): Promise<leaderBoardApiResponce> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }
    const response = await fetch(`${BASE_URL}leaderBoard/2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        isLeaderBoard: 1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    // console.log('Response text:', text);

    let data: leaderBoardApiResponce;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

// Assuming leaderBoardApiResponce is an existing type
export async function AttendenceListData(id: number): Promise<atttendenceList> {
  console.log('0000000000000000000000000000', id);

  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }

    const response = await fetch(`${BASE_URL}/students/attendance/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    let data: atttendenceList;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    console.log('inside api fetch student attendece function ', data);

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export async function searchUsersForChat(keyword: string): Promise<any[]> {
  console.log('Searching for users with keyword:', keyword);

  try {
    // Initialize AUTH_TOKEN if it's not available
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }

    // Make the API request
    const response = await fetch(
      `${BASE_URL}/messages/searchUser/${encodeURIComponent(keyword)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      },
    );

    // Check if response is not OK
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    // Read response text
    const text = await response.text();
    console.log('API Response:', text); // Log the raw response

    // Parse and return JSON data if available
    if (text.trim() !== '') {
      try {
        const data = JSON.parse(text);

        // Transform the object with IDs as keys into an array of user objects
        if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
          const usersArray = Object.keys(data).map(key => ({
            id: data[key].id,
            fullName: data[key].name,
            email: data[key].email || '',
            role: data[key].role || '',
            username: data[key].username || '',
            photo: data[key].photo || '',
          }));
          console.log('Transformed users array:', usersArray);
          return usersArray;
        }

        return data; // Return the parsed data if it's already an array
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      return []; // Return empty array for no results
    }
  } catch (error) {
    console.error('Error searching for users:', error);
    throw error;
  }
}

export async function AssignUploadListData(
  id: number,
): Promise<atttendenceList> {
  console.log('0000000000000000000000000000', id);

  // https://sms.psleprimary.com/assignments/listAnswers/6

  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }

    const response = await fetch(`${BASE_URL}assignments/listAnswers/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    let data: atttendenceList;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    console.log('inside api fetch student attendece function ', data);

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export async function newMessageCreateAddData(
  toIds: {id: number}[],
  messageText: string,
): Promise<crerateMessageApiResponce> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }

    const response = await fetch(`${BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        toId: toIds,
        messageText,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();

    let data: crerateMessageApiResponce;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }
    console.log('data inside the message inside the mssage screen', data);

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

interface Message {
  _id: number | string;
  text: string;
  createdAt: Date;
  user: {
    _id: number | string;
    name?: string;
    avatar?: string;
  };
  dateSentH?: string;
}

export async function listBeforeMessages(
  fromId: number,
  toId: number,
): Promise<Message[]> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }

    const url = `${BASE_URL}messages/ajax/${fromId}/${toId}/0`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const messages = await response.json();

    return messages.map(msg => ({
      _id: msg.id,
      text: msg.messageText,
      createdAt: new Date(parseInt(msg.dateSent) * 1000),
      user: {
        _id: msg.fromId,
        name: msg.fullName,
        avatar: msg.photo
          ? `${BASE_URL}dashboard/profileImage/${msg.photo}`
          : undefined,
      },
      dateSentH: msg.dateSentH,
    }));
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
}
export async function resourceAndGuideData(): Promise<resourceAndGuideApiResponce> {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }
    const response = await fetch(`${BASE_URL}materials/listAll`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    // console.log('Response text:', text);

    let data: resourceAndGuideApiResponce;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export async function invoiceUploadData({
  fileName,
  fileMimetype,
  fileExtension,
  fileData,
  firebaseToken,
  paymentId,
}: InvoiceUploadParams & {
  firebaseToken: string;
}): Promise<InvoiceUploadApiResponse> {
  console.log(
    'pppppppppppppppppppppppppppppppppp',
    // fileName,
    // fileMimetype,
    // fileExtension,
    // fileData,
    paymentId,
    firebaseToken,
  );

  try {
    const response = await fetch(`${BASE_URL}/invoices/receipt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        fileName,
        fileMimetype,
        fileExtension,
        fileData,
        paymentId,
        firebase_token: firebaseToken,
      }),
    });

    if (response.status < 200 || response.status >= 300) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();
    let data: InvoiceUploadApiResponse;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

interface InvoiceDeleteApiResponse {
  success: boolean;
  message: string;
}

export async function deleteInvoiceDoc(
  docId: number,
): Promise<InvoiceDeleteApiResponse> {
  console.log('------------------------------', docId);

  try {
    const response = await fetch(
      `https://sms.psleprimary.com/invoices/deletereceipt/${docId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();

    if (text.trim() === '') {
      throw new Error('Empty response received');
    }

    let data: InvoiceDeleteApiResponse;

    try {
      data = JSON.parse(text);
    } catch (jsonError) {
      console.error('JSON parse error:', jsonError, 'Response text:', text);
      throw new Error('JSON parse error');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Delete invoice failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export async function notificationData() {
  try {
    if (!AUTH_TOKEN) {
      await initializeAuthToken();
    }

    if (!AUTH_TOKEN) {
      throw new Error('AUTH_TOKEN is not available');
    }

    const response = await fetch(`${BASE_URL}dashboard/mobnotif`, {
      method: 'POST', // Changed to POST
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        notif: [
          {
            id: 1,
            notifData: 'Hii Its Testing',
            // notifDate: 1697434672,
          },
        ],
        sett: {
          c: '600',
          m: '1',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const text = await response.text();

    let data;

    if (text.trim() !== '') {
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response text:', text);
        throw new Error('JSON parse error');
      }
    } else {
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Fetch user data failed: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}
