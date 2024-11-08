'use client';
import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient;
}

//const client = globalThis.prisma || new PrismaClient();
const client =  new PrismaClient();

//if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

export default client;
