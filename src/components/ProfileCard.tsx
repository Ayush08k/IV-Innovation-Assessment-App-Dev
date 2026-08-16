// S (SRP): Only renders a single profile card tile.
// I (ISP): Minimal props — only what's needed to display + interact.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '../theme';
import type { Profile } from '../types';

type Props = {
  profile: Profile;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
};

const GENDER_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  male: 'male',
  female: 'female',
  other: 'person',
};

const AVATAR_COLORS: Record<string, string> = {
  male: Colors.info,
  female: '#EC4899',
  other: Colors.accent,
};

export const ProfileCard: React.FC<Props> = ({
  profile,
  isActive,
  onSelect,
  onDelete,
}) => {
  const handleDelete = () => {
    Alert.alert(
      'Delete Profile',
      `Are you sure you want to delete "${profile.name}"? All associated data will be lost.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  const avatarColor = AVATAR_COLORS[profile.gender] ?? Colors.primary;
  const genderIcon = GENDER_ICONS[profile.gender] ?? 'person';

  return (
    <TouchableOpacity
      onPress={onSelect}
      style={[styles.card, isActive && styles.cardActive]}
      activeOpacity={0.75}
      accessibilityLabel={`Select profile ${profile.name}`}
      accessibilityRole="button"
    >
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: avatarColor + '22', borderColor: avatarColor + '55' }]}>
        <Ionicons name={genderIcon} size={24} color={avatarColor} />
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.gender}>{profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}</Text>
      </View>

      {/* Active badge */}
      {isActive && (
        <View style={styles.activeBadge}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
          <Text style={styles.activeText}>Active</Text>
        </View>
      )}

      {/* Delete */}
      {!profile.is_primary && (
        <TouchableOpacity
          onPress={handleDelete}
          style={styles.deleteButton}
          accessibilityLabel={`Delete profile ${profile.name}`}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={18} color={Colors.error} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing[4],
    marginBottom: Spacing[3],
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: Spacing[3],
    ...Shadow.sm,
  },
  cardActive: {
    borderColor: Colors.primary + '66',
    backgroundColor: Colors.primary + '11',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  gender: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  deleteButton: {
    padding: Spacing[1],
  },
});
