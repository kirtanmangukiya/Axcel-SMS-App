import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import TopBar from '../components/TopBar';
import { MediaCenterData } from '../config/axios'; // Assuming MediaCenterData supports albumId param
import { MediaApiResponse } from '../types';
import AlbumsScreen from '../components/mediaCenterScreens/AlbumsScreen';
import MediaScreen from '../components/mediaCenterScreens/MediaScreen';

const MediaCenterScreen = () => {
  const [selectedTab, setSelectedTab] = useState('ALBUMS');  // Default selected tab is ALBUMS
  const [albumData, setAlbumData] = useState<MediaApiResponse | undefined>(undefined);
  const [specificMediaData, setSpecificMediaData] = useState<any | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();

  useEffect(() => {
    const loadData = async () => {
      try {
        // First API call without albumId to get all album data
        const generalAlbumData = await MediaCenterData();
        setAlbumData(generalAlbumData);  // Save general data for the "ALBUMS" tab

        // Second API call with albumId = 6 to get specific album data
        const specificAlbumResponse = await MediaCenterData(6);
        setSpecificMediaData(specificAlbumResponse?.media || []);  // Save media data for the "MEDIA" tab
        console.log('Specific Album Data:', specificAlbumResponse);  // Log specific data to console
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleMenuPress = React.useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  // Function to render content based on the selected tab
  const renderContent = () => {
    if (loading) {
      return <Text style={styles.loadingText}>Loading...</Text>;
    }
    if (selectedTab === 'ALBUMS') {
      return <AlbumsScreen albums={albumData?.albums || []} />;  // Render general album data
    } else if (selectedTab === 'MEDIA') {
      return <MediaScreen media={specificMediaData} />;  // Pass media data to the MediaScreen component
    }
    return null;
  };

  return (
    <ImageBackground
      source={require('../assest/icons/SideBarBg.jpg')}  // Background image
      style={styles.background}
    >
      {/* Top Bar with Menu Button */}
      <TopBar title="Media Center" onMenuPress={handleMenuPress} />

      {/* Tab Buttons for Albums and Media */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'ALBUMS' && styles.activeTab]}
          onPress={() => setSelectedTab('ALBUMS')}
        >
          <Text style={[styles.tabText, selectedTab === 'ALBUMS' && styles.activeTabText]}>
            ALBUMS
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'MEDIA' && styles.activeTab]}
          onPress={() => setSelectedTab('MEDIA')}
        >
          <Text style={[styles.tabText, selectedTab === 'MEDIA' && styles.activeTabText]}>
            MEDIA
          </Text>
        </TouchableOpacity>
      </View>

      {/* Render content based on the selected tab */}
      {renderContent()}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  tabText: {
    fontWeight: 'bold',
    color: '#d1c7c7',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: 'white',
  },
  activeTabText: {
    color: 'white',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#fff',
  },
});

export default MediaCenterScreen;
