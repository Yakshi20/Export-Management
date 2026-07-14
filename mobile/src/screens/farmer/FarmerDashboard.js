import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import Card from '../../components/Card';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetch = async () => {
    try { const r = await api.get('/farmer/products'); setProducts(r.data?.data || r.data || []); } catch(e) {}
  };
  useFocusEffect(useCallback(() => { fetch(); }, []));
  const onRefresh = async () => { setRefreshing(true); await fetch(); setRefreshing(false); };

  const active = products.filter(p => p.available !== false).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />}>
        <Text style={styles.welcome}>Welcome, {user?.name || 'Farmer'} 🌾</Text>
        <View style={styles.statsRow}>
          <Card style={styles.stat}><Text style={styles.statNum}>{products.length}</Text><Text style={styles.statLabel}>Total Products</Text></Card>
          <Card style={styles.stat}><Text style={styles.statNum}>{active}</Text><Text style={styles.statLabel}>Active Listings</Text></Card>
        </View>
        <Text style={styles.sectionTitle}>Overview</Text>
        <Card>
          <Text style={styles.overviewText}>Manage your farm products and reach global buyers through ExportPro.</Text>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  content: { padding: 20, paddingTop: 60 },
  welcome: { color: '#ffffff', fontSize: 24, fontWeight: '700', marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 12 },
  stat: { flex: 1, alignItems: 'center' },
  statNum: { color: '#6366f1', fontSize: 28, fontWeight: '800' },
  statLabel: { color: '#a8b2d8', fontSize: 12, marginTop: 4 },
  sectionTitle: { color: '#ffffff', fontSize: 18, fontWeight: '600', marginTop: 24, marginBottom: 8 },
  overviewText: { color: '#a8b2d8', lineHeight: 22 },
});

export default FarmerDashboard;
