import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useAudit } from '../context/AuditContext';

export const CreateAuditModal = ({ visible, onClose, onCreated }) => {
  const { createAudit } = useAudit();

  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [engagementType, setEngagementType] = useState('SOC 2 & Physical Security');
  const [riskLevel, setRiskLevel] = useState('Medium');
  const [location, setLocation] = useState('Primary Data Center Facility');
  const [dueDate, setDueDate] = useState('2026-11-28');

  const ENGAGEMENT_TYPES = [
    'SOC 2 & Physical Security',
    'Fixed Asset Physical Verification',
    'SOX 404 ITGC Controls',
    'ISO 27001 Perimeter Inspection',
    'Disaster Recovery Site Audit',
  ];

  const handleCreate = () => {
    if (!title.trim() || !client.trim()) {
      alert('Please fill in both the Engagement Title and Client Name.');
      return;
    }

    const newAudit = createAudit({
      title: title.trim(),
      client: client.trim(),
      engagementType,
      riskLevel,
      location: location.trim(),
      dueDate,
    });

    // Reset fields
    setTitle('');
    setClient('');
    onClose();
    if (onCreated) {
      onCreated(newAudit.id);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>New Audit Engagement</Text>
              <Text style={styles.modalSubtitle}>Create a new on-site field working paper</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Title */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Engagement Title *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Fixed Asset Physical Verification - Server Hall 4"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Client Name */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Client Organization *</Text>
              <TextInput
                style={styles.input}
                value={client}
                onChangeText={setClient}
                placeholder="e.g. Apex Global Financial Systems"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Engagement Type Selector */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Framework / Engagement Type</Text>
              <View style={styles.typeGrid}>
                {ENGAGEMENT_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeChip,
                      engagementType === type && styles.typeChipActive,
                    ]}
                    onPress={() => setEngagementType(type)}
                  >
                    <Text
                      style={[
                        styles.typeChipText,
                        engagementType === type && styles.typeChipTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Risk Level Selector */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Engagement Inherent Risk Level</Text>
              <View style={styles.riskRow}>
                {['Low', 'Medium', 'High'].map((risk) => (
                  <TouchableOpacity
                    key={risk}
                    style={[
                      styles.riskBtn,
                      riskLevel === risk && styles.riskBtnActive,
                      risk === 'High' && riskLevel === 'High' && { backgroundColor: colors.riskHighBg, borderColor: colors.riskHigh },
                      risk === 'Medium' && riskLevel === 'Medium' && { backgroundColor: colors.riskMediumBg, borderColor: colors.riskMedium },
                      risk === 'Low' && riskLevel === 'Low' && { backgroundColor: colors.riskLowBg, borderColor: colors.riskLow },
                    ]}
                    onPress={() => setRiskLevel(risk)}
                  >
                    <Text
                      style={[
                        styles.riskBtnText,
                        risk === 'High' && riskLevel === 'High' && { color: colors.riskHigh },
                        risk === 'Medium' && riskLevel === 'Medium' && { color: colors.riskMedium },
                        risk === 'Low' && riskLevel === 'Low' && { color: colors.riskLow },
                      ]}
                    >
                      {risk} Risk
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Location & Due Date */}
            <View style={styles.rowInputs}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Facility / Location</Text>
                <TextInput
                  style={styles.input}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="e.g. Bldg B, Chicago Hub"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Target Due Date</Text>
                <TextInput
                  style={styles.input}
                  value={dueDate}
                  onChangeText={setDueDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitBtn} onPress={handleCreate}>
              <Ionicons name="add-circle-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.submitBtnText}>Initialize Engagement</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 540,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    backgroundColor: '#F8FAFC',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
  },
  closeBtn: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
    maxHeight: 460,
  },
  formGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: colors.textPrimary,
    backgroundColor: '#F8FAFC',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  typeChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: '#F8FAFC',
  },
  typeChipActive: {
    borderColor: colors.primaryLight,
    backgroundColor: colors.primaryLight,
  },
  typeChipText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  typeChipTextActive: {
    color: '#FFFFFF',
  },
  riskRow: {
    flexDirection: 'row',
    gap: 8,
  },
  riskBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: '#F8FAFC',
  },
  riskBtnActive: {
    borderWidth: 2,
  },
  riskBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 10,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    backgroundColor: '#F8FAFC',
    gap: 10,
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 6,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
