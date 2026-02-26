import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface bthText{
    text: string
}

export default function OvalButton({ text }: bthText) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full flex justify-center"
        >
            <Button type="submit" variant="oval" className="h-11 uppercase w-full">
                {text}
            </Button>
        </motion.div>
    );
}
