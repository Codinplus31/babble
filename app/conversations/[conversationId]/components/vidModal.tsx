"use client";

import Modal from "@/app/components/Modals/Modal";
import Image from "next/image";

interface VidModalProps {
    isOpen?: boolean;
    onClose: () => void;
    src?: string | null;
}

const VidModal: React.FC<VidModalProps> = ({ isOpen, onClose, src }) => {
    if (!src) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="w-100 h-100">
                <video width="100vw" height="100vw" controls preload="none">
      <source src={src} type="video/mp4" />
      
      Your browser does not support the video tag.
    </video>
            </div>
        </Modal>
    );
};

export default ImgModal;
