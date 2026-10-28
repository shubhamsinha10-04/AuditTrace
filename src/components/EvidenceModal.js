import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../theme/colors';
import { useAudit } from '../context/AuditContext';
import { SignaturePad } from './SignaturePad';
import { SAMPLE_CAPTURE_PRESETS } from '../data/mockAudits';

export const EvidenceModal = ({ visible, onClose, control, auditId }) => {
  const { addEvidence, addSignature, currentAuditor } = useAudit();

  const [activeTab, setActiveTab] = useState('photo'); // 'photo' | 'signature'
  const [selectedImageUri, setSelectedImageUri] = useState(SAMPLE_CAPTURE_PRESETS[0].uri);
  const [caption, setCaption] = useState(SAMPLE_CAPTURE_PRESETS[0].caption);
  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [mockGps, setMockGps] = useState({
    latitude: 40.712792,
    longitude: -74.005988,
    altitude: 22.4,
    accuracy: 1.8,
  });
  const [timestamp, setTimestamp] = useState(new Date().toISOString());
  const [isCapturing, setIsCapturing] = useState(false);

  if (!control) return null;

  // Pick from device photo gallery
  const handlePickFromGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access photo gallery is needed to upload evidence.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImageUri(result.assets[0].uri);
        setTimestamp(new Date().toISOString());
        setCaption(`Field Photo Evidence - ${control.id}`);
      }
    } catch (e) {
      console.warn('Error launching image picker:', e);
    }
  };

  // Launch device camera
  const handleLaunchCamera = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Camera Permission Required', 'Camera access is required for on-site physical evidence logging.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImageUri(result.assets[0].uri);
        setTimestamp(new Date().toISOString());
        setCaption(`On-Site Field Capture - ${control.id}`);
      }
    } catch (e) {
      console.warn('Camera launch warning:', e);
    }
  };

  // Select preset sample evidence
  const handleSelectPreset = (preset) => {
    setSelectedImageUri(preset.uri);
    setCaption(preset.caption);
    setTimestamp(new Date().toISOString());
  };

  // Save photo evidence
  const handleSaveEvidence = () => {
    if (!selectedImageUri) {
      Alert.alert('Missing Evidence', 'Please select or capture a photo first.');
      return;
    }

    addEvidence(auditId, control.id, {
      uri: selectedImageUri,
      caption: caption || `${control.id} Inspection Evidence`,
      notes: evidenceNotes,
      gps: mockGps,
      timestamp,
    });

    onClose();
  };

  // Save digital signature
  const handleSaveSignature = (sigData) => {
    addSignature(auditId, control.id, sigData);
    onClose();
  };

  // Calculated mock SHA-256 for live preview
  const previewHash = 'sha256:' + (selectedImageUri ? selectedImageUri.slice(-16).split('').map(c => c.charCodeAt(0).toString(16)).join('').padEnd(64, '0') : '0'.repeat(64));

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <View style={styles.controlBadgeRow}>
                <View style={styles.controlPill}>
                  <Text style={styles.controlPillText}>{control.id}</Text>
                </View>
                <Text style={styles.domainLabel}>{control.domain}</Text>
              </View>
              <Text style={styles.modalTitle}>Tamper-Evident Evidence Vault</Text>
              <Text style={styles.modalSubtitle} numberOfLines={1}>{control.title}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Mode Switcher Tabs */}
          <View style={styles.tabsRow}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'photo' && styles.tabBtnActive]}
              onPress={() => setActiveTab('photo')}
            >
              <Ionicons
                name="camera"
                size={16}
                color={activeTab === 'photo' ? colors.primary : colors.textMuted}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.tabBtnText, activeTab === 'photo' && styles.tabBtnTextActive]}>
                Photo & Forensic Watermark
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'signature' && styles.tabBtnActive]}
              onPress={() => setActiveTab('signature')}
            >
              <Ionicons
                name="pencil"
                size={16}
                color={activeTab === 'signature' ? colors.primary : colors.textMuted}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.tabBtnText, activeTab === 'signature' && styles.tabBtnTextActive]}>
                Manager Sign-Off
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {activeTab === 'photo' ? (
              <View>
                {/* Photo Preview Container with Forensic Overlay */}
                <View style={styles.previewContainer}>
                  {selectedImageUri ? (
                    <Image source={{ uri: selectedImageUri }} style={styles.previewImage} resizeMode="cover" />
                  ) : (
                    <View style={styles.noImagePlaceholder}>
                      <Ionicons name="camera-outline" size={48} color="#94A3B8" />
                      <Text style={styles.noImageText}>No image selected</Text>
                    </View>
                  )}

                  {/* Tamper-Evident Forensic Metadata Watermark Overlay */}
                  <View style={styles.forensicWatermark}>
                    <View style={styles.watermarkTop}>
                      <View style={styles.watermarkShield}>
                        <Ionicons name="shield-checkmark" size={12} color="#38BDF8" style={{ marginRight: 4 }} />
                        <Text style={styles.watermarkShieldText}>AUDITTRACE FORENSIC PROOF</Text>
                      </View>
                      <Text style={styles.watermarkCode}>{control.id} // SECURE</Text>
                    </View>

                    <View style={styles.watermarkGrid}>
                      <View style={styles.watermarkCol}>
                        <Text style={styles.watermarkKey}>TIMESTAMP (UTC):</Text>
                        <Text style={styles.watermarkVal}>{timestamp}</Text>
                      </View>
                      <View style={styles.watermarkCol}>
                        <Text style={styles.watermarkKey}>GPS COORD:</Text>
                        <Text style={styles.watermarkVal}>
                          {mockGps.latitude.toFixed(6)}° N, {Math.abs(mockGps.longitude).toFixed(6)}° W
                        </Text>
                      </View>
                    </View>

                    <View style={styles.watermarkGrid}>
                      <View style={styles.watermarkCol}>
                        <Text style={styles.watermarkKey}>AUDITOR ID:</Text>
                        <Text style={styles.watermarkVal}>{currentAuditor.id} ({currentAuditor.name})</Text>
                      </View>
                      <View style={styles.watermarkCol}>
                        <Text style={styles.watermarkKey}>SHA-256 HASH:</Text>
                        <Text style={styles.watermarkValHash} numberOfLines={1}>{previewHash}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Photo Action Buttons */}
                <View style={styles.photoActionsRow}>
                  <TouchableOpacity style={styles.captureBtn} onPress={handleLaunchCamera}>
                    <Ionicons name="camera" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.captureBtnText}>Live Camera</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.uploadBtn} onPress={handlePickFromGallery}>
                    <Ionicons name="image-outline" size={16} color={colors.primary} style={{ marginRight: 6 }} />
                    <Text style={styles.uploadBtnText}>Upload File</Text>
                  </TouchableOpacity>
                </View>

                {/* Quick Inspection Preset Selector */}
                <View style={styles.presetsSection}>
                  <Text style={styles.sectionHeader}>Select Standard Field Preset (for instant demo):</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetsScroll}>
                    {SAMPLE_CAPTURE_PRESETS.map((preset, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={[
                          styles.presetChip,
                          selectedImageUri === preset.uri && styles.presetChipActive,
                        ]}
                        onPress={() => handleSelectPreset(preset)}
                      >
                        <Image source={{ uri: preset.uri }} style={styles.presetThumb} />
                        <View style={{ marginLeft: 6 }}>
                          <Text style={styles.presetTitle} numberOfLines={1}>{preset.title}</Text>
                          <Text style={styles.presetDomain}>{preset.domain}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Inputs for Caption and Notes */}
                <View style={styles.formSection}>
                  <Text style={styles.fieldLabel}>Evidence Caption / Description *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={caption}
                    onChangeText={setCaption}
                    placeholder="e.g. Rack 4 Power Distribution Unit and biometric lock"
                    placeholderTextColor="#94A3B8"
                  />

                  <Text style={[styles.fieldLabel, { marginTop: 10 }]}>Forensic Working Observation (Optional)</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    value={evidenceNotes}
                    onChangeText={setEvidenceNotes}
                    placeholder="Add detailed field notes or compliance observations..."
                    placeholderTextColor="#94A3B8"
                    multiline
                    numberOfLines={3}
                  />
                </View>

                {/* Submit Evidence Button */}
                <TouchableOpacity style={styles.saveEvidenceBtn} onPress={handleSaveEvidence}>
                  <Ionicons name="checkmark-done" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.saveEvidenceBtnText}>Attach & Seal Tamper-Proof Evidence</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <SignaturePad
                onSave={handleSaveSignature}
                onCancel={onClose}
                defaultRole="Facilities Director / Escort"
              />
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 620,
    maxHeight: '92%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    backgroundColor: '#F8FAFC',
  },
  controlBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  controlPill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  controlPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  domainLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    maxWidth: 480,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    backgroundColor: '#FFFFFF',
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: colors.primary,
    backgroundColor: '#F8FAFC',
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  tabBtnTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  modalBody: {
    padding: 16,
  },
  previewContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    position: 'relative',
    height: 250,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  noImagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    color: '#94A3B8',
    marginTop: 8,
    fontSize: 12,
  },
  forensicWatermark: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(11, 26, 44, 0.90)',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(56, 189, 248, 0.3)',
  },
  watermarkTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 4,
  },
  watermarkShield: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  watermarkShieldText: {
    color: '#38BDF8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  watermarkCode: {
    color: '#CBD5E1',
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  watermarkGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  watermarkCol: {
    flex: 1,
  },
  watermarkKey: {
    color: '#94A3B8',
    fontSize: 8,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  watermarkVal: {
    color: '#F8FAFC',
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  watermarkValHash: {
    color: '#38BDF8',
    fontSize: 9,
    fontFamily: 'monospace',
  },
  photoActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 12,
  },
  captureBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    paddingVertical: 10,
    borderRadius: 6,
  },
  captureBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  uploadBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingVertical: 10,
    borderRadius: 6,
  },
  uploadBtnText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  presetsSection: {
    marginBottom: 14,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  presetsScroll: {
    flexDirection: 'row',
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 6,
    padding: 6,
    marginRight: 8,
    maxWidth: 220,
  },
  presetChipActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentLight,
  },
  presetThumb: {
    width: 32,
    height: 32,
    borderRadius: 4,
  },
  presetTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  presetDomain: {
    fontSize: 9,
    color: colors.textMuted,
  },
  formSection: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: colors.textPrimary,
  },
  textArea: {
    height: 64,
    textAlignVertical: 'top',
  },
  saveEvidenceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pass,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  saveEvidenceBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
