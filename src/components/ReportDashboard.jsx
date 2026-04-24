import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Papa from 'papaparse';
import { 
  BarChart3, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Search, 
  BookOpen, 
  FileText,
  Download,
  X
} from 'lucide-react';
import html2pdf from 'html2pdf.js';

const ReportDashboard = () => {
  const [reports, setReports] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [riskFilter, setRiskFilter] = useState("All Levels");
  const [showModal, setShowModal] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Overview Metrics
  const totalSubmissions = reports.length;
  const flaggedCases = reports.filter(r => r.risk_level === 'High' || r.risk_level === 'Medium').length;
  const averageScore = reports.length > 0 
    ? (reports.reduce((acc, curr) => acc + curr.overall_score, 0) / reports.length).toFixed(1) 
    : 0;

  useEffect(() => {
    fetch("https://docs.google.com/spreadsheets/d/1olXN5P3dtY6FXwY87CmZpZLEy_oFML5XM96-jtdkHVQ/export?format=csv&gid=0")
      .then(res => res.text())
      .then(csv => {
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const transformed = results.data.map((row, index) => {
              const score = parseInt(row["Overall Score"] || 0, 10);
              return {
                id: `REP${String(index + 1).padStart(3, '0')}`,
                timestamp: new Date().toLocaleString().split(',')[0],
                name: row["Name"] || "Unknown",
                roll_number: row["Roll Number"] || "N/A",
                assignment_title: row["Assignment Title"] || "Untitled",
                submission_text: row["Submission Text"] || "",
                overall_score: score,
                risk_level: row["Risk Level"] || "Low",
                section_scores: {
                  introduction: Math.min(100, score + 5),
                  body: Math.max(0, score - 5),
                  conclusion: Math.min(100, score + 2),
                  citations: Math.max(0, score - 2)
                },
                writing_consistency: Math.min(100, score + 10),
                flagged_phrases: row["Flagged Part"] ? [row["Flagged Part"]] : [],
                suggestions: row["Suggestions"] 
                  ? row["Suggestions"].split('.').map(s => s.trim().replace(/^,\s*/, '')).filter(Boolean) 
                  : [],
                status: row["Status"] || "OK"
              };
            });
            setReports(transformed);
            if (transformed.length > 0) {
              // Show the last submitted item
              setActiveReport(transformed[transformed.length - 1]);
            }
            setLoading(false);
          }
        });
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showModal]);

  const handleDownloadPDF = () => {
    if (!activeReport) return;
    const element = document.getElementById('report-content');
    const opt = {
      margin: 0.5,
      filename: `${activeReport.roll_number}_Report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    html2pdf().set(opt).from(element).save();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setErrorMsg("");
    
    const query = searchTerm.trim().toLowerCase();
    if (!query) return;

    const found = reports.find(r => 
      r.roll_number.toLowerCase().includes(query) || 
      r.name.toLowerCase().includes(query) ||
      r.id.toLowerCase().includes(query)
    );
    
    if (found) {
      setActiveReport(found);
    } else {
      setErrorMsg("No report found matching your search. Please check the details.");
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'Low': return 'var(--success)';
      case 'Medium': return 'var(--warning)';
      case 'High': return 'var(--danger)';
      default: return 'var(--primary)';
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'Low': return <CheckCircle2 className="text-success" />;
      case 'Medium': return <AlertTriangle className="text-warning" />;
      case 'High': return <XCircle className="text-danger" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <section id="report-dashboard" style={{ backgroundColor: 'white', minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
           <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ display: 'inline-block', marginBottom: '20px' }}>
              <Search size={40} color="var(--primary)" />
           </motion.div>
           <h3 style={{ color: 'var(--text-dark)', fontSize: '1.8rem', marginBottom: '10px' }}>Syncing Database</h3>
           <p style={{ color: 'var(--text-muted)' }}>Fetching live Google Sheets submissions...</p>
        </div>
      </section>
    );
  }

  if (!activeReport) {
    return (
      <section id="report-dashboard" style={{ backgroundColor: 'white', minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
           <h3 style={{ color: 'var(--text-dark)', fontSize: '1.8rem' }}>No Submissions Found</h3>
           <p style={{ color: 'var(--text-muted)' }}>The Google Sheet is currently empty.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="report-dashboard" style={{ backgroundColor: 'white' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Result Dashboard</h2>
          <p style={{ color: 'var(--text-muted)' }}>Search by Name or Roll Number to view analysis</p>
        </div>

        {/* Search Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '50px' }}>
          <form onSubmit={handleSearch} style={{ 
            display: 'flex', 
            width: '100%', 
            maxWidth: '500px',
            position: 'relative'
          }}>
            <input 
              type="text" 
              placeholder="Enter Roll Number (e.g. E25b070617)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '15px 50px 15px 20px',
                borderRadius: 'var(--radius-md)',
                border: '2px solid var(--primary-light)',
                fontSize: '1rem',
                outline: 'none',
                backgroundColor: 'var(--bg)'
              }}
            />
            <button type="submit" style={{
              position: 'absolute',
              right: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              color: 'var(--primary)',
              cursor: 'pointer',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Search size={24} />
            </button>
          </form>
        </div>
        {errorMsg && (
          <div style={{ textAlign: 'center', color: 'var(--danger)', marginBottom: '30px', marginTop: '-30px', fontWeight: '500' }}>
            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              {errorMsg}
            </motion.p>
          </div>
        )}




        {/* Overview Header */}
        <div style={{ marginTop: '60px', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-dark)', marginBottom: '10px' }}>Overview</h2>
          <p style={{ color: 'var(--text-muted)' }}>Monitor academic integrity across recent submissions.</p>
        </div>

        {/* Metric Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '24px', 
          marginBottom: '50px' 
        }}>
          {[
            { label: 'TOTAL SUBMISSIONS', value: totalSubmissions, sub: '', icon: <FileText color="#3b82f6" />, color: '#3b82f6' },
            { label: 'FLAGGED CASES', value: flaggedCases, sub: '', icon: <AlertTriangle color="#ef4444" />, color: '#ef4444' },
            { label: 'AVERAGE SCORE', value: averageScore, sub: '', icon: <BarChart3 color="#6366f1" />, color: '#6366f1' }
          ].map((card, idx) => (
            <div key={idx} className="card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '12px' }}>{card.label}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-dark)' }}>{card.value}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{card.sub}</span>
                </div>
              </div>
              <div style={{ padding: '10px', background: `${card.color}15`, borderRadius: '8px' }}>
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Submissions Table Section */}
        <div style={{ 
          background: 'white', 
          border: '1px solid #e2e8f0', 
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden'
        }}>
          {/* Table Header/Filter */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
            <div style={{ position: 'relative', maxWidth: '400px', width: '100%' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="Filter submissions by name or ID..." 
                style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.9rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Risk Level:</span>
              <select 
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', background: 'white', fontSize: '0.9rem' }}
              >
                <option>All Levels</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Student</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Assignment</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Score</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Risk</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Flagged Source</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {reports
                  .filter(r => {
                    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.roll_number.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesRisk = riskFilter === "All Levels" || r.risk_level === riskFilter;
                    return matchesSearch && matchesRisk;
                  })
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((submission, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background-color 0.2s' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: '600', color: '#0f172a' }}>{submission.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{submission.roll_number}</div>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '0.9rem', color: '#334155', maxWidth: '200px' }}>{submission.assignment_title}</td>
                    <td style={{ padding: '16px 24px', fontWeight: '700', color: '#0f172a' }}>{submission.overall_score}%</td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                        <span style={{ 
                          width: '8px', height: '8px', borderRadius: '50%', 
                          background: submission.risk_level === 'High' ? '#ef4444' : submission.risk_level === 'Medium' ? '#f59e0b' : '#10b981' 
                        }} />
                        {submission.risk_level}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600',
                        background: submission.status === 'Flagged' ? '#fee2e2' : submission.status === 'Review' ? '#e0e7ff' : '#dcfce7',
                        color: submission.status === 'Flagged' ? '#991b1b' : submission.status === 'Review' ? '#3730a3' : '#166534'
                      }}>
                        {submission.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '0.85rem', color: '#64748b' }}>
                      {submission.flagged_phrases.length > 0 ? `${submission.flagged_phrases[0].substring(0, 30)}...` : '-'}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveReport(submission);
                          setShowModal(true);
                        }}
                        style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#0f172a', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600' }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalSubmissions)} to {Math.min(currentPage * itemsPerPage, totalSubmissions)} of {totalSubmissions} entries
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: currentPage === 1 ? '#cbd5e1' : '#0f172a', fontSize: '0.85rem', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                Previous
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(Math.ceil(totalSubmissions / itemsPerPage), p + 1))}
                disabled={currentPage === Math.ceil(totalSubmissions / itemsPerPage)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: currentPage === Math.ceil(totalSubmissions / itemsPerPage) ? '#cbd5e1' : '#0f172a', fontSize: '0.85rem', cursor: currentPage === Math.ceil(totalSubmissions / itemsPerPage) ? 'not-allowed' : 'pointer' }}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        </div>

        {/* Modal Portal - Custom Professional Dashboard Design */}
        <AnimatePresence>
          {showModal && activeReport && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  backdropFilter: 'blur(8px)'
                }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '900px',
                  maxHeight: '92vh',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  overflowY: 'auto',
                  zIndex: 10000,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Simplified Top Action Row */}
                <div style={{ padding: '24px 32px 0', textAlign: 'right' }}>
                   <button 
                    onClick={() => setShowModal(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                   >
                     <X size={24} />
                   </button>
                </div>

                <div id="report-content" style={{ padding: '0 40px 40px' }}>
                  {/* Header: Title & Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div>
                      <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
                        {activeReport.assignment_title}
                      </h2>
                      <p style={{ color: '#64748b', fontSize: '1rem' }}>
                        Submitted by <span style={{ fontWeight: '600', color: '#475569' }}>{activeReport.name}</span> · {activeReport.roll_number}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ 
                        padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700',
                        background: activeReport.risk_level === 'High' ? '#fee2e2' : activeReport.risk_level === 'Medium' ? '#fef3c7' : '#dcfce7',
                        color: activeReport.risk_level === 'High' ? '#ef4444' : activeReport.risk_level === 'Medium' ? '#d97706' : '#166534',
                        display: 'flex', alignItems: 'center', gap: '4px'
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }} />
                        {activeReport.risk_level}
                      </span>
                      <span style={{ 
                        padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700',
                        background: '#e0e7ff', color: '#4f46e5'
                      }}>
                        Flagged
                      </span>
                    </div>
                  </div>

                  {/* Metrics Summary Bar */}
                  <div style={{ 
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', 
                    padding: '24px 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9',
                    marginBottom: '32px'
                  }}>
                    <div>
                      <p style={{ fontSize: '0.7rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Similarity Score</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a' }}>{activeReport.overall_score}%</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.7rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Risk Classification</p>
                      <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0f172a' }}>{activeReport.risk_level}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.7rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Review Status</p>
                      <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0f172a' }}>
                        {activeReport.risk_level === 'High' ? 'Requires attention' : activeReport.risk_level === 'Medium' ? 'Review suggested' : 'Original / Clear'}
                      </p>
                    </div>
                  </div>

                  {/* Content Sections */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    
                    {/* Full Submission Text */}
                    <div>
                      <h4 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={16} /> Full Submission Text
                      </h4>
                      <div style={{ 
                        background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #f1f5f9',
                        color: '#475569', lineHeight: '1.6', fontSize: '0.95rem',
                        pageBreakInside: 'avoid'
                      }}>
                        {activeReport.submission_text || "The ethical implications of AI deployment are varied and complex, involving considerations of accountability, transparency, and fairness in algorithmic decision-making."}
                      </div>
                    </div>

                    {/* Flagged Passage */}
                    <div style={{ pageBreakInside: 'avoid' }}>
                      <h4 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle size={16} color="#f59e0b" /> Flagged Passage
                      </h4>
                      <div style={{ 
                        background: '#fffbeb', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #f59e0b',
                        color: '#92400e', lineHeight: '1.6', fontSize: '0.95rem', fontStyle: 'italic', fontWeight: '500',
                        pageBreakInside: 'avoid'
                      }}>
                        "{activeReport.flagged_phrases[0] || "No specific passage flagged."}"
                      </div>
                    </div>

                    {/* Detailed Analysis */}
                    <div>
                      <h4 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Search size={16} color="#4f46e5" /> Detailed Analysis
                      </h4>
                      <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '1rem' }}>
                        Similarity detection indicates that approximately {activeReport.overall_score}% of the content matches existing academic papers. The flagged sections show high verbatim overlap with published sources. Recommended action: Manual review of citations and originality before grading.
                      </p>
                    </div>

                    {/* Suggestions */}
                    {activeReport.suggestions.length > 0 && (
                      <div style={{ pageBreakInside: 'avoid' }}>
                        <h4 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CheckCircle2 size={16} color="#10b981" /> Suggestions
                        </h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0 }}>
                          {activeReport.suggestions.map((sug, i) => (
                            <li key={i} style={{ display: 'flex', gap: '10px', color: '#475569', fontSize: '0.95rem' }}>
                              <span style={{ color: '#10b981', fontWeight: 'bold' }}>•</span> {sug}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  </div>

                  {/* Footer Action Row */}
                  <div style={{ 
                    marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #f1f5f9', 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
                  }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                      Submitted {activeReport.timestamp}
                    </p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                       <button 
                        onClick={handleDownloadPDF}
                        data-html2canvas-ignore="true"
                        style={{
                          padding: '10px 20px', borderRadius: '30px', border: '1px solid #e2e8f0',
                          background: 'white', color: '#0f172a', cursor: 'pointer', fontWeight: '600',
                          fontSize: '0.9rem', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                      >
                        <Download size={18} /> Export PDF
                      </button>
                      <button 
                        onClick={() => setShowModal(false)}
                        data-html2canvas-ignore="true"
                        style={{
                          padding: '10px 32px', borderRadius: '30px', border: 'none',
                          background: '#0f172a', color: 'white', cursor: 'pointer',
                          fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#1e293b'}
                        onMouseOut={(e) => e.target.style.background = '#0f172a'}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>
    );
  };

export default ReportDashboard;
