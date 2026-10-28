import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudit } from '../context/AuditContext';
import { colors } from '../theme/colors';
import { MetricCard } from '../components/MetricCard';
import { AuditCard } from '../components/AuditCard';
import { CreateAuditModal } from '../components/CreateAuditModal';
import { WorkingPaperModal } from '../components/WorkingPaperModal';

export const DashboardScreen = ({ onSelectAudit }) => {
  const { audits, stats } = useAudit();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All'); // 'All' | 'In Progress' | 'Draft' | 'In Review' | 'Synced'
  const [selectedRisk, setSelectedRisk] = useState('All');     // 'All' | 'High' | 'Medium' | 'Low'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedReportAudit, setSelectedReportAudit] = useState(null);

  const STATUS_TABS = ['All', 'In Progress', 'Draft', 'In Review', 'Synced'];
  const RISK_FILTERS = ['All', 'High', 'Medium', 'Low'];

  // Filter engagements
  const filteredAudits = audits.filter((audit) => {
    const matchesSearch =
      audit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === 'All' || audit.status === selectedStatus;

    const matchesRisk =
      selectedRisk === 'All' || audit.riskLevel === selectedRisk;

    return matchesSearch && matchesStatus && matchesRisk;
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Metric Cards Grid */}
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Total Audits"
            value={stats.total}
            icon="folder-open-outline"
            accentColor={colors.accent}
            subtext="Assigned Engagements"
          />
          <MetricCard
            title="In Progress"
            value={stats.inProgress}
            icon="construct-outline"
            accentColor={colors.primaryLight}
            subtext="Active Field Reviews"
          />
          <MetricCard
            title="Pending Sync"
            value={stats.pendingSync}
            icon="cloud-offline-outline"
            accentColor={colors.flag}
            subtext="Local Offline Queue"
          />
          <MetricCard
            title="Completed"
            value={stats.completed}
            icon="checkmark-done-circle-outline"
            accentColor={colors.pass}
            subtext="Enterprise Attested"
          />
        </View>

        {/* Search & Filter Header */}
        <View style={styles.filterSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={16} color={colors.textMuted} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by engagement, client, or ID..."
              placeholderTextColor="#94A3B8"
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Status Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusTabsScroll}>
            {STATUS_TABS.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.statusTab,
                  selectedStatus === tab && styles.statusTabActive,
                ]}
                onPress={() => setSelectedStatus(tab)}
              >
                <Text
                  style={[
                    styles.statusTabText,
                    selectedStatus === tab && styles.statusTabTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Risk Filter Chips */}
          <View style={styles.riskRow}>
            <Text style={styles.filterLabel}>Risk Level:</Text>
            {RISK_FILTERS.map((risk) => (
              <TouchableOpacity
                key={risk}
                style={[
                  styles.riskChip,
                  selectedRisk === risk && styles.riskChipActive,
                ]}
                onPress={() => setSelectedRisk(risk)}
              >
                <Text
                  style={[
                    styles.riskChipText,
                    selectedRisk === risk && styles.riskChipTextActive,
                  ]}
                >
                  {risk}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Engagements List */}
        <View style={styles.listHeaderRow}>
          <Text style={styles.listTitle}>
            ENGAGEMENTS ({filteredAudits.length})
          </Text>
          <Text style={styles.listSubtitle}>
            Tap any card to open checklist & controls
          </Text>
        </View>

        {filteredAudits.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={40} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No matching audit engagements</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your search criteria or create a new inspection.</Text>
          </View>
        ) : (
          filteredAudits.map((audit) => (
            <AuditCard
              key={audit.id}
              audit={audit}
              onSelect={onSelectAudit}
              onOpenReport={(a) => setSelectedReportAudit(a)}
            />
          ))
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsCreateModalOpen(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
        <Text style={styles.fabText}>New Inspection</Text>
      </TouchableOpacity>

      {/* Modals */}
      <CreateAuditModal
        visible={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={(newId) => {
          setIsCreateModalOpen(false);
          onSelectAudit(newId);
        }}
      />

      <WorkingPaperModal
        visible={Boolean(selectedReportAudit)}
        onClose={() => setSelectedReportAudit(null)}
        audit={selectedReportAudit}
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  filterSection: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 12,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
  },
  statusTabsScroll: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  statusTab: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    marginRight: 6,
  },
  statusTabActive: {
    backgroundColor: colors.primaryLight,
  },
  statusTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  statusTabTextActive: {
    color: '#FFFFFF',
  },
  riskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 6,
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    marginRight: 4,
  },
  riskChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: '#FFFFFF',
  },
  riskChipActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentLight,
  },
  riskChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  riskChipTextActive: {
    color: colors.accent,
    fontWeight: '700',
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  listTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.6,
  },
  listSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    gap: 6,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
