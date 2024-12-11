import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';

const MediaScreen = ({ media }: { media: Array<any> }) => {
  const media_base_url = 'https://sms.psleprimary.com/uploads/media/';  // Update this as per your media path

  const renderMediaItem = ({ item: mediaItem }) => (
    <TouchableOpacity style={styles.mediaCard}>
      {/* Media Image */}
      <Image
        source={{ uri: `${media_base_url}${mediaItem?.mediaURL || mediaItem?.mediaURL}` }}  // Using thumb or mediaURL if thumb is unavailable
        style={styles.mediaImage}
      />
      {/* Media Title */}
      <Text style={styles.mediaTitle}>{mediaItem.mediaTitle}</Text>
      {/* Media Description */}
      <Text style={styles.mediaDescription}>
        {mediaItem.mediaDescription || 'No description available'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {media && media.length > 0 ? (
        <FlatList
          data={media}
          renderItem={renderMediaItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.flatListContainer}
        />
      ) : (
        <Text style={styles.noMediaText}>No media available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
    marginTop:'2 %'
  },
  mediaCard: {
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
  mediaImage: {
    width: 270,
    height: 400,
    borderRadius: 10,
    marginTop: 10,
  },
  mediaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
  mediaDescription: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
  },
  noMediaText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  flatListContainer: {
    paddingBottom: 16,
  },
});

export default MediaScreen;
