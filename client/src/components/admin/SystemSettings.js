import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  Cog6ToothIcon,
  BellIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  CloudIcon,
  CircleStackIcon,
  ServerIcon,
  KeyIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      systemAlerts: true,
      maintenanceAlerts: true,
      securityAlerts: true
    },
    security: {
      passwordExpiry: 90,
      sessionTimeout: 30,
      maxLoginAttempts: 5
    },
    system: {
      maintenanceMode: false,
      debugMode: false,
      logLevel: 'info',
      backupFrequency: 'daily'
    }
  });

  const [loading, setLoading] = useState(true);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }

      const data = await response.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = async (category, setting, value) => {
    try {
      setSettings(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [setting]: value
        }
      }));

      const response = await fetch('http://localhost:5000/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          category,
          setting,
          value
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update setting');
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Setting updated successfully');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error('Failed to update setting');
      // Revert the change
      fetchSettings();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#050505]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#050505] py-8 px-4"
    >
      <motion.div variants={itemVariants} className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#111111] via-[#1a1a1a] to-[#111111] rounded-2xl shadow-2xl p-8 border border-gray-800">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Cog6ToothIcon className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">System Settings</h1>
              <p className="text-gray-400">Configure and manage system preferences</p>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <motion.div variants={itemVariants} className="bg-[#111] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <BellIcon className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Notification Settings</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-gray-300 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={value}
                    onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Security Settings */}
        <motion.div variants={itemVariants} className="bg-[#111] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mr-4">
                <ShieldCheckIcon className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Security Settings</h3>
                <p className="text-gray-400 text-sm mt-1">Configure system security parameters</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Password Expiry */}
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">
                  <KeyIcon className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <label className="text-white text-sm font-medium block">Password Expiry</label>
                  <p className="text-gray-400 text-xs">Days until password reset required</p>
                </div>
              </div>
              <input
                type="number"
                min="1"
                max="365"
                value={settings.security.passwordExpiry}
                onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
                className="mt-2 block w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Session Timeout */}
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                  <ClockIcon className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <label className="text-white text-sm font-medium block">Session Timeout</label>
                  <p className="text-gray-400 text-xs">Minutes until automatic logout</p>
                </div>
              </div>
              <input
                type="number"
                min="5"
                max="240"
                value={settings.security.sessionTimeout}
                onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                className="mt-2 block w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Max Login Attempts */}
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800 md:col-span-2">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center mr-3">
                  <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <label className="text-white text-sm font-medium block">Max Login Attempts</label>
                  <p className="text-gray-400 text-xs">Number of failed attempts before account lockout</p>
                </div>
              </div>
              <input
                type="number"
                min="3"
                max="10"
                value={settings.security.maxLoginAttempts}
                onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                className="mt-2 block w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </motion.div>

        {/* System Settings */}
        <motion.div variants={itemVariants} className="bg-[#111] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <ServerIcon className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-white">System Settings</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(settings.system).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-gray-300 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                {typeof value === 'boolean' ? (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={value}
                      onChange={(e) => handleSettingChange('system', key, e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                ) : (
                  <select
                    value={value}
                    onChange={(e) => handleSettingChange('system', key, e.target.value)}
                    className="bg-[#1a1a1a] border border-gray-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    {key === 'logLevel' ? (
                      <>
                        <option value="info">Info</option>
                        <option value="warn">Warning</option>
                        <option value="error">Error</option>
                        <option value="debug">Debug</option>
                      </>
                    ) : (
                      <>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </>
                    )}
                  </select>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SystemSettings;