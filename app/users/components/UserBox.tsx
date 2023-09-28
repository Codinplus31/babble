"use client";

import Avatar from "@/app/components/Avatar";
import { Loader } from "@/app/components/Loader/Loader";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface UserBoxProps {
    data: User;
}

const UserBox: React.FC<UserBoxProps> = ({ data }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = useCallback(() => {
        setIsLoading(true);

        axios
            .post("/api/conversations", {
                userId: data.id,
            })
            .then((data) => {
                router.push(`/conversations/${data.data.id}`);
            })
            .finally(() => setIsLoading(false));
    }, [data, router]);

    return (
        <>
            {isLoading && <Loader />}
            <div
                onClick={handleClick}
                className="w-full relative flex items-center space-x-3 bg-[#0c1317] p-3 hover:bg-[#202c33] rounded-lg transition cursor-pointer"
            >
                <Avatar user={data} />
                <div className="min-w-0 flex-1">
                    <div className="focus:outline-none">
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="text-lg font-normal text-[#d1d3d7]">
                                {data.name}
                            </h4>
                        </div>
                        <div className="border-b border-[#202c33] mt-2" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserBox;
