import { certificationBg } from "../assets";
import React, { useEffect, useState } from "react";
import {certifications, skillGroups} from "../constants";
import { motion } from "framer-motion";
import { fadeIn } from "../utils/motion";
import { styles } from "../styles";
import { Slide } from "react-slideshow-image";
import 'react-slideshow-image/dist/styles.css';
import { chunkArray } from "../utils/helpers";

export const Certification = (props) => {
    const [chunkedGroups, setChunkedGroups] = useState([]);
    const [chunkSize, setChunkSize] = useState(0);

    const handleResize = () => {
        let chunkSize = 1;
        if (window.innerWidth >= 1024) chunkSize = 3;
        // else if (window.innerWidth >= 640 && window.innerWidth < 1024) chunkSize = 2;
        setChunkSize(chunkSize);
        setChunkedGroups(chunkArray(certifications, chunkSize));
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div
            id={props.id}
            key={props.id}
            className="uppercase relative p-10 h-auto bg-cover text-white flex flex-col items-center space-y-10"
            style={{ backgroundImage: `url(${certificationBg})` }}
        >
            <div className="absolute inset-0 bg-custom-gray opacity-80 z-0"></div>
            <h2 className={styles.pageTitle}>Certifications</h2>
            <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false, amount: 0.25 }}
                    className="relative z-10 w-full lg:w-screen">
                <Slide arrows={false}
                       indicators={chunkSize < certifications.length}
                       autoplay={chunkSize < certifications.length}
                       canSwipe={chunkSize < certifications.length}
                >
                    {
                        chunkedGroups.map((group, groupIndex) => (
                            <div key={groupIndex} className="flex flex-wrap w-full">
                                {
                                    group.map((item, itemIndex) => (
                                        <motion.div
                                            key={itemIndex}
                                            className="flex-1 rounded-lg items-center z-10 p-3"
                                            whileHover={{ scale: 1.1 }}
                                            variants={fadeIn('right', 'spring', itemIndex * 0.5, 0.75)}
                                        >
                                            <a
                                                className="hover:cursor-pointer"
                                                onClick={() => window.open(item.credentialUrl)}
                                            >
                                                <img
                                                    src={item.image}
                                                    alt={item.issuer}
                                                    className="w-full h-auto rounded-lg"
                                                />
                                            </a>
                                        </motion.div>
                                    ))
                                }
                            </div>
                        ))
                    }
                </Slide>
            </motion.div>
        </div>
    )
}
