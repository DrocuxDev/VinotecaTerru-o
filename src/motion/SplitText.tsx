import { motion } from 'motion/react';
import { useMotionPolicy } from './MotionPolicy';

export function SplitText({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) {
  const { level } = useMotionPolicy();
  let character = 0;
  return <span className={className}><span className="sr-only">{text}</span><span aria-hidden="true">
    {text.split(/(\s+)/).map((word, i) => /^\s+$/.test(word) ? word : <span key={i} className="inline-block whitespace-nowrap">{Array.from(word).map((letter, j) => {
      const index = character++;
      return <motion.span key={j} className="inline-block" initial={level === 'reduced' ? false : { y: '35%', opacity: 0, rotateX: -35 }} whileInView={{ y: '0%', opacity: 1, rotateX: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: level === 'reduced' ? 0 : 0.48, delay: level === 'reduced' ? 0 : delay + Math.min(index * 0.012, 0.3), ease: [0.22, 1, 0.36, 1] }}>{letter}</motion.span>;
    })}</span>)}
  </span></span>;
}
