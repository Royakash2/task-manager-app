export interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

export const faqData: FaqItem[] = [
  {
    question: "IS VELLOX REALLY FREE?",
    answer: (
      <div className="flex flex-col gap-4 text-muted-foreground font-light text-base leading-relaxed">
        <p>
          Yes! VelloX is currently completely free to use with no limits. All features — including unlimited projects, Kanban boards, table views, dashboards, team collaboration, file attachments, and the documentation editor — are available at no cost.
        </p>
        <p>
          We may introduce paid plans in the future ,but you will always be notified in advance.
        </p>
      </div>
    ),
  },
  {
    question: "HOW DO I GET STARTED?",
    answer: (
      <div className="flex flex-col gap-4 text-muted-foreground font-light text-base leading-relaxed">
        <p>
          Getting started is simple. Sign up with your email or Google account, create a workspace, and start creating projects. Each project comes with a Dashboard, Table view, and Kanban board — ready to go.
        </p>
        <p>
          You can invite team members right from the members page and assign them roles (Owner, Admin, or Member) to control access.
        </p>
      </div>
    ),
  },
  {
    question: "WHAT VIEWS ARE AVAILABLE?",
    answer: (
      <div className="flex flex-col gap-4 text-muted-foreground font-light text-base leading-relaxed">
        <p>
          Every project comes with three powerful views:
        </p>
        <ul className="flex flex-col gap-1">
          <li><strong>Dashboard</strong> — Get a bird&apos;s-eye view with task completion stats, distribution charts, recent activity, and comments.</li>
          <li><strong>Table</strong> — Browse, sort, and filter all tasks in a spreadsheet-like view with pagination and customizable columns.</li>
          <li><strong>Kanban</strong> — Drag and drop tasks across columns (Backlog, Todo, In Progress, In Review, Completed) to update their status visually.</li>
        </ul>
      </div>
    ),
  },
  {
    question: "CAN I COLLABORATE WITH MY TEAM?",
    answer: (
      <div className="flex flex-col gap-4 text-muted-foreground font-light text-base leading-relaxed">
        <p>
          Absolutely. VelloX is built for teamwork. Here&apos;s how you can collaborate:
        </p>
        <ul className="flex flex-col gap-1">
          <li><strong>Comments</strong> — Discuss tasks directly with threaded comments.</li>
          <li><strong>Notifications</strong> — Get real-time alerts when things change via our notification system.</li>
          <li><strong>Activity Feed</strong> — Track every update, from task creation to status changes.</li>
          <li><strong>Member Management</strong> — Invite teammates, assign roles, and control project access.</li>
        </ul>
      </div>
    ),
  },
  {
    question: "HOW DOES ACCESS CONTROL WORK?",
    answer: (
      <div className="flex flex-col gap-4 text-muted-foreground font-light text-base leading-relaxed">
        <p>
          VelloX has a three-tier role system:
        </p>
        <ul className="flex flex-col gap-1">
          <li><strong>Owner</strong> — Full control over the workspace, including deleting projects, managing members, and accessing trash.</li>
          <li><strong>Admin</strong> — Can manage members and has full access to all projects and tasks.</li>
          <li><strong>Member</strong> — Can only access projects they are granted permission to and can only manage tasks assigned to or created by them.</li>
        </ul>
      </div>
    ),
  },
  {
    question: "CAN I ADD FILES AND DOCUMENTATION TO TASKS?",
    answer: (
      <div className="flex flex-col gap-4 text-muted-foreground font-light text-base leading-relaxed">
        <p>
          Yes. Each task supports:
        </p>
        <ul className="flex flex-col gap-1">
          <li><strong>File Attachments</strong> — Drag and drop images, PDFs, and other files directly onto a task.</li>
          <li><strong>Documentation Editor</strong> — A built-in rich text editor for writing detailed notes, guides, or requirements for each task.</li>
        </ul>
      </div>
    ),
  },
];
