import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import React from "react"

interface OvalButtonProps extends React.ComponentProps<typeof Button> {
    text: string;
}

export default function OvalButton({ 
    text, 
    className, 
    disabled,
    variant = "oval",
    type = "submit",
    ...props 
}: OvalButtonProps) {
    return (
        <motion.div
            whileHover={disabled ? {} : { scale: 1.05 }}
            whileTap={disabled ? {} : { scale: 0.95 }}
            className="w-full flex justify-center"
        >
<<<<<<< HEAD
            <Button type="submit" variant="oval" className="h-11 uppercase">
=======
            <Button 
                disabled={disabled} 
                variant={variant} 
                type={type}
                className={`h-11 uppercase ${className || ''}`}
                {...props} 
            >
>>>>>>> feature/language-page
                {text}
            </Button>
        </motion.div>
    );
}