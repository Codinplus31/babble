import prisma from "@/app/libs/prismadb";

import getSession from "./getSession";

const getUsers = async (page: number = 1, limit: number = 10) => {
    const session = await getSession();

    if (!session?.user?.email) {
        return [];
    }
const skip = (page - 1) * limit;
 //   const currentUser = await getCurrentUser();
    
    try {
        //    Find all other users present
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: limit,
            skip: skip,
            where: {
                NOT: {
                    email: session.user.email,
                },
            },
        });

        return users;
    } catch (error: any) {
        return [];
    }
};

export default getUsers;
