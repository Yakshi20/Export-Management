import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Alert, StyleSheet, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../api/api';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Input from '../../components/Input';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';

const fwdStatuses = ['Booked', 'In Transit', 'At Port', 'Delivered'];

const ForwarderShipmentsScreen = () => {
  const [shipments, setShipments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [location, setLocation] = useState('');
  const [eta, setEta] = useState('');
  const [status, setStatus] = useState('');

  const fetch = async () => {
    try { const r = await api.get('/forwarder/shipments'); setShipments(r.data?.data || r.data || []); } catch(e) {}
  };
  useFocusEffect(useCallback(() => { fetch(); }, []));
  const onRefresh = async () => { setRefreshing(true); await fetch(); setRefreshing(false); };

  const update = async (id) => {
    try {
      await api.put(`/forwarder/shipments/${id}`, { currentLocation: location, eta, status });
      Alert.alert('Updated', 'Shipment updated');
      setExpanded(null); fetch();
    } catch(e) { Alert.alert('Error', 'Failed to update'); }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={shipments}
        keyExtractor={(item, i) => item._id || String(i)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />}
        ListHeaderComponent={<Text style={styles.title}>Shipments</Text>}
        ListEmptyComponent={<EmptyState icon="🚢" title="No Shipments" subtitle="No assigned shipments" />}
        renderItem={({ item }) => (
          <Card>
            <TouchableOpacity onPress={() => { setExpanded(expanded === item._id ? null : item._id); setLocation(item.currentLocation || ''); setEta(item.eta || ''); setStatus(item.status || ''); }}>
              <Text style={styles.shipNum}>{item.shipmentNumber || item._id}</Text>
              <View style={styles.row}>
                <Badge status={item.status || 'pending'} />
                <Text style={styles.expand}>{expanded === item._id ? '▲' : '▼'}</Text>
              </View>
            </TouchableOpacity>
            {expanded === item._id && (
              <View style={styles.expandedContent}>
                <Input label="Current Location" value={location} onChangeText={setLocation} placeholder="Port / City" />
                <Input label="ETA (YYYY-MM-DD)" value={eta} onChangeText={setEta} placeholder="2024-06-15" />
                <Text style={styles.statusLabel}>Status:</Text>
                <View style={styles.statusBtns}>
                  {fwdStatuses.map(s => (
                    <TouchableOpacity key={s} style={[styles.sBtn, status === s && styles.sBtnActive]} onPress={() => setStatus(s)}>
                      <Text style={[styles.sBtnText, status === s && styles.sBtnTextActive]}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Button title="Update Shipment" onPress={() => update(item._id)} />
              </View>
            )}
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  list: { padding: 20, paddingTop: 60 },
  title: { color: '#ffffff', fontSize: 28, fontWeight: '700', marginBottom: 16 },
  shipNum: { color: '#ffffff', fontWeight: '600', fontSize: 16, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  expand: { color: '#a8b2d8' },
  expandedContent: { marginTop: 12, borderTopWidth: 1, borderTopColor: '#2a2a4e', paddingTop: 12 },
  statusLabel: { color: '#a8b2d8', marginBottom: 8, marginTop: 8 },
  statusBtns: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  sBtn: { backgroundColor: '#2a2a4e', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12 },
  sBtnActive: { backgroundColor: '#6366f120', borderWidth: 1, borderColor: '#6366f1' },
  sBtnText: { color: '#a8b2d8', fontSize: 13 },
  sBtnTextActive: { color: '#6366f1', fontWeight: '600' },
});

export default ForwarderShipmentsScreen;
