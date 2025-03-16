import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  PixelRatio,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParamList, UserSearchResult} from '../../types';
import NoDataFound from '../../components/no_data_found/NoDataFound';
import {searchUsersForChat} from '../../config/axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import styled from 'styled-components/native';

type AddChatScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'AddChatScreen'
>;

const screenWidth = Dimensions.get('window').width;
const scale = screenWidth / 320;

const normalize = (size: number) => {
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

// Styled components for the header (matching ChatScreen)
const Header = styled.View`
  background-color: #0074a6;
  padding: 10px;
  flex-direction: row;
  align-items: center;
`;

const HeaderText = styled.Text`
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
  margin-left: 10px;
`;

const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
`;

const AddChatScreen: React.FC = () => {
  const navigation = useNavigation<AddChatScreenNavigationProp>();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchText.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const results = await searchUsersForChat(searchText);
      console.log('Search results:', results);
      setSearchResults(results);
      setHasSearched(true);
    } catch (error) {
      console.error('Error searching for users:', error);
      setError('Failed to search for users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserPress = (user: UserSearchResult) => {
    // Navigate to ChatScreen with the selected user
    navigation.navigate('ChatScreen', {
      data: {
        userId: user.id,
        fullName: user.fullName,
        photo: user.photo,
      },
    });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0074A6" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (hasSearched && searchResults.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.noResultsText}>No users found</Text>
        </View>
      );
    }

    if (searchResults.length > 0) {
      return (
        <FlatList
          data={searchResults}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.userItem}
              onPress={() => handleUserPress(item)}>
              <Image
                source={
                  item.photo
                    ? {
                        uri: `https://sms.psleprimary.com/uploads/profile/${item.photo}`,
                      }
                    : require('../../assest/icons/download.jpg')
                }
                style={styles.avatar}
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.fullName}</Text>
                <Text style={styles.userDetails}>
                  {item.role ? `${item.role}` : 'User'}
                  {item.username ? ` • ${item.username}` : ''}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      );
    }

    return (
      <View style={styles.centerContainer}>
        <Text style={styles.instructionText}>
          Search for users to start a new chat
        </Text>
      </View>
    );
  };

  return (
    <Container>
      {/* Using the same header style as ChatScreen */}
      <Header>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View>
            <AntDesign
              name="arrowleft"
              size={24}
              color="#ffffff"
              style={{marginRight: 10}}
            />
          </View>
        </TouchableOpacity>
        <HeaderText>New Chat</HeaderText>
      </Header>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or username"
          placeholderTextColor="#666666"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={loading}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {renderContent()}
    </Container>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    padding: normalize(15),
    backgroundColor: '#F8F8F8', // Light gray search container
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchInput: {
    flex: 1,
    height: normalize(40),
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: normalize(5),
    paddingHorizontal: normalize(10),
    marginRight: normalize(10),
    color: '#333333', // Dark text
    backgroundColor: '#FFFFFF', // White input background
  },
  searchButton: {
    backgroundColor: '#0074A6', // Keep the blue button
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: normalize(15),
    borderRadius: normalize(5),
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(20),
    backgroundColor: '#FFFFFF',
  },
  instructionText: {
    fontSize: normalize(16),
    color: '#333333', // Dark text
    textAlign: 'center',
  },
  errorText: {
    fontSize: normalize(16),
    color: '#D32F2F', // Red error text
    textAlign: 'center',
  },
  noResultsText: {
    fontSize: normalize(16),
    color: '#333333', // Dark text
    textAlign: 'center',
  },
  userItem: {
    flexDirection: 'row',
    padding: normalize(15),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // White item background
  },
  avatar: {
    width: normalize(50),
    height: normalize(50),
    borderRadius: normalize(25),
  },
  userInfo: {
    marginLeft: normalize(15),
    flex: 1,
  },
  userName: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: '#333333', // Dark text
  },
  userDetails: {
    fontSize: normalize(14),
    color: '#666666', // Medium gray details
    marginTop: normalize(4),
  },
});

export default AddChatScreen;
