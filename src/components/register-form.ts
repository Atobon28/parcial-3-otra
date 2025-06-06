import { auth } from "../services/firebase/firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";

class RegisterForm extends HTMLElement {
  shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
  }

  connectedCallback() {
    const form = this.shadow.querySelector("form");
    form?.addEventListener("submit", this.handleSubmit.bind(this));
  }

  async handleSubmit(e: Event) {
    e.preventDefault();
    const email = (this.shadow.querySelector("#email") as HTMLInputElement).value;
    const password = (this.shadow.querySelector("#password") as HTMLInputElement).value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      alert("Usuario registrado: " + userCredential.user.email);
    } catch (error: any) {
      alert("Error al registrar: " + error.message);
    }
  }

  render() {
    this.shadow.innerHTML = `
      <style>
        form {
          display: flex;
          flex-direction: column;
          width: 300px;
        }
        input {
          margin-bottom: 10px;
          padding: 8px;
        }
        button {
          padding: 10px;
        }
      </style>
      <form>
        <h2>Registro</h2>
        <input type="email" id="email" placeholder="Correo" required />
        <input type="password" id="password" placeholder="Contraseña" required />
        <button type="submit">Registrarse</button>
      </form>
    `;
  }
}

customElements.define("register-form", RegisterForm);