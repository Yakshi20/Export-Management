import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../api/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import ModalSheet from '../../components/ModalSheet';

const ForwarderBookingScreen = () => {
  const [forwarders, setForwarders] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookModal, setBookModal] = useState(null);

  const fetchForwarders = async () => {
    try {
      const r = await api.get('/exporter/forwarder-directory');
      setForwarders(r.data?.data || r.data || []);
    } catch (e) {} finally { setLoading(false); }
  };

  const fetchShipments = async () => {
    try {
      const r = await api.get('/exporter/shipments');
      setShipments(r.data?.data || r.data || []);
    } catch (e) {}
  };

  useFocusEffect(useCallback(() => { fetchForwarders(); fetchShipments(); }, []));

  const bookForShipment = async (shipmentId) => {
    try {
      await api.put(`/exporter/shipments/${shipmentId}`, { assignedForwarderId: bookModal._id });
      Alert.alert('Booked', 'Freight forwarder booked for shipment!');
      setBookModal(null);
      fetchShipments();
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.message || 'Failed to book forwarder');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={forwarders}
        keyExtractor={(item, i) => item._id || String(i)}
        contentContainerStyle={styles.list}
        onRefresh={fetchForwarders}
        refreshing={loading}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <Text style={styles.title}>Book a Freight Forwarder</Text>
            <Text style={styles.subtitle}>Browse registered freight forwarders and book one to handle logistics for your shipment.</Text>
          </View>
        }
        ListEmptyComponent={!loading && <EmptyState icon="🚚" title="No Forwarders" subtitle="No freight forwarders are registered on the platform yet." />}
        renderItem={({ item }) => (
          <Card>
            <View style={styles.rowTop}>
              <View style={styles.avatar}><Text style={styles.avatarText}>{(item.email || 'F')[0].toUpperCase()}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.email?.split('@')[0]}</Text>
              </View>
            </View>
            {!!item.mtoLicenseNumber && <Text style={styles.meta}>🪪 MTO License: {item.mtoLicenseNumber}</Text>}
            {!!item.mobile && <Text style={styles.meta}>📞 {item.mobile}</Text>}
            {!!item.email && <Text style={styles.meta}>✉️ {item.email}</Text>}
            <Button title="📌 Book for Shipment" onPress={() => setBookModal(item)} />
          </Card>
        )}
      />

      <ModalSheet visible={!!bookModal} onClose={() => setBookModal(null)} title={`Book ${bookModal?.email?.split('@')[0] || ''} for Shipment`}>
        {shipments.length === 0 ? (
          <Text style={styles.emptyText}>No shipments available. Create a shipment first.</Text>
        ) : shipments.map(s => (
          <TouchableOpacity key={s._id} style={styles.shipmentRow} onPress={() => bookForShipment(s._id)}>
            <View style={{ flex: 1 }}>
              <Text style={styles.shipmentName}>{s.productName}</Text>
              <Text style={styles.shipmentMeta}>#{s.shipmentNumber}</Text>
            </View>
            <Text style={styles.shipmentStatus}>{s.status || 'Created'}</Text>
            {(s.assignedForwarderId?._id || s.assignedForwarderId) === bookModal?._id && <Text style={styles.assignedTag}>✓ Booked</Text>}
          </TouchableOpacity>
        ))}
      </ModalSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  list: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  headerBlock: { marginBottom: 16 },
  title: { color: '#ffffff', fontSize: 26, fontWeight: '700' },
  subtitle: { color: '#a8b2d8', fontSize: 13, marginTop: 6 },
  rowTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#6366f1', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  name: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
  meta: { color: '#a8b2d8', fontSize: 12, marginBottom: 4 },
  emptyText: { color: '#a8b2d8', textAlign: 'center', paddingVertical: 20 },
  shipmentRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a2e', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#2a2a4e' },
  shipmentName: { color: '#ffffff', fontWeight: '600', fontSize: 14 },
  shipmentMeta: { color: '#a8b2d8', fontSize: 12, marginTop: 2 },
  shipmentStatus: { color: '#a8b2d8', fontSize: 12 },
  assignedTag: { color: '#10b981', fontSize: 11, fontWeight: '700', marginLeft: 8 },
});

export default ForwarderBookingScreen;
