import Link from "next/link";
import Icon from "@/app/components/ui/Icon";
import type { Project } from "@/app/lib/content";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="project-card">
      <div className="project-card-inner">
        {/* Header section */}
        <div className="project-header">
          <div>
            <p className="project-number">{project.year}</p>
            <h2 className="project-title">{project.title}</h2>
            <p className="project-role">{project.role}</p>
          </div>
          {project.href && (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link-badge"
              aria-label={`View ${project.title} on App Store`}
            >
              <Icon name="arrow-up-right" size={16} />
            </a>
          )}
        </div>

        {/* Description */}
        <p className="project-summary">{project.detail}</p>

        {/* Tech stack */}
        <div className="project-stack">
          {project.stack.map((tech) => (
            <span key={tech} className="stack-tag">
              {tech}
            </span>
          ))}
        </div>

        {/* Metadata footer */}
        <div className="project-meta">
          <div className="meta-item">
            <span className="meta-label">Platform</span>
            <span className="meta-value">{project.category}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Duration</span>
            <span className="meta-value">{project.duration}</span>
          </div>
          {project.href && (
            <Link
              href={project.href}
              target="_blank"
              className="btn btn-plain btn-sm"
            >
              View App Store
              <Icon name="arrow-up-right" size={14} />
            </Link>
          )}
        </div>
      </div>

      {/* Decorative border gradient */}
      <div className="project-card-border" />
    </div>
  );
}
