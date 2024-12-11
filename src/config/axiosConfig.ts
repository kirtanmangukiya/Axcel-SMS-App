import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginData {
  token: string;
  // Define other properties you expect in your login data
}

export const getToken = async (): Promise<string | null> => {
  try {
    const tokenString = await AsyncStorage.getItem('loginData');
    if (tokenString) {
      const loginData: LoginData = JSON.parse(tokenString);
      return loginData.token;
    }
    return null;
  } catch (error) {
    console.error('Error retrieving token from AsyncStorage:', error);
    return null;
  }
};
