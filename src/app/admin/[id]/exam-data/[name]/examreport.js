"use client"
import React from "react";
import ReactPDF,{
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    lineHeight: 1.3,
  },
  
  // Cover page styles
  coverPage: {
    padding: 50,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  coverTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 20,
  },
  coverSubtitle: {
    fontSize: 16,
    color: "#4b5563",
    marginBottom: 40,
  },
  coverExamName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 30,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
  },
  coverStatsContainer: {
    width: "100%",
    maxWidth: 400,
    marginBottom: 40,
  },
  coverStatBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 10,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
  },
  coverStatLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  coverStatValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
  },
  coverDate: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 30,
  },
  
  // Simple header for subsequent pages
  simpleHeader: {
    paddingBottom: 10,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    borderBottomStyle: "solid",
  },
  headerText: {
    fontSize: 8,
    color: "#6b7280",
    textAlign: "center",
  },
  
  // Student container styles - more compact
  studentContainer: {
    marginBottom: 18,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderStyle: "solid",
    borderRadius: 8,
    padding: 16,
    breakInside: "avoid",
  },
  studentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  studentNameSection: {
    flex: 2,
  },
  studentName: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 3,
  },
  studentEmail: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 2,
  },
  studentId: {
    fontSize: 8,
    color: "#9ca3af",
  },
  studentScoreSection: {
    flex: 1,
    alignItems: "flex-end",
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 3,
  },
  statusPassed: {
    color: "#059669",
  },
  statusFailed: {
    color: "#dc2626",
  },
  statusBadge: {
    fontSize: 9,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    textAlign: "center",
    minWidth: 50,
  },
  passedBadge: {
    backgroundColor: "#d1fae5",
    color: "#065f46",
  },
  failedBadge: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  submissionTime: {
    fontSize: 8,
    color: "#9ca3af",
    marginTop: 3,
  },
  
  // Compact cheating info
  cheatingSection: {
    backgroundColor: "#fef3c7",
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#f59e0b",
    borderLeftStyle: "solid",
  },
  cheatingTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 6,
  },
  cheatingInfoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cheatingInfoItem: {
    flex: 1,
  },
  cheatingLabel: {
    fontSize: 9,
    color: "#78350f",
  },
  cheatingValue: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#92400e",
    marginTop: 1,
  },
  cheatingAlert: {
    color: "#dc2626",
  },
  tabSwitchLogs: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#fbbf24",
    borderTopStyle: "solid",
  },
  logEntry: {
    fontSize: 8,
    color: "#78350f",
    marginBottom: 1,
  },
  
  // Compact code section
  codeSection: {
    backgroundColor: "#f8fafc",
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderStyle: "solid",
  },
  codeTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#475569",
    marginBottom: 8,
  },
  codeBlock: {
    fontFamily: "Courier",
    fontSize: 7,
    color: "#374151",
    backgroundColor: "#ffffff",
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderStyle: "solid",
    lineHeight: 1.4,
    whiteSpace: "pre-wrap",
    maxHeight: 200,
    overflow: "hidden",
  },
  noCode: {
    fontSize: 9,
    color: "#9ca3af",
    fontStyle: "italic",
    textAlign: "center",
    padding: 15,
  },
});

// Cover page component
const CoverPage = ({ examName, stats, totalStudents }) => {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Page size="A4" style={[pdfStyles.page, pdfStyles.coverPage]}>
      <Text style={pdfStyles.coverTitle}>Exam Analysis Report</Text>
      <Text style={pdfStyles.coverSubtitle}>INFO6205 Program Structure and Algorithms</Text>
      
      <Text style={pdfStyles.coverExamName}>{examName}</Text>
      
      <View style={pdfStyles.coverStatsContainer}>
        <View style={pdfStyles.coverStatBox}>
          <Text style={pdfStyles.coverStatLabel}>Total Students</Text>
          <Text style={pdfStyles.coverStatValue}>{totalStudents}</Text>
        </View>
        
        <View style={pdfStyles.coverStatBox}>
          <Text style={pdfStyles.coverStatLabel}>Average Score</Text>
          <Text style={pdfStyles.coverStatValue}>{stats.avg.toFixed(1)}</Text>
        </View>
        
        <View style={pdfStyles.coverStatBox}>
          <Text style={pdfStyles.coverStatLabel}>Median Score</Text>
          <Text style={pdfStyles.coverStatValue}>{stats.median}</Text>
        </View>
        
        <View style={pdfStyles.coverStatBox}>
          <Text style={pdfStyles.coverStatLabel}>Mode Score</Text>
          <Text style={pdfStyles.coverStatValue}>{stats.mode}</Text>
        </View>
      </View>
      
      <Text style={pdfStyles.coverDate}>Generated on {today}</Text>
    </Page>
  );
};

// Helper function to chunk results into pages
const chunkArray = (array, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

const ExamResultPDF = ({ examName, stats, results }) => {
  // Split results into chunks of ~4-5 students per page for better layout
  const studentsPerPage = 4;
  const resultChunks = chunkArray(results, studentsPerPage);
  
  return (
    <Document>
      {/* Cover Page */}
      <CoverPage examName={examName} stats={stats} totalStudents={results.length} />
      
      {/* Results Pages */}
      {resultChunks.map((chunk, pageIndex) => (
        <Page key={pageIndex} size="A4" style={pdfStyles.page} wrap>
          {/* Header */}
          <View style={pdfStyles.simpleHeader} fixed>
            <Text style={pdfStyles.headerText}>INFO6205 Program Structure and Algorithms</Text>
          </View>
          
          {/* Student results for this page */}
          {chunk.map((r, idx) => (
            <View style={pdfStyles.studentContainer} key={idx} wrap={false}>
              <View style={pdfStyles.studentHeader}>
                <View style={pdfStyles.studentNameSection}>
                  <Text style={pdfStyles.studentName}>{r.name}</Text>
                  <Text style={pdfStyles.studentEmail}>{r.email}</Text>
                  <Text style={pdfStyles.studentId}>ID: {r.userId}</Text>
                </View>
                
                <View style={pdfStyles.studentScoreSection}>
                  <Text style={[pdfStyles.scoreValue, r.passed ? pdfStyles.statusPassed : pdfStyles.statusFailed]}>
                    {r.score}
                  </Text>
                  <Text style={[pdfStyles.statusBadge, r.passed ? pdfStyles.passedBadge : pdfStyles.failedBadge]}>
                    {r.passed ? "PASSED" : "FAILED"}
                  </Text>
                  <Text style={pdfStyles.submissionTime}>
                    {new Date(r.date?.toDate?.() ?? r.date).toLocaleString()}
                  </Text>
                </View>
              </View>

              {/* Cheating Information - Only show if there are issues */}
              {(r.exitedFullscreen || r.tabSwitchCount > 0) && (
                <View style={pdfStyles.cheatingSection}>
                  <Text style={pdfStyles.cheatingTitle}>⚠ Monitoring Alerts</Text>
                  
                  <View style={pdfStyles.cheatingInfoGrid}>
                    <View style={pdfStyles.cheatingInfoItem}>
                      <Text style={pdfStyles.cheatingLabel}>Fullscreen Exit</Text>
                      <Text style={[pdfStyles.cheatingValue, r.exitedFullscreen && pdfStyles.cheatingAlert]}>
                        {r.exitedFullscreen ? "YES" : "No"}
                      </Text>
                    </View>
                    
                    <View style={pdfStyles.cheatingInfoItem}>
                      <Text style={pdfStyles.cheatingLabel}>Tab Switches</Text>
                      <Text style={[pdfStyles.cheatingValue, r.tabSwitchCount > 0 && pdfStyles.cheatingAlert]}>
                        {r.tabSwitchCount}
                      </Text>
                    </View>
                  </View>

                  {r.tabSwitchLogs?.length > 0 && (
                    <View style={pdfStyles.tabSwitchLogs}>
                      {r.tabSwitchLogs.slice(0, 3).map((log, i) => (
                        <Text key={i} style={pdfStyles.logEntry}>
                          • {log.type} at {new Date(log.time).toLocaleTimeString()}
                        </Text>
                      ))}
                      {r.tabSwitchLogs.length > 3 && (
                        <Text style={pdfStyles.logEntry}>• +{r.tabSwitchLogs.length - 3} more</Text>
                      )}
                    </View>
                  )}
                </View>
              )}

              {/* Code Section */}
              <View style={pdfStyles.codeSection}>
                <Text style={pdfStyles.codeTitle}>Submitted Code</Text>
                {r.code ? (
                  <Text style={pdfStyles.codeBlock}>
                    {r.code.length > 800 ? r.code.substring(0, 800) + "..." : r.code}
                  </Text>
                ) : (
                  <Text style={pdfStyles.noCode}>No code submitted</Text>
                )}
              </View>
            </View>
          ))}
        </Page>
      ))}
    </Document>
  );
};

export default ExamResultPDF;