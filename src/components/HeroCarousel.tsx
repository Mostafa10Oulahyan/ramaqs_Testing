import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import pbImage from '../assets/pb.jpg';
import bbImage from '../assets/bb.jpg';
import twdImage from '../assets/twd.jpg';
import bcsImage from '../assets/bcs.jpg';
import gotImage from '../assets/got.jpg';
import darkImage from '../assets/dark.jpg';

// The slides array configured using the provided images
const slides = [
  {
    id: 1,
    title: "Breaking Bad",
    genres: ["Action", "Adventure", "Drama"],
    description: "A high school chemistry teacher diagnosed with terminal lung cancer turns to manufacturing and selling methamphetamine to secure his family's financial future.",
    status: "Ended",
    image: bbImage
  },
  {
    id: 2,
    title: "Prison Break",
    genres: ["Action", "Crime", "Drama"],
    description: "Michael Scofield deliberately gets himself imprisoned to help his brother Lincoln Burrows escape death row for a crime he didn't commit.",
    status: "Ended",
    image: pbImage
  },
  {
    id: 3,
    title: "The Walking Dead",
    genres: ["Horror", "Drama", "Thriller"],
    description: "Sheriff Rick Grimes wakes from a coma to find the world overrun by zombies and must lead a group of survivors to stay alive.",
    status: "Ended",
    image: twdImage
  },
  {
    id: 4,
    title: "Better Call Saul",
    genres: ["Crime", "Drama"],
    description: "The trials and tribulations of criminal lawyer Jimmy McGill in the time before he established his strip-mall law office in Albuquerque, New Mexico.",
    status: "Ended",
    image: bcsImage
  },
   {
    id: 5,
    title: "Game Of Thrones",
    genres: ["Action", "Adventure", "Drama", "Fantasy"],
    description: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia, threatening all of humanity.",
    status: "Ended",
    image: gotImage
  },
   {
    id: 6,
    title: "Dark",
    genres: ["Drama", "Mystery", "Sci-Fi", "Thriller"],
    description: "A German town is shaken by the disappearance of children, which exposes secrets spanning three generations and a complex web of time travel.",
    status: "Ended",
    image: darkImage
  }
];

const HeroCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  return (
    <div className="relative w-full h-[60vh] md:h-[75vh] lg:h-[85vh] bg-black overflow-hidden group">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        speed={1000}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          renderBullet: function (_index, className) {
            // Customizing the pagination bullet to look like the tiny dots in the reference
            return `<span class="${className} custom-bullet"></span>`;
          },
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              {/* Background Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover object-top"
              />

              {/* Full-Bleed Gradient Masks mimicking IMDb */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent w-full md:w-2/3 h-full z-10 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent h-full z-10 pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-32 md:h-48 bg-gradient-to-b from-black/90 via-black/30 to-transparent z-10 pointer-events-none" />

              {/* Content Placement */}
              <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-32 max-w-7xl mx-auto pt-16">
                <AnimatePresence mode="wait">
                  {activeIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="max-w-2xl text-white space-y-4"
                    >
                      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-2 drop-shadow-xl">
                        {slide.title}
                      </h1>

                      <div className="flex flex-wrap gap-3 mb-4">
                        {slide.genres.map((genre) => (
                          <span
                            key={genre}
                            className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-semibold rounded-full border border-white/30 backdrop-blur-md bg-white/10 shadow-sm"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>

                      <p className="text-base sm:text-lg md:text-xl text-zinc-200 line-clamp-3 md:line-clamp-4 leading-relaxed font-medium drop-shadow-md">
                        {slide.description}
                      </p>

                      <p className="text-sm md:text-lg font-bold text-white mt-4 tracking-wide shadow-black drop-shadow-lg">
                        {slide.status}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 
        We inject global styling for the custom bullets here. 
        Alternatively this could go into index.css.
      */}
      <style>{`
        .swiper-pagination {
           bottom: 20px !important;
           z-index: 50 !important;
        }
        .custom-bullet {
           width: 8px;
           height: 8px;
           display: inline-block;
           border-radius: 50%;
           background: rgba(255, 255, 255, 0.4);
           opacity: 1;
           margin: 0 4px !important;
           transition: all 0.3s ease;
           cursor: pointer;
        }
        .swiper-pagination-bullet-active.custom-bullet {
           background: #ffffff;
           transform: scale(1.2);
           box-shadow: 0 0 8px rgba(255,255,255,0.8);
        }
      `}</style>
    </div>
  );
};

export default HeroCarousel;
