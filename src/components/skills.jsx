import {skillsBg} from "../assets";
import {skillGroups} from "../constants";
import {motion, AnimatePresence, useInView} from "framer-motion";
import {useRef, useState} from "react";
import {styles} from "../styles";

const Skills = (props) => {
    const [hoveredGroup, setHoveredGroup] = useState(null);
    const [hoveredItem, setHoveredItem] = useState(null);


    const handleGroupMouseEnter = (group) => {
        setHoveredGroup(group);
    };

    const handleGroupMouseLeave = () => {
        setHoveredGroup(null);
    };

    const handleMouseEnter = (item) => {
        setHoveredItem(item);
    };

    const handleMouseLeave = () => {
        setHoveredItem(null);
    };

    const getVisibleItems = () => {
        if (!hoveredItem) return []
        for (const group of skillGroups) {
            for (const item of group.items) {
                if (item.id === hoveredItem.id) {
                    return group.items;
                }
            }
        }
    };

    const visibleItems = getVisibleItems();
    const skillRef = useRef(null);
    const isInView = useInView(skillRef, {amount: .25});

    return (
        <div id={props.id}
             key={props.id}
             ref={skillRef}
             className="relative p-10 h-auto bg-cover text-white flex flex-col items-center space-y-10"
             style={{backgroundImage: `url(${skillsBg})`}}>
            <div className="absolute inset-0 bg-custom-gray opacity-80 z-0"></div>
            <h2 className={styles.pageTitle}>SKILLS</h2>
            <div className="flex flex-col md:flex-row items-start">
                {skillGroups.map((group, index) => {
                    return (
                        <motion.div
                            key={index}
                            className="mx-auto p-5 relative overflow-hidden transition duration-300 ease-in-out transform hover:translate-y-3 hover:font-bold"
                            onMouseEnter={() => handleGroupMouseEnter(group)}
                            onMouseLeave={handleGroupMouseLeave}
                            initial={{opacity: 0}}
                            animate={{opacity: isInView ? 1 : 0}}
                            transition={{duration: 0.5, delay: index * 0.2}}>
                            <h4 className="mb-3 text-center">{group.title}</h4>
                            <motion.div
                                className="h-0.5 bg-white mb-5 mx-auto"
                                initial={{width: '20%'}}
                                animate={{width: hoveredGroup === group ? '100%' : '20%'}}
                                transition={{duration: 0.3}}
                            />
                            <div className="grid grid-cols-3 gap-4">
                                {group.items.map((item, i) => (
                                    <motion.img
                                        onMouseEnter={() => handleMouseEnter(item)}
                                        onMouseLeave={handleMouseLeave}
                                        key={i}
                                        src={item.logo}
                                        alt="logo"
                                        className="w-12 h-auto"
                                        whileHover={{scale: 1.25}}
                                        transition={{duration: 0.3}}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )
                })}
            </div>
            <div className="relative w-full flex justify-center mt-10">
                <div
                    className="flex space-x-4 text-gray-400 font-semibold overflow-hidden w-full justify-center items-center">
                    {
                        hoveredItem &&
                        <AnimatePresence initial={false}>
                            {visibleItems.map(item => (
                                <motion.div
                                    key={item.name}
                                    initial={{opacity: 0, x: 50}}
                                    animate={{opacity: 1, x: 0}}
                                    exit={{opacity: 0, x: -50}}
                                    transition={{duration: 0.3}}
                                    className={`transition-all ${hoveredItem?.name === item.name ? 'text-white text-2xl' : 'text-gray-400 text-lg'}`}
                                >
                                    {item.name}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    }
                </div>
            </div>
        </div>
    )
}

export default Skills;