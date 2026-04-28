import { motion } from "framer-motion";

export default function StatCard({ title, value, color }) {
  return (
    <motion.div
      className={`stat-card ${color}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.05 }}
    >
      <p>{title}</p>
      <h1>{value}</h1>
    </motion.div>
  );
}