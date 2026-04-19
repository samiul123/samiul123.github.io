// const SkillSlideShow = (props) => {
//     return (
//         <div className="relative z-20 w-screen lg:hidden">
//             <Slide arrows={false} indicators={true}>
//                 {skillGroups.map((group, index) => {
//                     return (
//                         <div key={index}
//                              className=" p-5 w-full">
//                             <h4 className="mb-6 text-center">{group.title}</h4>
//                             <div className="h-0.5 bg-white mb-5 mx-auto w-20"/>
//                             <div className="grid grid-cols-3 gap-4">
//                                 {group.items.map((item, i) => (
//                                     <motion.img
//                                         key={i}
//                                         src={item.logo}
//                                         alt="logo"
//                                         className="w-12 h-auto mx-auto"
//                                         whileHover={{scale: 1.25}}
//                                         transition={{duration: 0.3}}
//                                         onMouseEnter={() => props.handleMouseEnter(item)}
//                                         onMouseLeave={props.handleMouseLeave}
//                                     />
//                                 ))}
//                             </div>
//                         </div>
//                     )
//                 })}
//             </Slide>
//         </div>
//     );
// }



// export const ResponsiveSkills = (props) => {
//     return (
//         props.smallScreens ? <SkillSlideShow/> : (
//             <div className="flex items-start overflow-x-hidden max-md:hidden">
//                 {skillGroups.map((group, index) => {
//                     return (
//                         <motion.div
//                             key={index}
//                             className="mx-auto p-5 relative overflow-hidden transition duration-300 ease-in-out transform hover:translate-y-3 hover:font-bold"
//                             onMouseEnter={() => props.handleGroupMouseEnter(group)}
//                             onMouseLeave={props.handleGroupMouseLeave}
//                             initial={{opacity: 0}}
//                             animate={{opacity: props.isInView ? 1 : 0}}
//                             transition={{duration: 0.5, delay: index * 0.2}}>
//                             <h4 className="mb-3 text-center">{group.title}</h4>
//                             <motion.div
//                                 className="h-0.5 bg-white mb-5 mx-auto"
//                                 initial={{width: '20%'}}
//                                 animate={{width: props.hoveredGroup === group ? '100%' : '20%'}}
//                                 transition={{duration: 0.3}}
//                             />
//                             <div className="grid grid-cols-3 gap-4">
//                                 {group.items.map((item, i) => (
//                                     <motion.img
//                                         onMouseEnter={() => props.handleMouseEnter(item)}
//                                         onMouseLeave={props.handleMouseLeave}
//                                         key={i}
//                                         src={item.logo}
//                                         alt="logo"
//                                         className="w-12 h-auto"
//                                         whileHover={{scale: 1.25}}
//                                         transition={{duration: 0.3}}
//                                     />
//                                 ))}
//                             </div>
//                         </motion.div>
//                     )
//                 })}
//             </div>
//         )
//     )
// }