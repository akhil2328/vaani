import { motion } from "framer-motion";

export default function VoiceCard({ tag, title, desc }) {
  const cls =
    tag === "CRITICAL"
      ? "critical"
      : tag === "WARNING"
      ? "warning"
      : "";

  return (
    <motion.div
      className="voice-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.03 }}
    >
      <div className={`tag ${cls}`}>{tag}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
      <small>AI 95% CONFIDENCE</small>
    </motion.div>
  );
}