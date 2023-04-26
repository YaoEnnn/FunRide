import styles from "./style.module.scss";
import AnimatedOutlet from "../../AnimatedOutlet";
import React, { Component } from "react";

function Home() {
  return (
    <AnimatedOutlet>
      <div className={styles.base}>
        <div className={styles.header}>
          <img src="https://helios-i.mashable.com/imagery/articles/05SzGlYqpD4cUlIaQ8DHdVF/hero-image.fill.size_1248x702.v1666999270.jpg"></img>
          <p>This is a really good website</p>
        </div>
        <div>
          <h1>--Popular Routes--</h1>
          <div className={styles.popular}>
            <div>
              <div>Route #1</div>
              <div>Route #2</div>
            </div>
            <div>
              <div>Route #3</div>
              <div>Route #4</div>
            </div>
          </div>
          <h1>--Customers' Reviews</h1>
          <div className={styles.reviews}>
            <div className={styles.reviewPost}>
              <div className={styles.slideshow}>
                <div className={styles.slide}>
                  <div>
                    <img src="https://picsum.photos/id/237/200/300"></img>
                    <p>
                      I had a great experience using FunRide to rent a car for
                      my vacation. The website was easy to use, provided
                      detailed car information and customer reviews, and offered
                      transparent pricing with no hidden fees. I had no issues
                      with the car and appreciated the website's 24/7 customer
                      support. Highly recommend!
                    </p>
                  </div>
                  <div>
                    <img src="https://picsum.photos/id/237/200/300"></img>
                    <p>
                      I had a great experience using FunRide to rent a car for
                      my vacation. The website was easy to use, provided
                      detailed car information and customer reviews, and offered
                      transparent pricing with no hidden fees. I had no issues
                      with the car and appreciated the website's 24/7 customer
                      support. Highly recommend!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedOutlet>
  );
}
export default Home;
