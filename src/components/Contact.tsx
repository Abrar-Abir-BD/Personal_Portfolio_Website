import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";
import { contact } from "../data/portfolioContent";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h2 className="contact-heading">
          Get in <span>Touch</span>
        </h2>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href={`mailto:${contact.email}`} data-cursor="disable">
                {contact.email}
              </a>
            </p>
            <h4>Phone</h4>
            <p>
              <a
                href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
                data-cursor="disable"
              >
                {contact.phone}
              </a>
            </p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href={contact.github}
              target="_blank"
              data-cursor="disable"
              className="contact-social"
            >
              GitHub <MdArrowOutward />
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              data-cursor="disable"
              className="contact-social"
            >
              LinkedIn <MdArrowOutward />
            </a>
            <a
              href={`mailto:${contact.email}`}
              data-cursor="disable"
              className="contact-social"
            >
              Email <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>Abrar Abir</span>
            </h2>
            <h5>
              <MdCopyright /> {contact.copyrightYear}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
