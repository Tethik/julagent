import styles from "./progressbar.module.css";

export default function Progressbar() {
  return (
    <div className={styles.progress}>
      <div className={styles.progressValue}></div>
    </div>
  );
}
