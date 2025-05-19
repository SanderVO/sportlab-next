"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";

interface Slide {
    avatar: string;
    name: string;
    quote: string;
}

export default function HomeQuoteCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
    });

    const slides: Slide[] = [
        {
            avatar: "https://sportlabgroningen.nl/wp-content/uploads/2023/10/SPPT-shoot-header-scaled.jpg",
            name: "Stefan",
            quote: "Een aantal jaar geleden kwam ik voor het eerst bij Sportlab. Destijds nog fanatiek aan het voetballen bij Groen Geel in de stad. Inmiddels ben ik al twee jaar gestopt met voetbal en sport ik meerdere keren per week bij Sportlab. Als teamsporter was dit best even wennen, dacht ik. Maar al snel kwam ik erachter dat Sportlab als een team voelt. Een community. Tijdens de lessen, maar ook zeker daarbuiten. De kleine groepen, kunnen trainen op je eigen niveau en onderlinge competitie vind ik fijn. Je op individueel niveau kunnen verbeteren en toch trainen samen met andere, dat maakt sporten bij Sportlab voor mij leuk.",
        },
        {
            avatar: "https://sportlabgroningen.nl/wp-content/uploads/2023/10/SPPT-shoot-header-scaled.jpg",
            name: "Frank",
            quote: "Sportlab is de beste sportschool in Groningen. Ik heb hier veel geleerd en ben fitter dan ooit.",
        },
        {
            avatar: "https://sportlabgroningen.nl/wp-content/uploads/2023/10/SPPT-shoot-header-scaled.jpg",
            name: "Sander",
            quote: "Sportlab is de beste sportschool in Groningen. Ik heb hier veel geleerd en ben fitter dan ooit.",
        },
    ];

    const onNextClick = () => {
        if (!emblaApi) return;
        emblaApi.scrollNext();
    };

    const onPrevClick = () => {
        if (!emblaApi) return;
        emblaApi.scrollPrev();
    };

    const slideItem = (slide: Slide, index: number) => {
        return (
            <div key={index} className="flex-[0_0_100%] min-w-0">
                <div className="bg-sl-beige rounded-4xl h-[250px] mx-4 flex flex-col items-center py-4 px-8 text-black gap-4 justify-center">
                    <Image
                        width={50}
                        height={50}
                        loading="lazy"
                        className="rounded-full w-[50px] h-[50px]"
                        alt={slide.name}
                        src={slide.avatar}
                    />

                    <p className="font-sl-montserrat text-sm font-medium">
                        {slide.quote}
                    </p>

                    <div className="text-lg font-bold">{slide.name}</div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-row justify-between items-center gap-10">
            <div
                className="bg-sl-beige rounded-full w-24 h-24 text-background items-center justify-center text-4xl cursor-pointer transition-transform hover:scale-110 shrink-0 hidden md:flex"
                onClick={onPrevClick}
            >
                <FaLongArrowAltLeft />
            </div>

            <div className="w-full overflow-hidden" ref={emblaRef}>
                <div className="flex flex-row">
                    {slides.map((slide, index) => slideItem(slide, index))}
                </div>
            </div>

            <div
                className="bg-sl-beige rounded-full p-4 w-24 h-24 text-background items-center justify-center text-4xl transition-transform hover:scale-110 shrink-0 cursor-pointer hidden md:flex"
                onClick={onNextClick}
            >
                <FaLongArrowAltRight />
            </div>
        </div>
    );
}
