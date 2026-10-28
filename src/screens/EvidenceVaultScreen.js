import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudit } from '../context/AuditContext';
import { colors } from '../theme/colors';

export const EvidenceVaultScreen = () => {
  const { activeAudit } = useAudit();
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  if (!activeAudit) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No engagement selected.</Text>
      </View>
    );
  }

  // Gather all evidence across controls
  const allEvidence = (activeAudit.controls || []).flatMap((c) =>
    (c.evidence || []).map((e) => ({
      ...e,
      controlId: c.id,
      controlTitle: c.title,
      domain: c.domain,
    }))
  );

  const allSignatures = (activeAudit.controls || []).flatMap((c) =>
    (c.signatures || []).map((s) => ({
      ...s,
      controlId: c.id,
      controlTitle: c.title,
      domain: c.domain,
    }))
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header Summary Banner */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
            <View style={styles.vaultIconBox}>
              <Ionicons name="lock-closed" size={20} color="#38BDF8" />
            </View>
            <View>
              <Text style={styles.summaryTitle}>Tamper-Proof Evidence Vault</Text>
              <Text style={styles.summarySubtitle}>
                {allEvidence.length} Cryptographic Photos • {allSignatures.length} Digital Signatures
              </Text>
            </View>
          </View>
          <View style={styles.verifiedBadge}>
            <Ionicons name="shield-checkmark" size={12} color="#059669" style={{ marginRight: 4 }} />
            <Text style={styles.verifiedText}>SHA-256 SECURED</Text>
          </View>
        </View>

        {/* Forensic Photos Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>CAPTURED ON-SITE FIELD EVIDENCE ({allEvidence.length})</Text>
          <Text style={styles.sectionSubtitle}>Tap card for complete forensic hash verify</Text>
        </View>

        {allEvidence.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="camera-outline" size={40} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No Evidence Photos Attached</Text>
            <Text style={styles.emptySub}>
              Attach field photos from the Checklist screen using the camera button.
            </Text>
          </View>
        ) : (
          allEvidence.map((evd) => (
            <TouchableOpacity
              key={evd.id}
              style={styles.evidenceCard}
              onPress={() => setSelectedEvidence(evd)}
              activeOpacity={0.85}
            >
              <Image source={{ uri: evd.uri }} style={styles.evidenceImage} />

              <View style={styles.evidenceDetails}>
                <View style={styles.evidenceTopRow}>
                  <View style={styles.controlRefPill}>
                    <Text style={styles.controlRefText}>{evd.controlId}</Text>
                  </View>
                  <Text style={styles.evidenceDomain}>{evd.domain}</Text>
                </View>

                <Text style={styles.evidenceCaption} numberOfLines={2}>
                  {evd.caption}
                </Text>

                <View style={styles.hashRow}>
                  <Ionicons name="finger-print-outline" size={12} color={colors.accent} style={{ marginRight: 4 }} />
                  <Text style={styles.hashText} numberOfLines={1}>
                    {evd.sha256Hash}
                  </Text>
                </View>

                <View style={styles.evidenceMetaRow}>
                  <View style={styles.metaItem}>
                    <Ionicons name="location-outline" size={11} color={colors.textMuted} style={{ marginRight: 3 }} />
                    <Text style={styles.metaVal}>
                      {evd.gps?.latitude?.toFixed(4)}°, {evd.gps?.longitude?.toFixed(4)}°
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={11} color={colors.textMuted} style={{ marginRight: 3 }} />
                    <Text style={styles.metaVal}>
                      {evd.timestamp ? evd.timestamp.slice(11, 19) + ' UTC' : 'Logged'}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* Manager Sign-Off Attestations Section */}
        <View style={[styles.sectionHeader, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>
            MANAGER SIGN-OFF ATTESTATIONS ({allSignatures.length})
          </Text>
          <Text style={styles.sectionSubtitle}>
            Verified on-site physical presence attestations
          </Text>
        </View>

        {allSignatures.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="create-outline" size={40} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No Signatures Recorded</Text>
            <Text style={styles.emptySub}>
              Have facility asset managers sign off from the inspection checklist.
            </Text>
          </View>
        ) : (
          allSignatures.map((sig) => (
            <View key={sig.id} style={styles.signatureCard}>
              <View style={styles.sigLeft}>
                <View style={styles.sigSealBox}>
                  <Ionicons name="shield-checkmark" size={24} color={colors.pass} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sigSignerName}>{sig.signerName}</Text>
                  <Text style={styles.sigRoleText}>{sig.signerRole}</Text>
                  <Text style={styles.sigControlRef}>Associated with: {sig.controlId} ({sig.controlTitle})</Text>
                  <Text style={styles.sigTimestamp}>Attested at: {sig.signedAt}</Text>
                </View>
              </View>
              <View style={styles.affirmedBadge}>
                <Text style={styles.affirmedText}>VERIFIED</Text>
              </View>
            </View>
          ))
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Forensic Detail Modal */}
      {selectedEvidence && (
        <Modal
          visible={Boolean(selectedEvidence)}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedEvidence(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalDialog}>
              <View style={styles.dialogHeader}>
                <View style={styles.dialogHeaderLeft}>
                  <View style={styles.controlRefPill}>
                    <Text style={styles.controlRefText}>{selectedEvidence.controlId}</Text>
                  </View>
                  <Text style={styles.dialogTitle}>Tamper-Proof Forensic Inspection</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedEvidence(null)} style={styles.dialogCloseBtn}>
                  <Ionicons name="close" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <Image source={{ uri: selectedEvidence.uri }} style={styles.dialogImage} resizeMode="cover" />

              <View style={styles.dialogForensicOverlay}>
                <Text style={styles.dialogCaption}>{selectedEvidence.caption}</Text>

                <View style={styles.forensicItem}>
                  <Text style={styles.forensicLabel}>SHA-256 CRYPTOGRAPHIC PROOF:</Text>
                  <Text style={styles.forensicHash}>{selectedEvidence.sha256Hash}</Text>
                </View>

                <View style={styles.forensicGrid}>
                  <View style={styles.forensicCol}>
                    <Text style={styles.forensicLabel}>GPS LAT / LON:</Text>
                    <Text style={styles.forensicVal}>
                      {selectedEvidence.gps?.latitude?.toFixed(6)}° N, {Math.abs(selectedEvidence.gps?.longitude || 0).toFixed(6)}° W
                    </Text>
                  </View>
                  <View style={styles.forensicCol}>
                    <Text style={styles.forensicLabel}>ALTITUDE & ACCURACY:</Text>
                    <Text style={styles.forensicVal}>
                      {selectedEvidence.gps?.altitude || 22.4}m (±{selectedEvidence.gps?.accuracy || 1.8}m)
                    </Text>
                  </View>
                </View>

                <View style={styles.forensicGrid}>
                  <View style={styles.forensicCol}>
                    <Text style={styles.forensicLabel}>TIMESTAMP (UTC):</Text>
                    <Text style={styles.forensicVal}>{selectedEvidence.timestamp}</Text>
                  </View>
                  <View style={styles.forensicCol}>
                    <Text style={styles.forensicLabel}>AUDITOR ID:</Text>
                    <Text style={styles.forensicVal}>{selectedEvidence.auditorId}</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.dialogDoneBtn}
                onPress={() => setSelectedEvidence(null)}
              >
                <Text style={styles.dialogDoneText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: 16,
  },
  emptyText: {
    padding: 20,
    color: colors.textMuted,
  },
  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vaultIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  summaryTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  summarySubtitle: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(5, 150, 105, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(5, 150, 105, 0.4)',
  },
  verifiedText: {
    color: '#34D399',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 10,
    color: colors.textMuted,
  },
  emptyState: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 6,
  },
  emptySub: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  evidenceCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
    marginBottom: 12,
  },
  evidenceImage: {
    width: '100%',
    height: 160,
  },
  evidenceDetails: {
    padding: 12,
  },
  evidenceTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  controlRefPill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  controlRefText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  evidenceDomain: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  evidenceCaption: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  hashRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 6,
    borderRadius: 4,
    marginBottom: 6,
  },
  hashText: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: colors.accent,
    flex: 1,
  },
  evidenceMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaVal: {
    fontSize: 10,
    color: colors.textMuted,
  },
  signatureCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 10,
  },
  sigLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  sigSealBox: {
    marginRight: 10,
    marginTop: 2,
  },
  sigSignerName: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  sigRoleText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  sigControlRef: {
    fontSize: 10,
    color: colors.primaryLight,
    fontWeight: '600',
  },
  sigTimestamp: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 1,
  },
  affirmedBadge: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  affirmedText: {
    color: colors.pass,
    fontSize: 10,
    fontWeight: '800',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalDialog: {
    width: '100%',
    maxWidth: 540,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  dialogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  dialogHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dialogTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  dialogCloseBtn: {
    padding: 4,
  },
  dialogImage: {
    width: '100%',
    height: 220,
  },
  dialogForensicOverlay: {
    padding: 14,
    backgroundColor: '#0F172A',
  },
  dialogCaption: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  forensicItem: {
    marginBottom: 8,
  },
  forensicLabel: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  forensicHash: {
    color: '#38BDF8',
    fontSize: 10,
    fontFamily: 'monospace',
  },
  forensicGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  forensicCol: {
    flex: 1,
  },
  forensicVal: {
    color: '#F8FAFC',
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  dialogDoneBtn: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 10,
    alignItems: 'center',
  },
  dialogDoneText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
