import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';

const AlbumsScreen = ({ albums }) => {
  const media_base_url = 'https://sms.psleprimary.com/uploads/media/';

  const renderAlbumItem = ({ item: album }) => (
    <TouchableOpacity style={styles.albumCard}>
      <Image
        source={{ uri: `${media_base_url}${album?.albumImage}` }}
        style={styles.albumImage}
      />
      <Text style={styles.albumTitle}>{album.albumTitle}</Text>
      <Text style={styles.albumDescription}>
        {album.albumDescription || 'No description available'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {albums && albums.length > 0 ? (
        <FlatList
          data={albums}
          renderItem={renderAlbumItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.flatListContainer}
        />
      ) : (
        <Text style={styles.noMediaText}>No albums available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  albumCard: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 20,
    marginVertical: 5,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  albumImage: {
    width: 300,
    height: 450,
    borderRadius: 10,
    marginTop: 10,
  },
  albumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
  albumDescription: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  noMediaText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AlbumsScreen;
