import { Button } from "@/components/ui/button"

interface bthText{
    text: string
}

export default function OvalButton({ text }: bthText) {
    return (
        <Button type="submit" variant="oval" className="h-11 uppercase">
            {text}
        </Button>
    );
}
