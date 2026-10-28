import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuditProvider, useAudit } from './src/context/AuditContext';
import { colors } from './src/theme/colors';
import { Header } from './src/components/Header';
import { OfflineBanner } from './src/components/OfflineBanner';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { ChecklistScreen } from './src/screens/ChecklistScreen';
import { EvidenceVaultScreen } from './src/screens/EvidenceVaultScreen';
import { ReportScreen } from './src/screens/ReportScreen';
import { CreateAuditModal } from './src/components/CreateAuditModal';

const MainNavigator = () => {
  const { activeAudit, setActiveAuditId } = useAudit();
  const [currentTab, setCurrentTab] = useState('dashboard'); // 'dashboard' | 'checklist' | 'evidence' | 'report'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Screen titles and subtitles
  const getHeaderInfo = () => {
    switch (currentTab) {
      case 'checklist':
        return {
          title: activeAudit ? `${activeAudit.code} Inspection Checklist` : 'Checklist',
          subtitle: activeAudit?.client || 'Select controls to verify',
          onBack: () => setCurrentTab('dashboard'),
        };
      case 'evidence':
        return {
          title: 'Evidence Vault & Chain-of-Custody',
          subtitle: activeAudit ? `${activeAudit.code} • ${activeAudit.client}` : 'Forensic logs',
          onBack: () => setCurrentTab('dashboard'),
        };
      case 'report':
        return {
          title: 'Audit Working Paper & Summary',
          subtitle: activeAudit ? `${activeAudit.code} • ${activeAudit.client}` : 'Compliance scorecard',
          onBack: () => setCurrentTab('dashboard'),
        };
      case 'dashboard':
      default:
        return {
          title: 'Engagement Dashboard',
          subtitle: 'Enterprise Field Audit & Evidence Logger',
          onNewAudit: () => setIsCreateModalOpen(true),
        };
    }
  };

  const headerInfo = getHeaderInfo();

  const handleSelectAuditFromDashboard = (auditId) => {
    setActiveAuditId(auditId);
    setCurrentTab('checklist');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* Corporate Header */}
      <Header
        title={headerInfo.title}
        subtitle={headerInfo.subtitle}
        onBack={headerInfo.onBack}
        onNewAudit={headerInfo.onNewAudit}
      />

      {/* Offline-First Resilience Banner */}
      <OfflineBanner />

      {/* Main Screen Content */}
      <View style={styles.contentContainer}>
        {currentTab === 'dashboard' && (
          <DashboardScreen onSelectAudit={handleSelectAuditFromDashboard} />
        )}
        {currentTab === 'checklist' && (
          <ChecklistScreen
            onBack={() => setCurrentTab('dashboard')}
            onOpenReport={() => setCurrentTab('report')}
          />
        )}
        {currentTab === 'evidence' && <EvidenceVaultScreen />}
        {currentTab === 'report' && <ReportScreen />}
      </View>

      {/* Modern Corporate Bottom Tab Bar */}
      <View style={styles.tabBar}>
        {/* Tab 1: Dashboard */}
        <TouchableOpacity
          style={[styles.tabItem, currentTab === 'dashboard' && styles.tabItemActive]}
          onPress={() => setCurrentTab('dashboard')}
          activeOpacity={0.8}
        >
          <Ionicons
            name={currentTab === 'dashboard' ? 'grid' : 'grid-outline'}
            size={20}
            color={currentTab === 'dashboard' ? colors.primary : colors.textMuted}
          />
          <Text
            style={[
              styles.tabLabel,
              currentTab === 'dashboard' && styles.tabLabelActive,
            ]}
          >
            Dashboard
          </Text>
        </TouchableOpacity>

        {/* Tab 2: Checklist */}
        <TouchableOpacity
          style={[styles.tabItem, currentTab === 'checklist' && styles.tabItemActive]}
          onPress={() => setCurrentTab('checklist')}
          activeOpacity={0.8}
        >
          <Ionicons
            name={currentTab === 'checklist' ? 'checkbox' : 'checkbox-outline'}
            size={20}
            color={currentTab === 'checklist' ? colors.primary : colors.textMuted}
          />
          <Text
            style={[
              styles.tabLabel,
              currentTab === 'checklist' && styles.tabLabelActive,
            ]}
          >
            Checklist
          </Text>
        </TouchableOpacity>

        {/* Tab 3: Evidence */}
        <TouchableOpacity
          style={[styles.tabItem, currentTab === 'evidence' && styles.tabItemActive]}
          onPress={() => setCurrentTab('evidence')}
          activeOpacity={0.8}
        >
          <Ionicons
            name={currentTab === 'evidence' ? 'camera' : 'camera-outline'}
            size={20}
            color={currentTab === 'evidence' ? colors.primary : colors.textMuted}
          />
          <Text
            style={[
              styles.tabLabel,
              currentTab === 'evidence' && styles.tabLabelActive,
            ]}
          >
            Evidence
          </Text>
        </TouchableOpacity>

        {/* Tab 4: Working Paper / Report */}
        <TouchableOpacity
          style={[styles.tabItem, currentTab === 'report' && styles.tabItemActive]}
          onPress={() => setCurrentTab('report')}
          activeOpacity={0.8}
        >
          <Ionicons
            name={currentTab === 'report' ? 'document-text' : 'document-text-outline'}
            size={20}
            color={currentTab === 'report' ? colors.primary : colors.textMuted}
          />
          <Text
            style={[
              styles.tabLabel,
              currentTab === 'report' && styles.tabLabelActive,
            ]}
          >
            Summary
          </Text>
        </TouchableOpacity>
      </View>

      {/* Global New Audit Modal */}
      <CreateAuditModal
        visible={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={(newId) => {
          setIsCreateModalOpen(false);
          setActiveAuditId(newId);
          setCurrentTab('checklist');
        }}
      />
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <AuditProvider>
      <MainNavigator />
    </AuditProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primaryDark,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    borderRadius: 8,
  },
  tabItemActive: {
    backgroundColor: '#F1F5F9',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 2,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: '800',
  },
});
