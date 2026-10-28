import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudit } from '../context/AuditContext';
import { colors } from '../theme/colors';

export const OfflineBanner = () => {
  const { isOnline, isSyncing, stats, toggleOnlineStatus, syncAllPending } = useAudit();

  return (
    <View style={[styles.container, isOnline ? styles.onlineContainer : styles.offlineContainer]}>
      <View style={styles.leftRow}>
        <View style={[styles.statusDot, isOnline ? styles.onlineDot : styles.offlineDot]} />
        <View style={styles.textContainer}>
          <Text style={[styles.statusTitle, isOnline ? styles.onlineTitle : styles.offlineTitle]}>
            {isOnline ? 'ONLINE: Enterprise Cloud Connected' : 'OFFLINE MODE: Local Cache Active'}
          </Text>
          <Text style={styles.subtitle}>
            {stats.pendingSync > 0
              ? `${stats.pendingSync} engagement(s) pending cloud synchronization`
              : 'All field working papers synchronized'}
          </Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.toggleBtn}
          onPress={toggleOnlineStatus}
          activeOpacity={0.7}
        >
          <Text style={styles.toggleBtnText}>
            {isOnline ? 'Go Offline' : 'Go Online'}
          </Text>
        </TouchableOpacity>

        {isOnline && stats.pendingSync > 0 && (
          <TouchableOpacity
            style={styles.syncBtn}
            onPress={syncAllPending}
            disabled={isSyncing}
            activeOpacity={0.8}
          >
            {isSyncing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="cloud-upload-outline" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={styles.syncBtnText}>Sync All</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  onlineContainer: {
    backgroundColor: '#F0FDF4',
    borderBottomColor: '#BBF7D0',
  },
  offlineContainer: {
    backgroundColor: '#FFFBEB',
    borderBottomColor: '#FDE68A',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  onlineDot: {
    backgroundColor: colors.pass,
  },
  offlineDot: {
    backgroundColor: colors.flag,
  },
  textContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  onlineTitle: {
    color: '#166534',
  },
  offlineTitle: {
    color: '#92400E',
  },
  subtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    gap: 6,
  },
  toggleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  syncBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
