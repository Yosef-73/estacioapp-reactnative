import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { colors, spacing, radius, fontSize } from '../../constants/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const MEDAL_COLORS = [colors.gold, colors.silver, colors.bronze, colors.textMuted];
const MEDAL_ICONS: IoniconsName[] = ['trophy', 'medal', 'ribbon'];

export default function HomeScreen() {
  const { groups, missions, getGroupPoints } = useApp();

  const sortedGroups = [...groups]
    .map(g => ({ ...g, points: getGroupPoints(g.id) }))
    .sort((a, b) => b.points - a.points);

  const topMissions = [...missions]
    .sort((a, b) => b.points - a.points)
    .slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>FJU</Text>
          </View>
          <View>
            <Text style={styles.appTitle}>Rally FJU</Text>
            <Text style={styles.appSubtitle}>MissionBoard</Text>
          </View>
        </View>

        <Text style={styles.tagline}>Cumpra missões. Lidere o ranking.</Text>

        {/* Group Ranking */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ranking de Grupos</Text>
          {sortedGroups.map((group, index) => (
            <View
              key={group.id}
              style={[styles.groupCard, index === 0 && styles.groupCardFirst]}
            >
              <View style={styles.medalContainer}>
                {index < 3 ? (
                  <Ionicons name={MEDAL_ICONS[index]} size={22} color={MEDAL_COLORS[index]} />
                ) : (
                  <Text style={[styles.rankNumber, { color: MEDAL_COLORS[3] }]}>{index + 1}</Text>
                )}
              </View>
              <View style={styles.groupInfo}>
                <Text style={[styles.groupName, index === 0 && styles.groupNameFirst]}>
                  {group.name}
                </Text>
                {index === 0 && <Text style={styles.leadingLabel}>Liderando</Text>}
              </View>
              <View style={styles.pointsBlock}>
                <Text style={[styles.groupPoints, index === 0 && { color: colors.gold }]}>
                  {group.points}
                </Text>
                <Text style={styles.ptsLabel}>pts</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Top Missions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Missões de Maior Valor</Text>
          <View style={styles.missionRow}>
            {topMissions.map(m => (
              <View key={m.id} style={styles.missionCard}>
                <View style={styles.missionBadge}>
                  <Text style={styles.missionBadgePoints}>{m.points}</Text>
                  <Text style={styles.missionBadgePts}>pts</Text>
                </View>
                <Text style={styles.missionName} numberOfLines={2}>{m.name}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  logoBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: colors.secondary,
    fontSize: fontSize.md,
    fontWeight: '800',
    letterSpacing: 1,
  },
  appTitle: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '800',
    lineHeight: 26,
  },
  appSubtitle: {
    color: colors.primaryLight,
    fontSize: fontSize.sm,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  tagline: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  groupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  groupCardFirst: {
    borderColor: colors.gold,
    backgroundColor: colors.surfaceElevated,
  },
  medalContainer: {
    width: 32,
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  groupNameFirst: {
    color: colors.secondary,
  },
  leadingLabel: {
    color: colors.gold,
    fontSize: fontSize.xs,
    fontWeight: '600',
    marginTop: 2,
  },
  pointsBlock: {
    alignItems: 'flex-end',
  },
  groupPoints: {
    color: colors.primaryLight,
    fontSize: fontSize.xl,
    fontWeight: '800',
  },
  ptsLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  missionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  missionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  missionBadge: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  missionBadgePoints: {
    color: colors.secondary,
    fontSize: fontSize.xl,
    fontWeight: '800',
  },
  missionBadgePts: {
    color: colors.primaryLight,
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  missionName: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    textAlign: 'center',
    fontWeight: '500',
  },
});
