import React from "react";
import "./Home.css"; // Make sure to update the corresponding CSS for new features
import Button from "../../shared/components/FormElements/Button";

const Home = () => {
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

      {/* About Us Section */}
      <section className="about-section slide-in-left text-backdrop">
        <h2>About Us</h2>
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
          <div className="feature-card hover-scale">
            <h3>Mood-Based Suggestions</h3>
            <p>Find places based on your current vibe and preferences.</p>
          </div>
          <div className="feature-card hover-scale">
            <h3>Collaborative Maps</h3>
            <p>Plan trips with friends or join public travel maps.</p>
          </div>
          <div className="feature-card hover-scale">
            <h3>Gamified Exploration</h3>
            <p>Earn badges and climb the leaderboard as you explore.</p>
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
        <Button className="cta-button">Get Started</Button>
      </section>

      {/* Floating CTA Button */}
      <div className="floating-cta">
        <Button className="cta-button floating">Get Started</Button>
      </div>
    </div>
  );
};

export default Home;
