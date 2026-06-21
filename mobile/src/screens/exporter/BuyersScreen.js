import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Modal, TouchableOpacity, RefreshControl, Alert, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../api/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import EmptyState from '../../components/EmptyState';

const BuyersScreen = () => {
  const [buyers, setBuyers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', country: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    try { const r = await api.get('/exporter/buyers'); setBuyers(r.data || []); } catch(e) {}
  };
  useFocusEffect(useCallback(() => { fetch(); }, []));
  const onRefresh = async () => { setRefreshing(true); await fetch(); setRefreshing(false); };
  const set = key => val => setForm(f => ({...f, [key]: val}));

  const addBuyer = async () => {
    setLoading(true);
    try {
      await api.post('/exporter/buyers', form);
      setModalVisible(false);
      setForm({ name: '', email: '', country: '', phone: '', address: '' });
      fetch();
    } catch(e) { Alert.alert('Error', e.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  const deleteBuyer = (id) => {
    Alert.alert('Confirm', 'Delete this buyer?', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await api.delete(`/exporter/buyers/${id}`); fetch(); } catch(e) { Alert.alert('Error', 'Failed to delete'); }
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
          </View>
        }
        ListEmptyComponent={<EmptyState icon="👤" title="No Buyers" subtitle="Add your first buyer" />}
        renderItem={({ item }) => (
          <Card>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.email}>{item.email}</Text>
            <Text style={styles.country}>{item.country} | {item.phone}</Text>
            <TouchableOpacity onPress={() => deleteBuyer(item._id)} style={styles.delBtn}>
              <Text style={styles.delText}>Delete</Text>
            </TouchableOpacity>
          </Card>
        )}
      />
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Buyer</Text>
            <ScrollView>
              <Input label="Name" value={form.name} onChangeText={set('name')} placeholder="Buyer Name" />
              <Input label="Email" value={form.email} onChangeText={set('email')} placeholder="email@example.com" />
              <Input label="Country" value={form.country} onChangeText={set('country')} placeholder="Country" />
              <Input label="Phone" value={form.phone} onChangeText={set('phone')} placeholder="+1234567890" />
              <Input label="Address" value={form.address} onChangeText={set('address')} placeholder="Address" />
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
  list: { padding: 20, paddingTop: 60 },
  title: { color: '#ffffff', fontSize: 28, fontWeight: '700', marginBottom: 16 },
  name: { color: '#ffffff', fontWeight: '600', fontSize: 16 },
  email: { color: '#a8b2d8', marginTop: 4 },
  country: { color: '#a8b2d8', fontSize: 12, marginTop: 4 },
  delBtn: { marginTop: 8 },
  delText: { color: '#e94560', fontSize: 13 },
  modalOverlay: { flex: 1, backgroundColor: '#000000aa', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1a1a2e', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%' },
  modalTitle: { color: '#ffffff', fontSize: 20, fontWeight: '700', marginBottom: 16 },
});

export default BuyersScreen;
