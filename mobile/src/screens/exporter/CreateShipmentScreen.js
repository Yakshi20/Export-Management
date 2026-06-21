import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform, StyleSheet, StatusBar } from 'react-native';
import api from '../../api/api';
import Input from '../../components/Input';
import Button from '../../components/Button';

const CreateShipmentScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    buyerId: '', destinationCountry: '', portOfLoading: '', portOfDischarge: '',
    cargoDescription: '', quantity: '', unit: '', hsCode: '',
    expectedShipmentDate: '', incoterms: '',
  });
  const [loading, setLoading] = useState(false);

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

  const submit = async () => {
    setLoading(true);
    try {
      await api.post('/exporter/shipments', form);
      Alert.alert('Success', 'Shipment created!');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to create shipment');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>New Shipment</Text>
        <Input label="Buyer ID" value={form.buyerId} onChangeText={set('buyerId')} placeholder="Buyer ID" />
        <Input label="Destination Country" value={form.destinationCountry} onChangeText={set('destinationCountry')} placeholder="USA" />
        <Input label="Port of Loading" value={form.portOfLoading} onChangeText={set('portOfLoading')} placeholder="Mumbai" />
        <Input label="Port of Discharge" value={form.portOfDischarge} onChangeText={set('portOfDischarge')} placeholder="New York" />
        <Input label="Cargo Description" value={form.cargoDescription} onChangeText={set('cargoDescription')} placeholder="Description" />
        <Input label="Quantity" value={form.quantity} onChangeText={set('quantity')} placeholder="100" keyboardType="numeric" />
        <Input label="Unit" value={form.unit} onChangeText={set('unit')} placeholder="MT / PCS" />
        <Input label="HS Code" value={form.hsCode} onChangeText={set('hsCode')} placeholder="1234.56" />
        <Input label="Expected Date (YYYY-MM-DD)" value={form.expectedShipmentDate} onChangeText={set('expectedShipmentDate')} placeholder="2024-06-01" />
        <Input label="Incoterms" value={form.incoterms} onChangeText={set('incoterms')} placeholder="FOB / CIF" />
        <Button title="Create Shipment" onPress={submit} loading={loading} style={styles.btn} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  content: { padding: 20, paddingTop: 60 },
  title: { color: '#ffffff', fontSize: 28, fontWeight: '700', marginBottom: 20 },
  btn: { marginTop: 16, marginBottom: 40 },
});

export default CreateShipmentScreen;
