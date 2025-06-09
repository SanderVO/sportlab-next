import Image from "next/image";

export default function Footer() {
    return (
        <footer className="container mx-auto my-20">
            <div className="flex flex-col text-sl-beige tems-baseline">
                <div className="text-8xl font-sl-bebas">JOIN US!</div>

                <p>Plan je proefles en begin meteen. One more.</p>

                <div className="border-b-4 border-sl-beige w-[50px] mt-2"></div>
            </div>

            <div className="flex flex-col justify-center items-center w-full gap-20 mt-20">
                <Image
                    src="https://sportlabgroningen.nl/wp-content/uploads/2020/12/sportlab-png.png"
                    alt="Sportlab Groningen"
                    width={200}
                    height={100}
                />

                <div className="flex flex-col gap-1 items-center text-gray-500 font-montserrat">
                    <span>Koningsweg 27-7</span>
                    <span>9731 AP Groningen</span>
                    <span>stefan@sportlabgroningen.nl</span>
                    <span>06 51396554</span>
                </div>
            </div>
        </footer>
    );
}
