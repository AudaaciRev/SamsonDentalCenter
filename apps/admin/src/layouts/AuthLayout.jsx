import styles from './AuthLayout.module.css';

const AuthLayout = ({ children }) => {
    return <div className={styles.wrapper}>{children}</div>;
};
export default AuthLayout;




