import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import api from '../../api/api';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';

const timeline = ['Shipped', 'Customs Cleared', 'In Transit', 'Delivered'];
const rates = [{ currency: 'USD', rate: '1.00' }, { currency: 'EUR', rate: '0.92' }, { currency: 'GBP', rate: '0.79' }];

const PostShipmentScreen = () => {
  const [shipments, setShipments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [lcNumber, setLcNumber] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/exporter/shipments').then(r => setShipments(r.data?.data || r.data || [])).catch(() => {});
  }, []);

  const submitLC = async () => {
    if (!lcNumber) { Alert.alert('Error', 'Enter LC Number'); return; }
    setLoading(true);
    try {
      await api.post('/exporter/post-shipment/lc', { lcNumber, shipmentId: selected });
      Alert.alert('Success', 'LC Number submitted');
    } catch (e) {
      Alert.alert('Error', 'Failed to submit');
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Post-Shipment</Text>
        <Text style={styles.sectionTitle}>Select Shipment</Text>
        {shipments.map((s, i) => (
          <TouchableOpacity key={i} style={[styles.shipBtn, selected === s._id && styles.shipBtnActive]} onPress={() => setSelected(s._id)}>
            <Text style={[styles.shipBtnText, selected === s._id && styles.shipBtnTextActive]}>{s.shipmentNumber || s._id} - {s.destinationCountry}</Text>
          </TouchableOpacity>
        ))}
        <Text style={styles.sectionTitle}>Track Status</Text>
        <Card>
          {timeline.map((t, i) => (
            <View key={i} style={styles.timelineRow}>
              <View style={styles.dotCol}>
                <View style={[styles.tlDot, { backgroundColor: i < 2 ? '#10b981' : '#2a2a4e' }]} />
                {i < timeline.length - 1 && <View style={[styles.tlLine, { backgroundColor: i < 1 ? '#10b981' : '#2a2a4e' }]} />}
              </View>
              <Text style={[styles.tlText, i < 2 && styles.tlTextActive]}>{t}</Text>
            </View>
          ))}
        </Card>
        <Text style={styles.sectionTitle}>LC Number</Text>
        <Input label="LC Number" value={lcNumber} onChangeText={setLcNumber} placeholder="LC/2024/001" />
        <Button title="Submit LC" onPress={submitLC} loading={loading} />
        <Text style={styles.sectionTitle}>Currency Rates</Text>
        <Card>
          {rates.map(r => (
            <View key={r.currency} style={styles.rateRow}>
              <Text style={styles.currency}>{r.currency}</Text>
              <Text style={styles.rate}>{r.rate}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  content: { padding: 20, paddingTop: 60 },
  title: { color: '#ffffff', fontSize: 28, fontWeight: '700', marginBottom: 16 },
  sectionTitle: { color: '#ffffff', fontSize: 16, fontWeight: '600', marginTop: 20, marginBottom: 8 },
  shipBtn: { backgroundColor: '#1a1a2e', borderRadius: 12, padding: 14, marginVertical: 4, borderWidth: 1, borderColor: '#2a2a4e' },
  shipBtnActive: { borderColor: '#6366f1', backgroundColor: '#6366f120' },
  shipBtnText: { color: '#a8b2d8' },
  shipBtnTextActive: { color: '#6366f1', fontWeight: '600' },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  dotCol: { alignItems: 'center', marginRight: 12 },
  tlDot: { width: 14, height: 14, borderRadius: 7 },
  tlLine: { width: 2, height: 24 },
  tlText: { color: '#a8b2d8', paddingTop: 0, fontSize: 14 },
  tlTextActive: { color: '#10b981', fontWeight: '600' },
  rateRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#2a2a4e' },
  currency: { color: '#ffffff', fontWeight: '600' },
  rate: { color: '#10b981', fontWeight: '600' },
});

export default PostShipmentScreen;
