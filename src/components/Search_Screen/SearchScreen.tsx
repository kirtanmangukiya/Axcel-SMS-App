import {
  DrawerActions,
  RouteProp,
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainStackParamList} from '../../types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import TopBar from '../TopBar';

const SEARCH_HISTORY_KEY = 'searchHistory';

type SearchScreenRouteProp = RouteProp<MainStackParamList, 'SearchScreen'>;
type SearchScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'SearchScreen'
>;

const SearchScreen = () => {
  const route = useRoute<SearchScreenRouteProp>();
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const {students, sourceScreen} = route.params;
  const [searchText, setSearchText] = useState('');
  const [searchTerms, setSearchTerms] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const SEARCH_HISTORY_KEY_PREFIX = 'searchHistory_';
  const [showHistory, setShowHistory] = useState(false);
  // console.log(students, sourceScreen);
  const navigation2 = useNavigation();

  useEffect(() => {
    // Load search history from AsyncStorage when the component mounts
    const loadSearchHistory = async () => {
      try {
        const key = `${SEARCH_HISTORY_KEY_PREFIX}${sourceScreen}`;
        const storedSearchHistory = await AsyncStorage.getItem(key);
        if (storedSearchHistory) {
          setSearchTerms(JSON.parse(storedSearchHistory));
          setShowHistory(true); // Show history when loaded
        } else {
          setShowHistory(false); // No history to show
        }
      } catch (error) {
        console.error('Failed to load search history:', error);
      }
    };

    loadSearchHistory();

    // Clean up function to clear history when navigating away
    return () => {
      setSearchTerms([]);
      setShowHistory(false);
    };
  }, [sourceScreen]); // Depend on sourceScreen to reload history when it changes

  const saveSearchTerm = async (term: string) => {
    try {
      const key = `${SEARCH_HISTORY_KEY_PREFIX}${sourceScreen}`;
      let updatedSearchTerms = [...searchTerms];
      if (!updatedSearchTerms.includes(term)) {
        updatedSearchTerms = [term, ...updatedSearchTerms];
        if (updatedSearchTerms.length > 8) {
          updatedSearchTerms = updatedSearchTerms.slice(0, 8);
        }
        setSearchTerms(updatedSearchTerms);
        await AsyncStorage.setItem(key, JSON.stringify(updatedSearchTerms));
        setShowHistory(true); // Show history when saving new term
      }
    } catch (error) {
      console.error('Failed to save search term:', error);
    }
  };

  // useEffect(() => {
  //   const backAction = () => {
  //     navigation.goBack();
  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );

  //   return () => backHandler.remove();
  // }, []);

  const handleSearch = () => {
    console.log(searchText, students);

    if (searchText) {
      saveSearchTerm(searchText);

      const filteredStudents = students.filter(
        student =>
          student.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
          student.studentRollId
            ?.toLowerCase()
            .includes(searchText.toLowerCase()),
      );

      const pushAction = StackActions.push('StudentScreen', {
        results: filteredStudents,
      });
      navigation.dispatch(pushAction);

      setSearchText('');
    }
  };

  // useEffect(() => {
  //   const handleBackPress = () => {
  //     navigation.goBack();
  //     return true; // Prevent default behavior
  //   };

  //   BackHandler.addEventListener('hardwareBackPress', handleBackPress);

  //   return () => {
  //     BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
  //   };
  // }, [navigation]);

  const handleSearch2 = () => {
    if (searchText) {
      saveSearchTerm(searchText);
      setSearchTerms(prevTerms => {
        if (!prevTerms.includes(searchText)) {
          return [...prevTerms, searchText];
        }
        return prevTerms;
      });

      const filteredStudents = students.filter(student =>
        student.fullName?.toLowerCase().includes(searchText.toLowerCase()),
      );

      const pushAction = StackActions.push('TeachersScreen', {
        results: filteredStudents,
      });
      navigation.dispatch(pushAction);

      setSearchText('');
    }
  };
  const handleSearch3 = () => {
    if (searchText) {
      saveSearchTerm(searchText);
      setSearchTerms(prevTerms => {
        if (!prevTerms.includes(searchText)) {
          return [...prevTerms, searchText];
        }
        return prevTerms;
      });

      const filteredStudents = students.filter(student =>
        student.fullName?.toLowerCase().includes(searchText.toLowerCase()),
      );

      const pushAction = StackActions.push('ParentsScreen', {
        results: filteredStudents,
      });
      navigation.dispatch(pushAction);

      setSearchText('');
    }
  };

  const handleInvoicePress = () => {
    // console.log('Search initiated with text:', searchText);

    if (searchText) {
      // Save the search term and update search history
      saveSearchTerm(searchText);
      setSearchTerms(prevTerms => {
        console.log('Previous search terms:', prevTerms);
        return [...prevTerms, searchText];
      });

      // Filter the invoices based on the searchText
      const filteredInvoices = students.filter(invoice => {
        const paymentTitleMatch = invoice.invoicePyaments?.[0]?.paymentTitle
          ?.toLowerCase()
          .includes(searchText.toLowerCase());

        // Log each invoice and whether it matches the search
        // console.log('Checking invoice:', invoice);
        // console.log('Payment title match:', paymentTitleMatch);

        return paymentTitleMatch;
      });

      // console.log('Filtered invoices:', filteredInvoices);

      // Navigate to InvoiceScreen with the filtered invoices
      const pushAction = StackActions.push('InvoiceScreen', {
        results: filteredInvoices,
      });

      // console.log(
      //   'Navigating to InvoiceScreen with results:',
      //   filteredInvoices,
      // );
      navigation.dispatch(pushAction);

      // Clear the search text after search is complete
      setSearchText('');
      // console.log('Search text cleared');
    } else {
      // console.log('No search text entered');
    }
  };

  const handleDueInvoicePress = () => {
    // console.log('Search initiated with text:', searchText);

    if (searchText) {
      // Save the search term and update search history
      saveSearchTerm(searchText);
      setSearchTerms(prevTerms => {
        console.log('Previous search terms:', prevTerms);
        return [...prevTerms, searchText];
      });

      // Filter the invoices based on the searchText
      const filteredInvoices = students.filter(invoice => {
        const paymentTitleMatch = invoice.invoicePyaments?.[0]?.paymentTitle
          ?.toLowerCase()
          .includes(searchText.toLowerCase());

        // Log each invoice and whether it matches the search
        // console.log('Checking invoice:', invoice);
        // console.log('Payment title match:', paymentTitleMatch);

        return paymentTitleMatch;
      });

      // console.log('Filtered invoices:', filteredInvoices);

      // Navigate to InvoiceScreen with the filtered invoices
      const pushAction = StackActions.push('InvoiceScreen', {
        results: filteredInvoices,
      });

      // console.log(
      //   'Navigating to InvoiceScreen with results:',
      //   filteredInvoices,
      // );
      navigation.dispatch(pushAction);

      // Clear the search text after search is complete
      setSearchText('');
      // console.log('Search text cleared');
    } else {
      // console.log('No search text entered');
    }
  };
  const handleMessagePress = () => {
    if (searchText) {
      saveSearchTerm(searchText);
      setSearchTerms(prevTerms => {
        if (!prevTerms.includes(searchText)) {
          return [...prevTerms, searchText];
        }
        return prevTerms;
      });
      const filteredInvoices = students.filter(invoice =>
        invoice.fullName?.toLowerCase().includes(searchText.toLowerCase()),
      );
      const pushAction = StackActions.push('MessageScreen', {
        results: filteredInvoices,
      });
      navigation.dispatch(pushAction);
      setSearchText('');
    }
  };
  const handlecreditNotesPress = () => {
    if (searchText) {
      saveSearchTerm(searchText);
          setSearchTerms(prevTerms => {
            if (!prevTerms.includes(searchText)) {
              return [...prevTerms, searchText];
            }
            return prevTerms;
          }); 
         const filteredInvoices = students.filter(invoice =>
        invoice.fullName?.toLowerCase().includes(searchText.toLowerCase()),
      );
      const pushAction = StackActions.push('CredentialsNotesScreen', {
        results: filteredInvoices,
      });
      navigation.dispatch(pushAction);
      setSearchText('');
    }
  };
  const handleHomeWorkPress = () => {
    if (searchText) {
      saveSearchTerm(searchText);
      setSearchTerms(prevTerms => {
        if (!prevTerms.includes(searchText)) {
          return [...prevTerms, searchText];
        }
        return prevTerms;
      });
      const filteredInvoices = students.filter(invoice =>
        invoice?.homeworkTitle.toLowerCase().includes(searchText.toLowerCase()),
      );
      console.log(filteredInvoices);
      // navigation.navigate('BooksLibraryScreen', {results: filteredInvoices});
      const pushActon = StackActions.push('HomeWork', {
        results: filteredInvoices,
      });
      navigation.dispatch(pushActon);
      setSearchText('');
    }
  };
  const handleBooksLibraryPress = () => {
    if (searchText) {
      saveSearchTerm(searchText);
      setSearchTerms(prevTerms => {
        if (!prevTerms.includes(searchText)) {
          return [...prevTerms, searchText];
        }
        return prevTerms;
      });
      const filteredInvoices = students.filter(invoice =>
        invoice.bookName?.toLowerCase().includes(searchText.toLowerCase()),
      );
      console.log(filteredInvoices);
      // navigation.navigate('BooksLibraryScreen', {results: filteredInvoices});
      const pushActon = StackActions.push('BooksLibraryScreen', {
        results: filteredInvoices,
      });
      navigation.dispatch(pushActon);
      setSearchText('');
    }
  };

  const YearScreenPress = () => {
    if (searchText) {
      saveSearchTerm(searchText);
      setSearchTerms(prevTerms => {
        if (!prevTerms.includes(searchText)) {
          return [...prevTerms, searchText];
        }
        return prevTerms;
      });
      const filteredInvoices = students.filter(invoice =>
        invoice.className?.toLowerCase().includes(searchText.toLowerCase()),
      );

      const pushActon = StackActions.push('YearScreen', {
        results: filteredInvoices,
      });
      navigation.dispatch(pushActon);
      setSearchText('');
    }
  };

  const SubjectScreenPress = () => {
    console.log('enter the SubjectScreenPress');

    if (searchText) {
      saveSearchTerm(searchText);
      setSearchTerms(prevTerms => {
        if (!prevTerms.includes(searchText)) {
          return [...prevTerms, searchText];
        }
        return prevTerms;
      });
      const filteredInvoices = students.filter(invoice =>
        invoice.subjectTitle?.toLowerCase().includes(searchText.toLowerCase()),
      );
      console.log('check the data of object output ', filteredInvoices);

      const pushActon = StackActions.push('SubjectsScreen', {
        results: filteredInvoices,
      });
      navigation.dispatch(pushActon);
      setSearchText('');
    }
  };

  const AssignmentPress = () => {
    console.log('dddddddddddddd');

    if (searchText) {
      saveSearchTerm(searchText);
      setSearchTerms(prevTerms => {
        if (!prevTerms.includes(searchText)) {
          return [...prevTerms, searchText];
        }
        return prevTerms;
      });
      const filteredInvoices = students.filter(invoice =>
        invoice.AssignTitle?.toLowerCase().includes(searchText.toLowerCase()),
      );
      const pushActon = StackActions.push('AssignmentScreen', {
        results: filteredInvoices,
      });
      navigation.dispatch(pushActon);
      setSearchText('');
    }
  };

  const newsBoardScreenPress = () => {
    if (searchText) {
      saveSearchTerm(searchText);
      setSearchTerms(prevTerms => {
        if (!prevTerms.includes(searchText)) {
          return [...prevTerms, searchText];
        }
        return prevTerms;
      });
      const filteredInvoices = students.filter(invoice =>
        invoice.newsTitle?.toLowerCase().includes(searchText.toLowerCase()),
      );
      const pushActon = StackActions.push('NewsBoard', {
        results: filteredInvoices,
      });
      navigation.dispatch(pushActon);
      setSearchText('');
    }
  };

  const eventsScreenPress = () => {
    if (searchText) {
      saveSearchTerm(searchText);
      setSearchTerms(prevTerms => {
        if (!prevTerms.includes(searchText)) {
          return [...prevTerms, searchText];
        }
        return prevTerms;
      });
      const filteredInvoices = students.filter(invoice =>
        invoice.eventTitle?.toLowerCase().includes(searchText.toLowerCase()),
      );

      // Navigate to EventsScreen and pass parameters
      navigation.navigate('EventsScreen', {
        results: filteredInvoices,
      });

      setSearchText('');
    }
  };

  const transportScreenPress = () => {
    if (searchText) {
      saveSearchTerm(searchText);
      setSearchTerms(prevTerms => {
        if (!prevTerms.includes(searchText)) {
          return [...prevTerms, searchText];
        }
        return prevTerms;
      });
      const filteredInvoices = students.filter(invoice =>
        invoice.transportTitle
          ?.toLowerCase()
          .includes(searchText.toLowerCase()),
      );
      const pushActon = StackActions.push('TransportScreen', {
        results: filteredInvoices,
      });
      navigation.dispatch(pushActon);
      setSearchText('');
    }
  };
  const GradeLevelPress = () => {
    if (searchText) {
      saveSearchTerm(searchText);
      setSearchTerms(prevTerms => {
        if (!prevTerms.includes(searchText)) {
          return [...prevTerms, searchText];
        }
        return prevTerms;
      });
      const filteredInvoices = students.filter(invoice =>
        invoice.gradeName?.toLowerCase().includes(searchText.toLowerCase()),
      );
      const pushActon = StackActions.push('GradeLevel', {
        results: filteredInvoices,
      });
      navigation.dispatch(pushActon);
      setSearchText('');
    }
  };
  const hostelPress = () => {
    if (searchText) {
      saveSearchTerm(searchText);
      setSearchTerms(prevTerms => {
        if (!prevTerms.includes(searchText)) {
          return [...prevTerms, searchText];
        }
        return prevTerms;
      });
      const filteredInvoices = students.filter(invoice =>
        invoice.hostelTitle?.toLowerCase().includes(searchText.toLowerCase()),
      );
      const pushActon = StackActions.push('HostelScreen', {
        results: filteredInvoices,
      });
      navigation.dispatch(pushActon);
      setSearchText('');
    }
  };
  const ResourceAndGuidePress = () => {
    if (searchText) {
      saveSearchTerm(searchText);
      setSearchTerms(prevTerms => {
        if (!prevTerms.includes(searchText)) {
          return [...prevTerms, searchText];
        }
        return prevTerms;
      });
      const filteredInvoices = students.filter(invoice =>
        invoice.material_title
          ?.toLowerCase()
          .includes(searchText.toLowerCase()),
      );
      const pushActon = StackActions.push('ResourceAndGuide', {
        results: filteredInvoices,
      });
      navigation.dispatch(pushActon);
      setSearchText('');
    }
  };
  const handleMenuPress = React.useCallback(() => {
    const storeRouteNameAtIndex = async () => {
      try {
        const state = navigation.getState();
        console.log('Current Navigation State:', state);

        // Check if the state is of type 'stack'
        if (state?.type === 'stack') {
          // Get the route name at index 1
          const routeAtIndex = state.routes[0]?.name;

          if (routeAtIndex) {
            // Store the route name in AsyncStorage
            await AsyncStorage.setItem('EventStorage', routeAtIndex);
            console.log('Stored Route at Index 1:', routeAtIndex);
          } else {
            console.log('No route found at index 1');
          }
        }
      } catch (error) {
        console.error('Failed to store route in AsyncStorage:', error);
      }
    };
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const handleTermPress = (term: string) => {
    setSearchText(term);
  };

  return (
    <ImageBackground
      style={styles.background}
      source={require('../../assest/icons/SideBarBg.jpg')}>
      <TopBar
        title="Axcel International School"
        onMenuPress={handleMenuPress}
      />
      <View style={styles.searchContainer}>
        <Text style={styles.label}>
          {sourceScreen == 'MessageScreen'
            ? 'Write Username or email'
            : 'Search'}
        </Text>
        <TextInput
          style={styles.input}
          // placeholder="Search by full name"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (sourceScreen === 'StudentScreen') {
              handleSearch();
            } else if (sourceScreen === 'TeachersScreen') {
              handleSearch2();
            } else if (sourceScreen === 'ParentsScreen') {
              handleSearch3();
            } else if (sourceScreen === 'DueInvoice') {
              handleDueInvoicePress();
            } else if (sourceScreen === 'InvoiceScreen') {
              handleInvoicePress();
            } else if (sourceScreen === 'BooksLibraryScreen') {
              handleBooksLibraryPress();
            } else if (sourceScreen === 'YearScreen') {
              YearScreenPress();
            } else if (sourceScreen === 'SubjectsScreen') {
              SubjectScreenPress();
            } else if (sourceScreen === 'NewsBoard') {
              newsBoardScreenPress();
            } else if (sourceScreen === 'EventsScreen') {
              eventsScreenPress();
            } else if (sourceScreen === 'TransportScreen') {
              transportScreenPress();
            } else if (sourceScreen === 'GradeLevel') {
              GradeLevelPress();
            } else if (sourceScreen === 'ResourceAndGuide') {
              ResourceAndGuidePress();
            } else if (sourceScreen === 'AssignmentScreen') {
              AssignmentPress();
              // console.log('----------------------------------');
            } else if (sourceScreen === 'HostelScreen') {
              hostelPress();
            } else if (sourceScreen === 'HomeWork') {
              handleHomeWorkPress();
            } else if (sourceScreen === 'MessageScreen') {
              handleMessagePress();
            } else if (sourceScreen === 'CredentialsNotesScreen') {
              handlecreditNotesPress();
            }
          }}>
          <Text style={styles.buttonText}>SEARCH</Text>
        </TouchableOpacity>
        {/* <View style={styles.termList}>
          {searchTerms.map((term, index) => (
            <TouchableOpacity
              key={index.toString()}
              style={styles.termItem}
              onPress={() => handleTermPress(term)}>
              <Text style={styles.termText}>{term}</Text>
            </TouchableOpacity>
          ))}
        </View> */}
        <View style={styles.termList}>
          {searchTerms.map((term, index) => (
            <TouchableOpacity
              key={index.toString()}
              style={styles.termItem}
              onPress={() => handleTermPress(term)}>
              <Text style={styles.termText}>{term}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  searchContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  input: {
    height: 40,
    borderBottomColor: '#ccc', // Only bottom border color
    borderBottomWidth: 1, // Only bottom border width
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingTop: 0, // Remove top padding to align text
    paddingBottom: 0, // Remove bottom padding for consistency
    borderRadius: 0, // Remove border radius to avoid rounding edges
    borderLeftWidth: 0, // Remove left border
    borderRightWidth: 0, // Remove right border
    borderTopWidth: 0, // Remove top border
    color: '#333',
  },

  button: {
    backgroundColor: '#00AEEF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  termList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  termItem: {
    backgroundColor: '#f0f0f0',
    padding: 5,
    borderRadius: 5,
    margin: 5,
  },
  termText: {
    fontSize: 16,
    color: '#333',
  },
});

export default SearchScreen;
