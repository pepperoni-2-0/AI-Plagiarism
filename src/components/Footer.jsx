import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ 
      padding: '60px 0', 
      backgroundColor: 'white', 
      borderTop: '1px solid var(--bg)',
      textAlign: 'center'
    }}>
      <div className="container">
        <h3 style={{ marginBottom: '15px', color: 'var(--text-dark)' }}>AI Plagiarism Detection System</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '25px', maxWidth: '600px', margin: '0 auto 25px' }}>
          Empowering academic integrity through automated intelligence. A modern solution for students and faculty.
        </p>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '10px',
          color: 'var(--text-muted)',
          fontSize: '0.9rem'
        }}>
          <span>Project by <strong>Capstone Team</strong></span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span>Academic Integrity Tool 2026</span>
        </div>
        <div style={{ marginTop: '30px', color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
          Made with <Heart size={14} fill="var(--danger)" color="var(--danger)" /> for Better Education
        </div>
      </div>
    </footer>
  );
};

export default Footer;
