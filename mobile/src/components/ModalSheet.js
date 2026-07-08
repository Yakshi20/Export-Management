import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

// Simple centered modal sheet used for pickers / detail views across screens.
const ModalSheet = ({ visible, onClose, title, children }) => (
  <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
    <View style={styles.backdrop}>
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
          {children}
        </ScrollView>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  sheet: { backgroundColor: '#16213e', borderRadius: 20, maxHeight: '80%', borderWidth: 1, borderColor: '#2a2a4e' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: '#2a2a4e' },
  title: { color: '#ffffff', fontSize: 17, fontWeight: '700', flex: 1, marginRight: 10 },
  close: { color: '#a8b2d8', fontSize: 18, fontWeight: '700' },
  body: { paddingHorizontal: 18 },
  bodyContent: { paddingBottom: 18 },
});

export default ModalSheet;
