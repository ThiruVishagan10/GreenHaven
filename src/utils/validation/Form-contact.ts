import {z} from 'zod';

const contactSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    subject: z.string().min(1, "subject is required"),
    message: z.string().min(1, "Message is required"),
})

export default contactSchema;