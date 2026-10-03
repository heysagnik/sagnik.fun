"use client";

import { motion } from "framer-motion";

export default function IDCard() {
  return (
    <div className="relative flex flex-col items-center pt-40">
      <motion.div
        className="relative origin-top"
        initial={{ y: -220, rotate: 0, opacity: 0 }}
        animate={{ y: 0, rotate: [0, 10, -8, 5, -3], opacity: 1 }}
        transition={{
          y: { type: "spring", stiffness: 260, damping: 18, mass: 1 },
          opacity: { duration: 0.2 },
          rotate: { duration: 1.4, times: [0, 0.3, 0.55, 0.78, 1], ease: "easeOut" },
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/about/lanyard-strap.png"
          alt=""
          className="absolute left-1/2 z-[15] top-[-184px] h-[210px] w-[28px] -translate-x-1/2 object-cover drop-shadow-[0_4px_5px_rgba(0,0,0,0.2)] md:top-[-228px] md:h-[254px]"
        />

        <div className="relative z-10 w-[260px] overflow-hidden rounded-[26px] bg-white shadow-[0_20px_40px_-18px_rgba(20,20,20,0.35)]">
          <div className="absolute left-1/2 top-[10px] z-20 h-4 w-12 -translate-x-1/2 rounded-full bg-white shadow-[inset_0_1px_2px_rgba(20,20,20,0.14)]" />

          <div className="relative h-[140px] w-full overflow-hidden bg-gradient-to-br from-[#4c74c2] to-[#3159a3]">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 180 140" preserveAspectRatio="xMidYMid slice">
              <defs>
                <radialGradient id="badge-radial" cx="75%" cy="20%" r="90%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="180" height="140" fill="url(#badge-radial)" />

              <circle cx="132" cy="18" r="34" fill="none" stroke="#ffffff" strokeOpacity="0.16" strokeWidth="1.4" />
              <circle cx="96" cy="46" r="22" fill="none" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="1.4" />
              <circle cx="150" cy="60" r="26" fill="none" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="1.4" />
              <circle cx="60" cy="20" r="16" fill="none" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1.4" />
              <circle cx="118" cy="92" r="30" fill="none" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1.4" />
              <circle cx="160" cy="108" r="18" fill="none" stroke="#ffffff" strokeOpacity="0.32" strokeWidth="1.4" />
              <circle cx="78" cy="78" r="12" fill="none" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.4" />

              <g stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.85">
                <path d="M138 30 L138 44 M131 37 L145 37 M133.5 32.5 L142.5 41.5 M142.5 32.5 L133.5 41.5" />
              </g>
            </svg>
          </div>

          <div className="relative z-20 -mt-11 flex justify-center">
            <div className="relative size-24 overflow-hidden rounded-full bg-white ring-4 ring-white shadow-[0_6px_16px_-6px_rgba(20,20,20,0.35)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/about/profile.png"
                alt="Sagnik"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="relative flex flex-col gap-1.5 px-6 p-8">
            <p className="text-[26px] font-bold leading-none tracking-tight text-[#141414]">Sagnik Sahoo</p>
            <p className="text-[13px] font-normal leading-none text-[#141414]/60">Software Developer</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
