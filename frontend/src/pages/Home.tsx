import "../styles/Home.css";

export default function Home() {
  return (
    <>
      <div className="page">
        <main>
          <div
            className="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-body-tertiary"
            id="hero"
          >
            <div className="col-md-6 p-lg-5 mx-auto my-5">
              <h1 className="display-3 fw-bold">Electo</h1>
              <h3 className="fw-normal text-muted mb-3">
                Find any household appliences youu want
              </h3>
              <div className="d-flex gap-3 justify-content-center lead fw-normal">
                <a className="icon-link" href="#">
                  Buy
                  <svg className="bi" aria-hidden="true">
                    <use href="#chevron-right"></use>
                  </svg>
                </a>
              </div>
            </div>
            <div
              className="product-device  d-none d-md-block"
              style={{ background: "none" }}
            >
              <img src="./src/assets/mixer.png" height="300" />
            </div>
            <div
              className="product-device product-device-2 d-none d-md-flex justify-content-center align-items-center"
              style={{
                background: "none",
                transform: "rotate(-30deg)",
              }}
            >
              <img src="./src/assets/airfrier.webp" height="300" />
            </div>
          </div>
          <div className="d-md-flex flex-md-equal w-100 my-md-3 ps-md-3">
            <div className=" me-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden">
              <div
                className="bg-body-tertiary shadow-sm mx-auto"
                style={{
                  width: "100%",
                  height: " 300px",
                  borderRadius: " 21px 21px 0 0",
                }}
              >
                <img src="./src/assets/house-applience.jpg" height="300" />
              </div>
            </div>
            <div className="bg-body-tertiary me-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden">
              <div className="my-3 p-3">
                <h2 className="display-5">Upgrade Your Home</h2>
                <p className="lead">
                  Find quality refrigerators, washing machines, ovens, and more
                  all in one place.
                </p>
              </div>
            </div>
          </div>
          <div className="d-md-flex flex-md-equal w-100 my-md-3 ps-md-3">
            <div className="bg-body-tertiary me-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden">
              <div className="my-3 p-3">
                <h2 className="display-5">Make Every Meal Easier</h2>
                <p className="lead">
                  Discover air fryers, coffee makers, blenders, toasters, and
                  more for your kitchen.
                </p>
              </div>
              <div
                className=" shadow-sm mx-auto"
                style={{
                  width: "80%",
                  height: "300px",
                }}
              >
                {" "}
                <img
                  src="./src/assets/small-kitchen-appliances.jpg"
                  height="300"
                  width="100%"
                  style={{ borderRadius: "21px 21px 0 0" }}
                />
              </div>
            </div>
            <div className=" me-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden">
              <div className="my-3 py-3">
                <h2 className="display-5">Refresh Your Bathroom</h2>
                <p className="lead">
                  {" "}
                  Find everything you need for a comfortable, practical, and
                  stylish bathroom.
                </p>
              </div>
              <div
                className="bg-body-tertiary shadow-sm mx-auto"
                style={{
                  width: "80%",
                  height: "300px",
                  borderRadius: "21px 21px 0 0",
                }}
              >
                <img
                  src="./src/assets/bathroom-appliences.jpg"
                  height="300"
                  width="100%"
                  style={{ borderRadius: "21px 21px 0 0" }}
                />
              </div>
            </div>
          </div>
          <div className="d-md-flex flex-md-equal w-100 my-md-3 ps-md-3">
            <div className="bg-body-tertiary me-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden">
              <div className="my-3 p-3">
                <h2 className="display-5">Power Up Your Workspace</h2>
                <p className="lead">
                  Find everything you need for a productive office, from
                  essential equipment to everyday essentials.
                </p>
              </div>
              <div
                className="bg-body shadow-sm mx-auto"
                style={{
                  width: "80%",
                  height: "300px",
                  borderRadius: "21px 21px 0 0",
                }}
              >
                {" "}
                <img
                  src="./src/assets/office-applience.jpg"
                  height={300}
                  style={{ borderRadius: "21px 21px 0 0" }}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
