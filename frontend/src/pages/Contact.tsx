export default function Contact() {
  return (
    <>
      <div className="page contact" style={{ display: "flex", gap: "50px" }}>
        <div className="contact-left" style={{ textAlign: "left" }}>
          <h1>Contacts</h1>
          <div style={{ marginTop: "15%" }}>
            <p>
              <strong>Electro</strong>
            </p>

            <p>
              <strong>Email:</strong> electro@electro.com
            </p>

            <p>
              <strong>Phone:</strong> +90 (111) 111 11-11
            </p>

            <p>
              <strong>Address:</strong> Kılavuzlar, 413. Sokak No: 10, 78050
              Merkez/Karabük
            </p>
          </div>
        </div>
        <div className="contact-right">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3001.259000685972!2d32.649011975869556!3d41.216125971322164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x408354ac4492953f%3A0xab3b48ed0392a743!2z0KPQvdC40LLQtdGA0YHQuNGC0LXRgiDQmtCw0YDQsNCx0Y7Qug!5e0!3m2!1sru!2str!4v1787559167416!5m2!1sru!2str"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          ></iframe>
        </div>
      </div>
    </>
  );
}
