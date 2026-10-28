import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useAudit } from '../context/AuditContext';

export const Header = ({ title, subtitle, onBack, onNewAudit }) => {
  const { currentAuditor, resetToMockData } = useAudit();

  const handleReset = () => {
    if (typeof window !== 'undefined' && window.confirm) {
      if (window.confirm('Reset all audit engagements to KPMG/PwC template seed data?')) {
        resetToMockData();
      }
    } else {
      Alert.alert(
        'Reset Workspace',
        'Reset all engagements to initial mock template data?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Reset', style: 'destructive', onPress: resetToMockData }
        ]
      );
    }
  };

  return (
    <View style={styles.header}>
      {/* Top Corporate Status Bar */}
      <View style={styles.topRow}>
        <View style={styles.brandContainer}>
          <View style={styles.shieldIcon}>
            <Ionicons name="shield-checkmark" size={16} color="#38BDF8" />
          </View>
          <Text style={styles.brandTitle}>AUDIT<Text style={styles.brandTitleAccent}>TRACE</Text></Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>ENTERPRISE</Text>
          </View>
        </View>

        <View style={styles.auditorBadge}>
          <Ionicons name="person-circle-outline" size={14} color="#94A3B8" style={{ marginRight: 4 }} />
          <Text style={styles.auditorId}>{currentAuditor.id}</Text>
          <TouchableOpacity onPress={handleReset} style={styles.resetBtn} title="Reset Data">
            <Ionicons name="refresh-outline" size={14} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Screen Title / Context Bar */}
      <View style={styles.bottomRow}>
        <View style={styles.titleArea}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          <View>
            <Text style={styles.screenTitle}>{title}</Text>
            {subtitle ? <Text style={styles.screenSubtitle}>{subtitle}</Text> : null}
          </View>
        </View>

        {onNewAudit && (
          <TouchableOpacity style={styles.newAuditBtn} onPress={onNewAudit} activeOpacity={0.8}>
            <Ionicons name="add" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={styles.newAuditBtnText}>New Audit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primaryDark,
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shieldIcon: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  brandTitleAccent: {
    color: '#38BDF8',
  },
  versionBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    marginLeft: 8,
  },
  versionText: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  auditorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  auditorId: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '600',
    marginRight: 6,
  },
  resetBtn: {
    padding: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  titleArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  screenTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  screenSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  newAuditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  newAuditBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
