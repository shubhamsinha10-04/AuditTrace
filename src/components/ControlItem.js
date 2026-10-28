import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useAudit } from '../context/AuditContext';

export const ControlItem = ({ control, auditId, onOpenEvidenceModal }) => {
  const { updateControlStatus, updateControlNotes, removeEvidence } = useAudit();
  const [isNotesOpen, setIsNotesOpen] = useState(Boolean(control.notes));
  const [localNotes, setLocalNotes] = useState(control.notes || '');

  const handleStatusChange = (newStatus) => {
    updateControlStatus(auditId, control.id, newStatus);
  };

  const handleNotesBlur = () => {
    updateControlNotes(auditId, control.id, localNotes);
  };

  // Criticality Styling
  const getCriticalityStyle = (criticality) => {
    switch (criticality) {
      case 'High':
        return { text: colors.riskHigh, bg: colors.riskHighBg };
      case 'Medium':
        return { text: colors.riskMedium, bg: colors.riskMediumBg };
      case 'Low':
      default:
        return { text: colors.riskLow, bg: colors.riskLowBg };
    }
  };

  const critStyle = getCriticalityStyle(control.criticality);
  const evidenceCount = (control.evidence || []).length;
  const signatureCount = (control.signatures || []).length;

  return (
    <View style={styles.card}>
      {/* Top Header: ID, Domain, Criticality */}
      <View style={styles.headerRow}>
        <View style={styles.idGroup}>
          <View style={styles.idPill}>
            <Text style={styles.idText}>{control.id}</Text>
          </View>
          <Text style={styles.domainText}>{control.domain}</Text>
        </View>

        <View style={[styles.critBadge, { backgroundColor: critStyle.bg }]}>
          <Text style={[styles.critText, { color: critStyle.text }]}>{control.criticality} Priority</Text>
        </View>
      </View>

      {/* Control Title & Requirement */}
      <Text style={styles.title}>{control.title}</Text>
      <Text style={styles.requirement}>{control.requirement}</Text>

      {/* Interactive 4-Way Status Toggle Buttons */}
      <View style={styles.statusToggleContainer}>
        {/* Pass Button */}
        <TouchableOpacity
          style={[
            styles.statusBtn,
            control.status === 'pass' && styles.statusBtnPassActive,
          ]}
          onPress={() => handleStatusChange('pass')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="checkmark-circle"
            size={16}
            color={control.status === 'pass' ? '#FFFFFF' : colors.pass}
            style={{ marginRight: 4 }}
          />
          <Text
            style={[
              styles.statusBtnText,
              control.status === 'pass' && styles.statusBtnTextActive,
            ]}
          >
            PASS
          </Text>
        </TouchableOpacity>

        {/* Fail Button */}
        <TouchableOpacity
          style={[
            styles.statusBtn,
            control.status === 'fail' && styles.statusBtnFailActive,
          ]}
          onPress={() => handleStatusChange('fail')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="close-circle"
            size={16}
            color={control.status === 'fail' ? '#FFFFFF' : colors.fail}
            style={{ marginRight: 4 }}
          />
          <Text
            style={[
              styles.statusBtnText,
              control.status === 'fail' && styles.statusBtnTextActive,
            ]}
          >
            FAIL
          </Text>
        </TouchableOpacity>

        {/* Flag Button */}
        <TouchableOpacity
          style={[
            styles.statusBtn,
            control.status === 'flag' && styles.statusBtnFlagActive,
          ]}
          onPress={() => handleStatusChange('flag')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="alert-circle"
            size={16}
            color={control.status === 'flag' ? '#FFFFFF' : colors.flag}
            style={{ marginRight: 4 }}
          />
          <Text
            style={[
              styles.statusBtnText,
              control.status === 'flag' && styles.statusBtnTextActive,
            ]}
          >
            FLAG
          </Text>
        </TouchableOpacity>

        {/* Untested Button */}
        <TouchableOpacity
          style={[
            styles.statusBtn,
            (!control.status || control.status === 'untested') && styles.statusBtnUntestedActive,
          ]}
          onPress={() => handleStatusChange('untested')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="help-circle-outline"
            size={16}
            color={(!control.status || control.status === 'untested') ? '#FFFFFF' : colors.untested}
            style={{ marginRight: 4 }}
          />
          <Text
            style={[
              styles.statusBtnText,
              (!control.status || control.status === 'untested') && styles.statusBtnTextActive,
            ]}
          >
            HOLD
          </Text>
        </TouchableOpacity>
      </View>

      {/* Observation Notes Section */}
      <View style={styles.notesSection}>
        <TouchableOpacity
          style={styles.notesToggleRow}
          onPress={() => setIsNotesOpen(!isNotesOpen)}
          activeOpacity={0.7}
        >
          <Ionicons
            name="document-text-outline"
            size={14}
            color={localNotes ? colors.accent : colors.textMuted}
            style={{ marginRight: 4 }}
          />
          <Text style={[styles.notesToggleText, localNotes && { color: colors.textPrimary, fontWeight: '700' }]}>
            {localNotes ? 'Auditor Observation & Notes (Recorded)' : '+ Add Auditor Observation Note'}
          </Text>
          <Ionicons
            name={isNotesOpen ? 'chevron-up' : 'chevron-down'}
            size={14}
            color={colors.textMuted}
          />
        </TouchableOpacity>

        {isNotesOpen && (
          <View style={styles.notesInputContainer}>
            <TextInput
              style={styles.notesInput}
              value={localNotes}
              onChangeText={setLocalNotes}
              onBlur={handleNotesBlur}
              placeholder="Record physical inspection observations, asset tag inconsistencies, or remediation..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
            />
            <Text style={styles.autoSaveLabel}>Auto-saved to local working papers</Text>
          </View>
        )}
      </View>

      {/* Attached Evidence & Signatures Badges */}
      {(evidenceCount > 0 || signatureCount > 0) && (
        <View style={styles.attachedContainer}>
          <Text style={styles.attachedHeader}>ATTACHED TAMPER-PROOF EVIDENCE:</Text>
          
          {/* Thumbnails of attached photos */}
          <View style={styles.evidenceGrid}>
            {(control.evidence || []).map((evd) => (
              <View key={evd.id} style={styles.evidenceThumbWrapper}>
                <Image source={{ uri: evd.uri }} style={styles.evidenceThumb} />
                <View style={styles.geoPill}>
                  <Ionicons name="location" size={8} color="#FFFFFF" />
                  <Text style={styles.geoPillText}>GEO</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteEvdBtn}
                  onPress={() => removeEvidence(auditId, control.id, evd.id)}
                >
                  <Ionicons name="close" size={10} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}

            {/* Signature Sign-off Badges */}
            {(control.signatures || []).map((sig) => (
              <View key={sig.id} style={styles.signatureBadge}>
                <Ionicons name="shield-checkmark" size={16} color={colors.pass} style={{ marginRight: 6 }} />
                <View>
                  <Text style={styles.sigName}>{sig.signerName}</Text>
                  <Text style={styles.sigRole}>{sig.signerRole}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Bottom Actions Row */}
      <View style={styles.bottomActionsRow}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onOpenEvidenceModal(control)}
          activeOpacity={0.8}
        >
          <Ionicons name="camera-outline" size={15} color={colors.primary} style={{ marginRight: 5 }} />
          <Text style={styles.actionBtnText}>
            {evidenceCount > 0 ? `Evidence (${evidenceCount})` : '+ Evidence Photo'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onOpenEvidenceModal(control)}
          activeOpacity={0.8}
        >
          <Ionicons name="create-outline" size={15} color={colors.primary} style={{ marginRight: 5 }} />
          <Text style={styles.actionBtnText}>
            {signatureCount > 0 ? `Sign-Off Verified` : '+ Manager Sign-Off'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  idGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  idPill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  idText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  domainText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  critBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  critText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 18,
    marginBottom: 4,
  },
  requirement: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: 12,
  },
  statusToggleContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  statusBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: '#F8FAFC',
  },
  statusBtnPassActive: {
    backgroundColor: colors.pass,
    borderColor: colors.pass,
  },
  statusBtnFailActive: {
    backgroundColor: colors.fail,
    borderColor: colors.fail,
  },
  statusBtnFlagActive: {
    backgroundColor: colors.flag,
    borderColor: colors.flag,
  },
  statusBtnUntestedActive: {
    backgroundColor: colors.untested,
    borderColor: colors.untested,
  },
  statusBtnText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: colors.textPrimary,
  },
  statusBtnTextActive: {
    color: '#FFFFFF',
  },
  notesSection: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
    marginBottom: 8,
  },
  notesToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  notesToggleText: {
    fontSize: 11,
    color: colors.textMuted,
    flex: 1,
  },
  notesInputContainer: {
    marginTop: 6,
  },
  notesInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 6,
    padding: 8,
    fontSize: 12,
    color: colors.textPrimary,
    minHeight: 56,
    textAlignVertical: 'top',
  },
  autoSaveLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 3,
    fontStyle: 'italic',
  },
  attachedContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 10,
  },
  attachedHeader: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textSecondary,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  evidenceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  evidenceThumbWrapper: {
    position: 'relative',
    width: 54,
    height: 54,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  evidenceThumb: {
    width: '100%',
    height: '100%',
  },
  geoPill: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    backgroundColor: 'rgba(11, 30, 54, 0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderRadius: 3,
    gap: 2,
  },
  geoPillText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '800',
  },
  deleteEvdBtn: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(220, 38, 38, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signatureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sigName: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sigRole: {
    fontSize: 9,
    color: colors.textSecondary,
  },
  bottomActionsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 7,
    borderRadius: 6,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
});
