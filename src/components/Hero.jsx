import React from 'react';
import { motion } from 'framer-motion';
import { FileSearch, FileText, ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="hero-section" style={{ 
      background: 'linear-gradient(135deg, #FFF4E6 0%, #FFFAF5 100%)',
      padding: '100px 0 60px',
      borderBottom: '1px solid rgba(255, 159, 67, 0.1)'
    }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            style={{ 
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
              color: 'white', 
              padding: '15px', 
              borderRadius: '20px', 
              marginBottom: '20px',
              boxShadow: '0 10px 20px rgba(79, 70, 229, 0.3)'
            }}
          >
            <FileSearch size={40} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'var(--text-dark)' }}
          >
            AI Plagiarism Detection System
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ 
              fontSize: '1.25rem', 
              color: 'var(--text-muted)', 
              maxWidth: '700px', 
              marginBottom: '40px' 
            }}
          >
            "Submit your assignment and get instant originality analysis powered by AI"
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ delay: 0.4 }}
            onClick={() => document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' })}
            style={{
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: 'white',
              borderRadius: 'var(--radius-md)',
              fontSize: '1.1rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)'
            }}
          >
            Submit Assignment <ArrowRight size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
