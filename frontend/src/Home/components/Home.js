import React, { useContext } from "react";
import { useHistory } from "react-router-dom"; // For navigation
import "./Home.css";
import Button from "../../shared/components/FormElements/Button";
import { AuthContext } from "../../shared/context/auth-context"; // Import AuthContext

const Home = () => {
  const auth = useContext(AuthContext); // Access auth context
  const history = useHistory(); // Initialize useHistory

  // Handle navigation for the Collaborative Maps card
  const handleCollaborativeMapsClick = () => {
    if (auth.isLoggedIn) {
      history.push(`/${auth.userId}/places`); // Navigate to MY PLACES if logged in
    } else {
      history.push("/auth"); // Navigate to Login if not logged in
    }
  };

  // Handle navigation for the Gamified Exploration card
  const handleGamifiedExploration = () => {
    if (auth.isLoggedIn) {
      history.push(`/places/new`); // Navigate to MY PLACES if logged in
    } else {
      history.push("/auth"); // Navigate to Login if not logged in
    }
  };

  // Handle navigation for the Place Suggestions card
  const handlePlaceSuggestionsClick = () => {
    if (auth.isLoggedIn) {
      history.push("/users"); // Navigate to /users if logged in
    } else {
      history.push("/auth"); // Navigate to Login if not logged in
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section fade-in-up">
        <div className="hero-title text-backdrop">
          Explore the World, One Recommendation at a Time!
        </div>
        <p className="hero-subtitle text-backdrop">
          Discover hidden gems, share your favorite spots, and plan your next
          adventure.
        </p>
      </section>

      {/* About MapMemo Section */}
      <section className="about-section slide-in-left text-backdrop">
        <h2>About Map Memo</h2>
        <p>
          Map Memo is your ultimate travel companion, where recommendations meet
          exploration. Whether you're planning your next trip or reminiscing
          about past adventures, Map Memo brings people and places together in
          one interactive platform.
        </p>
      </section>

      {/* Features Section */}
      <section className="features-section fade-in">
        <div className="features-grid">
          <div
            className="feature-card hover-scale"
            onClick={handlePlaceSuggestionsClick}
          >
            <h3>Place Suggestions</h3>
            <p>
              Explore user-recommended places tailored to your interests and
              preferences.
            </p>
          </div>
          <div
            className="feature-card hover-scale"
            onClick={handleCollaborativeMapsClick}
          >
            <h3>Collaborative Maps</h3>
            <p>
              Share your travel experiences and create interactive maps with
              friends.
            </p>
          </div>
          <div
            className="feature-card hover-scale"
            onClick={handleGamifiedExploration}
          >
            <h3>Gamified Exploration</h3>
            <p>
              Earn badges and climb the leaderboard as you share more places and
              receive more upvotes.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section fade-in-up">
        <h2>Ready to Explore?</h2>
        <p>
          Join Map Memo today and become part of a community that loves
          exploring and sharing the best the world has to offer.
        </p>
      </section>

      {/* Floating CTA Button */}
      <div className="floating-cta">
        <Button
          className="cta-button floating"
          onClick={() => history.push("/auth")}
        >
          Join now
        </Button>
      </div>
    </div>
  );
};

export default Home;
