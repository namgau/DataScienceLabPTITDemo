// The lab's emblem, drawn live: a database core with orbit rings and the four
// data cards from the logo (bars, network, scatter, donut). Pure SVG + CSS.

function Card({ x, y, delay, children }: { x: number; y: number; delay: number; children: React.ReactNode }) {
  return (
    <g className="orbit-card" style={{ ['--d' as string]: `${delay}ms` }} transform={`translate(${x} ${y})`}>
      <g className="orbit-card-bob" style={{ ['--bob' as string]: `${5 + (delay % 3)}s` }}>
        <rect width="132" height="96" rx="16" fill="url(#cardFill)" stroke="#F4D8C3" filter="url(#cardShadow)" />
        {children}
      </g>
    </g>
  );
}

export function OrbitHero() {
  return (
    <svg className="orbit" viewBox="0 0 560 560" role="img" aria-label="Biểu tượng Data Science Lab: lõi dữ liệu và các quỹ đạo">
      <defs>
        <radialGradient id="glow" cx="50%" cy="52%" r="50%">
          <stop offset="0" stopColor="#FFE1C7" />
          <stop offset="0.6" stopColor="#FFF0E3" />
          <stop offset="1" stopColor="#FFF7F0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="disc" x1="0" x2="1">
          <stop offset="0" stopColor="#C93A1D" />
          <stop offset="0.45" stopColor="#F0643A" />
          <stop offset="0.75" stopColor="#F58A55" />
          <stop offset="1" stopColor="#C9401F" />
        </linearGradient>
        <linearGradient id="discTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFB48A" />
          <stop offset="1" stopColor="#EE5A32" />
        </linearGradient>
        <radialGradient id="gold" cx="35%" cy="30%" r="70%">
          <stop offset="0" stopColor="#FFE7A8" />
          <stop offset="0.5" stopColor="#E8A93F" />
          <stop offset="1" stopColor="#B9761C" />
        </radialGradient>
        <radialGradient id="ember" cx="35%" cy="30%" r="70%">
          <stop offset="0" stopColor="#FFB199" />
          <stop offset="0.5" stopColor="#EC5332" />
          <stop offset="1" stopColor="#B22F16" />
        </radialGradient>
        <linearGradient id="cardFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.96" />
          <stop offset="1" stopColor="#FFF4EC" stopOpacity="0.92" />
        </linearGradient>
        <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="#C65A2E" floodOpacity="0.16" />
        </filter>
        <linearGradient id="bar" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#E8502E" />
          <stop offset="1" stopColor="#F6A15C" />
        </linearGradient>
      </defs>

      <circle cx="280" cy="290" r="250" fill="url(#glow)" />

      <g className="orbit-rings">
        <circle className="ring ring-1" cx="280" cy="290" r="118" />
        <circle className="ring ring-2" cx="280" cy="290" r="176" />
        <circle className="ring ring-3" cx="280" cy="290" r="234" />
      </g>

      <g className="orbit-spin orbit-spin-a">
        <circle cx="280" cy="172" r="9" fill="url(#gold)" />
        <circle cx="398" cy="290" r="6" fill="url(#ember)" />
        <circle cx="196" cy="374" r="7" fill="url(#gold)" />
      </g>
      <g className="orbit-spin orbit-spin-b">
        <circle cx="104" cy="290" r="8" fill="url(#ember)" />
        <circle cx="456" cy="290" r="10" fill="url(#gold)" />
        <circle cx="280" cy="466" r="8" fill="url(#gold)" />
      </g>
      <g className="orbit-spin orbit-spin-c">
        <circle cx="280" cy="56" r="7" fill="url(#gold)" />
        <circle cx="114" cy="456" r="6" fill="url(#ember)" />
      </g>

      {/* Database core */}
      <g className="orbit-core">
        <ellipse cx="280" cy="372" rx="92" ry="22" fill="none" stroke="#F2B48F" strokeWidth="1.5" />
        <ellipse cx="280" cy="372" rx="66" ry="15" fill="#FBD3B8" />
        {[0, 1, 2].map((i) => {
          const y = 330 - i * 34;
          return (
            <g key={i}>
              <path d={`M222 ${y - 26} v26 a58 16 0 0 0 116 0 v-26`} fill="url(#disc)" />
              <ellipse cx="280" cy={y - 26} rx="58" ry="16" fill="url(#discTop)" />
            </g>
          );
        })}
        <ellipse cx="262" cy="224" rx="22" ry="5" fill="#FFF" opacity="0.45" />
      </g>

      <Card x={44} y={92} delay={150}>
        <rect x="16" y="18" width="40" height="6" rx="3" fill="#F6C8AA" />
        <rect x="16" y="30" width="28" height="6" rx="3" fill="#FADBC6" />
        {[18, 30, 26, 44, 56].map((h, i) => (
          <rect key={i} x={64 + i * 12} y={80 - h} width="8" height={h} rx="2" fill="url(#bar)" />
        ))}
      </Card>

      <Card x={384} y={84} delay={300}>
        {[[30, 30], [52, 22], [70, 40], [40, 54], [62, 66], [88, 58], [24, 70]].map(([cx, cy], i, a) => (
          <g key={i}>
            {i > 0 && <line x1={a[i - 1][0]} y1={a[i - 1][1]} x2={cx} y2={cy} stroke="#F29A6E" strokeWidth="1.4" />}
            <circle cx={cx} cy={cy} r={i % 2 ? 4 : 5} fill={i % 3 ? '#EC5A33' : '#F2A043'} />
          </g>
        ))}
        <rect x="100" y="28" width="20" height="5" rx="2.5" fill="#F6C8AA" />
        <rect x="100" y="40" width="16" height="5" rx="2.5" fill="#FADBC6" />
      </Card>

      <Card x={30} y={350} delay={450}>
        <path d="M16 80 V16 M16 80 H118" stroke="#E9B596" strokeWidth="1.5" fill="none" />
        {[[26, 70], [34, 62], [44, 66], [52, 54], [62, 50], [70, 44], [80, 46], [88, 34], [98, 30], [108, 22]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="3.4" fill={i % 2 ? '#F2A043' : '#E8502E'} />
        ))}
        <path d="M22 74 Q 64 52 112 20" stroke="#C93A1D" strokeWidth="1.6" fill="none" strokeDasharray="3 3" />
      </Card>

      <Card x={398} y={360} delay={600}>
        <g transform="translate(40 48)">
          <circle r="24" fill="none" stroke="#F7D2B6" strokeWidth="12" />
          <circle r="24" fill="none" stroke="#E8502E" strokeWidth="12" strokeDasharray="70 151" transform="rotate(-90)" />
          <circle r="24" fill="none" stroke="#F2A043" strokeWidth="12" strokeDasharray="40 151" strokeDashoffset="-70" transform="rotate(-90)" />
        </g>
        <rect x="80" y="32" width="36" height="6" rx="3" fill="#F6C8AA" />
        <rect x="80" y="46" width="28" height="6" rx="3" fill="#FADBC6" />
        <rect x="80" y="60" width="32" height="6" rx="3" fill="#F6C8AA" />
      </Card>
    </svg>
  );
}
