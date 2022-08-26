import { DragTarget } from "../models/drag-drop.js";
import { Project, ProjectStatus } from "../models/project.js";
import { Component } from "./base-component.js";
import { Autobind } from "../decorators/autobind.js";
import { projectState } from "../state/project-state.js";
import { ProjectItem } from "./project-item.js";

// ProjectList class
export class ProjectList
	extends Component<HTMLDivElement, HTMLElement>
	implements DragTarget
{
	//TODO: Move into new Component class
	// templateElement: HTMLTemplateElement;
	// hostElement: HTMLDivElement;
	// element: HTMLElement;
	assignedProjects: Project[];

	//! Could use an enum-type instead of a string literal type, although with
	//! string literals we can use them in out renderProjects-method below
	//! to assign classes
	constructor(private type: "active" | "finished") {
		super("project-list", "app", false, `${type}-projects`);
		this.assignedProjects = [];
		this.configure();
		this.attach(false);
		this.renderContent();
	}

	@Autobind
	dragOverHandler(event: DragEvent) {
		if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
			event.preventDefault();
			const listEl = this.element.querySelector("ul")!;
			listEl.classList.add("droppable");
		}
	}

	@Autobind
	dropHandler(event: DragEvent) {
		const projId = event.dataTransfer!.getData("text/plain");
		projectState.moveProject(
			projId,
			this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
		);
	}

	@Autobind
	dragLeaveHandler(_: DragEvent): void {
		const listEl = this.element.querySelector("ul")!;
		listEl.classList.remove("droppable");
	}

	configure() {
		this.element.addEventListener("dragover", this.dragOverHandler);
		this.element.addEventListener("dragleave", this.dragLeaveHandler);
		this.element.addEventListener("drop", this.dropHandler);
		//! add a filter-function to our listeners in projectState.
		//! the listener-function added takes an array of type Project,
		//! which filters the project-list
		projectState.addListener((projects: Project[]) => {
			const relevantProjects = projects.filter((prj) => {
				if (this.type === "active") {
					return prj.status === ProjectStatus.Active;
				}
				return prj.status === ProjectStatus.Finished;
			});
			this.assignedProjects = relevantProjects;
			this.renderProjects();
		});
	}

	renderProjects() {
		const listEl = document.getElementById(
			`${this.type}-projects-list`
		)! as HTMLUListElement;
		//! clearing all the list-items at every render makes it so
		//! we're not duplicating items when addig new ones
		listEl.innerHTML = "";
		for (const prjItem of this.assignedProjects) {
			new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
		}
	}

	//! fill the blank spaces in the template
	renderContent() {
		const listId = `${this.type}-projects-list`;
		this.element.querySelector("ul")!.id = listId;
		this.element.querySelector("h2")!.textContent =
			this.type.toUpperCase() + " PROJECTS";
	}
}
