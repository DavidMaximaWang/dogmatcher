import { useNavigate } from 'react-router-dom';
import { ReactNode } from 'react';
import styles from '../styles/ReplaceLink.module.css';

interface ReplaceLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
}

export default function ReplaceLink({ to, children, className = '' }: ReplaceLinkProps) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(to, { replace: true });
  };

  return (
    <a href={to} onClick={handleClick} className={styles.link}>
      {children}
    </a>
  );
}


