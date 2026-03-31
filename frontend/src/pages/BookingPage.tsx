import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User as UserIcon, Mail, CheckCircle, ArrowLeft } from 'lucide-react';
import api from '../services/api';

const BookingPage = () => {
  const { alias } = useParams<{ alias: string }>();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking selections
  const [date, setDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState<{ time: string; booked: boolean }[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  
  // Client details
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [bookingStatus, setBookingStatus] = useState<{type: string, msg: string} | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // 1. Fetch Business Profile
  useEffect(() => {
    api.get(`/reservations/public/${alias}`)
      .then(res => {
        setBusiness(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Business not found');
        setLoading(false);
      });
  }, [alias]);

  // 2. Fetch Slots Availability on Date Change
  useEffect(() => {
    if (!date) return;
    setSlotsLoading(true);
    setSelectedSlot(null);
    setBookingStatus(null);
    
    api.get(`/reservations/public/${alias}/availability?date=${date}`)
      .then(res => {
        const bookedTimes = res.data; // array of { start: ISO, end: ISO }
        
        // Generate dynamic daily slots using business settings
        const openStr = business?.openTime || '09:00';
        const closeStr = business?.closeTime || '17:00';
        const intervalMins = business?.slotDuration || 60;

        const parseTime = (ts: string) => { const [h,m] = ts.split(':'); return parseInt(h)*60 + parseInt(m); };
        
        let currentMins = parseTime(openStr);
        const endMins = parseTime(closeStr);

        const slots = [];
        while (currentMins + intervalMins <= endMins) {
          const h = Math.floor(currentMins / 60).toString().padStart(2, '0');
          const m = (currentMins % 60).toString().padStart(2, '0');
          const timeString = `${h}:${m}`;
          
          // Strict Date object for this intended local time slot
          const slotStart = new Date(`${date}T${timeString}:00`);
          const slotEnd = new Date(slotStart.getTime() + intervalMins * 60 * 1000);
          
          let isBooked = false;
          // overlap formula
          for (const b of bookedTimes) {
            const bStart = new Date(b.start);
            const bEnd = new Date(b.end);
            if (slotStart < bEnd && slotEnd > bStart) {
              isBooked = true;
              break;
            }
          }
          
          slots.push({ time: timeString, booked: isBooked, duration: intervalMins });
          currentMins += intervalMins;
        }
        setAvailableSlots(slots);
        setSlotsLoading(false);
      })
      .catch(err => {
        console.error("Failed fetching slots", err);
        setSlotsLoading(false);
      });
  }, [date, alias]);

  // 3. Submit Reservation
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !date) return;
    
    setBookingStatus(null);
    const intervalMins = business?.slotDuration || 60;
    const startObj = new Date(`${date}T${selectedSlot}:00`);
    const endObj = new Date(startObj.getTime() + intervalMins * 60 * 1000);

    try {
      await api.post(`/reservations/public/${alias}/book`, {
        clientName,
        clientEmail,
        startTime: startObj.toISOString(),
        endTime: endObj.toISOString()
      });
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 4000);
    } catch (err: any) {
      setBookingStatus({ type: 'error', msg: err.response?.data?.message || 'Failed to book appointment' });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-400 text-xl animate-pulse">Loading scheduling engine...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600 text-2xl font-bold bg-red-50">{error}</div>;

  const today = new Date().toISOString().split('T')[0];
  const formatTimeDisplay = (timeStr: string) => {
    const [h, m] = timeStr.split(':');
    let hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${m} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12 px-4 sm:px-6 flex flex-col items-center relative">
      <button 
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center gap-2 text-gray-600 hover:text-indigo-700 font-bold bg-white px-5 py-2.5 rounded-full border border-gray-200 shadow-sm transition hover:shadow-md hover:scale-105 active:scale-95"
      >
        <ArrowLeft className="w-4 h-4"/> Back to Directory
      </button>

      {/* Container bounds */}
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100 mt-12 sm:mt-8">
        
        {/* Left Side: Business Card Info */}
        <div className="w-full md:w-1/3 bg-gray-50 p-8 md:border-r border-gray-100 flex flex-col relative">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center text-3xl font-black mb-6 shadow-sm border border-indigo-200">
            {business.businessName?.[0]?.toUpperCase() || business.name?.[0]?.toUpperCase() || 'B'}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
            {business.businessName || business.name}
          </h1>
          {business.businessType && (
            <p className="text-sm text-indigo-600 font-semibold tracking-wide uppercase mb-8">
              {business.businessType}
            </p>
          )}

          <div className="space-y-4 text-gray-600 font-medium">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <span>{business.slotDuration || 60} min sessions</span>
            </div>
            {date && (
              <div className="flex items-center gap-3 text-indigo-700 font-bold bg-indigo-50 p-3 rounded-lg border border-indigo-100 mt-4 transition-all">
                <Calendar className="w-5 h-5" />
                <span>
                  {new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric'})}
                  {selectedSlot && ` @ ${formatTimeDisplay(selectedSlot)}`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Interactive App flow */}
        <div className="w-full md:w-2/3 p-8 sm:p-10 relative">
          
          {isSuccess ? (
            // Success Screen Overlay
            <div className="h-full w-full flex flex-col items-center justify-center text-center py-8 animate-in fade-in zoom-in duration-300">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <CheckCircle className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">You are scheduled</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-sm">
                A calendar invitation has been sent to your email address.
              </p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 w-full text-left space-y-3 mb-8 shadow-sm">
                <div className="text-gray-900 font-bold text-lg mb-1">{business.businessName || business.name}</div>
                <div className="text-gray-600 flex items-center gap-2"><Calendar className="w-4 h-4"/> {new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                {selectedSlot && (() => {
                  const end = new Date(new Date(`${date}T${selectedSlot}:00`).getTime() + (business.slotDuration || 60) * 60 * 1000);
                  const endStr = `${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;
                  return <div className="text-gray-600 flex items-center gap-2"><Clock className="w-4 h-4"/> {formatTimeDisplay(selectedSlot)} - {formatTimeDisplay(endStr)}</div>
                })()}
              </div>

              <p className="text-sm font-bold text-indigo-500 animate-pulse mt-4">Redirecting you back to the directory...</p>

              <button onClick={() => navigate('/')} className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center mt-6">
                 <ArrowLeft className="w-4 h-4 mr-2" /> Return immediately
              </button>
            </div>
          ) : (
            
            // Standard Booking Engine
            <div className="animate-in fade-in duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Date & Time</h2>
              
              {bookingStatus && (
                <div className={`p-4 rounded-xl mb-6 font-medium text-center ${bookingStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                  {bookingStatus.msg}
                </div>
              )}

              <form onSubmit={handleBooking} className="space-y-8">
                
                {/* Section 1: Date & Availability Grid */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">1. Pick a Date</label>
                  <input 
                    type="date" 
                    min={today}
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full md:w-1/2 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition shadow-sm mb-6"
                  />
                  
                  {date && (
                    <div className="mt-2">
                      <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Available Times</label>
                      {slotsLoading ? (
                        <div className="text-indigo-600 animate-pulse font-medium">Fetching availability...</div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {availableSlots.map((slot) => (
                            <button
                              key={slot.time}
                              type="button"
                              disabled={slot.booked}
                              onClick={() => setSelectedSlot(slot.time)}
                              className={`
                                py-3 px-4 rounded-xl font-semibold border transition-all text-sm
                                ${slot.booked 
                                  ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60' 
                                  : selectedSlot === slot.time 
                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md transform scale-[1.02]' 
                                    : 'bg-white border-indigo-200 text-indigo-700 hover:border-indigo-600 hover:shadow-sm'
                                }
                              `}
                            >
                              {formatTimeDisplay(slot.time)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Section 2: Details (Only visible if slot selected) */}
                {selectedSlot && (
                  <div className="pt-8 border-t border-gray-100 animate-in slide-in-from-bottom-4 fade-in duration-300">
                    <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">2. Your Details</label>
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <UserIcon className="w-5 h-5"/>
                        </div>
                        <input 
                          type="text" 
                          required
                          placeholder="Your full name"
                          value={clientName}
                          onChange={e => setClientName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition shadow-sm"
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Mail className="w-5 h-5"/>
                        </div>
                        <input 
                          type="email" 
                          placeholder="Email address (optional)"
                          value={clientEmail}
                          onChange={e => setClientEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition shadow-sm"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full bg-indigo-600 text-white font-extrabold text-lg py-4 rounded-xl hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all mt-8 transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Confirm Booking ({business?.slotDuration || 60} min)
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
