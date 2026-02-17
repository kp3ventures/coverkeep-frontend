import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../services/firebaseConfig';

interface Product {
  id: string;
  name: string;
  brand: string;
  barcode?: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  notes?: string;
  createdAt: string;
}

export default function ProductDetailScreen({ route, navigation }: any) {
  const { productId } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    try {
      const docRef = doc(db, 'users', userId, 'products', productId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
      } else {
        Alert.alert('Error', 'Product not found');
        navigation.goBack();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const userId = auth.currentUser?.uid;
            if (!userId) return;

            try {
              await deleteDoc(doc(db, 'users', userId, 'products', productId));
              Alert.alert('Success', 'Product deleted', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productBrand}>{product.brand}</Text>

        {product.barcode && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Barcode:</Text>
            <Text style={styles.value}>{product.barcode}</Text>
          </View>
        )}

        {product.purchaseDate && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Purchase Date:</Text>
            <Text style={styles.value}>{product.purchaseDate}</Text>
          </View>
        )}

        {product.warrantyExpiry && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Warranty Expires:</Text>
            <Text style={styles.value}>{product.warrantyExpiry}</Text>
          </View>
        )}

        {product.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.label}>Notes:</Text>
            <Text style={styles.notesText}>{product.notes}</Text>
          </View>
        )}

        <View style={styles.metaSection}>
          <Text style={styles.metaText}>
            Added: {new Date(product.createdAt).toLocaleDateString()}
          </Text>
        </View>
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
  backText: {
    color: '#007AFF',
    fontSize: 16,
  },
  deleteText: {
    color: '#FF3B30',
    fontSize: 16,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 18,
    color: '#666',
  },
  content: {
    padding: 20,
  },
  productName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productBrand: {
    fontSize: 20,
    color: '#666',
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    width: 140,
  },
  value: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  notesSection: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  notesText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    lineHeight: 24,
  },
  metaSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  metaText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
