"use client";

import useConversation from "@/app/hooks/useConversation";
import useRoutes from "@/app/hooks/useRoutes";
import MobileItem from "./MobileItem";
import { User } from "@prisma/client";
import { useState } from "react";
import SettingsModal from "./SettingsModal";
import Avatar from "../Avatar";

interface MobileFooterProps {
    currentUser: User;
}

export const MobileFooter: React.FC<MobileFooterProps> = ({ currentUser }) => {
    const routes = useRoutes();

    const { isOpen } = useConversation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    if (isOpen) {
        return null;
    }

    return (
        <>
            <SettingsModal
                currentUser={currentUser}
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />
            <div className="bottom-0 w-full flex justify-between items-center fixed z-40 lg:hidden bg-[#202c33]">
                <div
                    onClick={() => setIsProfileOpen(true)}
                    className="w-[20%] flex items-center justify-center cursor-pointer hover:opacity-75 transition"
                >
                    <Avatar user={currentUser} />
                </div>
                <div className="w-[80%] flex justify-between gap-x-2 items-center">
                    {routes.map((route) => (
                        <MobileItem
                            key={route.href}
                            href={route.href}
                            active={route.active}
                            icon={route.icon}
                            onClick={route.onClick}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};
