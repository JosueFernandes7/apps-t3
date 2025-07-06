import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUsers } from '../services/api';

const PAGE_SIZE = 50;

const UserListScreen = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async (pageToFetch = 1) => {
    setLoading(true);
    try {
      const { data } = await getUsers({ page: pageToFetch, limit: PAGE_SIZE });
      setUsers(data.users || []);
      if (data.total) {
        setTotalPages(Math.ceil(data.total / PAGE_SIZE));
      } else {
        setTotalPages(data.users && data.users.length === PAGE_SIZE ? pageToFetch + 1 : pageToFetch);
      }
      setPage(pageToFetch);
    } catch (e) {
      setUsers([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const renderHeader = () => (
    <View style={styles.headerRow}>
      <View style={[styles.headerCell, { flex: 1.2 }]}>
        <Ionicons name="person-outline" size={16} color="#ffffff" />
        <Text style={styles.headerText}>Nome</Text>
      </View>
      <View style={[styles.headerCell, { flex: 2 }]}>
        <Ionicons name="mail-outline" size={16} color="#ffffff" />
        <Text style={styles.headerText}>E-mail</Text>
      </View>
    </View>
  );

  const renderItem = ({ item, index }) => (
    <View style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
      <View style={[styles.cell, { flex: 1.2 }]}>
        <View style={styles.userAvatar}>
          <Text style={styles.avatarText}>{item.name?.charAt(0).toUpperCase() || 'U'}</Text>
        </View>
        <Text style={styles.cellText} numberOfLines={1}>{item.name}</Text>
      </View>
      <View style={[styles.cell, { flex: 2 }]}>
        <Text style={styles.cellText} numberOfLines={1}>{item.email}</Text>
      </View>
    </View>
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.pageButton,
            page === i && styles.pageButtonActive
          ]}
          onPress={() => fetchUsers(i)}
        >
          <Text style={page === i ? styles.pageButtonTextActive : styles.pageButtonText}>{i}</Text>
        </TouchableOpacity>
      );
    }
    return (
      <View style={styles.paginationContainer}>
        {buttons}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="people-outline" size={28} color="#10b981" />
          <Text style={styles.title}>Usuários</Text>
        </View>
        <Text style={styles.subtitle}>
          {users.length > 0 ? `${users.length} usuário${users.length > 1 ? 's' : ''} encontrado${users.length > 1 ? 's' : ''}` : 'Carregando usuários...'}
        </Text>
      </View>

      <FlatList
        data={users}
        keyExtractor={item => item.email}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        stickyHeaderIndices={[0]}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={64} color="#374151" />
              <Text style={styles.emptyText}>Nenhum usuário encontrado</Text>
              <Text style={styles.emptySubtext}>Tente novamente mais tarde</Text>
            </View>
          )
        }
        ListFooterComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#10b981" />
              <Text style={styles.loadingText}>Carregando usuários...</Text>
            </View>
          ) : (
            renderPagination()
          )
        }
        refreshing={loading}
        onRefresh={() => fetchUsers(1)}
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
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#374151',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerCell: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  headerText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  rowEven: {
    backgroundColor: '#1f2937',
  },
  rowOdd: {
    backgroundColor: '#111827',
  },
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cellText: {
    color: '#ffffff',
    fontSize: 15,
    flex: 1,
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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
    flexWrap: 'wrap',
    gap: 8,
  },
  pageButton: {
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 4,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  pageButtonActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  pageButtonText: {
    color: '#d1d5db',
    fontWeight: '600',
    fontSize: 14,
  },
  pageButtonTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default UserListScreen;