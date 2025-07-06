import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

function isValidUrl(url) {
  return typeof url === 'string' && url.startsWith('http');
}

export default function Post({ post }) {
  const [liked, setLiked] = useState(false);

  return (
    <>
      {isValidUrl(post.imageId) && (
        <Image 
          source={{ uri: post.imageId }} 
          style={styles.image} 
          resizeMode="cover" 
        />
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{post.title}</Text>
        <View style={styles.authorContainer}>
          <Ionicons name="person-circle-outline" size={16} color="#9ca3af" />
          <Text style={styles.author}>
            {post.author?.name || 'Autor desconhecido'}
          </Text>
        </View>
        <Text style={styles.postContent}>{post.content}</Text>
        <TouchableOpacity 
          style={styles.likeButton}
          onPress={() => setLiked(!liked)}
        >
          <Ionicons 
            name={liked ? "heart" : "heart-outline"} 
            size={24} 
            color={liked ? "#ef4444" : "#9ca3af"} 
          />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#374151',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  author: {
    color: '#9ca3af',
    fontSize: 14,
    marginLeft: 6,
  },
  postContent: {
    color: '#d1d5db',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  likeButton: {
    alignSelf: 'flex-start',
    padding: 4,
  },
});