"use client";

import { User } from "@prisma/client";
import Image from "next/image";
import useActiveList from "../hooks/useActiveList";

import avatar from "../../public/assets/avatar.ico"

interface AvatarProps {
    user?: User;
}

const Avatar: React.FC<AvatarProps> = ({ user }) => {
    const { members } = useActiveList();
    const isOnline = members.indexOf(user?.email!) !== -1;

    return (
        <div className="relative">
            <div className="relative rounded-full overflow-hidden inline-block h-9 w-9 md:h-11 md:w-11">
                <Image
                    src={user?.image || avatar}
                    fill
                    sizes="(min-width:2560px) 100%"
                    alt="Avatar"
                />
            </div>
            {isOnline && (
                <span className="absolute block rounded-full bg-green-400 ring-2 ring-white top-0 right-0 h-2 w-2 md:h-3 md:w-3"></span>
            )}
        </div>
    );
};

export default Avatar;
