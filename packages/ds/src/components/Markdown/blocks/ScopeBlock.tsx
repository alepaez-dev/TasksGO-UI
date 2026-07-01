import { cn } from '../../../utils/cn';
import { Card } from '../../Card';
import styles from './ScopeBlock.module.css';

export interface ScopeBlockProps {
  included: readonly string[];
  excluded: readonly string[];
}

export function ScopeBlock({ included, excluded }: ScopeBlockProps) {
  return (
    <div className={styles.grid}>
      <Card
        variant="subtle"
        header={<span className={styles.label}>Included</span>}
      >
        <ul className={cn(styles.list, styles.included)}>
          {included.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      </Card>
      <Card
        variant="subtle"
        header={<span className={styles.label}>Excluded</span>}
      >
        <ul className={cn(styles.list, styles.excluded)}>
          {excluded.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
