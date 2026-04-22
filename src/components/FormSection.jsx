import React from 'react';
import { motion } from 'framer-motion';

const FormSection = () => {
  return (
    <section id="form-section" style={{ backgroundColor: 'white' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            width: '100%',
            maxWidth: '800px',
            background: 'var(--bg)',
            borderRadius: 'var(--radius-lg)',
            padding: '2px', // Thin border effect
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
          }}
        >
          <div style={{
            background: 'white',
            borderRadius: 'calc(var(--radius-lg) - 2px)',
            padding: '20px',
            minHeight: '800px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--text-dark)' }}>
              Submit Your Work
            </h2>
            <iframe 
              src="https://docs.google.com/forms/d/e/1FAIpQLSfepO2df9By5xC-XZ5Z0BKAoL68LsGwgxTXWJqR5mY2PV-YFQ/viewform?embedded=true" 
              width="100%" 
              height="800" 
              frameBorder="0" 
              marginHeight="0" 
              marginWidth="0"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              Loading…
            </iframe>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FormSection;
