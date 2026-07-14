import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../api/api';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import EmptyState from '../../components/EmptyState';
import ModalSheet from '../../components/ModalSheet';

const PORTS = ['Mumbai Port', 'Chennai Port', 'Mangalore Port'];
const SPECIALIZATIONS = ['Air', 'Sea', 'Both'];
const SPEC_COLOR = { Air: '#3b82f6', Sea: '#22d3ee', Both: '#a855f7' };
const emptyForm = { chaName: '', licenseNumber: '', port: PORTS[0], phone: '', email: '', specialization: 'Sea', customsCharges: '' };

const ChaAgentsScreen = () => {
  const [agents, setAgents] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formModal, setFormModal] = useState(null); // null | 'add' | agent-being-edited
  const [detailAgent, setDetailAgent] = useState(null);
  const [assignAgent, setAssignAgent] = useState(null);
  const [historyAgent, setHistoryAgent] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchAgents = async () => {
    try {
      const r = await api.get('/cha/agents');
      setAgents(r.data?.data || r.data || []);
    } catch (e) {} finally { setLoading(false); }
  };

  const fetchShipments = async () => {
    try {
      const r = await api.get('/cha/shipments');
      setShipments(r.data?.data || r.data || []);
    } catch (e) {}
  };

  useFocusEffect(useCallback(() => { fetchAgents(); fetchShipments(); }, []));

  const openAdd = () => { setForm(emptyForm); setFormModal('add'); };
  const openEdit = (agent) => { setForm({ ...agent }); setFormModal(agent); setDetailAgent(null); };

  const saveAgent = async () => {
    if (!form.chaName || !form.licenseNumber || !form.phone) {
      Alert.alert('Missing info', 'CHA name, license number and phone are required.');
      return;
    }
    setSaving(true);
    try {
      if (formModal === 'add') {
        await api.post('/cha/agents', form);
      } else {
        await api.put(`/cha/agents/${formModal._id}`, form);
      }
      setFormModal(null);
      setForm(emptyForm);
      fetchAgents();
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.message || 'Failed to save agent');
    }
    setSaving(false);
  };

  const deleteAgent = (agent) => {
    Alert.alert('Delete agent', `Remove ${agent.chaName}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await api.delete(`/cha/agents/${agent._id}`);
            setDetailAgent(null);
            fetchAgents();
          } catch (e) { Alert.alert('Error', 'Failed to delete agent'); }
        }
      },
    ]);
  };

  const assignToShipment = async (shipmentId) => {
    try {
      await api.put(`/cha/shipments/${shipmentId}/assign-agent`, { chaAgentId: assignAgent._id });
      setAssignAgent(null);
      fetchShipments();
      Alert.alert('Assigned', `${assignAgent.chaName} assigned to shipment.`);
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.message || 'Failed to assign agent');
    }
  };

  const shipmentsFor = (agent) => shipments.filter(s => (s.chaAgentId?._id || s.chaAgentId) === agent._id);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={agents}
        keyExtractor={(item, i) => item._id || String(i)}
        contentContainerStyle={styles.list}
        onRefresh={fetchAgents}
        refreshing={loading}
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <Text style={styles.title}>My Agents</Text>
            <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
              <Text style={styles.addBtnText}>+ Add</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={!loading && <EmptyState icon="📑" title="No Agents" subtitle="Add your first customs agent" />}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setDetailAgent(item)}>
            <Card>
              <View style={styles.rowBetween}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.chaName}</Text>
                  {!!item.port && <Text style={styles.port}>{item.port}</Text>}
                </View>
                <View style={[styles.specBadge, { borderColor: SPEC_COLOR[item.specialization] || SPEC_COLOR.Sea }]}>
                  <Text style={[styles.specText, { color: SPEC_COLOR[item.specialization] || SPEC_COLOR.Sea }]}>{item.specialization || 'Sea'}</Text>
                </View>
              </View>
              {!!item.licenseNumber && <Text style={styles.meta}>🪪 {item.licenseNumber}</Text>}
              {!!item.phone && <Text style={styles.meta}>📞 {item.phone}</Text>}
              {!!item.customsCharges && <Text style={styles.meta}>💰 {item.customsCharges}</Text>}
            </Card>
          </TouchableOpacity>
        )}
      />

      {/* Detail / actions sheet */}
      <ModalSheet visible={!!detailAgent} onClose={() => setDetailAgent(null)} title={detailAgent?.chaName || 'Agent'}>
        {detailAgent && (
          <View>
            {[
              ['License Number', detailAgent.licenseNumber],
              ['Port', detailAgent.port],
              ['Phone', detailAgent.phone],
              ['Email', detailAgent.email],
              ['Customs Charges', detailAgent.customsCharges],
              ['Specialization', detailAgent.specialization],
            ].filter(([, v]) => v).map(([label, value]) => (
              <View key={label} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{label}</Text>
                <Text style={styles.detailValue}>{value}</Text>
              </View>
            ))}
            <Button title="📌 Assign to Shipment" onPress={() => { setAssignAgent(detailAgent); setDetailAgent(null); }} />
            <Button title="🕐 View History" variant="secondary" onPress={() => { setHistoryAgent(detailAgent); setDetailAgent(null); }} />
            <Button title="✏️ Edit" variant="secondary" onPress={() => openEdit(detailAgent)} />
            <Button title="🗑️ Delete" variant="danger" onPress={() => deleteAgent(detailAgent)} />
          </View>
        )}
      </ModalSheet>

      {/* Add / edit form sheet */}
      <ModalSheet visible={!!formModal} onClose={() => setFormModal(null)} title={formModal === 'add' ? 'Add New Agent' : 'Edit Agent'}>
        <Input label="CHA Name *" value={form.chaName} onChangeText={v => setForm(f => ({ ...f, chaName: v }))} placeholder="e.g. Global Customs Co." />
        <Input label="License Number *" value={form.licenseNumber} onChangeText={v => setForm(f => ({ ...f, licenseNumber: v }))} />
        <Text style={styles.pickerLabel}>Port / Location *</Text>
        <View style={styles.chipRow}>
          {PORTS.map(p => (
            <TouchableOpacity key={p} style={[styles.chip, form.port === p && styles.chipActive]} onPress={() => setForm(f => ({ ...f, port: p }))}>
              <Text style={[styles.chipText, form.port === p && styles.chipTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Input label="Contact Phone *" value={form.phone} onChangeText={v => setForm(f => ({ ...f, phone: v }))} keyboardType="phone-pad" />
        <Input label="Contact Email" value={form.email} onChangeText={v => setForm(f => ({ ...f, email: v }))} keyboardType="email-address" />
        <Text style={styles.pickerLabel}>Specialization</Text>
        <View style={styles.chipRow}>
          {SPECIALIZATIONS.map(s => (
            <TouchableOpacity key={s} style={[styles.chip, form.specialization === s && styles.chipActive]} onPress={() => setForm(f => ({ ...f, specialization: s }))}>
              <Text style={[styles.chipText, form.specialization === s && styles.chipTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Input label="Customs Charges" value={form.customsCharges} onChangeText={v => setForm(f => ({ ...f, customsCharges: v }))} placeholder="e.g. 2% of shipment value" />
        <Button title="Save CHA" onPress={saveAgent} loading={saving} />
      </ModalSheet>

      {/* Assign to shipment sheet */}
      <ModalSheet visible={!!assignAgent} onClose={() => setAssignAgent(null)} title={`Assign ${assignAgent?.chaName || ''} to Shipment`}>
        {shipments.length === 0 ? (
          <Text style={styles.emptyText}>No shipments available.</Text>
        ) : shipments.map(s => (
          <TouchableOpacity key={s._id} style={styles.shipmentRow} onPress={() => assignToShipment(s._id)}>
            <View style={{ flex: 1 }}>
              <Text style={styles.shipmentName}>{s.productName}</Text>
              <Text style={styles.shipmentMeta}>#{s.shipmentNumber}</Text>
            </View>
            <Text style={styles.shipmentStatus}>{s.status || 'Created'}</Text>
            {(s.chaAgentId?._id || s.chaAgentId) === assignAgent?._id && <Text style={styles.assignedTag}>✓ Assigned</Text>}
          </TouchableOpacity>
        ))}
      </ModalSheet>

      {/* History sheet */}
      <ModalSheet visible={!!historyAgent} onClose={() => setHistoryAgent(null)} title={`${historyAgent?.chaName || ''} — History`}>
        {historyAgent && shipmentsFor(historyAgent).length === 0 ? (
          <Text style={styles.emptyText}>No shipments assigned yet.</Text>
        ) : historyAgent && shipmentsFor(historyAgent).map(s => (
          <View key={s._id} style={styles.shipmentRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.shipmentName}>{s.productName}</Text>
              <Text style={styles.shipmentMeta}>#{s.shipmentNumber}</Text>
            </View>
            <Text style={styles.shipmentStatus}>{s.status || 'Created'}</Text>
          </View>
        ))}
      </ModalSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  list: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { color: '#ffffff', fontSize: 28, fontWeight: '700' },
  addBtn: { backgroundColor: '#6366f1', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  addBtnText: { color: '#fff', fontWeight: '700' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  name: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
  port: { color: '#6366f1', fontSize: 12, marginTop: 2 },
  specBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, borderWidth: 1 },
  specText: { fontSize: 11, fontWeight: '700' },
  meta: { color: '#a8b2d8', fontSize: 12, marginTop: 6 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#2a2a4e' },
  detailLabel: { color: '#a8b2d8', fontSize: 13 },
  detailValue: { color: '#ffffff', fontSize: 13, fontWeight: '600', flexShrink: 1, textAlign: 'right' },
  pickerLabel: { color: '#a8b2d8', fontSize: 14, fontWeight: '500', marginTop: 8, marginBottom: 6 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: '#1a1a2e', borderWidth: 1, borderColor: '#2a2a4e', marginRight: 8, marginBottom: 8 },
  chipActive: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  chipText: { color: '#a8b2d8', fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  emptyText: { color: '#a8b2d8', textAlign: 'center', paddingVertical: 20 },
  shipmentRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a2e', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#2a2a4e' },
  shipmentName: { color: '#ffffff', fontWeight: '600', fontSize: 14 },
  shipmentMeta: { color: '#a8b2d8', fontSize: 12, marginTop: 2 },
  shipmentStatus: { color: '#a8b2d8', fontSize: 12 },
  assignedTag: { color: '#10b981', fontSize: 11, fontWeight: '700', marginLeft: 8 },
});

export default ChaAgentsScreen;
