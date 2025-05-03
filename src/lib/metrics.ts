// src/lib/metrics.ts
import type { AnalysisEntry } from '../types'

/**
 * 1. Severity Distribution
 *    Returns [{ severity: 'HIGH', count: 10 }, …]
 */
export function getSeverityDistribution(data: AnalysisEntry[]) {
  const counts = data.reduce<Record<string, number>>((acc, entry) => {
    const sev = entry.severity_level
    acc[sev] = (acc[sev] || 0) + 1
    return acc
  }, {})

  return Object.entries(counts)
    .map(([severity, count]) => ({ severity, count }))
    // Optional: sort by a fixed severity order
    .sort((a, b) => {
      const order = ['CRITICAL','HIGH','MEDIUM','LOW']
      return order.indexOf(a.severity) - order.indexOf(b.severity)
    })
}

/**
 * Helper: count occurrences in an array of strings
 */
function countOccurrences(arr: string[]) {
  return arr.reduce<Record<string, number>>((acc, item) => {
    acc[item] = (acc[item] || 0) + 1
    return acc
  }, {})
}

/**
 * 2. Top Threat Actors
 *    Flatten all potential_threat_actors[], count them, return top N
 */
export function getTopThreatActors(data: AnalysisEntry[], topN = 10) {
  const allActors = data.flatMap(e => e.potential_threat_actors || [])
  const counts = countOccurrences(allActors)
  return Object.entries(counts)
    .map(([actor, occurrences]) => ({ actor, occurrences }))
    .sort((a, b) => b.occurrences - a.occurrences)
    .slice(0, topN)
}

/**
 * 3. Top Recommended Actions
 *    Flatten recommended_actions[], count & top N
 */
export function getTopActions(data: AnalysisEntry[], topN = 10) {
  const allActions = data.flatMap(e => e.recommended_actions || [])
  const counts = countOccurrences(allActions)
  return Object.entries(counts)
    .map(([action, occurrences]) => ({ action, occurrences }))
    .sort((a, b) => b.occurrences - a.occurrences)
    .slice(0, topN)
}

/**
 * 4. Daily Analysis Timeline
 *    Group entries by YYYY-MM-DD (analysis_date), return [{ date, count }]
 */
export function getDailyTimeline(data: AnalysisEntry[]) {
    const counts = data.reduce<Record<string, number>>((acc, e) => {
    const day = e.analysed_at.slice(0, 10)    
    acc[day] = (acc[day] || 0) + 1
    return acc
  }, {})

  return Object.entries(counts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * 5. Unique IOCs
 *    Flatten key_iocs[] and dedupe
 */
export function getUniqueIOCs(data: AnalysisEntry[]) {
  const allIOCs = data.flatMap(e => e.key_iocs || [])
  return Array.from(new Set(allIOCs))
}

/**
 * 6. Recent Critical Alerts
 *    Filter severity === 'CRITICAL', date within last `days`, sort newest-first
 */
export function getRecentCritical(data: AnalysisEntry[], days = 7) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000

  return data
    .filter(e =>
        e.severity_level === 'CRITICAL' &&
        new Date(e.analysed_at).getTime() >= cutoff
    )
    .sort((a, b) =>
        new Date(b.analysed_at).getTime() - new Date(a.analysed_at).getTime()
    )
}
