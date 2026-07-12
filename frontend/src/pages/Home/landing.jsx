import React from "react";
import {
  CheckCircle2,
  ShieldCheck,
  MessageSquareText,
  FileStack,
  BarChart3,
  Users,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Task Workspace",
    icon: <CheckCircle2 className="w-8 h-8 text-primary" />,
    desc: "Handle tasks, subtasks, priorities, deadlines, attachments, and team collaboration with smart progress tracking.",
  },
  {
    title: "Analytics Dashboard",
    icon: <BarChart3 className="w-8 h-8 text-primary" />,
    desc: "Visualize project progress with interactive charts, task insights, overdue tracking, and recent activities.",
  },
  {
    title: "Real-Time Chat",
    icon: <MessageSquareText className="w-8 h-8 text-primary" />,
    desc: "Instant messaging with online presence indicators, image sharing, chat history, and secure communication.",
  },
  {
    title: "Smart PDF Merge",
    icon: <FileStack className="w-8 h-8 text-primary" />,
    desc: "Upload multiple files, auto-convert to PDF, and merge them seamlessly with drag-and-drop functionality.",
  },
  {
    title: "AI Assistant",
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    desc: "Integrated AI chatbot providing intelligent, context-aware support and quick assistance across the platform.",
  },
  {
    title: "Role-Based Security",
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    desc: "JWT authentication, encrypted passwords, secure sessions, and admin/user role-based access control.",
  },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-base-200 text-base-content">

    

      {/* HERO */}
      <section className="hero min-h-[90vh] px-6">
        <div className="hero-content flex-col lg:flex-row-reverse gap-14">

          {/* RIGHT SIDE CARD */}
          <div className="w-full lg:w-1/2">
            <div className="bg-base-100 border shadow-2xl rounded-3xl p-6 space-y-5">

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-xl">Team Productivity</h3>
                  <p className="text-sm text-gray-500">
                    Smart collaboration dashboard
                  </p>
                </div>

                
              </div>

              {/* TASK CARDS */}
              <div className="space-y-4">

                <div className="bg-base-200 p-4 rounded-xl">
                  <div className="flex justify-between">
                    <span className="badge badge-warning">Pending</span>
                    <span className="badge badge-error">High</span>
                  </div>

                  <h4 className="font-semibold mt-3">
                    Design Dashboard UI
                  </h4>

                  <progress
                    className="progress progress-primary mt-3 w-full"
                    value="45"
                    max="100"
                  />
                </div>

                <div className="bg-base-200 p-4 rounded-xl">
                  <div className="flex justify-between">
                    <span className="badge badge-success">Completed</span>
                    <span className="badge badge-info">Medium</span>
                  </div>

                  <h4 className="font-semibold mt-3">
                    API Authentication
                  </h4>

                  <progress
                    className="progress progress-success mt-3 w-full"
                    value="100"
                    max="100"
                  />
                </div>

                <div className="bg-primary text-primary-content rounded-xl p-5">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-8 h-8" />

                    <div>
                      <h4 className="font-bold">AI Assistant Active</h4>
                      <p className="text-sm opacity-90">
                        Helping users instantly with smart responses.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* LEFT SIDE */}
          <div className="w-full lg:w-1/2 space-y-8">

            <div className="badge badge-primary badge-lg">
              Smart Team Collaboration Platform
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Organize Tasks,
              <span className="text-primary"> Collaborate Faster</span>,
              and Boost Productivity
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed">
              An all-in-one intelligent workspace combining tasks,
              real-time communication, analytics, PDF merging, reporting,
              and AI-powered assistance for modern teams.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Start Free
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link to="/login" className="btn btn-outline btn-lg">
                Explore Dashboard
              </Link>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">

              <div className="bg-base-100 p-4 rounded-2xl shadow-sm text-center">
                <h3 className="text-3xl font-bold text-primary">10K+</h3>
                <p className="text-sm text-gray-500">Handle Tasks</p>
              </div>

              <div className="bg-base-100 p-4 rounded-2xl shadow-sm text-center">
                <h3 className="text-3xl font-bold text-primary">99%</h3>
                <p className="text-sm text-gray-500">Efficiency</p>
              </div>

              <div className="bg-base-100 p-4 rounded-2xl shadow-sm text-center">
                <h3 className="text-3xl font-bold text-primary">24/7</h3>
                <p className="text-sm text-gray-500">AI Support</p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 bg-base-100">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">
              Powerful Features Built for Teams
            </h2>

            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
              Everything your organization needs to manage projects,
              collaborate in real time, generate reports,
              and streamline workflows efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-base-200 hover:bg-base-300 transition rounded-3xl p-8 border"
              >
                <div className="mb-5">{feature.icon}</div>

                <h3 className="text-2xl font-bold mb-3">
                  {feature.title}
                </h3>

                <p className="text-gray-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">
              Streamlined Workflow Experience
            </h2>

            <p className="text-gray-500 mt-4">
              Built with scalability, collaboration, and productivity in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="bg-base-100 rounded-3xl p-8 shadow-sm border">
              <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-bold">
                1
              </div>

              <h3 className="text-2xl font-bold mt-5">
                Create & Assign Tasks
              </h3>

              <p className="text-gray-500 mt-3">
                Easily create tasks with priorities, deadlines, subtasks,
                attachments, and assign them to team members.
              </p>
            </div>

            <div className="bg-base-100 rounded-3xl p-8 shadow-sm border">
              <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-bold">
                2
              </div>

              <h3 className="text-2xl font-bold mt-5">
                Collaborate in Real Time
              </h3>

              <p className="text-gray-500 mt-3">
                Communicate instantly using live chat, image sharing,
                active user indicators, and smart notifications.
              </p>
            </div>

            <div className="bg-base-100 rounded-3xl p-8 shadow-sm border">
              <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-bold">
                3
              </div>

              <h3 className="text-2xl font-bold mt-5">
                Analyze & Export Reports
              </h3>

              <p className="text-gray-500 mt-3">
                Generate analytics dashboards, monitor productivity,
                and export Excel reports for performance evaluation.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-primary text-primary-content">
        <div className="max-w-4xl mx-auto text-center space-y-8">

          <Users className="w-20 h-20 mx-auto opacity-90" />

          <h2 className="text-5xl font-extrabold">
            Ready to Transform Team Productivity?
          </h2>

          <p className="text-lg opacity-90">
            Start managing projects smarter with AI assistance,
            real-time collaboration, analytics, and secure workflows.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/signup" className="btn btn-lg bg-white text-primary hover:bg-base-200 border-none">
              Create Account
            </Link>

            <Link to="/login" className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary">
              Login
            </Link>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer footer-center px-10 py-14 bg-base-300 border-t border-base-content/10 text-base-content">
  <aside className="space-y-3">

    {/* LOGO / BRAND */}
    <h2 className="text-4xl font-black tracking-tight">
      <span className="text-primary">In</span>
      <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        tegro
      </span>
    </h2>

    {/* TAGLINE */}
    <p className="text-base text-base-content/60 max-w-md">
      Intelligent collaboration, productivity, communication,
      and AI-powered teamwork — all in one workspace.
    </p>

    {/* COPYRIGHT */}
    <p className="text-sm text-base-content/40 pt-2">
      © 2026 Integro. All rights reserved.
    </p>

  </aside>
</footer>
    </div>
  );
};

export default HomePage;