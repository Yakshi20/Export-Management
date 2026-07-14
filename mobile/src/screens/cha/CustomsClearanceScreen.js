import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Alert, StyleSheet, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../api/api';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import EmptyState from '../../components/EmptyState';

const statuses = ['Under Examination', 'Cleared', 'On Hold'];

const CustomsClearanceScreen = () => {
  const [shipments, setShipments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const fetch = async () => {
    try { const r = await api.get('/cha/shipments'); setShipments(r.data?.data || r.data || []); } catch(e) {}
  };
  useFocusEffect(useCallback(() => { fetch(); }, []));
  const onRefresh = async () => { setRefreshing(true); await fetch(); setRefreshing(false); };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/cha/shipments/${id}/customs-status`, { status });
      Alert.alert('Updated', `Status set to ${status}`);
      fetch();
    } catch(e) { Alert.alert('Error', 'Failed to update status'); }
  };

  const verify = async (id) => {
    try {
      await api.put(`/cha/shipments/${id}/verify-shipping-bill`);
      Alert.alert('Verified', 'Shipping bill verified');
    } catch(e) { Alert.alert('Error', 'Verification failed'); }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={shipments}
        keyExtractor={(item, i) => item._id || String(i)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />}
        ListHeaderComponent={<Text style={styles.title}>Customs Clearance</Text>}
        ListEmptyComponent={<EmptyState icon="🛃" title="No Shipments" subtitle="No assigned shipments" />}
        renderItem={({ item }) => (
          <Card>
            <TouchableOpacity onPress={() => setExpanded(expanded === item._id ? null : item._id)}>
              <Text style={styles.shipNum}>{item.shipmentNumber || item._id}</Text>
              <View style={styles.row}>
                <Badge status={item.status || 'pending'} />
                <Text style={styles.expand}>{expanded === item._id ? '▲' : '▼'}</Text>
              </View>
            </TouchableOpacity>
            {expanded === item._id && (
              <View style={styles.expandedContent}>
                <Text style={styles.updateLabel}>Update Status:</Text>
                {statuses.map(s => (
                  <TouchableOpacity key={s} style={styles.statusBtn} onPress={() => updateStatus(item._id, s)}>
                    <Text style={styles.statusBtnText}>{s}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.verifyBtn} onPress={() => verify(item._id)}>
                  <Text style={styles.verifyText}>✅ Verify Shipping Bill</Text>
                </TouchableOpacity>
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
  updateLabel: { color: '#a8b2d8', marginBottom: 8 },
  statusBtn: { backgroundColor: '#2a2a4e', borderRadius: 8, padding: 10, marginVertical: 3 },
  statusBtnText: { color: '#ffffff', textAlign: 'center' },
  verifyBtn: { backgroundColor: '#10b98120', borderRadius: 8, padding: 12, marginTop: 8, borderWidth: 1, borderColor: '#10b981' },
  verifyText: { color: '#10b981', textAlign: 'center', fontWeight: '600' },
});

export default CustomsClearanceScreen;
