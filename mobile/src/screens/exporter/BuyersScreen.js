import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, Modal, TouchableOpacity,
  RefreshControl, Alert, StyleSheet, StatusBar, ScrollView
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../api/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import EmptyState from '../../components/EmptyState';

const BuyersScreen = ({ navigation }) => {
  const [buyers, setBuyers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [form, setForm] = useState({ buyerName: '', companyName: '', email: '', country: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);

  const fetchBuyers = async () => {
    try { const r = await api.get('/exporter/buyers'); setBuyers(r.data?.data || r.data || []); } catch(e) {}
  };
  useFocusEffect(useCallback(() => { fetchBuyers(); }, []));
  const onRefresh = async () => { setRefreshing(true); await fetchBuyers(); setRefreshing(false); };
  const set = key => val => setForm(f => ({ ...f, [key]: val }));

  const addBuyer = async () => {
    if (!form.buyerName || !form.email || !form.country || !form.phone) {
      Alert.alert('Error', 'Please fill all required fields'); return;
    }
    setLoading(true);
    try {
      await api.post('/exporter/buyers', form);
      setModalVisible(false);
      setForm({ buyerName: '', companyName: '', email: '', country: '', phone: '', address: '' });
      fetchBuyers();
    } catch(e) { Alert.alert('Error', e.response?.data?.message || 'Failed to add buyer'); }
    finally { setLoading(false); }
  };

  const deleteBuyer = (id) => {
    Alert.alert('Delete Buyer', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await api.delete(`/exporter/buyers/${id}`); fetchBuyers(); }
        catch(e) { Alert.alert('Error', 'Failed to delete'); }
      }},
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={buyers}
        keyExtractor={(item, i) => item._id || String(i)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Buyers</Text>
            <Button title="+ Add Buyer" onPress={() => setModalVisible(true)} />
            <View style={{ height: 16 }} />
          </View>
        }
        ListEmptyComponent={<EmptyState icon="👥" title="No Buyers Yet" subtitle="Add your first buyer to get started" />}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedBuyer(item)} activeOpacity={0.8}>
            <Card>
              <View style={styles.buyerRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{(item.buyerName || item.name || 'B')[0].toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.buyerName}>{item.buyerName || item.name}</Text>
                  <Text style={styles.buyerCompany}>{item.companyName || ''}</Text>
                  <Text style={styles.buyerMeta}>{item.email}</Text>
                  <Text style={styles.buyerMeta}>{item.country} • {item.phone}</Text>
                </View>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('CreateShipment', { buyer: item })}>
                  <Text style={styles.actionBtnText}>📦 Create Shipment</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteBuyer(item._id)}>
                  <Text style={styles.deleteBtnText}>🗑 Delete</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </TouchableOpacity>
        )}
      />

      {/* Buyer Details Modal */}
      {selectedBuyer && (
        <Modal visible={!!selectedBuyer} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Buyer Details</Text>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Name</Text><Text style={styles.detailValue}>{selectedBuyer.buyerName || selectedBuyer.name}</Text></View>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Company</Text><Text style={styles.detailValue}>{selectedBuyer.companyName || '-'}</Text></View>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Email</Text><Text style={styles.detailValue}>{selectedBuyer.email}</Text></View>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Phone</Text><Text style={styles.detailValue}>{selectedBuyer.phone}</Text></View>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Country</Text><Text style={styles.detailValue}>{selectedBuyer.country}</Text></View>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Address</Text><Text style={styles.detailValue}>{selectedBuyer.address || '-'}</Text></View>
              <View style={{ height: 16 }} />
              <Button title="📦 Create Shipment for this Buyer" onPress={() => { setSelectedBuyer(null); navigation.navigate('CreateShipment', { buyer: selectedBuyer }); }} />
              <Button title="Close" onPress={() => setSelectedBuyer(null)} variant="secondary" />
            </View>
          </View>
        </Modal>
      )}

      {/* Add Buyer Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Buyer</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Input label="Buyer Name *" value={form.buyerName} onChangeText={set('buyerName')} placeholder="John Doe" />
              <Input label="Company Name" value={form.companyName} onChangeText={set('companyName')} placeholder="ABC Corp" />
              <Input label="Email *" value={form.email} onChangeText={set('email')} placeholder="buyer@email.com" keyboardType="email-address" />
              <Input label="Phone *" value={form.phone} onChangeText={set('phone')} placeholder="+1234567890" keyboardType="phone-pad" />
              <Input label="Country *" value={form.country} onChangeText={set('country')} placeholder="USA" />
              <Input label="Address" value={form.address} onChangeText={set('address')} placeholder="Street, City" />
            </ScrollView>
            <Button title="Add Buyer" onPress={addBuyer} loading={loading} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} variant="secondary" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  list: { padding: 20, paddingTop: 60, paddingBottom: 100 },
  title: { color: '#ffffff', fontSize: 28, fontWeight: '700', marginBottom: 16 },
  buyerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#6366f1', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  buyerName: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
  buyerCompany: { color: '#6366f1', fontSize: 13, marginTop: 2 },
  buyerMeta: { color: '#a8b2d8', fontSize: 12, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#2a2a4e' },
  actionBtn: { flex: 1, backgroundColor: '#6366f1', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  actionBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  deleteBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#e94560', alignItems: 'center' },
  deleteBtnText: { color: '#e94560', fontWeight: '600', fontSize: 13 },
  modalOverlay: { flex: 1, backgroundColor: '#000000aa', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1a1a2e', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '85%' },
  modalTitle: { color: '#ffffff', fontSize: 22, fontWeight: '700', marginBottom: 20 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#2a2a4e' },
  detailLabel: { color: '#a8b2d8', fontSize: 14 },
  detailValue: { color: '#ffffff', fontSize: 14, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
});

export default BuyersScreen;
