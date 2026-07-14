import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import ModalSheet from '../../components/ModalSheet';

const PRODUCT_CATEGORIES = {
  Spices: ['Turmeric', 'Pepper', 'Cardamom', 'Chilli', 'Cumin', 'Coriander'],
  Fruits: ['Mango', 'Banana', 'Pomegranate', 'Grapes', 'Papaya'],
  Vegetables: ['Onion', 'Potato', 'Tomato', 'Okra', 'Green Chilli'],
  Grains: ['Basmati Rice', 'Wheat', 'Maize', 'Sorghum'],
  'Dry Fruits': ['Cashew Nuts', 'Almonds', 'Raisins', 'Walnuts', 'Pistachios'],
};
const CATEGORIES = Object.keys(PRODUCT_CATEGORIES);

const COUNTRY_DOCS = {
  'United States': ['FDA Registration', 'USDA Phytosanitary Certificate', 'Country of Origin Certificate'],
  'United Arab Emirates': ['Halal Certificate', 'ESMA Compliance', 'Country of Origin Certificate'],
  Germany: ['EU Phytosanitary Certificate', 'Pesticide Residue Test Report', 'CE Marking (if applicable)'],
  Japan: ['Japan Phytosanitary Certificate', 'JAS Organic Certificate (if organic)'],
  Australia: ['Australian Quarantine Certificate', 'Biosecurity Import Permit'],
  'Saudi Arabia': ['Halal Certificate', 'SFDA Registration', 'Country of Origin Certificate'],
  China: ['GACC Registration', 'Phytosanitary Certificate', 'Health Certificate'],
};

const HS_CODES = {
  Mango: '0804.50', Banana: '0803.90', Onion: '0703.10', Tomato: '0702.00',
  Potato: '0701.90', Grapes: '0806.10', Pomegranate: '0810.90', Rice: '1006.30',
  Wheat: '1001.99', Spices: '0904.21', Cotton: '5201.00', Soybean: '1201.90',
};

const USER_DOC_FIELDS = [
  { key: 'iec', label: 'IEC Code', placeholder: 'e.g. AABCP1234C' },
  { key: 'gst', label: 'GST Number', placeholder: 'e.g. 27AABCP1234C1Z5' },
  { key: 'rcmc', label: 'RCMC Number', placeholder: 'Registration Cum Membership Certificate' },
  { key: 'pan', label: 'PAN Card', placeholder: 'e.g. AABCP1234C' },
  { key: 'adCode', label: 'AD Code', placeholder: 'Authorised Dealer Code from bank' },
  { key: 'bankName', label: 'Bank Name', placeholder: 'Bank name for export payments' },
  { key: 'bankAccount', label: 'Bank Account No.', placeholder: 'Account number' },
  { key: 'businessAddress', label: 'Business Address', placeholder: 'Registered business address' },
];

const STATUS_OPTIONS = ['⏳ Pending', '✅ Verified', '❌ Missing'];
const BASE_REQUIRED_DOCS = ['IEC', 'GST', 'RCMC', 'FSSAI', 'Certificate of Origin', 'Phytosanitary', 'Invoice', 'Packing List'];
const CATEGORY_REQUIRED_DOCS = { Spices: ['Spices Board Certificate'] };

const getRequiredDocs = (category, toCountry) => {
  const docs = [...BASE_REQUIRED_DOCS, ...(CATEGORY_REQUIRED_DOCS[category] || []), ...(COUNTRY_DOCS[toCountry] || [])];
  return [...new Set(docs)];
};

const emptyProductForm = { product: '', category: '', from: 'India', to: '', hsCode: '', quantity: '', value: '', packaging: '' };

const TABS = [
  { id: 'user', label: '👤 User Docs' },
  { id: 'product', label: '📦 Product Docs' },
  { id: 'verify', label: '✅ Verify' },
];

const DocumentationScreen = ({ navigation }) => {
  const [tab, setTab] = useState('user');

  const [userForm, setUserForm] = useState({});
  const [statuses, setStatuses] = useState({});

  const [productForm, setProductForm] = useState(emptyProductForm);
  const [savedProducts, setSavedProducts] = useState([]);
  const [viewProduct, setViewProduct] = useState(null);

  const [draftProduct, setDraftProduct] = useState(null);
  const [docStatus, setDocStatus] = useState({});
  const [verifyStep, setVerifyStep] = useState('checklist');
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const [ud, us, pd] = await Promise.all([
        AsyncStorage.getItem('userDocs'),
        AsyncStorage.getItem('userDocStatuses'),
        AsyncStorage.getItem('productDocs'),
      ]);
      if (ud) setUserForm(JSON.parse(ud));
      if (us) setStatuses(JSON.parse(us));
      if (pd) setSavedProducts(JSON.parse(pd));
    })();
  }, []);

  const cycleStatus = (key) => {
    const current = statuses[key] || STATUS_OPTIONS[0];
    const next = STATUS_OPTIONS[(STATUS_OPTIONS.indexOf(current) + 1) % STATUS_OPTIONS.length];
    setStatuses(s => ({ ...s, [key]: next }));
  };

  const saveUserDocs = async () => {
    await AsyncStorage.setItem('userDocs', JSON.stringify(userForm));
    await AsyncStorage.setItem('userDocStatuses', JSON.stringify(statuses));
    Alert.alert('Saved', 'Documents saved!');
  };

  const autoHsCode = (product) => {
    const match = Object.entries(HS_CODES).find(([k]) => product.toLowerCase().includes(k.toLowerCase()));
    return match ? match[1] : '';
  };

  const startUpload = () => {
    if (!productForm.product || !productForm.to) {
      Alert.alert('Missing info', 'Select a product and destination country first.');
      return;
    }
    const required = getRequiredDocs(productForm.category, productForm.to);
    setDraftProduct({ ...productForm });
    setDocStatus(Object.fromEntries(required.map(d => [d, { uploaded: false, fileName: '' }])));
    setVerifyStep('checklist');
    setJustSaved(false);
    setTab('verify');
  };

  const requiredDocsForDraft = draftProduct ? getRequiredDocs(draftProduct.category, draftProduct.to) : [];
  const uploadedCount = requiredDocsForDraft.filter(d => docStatus[d]?.uploaded).length;

  const markUploaded = (docName) => {
    setDocStatus(s => ({ ...s, [docName]: { uploaded: true, fileName: `${docName.replace(/ /g, '_')}.pdf` } }));
  };

  const saveVerifiedDocument = async () => {
    const entry = {
      ...draftProduct,
      docs: docStatus,
      requiredDocs: requiredDocsForDraft,
      verified: requiredDocsForDraft.length > 0 && uploadedCount === requiredDocsForDraft.length,
      savedAt: new Date().toLocaleDateString(),
    };
    const list = [...savedProducts, entry];
    await AsyncStorage.setItem('productDocs', JSON.stringify(list));
    setSavedProducts(list);
    setProductForm(emptyProductForm);
    setDraftProduct(null);
    setDocStatus({});
    setVerifyStep('checklist');
    setJustSaved(true);
    setTab('product');
    Alert.alert('Saved', 'Document saved!');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Documents</Text>

        <View style={styles.tabRow}>
          {TABS.map(t => (
            <TouchableOpacity key={t.id} onPress={() => setTab(t.id)} style={[styles.tabBtn, tab === t.id && styles.tabBtnActive]}>
              <Text style={[styles.tabText, tab === t.id && styles.tabTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === 'user' && (
          <View>
            {USER_DOC_FIELDS.map(({ key, label, placeholder }) => (
              <Card key={key}>
                <View style={styles.rowBetween}>
                  <Text style={styles.fieldLabel}>{label}</Text>
                  <TouchableOpacity onPress={() => cycleStatus(key)} style={styles.statusPill}>
                    <Text style={styles.statusPillText}>{statuses[key] || STATUS_OPTIONS[0]}</Text>
                  </TouchableOpacity>
                </View>
                <Input value={userForm[key] || ''} onChangeText={v => setUserForm(f => ({ ...f, [key]: v }))} placeholder={placeholder} />
              </Card>
            ))}
            <Button title="💾 Save All Documents" onPress={saveUserDocs} />
          </View>
        )}

        {tab === 'product' && (
          <View>
            <Card>
              <Text style={styles.fieldLabel}>Product Category</Text>
              <View style={styles.chipRow}>
                {CATEGORIES.map(c => (
                  <TouchableOpacity key={c} style={[styles.chip, productForm.category === c && styles.chipActive]}
                    onPress={() => setProductForm(f => ({ ...f, category: c, product: '', hsCode: '' }))}>
                    <Text style={[styles.chipText, productForm.category === c && styles.chipTextActive]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.fieldLabel}>Product</Text>
              {productForm.category ? (
                <View style={styles.chipRow}>
                  {PRODUCT_CATEGORIES[productForm.category].map(p => (
                    <TouchableOpacity key={p} style={[styles.chip, productForm.product === p && styles.chipActive]}
                      onPress={() => setProductForm(f => ({ ...f, product: p, hsCode: autoHsCode(p) }))}>
                      <Text style={[styles.chipText, productForm.product === p && styles.chipTextActive]}>{p}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Input value={productForm.product} onChangeText={v => setProductForm(f => ({ ...f, product: v, hsCode: autoHsCode(v) }))} placeholder="Select a category above, or type a product" />
              )}

              <Input label="HS Code" value={productForm.hsCode} onChangeText={v => setProductForm(f => ({ ...f, hsCode: v }))} placeholder="Auto-filled or enter manually" />
              <Input label="Quantity (KG/MT)" value={productForm.quantity} onChangeText={v => setProductForm(f => ({ ...f, quantity: v }))} placeholder="e.g. 500 KG" />
              <Input label="Product Value (USD)" value={productForm.value} onChangeText={v => setProductForm(f => ({ ...f, value: v }))} placeholder="e.g. 2000" keyboardType="numeric" />
              <Input label="Packaging Type" value={productForm.packaging} onChangeText={v => setProductForm(f => ({ ...f, packaging: v }))} placeholder="e.g. Carton Box" />
              <Input label="From Country" value={productForm.from} onChangeText={v => setProductForm(f => ({ ...f, from: v }))} placeholder="e.g. India" />
              <Input label="To Country" value={productForm.to} onChangeText={v => setProductForm(f => ({ ...f, to: v }))} placeholder="e.g. United States" />
            </Card>

            <Button title="📤 Upload Document" onPress={startUpload} />

            {justSaved && (
              <Card>
                <Button title="📌 Book CHA" onPress={() => navigation?.navigate('CHA')} />
                <Button title="🚚 Book Freight Forwarder" variant="secondary" onPress={() => navigation?.navigate('Forwarder')} />
              </Card>
            )}

            {savedProducts.length > 0 && (
              <View style={{ marginTop: 8 }}>
                <Text style={styles.sectionLabel}>Saved</Text>
                {savedProducts.map((s, i) => (
                  <Card key={i}>
                    <View style={styles.rowBetween}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.fieldLabel}>{s.product} {s.hsCode ? `• HS: ${s.hsCode}` : ''}</Text>
                        <Text style={styles.metaText}>{s.from} → {s.to} {s.quantity ? `• ${s.quantity}` : ''}</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={[styles.statusPillText, { color: s.verified ? '#10b981' : '#f59e0b' }]}>{s.verified ? '✅ Verified' : '⏳ Partial'}</Text>
                        <TouchableOpacity onPress={() => setViewProduct(s)}><Text style={styles.viewLink}>View</Text></TouchableOpacity>
                      </View>
                    </View>
                  </Card>
                ))}
              </View>
            )}
          </View>
        )}

        {tab === 'verify' && (
          <View>
            {!draftProduct ? (
              <Card style={{ alignItems: 'center', paddingVertical: 30 }}>
                <Text style={{ fontSize: 32, marginBottom: 10 }}>✅</Text>
                <Text style={styles.metaText}>No document in progress. Fill in Product Documents and tap "Upload Document" to start verification.</Text>
              </Card>
            ) : verifyStep === 'checklist' ? (
              <View>
                <Card>
                  <Text style={styles.fieldLabel}>{draftProduct.product} {draftProduct.category ? `(${draftProduct.category})` : ''}</Text>
                  <Text style={styles.metaText}>{draftProduct.from} → {draftProduct.to}</Text>
                </Card>
                <Text style={styles.progressText}>📋 Required Documents ({uploadedCount}/{requiredDocsForDraft.length} uploaded)</Text>
                {requiredDocsForDraft.map(doc => (
                  <Card key={doc}>
                    <View style={styles.rowBetween}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.fieldLabel}>{doc}</Text>
                        {docStatus[doc]?.uploaded && <Text style={styles.uploadedText}>📎 {docStatus[doc].fileName}</Text>}
                      </View>
                      <TouchableOpacity style={[styles.uploadBtn, docStatus[doc]?.uploaded && styles.uploadBtnDone]} onPress={() => markUploaded(doc)}>
                        <Text style={[styles.uploadBtnText, docStatus[doc]?.uploaded && styles.uploadBtnTextDone]}>
                          {docStatus[doc]?.uploaded ? '✅ Uploaded' : '📎 Upload'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </Card>
                ))}
                <Button title="Continue to Review →" onPress={() => setVerifyStep('review')} />
              </View>
            ) : (
              <View>
                <Card>
                  <Text style={[styles.fieldLabel, { marginBottom: 8 }]}>📋 Review Document</Text>
                  {[
                    ['Product', draftProduct.product], ['Category', draftProduct.category], ['HS Code', draftProduct.hsCode],
                    ['Quantity', draftProduct.quantity], ['Value (USD)', draftProduct.value], ['Packaging', draftProduct.packaging],
                    ['From', draftProduct.from], ['To', draftProduct.to],
                  ].filter(([, v]) => v).map(([label, value]) => (
                    <View key={label} style={styles.detailRow}>
                      <Text style={styles.metaText}>{label}</Text>
                      <Text style={styles.fieldLabel}>{value}</Text>
                    </View>
                  ))}
                </Card>
                <Text style={styles.sectionLabel}>Documents ({uploadedCount}/{requiredDocsForDraft.length})</Text>
                {requiredDocsForDraft.map(doc => (
                  <View key={doc} style={styles.detailRow}>
                    <Text style={styles.metaText}>{doc}</Text>
                    <Text style={{ color: docStatus[doc]?.uploaded ? '#10b981' : '#f59e0b', fontSize: 12, fontWeight: '700' }}>
                      {docStatus[doc]?.uploaded ? `✅ ${docStatus[doc].fileName}` : '⏳ Missing'}
                    </Text>
                  </View>
                ))}
                <Button title="← Back" variant="secondary" onPress={() => setVerifyStep('checklist')} />
                <Button title="✅ Save Document" onPress={saveVerifiedDocument} />
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <ModalSheet visible={!!viewProduct} onClose={() => setViewProduct(null)} title={`${viewProduct?.product || ''} — Details`}>
        {viewProduct && (
          <View>
            {[
              ['Category', viewProduct.category], ['HS Code', viewProduct.hsCode], ['Quantity', viewProduct.quantity],
              ['Value (USD)', viewProduct.value], ['Packaging', viewProduct.packaging], ['From', viewProduct.from], ['To', viewProduct.to],
            ].filter(([, v]) => v).map(([label, value]) => (
              <View key={label} style={styles.detailRow}>
                <Text style={styles.metaText}>{label}</Text>
                <Text style={styles.fieldLabel}>{value}</Text>
              </View>
            ))}
            <Text style={styles.sectionLabel}>Verified Documents</Text>
            {(viewProduct.requiredDocs || []).map(d => (
              <View key={d} style={styles.detailRow}>
                <Text style={styles.metaText}>{d}</Text>
                <Text style={{ color: viewProduct.docs?.[d]?.uploaded ? '#10b981' : '#f59e0b', fontSize: 12, fontWeight: '700' }}>
                  {viewProduct.docs?.[d]?.uploaded ? `✅ ${viewProduct.docs[d].fileName}` : '⏳ Missing'}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ModalSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  title: { color: '#ffffff', fontSize: 26, fontWeight: '700', marginBottom: 14 },
  tabRow: { flexDirection: 'row', marginBottom: 16, gap: 8 },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: '#1a1a2e', alignItems: 'center', borderWidth: 1, borderColor: '#2a2a4e' },
  tabBtnActive: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  tabText: { color: '#a8b2d8', fontSize: 12, fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fieldLabel: { color: '#ffffff', fontWeight: '600', fontSize: 14 },
  statusPill: { backgroundColor: '#0a0a1a', borderWidth: 1, borderColor: '#2a2a4e', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  statusPillText: { color: '#a8b2d8', fontSize: 11, fontWeight: '600' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: '#0a0a1a', borderWidth: 1, borderColor: '#2a2a4e', marginRight: 8, marginBottom: 8 },
  chipActive: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  chipText: { color: '#a8b2d8', fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  metaText: { color: '#a8b2d8', fontSize: 12, marginTop: 4 },
  sectionLabel: { color: '#a8b2d8', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginVertical: 10 },
  viewLink: { color: '#6366f1', fontSize: 12, fontWeight: '700', marginTop: 4 },
  progressText: { color: '#6366f1', fontSize: 12, fontWeight: '700', marginBottom: 10 },
  uploadedText: { color: '#10b981', fontSize: 11, marginTop: 4 },
  uploadBtn: { backgroundColor: '#6366f1', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  uploadBtnDone: { backgroundColor: 'rgba(16,185,129,0.15)', borderWidth: 1, borderColor: '#10b981' },
  uploadBtnText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  uploadBtnTextDone: { color: '#10b981' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#2a2a4e' },
});

export default DocumentationScreen;
