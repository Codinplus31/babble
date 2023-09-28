"use client";

import SideHeaderItem from "./SideHeaderItem";
import useRoutes from "@/app/hooks/useRoutes";
import SettingsModal from "./SettingsModal";
import { useState } from "react";
import Avatar from "../Avatar";
import { User } from "@prisma/client";

interface SideHeaderProps {
    currentUser: User;
}

const SideHeader: React.FC<SideHeaderProps> = ({ currentUser }) => {
    const routes = useRoutes();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <SettingsModal
                currentUser={currentUser}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
            <div
                className="
                    hidden 
                    lg:fixed 
                    lg:inset-x-0 
                    lg:left-0 
                    lg:z-40 
                    lg:w-80 
                    xl:px-6
                    lg:overflow-x-auto 
                    lg:bg-[#202c33]
                    lg:pb-[0.9rem]
                    lg:flex
                    lg:flex-row
                    justify-between
                "
            >
                <nav className="mt-4 ml-4 flex flex-row justify-between items-center">
                    <div
                        onClick={() => setIsOpen(true)}
                        className="cursor-pointer hover:opacity-75 transition"
                    >
                        <Avatar user={currentUser} />
                    </div>
                </nav>
                <nav className="mt-4 mr-4 flex flex-row justify-between">
                    <ul
                        role="list"
                        className="flex flex-row items-center space-x-1"
                    >
                        {routes.map((item) => (
                            <SideHeaderItem
                                key={item.label}
                                href={item.href}
                                icon={item.icon}
                                active={item.active}
                                onClick={item.onClick}
                            />
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default SideHeader;
