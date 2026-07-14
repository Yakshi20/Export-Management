import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import Card from '../../components/Card';

const ForwarderDashboard = () => {
  const { user } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetch = async () => {
    try { const r = await api.get('/forwarder/shipments'); setShipments(r.data?.data || r.data || []); } catch(e) {}
  };
  useFocusEffect(useCallback(() => { fetch(); }, []));
  const onRefresh = async () => { setRefreshing(true); await fetch(); setRefreshing(false); };

  const inTransit = shipments.filter(s => s.status === 'In Transit').length;
  const delivered = shipments.filter(s => s.status === 'Delivered').length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />}>
        <Text style={styles.welcome}>Freight Forwarder 🚢</Text>
        <Text style={styles.sub}>Welcome, {user?.name || 'Forwarder'}</Text>
        <View style={styles.statsRow}>
          <Card style={styles.stat}><Text style={styles.statNum}>{shipments.length}</Text><Text style={styles.statLabel}>Total</Text></Card>
          <Card style={styles.stat}><Text style={styles.statNum}>{inTransit}</Text><Text style={styles.statLabel}>In Transit</Text></Card>
          <Card style={styles.stat}><Text style={styles.statNum}>{delivered}</Text><Text style={styles.statLabel}>Delivered</Text></Card>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  content: { padding: 20, paddingTop: 60 },
  welcome: { color: '#ffffff', fontSize: 24, fontWeight: '700' },
  sub: { color: '#a8b2d8', marginTop: 4, marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 8 },
  stat: { flex: 1, alignItems: 'center' },
  statNum: { color: '#6366f1', fontSize: 28, fontWeight: '800' },
  statLabel: { color: '#a8b2d8', fontSize: 11, marginTop: 4, textAlign: 'center' },
});

export default ForwarderDashboard;
