import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Alert, StyleSheet, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../api/api';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import EmptyState from '../../components/EmptyState';

const consultStatuses = ['pending', 'confirmed', 'completed'];

const ConsultationsScreen = () => {
  const [consultations, setConsultations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const fetch = async () => {
    try { const r = await api.get('/adviser/consultations'); setConsultations(r.data || []); } catch(e) {}
  };
  useFocusEffect(useCallback(() => { fetch(); }, []));
  const onRefresh = async () => { setRefreshing(true); await fetch(); setRefreshing(false); };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/adviser/consultations/${id}`, { status });
      Alert.alert('Updated', `Status set to ${status}`);
      fetch();
    } catch(e) { Alert.alert('Error', 'Failed to update'); }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={consultations}
        keyExtractor={(item, i) => item._id || String(i)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />}
        ListHeaderComponent={<Text style={styles.title}>Consultations</Text>}
        ListEmptyComponent={<EmptyState icon="💼" title="No Consultations" subtitle="No consultation requests yet" />}
        renderItem={({ item }) => (
          <Card>
            <TouchableOpacity onPress={() => setExpanded(expanded === item._id ? null : item._id)}>
              <Text style={styles.clientName}>{item.clientName || item.client || 'Client'}</Text>
              <Text style={styles.topic}>{item.topic || item.subject || 'Consultation Request'}</Text>
              <View style={styles.row}>
                <Badge status={item.status || 'pending'} />
                <Text style={styles.expand}>{expanded === item._id ? '▲' : '▼'}</Text>
              </View>
            </TouchableOpacity>
            {expanded === item._id && (
              <View style={styles.expandedContent}>
                <Text style={styles.updateLabel}>Update Status:</Text>
                {consultStatuses.map(s => (
                  <TouchableOpacity key={s} style={[styles.sBtn, item.status === s && styles.sBtnActive]} onPress={() => updateStatus(item._id, s)}>
                    <Text style={[styles.sBtnText, item.status === s && styles.sBtnTextActive]}>{s.charAt(0).toUpperCase() + s.slice(1)}</Text>
                  </TouchableOpacity>
                ))}
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
  clientName: { color: '#ffffff', fontWeight: '600', fontSize: 16 },
  topic: { color: '#a8b2d8', marginTop: 4, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  expand: { color: '#a8b2d8' },
  expandedContent: { marginTop: 12, borderTopWidth: 1, borderTopColor: '#2a2a4e', paddingTop: 12 },
  updateLabel: { color: '#a8b2d8', marginBottom: 8 },
  sBtn: { backgroundColor: '#2a2a4e', borderRadius: 8, padding: 10, marginVertical: 3 },
  sBtnActive: { backgroundColor: '#6366f120', borderWidth: 1, borderColor: '#6366f1' },
  sBtnText: { color: '#a8b2d8', textAlign: 'center' },
  sBtnTextActive: { color: '#6366f1', fontWeight: '600' },
});

export default ConsultationsScreen;
