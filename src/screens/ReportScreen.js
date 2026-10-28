import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudit } from '../context/AuditContext';
import { colors } from '../theme/colors';
import { WorkingPaperModal } from '../components/WorkingPaperModal';

export const ReportScreen = () => {
  const { activeAudit, calculateAuditMetrics, syncAudit, isSyncing, isOnline, currentAuditor } = useAudit();
  const [isWorkingPaperOpen, setIsWorkingPaperOpen] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState('');

  if (!activeAudit) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No audit engagement selected.</Text>
      </View>
    );
  }

  const metrics = calculateAuditMetrics(activeAudit);
  const issues = (activeAudit.controls || []).filter((c) => c.status === 'fail' || c.status === 'flag');
  const allEvidence = (activeAudit.controls || []).flatMap((c) => c.evidence || []);
  const allSignatures = (activeAudit.controls || []).flatMap((c) => c.signatures || []);

  const handleSyncNow = async () => {
    try {
      setSyncSuccessMsg('');
      const res = await syncAudit(activeAudit.id);
      setSyncSuccessMsg(`Engagement successfully synchronized at ${res.timestamp.slice(11, 19)} UTC`);
    } catch (e) {
      Alert.alert('Offline Mode Active', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Sync Status Banner */}
        <View
          style={[
            styles.syncBanner,
            activeAudit.isSynced ? styles.syncBannerSynced : styles.syncBannerPending,
          ]}
        >
          <View style={styles.syncBannerLeft}>
            <Ionicons
              name={activeAudit.isSynced ? 'cloud-done' : 'cloud-offline'}
              size={20}
              color={activeAudit.isSynced ? colors.synced : colors.flag}
              style={{ marginRight: 8 }}
            />
            <View>
              <Text
                style={[
                  styles.syncBannerTitle,
                  activeAudit.isSynced ? { color: colors.synced } : { color: colors.flag },
                ]}
              >
                {activeAudit.isSynced
                  ? 'Enterprise Cloud Synced'
                  : 'Pending Remote Sync (Local Storage Protected)'}
              </Text>
              <Text style={styles.syncBannerSub}>
                {activeAudit.isSynced
                  ? 'Tamper-proof working papers committed to central repository'
                  : 'Cached locally in SQLite/AsyncStorage offline store'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.syncActionBtn, isSyncing && { opacity: 0.6 }]}
            onPress={handleSyncNow}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="refresh" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={styles.syncActionText}>
                  {activeAudit.isSynced ? 'Re-Sync' : 'Sync Now'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {syncSuccessMsg ? (
          <View style={styles.successToast}>
            <Ionicons name="checkmark-circle" size={16} color={colors.pass} style={{ marginRight: 6 }} />
            <Text style={styles.successToastText}>{syncSuccessMsg}</Text>
          </View>
        ) : null}

        {/* Executive Engagement Header Card */}
        <View style={styles.engagementCard}>
          <View style={styles.cardTopRow}>
            <View style={styles.codePill}>
              <Text style={styles.codePillText}>{activeAudit.code || activeAudit.id}</Text>
            </View>
            <View style={styles.riskBadge}>
              <Text style={styles.riskBadgeText}>{activeAudit.riskLevel} Risk Engagement</Text>
            </View>
          </View>

          <Text style={styles.engagementTitle}>{activeAudit.title}</Text>
          <Text style={styles.engagementClient}>{activeAudit.client}</Text>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailKey}>Lead Auditor</Text>
              <Text style={styles.detailVal}>{currentAuditor.name} ({currentAuditor.id})</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailKey}>Location</Text>
              <Text style={styles.detailVal}>{activeAudit.location}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailKey}>Engagement Framework</Text>
              <Text style={styles.detailVal}>{activeAudit.engagementType}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailKey}>Last Field Update</Text>
              <Text style={styles.detailVal}>{activeAudit.lastModified ? activeAudit.lastModified.slice(0, 16).replace('T', ' ') : 'Today'}</Text>
            </View>
          </View>
        </View>

        {/* Compliance Findings Breakdown Scorecard */}
        <View style={styles.complianceSection}>
          <Text style={styles.sectionHeader}>COMPLIANCE FINDINGS BREAKDOWN</Text>

          <View style={styles.scorecardRow}>
            <View style={styles.gaugeBox}>
              <Text style={styles.gaugePercent}>{metrics.passRate}%</Text>
              <Text style={styles.gaugeLabel}>COMPLIANCE</Text>
              <Text style={styles.gaugeSub}>Rate</Text>
            </View>

            <View style={styles.metricsCol}>
              <View style={[styles.metricBarItem, { borderLeftColor: colors.pass }]}>
                <View style={styles.metricBarContent}>
                  <Text style={styles.metricBarLabel}>Passed Controls</Text>
                  <Text style={[styles.metricBarVal, { color: colors.pass }]}>{metrics.pass}</Text>
                </View>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${metrics.total > 0 ? (metrics.pass / metrics.total) * 100 : 0}%`,
                        backgroundColor: colors.pass,
                      },
                    ]}
                  />
                </View>
              </View>

              <View style={[styles.metricBarItem, { borderLeftColor: colors.fail }]}>
                <View style={styles.metricBarContent}>
                  <Text style={styles.metricBarLabel}>Failed / Non-Compliant</Text>
                  <Text style={[styles.metricBarVal, { color: colors.fail }]}>{metrics.fail}</Text>
                </View>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${metrics.total > 0 ? (metrics.fail / metrics.total) * 100 : 0}%`,
                        backgroundColor: colors.fail,
                      },
                    ]}
                  />
                </View>
              </View>

              <View style={[styles.metricBarItem, { borderLeftColor: colors.flag }]}>
                <View style={styles.metricBarContent}>
                  <Text style={styles.metricBarLabel}>Flagged Observations</Text>
                  <Text style={[styles.metricBarVal, { color: colors.flag }]}>{metrics.flag}</Text>
                </View>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${metrics.total > 0 ? (metrics.flag / metrics.total) * 100 : 0}%`,
                        backgroundColor: colors.flag,
                      },
                    ]}
                  />
                </View>
              </View>

              <View style={[styles.metricBarItem, { borderLeftColor: colors.untested }]}>
                <View style={styles.metricBarContent}>
                  <Text style={styles.metricBarLabel}>Untested Controls</Text>
                  <Text style={[styles.metricBarVal, { color: colors.untested }]}>{metrics.untested}</Text>
                </View>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${metrics.total > 0 ? (metrics.untested / metrics.total) * 100 : 0}%`,
                        backgroundColor: colors.untested,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Evidence & Custody Stats */}
        <View style={styles.evidenceStatsRow}>
          <View style={styles.statBox}>
            <Ionicons name="camera" size={18} color={colors.accent} />
            <Text style={styles.statBoxVal}>{allEvidence.length}</Text>
            <Text style={styles.statBoxLabel}>Geotagged Photos</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="finger-print" size={18} color={colors.primaryLight} />
            <Text style={styles.statBoxVal}>{allEvidence.length}</Text>
            <Text style={styles.statBoxLabel}>SHA-256 Hashes</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="shield-checkmark" size={18} color={colors.pass} />
            <Text style={styles.statBoxVal}>{allSignatures.length}</Text>
            <Text style={styles.statBoxLabel}>Manager Sign-Offs</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.reportActionsSection}>
          <TouchableOpacity
            style={styles.exportReportBtn}
            onPress={() => setIsWorkingPaperOpen(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="document-text" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.exportReportBtnText}>
              Export Audit Summary (JSON & Working Paper)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Significant Findings List */}
        <View style={styles.findingsSection}>
          <Text style={styles.sectionHeader}>SIGNIFICANT FINDINGS & DEFICIENCIES</Text>
          {issues.length === 0 ? (
            <View style={styles.noFindingsBox}>
              <Ionicons name="checkmark-circle-outline" size={32} color={colors.pass} />
              <Text style={styles.noFindingsText}>Zero non-compliant deficiencies recorded</Text>
              <Text style={styles.noFindingsSub}>All verified controls meet benchmark standards.</Text>
            </View>
          ) : (
            issues.map((issue) => (
              <View key={issue.id} style={styles.findingCard}>
                <View style={styles.findingHeader}>
                  <View style={styles.codePill}>
                    <Text style={styles.codePillText}>{issue.id}</Text>
                  </View>
                  <View
                    style={[
                      styles.findingPill,
                      issue.status === 'fail' ? { backgroundColor: colors.failBg } : { backgroundColor: colors.flagBg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.findingPillText,
                        issue.status === 'fail' ? { color: colors.fail } : { color: colors.flag },
                      ]}
                    >
                      {issue.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text style={styles.findingTitle}>{issue.title}</Text>
                <Text style={styles.findingReq}>{issue.requirement}</Text>
                {issue.notes ? (
                  <View style={styles.findingNotesBox}>
                    <Text style={styles.findingNotesLabel}>OBSERVATION & IMPACT:</Text>
                    <Text style={styles.findingNotesText}>{issue.notes}</Text>
                  </View>
                ) : null}
              </View>
            ))
          )}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Working Paper Report Modal */}
      <WorkingPaperModal
        visible={isWorkingPaperOpen}
        onClose={() => setIsWorkingPaperOpen(false)}
        audit={activeAudit}
      />
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
  syncBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 14,
  },
  syncBannerSynced: {
    backgroundColor: colors.syncedBg,
    borderColor: '#BFDBFE',
  },
  syncBannerPending: {
    backgroundColor: colors.flagBg,
    borderColor: colors.flagBorder,
  },
  syncBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  syncBannerTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  syncBannerSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },
  syncActionBtn: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  syncActionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  successToast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    padding: 10,
    borderRadius: 6,
    marginBottom: 14,
  },
  successToastText: {
    fontSize: 11,
    color: colors.pass,
    fontWeight: '700',
  },
  engagementCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    marginBottom: 16,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
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
  riskBadge: {
    backgroundColor: colors.riskHighBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  riskBadgeText: {
    color: colors.riskHigh,
    fontSize: 10,
    fontWeight: '700',
  },
  engagementTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  engagementClient: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  detailsGrid: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    gap: 6,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailKey: {
    fontSize: 11,
    color: colors.textMuted,
  },
  detailVal: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  complianceSection: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  scorecardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gaugeBox: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  gaugePercent: {
    color: '#38BDF8',
    fontSize: 22,
    fontWeight: '900',
  },
  gaugeLabel: {
    color: '#94A3B8',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  gaugeSub: {
    color: '#CBD5E1',
    fontSize: 9,
  },
  metricsCol: {
    flex: 1,
    gap: 8,
  },
  metricBarItem: {
    borderLeftWidth: 3,
    paddingLeft: 8,
  },
  metricBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  metricBarLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  metricBarVal: {
    fontSize: 11,
    fontWeight: '800',
  },
  barTrack: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
  evidenceStatsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 12,
    alignItems: 'center',
  },
  statBoxVal: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 4,
  },
  statBoxLabel: {
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  reportActionsSection: {
    marginBottom: 16,
  },
  exportReportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exportReportBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  findingsSection: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
  },
  noFindingsBox: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noFindingsText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 6,
  },
  noFindingsSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  findingCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 10,
    marginBottom: 10,
  },
  findingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  findingPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  findingPillText: {
    fontSize: 9,
    fontWeight: '800',
  },
  findingTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  findingReq: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  findingNotesBox: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 3,
    borderLeftColor: colors.fail,
    padding: 6,
    borderRadius: 4,
  },
  findingNotesLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.fail,
    marginBottom: 1,
  },
  findingNotesText: {
    fontSize: 10,
    color: colors.textPrimary,
  },
});
