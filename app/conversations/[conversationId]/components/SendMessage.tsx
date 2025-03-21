 "use client";
 
import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import MessageInput from "./MessageInput";

import { TiAttachmentOutline } from "react-icons/ti";
import { IoSend } from "react-icons/io5";

import { CldUploadButton } from "next-cloudinary";

const SendMessage = () => {
    const { conversationId } = useConversation();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            message: "",
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setValue("message", "", { shouldValidate: true });
        axios.post("/api/messages", {
            ...data,
            conversationId,
        });
    };

    const handleUpload = (result: any) => {
        axios.post("/api/messages", {
            image: result.info.secure_url,
            conversationId,
        });
    };

    return (
        <div className="lg:py-[19.3px] px-4 py-4 bg-[#202c33] flex items-center gap-2 lg:gap-4 w-full lg:mb-[-80px]">
            <CldUploadButton
                options={{ maxFiles: 1 }}
                onUpload={handleUpload}
                uploadPreset="upload"
            >
                <TiAttachmentOutline
                    size={30}
                    className="text-[#8696a0] hover:text-[#d1d3d7] cursor-pointer"
                />
            </CldUploadButton>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex items-center gap-2 lg:gap-4 w-full"
            >
                <MessageInput
                    id="message"
                    register={register}
                    errors={errors}
                    required
                    placeholder="Type a message"
                />
                <button
                    type="submit"
                    className="rounded-full p-2 cursor-pointer transition"
                >
                    <IoSend size={25} />
                </button>
            </form>
        </div>
    );
};

export default SendMessage;
