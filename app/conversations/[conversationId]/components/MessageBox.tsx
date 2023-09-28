"use client";

import Avatar from "@/app/components/Avatar";
import { FullMessageType } from "@/app/types";
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import ImgModal from "./ImgModal";

interface MessageBoxProps {
    data: FullMessageType;
    isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
    const session = useSession();
    const [imgModal, setImgModal] = useState(false);

    const isOwn = session.data?.user?.email === data?.sender?.email;
    const seenList = (data.seen || [])
        .filter((user) => user.email !== data?.sender?.email)
        .map((user) => user.name)
        .join(", ");

    const container = clsx(`flex gap-3 p-4`, isOwn && "justify-end");

    const avatar = clsx(isOwn && "order-2");

    const body = clsx(`flex flex-col gap-2`, isOwn && "items-end");

    const message = clsx(
        `text-sm w-fit overflow-hidden`,
        isOwn ? "bg-[#0c1317] text-[#d1d3d7]" : "bg-[#d1d3d7] text-[#0c1317]",
        data.image ? "rounded-md-p-0" : "rounded-full py-2 px-3"
    );

    return (
        <div className={container}>
            <div className={avatar}>
                <Avatar user={data.sender} />
            </div>
            <div className={body}>
                <div className="flex items-center gap-1">
                    <div className="text-sm text-[#8696a0]">
                        {data.sender.name}
                    </div>
                    <div className="text-xs text-[#6d7a83]">
                        {format(new Date(data.createdAt), "p")}
                    </div>
                </div>
                <div className={message}>
                    <ImgModal
                        src={data.image}
                        isOpen={imgModal}
                        onClose={() => setImgModal(false)}
                    />
                    {data.image ? (
                        <Image
                            onClick={() => setImgModal(true)}
                            alt="Image"
                            width="0"
                            height="0"
                            sizes="100vw"
                            src={data.image}
                            className="w-auto h-auto object-cover cursor-pointer hover:scale-110 transition translate"
                        />
                    ) : (
                        <div className="text-xl">{data.body}</div>
                    )}
                </div>
                {isLast && isOwn && seenList.length > 0 && (
                    <div className="text-xs font-light text-[#8696a0]">
                        {`Seen by ${seenList}`}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageBox;
