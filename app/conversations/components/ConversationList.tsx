"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullConversationType } from "@/app/types";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
//import { X } from 'lucide-react'
import { AiFillFolderAdd } from "react-icons/ai";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "../../components/Modals/GroupChatModal";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface ConversationListProps {
    initialItems: FullConversationType[];
    users: User[];
}
const TERMS_ACCEPTED_KEY = 'termsAccepted'
const ConversationList: React.FC<ConversationListProps> = ({
    initialItems,
    users,
}) => {
    const [items, setItems] = useState(initialItems);
    const [isModalOpen, setIsModalOpen] = useState(false);
const [isTermsPopupOpen, setIsTermsPopupOpen] = useState(false)
    const router = useRouter();
    const session = useSession();

    const { conversationId, isOpen } = useConversation();

    const pusherKey = useMemo(() => {
        return session.data?.user?.email;
    }, [session.data?.user?.email]);
useEffect(() => {
    const termsAccepted = localStorage.getItem(TERMS_ACCEPTED_KEY)
    if (!termsAccepted) {
      setIsTermsPopupOpen(true)
    }
  }, [])
    useEffect(() => {
        if (!pusherKey) {
            return;
        }

        pusherClient.subscribe(pusherKey);

        // append new conversation
        const newHandler = (conversation: FullConversationType) => {
            setItems((current) => {
                if (find(current, { id: conversation.id })) {
                    return current;
                }
                return [conversation, ...current];
            });
        };

        // for updating unread items
        const updateHandler = (conversation: FullConversationType) => {
            setItems((current) =>
                current.map((currentConversation) => {
                    if (currentConversation.id === conversation.id) {
                        return {
                            ...currentConversation,
                            messages: conversation.messages,
                        };
                    }
                    return currentConversation;
                })
            );
        };

        const removeHandler = (conversation: FullConversationType) => {
            setItems((current) => {
                return [
                    ...current.filter((convo) => convo.id !== conversation.id),
                ];
            });
        };

        pusherClient.bind("conversation:new", newHandler);
        pusherClient.bind("conversation:update", updateHandler);
        pusherClient.bind("conversation:remove", removeHandler);

        return () => {
            pusherClient.unsubscribe(pusherKey);
            pusherClient.unbind("conversation:new", newHandler);
            pusherClient.unbind("conversation:update", updateHandler);
            pusherClient.unbind("conversation:remove", removeHandler);
        };
    }, [pusherKey, router]);

const handleAcceptTerms = () => {
    localStorage.setItem(TERMS_ACCEPTED_KEY, 'true')
    setIsTermsPopupOpen(false)
    // Add your instructions here
    console.log('Terms accepted')
}
    

    
    return (
        <>
            <GroupChatModal
                users={users}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            {isTermsPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsTermsPopupOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Terms and Conditions</h2>
            <p className="text-gray-600 mb-6">
              By clicking the "Accept" button below, you acknowledge that you have read, understood, and agree to be
              bound by our Terms and Conditions. Please review them carefully before proceeding.
            </p>
            <div className="flex justify-end">
              <button
                onClick={handleAcceptTerms}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
            <aside
                className={clsx(
                    `fixed inset-y-0 pb-20 lg:pb-0 lg:top-20 lg:w-80 lg:block overflow-y-auto bg-[#0c1317]`,
                    isOpen ? "hidden" : "block w-full left-0"
                )}
            >
                <div className="px-5">
                    <div className="flex justify-between py-6">
                        <div className="text-3xl justify-center items-center font-extrabold text-[#578EFF]">
                            Sext
                        </div>
                        <div
                            className="p-2 bg-[#0c1317] text-[#d1d3d7] cursor-pointer hover:opacity-75 transition"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <AiFillFolderAdd size={30} />
                        </div>
                    </div>

                    {items.map((item) => (
                        <ConversationBox
                            key={item.id}
                            data={item}
                            selected={conversationId === item.id}
                        />
                    ))}
                </div>
            </aside>
        </>
    );
};

export default ConversationList;
