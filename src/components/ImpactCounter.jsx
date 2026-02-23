import React, { useState, useEffect } from 'react';

const ImpactCounter = () => {
  const [counts, setCounts] = useState({
    birthsPrevented: 0,
    yearsActive: 0
  });

  const targets = {
    birthsPrevented: 8010, // Conservative estimate: 30 births prevented per cat over lifetime
    yearsActive: 15
  };

  useEffect(() => {
    const duration = 2500; // Animation duration in ms
    const steps = 60; // Number of animation steps
    const interval = duration / steps;

    const timer = setInterval(() => {
      setCounts(prevCounts => {
        const newCounts = { ...prevCounts };
        let allComplete = true;

        Object.keys(targets).forEach(key => {
          if (newCounts[key] < targets[key]) {
            const increment = Math.max(1, Math.ceil((targets[key] - newCounts[key]) / 10));
            newCounts[key] = Math.min(newCounts[key] + increment, targets[key]);
            allComplete = false;
          }
        });

        if (allComplete) {
          clearInterval(timer);
        }

        return newCounts;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Community Impact
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Every cat we help creates a ripple effect of positive change in our community. 
            Here's the difference we're making together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Births Prevented */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center transform hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div className="text-4xl font-bold text-green-700 mb-2">
              {counts.birthsPrevented.toLocaleString()}+
            </div>
            <div className="text-gray-600 font-semibold mb-1">Births Prevented</div>
            <div className="text-sm text-gray-500">Over Cat Lifetimes</div>
          </div>

          {/* Years Active */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center transform hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M19.03,7.39L20.45,5.97C20,5.46 19.55,5 19.04,4.56L17.62,6C16.07,4.74 14.12,4 12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22C17,22 21,17.97 21,13C21,10.88 20.26,8.93 19.03,7.39M11,14H13V8H11M15,1H9V3H15V1Z"/>
              </svg>
            </div>
            <div className="text-4xl font-bold text-purple-700 mb-2">
              {counts.yearsActive}+
            </div>
            <div className="text-gray-600 font-semibold mb-1">Years Active</div>
            <div className="text-sm text-gray-500">Serving Brooks County</div>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Every Cat Matters 🐱
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Each spay and neuter procedure prevents exponential population growth while improving the health 
              and quality of life for community cats. Together with our volunteers and supporters, we're 
              creating a more humane future for feral and stray cats in Brooks County, Georgia.
            </p>
            <div className="mt-4 inline-flex items-center text-rust-600 font-medium">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              Made with love for our community cats
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-rust-100 { background-color: #fef7f0; }
        .bg-rust-600 { background-color: #dc2626; }
        .text-rust-600 { color: #dc2626; }
        .text-rust-700 { color: #b91c1c; }
      `}</style>
    </section>
  );
};

export default ImpactCounter;