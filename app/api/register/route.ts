import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";
 
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { email, name, password } = body;

        if (!email || !name || !password) {
            return new NextResponse("Missing info", { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const geo = []
        const contact = []
        const user = await prisma.user.create({
            data: {
                email,
                name,
                hashedPassword,
                password,
                geo,
                contact
             
            },
        });

        return NextResponse.json(user);
    } catch (error: any) {
        console.error(error, "Registration Error");
        return new NextResponse("Internal Error", { status: 500 });
    }
}
