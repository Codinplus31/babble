import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { BsFillChatRightTextFill } from "react-icons/bs";
import { FiUsers, FiLogOut } from "react-icons/fi";

import { signOut } from "next-auth/react";

import useConversation from "./useConversation";

const useRoutes = () => {
    const pathname = usePathname();

    const { conversationId } = useConversation();

    const routes = useMemo(
        () => [
            {
                label: "",
                href: "/conversations",
                icon: BsFillChatRightTextFill,
                active: pathname === "/conversations" || !!conversationId,
            },
            {
                label: "",
                href: "/users",
                icon: FiUsers,
                active: pathname === "/users",
            },
            {
                label: "",
                href: "#",
                onClick: () => signOut(),
                icon: FiLogOut,
            },
        ],
        [pathname, conversationId]
    );

    return routes;
};

export default useRoutes;
