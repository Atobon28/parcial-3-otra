import { ReminderType } from "../types/DataModels";
import {
  getUserReminders,
  createReminder,
  modifyReminder,
  removeReminder,
} from "../services/firebase/firebase";
import { signOutUser } from "../services/firebase/authentication-service";

class RemindersPage extends HTMLElement {
  private reminders: ReminderType[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupEventHandlers();
    this.loadReminders();
  }

  setupEventHandlers() {
    const addReminderBtn = this.shadowRoot?.querySelector("#add-reminder-btn");
    addReminderBtn?.addEventListener("click", () => {
      this.openReminderModal();
    });

    const signoutBtn = this.shadowRoot?.querySelector("#signout-btn");
    signoutBtn?.addEventListener("click", async () => {
      await signOutUser();

      window.history.pushState({}, "", "/");
      const event = new CustomEvent("navigate-to", {
        bubbles: true,
        composed: true,
        detail: { route: "/" },
      });
      this.dispatchEvent(event);
    });
  }

  openReminderModal() {
    const modal = document.createElement("div");
    modal.className = "cute-modal";
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>Nuevo Recordatorio 🌟</h2>
          <button class="close-button">&times;</button>
        </div>
        <reminder-form id="reminder-form"></reminder-form>
      </div>
    `;

    this.shadowRoot?.appendChild(modal);

    const closeButton = modal.querySelector(".close-button");
    closeButton?.addEventListener("click", () => {
      modal.remove();
    });

    const reminderForm = modal.querySelector("#reminder-form");
    reminderForm?.addEventListener("reminder-created", (e: Event) => {
      const customEvent = e as CustomEvent;
      const reminderData = customEvent.detail;
      this.addReminder(reminderData);
      modal.remove();
    });
  }

  async addReminder(reminderData: { title: string; description: string }) {
    const userId = localStorage.getItem("currentUserId");

    if (!userId) {
      console.error("Usuario no autenticado");
      return;
    }

    const newReminder = {
      userId,
      title: reminderData.title,
      description: reminderData.description,
      status: "pending",
    };

    const reminderId = await createReminder(newReminder);

    if (reminderId) {
      this.loadReminders();
    }
  }

  async loadReminders() {
    const remindersContainer = this.shadowRoot?.querySelector(".reminders-grid");
    if (!remindersContainer) return;

    remindersContainer.innerHTML = `
      <div class="loading-indicator">
        <p>Cargando tus recordatorios... 🐣</p>
      </div>
    `;

    const userId = localStorage.getItem("currentUserId");

    if (!userId) {
      console.error("Usuario no autenticado");
      return;
    }

    this.reminders = await getUserReminders(userId);
    remindersContainer.innerHTML = "";

    if (this.reminders.length === 0) {
      remindersContainer.innerHTML = `
        <div class="empty-indicator">
          <h3>¡Aún no tienes recordatorios! 🌈</h3>
          <p>Empieza creando tu primer recordatorio con el botón "Nuevo Recordatorio"</p>
        </div>
      `;
      return;
    }

    this.reminders.forEach((reminder: ReminderType) => {
      const reminderCard = document.createElement("div");
      reminderCard.className = `reminder-card ${reminder.status}`;
      reminderCard.dataset.id = reminder.id;

      let statusText = "Pendiente";
      if (reminder.status === "in-progress") statusText = "En proceso";
      if (reminder.status === "completed") statusText = "Completado";

      reminderCard.innerHTML = `
        <h4>${reminder.title}</h4>
        <p class="reminder-description">${reminder.description}</p>
        <div class="reminder-info">
          <span class="reminder-status">${statusText}</span>
          <div class="reminder-actions">
            <button class="action-btn update-status-btn" title="Cambiar estado">
              <span>✨</span>
            </button>
            <button class="action-btn remove-btn" title="Eliminar recordatorio">
              <span>🗑️</span>
            </button>
          </div>
        </div>
      `;

      const removeBtn = reminderCard.querySelector(".remove-btn");
      removeBtn?.addEventListener("click", () => {
        this.removeReminder(reminder.id);
      });

      const updateStatusBtn = reminderCard.querySelector(".update-status-btn");
      updateStatusBtn?.addEventListener("click", () => {
        this.updateReminderStatus(reminder.id);
      });

      remindersContainer.appendChild(reminderCard);
    });
  }

  async removeReminder(reminderId: string) {
    const success = await removeReminder(reminderId);
    if (success) {
      this.loadReminders();
    }
  }

  async updateReminderStatus(reminderId: string) {
    const reminder = this.reminders.find((r) => r.id === reminderId);
    if (!reminder) return;

    let newStatus = "pending";
    if (reminder.status === "pending") {
      newStatus = "in-progress";
    } else if (reminder.status === "in-progress") {
      newStatus = "completed";
    } else {
      newStatus = "pending";
    }

    const success = await modifyReminder(reminderId, { status: newStatus });
    if (success) {
      this.loadReminders();
    }
  }

  render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
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
          --soft-shadow: 0 10px 30px rgba(255, 235, 156, 0.3);
          --pending-color: #FFD93D;
          --progress-color: #FFB3BA;
          --completed-color: #D4F4DD;
        }
        
        .reminders-container {
          max-width: 1300px;
          margin: 0 auto;
          padding: 25px;
        }
        
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 35px;
          background: var(--cream-white);
          padding: 25px;
          border-radius: var(--border-radius);
          box-shadow: var(--soft-shadow);
          border: 3px solid var(--soft-yellow);
        }
        
        h1 {
          color: var(--text-brown);
          margin: 0;
          font-size: 2.2rem;
          font-weight: 700;
        }
        
        .user-section {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .user-email {
          color: var(--soft-gray);
          font-size: 15px;
          font-weight: 600;
        }
        
        .cute-button {
          font-family: 'Comic Neue', cursive;
          padding: 14px 28px;
          background: linear-gradient(45deg, var(--cozy-orange), var(--warm-peach));
          color: var(--text-brown);
          border: none;
          border-radius: 25px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(255, 235, 156, 0.3);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .cute-button:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(255, 217, 61, 0.4);
        }
        
        #signout-btn {
          background: var(--lavender-mist);
          color: var(--text-brown);
        }
        
        #signout-btn:hover {
          background: var(--light-coral);
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(230, 230, 250, 0.4);
        }
        
        .reminders-controls {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 25px;
        }
        
        .reminders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 25px;
          margin-top: 25px;
        }
        
        .reminder-card {
          background: var(--cream-white);
          border-radius: var(--border-radius);
          padding: 20px;
          box-shadow: var(--soft-shadow);
          position: relative;
          border-left: 5px solid var(--pending-color);
          transition: all 0.3s ease;
        }
        
        .reminder-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(255, 235, 156, 0.4);
        }
        
        .reminder-card.completed {
          border-left-color: var(--completed-color);
        }
        
        .reminder-card.completed h4 {
          text-decoration: line-through;
          opacity: 0.7;
        }
        
        .reminder-card.in-progress {
          border-left-color: var(--progress-color);
        }
        
        .reminder-card h4 {
          margin: 0 0 10px 0;
          font-size: 18px;
          font-weight: 700;
          color: var(--text-brown);
        }
        
        .reminder-description {
          margin: 0 0 15px 0;
          font-size: 15px;
          color: var(--soft-gray);
          line-height: 1.5;
        }
        
        .reminder-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
        }
        
        .reminder-status {
          padding: 5px 12px;
          border-radius: 15px;
          background: var(--soft-yellow);
          font-weight: 600;
          color: var(--text-brown);
        }
        
        .reminder-actions {
          display: flex;
          gap: 8px;
        }
        
        .action-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px;
          font-size: 18px;
          transition: transform 0.2s;
          border-radius: 50%;
        }
        
        .action-btn:hover {
          transform: scale(1.3);
          background: var(--soft-yellow);
        }
        
        .cute-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(93, 78, 55, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .modal-content {
          background: var(--cream-white);
          border-radius: var(--border-radius);
          width: 90%;
          max-width: 550px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(255, 235, 156, 0.5);
          border: 3px solid var(--soft-yellow);
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 25px;
          border-bottom: 2px solid var(--lavender-mist);
        }
        
        .modal-header h2 {
          margin: 0;
          font-size: 1.8rem;
          color: var(--text-brown);
          font-weight: 700;
        }
        
        .close-button {
          background: none;
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: var(--soft-gray);
          padding: 0;
          transition: all 0.3s ease;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .close-button:hover {
          color: var(--light-coral);
          transform: scale(1.2);
          background: var(--soft-yellow);
        }
        
        .empty-indicator {
          text-align: center;
          padding: 50px 25px;
          color: var(--soft-gray);
          grid-column: 1 / -1;
        }
        
        .empty-indicator h3 {
          margin: 0 0 15px 0;
          font-size: 1.8rem;
          color: var(--text-brown);
          font-weight: 700;
        }
        
        .loading-indicator {
          text-align: center;
          padding: 50px 25px;
          color: var(--soft-gray);
          grid-column: 1 / -1;
          font-size: 1.2rem;
          font-weight: 600;
        }
        
        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }
          
          .reminders-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
      
      <div class="reminders-container">
        <div class="page-header">
          <h1>Recordatorios de Ana 🌟</h1>
          <div class="user-section">
            <span class="user-email" id="current-user-email">ana@ejemplo.com</span>
            <button id="signout-btn" class="cute-button">Cerrar Sesión</button>
          </div>
        </div>
        
        <div class="reminders-controls">
          <button id="add-reminder-btn" class="cute-button">
            <span>Nuevo Recordatorio 🐣</span>
          </button>
        </div>
        
        <div class="reminders-grid">
          <div class="empty-indicator">
            <h3>¡Aún no tienes recordatorios! 🌈</h3>
            <p>Empieza creando tu primer recordatorio con el botón "Nuevo Recordatorio"</p>
          </div>
        </div>
      </div>
    `;

    const userEmailElement = this.shadowRoot.querySelector("#current-user-email");
    const userEmail = localStorage.getItem("currentUserEmail");
    if (userEmailElement && userEmail) {
      userEmailElement.textContent = userEmail;
    }
  }
}

export default RemindersPage;