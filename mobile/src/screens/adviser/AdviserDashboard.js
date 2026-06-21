import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import Card from '../../components/Card';

const AdviserDashboard = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetch = async () => {
    try { const r = await api.get('/adviser/consultations'); setConsultations(r.data || []); } catch(e) {}
  };
  useFocusEffect(useCallback(() => { fetch(); }, []));
  const onRefresh = async () => { setRefreshing(true); await fetch(); setRefreshing(false); };

  const pending = consultations.filter(c => c.status === 'pending').length;
  const confirmed = consultations.filter(c => c.status === 'confirmed').length;
  const completed = consultations.filter(c => c.status === 'completed').length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />}>
        <Text style={styles.welcome}>Trade Adviser 💼</Text>
        <Text style={styles.sub}>Welcome, {user?.name || 'Adviser'}</Text>
        <View style={styles.statsRow}>
          <Card style={styles.stat}><Text style={styles.statNum}>{pending}</Text><Text style={styles.statLabel}>Pending</Text></Card>
          <Card style={styles.stat}><Text style={styles.statNum}>{confirmed}</Text><Text style={styles.statLabel}>Confirmed</Text></Card>
          <Card style={styles.stat}><Text style={styles.statNum}>{completed}</Text><Text style={styles.statLabel}>Completed</Text></Card>
        </View>
        <Text style={styles.total}>Total Consultations: {consultations.length}</Text>
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
  total: { color: '#ffffff', fontSize: 16, marginTop: 20, textAlign: 'center' },
});

export default AdviserDashboard;
