import React from 'react';
import { motion } from 'framer-motion';
import { FileUp, Cpu, FileCheck } from 'lucide-react';

const steps = [
  {
    icon: <FileUp size={32} />,
    title: "Step 1: Submit",
    description: "Upload your assignment via the secure Google Form.",
    color: "#FF9F43"
  },
  {
    icon: <Cpu size={32} />,
    title: "Step 2: Analyze",
    description: "AI analyzes the text using our custom n8n workflow.",
    color: "#FECA57"
  },
  {
    icon: <FileCheck size={32} />,
    title: "Step 3: Report",
    description: "Gain instant insights and a detailed originality score.",
    color: "#1DD1A1"
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" style={{ backgroundColor: '#FFFAF5' }}>
      <div className="container">
        <h2 style={{ textAlign: 'center', marginBottom: '50px', fontSize: '2.5rem' }}>How It Works</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '30px' 
        }}>
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="card"
              style={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '15px',
                border: '1px solid rgba(255, 159, 67, 0.1)'
              }}
            >
              <div style={{
                background: `${step.color}20`,
                color: step.color,
                padding: '20px',
                borderRadius: '50%',
                marginBottom: '10px'
              }}>
                {step.icon}
              </div>
              <h3 style={{ fontSize: '1.5rem' }}>{step.title}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
