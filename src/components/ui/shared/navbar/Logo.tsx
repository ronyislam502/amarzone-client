import Link from "next/link";
import Image from "next/image";

const Logo = () => {
    return (
        <Link href="/" className="shrink-0">
            <Image
                src="https://res.cloudinary.com/dkk9lvbtf/image/upload/v1785693062/amarzone_fnnw8s.png"
                alt="Amarzone Logo"
                width={125}
                height={38}
                className="object-contain"
                priority
                style={{ width: "auto", height: "auto" }}
            />
        </Link>
    );
};

export default Logo;
