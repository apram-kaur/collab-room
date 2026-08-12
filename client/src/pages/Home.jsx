import "./Home.css";

import mascot from "../assets/mascot1.png";

function Home() {

  return (

    <div className="home">

      <div className="home-card">

        <img
          src={mascot}
          alt="Mascot"
          className="home-logo"
        />

        <h1>Collab Room</h1>

        <p className="tagline">
          Code together. Draw together.
          <br />
          Build together.
        </p>

        <button className="primary-btn">
          + Create Room
        </button>

        <div className="divider">
          Already have a room?
        </div>

        <button className="secondary-btn">
          Join Existing Room
        </button>

      </div>

    </div>

  );
}

export default Home;