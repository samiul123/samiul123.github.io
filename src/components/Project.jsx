import {github, show} from "../assets"; // Ensure you import other assets as needed
import { styles } from "../styles";
import {projects} from "../constants";
import {Fragment, useEffect, useState} from "react";
import {chunkArray} from "../utils/helpers";
import {motion} from "framer-motion";
import {fadeIn, staggerContainer} from "../utils/motion";

const ProjectCard = ({
                         id,
                         title,
                         description,
                         images,
                         githubUrl,
                         demoUrl,
                         index,
                         active,
                         handleClick,
                     }) => {
    return (
        <motion.div
            variants={fadeIn('right', 'spring', index * 0.5, 0.75)}
            className={`relative ${
                active === id ? 'lg:flex-[3] flex-[10] ring-1 ring-custom-green' : 'lg:flex-[1] flex-[1]'
            } flex items-center justify-center h-[420px] cursor-pointer rounded-b-[24px] overflow-hidden`}
            onClick={() => handleClick(id)}
        >
            {/*<div className="absolute top-0 left-0 w-full h-full bg-custom-gray opacity-80"></div>*/}

            {/*TODO: use background component*/}
            <picture className="absolute w-full h-full object-cover rounded-b-[24px]">
                {images.map((image, index) => (
                    <Fragment key={index}>
                        <source type={image.type} srcSet={image.srcSet}/>
                        {image.fallback && <img src={image.srcSet} alt={title} className="w-full h-full object-cover"/>}
                    </Fragment>
                ))}
            </picture>


            {active !== id ? (
                <div className="relative flex items-center justify-start pr-[4.5rem]">
                    <h3
                        className="font-extrabold uppercase w-[150px] h-[30px]
                        whitespace-nowrap sm:text-[20px] text-[18px] tracking-[1px]
                        lg:bottom-[7rem] lg:rotate-[-90deg] lg:origin-[0,0]
                        leading-none"
                    >
                        {title}
                    </h3>
                </div>
            ) : (
                <div
                    className="absolute bottom-0 p-8 justify-start w-full flex-col rounded-b-[24px] bg-custom-dark/90 opacity-80 z-10">
                    <div className="absolute inset-0 flex justify-end m-5">
                        <div
                            onClick={() => window.open(githubUrl, '_blank')}
                            className="sm:w-11 sm:h-11 w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
                        >
                            <img
                                src={github}
                                alt="source code"
                                className="w-4/5 h-4/5 object-contain"
                            />
                        </div>
                    </div>

                    <h2 className="font-bold sm:text-[32px] text-[24px] uppercase sm:mt-0 -mt-[1rem]">
                        {title}
                    </h2>
                    <p
                        className="sm:text-[14px] text-[12px]
                        max-w-3xl sm:leading-[24px] leading-[18px]
                        font-poppins tracking-[1px]"
                    >
                        {description}
                    </p>
                    {
                        demoUrl &&
                        <button
                            className="relative flex justify-start gap-3 sm:text-[16px] text-[14px]
                        font-bold items-center py-5 pl-3 pr-3
                        whitespace-nowrap sm:w-[138px] sm:h-[50px]
                        w-[125px] h-[46px] rounded-[10px]
                        sm:mt-[22px] mt-[16px] bg-black transition duration-[0.2s] ease-in-out"
                            onClick={() => window.open(demoUrl, '_blank')}
                        >
                            <img
                                src={show}
                                alt="Show"
                                className="sm:w-[34px] sm:h-[34px] w-[30px] h-[30px] object-contain"
                            />
                            DEMO
                        </button>
                    }

                </div>
            )}
        </motion.div>
    );
};


export const Project = (props) => {
    const [active, setActive] = useState('mindquest');
    return (
        <div id={props.id}
             key={props.id}
             className="relative p-10 h-auto bg-custom-dark text-white flex flex-col items-center justify-center space-y-10"
        >
            <h2 className={styles.pageTitle}>PROJECTS</h2>
            <motion.div
                variants={staggerContainer()}
                    initial="hidden"
                    whileInView="show"
                    viewport={{once: false, amount: 0.25}}
                    className={`${styles.innerWidth} mx-auto flex flex-col`}>
                    <div className="flex lg:flex-row flex-col max-w-6xl lg:min-h-[40vh] min-h-[70vh] gap-5 p-8">
                        {projects.map((project, index) => (
                            <ProjectCard
                                key={project.id}
                                index={index}
                                {...project}
                                active={active}
                                handleClick={setActive}
                            />
                        ))}
                    </div>
                </motion.div>
        </div>
    )
}
