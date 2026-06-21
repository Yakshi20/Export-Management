import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import api from '../../api/api';
import Input from '../../components/Input';
import Button from '../../components/Button';

const countries = ['USA', 'UK', 'Germany', 'Japan', 'China', 'UAE', 'Australia', 'Canada'];
const products = ['Rice', 'Wheat', 'Cotton', 'Spices', 'Textiles', 'Chemicals', 'Machinery', 'Gems'];

const PreShipmentScreen = () => {
  const [step, setStep] = useState(0);
  const [country, setCountry] = useState('');
  const [product, setProduct] = useState('');
  const [compliance, setCompliance] = useState({ exporterName: '', productName: '', quantity: '' });
  const [buyer, setBuyer] = useState({ buyerName: '', buyerEmail: '', buyerCountry: '', contractValue: '' });
  const [loading, setLoading] = useState(false);

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s - 1);

  const submitCompliance = async () => {
    setLoading(true);
    try {
      await api.post('/exporter/pre-shipment/compliance', { ...compliance, destinationCountry: country, product });
      next();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'Compliance check failed');
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Pre-Shipment</Text>
        <View style={styles.dots}>
          {[0,1,2,3,4].map(i => (
            <View key={i} style={[styles.dot, step === i && styles.dotActive]} />
          ))}
        </View>
        {step === 0 && (
          <View>
            <Text style={styles.stepTitle}>Select Destination Country</Text>
            {countries.map(c => (
              <TouchableOpacity key={c} style={[styles.option, country === c && styles.optionActive]} onPress={() => setCountry(c)}>
                <Text style={[styles.optionText, country === c && styles.optionTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
            <Button title="Next" onPress={() => { if (!country) { Alert.alert('Select a country'); return; } next(); }} />
          </View>
        )}
        {step === 1 && (
          <View>
            <Text style={styles.stepTitle}>Select Product</Text>
            {products.map(p => (
              <TouchableOpacity key={p} style={[styles.option, product === p && styles.optionActive]} onPress={() => setProduct(p)}>
                <Text style={[styles.optionText, product === p && styles.optionTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
            <Button title="Next" onPress={() => { if (!product) { Alert.alert('Select a product'); return; } next(); }} />
            <Button title="Back" onPress={back} variant="secondary" />
          </View>
        )}
        {step === 2 && (
          <View>
            <Text style={styles.stepTitle}>Compliance Check</Text>
            <Input label="Exporter Name" value={compliance.exporterName} onChangeText={v => setCompliance(c => ({...c, exporterName: v}))} placeholder="Your Name" />
            <Input label="Product Name" value={compliance.productName} onChangeText={v => setCompliance(c => ({...c, productName: v}))} placeholder="Product" />
            <Input label="Quantity" value={compliance.quantity} onChangeText={v => setCompliance(c => ({...c, quantity: v}))} placeholder="100 MT" />
            <Button title="Check Compliance" onPress={submitCompliance} loading={loading} />
            <Button title="Back" onPress={back} variant="secondary" />
          </View>
        )}
        {step === 3 && (
          <View>
            <Text style={styles.stepTitle}>Buyer Details</Text>
            <Input label="Buyer Name" value={buyer.buyerName} onChangeText={v => setBuyer(b => ({...b, buyerName: v}))} placeholder="Buyer Name" />
            <Input label="Buyer Email" value={buyer.buyerEmail} onChangeText={v => setBuyer(b => ({...b, buyerEmail: v}))} placeholder="buyer@email.com" />
            <Input label="Buyer Country" value={buyer.buyerCountry} onChangeText={v => setBuyer(b => ({...b, buyerCountry: v}))} placeholder="Country" />
            <Input label="Contract Value ($)" value={buyer.contractValue} onChangeText={v => setBuyer(b => ({...b, contractValue: v}))} placeholder="10000" keyboardType="numeric" />
            <Button title="Next" onPress={next} />
            <Button title="Back" onPress={back} variant="secondary" />
          </View>
        )}
        {step === 4 && (
          <View>
            <Text style={styles.stepTitle}>Generate Documents</Text>
            {['Invoice', 'Packing List', 'Bill of Lading', 'Certificate of Origin'].map(doc => (
              <TouchableOpacity key={doc} style={styles.docBtn} onPress={() => Alert.alert('Download', `${doc} downloaded!`)}>
                <Text style={styles.docText}>📄 {doc}</Text>
              </TouchableOpacity>
            ))}
            <Button title="Back" onPress={back} variant="secondary" />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  content: { padding: 20, paddingTop: 60 },
  title: { color: '#ffffff', fontSize: 28, fontWeight: '700', marginBottom: 20 },
  dots: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#2a2a4e' },
  dotActive: { backgroundColor: '#6366f1' },
  stepTitle: { color: '#ffffff', fontSize: 18, fontWeight: '600', marginBottom: 16 },
  option: { backgroundColor: '#1a1a2e', borderRadius: 12, padding: 14, marginVertical: 4, borderWidth: 1, borderColor: '#2a2a4e' },
  optionActive: { borderColor: '#6366f1', backgroundColor: '#6366f120' },
  optionText: { color: '#a8b2d8', fontSize: 15 },
  optionTextActive: { color: '#6366f1', fontWeight: '600' },
  docBtn: { backgroundColor: '#1a1a2e', borderRadius: 12, padding: 16, marginVertical: 6, borderWidth: 1, borderColor: '#2a2a4e' },
  docText: { color: '#ffffff', fontSize: 15 },
});

export default PreShipmentScreen;
