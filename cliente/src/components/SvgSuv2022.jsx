export default function SvgSuv2022({ title = 'SUV Familiar 2022' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="100%" height="100%" role="img" aria-label={title}>
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="#e5f9ef" />
      <rect x="24" y="24" width="1152" height="627" rx="24" fill="url(#g)" />
      <g transform="translate(0,40)" fill="#052e16">
        <rect x="250" y="380" width="700" height="40" rx="20" />
        <rect x="300" y="300" width="600" height="90" rx="20" />
        <circle cx="360" cy="460" r="48" fill="#0f172a" stroke="#052e16" strokeWidth="8" />
        <circle cx="840" cy="460" r="48" fill="#0f172a" stroke="#052e16" strokeWidth="8" />
      </g>
      <g fontFamily="Segoe UI, Roboto, Helvetica, Arial, sans-serif" textAnchor="middle">
        <text x="600" y="180" fontSize="56" fill="#052e16" fontWeight="800">SUV Familiar 2022</text>
        <text x="600" y="240" fontSize="28" fill="#052e16" opacity=".8">Ilustración local</text>
      </g>
    </svg>
  )
}


