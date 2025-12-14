import React, { useState, useEffect } from 'react';
import { ProductionRecord, User } from '../types';
import { TASKS_WITH_TIME, TEAMS, FREQUENCIES } from '../constants';
import { v4 as uuidv4 } from 'uuid';

interface DataEntryFormProps {
  currentUser: User;
  onAddRecord: (record: ProductionRecord) => void;
}

export const DataEntryForm: React.FC<DataEntryFormProps> = ({ currentUser, onAddRecord }) => {
  const [formData, setFormData] = useState<Partial<ProductionRecord>>({
    processName: TASKS_WITH_TIME[0].name,
    team: TEAMS[0],
    frequency: FREQUENCIES[0],
    totalUtilization: 0,
    completedDate: new Date().toISOString().split('T')[0],
    count: 1,
    remarks: ''
  });

  const [isTimeCustom, setIsTimeCustom] = useState(false);
  
  // Effect to update utilization when task or count changes
  useEffect(() => {
    const selectedTaskName = formData.processName;
    const selectedTask = TASKS_WITH_TIME.find(t => t.name === selectedTaskName);
    const count = Number(formData.count) || 0;
    
    if (selectedTask) {
      const taskTime = selectedTask.time;
      if (taskTime === 'runtime') {
        setIsTimeCustom(true);
        // For runtime tasks, utilization is manually entered, so we don't multiply by count.
        // We could either leave it as is, or reset to 0. Resetting is safer.
        setFormData(prev => ({...prev, totalUtilization: 0}));
      } else {
        setIsTimeCustom(false);
        // The time is fixed, so we calculate it based on count.
        const newUtilization = parseFloat((taskTime * count).toFixed(2));
        setFormData(prev => ({ ...prev, totalUtilization: newUtilization }));
      }
    }
  }, [formData.processName, formData.count]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation: Utilization
    const util = Number(formData.totalUtilization);
    if (util <= 0) {
      alert("Error: Total Utilization must be greater than 0.");
      return;
    }

    const finalProcess = formData.processName;
    
    // Since we merged, we set both processName and task to the same value to maintain compatibility with charts/schema
    const finalTask = finalProcess; 

    if (!finalProcess || !formData.team) {
        alert("Please fill in all required fields.");
        return;
    }

    const newRecord: ProductionRecord = {
      id: uuidv4(),
      userId: currentUser.id,
      userName: currentUser.name,
      processName: finalProcess,
      team: formData.team!,
      task: finalTask!,
      frequency: formData.frequency || 'Daily',
      totalUtilization: util,
      completedDate: formData.completedDate || new Date().toISOString().split('T')[0],
      count: Number(formData.count),
      remarks: formData.remarks || ''
    };

    onAddRecord(newRecord);
    
    // Reset form safely
    setFormData(prev => ({
      ...prev,
      totalUtilization: 0,
      count: 1,
      remarks: ''
    }));
  };

  const inputClass = "mt-1 block w-full rounded-lg bg-mac-bg border-mac-border text-white shadow-sm focus:border-mac-accent focus:ring-mac-accent sm:text-sm p-2.5 border placeholder-gray-500 transition-colors appearance-none";
  const labelClass = "block text-sm font-medium text-gray-400";

  return (
    <div className="glass shadow-lg rounded-xl p-6 border border-mac-border/50">
      <h3 className="text-lg font-semibold leading-6 text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
        New Production Entry
      </h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div>
          <label className={labelClass}>Task Name</label>
          <select
            value={formData.processName}
            onChange={e => setFormData({...formData, processName: e.target.value})}
            className={inputClass}
          >
            {TASKS_WITH_TIME.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Team</label>
          <select
            value={formData.team}
            onChange={e => setFormData({...formData, team: e.target.value})}
            className={inputClass}
          >
            {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Frequency</label>
          <select
            value={formData.frequency}
            onChange={e => setFormData({...formData, frequency: e.target.value})}
            className={inputClass}
          >
            {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Total Utilization (Decimal Hours)</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            max="8"
            required
            readOnly={!isTimeCustom}
            value={formData.totalUtilization}
            onChange={e => isTimeCustom && setFormData({...formData, totalUtilization: parseFloat(e.target.value)})}
            className={`${inputClass} ${!isTimeCustom ? 'bg-mac-surface cursor-not-allowed opacity-70' : ''}`}
          />
          <p className="text-xs text-gray-500 mt-1">
            {isTimeCustom ? 'Enter a value between 0.01 and 8.0' : 'Time is auto-calculated for this task.'}
          </p>
        </div>

        <div>
          <label className={labelClass}>Completed Date</label>
          <input
            type="date"
            required
            value={formData.completedDate}
            onChange={e => setFormData({...formData, completedDate: e.target.value})}
            className={inputClass}
            style={{colorScheme: 'dark'}}
          />
        </div>

        <div>
          <label className={labelClass}>Count</label>
          <input
            type="number"
            required
            min="1"
            value={formData.count}
            onChange={e => setFormData({...formData, count: parseInt(e.target.value)})}
            className={inputClass}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Remarks</label>
          <textarea
            value={formData.remarks}
            onChange={e => setFormData({...formData, remarks: e.target.value})}
            className={`${inputClass} h-20`}
            placeholder="Optional comments..."
          />
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center rounded-lg border border-transparent bg-mac-accent py-2.5 px-6 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-mac-accent focus:ring-offset-2 focus:ring-offset-gray-900 transition-all hover:scale-105"
          >
            Save Record
          </button>
        </div>

      </form>
    </div>
  );
};