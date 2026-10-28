import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudit } from '../context/AuditContext';
import { colors } from '../theme/colors';
import { ControlItem } from '../components/ControlItem';
import { EvidenceModal } from '../components/EvidenceModal';
import { WorkingPaperModal } from '../components/WorkingPaperModal';
import { AUDIT_DOMAINS } from '../data/mockAudits';

export const ChecklistScreen = ({ onBack, onOpenReport }) => {
  const { activeAudit, calculateAuditMetrics } = useAudit();
  const [selectedDomain, setSelectedDomain] = useState('All Domains');
  const [activeEvidenceControl, setActiveEvidenceControl] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  if (!activeAudit) {
    return (
      <View style={styles.container}>
        <Text>No engagement selected.</Text>
      </View>
    );
  }

  const metrics = calculateAuditMetrics(activeAudit);

  // Filter controls by domain
  const filteredControls = (activeAudit.controls || []).filter((control) => {
    if (selectedDomain === 'All Domains') return true;
    return control.domain === selectedDomain;
  });

  return (
    <View style={styles.container}>
      {/* Engagement Overview Strip */}
      <View style={styles.engagementStrip}>
        <View style={styles.stripTopRow}>
          <View style={styles.stripTitleGroup}>
            <View style={styles.codePill}>
              <Text style={styles.codePillText}>{activeAudit.code || activeAudit.id}</Text>
            </View>
            <Text style={styles.engagementTitle} numberOfLines={1}>
              {activeAudit.title}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.workingPaperBtn}
            onPress={() => setIsReportModalOpen(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="document-text" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={styles.workingPaperBtnText}>Working Paper</Text>
          </TouchableOpacity>
        </View>

        {/* Progress & Compliance Bar */}
        <View style={styles.progressRow}>
          <View style={styles.progressTextGroup}>
            <Text style={styles.progressPercentText}>
              {metrics.completedPercent}% Complete
            </Text>
            <Text style={styles.progressDetailText}>
              ({metrics.total - metrics.untested} of {metrics.total} Tested)
            </Text>
          </View>

          <View style={styles.miniCounters}>
            <Text style={[styles.counterText, { color: colors.pass }]}>✓ {metrics.pass}</Text>
            <Text style={[styles.counterText, { color: colors.fail }]}>✕ {metrics.fail}</Text>
            <Text style={[styles.counterText, { color: colors.flag }]}>▲ {metrics.flag}</Text>
            <Text style={[styles.counterText, { color: colors.untested }]}>● {metrics.untested}</Text>
          </View>
        </View>

        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${metrics.completedPercent}%`, backgroundColor: colors.accent },
            ]}
          />
        </View>
      </View>

      {/* Domain / Category Filter Bar */}
      <View style={styles.domainFilterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.domainScroll}>
          {AUDIT_DOMAINS.map((domain) => {
            const count =
              domain === 'All Domains'
                ? (activeAudit.controls || []).length
                : (activeAudit.controls || []).filter((c) => c.domain === domain).length;

            return (
              <TouchableOpacity
                key={domain}
                style={[
                  styles.domainTab,
                  selectedDomain === domain && styles.domainTabActive,
                ]}
                onPress={() => setSelectedDomain(domain)}
              >
                <Text
                  style={[
                    styles.domainTabText,
                    selectedDomain === domain && styles.domainTabTextActive,
                  ]}
                >
                  {domain}
                </Text>
                <View
                  style={[
                    styles.domainCountBadge,
                    selectedDomain === domain && styles.domainCountBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.domainCountText,
                      selectedDomain === domain && styles.domainCountTextActive,
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Controls Inspection List */}
      <ScrollView style={styles.controlsScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.listHeaderRow}>
          <Text style={styles.listHeaderTitle}>
            FIELD CONTROL PROCEDURES ({filteredControls.length})
          </Text>
          <Text style={styles.listHeaderSubtitle}>
            Enforce audit evidence per standard
          </Text>
        </View>

        {filteredControls.map((control) => (
          <ControlItem
            key={control.id}
            control={control}
            auditId={activeAudit.id}
            onOpenEvidenceModal={(ctrl) => setActiveEvidenceControl(ctrl)}
          />
        ))}

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Evidence Capture Modal */}
      {activeEvidenceControl && (
        <EvidenceModal
          visible={Boolean(activeEvidenceControl)}
          onClose={() => setActiveEvidenceControl(null)}
          control={activeEvidenceControl}
          auditId={activeAudit.id}
        />
      )}

      {/* Working Paper Modal */}
      <WorkingPaperModal
        visible={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
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
  engagementStrip: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  stripTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stripTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
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
  engagementTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  workingPaperBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  workingPaperBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressTextGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressPercentText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  progressDetailText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  miniCounters: {
    flexDirection: 'row',
    gap: 8,
  },
  counterText: {
    fontSize: 11,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  domainFilterContainer: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  domainScroll: {
    flexDirection: 'row',
  },
  domainTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  domainTabActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryLight,
  },
  domainTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginRight: 6,
  },
  domainTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  domainCountBadge: {
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  domainCountBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  domainCountText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  domainCountTextActive: {
    color: '#FFFFFF',
  },
  controlsScroll: {
    padding: 16,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  listHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  listHeaderSubtitle: {
    fontSize: 10,
    color: colors.textMuted,
  },
});
