import { ProjectInput } from "./components/project-input";
import { ProjectList } from "./components/project-list";
//! create & render  the project-input field
new ProjectInput();

//! create and render the project lists
new ProjectList("active");
new ProjectList("finished");

console.log("HI");
