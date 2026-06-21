import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import Card from '../../components/Card';
import { useFocusEffect } from '@react-navigation/native';

const ExporterDashboard = ({ navigation }) => {
  const { user } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [sRes, bRes] = await Promise.all([
        api.get('/exporter/shipments'),
        api.get('/exporter/buyers'),
      ]);
      setShipments(sRes.data || []);
      setBuyers(bRes.data || []);
    } catch (e) { console.error(e); }
  };

  useFocusEffect(useCallback(() => { fetchData(); }, []));

  const onRefresh = async () => { setRefreshing(true); await fetchData(); setRefreshing(false); };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />}>
        <Text style={styles.welcome}>Welcome, {user?.name || 'Exporter'} 👋</Text>
        <View style={styles.statsRow}>
          <Card style={styles.stat}><Text style={styles.statNum}>{shipments.length}</Text><Text style={styles.statLabel}>Shipments</Text></Card>
          <Card style={styles.stat}><Text style={styles.statNum}>{buyers.length}</Text><Text style={styles.statLabel}>Buyers</Text></Card>
          <Card style={styles.stat}><Text style={styles.statNum}>0</Text><Text style={styles.statLabel}>Documents</Text></Card>
        </View>
        <Text style={styles.sectionTitle}>Recent Shipments</Text>
        {shipments.slice(0, 3).map((s, i) => (
          <Card key={i}>
            <Text style={styles.shipNum}>{s.shipmentNumber || s._id}</Text>
            <Text style={styles.shipDest}>{s.destinationCountry}</Text>
            <Text style={styles.shipStatus}>{s.status}</Text>
          </Card>
        ))}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('CreateShipment')}>
            <Text style={styles.actionIcon}>📦</Text>
            <Text style={styles.actionText}>New Shipment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('PreShipment')}>
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionText}>Pre-Shipment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('PostShipment')}>
            <Text style={styles.actionIcon}>🚢</Text>
            <Text style={styles.actionText}>Post-Shipment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  content: { padding: 20, paddingTop: 60 },
  welcome: { color: '#ffffff', fontSize: 24, fontWeight: '700', marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 8 },
  stat: { flex: 1, alignItems: 'center' },
  statNum: { color: '#6366f1', fontSize: 28, fontWeight: '800' },
  statLabel: { color: '#a8b2d8', fontSize: 12, marginTop: 4 },
  sectionTitle: { color: '#ffffff', fontSize: 18, fontWeight: '600', marginTop: 24, marginBottom: 8 },
  shipNum: { color: '#ffffff', fontWeight: '600' },
  shipDest: { color: '#a8b2d8', fontSize: 13, marginTop: 4 },
  shipStatus: { color: '#6366f1', fontSize: 12, marginTop: 4 },
  actionsRow: { flexDirection: 'row', gap: 8 },
  actionBtn: { flex: 1, backgroundColor: '#1a1a2e', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#2a2a4e' },
  actionIcon: { fontSize: 24, marginBottom: 8 },
  actionText: { color: '#a8b2d8', fontSize: 12, textAlign: 'center' },
});

export default ExporterDashboard;
