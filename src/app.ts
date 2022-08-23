//! Implement logic in OOP-fashion as to practice using classes

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
class ProjectInput {
	templateElement: HTMLTemplateElement;
	hostElement: HTMLDivElement;
	element: HTMLFormElement;
	titleInputElement: HTMLInputElement;
	descriptionInputElement: HTMLInputElement;
	peopleInputElement: HTMLInputElement;
	//! Seperate selection/Access-logic from calculation-logic
	//! Place selection-logic and base setup within the constructor
	constructor() {
		this.templateElement = document.getElementById(
			"project-input"
		) as HTMLTemplateElement;

		this.hostElement = document.getElementById("app") as HTMLDivElement;

		//! import a copy the child-element of the template-element together with
		//! all of it's children
		const importedNode = document.importNode(
			this.templateElement.content,
			true
		);

		this.element = importedNode.firstElementChild as HTMLFormElement;
		//! assign id to apply our styling
		this.element.id = "user-input";

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
		this.attach();
	}
	//! Create private methods to contain and handle our caclulation logic

	private gatherUserInput(): [string, string, number] | void {
		const enteredTitle = this.titleInputElement.value;
		const enteredDescription = this.descriptionInputElement.value;
		const enteredPeople = this.peopleInputElement.value;

		if (
			enteredTitle.trim().length === 0 ||
			enteredDescription.trim().length === 0 ||
			enteredPeople.trim().length === 0
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
			console.log([title, desc, people]);
		}
		this.clearInputs();
	}

	private configure() {
		//! All three options below are "valid"/working. Keeping them
		//! for future reference when it comes to 'this' and how it can
		//! change depending on context it's being used in.
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

	//!
	private attach() {
		this.hostElement.insertAdjacentElement("afterbegin", this.element);
	}
}

const prjInput = new ProjectInput();
