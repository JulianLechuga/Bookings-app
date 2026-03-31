import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { CalendarCheck, ShieldCheck, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

const Home = () => {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reservations/public/businesses')
      .then(res => {
        setBusinesses(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load businesses', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col w-full bg-white">
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center">
          <span className="bg-indigo-500/30 border border-indigo-400/50 text-indigo-100 px-5 py-2.5 rounded-full text-xs font-black tracking-widest uppercase mb-8 shadow-sm">
            Launch your scheduling platform
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight max-w-4xl">
            The Only Booking System <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">You'll Ever Need.</span>
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100/90 font-medium mb-12 max-w-3xl leading-relaxed">
            Empower your business with collision-free scheduling, beautifully custom booking pages, and intelligent operational dashboards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link to="/register" className="bg-white text-indigo-900 px-8 py-4 rounded-xl font-black text-lg hover:bg-indigo-50 hover:scale-105 transition-all duration-300 shadow-2xl flex items-center justify-center">
              Start for Free <ArrowRight className="ml-2 w-5 h-5"/>
            </Link>
            <a href="#directory" className="bg-indigo-800/50 border border-indigo-500/50 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700/50 transition-all flex items-center justify-center backdrop-blur-sm">
              Explore Partners
            </a>
          </div>
        </div>
      </section>

      {/* 2. Value Proposition Grid */}
      <section className="py-24 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Enterprise Features out of the Box</h2>
            <p className="text-xl text-gray-500 mt-4 font-medium">Everything you need to run your business scheduling on autopilot.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-start hover:-translate-y-1 transition-transform">
              <div className="bg-blue-100 text-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8"/>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Collision Avoidance</h3>
              <p className="text-gray-600 font-medium leading-relaxed">Our Smart Availability Engine guarantees 0% double-booking rates. Selected times disappear instantly across all screens.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-start hover:-translate-y-1 transition-transform">
              <div className="bg-indigo-100 text-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <CalendarCheck className="w-8 h-8"/>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Custom Schedules</h3>
              <p className="text-gray-600 font-medium leading-relaxed">You control your pipeline. Set your exact working hours via the Dashboard and dictate exactly whether open slots should be 30 or 60 minutes.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-start hover:-translate-y-1 transition-transform">
              <div className="bg-emerald-100 text-emerald-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8"/>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Instant Portals</h3>
              <p className="text-gray-600 font-medium leading-relaxed">No coding necessary. Claim your vanity URL alias upon registration and instantly distribute a premium, dedicated booking interface to new clients.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Pricing Mock Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-500 mt-4 font-medium">Scale your business seamlessly as you grow your revenue.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free */}
            <div className="border border-gray-200 rounded-3xl p-10 shadow-sm flex flex-col">
              <h3 className="text-2xl font-black text-gray-900 mb-2">Starter</h3>
              <p className="text-gray-500 font-medium mb-6">Perfect for solo entrepreneurs starting out.</p>
              <div className="text-6xl font-black text-gray-900 mb-8">$0<span className="text-xl text-gray-400 font-bold tracking-normal">/mo</span></div>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center text-gray-700 font-medium"><CheckCircle2 className="w-6 h-6 text-green-500 mr-3 shrink-0"/> Up to 50 active bookings / mo</li>
                <li className="flex items-center text-gray-700 font-medium"><CheckCircle2 className="w-6 h-6 text-green-500 mr-3 shrink-0"/> Custom Generated URL Alias</li>
                <li className="flex items-center text-gray-700 font-medium"><CheckCircle2 className="w-6 h-6 text-green-500 mr-3 shrink-0"/> Standard Email Support</li>
              </ul>
              <Link to="/register" className="w-full py-4 rounded-xl bg-gray-900 text-white text-center font-bold hover:bg-gray-800 transition">Get Started for Free</Link>
            </div>
            {/* Pro */}
            <div className="border border-indigo-200 bg-indigo-50/80 rounded-3xl p-10 shadow-lg flex flex-col relative transform md:-translate-y-4">
              <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-black uppercase tracking-widest px-5 py-2 rounded-full shadow-lg">Most Popular</div>
              <h3 className="text-2xl font-black text-indigo-900 mb-2">Professional</h3>
              <p className="text-indigo-600/80 font-medium mb-6">For growing teams and scaling clinics.</p>
              <div className="text-6xl font-black text-indigo-900 mb-8">$29<span className="text-xl text-indigo-400 font-bold tracking-normal">/mo</span></div>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center text-indigo-900 font-bold"><CheckCircle2 className="w-6 h-6 text-indigo-500 mr-3 shrink-0"/> Unlimited Monthly Bookings</li>
                <li className="flex items-center text-indigo-900 font-bold"><CheckCircle2 className="w-6 h-6 text-indigo-500 mr-3 shrink-0"/> Custom Schedule Parameters</li>
                <li className="flex items-center text-indigo-900 font-bold"><CheckCircle2 className="w-6 h-6 text-indigo-500 mr-3 shrink-0"/> Automated Email Reminders</li>
                <li className="flex items-center text-indigo-900 font-bold"><CheckCircle2 className="w-6 h-6 text-indigo-500 mr-3 shrink-0"/> 24/7 Priority Support SLAs</li>
              </ul>
              <Link to="/register" className="w-full py-4 rounded-xl bg-indigo-600 text-white text-center font-bold text-lg hover:bg-indigo-700 hover:shadow-xl transition-all">Upgrade to Professional</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Partner Showcase (Old Directory) */}
      <section id="directory" className="py-24 bg-gray-900 text-white border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-800 pb-8">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-black tracking-tight mb-4 text-white">Discover Our Partners</h2>
              <p className="text-xl text-gray-400 font-medium">Browse our exclusive directory of amazing businesses actively using the SaaS platform right now. Click on any card to view their custom-generated smart portal.</p>
            </div>
            <span className="text-sm font-bold text-indigo-400 bg-indigo-900/40 px-5 py-2.5 rounded-xl mt-6 md:mt-0 border border-indigo-800/50 block w-fit shrink-0">{businesses.length} partner(s) actively powered</span>
          </div>
          
          {loading ? (
            <div className="text-center p-16 text-indigo-400 font-medium animate-pulse text-xl">Loading global network...</div>
          ) : businesses.length === 0 ? (
            <div className="bg-gray-800/30 border-2 border-dashed border-gray-700/50 rounded-3xl p-16 text-center text-gray-400">
              <h3 className="text-2xl font-bold text-white mb-2">The Directory is empty</h3>
              <p className="text-lg">Be the first business to claim your spot on the marketplace by registering above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {businesses.map(biz => (
                <Link 
                  key={biz.id} 
                  to={`/${biz.alias}`}
                  className="bg-gray-800/80 border border-gray-700/80 rounded-3xl p-8 hover:border-indigo-500 hover:bg-gray-800 transition-all duration-300 group flex flex-col shadow-lg hover:shadow-indigo-900/20"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center font-black text-3xl mb-6 shadow-md border border-indigo-400/50">
                    {biz.businessName?.[0]?.toUpperCase() || biz.name?.[0]?.toUpperCase() || 'B'}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{biz.businessName || biz.name}</h3>
                  {biz.businessType && <p className="text-sm text-indigo-400 font-bold tracking-widest uppercase mb-6">{biz.businessType}</p>}
                  
                  <div className="mt-auto pt-6 border-t border-gray-700/50 flex items-center justify-between font-bold text-gray-400 group-hover:text-indigo-400 transition-colors">
                    <span>View Booking Portal</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
