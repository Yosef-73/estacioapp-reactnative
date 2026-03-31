import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { colors, spacing, radius, fontSize } from '../../constants/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

function getPointsColor(points: number) {
  if (points >= 25) return colors.tertiary;
  if (points >= 15) return colors.primaryLight;
  return colors.textMuted;
}

export default function MissionsScreen() {
  const { missions } = useApp();
  const sorted = [...missions].sort((a, b) => b.points - a.points);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Missões</Text>
        <Text style={styles.subtitle}>{missions.length} missões disponíveis</Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {sorted.map(mission => {
          const pointColor = getPointsColor(mission.points);
          return (
            <View key={mission.id} style={styles.card}>
              <View style={[styles.iconBox, { borderColor: pointColor }]}>
                <Ionicons name={'flag' as IoniconsName} size={20} color={pointColor} />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.missionName}>{mission.name}</Text>
                <Text style={styles.missionDesc}>{mission.description}</Text>
              </View>
              <View style={styles.pointsBlock}>
                <Text style={[styles.points, { color: pointColor }]}>{mission.points}</Text>
                <Text style={styles.ptsLabel}>pts</Text>
              </View>
            </View>
          );
        })}
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
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
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
  },
  cardBody: {
    flex: 1,
  },
  missionName: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
    marginBottom: 2,
  },
  missionDesc: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    lineHeight: 16,
  },
  pointsBlock: {
    alignItems: 'flex-end',
  },
  points: {
    fontSize: fontSize.xl,
    fontWeight: '800',
  },
  ptsLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
});
