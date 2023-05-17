import { useEffect, useReducer, useRef, useState } from "react";
import style from "./style.module.scss";

const reducer = (state, action) => {
  if (action.value.selected) return state;

  const temp = state.find(
    (e) => e.id === action.value.id && e.section === action.value.section
  );

  if (temp) {
    const i = state.indexOf(temp);
    let _ = Array.from(state);
    _.splice(i, 1);
    return _;
  } else {
    return [...state, action.value];
  }
};

function SeatPicker({ section1 = [], section2 = [], onChange = () => {} }) {
  const [selected, dispatch] = useReducer(reducer, []);
  const [list1, setlist1] = useState([]);
  const [list2, setlist2] = useState([]);
  const init = useRef(true);

  useEffect(() => {
    let temp_1 = [];
    let temp_2 = [];

    for (let i = 0; i < section1.length; i += 2) {
      temp_1.push(section1.slice(i, i + 2));
    }

    for (let i = 0; i < section2.length; i += 2) {
      temp_2.push(section2.slice(i, i + 2));
    }

    setlist1(temp_1);
    setlist2(temp_2);
  }, [section1, section2]);

  useEffect(() => {
    if (init.current) {
      init.current = false;
      return;
    }

    onChange(selected);
  }, [selected]);

  return (
    <>
      <div className={style.seatmap}>
        <div>
          <section>
            {list1.map((e, i) => (
              <div key={i}>
                {e.map((k) => (
                  <label
                    className={
                      selected.find((e) => e.id === k.i && e.section === 1) ||
                      k.selected
                        ? style.selected
                        : ""
                    }
                    key={k.i}
                    onClick={() => {
                      dispatch({
                        value: { id: k.i, section: 1, selected: k.selected },
                      });
                    }}
                  >
                    {k.i}
                  </label>
                ))}
              </div>
            ))}
          </section>

          {section2.length > 0 && (
            <section>
              {list2.map((e, i) => (
                <div key={i}>
                  {e.map((k) => (
                    <label
                      className={
                        selected.find((e) => e.id === k.i && e.section === 2) ||
                        k.selected
                          ? style.selected
                          : ""
                      }
                      key={k.i}
                      onClick={() => {
                        dispatch({
                          value: { id: k.i, section: 2, selected: k.selected },
                        });
                      }}
                    >
                      {k.i}
                    </label>
                  ))}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </>
  );
}

export default SeatPicker;
