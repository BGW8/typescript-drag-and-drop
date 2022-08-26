//! Implement logic in OOP-fashion as to practice using classes

/// <reference path="./components/base-component.ts" />
/// <reference path="./components/project-input.ts" />
/// <reference path="./models/drag-drop.ts" />
/// <reference path="./models/project.ts" />
/// <reference path="./state/project-state.ts" />
/// <reference path="./util/validation.ts" />
/// <reference path="./decorators/autobind.ts" />
/// <reference path="./components/project-list.ts" />

namespace App {
	//! create & render  the project-input field
	new ProjectInput();

	//! create and render the project lists
	new ProjectList("active");
	new ProjectList("finished");
}
