
# ICRAF: Integrated Cyber Risk & Compliance Dashboard

## 1. Project Overview

This project is a high-fidelity, interactive proof-of-concept (PoC) for an **Integrated Cyber Risk and Compliance Automation Framework (ICRAF)**. It serves as a frontend prototype that simulates a unified dashboard, pulling together critical data streams from Security Information and Event Management (SIEM), IT Service Management (ITSM), and Governance, Risk, and Compliance (GRC) tools.

The dashboard provides a single pane of glass for executives, security managers, and compliance officers to monitor security posture, track key performance indicators (KPIs), manage risks, and oversee project execution in real-time. This prototype uses mock data to demonstrate the full potential of an integrated system before investing in backend development and API integrations.

## 2. Live Demo & Screenshots

This is a frontend application built to showcase the UI/UX and functionality of the ICRAF concept. It runs entirely in the browser with no backend dependencies.

*(A screenshot would be placed here in a full repository, showing the main dashboard view with its KPIs, incident list, and compliance chart.)*

## 3. Features

The prototype is organized into five distinct views, each addressing a key deliverable of the ICRAF project:

*   **📊 Unified Dashboard:**
    *   Displays critical KPIs like Mean Time to Detect (MTTD) and Mean Time to Respond (MTTR).
    *   Features a live-updating list of recent high-severity incidents.
    *   Visualizes NIST Cybersecurity Framework (CSF) control coverage with a radar chart.

*   **🛡️ Governance Blueprint:**
    *   Illustrates the automated data flow from SIEM (Splunk) → ITSM (ServiceNow) → GRC (Archer).
    *   Maps NIST CSF controls to corresponding ITIL processes.
    *   Presents a clear and concise RACI (Responsible, Accountable, Consulted, Informed) chart for key activities.

*   **⚖️ Interactive Risk Register:**
    *   Provides a detailed, sortable table of identified risks.
    *   Each risk is scored and color-coded based on impact and likelihood.
    *   Users can sort by any column (e.g., score, status, category) to quickly identify top priorities.

*   **📈 Project Plan (Gantt Chart):**
    *   Visualizes the project implementation plan with a clean Gantt chart interface.
    *   Tracks task timelines, owners, and status (Completed, In Progress, Not Started).

*   **🎬 Executive Presentation Deck:**
    *   An interactive, in-app slide deck designed for executive briefings.
    *   Clearly communicates the problem, the ICRAF solution, key benefits, and projected ROI.

## 4. Tech Stack

This project is built with modern, efficient, and scalable frontend technologies.

*   **Core Framework:** React
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Charting:** Recharts
*   **Icons:** Lucide React

## 5. File Structure

The codebase is organized logically to separate concerns and improve maintainability.

```
/
├── public/
├── src/
│   ├── components/
│   │   ├── shared/     # Reusable components (Card, KpiCard)
│   │   ├── Dashboard.tsx
│   │   ├── Governance.tsx
│   │   ├── Presentation.tsx
│   │   ├── ProjectPlan.tsx
│   │   ├── RiskRegister.tsx
│   │   └── Sidebar.tsx
│   ├── data/
│   │   └── mockData.ts # Centralized mock data for the application
│   ├── App.tsx         # Main application component and view router
│   ├── constants.ts    # Application-wide constants (e.g., nav items)
│   ├── index.tsx       # React entry point
│   └── types.ts        # TypeScript type definitions
├── index.html
└── ...config files
```

## 6. How to Run Locally

To run this project in a local development environment, you would typically follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/icraf-dashboard.git
    cd icraf-dashboard
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm start
    ```

    The application will be available at `http://localhost:3000`.
