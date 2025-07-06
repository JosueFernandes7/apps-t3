import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, StatusBar, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPosts } from '../services/api';
import { Card } from '../components/Card';
import Post from '../components/Post';

const PAGE_SIZE = 10;

const PostListScreen = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async (nextPage = 1) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const { data } = await getPosts({ page: nextPage, limit: PAGE_SIZE });
      if (data.posts && data.posts.length > 0) {
        setPosts(prev => nextPage === 1 ? data.posts : [...prev, ...data.posts]);
        setHasMore(data.posts.length === PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch (e) {
      if (nextPage === 1) setPosts([]);
      setHasMore(false);
    }
    setLoading(false);
  }, [loading, hasMore]);

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchPosts(page + 1);
      setPage(prev => prev + 1);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    setHasMore(true);
    fetchPosts(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="list-outline" size={28} color="#3b82f6" />
          <Text style={styles.title}>Posts</Text>
        </View>
        <Text style={styles.subtitle}>
          {posts.length > 0 ? `${posts.length} post${posts.length > 1 ? 's' : ''} encontrado${posts.length > 1 ? 's' : ''}` : 'Carregando posts...'}
        </Text>
      </View>
      
      <FlatList
        data={posts}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <Card>
            <Post post={item} />
          </Card>
        )}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={64} color="#374151" />
              <Text style={styles.emptyText}>Nenhum post encontrado</Text>
              <Text style={styles.emptySubtext}>Seja o primeiro a criar um post!</Text>
            </View>
          )
        }
        ListFooterComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text style={styles.loadingText}>Carregando posts...</Text>
            </View>
          ) : null
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshing={loading && page === 1}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#9ca3af',
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 12,
    textAlign: 'center',
  },
});

export default PostListScreen;