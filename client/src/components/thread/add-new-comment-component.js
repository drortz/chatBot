import { html, LitElement } from "lit";

export class AddNewCommentComponent extends LitElement {

    static properties = {
        subjectIndex: { type: Number },
    };

    createRenderRoot() {
        return this;
    }

    onCancelButtonClick() {
        this.querySelector('#commentTextArea').value = "";
        this.updatePostButtonState();
    }

    onPostButtonClick() {
        const commentTextArea = this.querySelector('#commentTextArea');
        const comment = commentTextArea.value;

        this.dispatchEvent(new CustomEvent('new-thread-comment', {
            detail: {
                comment: comment,
                subjectIndex: this.subjectIndex
            }
        }));

        commentTextArea.value = "";
        this.updatePostButtonState();

        const toastLiveExample = this.querySelector('#commentToast');
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
        toastBootstrap.show();
    }

    updatePostButtonState() {
        const commentTextArea = this.querySelector('#commentTextArea');
        const postButton = this.querySelector('.btn-success');
        postButton.disabled = commentTextArea.value.trim() === "";
    }

    render() {
        return html`
            <p class="d-inline-flex gap-1">
                <button class="btn btn-outline-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                    <div class="container">
                        <span class="material-symbols-outlined">comment</span>
                        Add a comment
                    </div>
                </button>
            </p>
            <div class="collapse" id="collapseExample">
                <div class="card">
                    <div class="card-body">
                        <textarea id='commentTextArea' class="form-control" aria-label="With textarea" placeholder="Write your comment here..." @input="${this.updatePostButtonState}"></textarea>
                    </div>
                    <div class="card-footer">
                        <button type="button" class="btn btn-secondary" data-bs-toggle="collapse" 
                                data-bs-target="#collapseExample" aria-controls="collapseExample"
                                @click="${this.onCancelButtonClick}">Cancel</button>
                        <button type="button" class="btn btn-success" @click="${this.onPostButtonClick}" disabled>Post</button>
                    </div>
                </div>
            </div>

            <div class="toast-container position-fixed bottom-0 end-0 p-3">
                <div id="commentToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header">
                        <strong class="me-auto">Comment Confirmation</strong>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        new comment has been added successfully !
                    </div>
                </div>
            </div>
        `;
    }
}

window.customElements.define('add-new-comment-component', AddNewCommentComponent);
