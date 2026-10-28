import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  PanResponder,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export const SignaturePad = ({ onSave, onCancel, defaultSignerName = '', defaultRole = '' }) => {
  const [signerName, setSignerName] = useState(defaultSignerName);
  const [signerRole, setSignerRole] = useState(defaultRole || 'Field Facility Manager');
  const [confirmedDeclaration, setConfirmedDeclaration] = useState(true);
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState('');
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 320, height: 160 });

  const currentPathRef = useRef('');

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const newPath = `M${locationX.toFixed(1)},${locationY.toFixed(1)}`;
        currentPathRef.current = newPath;
        setCurrentPath(newPath);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const updated = `${currentPathRef.current} L${locationX.toFixed(1)},${locationY.toFixed(1)}`;
        currentPathRef.current = updated;
        setCurrentPath(updated);
      },
      onPanResponderRelease: () => {
        if (currentPathRef.current) {
          setPaths((prev) => [...prev, currentPathRef.current]);
          currentPathRef.current = '';
          setCurrentPath('');
        }
      },
    })
  ).current;

  const handleClear = () => {
    setPaths([]);
    setCurrentPath('');
    currentPathRef.current = '';
  };

  const handleUndo = () => {
    setPaths((prev) => prev.slice(0, -1));
  };

  const handleSave = () => {
    if (!signerName.trim()) {
      alert('Please enter the signer\'s full name.');
      return;
    }
    if (paths.length === 0) {
      alert('Please provide a signature on the pad.');
      return;
    }

    onSave({
      signerName: signerName.trim(),
      signerRole: signerRole.trim(),
      signatureDataUrl: 'svg_vector_signed',
      strokesCount: paths.length,
      signedAt: new Date().toISOString(),
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="create-outline" size={18} color={colors.accent} style={{ marginRight: 6 }} />
          <Text style={styles.headerTitle}>Digital Sign-Off Affirmation</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          On-site asset manager / escort attestation for control verification
        </Text>
      </View>

      {/* Input Fields */}
      <View style={styles.inputsRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Signer Full Name *</Text>
          <TextInput
            style={styles.textInput}
            value={signerName}
            onChangeText={setSignerName}
            placeholder="e.g. Marcus Brody"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Title / Role</Text>
          <TextInput
            style={styles.textInput}
            value={signerRole}
            onChangeText={setSignerRole}
            placeholder="e.g. Facilities Director"
            placeholderTextColor="#94A3B8"
          />
        </View>
      </View>

      {/* Touch Canvas */}
      <View style={styles.canvasWrapper}>
        <View style={styles.canvasHeader}>
          <Text style={styles.canvasLabel}>Draw Signature Below with Finger or Stylus:</Text>
          <View style={styles.canvasActions}>
            <TouchableOpacity onPress={handleUndo} style={styles.canvasBtn} disabled={paths.length === 0}>
              <Ionicons name="arrow-undo-outline" size={14} color={paths.length > 0 ? colors.textPrimary : '#CBD5E1'} />
              <Text style={[styles.canvasBtnText, paths.length === 0 && { color: '#CBD5E1' }]}>Undo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleClear} style={styles.canvasBtn}>
              <Ionicons name="trash-outline" size={14} color={colors.fail} />
              <Text style={[styles.canvasBtnText, { color: colors.fail }]}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={styles.canvasBox}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setCanvasDimensions({ width, height });
          }}
          {...panResponder.panHandlers}
        >
          <Svg style={StyleSheet.absoluteFill}>
            {paths.map((p, idx) => (
              <Path
                key={idx}
                d={p}
                stroke={colors.primaryLight}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            ))}
            {currentPath ? (
              <Path
                d={currentPath}
                stroke={colors.accent}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            ) : null}
          </Svg>

          {paths.length === 0 && !currentPath && (
            <View style={styles.placeholderOverlay} pointerEvents="none">
              <Text style={styles.placeholderText}>✕ Sign on line above</Text>
              <View style={styles.signatureBaseline} />
            </View>
          )}
        </View>
      </View>

      {/* Attestation Checkbox */}
      <TouchableOpacity
        style={styles.declarationRow}
        onPress={() => setConfirmedDeclaration(!confirmedDeclaration)}
        activeOpacity={0.8}
      >
        <Ionicons
          name={confirmedDeclaration ? 'checkbox' : 'square-outline'}
          size={20}
          color={confirmedDeclaration ? colors.accent : colors.textMuted}
          style={{ marginRight: 8 }}
        />
        <Text style={styles.declarationText}>
          I hereby attest that the physical inspection and observations recorded for this control item were conducted in my presence.
        </Text>
      </TouchableOpacity>

      {/* Action Buttons */}
      <View style={styles.buttonsRow}>
        {onCancel && (
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.saveBtn, (!confirmedDeclaration || !signerName.trim() || paths.length === 0) && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={!confirmedDeclaration}
        >
          <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.saveBtnText}>Affirm & Seal Sign-Off</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    marginVertical: 10,
  },
  header: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  inputsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 12,
    color: colors.textPrimary,
  },
  canvasWrapper: {
    marginBottom: 12,
  },
  canvasHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  canvasLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  canvasActions: {
    flexDirection: 'row',
    gap: 8,
  },
  canvasBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
    gap: 3,
  },
  canvasBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  canvasBox: {
    height: 140,
    backgroundColor: '#FAFCFE',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#94A3B8',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    cursor: 'crosshair',
  },
  placeholderOverlay: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 24,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 6,
    fontFamily: 'monospace',
  },
  signatureBaseline: {
    width: '100%',
    height: 1,
    backgroundColor: '#CBD5E1',
  },
  declarationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 6,
    marginBottom: 14,
  },
  declarationText: {
    fontSize: 11,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 6,
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
