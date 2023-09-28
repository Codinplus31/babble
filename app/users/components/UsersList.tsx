"use client";

import { User } from "@prisma/client";
import UserBox from "./UserBox";

import { AiFillFolderAdd } from "react-icons/ai";

import GroupChatModal from "@/app/components/Modals/GroupChatModal";
import { useEffect, useState } from "react";

interface UsersListProps {
    users: User[];
}

const UsersList: React.FC<UsersListProps> = ({ users }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        let reloadCount: number = 0;
        reloadCount = reloadCount + 1;
        if (reloadCount > 1) {
            setTimeout(() => window.location.reload(), 1000);
            return;
        }
    }, []);

    return (
        <>
            <GroupChatModal
                users={users}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <aside className="fixed inset-y-0 pb-20 lg:pb-0 lg:top-20 lg:w-80 lg:block overflow-y-auto block w-full left-0 bg-[#0c1317]">
                <div className="px-5">
                    <div className="flex-col">
                        <div className="flex justify-between py-6">
                            <div className="text-3xl justify-center items-center font-extrabold text-[#578EFF]">
                                Users
                            </div>
                            <div
                                className="p-2 bg-[#0c1317] text-[#d1d3d7] cursor-pointer hover:opacity-75 transition"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <AiFillFolderAdd size={30} />
                            </div>
                        </div>
                        {users.map((user) => (
                            <UserBox key={user.id} data={user} />
                        ))}
                    </div>
                </div>
            </aside>
        </>
    );
};

export default UsersList;
