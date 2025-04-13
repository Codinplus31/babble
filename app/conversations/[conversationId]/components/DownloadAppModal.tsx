"use client"

import type React from "react"

import Modal from "@/app/components/Modals/Modal"
import { FaGooglePlay, FaApple } from "react-icons/fa"

interface DownloadAppModalProps {
  isOpen?: boolean
  onClose: () => void
}

const DownloadAppModal: React.FC<DownloadAppModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-[#d1d3d7] mb-4">Get the Full Experience!</h2>
        <p className="text-[#8696a0] text-center mb-6">
          Download our app to send unlimited photos and videos. Enjoy more features and better performance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <a
            href="https://expo.dev/artifacts/eas/ubSwEmr52MPWajFJ98cpsd.apk"
            download="sext.apk"
            className="flex items-center justify-center gap-2 bg-[#0c1317] hover:bg-[#1a1f25] text-[#d1d3d7] py-3 px-6 rounded-lg w-full transition"
          >
            <FaGooglePlay size={24} />
            <div className="flex flex-col">
             
              <span className="font-bold">Download the Android App</span>
            </div>
          </a>
          
        </div>
      </div>
    </Modal>
  )
}

export default DownloadAppModal



