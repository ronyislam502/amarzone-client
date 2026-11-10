"use client"

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

const slides = [
  {
    title: "Compassionate Care for Your Family",
    description: "Experience world-class healthcare with a personal touch. Our dedicated team is here to support your journey to wellness.",
    image: "/hero-1.png",
    cta1: "Book Appointment",
    cta2: "Our Services",
  },
  {
    title: "Advanced Technology, Better Outcomes",
    description: "We combine cutting-edge medical equipment with expert knowledge to provide the most accurate diagnoses and treatments.",
    image: "/hero-2.png",
    cta1: "Learn More",
    cta2: "Find a Doctor",
  },
  {
    title: "Together for a Healthier Tomorrow",
    description: "Join thousands of satisfied patients who trust HealBridge for their medical needs. Your health is our top priority.",
    image: "/hero-3.png",
    cta1: "Get Started",
    cta2: "View Specialities",
  },
];

const Hero=() =>{
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <section className="relative w-full h-[700px] md:h-[800px] lg:h-[900px] overflow-hidden">
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="h-full ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="relative w-full h-full pl-0">
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/40" /> {/* Overlay for readability */}
              </div>
              
              <div className="relative h-full container mx-auto px-6 md:px-12 lg:px-20 flex flex-col justify-center py-24 md:py-32 lg:py-40 text-white">
                <div className="max-w-4xl space-y-10">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl text-gray-200 max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                    {slide.description}
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white border-none h-14 px-8 text-lg font-semibold rounded-full">
                      {slide.cta1}
                    </Button>
                    <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm h-14 px-8 text-lg font-semibold rounded-full">
                      {slide.cta2}
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {/* Decorative Gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}


export default Hero;