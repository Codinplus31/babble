"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";
import getCurrentUser from "@/app/actions/getCurrentUser.ts"
interface BodyProps {
    initialMessages: FullMessageType[];
    
}

const Body: React.FC<BodyProps> = ({ initialMessages = [], currentUser }) => {
    const [messages, setMessages] = useState(initialMessages);
const [currentUser,setc] = useState();
    const bottomRef = useRef<HTMLDivElement>(null);

    const { conversationId } = useConversation();
//const currentUser = await getCurrentUser();
    useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`);
    }, [conversationId]);

/*useEffect(()=>{
  async function fetv(){
const uses = await getCurrentUser();
  setc(uses)
  }
  fetv()
},[])*/

                                    
    useEffect(() => {
        // every conversation id should get an update
        pusherClient.subscribe(conversationId);
        // everytime we join - scroll to new
        bottomRef?.current?.scrollIntoView();

        const messageHandler = (message: FullMessageType) => {
            // let know they saw message
            axios.post(`/api/conversations/${conversationId}/seen`);

            setMessages((current) => {
                if (find(current, { id: message.id })) {
                    return current;
                }
                return [...current, message];
            });
            bottomRef?.current?.scrollIntoView();
        };

        const updateMessageHandler = (newMessage: FullMessageType) => {
            // update seen status
            setMessages((current) =>
                current.map((currentMessage) => {
                    if (currentMessage.id === newMessage.id) {
                        return newMessage;
                    }
                    return currentMessage;
                })
            );
        };

        // bind client to message key
        pusherClient.bind("messages:new", messageHandler);
        // for seen
        pusherClient.bind("message:update", updateMessageHandler);

        // unbind and unsubscribe everytime we leave
        return () => {
            pusherClient.unsubscribe(conversationId);
            pusherClient.unbind("messages:new", messageHandler);
            pusherClient.unbind("message:update", updateMessageHandler);
        };
    }, [conversationId]);

    return (
        <div className="flex-1 overflow-y-auto">
            {messages.map((message, index) => (
                <MessageBox
                    isLast={index === messages.length - 1}
                    key={message.id}
                    data={message}
                    currentUser={currentUser}
                />
            ))}
            <div ref={bottomRef} className="pt-24" />
        </div>
    );
};

export default  Body;
