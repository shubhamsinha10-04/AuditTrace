import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useAudit } from '../context/AuditContext';

export const WorkingPaperModal = ({ visible, onClose, audit }) => {
  const { calculateAuditMetrics, syncAudit, isSyncing, isOnline, currentAuditor } = useAudit();
  const [viewMode, setViewMode] = useState('summary'); // 'summary' | 'json'
  const [copiedStatus, setCopiedStatus] = useState(false);

  if (!audit) return null;

  const metrics = calculateAuditMetrics(audit);
  const issues = (audit.controls || []).filter(c => c.status === 'fail' || c.status === 'flag');
  const allEvidence = (audit.controls || []).flatMap(c => (c.evidence || []).map(e => ({ ...e, controlId: c.id })));
  const allSignatures = (audit.controls || []).flatMap(c => (c.signatures || []).map(s => ({ ...s, controlId: c.id })));

  const handleSync = async () => {
    try {
      await syncAudit(audit.id);
      Alert.alert('Synchronized', `Audit engagement ${audit.id} successfully synced to Enterprise Cloud.`);
    } catch (e) {
      Alert.alert('Sync Offline', e.message);
    }
  };

  const handleCopyJSON = () => {
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2000);
  };

  const auditJsonString = JSON.stringify(
    {
      engagementId: audit.id,
      engagementTitle: audit.title,
      client: audit.client,
      status: audit.status,
      riskLevel: audit.riskLevel,
      auditor: currentAuditor,
      metrics: {
        complianceRate: `${metrics.passRate}%`,
        totalControls: metrics.total,
        passed: metrics.pass,
        failed: metrics.fail,
        flagged: metrics.flag,
        untested: metrics.untested,
      },
      controls: audit.controls,
      syncedWithServer: audit.isSynced,
      exportedAt: new Date().toISOString(),
    },
    null,
    2
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <View style={styles.headerPillRow}>
                <View style={styles.codePill}>
                  <Text style={styles.codePillText}>{audit.id}</Text>
                </View>
                <View style={[styles.statusPill, audit.isSynced ? styles.syncedPill : styles.pendingPill]}>
                  <Text style={[styles.statusPillText, audit.isSynced ? styles.syncedPillText : styles.pendingPillText]}>
                    {audit.isSynced ? '✓ Synced to Cloud' : '● Local Offline Cache'}
                  </Text>
                </View>
              </View>
              <Text style={styles.headerTitle}>Enterprise Working Paper Report</Text>
              <Text style={styles.headerSubtitle}>{audit.client} • {audit.title}</Text>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* View Mode Toggle */}
          <View style={styles.viewModeRow}>
            <TouchableOpacity
              style={[styles.viewModeBtn, viewMode === 'summary' && styles.viewModeBtnActive]}
              onPress={() => setViewMode('summary')}
            >
              <Ionicons name="newspaper-outline" size={14} color={viewMode === 'summary' ? colors.primary : colors.textMuted} style={{ marginRight: 6 }} />
              <Text style={[styles.viewModeText, viewMode === 'summary' && styles.viewModeTextActive]}>
                Working Paper Summary
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.viewModeBtn, viewMode === 'json' && styles.viewModeBtnActive]}
              onPress={() => setViewMode('json')}
            >
              <Ionicons name="code-slash" size={14} color={viewMode === 'json' ? colors.primary : colors.textMuted} style={{ marginRight: 6 }} />
              <Text style={[styles.viewModeText, viewMode === 'json' && styles.viewModeTextActive]}>
                JSON Audit Payload
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {viewMode === 'summary' ? (
              <View>
                {/* Executive Scorecard */}
                <View style={styles.scorecardCard}>
                  <View style={styles.scoreGauge}>
                    <Text style={styles.scoreNumber}>{metrics.passRate}%</Text>
                    <Text style={styles.scoreLabel}>COMPLIANCE</Text>
                  </View>

                  <View style={styles.statsCol}>
                    <Text style={styles.statLine}>
                      Total Controls Evaluated: <Text style={styles.boldVal}>{metrics.total - metrics.untested} / {metrics.total}</Text>
                    </Text>
                    <Text style={styles.statLine}>
                      Satisfactory Controls (Pass): <Text style={[styles.boldVal, { color: colors.pass }]}>{metrics.pass}</Text>
                    </Text>
                    <Text style={styles.statLine}>
                      Non-Compliant Findings (Fail): <Text style={[styles.boldVal, { color: colors.fail }]}>{metrics.fail}</Text>
                    </Text>
                    <Text style={styles.statLine}>
                      Audit Observations (Flag): <Text style={[styles.boldVal, { color: colors.flag }]}>{metrics.flag}</Text>
                    </Text>
                  </View>
                </View>

                {/* Audit Information Block */}
                <View style={styles.infoBlock}>
                  <Text style={styles.sectionTitle}>ENGAGEMENT PARTICULARS</Text>
                  <View style={styles.infoGrid}>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoKey}>Lead Auditor:</Text>
                      <Text style={styles.infoVal}>{audit.auditor || currentAuditor.name}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoKey}>Inspection Site:</Text>
                      <Text style={styles.infoVal}>{audit.location}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoKey}>Inherent Risk:</Text>
                      <Text style={styles.infoVal}>{audit.riskLevel} Risk Engagement</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoKey}>Evidence Attached:</Text>
                      <Text style={styles.infoVal}>{allEvidence.length} Photos, {allSignatures.length} Manager Sign-Offs</Text>
                    </View>
                  </View>
                </View>

                {/* Issues & Findings Section */}
                <View style={styles.issuesBlock}>
                  <Text style={styles.sectionTitle}>
                    IDENTIFIED FINDINGS & FLAGS ({issues.length})
                  </Text>
                  {issues.length === 0 ? (
                    <Text style={styles.noIssuesText}>No negative findings or flags recorded for this engagement.</Text>
                  ) : (
                    issues.map((item) => (
                      <View key={item.id} style={styles.issueItem}>
                        <View style={styles.issueHeader}>
                          <View style={styles.issueIdPill}>
                            <Text style={styles.issueIdText}>{item.id}</Text>
                          </View>
                          <View
                            style={[
                              styles.issueStatusPill,
                              item.status === 'fail' ? { backgroundColor: colors.failBg } : { backgroundColor: colors.flagBg },
                            ]}
                          >
                            <Text
                              style={[
                                styles.issueStatusText,
                                item.status === 'fail' ? { color: colors.fail } : { color: colors.flag },
                              ]}
                            >
                              {item.status.toUpperCase()}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.issueTitle}>{item.title}</Text>
                        <Text style={styles.issueReq}>{item.requirement}</Text>
                        {item.notes ? (
                          <View style={styles.issueObservationBox}>
                            <Text style={styles.obsLabel}>AUDITOR OBSERVATION:</Text>
                            <Text style={styles.obsText}>{item.notes}</Text>
                          </View>
                        ) : null}
                      </View>
                    ))
                  )}
                </View>

                {/* Evidence Chain of Custody */}
                <View style={styles.evidenceBlock}>
                  <Text style={styles.sectionTitle}>FORENSIC EVIDENCE REGISTRY</Text>
                  {allEvidence.length === 0 ? (
                    <Text style={styles.noIssuesText}>No photographic evidence attached yet.</Text>
                  ) : (
                    allEvidence.map((evd) => (
                      <View key={evd.id} style={styles.evdItemRow}>
                        <Ionicons name="camera" size={14} color={colors.accent} style={{ marginRight: 6 }} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.evdCaption}>{evd.caption} ({evd.controlId})</Text>
                          <Text style={styles.evdHash} numberOfLines={1}>{evd.sha256Hash}</Text>
                          <Text style={styles.evdMeta}>
                            GPS: {evd.gps?.latitude?.toFixed(4)}, {evd.gps?.longitude?.toFixed(4)} • {evd.timestamp}
                          </Text>
                        </View>
                      </View>
                    ))
                  )}
                </View>
              </View>
            ) : (
              <View style={styles.jsonContainer}>
                <View style={styles.jsonActionsRow}>
                  <Text style={styles.jsonTitle}>Full Serialized Working Paper Payload</Text>
                  <TouchableOpacity style={styles.copyJsonBtn} onPress={handleCopyJSON}>
                    <Ionicons name="copy-outline" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                    <Text style={styles.copyJsonBtnText}>{copiedStatus ? 'Copied!' : 'Copy JSON'}</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.jsonText}>{auditJsonString}</Text>
              </View>
            )}
          </ScrollView>

          {/* Action Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.closeActionBtn} onPress={onClose}>
              <Text style={styles.closeActionBtnText}>Close</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.syncEnterpriseBtn, (!isOnline || isSyncing) && styles.syncBtnDisabled]}
              onPress={handleSync}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="cloud-upload" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.syncEnterpriseBtnText}>
                    {audit.isSynced ? 'Re-Sync with Enterprise Server' : 'Sync with Enterprise Server'}
                  </Text>
                </>
              )}
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
    maxWidth: 640,
    maxHeight: '92%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    backgroundColor: '#F8FAFC',
  },
  headerPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  codePill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  codePillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  syncedPill: {
    backgroundColor: colors.syncedBg,
  },
  pendingPill: {
    backgroundColor: colors.flagBg,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  syncedPillText: {
    color: colors.synced,
  },
  pendingPillText: {
    color: colors.flag,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  viewModeRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    backgroundColor: '#FFFFFF',
  },
  viewModeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  viewModeBtnActive: {
    borderBottomColor: colors.primary,
    backgroundColor: '#F8FAFC',
  },
  viewModeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  viewModeTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  body: {
    padding: 16,
  },
  scorecardCard: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  scoreGauge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  scoreNumber: {
    color: '#38BDF8',
    fontSize: 22,
    fontWeight: '900',
  },
  scoreLabel: {
    color: '#94A3B8',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  statsCol: {
    flex: 1,
    gap: 4,
  },
  statLine: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  boldVal: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  infoBlock: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    padding: 12,
  },
  infoGrid: {
    gap: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoKey: {
    fontSize: 12,
    color: colors.textMuted,
  },
  infoVal: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  issuesBlock: {
    marginBottom: 16,
  },
  noIssuesText: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  issueItem: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  issueIdPill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  issueIdText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  issueStatusPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  issueStatusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  issueTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  issueReq: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  issueObservationBox: {
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 3,
    borderLeftColor: colors.fail,
    padding: 8,
    borderRadius: 4,
  },
  obsLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.fail,
    marginBottom: 2,
  },
  obsText: {
    fontSize: 11,
    color: colors.textPrimary,
  },
  evidenceBlock: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    padding: 12,
  },
  evdItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  evdCaption: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  evdHash: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: colors.accent,
    marginTop: 1,
  },
  evdMeta: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 1,
  },
  jsonContainer: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  jsonActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  jsonTitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },
  copyJsonBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  copyJsonBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  jsonText: {
    color: '#38BDF8',
    fontFamily: 'monospace',
    fontSize: 10,
    lineHeight: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    backgroundColor: '#F8FAFC',
  },
  closeActionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  closeActionBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  syncEnterpriseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 6,
  },
  syncBtnDisabled: {
    opacity: 0.6,
  },
  syncEnterpriseBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
