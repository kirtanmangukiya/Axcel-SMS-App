import AsyncStorage from '@react-native-async-storage/async-storage';

async function fetchTokenAndRefreshData() {
  try {
    const tokenString = await AsyncStorage.getItem('loginData');

    if (tokenString) {
      const token = JSON.parse(tokenString);
      if (token.user && token.user.role) {
        // Fetch new data using the token
        const newData = await MessageListData(token.authToken);

        // Update AsyncStorage with the new data if necessary
        await AsyncStorage.setItem('messageListData', JSON.stringify(newData));

        return { moduleType: token.user.role, userData: token, newData };
      } else {
        throw new Error('Invalid token structure');
      }
    } else {
      throw new Error('Token not found');
    }
  } catch (error) {
    console.error('Error retrieving or refreshing token:', error);
    throw error;
  }
}
