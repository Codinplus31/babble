import getConversations from "../actions/getConversations";
import getUsers from "../actions/getUsers";
import Sidebar from "../components/Sidebar/Sidebar";
import ConversationList from "./components/ConversationList";
import getCurrentUser from "@/app/actions/getCurrentUser"

export default async function ConversationsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const conversations = await getConversations();
    const users = await getUsers();
    const currentUser = await getCurrentUser();
    return (
        <Sidebar>
            <div className="h-full">              
                <ConversationList
                    initialItems={conversations}
                    users={users}
                    currentUser={currentUser}
                />
                {children}
            </div>
        </Sidebar>
    );
}
