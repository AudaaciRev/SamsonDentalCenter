import React from 'react';
import styles from './ErrorMessage.module.css';

const ErrorMessage = ({ message }) => {
    if (!message) return null;
    return (
        <div className={styles.container}>
            <span className={styles.icon}>âš ï¸</span>
            <p className={styles.text}>{message}</p>
        </div>
    );
};

export default ErrorMessage;




