import React, { useState } from 'react';
import { Save, Database, ShieldCheck } from 'lucide-react';

const SettingsView = () => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('System settings updated successfully.');
    }, 1000);
  };

  return (
    <div className="admin-view animate-fade-in">
      <div className="view-header">
        <h2>System Settings</h2>
        <p className="text-muted">Configure security, database backups, and core preferences.</p>
      </div>
      
      <div className="glass" style={{padding: '2rem', borderRadius: '12px', maxWidth: '600px'}}>
        <div className="form-group">
          <label className="flex-center" style={{justifyContent: 'flex-start', gap: '0.5rem'}}>
            <ShieldCheck size={18} className="text-primary" /> Require 2FA for Admins
          </label>
          <select className="input-field">
            <option>Enabled</option>
            <option>Disabled</option>
          </select>
        </div>
        
        <div className="form-group" style={{marginTop: '1.5rem'}}>
          <label className="flex-center" style={{justifyContent: 'flex-start', gap: '0.5rem'}}>
            <Database size={18} className="text-secondary" /> Auto-Backup Frequency
          </label>
          <select className="input-field">
            <option>Daily at Midnight</option>
            <option>Weekly</option>
            <option>Manual Only</option>
          </select>
        </div>

        <button className="btn btn-primary" onClick={handleSave} disabled={isSaving} style={{marginTop: '1rem', gap: '0.5rem', display: 'flex', alignItems: 'center'}}>
          <Save size={18} /> {isSaving ? 'Saving...' : 'Save Configurations'}
        </button>
      </div>
    </div>
  );
};
export default SettingsView;
