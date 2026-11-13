import React from 'react';

/**
 * Photorealistic vector rendering of Arduino Uno R3 and ESP32 DevKit
 * with transparent backgrounds, authentic component labels, and glowing circuitry.
 */
export default function HeroElectronicsVisual() {
  return (
    <div className="hero-boards-stage">
      {/* Ambient Glows */}
      <div className="hero-glow-cyan" aria-hidden="true" />
      <div className="hero-glow-blue" aria-hidden="true" />

      {/* Floating Circuit Traces with Cyan Nodes */}
      <svg className="hero-circuit-traces" viewBox="0 0 600 500" fill="none" aria-hidden="true">
        <path d="M 50 180 L 140 180 L 190 230 L 280 230" stroke="#00E5FF" strokeWidth="1.5" strokeOpacity="0.35" strokeDasharray="4 4" />
        <path d="M 320 80 L 400 80 L 450 130 L 540 130" stroke="#38BDF8" strokeWidth="1.5" strokeOpacity="0.4" />
        <path d="M 450 130 L 450 250 L 510 310" stroke="#00E5FF" strokeWidth="1.2" strokeOpacity="0.3" />
        <path d="M 120 380 L 220 380 L 270 330 L 390 330" stroke="#38BDF8" strokeWidth="1.5" strokeOpacity="0.35" />
        <path d="M 280 440 L 360 440 L 410 390 L 480 390" stroke="#00E5FF" strokeWidth="1.2" strokeOpacity="0.25" strokeDasharray="6 4" />
        
        {/* Circuit Nodes */}
        <circle cx="50" cy="180" r="3.5" fill="#00E5FF" fillOpacity="0.8" />
        <circle cx="280" cy="230" r="3" fill="#00E5FF" />
        <circle cx="320" cy="80" r="3.5" fill="#38BDF8" />
        <circle cx="540" cy="130" r="3" fill="#00E5FF" />
        <circle cx="510" cy="310" r="3.5" fill="#38BDF8" />
        <circle cx="120" cy="380" r="3" fill="#00E5FF" />
        <circle cx="480" cy="390" r="3" fill="#00E5FF" />
      </svg>

      {/* ─── Board 1: Arduino Uno R3 (Top Left / Angled) ───────────────────── */}
      <div className="hero-board-wrapper board-arduino">
        <div className="board-reflection" />
        <svg
          className="board-svg arduino-svg"
          viewBox="0 0 440 310"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="arduino-pcb" x1="0" y1="0" x2="440" y2="310" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00979D" />
              <stop offset="50%" stopColor="#008184" />
              <stop offset="100%" stopColor="#006468" />
            </linearGradient>
            <linearGradient id="metal-usb" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#D5D9E0" />
              <stop offset="40%" stopColor="#B0B6C2" />
              <stop offset="70%" stopColor="#8A92A0" />
              <stop offset="100%" stopColor="#CAD0DA" />
            </linearGradient>
            <linearGradient id="metal-shield" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E2E6EC" />
              <stop offset="50%" stopColor="#BEC5CF" />
              <stop offset="100%" stopColor="#9CA4B2" />
            </linearGradient>
            <filter id="board-shadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="16" stdDeviation="20" floodColor="#00E5FF" floodOpacity="0.28" />
              <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000000" floodOpacity="0.65" />
            </filter>
          </defs>

          {/* Arduino PCB Shape with standard cutouts */}
          <g filter="url(#board-shadow)">
            <path
              d="M 28 8 
                 L 412 8 
                 A 8 8 0 0 1 420 16 
                 L 420 190 
                 L 432 202 
                 L 432 292 
                 A 8 8 0 0 1 424 300 
                 L 28 300 
                 A 8 8 0 0 1 20 292 
                 L 20 16 
                 A 8 8 0 0 1 28 8 Z"
              fill="url(#arduino-pcb)"
              stroke="#00B4BB"
              strokeWidth="1.5"
            />
          </g>

          {/* Corner Mounting Holes with Gold Rings */}
          <circle cx="36" cy="24" r="7" fill="#071A32" stroke="#D4AF37" strokeWidth="2" />
          <circle cx="404" cy="24" r="7" fill="#071A32" stroke="#D4AF37" strokeWidth="2" />
          <circle cx="36" cy="284" r="7" fill="#071A32" stroke="#D4AF37" strokeWidth="2" />
          <circle cx="404" cy="284" r="7" fill="#071A32" stroke="#D4AF37" strokeWidth="2" />

          {/* USB-B Metal Socket (Left Top) */}
          <rect x="10" y="45" width="60" height="52" rx="4" fill="url(#metal-usb)" stroke="#7A8290" strokeWidth="1" />
          <rect x="8" y="52" width="12" height="38" rx="2" fill="#58606E" />
          <rect x="25" y="58" width="30" height="26" rx="2" fill="#22252A" />
          <rect x="33" y="66" width="14" height="10" rx="1" fill="#FFFFFF" />

          {/* DC Power Barrel Jack (Left Bottom) */}
          <rect x="8" y="210" width="58" height="50" rx="4" fill="#1C1F24" stroke="#111317" strokeWidth="1.5" />
          <rect x="6" y="222" width="12" height="26" rx="2" fill="#0E1013" />
          <circle cx="38" cy="235" r="7" fill="#2D323B" />
          <circle cx="38" cy="235" r="3" fill="#C5A059" />

          {/* Voltage Regulator & Heatsink Tab */}
          <rect x="90" y="220" width="28" height="24" rx="2" fill="#22262C" />
          <rect x="94" y="214" width="20" height="6" fill="#8E95A0" />

          {/* ATmega16U2 (USB Interface IC) */}
          <rect x="110" y="60" width="26" height="26" rx="2" fill="#1F2328" stroke="#3A404A" strokeWidth="0.5" />
          <circle cx="116" cy="66" r="1.5" fill="#666F7C" />
          {/* 16MHz Crystal near USB */}
          <rect x="88" y="76" width="14" height="8" rx="2" fill="url(#metal-shield)" stroke="#7A8290" strokeWidth="0.5" />

          {/* Reset Button */}
          <rect x="82" y="16" width="18" height="18" rx="3" fill="#D2D6DC" stroke="#8E95A0" strokeWidth="1" />
          <circle cx="91" cy="25" r="5" fill="#E63946" />

          {/* Main ATmega328P DIP IC Chip */}
          <g className="atmega-chip">
            {/* 28 Metal Pins */}
            {[...Array(14)].map((_, i) => (
              <React.Fragment key={i}>
                <rect x={186 + i * 14} y="152" width="6" height="8" fill="#B0B6C2" rx="1" />
                <rect x={186 + i * 14} y="194" width="6" height="8" fill="#B0B6C2" rx="1" />
              </React.Fragment>
            ))}
            {/* IC Body */}
            <rect x="180" y="158" width="202" height="38" rx="3" fill="#181A1E" stroke="#2D323A" strokeWidth="1" />
            {/* Orientation Notch */}
            <path d="M 180 172 A 5 5 0 0 1 180 182 Z" fill="#2D323A" />
            <text x="210" y="181" fill="#E2E8F0" fontSize="10.5" fontFamily="monospace" fontWeight="700" letterSpacing="1">
              ATMEGA328P-PU
            </text>
          </g>

          {/* 16MHz Main Crystal Oscillator */}
          <ellipse cx="195" cy="225" rx="14" ry="7" fill="url(#metal-shield)" stroke="#7A8290" strokeWidth="0.8" />
          <text x="186" y="227" fill="#4B5563" fontSize="6" fontFamily="sans-serif">16.000</text>

          {/* Status LEDs (L, TX, RX, ON) */}
          <rect x="145" y="112" width="6" height="4" rx="1" fill="#F59E0B" />
          <text x="154" y="116" fill="#FFFFFF" fontSize="7" fontWeight="bold">L</text>
          <rect x="145" y="122" width="6" height="4" rx="1" fill="#F59E0B" />
          <text x="154" y="126" fill="#FFFFFF" fontSize="7">TX</text>
          <rect x="145" y="132" width="6" height="4" rx="1" fill="#F59E0B" />
          <text x="154" y="136" fill="#FFFFFF" fontSize="7">RX</text>
          <rect x="365" y="105" width="6" height="4" rx="1" fill="#10B981" />
          <text x="350" y="110" fill="#FFFFFF" fontSize="7" fontWeight="bold">ON</text>

          {/* Top Female Header (Digital IO 0-13 & GND/AREF) */}
          <g className="header-top">
            <rect x="195" y="12" width="132" height="15" rx="2" fill="#181B20" stroke="#000000" strokeWidth="1" />
            <rect x="335" y="12" width="76" height="15" rx="2" fill="#181B20" stroke="#000000" strokeWidth="1" />
            {[...Array(10)].map((_, i) => (
              <rect key={i} x={200 + i * 12.5} y="15" width="8" height="9" rx="1" fill="#0D0E11" />
            ))}
            {[...Array(6)].map((_, i) => (
              <rect key={i} x={340 + i * 12} y="15" width="8" height="9" rx="1" fill="#0D0E11" />
            ))}
            <text x="200" y="36" fill="#FFFFFF" fontSize="6.5" fontFamily="monospace">AREF GND 13 12 ~11 ~10 ~9 8</text>
            <text x="342" y="36" fill="#FFFFFF" fontSize="6.5" fontFamily="monospace">7 ~6 ~5 4 ~3 2 TX RX</text>
            <text x="270" y="46" fill="#E0F2FE" fontSize="8" fontWeight="bold" letterSpacing="0.5">DIGITAL (PWM ~)</text>
          </g>

          {/* Bottom Female Header (Power & Analog In) */}
          <g className="header-bottom">
            <rect x="195" y="278" width="108" height="15" rx="2" fill="#181B20" stroke="#000000" strokeWidth="1" />
            <rect x="315" y="278" width="96" height="15" rx="2" fill="#181B20" stroke="#000000" strokeWidth="1" />
            {[...Array(8)].map((_, i) => (
              <rect key={i} x={200 + i * 12.8} y="281" width="8" height="9" rx="1" fill="#0D0E11" />
            ))}
            {[...Array(6)].map((_, i) => (
              <rect key={i} x={322 + i * 14.5} y="281" width="8" height="9" rx="1" fill="#0D0E11" />
            ))}
            <text x="198" y="272" fill="#FFFFFF" fontSize="6.5" fontFamily="monospace">IOREF RESET 3.3V 5V GND GND VIN</text>
            <text x="325" y="272" fill="#FFFFFF" fontSize="6.5" fontFamily="monospace">A0 A1 A2 A3 A4 A5</text>
            <text x="220" y="260" fill="#E0F2FE" fontSize="8" fontWeight="bold">POWER</text>
            <text x="335" y="260" fill="#E0F2FE" fontSize="8" fontWeight="bold">ANALOG IN</text>
          </g>

          {/* Arduino Silkscreen Branding */}
          <g className="silkscreen-branding">
            <text x="140" y="228" fill="#FFFFFF" fontSize="18" fontWeight="900" letterSpacing="0.5" fontFamily="sans-serif">
              ARDUINO
            </text>
            <text x="140" y="246" fill="#38BDF8" fontSize="14" fontWeight="800" letterSpacing="1" fontFamily="sans-serif">
              UNO
            </text>
            <text x="180" y="246" fill="#E2E8F0" fontSize="10" fontWeight="600" fontFamily="sans-serif">
              R3
            </text>
            {/* Decorative circuit line */}
            <path d="M 140 252 L 210 252" stroke="#38BDF8" strokeWidth="1.5" />
          </g>
        </svg>
      </div>

      {/* ─── Board 2: ESP32 DevKit Board (Bottom Right / Overlapping) ────── */}
      <div className="hero-board-wrapper board-esp32">
        <div className="board-reflection" />
        <svg
          className="board-svg esp32-svg"
          viewBox="0 0 250 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="esp-pcb" x1="0" y1="0" x2="250" y2="400" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1C1E24" />
              <stop offset="50%" stopColor="#14161A" />
              <stop offset="100%" stopColor="#0B0C0E" />
            </linearGradient>
            <linearGradient id="esp-rf-shield" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#DFE3EA" />
              <stop offset="35%" stopColor="#BFC6D2" />
              <stop offset="70%" stopColor="#9CA4B2" />
              <stop offset="100%" stopColor="#CED4DE" />
            </linearGradient>
            <filter id="esp-shadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="16" stdDeviation="22" floodColor="#00E5FF" floodOpacity="0.32" />
              <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000000" floodOpacity="0.75" />
            </filter>
          </defs>

          {/* ESP32 PCB Base */}
          <g filter="url(#esp-shadow)">
            <rect
              x="25"
              y="10"
              width="200"
              height="380"
              rx="8"
              fill="url(#esp-pcb)"
              stroke="#2A2E38"
              strokeWidth="1.5"
            />
          </g>

          {/* Corner Mounting Holes */}
          <circle cx="36" cy="22" r="4.5" fill="#071A32" stroke="#D4AF37" strokeWidth="1.5" />
          <circle cx="214" cy="22" r="4.5" fill="#071A32" stroke="#D4AF37" strokeWidth="1.5" />
          <circle cx="36" cy="378" r="4.5" fill="#071A32" stroke="#D4AF37" strokeWidth="1.5" />
          <circle cx="214" cy="378" r="4.5" fill="#071A32" stroke="#D4AF37" strokeWidth="1.5" />

          {/* Serpentine Meandered Gold Antenna (Top Edge) */}
          <g className="esp-antenna">
            <path
              d="M 55 18 H 195 
                 M 65 24 H 185 
                 M 75 30 H 175 
                 M 85 36 H 165
                 M 115 36 V 46
                 M 135 36 V 46"
              stroke="#F59E0B"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="50" y="14" width="150" height="36" fill="#B45309" fillOpacity="0.12" rx="3" />
          </g>

          {/* ESP-WROOM-32 Metal RF Shielding Can */}
          <rect
            x="48"
            y="54"
            width="154"
            height="138"
            rx="4"
            fill="url(#esp-rf-shield)"
            stroke="#6B7280"
            strokeWidth="1"
          />
          <rect x="52" y="58" width="146" height="130" rx="3" fill="none" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="0.8" />

          {/* Shield Laser Engraving */}
          <g className="shield-text">
            <text x="125" y="90" fill="#24292F" fontSize="13" fontWeight="900" textAnchor="middle" letterSpacing="0.8" fontFamily="sans-serif">
              ESPRESSIF
            </text>
            <text x="125" y="112" fill="#111827" fontSize="15" fontWeight="900" textAnchor="middle" letterSpacing="1" fontFamily="sans-serif">
              ESP-WROOM-32
            </text>
            <text x="125" y="132" fill="#4B5563" fontSize="8" textAnchor="middle" fontFamily="monospace">
              FCC ID: 2AC7Z-ESPWROOM32
            </text>
            <text x="125" y="146" fill="#4B5563" fontSize="8" textAnchor="middle" fontFamily="monospace">
              WiFi + Bluetooth + BLE
            </text>
            <circle cx="125" cy="164" r="8" fill="none" stroke="#4B5563" strokeWidth="1" />
            <text x="125" y="167" fill="#4B5563" fontSize="8" fontWeight="bold" textAnchor="middle">CE</text>
          </g>

          {/* CP2102 USB-to-UART Bridge IC */}
          <rect x="105" y="240" width="40" height="40" rx="2" fill="#181A1F" stroke="#374151" strokeWidth="0.8" />
          <circle cx="112" cy="247" r="1.5" fill="#6B7280" />
          <text x="125" y="262" fill="#9CA3AF" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
            SILABS
          </text>
          <text x="125" y="271" fill="#9CA3AF" fontSize="6.5" textAnchor="middle" fontFamily="monospace">
            CP2102
          </text>

          {/* AMS1117 3.3V Voltage Regulator */}
          <rect x="62" y="215" width="22" height="18" rx="1.5" fill="#1F242D" />
          <rect x="65" y="210" width="16" height="5" fill="#8B93A0" />

          {/* Dual Push-Buttons: EN (Reset) and BOOT */}
          {/* EN Button */}
          <rect x="44" y="325" width="22" height="16" rx="2" fill="#D1D5DB" stroke="#6B7280" strokeWidth="0.8" />
          <circle cx="55" cy="333" r="4" fill="#374151" />
          <text x="55" y="352" fill="#E2E8F0" fontSize="7.5" fontWeight="bold" textAnchor="middle">EN</text>

          {/* BOOT Button */}
          <rect x="184" y="325" width="22" height="16" rx="2" fill="#D1D5DB" stroke="#6B7280" strokeWidth="0.8" />
          <circle cx="195" cy="333" r="4" fill="#374151" />
          <text x="195" y="352" fill="#E2E8F0" fontSize="7.5" fontWeight="bold" textAnchor="middle">BOOT</text>

          {/* Status LEDs */}
          <rect x="76" y="330" width="5" height="3" rx="1" fill="#EF4444" />
          <text x="78" y="342" fill="#EF4444" fontSize="6" textAnchor="middle">PWR</text>
          <rect x="169" y="330" width="5" height="3" rx="1" fill="#3B82F6" />
          <text x="171" y="342" fill="#38BDF8" fontSize="6" textAnchor="middle">IO2</text>

          {/* Micro-USB Port (Bottom Edge) */}
          <rect x="100" y="360" width="50" height="34" rx="3" fill="url(#metal-usb)" stroke="#4B5563" strokeWidth="1" />
          <rect x="110" y="378" width="30" height="12" rx="2" fill="#111317" />
          <rect x="116" y="382" width="18" height="4" rx="1" fill="#374151" />

          {/* Left & Right Gold Header Pins */}
          {/* Left Pin Row (19 pins) */}
          {[...Array(19)].map((_, i) => (
            <g key={`l-pin-${i}`}>
              <rect x="14" y="55 + i * 16" width="11" height="9" rx="1.5" fill="#D4AF37" stroke="#9A7B1C" strokeWidth="0.5" />
              <rect x="25" y="56 + i * 16" width="8" height="7" rx="1" fill="#0B0C0E" />
            </g>
          ))}

          {/* Right Pin Row (19 pins) */}
          {[...Array(19)].map((_, i) => (
            <g key={`r-pin-${i}`}>
              <rect x="225" y="55 + i * 16" width="11" height="9" rx="1.5" fill="#D4AF37" stroke="#9A7B1C" strokeWidth="0.5" />
              <rect x="217" y="56 + i * 16" width="8" height="7" rx="1" fill="#0B0C0E" />
            </g>
          ))}

          {/* Silkscreen Pinout Text */}
          <g className="esp-pin-labels" fill="#94A3B8" fontSize="6" fontFamily="monospace">
            <text x="36" y="62">3V3</text>
            <text x="36" y="78">EN</text>
            <text x="36" y="94">VP</text>
            <text x="36" y="110">VN</text>
            <text x="36" y="126">34</text>
            <text x="36" y="142">35</text>
            <text x="36" y="158">32</text>
            <text x="36" y="174">33</text>
            <text x="36" y="190">25</text>
            <text x="36" y="206">26</text>
            <text x="36" y="222">27</text>
            <text x="36" y="238">14</text>
            <text x="36" y="254">12</text>
            <text x="36" y="270">GND</text>
            <text x="36" y="286">13</text>
            <text x="36" y="302">D2</text>
            <text x="36" y="318">D3</text>
            <text x="36" y="334">CMD</text>
            <text x="36" y="350">5V</text>

            <text x="200" y="62" textAnchor="end">GND</text>
            <text x="200" y="78" textAnchor="end">23</text>
            <text x="200" y="94" textAnchor="end">22</text>
            <text x="200" y="110" textAnchor="end">TX</text>
            <text x="200" y="126" textAnchor="end">RX</text>
            <text x="200" y="142" textAnchor="end">21</text>
            <text x="200" y="158" textAnchor="end">GND</text>
            <text x="200" y="174" textAnchor="end">19</text>
            <text x="200" y="190" textAnchor="end">18</text>
            <text x="200" y="206" textAnchor="end">5</text>
            <text x="200" y="222" textAnchor="end">17</text>
            <text x="200" y="238" textAnchor="end">16</text>
            <text x="200" y="254" textAnchor="end">4</text>
            <text x="200" y="270" textAnchor="end">0</text>
            <text x="200" y="286" textAnchor="end">2</text>
            <text x="200" y="302" textAnchor="end">15</text>
            <text x="200" y="318" textAnchor="end">D1</text>
            <text x="200" y="334" textAnchor="end">D0</text>
            <text x="200" y="350" textAnchor="end">CLK</text>
          </g>
        </svg>
      </div>
    </div>
  );
}

