import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import Card from '../../components/Card';

const CHADashboard = () => {
  const { user } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetch = async () => {
    try { const r = await api.get('/cha/assigned-shipments'); setShipments(r.data || []); } catch(e) {}
  };
  useFocusEffect(useCallback(() => { fetch(); }, []));
  const onRefresh = async () => { setRefreshing(true); await fetch(); setRefreshing(false); };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />}>
        <Text style={styles.welcome}>CHA Dashboard 🛃</Text>
        <Text style={styles.sub}>Welcome, {user?.name || 'CHA Agent'}</Text>
        <Card style={styles.stat}>
          <Text style={styles.statNum}>{shipments.length}</Text>
          <Text style={styles.statLabel}>Assigned Shipments</Text>
        </Card>
        <Card>
          <Text style={styles.sectionTitle}>Recent Assignments</Text>
          {shipments.slice(0, 3).map((s, i) => (
            <View key={i} style={styles.shipRow}>
              <Text style={styles.shipNum}>{s.shipmentNumber || s._id}</Text>
              <Text style={styles.shipStatus}>{s.status}</Text>
            </View>
          ))}
          {shipments.length === 0 && <Text style={styles.empty}>No assignments yet</Text>}
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  content: { padding: 20, paddingTop: 60 },
  welcome: { color: '#ffffff', fontSize: 24, fontWeight: '700' },
  sub: { color: '#a8b2d8', marginTop: 4, marginBottom: 20 },
  stat: { alignItems: 'center', marginBottom: 16 },
  statNum: { color: '#6366f1', fontSize: 48, fontWeight: '800' },
  statLabel: { color: '#a8b2d8', fontSize: 14, marginTop: 4 },
  sectionTitle: { color: '#ffffff', fontSize: 16, fontWeight: '600', marginBottom: 12 },
  shipRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#2a2a4e' },
  shipNum: { color: '#ffffff' },
  shipStatus: { color: '#f59e0b' },
  empty: { color: '#a8b2d8', textAlign: 'center', paddingVertical: 16 },
});

export default CHADashboard;
