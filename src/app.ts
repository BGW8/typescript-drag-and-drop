import { ProjectInput } from "./components/project-input.js";
import { ProjectList } from "./components/project-list.js";
//! create & render  the project-input field
new ProjectInput();

//! create and render the project lists
new ProjectList("active");
new ProjectList("finished");
