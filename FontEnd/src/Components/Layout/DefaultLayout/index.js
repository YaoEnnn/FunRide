import Navbar from "../../Navbar";
import styles from "./styles.module.scss";

function DefaultLayout({ children }) {
  return <div className={styles.content}>{children}</div>;
}

export default DefaultLayout;
