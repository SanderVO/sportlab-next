import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="bg-sl-beige">
            <div className="container py-28">
                <div className="prose max-w-none">
                    <h1>404</h1>

                    <p className="mb-4">
                        Deze pagina kon niet worden gevonden.
                    </p>
                </div>

                <Button variant="black">
                    <Link href="/">Naar de homepagina</Link>
                </Button>
            </div>
        </div>
    );
}
