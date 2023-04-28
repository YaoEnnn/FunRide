import { createRef, useState } from "react";
import AnimatedOutlet from "../../../AnimatedOutlet";
import CustomInput from "../../../CustomInput";
import styles from "./styles.module.scss";
import { error, success } from "../../../lib/toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddDiscount() {
  const discountRef = createRef();
  const codeRef = createRef();
  const availableRef = createRef();
  const navigate = useNavigate();

  const [discount, setDiscount] = useState("");
  const [code, setCode] = useState("");
  const [available, setAvailable] = useState("");

  return (
    <AnimatedOutlet>
      <div className={styles.base}>
        <div className={styles.header}>
          <h1>--Add a new Discount Code--</h1>
        </div>
        <div className={styles.addnew}>
          <label>Discount:</label>
          <CustomInput
            type="number"
            custom_ref={discountRef}
            placeholder={"Discount"}
            variant={discount}
          ></CustomInput>
          <label>Code: </label>
          <CustomInput
            custom_ref={codeRef}
            type="text"
            placeholder={"Code"}
            variant={code}
          ></CustomInput>
          <label>Number available:</label>
          <CustomInput
            custom_ref={availableRef}
            placeholder={"Number"}
            type="number"
          ></CustomInput>
          <button
            onClick={() => {
              if (!discountRef.current.value) {
                error("Please enter the discount");
                setDiscount("error");
                return;
              }
              if (!codeRef.current.value) {
                error("Please enter a password");
                setCode("error");
                return;
              }
              if (!availableRef.current.value) {
                error("Please enter a password");
                setAvailable("error");
                return;
              }
              axios
                .post("manager/add-discount", {
                  discount: discountRef.current.value.trim(),
                  code: codeRef.current.value.trim(),
                  available: availableRef.current.value.trim(),
                })
                .then((resp) => {
                  console.log(resp.data);
                  if (resp.data.status === "FAIL") {
                    if (resp.data.err === "Code Has Already Existed") {
                      error(resp.data.err);
                      return;
                    }
                  } else {
                    success(resp.data.msg);
                    navigate("../");
                  }
                });
            }}
          >
            Create a new admin
          </button>
        </div>
      </div>
    </AnimatedOutlet>
  );
}
export default AddDiscount;
