interface StockWolfLogoProps {
  size?: number;
  className?: string;
}

export default function StockWolfLogo({ size = 32, className = "" }: StockWolfLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Head outline */}
      <path
        d="M16 6C12 6 9 9 9 13C9 14.5 9.5 16 10.5 17C9.5 18 9 19.5 9 21C9 25 12 28 16 28C20 28 23 25 23 21C23 19.5 22.5 18 21.5 17C22.5 16 23 14.5 23 13C23 9 20 6 16 6Z"
        fill="currentColor"
      />
      {/* Left ear */}
      <path
        d="M11 10C10.5 9 9.5 9 9 10C8.5 11 9 12 10 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right ear */}
      <path
        d="M23 10C23.5 9 24.5 9 25 10C25.5 11 25 12 24 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Left eye */}
      <circle cx="13" cy="15" r="1.5" fill="currentColor" opacity="0.9" />
      {/* Right eye */}
      <circle cx="19" cy="15" r="1.5" fill="currentColor" opacity="0.9" />
      {/* Nose */}
      <path
        d="M16 18C15 18 14.5 18.5 14.5 19C14.5 19.5 15 20 16 20C17 20 17.5 19.5 17.5 19C17.5 18.5 17 18 16 18Z"
        fill="currentColor"
        opacity="0.9"
      />
      {/* Mouth */}
      <path
        d="M14 21.5C14.5 22.5 15 23 16 23C17 23 17.5 22.5 18 21.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
    </svg>
  );
}
