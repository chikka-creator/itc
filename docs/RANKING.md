# RANKING — Points & Leaderboard Algorithm

**Version**: 1.0.0
**Last Updated**: 2026-10-10
**Scope**: Point calculation, leaderboard computation, tiebreakers

---

## Table of Contents

1. [Overview](#1-overview)
2. [Point Weights](#2-point-weights)
3. [Submission Points](#3-submission-points)
4. [Attendance Points](#4-attendance-points)
5. [Total Points Formula](#5-total-points-formula)
6. [Leaderboard Ranking](#6-leaderboard-ranking)
7. [Tiebreaker Rules](#7-tiebreaker-rules)
8. [Calculation Examples](#8-calculation-examples)
9. [Public vs Private Leaderboard](#9-public-vs-private-leaderboard)
10. [Implementation](#10-implementation)

---

## 1. Overview

The leaderboard ranks members based on **task submission performance** and **attendance**. Points are calculated automatically and update in real-time as submissions and attendance are recorded.

---

## 2. Point Weights

Configurable via `settings` table (key: `point_weights`).

| Weight | Default | Description |
|--------|---------|-------------|
| `on_time` | **10** | Points for submitting before deadline |
| `late` | **5** | Points for submitting after deadline (but before grading) |
| `missing` | **0** | Points for not submitting |
| `attendance` | **5** | Points for attending a meeting |

**JSON structure in `settings.value`:**
```json
{
  "on_time": 10,
  "late": 5,
  "missing": 0,
  "attendance": 5
}
```

---

## 3. Submission Points

Points are awarded based on **submission timing relative to deadline**.

### 3.1 On-Time Submission
- **Condition:** `submitted_at <= deadline`
- **Points:** `on_time` weight (default: 10)
- **Status:** `pending` → admin grades later

### 3.2 Late Submission
- **Condition:** `submitted_at > deadline` AND submission exists
- **Points:** `late` weight (default: 5)
- **Status:** `late` (admin can still grade)
- **Note:** Late submissions are only possible if admin allows (see §3.4)

### 3.3 Missing Submission
- **Condition:** No submission row exists AND deadline has passed
- **Points:** `missing` weight (default: 0)
- **Status:** Not stored in DB (computed at query time)

### 3.4 Late Submission Policy
- **Default:** Late submissions are **not allowed** (deadline is hard cutoff)
- **Optional:** Admin can set assignment to allow late submissions (future feature)
- **Current behavior:** If deadline passes, member cannot submit

### 3.5 Graded Bonus (Optional)
- **Not implemented in v1.0**
- **Future:** Bonus points for high scores (e.g., score ≥ 90 → +2 bonus)

---

## 4. Attendance Points

Points are awarded per **attendance session**.

| Status | Points | Description |
|--------|--------|-------------|
| `present` | `attendance` weight (default: 5) | Member attended |
| `absent` | `0` | Member did not attend |
| `excused` | `0` | Member had valid reason (no penalty) |

### 4.1 Attendance Rate
```
attendance_rate = (present_count / total_sessions) × 100
```

Used in reports and as tiebreaker.

---

## 5. Total Points Formula

```
total_points = Σ(submission_points) + Σ(attendance_points)

Where:
  submission_points = on_time_points + late_points + missing_points
  attendance_points = present_count × attendance_weight
```

**Expanded:**
```
total_points = (on_time_count × on_time_weight)
             + (late_count × late_weight)
             + (present_count × attendance_weight)
```

---

## 6. Leaderboard Ranking

### 6.1 Sort Order
1. **Primary:** `total_points` descending
2. **Secondary:** Tiebreaker rules (see §7)

### 6.2 Leaderboard Entry

| Field | Description |
|-------|-------------|
| `rank` | Position (1, 2, 3, ...) |
| `name` | Member display name |
| `total_points` | Sum of submission + attendance points |
| `submission_count` | Total submissions made |
| `attendance_rate` | Percentage of meetings attended |
| `avg_score` | Average grade (if graded) |

---

## 7. Tiebreaker Rules

When two members have the same `total_points`, apply tiebreakers in order:

| Priority | Tiebreaker | Rule |
|----------|------------|------|
| 1 | **Attendance rate** | Higher attendance rate wins |
| 2 | **Average score** | Higher average grade wins |
| 3 | **On-time submissions** | More on-time submissions wins |
| 4 | **First name alphabetically** | A → Z |

---

## 8. Calculation Examples

### 8.1 Member A: Consistent High Performer

| Metric | Value | Points |
|--------|-------|--------|
| On-time submissions | 8 | 8 × 10 = 80 |
| Late submissions | 1 | 1 × 5 = 5 |
| Missing submissions | 1 | 1 × 0 = 0 |
| Present at meetings | 9 | 9 × 5 = 45 |
| **Total** | | **130** |

### 8.2 Member B: Good Attendance, Fewer Submissions

| Metric | Value | Points |
|--------|-------|--------|
| On-time submissions | 5 | 5 × 10 = 50 |
| Late submissions | 2 | 2 × 5 = 10 |
| Missing submissions | 3 | 3 × 0 = 0 |
| Present at meetings | 10 | 10 × 5 = 50 |
| **Total** | | **110** |

### 8.3 Member C: Perfect Attendance, No Submissions

| Metric | Value | Points |
|--------|-------|--------|
| On-time submissions | 0 | 0 × 10 = 0 |
| Late submissions | 0 | 0 × 5 = 0 |
| Missing submissions | 10 | 10 × 0 = 0 |
| Present at meetings | 10 | 10 × 5 = 50 |
| **Total** | | **50** |

### 8.4 Tiebreaker Example

| Member | Points | Attendance Rate | Avg Score | Rank |
|--------|--------|-----------------|-----------|------|
| X | 130 | 100% (10/10) | 85 | 1 |
| Y | 130 | 90% (9/10) | 90 | 2 |
| Z | 130 | 100% (10/10) | 80 | 3 |

- X vs Y: Same points, X has higher attendance rate → X ranks higher
- X vs Z: Same points, same attendance rate, X has higher avg score → X ranks higher
- Y vs Z: Same points, Z has higher attendance rate → Z ranks higher than Y

---

## 9. Public vs Private Leaderboard

### 9.1 Public Leaderboard (apps/web)
- **Visible to:** Everyone (no login required)
- **Shows:** Top 10 members
- **Fields:** Rank, name, total_points
- **Hidden:** Class, attendance rate, scores, submission details

### 9.2 Full Leaderboard (apps/dashboard)
- **Visible to:** Logged-in members and admins
- **Shows:** All members
- **Fields:** Rank, name, total_points, submission_count, attendance_rate, avg_score
- **Own rank:** Highlighted with accent

### 9.3 Admin Leaderboard
- **Visible to:** Admins only
- **Shows:** All data including username, class, phone
- **Additional:** Export to CSV

---

## 10. Implementation

### 10.1 Point Calculation Query

```sql
WITH submission_points AS (
  SELECT
    s.user_id,
    SUM(
      CASE
        WHEN s.submitted_at <= a.deadline THEN ${on_time_weight}
        WHEN s.submitted_at > a.deadline THEN ${late_weight}
        ELSE 0
      END
    ) AS sub_points,
    COUNT(*) AS submission_count
  FROM submissions s
  JOIN assignments a ON s.assignment_id = a.id
  WHERE a.status = 'published'
  GROUP BY s.user_id
),
attendance_points AS (
  SELECT
    ar.user_id,
    SUM(CASE WHEN ar.status = 'present' THEN ${attendance_weight} ELSE 0 END) AS att_points,
    SUM(CASE WHEN ar.status = 'present' THEN 1 ELSE 0 END) AS present_count,
    COUNT(*) AS total_sessions
  FROM attendance_records ar
  GROUP BY ar.user_id
),
avg_scores AS (
  SELECT
    user_id,
    AVG(score) AS avg_score
  FROM submissions
  WHERE score IS NOT NULL
  GROUP BY user_id
)
SELECT
  u.id,
  u.name,
  COALESCE(sp.sub_points, 0) + COALESCE(ap.att_points, 0) AS total_points,
  COALESCE(sp.submission_count, 0) AS submission_count,
  CASE
    WHEN COALESCE(ap.total_sessions, 0) = 0 THEN 0
    ELSE ROUND(COALESCE(ap.present_count, 0) * 100.0 / ap.total_sessions, 2)
  END AS attendance_rate,
  COALESCE(ascore.avg_score, 0) AS avg_score
FROM users u
LEFT JOIN submission_points sp ON u.id = sp.user_id
LEFT JOIN attendance_points ap ON u.id = ap.user_id
LEFT JOIN avg_scores ascore ON u.id = ascore.user_id
WHERE u.role = 'member'
ORDER BY
  total_points DESC,
  attendance_rate DESC,
  avg_score DESC,
  u.name ASC;
```

### 10.2 TypeScript Implementation

```ts
import { db } from '@itc/db';
import { users, submissions, assignments, attendanceRecords } from '@itc/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function calculateLeaderboard() {
  const weights = await getPointWeights(); // from settings table

  const result = await db.all(sql`
    WITH submission_points AS (
      SELECT
        s.user_id,
        SUM(
          CASE
            WHEN s.submitted_at <= a.deadline THEN ${weights.on_time}
            WHEN s.submitted_at > a.deadline THEN ${weights.late}
            ELSE 0
          END
        ) AS sub_points,
        COUNT(*) AS submission_count,
        SUM(CASE WHEN s.submitted_at <= a.deadline THEN 1 ELSE 0 END) AS on_time_count
      FROM submissions s
      JOIN assignments a ON s.assignment_id = a.id
      WHERE a.status = 'published'
      GROUP BY s.user_id
    ),
    attendance_points AS (
      SELECT
        ar.user_id,
        SUM(CASE WHEN ar.status = 'present' THEN ${weights.attendance} ELSE 0 END) AS att_points,
        SUM(CASE WHEN ar.status = 'present' THEN 1 ELSE 0 END) AS present_count,
        COUNT(*) AS total_sessions
      FROM attendance_records ar
      GROUP BY ar.user_id
    ),
    avg_scores AS (
      SELECT user_id, AVG(score) AS avg_score
      FROM submissions
      WHERE score IS NOT NULL
      GROUP BY user_id
    )
    SELECT
      u.id,
      u.name,
      COALESCE(sp.sub_points, 0) + COALESCE(ap.att_points, 0) AS total_points,
      COALESCE(sp.submission_count, 0) AS submission_count,
      COALESCE(sp.on_time_count, 0) AS on_time_count,
      CASE
        WHEN COALESCE(ap.total_sessions, 0) = 0 THEN 0
        ELSE ROUND(COALESCE(ap.present_count, 0) * 100.0 / ap.total_sessions, 2)
      END AS attendance_rate,
      COALESCE(ascore.avg_score, 0) AS avg_score
    FROM users u
    LEFT JOIN submission_points sp ON u.id = sp.user_id
    LEFT JOIN attendance_points ap ON u.id = ap.user_id
    LEFT JOIN avg_scores ascore ON u.id = ascore.user_id
    WHERE u.role = 'member'
    ORDER BY
      total_points DESC,
      attendance_rate DESC,
      avg_score DESC,
      on_time_count DESC,
      u.name ASC
  `);

  return result.map((row, index) => ({
    ...row,
    rank: index + 1,
  }));
}
```

### 10.3 Caching Strategy

- **Public leaderboard:** Cache for 5 minutes (ISR or client-side SWR)
- **Full leaderboard:** Real-time (no cache)
- **Invalidation:** Recalculate on:
  - New submission
  - Grade update
  - Attendance save
  - Point weight change

---

**End of RANKING.md**
