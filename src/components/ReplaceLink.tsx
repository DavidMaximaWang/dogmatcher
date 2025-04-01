import { useNavigate } from 'react-router-dom';
import styles from '../styles/ReplaceLink.module.css';

interface ReplaceLinkProps {
    to: string;
    children: React.ReactNode;
    className?: string;
    state?: any;
  }
export default function ReplaceLink({ to, children , state}: ReplaceLinkProps) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(to, {
      replace: true,
      state,
    });
  };
  return (
    <a href={to} onClick={handleClick} className={styles.link}>
      {children}
    </a>
  );
}


