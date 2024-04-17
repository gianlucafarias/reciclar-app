"use client";
import React, { useRef, useState } from "react";
import { ScaleLoader } from "react-spinners";
import emailjs from "@emailjs/browser";
import { MailPlus } from "lucide-react";

import Toast from "@/utils/toast";

const Contact = () => {
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const form = useRef<HTMLFormElement>(null);

    const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setLoading(true);
            await emailjs.sendForm(process.env.NEXT_PUBLIC_SERVICE_ID!, process.env.NEXT_PUBLIC_TEMPLATE_ID!, form.current!, process.env.NEXT_PUBLIC_PUBLIC_KEY);
            Toast.SuccessshowToast("Message Sent Successfully");
            setMessage("");
            form.current!.reset();
        } catch (error) {
            setLoading(false);
            Toast.ErrorShowToast("An error occurred, Please try again");
            console.error("An error occurred:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value);
    };
    return (
        <form autoComplete="off" ref={form} onSubmit={sendEmail} className="flex flex-col gap-3 mb-44 ">
            <div className="flex flex-col ">
                <h1 className=" font-semibold  opacity-90 text-green-900 text-2xl tracking-wide">Soporte Tecnico</h1>
                <div className="flex flex-col">
                    <input type="text" placeholder="Ingresa tu correo electronico" name="from_email" className=" border-2 border-black/40 p-3 mt-5 rounded-lg bg-transparent" />
                    <select name="subject" className=" border-2 border-black/40 p-3 mt-5 rounded-lg bg-transparent">
                        <option value="Select Type of Incident">Selecciona un problema</option>
                        <option value="Overflowing Bins">Tuve un problema al cargar mis puntos</option>
                        <option value="Illegal Dumping">Tuve un problema al recibir puntos</option>
                        <option value="Littering">Mis puntos no aparecen</option>
                        <option value="Abandoned Waste">Quiero dar de baja mi cuenta</option>
                    </select>
                    <textarea placeholder="Describe tu problema" className=" bg-transparent h-64  mb-5 border-black/40 mt-2 p-4 rounded-lg w-full flex-auto  border-2" required autoComplete="false" name="message" value={message} onChange={handleMessageChange}></textarea>
                    {loading ? (
                        <button className="flex justify-center items-center bg-green-500 text-white gap-3 p-4 " disabled>
                            <ScaleLoader color="#fff" className=" scale-50" /> Procesando...
                        </button>
                    ) : (
                        <button className="flex justify-center items-center gap-3 bg-green-600 text-white rounded-lg p-4">
                            <MailPlus />
                            Reportar
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
};

export default Contact;
