

interface WalmartSparkProps {
    className?: string;
}

const Spark = ({ className = "w-5 h-5 text-[#ffc220]" }: WalmartSparkProps) => {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M12 2L13.8 8.5L19.5 5.2L16.2 11L22.5 12.8L16.2 14.6L19.5 20.4L13.8 17.1L12 23.6L10.2 17.1L4.5 20.4L7.8 14.6L1.5 12.8L7.8 11L4.5 5.2L10.2 8.5L12 2Z" />
        </svg>
    );
}

export default Spark;