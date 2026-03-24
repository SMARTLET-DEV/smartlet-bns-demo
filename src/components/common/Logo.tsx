import Link from "next/link";

interface LogoProps {
  variant?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ variant }) => {
  return (
    <Link href="/">
      <span className={`text-2xl font-bold tracking-wider ${variant ? "text-white" : "text-primary"} flex items-center h-full cursor-pointer`}>
        OPENDOOR
      </span>
    </Link>
  );
};
