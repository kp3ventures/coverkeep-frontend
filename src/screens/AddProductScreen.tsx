import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../services/firebaseConfig';
import BarcodeScanner from '../components/BarcodeScanner';

export default function AddProductScreen({ navigation }: any) {
  const [showScanner, setShowScanner] = useState(false);
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [barcode, setBarcode] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [warrantyExpiry, setWarrantyExpiry] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleBarcodeScanned = (scannedBarcode: string) => {
    setBarcode(scannedBarcode);
    setShowScanner(false);
    // TODO: Fetch product details from backend using barcode
  };

  const handleSaveProduct = async () => {
    if (!productName || !brand) {
      Alert.alert('Error', 'Please enter product name and brand');
      return;
    }

    setIsLoading(true);
    const userId = auth.currentUser?.uid;

    if (!userId) {
      Alert.alert('Error', 'User not authenticated');
      setIsLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, 'users', userId, 'products'), {
        name: productName,
        brand,
        barcode,
        purchaseDate,
        warrantyExpiry,
        notes,
        createdAt: new Date().toISOString(),
      });

      Alert.alert('Success', 'Product added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (showScanner) {
    return (
      <BarcodeScanner
        onBarcodeScanned={handleBarcodeScanned}
        onClose={() => setShowScanner(false)}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add Product</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.form}>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => setShowScanner(true)}
        >
          <Text style={styles.scanButtonText}>📷 Scan Barcode</Text>
        </TouchableOpacity>

        {barcode && (
          <Text style={styles.barcodeText}>Barcode: {barcode}</Text>
        )}

        <TextInput
          style={styles.input}
          placeholder="Product Name *"
          value={productName}
          onChangeText={setProductName}
        />

        <TextInput
          style={styles.input}
          placeholder="Brand *"
          value={brand}
          onChangeText={setBrand}
        />

        <TextInput
          style={styles.input}
          placeholder="Purchase Date (YYYY-MM-DD)"
          value={purchaseDate}
          onChangeText={setPurchaseDate}
        />

        <TextInput
          style={styles.input}
          placeholder="Warranty Expiry (YYYY-MM-DD)"
          value={warrantyExpiry}
          onChangeText={setWarrantyExpiry}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Notes"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveProduct}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save Product'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cancelText: {
    color: '#007AFF',
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    padding: 20,
  },
  scanButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  barcodeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
