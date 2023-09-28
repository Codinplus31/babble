"use client";

import Link from "next/link";
import clsx from "clsx";

interface MobileItemProps {
    href: string;
    icon: any;
    active?: boolean;
    onClick?: () => void;
}

const MobileItem: React.FC<MobileItemProps> = ({
    href,
    icon: Icon,
    active,
    onClick,
}) => {
    const handleClick = () => {
        if (onClick) return onClick();
    };
    return (
        <Link
            href={href}
            onClick={handleClick}
            className={clsx(
                `group flex gap-x-3 text-sm leading-6 font-semibold w-full justify-center p-4 text-gray-500 hover:text-[#fff] hover:bg-[#1c2023]`,
                active && "bg-[#1c2023]"
            )}
        >
            <Icon
                className={clsx(`h-6 w-6 shrink-0`, active && "text-[#d1d3d7]")}
            />
        </Link>
    );
};

export default MobileItem;
