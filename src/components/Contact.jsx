import React, {useCallback, useEffect, useRef, useState} from "react";
import {motion, useInView} from "framer-motion";
import {slideIn, vibrate} from "../utils/motion";
import {close, send} from "../assets";
import emailjs from '@emailjs/browser';
import {sanitizeEmail, sanitizeMessage, sanitizeName, validateForm} from "../utils/contact";

export const Contact = (props) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.25 });
    const formRef = useRef();
    const [form, setForm] = useState({
        name: '',
        email: '',
        message: ''
    })
    const [error, setError] = useState({type: '', field: '', message: '', isValid: true});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === error.field) handleClose();
        setForm({ ...form, [name]: value });
    };

    function handleSubmit(e) {
        e.preventDefault();

        setLoading(true);

        const sanitizedForm = {
            name: sanitizeName(form.name),
            email: sanitizeEmail(form.email),
            message: sanitizeMessage(form.message)
        };

        const result = validateForm(sanitizedForm);
        if (!result.isValid) {
            setLoading(false);
            setError(result);
            return;
        }

        emailjs.send(
            process.env.REACT_APP_EMAIL_JS_SERVICE_ID,
            process.env.REACT_APP_EMAIL_JS_TEMPLATE_ID,
            {
                from_name: sanitizedForm.name,
                from_email: sanitizedForm.email,
                message: sanitizedForm.message
            },
            {
                publicKey: process.env.REACT_APP_EMAIL_JS_PUBLIC_KEY
            }
        ).then(
            () => {
                setLoading(false);
                setForm({
                    name: '',
                    email: '',
                    message: ''
                })
                setSuccess('Thank you. I will get back to you as soon as possible.')
            },
            (error) => {
                setLoading(false);
                setError({
                    type: 'emailjs',
                    field: '',
                    message: 'Something went wrong. Please try again.'
                })
                console.log(error);
            }
        )

    }

    const handleClose = useCallback(() => {
        if (error?.message) {
            setError({
                type: '',
                field: '',
                message: ''
            });
        } else {
            setSuccess('');
        }
    }, [error])

    const variants = error?.message !== '' ? vibrate : slideIn('up', 'tween', 0.2, 1);

    useEffect(() => {
        if (success !== '') {
            const timer = setTimeout(() => {
                handleClose();
            }, 10000);
            return () => clearTimeout(timer); // Clean up the timer on component unmount or dependency change
        }
    }, [handleClose, success]);

    return (
        <div
            id={props.id}
            key={props.id}
            className="p-10 h-auto bg-custom-gray text-white flex flex-col items-center space-y-10">
            <h2 className="font-lulo uppercase text-4xl z-10">Contact</h2>
            <div ref={ref} className="overflow-hidden min-w-[800px]">
                <motion.div
                    initial="hidden"
                    animate={isInView ? "show" : "hidden"}
                    viewport={{ once: false, amount: .25 }}
                    variants={slideIn('left', 'tween', 0.2, 1)}
                    className="bg-gray-600 flex-[0.75] p-8 rounded-lg">
                    <div className="overflow-hidden">
                        {
                            (error?.message || success) &&
                            <motion.div
                                initial="hidden"
                                animate={(error?.message !== '' || success !== '') && isInView ? 'show' : 'hidden'}
                                variants={variants}
                                className={`${error?.message !== '' ? 'bg-red-500' : 'bg-custom-green-v2'} p-2 gap-2 flex 
                            rounded-lg w-fit mx-auto items-center justify-center`}>
                                {error?.message || success}
                                <button type="submit"
                                        onClick={handleClose}
                                        className="w-[15px] h-[15px]">
                                    <img src={close} alt="close" className="object-contain"/>
                                </button>
                            </motion.div>
                        }
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        ref={formRef}
                        className="flex flex-col p-5 gap-6">
                        <label className="flex flex-col gap-2">
                            <span className="font-medium">Your Name</span>
                            <input type="text"
                                   name="name"
                                   value={form.name}
                                   placeholder="What's your name?"
                                   onChange={handleChange}
                                   className="px-3 py-4 rounded-lg
                               border-none font-medium bg-custom-gray outline-none"
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="font-medium">Your Email</span>
                            <input type="text"
                                   name="email"
                                   value={form.email}
                                   placeholder="What's your email?"
                                   onChange={handleChange}
                                   className="px-3 py-4 rounded-lg border-none font-medium bg-custom-gray outline-none"
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="font-medium">Your Message</span>
                            <textarea
                                rows="8"
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                placeholder="What's your message?"
                                className="px-3 py-4 rounded-lg border-none font-medium bg-custom-gray outline-none
                                resize-none"
                            />
                        </label>
                        <button
                            type="submit"
                            className="p-3 flex w-fit gap-2 items-center justify-center bg-custom-gray font-bold
                            rounded-lg hover:bg-black">
                            {loading ? 'SENDING' : 'SEND'}
                            <img
                                src={send}
                                alt="send"
                                className="sm:w-[26px] sm:h-[26px] w-[23px] h-[23px] object-contain"
                            />
                        </button>

                    </form>
                </motion.div>
            </div>
        </div>
    );
}