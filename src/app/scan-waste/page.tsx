"use client";
import React, { useEffect, useRef, useState } from "react";
import { MoonLoader } from "react-spinners";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { Scan, Trash } from "lucide-react";
import Link from "next/link";

import Toast from "@/utils/toast";

const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
];

const Page: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [photoData, setPhotoData] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [aiLoading, setaiLoading] = useState(false);
    const [aiData, setAiData] = useState<any | null>(null);
    const [demo, setDemo] = useState<any | null>(null);
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            if (videoRef.current) {
                setLoading(false);
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            Toast.ErrorShowToast("No pudimos acceder a tu cámara");
            console.error("Error accessing camera:", err);
        }
    };

    const capturePhoto = () => {
        if (videoRef.current) {
            const video = videoRef.current;
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataURL = canvas.toDataURL("image/jpeg");
                setPhotoData(dataURL);
            }
        }
    };

    const scanImage = async () => {
        try {
            setaiLoading(true);
            const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
            const model = genAI.getGenerativeModel({ model: "gemini-pro-vision", safetySettings: safetySettings });
            const prompt = "¿Le parece esto un residuo reciclable o no reciclable? Envía el % de probabilidad, sólo con dos decimales. No envíe mensajes de texto que digan 'sí' o 'no', solo %. Envíe tanto el % de cuánto es reciclable como cuánto también indica el tipo de residuo. como desechos secos, desechos húmedos, etc. y detectar el tipo de material utilizado en los desechos y darle un nombre relevante a los desechos y también el recuento total de desechos. enviar respuesta en un tipo json sin ``` ni nada adicional `` claves y valores puros en json";
            const formatMatch = photoData.match(/^data:(image\/(\w+));base64,/);
            if (!formatMatch) {
                console.error("Unsupported image format");
                alert("Formato de imagen no soportado");
                return;
            }

            const image = {
                inlineData: {
                    data: photoData.replace(formatMatch[0], ""),
                    mimeType: "image/jpeg",
                },
            };

            const result = await model.generateContent([prompt, image]);
            const jsonString = result.response.text().replace(/```json([\s\S]*?)```/, "$1");
            const parsedJson = JSON.parse(jsonString);
            setDemo(result.response.text());
            console.log(parsedJson);
            setaiLoading(false);
            setAiData(parsedJson);
        } catch (err) {
            console.error("Error scanning image:", err);
            alert("Error scanning image" + err);
        } finally {
            setaiLoading(false);
        }
    };

    useEffect(() => {
        if (photoData) {
            scanImage();
        }
    }, [photoData]);

    useEffect(() => {
        startCamera();
    }, []);

    return (
        <div className="flex relative flex-col  mt-4 w-full mb-40">
            <h1 className=" flex items-start justify-start mb-7 text-3xl font-bold text-start">Escanear Residuos</h1>
            <div>
                {loading ? <div className="w-full rounded-lg relative animate-pulse bg-black/80" style={{ height: "400px", borderRadius: "50px" }} /> : <video ref={videoRef} autoPlay muted className=" w-full rounded-lg relative h-96" />}
                <button onClick={capturePhoto} className=" bg-green-600 w-16 h-16 m-auto rounded-full  flex gap-3 items-center text-center justify-center  text-3xl font-bold text-white mt-7  p-4">
                    <div className="flex flex-col gap-3">
                        <Scan size={40} />
                    </div>
                </button>
            </div>
            {aiLoading ? (
                <div className=" bg-black/80 w-full min-h-screen fixed left-0 right-0 top-0">
                    <div className="flex justify-center items-center min-h-screen">
                        <MoonLoader color="#fff" size={90} />
                    </div>
                </div>
            ) : (
                <>
                    {aiData && (
                        <div className=" bg-black/5 shadow-lg w-full mt-12 mb-28 rounded-2xl border-2 border-black/10">
                            <div className="flex flex-col gap-4  p-4">
                                <h1 className="text-2xl uppercase font-bold">Tipo de Residuo:</h1>
                                <h1 className=" text-lg font-bold capitalize">Nombre : {aiData.name || "unknown"}</h1>
                                <h1 className=" text-lg font-bold capitalize">Tipo : {aiData.type || "unknown"}</h1>
                                <h1 className=" text-lg font-bold">Reciclable: {aiData.recyclable || "unknown"}</h1>
                                <h1 className=" text-lg font-bold">No Reciclable: {aiData.non_recyclable || "unknown"}</h1>
                                <h1 className=" text-lg font-bold">Residuo Seco: {aiData.dry_waste || "unknown"}</h1>
                                <h1 className=" text-lg font-bold">Total Reciclado: {aiData.total_count || "0"}</h1>
                                <h1 className=" text-lg font-bold">Residuo Humedo: {aiData.wet_waste || 0}</h1>
                                {aiData.material && <h1 className=" text-lg font-bold capitalize">Material: {aiData.material.replace(/_/g, " ")}</h1>}

                                {demo}
                                <Link href={`/dump-waste?recycle=${aiData.recyclable > 70 ? true : false}&&dryWaste=${aiData.dry_waste > 70 ? true : false}&&wasteName=${aiData.name}&&wasteType=${aiData.type}&&material=${aiData.material}&&totalwaste=${aiData.total_count}`} className=" flex justify-center items-center gap-3 bg-green-600 text-white p-5 rounded-lg">
                                    <Trash />
                                    Colocar Residuos{" "}
                                </Link>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Page;
