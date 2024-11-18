import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();

        const body = await request.json();
        const { geo } = body;

        if (!currentUser?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: currentUser.id,
            },
            data: {
                geo: geo,
                
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error: any) {
        console.error("Error in Settings: ", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
                                    }
