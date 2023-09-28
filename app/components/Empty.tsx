import Image from "next/image";
import logo from "../../public/assets/icon.png";

const Empty = () => {
    return (
        <div className="px-4 py-20 sm:px-6 lg:px-8 h-[100vh] flex justify-center items-center bg-[#1a1f25] mt-[-80px]">
            <div className="text-center items-center flex flex-col fixed">
                <Image
                    src={logo}
                    width="10"
                    height="10"
                    sizes="100vw"
                    className="rounded-3xl"
                    alt="Babble"
                />
                <h1 className="mt-4 text-[#d1d3d7] font-semibold text-2xl">
                    Welcome to Babble!
                </h1>
                <p className="mt-2 text-[#d1d3d7] font-semibold text-sm">
                    (This is a real-time chat application)
                </p>
                <h3 className="mt-6 text-xl font-semibold text-[#fff]">
                    Select a chat or Start a new chat
                </h3>
            </div>
        </div>
    );
};

export default Empty;
