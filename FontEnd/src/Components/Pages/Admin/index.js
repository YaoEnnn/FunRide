import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import axios from "axios";

const Admin = () => {
  const [name, setName] = useState("");

  useEffect(() => {
    axios.post("admin/my-profile").then((resp) => {
      console.log(resp);
      setName(resp.data.msg.name);
    });
  });
  return <h1>This is the admin page, hi {name}</h1>;
};
export default Admin;
