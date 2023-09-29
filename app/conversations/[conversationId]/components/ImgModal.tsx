"use client";

import Modal from "@/app/components/Modals/Modal";
import Image from "next/image";

interface ImgModalProps {
    isOpen?: boolean;
    onClose: () => void;
    src?: string | null;
}

const ImgModal: React.FC<ImgModalProps> = ({ isOpen, onClose, src }) => {
    if (!src) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="w-100 h-100">
                <Image
                    alt="Image"
                    width="0"
                    height="0"
                    sizes="100vw"
                    // fill
                    className="w-full h-auto"
                    src={src}
                />
            </div>
        </Modal>
    );
};

export default ImgModal;
