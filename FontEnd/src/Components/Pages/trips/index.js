import styles from "./style.module.scss";
import AnimatedOutlet from "../../AnimatedOutlet";
import React, { Component } from "react";
import Q1_VT from "../../../Img/Q1 - VT.png";
import Q1_BL from "../../../Img/Q1 - BL.png";
import BT_VT from "../../../Img/BT - VT.png";
import BT_BL from "../../../Img/BT - BL.png";

function Trips() {
  return (
    <AnimatedOutlet>
      <div className={styles.base}>
        <div className={styles.heading}>
          <h1>
            ---------------------------------------- Why We Chose These Routes
            ----------------------------------------
          </h1>
        </div>
        <div className={styles.routes}>
          <div>
            <div>
              <img src={Q1_VT}></img>
              <label>
                The road from District 1 in Ho Chi Minh City to Vung Tau in
                Vietnam is a popular route that takes you from the bustling city
                to the beautiful coastal town of Vung Tau. The road distance is
                around 95 kilometers 59 miles, and it usually takes around 2-3
                hours to drive depending on traffic. The route takes you out of
                Ho Chi Minh City and through the surrounding suburbs before
                joining the AH1 highway, which is the main highway that runs the
                length of Vietnam. As you leave the city, you'll start to see
                the landscape change from urban to more rural, with rice paddies
                and small villages dotted along the way.
              </label>
            </div>
            <div>
              <img src={Q1_BL}></img>
              <label>
                Bao Loc is a charming city located in Lam Dong Province,
                Vietnam, and there are several reasons why you should consider
                visiting it such as the fact that Bao Loc is surrounded by
                picturesque mountains, waterfalls, and lakes that make it a
                great destination for nature lovers. Some of the most popular
                natural attractions include the Dambri Waterfall, Suoi Mo Park,
                and the Tea Plantation. Bao Loc is also one of the largest
                tea-producing areas in Vietnam, with numerous tea plantations
                scattered around the region. You can learn about the tea-making
                process, enjoy a cup of locally grown tea, and purchase tea as
                souvenirs.
              </label>
            </div>
          </div>
          <div>
            <div>
              <img src={BT_VT}></img>
              <label>
                District 1 is the central district of Ho Chi Minh City, Vietnam,
                and is considered the heart of the city. District 1 is home to
                several iconic landmarks and cultural sites that showcase the
                city's history and heritage. The Independence Palace, War
                Remnants Museum, Notre-Dame Cathedral, and Central Post Office
                are some of the popular attractions in the district. District 1
                is also known as a shopper's paradise with many shopping centers
                and markets, including Ben Thanh Market, where you can find
                everything from clothing to souvenirs. The district is also
                known for its diverse culinary scene, offering a range of local
                and international cuisine in its numerous restaurants, cafes,
                and street food stalls.
              </label>
            </div>
            <div>
              <img src={BT_BL}></img>
              <label>
                Binh Tan district is one of the largest and most populous
                districts in Ho Chi Minh City, Vietnam. It has a diverse mix of
                residential and commercial areas, and there are several notable
                attractions that may be of interest to visitors. For example,
                tourists may be interested in visiting the Dai Nam Van Hien
                Wonderland, a large theme park and resort with various
                attractions such as water slides, roller coasters, and a zoo.
                Additionally, the Phu Lam Central Market is a popular spot for
                shopping and trying local cuisine. Binh Tan district is also
                home to many cultural and historical landmarks, such as the Hoa
                Binh Temple and the Thien Hau Pagoda, which are both revered by
                locals and tourists alike.
              </label>
            </div>
          </div>
        </div>
      </div>
    </AnimatedOutlet>
  );
}
export default Trips;
