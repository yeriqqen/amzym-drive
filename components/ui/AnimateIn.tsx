import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimateInProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function AnimateIn({ children, className = '', delay = 0 }: AnimateInProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay: delay,
                ease: [0.17, 0.55, 0.55, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
