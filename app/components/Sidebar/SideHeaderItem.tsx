import clsx from "clsx";
import Link from "next/link";

interface SideHeaderItemProps {
    icon: any;
    href: string;
    onClick?: () => void;
    active?: boolean;
}

const SideHeaderItem: React.FC<SideHeaderItemProps> = ({
    href,
    icon: Icon,
    active,
    onClick,
}) => {
    const handleClick = () => {
        if (onClick) {
            setTimeout(() => window.location.reload(), 5000);
            return onClick();
        }
    };

    return (
        <li onClick={handleClick} key={href}>
            <Link
                href={href}
                className={clsx(
                    `
            group 
            flex 
            gap-y-3 
            rounded-md 
            p-3 
            text-lg 
            leading-6 
            font-semibold 
            text-[#8696a0] 
            hover:text-[#d1d3d7]
            hover:bg-[#1a1f25]
          `,
                    active && "bg-[#1a1f25] text-[#8696a0]"
                )}
            >
                <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                <span className="sr-only"></span>
            </Link>
        </li>
    );
};

export default SideHeaderItem;
