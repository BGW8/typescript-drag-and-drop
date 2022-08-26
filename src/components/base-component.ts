// Component Base Class
//TODO: Create a base Class to consolidate the properties and other class members
//TODO: which is duplicated between other classes.
//? Could we create a Generic Class ?
//? Make it abstract as to make sure it never is instantiated , but always only
//? used for inheritance , sort of like a blueprint class for other classes.
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
