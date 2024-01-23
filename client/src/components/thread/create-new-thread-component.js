import {html, LitElement} from "lit";

export class CreateNewThreadComponent extends LitElement {

    static properties = {
        subject: {type: String},
    };

    constructor() {
        super();
        this.subject = '';
    }

    createRenderRoot() {
        return this;
    }

    onButtonSaveClick() {
        this.subject = document.getElementById("subjectTextArea").value;

        this.dispatchEvent(new CustomEvent('new-thread-subject', {
            detail: {
                subject: this.subject,
                threadComments: []
            }
        }));
    }

    onButtonCloseClick() {
        document.getElementById("subjectTextArea").value = '';
    }

    onTextAreaInput() {
        const subjectTextArea = document.getElementById("subjectTextArea");
        this.subject = subjectTextArea.value;
        this.requestUpdate(); // Manually trigger a re-render
    }

    render() {
        const isSaveButtonDisabled = this.subject.trim() === '';

        return html`
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            <span class="material-symbols-outlined">library_add</span>
            Add new thread
        </button>

        <!-- Modal -->
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Add New Thread</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col">
                                    <div class="input-group mb-3">
                                        <span class="input-group-text" id="inputGroup-sizing-default">Thread Question</span>
                                        <textarea id="subjectTextArea" class="form-control" aria-label="With textarea" @input="${this.onTextAreaInput}"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button @click="${this.onButtonCloseClick}" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button @click="${this.onButtonSaveClick}" type="button" class="btn btn-success" data-bs-dismiss="modal" ?disabled="${isSaveButtonDisabled}">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
}

window.customElements.define('create-new-thread-component', CreateNewThreadComponent);
