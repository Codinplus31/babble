"use client";

import Button from "@/app/components/Button";
import Input from "@/app/components/Input/Input";
import { useState, useCallback, useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Google from "./Google";

import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { toast } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Variant = "LOGIN" | "REGISTER";

const User = () => {
    const [variant, setVariant] = useState<Variant>("LOGIN");
    const [isLoading, setIsLoading] = useState(false);

    const session = useSession();
    const router = useRouter();

    useEffect(() => {
        // After authentication, push to conversations screen
        if (session?.status === "authenticated") {
            router.push("/conversations");

            setTimeout(() => window.location.reload(), 4000);
        }
    }, [session?.status, router]);

    const toggleVariant = useCallback(() => {
        if (variant === "LOGIN") {
            setVariant("REGISTER");
        } else {
            setVariant("LOGIN");
        }
    }, [variant]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        if (variant === "REGISTER") {
            // axios register
            axios
                .post("/api/register", data)
                .then(() => signIn("credentials", { ...data, redirect: false }))
                .then((callback) => {
                    if (callback?.error) {
                        toast.error("Invalid Credentials!");
                    }
                    if (callback?.ok) {
                        router.push("/conversations");
                        setTimeout(() => window.location.reload(), 4000);
                    }
                })
                .catch(() => toast.error("Something went wrong!"))
                .finally(() => setIsLoading(false));
        }

        if (variant === "LOGIN") {
            // nextauth login - app/api/auth/[...nextauth]/route.ts
            signIn("credentials", {
                ...data,
                redirect: false,
            })
                .then((callback) => {
                    if (callback?.error) {
                        toast.error("Invalid Credentials!");
                    }
                    if (callback?.ok && !callback?.error) {
                        toast.success("You are logged in now!");
                        router.push("/conversations");
                        setTimeout(() => window.location.reload(), 4000);
                    }
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    const socialMedia = (action: string) => {
        setIsLoading(true);

        // Nextauth social login
        signIn(action, { redirect: false })
            .then((callback) => {
                if (callback?.error) {
                    toast.error("Invalid credentials!");
                }
                if (callback?.ok && !callback?.error) {
                    toast.success("You are logged in now!");
                    router.push("/conversations");
                    setTimeout(() => window.location.reload(), 4000);
                }
            })
            .finally(() => setIsLoading(false));
    };

    const guestMail = "fincher@gmail.com";
    const guestPassword = "se7en";

    return (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md text-[#d1d3d7] text-xl font-semibold">
            <div className="rounded-xl bg-[#202c33] px-4 py-8 shadow sm:rounded-xl sm:px-10 2xl:w-full">
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {variant === "REGISTER" && (
                        <Input
                            id="name"
                            label="Name"
                            register={register}
                            required
                            errors={errors}
                            disabled={isLoading}
                        />
                    )}
                    <Input
                        id="email"
                        label="Email"
                        type="email"
                        register={register}
                        errors={errors}
                        disabled={isLoading}
                        required
                    />
                    <Input
                        id="password"
                        label="Password"
                        type="password"
                        register={register}
                        errors={errors}
                        disabled={isLoading}
                        required
                    />
                    <div className="text-[#000]">
                        <Button disabled={isLoading} fullWidth type="submit">
                            {variant === "LOGIN" ? "Sign In" : "Sign Up"}
                        </Button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#8696a0]" />
                        </div>
                        <div className="relative flex justify-center text-base">
                            <span className="bg-[#d1d3d7] px-2 text-[#0c1317] rounded-full">
                                OR
                            </span>
                        </div>
                    </div>
                    <div className="mt-6">
                        {/* Google */}
                        <Google
                            icon={FcGoogle}
                            onClick={() => socialMedia("google")}
                        />
                    </div>
                </div>
                <div className="flex gap-2 justify-center text-lg mt-6 px-2">
                    <div>
                        {variant === "LOGIN"
                            ? "New to Babble?"
                            : "Already a user?"}
                    </div>
                    <div
                        className="underline cursor-pointer"
                        onClick={toggleVariant}
                    >
                        {variant === "LOGIN" ? "Sign Up" : "Sign In"}
                    </div>
                </div>
                <div className="flex justify-center items-center">
                    <div className="mt-2 p-4 border-2 border-white-500 bg-[#000]">
                        <p className="text-red-500 flex justify-center">
                            Guest Details
                        </p>
                        <p>Email: {guestMail}</p>
                        <p>Password: {guestPassword}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default User;
