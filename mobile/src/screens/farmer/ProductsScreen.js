import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Modal, Switch, TouchableOpacity, RefreshControl, Alert, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../api/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import EmptyState from '../../components/EmptyState';

const ProductsScreen = () => {
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', category: '', quantity: '', unit: '', pricePerUnit: '', description: '' });
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    try { const r = await api.get('/farmer/products'); setProducts(r.data || []); } catch(e) {}
  };
  useFocusEffect(useCallback(() => { fetch(); }, []));
  const onRefresh = async () => { setRefreshing(true); await fetch(); setRefreshing(false); };
  const set = key => val => setForm(f => ({...f, [key]: val}));

  const openAdd = () => { setEditItem(null); setForm({ name: '', category: '', quantity: '', unit: '', pricePerUnit: '', description: '' }); setModalVisible(true); };
  const openEdit = (p) => { setEditItem(p); setForm({ name: p.name, category: p.category, quantity: String(p.quantity), unit: p.unit, pricePerUnit: String(p.pricePerUnit), description: p.description }); setModalVisible(true); };

  const save = async () => {
    setLoading(true);
    try {
      if (editItem) await api.put(`/farmer/products/${editItem._id}`, form);
      else await api.post('/farmer/products', form);
      setModalVisible(false); fetch();
    } catch(e) { Alert.alert('Error', 'Failed to save'); }
    finally { setLoading(false); }
  };

  const del = (id) => {
    Alert.alert('Confirm', 'Delete product?', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await api.delete(`/farmer/products/${id}`); fetch(); } catch(e) { Alert.alert('Error', 'Failed'); }
      }},
    ]);
  };

  const toggleAvail = async (item) => {
    try { await api.put(`/farmer/products/${item._id}`, { ...item, available: !item.available }); fetch(); } catch(e) {}
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={products}
        keyExtractor={(item, i) => item._id || String(i)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />}
        ListHeaderComponent={<Text style={styles.title}>My Products</Text>}
        ListEmptyComponent={<EmptyState icon="🌾" title="No Products" subtitle="Add your farm products" />}
        renderItem={({ item }) => (
          <Card>
            <View style={styles.cardHeader}>
              <Text style={styles.pName}>{item.name}</Text>
              <Switch value={item.available !== false} onValueChange={() => toggleAvail(item)} trackColor={{ true: '#10b981', false: '#2a2a4e' }} />
            </View>
            <Text style={styles.pDetail}>{item.quantity} {item.unit} @ ₹{item.pricePerUnit}/{item.unit}</Text>
            <Text style={styles.pDesc}>{item.description}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => openEdit(item)}><Text style={styles.editText}>Edit</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => del(item._id)}><Text style={styles.delText}>Delete</Text></TouchableOpacity>
            </View>
          </Card>
        )}
      />
      <TouchableOpacity style={styles.fab} onPress={openAdd}><Text style={styles.fabText}>+</Text></TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editItem ? 'Edit' : 'Add'} Product</Text>
            <ScrollView>
              <Input label="Name" value={form.name} onChangeText={set('name')} placeholder="Product name" />
              <Input label="Category" value={form.category} onChangeText={set('category')} placeholder="Vegetables / Grains" />
              <Input label="Quantity" value={form.quantity} onChangeText={set('quantity')} placeholder="100" keyboardType="numeric" />
              <Input label="Unit" value={form.unit} onChangeText={set('unit')} placeholder="KG / MT" />
              <Input label="Price Per Unit" value={form.pricePerUnit} onChangeText={set('pricePerUnit')} placeholder="50" keyboardType="numeric" />
              <Input label="Description" value={form.description} onChangeText={set('description')} placeholder="Description" />
            </ScrollView>
            <Button title="Save" onPress={save} loading={loading} />
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pName: { color: '#ffffff', fontWeight: '600', fontSize: 16 },
  pDetail: { color: '#a8b2d8', marginTop: 4 },
  pDesc: { color: '#a8b2d8', fontSize: 12, marginTop: 4 },
  actions: { flexDirection: 'row', gap: 16, marginTop: 8 },
  editText: { color: '#6366f1', fontSize: 13 },
  delText: { color: '#e94560', fontSize: 13 },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#6366f1', alignItems: 'center', justifyContent: 'center', elevation: 6 },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 32 },
  modalOverlay: { flex: 1, backgroundColor: '#000000aa', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1a1a2e', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '85%' },
  modalTitle: { color: '#ffffff', fontSize: 20, fontWeight: '700', marginBottom: 16 },
});

export default ProductsScreen;
