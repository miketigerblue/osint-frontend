// src/lib/metrics.ts
import jmespath from 'jmespath'
import type { AnalysisEntry } from '../types'

// 1. Severity Distribution
export function getSeverityDistribution(data: AnalysisEntry[]) {
  return jmespath.search(
    data,
    `[].severity_level | group_by(@) | sort_by(@, &length(@)) | [].{severity: @[0], count: length(@)}`
  )
}

// 2. Top Threat Actors
export function getTopThreatActors(data: AnalysisEntry[], topN = 10) {
  // assumes each entry has potential_threat_actors: string[]
  return jmespath.search(
    data,
    `[].potential_threat_actors[] 
       | group_by(@) 
       | [].{actor: @[0], occurrences: length(@)} 
       | sort_by(@, &occurrences)[::-1][:${topN}]`
  )
}

// 3. Top Recommended Actions
export function getTopActions(data: AnalysisEntry[], topN = 10) {
  return jmespath.search(
    data,
    `[].recommended_actions[] 
       | group_by(@) 
       | [].{action: @[0], occurrences: length(@)} 
       | sort_by(@, &occurrences)[::-1][:${topN}]`
  )
}

// 4. Daily Analysis Timeline
export function getDailyTimeline(data: AnalysisEntry[]) {
  return jmespath.search(
    data,
    `[].analysis_date 
       | map(&substring(@, \`0\`, \`10\`))  /* yyyy-mm-dd */ 
       | group_by(@) 
       | [].{date: @[0], count: length(@)}`
  )
}

// 5. Unique IOCs
export function getUniqueIOCs(data: AnalysisEntry[]) {
  return Array.from(new Set(
    jmespath.search(data, `[].key_iocs[]`)
  ))
}

// 6. Recent Critical Alerts
export function getRecentCritical(data: AnalysisEntry[], days = 7) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return data
    .filter(e => e.severity_level === 'CRITICAL' && new Date(e.analysis_date) >= cutoff)
    .sort((a, b) => Number(new Date(b.analysis_date)) - Number(new Date(a.analysis_date)))
}
