import Link from "next/link";
import Image from "next/image";

interface LogoProps {
    className?: string;
    width?: number;
    height?: number;
}

const Logo = ({
    className = "h-10 sm:h-11 md:h-12 w-auto max-w-[160px] sm:max-w-[180px] object-contain",
    width = 175,
    height = 52,
}: LogoProps) => {
    return (
        <Link href="/" className="shrink-0 flex items-center">
            <Image
                src="https://res.cloudinary.com/dkk9lvbtf/image/upload/v1785693062/amarzone_fnnw8s.png"
                alt="Amarzone Logo"
                width={width}
                height={height}
                className={className}
                priority
            />
        </Link>
    );
};

export default Logo;
