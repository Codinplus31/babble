import prisma from "@/app/libs/prismadb";

import getCurrentUser from "./getCurrentUser";

const getConversations = async (page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
        return [];
    }

    try {
        const conversations = await prisma.conversation.findMany({
            orderBy: {
                lastMessageAt: "desc",
            },
            take: limit,
            skip: skip,
            where: {
                userIds: {
                    has: currentUser.id,
                },
            },
            include: {
                users: true,
                messages: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1,
                    include: {
                        sender: true,
                        seen: true,
                    },
                },
            },
        });

        return conversations;
    } catch (error: any) {
        return [];
    }
};

export default getConversations;
