import React, {useCallback, useEffect, useRef, useState} from "react";
import {motion, useInView} from "framer-motion";
import {driftUp, vibrate} from "../utils/motion";
import {close, send, sendwebp} from "../assets";
import emailjs from '@emailjs/browser';
import {sanitizeEmail, sanitizeMessage, sanitizeName, validateForm} from "../utils/contact";
import ReCAPTCHA from "react-google-recaptcha";
import {contacts} from "../constants";
import {styles} from "../styles";

export const Contact = (props) => {
    const captchaRef = useRef(null);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.25 });
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
        handleClose();

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
        const token = captchaRef.current.getValue();
        if (!token) {
            setLoading(false);
            setError({
                type: 'captcha',
                field: '',
                message: 'Please complete the CAPTCHA to verify you are not a robot.',
                isValid: false
            })
            return;
        }

        emailjs.send(
            process.env.REACT_APP_EMAIL_JS_SERVICE_ID,
            process.env.REACT_APP_EMAIL_JS_TEMPLATE_ID,
            {
                from_name: sanitizedForm.name,
                from_email: sanitizedForm.email,
                message: sanitizedForm.message,
                "g-recaptcha-response": token
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
                captchaRef.current.reset();
            },
            (error) => {
                setLoading(false);
                setError({
                    type: 'emailjs',
                    field: '',
                    message: 'Something went wrong. Please try again.'
                })
                captchaRef.current.reset();
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

    const variants = error?.message !== '' ? vibrate : driftUp(0.2);

    useEffect(() => {
        if (error?.message !== '' || success !== '') {
            const timer = setTimeout(() => {
                handleClose();
            }, 5000);
            return () => clearTimeout(timer); // Clean up the timer on component unmount or dependency change
        }
    }, [error, handleClose, success]);

    return (
        <div
            id={props.id}
            key={props.id}
            className="bg-custom-dark text-white px-6 lg:px-20 py-20 flex flex-col items-center gap-10">
            <h2 className={styles.pageTitle}>Contact</h2>
            <div ref={ref} className="overflow-hidden flex sm:flex-col justify-center">
                <motion.div
                    initial="hidden"
                    animate={isInView ? "show" : "hidden"}
                    variants={driftUp(0.2)}
                    className="flex flex-col sm:flex-row gap-5 items-center justify-center">
                    <div className="bg-[#0e0e0e] border border-[#1a1a1a] flex-[.75] p-4 sm:p-8 rounded-lg lg:min-w-[700px] md:min-w-[600px] min-w-[300px]">
                        <div className="overflow-hidden">
                            {
                                (error?.message || success) &&
                                <motion.div
                                    initial="hidden"
                                    animate={(error?.message !== '' || success !== '') && isInView ? 'show' : 'hidden'}
                                    variants={variants}
                                    className={`${error?.message !== '' ? 'bg-red-500' : 'bg-custom-green-v2'} p-2 gap-2 flex 
                            rounded-lg w-fit mx-auto items-center justify-center mb-3`}>
                                    {error?.message || success}
                                    <button type="button"
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
                            className="flex flex-col sm:p-4 gap-5">
                            <label className="flex flex-col gap-2">
                                <span className="font-medium">Your Name</span>
                                <input type="text"
                                       autoComplete="on"
                                       name="name"
                                       value={form.name}
                                       placeholder="What's your name?"
                                       onChange={handleChange}
                                       className="px-3 py-4 rounded-lg font-medium bg-[#111] border border-[#1a1a1a] outline-none focus:border-custom-green text-white w-full transition-colors"
                                />
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="font-medium">Your Email</span>
                                <input type="email"
                                       autoComplete="on"
                                       name="email"
                                       value={form.email}
                                       placeholder="What's your email?"
                                       onChange={handleChange}
                                       className="px-3 py-4 rounded-lg font-medium bg-[#111] border border-[#1a1a1a] outline-none focus:border-custom-green text-white w-full transition-colors"
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
                                    className="px-3 py-4 rounded-lg font-medium bg-[#111] border border-[#1a1a1a] outline-none focus:border-custom-green text-white w-full transition-colors resize-none"
                                />
                            </label>
                            <ReCAPTCHA sitekey='6LfIKPEpAAAAAArbixvvZm1F1ZBdku-cAd7xitxi'
                                       ref={captchaRef}
                                       theme='dark'
                            />
                            <button
                                type="submit"
                                className="p-3 flex w-fit gap-2 items-center justify-center bg-custom-green text-black font-bold rounded-lg hover:opacity-90 transition-opacity">
                                {loading ? 'SENDING' : 'SEND'}
                                <picture>
                                    <source type="image/webp" srcSet={sendwebp}/>
                                    <source type="image/png" srcSet={send}/>
                                    <img
                                        src={send}
                                        alt="send"
                                        className="sm:w-[26px] sm:h-[26px] w-[23px] h-[23px] object-contain"
                                    />
                                </picture>
                            </button>
                        </form>
                    </div>
                    <div className="flex sm:flex-col flex-row items-center gap-2">
                        {
                            contacts.map((contact) => (
                                <a key={contact.id} href={contact.url}>
                                    <img className="w-10 h-10" src={contact.icon} alt={contact.id}/>
                                </a>

                            ))
                        }
                    </div>

                </motion.div>
            </div>
        </div>
    );
}