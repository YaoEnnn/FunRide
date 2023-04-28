import classNames from "classnames/bind";
import style from "./style.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import "./transition.scss";

const cx = classNames.bind(style);

function DropDown({ value, onChange = async () => {} }) {
  const [selected, setselected] = useState("");
  const [isopen, setopen] = useState(false);
  const [left, setleft] = useState(0);
  const ref = useRef(null);
  const divref = useRef(null);
  const sectionref = useRef(null);
  const [spinning, setspinning] = useState(false);
  // The user just selected a new tab, so the spinning wheel is
  // appearing, set this to false again for that to disappear

  const detect_click = (e) => {
    if (!ref.current.contains(e.target)) setopen(false);
  };

  useEffect(() => {
    // Detect if the user is still clicking somewhere in this component
    // If the user has clicked out, close the <section> part
    document.addEventListener("click", detect_click);
    const temp = value ? value.find((e) => e.s) : {};

    setselected(temp && temp.v !== null ? temp.v : null);

    // Caculating the right position for the <section> part

    if (divref.current && sectionref.current)
      setleft(divref.current.clientWidth - sectionref.current.clientWidth);

    return () => {
      // When unmount, remove the event listener as well
      document.removeEventListener("click", detect_click);
    };
  }, [value]);

  if (value)
    return (
      <div className={cx("dropdown")} ref={ref}>
        <div
          ref={divref}
          className={isopen ? cx("opened") : ""}
          onClick={() => setopen(!isopen)}
        >
          <label>{selected}</label>
          <FontAwesomeIcon icon={faChevronLeft} />
        </div>
        <CSSTransition
          unmountOnExit
          nodeRef={sectionref}
          in={isopen}
          timeout={200}
          classNames="dropdown"
        >
          <section ref={sectionref} style={{ left: left }}>
            {value.map((e, i) => {
              const select_on = selected === e.v;

              return (
                <label
                  onClick={async (event) => {
                    setspinning(true); // Set the wheel to spin
                    setselected(e.v); // Set the currently selected tab
                    await onChange({
                      index: i,
                      value: e.v,
                      code: e.ret,
                      event: event,
                    }); // Notify the parent component something has changed
                    setspinning(false); // Set the spinning wheel to false again
                  }}
                  key={i}
                  className={select_on ? cx("selected") : ""}
                >
                  {e.v}

                  {select_on && (
                    <>
                      {spinning && <div className={cx("loader")}></div>}
                      {!spinning && (
                        <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
                      )}
                    </>
                  )}
                </label>
              );
            })}
          </section>
        </CSSTransition>
      </div>
    );
}

export default DropDown;
