import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { colors, spacing, radius, fontSize } from '../../constants/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const MEDAL_COLORS = [colors.gold, colors.silver, colors.bronze];
const MEDAL_ICONS: IoniconsName[] = ['trophy', 'medal', 'ribbon'];

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('');
}

export default function RankingScreen() {
  const [tab, setTab] = useState<'groups' | 'individual'>('groups');
  const { groups, assistants, getGroupPoints, getAssistantPoints } = useApp();

  const sortedGroups = [...groups]
    .map(g => ({ ...g, points: getGroupPoints(g.id) }))
    .sort((a, b) => b.points - a.points);

  const sortedAssistants = [...assistants]
    .map(a => ({
      ...a,
      points: getAssistantPoints(a.id),
      groupName: groups.find(g => g.id === a.groupId)?.name ?? '',
    }))
    .sort((a, b) => b.points - a.points);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ranking</Text>
      </View>

      {/* Toggle */}
      <View style={styles.toggle}>
        <TouchableOpacity
          style={[styles.toggleBtn, tab === 'groups' && styles.toggleBtnActive]}
          onPress={() => setTab('groups')}
        >
          <Ionicons
            name={'people' as IoniconsName}
            size={16}
            color={tab === 'groups' ? colors.secondary : colors.textMuted}
          />
          <Text style={[styles.toggleLabel, tab === 'groups' && styles.toggleLabelActive]}>
            Grupos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, tab === 'individual' && styles.toggleBtnActive]}
          onPress={() => setTab('individual')}
        >
          <Ionicons
            name={'person' as IoniconsName}
            size={16}
            color={tab === 'individual' ? colors.secondary : colors.textMuted}
          />
          <Text style={[styles.toggleLabel, tab === 'individual' && styles.toggleLabelActive]}>
            Individual
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {tab === 'groups'
          ? sortedGroups.map((group, index) => (
              <View key={group.id} style={[styles.card, index === 0 && styles.cardFirst]}>
                <View style={styles.position}>
                  {index < 3 ? (
                    <Ionicons name={MEDAL_ICONS[index]} size={22} color={MEDAL_COLORS[index]} />
                  ) : (
                    <Text style={styles.positionText}>{index + 1}</Text>
                  )}
                </View>
                <Text style={[styles.name, { flex: 1 }, index === 0 && styles.nameFirst]}>
                  {group.name}
                </Text>
                <View style={styles.pointsBlock}>
                  <Text style={[styles.points, index < 3 && { color: MEDAL_COLORS[index] }]}>
                    {group.points}
                  </Text>
                  <Text style={styles.ptsLabel}>pts</Text>
                </View>
              </View>
            ))
          : sortedAssistants.map((assistant, index) => (
              <View key={assistant.id} style={[styles.card, index === 0 && styles.cardFirst]}>
                <View style={styles.position}>
                  {index < 3 ? (
                    <Ionicons name={MEDAL_ICONS[index]} size={22} color={MEDAL_COLORS[index]} />
                  ) : (
                    <Text style={styles.positionText}>{index + 1}</Text>
                  )}
                </View>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{getInitials(assistant.name)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.name, index === 0 && styles.nameFirst]}>
                    {assistant.name}
                  </Text>
                  <Text style={styles.groupLabel}>{assistant.groupName}</Text>
                </View>
                <View style={styles.pointsBlock}>
                  <Text style={[styles.points, index < 3 && { color: MEDAL_COLORS[index] }]}>
                    {assistant.points}
                  </Text>
                  <Text style={styles.ptsLabel}>pts</Text>
                </View>
              </View>
            ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: { color: colors.text, fontSize: fontSize.xxl, fontWeight: '800' },
  toggle: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  toggleBtnActive: { backgroundColor: colors.primary },
  toggleLabel: { color: colors.textMuted, fontSize: fontSize.sm, fontWeight: '600' },
  toggleLabelActive: { color: colors.secondary },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardFirst: {
    borderColor: colors.gold,
    backgroundColor: colors.surfaceElevated,
  },
  position: { width: 32, alignItems: 'center' },
  positionText: { color: colors.textMuted, fontSize: fontSize.lg, fontWeight: '700' },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: colors.secondary, fontSize: fontSize.xs, fontWeight: '700' },
  name: { color: colors.text, fontSize: fontSize.md, fontWeight: '600' },
  nameFirst: { color: colors.secondary },
  groupLabel: { color: colors.textMuted, fontSize: fontSize.xs },
  pointsBlock: { alignItems: 'flex-end' },
  points: { color: colors.primaryLight, fontSize: fontSize.xl, fontWeight: '800' },
  ptsLabel: { color: colors.textMuted, fontSize: fontSize.xs },
});
