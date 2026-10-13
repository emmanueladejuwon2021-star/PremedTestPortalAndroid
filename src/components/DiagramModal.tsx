import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../constants/colors';

interface DiagramModalProps {
  visible: boolean;
  imageUrl?: string;
  onClose: () => void;
}

export const DiagramModal: React.FC<DiagramModalProps> = ({ visible, imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
          <Text style={styles.closeText}>✕ Close Diagram</Text>
        </TouchableOpacity>

        <View style={styles.imageCard}>
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  closeBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  closeText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  imageCard: {
    width: '100%',
    height: '70%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    padding: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
