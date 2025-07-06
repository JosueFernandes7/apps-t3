import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Alert, ActivityIndicator, StatusBar, SafeAreaView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { getMyPosts, deletePost } from '../services/api';
import { Card } from '../components/Card';
import Post from '../components/Post';

const MyPostsScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMyPosts = async () => {
    setLoading(true);
    try {
      const { data } = await getMyPosts();
      setPosts(data.posts || data || []);
    } catch (e) {
      setPosts([]);
      Toast.show({
        type: 'error',
        text1: 'Erro ao carregar posts',
        text2: 'Não foi possível carregar seus posts.',
      });
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMyPosts();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleDelete = (postId) => {
    Alert.alert(
      'Deletar Post',
      'Tem certeza que deseja deletar este post?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePost(postId);
              setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
              Toast.show({
                type: 'success',
                text1: 'Post deletado',
                text2: 'Seu post foi removido com sucesso.',
              });
            } catch (e) {
              Toast.show({
                type: 'error',
                text1: 'Erro ao deletar',
                text2: 'Não foi possível deletar o post.',
              });
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f59e0b" />
          <Text style={styles.loadingText}>Carregando seus posts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="person-outline" size={28} color="#f59e0b" />
          <Text style={styles.title}>Meus Posts</Text>
        </View>
        <Text style={styles.subtitle}>
          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </Text>
      </View>

      <FlatList
        data={posts}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <Card>
              <Post post={item} />
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id)}
                >
                  <Ionicons name="trash-outline" size={18} color="#ffffff" />
                  <Text style={styles.deleteButtonText}>Deletar</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#6b7280" />
            <Text style={styles.emptyTitle}>Nenhum post ainda</Text>
            <Text style={styles.emptyText}>
              Você ainda não criou nenhum post. Que tal compartilhar algo interessante?
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#f59e0b']}
            tintColor="#f59e0b"
            progressBackgroundColor="#1a1a1a"
          />
        }
        contentContainerStyle={posts.length === 0 ? styles.emptyList : styles.listContent}
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
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#111111',
    borderBottomWidth: 1,
    borderBottomColor: '#1f1f1f',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    marginLeft: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#9ca3af',
    fontSize: 16,
    marginTop: 12,
  },
  postContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  actionContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1f1f1f',
    marginTop: 12,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dc2626',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyList: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default MyPostsScreen;