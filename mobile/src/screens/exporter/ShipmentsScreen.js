import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../api/api';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import EmptyState from '../../components/EmptyState';

const ShipmentsScreen = ({ navigation }) => {
  const [shipments, setShipments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchShipments = async () => {
    try {
      const res = await api.get('/exporter/shipments');
      setShipments(res.data?.data || res.data || []);
    } catch (e) { console.error(e); }
  };

  useFocusEffect(useCallback(() => { fetchShipments(); }, []));
  const onRefresh = async () => { setRefreshing(true); await fetchShipments(); setRefreshing(false); };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={shipments}
        keyExtractor={(item, i) => item._id || String(i)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />}
        ListHeaderComponent={<Text style={styles.title}>Shipments</Text>}
        ListEmptyComponent={<EmptyState icon="📦" title="No Shipments" subtitle="Create your first shipment" />}
        renderItem={({ item }) => (
          <Card>
            <Text style={styles.shipNum}>{item.shipmentNumber || item._id}</Text>
            <Text style={styles.dest}>{item.destinationCountry}</Text>
            <View style={styles.row}>
              <Badge status={item.status || 'pending'} />
              <Text style={styles.date}>{item.expectedShipmentDate || item.createdAt?.slice(0,10)}</Text>
            </View>
          </Card>
        )}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateShipment')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  list: { padding: 20, paddingTop: 60 },
  title: { color: '#ffffff', fontSize: 28, fontWeight: '700', marginBottom: 16 },
  shipNum: { color: '#ffffff', fontWeight: '600', fontSize: 16 },
  dest: { color: '#a8b2d8', marginTop: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  date: { color: '#a8b2d8', fontSize: 12 },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#6366f1', alignItems: 'center', justifyContent: 'center',
    elevation: 6,
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 32 },
});

export default ShipmentsScreen;
