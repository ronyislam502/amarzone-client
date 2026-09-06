"use client"

import { selectCurrentUser } from "@/src/redux/features/auth/authSlice";
import { useMyProfileQuery } from "@/src/redux/features/user/userApi";
import { useAppSelector } from "@/src/redux/hooks";
import { ChevronDown, Heart, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const NavAvatar = () => {
    const user = useAppSelector(selectCurrentUser);
    const { data: userData } = useMyProfileQuery({}, { skip: !user });
    const profile = userData?.data;

    console.log("profile", profile)

    return (
        <div className="flex items-center gap-1 sm:gap-2">
            {
                user ? (
                    <Link
                        href={`/${user?.role?.toLowerCase()}`}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-[#004f9a] transition-colors"
                    >
                        <div className="avatar">
                            <div className="ring-primary ring-offset-base-100 w-7 h-7 rounded-full ring-2 ring-offset-2 overflow-hidden">
                                <Image
                                    width={28}
                                    height={28}
                                    alt="Avatar"
                                    src={profile?.avatar || "https://res.cloudinary.com/dkk9lvbtf/image/upload/v1785693062/amarzone_fnnw8s.png"}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="hidden sm:flex flex-col text-left leading-tight">
                            <span className="text-[10px] text-blue-100 font-normal">Hi, {profile?.name?.split(" ")[0] || "User"}</span>
                            <span className="text-xs font-bold text-white -mt-0.5 flex items-center gap-0.5">
                                Account
                                <ChevronDown className="w-3 h-3 text-blue-200" />
                            </span>
                        </div>
                    </Link>
                ) : (
                    <Link
                        href="/login"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-[#004f9a] transition-colors"
                    >
                        <User className="w-5 h-5 text-white" />
                        <div className="hidden sm:flex flex-col text-left leading-tight">
                            <span className="text-[10px] text-blue-100 font-normal">Sign In</span>
                            <span className="text-xs font-bold text-white -mt-0.5 flex items-center gap-0.5">
                                Account
                                <ChevronDown className="w-3 h-3 text-blue-200" />
                            </span>
                        </div>
                    </Link>
                )
            }
        </div >
    );

}

export default NavAvatar; 