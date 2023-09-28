import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();

        const body = await request.json();

        const { userId, isGroup, members, name } = body;

        if (!currentUser?.id && !currentUser?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (isGroup && (!members || members.length < 2 || !name)) {
            return new NextResponse("Invalid data", { status: 400 });
        }

        // Group chat
        if (isGroup) {
            const newConversation = await prisma.conversation.create({
                data: {
                    name,
                    isGroup,
                    users: {
                        connect: [
                            ...members.map((member: { value: string }) => ({
                                id: member.value,
                            })),
                            { id: currentUser.id },
                        ],
                    },
                },
                include: {
                    users: true,
                },
            });

            // update all conversation with new conversation - in sidebar
            newConversation.users.forEach((user) => {
                if (user.email) {
                    pusherServer.trigger(
                        user.email,
                        "conversation:new",
                        newConversation
                    );
                }
            });

            return NextResponse.json(newConversation);
        }

        // one-to-one chat - If some chats exist
        const existingConversations = await prisma.conversation.findMany({
            where: {
                OR: [
                    {
                        userIds: {
                            equals: [currentUser.id, userId],
                        },
                    },
                    {
                        userIds: {
                            equals: [userId, currentUser.id],
                        },
                    },
                ],
            },
        });

        const singleConversation = existingConversations[0];

        if (singleConversation) {
            return NextResponse.json(singleConversation);
        }

        // new conversation
        const newConversation = await prisma.conversation.create({
            data: {
                users: {
                    connect: [
                        {
                            id: currentUser.id,
                        },
                        {
                            id: userId,
                        },
                    ],
                },
            },
            include: {
                users: true,
            },
        });

        // update all connections with new conversation
        newConversation.users.map((user) => {
            if (user.email) {
                pusherServer.trigger(
                    user.email,
                    "conversation:new",
                    newConversation
                );
            }
        });

        return NextResponse.json(newConversation);
    } catch (error: any) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
