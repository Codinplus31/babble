// app/api/users/route.ts
import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const users = await prisma.conversation.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: limit,
      skip: (page - 1) * limit,
            where: {
                NOT: {
                    email: session.user.email,
                },
            },
        });
    return NextResponse.json(users);
  } catch (error: any) {
    console.log(error, "ERROR_MESSAGES");
    return new NextResponse("Internal Error", { status: 500 });
  }
                      }
