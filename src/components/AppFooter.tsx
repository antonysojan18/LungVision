import { motion } from 'framer-motion';

const AppFooter = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-0 left-0 right-0 z-40"
    >
      <div className="glass-card border-t border-border/30 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm md:text-base text-foreground/80 font-light tracking-wide">
              Powered by <span className="text-primary font-medium">Intelligence</span>
              <span className="mx-2">·</span>
              Driven by <span className="text-primary font-medium">Care</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Made by <span className="font-semibold text-foreground/70">Tony & Co</span>
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default AppFooter;
