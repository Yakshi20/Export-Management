import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';

export default function ExporterDashboard({ navigation }) {
  const { user, logout } = useAuth();
  const name = user?.companyName || user?.name || user?.email?.split('@')[0] || 'Exporter';
  const initial = name[0].toUpperCase();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Top Header with user name + avatar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName} numberOfLines={1}>{name}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Shipment Management */}
        <Text style={styles.sectionTitle}>Shipment Management</Text>
        <TouchableOpacity onPress={() => navigation.navigate('PreShipment')}>
          <Card>
            <View style={styles.cardRow}>
              <Text style={styles.cardIcon}>🚢</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Pre-Shipment</Text>
                <Text style={styles.cardSubtitle}>Compliance check, documents, quotation</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </View>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('PostShipment')}>
          <Card>
            <View style={styles.cardRow}>
              <Text style={styles.cardIcon}>📊</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Post-Shipment</Text>
                <Text style={styles.cardSubtitle}>Track shipment, LC, currency rates</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </View>
          </Card>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20,
    backgroundColor: '#1a1a2e', borderBottomWidth: 1, borderBottomColor: '#2a2a4e',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#6366f1', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  greeting: { color: '#a8b2d8', fontSize: 12 },
  userName: { color: '#ffffff', fontSize: 16, fontWeight: '700', maxWidth: 180 },
  logoutBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#e94560' },
  logoutText: { color: '#e94560', fontSize: 13, fontWeight: '600' },
  content: { padding: 20, paddingBottom: 100 },
  sectionTitle: { color: '#a8b2d8', fontSize: 13, fontWeight: '600', letterSpacing: 1, marginBottom: 12, marginTop: 8, textTransform: 'uppercase' },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardIcon: { fontSize: 28 },
  cardTitle: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  cardSubtitle: { color: '#a8b2d8', fontSize: 12, marginTop: 2 },
  arrow: { color: '#6366f1', fontSize: 24, fontWeight: '300' },
});
