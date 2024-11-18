"use client";

import { User } from "@prisma/client";
import UserBox from "./UserBox";

import { AiFillFolderAdd } from "react-icons/ai";
import axios from 'axios';
import GroupChatModal from "@/app/components/Modals/GroupChatModal";
import { useEffect, useState } from "react";

interface UsersListProps {
    users: User[];
}

const UsersList: React.FC<UsersListProps> = ({ users }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
//users = users.reverse()
    const [User, setUser] = useState(users);
    const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
    
    useEffect(() => {
        let reloadCount: number = 0;
        reloadCount = reloadCount + 1;
        if (reloadCount > 1) {
            if (window.localStorage) {
                if (!localStorage.getItem("firstLoad")) {
                    localStorage["firstLoad"] = true;
                    window.location.reload();
                } else localStorage.removeItem("firstLoad");
            }
        }
    }, []);
    
const loadMoreUsers = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await axios.get(`/api/user?page=${page + 1}&limit=10`);
      const newUsers = response.data;

      if (newUsers.length === 0) {
        setHasMore(false);
      } else {
        setUsers([...users, ...newUsers]);
        setPage(page + 1);
      }
    } catch (error) {
      console.error("Failed to load more users", error);
    } finally {
      setLoading(false);
    }
  };
    
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
                        {User.map((user) => (
                            <UserBox key={user.id} data={user} />
                        ))}
                        {hasMore && (
        <button
          onClick={loadMoreUsers}
          disabled={loading}
          className="w-full p-2 text-sm font-bold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
                    </div>
                </div>
            </aside>
        </>
    );
};

export default UsersList;
