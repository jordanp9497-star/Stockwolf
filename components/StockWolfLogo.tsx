import Image from "next/image";

interface StockWolfLogoProps {
  className?: string;
}

export default function StockWolfLogo({ className = "" }: StockWolfLogoProps) {
  return (
    <Image
      src="/brand/stockwolf-mark.png"
      alt="StockWolf"
      width={32}
      height={32}
      className={`w-7 h-7 md:w-8 md:h-8 ${className}`}
      priority
      quality={100}
    />
  );
}
