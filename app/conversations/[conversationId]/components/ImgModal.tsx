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
            <div className="w-80 h-80">
                <Image alt="Image" className="object-cover" fill src={src} />
            </div>
        </Modal>
    );
};

export default ImgModal;
