"use client";

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface MessageInputProps {
    placeholder?: string;
    id: string;
    type?: string;
    required?: boolean;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors;
}

const MessageInput: React.FC<MessageInputProps> = ({
    id,
    type,
    placeholder,
    required,
    register,
}) => {
    return (
        <div className="relative w-full">
            <input
                type={type}
                id={id}
                autoComplete={id}
                {...register(id, { required })}
                placeholder={placeholder}
                className="text-[#d1d3d7] font-light py-2 px-4 bg-[#2b3842] w-full rounded-full focus:outline-none"
            />
        </div>
    );
};

export default MessageInput;
