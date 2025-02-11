const data = [
    {
      id: "c0ac49c5-871e-4c72-a878-251de465e6b4",
      type: "input",
      label: "Sample Input",
      placeholder: "Sample placeholder",
    },
    {
      id: "146e69c2-1630-4a27-9d0b-f09e463a66e4",
      type: "select",
      label: "Sample Select",
      options: ["Sample Option 1", "Sample Option 2", "Sample Option 3"],
    },
    {
      id: "45002ecf-85cf-4852-bc46-529f94a758f5",
      type: "textarea",
      label: "Sample Textarea",
      placeholder: "Sample Placeholder",
    },
    {
      id: "680cff8d-c7f9-40be-8767-e3d6ba420952",
      type: "checkbox",
      label: "Sample Checkbox",
    },
  ];
  
  document.addEventListener("DOMContentLoaded", () => {
    const formContainer = document.querySelector(".form");
    const buttons = document.querySelectorAll(".components-items");
    const saveButton = document.querySelector(".btn");

    // Initialize drag and drop
    initializeDragAndDrop();

    buttons.forEach((button, index) => {
        button.addEventListener("click", () => {
            addFormElement(data[index]);
        });
    });

    saveButton.addEventListener("click", saveForm);

    function initializeDragAndDrop() {
        formContainer.addEventListener("dragover", (e) => {
            e.preventDefault();
            const draggingElement = document.querySelector(".dragging");
            const closestElement = getClosestElement(formContainer, e.clientY);

            if (closestElement) {
                formContainer.insertBefore(draggingElement, closestElement);
            } else {
                formContainer.appendChild(draggingElement);
            }
        });
    }

    function getClosestElement(container, y) {
        const draggableElements = [...container.querySelectorAll(".form-group:not(.dragging)")];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                return { offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function addFormElement(field) {
        const formGroup = document.createElement("div");
        formGroup.classList.add("form-group");
        formGroup.draggable = true;
        formGroup.dataset.id = field.id;
        formGroup.dataset.type = field.type;

        // Add drag handlers
        formGroup.addEventListener("dragstart", () => {
            formGroup.classList.add("dragging");
        });
        formGroup.addEventListener("dragend", () => {
            formGroup.classList.remove("dragging");
        });

        const label = document.createElement("label");
        label.textContent = field.label;
        label.classList.add("form-label");
        formGroup.appendChild(label);

        let inputElement;
        if (field.type === "input") {
            inputElement = document.createElement("input");
            inputElement.type = "text";
            inputElement.placeholder = field.placeholder;
        } else if (field.type === "select") {
            inputElement = document.createElement("select");
            field.options.forEach((optionText) => {
                const option = document.createElement("option");
                option.textContent = optionText;
                inputElement.appendChild(option);
            });
        } else if (field.type === "textarea") {
            inputElement = document.createElement("textarea");
            inputElement.placeholder = field.placeholder;
        } else if (field.type === "checkbox") {
            inputElement = document.createElement("input");
            inputElement.type = "checkbox";
        }

        inputElement.classList.add("form-control");
        formGroup.appendChild(inputElement);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");
        deleteButton.addEventListener("click", () => {
            formGroup.remove();
        });

        formGroup.appendChild(deleteButton);
        formContainer.appendChild(formGroup);
    }

    function saveForm() {
        const formData = [];
        const formGroups = formContainer.querySelectorAll(".form-group");

        formGroups.forEach((group) => {
            const fieldData = {
                id: group.dataset.id,
                type: group.dataset.type,
                label: group.querySelector("label").textContent,
            };

            const input = group.querySelector(".form-control");
            if (input.placeholder) {
                fieldData.placeholder = input.placeholder;
            }

            if (fieldData.type === "select") {
                fieldData.options = [...input.options].map(option => option.textContent);
            }

            formData.push(fieldData);
        });

        console.log("Saved Form Data:", formData);
        return formData;
    }
});