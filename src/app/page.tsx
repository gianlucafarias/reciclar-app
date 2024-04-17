"use client";
import React, { useEffect, useState } from "react";
import { AlignJustify, AlignRight, ArrowLeftRight, ArrowUpFromLine, Bell, CircleCheck, CircleX, Cloud, History, Landmark, Recycle, Wallet, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import metal from "@/assets/aluminium.jpg";
import bottle from "@/assets/bottle.jpg";
import glass from "@/assets/glass.jpg";
import paper from "@/assets/paper.jpg";
import Contact from "@/components/contact";
import SpinLoading from "@/components/loading/SpinLoading";
import Carousel from "@/components/carousel";
import banner from "@/assets/banner.jpeg";

export interface ApiResponse {
    message: string;
    userData: UserData;
}

const images = [
    { src: banner, alt: 'Imagen 1' },


    // Agrega más imágenes según sea necesario
  ];

export interface UserData {
    city: string;
    email: string;
    isVerified: boolean;
    isWorker: boolean;
    phoneNumber: string;
    profilePicture: string;
    state: string;
    totalPointsEarned: number;
    userDescription: string;
    username: string;
    wasteDumped: any[]; // You might want to define a type for wasteDumped if it has a specific structure
}
interface MaterialData {
    [key: string]: {
        merits: string;
        demerits: string;
    };
}

const materialData: MaterialData = {
    Plastic: {
        merits: "Plastic is versatile and lightweight.",
        demerits: "Plastic is non-biodegradable and contributes to pollution.",
    },
    Glass: {
        merits: "Glass is recyclable and does not degrade over time.",
        demerits: "Glass production requires a lot of energy.",
    },
    Paper: {
        merits: "Paper is biodegradable and recyclable.",
        demerits: "Paper production can lead to deforestation.",
    },
    Metal: {
        merits: "Metal is durable and can be recycled repeatedly.",
        demerits: "Metal extraction and processing can be energy-intensive.",
    },
};

const Page = () => {
    const [user, setUserData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [openNotification, setOpenNotification] = useState<boolean>(false);
    const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null); // State to hold the selected material
    const [openModal, setOpenModal] = useState<boolean>(false);

    const getUserData = async () => {
        try {
            const response = await fetch(`/api/auth/profile`);
            const data = await response.json();
            console.log(data);
            setUserData(data);
            setLoading(false);
            return data;
        } catch (error) {
            setLoading(false);
            console.log(error);
            return [];
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    // Function to handle opening the modal and setting the selected material
    const handleMaterialClick = (material: string) => {
        setSelectedMaterial(material);
        setOpenModal(true);
    };

    const calculateTotalCO2Saved = () => {
        if (!user || !user.userData || !user.userData.wasteDumped) return 0;

        let totalCO2Saved = 0;

        user.userData.wasteDumped.forEach((waste) => {
            // Assuming wasteDumped objects have a property named wastePoints indicating CO2 saved
            totalCO2Saved += waste.wastePoints || 0;
        });

        return totalCO2Saved;
    };

    return (
        <section className="flex flex-col gap-3 pt-2">
            {loading ? (
                <div className="min-h-screen flex justify-center items-center">
                    <SpinLoading />
                </div>
            ) : (
                <>
                    {user ? (
                        <section className=" p-2 flex flex-col gap-8 relative">
                            <div className="flex items-center justify-between ">
                                <Link href={"/profile"} className="flex items-center gap-3">
                                    <img src={user.userData?.profilePicture || "https://i.pinimg.com/564x/58/79/29/5879293da8bd698f308f19b15d3aba9a.jpg"} className=" w-12 h-12 rounded-xl" alt="" />
                                    <div className="flex flex-col gap-0">
                                        <h1 className=" font-semibold text-xl capitalize">¡Hola {user?.userData?.username || "Unknown"}!</h1>
                                        <span className=" text-sm font-medium opacity-70 ">
                                            {user?.userData?.city || "Unknown"}, {user?.userData?.state || "Unknown"}
                                        </span>
                                    </div>
                                </Link>
                               
                                <div className="flex gap-3">
                                    <Link href={"/history"}>
                                        <History size={26} className=" opacity-60" />
                                    </Link>
                                    <Bell size={26} className=" opacity-60 relative " onClick={() => setOpenNotification(!openNotification)} />
                                    <div className={` w-44 h-56 z-50 overscroll-y-scroll absolute bg-white ${openNotification ? " scale-100" : "scale-0"} duration-200 rounded-lg top-16 shadow-md shadow-black/40 right-5 border-2 border-black/10`}></div>
                                    <AlignJustify size={26} color="#015b02" absoluteStrokeWidth />
                                </div>
                            </div>

                            <div className="bg-green-600 shadow-2xl p-6 shadow-black/30 rounded-lg w-full">
    <div className="flex items-center justify-between gap-4 p-4 text-white">
        <div className="flex flex-col">
            <div className="flex">
            <span className="uppercase text-xs opacity-70 font-semibold tracking-wider">Mis Puntos</span>
            </div>
           
            <span className="text-3xl font-bold">{user?.userData.totalPointsEarned} Puntos</span>
        </div>
    </div>
    <div className="flex justify-between gap-4">
        <button
            type="button"
            onClick={() => handleMaterialClick("Plastic")}
            className="flex-1 bg-white rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-black shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
        >
            <span className="flex items-center">
                <ArrowLeftRight color="#015b02" size={20} absoluteStrokeWidth />
                <span className="ml-2">CANJEAR</span>
            </span>
        </button>
        <button
            type="button"
            onClick={() => handleMaterialClick("Plastic")}
            className="flex-1 bg-white rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-black shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
        >
            <span className="flex items-center">
                <ArrowUpFromLine color="#015b02" size={20} absoluteStrokeWidth />
                <span className="ml-2">CARGAR</span>
            </span>
        </button>
    </div>
</div>
<Carousel images={images}/>
                            <div className="flex flex-col gap-3 ">
                                <div className="flex justify-between items-center">
                                    <h1 className=" font-semibold  opacity-90 text-green-900 text-2xl tracking-wide">¿Qué vas a reciclar hoy?</h1>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div onClick={() => handleMaterialClick("Plastic")} className="flex justify-center items-center flex-col gap-2  shadow-lg rounded-xl p-3 border-2 border-black/10 shadow-black/10">
                                        <Image src={bottle} alt="bottle" height={200} className=" h-24 w-24" width={200} />
                                        <h1>Plastico</h1>
                                    </div>
                                    <div onClick={() => handleMaterialClick("Glass")} className="flex justify-center items-center flex-col  gap-2 shadow-lg rounded-xl p-3 border-2 border-black/10 shadow-black/10">
                                        <Image src={glass} alt="bottle" height={200} className=" h-24 w-24" width={200} />
                                        <h1>Vidrio</h1>
                                    </div>
                                    <div onClick={() => handleMaterialClick("Paper")} className="flex justify-center items-center flex-col gap-2  shadow-lg rounded-xl p-3 border-2 border-black/10 shadow-black/10">
                                        <Image src={paper} alt="bottle" height={200} className=" h-24 w-24" width={200} />
                                        <h1>Papel</h1>
                                    </div>
                                    <div onClick={() => handleMaterialClick("Metal")} className="flex justify-center items-center flex-col gap-2  shadow-lg rounded-xl p-3 border-2 border-black/10 shadow-black/10">
                                        <Image src={metal} alt="bottle" height={200} className=" h-24 w-24" width={200} />
                                        <h1>Metal</h1>
                                    </div>
                                </div>
                            </div>
                        </section>
                    ) : (
                        <h1 className=" text-3xl font-bold text-red-500 min-h-screen">Error loading user profile</h1>
                    )}
                </>
            )}
            <div className={`w-full min-h-screen bg-black/70 fixed top-0 left-0 right-0 z-50 ${openModal ? "scale-100" : "scale-0"} duration-200`}>
                <div className="flex justify-center items-center min-h-screen rounded-lg">
                    <div className=" bg-white rounded-xl w-[90%] h-72 shadow-lg shadow-white/10 overflow-y-scroll ">
                        <div className="flex justify-end items-end p-4">
                            <X size={40} onClick={() => setOpenModal(!openModal)} />
                        </div>
                        {selectedMaterial && (
                            <div className="p-4 flex flex-col gap-3">
                                <h2 className="text-2xl font-semibold">{selectedMaterial}</h2>
                                <p className="text-xl font-bold">
                                    <CircleCheck size={20} color="green" /> {materialData[selectedMaterial].merits}
                                </p>
                                <p className=" gap-3 items-center text-xl font-medium ">
                                    <div className=" text-xl font-bold">
                                        <CircleX color="red" size={20} /> {materialData[selectedMaterial].demerits}
                                    </div>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Contact />
        </section>
    );
};

export default Page;
