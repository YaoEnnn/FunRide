import styles from "./style.module.scss";

function Footer() {
  return (
    <div className={styles.base}>
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h5>About Us</h5>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div className="col-md-4">
              <h5>Locations</h5>
              <ul className="list-unstyled">
                <li>New York</li>
                <li>Los Angeles</li>
                <li>Miami</li>
                <li>San Francisco</li>
              </ul>
            </div>
            <div className="col-md-4">
              <h5>Contact Us</h5>
              <p>
                Phone: 555-1234
                <br />
                Email: info@carrentingcompany.com
                <br />
                Address: 123 Main St, Anytown USA
              </p>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-6">
              <p>&copy; 2023 Car Renting Company. All Rights Reserved.</p>
            </div>
            <div className="col-md-6">
              <ul className="list-inline text-md-right">
                <li className="list-inline-item">
                  <a href="#">Privacy Policy</a>
                </li>
                <li className="list-inline-item">
                  <a href="#">Terms of Use</a>
                </li>
                <li className="list-inline-item">
                  <a href="#">Contact Us</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
