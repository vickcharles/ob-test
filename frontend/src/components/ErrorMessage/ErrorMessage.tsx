import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

export const ErrorMessage = ({ message, onDismiss }: ErrorMessageProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>⚠️</div>
      <div className={styles.content}>{message}</div>
      {onDismiss && (
        <button className={styles.dismissButton} onClick={onDismiss}>
          ✕
        </button>
      )}
    </div>
  );
}; 