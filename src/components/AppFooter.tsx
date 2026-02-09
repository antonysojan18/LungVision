import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AppFooter = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="shrink-0 w-full pointer-events-none select-none flex items-center justify-center py-3"
      style={{ minHeight: 'var(--footer-height)', willChange: 'auto' }}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center justify-center gap-0.5 text-center">
        <p className="text-[10px] md:text-xs font-medium tracking-wide text-gray-700 dark:text-gray-400">
          Powered by Intelligence. Driven by Care
        </p>
        <p className="text-[9px] md:text-[10px] font-medium text-gray-600 dark:text-gray-500">
          Made By Tony & Co
        </p>
        <Link to="/records" className="text-[9px] text-gray-400 hover:text-primary mt-1 cursor-pointer">
          View Records
        </Link>
      </div>
    </motion.footer>
  );
};

export default AppFooter;
