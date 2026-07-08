import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView,
  Platform, StyleSheet, StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Chat is fully mocked on the web app too (no backend messaging endpoint exists
// yet) — this mirrors that behavior locally via AsyncStorage so the two stay
// in sync conceptually. Swap in a real API once a chat backend exists.

const CONTACTS = [
  { id: 'ai', name: 'AI Export Assistant', role: 'ai', online: true, avatar: '🤖', last: 'Ask me anything about exports!' },
  { id: 'ship1', name: 'Shipment #SHP-2024-01', role: 'shipment', online: true, avatar: '🚢', last: 'Status: In Transit — Dubai Hub' },
  { id: 'ship2', name: 'Shipment #SHP-2024-02', role: 'shipment', online: false, avatar: '📦', last: 'Status: Customs — Singapore' },
  { id: 'buyer1', name: 'Ahmed Al-Rashid', role: 'buyer', online: true, avatar: '🏢', last: 'Please send the packing list' },
  { id: 'buyer2', name: 'Sarah Johnson', role: 'buyer', online: false, avatar: '🏢', last: 'When will shipment arrive?' },
  { id: 'forwarder1', name: 'FastShip Logistics', role: 'forwarder', online: true, avatar: '🚚', last: 'Pickup confirmed for tomorrow' },
  { id: 'adviser1', name: 'CA Ravi Sharma', role: 'adviser', online: false, avatar: '👨‍💼', last: 'GST refund filed successfully' },
  { id: 'farmer1', name: 'Punjab Agri Farms', role: 'farmer', online: true, avatar: '🌾', last: 'New crop batch ready — 500kg' },
];

const AI_ANSWERS = {
  iec: 'IEC (Import Export Code) is a 10-digit code issued by DGFT. Apply at dgft.gov.in with PAN, Aadhaar, bank certificate, and address proof. Cost: ₹500, issued within 2 working days.',
  gst: 'For exports, GST is zero-rated. File GSTR-1 with export invoices, then claim refund via GSTR-3B. Refund typically processed within 60 days. Use LUT to export without paying IGST.',
  document: 'Key export documents: Commercial Invoice, Packing List, Shipping Bill, Bill of Lading/Airway Bill, Certificate of Origin, IEC Certificate, GST Invoice.',
  shipping: 'Shipping options: Sea freight (cheaper, 15-30 days), Air freight (faster, 2-5 days, 4x costlier). Book 2-3 weeks in advance for sea freight.',
  tax: 'Export benefits: zero GST on exports, IGST refund within 60 days, duty drawback on inputs, MEIS/RoDTEP incentives, no customs duty on exports.',
  restriction: 'Restricted exports require special licenses: arms, chemicals, wildlife, some agricultural products. Most agricultural products need APEDA registration.',
  customs: 'Customs process: File Shipping Bill on ICEGATE → Port examination (if selected) → Let Export Order → Hand over to carrier. Use a CHA for hassle-free clearance.',
  lc: "Letter of Credit (LC) is the safest payment method for exports. Always check LC terms carefully before shipping.",
  incoterms: "Common Incoterms: FOB, CIF, EXW, DDP. FOB is most common for India.",
};

const ROLE_FILTERS = ['All', 'Buyer', 'Forwarder', 'Adviser', 'Farmer', 'Shipments'];
const DOC_TYPES = ['Commercial Invoice', 'Packing List', 'Certificate of Origin', 'Bill of Lading', 'Shipping Bill', 'IEC Certificate', 'GST Invoice'];
const STORAGE_KEY = 'exportChatsMobile';

function getAIReply(msg) {
  const m = msg.toLowerCase();
  for (const [key, answer] of Object.entries(AI_ANSWERS)) {
    if (m.includes(key)) return answer;
  }
  return "I can help with IEC, GST, export documents, shipping, tax benefits, customs, LC, and Incoterms. What would you like to know?";
}

const ChatScreen = ({ userRole = 'exporter' }) => {
  const [chats, setChats] = useState({});
  const [active, setActive] = useState(null);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [showDocs, setShowDocs] = useState(false);
  const [typing, setTyping] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) { setChats(JSON.parse(saved)); return; }
      const initial = {};
      CONTACTS.forEach(c => {
        initial[c.id] = c.last ? [{ id: `${Date.now()}-${c.id}`, from: 'them', type: 'text', text: c.last, time: new Date().toISOString() }] : [];
      });
      setChats(initial);
    })();
  }, []);

  useEffect(() => { AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(chats)); }, [chats]);

  const addMessage = (contactId, msg) => setChats(prev => ({ ...prev, [contactId]: [...(prev[contactId] || []), msg] }));

  const sendText = () => {
    if (!input.trim() || !active) return;
    const msg = { id: `${Date.now()}`, from: 'me', type: 'text', text: input, time: new Date().toISOString() };
    addMessage(active.id, msg);
    const userMsg = input;
    setInput('');
    if (active.id === 'ai') {
      setTyping(true);
      setTimeout(() => { setTyping(false); addMessage('ai', { id: `${Date.now()}`, from: 'them', type: 'text', text: getAIReply(userMsg), time: new Date().toISOString() }); }, 1200);
    } else if (active.online) {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        const replies = ["Got it, thanks!", "Sure, I'll check and get back.", 'Understood. Will update shortly.', 'Thanks for the update!', 'Noted.'];
        addMessage(active.id, { id: `${Date.now()}`, from: 'them', type: 'text', text: replies[Math.floor(Math.random() * replies.length)], time: new Date().toISOString() });
      }, 1500 + Math.random() * 1000);
    }
  };

  const sendDoc = (docType) => {
    addMessage(active.id, { id: `${Date.now()}`, from: 'me', type: 'doc', text: docType, file: `${docType.replace(/ /g, '_')}.pdf`, time: new Date().toISOString() });
    setShowDocs(false);
    if (active.id === 'ai') setTimeout(() => addMessage('ai', { id: `${Date.now()}`, from: 'them', type: 'text', text: `I've received your ${docType}. I can help verify the details if needed.`, time: new Date().toISOString() }), 1000);
  };

  const filteredContacts = CONTACTS.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'All' || c.role === roleFilter.toLowerCase() || (roleFilter === 'Shipments' && c.role === 'shipment');
    return matchSearch && matchRole;
  });

  const unread = (id) => (chats[id] || []).filter(m => m.from === 'them').length;
  const lastMsg = (c) => (chats[c.id] || []).slice(-1)[0]?.text?.slice(0, 40) || c.last;

  if (active) {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={60}>
        <StatusBar barStyle="light-content" />
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setActive(null)}><Text style={styles.backBtn}>← Back</Text></TouchableOpacity>
          <Text style={styles.chatHeaderName}>{active.avatar} {active.name}</Text>
          <View style={{ width: 44 }} />
        </View>
        <FlatList
          ref={listRef}
          data={chats[active.id] || []}
          keyExtractor={m => String(m.id)}
          contentContainerStyle={styles.msgList}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item: msg }) => (
            <View style={[styles.msgRow, msg.from === 'me' ? styles.msgRowMe : styles.msgRowThem]}>
              <View style={[styles.bubble, msg.from === 'me' ? styles.bubbleMe : styles.bubbleThem]}>
                {msg.type === 'text' && <Text style={styles.bubbleText}>{msg.text}</Text>}
                {msg.type === 'doc' && <Text style={styles.bubbleText}>📎 {msg.text} ({msg.file})</Text>}
              </View>
              <Text style={styles.msgTime}>{new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
          )}
          ListFooterComponent={typing ? <Text style={styles.typing}>{active.name} is typing…</Text> : null}
        />
        {showDocs && (
          <View style={styles.docPicker}>
            {DOC_TYPES.map(d => (
              <TouchableOpacity key={d} style={styles.docChip} onPress={() => sendDoc(d)}>
                <Text style={styles.docChipText}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={styles.inputRow}>
          <TouchableOpacity onPress={() => setShowDocs(!showDocs)} style={styles.iconBtn}><Text style={styles.iconText}>📎</Text></TouchableOpacity>
          <TextInput
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            placeholder={active.id === 'ai' ? 'Ask the AI assistant...' : `Message ${active.name}...`}
            placeholderTextColor="#a8b2d8"
            onSubmitEditing={sendText}
          />
          <TouchableOpacity onPress={sendText} style={styles.sendBtn}><Text style={styles.sendBtnText}>➤</Text></TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.listHeader}>
        <Text style={styles.title}>💬 Messages</Text>
        <TextInput style={styles.search} value={search} onChangeText={setSearch} placeholder="Search contacts..." placeholderTextColor="#a8b2d8" />
        <View style={styles.filterRow}>
          {ROLE_FILTERS.map(r => (
            <TouchableOpacity key={r} onPress={() => setRoleFilter(r)} style={[styles.filterChip, roleFilter === r && styles.filterChipActive]}>
              <Text style={[styles.filterChipText, roleFilter === r && styles.filterChipTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <FlatList
        data={filteredContacts}
        keyExtractor={c => c.id}
        contentContainerStyle={styles.contactList}
        renderItem={({ item: c }) => (
          <TouchableOpacity style={styles.contactRow} onPress={() => setActive(c)}>
            <Text style={styles.avatar}>{c.avatar}</Text>
            <View style={{ flex: 1 }}>
              <View style={styles.rowBetween}>
                <Text style={styles.contactName}>{c.name}</Text>
                {unread(c.id) > 0 && <View style={styles.unreadDot}><Text style={styles.unreadText}>{unread(c.id)}</Text></View>}
              </View>
              <Text style={styles.contactLast} numberOfLines={1}>{lastMsg(c)}</Text>
            </View>
            {c.online && <View style={styles.onlineDot} />}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  listHeader: { padding: 20, paddingTop: 60 },
  title: { color: '#ffffff', fontSize: 24, fontWeight: '700', marginBottom: 12 },
  search: { backgroundColor: '#1a1a2e', borderWidth: 1, borderColor: '#2a2a4e', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, color: '#fff', marginBottom: 10 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  filterChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, backgroundColor: '#1a1a2e', marginRight: 6, marginBottom: 6 },
  filterChipActive: { backgroundColor: '#6366f1' },
  filterChipText: { color: '#a8b2d8', fontSize: 11, fontWeight: '600' },
  filterChipTextActive: { color: '#fff' },
  contactList: { paddingHorizontal: 20, paddingBottom: 20 },
  contactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1a1a2e' },
  avatar: { fontSize: 26, marginRight: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  contactName: { color: '#ffffff', fontWeight: '600', fontSize: 14 },
  contactLast: { color: '#a8b2d8', fontSize: 12, marginTop: 2 },
  unreadDot: { backgroundColor: '#6366f1', borderRadius: 10, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  unreadText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e', marginLeft: 8 },
  chatHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 56, paddingBottom: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#1a1a2e' },
  backBtn: { color: '#6366f1', fontSize: 14, fontWeight: '600', width: 60 },
  chatHeaderName: { color: '#ffffff', fontWeight: '700', fontSize: 15, flex: 1, textAlign: 'center' },
  msgList: { padding: 16, paddingBottom: 8 },
  msgRow: { marginBottom: 10, maxWidth: '80%' },
  msgRowMe: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  msgRowThem: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  bubble: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 16 },
  bubbleMe: { backgroundColor: '#6366f1', borderBottomRightRadius: 4 },
  bubbleThem: { backgroundColor: '#1a1a2e', borderBottomLeftRadius: 4 },
  bubbleText: { color: '#ffffff', fontSize: 14 },
  msgTime: { color: '#a8b2d8', fontSize: 10, marginTop: 3 },
  typing: { color: '#a8b2d8', fontSize: 12, marginLeft: 4, marginTop: 4 },
  docPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#1a1a2e' },
  docChip: { backgroundColor: 'rgba(99,102,241,0.12)', borderWidth: 1, borderColor: 'rgba(99,102,241,0.3)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, marginRight: 6, marginBottom: 6 },
  docChipText: { color: '#6366f1', fontSize: 11, fontWeight: '600' },
  inputRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderTopWidth: 1, borderTopColor: '#1a1a2e', gap: 8 },
  iconBtn: { padding: 8 },
  iconText: { fontSize: 18 },
  textInput: { flex: 1, backgroundColor: '#1a1a2e', borderWidth: 1, borderColor: '#2a2a4e', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, color: '#fff' },
  sendBtn: { backgroundColor: '#6366f1', width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  sendBtnText: { color: '#fff', fontSize: 16 },
});

export default ChatScreen;
