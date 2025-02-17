import styles from "./registrationPage.module.css";

import RegistrationForm from "@/components/modules/forms/RegistrationForm/RegistrationForm";


const RegistrationPage: React.FC = () => {
 
  return (
    <div className={styles.main}>
        <RegistrationForm/>
    </div>
  );
}

export default RegistrationPage;
