"use client";

import React from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormData } from '@/types/contact';
import contactSchema from '../utils/validation/Form-contact';


function ContactForm({sendMail}:{sendMail:(data : FormData) => Promise<{success:boolean, error:string|null}> }) {
    const {register, handleSubmit, reset , formState: {errors, isSubmitting} } = useForm<FormData>({
        resolver: zodResolver(contactSchema),
    });
    const onSubmit = async (data: FormData) => {
        console.log(data);
        const result = await sendMail(data);
        if(result.success){
            reset();
            alert("Message sent successfully");
        }else{
            alert(result.error);
        }
    }

    return (
        <div className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Send us a message</h2>
            <form onSubmit={handleSubmit(onSubmit)} >
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Name</label>
                    <input 
                        {...register("name", { required: "Name is required" })}
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded-md" 
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Email</label>
                    <input 
                        {...register("email", { 
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                            }
                        })}
                        type="email" 
                        className="w-full p-2 border border-gray-300 rounded-md" 
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Subject</label>
                    <input 
                        {...register("subject", { required: "Subject is required" })}
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded-md" 
                    />
                    {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Message</label>
                    <textarea 
                        {...register("message", { required: "Message is required" })}
                        className="w-full p-2 border border-gray-300 rounded-md" 
                        rows={4}
                    ></textarea>
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition"
                >
                    {isSubmitting ? "Sending..." : "Send Message"}

                </button>
            </form>
        </div>
    )
}

export default ContactForm