"use client";

import { User } from "@prisma/client";
import Image from "next/image";
import avatar from "../../public/assets/avatar.ico";

interface MultipleAvatarProps {
    users?: User[];
}

const MultipleAvatar: React.FC<MultipleAvatarProps> = ({ users = [] }) => {
    const slicedUsers = users.slice(0, 3);

    const positionMap = {
        0: "top-0 left-[12px]",
        1: "bottom-0",
        2: "bottom-0 right-0",
    };

    return (
        <div className="relative h-11 w-11">
            {slicedUsers.map((user, index) => (
                <div
                    key={user.id}
                    className={`absolute inline rounded-full overflow-hidden h-[21px] w-[21px]
                ${positionMap[index as keyof typeof positionMap]}`}
                >
                    <Image
                        alt="Group Picture"
                        fill
                        sizes="(min-width:2560px) 100%"
                        src={user?.image || avatar}
                    />
                </div>
            ))}
        </div>
    );
};

export default MultipleAvatar;
