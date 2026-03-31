import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Users, CalendarDays, TrendingUp, XCircle, Clock } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const { user, isAuthenticated, logout, login, token } = useAuth();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    businessName: user?.businessName || '',
    businessType: user?.businessType || '',
    alias: user?.alias || '',
    openTime: user?.openTime || '09:00',
    closeTime: user?.closeTime || '17:00',
    slotDuration: user?.slotDuration || 60,
  });
  
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [reservations, setReservations] = useState<any[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchReservations();
    }
  }, [isAuthenticated]);

  const fetchReservations = () => {
    api.get('/reservations')
      .then(res => setReservations(res.data))
      .catch(err => console.error('Failed to load reservations', err));
  };

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.put('/profile', profileData);
      login(token!, res.data); // Update context
      setProfileMsg({ type: 'success', text: 'Settings pushed to your public URL!' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    }
  };

  const handleCancel = async (id: string, clientName: string) => {
    if (!window.confirm(`Are you sure you want to completely cancel the reservation for ${clientName}?`)) return;
    try {
      await api.put(`/reservations/${id}/cancel`);
      fetchReservations(); // Reload feed
    } catch (err) {
      console.error(err);
      alert("Failed to cancel reservation.");
    }
  };

  const activeReservations = reservations.filter(r => r.status === 'CONFIRMED');
  
  const todayStart = new Date();
  todayStart.setHours(0,0,0,0);
  const todayEnd = new Date();
  todayEnd.setHours(23,59,59,999);
  
  const rToday = activeReservations.filter(r => new Date(r.startTime) >= todayStart && new Date(r.startTime) <= todayEnd).length;
  const rUpcoming = activeReservations.filter(r => new Date(r.startTime) > todayEnd).length;

  return (
    <div className="w-full mt-4 max-w-7xl mx-auto space-y-8 px-4 pb-12">
      {/* 1. Header Array */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Owner Dashboard</h2>
          {user?.alias && user.alias.trim() !== '' ? (
            <p className="mt-3 text-indigo-700 font-bold bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-lg inline-flex items-center">
              Active Booking Portal: <a href={`/${user.alias}`} target="_blank" rel="noreferrer" className="underline hover:text-indigo-900 ml-2 tracking-wide font-medium">http://localhost:5173/{user.alias}</a>
            </p>
          ) : (
            <p className="mt-3 text-red-600 font-bold bg-red-50 border border-red-100 px-4 py-2 rounded-lg inline-block">
              ⚠️ Incomplete Profile: Save an Alias below to generate your Portal!
            </p>
          )}
        </div>
        <button onClick={logout} className="text-gray-600 hover:text-red-700 font-bold px-6 py-3 rounded-lg border border-gray-200 bg-white hover:bg-red-50 transition shadow-sm">
          Sign out session
        </button>
      </div>
      
      {/* 2. Analytical Engine (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Active Clients</p>
            <h3 className="text-4xl font-black text-gray-900">{activeReservations.length}</h3>
          </div>
          <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
            <Users className="w-7 h-7" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Appointments Today</p>
            <h3 className="text-4xl font-black text-green-600">{rToday}</h3>
          </div>
          <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
            <CalendarDays className="w-7 h-7" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Upcoming Pipelined</p>
            <h3 className="text-4xl font-black text-blue-600">{rUpcoming}</h3>
          </div>
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <TrendingUp className="w-7 h-7" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 3. Settings Control Panel */}
        <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-fit lg:sticky lg:top-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Business Interface</h3>
          {profileMsg.text && (
            <div className={`p-4 rounded-xl mb-6 text-sm font-bold shadow-sm ${profileMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
              {profileMsg.text}
            </div>
          )}
          
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Owner Name</label>
                <input type="text" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition bg-gray-50 focus:bg-white" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Business Name</label>
                <input type="text" value={profileData.businessName} onChange={(e) => setProfileData({...profileData, businessName: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition bg-gray-50 focus:bg-white" placeholder="John's Barbershop" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Service Category</label>
              <input type="text" value={profileData.businessType} onChange={(e) => setProfileData({...profileData, businessType: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition bg-gray-50 focus:bg-white" placeholder="e.g. Barber, Salon, Clinic..." />
            </div>

            <div className="border border-indigo-100 bg-indigo-50/30 p-5 rounded-2xl space-y-5">
              <h4 className="font-bold text-indigo-900 text-sm tracking-wide flex items-center gap-2"><Clock className="w-4 h-4"/> Schedule Configuration</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Open Time</label>
                  <input type="time" value={profileData.openTime} onChange={(e) => setProfileData({...profileData, openTime: e.target.value})} className="w-full px-4 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none bg-white font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Close Time</label>
                  <input type="time" value={profileData.closeTime} onChange={(e) => setProfileData({...profileData, closeTime: e.target.value})} className="w-full px-4 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none bg-white font-medium" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Slot Interval (Minutes)</label>
                <select value={profileData.slotDuration} onChange={(e) => setProfileData({...profileData, slotDuration: parseInt(e.target.value)})} className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none bg-white font-bold text-indigo-900">
                  <option value={30}>30 Minutes</option>
                  <option value={60}>60 Minutes (1 Hour)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Public Directory Alias</label>
              <div className="flex shadow-sm rounded-xl">
                <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-300 bg-gray-100 text-gray-500 font-medium">/</span>
                <input type="text" value={profileData.alias} onChange={(e) => setProfileData({...profileData, alias: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})} className="w-full px-4 py-3 border border-gray-300 rounded-r-xl focus:ring-2 focus:ring-indigo-600 outline-none transition bg-white" placeholder="Unique brand name" />
              </div>
            </div>
            
            <button type="submit" className="w-full bg-indigo-600 text-white font-black tracking-wide py-4 mt-2 rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all custom-shadow">Apply Business Settings</button>
          </form>
        </div>

        {/* 4. Interactive Live Feed */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col h-full min-h-[600px]">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Realtime Booking Log</h3>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {reservations.length === 0 ? (
              <div className="text-center text-gray-400 py-24 flex flex-col items-center bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-xl font-bold mb-2 text-gray-500">Your schedule is wide open!</p>
                <p className="text-sm font-medium">Configure your Business Settings and distribute your URL!</p>
              </div>
            ) : (
              <div className="space-y-5">
                {reservations.map(res => {
                  const isCancelled = res.status === 'CANCELLED';
                  const isPast = new Date(res.startTime) < new Date() && !isCancelled;
                  
                  return (
                    <div key={res.id} className={`bg-white border-2 hover:border-indigo-300 transition-colors rounded-2xl p-6 shadow-sm relative overflow-hidden ${isCancelled ? 'border-gray-200 opacity-60' : 'border-gray-100'}`}>
                      {isCancelled && <div className="absolute top-0 right-0 bg-gray-200 text-gray-500 text-[10px] font-black uppercase px-4 py-1.5 rounded-bl-xl tracking-widest">Cancelled</div>}
                      
                      <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-4">
                        <div>
                          <h4 className={`font-black text-xl flex items-center gap-2 ${isCancelled ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{res.clientName}</h4>
                          {res.clientEmail && (
                            <a href={`mailto:${res.clientEmail}`} className="text-sm text-indigo-500 hover:text-indigo-700 hover:underline font-medium mt-1 inline-block">{res.clientEmail}</a>
                          )}
                        </div>
                        
                        {!isCancelled && !isPast && (
                          <div className="flex flex-col items-end gap-2">
                            <span className="bg-indigo-100 text-indigo-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">Upcoming</span>
                            <button onClick={() => handleCancel(res.id, res.clientName)} className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center leading-none mt-1">
                              <XCircle className="w-3.5 h-3.5 mr-1" /> Terminate
                            </button>
                          </div>
                        )}
                        {!isCancelled && isPast && (
                          <span className="bg-green-100 text-green-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">Completed</span>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 bg-gray-50/80 p-4 rounded-xl">
                        <div className="text-sm flex flex-col">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Assigned Date</span> 
                          <span className="font-bold text-gray-800">{new Date(res.startTime).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="text-sm flex flex-col">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Time Block</span> 
                          <div className="font-bold text-indigo-700 bg-indigo-100/50 px-2 py-0.5 rounded-md inline-block">
                            {new Date(res.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(res.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
