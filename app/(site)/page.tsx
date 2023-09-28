import Image from "next/image";
import User from "./components/Form";
import logo from "../../public/assets/icon.png";

export default function Home() {
    return (
        <div className="flex min-h-full flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Image
                    src={logo}
                    width="0"
                    height="0"
                    sizes="100vw"
                    className="w-auto mx-auto rounded-md"
                    alt="Logo"
                    // className="mx-auto w-auto rounded-md"
                />
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-[#d1d3d7]">
                    Sign In
                </h2>
            </div>
            {/* Sign In Form */}
            <User />
        </div>
    );
}
