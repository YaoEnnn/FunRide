import { toast } from "react-toastify";

export const error = (msg, time = 3000) =>
  toast.error(msg, {
    autoClose: time,
    pauseOnHover: false,
  });

export const success = (msg, time = 3000) =>
  toast.success(msg, {
    autoClose: time,
    pauseOnHover: false,
  });

export const info = (msg, time = 3000) =>
  toast.info(msg, {
    autoClose: time,
    pauseOnHover: false,
  });
