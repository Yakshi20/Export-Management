import { useState, useEffect } from 'react';
import api from '../api/axios';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';
import LoadingSpinner from './ui/LoadingSpinner';
import Toast from './ui/Toast';

export default function Profile({ role }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [mobile, setMobile] = useState('');
  const [saving, setSaving] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    api.get(`/${role}/profile`).then(r => {
      setProfile(r.data);
      setMobile(r.data.mobile || '');
    }).catch(() => {}).finally(() => setLoading(false));
  }, [role]);

  const saveMobile = async () => {
    setSaving(true);
    try {
      await api.patch(`/${role}/profile`, { mobile });
      setToast({ message: 'Profile updated!', type: 'success' });
      setEditing(false);
    } catch { setToast({ message: 'Failed to update', type: 'error' }); }
    setSaving(false);
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) { setToast({ message: 'Passwords do not match', type: 'error' }); return; }
    setPwLoading(true);
    try {
      await api.post(`/${role}/change-password`, { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setToast({ message: 'Password changed!', type: 'success' });
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch { setToast({ message: 'Failed to change password', type: 'error' }); }
    setPwLoading(false);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <h1 className="text-2xl font-bold text-white">Profile</h1>
      <Card>
        <h2 className="text-lg font-semibold mb-4">Account Information</h2>
        {profile && (
          <div className="space-y-3">
            {Object.entries(profile).filter(([k]) => !['password', '__v', '_id'].includes(k)).map(([k, v]) => (
              <div key={k} className="flex gap-3">
                <span className="text-[#a8b2d8] capitalize w-40">{k.replace(/([A-Z])/g, ' $1')}:</span>
                <span className="text-white">{String(v)}</span>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 flex gap-3 items-end">
          {editing ? (
            <>
              <Input label="Mobile" value={mobile} onChange={e => setMobile(e.target.value)} />
              <Button onClick={saveMobile} loading={saving}>Save</Button>
              <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
            </>
          ) : (
            <Button variant="secondary" onClick={() => setEditing(true)}>Edit Mobile</Button>
          )}
        </div>
      </Card>
      <Card>
        <h2 className="text-lg font-semibold mb-4">Change Password</h2>
        <form onSubmit={changePassword} className="space-y-3">
          <Input label="Current Password" type="password" value={pwForm.currentPassword} onChange={e => setPwForm({...pwForm, currentPassword: e.target.value})} required />
          <Input label="New Password" type="password" value={pwForm.newPassword} onChange={e => setPwForm({...pwForm, newPassword: e.target.value})} required />
          <Input label="Confirm Password" type="password" value={pwForm.confirmPassword} onChange={e => setPwForm({...pwForm, confirmPassword: e.target.value})} required />
          <Button type="submit" loading={pwLoading}>Change Password</Button>
        </form>
      </Card>
    </div>
  );
}
