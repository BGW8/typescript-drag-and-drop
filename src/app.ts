//! Implement logic in OOP-fashion as to practice using classes

// Project Type
enum ProjectStatus {
	Active,
	Finished,
}

class Project {
	constructor(
		public id: string,
		public title: string,
		public description: string,
		public people: number,
		public status: ProjectStatus
	) {}
}

// Project State Management

type Listener = (items: Project[]) => void;

class ProjectState {
	private listeners: Listener[] = [];
	private projects: Project[] = [];
	private static instance: ProjectState;

	private constructor() {}

	//! Guarantees that we only have one object of the type in the entire application
	static getInstance() {
		if (this.instance) {
			return this.instance;
		}
		this.instance = new ProjectState();
		return this.instance;
	}

	addListener(listenerFn: Listener) {
		this.listeners.push(listenerFn);
	}

	addProject(title: string, description: string, numOfPeople: number) {
		const newProject = new Project(
			Math.random().toString(),
			title,
			description,
			numOfPeople,
			ProjectStatus.Active
		);
		this.projects.push(newProject);
		//!loop through the listeners-array
		for (const listenerFn of this.listeners) {
			//!using slice() to return a copy of the array to ensure immutability
			listenerFn(this.projects.slice());
		}
	}
}

//! Instantiating a constant 'projectState' to a singleton to handle state
const projectState = ProjectState.getInstance();

//Validation
interface Validatable {
	value: string | number;
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	min?: number;
	max?: number;
}

const validate = (validateableInput: Validatable) => {
	let isValid: boolean = true;
	if (validateableInput.required) {
		isValid = isValid && validateableInput.value.toString().trim().length !== 0;
	}
	if (
		validateableInput.minLength != null &&
		typeof validateableInput.value === "string"
	) {
		isValid =
			isValid && validateableInput.value.length > validateableInput.minLength;
	}
	if (
		validateableInput.maxLength != null &&
		typeof validateableInput.value === "string"
	) {
		isValid =
			isValid && validateableInput.value.length < validateableInput.maxLength;
	}
	if (
		validateableInput.min != null &&
		typeof validateableInput.value === "number"
	) {
		isValid = isValid && validateableInput.value > validateableInput.min;
	}
	if (
		validateableInput.max != null &&
		typeof validateableInput.value === "number"
	) {
		isValid = isValid && validateableInput.value < validateableInput.max;
	}
	return isValid;
};

// Component Base Class
//TODO: Create a base Class to consolidate the properties and other class members
//TODO: which is duplicated between other classes.
//? Could we create a Generic Class ?
//? Make it abstract as to make sure it never is instantiated , but always only
//? used for inheritance , sort of like a blueprint class for other classes.
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
	templateElement: HTMLTemplateElement;
	hostElement: T;
	element: U;

	constructor(
		templateId: string,
		hostElementId: string,
		insertAtStart: boolean,
		newElementId?: string
	) {
		this.templateElement = document.getElementById(
			templateId
		) as HTMLTemplateElement;
		this.hostElement = document.getElementById(hostElementId) as T;

		const importedNode = document.importNode(
			this.templateElement.content,
			true
		);

		this.element = importedNode.firstElementChild as U;
		if (newElementId) {
			this.element.id = newElementId;
		}

		this.attach(insertAtStart);
	}

	protected attach(insertAtBeginning: boolean) {
		this.hostElement.insertAdjacentElement(
			insertAtBeginning ? "afterbegin" : "beforeend",
			this.element
		);
	}

	//! Forces any class inheriting from Component to implement below methods
	abstract configure(): void;
	abstract renderContent(): void;
}

// ProjectList class
class ProjectList extends Component<HTMLDivElement, HTMLElement> {
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
		this.renderContent();

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
		this.attach(false);
		this.renderContent();
	}

	renderProjects() {
		const listEl = document.getElementById(
			`${this.type}-projects-list`
		)! as HTMLUListElement;
		//! clearing all the list-items at every render makes it so
		//! we're not duplicating items when addig new ones
		listEl.innerHTML = "";
		for (const prjItem of this.assignedProjects) {
			const listItem = document.createElement("li");
			listItem.textContent = prjItem.title;
			listEl.appendChild(listItem);
		}
	}

	configure() {}

	//! fill the blank spaces in the template
	renderContent() {
		const listId = `${this.type}-projects-list`;
		this.element.querySelector("ul")!.id = listId;
		this.element.querySelector("h2")!.textContent =
			this.type.toUpperCase() + " PROJECTS";
	}
}

//Autobind decorator
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
	const originalMethod = descriptor.value;
	const adjDescriptor: PropertyDescriptor = {
		configurable: true,
		get() {
			const boundFn = originalMethod.bind(this);
			return boundFn;
		},
	};
	return adjDescriptor;
}

// ProjectInput Class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
	titleInputElement: HTMLInputElement;
	descriptionInputElement: HTMLInputElement;
	peopleInputElement: HTMLInputElement;
	//! Seperate selection/Access-logic from calculation-logic
	//! Place selection-logic and base setup within the constructor
	constructor() {
		super("project-input", "app", true, "user-input");

		this.titleInputElement = this.element.querySelector(
			"#title"
		) as HTMLInputElement;
		this.descriptionInputElement = this.element.querySelector(
			"#description"
		) as HTMLInputElement;
		this.peopleInputElement = this.element.querySelector(
			"#people"
		) as HTMLInputElement;

		this.configure();
	}
	//! Create private methods to contain and handle our caclulation logic

	renderContent() {}

	configure() {
		//! Experimenting with 'this' keyword and its' value depending on context
		// this.element.addEventListener("submit", function (event: Event) {
		// 	event.preventDefault();
		// 	console.log(this);
		// 	console.log((this.querySelector("#title") as HTMLInputElement).value);
		// });
		//
		// this.element.addEventListener("submit", (event: Event) => {
		// 	event.preventDefault();
		// 	console.log(this);
		// 	console.log(this.titleInputElement.value);
		// });
		//
		// this.element.addEventListener("submit", this.submitHandler.bind(this));

		//! By using a decorator which we apply to our sumbitHandler, we
		//! don't need to bind 'this' to the method when passing it as event listener.
		this.element.addEventListener("submit", this.submitHandler);
	}

	private gatherUserInput(): [string, string, number] | void {
		const enteredTitle = this.titleInputElement.value;
		const enteredDescription = this.descriptionInputElement.value;
		const enteredPeople = this.peopleInputElement.value;

		const titleValidatable: Validatable = {
			value: enteredTitle,
			required: true,
		};
		const descriptionValidatable: Validatable = {
			value: enteredDescription,
			required: true,
			minLength: 5,
		};
		const peopleValidatable: Validatable = {
			value: +enteredPeople,
			required: true,
			min: 1,
			max: 5,
		};

		if (
			!validate(titleValidatable) ||
			!validate(descriptionValidatable) ||
			!validate(peopleValidatable)
		) {
			alert("Invalid input, please try again");
			return;
		} else {
			return [enteredTitle, enteredDescription, +enteredPeople];
		}
	}

	private clearInputs() {
		this.titleInputElement.value = "";
		this.descriptionInputElement.value = "";
		this.peopleInputElement.value = "";
	}

	@Autobind
	private submitHandler(event: Event) {
		event.preventDefault();
		const userInput = this.gatherUserInput();
		if (Array.isArray(userInput)) {
			const [title, desc, people] = userInput;
			projectState.addProject(title, desc, people);
			this.clearInputs();
		}
		this.clearInputs();
	}

	//!
}

//! create & render  the project-input field
const prjInput = new ProjectInput();

//! create and render the project lists
const activePrjList = new ProjectList("active");
const finishedPrjList = new ProjectList("finished");
