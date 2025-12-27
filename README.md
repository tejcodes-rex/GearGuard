# GearGuard - Maintenance Management System

GearGuard is a modern, responsive, and feature-rich Maintenance Management System designed to streamline equipment tracking, maintenance requests, and team coordination. Inspired by enterprise ERP systems like Odoo, it delivers a robust "Smart Maintenance" experience.

## 🚀 Features

- **Application Logic**:
    - **Authentication**: Secure login/signup flow with mock persistence.
    - **Dashboard**: Real-time metrics, "Red/Blue" status cards, and activity feed. (Responsive!)
    - **Kanban Board**: Drag-and-drop request management with stage tracking.
    - **Calendar**: Visual preventive maintenance scheduling.
    - **Worksheet System**: "Smart Buttons" for detailed comments and worksheets on every request.

- **Entity Management**:
    - **Equipment**: Track machines, serial numbers, and categories.
    - **Work Centers**: Manage production lines and assembly stations with OEE/Capacity metrics.
    - **Teams**: Organize technicians into specialized maintenance teams.

- **Technical Highlights**:
    - **Responsive Design**: Fully optimized for mobile, tablet, and desktop.
    - **Modern UI**: Built with Tailwind CSS, Lucide Icons, and Clean React components.
    - **Type Safety**: Full TypeScript implementation.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Drag & Drop**: `@hello-pangea/dnd`
- **Date Handling**: `date-fns`

## 🏃‍♂️ Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/tejcodes-rex/GearGuard.git
    cd GearGuard
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Open the app**:
    Visit [http://localhost:3000](http://localhost:3000)

## 🔐 Credentials (Mock Data)

Since this is a demo application with client-side state:
- **Email**: `admin@gearguard.com` (or create a new one)
- **Password**: `Password@123`

---

*Built for the Odoo Hackathon 2025.*
