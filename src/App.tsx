/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import ImageSlider from "./components/ImageSlider";

const PEOPLE_DATA = [
  {
    id: "curtin",
    name: "John Curtin",
    role: "Prime Minister of Australia",
    faction: "Australian Government",
    desc: "Recognised the severity of the Japanese threat and made the controversial decision to bring Australian troops home from the Middle East to defend the mainland.",
    initials: "JC",
  },
  {
    id: "grant",
    name: "Etheridge Grant",
    role: "Rear Admiral",
    faction: "Allied Naval Forces",
    desc: "Commanded the naval defence of Darwin Harbour. Despite immense losses, he coordinated the rescue of hundreds of sailors from burning waters.",
    initials: "EG",
  },
  {
    id: "toyoshima",
    name: "Hajime Toyoshima",
    role: "A6M Zero Pilot",
    faction: "Imperial Japanese Navy",
    desc: "His Zero fighter was damaged during the raid. He crash-landed on Melville Island, becoming the first Japanese prisoner of war captured in Australia.",
    initials: "HT",
  },
  {
    id: "ulungura",
    name: "Matthias Ampiyartiliwayi Ulungura",
    role: "Tiwi Man",
    faction: "Melville Island",
    desc: "A Tiwi man who single-handedly captured Toyoshima using only a tomahawk, famously saying, 'Stick 'em up, two-fella'.",
    initials: "MU",
    image: "/matthias.jpg"
  },
];

function ArchivalDossier() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  });

  return (
    <div ref={sectionRef} className="relative w-full bg-[#0C0C0B]" style={{ height: `${PEOPLE_DATA.length * 100}vh` }}>
      {/* Background Dimmer */}
      <div className="absolute inset-0 bg-black z-0 pointer-events-none" />
      
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden py-12 md:py-24">
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 flex flex-col h-full justify-center">
          
          {/* Header */}
          <div className="w-full mb-8 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-memorial-line pb-6 relative z-30 shrink-0">
            <div>
              <p className="font-display text-memorial-gold tracking-[0.3em] uppercase text-sm mb-2">
                The Experience
              </p>
              <h2 className="font-display text-3xl md:text-5xl text-memorial-text uppercase">
                Meet the People
              </h2>
            </div>
            <div className="hidden md:flex flex-col items-end opacity-50 mt-4 md:mt-0">
               <p className="font-mono text-xs tracking-[0.2em] uppercase text-memorial-muted">Scroll to inspect</p>
               <div className="w-px h-8 bg-memorial-line mt-2 overflow-hidden relative">
                  <motion.div 
                    animate={{ y: ["-100%", "100%"] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute inset-0 bg-memorial-gold"
                  />
               </div>
            </div>
          </div>

          {/* The Wheel Display */}
          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center mt-4 md:mt-12 min-h-[500px]">
            
            {/* Left Text */}
            <div className="md:col-span-3 relative h-32 md:h-[300px] z-30 order-2 md:order-1 flex items-center md:items-center justify-center md:justify-end text-center md:text-right">
               {PEOPLE_DATA.map((person, index) => (
                 <LeftTextItem key={person.id} index={index} person={person} smoothProgress={smoothProgress} />
               ))}
            </div>

            {/* Center Wheel */}
            <div 
              className="md:col-span-6 relative h-[400px] md:h-full w-full flex items-center justify-center z-20 order-1 md:order-2" 
              style={{ perspective: "1200px" }}
            >
               {PEOPLE_DATA.map((person, index) => (
                 <WheelItem 
                   key={person.id} 
                   index={index} 
                   person={person} 
                   smoothProgress={smoothProgress} 
                 />
               ))}
            </div>

            {/* Right Text */}
            <div className="md:col-span-3 relative h-32 md:h-[300px] z-30 order-3 flex items-center md:items-center justify-center md:justify-start text-center md:text-left">
               {PEOPLE_DATA.map((person, index) => (
                 <RightTextItem key={person.id} index={index} person={person} smoothProgress={smoothProgress} />
               ))}
            </div>

          </div>
          
          <div className="w-full flex md:hidden justify-center mt-4 pt-4 border-t border-memorial-line relative z-30 opacity-50">
             <p className="font-mono text-xs tracking-[0.2em] uppercase text-memorial-muted">Scroll to inspect</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeftTextItem({ index, person, smoothProgress }: { index: number, person: any, smoothProgress: any }) {
  const distance = useTransform(smoothProgress, (p: number) => {
    return (p * (PEOPLE_DATA.length - 1)) - index;
  });

  const opacity = useTransform(distance, d => {
    const abs = Math.abs(d);
    return Math.max(0, 1 - abs * 1.5);
  });
  
  const y1 = useTransform(distance, d => -d * 60);
  const y2 = useTransform(distance, d => -d * 40);
  const y3 = useTransform(distance, d => -d * 20);

  const filter = useTransform(distance, d => `blur(${Math.abs(d) * 4}px)`);

  return (
    <motion.div
      style={{ opacity, filter, pointerEvents: useTransform(opacity, o => (o as number) > 0.5 ? 'auto' : 'none') }}
      className="absolute top-1/2 -translate-y-1/2 w-full"
    >
      <motion.p style={{ y: y1 }} className="font-display text-memorial-gold tracking-[0.2em] uppercase text-xs md:text-sm mb-2 md:mb-3">
        {person.faction}
      </motion.p>
      <motion.h3 style={{ y: y2 }} className="font-display text-3xl md:text-4xl text-memorial-text uppercase tracking-tight mb-3 md:mb-4 leading-none">
        {person.name}
      </motion.h3>
      <motion.p style={{ y: y3 }} className="font-display text-sm md:text-base text-memorial-muted uppercase tracking-widest">
        {person.role}
      </motion.p>
    </motion.div>
  );
}

function RightTextItem({ index, person, smoothProgress }: { index: number, person: any, smoothProgress: any }) {
  const distance = useTransform(smoothProgress, (p: number) => {
    return (p * (PEOPLE_DATA.length - 1)) - index;
  });

  const opacity = useTransform(distance, d => {
    const abs = Math.abs(d);
    return Math.max(0, 1 - abs * 1.5);
  });
  
  const y1 = useTransform(distance, d => -d * 50);
  const y2 = useTransform(distance, d => -d * 30);

  const filter = useTransform(distance, d => `blur(${Math.abs(d) * 4}px)`);

  return (
    <motion.div
      style={{ opacity, filter, pointerEvents: useTransform(opacity, o => (o as number) > 0.5 ? 'auto' : 'none') }}
      className="absolute top-1/2 -translate-y-1/2 w-full flex flex-col items-center md:items-start"
    >
      <motion.div style={{ y: y1 }} className="hidden md:block w-8 h-[1px] bg-memorial-gold mb-6" />
      <motion.p style={{ y: y2 }} className="font-serif text-base md:text-lg text-memorial-muted leading-relaxed max-w-sm">
        {person.desc}
      </motion.p>
    </motion.div>
  );
}

function WheelItem({ index, person, smoothProgress }: { index: number, person: any, smoothProgress: any }) {
  const distance = useTransform(smoothProgress, (p: number) => {
    const currentIndex = p * (PEOPLE_DATA.length - 1);
    return currentIndex - index;
  });

  const y = useTransform(distance, d => -d * 220); 
  const scale = useTransform(distance, d => Math.max(0.5, 1 - Math.abs(d) * 0.15));
  const rotateX = useTransform(distance, d => -d * 25); 
  const z = useTransform(distance, d => -Math.abs(d) * 100);
  
  const opacity = useTransform(distance, d => {
    const abs = Math.abs(d);
    return Math.max(0, 1 - abs * 0.55);
  });
  const zIndex = useTransform(distance, d => 30 - Math.round(Math.abs(d) * 10));
  const filter = useTransform(distance, d => `blur(${Math.abs(d) * 3}px)`);

  const initialsY = useTransform(distance, d => d * 70);
  const initialsScale = useTransform(distance, d => 1 + Math.abs(d) * 0.3);
  const initialsRotateZ = useTransform(distance, d => d * -5);

  return (
    <motion.div
      style={{
        y,
        z,
        scale,
        rotateX,
        opacity,
        zIndex,
        filter,
        transformOrigin: 'center center',
        transformStyle: 'preserve-3d',
      }}
      className={`absolute aspect-[3/4] w-full max-w-[220px] md:max-w-sm bg-[#0C0C0B] border border-memorial-line flex items-center justify-center overflow-hidden shadow-2xl`}
    >
       <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 bg-black font-display text-xs tracking-[0.3em] text-memorial-muted uppercase z-30 whitespace-nowrap border border-memorial-line/50 border-t-0 shadow-lg">
         Record 0{index + 1}
       </div>
       
       <div className="relative w-full h-full flex items-center justify-center bg-[#070707] overflow-hidden">
         <div className="absolute inset-4 border border-memorial-line/30 z-20 mix-blend-overlay" />
         <div className="absolute inset-0 opacity-[0.15] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] z-10 pointer-events-none mix-blend-overlay"></div>
         
         <motion.div 
           className="absolute z-10 flex items-center justify-center w-full h-full"
           style={{ y: initialsY, scale: initialsScale, rotateZ: initialsRotateZ }}
         >
           {person.image ? (
             <img src={person.image} alt={person.name} className="w-full h-full object-cover opacity-80 grayscale contrast-125 sepia-[0.3]" />
           ) : (
             <span className="font-display text-[8rem] md:text-[12rem] text-memorial-text/80 drop-shadow-2xl font-light tracking-tighter mix-blend-plus-lighter">
               {person.initials}
             </span>
           )}
         </motion.div>
       </div>
       
       <motion.div 
         className="absolute inset-0 pointer-events-none z-40 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"
         style={{
           opacity: useTransform(distance, d => 0.5 + Math.abs(d) * 0.5)
         }}
       />
       
       <motion.div 
         className="absolute inset-0 bg-black pointer-events-none z-50"
         style={{
           opacity: useTransform(distance, d => Math.abs(d) * 0.6)
         }}
       />
    </motion.div>
  );
}

const TIMELINE_DATA = [
  {
    time: "08:00",
    title: "The strike launches",
    desc: "One hundred and eighty‑eight aircraft — Zeros, dive bombers and level bombers — lift from the Japanese carrier fleet in the Timor Sea."
  },
  {
    time: "09:35",
    title: "The warning that wasn't heard",
    desc: "The mission on Bathurst Island radios a large formation approaching. It is discounted as the returning American P‑40s."
  },
  {
    time: "09:58",
    title: "The first bombs fall",
    desc: "With no siren and no warning, the first raid breaks over the harbour and town. It will last about forty minutes."
  },
  {
    time: "10:00",
    title: "The Post Office",
    desc: "A direct hit kills nine — the postmaster, his family and his staff — sheltering in a trench."
  },
  {
    time: "10:45",
    title: "USS Peary",
    desc: "The American destroyer, one of the largest ships in the harbour, is struck by five bombs."
  },
  {
    time: "12:00",
    title: "The second raid",
    desc: "Fifty‑four land‑based bombers return at high altitude to strike the RAAF base at Parap."
  },
  {
    time: "13:00",
    title: "Peary is lost",
    desc: "She sinks stern‑first. Ninety‑one of her crew go down with her — the heaviest single loss of American life in Australian waters."
  },
  {
    time: "Dusk",
    title: "The reckoning begins",
    desc: "At least 235 are dead. Eight ships lie sunk, more than thirty aircraft destroyed. More bombs fell on Darwin than on Pearl Harbour."
  }
];

function TimelineEvent({ event }: { event: typeof TIMELINE_DATA[0] }) {
  return (
    <div className="relative pl-8 md:pl-24 py-32 md:py-48 group">
      {/* Node / Marker on the line */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-40% 0px -40% 0px" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-[-5px] top-[148px] md:top-[212px] w-2.5 h-2.5 rounded-full bg-memorial-gold z-10"
      />
      
      <div className="flex flex-col md:flex-row gap-6 md:gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-32 shrink-0 md:pt-1"
        >
          <span className="font-display text-4xl md:text-5xl text-memorial-gold uppercase tracking-wider block drop-shadow-md">
            {event.time}
          </span>
        </motion.div>
        
        <div className="max-w-2xl">
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
            transition={{ duration: 1.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-3xl md:text-5xl text-memorial-text uppercase tracking-wide mb-6"
          >
            {event.title}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-xl md:text-2xl text-memorial-muted leading-relaxed"
          >
            {event.desc}
          </motion.p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  });
  
  return (
    <div className="min-h-screen bg-memorial-bg selection:bg-memorial-gold/30 selection:text-white relative" ref={containerRef}>
      
      {/* Noise Texture Overlay */}
      <div className="noise-overlay" />
      
      {/* Subtle vignette/gradient background to give depth */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)] z-0" />

      <div className="relative z-10">
        {/* Intro Header - Hero Section */}
        <div className="min-h-[100vh] flex items-center max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-24">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col"
            >
              <p className="font-mono text-memorial-muted tracking-[0.2em] uppercase text-xs mb-16">
                19 February 1942 &mdash; 09:58 ACST
              </p>
              
              <h1 className="font-display text-7xl md:text-8xl xl:text-9xl text-memorial-text uppercase tracking-tight mb-8 leading-[0.85]">
                WW2<br/>
                Happened<br/>
                Here
              </h1>
              
              <p className="font-serif text-xl md:text-2xl text-memorial-muted leading-relaxed max-w-xl mb-12">
                Stand on the wharf where the war reached Australia &mdash; the raid of <em className="text-memorial-gold not-italic">19 February 1942</em>, in immersive VR, holograms and theatre, with the Royal Flying Doctor Service.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                <button className="bg-gradient-to-r from-[#D7B576] to-[#C6A15B] text-black font-mono text-xs tracking-[0.2em] uppercase py-4 px-8 rounded-full shadow-[0_0_20px_rgba(198,161,91,0.2)] hover:shadow-[0_0_30px_rgba(198,161,91,0.4)] transition-all duration-300">
                  Book Tickets
                </button>
                <button className="text-memorial-text font-mono text-xs tracking-[0.2em] uppercase border-b border-memorial-gold pb-2 hover:text-memorial-gold transition-colors duration-300">
                  Enter The Experience
                </button>
              </div>
            </motion.div>
            
            {/* Right Content - Slider */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-full aspect-square relative"
            >
              {/* Viewfinder Corners */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t border-l border-memorial-gold/50 z-20 pointer-events-none" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t border-r border-memorial-gold/50 z-20 pointer-events-none" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b border-l border-memorial-gold/50 z-20 pointer-events-none" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b border-r border-memorial-gold/50 z-20 pointer-events-none" />

              <div className="w-full h-full relative overflow-hidden border border-memorial-line/30 shadow-2xl">
                <ImageSlider 
                  imageLeft="/1a.png" 
                  imageRight="/1.png" 
                  altLeft="Darwin Wharf Today"
                  altRight="Darwin Wharf during WW2 bombing"
                />
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="w-full flex flex-col items-center justify-center pb-20 relative z-20"
        >
          <div className="w-[1px] h-16 bg-memorial-line relative overflow-hidden mb-4">
            <motion.div 
              animate={{ y: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute inset-0 bg-memorial-gold" 
            />
          </div>
          <span className="font-mono text-[10px] tracking-[0.3em] text-memorial-muted uppercase">
            Scroll
          </span>
        </motion.div>

      {/* Cultural Warning */}
      <div className="w-full bg-[#070707] py-48 border-y border-memorial-line relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 md:px-16 text-center">
          <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="w-16 h-px bg-memorial-signal mx-auto mb-12" />
            <p className="font-mono text-memorial-signal tracking-[0.3em] uppercase text-xs mb-8">
              Cultural Warning
            </p>
            <p className="font-serif text-xl md:text-2xl text-memorial-text leading-loose mb-12">
              Aboriginal and Torres Strait Islander viewers are advised that this website contains names, images, and stories of deceased persons.
            </p>
            <div className="w-16 h-px bg-memorial-signal mx-auto" />
          </motion.div>
        </div>
      </div>

      {/* Archival Grid Section */}
      <ArchivalDossier />

      {/* The Timeline */}
      <div className="max-w-5xl mx-auto px-6 md:px-16 pb-32 pt-24" ref={timelineRef}>
        <div className="relative">
          {/* Background static line */}
          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-memorial-line" />
          
          {/* Animated drawing line */}
          <motion.div 
            className="absolute left-0 top-0 bottom-0 w-[1px] bg-memorial-gold origin-top"
            style={{ scaleY }}
          />
          
          {TIMELINE_DATA.map((event, index) => (
            <TimelineEvent key={index} event={event} />
          ))}
        </div>
      </div>
      
      {/* In Memoriam */}
      <div className="w-full bg-black py-48 border-t border-memorial-line relative overflow-hidden">
        {/* Subtle noise overlay specifically for the memorial section */}
        <div className="noise-overlay" style={{ opacity: 0.1 }} />
        
        <div className="max-w-4xl mx-auto px-6 md:px-16 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-mono text-memorial-muted tracking-[0.4em] uppercase text-xs mb-12">
              Roll of Honour
            </p>
            <h2 className="font-display text-5xl md:text-7xl text-memorial-text uppercase tracking-tight mb-16">
              In Memoriam
            </h2>
            
            <div className="w-px h-24 bg-gradient-to-b from-memorial-gold to-transparent mx-auto mb-16" />
            
            <p className="font-serif text-2xl md:text-3xl text-memorial-text leading-loose italic max-w-2xl mx-auto mb-24">
              "They shall grow not old, as we that are left grow old: <br/>
              Age shall not weary them, nor the years condemn. <br/>
              At the going down of the sun and in the morning <br/>
              We will remember them."
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-left max-w-3xl mx-auto font-mono text-sm tracking-widest text-memorial-muted">
              <div className="border-b border-memorial-line pb-4 flex justify-between">
                <span className="text-memorial-text">H. Toyoshima</span>
                <span>IJN</span>
              </div>
              <div className="border-b border-memorial-line pb-4 flex justify-between">
                <span className="text-memorial-text">Postmaster General Staff</span>
                <span>9</span>
              </div>
              <div className="border-b border-memorial-line pb-4 flex justify-between">
                <span className="text-memorial-text">USS Peary Crew</span>
                <span>91</span>
              </div>
              <div className="border-b border-memorial-line pb-4 flex justify-between">
                <span className="text-memorial-text">Unidentified</span>
                <span>~134</span>
              </div>
            </div>
            
            <p className="font-mono text-[10px] text-memorial-muted/50 tracking-[0.2em] mt-32 uppercase">
              Dedicated to the 235+ souls lost on 19 February 1942.
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Footer whitespace buffer */}
      <div className="h-[10vh] bg-black" />
      </div>
    </div>
  );
}
