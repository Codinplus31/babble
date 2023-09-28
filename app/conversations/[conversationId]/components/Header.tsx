"use client";

import Avatar from "@/app/components/Avatar";
import useOtherUser from "@/app/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BsArrowLeftShort } from "react-icons/bs";
import { FiMoreVertical } from "react-icons/fi";
import MoreProfile from "./MoreProfile";
import MultipleAvatar from "@/app/components/MultipleAvatar";
import useActiveList from "@/app/hooks/useActiveList";

interface HeaderProps {
    conversation: Conversation & {
        users: User[];
    };
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
    const otherUser = useOtherUser(conversation);

    const [openMore, setOpenMore] = useState(false);
    const { members } = useActiveList();
    const isOnline = members.indexOf(otherUser?.email!) !== -1;

    const statusText = useMemo(() => {
        if (conversation.isGroup) {
            return `${conversation.users.length} members`;
        }

        return isOnline ? "Online" : "Offline";
    }, [conversation, isOnline]);

    return (
        <>
            <MoreProfile
                data={conversation}
                isOpen={openMore}
                onClose={() => setOpenMore(false)}
            />
            <div className="bg-[#202c33] w-full flex sm:px-4 py-[1rem] px-4 lg:px-6 justify-between items-center shadow-sm">
                <div className="flex gap-3 items-center">
                    <Link
                        href="/conversations"
                        className="lg:hidden block text-[#8696a0] hover:text-[#d1d3d7] transition cursor-pointer"
                    >
                        <BsArrowLeftShort size={32} />
                    </Link>
                    {conversation.isGroup ? (
                        <MultipleAvatar users={conversation.users} />
                    ) : (
                        <Avatar user={otherUser} />
                    )}
                    <div className="flex flex-col">
                        <div className="text-2xl text-[#d1d3d7]">
                            {conversation.name || otherUser?.name}
                        </div>
                        <div className="text-sm font-light text-[#8696a0]">
                            {statusText}
                        </div>
                    </div>
                </div>
                <FiMoreVertical
                    size={32}
                    onClick={() => setOpenMore(true)}
                    className="text-[#8696a0] cursor-pointer hover:text-[#d1d3d7] transition"
                />
            </div>
        </>
    );
};

export default Header;
