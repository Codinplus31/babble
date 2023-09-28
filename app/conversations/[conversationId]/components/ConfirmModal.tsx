"use client";

import Modal from "@/app/components/Modals/Modal";
import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";

import { LuAlertTriangle } from "react-icons/lu";
import { Dialog } from "@headlessui/react";
import Button from "@/app/components/Button";

interface ConfirmModalProps {
    isOpen?: boolean;
    onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose }) => {
    const router = useRouter();
    const { conversationId } = useConversation();

    const [isLoading, setIsLoading] = useState(false);

    const onDelete = useCallback(() => {
        setIsLoading(true);

        axios
            .delete(`/api/conversations/${conversationId}`)
            .then(() => {
                onClose();
                router.push("/conversations");
                router.refresh();
                setTimeout(() => window.location.reload(), 5000);
            })
            .catch(() => toast.error("Something went wrong!"))
            .finally(() => setIsLoading(false));
    }, [conversationId, onClose, router]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 bg-[#0c1317]">
                    <LuAlertTriangle className="h-6 w-6 text-[#662121]" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-[#d1d3d7]"
                    >
                        Delete Chat ?
                    </Dialog.Title>
                    <div className="mt-2">
                        <p className="text-[#8696a0] text-sm">
                            Messages will be removed from both devices.
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <Button disabled={isLoading} danger onClick={onDelete}>
                    Delete Chat
                </Button>
                <Button disabled={isLoading} secondary onClick={onClose}>
                    Cancel
                </Button>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
