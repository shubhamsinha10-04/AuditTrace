import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useAudit } from '../context/AuditContext';

export const AuditCard = ({ audit, onSelect, onOpenReport }) => {
  const { calculateAuditMetrics } = useAudit();
  const metrics = calculateAuditMetrics(audit);

  // Status Styling
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Synced':
        return { bg: colors.syncedBg, text: colors.synced, border: '#BFDBFE' };
      case 'In Progress':
        return { bg: colors.passBg, text: colors.pass, border: colors.passBorder };
      case 'In Review':
        return { bg: colors.flagBg, text: colors.flag, border: colors.flagBorder };
      case 'Draft':
      default:
        return { bg: colors.untestedBg, text: colors.untested, border: colors.untestedBorder };
    }
  };

  // Risk Styling
  const getRiskStyle = (risk) => {
    switch (risk) {
      case 'High':
        return { bg: colors.riskHighBg, text: colors.riskHigh };
      case 'Medium':
        return { bg: colors.riskMediumBg, text: colors.riskMedium };
      case 'Low':
      default:
        return { bg: colors.riskLowBg, text: colors.riskLow };
    }
  };

  const statusStyle = getStatusStyle(audit.status);
  const riskStyle = getRiskStyle(audit.riskLevel);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onSelect(audit.id)}
      activeOpacity={0.85}
    >
      {/* Top Header: Code, Risk, Status */}
      <View style={styles.headerRow}>
        <View style={styles.codeGroup}>
          <Text style={styles.codeText}>{audit.code || audit.id}</Text>
          <View style={[styles.riskBadge, { backgroundColor: riskStyle.bg }]}>
            <Text style={[styles.riskText, { color: riskStyle.text }]}>{audit.riskLevel} Risk</Text>
          </View>
        </View>

        <View style={styles.statusGroup}>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg, borderColor: statusStyle.border }]}>
            <View style={[styles.statusDot, { backgroundColor: statusStyle.text }]} />
            <Text style={[styles.statusText, { color: statusStyle.text }]}>{audit.status}</Text>
          </View>
          {!audit.isSynced && (
            <View style={styles.unsyncedPill} title="Pending Server Sync">
              <Ionicons name="cloud-offline" size={12} color={colors.flag} />
            </View>
          )}
        </View>
      </View>

      {/* Engagement Title & Client */}
      <Text style={styles.title} numberOfLines={2}>{audit.title}</Text>
      <View style={styles.clientRow}>
        <Ionicons name="business-outline" size={13} color={colors.textSecondary} style={{ marginRight: 4 }} />
        <Text style={styles.clientText} numberOfLines={1}>{audit.client}</Text>
      </View>

      {/* Location & Due Date */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="location-outline" size={13} color={colors.textMuted} style={{ marginRight: 4 }} />
          <Text style={styles.metaText} numberOfLines={1}>{audit.location}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={13} color={colors.textMuted} style={{ marginRight: 4 }} />
          <Text style={styles.metaText}>Due: {audit.dueDate}</Text>
        </View>
      </View>

      {/* Progress Bar & Compliance Stats */}
      <View style={styles.progressSection}>
        <View style={styles.progressLabelRow}>
          <Text style={styles.progressLabel}>
            Completion: <Text style={styles.boldText}>{metrics.completedPercent}%</Text> ({metrics.total - metrics.untested}/{metrics.total} controls)
          </Text>
          <Text style={styles.passRateLabel}>
            Pass Rate: <Text style={{ color: colors.pass, fontWeight: '700' }}>{metrics.passRate}%</Text>
          </Text>
        </View>

        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${metrics.completedPercent}%`, backgroundColor: colors.accent }
            ]}
          />
        </View>
      </View>

      {/* Bottom Summary Tags & Action */}
      <View style={styles.footerRow}>
        <View style={styles.findingsPills}>
          <View style={[styles.miniPill, { backgroundColor: colors.passBg }]}>
            <Text style={[styles.miniPillText, { color: colors.pass }]}>✓ {metrics.pass} Pass</Text>
          </View>
          {metrics.fail > 0 && (
            <View style={[styles.miniPill, { backgroundColor: colors.failBg }]}>
              <Text style={[styles.miniPillText, { color: colors.fail }]}>✕ {metrics.fail} Fail</Text>
            </View>
          )}
          {metrics.flag > 0 && (
            <View style={[styles.miniPill, { backgroundColor: colors.flagBg }]}>
              <Text style={[styles.miniPillText, { color: colors.flag }]}>▲ {metrics.flag} Flag</Text>
            </View>
          )}
        </View>

        <View style={styles.actionLinks}>
          <TouchableOpacity
            style={styles.inspectBtn}
            onPress={() => onSelect(audit.id)}
          >
            <Text style={styles.inspectBtnText}>Inspect</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.accent} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  codeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  codeText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryLight,
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  riskBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  riskText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statusGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  unsyncedPill: {
    padding: 3,
    backgroundColor: colors.flagBg,
    borderRadius: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 20,
    marginBottom: 4,
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  clientText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metaText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  progressSection: {
    marginBottom: 10,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  boldText: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  passRateLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  findingsPills: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  miniPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  miniPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  actionLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inspectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  inspectBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
    marginRight: 2,
  },
});
