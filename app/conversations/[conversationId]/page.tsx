import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";
import Empty from "@/app/components/Empty";
import Header from "./components/Header";
import Body from "./components/Body";
import SendMessage from "./components/SendMessage";
import getConversations from "../actions/getConversations";
    
interface IParams {
    conversationId: string;
}

const Chat = async ({ params }: { params: IParams }) => {
    const conversation = await getConversationById(params.conversationId);
    const messages = await getMessages(params.conversationId);
const currentUser = await getCurrentUser();
    
    if (!conversation) {
        return (
            <div className="lg:pl-80 h-full">
                <div className="h-full flex flex-col">
                    <Empty />
                </div>
            </div>
        );
    }
    return (
        <>
            <div className="lg:pl-80 lg:mt-[-80px] lg:border-l-[0.1px] text-[#d1d3d7] h-full bg-[#1a1f25]">
                <div className="h-full flex flex-col">
                    <Header conversation={conversation} />
                    <Body initialMessages={messages} currentUser={User} />
                    <SendMessage />
                </div>
            </div>
        </>
    );
};

export default Chat;
