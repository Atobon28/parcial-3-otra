import { verifyAuthStatus } from "../services/firebase/authentication-service";

class WelcomePage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.setupInitialLayout();
    this.verifyUserStatus();
  }

  setupInitialLayout() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;600;700&display=swap');
        
        :host {
          display: block;
          font-family: 'Comic Neue', cursive;
          --chick-yellow: #FFF3CD;
          --soft-yellow: #FFEB9C;
          --warm-peach: #FFEAA7;
          --light-coral: #FFB3BA;
          --lavender-mist: #E6E6FA;
          --cream-white: #FFFEF7;
          --soft-gray: #8B8B8B;
          --gentle-green: #D4F4DD;
          --cozy-orange: #FFD93D;
          --text-brown: #5D4E37;
          --border-radius: 20px;
          --soft-shadow: 0 10px 30px rgba(255, 235, 156, 0.4);
        }
        
        .welcome-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 30px;
          text-align: center;
        }
        
        .greeting-card {
          background: var(--cream-white);
          border-radius: var(--border-radius);
          padding: 50px 40px;
          box-shadow: var(--soft-shadow);
          position: relative;
          overflow: hidden;
          animation: gentleFadeIn 1s ease-out;
          border: 3px solid var(--soft-yellow);
        }
        
        .greeting-card::before {
          content: '🐣';
          position: absolute;
          top: 20px;
          right: 30px;
          font-size: 2.5rem;
          animation: gentleBounce 2s infinite;
        }
        
        h1 {
          color: var(--text-brown);
          font-size: 3rem;
          margin-bottom: 25px;
          font-weight: 700;
          line-height: 1.2;
          background: linear-gradient(45deg, var(--cozy-orange), var(--warm-peach));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .subtitle {
          color: var(--soft-gray);
          font-size: 1.3rem;
          margin-bottom: 40px;
          line-height: 1.6;
          max-width: 650px;
          margin-left: auto;
          margin-right: auto;
          font-weight: 400;
        }
        
        .access-options {
          background: var(--cream-white);
          border-radius: var(--border-radius);
          padding: 40px;
          box-shadow: var(--soft-shadow);
          animation: gentleFadeIn 1s ease-out;
          border: 2px solid var(--lavender-mist);
        }
        
        .access-options h2 {
          color: var(--text-brown);
          font-size: 2.2rem;
          margin-bottom: 20px;
          font-weight: 600;
        }
        
        .access-options p {
          margin-bottom: 20px;
          color: var(--soft-gray);
          font-size: 1.1rem;
        }
        
        .helper-note {
          font-style: italic;
          color: var(--soft-gray);
          font-size: 0.9rem;
          margin-bottom: 35px;
          opacity: 0.8;
        }
        
        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 25px;
          margin-top: 15px;
        }
        
        .cute-button {
          font-family: 'Comic Neue', cursive;
          padding: 16px 35px;
          border: none;
          border-radius: 25px;
          font-size: 17px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          letter-spacing: 0.5px;
          box-shadow: 0 6px 20px rgba(255, 235, 156, 0.3);
        }
        
        .primary-cute {
          background: linear-gradient(45deg, var(--cozy-orange), var(--warm-peach));
          color: var(--text-brown);
        }
        
        .primary-cute:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(255, 217, 61, 0.4);
        }
        
        .secondary-cute {
          background: linear-gradient(45deg, var(--lavender-mist), var(--light-coral));
          color: var(--text-brown);
        }
        
        .secondary-cute:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(230, 230, 250, 0.4);
        }
        
        @keyframes gentleFadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gentleBounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
        
        @media (max-width: 768px) {
          h1 {
            font-size: 2.4rem;
          }
          
          .subtitle {
            font-size: 1.1rem;
          }
          
          .greeting-card {
            padding: 35px 25px;
          }
          
          .action-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .cute-button {
            width: 100%;
            max-width: 280px;
          }
        }
      </style>
      
      <div class="welcome-container">
        <!-- Content will be loaded dynamically -->
      </div>
    `;
  }

  verifyUserStatus() {
    verifyAuthStatus((user) => {
      if (user) {
        window.history.pushState({}, "", "/reminders");
        const event = new CustomEvent("navigate-to", {
          bubbles: true,
          composed: true,
          detail: { route: "/reminders" },
        });
        this.dispatchEvent(event);
      } else {
        this.showAccessOptions();
      }
    });
  }

  showAccessOptions() {
    const container = this.shadowRoot?.querySelector(".welcome-container");
    if (!container) return;

    container.innerHTML = `
      <div class="access-options">
        <h2>¡Hola! Soy el Asistente Personal de Ana 🌟</h2>
        <p>Te ayudo a organizar tus recordatorios y mantenerte al día con todo.</p>
        <p class="helper-note">Accede a tu cuenta para comenzar a usar todas mis funciones.</p>
        
        <div class="action-buttons">
          <button id="access-btn" class="cute-button primary-cute">Acceder</button>
          <button id="signup-btn" class="cute-button secondary-cute">Crear Cuenta</button>
        </div>
      </div>
    `;

    const accessBtn = this.shadowRoot?.querySelector("#access-btn");
    accessBtn?.addEventListener("click", () => {
      window.history.pushState({}, "", "/access");
      const event = new CustomEvent("navigate-to", {
        bubbles: true,
        composed: true,
        detail: { route: "/access" },
      });
      this.dispatchEvent(event);
    });

    const signupBtn = this.shadowRoot?.querySelector("#signup-btn");
    signupBtn?.addEventListener("click", () => {
      window.history.pushState({}, "", "/signup");
      const event = new CustomEvent("navigate-to", {
        bubbles: true,
        composed: true,
        detail: { route: "/signup" },
      });
      this.dispatchEvent(event);
    });
  }
}

export default WelcomePage;