import type { ReactNode } from 'react';
import styles from './Mention.module.css';

export interface MentionProps {
  children: ReactNode;
}

export function Mention({ children }: MentionProps) {
  return <span className={styles.mention}>{children}</span>;
}
